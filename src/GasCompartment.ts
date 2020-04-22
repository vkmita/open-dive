import { ambientPressure } from './equations/pressure';

type InertGas = 'he' | 'n2';

export default class GasCompartment {
  inertGas: InertGas;
  compartment: 'string';
  halfTime: number;
  a: number;
  b: number;
  k: number;
  m0: number;

  constructor({
    a,
    b,
    compartment,
    inertGas,
    halfTime,
  }: {
    a: number;
    b: number;
    compartment: string;
    inertGas: InertGas;
    halfTime: number;
  }) {
    Object.assign(this, { a, b, compartment, inertGas, halfTime });

    // the k in the schreiner equation
    this.k = Math.LN2 / halfTime;
    // m value at the surface
    this.m0 = a + ambientPressure(0) / b;
  }
}
