/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope Public
 */
define([
    'N/log',
    './dt.so.addToQueue',
    './dt.so.setCustomBilling',
    './dt.so.setCustomForm'
], function (log, addToQueue, setCustomBilling, setCustomForm) {
    /**
     * @governance 0
     * @param context
     */
    function beforeLoad(context) {
        setCustomForm(context);
    }

    /**
     * @governance 0
     * @param context
     */
    function beforeSubmit(context) {
        setCustomBilling(context);
    }

    /**
     * @governance 6
     * @param context
     */
    function afterSubmit(context) {
        addToQueue(context);
    }

    return {
        beforeLoad,
        beforeSubmit,
        afterSubmit
    };
});