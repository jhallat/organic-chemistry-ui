import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AtomAction } from '../shared/atom';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit {
  @Input() top: number;
  @Input() left: number;
  @Output() action = new EventEmitter<AtomAction>();

  constructor() {}

  ngOnInit() {}

  onDelete() {
    this.action.emit(AtomAction.Delete);
  }
}
