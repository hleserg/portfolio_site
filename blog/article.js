document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Статья загружена...');

    // Theme management для статей - упрощенная версия без конфликтов
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        console.log('🎨 article.js: Проверка синхронизации темы...');
        
        // Функция для синхронизации иконки (не вмешиваемся в основную логику)
        function syncThemeIcon() {
            const icon = themeToggle.querySelector('.theme-toggle__icon');
            if (icon) {
                const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 
                                   document.body.getAttribute('data-theme') || 'light';
                const correctIcon = currentTheme === 'dark' ? '☀️' : '🌙';
                
                if (icon.textContent !== correctIcon) {
                    console.log('🎨 article.js: Синхронизация иконки:', currentTheme, '->', correctIcon);
                    icon.textContent = correctIcon;
                }
            }
        }
        
        // Проверяем синхронизацию при загрузке
        setTimeout(syncThemeIcon, 100);
        
        // Только слушаем изменения для синхронизации (не создаем конфликты)
        const observer = new MutationObserver(function() {
            setTimeout(syncThemeIcon, 10);
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-color-scheme']
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        console.log('🎨 article.js: Наблюдатель синхронизации установлен');
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

    // Функция для улучшения читабельности кода и добавления кнопки копирования
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(codeBlock) {
            const preElement = codeBlock.parentElement;
            
            // Добавляем номера строк для больших блоков кода
            const lines = codeBlock.textContent.split('\n');
            if (lines.length > 5) {
                codeBlock.classList.add('with-line-numbers');
            }
            
            // Добавляем кнопку копирования
            if (!preElement.querySelector('.code-copy-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'code-copy-btn';
                copyBtn.innerHTML = '📋';
                copyBtn.setAttribute('aria-label', 'Скопировать код');
                copyBtn.setAttribute('title', 'Скопировать в буфер обмена');
                
                // Обработчик клика
                copyBtn.addEventListener('click', async function() {
                    try {
                        await navigator.clipboard.writeText(codeBlock.textContent);
                        
                        // Показываем успешное копирование
                        copyBtn.innerHTML = '✅';
                        copyBtn.classList.add('copied');
                        
                        // Возвращаем исходное состояние через 2 секунды
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋';
                            copyBtn.classList.remove('copied');
                        }, 2000);
                        
                    } catch (err) {
                        console.error('Ошибка копирования: ', err);
                        
                        // Fallback для старых браузеров
                        const textArea = document.createElement('textarea');
                        textArea.value = codeBlock.textContent;
                        document.body.appendChild(textArea);
                        textArea.select();
                        
                        try {
                            document.execCommand('copy');
                            copyBtn.innerHTML = '✅';
                            copyBtn.classList.add('copied');
                            
                            setTimeout(() => {
                                copyBtn.innerHTML = '📋';
                                copyBtn.classList.remove('copied');
                            }, 2000);
                        } catch (fallbackErr) {
                            console.error('Fallback копирование также не работает: ', fallbackErr);
                        }
                        
                        document.body.removeChild(textArea);
                    }
                });
                
                preElement.appendChild(copyBtn);
            }
        });
    }

    // Применяем улучшения
    enhanceCodeBlocks();
});
