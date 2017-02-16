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
     * @returns {*|string|string}
     */
    getDelimiter: function () {
        return this.options.delimiter;
    },

    /**
     *
     * @param objBlobCollection
     * @param strPassphrase
     * @returns {FileCryptHashCollection}
     * @private
     */
    _encrypt: function (objBlobCollection, strPassphrase) {

        var objCollection = new FileCryptHashCollection({
            delimiter: this.options.delimiter
        });

        var objWorkerCollection = new FileCryptWorkerCollection({
            count: objBlobCollection.getLength()
        });

        var intCounter = 0;

        objWorkerCollection.onSuccess(function (e) {
            objCollection.add(e.data.data);

            ++intCounter;

            if (intCounter === objBlobCollection.length) {
                objWorkerCollection.terminate();
            }
        });

        objBlobCollection.forEach(function (objBlob, intIndex) {
            objWorkerCollection.getAt(intIndex % objWorkerCollection.getLength()).postMessage({
                part: objBlob,
                index: intIndex,
                passphrase: strPassphrase
            });
        });

        // for (var intKey = 0; intKey < objBlobCollection.length; intKey++) {
        //     objWorkerCollection.getAt(intKey % objWorkerCollection.getLength()).postMessage({
        //         part: objBlobCollection[intKey],
        //         index: intKey,
        //         passphrase: strPassphrase
        //     });
        // }

        return objCollection;

        // for (var intKey = 0; intKey < arrBlobs.length; intKey++) {
        //     var objFileReader = new FileReader(),
        //     // var objFileReader = new FileReader(),
        //         objData = objFileReader.readAsBinaryString(arrBlobs[intKey]);
        //
        //     // fileReader.readAsBinaryString(oEvent.data.slice)
        //
        //     debugger;
        //
        //     var objEncrypted = CryptoJS.AES
        //         .encrypt(objData, strPassphrase)
        //         .toString();
        //     // .toString(Latin1Formatter);
        //
        //     // arrParts.push(objEncrypted);
        //     objCollection.add(objEncrypted);
        // }
        //
        // // return arrParts.join(CHUNK_DELIMITER);
        // return objCollection; // arrParts.join(CHUNK_DELIMITER);
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
                data: this._encrypted.join()
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
 *
 * @param strUrl
 * @param strSeparator
 */
FileCrypt.load = function (strUrl, strSeparator) {

    $.ajax({
        url: strUrl,
        type: 'GET',
        success: $.proxy(function (response) {

            var objFileCrypt = new this({
                delimiter: strSeparator
            });

            var arrSlices = response.split(objFileCrypt.getDelimiter());
            // 'Some Password'

            var plaintexts = [];

            for (var i = 0; i < arrSlices.length; i++) {
                var bytes = CryptoJS.AES.decrypt(arrSlices[i], 'Some Password');
                plaintexts.push(bytes.toString(CryptoJS.enc.Utf8));
            }

            debugger;

            // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
            // var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            // CryptoJS.AES.encrypt(objData, strPassphrase);

            //
            // var binaryData = arrSlices.join("");
            // // var blob = new Blob([window.secureShared.str2ab(binaryData)], {type: fileMeta.contentType});

            debugger;

        }, this)
    });
};