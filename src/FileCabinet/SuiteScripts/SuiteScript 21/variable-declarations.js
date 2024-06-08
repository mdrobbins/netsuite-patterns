// noinspection ES6ConvertVarToLetConst,JSDuplicatedDeclaration

/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope Public
 */
define(['N/log', 'N/record', 'N/search', 'N/ui/message'], function (log, record, search, message) {
  function beforeLoad(context) {
      var type = context.type;

      if (type === context.UserEventType.CREATE) {
          var newRecord = context.newRecord;
          var createdFromId = newRecord.getValue({ fieldId: 'createdfrom' });

          var createdFromValues = search.lookupFields({
              type: 'transaction',
              id: createdFromId,
              columns: ['type', 'tranid', 'internalid']
          });

          var type = createdFromValues['type'];

          if (type === record.Type.SALES_ORDER) {
              var createdFromNumber = createdFromValues['tranid'];
              var createdFromInternalId = createdFromValues['internalid'];

              var form = context.form;

              form.addPageInitMessage({
                  type: message.Type.INFORMATION,
                  title: 'Source Document',
                  message: 'This document was sourced from Sales Order <a href="/app/accounting/transactions/ransaction.nl?id=' + createdFromInternalId + '120">' + createdFromNumber + '</a>.'
              });
          }
      }
  }

  return {
    beforeLoad: beforeLoad
  };
});