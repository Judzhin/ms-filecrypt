// /**
//  *
//  * @param objOptions
//  * @constructor
//  */
// var BlobFileCollection = function (objOptions) {
//
//     this.options = $.extend({}, this.DEFAULTS, objOptions);
//
//     // Default properties
//     this.items = [];
//     this.initComponent(this.options.items);
// };
//
// BlobFileCollection.prototype = {
//
//     DEFAULTS: {
//         items: []
//     },
//
//     /**
//      *
//      * @param arrItems
//      */
//     initComponent: function(arrItems){
//         arrItems.forEach($.proxy(this.add, this));
//     },
//
//     /**
//      *
//      * @param BlobFile
//      */
//     add : function(BlobFile) {
//         this.items.push(BlobFile);
//     },
//
//     /**
//      *
//      * @returns {Array}
//      */
//     getItems: function() {
//         return this.items;
//     }
// };