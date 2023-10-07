class Searcher {

    startSearch(searchText, pageContentsAsDocument) {
        if (!pageContentsAsDocument) {
            return [];
        }
        let indices = [];
        if (caseInsensitiveCheckbox.checked) {
            indices = this.searchCaseInsensitive(pageContentsAsDocument, searchText);
        } else {
            indices = this.searchCaseSensitive(pageContentsAsDocument, searchText);
        }
        if (regexCheckbox.checked) {
            indices = this.searchRegex(pageContentsAsDocument, searchText);
        }
        return indices;
    }

    searchCaseInsensitive(haystack, needle) {
        const lowerHaystack = haystack.toLowerCase();
        const lowerNeedle = needle.toLowerCase();
        const indices = [];
        let index = -1;

        while ((index = lowerHaystack.indexOf(lowerNeedle, index + 1)) !== -1) {
            indices.push(index);
        }

        return indices;
    }

    searchCaseSensitive(haystack, needle) {
        const indices = [];
        let index = -1;

        while ((index = haystack.indexOf(needle, index + 1)) !== -1) {
            indices.push(index);
        }

        return indices;
    }

    searchRegex(haystack, regex) {
        const indices = [];
        let match;
        const re = new RegExp(regex, 'g');

        while ((match = re.exec(haystack)) !== null) {
            indices.push(match.index);
        }

        return indices;
    }
}




