import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AtomDefinition } from '../shared/atom';

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss'],
})
export class AtomComponent implements OnInit {
  @Input() atom: AtomDefinition;

  constructor() {}

  ngOnInit() {
    console.log(this.atom);
  }
}
