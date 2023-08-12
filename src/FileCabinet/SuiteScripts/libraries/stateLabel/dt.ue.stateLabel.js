/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['./dt.stateLabel'], function (stateLabel) {
    function beforeLoad(context) {
        stateLabel.addLabel({
            context,
            text: 'DataTek: Approved',
            color: stateLabel.LabelColor.YELLOW,
            hidePrimary: true,
        });
    }

    return {
        beforeLoad
    }
});