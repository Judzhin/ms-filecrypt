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
    this._initComponent(
        this.options.url
    );
};

FileDecrypt.prototype = {

    DEFAULTS: {
        url: '',
        passphrase: '',
        delimiter: '/file-crypt-delimiter/',
        listeners: {
            download: function (e) {
            },
            downloaded: function(e) {
            },
            decrypting: function (e) {
            },
            decripted: function(e) {

            }
        }
    },

    /**
     *
     * @param strUrl
     * @returns {FileDecrypt}
     */
    setUrl: function(strUrl) {
        this.options.url = strUrl;
        return this;
    },

    /**
     *
     * @param strPassphrase
     * @returns {FileDecrypt}
     */
    setPassphrase: function(strPassphrase) {
        this.options.passphrase = strPassphrase;
        return this;
    },

    /**
     *
     * @param delimiter
     */
    setDelimiter: function(delimiter) {
        this.options.delimiter = delimiter;
    },

    /**
     *
     * @returns {*|string|string}
     */
    getFileName: function() {
        return this.fileName;
    },

    /**
     *
     */
    download: function() {

        $.ajax({
            url: this.options.url,
            type: 'GET',
            success: $.proxy(function (response, textStatus, jqXHR) {

                this.fileName = jqXHR.getResponseHeader('X-File-Name');
                this.fileContentType = jqXHR.getResponseHeader('X-File-Content-Type');
                this.fileContentLength = jqXHR.getResponseHeader('X-File-Content-Length');

                this._blobCollection = new FileCryptHashCollection({
                    items: response.split(this.options.delimiter)
                });

                if ('downloaded' in this.options.listeners
                    && $.isFunction(this.options.listeners['downloaded'])) {
                    this.options.listeners.downloaded();
                }

            }, this)
        });
    },

    /**
     *
     * @param strUrl
     * @private
     */
    _initComponent: function (strUrl) {

        if (!strUrl) {
            return;
        }

        this.setUrl(strUrl);
        this.download();
    },

    /**
     *
     * @param objOptions
     */
    decrypting: function(objOptions) {

        if($.isPlainObject(objOptions)) {

            if ('decripted' in objOptions && $.isFunction(objOptions['decripted'])) {
                this.options.listeners.decripted = objOptions['decripted'];
            }
        }

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
                            {type: this.fileContentType}
                        );

                    var objFileReader = new FileReader();
                    objFileReader.onload = this.options.listeners.decripted;
                    objFileReader.readAsDataURL(objBlob);
                }, this)
            }
        });

        var intCounter = 0, objBlobCollection = new FileDecryptBlobCollection();

        objWorkerCollection.onSuccess($.proxy(function (e) {

            ++intCounter;

            console.log(e.data);

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