import { MAX_ASCENT_RATE } from '../constants';
import Dive from '../Dive';
import { AIR } from '../GasMix';

test('no previous dive', () => {
  const dive = new Dive({
    gases: [AIR],
  });

  // decend to 40 meters
  dive.addSample({ depth: 40, intervalTime: 2 });

  let { lastSample } = dive;

  // we can stay at 40 meters for ~10 minutes
  expect(lastSample.ndl.value).toEqual(10.097413217365236);

  dive.addSample({ depth: 40, intervalTime: 28 });
  lastSample = dive.lastSample;

  let strings = Object.values(lastSample.tissues).map(
    (t) =>
      `${t.n2.gasCompartment.compartment} ${
        t.n2.pressure
      } ${t.n2.ascentCeiling()}`,
  );
  expect(strings).toEqual([
    '1 3.8685406396525837 3.5660556922255373',
    '2 3.634892158411683 7.08939427627921',
    '3 3.2612620221688347 7.255989292056431',
    '4 2.831628301246117 6.1582884633075485',
    '5 2.4004691474181032 4.133059762070255',
    '6 2.034862987602392 2.567096927743732',
    '7 1.7247840922759594 0.7984100795535124',
    '8 1.475231359900914 0',
    '9 1.2829653894301312 0',
    '10 1.1582774499345794 0',
    '11 1.0745866975584772 0',
    '12 1.0079853660052551 0',
    '13 0.955068358980804 0',
    '14 0.9126186131278868 0',
    '15 0.8791608145548517 0',
    '16 0.8528336532060483 0',
    '1b 3.832801363442152 4.761934588741987',
  ]);

  dive.addSample({ depth: 9, intervalTime: (40 - 9) / MAX_ASCENT_RATE });

  lastSample = dive.lastSample;

  strings = Object.values(lastSample.tissues).map(
    (t) =>
      `${t.n2.gasCompartment.compartment} ${
        t.n2.pressure
      } ${t.n2.ascentCeiling()}`,
  );

  expect(strings).toEqual([
    '1 3.3274288333532884 0.7071571290269528',
    '2 3.3959520585672243 5.520053552224031',
    '3 3.1631432796773904 6.541509570117244',
    '4 2.8118520418005097 6.0022581621010715',
    '5 2.4202220618068893 4.294900723275753',
    '6 2.06915676229972 2.85872500645599',
    '7 1.7613326673118905 1.1187570185605737',
    '8 1.5080878617593214 0',
    '9 1.3100563011157647 0',
    '10 1.1803897269414279 0',
    '11 1.0928422652859808 0',
    '12 1.0228874788784879 0',
    '13 0.9671313620136743 0',
    '14 0.9222946850088078 0',
    '15 0.8868880789991636 0',
    '16 0.8589861686972426 0',
    '1b 3.3979799028190905 2.316421845762555',
  ]);
});
