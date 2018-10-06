'use strict';

(function () {
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

  // Создание массива со всеми известными свойствами мороженого
  var generateGoods = function (goodsLength) {
    var defaultGoods = [];
    var contentsString;
    var lastChar;

    for (var i = 0; i < goodsLength; i++) {
      var contentsStringLength = window.util.generateRandomNumber(0, CONTENTS.length - 1);

      contentsString = '';

      for (var j = 0; j <= contentsStringLength; j++) {
        lastChar = j === contentsStringLength ? '.' : ', ';
        contentsString += CONTENTS[window.util.generateRandomNumber(0, CONTENTS.length - 1)] + lastChar;
      }

      defaultGoods.push({
        name: FUNNY_NAMES[window.util.generateRandomNumber(0, FUNNY_NAMES.length - 1)],
        picture: PICTURES[window.util.generateRandomNumber(0, PICTURES.length - 1)],
        amount: window.util.generateRandomNumber(AMOUNT_MIN, AMOUNT_MAX),
        price: window.util.generateRandomNumber(PRICE_MIN, PRICE_MAX),
        weight: window.util.generateRandomNumber(WEIGHT_MIN, WEIGHT_MAX),
        rating: {
          value: window.util.generateRandomNumber(VALUE_MIN, VALUE_MAX),
          number: window.util.generateRandomNumber(NUMBER_MIN, NUMBER_MAX)
        },
        nutritionFacts: {
          sugar: Boolean(Math.round(Math.random())),
          energy: window.util.generateRandomNumber(ENERGY_MIN, ENERGY_MAX),
          contents: contentsString,
        },
      });
    }

    return defaultGoods;
  };

  window.goods = generateGoods(GOODS_LENGTH);
})();
