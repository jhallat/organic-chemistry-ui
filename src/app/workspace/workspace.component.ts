import { Component, OnInit } from '@angular/core';
import { AtomService } from '../shared/atom.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  constructor(private elementService: AtomService) {}

  elements: ChemElement[];

  ngOnInit() {
    this.elements = this.elementService.findAll();
  }

  drag(event, element) {
    event.dataTransfer.setData('symbol', element.symbol);
  }
}
