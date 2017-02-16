/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCryptPartCollection = function(objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default properties
    this.items = [];

    // Constructor
    this.initComponent(this.options.items);
};

FileCryptPartCollection.prototype = {

    DEFAULTS: {
        items: [],
        delimiter: "/--delimiter--/"
    },

    /**
     *
     * @param arrItems
     */
    initComponent: function(arrItems){
        arrItems.forEach($.proxy(this.add, this));
    },

    /**
     *
     * @param BlobFile
     */
    add : function(BlobFile) {
        this.items.push(BlobFile);
    },

    /**
     *
     * @param separator
     * @returns {string}
     */
    join: function(separator) {

        if (undefined === separator) {
            separator = this.options.delimiter;
        }

        return this.items.join(separator);
    }
};
