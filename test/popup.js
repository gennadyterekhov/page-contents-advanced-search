const messageDiv = document.getElementById('message');

const searchInput = document.getElementById('search-query-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('search-results');
let pageContentsAsDocument = null;
const searcher = new Searcher();
const presenter = new Presenter(resultsDiv);

searchButton.addEventListener('click', handleSearchButtonClick);
chrome.runtime.onMessage.addListener(onMessageListener);

async function handleSearchButtonClick() {
    console.log('handleSearchButtonClick');
    let pageText;

    pageText = await getPageContentsAsDocument();
}

async function getPageContentsAsDocument() {
    messageDiv.innerHTML = 'loading';

    console.log('getPageContentsAsDocument');

    isLoading = true;
    if (pageContentsAsDocument !== null) {
        return pageContentsAsDocument;
    }
    const response = await chrome.runtime.sendMessage({ action: "getActiveTabDocument" });
    console.log('response', response);
    if (!response) {
        return null;
    }
    pageContentsAsDocument = response.content;
    console.log('pageContentsAsDocument', pageContentsAsDocument);

    isLoading = false;
    return response;
}

async function onMessageListener(request, sender, sendResponse) {
    if (request.action === 'sendUpdatePopupContentToPopup') {
        return await sendUpdatePopupContentToPopupListener(request, sender, sendResponse)

    }
    sendResponse({ status: "ko", content: 'unknown action' });
}

function sendUpdatePopupContentToPopupListener(request, sender, sendResponse) {
    console.log('sendUpdatePopupContentToPopupListener popup.js', request);

    pageContentsAsDocument = request.content;
    messageDiv.innerHTML = '';
    sendResponse({ status: "ok", content: 'got doc text' });

    continueSearch();
}

function continueSearch() {
    const searchText = searchInput.value;

    if (!pageContentsAsDocument) {
        resultsDiv.innerHTML = ' что-то не так, не нашел текст на странице';
        return;
    }
    indices = searcher.searchCaseInsensitive(pageContentsAsDocument, searchText);

    presenter.showResults(indices, pageContentsAsDocument);
}
