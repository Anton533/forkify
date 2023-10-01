import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  shoppingList: [],
};

function createRecipeObject(data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

///////////////////////////////////

export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err.message} 💥💥💥`);
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err.message} 💥💥💥`);
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //10

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem('forkify-bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

export function delBookmark(id) {
  const idx = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(idx, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

function clearBookmarks() {
  localStorage.clear('forkify-bookmarks');
}
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length != 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

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
    console.log(err);
  }
};

function persistShoppingList() {
  localStorage.setItem(
    'forkify-shopping-list',
    JSON.stringify(state.shoppingList)
  );
}

export function addToShoppingList(recipe) {
  const idx = state.shoppingList.findIndex(el => el.id === recipe.id);
  if (idx !== -1) {
    alert(`Recipe is already in the shopping list!`);
    return;
  }
  const recipeCopy = { ...recipe };
  recipeCopy.ingredients.map(ing => ({ ...ing }));
  recipeCopy.ingredients.map(ing => (ing.complete = false));
  state.shoppingList.push(recipe);

  persistShoppingList();
}

export function delShoppingList(id) {
  const idx = state.shoppingList.findIndex(el => el.id === id);
  state.shoppingList.splice(idx, 1);

  persistShoppingList();
}

export function setShoppingListComplete(recipeId, desc, checked) {
  const recipeIdx = state.shoppingList.findIndex(el => el.id === recipeId);
  const curRecipe = state.shoppingList[recipeIdx];
  const ingredientIdx = curRecipe.ingredients.findIndex(
    el => el.description === desc
  );

  curRecipe.ingredients[ingredientIdx].complete = checked;

  persistShoppingList();
}

function init() {
  const storageBookmarks = localStorage.getItem('forkify-bookmarks');
  const storageShopping = localStorage.getItem('forkify-shopping-list');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
  if (storageShopping) state.shoppingList = JSON.parse(storageShopping);
}
init();
