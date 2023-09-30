async function sendUpdatePopupContentToPopup(content) {
    console.log('sendUpdatePopupContentToPopup service-worker.js', content);

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: "sendUpdatePopupContentToPopup", content: content });
    console.log(response);
}

async function sendGetActiveTabDocumentToContentScript() {
    console.log('sendGetActiveTabDocumentToContentScript service-worker.js');
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: "getActiveTabDocument" });
    console.log('response', response);
    return response;
}

async function getActiveTabDocumentListener(request, sender, sendResponse) {
    console.log('getActiveTabDocumentListener service-worker.js');

    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    const resultFromContentScript = await sendGetActiveTabDocumentToContentScript();
    // const resultFromPopupScript = await sendUpdatePopupContentToPopup(resultFromContentScript.content);

    sendResponse({ status: "ok", content: resultFromContentScript.content });
}

async function onMessageListener(request, sender, sendResponse) {
    console.log('onMessageListener service-worker.js');

    let listener = actionToFunctionMap[request.action];
    if (listener) {
        listener(request, sender, sendResponse);
        return
    }
    sendResponse({ status: "ko", content: 'unknown action' });
}

const actionToFunctionMap = {
    'getActiveTabDocument': getActiveTabDocumentListener,
};


chrome.runtime.onMessage.addListener(onMessageListener);
