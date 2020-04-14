import { Injectable } from '@angular/core';

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
    },
    {
      name: 'Carbon',
      symbol: 'C',
      valenceElectrons: 4,
    },
    {
      name: 'Nitrogen',
      symbol: 'N',
      valenceElectrons: 5,
    },
    {
      name: 'Oxygen',
      symbol: 'O',
      valenceElectrons: 6,
    },
    {
      name: 'Phosphorus',
      symbol: 'P',
      valenceElectrons: 5,
    },
    {
      name: 'Sulfur',
      symbol: 'S',
      valenceElectrons: 6,
    },
  ];

  findAll(): AtomDefinition[] {
    return this.atoms;
  }

  find(symbol): AtomDefinition {
    return this.atoms.find((item) => item.symbol === symbol);
  }
}
