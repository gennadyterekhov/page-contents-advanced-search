class Popup {
    constructor(dataStructure, handleSearchButtonClick) {
        this.dataStructure = dataStructure;

        dataStructure.caseInsensitiveCheckbox.addEventListener('change', this.toggleCaseInsensitive);
        dataStructure.searchButton.addEventListener('click', handleSearchButtonClick);
        dataStructure.regexCheckbox.addEventListener('change', this.toggleRegex);
        chrome.runtime.onMessage.addListener(this.onMessageListener);
    }

    toggleCaseInsensitive() {
        this.dataStructure.caseInsensitiveCheckbox.checked = !caseInsensitiveCheckbox.checked;
        if (this.dataStructure.caseInsensitiveCheckbox.checked) {
            this.dataStructure.regexCheckbox.checked = false;
        }
    }

    toggleRegex() {
        this.dataStructure.regexCheckbox.checked = !this.dataStructure.regexCheckbox.checked;
        if (this.dataStructure.regexCheckbox.checked) {
            this.dataStructure.caseInsensitiveCheckbox.checked = false;
        }
    }

    toggleAcrossLinks() {
        this.dataStructure.acrossLinksCheckbox.checked = !this.dataStructure.acrossLinksCheckbox.checked;
    }

    getAllLinks() {
        const links = document.getElementsByTagName('a');
        const linkArray = Array.from(links);
        return linkArray.map(link => link.href);
    }

    // Функция получения текста всех ссылок
    getLinksText() {
        if (linksText) {
            return linksText;
        }
        if (!linksExist) {
            return '';
        }

        const links = getAllLinks();
        if (links.length > 0) {
            linksExist = true;
        } else {
            linksExist = false;
            return '';
        }

        linksText = links.join('\n');
        return linksText;
    }

    async getPageContentsAsDocument() {
        this.dataStructure.messageDiv.innerHTML = 'loading';
        const response = await chrome.runtime.sendMessage({ action: "getActiveTabDocument" });
        if (!response) {
            return null;
        }
        return response.content;
    }

    // @deprecated
    async onMessageListener(request, sender, sendResponse) {
        if (request.action === 'sendUpdatePopupContentToPopup') {
            return await sendUpdatePopupContentToPopupListener(request, sender, sendResponse)
        }
        sendResponse({ status: "ko", content: 'unknown action' });
    }
    // @deprecated
    sendUpdatePopupContentToPopupListener(request, sender, sendResponse) {
        console.log('sendUpdatePopupContentToPopupListener popup.js', request);

        this.dataStructure.pageContentsAsDocument = request.content;
        this.dataStructure.messageDiv.innerHTML = '';
        sendResponse({ status: "ok", content: 'got doc text' });

        // continueSearch();
    }
}




