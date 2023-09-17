import * as model from './model.js';
import recipeView from './views/recipeView.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// "core-js": "^3.32.2",
// "regenerator-runtime": "^0.14.0"

// const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    // const recipeView = new recipeView(model.state.recipe);
  } catch (err) {
    alert(err);
  }
}

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));
