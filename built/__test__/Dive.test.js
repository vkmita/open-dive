'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var constants_1 = require('../constants');
var Dive_1 = require('../Dive');
var GasMix_1 = require('../GasMix');
test('no previous dive', function () {
  var dive = new Dive_1.default({
    gases: [GasMix_1.AIR],
  });
  // decend to 40 meters
  dive.addSample({ depth: 40, intervalTime: 2 });
  var lastSample = dive.lastSample();
  // we can stay at 40 meters for ~10 minutes
  expect(lastSample.noStopTime().value).toEqual(10.097413217365236);
  dive.addSample({ depth: 40, intervalTime: 28 });
  lastSample = dive.lastSample();
  var strings = Object.values(lastSample.tissues).map(function (t) {
    return (
      t.n2.gasCompartment.compartment +
      ' ' +
      t.n2.pressure +
      ' ' +
      t.n2.ascentCeiling()
    );
  });
  expect(strings).toEqual([
    '1 3.8685406396525837 3.5661',
    '2 3.634892158411683 7.0894',
    '3 3.2612620221688347 7.256',
    '4 2.831628301246117 6.1583',
    '5 2.4004691474181032 4.1331',
    '6 2.034862987602392 2.5671',
    '7 1.7247840922759594 0.7984',
    '8 1.475231359900914 0',
    '9 1.2829653894301312 0',
    '10 1.1582774499345794 0',
    '11 1.0745866975584772 0',
    '12 1.0079853660052551 0',
    '13 0.955068358980804 0',
    '14 0.9126186131278868 0',
    '15 0.8791608145548517 0',
    '16 0.8528336532060483 0',
    '1b 3.832801363442152 4.7619',
  ]);
  dive.addSample({
    depth: 9,
    intervalTime: (40 - 9) / constants_1.MAX_ASCENT_RATE,
  });
  lastSample = dive.lastSample();
  strings = Object.values(lastSample.tissues).map(function (t) {
    return (
      t.n2.gasCompartment.compartment +
      ' ' +
      t.n2.pressure +
      ' ' +
      t.n2.ascentCeiling()
    );
  });
  expect(strings).toEqual([
    '1 3.3274288333532884 0.7072',
    '2 3.3959520585672243 5.5201',
    '3 3.1631432796773904 6.5415',
    '4 2.8118520418005097 6.0023',
    '5 2.4202220618068893 4.2949',
    '6 2.06915676229972 2.8587',
    '7 1.7613326673118905 1.1188',
    '8 1.5080878617593214 0',
    '9 1.3100563011157647 0',
    '10 1.1803897269414279 0',
    '11 1.0928422652859808 0',
    '12 1.0228874788784879 0',
    '13 0.9671313620136743 0',
    '14 0.9222946850088078 0',
    '15 0.8868880789991636 0',
    '16 0.8589861686972426 0',
    '1b 3.3979799028190905 2.3164',
  ]);
});
