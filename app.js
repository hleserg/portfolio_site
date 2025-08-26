document.addEventListener('DOMContentLoaded', function() {
    // 🐛 DEBUG: Точка останова для отладки
    console.log('🚀 Сайт загружается...');
    debugger; // Точка останова для отладки в DevTools
    
    // Функция для динамической настройки отступа под заголовок
    function adjustHeaderOffset() {
        console.log('⚙️ Настройка отступа заголовка...');
        const header = document.querySelector('.header');
        const hero = document.querySelector('.hero');
        
        if (header && hero) {
            const headerHeight = header.offsetHeight;
            // Добавляем дополнительный отступ для мобильных устройств (еще больше уменьшен)
            const isMobile = window.innerWidth <= 768;
            const extraOffset = isMobile ? 59 : 30; // Дополнительный отступ (было 89 и 45)
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
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
        
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
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎨 Клик по кнопке смены темы');
            
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
        });
        
    } // Закрытие блока if (themeToggle)
    
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
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add subtle shadow based on scroll
        if (scrollTop > 50) {
            header.style.boxShadow = 'var(--shadow-sm)';
        } else {
            header.style.boxShadow = 'none';
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
});