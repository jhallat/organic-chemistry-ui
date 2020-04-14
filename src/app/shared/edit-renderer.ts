import { ElementRef } from '@angular/core';

const GRID_SIZE = 60;
const GRID_STYLE = '#DEDEDE';
const GRID_BORDER_STYLE = '#000000';

const CURSOR_STYLE = '#0000DD';
const CURSOR_PADDING = 2;

const ELEMENT_FONT = '30px sans-serif';
const ELEMENT_NORMAL_STYLE = 'black';
const ELEMENT_SELECTED_STYLE = '#0000DD';

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
const SELECT_STYLE = ELEMENT_SELECTED_STYLE;

export class EditRenderer {
  private overlayCanvas: ElementRef<HTMLCanvasElement>;
  private mainCanvas: ElementRef<HTMLCanvasElement>;
  private gridCanvas: ElementRef<HTMLCanvasElement>;

  private overlayCtx: CanvasRenderingContext2D;
  private mainCtx: CanvasRenderingContext2D;
  private gridCtx: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  private elements: ElementInstance[] = [];
  private selectedElements: ElementInstance[] = [];

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
    if (this.findByPosition(x, y)) {
      return true;
    } else {
      return false;
    }
  }

  addElement(element: ElementDefinition, x: number, y: number) {
    const gridPosX = Math.floor(x / GRID_SIZE);
    const gridPosY = Math.floor(y / GRID_SIZE);
    const elementInstance: ElementInstance = {
      x: gridPosX,
      y: gridPosY,
      element,
    };
    this.elements.push(elementInstance);
    this.drawElement(elementInstance, ELEMENT_NORMAL_STYLE);
  }

  singleSelect(x: number, y: number) {
    const instance = this.findByPosition(x, y);
    for (const selected of this.selectedElements) {
      this.drawElement(selected, ELEMENT_NORMAL_STYLE);
    }
    this.selectedElements = [];
    if (instance) {
      this.selectedElements.push(instance);
      this.drawElement(instance, ELEMENT_SELECTED_STYLE);
      this.drawSelectSquare(instance);
    }
  }

  multiSelect(x: number, y: number) {
    const instance = this.findByPosition(x, y);
    if (instance) {
      this.selectedElements.push(instance);
      this.drawElement(instance, ELEMENT_SELECTED_STYLE);
      this.drawSelectSquare(instance);
    }
  }

  private drawSelectSquare(elementInstance: ElementInstance) {
    this.mainCtx.strokeStyle = SELECT_STYLE;
    this.mainCtx.strokeRect(
      elementInstance.x * GRID_SIZE + SELECT_PADDING,
      elementInstance.y * GRID_SIZE + SELECT_PADDING,
      GRID_SIZE - SELECT_PADDING * 2,
      GRID_SIZE - SELECT_PADDING * 2
    );
  }

  private drawElement(elementInstance: ElementInstance, style: string) {
    const element = elementInstance.element;
    const gridX = elementInstance.x * GRID_SIZE + GRID_SIZE / 2;
    const gridY = elementInstance.y * GRID_SIZE + GRID_SIZE / 2;

    this.mainCtx.clearRect(
      elementInstance.x * GRID_SIZE,
      elementInstance.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );

    this.mainCtx.fillStyle = style;
    if (element.symbol) {
      this.mainCtx.font = ELEMENT_FONT;
      this.mainCtx.textAlign = 'center';
      this.mainCtx.textBaseline = 'middle';
      this.mainCtx.fillText(element.symbol, gridX, gridY + 3);
    }
    if (element.valenceElectrons) {
      for (let i = 0; i < element.valenceElectrons; i++) {
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

  private findByPosition(x: number, y: number): ElementInstance {
    const gridPosX = Math.floor(x / GRID_SIZE);
    const gridPosY = Math.floor(y / GRID_SIZE);
    return this.elements.find(
      (item) => item.x === gridPosX && item.y === gridPosY
    );
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
