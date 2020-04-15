export enum AtomAction {
  Delete,
}

export class AtomDefinition {
  name: string;
  symbol: string;
  valenceElectrons: number;
  electronCapacity: number;
}

export class AtomInstance {
  atom: AtomDefinition;
  x: number;
  y: number;
  get availableCapacity() {
    return this.atom.electronCapacity - this.atom.valenceElectrons;
  }
  constructor(atom: AtomDefinition, x: number, y: number) {
    this.atom = atom;
    this.x = x;
    this.y = y;
  }
}
