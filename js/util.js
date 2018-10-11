'use strict';

(function () {
  var NUMBER_LITERALS = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
  };

  window.util = {
    RANGE_NUMBERS: [0, 100],

    generateRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Возвращение строки рейтинга
    getRatingClass: function (number) {
      return 'stars__rating--' + NUMBER_LITERALS[number];
    },

    checkLuhn: function (cardNumber) {
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
    },
  };
})();
