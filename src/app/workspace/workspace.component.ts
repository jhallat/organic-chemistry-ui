import { Component, OnInit } from '@angular/core';
import { AtomService } from '../shared/atom.service';
import { AtomDefinition } from '../shared/atom';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  constructor(private atomService: AtomService) {}

  atoms: AtomDefinition[];

  ngOnInit() {
    this.atoms = this.atomService.findAll();
  }

  drag(event, atom) {
    event.dataTransfer.setData('symbol', atom.symbol);
  }
}
