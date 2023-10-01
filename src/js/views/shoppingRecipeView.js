import { Fraction } from 'fractional';

import View from './View.js';

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping-list');

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerChecked(handler) {
    this._parentElement.addEventListener('change', function (e) {
      const ingredient = e.target.closest('.recipe__ingredient-checkbox');
      const element = e.target.closest('.shopping-list__item');
      const recipeId = element.getAttribute('data-recipe-id');
      const desc = ingredient.value;
      const checked = e.target.checked;
      if (!ingredient) return;
      handler(recipeId, desc, checked);
    });
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview shopping-list__item" data-recipe-id="${
          this._data.id
        }">
          <div class ="shopping-list__item-heading">
          <a class="preview__link shopping-list__item-link ${
            this._data.id === id ? `preview__link--active` : ''
          }" href="#${this._data.id}">
            <figure class="preview__fig">
              <img src="${this._data.image}" alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${this._data.title}</h4>
            </div>
          </a>
          <button  class="btn--inline shopping-list__btn--del">
            <span>Delete</span>
          </button>
          </div>
          <div class="shopping-list__ingredients">
            <h2 class="shopping-list__ingredients-title">Recipe ingredients</h2>
            <ul class="shopping-list__ingredient-list">
                  ${this._data.ingredients
                    .map(this._generateMarkupIngredient)
                    .join('')}
            </ul>
          </div>
        </li>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient ${ing.complete ? 'done' : ''}" >
      <label class="recipe__ingredient-wrapper">
        <input ${ing.complete ? 'checked' : ''} type="checkbox" value="${
      ing.description
    }" name="${ing.complete}" class="recipe__ingredient-checkbox">
          <div class="recipe__quantity">${
            ing.quantity ? new Fraction(ing.quantity).toString() : ''
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </label>
      </li>
    `;
  }
}

export default new ShoppingListView();
