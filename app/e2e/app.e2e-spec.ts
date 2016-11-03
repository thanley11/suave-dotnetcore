import { ReducerDemoPage } from './app.po';

describe('reducer-demo App', function() {
  let page: ReducerDemoPage;

  beforeEach(() => {
    page = new ReducerDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
