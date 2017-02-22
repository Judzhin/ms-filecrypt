/**
 *
 */

importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/aes.min.js');

importScripts('formatter.js');
importScripts('util.js');

/**
 * Web worker to encrypt/decrypt files using AES counter-mode.
 *
 * @param {string} msg.data.op - 'encrypt' or 'decrypt'.
 * @param {File}   msg.data.file - File to be encrypted or decrypted.
 * @param {string} msg.data.password - Password to use to encrypt/decrypt file.
 * @param {number} msg.data.bits - Number of bits to use for key.
 * @returns {ciphertext|plaintext} - Blob containing encrypted ciphertext / decrypted plaintext.
 *
 * @example
 *   var worker = new Worker('aes-ctr-file-webworker.js');
 *   var file = this.files[0];
 *   worker.postMessage({ op:'encrypt', file:file, password:'L0ck it up ŝaf3', bits:256 });
 *   worker.onmessage = function(msg) {
 *     if (msg.data.progress != 'complete') {
 *       $('progress').val(msg.data.progress * 100); // update progress bar
 *     }
 *     if (msg.data.progress == 'complete') {
 *       saveAs(msg.data.ciphertext, file.name+'.encrypted'); // save encrypted file
 *     }
 *   }
 *
 * Note saveAs() cannot run in web worker, so encrypted/decrypted file has to be passed back to UI
 * thread to be saved.
 *
 * TODO: error handling on failed decryption
 */
onmessage = function (msg) {

    // choose operation
    switch (msg.data.op) {

        case 'encrypt':

            var file = msg.data.file;
            file.slice = file.mozSlice || file.webkitSlice || file.slice; // compatibility

            var reader = new FileReaderSync(),
                items = [],
                position = 0;

            while (position < file.size) {

                var slice = file.slice(
                    position, position += e.data.chunSize
                );

                var chunk = reader.readAsBinaryString(slice);
                var encrypted = CryptoJS.AES
                    .encrypt(chunk, msg.data.password)
                    .toString(Latin1Formatter);
                items.push(encrypted);
            }

            self.postMessage({
                progress: 'complete',
                ciphertext: new Blob([items.join(msg.data.delimiter)], {
                    type: 'application/octet-stream'
            })});
            break;

        case 'decrypt':

            var reader = new FileReaderSync(),
                ciphertext = reader.readAsText(msg.data.file),
                plains = [];

            ciphertext.split(msg.data.delimiter).forEach(function(item) {
                try {

                    var plaintext = CryptoJS.AES.decrypt(
                        Latin1Formatter.parse(item), msg.data.password)
                        .toString(CryptoJS.enc.Utf8);

                } catch (err) {
                    self.postMessage({progress: 'failure'});
                    return;
                }

                plains.push(plaintext);
            });

            self.postMessage({
                progress: 'complete',
                plaintext: new Blob([str2ab(plains.join(""))], {
                    type: 'application/octet-stream'
                })
            });


            break;
    }
};