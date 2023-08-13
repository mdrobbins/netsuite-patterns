// noinspection SqlResolve,SqlNoDataSourceInspection

/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope Public
 */
define(['N/log', 'N/query', './dt.mapReduceHelper'], function (log, query, helper) {
    function getInputData(context) {
        return query.runSuiteQL({
            query: `
                select c.id, 
                       c.companyname, 
                       c.overduebalancesearch, 
                       t.tranid, 
                       t.recordtype, 
                       BUILTIN.DF(t.status)
                from customer c
                inner join transaction t on c.id = t.entity
                where c.overduebalancesearch > 0
            `
        }).asMappedResults();
    }

    function map(context) {
        const data = helper.getStageData(context);
        log.debug({ title: 'data', details: data });

        if (data.tranid === '51') {
            throw "This is an example error to be logged in the summarize function.";
        }

        context.write({
            key: data.id,
            value: data
        });
    }

    function reduce(context) {
        const data = helper.getStageData(context);
        log.debug({ title: 'data', details: data });

    }

    function summarize(context) {
        helper.logErrors(context);
    }

    return {
        getInputData,
        map,
        reduce,
        summarize
    };
});