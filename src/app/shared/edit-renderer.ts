import { ElementRef } from '@angular/core';

export class EditRenderer {
  readonly GRID_SIZE = 60;
  readonly GRID_STYLE = '#DEDEDE';
  readonly GRID_BORDER_STYLE = '#000000';

  readonly CURSOR_STYLE = '#0000DD';
  readonly CURSOR_PADDING = 2;

  readonly ELEMENT_FONT = '30px sans-serif';
  readonly ELEMENT_STYLE = 'black';

  readonly ELECTRON_OFFSETS = [
    [-4, -18],
    [4, 18],
    [-18, -4],
    [18, 6],
    [4, -18],
    [-4, 18],
    [-18, -6],
    [18, 4],
  ];

  private overlayCanvas: ElementRef<HTMLCanvasElement>;
  private mainCanvas: ElementRef<HTMLCanvasElement>;
  private gridCanvas: ElementRef<HTMLCanvasElement>;

  private overlayCtx: CanvasRenderingContext2D;
  private mainCtx: CanvasRenderingContext2D;
  private gridCtx: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  //TODO Replace with class
  private elements: any[] = [];

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
    this.gridCtx.strokeStyle = this.GRID_BORDER_STYLE;
    this.gridCtx.strokeRect(0, 0, this.width, this.height);
    for (let i = 1; i * 60 <= this.width; i++) {
      this.drawline(
        this.gridCtx,
        this.GRID_STYLE,
        i * this.GRID_SIZE,
        1,
        i * this.GRID_SIZE,
        this.height - 1
      );
    }
    for (let i = 1; i * this.GRID_SIZE <= this.height; i++) {
      this.drawline(
        this.gridCtx,
        this.GRID_STYLE,
        1,
        i * this.GRID_SIZE,
        this.width - 1,
        i * this.GRID_SIZE
      );
    }
  }

  moveCursor(x: number, y: number) {
    this.overlayCtx.clearRect(0, 0, this.width, this.height);
    const gridX = Math.floor(x / this.GRID_SIZE) * this.GRID_SIZE;
    const gridY = Math.floor(y / this.GRID_SIZE) * this.GRID_SIZE;
    this.overlayCtx.strokeStyle = this.CURSOR_STYLE;
    const size = this.GRID_SIZE - this.CURSOR_PADDING * 2;
    this.overlayCtx.strokeRect(
      gridX + this.CURSOR_PADDING,
      gridY + this.CURSOR_PADDING,
      size,
      size
    );
  }

  clearCursor() {
    this.overlayCtx.clearRect(0, 0, this.width, this.height);
  }

  isOccupied(x: number, y: number): boolean {
    const gridPosX = Math.floor(x / this.GRID_SIZE);
    const gridPosY = Math.floor(y / this.GRID_SIZE);
    if (
      this.elements.find(
        (item) => item.gridPosX === gridPosX && item.gridPosY === gridPosY
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  addElement(element: ChemElement, x: number, y: number) {
    const gridPosX = Math.floor(x / this.GRID_SIZE);
    const gridPosY = Math.floor(y / this.GRID_SIZE);
    this.elements.push({
      gridPosX,
      gridPosY,
      element,
    });

    const gridX = gridPosX * this.GRID_SIZE + this.GRID_SIZE / 2;
    const gridY = gridPosY * this.GRID_SIZE + this.GRID_SIZE / 2;

    if (element.symbol) {
      this.mainCtx.font = this.ELEMENT_FONT;
      this.mainCtx.textAlign = 'center';
      this.mainCtx.textBaseline = 'middle';
      this.mainCtx.fillText(element.symbol, gridX, gridY + 3);
    }
    if (element.valenceElectrons) {
      for (let i = 0; i < element.valenceElectrons; i++) {
        this.mainCtx.beginPath();
        this.mainCtx.arc(
          gridX + this.ELECTRON_OFFSETS[i][0],
          gridY + this.ELECTRON_OFFSETS[i][1],
          3,
          0,
          2 * Math.PI
        );
        this.mainCtx.fillStyle = this.ELEMENT_STYLE;
        this.mainCtx.fill();
      }
    }
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
