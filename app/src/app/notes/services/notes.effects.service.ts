import { Injectable, OnDestroy } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { NotesDataService } from './notes.data.service';
import { Note } from '../../app.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Actions, Effect, toPayload } from '@ngrx/effects'

// @Injectable()
// export class NotesEffectsService {
//   constructor( private actions$: Actions) {}


@Injectable()
export class NotesEffectsService {
  constructor(
    private notesDataService: NotesDataService,
    private http: Http,
    private actions$: Actions
  ) { }


  // @Effect() update$ = this.actions$
  //   .whenAction('UPDATE_NOTE_TEXT', 'UPDATE_NOTE_POSITION', 'ADD_NOTE')
  //   .map(update => update.state.notes)
  //   .mergeMap(notes => Observable.from(notes))
  //   .filter((note:Note) => {return (note.dirty==true)})
  //   .switchMap((updatedNote:Note) => this.notesDataService.addOrUpdateNote(updatedNote)
  //     .map((responseNote:Note) => ({ type: "UPDATE_NOTE_FROM_SERVER", payload: { note: responseNote } }))
  //     .catch(() => Observable.of({ type: "UPDATE_FAILED" }))
  //   )

  @Effect() update$ = this.actions$
    .ofType('UPDATE_NOTE_TEXT', 'UPDATE_NOTE_POSITION', 'ADD_NOTE')
    .map(toPayload)
    //.mergeMap(notes => Observable.from(notes))
    .filter((note:Note) => {return (note.dirty==true)})
    .switchMap((updatedNote:Note) => this.notesDataService.addOrUpdateNote(updatedNote)
      .map((responseNote:Note) => ({ type: "UPDATE_NOTE_FROM_SERVER", payload: { note: responseNote } }))
      .catch(() => Observable.of({ type: "UPDATE_FAILED" }))
    )

  @Effect() init$ = this.actions$
    .ofType('INIT_NOTES')
    .switchMap(() => this.notesDataService.getNotes()
      .mergeMap(notes => Observable.from(notes))
      .map(res => ({ type: "ADD_NOTE_FROM_SERVER", payload: res }))
      .catch(() => Observable.of({ type: "FETCH_FAILED" }))
    )
}

// @Effect() queueVideoReady$ = this.store$
//     .whenAction(NowPlaylistActions.QUEUE_LOAD_VIDEO)
//     .map<GoogleApiYouTubeSearchResource>(toPayload)
//     .switchMap(media => this.youtubeVideosInfo.fetchVideoData(media.id.videoId)
// to
//   @Effect() queueVideoReady$ = this.actions$
//     .ofType(NowPlaylistActions.QUEUE_LOAD_VIDEO)
//     .map(action => action.payload)
//     .switchMap((media: GoogleApiYouTubeSearchResource) => this.youtubeVideosInfo.fetchVideoData(media.id.videoId)