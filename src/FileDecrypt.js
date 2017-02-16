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
        // proxy: {
        //     url: '',
        //     type: 'GET',
        //     contentType: 'text/plain',
        //     processData: false,
        //     cache: false
        // }
    },

    /**
     *
     * @param strUrl
     * @private
     */
    _initComponent: function (strUrl) {

        // this._decrypted = undefined;

        $.ajax({
            url: strUrl,
            type: 'GET',
            success: $.proxy(function (response) {

                // var objFileCrypt = new this({
                //     delimiter: strSeparator
                // });
                //
                // var arrSlices = response.split(objFileCrypt.getDelimiter());
                // // 'Some Password'
                //
                // var plaintexts = [];
                //
                // for (var i = 0; i < arrSlices.length; i++) {
                //     var bytes = CryptoJS.AES.decrypt(arrSlices[i], 'Some Password');
                //     plaintexts.push(bytes.toString(CryptoJS.enc.Utf8));
                // }
                //
                // debugger;
                //
                // // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
                // // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                //
                // // CryptoJS.AES.encrypt(objData, strPassphrase);
                //
                // //
                // // var binaryData = arrSlices.join("");
                // // // var blob = new Blob([window.secureShared.str2ab(binaryData)], {type: fileMeta.contentType});
                //
                // debugger;

            }, this)
        });
    }
};

// /**
//  *
//  * @param strUrl
//  * @param strSeparator
//  */
// FileCrypt.load = function (strUrl, strSeparator) {
//
//     $.ajax({
//         url: strUrl,
//         type: 'GET',
//         success: $.proxy(function (response) {
//
//             var objFileCrypt = new this({
//                 delimiter: strSeparator
//             });
//
//             var arrSlices = response.split(objFileCrypt.getDelimiter());
//             // 'Some Password'
//
//             var plaintexts = [];
//
//             for (var i = 0; i < arrSlices.length; i++) {
//                 var bytes = CryptoJS.AES.decrypt(arrSlices[i], 'Some Password');
//                 plaintexts.push(bytes.toString(CryptoJS.enc.Utf8));
//             }
//
//             debugger;
//
//             // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
//             // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
//
//             // CryptoJS.AES.encrypt(objData, strPassphrase);
//
//             //
//             // var binaryData = arrSlices.join("");
//             // // var blob = new Blob([window.secureShared.str2ab(binaryData)], {type: fileMeta.contentType});
//
//             debugger;
//
//         }, this)
//     });
// };