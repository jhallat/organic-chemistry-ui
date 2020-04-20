export enum AtomAction {
  Delete = 0,
  SingleBond = 1,
  DoubleBond = 2,
  TripleBond = 3,
}

export class AtomDefinition {
  name: string;
  symbol: string;
  atomicNumber: number;
  valenceElectrons: number;
  electronCapacity: number;
}

export enum BondType {
  Single = 0,
  Double = 1,
  Triple = 2,
}

export class Bond {
  targetId: number;
  type: BondType;
}

export class AtomInstance {
  id: number;
  atom: AtomDefinition;
  x: number;
  y: number;
  bonds: Bond[] = [];
  get availableCapacity() {
    return this.atom.electronCapacity - this.atom.valenceElectrons;
  }
  constructor(id: number, atom: AtomDefinition, x: number, y: number) {
    this.id = id;
    this.atom = atom;
    this.x = x;
    this.y = y;
  }
}
