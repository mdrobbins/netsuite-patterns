require(['N/search', 'N/record']);
var search = require('N/search');
var record = require('N/record');

search.create({
    type: 'item',
    filters: [[ 'isinactive', 'is', 'F' ], 'and', ['salesdescription', 'isempty', null]],
    columns: [
        'displayname'
    ]
})
    .run()
    .getRange({ start: 0, end: 1000 })
    .forEach(function(result) {
        const displayName = result.getValue({ name: 'displayname' });

        record.submitFields({
            type: record.Type.NON_INVENTORY_ITEM,
            id: result.id,
            values: {
                'salesdescription': displayName
            }
        });

        return true;
    });

