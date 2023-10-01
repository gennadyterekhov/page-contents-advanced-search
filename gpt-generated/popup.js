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

searchButton.addEventListener('click', handleSearchButtonClick);
chrome.runtime.onMessage.addListener(onMessageListener);
caseInsensitiveCheckbox.addEventListener('change', toggleCaseInsensitive);
regexCheckbox.addEventListener('change', toggleRegex);
searchButton.addEventListener('click', handleSearchButtonClick);

function toggleCaseInsensitive() {
    caseInsensitiveCheckbox.checked = !caseInsensitiveCheckbox.checked;
    if (caseInsensitiveCheckbox.checked) {
        regexCheckbox.checked = false;
    }
}

function toggleRegex() {
    regexCheckbox.checked = !regexCheckbox.checked;
    if (regexCheckbox.checked) {
        caseInsensitiveCheckbox.checked = false;
    }
}

function toggleAcrossLinks() {
    acrossLinksCheckbox.checked = !acrossLinksCheckbox.checked;
}

function getAllLinks() {
    const links = document.getElementsByTagName('a');
    const linkArray = Array.from(links);
    return linkArray.map(link => link.href);
}

// Функция получения текста всех ссылок
function getLinksText() {
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
