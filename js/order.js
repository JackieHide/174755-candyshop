'use strict';

(function () {
  var JPG_EXTENSION = '.jpg';

  var CARD_MAX_LENGTH = 16;
  var CARD_DATE_MAX_LENGTH = 4;
  var CARD_DATE_DIVIDER_LENGTH = 3;

  var BACKSPACE_KEY = 8;
  var TAB_KEY = 9;
  var LEFT_KEY = 37;
  var RIGHT_KEY = 39;

  var form = document.querySelector('.buy form');
  var paymentInputs = form.querySelector('.payment__inputs');
  var cardInput = document.querySelector('#payment__card-number');
  var cardDateInput = document.querySelector('#payment__card-date');
  var cardCvcInput = document.querySelector('#payment__card-cvc');
  var cardHolderInput = document.querySelector('#payment__cardholder');
  var cardStatusElement = form.querySelector('.payment__card-status');

  // Включение/выключение формы
  var toggleForm = function () {
    var button = form.querySelector('button[type="submit"]');
    var inputs = form.querySelectorAll('input');
    var hiddenInputs = form.querySelectorAll('.visually-hidden input');
    var fieldSets = form.querySelectorAll('fieldset');
    var disabledState = window.basketItems ? window.basketItems.length === 0 : true;

    inputs.forEach(function (input) {
      input.disabled = disabledState;
    });

    fieldSets.forEach(function (fieldSet) {
      fieldSet.disabled = disabledState;
    });

    hiddenInputs.forEach(function (hiddenInput) {
      hiddenInput.disabled = true;
    });

    button.disabled = disabledState;
  };

  // Переключение вкладок в форме оформления заказа
  var initTabs = function () {
    var tabButtons = document.querySelectorAll('.toggle-btn__input');

    var onRadioInputChange = function (evt) {
      var currentInput = evt.currentTarget;
      var currentParent = currentInput.closest('.container');
      var currentQuery = currentInput.id;
      var siblingInputs = currentParent.querySelectorAll('.toggle-btn input[type="radio"]');
      var classAdd = '';

      if (currentInput.closest('.toggle-btn').classList.contains('payment__method')) {
        classAdd = '-wrap';
      }

      siblingInputs.forEach(function (input) {
        currentParent
          .querySelector('.' + input.id + classAdd)
          .classList.add('visually-hidden');
      });

      if (currentInput.checked) {
        currentParent.querySelector('.' + currentQuery + classAdd).classList.remove('visually-hidden');
      }

      toggleForm();
    };

    tabButtons.forEach(function (btn) {
      btn.addEventListener('change', onRadioInputChange);
    });
  };

  // Проверка номера карты по алгоритму Луна, проверка нажатых клавиш

  // Доставка товара по адресу из списка
  var initDeliver = function () {
    var deliverListElem = document.querySelector('.deliver__store-list');
    var imgElem = document.querySelector('.deliver__store-map-img');
    var imgRoot = 'img/map/';

    var onRadioInputChange = function (evt) {
      var currentInput = evt.target;
      var currentImg = currentInput.value;

      imgElem.src = imgRoot + currentImg + JPG_EXTENSION;
    };

    deliverListElem.addEventListener('change', onRadioInputChange);
  };

  var clearForm = function () {
    var inputs = form.querySelectorAll('input');
    var cardStatus = form.querySelector('.payment__card-status');

    inputs.forEach(function (input) {
      input.value = '';
    });

    cardStatus.textContent = 'Не определён';
  };

  // Добавление слэша в дату карты
  var maskDate = function (input, evt) {
    var value = cardDateInput.value.replace(/\D/g, '').slice(0, 10);

    if (value.length >= CARD_DATE_MAX_LENGTH &&
      evt.keyCode !== BACKSPACE_KEY &&
      evt.keyCode !== TAB_KEY &&
      evt.keyCode !== LEFT_KEY &&
      evt.keyCode !== RIGHT_KEY
    ) {
      evt.preventDefault();
    } else if (value.length >= CARD_DATE_DIVIDER_LENGTH) {
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

    if (cardInput.value.length >= CARD_MAX_LENGTH &&
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

    if (!window.util.checkLuhn(cardNumber)) {
      cardInput.setCustomValidity('Введенная карта невалидна');
    } else {
      cardInput.setCustomValidity('');
    }

    var isCardValid = cardInput.validity.valid &&
                      cardDateInput.validity.valid &&
                      cardCvcInput.validity.valid &&
                      cardHolderInput.validity.valid;

    cardStatusElement.textContent = isCardValid ? 'Одобрен' : 'Не определен';
  };

  var initForm = function () {
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

  toggleForm();
  initTabs();
  initForm();

  window.toggleForm = toggleForm;
})();
