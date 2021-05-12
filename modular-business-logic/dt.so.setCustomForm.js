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
        const event = context.type;
        const transaction = context.newRecord;
        const script = runtime.getCurrentScript();

        if (event !== context.UserEventType.CREATE) {
            return;
        }

        const customFormId = script.getParameter({
            name: 'custscript_dt_intl_customform'
        });

        const internationalSubsidiaryIds = script.getParameter({
            name: 'custscript_dt_intl_subsidiries'
        });

        const subsidiaryId = transaction.getValue({ fieldId: 'subsidiary' });

        if (!internationalSubsidiaryIds.includes(subsidiaryId)) {
            return;
        }

        transaction.setValue({
            fieldId: 'customform',
            value: customFormId
        });
    }

    return {
        setCustomForm
    };
});