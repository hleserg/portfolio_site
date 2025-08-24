document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Статья загружена...');

    // Theme management для статей
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Получаем сохранённую тему или определяем системную
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Применяем тему
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        // Обработчик переключения темы
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
        
        // Обновление иконки темы
        function updateThemeIcon(theme) {
            const icon = themeToggle.querySelector('.theme-toggle__icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }
    }

    // Функциональность кнопки "Наверх"
    function initScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        if (!scrollToTopBtn) return;

        // Показываем/скрываем кнопку в зависимости от позиции прокрутки
        function toggleScrollButton() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Плавная прокрутка наверх
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Обработчики событий
        window.addEventListener('scroll', toggleScrollButton);
        scrollToTopBtn.addEventListener('click', scrollToTop);

        // Проверяем при загрузке страницы
        toggleScrollButton();
    }

    // Инициализируем кнопку "Наверх"
    initScrollToTop();

    // Функция для улучшения читабельности кода
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(codeBlock) {
            // Добавляем номера строк для больших блоков кода
            const lines = codeBlock.textContent.split('\n');
            if (lines.length > 5) {
                codeBlock.classList.add('with-line-numbers');
            }
        });
    }

    // Применяем улучшения
    enhanceCodeBlocks();
});
