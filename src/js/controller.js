import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js'; //cant pass any data in this object as we dint create it, it was already created...
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// const icons = 'static/icons.svg';
// import icons from 'static/icons.svg';
// const icons = new URL('../img/icons.svg', import.meta.url);
// const icons = './static/icons.svg';
import icons from 'url:../img/icons.svg';

import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'dotenv/config';

// const icons = '/icons.svg';
//not reloading state, by parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //1. loading recipe
    const idHash = window.location.hash.slice(1);
    if (!idHash) return;
    recipeView.renderSpinner();

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //updating the state
    await model.loadRecipe(idHash);

    //2. rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //rendering spinner in result block
    resultsView.renderSpinner();

    //getting query
    const query = searchView.getQuery();
    if (!query) return;

    //updating state
    await model.loadSearchResults(query);

    //rendering results
    resultsView.render(model.getSearchResultsPage());

    //rendering initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlServings = function (newServings) {
  if (newServings === 0 || newServings === 11) return;
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (page) {
  //updating state

  //rendering new results
  resultsView.render(model.getSearchResultsPage(page));

  //rendering new pagination buttons
  paginationView.render(model.state.search);
};

const controlLoadAndRenderBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  //add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //add spinner
    addRecipeView.renderSpinner();
    //upload recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmakrk view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // window.history.back();

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//calling on loaded
const init = function () {
  bookmarksView.addHandlerRender(controlLoadAndRenderBookmarks);
  recipeView.addHandlerRender(controlRecipes); //subscribed to recipeView publisher by giving its function
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
