import * as dataStructure from './data-structure.js';
import * as messageSender from './message-sender.js';
import * as popup from './popup.js';
import * as presenter from './presenter.js';
import * as searcher from './searcher.js';




export class Extension {
    constructor() {
        this.dataStructure = new dataStructure.DataStructure(document);
        this.messageSender = new messageSender.MessageSender(this.dataStructure);
        this.popup = new popup.Popup(this.dataStructure, this.getOnClickHander(this));
        this.searcher = new searcher.Searcher();
        this.presenter = new presenter.Presenter(this.dataStructure.resultsDiv);
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

            ext.presenter.renderResultsOnPage(
                ext.dataStructure.foundSubstringStartIndices, 
                ext.dataStructure.pageContentsAsDocument
                );
        };
    }
}

