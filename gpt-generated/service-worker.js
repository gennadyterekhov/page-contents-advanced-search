/**
В этом примере:

install и activate события используются для активации Service Worker.

message обработчикы используются для обмена сообщениями между popup.js и активными вкладками.

Когда popup.js отправляет сообщение с действием getActiveTabContent, Service Worker ищет активную вкладку и отправляет ей сообщение с действием fetchPageContent.

Активная вкладка должна обработать сообщение с действием fetchPageContent и отправить содержимое текущей страницы обратно в Service Worker.

Service Worker, в свою очередь, отправляет это содержимое в popup.js через сообщение с действием updatePopupContent.

Теперь вам нужно настроить ваше расширение Chrome для использования этого Service Worker. Не забудьте также добавить файл service-worker.js в манифест вашего расширения.
 */


// Обработчик события установки Service Worker.
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

// Обработчик события активации Service Worker.
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Обработчик события получения сообщения от popup.js.
self.addEventListener('message', (event) => {
    if (event.data.action === 'getActiveTabContent') {
        console.log('getting page in service-worker.js in first listener', request.content);

        // Получаем активную вкладку.
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                if (windowClients.length > 0) {
                    // Берем первую активную вкладку.
                    const activeTab = windowClients[0];
                    // Отправляем сообщение с запросом на получение содержимого страницы.
                    activeTab.postMessage({ action: 'fetchPageContent' });
                }
            });
    }
});

// Обработчик события получения сообщения от активной вкладки.
self.addEventListener('message', (event) => {
    if (event.data.action === 'sendPageContent') {
        // Отправляем полученное содержимое страницы в popup.js.
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                windowClients.forEach((client) => {
                    client.postMessage({ action: 'updatePopupContent', content: event.data.content });
                });
            });
    }
});

// below is human generated code

// why is it needed?
async function sendUpdatePopupContent() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {action: "updatePopupContent"});
    // do something with response here, not outside the function
    console.log(response);
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.action === "getActiveTabContent") {
            console.log('getting page in service-worker.js in second listener', request.content);
            pageContentsAsDocument = request.content
            sendResponse({ status: "ok" });
        }
    }
);