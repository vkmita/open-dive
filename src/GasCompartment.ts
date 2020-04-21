import { ambientPressure } from './equations/pressure';

type InterGas = 'he' | 'n2';

export default class GasCompartment {
  gas: InterGas;
  compartment: 'string';
  halfTime: number;
  a: number;
  b: number;
  k: number;
  m0: number;

  constructor(
    { a, b, compartment, gas, halfTime }: 
    { a: number, b: number, compartment: string, gas: InterGas, halfTime: number }
  ) {
    Object.assign(this, { a, b, compartment, gas, halfTime });

    // the k in the schreiner equation
    this.k = Math.LN2 / halfTime;
    // m value at the surface
    this.m0 = a + ambientPressure(0) / b;
  }
}