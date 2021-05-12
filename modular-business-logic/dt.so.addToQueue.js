/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/log',
    'N/record',
    '../libraries/dt.safeExecute'
], function (log, record, safeExecute) {
    /**
     * @governance 6
     * @param context
     */
    function addToQueue(context) {
        const queueRecord = record.create({
            type: 'customrecord_dt_q'
        }).setValue({
            fieldId: 'custrecord_q_record_type',
            value: context.newRecord.type
        }).setValue({
            fieldId: 'custrecord_q_record_id',
            value: context.newRecord.id
        }).setValue({
            fieldId: 'custrecord_q_event',
            value: context.type
        }).setValue({
            fieldId: 'custrecord_q_action',
            value: 'sync'
        });

        safeExecute(queueRecord.save());
    }

    return {
        addToQueue
    };
});