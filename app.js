document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Сайт загружается...');
    
    // Функция для динамической настройки отступа под заголовок
    function adjustHeaderOffset() {
        console.log('⚙️ Настройка отступа заголовка...');
        const header = document.querySelector('.header');
        const hero = document.querySelector('.hero');
        
        if (header && hero) {
            const headerHeight = header.offsetHeight;
            // Добавляем дополнительный отступ для мобильных устройств
            const isMobile = window.innerWidth <= 768;
            const extraOffset = isMobile ? 59 : 30;
            const totalPadding = headerHeight + extraOffset;
            
            console.log(`📱 Mobile: ${isMobile}, Header: ${headerHeight}px, Total: ${totalPadding}px`);
            hero.style.paddingTop = totalPadding + 'px';
        }
    }
    
    // Вызываем при загрузке
    adjustHeaderOffset();
    
    // Вызываем при изменении размера окна
    window.addEventListener('resize', adjustHeaderOffset);
    
    // Убираем класс preload для включения анимаций после загрузки
    document.body.classList.add('preload');
    
    // Убираем preload сразу после того как DOM готов
    setTimeout(function() {
        document.body.classList.remove('preload');
    }, 50);
    
    // Дополнительно убираем после полной загрузки
    window.addEventListener('load', function() {
        document.body.classList.remove('preload');
        // Принудительно убираем любые стили которые могут вызвать мерцание
        document.querySelectorAll('section, .container, .timeline__item').forEach(function(element) {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
        });
    });
    
    // Theme management with system preference detection
    const themeToggle = document.getElementById('themeToggle');
    
    console.log('🔧 Кнопка темы найдена:', themeToggle);
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
        
        console.log('🔧 Иконка темы найдена:', themeIcon);
        
        // Function to set theme
        function setTheme(theme) {
            // Add loading state
            if (themeToggle) {
                themeToggle.classList.add('loading');
            }
            
            document.documentElement.setAttribute('data-color-scheme', theme);
            document.body.setAttribute('data-theme', theme);
            if (themeIcon) {
                themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
            }
        
            // Update meta theme-color for mobile browsers
            let metaThemeColor = document.querySelector('meta[name=theme-color]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            
            // Set appropriate theme color based on current theme
            const themeColor = theme === 'light' ? '#fcfcf9' : '#1f2121';
            metaThemeColor.content = themeColor;
            
            // Add theme change animation class
            document.body.classList.add('theme-changing');
            
            // Remove loading state after animation
            setTimeout(() => {
                document.body.classList.remove('theme-changing');
                if (themeToggle) {
                    themeToggle.classList.remove('loading');
                }
            }, 300);
            
            // Log theme change
            console.log(`🌓 Тема изменена на: ${theme === 'light' ? 'светлую' : 'темную'}`);
            
            // Add theme-specific console styling
            if (theme === 'dark') {
                console.log('%c☀️ Темная тема активирована (показывается солнце для переключения на светлую)', 'color: #32b8c6; font-weight: bold; font-size: 14px;');
            } else {
                console.log('%c🌙 Светлая тема активирована (показывается луна для переключения на темную)', 'color: #21808d; font-weight: bold; font-size: 14px;');
            }
        }
        
        // Function to get system theme preference
        function getSystemTheme() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Load saved theme or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || getSystemTheme();
        setTheme(initialTheme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            // Only update if user hasn't manually set a theme
            if (!localStorage.getItem('theme')) {
                const newSystemTheme = e.matches ? 'dark' : 'light';
                setTheme(newSystemTheme);
            }
        });
        
        // Theme toggle functionality
        let themeToggleClickCount = 0;
        const EASTER_EGG_ACTIVATION_COUNT = 5;

        // Function to handle theme toggle
        function handleThemeToggle(e) {
            console.log('🎨 handleThemeToggle вызван!', e.type, e.target);
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎨 Клик/тап по кнопке смены темы', e.type);
            
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            console.log('🎨 Переключение темы:', currentTheme, '->', newTheme);
            
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add ripple effect
            createRippleEffect(this);
            
            // Add bounce animation
            this.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);

            // Easter egg logic - DESKTOP ONLY
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                console.log('📱 Мобильное устройство - пасхалка отключена');
                return; // Exit early on mobile
            }
            
            themeToggleClickCount++;
            console.log(`Easter egg clicks: ${themeToggleClickCount}`);
            if (themeToggleClickCount >= EASTER_EGG_ACTIVATION_COUNT) {
                console.log('🎉 Пасхалка активирована!');
                activateEasterEgg();
                themeToggleClickCount = 0; // Reset count after activation
            }
        }

        // Add event listeners for both desktop and mobile
        themeToggle.addEventListener('click', handleThemeToggle, {passive: false});
        themeToggle.addEventListener('touchstart', handleThemeToggle, {passive: false});
        
        // Debug: проверим, что кнопка работает
        themeToggle.addEventListener('touchend', function(e) {
            console.log('🔧 TouchEnd на кнопке темы');
        });
        
        console.log('✅ Event listeners добавлены для кнопки темы');
        
    } // Закрытие блока if (themeToggle)

    // Easter Egg Activation Function - DESKTOP ONLY
    async function activateEasterEgg() {
        // Double check - no easter egg on mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            console.log('📱 Попытка активации пасхалки на мобильном - блокировано');
            return;
        }
        
        console.log('🎉 Активация пасхалки!');
        const easterEggContainer = document.getElementById('easterEggGame');
        if (easterEggContainer) {
            console.log('Найден контейнер пасхалки, добавляю класс active');
            easterEggContainer.classList.add('active');
            
            // Prevent closing when clicking inside the game area
            easterEggContainer.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Клик внутри пасхалки, предотвращаю закрытие');
            });
            
            // Проверим, что элементы управления видны
            const gameControls = document.getElementById('gameControls');
            const startGameBtn = document.getElementById('startGameBtn');
            const closeGameBtn = document.getElementById('closeGameBtn');
            
            setTimeout(() => {
                console.log('Через 1 секунду после активации:', {
                    containerClasses: easterEggContainer.className,
                    gameControlsDisplay: gameControls ? getComputedStyle(gameControls).display : 'null',
                    startGameBtnVisible: startGameBtn ? getComputedStyle(startGameBtn).display : 'null',
                    closeGameBtnVisible: closeGameBtn ? getComputedStyle(closeGameBtn).display : 'null',
                    containerOpacity: getComputedStyle(easterEggContainer).opacity,
                    containerVisibility: getComputedStyle(easterEggContainer).visibility
                });
            }, 1000);
            
            // Get API key from server and send notification
            try {
                const apiKey = await getTelegramKey();
                sendTelegramNotification('Кто-то нашел пасхалку на сайте!', apiKey);
            } catch (error) {
                console.error('Failed to get Telegram API key:', error);
            }
            // Game will be started by user clicking "Начать игру" button
        } else {
            console.error('Контейнер пасхалки не найден!');
        }
    }

    // Function to get Telegram API key from server
    async function getTelegramKey() {
        const response = await fetch('/api/get-telegram-key');
        if (!response.ok) {
            throw new Error('Failed to fetch API key');
        }
        const data = await response.json();
        return data.apiKey;
    }

    // Function to send Telegram notification
    function sendTelegramNotification(message, botToken) {
        const chatId = '152423085';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('✅ Уведомление отправлено в Telegram');
            } else {
                console.error('❌ Ошибка отправки уведомления:', data);
            }
        })
        .catch(error => {
            console.error('❌ Ошибка сети при отправке уведомления:', error);
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                smoothScrollTo(targetPosition, 800);
                updateActiveNavLink(this);
            }
        });
    });
    
    // Hero action buttons smooth scrolling
    const heroButtons = document.querySelectorAll('.hero__actions a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
    
    // Custom smooth scroll function with easing
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY || window.pageYOffset;
        const distance = targetY - startY;
        const startTime = Date.now();
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function scroll() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeOutCubic(progress);
            
            const currentY = startY + distance * ease;
            window.scrollTo(0, currentY);
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }
        
        requestAnimationFrame(scroll);
    }
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate metrics when hero comes into view
                if (entry.target.classList.contains('hero')) {
                    setTimeout(() => animateMetrics(), 300);
                }
                
                // Animate timeline items
                if (entry.target.classList.contains('timeline__item')) {
                    setTimeout(() => animateTimelineItem(entry.target), 200);
                }
                
                // Animate project cards
                if (entry.target.classList.contains('project-card')) {
                    setTimeout(() => animateProjectCard(entry.target), Math.random() * 200);
                }
                
                // Animate service cards
                if (entry.target.classList.contains('service-card')) {
                    setTimeout(() => animateServiceCard(entry.target), Math.random() * 300);
                }
                
                // Animate skill categories
                if (entry.target.classList.contains('skill-category')) {
                    setTimeout(() => animateSkillCategory(entry.target), Math.random() * 250);
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll reveal
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
    
    // Observe individual cards and elements
    const cards = document.querySelectorAll('.project-card, .service-card, .skill-category, .timeline__item, .metric');
    cards.forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });
    
    // Animate metrics counters
    function animateMetrics() {
        const metrics = document.querySelectorAll('.metric__value');
        
        metrics.forEach((metric, index) => {
            setTimeout(() => {
                const finalValue = metric.textContent;
                const isNumber = /^\d+/.test(finalValue);
                
                if (isNumber) {
                    const number = parseInt(finalValue);
                    animateNumber(metric, 0, number, 1500);
                } else {
                    // For non-numeric values like "100%"
                    metric.style.opacity = '0';
                    metric.style.transform = 'scale(0.5)';
                    setTimeout(() => {
                        metric.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        metric.style.opacity = '1';
                        metric.style.transform = 'scale(1)';
                    }, 100);
                }
            }, index * 200);
        });
    }
    
    // Animate timeline items
    function animateTimelineItem(item) {
        if (item.style.opacity === '1') return; // Already animated
        
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100);
    }
    
    // Animate project cards
    function animateProjectCard(card) {
        if (card.style.opacity === '1') return; // Already animated
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }
    
    // Animate service cards
    function animateServiceCard(card) {
        if (card.style.opacity === '1') return; // Already animated
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Animate skill categories
    function animateSkillCategory(category) {
        if (category.style.opacity === '1') return; // Already animated
        
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px) scale(0.98)';
        
        setTimeout(() => {
            category.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }
    
    // Number animation function
    function animateNumber(element, start, end, duration) {
        const startTime = Date.now();
        const suffix = element.textContent.replace(/^\d+/, '');
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutQuart(progress);
            const current = Math.round(start + (end - start) * easeProgress);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Easing function
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    // Enhanced ripple effect
    function createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.8s ease-out;
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            margin-left: -${size/2}px;
            margin-top: -${size/2}px;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 800);
    }
    
    // Header scroll effect
    let lastScrollTop = 0;
    let ticking = false;
    const header = document.querySelector('.header');

    function updateHeader() {
        if (!header) { ticking = false; return; }
        // Ensure preload styles don't block transforms after first interaction
        document.body.classList.remove('preload');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Hide on scroll down after threshold; show on scroll up
        // Increased threshold for better UX
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            // Scrolling down - hide header
            header.classList.add('header--hidden');
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up - show header  
            header.classList.remove('header--hidden');
        }

        // Shadow on scroll - starts earlier for better visual feedback
        if (scrollTop > 20) {
            header.classList.add('header--shadow');
        } else {
            header.classList.remove('header--shadow');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }

        // Update active navigation
        updateActiveNavigation();
    });

    // Run once on load to set initial state
    updateHeader();
    
    // Update active navigation based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = (window.pageYOffset || document.documentElement.scrollTop) + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (navLink && scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                updateActiveNavLink(navLink);
            }
        });
    }
    
    function updateActiveNavLink(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('click', function(e) {
            createRippleEffect(this);
        });
    });
    
    // Enhanced card hover effects with 3D tilt
    const interactiveCards = document.querySelectorAll('.project-card, .service-card, .skill-category, .contact__item');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Contact item click handlers for direct actions
    const contactItems = document.querySelectorAll('.contact__item');
    contactItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const label = this.querySelector('.contact__item-label').textContent.toLowerCase();
            const value = this.querySelector('.contact__item-value').textContent;
            
            if (label.includes('email')) {
                window.open('mailto:hleserg@gmail.com?subject=Вопрос по проекту&body=Здравствуйте, Сергей!%0D%0A%0D%0AХотел бы обсудить с вами проект...', '_blank');
            } else if (label.includes('телефон')) {
                // Для мобильных устройств открываем набор номера
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    window.open(`tel:${value}`, '_blank');
                } else {
                    // Для десктопа копируем номер в буфер обмена
                    navigator.clipboard.writeText(value).then(() => {
                        alert(`Номер телефона ${value} скопирован в буфер обмена!`);
                    });
                }
            } else if (label.includes('telegram')) {
                window.open('https://t.me/skhlebnikov', '_blank');
            }
            
            // Add click feedback
            createRippleEffect(this);
        });
        
        // Add pointer cursor for clickable items
        const label = item.querySelector('.contact__item-label').textContent.toLowerCase();
        if (label.includes('email') || label.includes('телефон') || label.includes('telegram')) {
            item.setAttribute('data-clickable', 'true');
        }
    });
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            0% {
                transform: scale(0);
                opacity: 0.8;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav__link.active {
            color: var(--color-primary) !important;
            background: var(--color-secondary) !important;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-slide-up {
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Smooth theme transitions */
        body * {
            transition: background-color 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease,
                        box-shadow 0.3s ease !important;
        }
        
        /* Enhanced theme toggle animation */
        .theme-toggle:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 33, 128, 141), 0.1);
        }
        
        /* Loading state for theme toggle */
        .theme-toggle.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .hero__avatar {
                animation: none;
            }
        }
        
        /* Focus visible improvements */
        .btn:focus-visible,
        .nav__link:focus-visible,
        .theme-toggle:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        /* Ensure smooth scrolling */
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize hero animations on load
    setTimeout(() => {
        animateHeroOnLoad();
    }, 300);
    
    function animateHeroOnLoad() {
        const heroTitle = document.querySelector('.hero__title');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroDescription = document.querySelector('.hero__description');
        const heroActions = document.querySelector('.hero__actions');
        const heroAvatar = document.querySelector('.hero__avatar');
        
        // Stagger the animations
        const elements = [heroTitle, heroSubtitle, heroDescription, heroActions];
        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
        
        // Animate avatar separately with photo
        if (heroAvatar) {
            const avatarImage = heroAvatar.querySelector('.hero__avatar-image');
            heroAvatar.style.opacity = '0';
            heroAvatar.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                heroAvatar.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                heroAvatar.style.opacity = '1';
                heroAvatar.style.transform = 'scale(1)';
                
                // Add subtle image animation
                if (avatarImage) {
                    avatarImage.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    avatarImage.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        avatarImage.style.transform = 'scale(1)';
                    }, 1200);
                }
            }, 500);
        }
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Theme toggle with 'T' key
        if (e.key === 't' || e.key === 'T') {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                themeToggle.click();
            }
        }
        
        // Escape key to remove focus
        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    });
    
    // Initialize with animation class
    document.body.classList.add('loaded');
    
    // Debug logging
    console.log('🚀 Сайт-визитка Хлебникова Сергея Юрьевича загружен успешно!');
    console.log('💼 10+ лет опыта в разработке 1С');
    console.log('🔧 Специализация: интеграции, мобильные решения, автоматизация');
    console.log('🌓 Переключение тем: клик по кнопке или Ctrl/Cmd + T');
    console.log('🌓 Автоматическое определение темы системы по умолчанию');
    console.log('🔄 Иконки темы: луна для светлой темы, солнце для темной');
    console.log('📧 Email: автоматическое открытие формы письма');
    console.log('📱 Телефон: автоматический набор на мобильных, копирование на десктопе');
    console.log('💬 Telegram: прямая ссылка на @skhlebnikov');
    console.log('📸 Фото профиля успешно загружено');
    console.log('💼 Расширены данные об опыте работы');
    console.log('📱 Навигация: клик по ссылкам в меню для прокрутки к секциям');
    
    // Функциональность кликабельных иконок социальных сетей
    function makeContactIconsClickable() {
        // VK иконка
        const vkIcon = document.querySelector('.vk-icon');
        if (vkIcon && !vkIcon.parentElement.href) {
            vkIcon.style.cursor = 'pointer';
            vkIcon.addEventListener('click', function() {
                window.open('https://vk.com/serg.khlebnikov', '_blank');
            });
        }
        
        // Instagram иконка
        const instagramIcon = document.querySelector('.contact__item-icon svg[fill="url(#instagram-gradient)"]');
        if (instagramIcon && !instagramIcon.closest('a')) {
            instagramIcon.style.cursor = 'pointer';
            instagramIcon.addEventListener('click', function() {
                window.open('https://www.instagram.com/hleserg/', '_blank');
            });
        }
        
        // GitHub иконка
        const githubIcon = document.querySelector('.contact__item-icon svg[fill="#24292e"]');
        if (githubIcon && !githubIcon.closest('a')) {
            githubIcon.style.cursor = 'pointer';
            githubIcon.addEventListener('click', function() {
                window.open('https://github.com/hleserg', '_blank');
            });
        }
    }
    
    // Применяем функциональность кликабельных иконок
    makeContactIconsClickable();

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

    // --- ASCII Arkanoid Game Logic ---
    const gameCanvasElement = document.getElementById('gameCanvas');
    const startGameBtn = document.getElementById('startGameBtn');
    const closeGameBtn = document.getElementById('closeGameBtn');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const restartGameBtn = document.getElementById('restartGameBtn');
    const finalScoreSpan = document.getElementById('finalScore');
    const easterEggGameContainer = document.getElementById('easterEggGame');

    let gameInterval;
    let gameRunning = false;
    let score = 0;
    let lives = 3;

    // Game board dimensions
    const GAME_WIDTH = 40;
    const GAME_HEIGHT = 20;

    // Paddle properties
    let paddleX = Math.floor(GAME_WIDTH / 2) - 3;
    const PADDLE_WIDTH = 7;
    const PADDLE_CHAR = '=';

    // Ball properties
    let ballX = paddleX + Math.floor(PADDLE_WIDTH / 2);
    let ballY = GAME_HEIGHT - 3; // Поднимаем выше над платформой
    let ballDx = 1; // -1 for left, 1 for right
    let ballDy = -1; // -1 for up, 1 for down
    const BALL_CHAR = 'O';

    // Speed and acceleration variables
    let gameSpeed = 200; // Start at 200ms, will speed up
    let speedMultiplier = 1.0;
    let gameTime = 0;

    // Blocks properties - improved with random generation
    let blocks = [];
    const BLOCK_CHAR = '#';
    const BLOCK_ROWS = 6; // Increase rows for more variety
    const BLOCK_COLS = 10;
    const BLOCK_PATTERNS = [
        // Pattern 1: Standard bricks
        [
            "1111111111",
            "1111111111",
            "1111111111",
            "1111111111",
            "1111111111",
            "1111111111"
        ],
        // Pattern 2: Arrow shape
        [
            "00111001100",
            "01111111110",
            "11111111111",
            "01111111110",
            "00111001100",
            "00010001000"
        ],
        // Pattern 3: Wave pattern
        [
            "01110111011",
            "11011101111",
            "11101110110",
            "01110111011",
            "11011101111",
            "11101110110"
        ],
        // Pattern 4: Random holes
        [
            "11101110111",
            "10111011011",
            "11101110111",
            "11011101110",
            "10111011011",
            "11101110111"
        ],
        // Pattern 5: Pyramid
        [
            "00001110000",
            "00011111000",
            "00111111100",
            "01111111110",
            "11111111111",
            "11111111111"
        ]
    ];

    function initializeBlocks() {
        blocks = [];
        // Choose random pattern from available patterns
        const selectedPatternIndex = Math.floor(Math.random() * BLOCK_PATTERNS.length);
        const selectedPattern = BLOCK_PATTERNS[selectedPatternIndex];

        for (let r = 0; r < BLOCK_ROWS; r++) {
            blocks[r] = [];
            for (let c = 0; c < BLOCK_COLS; c++) {
                // Use pattern to determine if block exists ('1' = exists, '0' = empty)
                blocks[r][c] = selectedPattern[r][c] === '1';
            }
        }

        console.log(`🎯 Генерирован случайный узор блоков #${selectedPatternIndex + 1}`);
    }

    function drawGame() {
        let board = Array(GAME_HEIGHT).fill(null).map(() => Array(GAME_WIDTH).fill(' '));

        // Draw blocks
        for (let r = 0; r < BLOCK_ROWS; r++) {
            for (let c = 0; c < BLOCK_COLS; c++) {
                if (blocks[r][c]) {
                    board[r + 1][c * 4 + 1] = BLOCK_CHAR; // Adjust position for ASCII art
                    board[r + 1][c * 4 + 2] = BLOCK_CHAR;
                }
            }
        }

        // Draw paddle
        for (let i = 0; i < PADDLE_WIDTH; i++) {
            board[GAME_HEIGHT - 1][paddleX + i] = PADDLE_CHAR;
        }

        // Draw ball
        board[ballY][ballX] = BALL_CHAR;

        // Convert board to string
        let output = '';
        for (let r = 0; r < GAME_HEIGHT; r++) {
            output += board[r].join('') + '\n';
        }

        // Add score and lives
        output += `Score: ${score} Lives: ${lives}`;
        gameCanvasElement.textContent = output;
    }

    function updateGame() {
        // Speed up game over time
        gameTime++;
        if (gameTime % 50 === 0 && gameSpeed > 50) { // Increase speed every 50 updates (not too fast)
            gameSpeed = Math.max(50, gameSpeed - 10); // Speed up, but not below 50ms
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, gameSpeed);
            console.log(`⚡ Скорость игры увеличена: ${gameSpeed}ms`);
        }

        // Move ball
        ballX += ballDx;
        ballY += ballDy;

        // Ball collision with walls
        if (ballX <= 0 || ballX >= GAME_WIDTH - 1) {
            ballDx *= -1;
        }
        if (ballY <= 0) {
            ballDy *= -1;
        }

        // Ball collision with paddle
        if (ballY >= GAME_HEIGHT - 2 && ballX >= paddleX && ballX < paddleX + PADDLE_WIDTH && ballDy > 0) {
            ballDy *= -1;
            console.log('🏓 Мячик отбит платформой!');
            // Add some randomness or angle based on where it hits the paddle
            const hitPos = ballX - paddleX;
            if (hitPos < PADDLE_WIDTH / 3) ballDx = -1;
            else if (hitPos > PADDLE_WIDTH * 2 / 3) ballDx = 1;
            else ballDx = ballDx; // Keep current direction
        }

        // Ball collision with blocks
        for (let r = 0; r < BLOCK_ROWS; r++) {
            for (let c = 0; c < BLOCK_COLS; c++) {
                if (blocks[r][c]) {
                    // Simple collision detection for now
                    if (ballY === r + 1 && (ballX === c * 4 + 1 || ballX === c * 4 + 2)) {
                        blocks[r][c] = false;
                        ballDy *= -1;
                        score += 10;
                        break;
                    }
                }
            }
        }

        // Check for game over (ball out of bounds)
        if (ballY >= GAME_HEIGHT - 1) {
            lives--;
            console.log('💀 Жизнь потеряна! Осталось жизней:', lives);
            if (lives <= 0) {
                console.log('💀 Игра окончена - нет жизней');
                endGame();
            } else {
                // Reset ball position
                console.log('🔄 Сброс позиции мячика после потери жизни');
                ballX = paddleX + Math.floor(PADDLE_WIDTH / 2);
                ballY = GAME_HEIGHT - 3; // Поднимаем выше
                ballDx = 1;
                ballDy = -1;
            }
        }

        // Check if all blocks are cleared
        if (blocks.every(row => row.every(block => !block))) {
            endGame(true); // Win condition
        }

        drawGame();
    }

    function startGame() {
        console.log('🕹️ startGame() вызвана!');
        // If game is already running, stop it first
        if (gameRunning) {
            clearInterval(gameInterval);
            gameRunning = false;
        }

        console.log('🕹️ Игра "Арканоид" запущена!');
        gameRunning = true;
        score = 0;
        lives = 3;
        console.log('🔄 Начальные параметры: score =', score, 'lives =', lives);
        initializeBlocks();

        // Reset ball and paddle
        paddleX = Math.floor(GAME_WIDTH / 2) - 3;
        ballX = paddleX + Math.floor(PADDLE_WIDTH / 2);
        ballY = GAME_HEIGHT - 3; // Поднимаем мячик выше над платформой
        ballDx = 1;
        ballDy = -1;
        console.log('🏓 Позиция мячика: ballX =', ballX, 'ballY =', ballY);

        // Reset game speed and time
        gameSpeed = 200;
        gameTime = 0;

        gameOverScreen.classList.remove('active');
        easterEggGameContainer.classList.add('active'); // Ensure game container is visible
        gameInterval = setInterval(updateGame, gameSpeed); // Use variable speed
        drawGame();
        console.log('✅ Игра запущена, gameInterval создан');
    }

    function endGame(win = false) {
        console.log('🛑 endGame() вызвана, win =', win);
        gameRunning = false;
        clearInterval(gameInterval);
        finalScoreSpan.textContent = score;

        // Плавный затемняющий/осветляющий переход
        const gameContainer = document.querySelector('.easter-egg-game');
        const gameOverScreen = document.getElementById('gameOverScreen');

        // Сначала дополнительно затемнить экран только для победы
        if (gameContainer && win) {
            gameContainer.style.background = 'rgba(0, 0, 0, 0.95)';
        }

        // Показать game over screen
        gameOverScreen.classList.add('active');
        const winLink = document.getElementById('winLink');
        if (win) {
            gameOverScreen.querySelector('h3').textContent = 'Вы выиграли!';
            gameOverScreen.style.color = '#0f0';
            if (winLink) winLink.style.display = 'block';
        } else {
            gameOverScreen.querySelector('h3').textContent = 'Игра окончена!';
            gameOverScreen.style.color = '#f00';
            if (winLink) winLink.style.display = 'none';
            // Для проигрыша - сразу начать плавное растворение
            if (gameContainer) {
                gameContainer.classList.add('fade-out');
                setTimeout(() => {
                    closeEasterEgg();
                    setTimeout(() => {
                        if (gameContainer) {
                            gameContainer.classList.remove('fade-out');
                        }
                    }, 1000);
                }, 2000);
            }
        }

        // Для победы - через 3 секунды осветлить и закрыть
        if (win) {
            setTimeout(() => {
                if (gameContainer) {
                    gameContainer.style.transition = 'all 2s ease-out';
                    gameContainer.style.background = 'rgba(0, 0, 0, 0.1)';
                    gameContainer.style.opacity = '0.3';

                    // Закрыть через еще 2 секунды после осветления
                    setTimeout(() => {
                        closeEasterEgg();
                        // Сбросить стили перехода
                        setTimeout(() => {
                            if (gameContainer) {
                                gameContainer.style.transition = '';
                                gameContainer.style.background = '';
                                gameContainer.style.opacity = '';
                            }
                        }, 1000);
                    }, 2000);
                } else {
                    closeEasterEgg();
                }
            }, 3000);
        }

        console.log('🛑 Игра "Арканоид" завершена. Счет:', score);
    }

    function closeEasterEgg() {
        console.log('🚪 closeEasterEgg() вызвана!');
        clearInterval(gameInterval);
        gameRunning = false;
        easterEggGameContainer.classList.remove('active');
        gameOverScreen.classList.remove('active');
        console.log('🚪 Пасхалка закрыта.');
    }

    // Keyboard controls for desktop
    document.addEventListener('keydown', function(e) {
        if (!gameRunning) return;
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            paddleX = Math.max(0, paddleX - 2);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            paddleX = Math.min(GAME_WIDTH - PADDLE_WIDTH, paddleX + 2);
        }
        drawGame();
    });

    // Touch controls for mobile - Improved boundary checking
    let touchStartX = 0;
    gameCanvasElement.addEventListener('touchstart', function(e) {
        if (!gameRunning) return;
        touchStartX = e.touches[0].clientX;
    });

    gameCanvasElement.addEventListener('touchmove', function(e) {
        if (!gameRunning) return;
        e.preventDefault(); // Prevent scrolling
        const touchCurrentX = e.touches[0].clientX;
        const deltaX = touchCurrentX - touchStartX;

        // Adjust paddle position based on touch movement
        const oldPaddleX = paddleX;
        paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, paddleX + Math.round(deltaX / 20)));

        // Only update start position if paddle actually moved (better control)
        if (paddleX !== oldPaddleX || Math.abs(deltaX) > 15) {
            touchStartX = touchCurrentX;
            drawGame();
        }
    });

    // Touch end handler for better UX
    gameCanvasElement.addEventListener('touchend', function(e) {
        if (!gameRunning) return;
        // Reset touch tracking
        touchStartX = 0;
    });

    // Event listeners for game buttons
    startGameBtn.addEventListener('click', function() {
        console.log('🎮 Кнопка "Начать игру" нажата!');
        startGame();
    });
    restartGameBtn.addEventListener('click', function() {
        console.log('🔄 Кнопка "Играть снова" нажата!');
        startGame();
    });
    closeGameBtn.addEventListener('click', function() {
        console.log('❌ Кнопка "Закрыть" нажата!');
        closeEasterEgg();
    });

});
