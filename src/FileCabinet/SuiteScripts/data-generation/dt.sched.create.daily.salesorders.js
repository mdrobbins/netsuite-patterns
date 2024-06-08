/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define([
    'N/log',
    'N/record',
    'N/runtime',
    '../libraries/thirdParty/moment',
    '../libraries/dt.random'
], function (log, record, runtime, moment, random) {
    function execute(context) {
        const yearIncrease = getYearIncrease(moment());
        const customerIds = random.getRandomCustomerIds(10 + yearIncrease);
        const script = runtime.getCurrentScript();

        customerIds.forEach(function(customerId, index) {
            const itemIds = random.getRandomItemIdsForOrder(10 + yearIncrease);
            const orderId = createOrder(customerId, itemIds);

            billOrder(orderId);

            const percentComplete = ((index + 1) / customerIds.length * 100).toFixed(2);
            script.percentComplete = percentComplete;
        });
    }

    function createOrder(customerId, itemIds) {
        log.audit({ title: 'creating order', details: `Creating order for Customer ${customerId} with ${itemIds.length} items` });

        const order = record.create({
            type: 'salesorder',
        }).setValue({
            fieldId: 'entity',
            value: customerId
        });

        itemIds.forEach((item, index) => {
            const quantity = random.getRandomNumberBetween(5, 25);

            order.setSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: item,
                line: index
            }).setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: quantity,
                line: index
            }).setSublistValue({
                sublistId: 'item',
                fieldId: 'taxcode',
                value: -7,
                line: index
            })
        });

        return order.save();
    }

    function billOrder(orderId) {
        record.transform({
            fromType: record.Type.SALES_ORDER,
            fromId: orderId,
            toType: record.Type.INVOICE
        }).save();
    }

    function getYearIncrease(orderDate) {
        const year = moment(orderDate).year();
        const increase = year - 2020;

        return increase * 3;
    }

    return {
        execute
    };
});