/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([], function () {
    /**
     * @governance 0
     * @param context
     */
    function setCustomBilling(context) {
        const PENDING_APPROVAL = 'A';
        const event = context.type;
        const transaction = context.newRecord;
        const termInYears = transaction.getValue({ fieldId: 'custbody_dt_term_in_years' });

        if (event !== context.UserEventType.CREATE || isInt(termInYears)) {
            return;
        }

        transaction.setValue({
            fieldId: 'custrecord_dt_custom_billing',
            value: true
        }).setValue({
            fieldId: 'orderstatus',
            value: PENDING_APPROVAL
        });
    }

    function isInt(num) {
        return num === Math.floor(num);
    }

    return {
        setCustomBilling
    };
});