import { Component } from '@angular/core';
import { NotesComponent } from './notes';
import { Highlightable } from './shared';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: []
})
export class AppComponent {
  title = 'Angular2 State Management Demo';
}
