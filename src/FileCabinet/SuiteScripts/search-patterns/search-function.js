/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/log', 'N/search'], function (log, search) {
  function getOverdueInvoices() {
    const results = search.create({
        type: 'invoice',
        filters: [
            ['mainline', 'is', 'T'],
            'and', ['duedate', 'before', 'today'],
            'and', ['amountremaining', 'greaterthan', 0]
        ],
        columns: [
            'tranid',
            'trandate',
            'entity',
            'customer.companyname',
            { name: 'amountremaining', sort: search.Sort.ASC }
        ]
    }).run().getRange({ start: 0, end: 1000 });

    return (results || []).map(result => ({
        number: result.getValue('tranid'),
        date: result.getValue('trandate'),
        amountRemaining: Number(result.getValue('amountremaining')),
        customerId: Number(result.getValue('entity')),
        companyName: result.getValue({ name: 'companyname', join: 'customer' })
    }));
  }

  return {
    getOverdueInvoices
  };
});