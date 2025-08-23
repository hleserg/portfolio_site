// Мониторинг Core Web Vitals для SEO
// Добавьте этот код в app.js или отдельный файл для отслеживания метрик

function measureCoreWebVitals() {
    // Отслеживание FCP (First Contentful Paint)
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                console.log('FCP:', entry.startTime);
                // Отправка в аналитику
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        name: 'FCP',
                        value: Math.round(entry.startTime),
                        event_category: 'Web Vitals'
                    });
                }
            }
        }
    }).observe({entryTypes: ['paint']});

    // Отслеживание LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                name: 'LCP',
                value: Math.round(lastEntry.startTime),
                event_category: 'Web Vitals'
            });
        }
    }).observe({entryTypes: ['largest-contentful-paint']});

    // Отслеживание FID (First Input Delay)
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            console.log('FID:', entry.processingStart - entry.startTime);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    name: 'FID',
                    value: Math.round(entry.processingStart - entry.startTime),
                    event_category: 'Web Vitals'
                });
            }
        }
    }).observe({entryTypes: ['first-input']});

    // Отслеживание CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
        console.log('CLS:', clsValue);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                name: 'CLS',
                value: Math.round(clsValue * 1000),
                event_category: 'Web Vitals'
            });
        }
    }).observe({entryTypes: ['layout-shift']});
}

// Запуск мониторинга после загрузки DOM
document.addEventListener('DOMContentLoaded', measureCoreWebVitals);
