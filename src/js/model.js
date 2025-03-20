import { async } from 'regenerator-runtime';
import 'dotenv/config';

import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
import { setImmediate } from 'core-js';
// import { values } from 'core-js/core/array';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //approach
  });
};

//function fetches recipes from api, updates the state which has a live connection to itself from wherever its imported, does not return anything, not a pure function as manipulating the state
export const loadRecipe = async function (idHash) {
  try {
    const data = await AJAX(`${API_URL}${idHash}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === idHash))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    //temp error handler
    console.error(`${err}`); //caught error thrown by the helpers modules's AJAX function
    throw err; //for controller to access the error
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  state.search.maxPages = Math.ceil(state.search.results.length / RES_PER_PAGE);
  const start = (page - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  //remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //unmark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

init();
// clearBookmarks(); // for dev purposes only

export const uploadRecipe = async function (newRecipe) {
  try {
    //formatting object data as the data we receive
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //mimicking API data
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
