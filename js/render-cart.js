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
    orderedGoodPicture.src = 'img/cards/' + orderedGood.picture;
    orderedGoodCount.value = orderedGood.orderedAmount;

    return orderedGoodCard;
  };

  // заполнение корзины
  var fillCart = function (cartBlock) {
    var fragment = document.createDocumentFragment();

    window.basketItems.forEach(function (basketItem) {
      fragment.appendChild(renderOrderedGood(basketItem));
    });

    cartBlock.appendChild(fragment);
  };

  // очистка корзины
  var clearCart = function () {
    var cartElements = document.querySelectorAll('.goods_card');

    cartElements.forEach(function (cartElement) {
      cartElement.remove();
    });
  };

  // смена состояния корзины
  var toggleCartEmptyBlock = function (cartBlock) {
    if (window.basketItems.length) {
      cartBlock.classList.remove('goods__cards--empty');
      CART_BLOCK_EMPTY.classList.add('visually-hidden');
    } else {
      cartBlock.classList.add('goods__cards--empty');
      CART_BLOCK_EMPTY.classList.remove('visually-hidden');
    }
  };

  // Обновление текста в ссылке на корзину в хедере
  window.setHeaderCartText = function () {
    var headerCart = document.querySelector('.main-header__basket');

    var cartTotal = window.basketItems.reduce(function (sum, basketItem) {
      return sum + basketItem.orderedAmount;
    }, 0);

    if (!cartTotal) {
      headerCart.textContent = 'В корзине ничего нет';
    } else {
      headerCart.textContent = 'Товаров в корзине: ' + cartTotal;
    }
  };

  // Создание корзины
  window.renderCart = function () {
    var cartBlock = document.querySelector('.goods__cards');

    window.setHeaderCartText();

    clearCart();
    fillCart(cartBlock);
    toggleCartEmptyBlock(cartBlock);

    window.toggleForm();
  };
})();
