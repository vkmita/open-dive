'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var Gas_1 = require('./Gas');
/**
 * A class representing a mix of gases
 */
var GasMix = /** @class */ (function () {
  /**
   * Create a gas mix
   * @constructor
   * @param he The ratio of helium in the mix
   * @param o2 The ratio of oxygen in the mix
   */
  function GasMix(_a) {
    var he = _a.he,
      o2 = _a.o2;
    var heRatio = he || 0;
    Object.assign(this, {
      he: new Gas_1.default({ gas: 'he', ratio: heRatio }),
      // o2 should always exist if you want to live
      o2: new Gas_1.default({ gas: 'o2', ratio: o2 }),
      n2: new Gas_1.default({ gas: 'n2', ratio: 1 - heRatio - o2 }),
    });
  }
  return GasMix;
})();
exports.default = GasMix;
exports.AIR = new GasMix({ o2: 0.21 });
