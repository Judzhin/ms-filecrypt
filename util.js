/**
 *
 * @param str
 * @returns {ArrayBuffer}
 */
function str2ab(str) {
    var objBuf = new ArrayBuffer(str.length), // 2 bytes for each char
        objCollection = new Uint8Array(objBuf);

    for (var i = 0, strLen = str.length; i < strLen; i++) {
        objCollection[i] = str.charCodeAt(i);
    }

    return objBuf;
};