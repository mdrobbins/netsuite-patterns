/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope Public
 */
define([
    'N/cache',
    'N/log',
    'N/query',
    'N/record',
    '../libraries/thirdParty/moment',
    '../libraries/dt.random'
], function (cache, log, query, record, moment, random) {
    function getInputData(context) {
        const periods = [{ id: 327, startDate: '1/1/2022', endDate: '5/28/2024' }];

        return periods;
    }

    function map(context) {
        const { startDate, endDate } = JSON.parse(context.value);

        const start = moment(startDate);
        const end  = moment(endDate);

        while(start.isSameOrBefore(end)) {
            context.write({
                key: start.unix(),
                value: start.unix()
            });

            start.add(1, 'days');
        }
    }

    function reduce(context) {
        const timestamp = JSON.parse(context.values[0]);
        const orderDate = moment.unix(timestamp);

        const yearIncrease = getYearIncrease(orderDate);

        const customerIds = random.getRandomCustomerIds(10 + yearIncrease);

        log.audit({ title: 'Creating Orders', details: `Creating ${customerIds.length} orders for ${orderDate.format('YYYY-MM-DD')}` });

        customerIds.forEach((customerId) => {
            const itemIds = random.getRandomItemIdsForOrder(15 + yearIncrease);

            const orderId = createOrder(orderDate, customerId, itemIds);

            const invoiceId = billOrder(orderDate, orderId);

            payInvoice(orderDate, invoiceId);
        });
    }

    function summarize(context) {

        context.mapSummary.errors.iterator().each(function (key, error) {
            log.error({ title: 'map: ' + key, details: error });
        });

        context.reduceSummary.errors.iterator().each(function (key, error) {
            log.error({ title: 'reduce: ' + key, details: error });
        });
    }

    //////////////////////////////////////////////

    function createOrder(date, customerId, itemIds) {
        const order = record.create({
            type: 'salesorder',
        }).setValue({
            fieldId: 'entity',
            value: customerId
        }).setValue({
            fieldId: 'trandate',
            value: date.toDate()
        });

        itemIds.forEach((item, index) => {
            const NOT_TAXABLE = -7;
            const yearIncrease = getYearIncrease(date);
            const quantity = random.getRandomNumberBetween(5, 25 + yearIncrease);

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
                value: NOT_TAXABLE,
                line: index
            })
        });

        return order.save();
    }

    function billOrder(orderDate, orderId) {
        return record.transform({
            fromType: record.Type.SALES_ORDER,
            fromId: orderId,
            toType: record.Type.INVOICE
        }).setValue({
            fieldId: 'trandate',
            value: orderDate.toDate()
        }).save();
    }

    function payInvoice(orderDate, invoiceId) {
        const CHECK = 2;
        const chanceToPay = random.getRandomNumberBetween(1, 100);

        if (chanceToPay < 15) {
            return;
        }

        const daysToPay = random.getRandomNumberBetween(25, 55);
        const paymentDate = moment(orderDate).add(daysToPay, 'days');

        return record.transform({
            fromType: record.Type.INVOICE,
            fromId: invoiceId,
            toType: record.Type.CUSTOMER_PAYMENT
        }).setValue({
            fieldId: 'trandate',
            value: paymentDate.toDate()
        }).setValue({
            fieldId: 'paymentmethod',
            value: CHECK
        }).save();
    }

    function getYearIncrease(orderDate) {
        const year = moment(orderDate).year();
        const increase = year - 2020;

        return increase * 3;
    }

    return {
        map,
        getInputData,
        reduce,
        summarize
    };
});