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
     * @private
     */
    _initComponent: function () {

        for (var i = 0; i < this.options.count; i++) {
            var objWorker = new Worker("/dist/js/worker.encrypt.js");
            objWorker.onError = this.options.listeners.failure;
            this.items.push(objWorker);
        }

        this.onSuccess(this.options.listeners.success);
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
     * @param objHashCollection
     * @returns {FileCryptWorkerCollection}
     */
    terminate: function(objHashCollection) {

        this._forEach(function(objWorker){
            objWorker.terminate();
        });

        if ('terminate' in this.options.listeners
            && $.isFunction(this.options.listeners['terminate'])) {
            this.options.listeners.terminate(this, objHashCollection);
        }

        return this;
    }
};