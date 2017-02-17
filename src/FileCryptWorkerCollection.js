/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCryptWorkerCollection = function (objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default
    this.items = [];
    this._initComponent();
};

FileCryptWorkerCollection.prototype = {

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
     * @private
     */
    _initComponent: function () {

        for (var i = 0; i < this.options.count; i++) {
            var objWorker = new Worker("/dist/js/worker.encrypt.js");
            objWorker.onError = this.options.failure;
            this.items.push(objWorker);
        }

        this.onSuccess(this.options.success);
    },

    /**
     *
     * @param fn
     * @returns {FileCryptWorkerCollection}
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