const messageDiv = document.getElementById('message');

const searchInput = document.getElementById('search-query-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('search-results');
let pageContentsAsDocument = null;


console.log = function (arg){
    resultsDiv.innerHTML = String(arg)
}


searchButton.addEventListener('click', handleSearchButtonClick);

async function handleSearchButtonClick() {
    console.log('handleSearchButtonClick');
    let pageText;

    pageText = await getPageContentsAsDocument();
}




// Функция поиска без учета регистра
function searchCaseInsensitive(haystack, needle) {
    const lowerHaystack = haystack.toLowerCase();
    const lowerNeedle = needle.toLowerCase();
    const indices = [];
    let index = -1;

    while ((index = lowerHaystack.indexOf(lowerNeedle, index + 1)) !== -1) {
        indices.push(index);
    }

    return indices;
}

// Функция поиска по регулярному выражению
function searchRegex(haystack, regex) {
    const indices = [];
    let match;
    const re = new RegExp(regex, 'g');

    while ((match = re.exec(haystack)) !== null) {
        indices.push(match.index);
    }

    return indices;
}

// Функция отображения результатов
function showResults(indices, originalText) {
    const resultsHTML = getHtmlResults(indices, originalText);
    resultsDiv.innerHTML = resultsHTML;
}

// Функция получения HTML-разметки для результатов
function getHtmlResults(indices, originalText) {
    let resultHtml = '';
    const contextLength = 20;

    for (const index of indices) {
        const startIndex = Math.max(0, index - contextLength);
        const endIndex = Math.min(index + contextLength, originalText.length);
        const context = '...' + originalText.substring(startIndex, endIndex) + '...';
        const highlightedContext = context.replace(new RegExp(searchInput.value, 'g'), '<span class="highlight">$&</span>');
        resultHtml += highlightedContext + '<br>';
    }

    return resultHtml;
}



function continueSearch() {
    const searchText = searchInput.value;

    if (!pageContentsAsDocument) {
        resultsDiv.innerHTML = ' что-то не так, не нашел текст на странице';
        return;
    }
    indices = searchCaseInsensitive(pageContentsAsDocument, searchText);

    showResults(indices, pageContentsAsDocument);
}

function sendUpdatePopupContentToPopupListener(request, sender, sendResponse) {
    console.log('sendUpdatePopupContentToPopupListener popup.js', request);

    pageContentsAsDocument = request.content;
    messageDiv.innerHTML = 'success';
    sendResponse({ status: "ok", content: 'got doc text' });



    continueSearch();
}

async function getPageContentsAsDocument() {
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


function getActiveTabDocumentListener(request, sender, sendResponse) {
    console.log('onMessage in popup.js', request);

    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    if (request.action === "sendUpdatePopupContentToPopup") {
        console.log('getting sendUpdatePopupContentToPopup in popup.js');

        console.log('getting page in popup.js', request.content);
        pageContentsAsDocument = request.content
        sendResponse({ status: "ok" });
        return;
    }

    sendResponse({ status: "ko", content: 'unknown action' });
}

async function onMessageListener(request, sender, sendResponse) {
    console.log('onMessageListener popup.js');

    let listener = actionToFunctionMap[request.action];
    if (listener) {
        listener(request, sender, sendResponse);
        return
    }
    sendResponse({ status: "ko", content: 'unknown action' });
}

async function onMessageExternalListener(request, sender, sendResponse) {
    console.log('onMessageExternalListener popup.js');

    let listener = actionToFunctionMap[request.action];
    if (listener) {
        listener(request, sender, sendResponse);
        return
    }
    sendResponse({ status: "ko", content: 'unknown action' });
}


const actionToFunctionMap = {
    'getActiveTabDocument': getActiveTabDocumentListener,
    'sendUpdatePopupContentToPopup': sendUpdatePopupContentToPopupListener,
};

chrome.runtime.onMessageExternal.addListener(onMessageExternalListener);
chrome.runtime.onMessage.addListener(onMessageListener);
