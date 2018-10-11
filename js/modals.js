'use strict';

(function () {
  var ESC_KEY = 27;

  var modals = document.querySelectorAll('.modal');
  var successModal = document.querySelector('.modal--success');
  var errorModal = document.querySelector('.modal--error');

  var onEscKeyPress = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      window.modals.hideModals();
    }
  };

  var onModalCloseClick = function (evt) {
    if (evt.target.classList.contains('modal__close')) {
      window.modals.hideModals();
    }
  };

  var addEscHandler = function () {
    document.addEventListener('keydown', onEscKeyPress);
  };

  var removeEscHandler = function () {
    document.removeEventListener('keydown', onEscKeyPress);
  };

  document.addEventListener('click', onModalCloseClick);

  window.modals = {
    showSuccessModal: function () {
      successModal.classList.remove('modal--hidden');
      addEscHandler();
    },

    showErrorModal: function (errMessage) {
      errorModal.querySelector('.modal__message').textContent = errMessage;
      errorModal.classList.remove('modal--hidden');
      addEscHandler();
    },

    hideModals: function () {
      modals.forEach(function (modal) {
        modal.classList.add('modal--hidden');
      });

      removeEscHandler();
    },
  };
})();
