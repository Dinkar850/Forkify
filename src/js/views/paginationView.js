import View from './View.js';
import icons from 'url:../../img/icons.svg?raw';
// const icons = 'static/icons.svg';
// import icons from 'static/icons.svg';
// const icons = new URL('../../img/icons.svg', import.meta.url);
// const icons = './static/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    //page 1 and there other pages
    if (this._data.page === 1 && this._data.maxPages > 1) {
      return `<button data-goto="2" class="btn--inline pagination__btn--next">
            <span>Page 2</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //last page
    if (this._data.page === this._data.maxPages && this._data.maxPages > 1) {
      return `<button data-goto="${
        this._data.maxPages - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.maxPages - 1}</span>
          </button>`;
    }

    //other page
    if (this._data.page < this._data.maxPages) {
      return `<button data-goto = "${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          
          <button data-goto="${
            this._data.page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
    }

    //page 1 and there are no other pages
    return '';
  }
}

export default new PaginationView();
