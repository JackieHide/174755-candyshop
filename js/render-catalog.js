'use strict';

(function () {
  var GOOD_STOCK_MIN_PARAM = 5;

  var goodsList = document.querySelector('.catalog__cards');

  // Создание карточки с мороженым
  var renderGood = function (good, currentNumber) {
    var goodTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
    var goodCard = goodTemplate.cloneNode(true);
    var goodTitle = goodCard.querySelector('.card__title');
    var goodPrice = goodCard.querySelector('.card__price');
    var goodStarsRating = goodCard.querySelector('.stars__rating');
    var goodStarCount = goodCard.querySelector('.star__count');
    var goodCardCharacteristic = goodCard.querySelector('.card__characteristic');
    var goodCardComposition = goodCard.querySelector('.card__composition-list');
    var goodCardPicture = goodCard.querySelector('.card__img');
    var currentSugar = good.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    var goodCartButton = goodCard.querySelector('.card__btn');
    var goodCartButtonFavorite = goodCard.querySelector('.card__btn-favorite');

    goodCard.classList.remove('card--in-stock', 'card--little', 'card--soon');

    if (good.amount > GOOD_STOCK_MIN_PARAM) {
      goodCard.classList.add('card--in-stock');
    } else if (good.amount < 1) {
      goodCard.classList.add('card--soon');
    } else {
      goodCard.classList.add('card--little');
    }

    if (good.isFavorite) {
      goodCartButtonFavorite.classList.add('card__btn-favorite--selected');
    }

    goodTitle.textContent = good.name;
    goodPrice.childNodes[0].textContent = good.price + ' ';
    goodPrice.childNodes[2].textContent = '/ ' + good.weight + ' г';

    goodStarsRating.classList.remove('stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five');
    goodStarsRating.classList.add(window.util.getRatingClass(good.rating.value));

    goodStarCount.textContent = '(' + good.rating.number + ')';
    goodCardCharacteristic.textContent = currentSugar + '. ' + good.nutritionFacts.energy + ' ккал';
    goodCardComposition.textContent = good.nutritionFacts.contents;
    goodCardPicture.src = 'img/cards/' + good.picture;

    goodCartButton.dataset.id = currentNumber;

    return goodCard;
  };

  // очистка списка карточек с мороженым
  var clearGoodsList = function (currentCards, currentEmptyMsg) {
    currentCards.forEach(function (elem) {
      elem.remove();
    });

    if (currentEmptyMsg) {
      currentEmptyMsg.remove();
    }
  };

  // заполнение списка карточек с мороженым
  var fillGoodsList = function (data) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (dataItem) {
      fragment.appendChild(renderGood(dataItem, dataItem.id));
    });

    goodsList.appendChild(fragment);
  };

  // добавление блока пустого списка
  var addEmptyListMarker = function () {
    var emptyTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
    var emptyBlock = emptyTemplate.cloneNode(true);

    goodsList.appendChild(emptyBlock);
  };

  // Создание списка карточек с мороженым
  window.renderGoodsList = function (data) {
    var currentCards = goodsList.querySelectorAll('.catalog__card');
    var currentEmptyMsg = goodsList.querySelector('.catalog__empty-filter');

    clearGoodsList(currentCards, currentEmptyMsg);

    if (data.length) {
      fillGoodsList(data);
    } else {
      addEmptyListMarker();
    }
  };
})();
