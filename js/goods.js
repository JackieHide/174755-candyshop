'use strict';

var FUNNY_NAMES = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок',
];

var CONTENTS = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо',
];

var PICTURES = [
  'img/cards/gum-cedar.jpg',
  'img/cards/gum-chile.jpg',
  'img/cards/gum-eggplant.jpg',
  'img/cards/gum-mustard.jpg',
  'img/cards/gum-portwine.jpg',
  'img/cards/gum-wasabi.jpg',
  'img/cards/ice-cucumber.jpg',
  'img/cards/ice-eggplant.jpg',
  'img/cards/ice-garlic.jpg',
  'img/cards/ice-italian.jpg',
  'img/cards/ice-mushroom.jpg',
  'img/cards/ice-pig.jpg',
  'img/cards/marmalade-beer.jpg',
  'img/cards/marmalade-caviar.jpg',
  'img/cards/marmalade-corn.jpg',
  'img/cards/marmalade-new-year.jpg',
  'img/cards/marmalade-sour.jpg',
  'img/cards/marshmallow-bacon.jpg',
  'img/cards/marshmallow-beer.jpg',
  'img/cards/marshmallow-shrimp.jpg',
  'img/cards/marshmallow-spicy.jpg',
  'img/cards/marshmallow-wine.jpg',
  'img/cards/soda-bacon.jpg',
  'img/cards/soda-celery.jpg',
  'img/cards/soda-cob.jpg',
  'img/cards/soda-garlic.jpg',
  'img/cards/soda-peanut-grapes.jpg',
  'img/cards/soda-russian.jpg',
];

var GOODS_LENGTH = 5;
// var CART_LENGTH = 3;
var AMOUNT_MIN = 0;
var AMOUNT_MAX = 20;
var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var WEIGHT_MIN = 30;
var WEIGHT_MAX = 300;
var VALUE_MIN = 1;
var VALUE_MAX = 5;
var NUMBER_MIN = 10;
var NUMBER_MAX = 900;
var ENERGY_MIN = 70;
var ENERGY_MAX = 500;


var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Создание массива со всеми известными свойствами мороженого
var generateGoods = function (goodsLength) {
  var defaultGoods = [];
  var contentsString;
  var lastChar;

  for (var i = 0; i < goodsLength; i++) {
    var contentsStringLength = generateRandomNumber(0, CONTENTS.length - 1);

    contentsString = '';

    for (var j = 0; j <= contentsStringLength; j++) {
      lastChar = j === contentsStringLength ? '.' : ', ';
      contentsString += CONTENTS[generateRandomNumber(0, CONTENTS.length - 1)] + lastChar;
    }

    defaultGoods.push({
      name: FUNNY_NAMES[generateRandomNumber(0, FUNNY_NAMES.length - 1)],
      picture: PICTURES[generateRandomNumber(0, PICTURES.length - 1)],
      amount: generateRandomNumber(AMOUNT_MIN, AMOUNT_MAX),
      price: generateRandomNumber(PRICE_MIN, PRICE_MAX),
      weight: generateRandomNumber(WEIGHT_MIN, WEIGHT_MAX),
      rating: {
        value: generateRandomNumber(VALUE_MIN, VALUE_MAX),
        number: generateRandomNumber(NUMBER_MIN, NUMBER_MAX)
      },
      nutritionFacts: {
        sugar: Boolean(Math.round(Math.random())),
        energy: generateRandomNumber(ENERGY_MIN, ENERGY_MAX),
        contents: contentsString,
      },
    });
  }

  return defaultGoods;
};

// Присваивание рейтинга
var getRatingClass = function (number) {
  var elemClass;

  switch (number) {
    case 1:
      elemClass = 'stars__rating--one';
      break;
    case 2:
      elemClass = 'stars__rating--two';
      break;
    case 3:
      elemClass = 'stars__rating--three';
      break;
    case 4:
      elemClass = 'stars__rating--four';
      break;
    case 5:
      elemClass = 'stars__rating--five';
      break;
    default:
      break;
  }

  return elemClass;
};

// Создавние карточки с мороженым
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
  goodStarsRating.classList.add(getRatingClass(good.rating.value));

  goodStarCount.textContent = '(' + good.rating.number + ')';
  goodCardCharacteristic.textContent = currentSugar + '. ' + good.nutritionFacts.energy + ' ккал';
  goodCardComposition.textContent = good.nutritionFacts.contents;
  goodCardPicture.setAttribute('src', good.picture);

  goodCartButton.setAttribute('data-id', currentNumber);

  return goodCard;
};

// Создание карточки мороженого в корзине
var renderOrderedGood = function (orderedGood) {
  var orderedGoodTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var orderedGoodCard = orderedGoodTemplate.cloneNode(true);
  var orderedGoodTitle = orderedGoodCard.querySelector('.card-order__title');
  var orderedGoodPrice = orderedGoodCard.querySelector('.card-order__price');
  var orderedGoodPicture = orderedGoodCard.querySelector('.card-order__img');
  var orderedGoodCount = orderedGoodCard.querySelector('.card-order__count');

  orderedGoodCard.setAttribute('data-id', orderedGood.id);
  orderedGoodTitle.textContent = orderedGood.name;
  orderedGoodPrice.textContent = orderedGood.price + ' ₽';
  orderedGoodPicture.setAttribute('src', orderedGood.picture);
  orderedGoodCount.value = orderedGood.orderedAmount;

  return orderedGoodCard;
};

// Обновление текста в ссылке на корзину в хедере
var setHeaderCartText = function () {
  var headerCart = document.querySelector('.main-header__basket');
  var cartTotal = 0;

  for (var k = 0; k < cart.length; k++) {
    cartTotal = cartTotal + cart[k].orderedAmount;
  }

  if (!cartTotal) {
    headerCart.textContent = 'В корзине ничего нет';
  } else {
    headerCart.textContent = 'Товаров в корзине: ' + cartTotal;
  }
};

// Включение/выключение формы
var toggleForm = function () {
  var form = document.querySelector('.buy form');
  var inputs = form.querySelectorAll('input');
  var fieldSets = form.querySelectorAll('fieldset');
  var disabledState;

  if (!cart.length) {
    disabledState = true;
  } else {
    disabledState = false;
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = disabledState;
  }

  for (var j = 0; j < fieldSets.length; j++) {
    fieldSets[j].disabled = disabledState;
  }
};

// Создание корзины
var renderCart = function () {
  var cartGoods = cart;
  var fragment = document.createDocumentFragment();
  var cartBlock = document.querySelector('.goods__cards');
  var cartItems = document.querySelectorAll('.goods_card');

  setHeaderCartText();

  for (var j = 0; j < cartItems.length; j++) {
    cartItems[j].remove();
  }

  for (var i = 0; i < cartGoods.length; i++) {
    fragment.appendChild(renderOrderedGood(cartGoods[i]));
  }

  cartBlock.appendChild(fragment);

  if (cartGoods.length) {
    cartBlock.classList.remove('goods__cards--empty');
    cartBlock.querySelector('.goods__card-empty').classList.add('visually-hidden');
    toggleForm();
  } else {
    cartBlock.classList.add('goods__cards--empty');
    cartBlock.querySelector('.goods__card-empty').classList.remove('visually-hidden');
    toggleForm();
  }
};

// Создание списка карточек с мороженым
var renderGoodsList = function () {
  window.goods = generateGoods(GOODS_LENGTH);
  var fragment = document.createDocumentFragment();
  var goodsList = document.querySelector('.catalog__cards');

  for (var i = 0; i < window.goods.length; i++) {
    fragment.appendChild(renderGood(window.goods[i], i));
  }

  goodsList.appendChild(fragment);
};

document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');

renderGoodsList();

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
var cart = [];

var addToCart = function (goodID) {
  var isSimilar = false;

  window.goods[goodID].amount--;

  for (var i = 0; i < cart.length; i++) {
    if (goodID === cart[i].id) {
      isSimilar = true;

      cart[i].orderedAmount++;
    }
  }

  if (!isSimilar) {
    cart.push({
      id: goodID,
      orderedAmount: 1,
      name: window.goods[goodID].name,
      picture: window.goods[goodID].picture,
      price: window.goods[goodID].price,
    });
  }

  renderCart();
};

var removeCartItem = function (goodID) {
  for (var i = 0; i < cart.length; i++) {
    if (goodID === cart[i].id) {
      window.goods[goodID].amount = window.goods[goodID].amount + cart[i].orderedAmount;

      cart.splice(i, 1);
    }
  }

  renderCart();
};

var changeCartItemAmount = function (element, direction, goodID) {
  var itemCountElement = element.querySelector('.card-order__count');
  var itemCount = parseInt(itemCountElement.value, 10);
  var currentCartItem;

  for (var i = 0; i < cart.length; i++) {
    if (goodID === cart[i].id) {
      currentCartItem = cart[i];
    }
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

  setHeaderCartText();

  if (itemCount === 0) {
    removeCartItem(goodID);
  }
};

var initCart = function () {
  var onAddToCartClick = function (evt) {
    if (evt.target.classList.contains('card__btn')) {
      var currentId = evt.target.getAttribute('data-id');

      evt.preventDefault();

      if (window.goods[currentId].amount !== 0) {
        addToCart(currentId);
      }
    }
  };

  var onCartOrderCloseClick = function (evt) {
    if (evt.target.classList.contains('card-order__close')) {
      var currentId = evt.target.parentElement.getAttribute('data-id');

      evt.preventDefault();

      removeCartItem(currentId);
    }
  };

  var onCardOrderDecreaseClick = function (evt) {
    if (evt.target.classList.contains('card-order__btn--decrease')) {
      var parent = evt.target.parentElement.parentElement.parentElement;
      var currentId = parent.getAttribute('data-id');

      evt.preventDefault();

      changeCartItemAmount(parent, 'decrease', currentId);
    }
  };

  var onCardOrderIncreaseClick = function (evt) {
    if (evt.target.classList.contains('card-order__btn--increase')) {
      var parent = evt.target.parentElement.parentElement.parentElement;
      var currentId = parent.getAttribute('data-id');

      evt.preventDefault();

      changeCartItemAmount(parent, 'increase', currentId);
    }
  };

  document.addEventListener('click', onAddToCartClick);
  document.addEventListener('click', onCartOrderCloseClick);
  document.addEventListener('click', onCardOrderDecreaseClick);
  document.addEventListener('click', onCardOrderIncreaseClick);
};

// Переключение вкладок в форме оформления заказа
var initTabs = function () {
  var radioInputs = document.querySelectorAll('.toggle-btn input[type="radio"]');

  var onRadioInputChange = function (evt) {
    var currentInput = evt.target;
    var currentQuery = currentInput.getAttribute('id');
    var currentParent = currentInput.parentElement.parentElement;
    var siblingInputs = currentParent.querySelectorAll('.toggle-btn input[type="radio"]');
    var classAdd = '';

    if (currentInput.parentElement.classList.contains('payment__method')) {
      classAdd = '-wrap';
    }

    for (var i = 0; i < siblingInputs.length; i++) {
      currentParent
        .querySelector('.' + siblingInputs[i].getAttribute('id') + classAdd)
        .classList.add('visually-hidden');
    }

    if (currentInput.checked) {
      currentParent.querySelector('.' + currentQuery + classAdd).classList.remove('visually-hidden');
    }
  };

  for (var i = 0; i < radioInputs.length; i++) {
    radioInputs[i].addEventListener('change', onRadioInputChange);
  }
};

// Первая фаза работы фильтра по цене

var initRangeFilter = function () {
  var RANGE = [0, 100];
  var rangeButtons = document.querySelectorAll('.range__btn');

  var onMouseUp = function (evt) {
    var pinLeftOffset = evt.target.offsetLeft;
    var parentWidth = evt.target.parentElement.offsetWidth;
    var pinPercent = pinLeftOffset / parentWidth;
    var pinValue = Math.floor((RANGE[1] - RANGE[0]) * pinPercent + RANGE[0]);

    if (evt.target.classList.contains('range__btn--right')) {
      document.querySelector('.range__price--max').textContent = pinValue;
    }

    if (evt.target.classList.contains('range__btn--left')) {
      document.querySelector('.range__price--min').textContent = pinValue;
    }
  };

  for (var i = 0; i < rangeButtons.length; i++) {
    rangeButtons[i].addEventListener('mouseup', onMouseUp);
  }
};

toggleForm();
initFavorite();
initCart();
initTabs();
initRangeFilter();

