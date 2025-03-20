import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg';
// const icons = 'static/icons.svg';
// import icons from 'static/icons.svg';
const icons = new URL('../../img/icons.svg', import.meta.url);

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again :')`;
  _message = ``;

  _generateMarkup() {
    const markup = this._data
      .map(result => previewView.render(result, false))
      .join('\n');
    return markup;
  }
}

export default new ResultsView();
