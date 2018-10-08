'use strict';

(function () {
  var BACKSPACE_KEY = 8;
  var TAB_KEY = 9;
  var LEFT_KEY = 37;
  var RIGHT_KEY = 39;

  // Включение/выключение формы
  window.toggleForm = function () {
    var form = document.querySelector('.buy form');
    var button = form.querySelector('button[type="submit"]');
    var inputs = form.querySelectorAll('input');
    var hiddenInputs = form.querySelectorAll('.visually-hidden input');
    var fieldSets = form.querySelectorAll('fieldset');
    var disabledState = window.basketItems ? window.basketItems.length === 0 : true;

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = disabledState;
    }

    for (var j = 0; j < fieldSets.length; j++) {
      fieldSets[j].disabled = disabledState;
    }

    for (var k = 0; k < hiddenInputs.length; k++) {
      hiddenInputs[k].disabled = true;
    }

    button.disabled = disabledState;
  };

  // Переключение вкладок в форме оформления заказа
  var initTabs = function () {
    var paymentBlock = document.querySelector('.payment');
    var deliverBlock = document.querySelector('.deliver');

    var onRadioInputChange = function (evt) {
      var currentInput = evt.target;
      var currentParent = evt.currentTarget;
      var currentQuery = currentInput.id;
      var siblingInputs = currentParent.querySelectorAll('.toggle-btn input[type="radio"]');
      var classAdd = '';

      if (currentInput.type === 'radio' && currentInput.classList.contains('toggle-btn__input')) {
        if (currentInput.parentElement.classList.contains('payment__method')) {
          classAdd = '-wrap';
        }

        for (var i = 0; i < siblingInputs.length; i++) {
          currentParent
            .querySelector('.' + siblingInputs[i].id + classAdd)
            .classList.add('visually-hidden');
        }

        if (currentInput.checked) {
          currentParent.querySelector('.' + currentQuery + classAdd).classList.remove('visually-hidden');
        }

        window.toggleForm();
      }
    };

    paymentBlock.addEventListener('change', onRadioInputChange);
    deliverBlock.addEventListener('change', onRadioInputChange);
  };

  // Проверка номера карты по алгоритму Луна, проверка нажатых клавиш
  var initForm = function () {
    var form = document.querySelector('.buy form');
    var paymentInputs = form.querySelector('.payment__inputs');
    var cardInput = document.getElementById('payment__card-number');
    var cardDateInput = document.getElementById('payment__card-date');
    var cardCvcInput = document.getElementById('payment__card-cvc');
    var cardHolderInput = document.getElementById('payment__cardholder');

    var clearForm = function () {
      var inputs = form.querySelectorAll('input');
      var cardStatus = form.querySelector('.payment__card-status');

      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
      }

      cardStatus.textContent = 'Не определён';
    };

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

      if (value.length >= 4 &&
        evt.keyCode !== BACKSPACE_KEY &&
        evt.keyCode !== TAB_KEY &&
        evt.keyCode !== LEFT_KEY &&
        evt.keyCode !== RIGHT_KEY
      ) {
        evt.preventDefault();
      } else if (value.length >= 3) {
        cardDateInput.value = value.slice(0, 2) + '/' + value.slice(2);
      }
    };

    // Ввод только цифр
    var allowNumbersOnly = function (evt) {
      evt.target.value = evt.target.value.replace(/(?!\/)[^\d]/g, '');
    };

    var cardDateInputMask = function (evt) {
      allowNumbersOnly(evt);
      maskDate(cardDateInput, evt);
    };

    var cardInputMask = function (evt) {
      allowNumbersOnly(evt);

      if (cardInput.value.length >= 16 &&
        evt.keyCode !== BACKSPACE_KEY &&
        evt.keyCode !== TAB_KEY &&
        evt.keyCode !== LEFT_KEY &&
        evt.keyCode !== RIGHT_KEY
      ) {
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

        imgElem.src = imgRoot + currentImg + '.jpg';
      };

      deliverListElem.addEventListener('change', onRadioInputChange);
    };

    var formSuccessHandler = function () {
      clearForm();
      window.modals.showSuccessModal();
    };

    var onPaymentInputsChange = function (evt) {
      if (evt.target.id === 'payment__card-number') {
        cardInputMask(evt);
      }

      if (evt.target.id === 'payment__card-date') {
        cardDateInputMask(evt);
      }

      validateCard();
    };

    paymentInputs.addEventListener('keyup', onPaymentInputsChange);
    paymentInputs.addEventListener('keydown', onPaymentInputsChange);
    paymentInputs.addEventListener('keypress', onPaymentInputsChange);
    paymentInputs.addEventListener('change', onPaymentInputsChange);

    initDeliver();

    form.addEventListener('submit', function (evt) {
      window.backend.save(new FormData(form), formSuccessHandler, window.modals.showErrorModal);
      evt.preventDefault();
    });
  };

  window.toggleForm();
  initTabs();
  initForm();
})();
