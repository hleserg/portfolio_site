// Модуль для работы с блогом
class BlogManager {
    constructor() {
        this.articles = [];
        this.currentDate = new Date();
        this.articlesPerPage = 3;
        this.currentPage = 1;
        this.totalPages = 1;
        this.baseUrl = './blog/'; // Базовый URL для ссылок на статьи
    }

    // Загрузка списка статей
    async loadArticles() {
        try {
            console.log('🔄 Загрузка статей блога...');
            
            // Проверяем, работает ли сервер
            const isServer = window.location.protocol !== 'file:';
            console.log(`📡 Протокол: ${window.location.protocol}, Сервер: ${isServer}`);
            
            if (!isServer) {
                console.warn('⚠️ Блог работает только с HTTP сервером. Используйте Live Server!');
                // Показываем инструкцию вместо ошибки
                this.showServerInstructions();
                return [];
            }

            // В реальном проекте здесь был бы запрос к серверу
            // Для демонстрации используем статический список
            const articleFiles = [
                '2025090110-Автоматизация бизнес-процессов с помощью Telegram Bot и 1С.md',
                '2025082015-Интеграция 1С с ФГИС Меркурий полное руководство.md',
                '2025081512-Разработка мобильных приложений для ТСД на платформе 1С.md',
                '2025081008-10 лучших практик разработки на платформе 1С.md',
                '2025080514-Создание REST API в 1С Пошаговое руководство.md',
                '2025080110-Оптимизация производительности запросов в 1С.md',
                '2025072516-Внедрение системы электронного документооборота на 1С.md'
            ];

            this.articles = [];

            for (const fileName of articleFiles) {
                console.log(`📄 Обрабатываем файл: ${fileName}`);
                const article = await this.parseArticleFileName(fileName);
                if (article && this.isArticlePublished(article.date)) {
                    console.log(`✅ Статья опубликована: ${article.title}`);
                    try {
                        const content = await this.loadArticleContent(fileName);
                        article.content = content;
                        this.articles.push(article);
                    } catch (error) {
                        console.error(`❌ Ошибка загрузки содержимого ${fileName}:`, error);
                        // Добавляем статью с заглушкой вместо пропуска
                        article.content = this.createDemoContent(article.title);
                        this.articles.push(article);
                    }
                } else if (article) {
                    console.log(`⏰ Статья в будущем: ${article.title} (${article.date})`);
                }
            }

            // Сортируем по убыванию даты
            this.articles.sort((a, b) => b.date - a.date);
            this.calculatePagination();
            
            console.log(`📚 Загружено статей: ${this.articles.length}`);
            return this.articles;
        } catch (error) {
            console.error('❌ Ошибка загрузки статей:', error);
            this.showErrorMessage('Ошибка загрузки статей. Проверьте консоль для деталей.');
            return [];
        }
    }

    // Парсинг имени файла статьи
    parseArticleFileName(fileName) {
        // Формат: ггггММддччмм-Заголовок поста.md
        const match = fileName.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})-(.+)\.md$/);
        
        if (!match) {
            console.warn(`Неверный формат имени файла: ${fileName}`);
            return null;
        }

        const [, year, month, day, hour, minute, title] = match;
        const date = new Date(
            parseInt(year),
            parseInt(month) - 1, // месяцы в JS начинаются с 0
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
        );

        return {
            fileName,
            date,
            title: title.replace(/[-_]/g, ' '),
            slug: this.generateSlug(title.replace(/[-_]/g, ' '))
        };
    }

    // Проверка, опубликована ли статья
    isArticlePublished(articleDate) {
        return articleDate <= this.currentDate;
    }

    // Генерация slug для URL
    generateSlug(title) {
        console.log(`🔍 Генерируем slug для заголовка: "${title}"`);
        
        // Соответствие заголовков созданным slug-адресам
        const titleToSlug = {
            'Автоматизация бизнес процессов с помощью Telegram Bot и 1С': 'avtomatizatsiya-biznes-protsessov-telegram-bot-1c',
            'Интеграция 1С с ФГИС Меркурий полное руководство': 'integratsiya-1c-fgis-merkuriy',
            'Разработка мобильных приложений для ТСД на платформе 1С': 'mobilnye-prilozheniya-tsd-1c',
            '10 лучших практик разработки на платформе 1С': '10-luchshih-praktik-razrabotki-1c',
            'Создание REST API в 1С Пошаговое руководство': 'sozdanie-rest-api-1c',
            'Оптимизация производительности запросов в 1С': 'optimizatsiya-zaprosov-1c',
            'Внедрение системы электронного документооборота на 1С': 'vnedrenie-edo-1c'
        };

        // Проверяем точное соответствие
        if (titleToSlug[title]) {
            console.log(`✅ Найдено соответствие: ${titleToSlug[title]}`);
            return titleToSlug[title];
        }
        
        // Проверяем соответствие без учета лишних пробелов
        const normalizedTitle = title.replace(/\s+/g, ' ').trim();
        if (titleToSlug[normalizedTitle]) {
            console.log(`✅ Найдено соответствие (нормализованное): ${titleToSlug[normalizedTitle]}`);
            return titleToSlug[normalizedTitle];
        }

        console.log(`⚠️ Соответствие не найдено, генерируем автоматически`);
        console.log(`📝 Доступные ключи:`, Object.keys(titleToSlug));
        
        // Автоматическая генерация если нет точного соответствия
        let autoSlug = title
            .toLowerCase()
            .replace(/1с/g, '1c') // Заменяем "1с" на "1c"
            .replace(/[^а-яёa-z0-9\s-]/g, '') // Оставляем только буквы, цифры, пробелы и тире
            .replace(/\s+/g, '-') // Заменяем пробелы на тире
            .replace(/-+/g, '-') // Убираем повторяющиеся тире
            .replace(/^-+|-+$/g, '') // Убираем тире в начале и конце
            .trim();
            
        console.log(`🔄 Автоматически сгенерированный slug: ${autoSlug}`);
        return autoSlug;
    }

    // Загрузка содержимого статьи
    async loadArticleContent(fileName) {
        try {
            const response = await fetch(`blog/articles/${fileName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            return this.parseMarkdown(content);
        } catch (error) {
            console.error(`Ошибка загрузки статьи ${fileName}:`, error);
            return {
                title: 'Ошибка загрузки',
                content: 'Не удалось загрузить содержимое статьи',
                excerpt: 'Ошибка загрузки',
                readTime: '0 мин',
                tags: []
            };
        }
    }

    // Простой парсер Markdown
    parseMarkdown(markdownText) {
        const lines = markdownText.split('\n');
        let title = '';
        let author = '';
        let readTime = '';
        let publishDate = '';
        let tags = [];
        let contentLines = [];
        let inCodeBlock = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Заголовок статьи
            if (line.startsWith('# ') && !title) {
                title = line.replace('# ', '');
                continue;
            }

            // Метаданные
            if (line.includes('**Дата публикации:**')) {
                publishDate = line.replace('**Дата публикации:**', '').trim();
                continue;
            }
            if (line.includes('**Автор:**')) {
                author = line.replace('**Автор:**', '').trim();
                continue;
            }
            if (line.includes('**Время чтения:**')) {
                readTime = line.replace('**Время чтения:**', '').trim();
                continue;
            }

            // Теги в конце статьи
            if (line.includes('**Теги:**')) {
                const tagsText = line.replace('**Теги:**', '').trim();
                tags = tagsText.split('#').filter(tag => tag.trim()).map(tag => tag.trim());
                continue;
            }

            // Содержимое статьи
            if (line.trim() !== '' || inCodeBlock) {
                contentLines.push(line);
            }

            // Отслеживание блоков кода
            if (line.includes('```')) {
                inCodeBlock = !inCodeBlock;
            }
        }

        const content = this.convertMarkdownToHtml(contentLines.join('\n'));
        const excerpt = this.generateExcerpt(contentLines.join(' '));

        return {
            title,
            author,
            publishDate,
            readTime,
            content,
            excerpt,
            tags
        };
    }

    // Генерация краткого описания
    generateExcerpt(text, maxLength = 200) {
        // Удаляем markdown разметку
        const plainText = text
            .replace(/#{1,6}\s/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/```[\s\S]*?```/g, '')
            .trim();

        if (plainText.length <= maxLength) {
            return plainText;
        }

        return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
    }

    // Упрощенная конвертация Markdown в HTML
    convertMarkdownToHtml(markdown) {
        let html = markdown;

        // Заголовки
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // Жирный текст
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Курсив
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Код
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');

        // Блоки кода
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

        // Списки
        html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Параграфы
        html = html.replace(/^(?!<[uo]l>|<h[1-6]>|<pre>)(.*$)/gm, '<p>$1</p>');

        // Удаляем пустые параграфы
        html = html.replace(/<p><\/p>/g, '');

        return html;
    }

    // Расчет пагинации
    calculatePagination() {
        this.totalPages = Math.ceil(this.articles.length / this.articlesPerPage);
    }

    // Получение статей для текущей страницы
    getArticlesForPage(page = 1) {
        this.currentPage = page;
        const startIndex = (page - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        return this.articles.slice(startIndex, endIndex);
    }

    // Рендеринг блога
    renderBlog() {
        const blogContainer = document.getElementById('blog-articles');
        if (!blogContainer) return;

        const articles = this.getArticlesForPage(this.currentPage);
        
        if (articles.length === 0) {
            blogContainer.innerHTML = '<p class="blog__empty">Статьи пока не опубликованы.</p>';
            return;
        }

        let html = '';
        articles.forEach(article => {
            html += this.renderArticleCard(article);
        });

        blogContainer.innerHTML = html;
        this.renderPagination();
    }

    // Рендеринг карточки статьи
    renderArticleCard(article) {
        const tagsHtml = article.content.tags.map(tag => 
            `<span class="blog-card__tag">${tag}</span>`
        ).join('');

        const articleUrl = `${this.baseUrl}${article.slug}/`;

        return `
            <article class="blog-card">
                <header class="blog-card__header">
                    <h3 class="blog-card__title">
                        <a href="${articleUrl}" class="blog-card__title-link">${article.content.title}</a>
                    </h3>
                    <div class="blog-card__meta">
                        <span class="blog-card__date">${this.formatDate(article.date)}</span>
                        <span class="blog-card__read-time">${article.content.readTime}</span>
                    </div>
                </header>
                <div class="blog-card__content">
                    <p class="blog-card__excerpt">${article.content.excerpt}</p>
                    <div class="blog-card__tags">${tagsHtml}</div>
                </div>
                <footer class="blog-card__footer">
                    <a href="${articleUrl}" class="blog-card__read-more">
                        Читать статью
                        <span class="blog-card__arrow">→</span>
                    </a>
                </footer>
            </article>
        `;
    }

    // Рендеринг пагинации
    renderPagination() {
        const paginationContainer = document.getElementById('blog-pagination');
        if (!paginationContainer || this.totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '<div class="blog-pagination">';

        // Предыдущая страница
        if (this.currentPage > 1) {
            html += `<button class="blog-pagination__btn" onclick="blogManager.goToPage(${this.currentPage - 1})">‹ Назад</button>`;
        }

        // Номера страниц
        for (let i = 1; i <= this.totalPages; i++) {
            const activeClass = i === this.currentPage ? ' blog-pagination__btn--active' : '';
            html += `<button class="blog-pagination__btn${activeClass}" onclick="blogManager.goToPage(${i})">${i}</button>`;
        }

        // Следующая страница
        if (this.currentPage < this.totalPages) {
            html += `<button class="blog-pagination__btn" onclick="blogManager.goToPage(${this.currentPage + 1})">Вперед ›</button>`;
        }

        html += '</div>';
        paginationContainer.innerHTML = html;
    }

    // Переход на страницу
    async goToPage(page) {
        this.currentPage = page;
        this.renderBlog();
        
        // Прокрутка к началу блога
        const blogSection = document.getElementById('blog');
        if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Создание демо-контента для статьи
    createDemoContent(title) {
        // Словарь демо-контента для разных статей
        const demoContentMap = {
            'Автоматизация бизнес процессов с помощью Telegram Bot и 1С': {
                title: 'Автоматизация бизнес-процессов с помощью Telegram Bot и 1С',
                excerpt: 'Узнайте, как создать Telegram-бота для автоматизации рабочих процессов и интегрировать его с системой 1С:Предприятие для повышения эффективности работы.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '15 минут',
                tags: ['Telegram Bot', '1С', 'Автоматизация', 'API'],
                content: `
                    <h2>Введение</h2>
                    <p>Автоматизация бизнес-процессов через Telegram Bot стала одним из самых эффективных способов повышения производительности современных компаний.</p>
                    <h2>Архитектура решения</h2>
                    <p>Наше решение состоит из следующих компонентов:</p>
                    <ul>
                        <li>Telegram Bot API для обработки сообщений</li>
                        <li>HTTP-сервис в 1С:Предприятие для обработки запросов</li>
                        <li>Система аутентификации и авторизации</li>
                        <li>Модуль логирования и мониторинга</li>
                    </ul>
                `
            },
            'Интеграция 1С с ФГИС Меркурий полное руководство': {
                title: 'Интеграция 1С с ФГИС Меркурий: полное руководство',
                excerpt: 'Пошаговое руководство по интеграции 1С:Предприятие с системой ФГИС Меркурий. Настройка соединения, обработка документов и решение типовых проблем.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '20 минут',
                tags: ['1С', 'ФГИС Меркурий', 'Интеграция', 'ВетИС'],
                content: `
                    <h2>Обзор системы ФГИС Меркурий</h2>
                    <p>ФГИС "Меркурий" - это федеральная государственная информационная система, обеспечивающая прослеживаемость ветеринарных препаратов на территории Российской Федерации.</p>
                    <h2>Требования к интеграции</h2>
                    <p>Для успешной интеграции необходимо:</p>
                    <ul>
                        <li>Получить сертификат ЭЦП для работы с системой</li>
                        <li>Настроить соединение с веб-сервисами ФГИС</li>
                        <li>Реализовать обработку XML-документов</li>
                        <li>Обеспечить синхронизацию справочников</li>
                    </ul>
                `
            },
            'Разработка мобильных приложений для ТСД на платформе 1С': {
                title: 'Разработка мобильных приложений для ТСД на платформе 1С',
                excerpt: 'Создание мобильных приложений для терминалов сбора данных (ТСД) с использованием платформы 1С:Предприятие. Практические примеры и архитектура.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '18 минут',
                tags: ['1С', 'ТСД', 'Мобильные приложения', 'Android'],
                content: `
                    <h2>Архитектура мобильного приложения</h2>
                    <p>При разработке мобильных приложений для ТСД важно учитывать специфику работы в складских условиях.</p>
                    <h2>Основные компоненты</h2>
                    <ul>
                        <li>Модуль сканирования штрихкодов</li>
                        <li>Синхронизация с базой данных 1С</li>
                        <li>Оффлайн-режим работы</li>
                        <li>Интуитивный интерфейс для складских работников</li>
                    </ul>
                `
            },
            '10 лучших практик разработки на платформе 1С': {
                title: '10 лучших практик разработки на платформе 1С',
                excerpt: 'Топ-10 лучших практик и рекомендаций для разработчиков 1С:Предприятие. Архитектура, производительность, безопасность и качество кода.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '12 минут',
                tags: ['1С', 'Best Practices', 'Архитектура', 'Производительность'],
                content: `
                    <h2>Структурирование кода</h2>
                    <p>Правильная организация кода - основа надежной системы.</p>
                    <h2>Основные принципы</h2>
                    <ul>
                        <li>Разделение бизнес-логики и интерфейса</li>
                        <li>Использование общих модулей</li>
                        <li>Документирование кода</li>
                        <li>Юнит-тестирование</li>
                    </ul>
                `
            },
            'Создание REST API в 1С Пошаговое руководство': {
                title: 'Создание REST API в 1С: пошаговое руководство',
                excerpt: 'Подробное руководство по созданию REST API в 1С:Предприятие. Настройка HTTP-сервисов, аутентификация, обработка ошибок и документирование.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '25 минут',
                tags: ['1С', 'REST API', 'HTTP-сервисы', 'Интеграция'],
                content: `
                    <h2>Основы REST API в 1С</h2>
                    <p>REST API в 1С:Предприятие позволяет создавать современные веб-сервисы для интеграции с внешними системами.</p>
                    <h2>Создание HTTP-сервиса</h2>
                    <p>Первый шаг - создание HTTP-сервиса в конфигураторе.</p>
                `
            },
            'Оптимизация производительности запросов в 1С': {
                title: 'Оптимизация производительности запросов в 1С',
                excerpt: 'Методы и техники оптимизации медленных запросов в 1С:Предприятие. Индексы, планы выполнения, виртуальные таблицы и практические советы.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '22 минута',
                tags: ['1С', 'Оптимизация', 'Запросы', 'Производительность'],
                content: `
                    <h2>Анализ производительности</h2>
                    <p>Первым шагом в оптимизации является выявление узких мест.</p>
                    <h2>Инструменты анализа</h2>
                    <ul>
                        <li>Консоль запросов</li>
                        <li>Анализ планов выполнения</li>
                        <li>Профилировщик производительности</li>
                        <li>Технический журнал</li>
                    </ul>
                `
            },
            'Внедрение системы электронного документооборота на 1С': {
                title: 'Внедрение системы электронного документооборота на 1С',
                excerpt: 'Комплексное руководство по внедрению ЭДО на базе 1С:Предприятие. Архитектура, безопасность, интеграция и лучшие практики.',
                author: 'Хлебников Сергей Юрьевич',
                readTime: '30 минут',
                tags: ['1С', 'ЭДО', 'Документооборот', 'Электронная подпись'],
                content: `
                    <h2>Основы ЭДО</h2>
                    <p>Электронный документооборот повышает эффективность бизнес-процессов.</p>
                    <h2>Ключевые компоненты</h2>
                    <ul>
                        <li>Система электронной подписи</li>
                        <li>Маршрутизация документов</li>
                        <li>Контроль версий</li>
                        <li>Архивирование и поиск</li>
                    </ul>
                `
            }
        };

        // Возвращаем демо-контент или заглушку
        return demoContentMap[title] || {
            title: title,
            excerpt: 'Краткое описание статьи будет доступно после загрузки полного содержимого.',
            author: 'Хлебников Сергей Юрьевич',
            readTime: '10 минут',
            tags: ['1С', 'Разработка'],
            content: '<p>Содержимое статьи загружается...</p>'
        };
    }

    // Показ инструкций для запуска сервера
    showServerInstructions() {
        const blogContainer = document.getElementById('blog-articles');
        if (!blogContainer) return;

        blogContainer.innerHTML = `
            <div class="blog__server-instructions">
                <div class="blog__server-icon">🚀</div>
                <h3>Блог требует HTTP сервер</h3>
                <p>Для работы блога необходимо запустить локальный сервер:</p>
                <div class="blog__instructions-list">
                    <div class="instruction-step">
                        <span class="step-number">1</span>
                        <span class="step-text">Щелкните правой кнопкой на <code>index.html</code></span>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">2</span>
                        <span class="step-text">Выберите <strong>"Open with Live Server"</strong></span>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">3</span>
                        <span class="step-text">Или используйте <kbd>Ctrl+Shift+P</kbd> → "Live Server: Open with Live Server"</span>
                    </div>
                </div>
                <button class="blog__demo-btn" onclick="blogManager.showDemoArticles()">
                    Показать демо-статьи
                </button>
            </div>
        `;
    }

    // Показ демо-статей без загрузки файлов
    showDemoArticles() {
        console.log('📝 Показываем демо-статьи...');
        
        this.articles = [
            {
                fileName: '2025082015-demo.md',
                date: new Date(2025, 7, 20, 15, 0), // 20 августа 2025, 15:00
                title: 'Интеграция 1С с ФГИС Меркурий полное руководство',
                slug: 'integraciya-1s-s-fgis-merkuriy',
                content: this.createDemoContent('Интеграция 1С с ФГИС Меркурий полное руководство')
            },
            {
                fileName: '2025081512-demo.md',
                date: new Date(2025, 7, 15, 12, 0), // 15 августа 2025, 12:00
                title: 'Разработка мобильных приложений для ТСД на платформе 1С',
                slug: 'razrabotka-mobilnyh-prilozhenij-dlya-tsd',
                content: this.createDemoContent('Разработка мобильных приложений для ТСД на платформе 1С')
            },
            {
                fileName: '2025081008-demo.md',
                date: new Date(2025, 7, 10, 8, 0), // 10 августа 2025, 08:00
                title: '10 лучших практик разработки на платформе 1С',
                slug: '10-luchshih-praktik-razrabotki',
                content: this.createDemoContent('10 лучших практик разработки на платформе 1С')
            },
            {
                fileName: '2025080514-demo.md',
                date: new Date(2025, 7, 5, 14, 30), // 5 августа 2025, 14:30
                title: 'Создание REST API в 1С: Пошаговое руководство',
                slug: 'sozdanie-rest-api-v-1s',
                content: this.createDemoContent('Создание REST API в 1С: Пошаговое руководство')
            },
            {
                fileName: '2025080110-demo.md',
                date: new Date(2025, 7, 1, 10, 0), // 1 августа 2025, 10:00
                title: 'Оптимизация производительности запросов в 1С',
                slug: 'optimizatsiya-proizvoditelnosti-zaprosov',
                content: this.createDemoContent('Оптимизация производительности запросов в 1С')
            },
            {
                fileName: '2025072516-demo.md',
                date: new Date(2025, 6, 25, 16, 45), // 25 июля 2025, 16:45
                title: 'Внедрение системы электронного документооборота на 1С',
                slug: 'vnedrenie-sistemy-elektronnogo-dokumentooborota',
                content: this.createDemoContent('Внедрение системы электронного документооборота на 1С')
            }
        ];

        this.calculatePagination();
        this.renderBlog();
    }

    // Создание демо-контента
    createDemoContent(title) {
        return {
            title: title,
            author: 'Сергей Хлебников',
            publishDate: this.formatDate(new Date()),
            readTime: '10-15 минут',
            content: `
                <h2>Демо-статья</h2>
                <p>Это демонстрационная статья блога. Для загрузки полного содержимого статей необходимо запустить HTTP сервер.</p>
                
                <h3>Как запустить полноценный блог:</h3>
                <ol>
                    <li>Установите расширение <strong>Live Server</strong> в VS Code</li>
                    <li>Щелкните правой кнопкой на файле <code>index.html</code></li>
                    <li>Выберите <strong>"Open with Live Server"</strong></li>
                    <li>Блог заработает с полным функционалом</li>
                </ol>
                
                <h3>Возможности блога:</h3>
                <ul>
                    <li>📝 Автоматическая загрузка статей из Markdown файлов</li>
                    <li>📅 Фильтрация по дате публикации</li>
                    <li>🏷️ Система тегов</li>
                    <li>📖 Модальные окна для чтения</li>
                    <li>📱 Адаптивный дизайн</li>
                </ul>
                
                <blockquote>
                    <p>Статьи создаются в формате Markdown в папке <code>blog/articles/</code> с именем файла в формате <code>ггггММддччмм-Заголовок.md</code></p>
                </blockquote>
            `,
            excerpt: 'Демонстрационная статья блога. Показывает как будет выглядеть полноценная статья после запуска HTTP сервера.',
            tags: ['Демо', 'Блог', 'Инструкция']
        };
    }

    // Показ сообщения об ошибке
    showErrorMessage(message) {
        const blogContainer = document.getElementById('blog-articles');
        if (!blogContainer) return;

        blogContainer.innerHTML = `
            <div class="blog__error">
                <div class="blog__error-icon">❌</div>
                <h3>Ошибка загрузки блога</h3>
                <p>${message}</p>
                <button class="blog__retry-btn" onclick="blogManager.init()">
                    Попробовать снова
                </button>
            </div>
        `;
    }

    // Форматирование даты
    formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Europe/Moscow'
        };
        return date.toLocaleDateString('ru-RU', options);
    }

    // Инициализация блога
    async init() {
        console.log('🚀 Инициализация блога...');
        
        try {
            await this.loadArticles();
            
            // Если статей нет, показываем демо или инструкции
            if (this.articles.length === 0) {
                const isServer = window.location.protocol !== 'file:';
                if (isServer) {
                    // На сервере, но нет статей - показываем сообщение
                    const blogContainer = document.getElementById('blog-articles');
                    if (blogContainer) {
                        blogContainer.innerHTML = `
                            <div class="blog__empty">
                                <div class="blog__empty-icon">📝</div>
                                <h3>Статьи скоро появятся</h3>
                                <p>Следите за обновлениями блога программиста 1С</p>
                                <button class="blog__demo-btn" onclick="blogManager.showDemoArticles()">
                                    Показать демо-статьи
                                </button>
                            </div>
                        `;
                    }
                } else {
                    // Без сервера - показываем инструкции
                    this.showServerInstructions();
                }
            } else {
                this.renderBlog();
            }
        } catch (error) {
            console.error('❌ Ошибка инициализации блога:', error);
            this.showErrorMessage('Ошибка инициализации блога');
        }
    }
}

// Глобальный экземпляр менеджера блога
const blogManager = new BlogManager();

// Автоинициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blog')) {
        blogManager.init();
    }
});
