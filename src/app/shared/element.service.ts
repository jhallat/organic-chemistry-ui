import { Injectable } from "@angular/core";
import { isNgTemplate } from "@angular/compiler";

@Injectable({
  providedIn: "root",
})
export class ElementService {
  constructor() {}

  private elements: ChemElement[] = [
    {
      name: "Hydrogen",
      symbol: "H",
      valenceElectrons: 1,
    },
    {
      name: "Carbon",
      symbol: "C",
      valenceElectrons: 4,
    },
    {
      name: "Nitrogen",
      symbol: "N",
      valenceElectrons: 5,
    },
    {
      name: "Oxygen",
      symbol: "O",
      valenceElectrons: 6,
    },
    {
      name: "Phosphorus",
      symbol: "P",
      valenceElectrons: 5,
    },
    {
      name: "Sulfur",
      symbol: "S",
      valenceElectrons: 6,
    },
  ];

  findAll(): ChemElement[] {
    return this.elements;
  }

  find(symbol): ChemElement {
    return this.elements.find((item) => item.symbol === symbol);
  }
}
