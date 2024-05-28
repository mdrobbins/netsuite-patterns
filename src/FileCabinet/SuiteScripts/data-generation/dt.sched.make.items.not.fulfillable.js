/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define(['N/log', 'N/query', 'N/record', 'N/runtime'], function (log, query, record, runtime) {
    function execute(context) {
        const allItemIds = getItemIds();

        allItemIds.forEach((id, index) => {
            try {
                record.submitFields({
                    type: record.Type.NON_INVENTORY_ITEM,
                    id: id,
                    values: {
                        'isfulfillable': false
                    }
                });

                runtime.getCurrentScript().percentComplete = ((index + 1) / allItemIds.length * 100).toFixed(2);
            } catch (ex) {
                log.error({ title: `Unable to update item: ${id}`, details: ex.message });
            }
        });
    }

    function getItemIds() {
        return query.runSuiteQL({
            query: `SELECT id FROM item WHERE isinactive = 'F' AND isfulfillable = 'T'`
        }).asMappedResults()
            .map(i => i.id);
    }

    return {
        execute
    };
});