async function sendUpdatePopupContent() {
    console.log('sendUpdatePopupContent content.js', document);
    const response = await chrome.runtime.sendMessage({ action: "updatePopupContent", content: document });
    console.log(response);
}

async function onMessageListener(request, sender, sendResponse) {
    console.log('onMessageListener content.js');

    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.action === "getActiveTabDocument") {
        console.log('getting page in content.js , sending document');
        console.log('document', document);

        // await sendUpdatePopupContent();
        sendResponse({ status: "ok", content: document });
        return;
    }
    sendResponse({ status: "ko", content: 'unknown action' });
}


chrome.runtime.onMessage.addListener(onMessageListener);

console.log('raw root content.js document', document)
