'use strict';

(function () {
  var RANGE_NUMBERS = [0, 100];
  var rangeFilter = document.querySelector('.range__filter');
  var rangeLine = rangeFilter.querySelector('.range__fill-line');
  var pinElems = rangeFilter.querySelectorAll('.range__btn');
  var rangeBtnLeft = document.querySelector('.range__btn--left');
  var rangeBtnRight = document.querySelector('.range__btn--right');
  var rangePriceMax = document.querySelector('.range__price--max');
  var rangePriceMin = document.querySelector('.range__price--min');

  var setPins = function (pinElem, event, startCoords, filterCoords) {
    var shift = {
      x: startCoords.x - (event.clientX - filterCoords.left),
    };

    startCoords.x = event.clientX - filterCoords.left;

    var stopPosition = {
      min: 0,
      max: 0,
    };

    var positionValue;
    var pinLeftOffset = pinElem.offsetLeft;
    var parentWidth = rangeFilter.offsetWidth;

    if (pinElem.classList.contains('range__btn--right')) {
      stopPosition.min = rangeBtnLeft.offsetLeft + rangeBtnLeft.offsetWidth;
      stopPosition.max = rangeFilter.offsetWidth;
    }

    if (pinElem.classList.contains('range__btn--left')) {
      stopPosition.max = rangeBtnRight.offsetLeft - pinElem.offsetWidth;
      stopPosition.min = 0;
    }

    positionValue = pinLeftOffset - shift.x;

    if (positionValue >= stopPosition.max) {
      positionValue = stopPosition.max;
    } else if (positionValue <= stopPosition.min) {
      positionValue = stopPosition.min;
    }

    pinElem.style.left = positionValue + 'px';
    rangeLine.style.left = rangeBtnLeft.offsetLeft + 'px';
    rangeLine.style.right = rangeFilter.offsetWidth - rangeBtnRight.offsetLeft + 'px';

    pinLeftOffset = pinElem.offsetLeft;
    var pinPercent = pinLeftOffset / parentWidth;
    var pinValue = Math.floor((RANGE_NUMBERS[1] - RANGE_NUMBERS[0]) * pinPercent + RANGE_NUMBERS[0]);

    if (pinElem.classList.contains('range__btn--right')) {
      rangePriceMax.textContent = pinValue;
    }

    if (pinElem.classList.contains('range__btn--left')) {
      rangePriceMin.textContent = pinValue;
    }
  };

  var initPinDrag = function (pinElem) {
    var rect = rangeFilter.getBoundingClientRect();

    pinElem.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX - rect.left,
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        setPins(pinElem, moveEvt, startCoords, rect);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        setPins(pinElem, upEvt, startCoords, rect);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  for (var i = 0; i < pinElems.length; i++) {
    initPinDrag(pinElems[i]);
  }

  rangeFilter.addEventListener('click', function (clickEvt) {
    var filterCoords = rangeFilter.getBoundingClientRect();
    var clickOffsetX = clickEvt.clientX - filterCoords.left;

    var startCoords = {
      x: 0,
    };

    var rightPinPos = Math.abs(rangeBtnRight.offsetLeft - clickOffsetX);
    var leftPinPos = Math.abs(rangeBtnLeft.offsetLeft - clickOffsetX);

    if (rightPinPos > leftPinPos) {
      startCoords.x = rangeBtnLeft.offsetLeft;
      setPins(rangeBtnLeft, clickEvt, startCoords, filterCoords);
    } else {
      startCoords.x = rangeBtnRight.offsetLeft;
      setPins(rangeBtnRight, clickEvt, startCoords, filterCoords);
    }
  });
})();
