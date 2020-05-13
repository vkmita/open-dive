'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var GasCompartment_1 = require('../GasCompartment');
describe('GasCompartment', function () {
  // compartment 3
  var gasCompartment = new GasCompartment_1.default({
    compartment: '3',
    inertGas: 'n2',
    halfTime: 12.5,
    a: 0.8618,
    b: 0.7222,
  });
  it('is a compartment with good calcs', function () {
    expect(gasCompartment).toEqual({
      a: 0.8618,
      b: 0.7222,
      compartment: '3',
      halfTime: 12.5,
      inertGas: 'n2',
      k: 0.055451774444795626,
      m0: 2.2648047078371643,
    });
  });
});
