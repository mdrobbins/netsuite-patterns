//noinspection JSUnresolvedFunction
/**
 *  @NAPIVersion 2.0
 *  @NModuleScope Public
 */
define(['N/log', 'N/error'], function (log, error) {
    /**
     * Wraps a potentially unsafe NetSuite call in a try/catch and implements basic logging
     * @returns {{isSuccess: boolean, result?: object, message?: string, details?: object}}
     */
    function safeExecute() {
        var parameters = Array.prototype.slice.call(arguments);
        var functionToExecute = parameters.shift();
        if (typeof(functionToExecute) === 'function') {
            try {
                var result = functionToExecute.apply(this, parameters);
                return {
                    isSuccess: true,
                    result: result
                };
            } catch (ex) {
                var response = {
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

    return safeExecute;
});