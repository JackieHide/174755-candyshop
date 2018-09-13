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

var GOODS_LENGTH = 26;
var CART_LENGTH = 3;
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
      ingredients: {
        sugar: Boolean(Math.round(Math.random())),
        energy: generateRandomNumber(ENERGY_MIN, ENERGY_MAX),
        contents: contentsString,
      },
    });
  }

  return defaultGoods;
};

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

var renderGood = function (good) {
  var goodTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var goodCard = goodTemplate.cloneNode(true);
  var goodTitle = goodCard.querySelector('.card__title');
  var goodPrice = goodCard.querySelector('.card__price');
  var goodStarsRating = goodCard.querySelector('.stars__rating');
  var goodStarCount = goodCard.querySelector('.star__count');
  var goodCardCharacteristic = goodCard.querySelector('.card__characteristic');
  var goodCardComposition = goodCard.querySelector('.card__composition-list');
  var goodCardPicture = goodCard.querySelector('.card__img');
  var currentSugar = good.ingredients.sugar ? 'Содержит сахар' : 'Без сахара';

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
  goodCardCharacteristic.textContent = currentSugar + '. ' + good.ingredients.energy + ' ккал';
  goodCardComposition.textContent = good.ingredients.contents;
  goodCardPicture.setAttribute('src', good.picture);

  return goodCard;
};

var renderOrderedGood = function (orderedGood) {
  var orderedGoodTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var orderedGoodCard = orderedGoodTemplate.cloneNode(true);
  var orderedGoodTitle = orderedGoodCard.querySelector('.card-order__title');
  var orderedGoodPrice = orderedGoodCard.querySelector('.card-order__price');
  var orderedGoodPicture = orderedGoodCard.querySelector('.card-order__img');

  orderedGoodTitle.textContent = orderedGood.name;
  orderedGoodPrice.textContent = orderedGood.price + ' ₽';
  orderedGoodPicture.setAttribute('src', orderedGood.picture);

  return orderedGoodCard;
};

var renderCart = function () {
  var cartGoods = generateGoods(CART_LENGTH);
  var fragment = document.createDocumentFragment();
  var cartBlock = document.querySelector('.goods__cards');

  for (var i = 0; i < cartGoods.length; i++) {
    fragment.appendChild(renderOrderedGood(cartGoods[i]));
  }

  cartBlock.appendChild(fragment);

  cartBlock.classList.remove('goods__cards--empty');
  cartBlock.querySelector('.goods__card-empty').classList.add('visually-hidden');
};

var renderGoodsList = function () {
  var goods = generateGoods(GOODS_LENGTH);
  var fragment = document.createDocumentFragment();
  var goodsList = document.querySelector('.catalog__cards');

  for (var i = 0; i < goods.length; i++) {
    fragment.appendChild(renderGood(goods[i]));
  }

  goodsList.appendChild(fragment);
};

document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');

renderGoodsList();
renderCart();
