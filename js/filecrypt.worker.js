/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
importScripts('/node_modules/crypto-js/crypto-js.js');
importScripts('/node_modules/crypto-js/aes.js');

/**
 *
 * @param e
 */
self.onmessage = function (e) {

    if (e.data instanceof Object) {

        // Read file
        var objFileReader = new FileReaderSync(),
            strEncrypted = CryptoJS.AES
                .encrypt(
                    objFileReader.readAsBinaryString(e.data.part),
                    e.data.passphrase
                )
                .toString();

        postMessage({
            data: strEncrypted,
            index: e.data.index
        });
    }

};
