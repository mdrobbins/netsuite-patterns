/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/log',
    'N/record',
    'N/runtime',
    '../libraries/dt.safeExecute'
], function (log, record, runtime, safeExecute) {
    /**
     * @governance 6
     * @param context
     */
    function addToQueue(context) {
        const allowedEventTypes = [
            context.UserEventType.CREATE,
            context.UserEventType.EDIT,
            context.UserEventType.XEDIT,
        ]

        if (!allowedEventTypes.includes(context.type)) {
            return;
        }

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