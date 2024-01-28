/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define([
    'N/https',
    'N/log',
    'N/runtime',
    'N/ui/serverWidget',
    './dt.igdb.client'
], function (https, log, runtime, ui, igdb) {
    function onRequest(context) {
        const { request, response } = context;

        const form = buildForm(context);

        if (request.method === 'POST') {
            const searchTerm = request.parameters['custpage_search_term'];
            const results = igdb.searchGames(searchTerm);

            showResults(form, results);
        }

        response.writePage(form);
    }

    //////////////////////////////////////

    function buildForm(context) {
        const form = ui.createForm({ title: 'Search for Games' });
        form.addSubmitButton({ label: 'Find Games' });

        const searchTerm = context.request.parameters['custpage_search_term'];

        form.addField({
            id: 'custpage_search_term',
            type: ui.FieldType.TEXT,
            label: 'Search Term',
        }).defaultValue = searchTerm;

        buildSublist(form);

        return form;
    }

    function buildSublist(form) {
        const sublist = form.addSublist({
            id: 'custpage_results',
            label: 'Results',
            type: ui.SublistType.LIST
        });

        const columns = [
            { id: 'custpage_cover', type: ui.FieldType.TEXT, label: 'Cover' },
            { id: 'custpage_name', type: ui.FieldType.TEXT, label: 'Name' },
            { id: 'custpage_genre', type: ui.FieldType.TEXT, label: 'Genre' },
            { id: 'custpage_platforms', type: ui.FieldType.TEXT, label: 'Platforms' },
            { id: 'custpage_release_date', type: ui.FieldType.DATE, label: 'Release Date' },
            { id: 'custpage_critic_rating', type: ui.FieldType.FLOAT, label: 'Critic Rating' },
            { id: 'custpage_user_rating', type: ui.FieldType.FLOAT, label: 'User Rating' },
        ]

        columns.forEach(sublist.addField);
    }

    function showResults(form, results) {
        if (!Array.isArray(results)) {
            return;
        }

        let data = results.sort(byTextProperty('name'));

        const sublist = form.getSublist({
            id: 'custpage_results'
        });

        data.forEach((row, line) => {
            const columns = [
                { id: 'custpage_cover', value: row.coverImage, line },
                { id: 'custpage_name', value: row.name, line },
                { id: 'custpage_genre', value: row.genre, line },
                { id: 'custpage_platforms', value: row.platforms, line },
                { id: 'custpage_release_date', value: row.releaseDate, line },
                { id: 'custpage_critic_rating', value: row.aggregatedRating, line },
                { id: 'custpage_user_rating', value: row.rating, line },
            ];

            columns.forEach(sublist.setSublistValue);
        });
    }

    function byTextProperty(property) {
        return function (a, b) {
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
            return 0;
        }
    }

    return {
        onRequest
    };
});