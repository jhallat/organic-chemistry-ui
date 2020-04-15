import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AtomService } from '../shared/atom.service';
import { EditRenderer } from '../shared/edit-renderer';
import { AtomDefinition, AtomAction } from '../shared/atom';

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

  contextVisible = false;
  contextPosition = { top: 0, left: 0 };

  constructor(private elementService: AtomService) {}

  ngOnInit() {
    this.renderer = new EditRenderer(this.oCanvas, this.canvas, this.gCanvas);
    this.renderer.init();
  }

  drop(event) {
    const symbol = event.dataTransfer.getData('symbol');
    const atom: AtomDefinition = this.elementService.find(symbol);
    this.renderer.addAtom(atom, event.offsetX, event.offsetY);
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

  click(event) {
    this.contextVisible = false;
    if (event.ctrlKey) {
      this.renderer.multiSelect(event.offsetX, event.offsetY);
    } else {
      this.renderer.singleSelect(event.offsetX, event.offsetY);
    }
  }

  contextMenu(event) {
    event.preventDefault();
    if (this.renderer.isSelected(event.offsetX, event.offsetY)) {
      this.contextVisible = true;
      this.contextPosition = {
        top: event.offsetY,
        left: event.offsetX,
      };
    } else {
      this.contextVisible = false;
    }
  }

  contextAction(event) {
    this.contextVisible = false;
    if (event === AtomAction.Delete) {
      this.renderer.deleteSelected();
    }
  }
}
