import GasCompartment from './GasCompartment';

type ZHL16B = Array<GasCompartment>

const ZHL16B: ZHL16B = [
  new GasCompartment({ compartment: '1', gas: 'n2', halfTime: 4.0, a: 1.2599, b: 0.524 }),
  new GasCompartment({ compartment: '1', gas: 'he', halfTime: 1.51, a: 1.7424, b: 0.4245 }),
  new GasCompartment({ compartment: '1b', gas: 'n2', halfTime: 5.0, a: 1.1696, b: 0.5578 }),
  new GasCompartment({ compartment: '1c', gas: 'he', halfTime: 1.88, a: 1.6189, b: 0.477 }),
  new GasCompartment({ compartment: '2', gas: 'n2', halfTime: 8.0, a: 1.0, b: 0.6514 }),
  new GasCompartment({ compartment: '2', gas: 'he', halfTime: 3.02, a: 1.383, b: 0.5747 }),
  new GasCompartment({ compartment: '3', gas: 'n2', halfTime: 12.5, a: 0.8618, b: 0.7222 }),
  new GasCompartment({ compartment: '3', gas: 'he', halfTime: 4.72, a: 1.1919, b: 0.6527 }),
  new GasCompartment({ compartment: '4', gas: 'n2', halfTime: 18.5, a: 0.7562, b: 0.7825 }),
  new GasCompartment({ compartment: '4', gas: 'he', halfTime: 6.99, a: 1.0458, b: 0.7223 }),
  new GasCompartment({ compartment: '5', gas: 'n2', halfTime: 27.0, a: 0.6491, b: 0.8126 }),
  new GasCompartment({ compartment: '5', gas: 'he', halfTime: 10.21, a: 0.922, b: 0.7582 }),
  new GasCompartment({ compartment: '6', gas: 'n2', halfTime: 38.3, a: 0.5316, b: 0.8434 }),
  new GasCompartment({ compartment: '6', gas: 'he', halfTime: 14.48, a: 0.8205, b: 0.7957 }),
  new GasCompartment({ compartment: '7', gas: 'n2', halfTime: 54.3, a: 0.4681, b: 0.8693 }),
  new GasCompartment({ compartment: '7', gas: 'he', halfTime: 20.53, a: 0.7305, b: 0.8279 }),
  new GasCompartment({ compartment: '8', gas: 'n2', halfTime: 77.0, a: 0.4301, b: 0.891 }),
  new GasCompartment({ compartment: '8', gas: 'he', halfTime: 29.11, a: 0.6502, b: 0.8553 }),
  new GasCompartment({ compartment: '9', gas: 'n2', halfTime: 109.0, a: 0.4049, b: 0.9092 }),
  new GasCompartment({ compartment: '9', gas: 'he', halfTime: 41.2, a: 0.595, b: 0.8757 }),
  new GasCompartment({ compartment: '10', gas: 'n2', halfTime: 146.0, a: 0.3719, b: 0.9222 }),
  new GasCompartment({ compartment: '10', gas: 'he', halfTime: 55.19, a: 0.5545, b: 0.8903 }),
  new GasCompartment({ compartment: '11', gas: 'n2', halfTime: 187.0, a: 0.3447, b: 0.9313 }),
  new GasCompartment({ compartment: '11', gas: 'he', halfTime: 70.69, a: 0.5333, b: 0.8997 }),
  new GasCompartment({ compartment: '12', gas: 'n2', halfTime: 239.0, a: 0.3176, b: 0.9403 }),
  new GasCompartment({ compartment: '12', gas: 'he', halfTime: 90.34, a: 0.5189, b: 0.9073 }),
  new GasCompartment({ compartment: '13', gas: 'n2', halfTime: 305.0, a: 0.2828, b: 0.9477 }),
  new GasCompartment({ compartment: '13', gas: 'he', halfTime: 115.29, a: 0.5181, b: 0.9122 }),
  new GasCompartment({ compartment: '14', gas: 'n2', halfTime: 390.0, a: 0.2716, b: 0.9544 }),
  new GasCompartment({ compartment: '14', gas: 'he', halfTime: 147.42, a: 0.5176, b: 0.9171 }),
  new GasCompartment({ compartment: '15', gas: 'n2', halfTime: 498.0, a: 0.2523, b: 0.9602 }),
  new GasCompartment({ compartment: '15', gas: 'he', halfTime: 188.24, a: 0.5172, b: 0.9217 }),
  new GasCompartment({ compartment: '16', gas: 'n2', halfTime: 635.0, a: 0.2327, b: 0.9653 }),
  new GasCompartment({ compartment: '16', gas: 'he', halfTime: 240.03, a: 0.5119, b: 0.9267 }),
];

export default ZHL16B;