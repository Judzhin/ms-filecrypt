/**
 *
 * @param e
 */
self.onmessage = function (e) {

    if (e.data instanceof Object && e.data.collection) {

        // Read file
        var objFileReader = new FileReaderSync(),
            objData = objFileReader.readAsBinaryString(e.data.part);

        postMessage({
            data: objData,
            index: e.daya.index
        });
    }
};
