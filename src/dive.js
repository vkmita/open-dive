import { forIn } from 'lodash';
import alveolarPressure from './alveolarPressure';
import absolutePressure from './absolutePressure';
import ZHL17B from './ZHL16B';
import tissuePressure from './tissuePressure';
import noStopTime from './noStopTime';

export const initializeDive = ({ n2Ratio, heRatio }) => {
  const startedAt = Date.now();

  const sample = {
    depth: 0,
    timestamp: startedAt,
    tissues: {},
  };

  // all tissues fully saturated at surface
  const initalN2Pressure = alveolarPressure(absolutePressure(0), n2Ratio);
  const initialHePressure = 0;

  Object.keys(ZHL17B).forEach(
    (compartmentNumber) =>
      (sample.tissues[compartmentNumber] = {
        n2: initalN2Pressure,
        he: initialHePressure,
      }),
  );

  return {
    startedAt,
    heRatio,
    n2Ratio,
    samples: [sample],
  };
};

// adds a sample (dive interval) to the dive
export const addSample = ({ depth, dive, time }) => {
  const sample = {
    depth,
    timestamp: time,
    tissues: {},
  };

  const lastSample = dive.samples[dive.samples.length - 1];
  const { heRatio, n2Ratio } = dive;

  const intervalTime = (time - lastSample.timestamp) / 1000.0;
  let ndl;

  forIn(ZHL17B, (compartment, compartmentNumber) => {
    const {
      n2,
      n2: { halfTime: n2Halftime },
      he,
      he: { halfTime: heHalfTime },
    } = compartment;

    const n2Pressure = tissuePressure({
      startTissuePressure: lastSample.tissues[compartmentNumber].n2,
      gasRatio: n2Ratio,
      startDepth: lastSample.depth,
      endDepth: depth,
      intervalTime,
      halfTime: n2Halftime,
    });

    const hePressure = tissuePressure({
      startTissuePressure: lastSample.tissues[compartmentNumber].he,
      gasRatio: heRatio,
      startDepth: lastSample.depth,
      endDepth: depth,
      intervalTime,
      halfTime: heHalfTime,
    });

    const n2StopTime = noStopTime({
      compartment: n2,
      gasRatio: n2Ratio,
      tissuePressure: n2Pressure,
      depth,
    });
    if (!ndl || n2StopTime < ndl.value) {
      ndl = { gas: 'n2', value: n2StopTime, compartment: compartmentNumber };
    }
    const heStopTime = noStopTime({
      compartment: he,
      gasRatio: heRatio,
      tissuePressure: hePressure,
      depth,
    });
    if (!ndl || heStopTime < ndl.value) {
      ndl = { gas: 'he', value: heStopTime, compartment: compartmentNumber };
    }

    sample.tissues[compartmentNumber] = {
      n2: n2Pressure,
      he: hePressure,
    };
  });

  sample.ndl = ndl;
  dive.samples.push(sample);

  return dive;
};
