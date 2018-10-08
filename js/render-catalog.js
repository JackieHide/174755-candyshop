'use strict';

(function () {
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

    goodCard.classList.remove('card--in-stock', 'card--little', 'card--soon');

    if (good.amount > 5) {
      goodCard.classList.add('card--in-stock');
    } else if (good.amount < 1) {
      goodCard.classList.add('card--soon');
    } else {
      goodCard.classList.add('card--little');
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

  // Создание списка карточек с мороженым
  var renderGoodsList = function () {
    var fragment = document.createDocumentFragment();
    var goodsList = document.querySelector('.catalog__cards');

    var successHandler = function (response) {
      window.goods = response;

      for (var i = 0; i < window.goods.length; i++) {
        fragment.appendChild(renderGood(window.goods[i], i));
      }

      goodsList.appendChild(fragment);
    };

    window.backend.load(successHandler, window.modals.showErrorModal);
  };

  document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
  document.querySelector('.catalog__load').classList.add('visually-hidden');

  renderGoodsList();
})();
