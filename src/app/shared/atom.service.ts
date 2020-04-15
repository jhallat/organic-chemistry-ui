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
      valenceElectrons: 1,
      electronCapacity: 2,
    },
    {
      name: 'Carbon',
      symbol: 'C',
      valenceElectrons: 4,
      electronCapacity: 8,
    },
    {
      name: 'Nitrogen',
      symbol: 'N',
      valenceElectrons: 5,
      electronCapacity: 8,
    },
    {
      name: 'Oxygen',
      symbol: 'O',
      valenceElectrons: 6,
      electronCapacity: 8,
    },
    {
      name: 'Phosphorus',
      symbol: 'P',
      valenceElectrons: 5,
      electronCapacity: 8,
    },
    {
      name: 'Sulfur',
      symbol: 'S',
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
