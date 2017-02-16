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
     * @param objBlobFile
     * @param intIndex
     * @returns {FileCryptPartCollection}
     */
    add : function(objBlobFile, intIndex) {

        if (undefined !== intIndex) {
            this.items[intIndex] = objBlobFile;
        } else {
            this.items.push(objBlobFile);
        }

        return this;
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
