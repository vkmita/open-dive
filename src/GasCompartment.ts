import { ambientPressure } from './equations/pressure';

export default class GasCompartment {
  gas: 'he' | 'n2';
  halfTime: number;
  a: number;
  b: number;
  k: number;
  m0: number;

  constructor({ a, b, gas, halfTime }) {
    Object.assign(this, { a, b, gas, halfTime });

    // the k in the sschreiner equation
    this.k = Math.LN2 / halfTime;
    // m value at the surface
    this.m0 = a + ambientPressure(0) / b;
  }
}