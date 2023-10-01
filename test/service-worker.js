async function sendUpdatePopupContentToPopup(content) {
    console.log('sendUpdatePopupContentToPopup service-worker.js', content);// success

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log('tab', tab);

    id = 'jkjmcafbjdffeihegnhpkbfafgpkikia'
    // const response = await chrome.tabs.sendMessage(tab.id, { action: "sendUpdatePopupContentToPopup", content: content });
    // const responseRuntime = await chrome.runtime.sendMessage( { action: "sendUpdatePopupContentToPopup", content: content });
    const responseRuntimeWithId = await chrome.runtime.sendMessage(id, { action: "sendUpdatePopupContentToPopup", content: content });

    // console.log('response', response);
    // console.log('responseRuntime', responseRuntime);
    console.log('responseRuntimeWithId', responseRuntimeWithId);
    return responseRuntimeWithId;
}

async function sendGetActiveTabDocumentToContentScript() {
    console.log('sendGetActiveTabDocumentToContentScript service-worker.js');
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log('tab', tab);
    if (tab) {

        const response = await chrome.tabs.sendMessage(tab.id, { action: "getActiveTabDocument" });
        console.log('response from content script', response);
        return response;
    } else {
        console.warn('cannot sendMessage, no tab');
    }
    return null;
}

async function getActiveTabDocumentListener(request, sender, sendResponse) {
    console.log('getActiveTabDocumentListener service-worker.js');

    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    const resultFromContentScript = await sendGetActiveTabDocumentToContentScript();
    console.log('resultFromContentScript ', resultFromContentScript);
    if (resultFromContentScript) {
        const resultFromPopupScript = await sendUpdatePopupContentToPopup(resultFromContentScript.content);
        console.log('resultFromPopupScript', resultFromPopupScript);

    } else {
        console.log('NO resultFromContentScript , cannot update popup');

    }

    sendResponse({ status: "ok?", content: ' _ ' });
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


chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log("Received message from " + sender + ": ", request);
    sendResponse({ status: "ok", received: true });
});


const actionToFunctionMap = {
    'getActiveTabDocument': getActiveTabDocumentListener,
};


chrome.runtime.onMessage.addListener(onMessageListener);
