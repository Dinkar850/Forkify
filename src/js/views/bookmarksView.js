import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg?raw';
// const icons = 'static/icons.svg';
// import icons from 'static/icons.svg';
// const icons = new URL('../../img/icons.svg', import.meta.url);
// const icons = './static/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it ;)`;
  _message = ``;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    const markup = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('\n');
    return markup;
  }
}

export default new BookmarksView();
