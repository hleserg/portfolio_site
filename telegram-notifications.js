// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    // API endpoint для получения Bot Token
    apiEndpoint: 'https://skhlebnikov.ru/api/get-telegram-key',
    // Chat ID для отправки уведомлений
    chatId: '152423085',
    // Кэш для Bot Token
    botToken: null
};

/**
 * Получает Bot Token с сервера
 * @returns {Promise<string|null>} - Bot Token или null при ошибке
 */
async function getTelegramBotToken() {
    // Если токен уже кэширован, возвращаем его
    if (TELEGRAM_CONFIG.botToken) {
        return TELEGRAM_CONFIG.botToken;
    }

    try {
        const response = await fetch(TELEGRAM_CONFIG.apiEndpoint);
        
        if (!response.ok) {
            console.error('❌ Ошибка получения API ключа:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        
        if (data.apiKey) {
            TELEGRAM_CONFIG.botToken = data.apiKey;
            console.log('✅ Bot Token успешно получен с сервера');
            return data.apiKey;
        } else {
            console.error('❌ API ключ не найден в ответе сервера');
            return null;
        }
    } catch (error) {
        console.error('❌ Ошибка при получении API ключа:', error);
        return null;
    }
}

/**
 * Отправляет сообщение в Telegram
 * @param {string} message - Текст сообщения
 * @returns {Promise<boolean>} - Результат отправки
 */
async function sendTelegramMessage(message) {
    // Получаем Bot Token с сервера
    const botToken = await getTelegramBotToken();
    
    if (!botToken) {
        console.error('❌ Не удалось получить Bot Token');
        return false;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CONFIG.chatId,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram');
            return true;
        } else {
            const error = await response.json();
            console.error('❌ Ошибка отправки в Telegram:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка сети при отправке в Telegram:', error);
        return false;
    }
}

/**
 * Отправляет уведомление о нажатии кнопки "Блог"
 */
async function notifyBlogButtonClick() {
    const timestamp = new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const message = `🔔 <b>Уведомление с сайта</b>\n\n` +
                   `📝 Пользователь нажал на кнопку "Блог"\n` +
                   `🕐 Время: ${timestamp}\n` +
                   `🌐 URL: ${window.location.href}\n` +
                   `👤 User Agent: ${navigator.userAgent.substring(0, 100)}...`;

    await sendTelegramMessage(message);
}

/**
 * Отправляет уведомление об открытии пасхалки
 */
async function notifyEasterEggActivation() {
    const timestamp = new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Получаем информацию о браузере и устройстве
    const userAgent = navigator.userAgent;
    const screenInfo = `${screen.width}x${screen.height}`;
    const referrer = document.referrer || 'Прямой переход';

    const message = `🥚 <b>ПАСХАЛКА НАЙДЕНА!</b>\n\n` +
                   `🎉 Пользователь активировал пасхалку на сайте!\n` +
                   `🕐 Время: ${timestamp}\n` +
                   `🌐 URL: ${window.location.href}\n` +
                   `📱 Разрешение экрана: ${screenInfo}\n` +
                   `🔗 Откуда пришел: ${referrer}\n` +
                   `🎮 Способ активации: 5 кликов по переключателю темы\n` +
                   `💡 Пользователь знает секрет!\n` +
                   `👤 Браузер: ${userAgent.substring(0, 100)}...`;

    console.log('🥚 Отправляем уведомление о пасхалке в Telegram:', message);
    await sendTelegramMessage(message);
}

/**
 * Добавляет обработчик клика на кнопку "Блог"
 */
function initBlogButtonTracking() {
    // Ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        const blogButton = document.querySelector('.blog-button');
        
        if (blogButton) {
            // Добавляем обработчик клика
            blogButton.addEventListener('click', async function(event) {
                // Предотвращаем переход по ссылке на короткое время
                event.preventDefault();
                
                console.log('📝 Клик по кнопке "Блог" - отправляем уведомление...');
                
                // Отправляем уведомление в Telegram
                await notifyBlogButtonClick();
                
                // Через небольшую задержку выполняем переход
                setTimeout(() => {
                    window.location.href = blogButton.href;
                }, 500);
            });
            
            console.log('✅ Отслеживание кнопки "Блог" инициализировано');
        } else {
            console.warn('⚠️ Кнопка "Блог" не найдена');
        }
    });
}

// Инициализируем отслеживание
initBlogButtonTracking();

// Делаем функцию уведомления о пасхалке доступной глобально
window.notifyEasterEggActivation = notifyEasterEggActivation;

// Экспортируем функции для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTelegramBotToken,
        sendTelegramMessage,
        notifyBlogButtonClick,
        notifyEasterEggActivation,
        initBlogButtonTracking
    };
}
