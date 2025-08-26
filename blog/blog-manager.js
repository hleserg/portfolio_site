// Менеджер блога для отдельной страницы
class BlogPageManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6; // Больше статей на отдельной странице
        this.totalPages = 1;
        this.currentCategory = 'all';
        this.currentSearch = '';
    }

    async init() {
        console.log('🚀 Инициализация страницы блога...');
        this.loadArticles();
        this.filterArticles();
        this.renderBlog();
        this.setupEventListeners();
        this.updateStats();
    }

    // Список статей (добавляйте новые сюда)
    loadArticles() {
        this.articles = [
            {
                title: 'Топ-5 способов интеграции 1С: от REST API до прямого доступа к БД',
                date: new Date(2025, 7, 24), // 24 августа 2025 (месяцы с 0)
                slug: 'top-5-sposobov-integracii-1c',
                excerpt: 'Подробное сравнение методов интеграции 1С с внешними системами. REST API, SOAP, файловый обмен, COM-соединения и прямой доступ к БД — выбираем оптимальный способ для каждой задачи.',
                readTime: '25 мин',
                tags: ['1С интеграция', 'REST API', 'SOAP', 'COM соединения', 'Базы данных'],
                category: 'integration',
                featured: true
            },
            // Заглушки для будущих статей в стиле блока "Код"
            {
                title: 'Новая статья в разработке',
                date: new Date(2025, 8, 6),
                slug: '#',
                excerpt: 'Следите за обновлениями! Скоро здесь появится новая полезная статья о разработке на платформе 1С.',
                readTime: '~ мин',
                tags: ['Скоро', '1С', 'Разработка'],
                category: 'integration',
                isPlaceholder: true
            },
            {
                title: 'Новая статья в разработке',
                date: new Date(2025, 8, 20),
                slug: '#',
                excerpt: 'Следите за обновлениями! Скоро здесь появится новая полезная статья о разработке на платформе 1С.',
                readTime: '~ мин',
                tags: ['Скоро', '1С', 'Мобильные приложения'],
                category: 'mobile',
                isPlaceholder: true
            },
            {
                title: 'Новая статья в разработке',
                date: new Date(2025, 9, 4),
                slug: '#',
                excerpt: 'Следите за обновлениями! Скоро здесь появится новая полезная статья о разработке на платформе 1С.',
                readTime: '~ мин',
                tags: ['Скоро', '1С', 'Автоматизация'],
                category: 'automation',
                isPlaceholder: true
            },
            {
                title: 'Новая статья в разработке',
                date: new Date(2025, 9, 18),
                slug: '#',
                excerpt: 'Следите за обновлениями! Скоро здесь появится новая полезная статья о разработке на платформе 1С.',
                readTime: '~ мин',
                tags: ['Скоро', '1С', 'Аналитика'],
                category: 'analytics',
                isPlaceholder: true
            },
            {
                title: 'Новая статья в разработке',
                date: new Date(2025, 10, 1),
                slug: '#',
                excerpt: 'Следите за обновлениями! Скоро здесь появится новая полезная статья о разработке на платформе 1С.',
                readTime: '~ мин',
                tags: ['Скоро', '1С', 'Автоматизация'],
                category: 'automation',
                isPlaceholder: true
            }
        ];

        // Сортируем: сначала реальные статьи (по убыванию даты), потом заглушки (по возрастанию даты)
        this.articles.sort((a, b) => {
            // Если одна статья - заглушка, а другая - нет
            if (a.isPlaceholder && !b.isPlaceholder) return 1;  // заглушка идет после реальной
            if (!a.isPlaceholder && b.isPlaceholder) return -1; // реальная идет перед заглушкой
            
            // Если обе статьи одного типа (реальные или заглушки)
            if (!a.isPlaceholder && !b.isPlaceholder) {
                // Реальные статьи сортируем по убыванию даты (новые сначала)
                return b.date - a.date;
            } else {
                // Заглушки сортируем по возрастанию даты
                return a.date - b.date;
            }
        });
        
        console.log(`📚 Загружено статей: ${this.articles.length}`);
    }

    // Фильтрация статей
    filterArticles() {
        this.filteredArticles = this.articles.filter(article => {
            // Фильтр по категории
            const categoryMatch = this.currentCategory === 'all' || article.category === this.currentCategory;
            
            // Фильтр по поиску
            const searchMatch = this.currentSearch === '' || 
                article.title.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.currentSearch.toLowerCase()));
            
            return categoryMatch && searchMatch;
        });

        // Рассчитываем пагинацию
        this.totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        this.currentPage = 1; // Сброс на первую страницу при фильтрации
    }

    // Отображение блога
    renderBlog() {
        const blogContainer = document.querySelector('.blog__articles');
        if (!blogContainer) return;

        // Получаем статьи для текущей страницы
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const currentArticles = this.filteredArticles.slice(startIndex, endIndex);

        if (currentArticles.length === 0) {
            blogContainer.innerHTML = this.renderEmptyState();
        } else {
            const articlesHTML = currentArticles.map(article => this.renderArticleCard(article)).join('');
            blogContainer.innerHTML = articlesHTML;
        }

        // Обновляем пагинацию
        this.renderPagination();
    }

    // Отображение карточки статьи
    renderArticleCard(article) {
        const formattedDate = this.formatDate(article.date, article.isPlaceholder);
        const tagsHTML = article.tags.map(tag => `<span class="blog-card__tag">${tag}</span>`).join('');
        
        const cardClass = article.isPlaceholder ? 'blog-card blog-card--placeholder' : 'blog-card';
        const linkHref = article.isPlaceholder ? '#' : `${article.slug}/`;
        const linkClass = article.isPlaceholder ? 'blog-card__placeholder-text' : 'blog-card__title-link';
        const arrow = article.isPlaceholder ? '⏳' : '→';

        return `
            <article class="${cardClass}">
                <div class="blog-card__content">
                    <div class="blog-card__meta">
                        <time class="blog-card__date">${formattedDate}</time>
                        <span class="blog-card__read-time">${article.readTime}</span>
                    </div>
                    
                    <h3 class="blog-card__title">
                        ${article.isPlaceholder ? 
                            `<span class="${linkClass}">
                                ${article.title}
                                <span class="blog-card__arrow">${arrow}</span>
                            </span>` :
                            `<a href="${linkHref}" class="${linkClass}">
                                ${article.title}
                                <span class="blog-card__arrow">${arrow}</span>
                            </a>`
                        }
                    </h3>
                    
                    <p class="blog-card__excerpt">${article.excerpt}</p>
                    
                    <div class="blog-card__tags">
                        ${tagsHTML}
                    </div>
                </div>
            </article>
        `;
    }

    // Пустое состояние
    renderEmptyState() {
        return `
            <div class="blog__empty">
                <div class="blog__empty-icon">🔍</div>
                <h3>Статьи не найдены</h3>
                <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
            </div>
        `;
    }

    // Отображение пагинации
    renderPagination() {
        const paginationContainer = document.querySelector('.blog__pagination');
        if (!paginationContainer || this.totalPages <= 1) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        let paginationHTML = '';

        // Кнопка "Назад"
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="blog-pagination__btn" data-page="${this.currentPage - 1}">
                    ← Назад
                </button>
            `;
        }

        // Номера страниц
        for (let i = 1; i <= this.totalPages; i++) {
            const isActive = i === this.currentPage ? ' blog-pagination__btn--active' : '';
            paginationHTML += `
                <button class="blog-pagination__btn${isActive}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // Кнопка "Вперед"
        if (this.currentPage < this.totalPages) {
            paginationHTML += `
                <button class="blog-pagination__btn" data-page="${this.currentPage + 1}">
                    Вперед →
                </button>
            `;
        }

        paginationContainer.innerHTML = `
            <div class="blog-pagination">
                ${paginationHTML}
            </div>
        `;

        // Добавляем обработчики событий для пагинации
        paginationContainer.querySelectorAll('.blog-pagination__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderBlog();
                    
                    // Прокручиваем к началу статей
                    document.querySelector('.blog-main').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            });
        });
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Фильтр по категориям
        const categoryButtons = document.querySelectorAll('.blog-category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Убираем активный класс у всех кнопок
                categoryButtons.forEach(b => b.classList.remove('blog-category-btn--active'));
                
                // Добавляем активный класс к нажатой кнопке
                e.target.classList.add('blog-category-btn--active');
                
                // Обновляем фильтр
                this.currentCategory = e.target.dataset.category;
                this.filterArticles();
                this.renderBlog();
            });
        });

        // Поиск
        const searchInput = document.getElementById('blogSearch');
        const searchBtn = document.querySelector('.blog-search__btn');
        
        const performSearch = () => {
            this.currentSearch = searchInput.value.trim();
            this.filterArticles();
            this.renderBlog();
        };

        searchInput.addEventListener('input', performSearch);
        searchBtn.addEventListener('click', performSearch);
        
        // Поиск по Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Обновление статистики
    updateStats() {
        const articlesCountElement = document.getElementById('articlesCount');
        if (articlesCountElement) {
            const realArticlesCount = this.articles.filter(article => !article.isPlaceholder).length;
            articlesCountElement.textContent = realArticlesCount;
        }
    }

    // Форматирование даты
    formatDate(date, isPlaceholder = false) {
        const now = new Date();
        const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
        
        if (isPlaceholder) {
            // Для заглушек показываем "ориентировочно через X дней"
            if (diffDays <= 0) {
                return 'Скоро';
            } else if (diffDays === 1) {
                return 'ориентировочно завтра';
            } else if (diffDays < 7) {
                return `ориентировочно через ${diffDays} дня`;
            } else if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                return `ориентировочно через ${weeks} ${weeks === 1 ? 'неделю' : 'недели'}`;
            } else {
                const months = Math.floor(diffDays / 30);
                return `ориентировочно через ${months} ${months === 1 ? 'месяц' : 'месяца'}`;
            }
        } else {
            // Для реальных статей показываем обычное форматирование
            const pastDiffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            
            if (pastDiffDays === 0) {
                return 'Сегодня';
            } else if (pastDiffDays === 1) {
                return 'Вчера';
            } else if (pastDiffDays < 7) {
                return `${pastDiffDays} дня назад`;
            } else {
                return date.toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }
    }

    // Добавление новой статьи (для будущего использования)
    addArticle(article) {
        this.articles.unshift(article); // Добавляем в начало массива
        this.articles.sort((a, b) => b.date - a.date); // Пересортировываем
        this.filterArticles();
        this.renderBlog();
        this.updateStats();
        console.log(`✅ Добавлена новая статья: ${article.title}`);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new BlogPageManager();
    blogManager.init();
    
    // Делаем менеджер глобально доступным для добавления статей
    window.blogPageManager = blogManager;
});
