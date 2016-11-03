import {
  addProviders,
  inject

} from '@angular/core/testing';
import { AppComponent } from '../app/app.component';


// describe('App: MyApp', () => {
//   it('should create the app',
//       inject([AppComponent], (app: AppComponent) => {
//     expect(app).toBeTruthy();
//   }));

//   it('should have as title \'Angular2 State Management Demo\'',
//       inject([AppComponent], (app: AppComponent) => {
//     expect(app.title).toEqual('Angular2 State Management Demo');
//   }));
// });

describe('App: MyApp', () => {
  beforeEach(() => {
      addProviders([AppComponent]);
    });

  it('should create the app',
      inject([AppComponent], (app: AppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'Angular2 State Management Demo\'',
      inject([AppComponent], (app: AppComponent) => {
    expect(app.title).toEqual('Angular2 State Management Demo');
  }));
});
