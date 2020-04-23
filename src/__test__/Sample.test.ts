import GasMix, { AIR } from '../GasMix';
import Sample from '../Sample';

describe('Sample', () => {
  const sample = new Sample({
    depth: 0,
    gasMix: AIR,
    time: 0,
  });
  describe('constructor', () => {
    describe('when time === 0', () => {
      it('initializes tissues saturated on surface', () => {
        const strings = Object.values(sample.tissues).map(
          (t) => `${t.n2.gasCompartment.compartment} ${t.n2.pressure}`,
        );

        expect(strings).toEqual([
          '1 0.755177884117',
          '2 0.755177884117',
          '3 0.755177884117',
          '4 0.755177884117',
          '5 0.755177884117',
          '6 0.755177884117',
          '7 0.755177884117',
          '8 0.755177884117',
          '9 0.755177884117',
          '10 0.755177884117',
          '11 0.755177884117',
          '12 0.755177884117',
          '13 0.755177884117',
          '14 0.755177884117',
          '15 0.755177884117',
          '16 0.755177884117',
          '1b 0.755177884117',
        ]);
      });
    });
  });
  describe('createNextSample', () => {
    const nextSample = sample.createNextSample({ depth: 40, intervalTime: 2 });

    it('creates the next sample with sample tissues', () => {
      const strings = Object.values(nextSample.tissues).map(
        (t) => `${t.n2.gasCompartment.compartment} ${t.n2.pressure}`,
      );

      expect(strings).toEqual([
        '1 1.2406079594836639',
        '2 1.0116946220702623',
        '3 0.9227164488565798',
        '4 0.8697238903873057',
        '5 0.8342761970073127',
        '6 0.8112193180278666',
        '7 0.7948462428057184',
        '8 0.7832218193651954',
        '9 0.7750235823920946',
        '10 0.7700100904779106',
        '11 0.7667661368810172',
        '12 0.7642497141674767',
        '13 0.7622896019117888',
        '14 0.7607414477311067',
        '15 0.7595360108919067',
        '16 0.7585964376426091',
        '1b 1.152132184292432',
      ]);
    });

    describe('with a gasSwitch', () => {
      const nitrox = new GasMix({ o2: 0.32 });
      const gasSwitchSample = new Sample({
        depth: 0,
        gasMix: AIR,
        time: 0,
        gasSwitch: nitrox,
      });

      const nextSample = gasSwitchSample.createNextSample({
        depth: 40,
        intervalTime: 2,
      });
      it('uses the switched gasMix when creating next sample', () => {
        const strings = Object.values(nextSample.tissues).map(
          (t) => `${t.n2.gasCompartment.compartment} ${t.n2.pressure}`,
        );

        expect(strings).toEqual([
          '1 1.142218312359022',
          '2 0.9592471447182191',
          '3 0.8883500386644698',
          '4 0.846182934183787',
          '5 0.8179998517425062',
          '6 0.7996781134567925',
          '7 0.7866722355237101',
          '8 0.7774407812661934',
          '9 0.7709313796588901',
          '10 0.7669511420924664',
          '11 0.7643759424113341',
          '12 0.7623783940782687',
          '13 0.7608225104441999',
          '14 0.7595936667441947',
          '15 0.7586368778514725',
          '16 0.757891126721006',
          '1b 1.0713985379086903',
        ]);
      });
    });
  });
  describe('stopTime', () => {
    // simple deco dive on air
    it('calculates an exact stopTime for each deco step', () => {
      let nextSample = sample.createNextSample({ depth: 40, intervalTime: 2 });
      nextSample = nextSample.createNextSample({ depth: 40, intervalTime: 28 });
      nextSample = nextSample.createNextSample({ depth: 9, intervalTime: 3.1 });
      expect(nextSample.stopTime({ targetDepth: 6 })).toEqual(
        0.8052835895029752,
      );
      nextSample = nextSample.createNextSample({ depth: 9, intervalTime: 1 });
      nextSample = nextSample.createNextSample({ depth: 6, intervalTime: 1 });
      expect(nextSample.stopTime({ targetDepth: 3 })).toEqual(
        5.546992046574263,
      );
      nextSample = nextSample.createNextSample({ depth: 6, intervalTime: 6 });
      nextSample = nextSample.createNextSample({ depth: 3, intervalTime: 1 });
      expect(nextSample.stopTime({ targetDepth: 0 })).toEqual(
        13.915271426753778,
      );
    });
  });
});
