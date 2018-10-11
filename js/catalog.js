'use strict';

(function () {
  var basketItems = [];
  var cartIndexes = {};

  window.basketItems = basketItems;

  var catalogList = document.querySelector('.catalog__cards');
  var cartList = document.querySelector('.goods__cards');

  // Добавление выбранного товара в избранное
  var initFavorite = function () {
    var onFavoriteClick = function (evt) {
      if (evt.target.classList.contains('card__btn-favorite')) {
        var currentId = evt.target.closest('.card__btns-wrap').querySelector('.card__btn').dataset.id;

        evt.preventDefault();

        evt.target.classList.toggle('card__btn-favorite--selected');
        window.goods[currentId].isFavorite = evt.target.classList.contains('card__btn-favorite--selected');
      }
    };

    catalogList.addEventListener('click', onFavoriteClick);
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

      basketItems.forEach(function (basketItem, index) {
        cartIndexes[basketItem.id] = index;
      });

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
        itemCount--;
        window.goods[goodID].amount++;
      }
    }

    if (direction === 'increase') {
      if (window.goods[goodID].amount !== 0) {
        window.goods[goodID].amount--;
        itemCount++;
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
        var parent = evt.target.closest('.goods_card');
        var currentId = parent.dataset.id;

        evt.preventDefault();

        changeCartItemAmount(parent, 'decrease', currentId);
      }
    };

    var onCardOrderIncreaseClick = function (evt) {
      if (evt.target.classList.contains('card-order__btn--increase')) {
        var parent = evt.target.closest('.goods_card');
        var currentId = parent.dataset.id;

        evt.preventDefault();

        changeCartItemAmount(parent, 'increase', currentId);
      }
    };

    catalogList.addEventListener('click', onAddToCartClick);
    cartList.addEventListener('click', onCartOrderCloseClick);
    cartList.addEventListener('click', onCardOrderDecreaseClick);
    cartList.addEventListener('click', onCardOrderIncreaseClick);
  };

  initFavorite();
  initCart();
})();
