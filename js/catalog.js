'use strict';

(function () {
  var basketItems = [];
  var cartIndexes = {};

  window.basketItems = basketItems;

  // Добавление выбранного товара в избранное
  var initFavorite = function () {
    var onFavoriteClick = function (evt) {
      if (evt.target.classList.contains('card__btn-favorite')) {
        evt.preventDefault();
        evt.target.classList.toggle('card__btn-favorite--selected');
      }
    };

    document.addEventListener('click', onFavoriteClick);
  };

  // Добавление выбранного товара в корзину и управление товаром в корзине
  var addToCart = function (goodID) {
    var currentItem = window.goods[goodID];

    currentItem.amount--;

    if (cartIndexes[goodID] !== undefined) {
      basketItems[cartIndexes[goodID]].orderedAmount++;
    } else {
      basketItems.push({
        id: goodID,
        orderedAmount: 1,
        name: currentItem.name,
        picture: currentItem.picture,
        price: currentItem.price,
      });

      cartIndexes[goodID] = basketItems.length - 1;
    }

    window.renderCart();
  };

  var removeCartItem = function (goodID) {
    if (cartIndexes[goodID] !== undefined) {
      window.goods[goodID].amount = window.goods[goodID].amount + basketItems[cartIndexes[goodID]].orderedAmount;

      basketItems.splice(cartIndexes[goodID], 1);

      for (var i = 0; i < basketItems.length; i++) {
        cartIndexes[basketItems[i].id] = i;
      }

      cartIndexes[goodID] = undefined;
    }

    window.renderCart();
  };

  var changeCartItemAmount = function (element, direction, goodID) {
    var itemCountElement = element.querySelector('.card-order__count');
    var itemCount = parseInt(itemCountElement.value, 10);
    var currentCartItem;

    if (cartIndexes[goodID] !== undefined) {
      currentCartItem = basketItems[cartIndexes[goodID]];
    }

    if (direction === 'decrease') {
      if (itemCount !== 0) {
        itemCount -= 1;
        window.goods[goodID].amount += 1;
      }
    }

    if (direction === 'increase') {
      if (window.goods[goodID].amount !== 0) {
        window.goods[goodID].amount -= 1;
        itemCount += 1;
      }
    }

    itemCountElement.value = itemCount;
    currentCartItem.orderedAmount = itemCount;

    window.setHeaderCartText();

    if (itemCount === 0) {
      removeCartItem(goodID);
    }
  };

  var initCart = function () {
    var onAddToCartClick = function (evt) {
      if (evt.target.classList.contains('card__btn')) {
        var currentId = evt.target.dataset.id;

        evt.preventDefault();

        if (window.goods[currentId].amount !== 0) {
          addToCart(currentId);
        }
      }
    };

    var onCartOrderCloseClick = function (evt) {
      if (evt.target.classList.contains('card-order__close')) {
        var currentId = evt.target.parentElement.dataset.id;

        evt.preventDefault();

        removeCartItem(currentId);
      }
    };

    var onCardOrderDecreaseClick = function (evt) {
      if (evt.target.classList.contains('card-order__btn--decrease')) {
        var parent = evt.target.parentElement.parentElement.parentElement;
        var currentId = parent.dataset.id;

        evt.preventDefault();

        changeCartItemAmount(parent, 'decrease', currentId);
      }
    };

    var onCardOrderIncreaseClick = function (evt) {
      if (evt.target.classList.contains('card-order__btn--increase')) {
        var parent = evt.target.parentElement.parentElement.parentElement;
        var currentId = parent.dataset.id;

        evt.preventDefault();

        changeCartItemAmount(parent, 'increase', currentId);
      }
    };

    document.addEventListener('click', onAddToCartClick);
    document.addEventListener('click', onCartOrderCloseClick);
    document.addEventListener('click', onCardOrderDecreaseClick);
    document.addEventListener('click', onCardOrderIncreaseClick);
  };

  initFavorite();
  initCart();
})();
