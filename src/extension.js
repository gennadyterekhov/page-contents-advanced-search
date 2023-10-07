export class Extension {
    constructor() {
        this.dataStructure = new DataStructure(document);
        this.messageSender = new MessageSender(this.dataStructure);
        this.popup = new Popup(this.dataStructure, this.getOnClickHander(this));
        this.searcher = new Searcher();
        this.presenter = new Presenter(this.dataStructure.resultsDiv);
    }

    startApp() {
        console.log('app started');
    }

    getOnClickHander(ext) {
        return async function () {
            if (!ext.dataStructure.pageContentsAsDocument) {
                ext.dataStructure.pageContentsAsDocument = await ext.messageSender.getPageContentsAsDocument();
            }
            ext.dataStructure.foundSubstringStartIndices = ext.searcher.startSearch(
                ext.dataStructure.searchInput.value,
                ext.dataStructure.pageContentsAsDocument
            );

            ext.presenter.renderResultsOnPage(ext.dataStructure.foundSubstringStartIndices);
        };
    }
}

