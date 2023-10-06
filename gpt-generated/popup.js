class Popup {
    toggleCaseInsensitive() {
        caseInsensitiveCheckbox.checked = !caseInsensitiveCheckbox.checked;
        if (caseInsensitiveCheckbox.checked) {
            regexCheckbox.checked = false;
        }
    }

    toggleRegex() {
        regexCheckbox.checked = !regexCheckbox.checked;
        if (regexCheckbox.checked) {
            caseInsensitiveCheckbox.checked = false;
        }
    }

    toggleAcrossLinks() {
        acrossLinksCheckbox.checked = !acrossLinksCheckbox.checked;
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

    async handleSearchButtonClick() {
        console.log('handleSearchButtonClick');
        let pageText;

        if (pageContentsAsDocument !== null) {
            continueSearch();
            return pageContentsAsDocument;
        }

        await getPageContentsAsDocument();
    }

    async getPageContentsAsDocument() {
        messageDiv.innerHTML = 'loading';
        const response = await chrome.runtime.sendMessage({ action: "getActiveTabDocument" });
        if (!response) {
            return null;
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

        pageContentsAsDocument = request.content;
        messageDiv.innerHTML = '';
        sendResponse({ status: "ok", content: 'got doc text' });

        continueSearch();
    }

    continueSearch() {
        const searchText = searchInput.value;

        if (!pageContentsAsDocument) {
            resultsDiv.innerHTML = ' что-то не так, не нашел текст на странице';
            return;
        }
        let indices = [];
        if (caseInsensitiveCheckbox.checked) {
            indices = searcher.searchCaseInsensitive(pageContentsAsDocument, searchText);
        } else {
            indices = searcher.searchCaseSensitive(pageContentsAsDocument, searchText);
        }
        if (regexCheckbox.checked) {
            indices = searcher.searchRegex(pageContentsAsDocument, searchText);
        }
        presenter.showResults(indices, pageContentsAsDocument);
    }


    main() {
        // Глобальные переменные для элементов из HTML
        const caseInsensitiveCheckbox = document.getElementById('case-insensitive-checkbox');
        const regexCheckbox = document.getElementById('treat-as-regex-checkbox');
        const acrossLinksCheckbox = document.getElementById('across-links-only-checkbox');
        const searchInput = document.getElementById('search-query-input');
        const searchButton = document.getElementById('search-button');
        const resultsDiv = document.getElementById('search-results');
        const messageDiv = document.getElementById('message');
        let linksText = '';
        let pageContentsAsDocument = null;
        let linksExist = true;

        let isLoading = false;

        const searcher = new Searcher();
        const presenter = new Presenter(resultsDiv);

        searchButton.addEventListener('click', this.handleSearchButtonClick);
        chrome.runtime.onMessage.addListener(this.onMessageListener);
        caseInsensitiveCheckbox.addEventListener('change', this.toggleCaseInsensitive);
        regexCheckbox.addEventListener('change', this.toggleRegex);
        searchButton.addEventListener('click', this.handleSearchButtonClick);
    }
}




