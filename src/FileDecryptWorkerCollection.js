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
        }
    },

    /**
     *
     * @param intCounter
     * @private
     */
    _initComponent: function (intCounter) {

        for (var i = 0; i < intCounter; i++) {
            var objWorker = new Worker("/src/worker.decrypt.js");
            objWorker.onError = this.options.failure;
            this.items.push(objWorker);
        }

        this.onSuccess(this.options.success);
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
     * @returns {FileCryptWorkerCollection}
     */
    terminate: function() {

        this._forEach(function(objWorker){
            objWorker.terminate();
        });

        return this;
    }
};