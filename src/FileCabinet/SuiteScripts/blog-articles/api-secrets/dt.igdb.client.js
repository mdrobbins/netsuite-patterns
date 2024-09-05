/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/cache', 'N/https'], function (cache, https) {
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
        const query = `
            fields id,name,url;
            limit 500;
        `;

        return makeRequest('genres', query);
    }

    function makeRequest(endpoint, body) {
        const clientId = https.createSecureString({ input: '\{custsecret_dt_igdb_client_id\}' });

        const token = getToken();

        const headers = {
            'Client-ID': clientId,
            'Authorization': `Bearer ${token}`
        };

        const url = `https://api.igdb.com/v4/${endpoint}`;

        const response = https.post({ url, headers, body });

        return JSON.parse(response.body);
    }

    function getToken() {
        const igdbCache = cache.getCache({
            name: 'IGDB_CACHE',
            scope: cache.Scope.PUBLIC
        });

        return igdbCache.get({
            key: 'IGDB_BEARER_TOKEN',
            loader: updateToken,
            ttl: 60 * 15
        });
    }

    function updateToken() {
        log.debug({ title: 'getting token', details: 'token ids not found in cache, requesting...' });

        const url = https.createSecureString({
            input: 'https://id.twitch.tv/oauth2/token?client_id=\{custsecret_dt_igdb_client_id\}&client_secret=\{custsecret_dt_igdb_client_secret\}&grant_type=client_credentials'
        });

        const response = https.post({ url });

        const body = JSON.parse(response.body);

        return body.access_token;
    }

    return {
        searchGames,
        getGameGenres
    };
});