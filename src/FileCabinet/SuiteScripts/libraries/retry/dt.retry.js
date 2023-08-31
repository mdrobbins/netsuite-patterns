/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/log'], function (log) {
    /**
     * Automatically retry a function call if an exception is thrown.
     *
     * @param {number=} params.maxTries The number of times to try executing the function before re-throwing the error
     * @param {function} params.functionToExecute The function to retry if execution fails
     * @param {Array=} params.arguments The arguments to pass to the function being executed
     * @param {string=} params.retryOnError The specific exception name to look for.  If defined, will only retry
     *                                      if this exception is thrown.  If not specified, will retry on any exception.
     */
    function retry(params) {

        const {
            functionToExecute,
            arguments,
            maxTries = 1,
            retryOnError
        } = params;

        const argumentArray = [].concat(arguments);

        if (typeof functionToExecute !== 'function') {
            throw functionToExecute + 'is not a function';
        }

        let isMatchingError;
        let tries = 0;

        do {
            try {
                return functionToExecute.apply(this, argumentArray);
            } catch (ex) {
                isMatchingError = !retryOnError || ex.name === retryOnError;

                if (isMatchingError) {
                    log.error({
                        title: 'Initiating Retry Logic',
                        details: 'Attempt ' + (++tries) + ' - Encounted error: ' + ex.name
                    });
                }

                if (!isMatchingError || tries >= maxTries) {
                    throw ex;
                }
            }
        } while (isMatchingError && tries < maxTries)
    }

    return retry;
});