export class Presenter {
    constructor(resultsDiv) {
        this.resultsDiv = resultsDiv;
    }

    renderResultsOnPage(foundSubstringStartIndices, pageContentsAsDocument) {
        console.log('renderResultsOnPage', foundSubstringStartIndices);
        this.showResults(foundSubstringStartIndices, pageContentsAsDocument)
    }

    showResults(indices, originalText) {
        const resultsHTML = this.getHtmlResults(indices, originalText);
        this.resultsDiv.innerHTML = resultsHTML;
    }


    getHtmlResults(indices, originalText) {
        let resultHtml = '';
        const contextLength = 15;

        const startSpan = '<span style="display:inline;">';
        const endSpan = '</span>';

        for (const index of indices) {
            const startIndex = Math.max(0, index - contextLength);
            const endIndex = Math.min(index + searchInput.value.length + contextLength, originalText.length);
            const leftContext = '<code>...' + originalText.substring(startIndex, index) + '</code>';
            const rightContext = '<code>' + originalText.substring(index + searchInput.value.length, endIndex) + '...</code>';

            const highlightedNeedle = `<b>${searchInput.value}</b>`;

            const highlightedContext = startSpan + leftContext + highlightedNeedle + rightContext + endSpan;
            resultHtml += highlightedContext + '<br>';
        }

        return resultHtml;
    }
}
