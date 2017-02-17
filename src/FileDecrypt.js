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

                var objBlobCollection = this._decrypt(
                    new FileCryptHashCollection({
                        items: response.split(this.options.delimiter)
                    }),
                    this.options.passphrase
                );

                // Create blob
                var objBinaryData = objBlobCollection.toString(); // .  // decryptedFile.fileData.join("");
                var objBlob = new Blob(
                    [FileCryptUtil.str2ab(objBinaryData)],
                    {type: 'application/pdf'}
                );

                var objFileReader = new FileReader();
                var fnSuccess = this.options.listeners.success;

                objFileReader.onload = function (event) {
                    fnSuccess(event);
                };

                objFileReader.readAsDataURL(objBlob);

            }, this)
        });
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
            count: objHashCollection.getLength()
        });

        var intCounter = 0, objBlobCollection = new FileDecryptBlobCollection();

        objWorkerCollection.onSuccess($.proxy(function (e) {

            ++intCounter;

            // fire event
            this.options.listeners.decrypting({
                process: 100 / objHashCollection.getLength() * intCounter
            });

            objBlobCollection.add(
                e.data.part,
                e.data.index
            );

            if (intCounter === objHashCollection.getLength()) {
                objWorkerCollection.terminate();
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
    },

    // /**
    //  *
    //  * @param fn
    //  */
    // load: function (fn) {
    //
    //
    //
    //     // if(!/Safari/i.test(window.BrowserDetect.browser)){
    //     //     var URL = window.URL || window.webkitURL;
    //     //     var url = URL.createObjectURL(blob);
    //     //     $("<a>").attr("href", url).attr("download", decryptedFile.fileName).addClass("btn btn-success")
    //     //         .html('<i class="icon-download-alt icon-white"></i> Download').appendTo("#downloaded-content").hide().fadeIn();
    //     // } else {
    //     //     // Safari can't open blobs, create a data URI
    //     //     // This will fail if the file is greater than ~200KB or so
    //     //     // TODO figure out what's wrong with the blob size in safari
    //     //     // TODO Why doesn't safari want a dataview here?
    //     //     if(blob.size > 200000) return window.alert("Sorry, this file is too big for Safari. Please try to open it in Chrome.");
    //     //     var fileReader = new FileReader();
    //     //     fileReader.onload = function (event) {
    //     //         $("<a>").text("Download").appendTo("#downloaded-content").attr("href", event.target.result).hide().fadeIn();
    //     //     };
    //     //     fileReader.readAsDataURL(blob);
    //     // }
    // }
};