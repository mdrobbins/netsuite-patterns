/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/log', 'N/runtime'], function (log, runtime) {
    /**
     * @governance 0
     * @param context
     */
    function setCustomForm(context) {
        const transaction = context.newRecord;
        const script = runtime.getCurrentScript();

        if (!isTargetRecord(context)) {
            return;
        }

        const customFormId = script.getParameter({
            name: 'custscript_dt_intl_customform'
        });

        transaction.setValue({
            fieldId: 'customform',
            value: customFormId
        });
    }

    function isTargetRecord(context) {
        const event = context.type;
        const script = runtime.getCurrentScript();

        const subsidiaryId = context.newRecord.getValue({
            fieldId: 'subsidiary'
        });

        const internationalSubsidiaryIds = script.getParameter({
            name: 'custscript_dt_intl_subsidiries'
        });

        return event !== context.UserEventType.CREATE
            && !internationalSubsidiaryIds.includes(subsidiaryId)
    }

    return {
        setCustomForm
    };
});