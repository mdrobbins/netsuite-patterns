/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/https', 'N/log', 'N/runtime'], function (https, log, runtime) {
    function searchGames(searchTerm) {
        if (!searchTerm) {
            return;
        }

        const query = `
            fields  name, slug, first_release_date, url, rating, aggregated_rating, 
                    cover.url, genres.name, platforms.abbreviation; 
            where name ~ *"${searchTerm}"* & themes != (42);
            limit 100;
        `;

        return makeRequest('games', query);
    }

    function getGameGenres() {
        if (!gameId) {
            return;
        }

        const query = `
            fields id,name,url;
            limit 500;
        `;

        return makeRequest('genres', query);
    }

    function makeRequest(endpoint, body) {
        const script = runtime.getCurrentScript();

        const clientId = script.getParameter({ name: 'custscript_dt_igdb_client_id' });
        const token = script.getParameter({ name: 'custscript_dt_igdb_token' });

        const headers = {
            'Client-ID': clientId,
            'Authorization': `Bearer ${token}`
        };

        const url = `https://api.igdb.com/v4/${endpoint}`;

        const response = https.post({ url, headers, body });

        return JSON.parse(response.body);
    }

    return {
        searchGames,
        getGameGenres
    };
});