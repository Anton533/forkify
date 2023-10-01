import View from './View.js';
import shoppingRecipeView from './shoppingRecipeView.js';

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping-list__list');
  _errorMessage = `No shopping list yet ;)`;
  _message = '😎';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerDelRecipe(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.shopping-list__btn--del');
      if (!btn) return;
      const id = btn.getAttribute('data-recipe-id');
      handler(id);
    });
  }

  _generateMarkup() {
    return this._data
      .map(recipe => shoppingRecipeView.render(recipe, false))
      .join('');
  }
}

export default new ShoppingListView();
