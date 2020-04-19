import { forIn } from 'lodash';
import alveolarPressure from './alveolarPressure';
import absolutePressure, { depthPressure } from './absolutePressure';
import ZHL16B from './ZHL16B';
import tissuePressure from './tissuePressure';
import noStopTime from './noStopTime';
import ascentCeiling from './ascentCeiling';

export const initializeDive = ({ n2Ratio, heRatio }) => {
  const startedAt = Date.now();

  const sample = {
    depth: 0,
    timestamp: startedAt,
    tissues: {},
    heRatio,
    n2Ratio,
  };

  // all tissues fully saturated at surface
  const initalN2Pressure = alveolarPressure(absolutePressure(0), n2Ratio);
  const initialHePressure = 0;

  Object.keys(ZHL16B).forEach(
    (compartmentNumber) =>
      (sample.tissues[compartmentNumber] = {
        n2: initalN2Pressure,
        he: initialHePressure,
      }),
  );

  return {
    startedAt,
    samples: [sample],
  };
};

export const createNextSample = ({ prevSample, depth, time }) => {
  const { heRatio, n2Ratio } = prevSample;

  const sample = {
    depth,
    heRatio,
    n2Ratio,
    timestamp: time,
    tissues: {},
  };

  const intervalTime = (time - prevSample.timestamp) / (60 * 1000.0);
  let ndl, ceiling;

  forIn(ZHL16B, (compartment, compartmentNumber) => {
    const {
      n2,
      n2: { halfTime: n2Halftime },
      he,
      he: { halfTime: heHalfTime },
    } = compartment;

    const n2Pressure = tissuePressure({
      startTissuePressure: prevSample.tissues[compartmentNumber].n2,
      gasRatio: n2Ratio,
      startDepth: prevSample.depth,
      endDepth: depth,
      intervalTime,
      halfTime: n2Halftime,
    });

    const hePressure = tissuePressure({
      startTissuePressure: prevSample.tissues[compartmentNumber].he,
      gasRatio: heRatio,
      startDepth: prevSample.depth,
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
    const n2AscentCeiling = ascentCeiling(n2Pressure, n2);
    if (!ceiling || n2AscentCeiling > ceiling.pressure) {
      ceiling = { 
        gas: 'n2', 
        pressure: n2AscentCeiling,
        depth: depthPressure(n2AscentCeiling),
        compartment: compartmentNumber,
      };
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

    const heAscentCeiling = ascentCeiling(n2Pressure, he);
    if (!ceiling || heAscentCeiling > ceiling.pressure) {
      ceiling = { 
        gas: 'he', 
        pressure: heAscentCeiling, 
        depth: depthPressure(heAscentCeiling), 
        compartment: compartmentNumber,
      };
    }

    sample.tissues[compartmentNumber] = {
      n2: n2Pressure,
      he: hePressure,
    };
  });

  return Object.assign(sample, { ndl, ascentCeiling: ceiling });
};

// adds a sample (dive interval) to the dive
export const addSample = ({ depth, dive, time }) => {
  const prevSample = dive.samples[dive.samples.length - 1];

  const nextSample = createNextSample({ depth, prevSample, time });
  dive.samples.push(nextSample);

  return dive;
};

