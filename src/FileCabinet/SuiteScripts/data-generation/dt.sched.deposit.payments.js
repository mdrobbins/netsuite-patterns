/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define(['N/log', 'N/record'], function (log, record) {
    function execute(context) {
        const CHECKING = 1;

        const deposit = record.create({
            type: record.Type.DEPOSIT,
        }).setValue({
            fieldId: 'account',
            value: CHECKING
        });

        const paymentCount = deposit.getLineCount({
            sublistId: 'payment'
        });

        for (let i = 0; i < paymentCount; i++) {
            deposit.setSublistValue({
                sublistId: 'payment',
                fieldId: 'deposit',
                value: true,
                line: i
            });
        }

        deposit.save();
    }

    return {
        execute
    };
});