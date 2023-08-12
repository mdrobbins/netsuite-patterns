/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([], function() {
    function Timer() {
        let START_TIME = new Date();
        let START_INTERVAL_TIME = START_TIME;

        this.getStartTime = function() {
            return START_TIME;
        };

        this.getElapsedTime = function() {
            const CURRENT_TIME = new Date();
            return CURRENT_TIME.getTime() - START_TIME.getTime();
        };

        this.getElapsedSeconds = function() {
            return this.getElapsedTime() / 1000;
        };

        this.getIntervalTime = function() {
            const CURRENT_TIME = new Date();
            const intervalTime = CURRENT_TIME.getTime() - START_INTERVAL_TIME.getTime();
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
