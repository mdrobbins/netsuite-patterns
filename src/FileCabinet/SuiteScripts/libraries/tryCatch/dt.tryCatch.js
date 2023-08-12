/**
 *  @NAPIVersion 2.1
 *  @NModuleScope Public
 */
define(['N/log', 'N/error'], function (log, error) {
    /**
     * Wraps a potentially unsafe NetSuite call in a try/catch and implements basic logging
     * @returns {{isSuccess: boolean, result?: object, message?: string, details?: object}}
     */
    function tryCatch() {
        const parameters = Array.prototype.slice.call(arguments);
        const functionToExecute = parameters.shift();
        if (typeof(functionToExecute) === 'function') {
            try {
                const result = functionToExecute.apply(this, parameters);
                return {
                    isSuccess: true,
                    result: result
                };
            } catch (ex) {
                const response = {
                    isSuccess: false,
                    message: ex.message,
                    details: {
                        functionCalled: functionToExecute.name,
                        parameters: JSON.stringify(parameters),
                        stackTrace: ex.stack
                    }
                };
                log.error('Failed to call function', JSON.stringify(response));
                return response;
            }
        } else {
            throw error.create({
                name: 'INVALID_ARGUMENT',
                message: functionToExecute + ' is not a function and cannot be called.',
                notifyOff: false
            });
        }
    }

    return tryCatch;
});