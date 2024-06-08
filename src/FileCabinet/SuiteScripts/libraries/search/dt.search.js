/**
 *  @NAPIVersion 2.1
 *  @NModuleScope Public
 */

define(['N/search'], function (search) {
    function getOne(options) {
        const results = search.create(options)
            .run()
            .getRange({ start: 0, end: 1 });

        return results.length > 0 ? results[0] : null;
    }

    function hasAny(options) {
        return search.create(options)
            .run()
            .getRange({ start: 0, end: 1 })
            .length > 0;
    }

    function getAll(options) {
        let results = [];

        const pageData = search.create(options)
            .runPaged({ pageSize: 1000 });

        pageData.pageRanges
            .forEach(function(pageRange) {
                const page = pageData.fetch({ index: pageRange.index });
                results = results.concat(page.data);
            });

        return results;
    }

    return {
        ...search,
        getOne,
        hasAny,
        getAll,
    };
});
