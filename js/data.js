'use strict';

(function () {
  var successHandler = function (response) {
    window.goods = response;

    window.goods.forEach(function (elem, index) {
      elem.id = index;
    });

    window.applyFilter();

    document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
    document.querySelector('.catalog__load').classList.add('visually-hidden');
  };

  window.backend.load(successHandler, window.modals.showErrorModal);
})();
