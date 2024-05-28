/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope Public
 */
define([
    'N/log',
    'N/query',
    'N/record',
    'N/search',
    '../libraries/dt.random'
], function (log, query, record, search, random) {
    function getInputData(context) {
        const invoiceIds = query.runSuiteQL({
            query: `
                select
                    t.id
                from transaction t
                where 1 = 1
                    and t.recordtype = 'invoice'
                    and t.trandate < SYSDATE - 30
            `
        }).asMappedResults()
            .map(i => i.id);

        const numberToPay = Math.ceil(invoiceIds.length * .2);

        return random.chooseRandom(invoiceIds, numberToPay);
    }

    function reduce(context) {
        const CHECK = 2;

        const invoiceId = JSON.parse(context.values[0]);

        record.transform({
            fromType: record.Type.INVOICE,
            fromId: invoiceId,
            toType: record.Type.CUSTOMER_PAYMENT
        }).setValue({
            fieldId: 'paymentmethod',
            value: CHECK
        }).save();
    }

    function summarize(context) {
        context.mapSummary.errors.iterator().each(function (key, error) {
            log.error({ title: 'map: ' + key, details: error });
        });

        context.reduceSummary.errors.iterator().each(function (key, error) {
            log.error({ title: 'reduce: ' + key, details: error });
        });
    }

    return {
        getInputData,
        reduce,
        summarize
    };
});