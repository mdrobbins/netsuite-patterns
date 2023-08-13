/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/log', './dt.search'], function (log, search) {
    /**
     * Can call search.create() just like the default module
     * @returns {{companyName: *, id: *}[]}
     */
    function getAllCompanyNames() {
        const results = search.create({
            type: search.Type.CUSTOMER,
            columns: [
                'companyname'
            ]
        }).run().getRange({ start: 0, end: 1000 });

        return (results || []).map(function (result) {
            return {
                id: result.id,
                companyName: result.getValue({ name: 'companyname' })
            };
        });
    }

    /**
     * search.getAll() will page through all results and return them as a single array
     * @returns {{companyName: *, id: *}[]}
     */
    function getgetAllCompanyNames2() {
        const results = search.getAll({
            type: 'search.Type.CUSTOMER',
            columns: []
        });

        return (results || []).map(function (result) {
            return {
                id: result.id,
                companyName: result.getValue({ name: 'companyname' })
            };
        });
    }

    /**
     *  Returns the first record matching the filter criteria
     * @returns {*}
     */
    function getConfigRecord() {
        const result = search.getOne({
            type: 'customrecord_dt_cfg',
            filters: [
                'isinactive', 'is', 'F',
                'and', ['custrecord_dt_cfg_is_default', 'is', 'T']
            ],
            columns: [
                'custrecord_dt_cfg_permission',
                'custrecord_dt_cfg_level'
            ]
        });

        return (result || []).map(function (result) {
            return {
                permission: result.getValue({ name: 'custrecord_dt_cfg_permission' }),
                level: result.getValue({ name: 'custrecord_dt_cfg_level' })
            };
        })[0];
    }

    /**
     * Returns true or false regarding whether a customer has open invoices or not
     * @param customerId
     * @returns {boolean}
     */
    function hasOpenInvoices(customerId) {
        const OPEN = 'CustInvc:A';

        return search.hasAny({
            type: search.Type.INVOICE,
            filters: [
                ['entity', 'is', customerId],
                'and', ['status', 'anyof', OPEN]
            ]
        });
    }

    return {
        getAllCompanyNames,
        getgetAllCompanyNames2,
        getConfigRecord,
        hasOpenInvoices
    };
});