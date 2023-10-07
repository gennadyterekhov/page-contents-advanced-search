export class DataStructure {
    constructor(document) {
        this.caseInsensitiveCheckbox = document.getElementById('case-insensitive-checkbox');
        this.regexCheckbox = document.getElementById('treat-as-regex-checkbox');
        this.acrossLinksCheckbox = document.getElementById('across-links-only-checkbox');
        this.searchInput = document.getElementById('search-query-input');
        this.searchButton = document.getElementById('search-button');
        this.resultsDiv = document.getElementById('search-results');
        this.messageDiv = document.getElementById('message');
        this.linksText = '';
        this.pageContentsAsDocument = null;
        this.linksExist = true;
        this.isLoading = false;
        this.foundSubstringStartIndices = [];
    }
}
