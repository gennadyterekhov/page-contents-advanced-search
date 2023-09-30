// Глобальные переменные для элементов из HTML
const caseInsensitiveCheckbox = document.getElementById('case-insensitive-checkbox');
const regexCheckbox = document.getElementById('treat-as-regex-checkbox');
const acrossLinksCheckbox = document.getElementById('across-links-only-checkbox');
const searchInput = document.getElementById('search-query-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('search-results');
let linksText = '';
let pageContentsAsText = '';
let pageContentsAsDocument;
let linksExist = true;

let isLoading = false;

// Функции изменения состояния чекбоксов
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

// Функция получения массива всех ссылок на текущей странице
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

// Функция поиска с учетом регистра
function searchCaseSensitive(haystack, needle) {
    const indices = [];
    let index = -1;

    while ((index = haystack.indexOf(needle, index + 1)) !== -1) {
        indices.push(index);
    }

    return indices;
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

// Обработчик нажатия на кнопку поиска
function handleSearchButtonClick() {
    const caseInsensitive = caseInsensitiveCheckbox.checked;
    const regex = regexCheckbox.checked;
    const acrossLinks = acrossLinksCheckbox.checked;
    const searchText = searchInput.value;
    let indices = [];

    if (acrossLinks) {
        const linksText = getLinksText();
        if (!linksText) {
            resultsDiv.innerHTML = '';
            return;
        }
        indices = searchCaseInsensitive(linksText, searchText);
    } else {
        const pageText = getPageContentsAsText();
        if (!pageText) {
            resultsDiv.innerHTML = '';
            return;
        }

        if (regex) {
            indices = searchRegex(pageText, searchText);
        } else if (caseInsensitive) {
            indices = searchCaseInsensitive(pageText, searchText);
        } else {
            indices = searchCaseSensitive(pageText, searchText);
        }
    }

    showResults(indices, pageText);
}

// Назначаем обработчики событий
caseInsensitiveCheckbox.addEventListener('change', toggleCaseInsensitive);
regexCheckbox.addEventListener('change', toggleRegex);
searchButton.addEventListener('click', handleSearchButtonClick);


// below is human generated code

async function getPageContentsAsText() {
    if (pageContentsAsText !== '') {
        return pageContentsAsText;
    }
    const doc = await getPageContentsAsDocument();
    pageContentsAsText = doc.innerHTML;
    return pageContentsAsText;
}

async function getPageContentsAsDocument() {
    isLoading = true;
    if (pageContentsAsDocument !== null || pageContentsAsDocument !== undefined) {
        return pageContentsAsDocument;
    }
    const response = await chrome.runtime.sendMessage({ action: "getActiveTabContent" });
    console.log(response);
    pageContentsAsDocument = response;
    isLoading = false;
    return response;
}



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.action === "updatePopupContent") {
            console.log('getting page in popup.js', request.content);
            pageContentsAsDocument = request.content
            sendResponse({ status: "ok" });
        }
    }
);
