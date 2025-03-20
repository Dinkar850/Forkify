import icons from 'url:../../img/icons.svg';
// const icons = '/icons.svg';

export default class View {
  _data;
  //public api

  render(data, render = true) {
    this._data = data;
    if (!data || data?.length === 0 || Object.keys(data).length === 0) {
      return this.renderError();
    }
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._insertMarkup(markup);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>`;

    this._clear();
    this._insertMarkup(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`;
    this._clear();
    this._insertMarkup(markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._insertMarkup(markup);
  }

  update(data) {
    //updating data
    this._data = data;

    //currently changed markup
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //newDom is a big Dom object which is virtual DOM, not in the page but in the memory, parsed from some html markup

    const newElements = Array.from(newDOM.querySelectorAll('*'));

    //original markup
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //checks whether the contents in these nodes are same or not, not the nodes themselves, so if data is diff will give false...

      //updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //firstChild is the just next 'node', it maybe a text elemnet or comment, anything..
        //if the first child is some text, or comment, or has any attribute, its nodeValue will be that, otherwise it'll be null..

        curEl.textContent = newEl.textContent;
      }

      // udpates changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _insertMarkup(markup, position = 'afterbegin') {
    this._parentElement.insertAdjacentHTML(position, markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
