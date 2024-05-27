/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/log',
    'N/runtime',
    '../timer/dt.timer',
], function (log, runtime, Timer) {

    /**
     * Automatically calls JSON.parse on either the Map stage value or the elements of the Reduce stage array
     *
     * @param context
     * @param mapper
     * @returns {*}
     */
    function getStageData(context, mapper = null) {
        if (context.value) {
            const data = JSON.parse(context.value);

            if (mapper) {
                return mapDataProperties(mapper)(data);
            }
        }

        const data = context.values.map(JSON.parse);

        if (mapper) {
            return data.map(mapDataProperties(mapper));
        }

        return data;
    }

    /**
     * Returns an object with the output and summary errors as arrays
     *
     * @param context
     * @returns {{output: *[], reduceErrors: (*|*[]), inputError: (*|*[]), mapErrors: (*|*[])}}
     */
    function getSummaryData(context) {
        const output = [];

        context.output.iterator().each((key, value) => !!output.push({ key, value }));

        const errors = getErrors(context);

        return {
            output,
            ...errors
        };
    }

    /**
     * Returns the error or errors from the provide summary as an arrary rather than an iterator
     *
     * @param summary
     * @returns {{input: *[], map: *[], reduce: *[]}} errors
     */
    function getErrors(summary) {
        let errors = {
            input: [],
            map: [],
            reduce: []
        };

        if (summary.inputSummary.error) {
            errors.input.push({ key: 0, error: summary.inputSummary.error });
        }

        summary.mapSummary.errors.iterator().each((key, details) => !!errors.map.push({ key, details }));
        summary.reduceSummary.errors.iterator().each((key, details) => !!errors.reduce.push({ key, details }));

        return errors;
    }

    /**
     * Logs the errors, if any, from the getInputData, map or reduce stage summaries
     *
     * @param summary
     */
    function logErrors(summary) {
        const errors = getErrors(summary);

        errors.input.forEach(details => log.error({ title: 'getInputData', details }));
        errors.map.forEach(error => log.error({ title: `Map error, key: ${error.key}`, details: error.details }));
        errors.reduce.forEach(error => log.error({ title: `Reduce error, key: ${error.key}`, details: error.details }));
    }

    /**
     * Maps the properies of the object provided to a new name provided in the `mapper` argument.
     *
     * @param mapper
     * @returns {function(*): {}}
     */
    function mapDataProperties(mapper) {
        return function(data) {
            const mappedData = {};

            for (let property of Object.keys(data)) {
                const propertyName = mapper[property] || property;

                mappedData[propertyName] = data[property];
            }

            return mappedData;
        }
    }

    return {
        getStageData,
        getSummaryData,
        logErrors,
        Timer
    };
});