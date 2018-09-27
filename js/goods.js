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

var NUMBER_LITERALS = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
};

var GOODS_LENGTH = 26;
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

var BACKSPACE_KEY = 8;
var TAB_KEY = 9;
var ALLOWED_CARD_KEYS = [32, 43, 46, 8, 9, 27, 13, 107, 110, 187, 189, 190];
var A_KEY = 65;
var C_KEY = 67;
var X_KEY = 88;
var END_KEY = 35;
var RIGHT_KEY = 39;
var ZERO_KEY = 48;
var NINE_KEY = 57;
var NUMPAD_ZERO_KEY = 96;
var NUMPAD_NINE_KEY = 105;

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

// Возвращение строки рейтинга
var getRatingClass = function (number) {
  return 'stars__rating--' + NUMBER_LITERALS[number];
};

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

  for (var k = 0; k < basketItems.length; k++) {
    cartTotal += basketItems[k].orderedAmount;
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
  var hiddenInputs = form.querySelectorAll('.visually-hidden input');
  var fieldSets = form.querySelectorAll('fieldset');
  var disabledState = basketItems.length === 0;

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = disabledState;
  }

  for (var j = 0; j < fieldSets.length; j++) {
    fieldSets[j].disabled = disabledState;
  }

  for (var k = 0; k < hiddenInputs.length; k++) {
    hiddenInputs[k].disabled = true;
  }
};

// Создание корзины
var renderCart = function () {
  var fragment = document.createDocumentFragment();
  var cartBlock = document.querySelector('.goods__cards');
  var cartElements = document.querySelectorAll('.goods_card');

  setHeaderCartText();

  for (var j = 0; j < cartElements.length; j++) {
    cartElements[j].remove();
  }

  for (var i = 0; i < basketItems.length; i++) {
    fragment.appendChild(renderOrderedGood(basketItems[i]));
  }

  cartBlock.appendChild(fragment);

  if (basketItems.length) {
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
var basketItems = [];
var cartIndexes = {};

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

  renderCart();
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

  renderCart();
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
  var paymentBlock = document.querySelector('.payment');
  var deliverBlock = document.querySelector('.deliver');

  var onRadioInputChange = function (evt) {
    var currentInput = evt.target;
    var currentParent = evt.currentTarget;
    var currentQuery = currentInput.getAttribute('id');
    var siblingInputs = currentParent.querySelectorAll('.toggle-btn input[type="radio"]');
    var classAdd = '';

    if (currentInput.getAttribute('type') === 'radio' && currentInput.classList.contains('toggle-btn__input')) {
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

      toggleForm();
    }
  };

  paymentBlock.addEventListener('change', onRadioInputChange);
  deliverBlock.addEventListener('change', onRadioInputChange);
};

// Первая фаза работы фильтра по цене

var initRangeFilter = function () {
  var RANGE_NUMBERS = [0, 100];
  var rangeFilter = document.querySelector('.range__filter');

  var onMouseUp = function (evt) {
    var pinLeftOffset = evt.target.offsetLeft;
    var parentWidth = evt.currentTarget.offsetWidth;
    var pinPercent = pinLeftOffset / parentWidth;
    var pinValue = Math.floor((RANGE_NUMBERS[1] - RANGE_NUMBERS[0]) * pinPercent + RANGE_NUMBERS[0]);

    if (evt.target.classList.contains('range__btn--right')) {
      document.querySelector('.range__price--max').textContent = pinValue;
    }

    if (evt.target.classList.contains('range__btn--left')) {
      document.querySelector('.range__price--min').textContent = pinValue;
    }
  };

  rangeFilter.addEventListener('mouseup', onMouseUp);
};

// Проверка номера карты по алгоритму Луна, проверка нажатых клавиш
var initForm = function () {
  var form = document.querySelector('.buy form');
  var paymentInputs = form.querySelector('.payment__inputs');
  var cardInput = document.getElementById('payment__card-number');
  var cardDateInput = document.getElementById('payment__card-date');
  var cardCvcInput = document.getElementById('payment__card-cvc');
  var cardHolderInput = document.getElementById('payment__cardholder');

  var checkLuhn = function (cardNumber) {
    var arr = cardNumber.split('').map(function (char, index) {
      var digit = parseInt(char, 10);

      if ((index + cardNumber.length) % 2 === 0) {
        var digitX2 = digit * 2;

        return digitX2 > 9 ? digitX2 - 9 : digitX2;
      }

      return digit;
    });

    return !(arr.reduce(function (a, b) {
      return a + b;
    }, 0) % 10);
  };

  // Добавление слэша в дату карты
  var maskDate = function (input, evt) {
    var value = cardDateInput.value.replace(/\D/g, '').slice(0, 10);

    if (value.length >= 4 && evt.keyCode !== BACKSPACE_KEY && evt.keyCode !== TAB_KEY) {
      evt.preventDefault();
    } else if (value.length >= 3) {
      cardDateInput.value = value.slice(0, 2) + '/' + value.slice(2);
    }
  };

  // Ввод только цифр
  var allowNumbersOnly = function (evt) {
    if (ALLOWED_CARD_KEYS.indexOf(evt.keyCode) !== -1 ||
    evt.keyCode === A_KEY && (evt.ctrlKey === true || evt.metaKey === true) ||
    evt.keyCode === C_KEY && (evt.ctrlKey === true || evt.metaKey === true) ||
    evt.keyCode === X_KEY && (evt.ctrlKey === true || evt.metaKey === true) ||
    evt.keyCode >= END_KEY && evt.keyCode <= RIGHT_KEY) {
      return;
    }

    if (((evt.keyCode < ZERO_KEY || evt.keyCode > NINE_KEY)) && (evt.keyCode < NUMPAD_ZERO_KEY || evt.keyCode > NUMPAD_NINE_KEY)) {
      evt.preventDefault();
    }
  };

  var cardDateInputMask = function (evt) {
    allowNumbersOnly(evt);
    maskDate(cardDateInput, evt);
  };

  var cardInputMask = function (evt) {
    allowNumbersOnly(evt);

    if (cardInput.value.length >= 16 && evt.keyCode !== BACKSPACE_KEY && evt.keyCode !== TAB_KEY) {
      evt.preventDefault();
    }
  };

  // Проверка валидности номера карты
  var validateCard = function () {
    var cardNumber = cardInput.value.replace(/\s/g, '').trim();

    if (!checkLuhn(cardNumber)) {
      cardInput.setCustomValidity('Введенная карта невалидна');
    } else {
      cardInput.setCustomValidity('');
    }

    if (cardInput.validity.valid &&
        cardDateInput.validity.valid &&
        cardCvcInput.validity.valid &&
        cardHolderInput.validity.valid
    ) {
      form.querySelector('.payment__card-status').textContent = 'Одобрен';
    } else {
      form.querySelector('.payment__card-status').textContent = 'Не определен';
    }
  };

  // Доставка товара по адресу из списка
  var initDeliver = function () {
    var deliverListElem = document.querySelector('.deliver__store-list');
    var imgElem = document.querySelector('.deliver__store-map-img');
    var imgRoot = 'img/map/';

    var onRadioInputChange = function (evt) {
      var currentInput = evt.target;
      var currentImg = currentInput.value;

      imgElem.setAttribute('src', imgRoot + currentImg + '.jpg');
    };

    deliverListElem.addEventListener('change', onRadioInputChange);
  };

  var onPaymentInputsChange = function (evt) {
    if (evt.target.getAttribute('id') === 'payment__card-number') {
      cardInputMask(evt);
    }

    if (evt.target.getAttribute('id') === 'payment__card-date') {
      cardDateInputMask(evt);
    }

    validateCard();
  };

  paymentInputs.addEventListener('keyup', onPaymentInputsChange);
  paymentInputs.addEventListener('keydown', onPaymentInputsChange);
  paymentInputs.addEventListener('keypress', onPaymentInputsChange);
  paymentInputs.addEventListener('change', onPaymentInputsChange);

  initDeliver();
};

document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');

renderGoodsList();

toggleForm();
initFavorite();
initCart();
initTabs();
initRangeFilter();
initForm();
