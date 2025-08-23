window.socialShareConfig = {
    // Основные данные для шеринга
    title: "Сергей Хлебников - Ведущий программист 1С",
    description: "Ведущий программист 1С с опытом 10+ лет. Интеграция ФГИС Меркурий, мобильные приложения ТСД, автоматизация бизнес-процессов.",
    url: window.location.href,
    image: window.location.origin + "/photo_2022-07-26_20-37-26.jpg",
    
    // Настройки для разных платформ
    platforms: {
        vk: {
            url: "https://vk.com/share.php",
            params: {
                url: window.location.href,
                title: "Сергей Хлебников - Ведущий программист 1С",
                description: "Ведущий программист 1С с опытом 10+ лет",
                image: window.location.origin + "/photo_2022-07-26_20-37-26.jpg"
            }
        },
        telegram: {
            url: "https://t.me/share/url",
            params: {
                url: window.location.href,
                text: "Сергей Хлебников - Ведущий программист 1С. Интеграция ФГИС Меркурий, мобильные приложения ТСД."
            }
        },
        whatsapp: {
            url: "https://api.whatsapp.com/send",
            params: {
                text: "Сергей Хлебников - Ведущий программист 1С " + window.location.href
            }
        },
        ok: {
            url: "https://connect.ok.ru/offer",
            params: {
                url: window.location.href,
                title: "Сергей Хлебников - Ведущий программист 1С",
                description: "Ведущий программист 1С с опытом 10+ лет"
            }
        }
    },
    
    // Функция генерации ссылки для шеринга
    generateShareUrl: function(platform) {
        if (!this.platforms[platform]) return null;
        
        const config = this.platforms[platform];
        const params = new URLSearchParams(config.params);
        return config.url + "?" + params.toString();
    },
    
    // Функция открытия окна шеринга
    share: function(platform) {
        const shareUrl = this.generateShareUrl(platform);
        if (shareUrl) {
            window.open(shareUrl, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
        }
    },
    
    // Трекинг социальных взаимодействий
    trackSocialShare: function(platform) {
        // Yandex Metrika
        if (typeof ym !== 'undefined') {
            ym(103868763, 'reachGoal', 'social_share_' + platform);
        }
        
        // Google Analytics (если используется)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'website',
                item_id: 'portfolio'
            });
        }
    }
};

// Добавление событий для социальных иконок
document.addEventListener('DOMContentLoaded', function() {
    // Трекинг кликов по социальным профилям
    const socialLinks = document.querySelectorAll('.contact-item[onclick]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('onclick').match(/window\.open\('([^']+)'/);
            if (href && href[1]) {
                let platform = 'unknown';
                if (href[1].includes('vk.com')) platform = 'vk';
                else if (href[1].includes('instagram.com')) platform = 'instagram';
                else if (href[1].includes('github.com')) platform = 'github';
                else if (href[1].includes('t.me')) platform = 'telegram';
                
                window.socialShareConfig.trackSocialShare('profile_click_' + platform);
            }
        });
    });
});
