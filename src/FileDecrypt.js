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