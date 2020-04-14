import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ElementService } from '../shared/element.service';
import { EditRenderer } from '../shared/edit-renderer';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @ViewChild('mainCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('overlayCanvas', { static: true })
  oCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('gridCanvas', { static: true })
  gCanvas: ElementRef<HTMLCanvasElement>;

  private renderer: EditRenderer;

  private ctx: CanvasRenderingContext2D;
  private oCtx: CanvasRenderingContext2D;

  constructor(private elementService: ElementService) {}

  ngOnInit() {
    this.renderer = new EditRenderer(this.oCanvas, this.canvas, this.gCanvas);
    this.renderer.init();
  }

  drop(event) {
    const symbol = event.dataTransfer.getData('symbol');
    const element: ChemElement = this.elementService.find(symbol);
    this.renderer.addElement(element, event.offsetX, event.offsetY);
  }

  mouseMove(event) {
    this.renderer.moveCursor(event.offsetX, event.offsetY);
  }

  mouseLeave() {
    this.renderer.clearCursor();
  }

  allowDrop(event) {
    if (!this.renderer.isOccupied(event.offsetX, event.offsetY)) {
      event.preventDefault();
    }
  }
}
