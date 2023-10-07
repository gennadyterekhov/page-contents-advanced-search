export class Popup {
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
}




