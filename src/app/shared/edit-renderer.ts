import { ElementRef } from '@angular/core';
import { AtomInstance, AtomDefinition } from './atom';

const GRID_SIZE = 60;
const GRID_STYLE = '#DEDEDE';
const GRID_BORDER_STYLE = '#000000';

const CURSOR_STYLE = '#7986CB';
const CURSOR_PADDING = 2;

const ATOM_FONT = '30px sans-serif';
const ATOM_NORMAL_STYLE = 'black';
const ATOM_SELECTED_STYLE = '#273993';

const ELECTRON_OFFSETS = [
  [-4, -18],
  [4, 18],
  [-18, -4],
  [18, 6],
  [4, -18],
  [-4, 18],
  [-18, -6],
  [18, 4],
];

const SELECT_PADDING = 3;
const SELECT_STYLE = ATOM_SELECTED_STYLE;

export class EditRenderer {
  private overlayCanvas: ElementRef<HTMLCanvasElement>;
  private mainCanvas: ElementRef<HTMLCanvasElement>;
  private gridCanvas: ElementRef<HTMLCanvasElement>;

  private overlayCtx: CanvasRenderingContext2D;
  private mainCtx: CanvasRenderingContext2D;
  private gridCtx: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  private atoms: AtomInstance[] = [];
  private selectedAtoms: AtomInstance[] = [];

  constructor(
    overlayCanvas: ElementRef<HTMLCanvasElement>,
    mainCanvas: ElementRef<HTMLCanvasElement>,
    gridCanvas: ElementRef<HTMLCanvasElement>
  ) {
    this.overlayCanvas = overlayCanvas;
    this.mainCanvas = mainCanvas;
    this.gridCanvas = gridCanvas;

    this.width = mainCanvas.nativeElement.width;
    this.height = mainCanvas.nativeElement.height;

    this.overlayCtx = this.overlayCanvas.nativeElement.getContext('2d');
    this.mainCtx = this.mainCanvas.nativeElement.getContext('2d');
    this.gridCtx = this.gridCanvas.nativeElement.getContext('2d');
  }

  init() {
    this.gridCtx.strokeStyle = GRID_BORDER_STYLE;
    this.gridCtx.strokeRect(0, 0, this.width, this.height);
    for (let i = 1; i * 60 <= this.width; i++) {
      this.drawline(
        this.gridCtx,
        GRID_STYLE,
        i * GRID_SIZE,
        1,
        i * GRID_SIZE,
        this.height - 1
      );
    }
    for (let i = 1; i * GRID_SIZE <= this.height; i++) {
      this.drawline(
        this.gridCtx,
        GRID_STYLE,
        1,
        i * GRID_SIZE,
        this.width - 1,
        i * GRID_SIZE
      );
    }
  }

  moveCursor(x: number, y: number) {
    this.overlayCtx.clearRect(0, 0, this.width, this.height);
    const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
    this.overlayCtx.strokeStyle = CURSOR_STYLE;
    const size = GRID_SIZE - CURSOR_PADDING * 2;
    this.overlayCtx.strokeRect(
      gridX + CURSOR_PADDING,
      gridY + CURSOR_PADDING,
      size,
      size
    );
  }

  clearCursor() {
    this.overlayCtx.clearRect(0, 0, this.width, this.height);
  }

  isOccupied(x: number, y: number): boolean {
    if (this.findByPosition(this.atoms, x, y)) {
      return true;
    } else {
      return false;
    }
  }

  isSelected(x: number, y: number): boolean {
    if (this.findByPosition(this.selectedAtoms, x, y)) {
      return true;
    } else {
      return false;
    }
  }

  addAtom(atom: AtomDefinition, x: number, y: number) {
    const gridPosX = Math.floor(x / GRID_SIZE);
    const gridPosY = Math.floor(y / GRID_SIZE);
    const atomInstance = new AtomInstance(atom, gridPosX, gridPosY);
    this.atoms.push(atomInstance);
    this.drawAtom(atomInstance, ATOM_NORMAL_STYLE);
  }

  singleSelect(x: number, y: number) {
    const instance = this.findByPosition(this.atoms, x, y);
    for (const selected of this.selectedAtoms) {
      this.drawAtom(selected, ATOM_NORMAL_STYLE);
    }
    this.selectedAtoms = [];
    if (instance) {
      this.selectedAtoms.push(instance);
      this.drawAtom(instance, ATOM_SELECTED_STYLE);
      this.drawSelectSquare(instance);
    }
  }

  multiSelect(x: number, y: number) {
    const instance = this.findByPosition(this.atoms, x, y);
    if (instance) {
      this.selectedAtoms.push(instance);
      this.drawAtom(instance, ATOM_SELECTED_STYLE);
      this.drawSelectSquare(instance);
    }
  }

  deleteSelected() {
    for (const selected of this.selectedAtoms) {
      const index = this.atoms.findIndex(
        (item) => item.x === selected.x && item.y === selected.y
      );
      const atomInstance = this.atoms[index];
      this.atoms.splice(index, 1);
      this.mainCtx.clearRect(
        atomInstance.x * GRID_SIZE,
        atomInstance.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
    }
    this.selectedAtoms = [];
  }

  get selected() {
    return this.selectedAtoms;
  }

  private drawSelectSquare(atomInstance: AtomInstance) {
    this.mainCtx.strokeStyle = SELECT_STYLE;
    this.mainCtx.strokeRect(
      atomInstance.x * GRID_SIZE + SELECT_PADDING,
      atomInstance.y * GRID_SIZE + SELECT_PADDING,
      GRID_SIZE - SELECT_PADDING * 2,
      GRID_SIZE - SELECT_PADDING * 2
    );
  }

  private drawAtom(atomInstance: AtomInstance, style: string) {
    const atom = atomInstance.atom;
    const gridX = atomInstance.x * GRID_SIZE + GRID_SIZE / 2;
    const gridY = atomInstance.y * GRID_SIZE + GRID_SIZE / 2;

    this.mainCtx.clearRect(
      atomInstance.x * GRID_SIZE,
      atomInstance.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );

    this.mainCtx.fillStyle = style;
    if (atom.symbol) {
      this.mainCtx.font = ATOM_FONT;
      this.mainCtx.textAlign = 'center';
      this.mainCtx.textBaseline = 'middle';
      this.mainCtx.fillText(atom.symbol, gridX, gridY + 3);
    }
    if (atom.valenceElectrons) {
      for (let i = 0; i < atom.valenceElectrons; i++) {
        this.mainCtx.beginPath();
        this.mainCtx.arc(
          gridX + ELECTRON_OFFSETS[i][0],
          gridY + ELECTRON_OFFSETS[i][1],
          3,
          0,
          2 * Math.PI
        );
        this.mainCtx.fill();
      }
    }
  }

  private findByPosition(list, x: number, y: number): AtomInstance {
    const gridPosX = Math.floor(x / GRID_SIZE);
    const gridPosY = Math.floor(y / GRID_SIZE);
    return list.find((item) => item.x === gridPosX && item.y === gridPosY);
  }

  private drawline(
    ctx: CanvasRenderingContext2D,
    style: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
