/**
 *  @NAPIVersion 2.1
 *  @NModuleScope Public
 */

define(['N/search'], function (search) {
    function getAll(options) {
        const searchResult = search.create(options).run();
        return getAllResults(searchResult);
    }

    function getOne(options) {
        return search.create(options).run().getRange({ start: 0, end: 1 });
    }

    function hasAny(options) {
        return getOne(options).length > 0;
    }

    function getAllResults(resultSet) {
        let batch, batchResults, results = [], searchStart = 0;
        if (!resultSet.getRange) {
            resultSet = resultSet.run();
        }

        do {
            batch = resultSet.getRange({ start: searchStart, end: searchStart + 1000} );
            batchResults = (batch || []).map(function (row) {
                searchStart++;
                return row;
            }, this);
            results = results.concat(batchResults);
        } while ((batchResults || []).length === 1000);

        return results;
    }

    return {
        ...search,
        getAll,
        getOne,
        hasAny,
    };
});
