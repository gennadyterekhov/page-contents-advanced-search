class Extension {
    constructor() {
        this.dataStructure = new DataStructure(document);
        this.popup = new Popup(this.dataStructure, this.handleSearchButtonClick);
        this.searcher = new Searcher();
        this.presenter = new Presenter(this.dataStructure.resultsDiv);
    }

    startApp() {
        console.log('app started');
    }

    async handleSearchButtonClick() {
        if (!this.dataStructure.pageContentsAsDocument) {
            this.dataStructure.pageContentsAsDocument = await this.popup.getPageContentsAsDocument();
        }
        this.dataStructure.foundSubstringStartIndices = this.searcher.startSearch(
            this.dataStructure.searchInput.value,
            this.dataStructure.pageContentsAsDocument
        );

        this.presenter.renderResultsOnPage(this.dataStructure.foundSubstringStartIndices);
    }
}

let ext = new Extension();
ext.startApp();
