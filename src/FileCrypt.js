/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCrypt = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Constructor
    this._initComponent(
        this.options.file,
        this.options.passphrase
    );
};

FileCrypt.prototype = {

    DEFAULTS: {

        file: {},
        passphrase: '',
        chunk_size: 1024 * 1024, // 1MB
        delimiter: '/file-crypt-delimiter/',
        listeners: {
            crypting: function () {
                // file event
            },
            crypted: function() {
                // file event
            }
        },
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
     * @returns {FileCrypt}
     */
    setFile: function(objFile) {
        this.options.file = objFile;
        return this;
    },

    /**
     *
     * @param strPassphrase
     * @returns {FileCrypt}
     */
    setPassphrase: function(strPassphrase) {
        this.options.passphrase = strPassphrase;
        return this;
    },

    /**
     *
     * @param intChunkSize
     * @returns {FileCrypt}
     */
    setChunkSize: function(intChunkSize) {
        this.options.options.chunk_size = intChunkSize;
        return this;
    },

    /**
     *
     * @returns {*}
     */
    getFileName: function() {
        return this.options.file.name;
    },

    /**
     *
     * @param fn
     */
    encrypting: function(fn) {

        if ($.isFunction(fn)) {
            this.options.listeners.crypting = fn;
        } else if($.isPlainObject(fn)) {

            if ('crypting' in fn && $.isFunction(fn['crypting'])) {
                this.options.listeners.crypting = fn['crypting'];
            }

            if ('crypted' in fn && $.isFunction(fn['crypted'])) {
                this.options.listeners.crypted = fn['crypted'];
            }
        }

        this._encrypted = this._encrypt(
            new FileCryptBlobCollection({
                file: this.options.file,
                chunk_size: this.options.chunk_size
            }),
            this.options.passphrase
        );

        return this;
    },

    /**
     *
     * @param objFile
     * @param strPassphrase
     * @private
     */
    _initComponent: function (objFile, strPassphrase) {

        if (!objFile || !strPassphrase) {
            return;
        }

        this.setFile(objFile);
        this.setPassphrase(strPassphrase);
        this.encrypting();
    },

    /**
     *
     * @param objBlobCollection
     * @param strPassphrase
     * @returns {FileCryptHashCollection}
     * @private
     */
    _encrypt: function (objBlobCollection, strPassphrase) {

        var objHashCollection = new FileCryptHashCollection({
            delimiter: this.options.delimiter
        });

        var objWorkerCollection = new FileCryptWorkerCollection({
            count: objBlobCollection.getLength(),
            listeners: {
                terminate: this.options.listeners.crypted
            }
        });

        var intCounter = 0;

        objWorkerCollection.onSuccess($.proxy(function (e) {

            ++intCounter;

            // fire event
            this.options.listeners.crypting({
                process: 100 / objBlobCollection.getLength() * intCounter
            });

            objHashCollection.add(
                e.data.data,
                e.data.index
            );

            if (intCounter === objBlobCollection.getLength()) {
                objWorkerCollection.terminate(objHashCollection);
            }

        }, this));

        objBlobCollection.forEach(function (objBlob, intIndex) {
            objWorkerCollection.getAt(intIndex % objWorkerCollection.getLength()).postMessage({
                part: objBlob,
                index: intIndex,
                passphrase: strPassphrase
            });
        });

        return objHashCollection;
    },

    /**
     *
     * @param objOptions
     * @returns {*}
     */
    save: function (objOptions) {

        var objSettings = $.extend({
                headers: {
                    'X-File-Content-Length': this.options.file.size,
                    'X-File-Content-Type': this.options.file.type,
                    'X-File-Name': this.options.file.name
                },
                data: this._encrypted.toString()
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