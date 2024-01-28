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
            where name ~ *"${searchTerm}"*;
            limit 100;
        `;

        const results = makeRequest('games', query);

        return formatSearchGameResults(results);
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

    function formatSearchGameResults(results) {
        return results.map(result => {
            let releaseDate = null;
            let coverImage;

            const id = result.id;
            const first_release_date = result.first_release_date || '';
            let name = result.name || '';
            const summary = result.summary || '';
            const rating = result.rating || 0;
            const aggregated_rating = result.aggregated_rating || 0;
            const url = result.url || '';
            const cover_url = result.cover?.url || '';
            const genres = result.genres || [];
            const platforms = result.platforms || [];

            coverImage = cover_url
                ? `<img width="50" src="https:${cover_url}" alt="cover image"/>`
                : `<img width="50" height="50" src="https://alt-fire.com/images/alt-fire-game-no-image.png" alt="no cover image"/>`;

            if (first_release_date) {
                const date = new Date(first_release_date * 1000);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();

                releaseDate = `${month}/${day}/${year}`;
            }

            if (url) {
                name = `<a href="${url}" target="_blank">${name}</a>`;
            }

            return {
                id,
                coverImage,
                name,
                summary,
                releaseDate,
                first_release_date,
                genre: genres[0]?.name || null,
                rating: rating.toFixed(1),
                aggregatedRating: aggregated_rating.toFixed(1),
                platforms: platforms.map(p => p.abbreviation).join(', ') || null
            }
        });
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