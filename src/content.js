async function onMessageListener(request, sender, sendResponse) {
    if (request.action === "getActiveTabDocument") {
        return sendResponse({ status: "ok", content: document.body.innerText });
    }
    sendResponse({ status: "ko", content: 'unknown action' });
}


chrome.runtime.onMessage.addListener(onMessageListener);
