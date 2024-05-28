/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/cache', 'N/log', 'N/query'], function (cache, log, query) {

    function getRandomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function chooseRandom(arr, num = 1) {
        const selected = [];

        for (let i = 0; i < num;) {
            const random = Math.floor(Math.random() * arr.length);

            if (selected.indexOf(arr[random]) !== -1) {
                continue;
            }

            selected.push(arr[random]);

            i++;
        }

        return selected;
    }

    function getRandomCustomerIds(count = 10) {
        const allCustomerIds = getCustomerIdsFromCache();

        const randomNumberOfCustomers = getRandomNumberBetween(1, count);

        return chooseRandom(allCustomerIds, randomNumberOfCustomers);
    }

    function getCustomerIdsFromCache() {
        const orderGenerationCache = cache.getCache({
            name: 'orderGeneration',
            scope: cache.Scope.PUBLIC
        });

        const customerIds = orderGenerationCache.get({
            key: 'allCustomerIds',
            loader: getAllCustomerIds
        });

        return JSON.parse(customerIds);
    }

    function getAllCustomerIds() {
        log.debug({ title: 'querying customer ids', details: 'customer ids not found in cache, loading...' });
        return query.runSuiteQL({
            query: `SELECT * FROM customer WHERE isinactive = 'F'`
        }).asMappedResults()
            .map(c => c.id);
    }

    function getRandomItemIdsForOrder(count = 15) {
        const itemIds = getItemIdsFromCache();
        const itemCount = getRandomNumberBetween(1, count);

        return chooseRandom(itemIds, itemCount);
    }

    function getItemIdsFromCache() {
        const itemCache = cache.getCache({
            name: 'orderGeneration',
            scope: cache.Scope.PUBLIC
        });

        const itemIds = itemCache.get({
            key: 'allItemIds',
            loader: getItemIds
        });

        return JSON.parse(itemIds);
    }

    function getItemIds() {
        log.debug({ title: 'querying item ids', details: 'item ids not found in cache, loading...' });
        return query.runSuiteQL({
            query: `SELECT id FROM item WHERE isinactive = 'F'`
        }).asMappedResults()
            .map(i => i.id);
    }

    return {
        getRandomNumberBetween,
        chooseRandom,
        getRandomCustomerIds,
        getRandomItemIdsForOrder,
    };
});