/*jshint worker:true*/
/*global CryptoJS:true, FileReaderSync:true, Latin1Formatter:true, sjcl:true */

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

            objHashCollection.add(e.data.data);


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