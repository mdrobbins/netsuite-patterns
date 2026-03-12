/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * 
 * @Governance 0
 */
define([], function() {
    class Timer {
        constructor() {
            this.startTime = new Date();
            this.startIntervalTime = this.startTime;
        }

        getStartTime() {
            return this.startTime;
        }

        getElapsedTime() {
            const currentTime = new Date();
            return currentTime.getTime() - this.startTime.getTime();
        }

        getElapsedSeconds() {
            return this.getElapsedTime() / 1000;
        }

        getIntervalTime() {
            const currentTime = new Date();
            const intervalTime = currentTime.getTime() - this.startIntervalTime.getTime();

            this.startIntervalTime = currentTime;

            return intervalTime;
        }

        getIntervalSeconds() {
            return this.getIntervalTime() / 1000;
        }
    }

    return Timer;
});
