/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
importScripts('/node_modules/crypto-js/crypto-js.js');
importScripts('/node_modules/crypto-js/aes.js');
importScripts('./FileLatin1Formatter.js');

/**
 *
 * @param e
 */
self.onmessage = function (e) {

    if (e.data instanceof Object) {

        try {

            var strDecrypted = CryptoJS.AES
                .decrypt(
                    FileLatin1Formatter.parse(e.data.hash),
                    e.data.passphrase
                ).toString(CryptoJS.enc.Utf8);

            postMessage({
                success: true,
                part: strDecrypted,
                index: e.data.index
            });

        } catch (e) {
            postMessage({
                success: false,
                msg: 'Error'
            });
        }
    }
};