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
    generateRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Возвращение строки рейтинга
    getRatingClass: function (number) {
      return 'stars__rating--' + NUMBER_LITERALS[number];
    },
  };
})();
