/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
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
        passphrase: '',
        chunk_size: 1024 * 1024, // 1MB
        delimiter: '/file-crypt-delimiter/',

        proxy: {
            url: '',
            type: 'POST',
            //xhr: function() { // custom xhr
            //    var myXhr = $.ajaxSettings.xhr();
            //    if(myXhr.upload) { // check if upload property exists
            //        myXhr.upload.addEventListener('progress', progressHandler, false); // for handling the progress of the upload
            //    }
            //    return myXhr;
            //},
            contentType: 'text/plain',
            // success: successHandler,
            // error: errorHandler,
            processData: false,
            cache: false
        }
    },

    /**
     *
     * @param objFile
     */
    initComponent: function(objFile){
        // Encrypter file blob parts
        this._encrypted = this._encrypt(
            this._sliceFile(objFile),
            this.options.passphrase
        );
    },

    /**
     *
     * @returns {*|string|string}
     */
    getDelimiter: function() {
        return this.options.delimiter;
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
     * @private
     */
    _encrypt: function(arrBlobs, strPassphrase) {

        var objCollection = new FileCryptPartCollection({
            delimiter: this.options.delimiter
        });

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
    },

    /**
     *
     * @param objOptions
     * @returns {*}
     */
    save: function(objOptions){

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
FileCrypt.factory = function(objFile, strPassphrase) {
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
FileCrypt.load = function(strUrl, strSeparator){

    $.ajax({
        url: strUrl,
        type: 'GET',
        success: $.proxy(function(response) {

            var objFileCrypt = new this({
                delimiter: strSeparator
            });

            var arrSlices = response.split(objFileCrypt.getDelimiter());
            // 'Some Password'

            var plaintexts = [];

            for(var i = 0; i < arrSlices.length; i++) {
                var bytes  = CryptoJS.AES.decrypt(arrSlices[i], 'Some Password');
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

