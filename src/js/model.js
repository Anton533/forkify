import * as config from './config.js';
import { getJSON } from './helpers.js';

// https://forkify-api.herokuapp.com/v2
// key=ad6972d0-5c0d-4a98-b9cc-d02c6e91d890
///////////////////////////////////////

export const state = {
  recipe: {},
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
    console.log(recipe);
  } catch (err) {
    console.error(err);
  }
};
