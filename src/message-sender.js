export class MessageSender {
    constructor(dataStructure) {
        this.dataStructure = dataStructure;

        chrome.runtime.onMessage.addListener(this.onMessageListener);
    }

    async getPageContentsAsDocument() {
        this.dataStructure.messageDiv.innerHTML = 'loading';
        const response = await chrome.runtime.sendMessage({ action: "getActiveTabDocument" });
        if (!response) {
            return '';
        }
        return response.content;
    }

    async onMessageListener(request, sender, sendResponse) {
        if (request.action === 'sendUpdatePopupContentToPopup') {
            return await sendUpdatePopupContentToPopupListener(request, sender, sendResponse)
        }
        sendResponse({ status: "ko", content: 'unknown action' });
    }

    sendUpdatePopupContentToPopupListener(request, sender, sendResponse) {
        console.log('sendUpdatePopupContentToPopupListener popup.js', request);

        this.dataStructure.pageContentsAsDocument = request.content;
        this.dataStructure.messageDiv.innerHTML = '';
        sendResponse({ status: "ok", content: 'got doc text' });
    }
}
