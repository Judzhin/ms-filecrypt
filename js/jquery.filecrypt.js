(function ($) {

    // Private variables
    var objFile;

    /**
     *
     * @param options
     * @returns {jQuery}
     */
    $.fn.filecrypt = function (options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            autoSync: false,
            passphrase: '',
            delimiter: '/--filecrypt-delimiter--/',
            chunk_size: 1024 * 1024 // 1MB

        }, options);

        this.on('change', function (e) {

            alert('change');
        });

        return this;
    };

}(jQuery));