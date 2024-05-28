require(['N/search', 'N/record']);
var search = require('N/search');
var record = require('N/record');

search.create({ type: 'customer', filters: [[ 'isinactive', 'is', 'F' ]] })
    .run()
    .getRange({ start: 0, end: 1000 })
    .forEach(function(result) {
        record.submitFields({
            type: 'customer',
            id: result.id,
            values: {
                'isinactive': true
            }
        });

        return true;
    });

