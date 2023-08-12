/**
 *  @NAPIVersion 2.1
 *  @NModuleScope Public
 */
define(['N/log'], function (log) {

    const LabelColor = {
        BLUE: '#d5e0ec',
        YELLOW: '#fcf9cf',
        GREEN: '#d7fccf',
        RED: '#fccfcf'
    }

    /**
     * @param {Object} params
     * @param {Object} params.context
     * @param {string} params.text
     * @param {string=} params.color
     * @param {Boolean=} params.hidePrimary
     */
    function addLabel({ context, text, color = LabelColor.BLUE, hidePrimary = false }) {
        if (!context?.form || !text) {
            return;
        }

        try {
            context.form.addField({
                id: 'custpage_dt_status',
                label: 'Custom State',
                type: 'inlinehtml'
            }).defaultValue = `
                <script>
                    (function() {
                        ${hidePrimary ? 'jQuery(".uir-page-title-secondline").find("div.uir-record-status").remove();' : ''}
                        jQuery('.uir-page-title-secondline')
                            .append('<div class="uir-record-status" style="background-color: ${color};">${text}</div>')
                    })();
                </script>`;
        } catch (ex) {
            log.error({ title: 'Error creating state label', details: ex.message });
        }
    }

    return {
        addLabel: addLabel,
        LabelColor: LabelColor
    };
});