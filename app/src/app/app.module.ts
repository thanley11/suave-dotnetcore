import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpModule } from "@angular/http";

import { notes } from './notes/reducers/notes.reducer';
import { NotesDataService } from './notes/services/notes.data.service';
import { NotesEffectsService } from './notes/services/notes.effects.service';
import { Draggable, Highlightable } from './shared';
import { NotesComponent } from './notes';
import { NoteComponent } from './notes/components/note.component';
import { AddButtonComponent } from './notes/components/add.button.component';
import { NgClass } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    Draggable,
    NotesComponent,
    Highlightable,
    NoteComponent, 
    AddButtonComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    StoreModule.provideStore({notes}, {notes:[]}),
    EffectsModule.run(NotesEffectsService)
  ],
  providers: [NotesDataService],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
