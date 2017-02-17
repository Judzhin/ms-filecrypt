/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileDecryptWorkerCollection = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default
    this.items = [];
    this._initComponent(this.options.count);
};

FileDecryptWorkerCollection.prototype = {

    DEFAULTS: {

        count: 4,

        listeners: {
            /**
             *
             * @param e
             */

            success: function (e) {
            },

            /**
             *
             * @param e
             */
            failure: function (e) {
            },

            /**
             *
             * @param objCollection
             */
            terminate: function(objCollection) {
            }
        }
    },

    /**
     *
     * @param intCounter
     * @private
     */
    _initComponent: function (intCounter) {

        for (var i = 0; i < intCounter; i++) {
            var objWorker = new Worker("/dist/js/worker.decrypt.js");
            objWorker.onError = this.options.listeners.failure;
            this.items.push(objWorker);
        }

        this.onSuccess(this.options.listeners.success);
    },

    /**
     *
     * @param fn
     * @returns {FileDecryptWorkerCollection}
     * @private
     */
    _forEach: function (fn) {

        this.items.forEach(function (objWorker) {
            fn(objWorker);
        });

        return this;
    },

    /**
     *
     * @returns {Number}
     */
    getLength: function () {
        return this.items.length;
    },

    /**
     *
     * @param intIndex
     * @returns {*}
     */
    getAt: function (intIndex) {
        return this.items[intIndex];
    },

    /**
     *
     * @param fn
     * @returns {FileCryptWorkerCollection}
     */
    onSuccess: function (fn) {

        this._forEach(function(objWorker){
            objWorker.addEventListener('message', fn, false);
        });

        return this;
    },

    /**
     *
     * @param objBlobCollection
     * @returns {FileDecryptWorkerCollection}
     */
    terminate: function(objBlobCollection) {

        this._forEach(function(objWorker){
            objWorker.terminate();
        });

        this.options.listeners.terminate(this, objBlobCollection);

        return this;
    }
};