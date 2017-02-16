/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 * @param objOptions
 * @constructor
 */
var FileCryptWorkerCollection = function(objOptions) {
    this.options = $.extend({}, this.DEFAULTS, objOptions);

    // Default
    this.items = [];
    this.initComponent();
};

FileCryptWorkerCollection.prototype = {
    DEFAULTS: {
        count: 4
    },

    initComponent: function() {
        for(var i = 0; i < this.options.count; i++){
            this.items.push(new Worker("js/filecrypt.worker.js"));
        }
    },

    /**
     *
     * @returns {Number}
     */
    getLength: function() {
        return this.items.length;
    },

    /**
     *
     * @param intIndex
     * @returns {*}
     */
    getAt: function(intIndex) {
        return this.items[intIndex];
    },

    /**
     *
     * @param fn
     */
    forEach : function(fn) {

        this.items.forEach(function (item) {
            item.addEventListener('message', fn, false);

            /**
             *
             * @param e
             */
            item.onError = function(e){
                alert('error worker');
            };
        });
    }
};