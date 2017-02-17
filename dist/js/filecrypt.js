/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @constructor
 */
var FileCryptUtil = function () {};

/**
 *
 * @param intSizeInBytes
 * @returns {string}
 */
FileCryptUtil.convertFileSize = function (intSizeInBytes) {
    var intCounter = -1,
        arrByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    do {
        intSizeInBytes = intSizeInBytes / 1024;
        intCounter++;
    } while (intSizeInBytes > 1024);

    return Math.max(intSizeInBytes, 0.1).toFixed(1) + arrByteUnits[intCounter];
};

/**
 * Create an array buffer from a string.
 *
 * @param str
 * @returns {ArrayBuffer}
 */
FileCryptUtil.str2ab = function (str) {
    var objBuf = new ArrayBuffer(str.length), // 2 bytes for each char
        objCollection = new Uint8Array(objBuf);

    for (var i = 0, strLen = str.length; i < strLen; i++) {
        objCollection[i] = str.charCodeAt(i);
    }

    return objBuf;
};
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCryptWorkerCollection = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default
    this.items = [];
    this._initComponent();
};

FileCryptWorkerCollection.prototype = {

    DEFAULTS: {

        count: 4,
        /**
         *
         * @param e
         */

        success: function (e) {
        },

        /**
         *
         * @param e
         */
        failure: function (e) {
        }
    },

    /**
     *
     * @private
     */
    _initComponent: function () {

        for (var i = 0; i < this.options.count; i++) {
            var objWorker = new Worker("/dist/js/worker.encrypt.js");
            objWorker.onError = this.options.failure;
            this.items.push(objWorker);
        }

        this.onSuccess(this.options.success);
    },

    /**
     *
     * @param fn
     * @returns {FileCryptWorkerCollection}
     * @private
     */
    _forEach: function (fn) {

        this.items.forEach(function (objWorker) {
            fn(objWorker);
        });

        return this;
    },

    /**
     *
     * @returns {Number}
     */
    getLength: function () {
        return this.items.length;
    },

    /**
     *
     * @param intIndex
     * @returns {*}
     */
    getAt: function (intIndex) {
        return this.items[intIndex];
    },

    /**
     *
     * @param fn
     * @returns {FileCryptWorkerCollection}
     */
    onSuccess: function (fn) {

        this._forEach(function(objWorker){
            objWorker.addEventListener('message', fn, false);
        });

        return this;
    },

    /**
     *
     * @returns {FileCryptWorkerCollection}
     */
    terminate: function() {

        this._forEach(function(objWorker){
            objWorker.terminate();
        });

        return this;
    }
};
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCryptHashCollection = function(objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default properties
    this.items = [];

    // Constructor
    this._initComponent(this.options.items);
};

FileCryptHashCollection.prototype = {

    DEFAULTS: {
        items: [],
        delimiter: "/--delimiter--/"
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
FileCryptHashCollection.prototype.toString = function() {
    return this.items.join(this.options.delimiter);
};
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
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCrypt = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Constructor
    this._initComponent(this.options.file);
};

FileCrypt.prototype = {

    DEFAULTS: {

        file: {},
        passphrase: '',
        chunk_size: 1024 * 1024, // 1MB
        delimiter: '/file-crypt-delimiter/',
        listeners: {
            crypting: function () {
                // file event
            }
        },
        proxy: {
            url: '',
            type: 'POST',
            contentType: 'text/plain',
            processData: false,
            cache: false
        }
    },

    /**
     *
     * @param objFile
     * @private
     */
    _initComponent: function (objFile) {

        this._encrypted = this._encrypt(
            new FileCryptBlobCollection({
                file: objFile,
                chunk_size: this.options.chunk_size
            }),
            this.options.passphrase
        );
    },

    /**
     *
     * @param objBlobCollection
     * @param strPassphrase
     * @returns {FileCryptHashCollection}
     * @private
     */
    _encrypt: function (objBlobCollection, strPassphrase) {

        var objHashCollection = new FileCryptHashCollection({
            delimiter: this.options.delimiter
        });

        var objWorkerCollection = new FileCryptWorkerCollection({
            count: objBlobCollection.getLength()
        });

        var intCounter = 0;

        objWorkerCollection.onSuccess($.proxy(function (e) {

            ++intCounter;

            // fire event
            this.options.listeners.crypting({
                process: 100 / objBlobCollection.getLength() * intCounter
            });

            objHashCollection.add(
                e.data.data,
                e.data.index
            );


            if (intCounter === objBlobCollection.getLength()) {
                objWorkerCollection.terminate();
            }

        }, this));

        objBlobCollection.forEach(function (objBlob, intIndex) {
            objWorkerCollection.getAt(intIndex % objWorkerCollection.getLength()).postMessage({
                part: objBlob,
                index: intIndex,
                passphrase: strPassphrase
            });
        });

        return objHashCollection;
    },

    /**
     *
     * @param objOptions
     * @returns {*}
     */
    save: function (objOptions) {

        var objSettings = $.extend({
                headers: {
                    // 'X-File-Expiration-Days' : 10,
                    // 'X-File-Max-Views': 15,
                    'X-File-Content-Type': this.options.file.type,
                    'X-File-Name': this.options.file.name
                },
                data: this._encrypted.toString()
            }, this.options.proxy, objOptions
        );

        return $.ajax(objSettings);
    }
};

/**
 *
 * @param objFile
 * @param strPassphrase
 * @returns {FileCrypt}
 */
FileCrypt.factory = function (objFile, strPassphrase) {
    return new this({
        file: objFile,
        passphrase: strPassphrase
    });
};
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileDecryptWorkerCollection = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default
    this.items = [];
    this._initComponent(this.options.count);
};

FileDecryptWorkerCollection.prototype = {

    DEFAULTS: {

        count: 4,

        listeners: {
            /**
             *
             * @param e
             */

            success: function (e) {
            },

            /**
             *
             * @param e
             */
            failure: function (e) {
            },

            /**
             *
             * @param objCollection
             */
            terminate: function(objCollection) {
            }
        }
    },

    /**
     *
     * @param intCounter
     * @private
     */
    _initComponent: function (intCounter) {

        for (var i = 0; i < intCounter; i++) {
            var objWorker = new Worker("/dist/js/worker.decrypt.js");
            objWorker.onError = this.options.listeners.failure;
            this.items.push(objWorker);
        }

        this.onSuccess(this.options.listeners.success);
    },

    /**
     *
     * @param fn
     * @returns {FileDecryptWorkerCollection}
     * @private
     */
    _forEach: function (fn) {

        this.items.forEach(function (objWorker) {
            fn(objWorker);
        });

        return this;
    },

    /**
     *
     * @returns {Number}
     */
    getLength: function () {
        return this.items.length;
    },

    /**
     *
     * @param intIndex
     * @returns {*}
     */
    getAt: function (intIndex) {
        return this.items[intIndex];
    },

    /**
     *
     * @param fn
     * @returns {FileCryptWorkerCollection}
     */
    onSuccess: function (fn) {

        this._forEach(function(objWorker){
            objWorker.addEventListener('message', fn, false);
        });

        return this;
    },

    /**
     *
     * @param objBlobCollection
     * @returns {FileDecryptWorkerCollection}
     */
    terminate: function(objBlobCollection) {

        this._forEach(function(objWorker){
            objWorker.terminate();
        });

        this.options.listeners.terminate(this, objBlobCollection);

        return this;
    }
};
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
/*jshint worker:true*/
/*global CryptoJS:true, FileReaderSync:true, Latin1Formatter:true, sjcl:true */

/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileDecrypt = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Constructor
    this._initComponent(this.options.url);
};

FileDecrypt.prototype = {

    DEFAULTS: {
        url: '',
        passphrase: '',
        delimiter: '/file-crypt-delimiter/',
        listeners: {
            download: function () {
            },
            decrypting: function () {
            }
        }
    },

    /**
     *
     * @param strUrl
     * @private
     */
    _initComponent: function (strUrl) {

        $.ajax({
            url: strUrl,
            type: 'GET',
            success: $.proxy(function (response) {

                this._blobCollection = new FileCryptHashCollection({
                    items: response.split(this.options.delimiter)
                });

            }, this)
        });
    },

    /**
     *
     * @param objOptions
     */
    process: function(objOptions) {

        this._decrypt(
            this._blobCollection,
            this.options.passphrase
        );
    },

    /**
     *
     * @param objHashCollection
     * @param strPassphrase
     * @returns {FileDecryptBlobCollection}
     * @private
     */
    _decrypt: function (objHashCollection, strPassphrase) {

        var objWorkerCollection = new FileDecryptWorkerCollection({
            count: objHashCollection.getLength(),
            listeners: {
                terminate: $.proxy(function(objSelf, objBlobCollection) {

                    // Create blob
                    var objBinaryData = objBlobCollection.toString(),
                        objBlob = new Blob(
                            [FileCryptUtil.str2ab(objBinaryData)],
                            {type: 'application/pdf'}
                        );

                    var objFileReader = new FileReader();


                    objFileReader.onload = function (e) {
                        $(".btn-download").attr("href", e.target.result).hide().fadeIn();
                    };

                    objFileReader.readAsDataURL(objBlob);
                }, this)
            }
        });

        var intCounter = 0, objBlobCollection = new FileDecryptBlobCollection();

        objWorkerCollection.onSuccess($.proxy(function (e) {

            ++intCounter;

            if (e.data.success) {
                objBlobCollection.add(
                    e.data.part,
                    e.data.index
                );
            }

            if (intCounter === objHashCollection.getLength()) {
                objWorkerCollection.terminate(objBlobCollection);
            }

        }, this));

        debugger;

        objHashCollection.forEach(function (objHash, intIndex) {
            objWorkerCollection.getAt(intIndex % objWorkerCollection.getLength()).postMessage({
                hash: objHash,
                index: intIndex,
                passphrase: strPassphrase
            });
        });

        return objBlobCollection;
    }
};