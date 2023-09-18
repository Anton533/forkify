import * as model from './model.js';
import recipeView from './views/recipeView.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// "core-js": "^3.32.2",
// "regenerator-runtime": "^0.14.0"

// const recipeContainer = document.querySelector('.recipe');

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

(function init() {
  recipeView.addHandlerRender(controlRecipes);
})();
