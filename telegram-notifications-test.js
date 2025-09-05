// Тестовая версия для быстрого тестирования
// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    // API endpoint для получения Bot Token
    apiEndpoint: 'https://skhlebnikov.ru/api/get-telegram-key',
    // Chat ID для отправки уведомлений
    chatId: '152423085',
    // Кэш для Bot Token
    botToken: null
};

// Флаг для включения/отключения уведомлений
const NOTIFICATIONS_ENABLED = true; // Включаем для тестирования

/**
 * Получает Bot Token с сервера
 * @returns {Promise<string|null>} - Bot Token или null при ошибке
 */
async function getTelegramBotToken() {
    // Если токен уже кэширован, возвращаем его
    if (TELEGRAM_CONFIG.botToken) {
        console.log('🔄 Используем кэшированный Bot Token');
        return TELEGRAM_CONFIG.botToken;
    }

    console.log('🔍 Получаем Bot Token с сервера...');
    
    try {
        const response = await fetch(TELEGRAM_CONFIG.apiEndpoint);
        
        if (!response.ok) {
            console.error('❌ Ошибка получения API ключа:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('📡 Ответ сервера:', data);
        
        if (data.apiKey) {
            TELEGRAM_CONFIG.botToken = data.apiKey;
            console.log('✅ Bot Token успешно получен с сервера');
            // Скрываем полный токен в логах
            const maskedToken = data.apiKey.substring(0, 10) + '...' + data.apiKey.substring(data.apiKey.length - 10);
            console.log('🔑 Токен (частично скрыт):', maskedToken);
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
    if (!NOTIFICATIONS_ENABLED) {
        console.log('🔕 Уведомления отключены. Сообщение для отправки:', message);
        return false;
    }

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
        console.log('📤 Отправляем запрос в Telegram API...');
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

    // Получаем информацию о браузере и устройстве
    const userAgent = navigator.userAgent;
    const screenInfo = `${screen.width}x${screen.height}`;
    const referrer = document.referrer || 'Прямой переход';

    const message = `🔔 <b>Уведомление с сайта</b>\n\n` +
                   `📝 Пользователь нажал на кнопку "Блог"\n` +
                   `🕐 Время: ${timestamp}\n` +
                   `🌐 URL: ${window.location.href}\n` +
                   `📱 Разрешение экрана: ${screenInfo}\n` +
                   `🔗 Откуда пришел: ${referrer}\n` +
                   `👤 Браузер: ${userAgent.substring(0, 100)}...`;

    console.log('📤 Подготовлено сообщение для Telegram:', message);
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
 * Показывает визуальное уведомление на странице
 */
function showPageNotification() {
    // Создаем уведомление на странице для тестирования
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <strong>✅ Тест успешен!</strong><br>
        Клик по кнопке "Блог" отслежен.<br>
        <small>Время: ${new Date().toLocaleTimeString()}</small>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Добавляет обработчик клика на кнопку "Блог"
 */
function initBlogButtonTracking() {
    // Ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        const blogButton = document.querySelector('.blog-button');
        
        if (blogButton) {
            console.log('🎯 Найдена кнопка "Блог":', blogButton);
            
            // Добавляем обработчик клика
            blogButton.addEventListener('click', async function(event) {
                // Предотвращаем переход по ссылке на короткое время
                event.preventDefault();
                
                console.log('📝 Клик по кнопке "Блог" - отправляем уведомление...');
                
                // Показываем визуальное уведомление
                showPageNotification();
                
                // Отправляем уведомление в Telegram
                await notifyBlogButtonClick();
                
                // Через небольшую задержку выполняем переход
                setTimeout(() => {
                    console.log('🔄 Переходим на страницу блога...');
                    window.location.href = blogButton.href;
                }, 1500); // Увеличили задержку до 1.5 сек для демонстрации
            });
            
            console.log('✅ Отслеживание кнопки "Блог" инициализировано');
            console.log('💡 Нажмите на кнопку "Блог" для тестирования');
        } else {
            console.warn('⚠️ Кнопка "Блог" не найдена на странице');
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
        initBlogButtonTracking,
        showPageNotification
    };
}
