import * as config from './config.js';
import { getJSON } from './helpers.js';

// https://forkify-api.herokuapp.com/v2
// key=ad6972d0-5c0d-4a98-b9cc-d02c6e91d890
///////////////////////////////////////

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: config.RES_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${config.API_URL}/${id}`);

    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // console.log(recipe);
  } catch (err) {
    console.error(`${err.message} 💥💥💥`);
    throw err;
  }
};

export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${config.API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
      };
    });
    console.log(state.search.results);
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
