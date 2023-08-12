/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NAmdConfig /SuiteScripts/configuration/configuration.json
 */
define([
    'N/log',
    'N/runtime',
    'DT/timer',
    'DT/tryCatch'
], function (log, runtime, Timer, tryCatch) {

    /**
     * Automatically calls JSON.parse on either the Map stage value or the elements of the Reduce stage array
     *
     * @param context
     * @returns {*}
     */
    function getStageData(context) {
        if (context.value) {
            return JSON.parse(context.value);
        }

        return context.values.map(JSON.parse);
    }

    /**
     * Returns an object with the output and summary errors as arrays
     *
     * @param context
     * @param includeErrors
     * @returns {{output: *[], reduceErrors: (*|*[]), inputError: (*|*[]), mapErrors: (*|*[])}}
     */
    function getSummaryData(context) {
        const output = [];
        let inputError;
        let mapErrors;
        let reduceErrors;

        context.output.iterator().each((key, value) => {
            tryCatch(() => value = JSON.parse(value));

            output.push({ key, value });
            return true;
        });

        inputError = getSummaryErrors(context.inputSummary);
        mapErrors = getSummaryErrors(context.mapSummary);
        reduceErrors = getSummaryErrors(context.reduceSummary);

        return {
            output,
            inputError,
            mapErrors,
            reduceErrors
        };
    }

    /**
     * Returns the error or errors from the provide summary as an arrary rather than an iterator
     *
     * @param summary
     * @returns {*|*[]}
     */
    function getSummaryErrors(summary) {
        if (!summary.errors) {
            return summary.error;
        }

        const errors = [];

        summary.errors.iterator().each((key, error) => {
            errors.push({ key, error });
            return true;
        });

        return errors;
    }

    /**
     * Loops through all summary error iterators and logs the key and error to the script log
     *
     * @param context
     */
    function logErrors(context) {
        logSummaryErrors('GetInputData', context.inputSummary);
        logSummaryErrors('Map', context.mapSummary);
        logSummaryErrors('Reduce', context.reduceSummary);
    }

    /**
     * Logs the errors, if any, from the getInputData, map or reduce stage summaries
     *
     * @param stage
     * @param summary
     */
    function logSummaryErrors(stage, summary) {
        if (!summary.errors) {
            if (summary.error) {
                log.error({ title: `${stage} error`, details: summary.error });
            }

            return;
        }

        summary.errors.iterator().each((key, error) => {
            log.error({ title: `${stage} error for key ${key}`, details: error });
            return true;
        });
    }

    return {
        getStageData,
        getSummaryData,
        logErrors,
        Timer
    };
});