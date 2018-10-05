'use strict';

(function () {
  var CART_BLOCK_EMPTY = document.querySelector('.goods__card-empty');

  // Создание карточки мороженого в корзине
  var renderOrderedGood = function (orderedGood) {
    var orderedGoodTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
    var orderedGoodCard = orderedGoodTemplate.cloneNode(true);
    var orderedGoodTitle = orderedGoodCard.querySelector('.card-order__title');
    var orderedGoodPrice = orderedGoodCard.querySelector('.card-order__price');
    var orderedGoodPicture = orderedGoodCard.querySelector('.card-order__img');
    var orderedGoodCount = orderedGoodCard.querySelector('.card-order__count');

    orderedGoodCard.dataset.id = orderedGood.id;
    orderedGoodTitle.textContent = orderedGood.name;
    orderedGoodPrice.textContent = orderedGood.price + ' ₽';
    orderedGoodPicture.src = orderedGood.picture;
    orderedGoodCount.value = orderedGood.orderedAmount;

    return orderedGoodCard;
  };

  // Обновление текста в ссылке на корзину в хедере
  window.setHeaderCartText = function () {
    var headerCart = document.querySelector('.main-header__basket');
    var cartTotal = 0;

    for (var k = 0; k < window.basketItems.length; k++) {
      cartTotal += window.basketItems[k].orderedAmount;
    }

    if (!cartTotal) {
      headerCart.textContent = 'В корзине ничего нет';
    } else {
      headerCart.textContent = 'Товаров в корзине: ' + cartTotal;
    }
  };

  // Создание корзины
  window.renderCart = function () {
    var fragment = document.createDocumentFragment();
    var cartBlock = document.querySelector('.goods__cards');
    var cartElements = document.querySelectorAll('.goods_card');

    window.setHeaderCartText();

    for (var j = 0; j < cartElements.length; j++) {
      cartElements[j].remove();
    }

    for (var i = 0; i < window.basketItems.length; i++) {
      fragment.appendChild(renderOrderedGood(window.basketItems[i]));
    }

    cartBlock.appendChild(fragment);

    if (window.basketItems.length) {
      cartBlock.classList.remove('goods__cards--empty');
      CART_BLOCK_EMPTY.classList.add('visually-hidden');
      window.toggleForm();
    } else {
      cartBlock.classList.add('goods__cards--empty');
      CART_BLOCK_EMPTY.classList.remove('visually-hidden');
      window.toggleForm();
    }
  };
})();
