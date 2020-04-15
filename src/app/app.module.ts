import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AtomComponent } from './element/atom.component';
import { EditorComponent } from './editor/editor.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    AtomComponent,
    EditorComponent,
    ContextMenuComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
