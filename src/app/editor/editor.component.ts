import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AtomService } from '../shared/atom.service';
import { EditRenderer } from '../shared/edit-renderer';
import { AtomDefinition, AtomAction, AtomInstance } from '../shared/atom';

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
  contextOptions = {
    delete: false,
    singleBond: false,
    doubleBond: false,
    tripleBond: false,
  };

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

    let visible = false;
    let canDelete = false;
    let singleBond = false;
    let doubleBond = false;
    let tripleBond = false;

    if (this.renderer.isSelected(event.offsetX, event.offsetY)) {
      visible = true;
      canDelete = true;
      this.contextPosition = {
        top: event.offsetY,
        left: event.offsetX,
      };
      if (this.renderer.selected.length === 2) {
        const maxBonds = this.calculateMaxBonds(this.renderer.selected);
        if (maxBonds >= 1) {
          singleBond = true;
        }
        if (maxBonds >= 2) {
          doubleBond = true;
        }
        if (maxBonds >= 3) {
          tripleBond = true;
        }
      }
    }
    this.contextOptions = {
      delete: canDelete,
      singleBond,
      doubleBond,
      tripleBond,
    };
    this.contextVisible = visible;
  }

  contextAction(event) {
    this.contextVisible = false;
    if (event === AtomAction.Delete) {
      this.renderer.deleteSelected();
    }
  }

  //TOOD Ok for now, but needs more ...
  private calculateMaxBonds(atoms: AtomInstance[]): number {
    let bonds = 0;
    const atom1 = atoms[0].atom;
    const atom2 = atoms[1].atom;
    const maximum = Math.min(3, atom1.valenceElectrons, atom2.valenceElectrons);
    const maxCapacity = atom1.electronCapacity + atom2.electronCapacity;
    for (let i = 1; i <= maximum; i++) {
      const total = atom1.valenceElectrons + atom2.valenceElectrons + i * 2;
      if (total <= maxCapacity) {
        bonds++;
      }
    }

    return bonds;
  }
}
