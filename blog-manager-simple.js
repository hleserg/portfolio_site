// Упрощенный менеджер блога для продакшена
class SimpleBlogManager {
    constructor() {
        this.articles = [];
        this.currentPage = 1;
        this.articlesPerPage = 3;
        this.totalPages = 1;
    }

    async init() {
        console.log('🚀 Инициализация блога...');
        this.loadArticles();
        this.renderBlog();
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
                tags: ['1С интеграция', 'REST API', 'SOAP', 'COM соединения', 'Базы данных']
            }
        ];

        // Сортируем по дате (новые сначала)
        this.articles.sort((a, b) => b.date - a.date);
        
        // Рассчитываем пагинацию
        this.totalPages = Math.ceil(this.articles.length / this.articlesPerPage);
        
        console.log(`📚 Загружено статей: ${this.articles.length}`);
    }

    // Отображение блога
    renderBlog() {
        const blogContainer = document.querySelector('.blog__articles');
        if (!blogContainer) return;

        // Получаем статьи для текущей страницы
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const currentArticles = this.articles.slice(startIndex, endIndex);

        // Добавляем заглушки для будущих статей (всего показываем 3 карточки)
        const placeholdersNeeded = 3 - currentArticles.length;
        const placeholders = Array(placeholdersNeeded).fill(null);

        // Генерируем HTML для статей и заглушек
        const articlesHTML = currentArticles.map(article => this.renderArticleCard(article)).join('');
        const placeholdersHTML = placeholders.map(() => this.renderPlaceholderCard()).join('');
        
        blogContainer.innerHTML = articlesHTML + placeholdersHTML;

        // Обновляем пагинацию
        this.renderPagination();
    }

    // Отображение карточки статьи
    renderArticleCard(article) {
        const formattedDate = this.formatDate(article.date);
        const tagsHTML = article.tags.map(tag => `<span class="blog-card__tag">${tag}</span>`).join('');

        return `
            <article class="blog-card">
                <div class="blog-card__content">
                    <div class="blog-card__meta">
                        <time class="blog-card__date">${formattedDate}</time>
                        <span class="blog-card__read-time">${article.readTime}</span>
                    </div>
                    
                    <h3 class="blog-card__title">
                        <a href="/blog/${article.slug}/" class="blog-card__title-link">
                            ${article.title}
                            <span class="blog-card__arrow">→</span>
                        </a>
                    </h3>
                    
                    <p class="blog-card__excerpt">${article.excerpt}</p>
                    
                    <div class="blog-card__tags">
                        ${tagsHTML}
                    </div>
                </div>
            </article>
        `;
    }

    // Карточка-заглушка для будущих статей
    renderPlaceholderCard() {
        return `
            <article class="blog-card blog-card--placeholder">
                <div class="blog-card__content">
                    <div class="blog-card__meta">
                        <time class="blog-card__date">Скоро</time>
                        <span class="blog-card__read-time">~ мин</span>
                    </div>
                    
                    <h3 class="blog-card__title">
                        <span class="blog-card__placeholder-text">
                            Новая статья в разработке
                            <span class="blog-card__arrow">⏳</span>
                        </span>
                    </h3>
                    
                    <p class="blog-card__excerpt">Следите за обновлениями! Скоро здесь появится новая полезная статья о разработке на платформе 1С.</p>
                    
                    <div class="blog-card__tags">
                        <span class="blog-card__tag">Скоро</span>
                        <span class="blog-card__tag">1С</span>
                    </div>
                </div>
            </article>
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

        // Добавляем обработчики событий
        paginationContainer.querySelectorAll('.blog-pagination__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderBlog();
                    
                    // Прокручиваем к началу блога
                    document.querySelector('#blog').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            });
        });
    }

    // Форматирование даты
    formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Добавление новой статьи (для будущего использования)
    addArticle(article) {
        this.articles.unshift(article); // Добавляем в начало массива
        this.articles.sort((a, b) => b.date - a.date); // Пересортировываем
        this.totalPages = Math.ceil(this.articles.length / this.articlesPerPage);
        this.renderBlog();
        console.log(`✅ Добавлена новая статья: ${article.title}`);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new SimpleBlogManager();
    blogManager.init();
    
    // Делаем менеджер глобально доступным для добавления статей
    window.blogManager = blogManager;
});
