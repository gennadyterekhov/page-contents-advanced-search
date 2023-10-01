async function onMessageListener(request, sender, sendResponse) {
    console.log('onMessageListener content.js');

    if (request.action === "getActiveTabDocument") {
        console.log('getting page in content.js , sending document');
        console.log('document', document);

        sendResponse({ status: "ok", content: document.body.innerHTML });
        return;
    }
    sendResponse({ status: "ko", content: 'unknown action' });
}


chrome.runtime.onMessage.addListener(onMessageListener);

console.log('raw root content.js document', document)
console.log('raw root content.js document.textContent', document.textContent)

