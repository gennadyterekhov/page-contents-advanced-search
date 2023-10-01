class Presenter {
    constructor(resultsDiv) {
        this.resultsDiv = resultsDiv;
    }

    showResults(indices, originalText) {
        const resultsHTML = this.getHtmlResults(indices, originalText);
        this.resultsDiv.innerHTML = resultsHTML;
    }


    getHtmlResults(indices, originalText) {
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
}
