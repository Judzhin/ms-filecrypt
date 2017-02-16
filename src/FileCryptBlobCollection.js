/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCryptBlobCollection = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Constructor
    this._initComponent(this.options.file);
};

FileCryptBlobCollection.prototype = {

    DEFAULTS: {
        chunk_size: 1024 * 1024 // 1MB
    },

    /**
     *
     * @param objFile
     * @private
     */
    _initComponent: function (objFile) {

        this.file = objFile;
        this.items = [];

        objFile.slice = objFile.mozSlice || objFile.webkitSlice || objFile.slice; // compatibility
        var intPosition = 0;

        while (intPosition < objFile.size) {
            this.add(objFile.slice(
                intPosition, intPosition += this.options.chunk_size
            ));
        }
    },

    /**
     *
     * @returns {Number|number}
     */
    getLength: function () {
        return this.items.length;
    },

    /**
     *
     * @param fn
     * @returns {FileCryptBlobCollection}
     */
    forEach: function (fn) {
        this.items.forEach($.proxy(function (objItem, intIndex) {
            fn(objItem, intIndex, this);
        }, this));
        return this;
    },

    /**
     *
     * @param objBlob
     * @param intIndex
     * @returns {FileCryptBlobCollection}
     */
    add: function (objBlob, intIndex) {

        if (undefined !== intIndex) {
            this.items[intIndex] = objBlob;
        } else {
            this.items.push(objBlob);
        }

        return this;
    }
};