// /**
//  *
//  * @param objOptions
//  * @constructor
//  */
// var BlobFileCollection = function (objOptions) {
//
//     this.options = $.extend({}, this.DEFAULTS, objOptions);
//
//     // Default properties
//     this.items = [];
//     this.initComponent(this.options.items);
// };
//
// BlobFileCollection.prototype = {
//
//     DEFAULTS: {
//         items: []
//     },
//
//     /**
//      *
//      * @param arrItems
//      */
//     initComponent: function(arrItems){
//         arrItems.forEach($.proxy(this.add, this));
//     },
//
//     /**
//      *
//      * @param BlobFile
//      */
//     add : function(BlobFile) {
//         this.items.push(BlobFile);
//     },
//
//     /**
//      *
//      * @returns {Array}
//      */
//     getItems: function() {
//         return this.items;
//     }
// };

/**
 *
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
    }
};

/**
 *
 * @constructor
 */
var FileCryptUtil = function() {

};

/**
 *
 * @param intSizeInBytes
 * @returns {string}
 */
FileCryptUtil.convertFileSize = function  (intSizeInBytes) {
    var intCounter = -1,
        arrByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    do {
        intSizeInBytes = intSizeInBytes / 1024;
        intCounter++;
    } while (intSizeInBytes > 1024);

    return Math.max(intSizeInBytes, 0.1).toFixed(1) + arrByteUnits[intCounter];
};

/**
 *
 * @param objOptions
 * @constructor
 */
var FileCrypt = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Constructor
    this.initComponent(this.options.file);
};

FileCrypt.prototype = {

    DEFAULTS: {
        file: {},
    },

    /**
     *
     * @param objFile
     */
    initComponent: function(objFile){
        this._sliceFile(objFile);
    },

    /**
     *
     * @param objFile
     * @returns {Array}
     * @private
     */
    _sliceFile: function (objFile) {

        objFile.slice = objFile.mozSlice || objFile.webkitSlice || objFile.slice; // compatibility
        var intPosition = 0, arrSlices = [];

        while (intPosition < objFile.size) {
            arrSlices.push(objFile.slice(
                intPosition, intPosition += CHUNK_SIZE
            ));
        }

        return arrSlices;
    },

    /**
     *
     * @param arrBlobs
     * @param strPassphrase
     * @returns {FileCryptPartCollection}
     */
    encrypt: function(arrBlobs, strPassphrase) {

        // var arrParts = [];

        var objCollection = new FileCryptPartCollection();

        for(var intKey = 0; intKey < arrBlobs.length; intKey++) {
            // var objFileReader = new FileReaderSync();
            var objFileReader = new FileReader(),
                objData = objFileReader.readAsBinaryString(arrBlobs[intKey]),
                objEncrypted = CryptoJS.AES
                    .encrypt(objData, strPassphrase)
                    .toString();
            // .toString(Latin1Formatter);

            // arrParts.push(objEncrypted);
            objCollection.add(objEncrypted);
        }

        // return arrParts.join(CHUNK_DELIMITER);
        return objCollection; // arrParts.join(CHUNK_DELIMITER);
    }

};