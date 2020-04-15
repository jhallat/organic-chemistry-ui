import { Injectable } from '@angular/core';
import { AtomDefinition } from './atom';

@Injectable({
  providedIn: 'root',
})
export class AtomService {
  constructor() {}

  private atoms: AtomDefinition[] = [
    {
      name: 'Hydrogen',
      symbol: 'H',
      atomicNumber: 1,
      valenceElectrons: 1,
      electronCapacity: 2,
    },
    {
      name: 'Carbon',
      symbol: 'C',
      atomicNumber: 6,
      valenceElectrons: 4,
      electronCapacity: 8,
    },
    {
      name: 'Nitrogen',
      symbol: 'N',
      atomicNumber: 7,
      valenceElectrons: 5,
      electronCapacity: 8,
    },
    {
      name: 'Oxygen',
      symbol: 'O',
      atomicNumber: 8,
      valenceElectrons: 6,
      electronCapacity: 8,
    },
    {
      name: 'Phosphorus',
      symbol: 'P',
      atomicNumber: 15,
      valenceElectrons: 5,
      electronCapacity: 8,
    },
    {
      name: 'Sulfur',
      symbol: 'S',
      atomicNumber: 16,
      valenceElectrons: 6,
      electronCapacity: 8,
    },
  ];

  findAll(): AtomDefinition[] {
    return this.atoms;
  }

  find(symbol): AtomDefinition {
    return this.atoms.find((item) => item.symbol === symbol);
  }
}
