/**
 * ObjectId type constructor
 *
 * ####Example
 *
 *     const id = new mongoose.Types.ObjectId;
 *
 * @constructor ObjectId
 */

'use strict';

const ObjectId = require('../driver').get().ObjectId;
const objectIdSymbol = require('../helpers/symbols').objectIdSymbol;

/*!
 * Getter for convenience with populate, see gh-6115
 */

Object.defineProperty(ObjectId.prototype, '_id', {
  enumerable: false,
  configurable: true,
  get: function() {
    return this;
  }
});

/*!
 * Convenience `valueOf()` to allow comparing ObjectIds using double equals re: gh-7299
 */

if (ObjectId.prototype.valueOf === void 0) {
  ObjectId.prototype.valueOf = function objectIdValueOf() {
    return this.toString();
  };
}

ObjectId.prototype[objectIdSymbol] = true;

module.exports = ObjectId;
