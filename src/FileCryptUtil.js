/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @constructor
 */
var FileCryptUtil = function () {};

/**
 *
 * @param intSizeInBytes
 * @returns {string}
 */
FileCryptUtil.convertFileSize = function (intSizeInBytes) {
    var intCounter = -1,
        arrByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    do {
        intSizeInBytes = intSizeInBytes / 1024;
        intCounter++;
    } while (intSizeInBytes > 1024);

    return Math.max(intSizeInBytes, 0.1).toFixed(1) + arrByteUnits[intCounter];
};

/**
 * Create an array buffer from a string.
 *
 * @param str
 * @returns {ArrayBuffer}
 */
FileCryptUtil.str2ab = function (str) {
    var objBuf = new ArrayBuffer(str.length), // 2 bytes for each char
        objCollection = new Uint8Array(objBuf);

    for (var i = 0, strLen = str.length; i < strLen; i++) {
        objCollection[i] = str.charCodeAt(i);
    }

    return objBuf;
};