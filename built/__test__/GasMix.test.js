'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var GasMix_1 = require('../GasMix');
describe('GasMix', function () {
  it('automatically creates n2, he, and o2 gases', function () {
    var gasMix = new GasMix_1.default({ he: 0, o2: 0.21 });
    expect(gasMix.he.ratio).toEqual(0);
    expect(gasMix.n2.ratio).toEqual(0.79);
    expect(gasMix.o2.ratio).toEqual(0.21);
  });
});
