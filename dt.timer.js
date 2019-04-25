/**
 * @NApiVersion 2.0
 * @NModuleScope Public
 */
define([], function() {
    function Timer() {
        var START_TIME = new Date();
        var START_INTERVAL_TIME = START_TIME;

        this.getStartTime = function() {
            return START_TIME;
        };

        this.getElapsedTime = function() {
            var CURRENT_TIME = new Date();
            return CURRENT_TIME.getTime() - START_TIME.getTime();
        };

        this.getElapsedSeconds = function() {
            return this.getElapsedTime() / 1000;
        };

        this.getIntervalTime = function() {
            var CURRENT_TIME = new Date();
            var intervalTime = CURRENT_TIME.getTime() - START_INTERVAL_TIME.getTime();
            START_INTERVAL_TIME = intervalTime;
            return intervalTime;
        };

        this.getIntervalSeconds = function() {
            return this.getIntervalTime() / 1000;
        };
    }

    return {
        Timer: Timer
    };
});
