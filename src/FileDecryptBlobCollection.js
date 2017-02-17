/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileDecryptBlobCollection = function(objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default properties
    this.items = [];

    // Constructor
    this._initComponent(this.options.items);
};

FileDecryptBlobCollection.prototype = {

    DEFAULTS: {
        items: []
    },

    /**
     *
     * @param arrItems
     */
    _initComponent: function(arrItems){
        arrItems.forEach($.proxy(this.add, this));
    },


    /**
     *
     * @returns {Number}
     */
    getLength: function() {
        return this.items.length;
    },

    /**
     *
     * @param fn
     * @returns {FileCryptHashCollection}
     */
    forEach: function (fn) {
        this.items.forEach($.proxy(function (objItem, intIndex) {
            fn(objItem, intIndex, this);
        }, this));
        return this;
    },

    /**
     *
     * @param objBlobFile
     * @param intIndex
     * @returns {FileCryptHashCollection}
     */
    add : function(objBlobFile, intIndex) {

        if (undefined !== intIndex) {
            this.items[intIndex] = objBlobFile;
        } else {
            this.items.push(objBlobFile);
        }

        return this;
    }

};

/**
 *
 * @returns {string}
 */
FileDecryptBlobCollection.prototype.toString = function() {
    return this.items.join("");
};