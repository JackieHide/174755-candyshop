'use strict';

(function () {
  var rangeFilter = document.querySelector('.range__filter');
  var rangeLine = rangeFilter.querySelector('.range__fill-line');
  var pinElems = rangeFilter.querySelectorAll('.range__btn');
  var rangeBtnLeft = document.querySelector('.range__btn--left');
  var rangeBtnRight = document.querySelector('.range__btn--right');
  var rangePriceMax = document.querySelector('.range__price--max');
  var rangePriceMin = document.querySelector('.range__price--min');

  window.rangeSliderSetDefault = function () {
    rangePriceMin.textContent = window.util.RANGE_NUMBERS[0];
    rangePriceMax.textContent = window.util.RANGE_NUMBERS[1];

    rangeBtnLeft.style.left = '0px';
    rangeBtnRight.style.left = rangeFilter.offsetWidth + 'px';
    rangeLine.style.left = '0px';
    rangeLine.style.right = '0px';
  };

  var getPinPosition = function (pinElem, pinLeftOffset, shift) {
    var stopPosition = {
      min: 0,
      max: 0,
    };

    var positionValue;

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

    return positionValue;
  };

  var setPinValue = function (pinElem, pinLeftOffset, parentWidth) {
    var pinPercent = pinLeftOffset / parentWidth;
    var pinValue = Math.floor((window.util.RANGE_NUMBERS[1] - window.util.RANGE_NUMBERS[0]) * pinPercent + window.util.RANGE_NUMBERS[0]);

    if (pinElem.classList.contains('range__btn--right')) {
      rangePriceMax.textContent = pinValue;
    }

    if (pinElem.classList.contains('range__btn--left')) {
      rangePriceMin.textContent = pinValue;
    }
  };

  var setPins = function (pinElem, event, startCoords, filterCoords) {
    var shift = {
      x: startCoords.x - (event.clientX - filterCoords.left),
    };

    startCoords.x = event.clientX - filterCoords.left;

    var pinLeftOffset = pinElem.offsetLeft;
    var parentWidth = rangeFilter.offsetWidth;
    var positionValue = getPinPosition(pinElem, pinLeftOffset, shift);

    pinElem.style.left = positionValue + 'px';
    rangeLine.style.left = rangeBtnLeft.offsetLeft + 'px';
    rangeLine.style.right = rangeFilter.offsetWidth - rangeBtnRight.offsetLeft + 'px';

    pinLeftOffset = pinElem.offsetLeft;

    setPinValue(pinElem, pinLeftOffset, parentWidth);
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

        window.applyFilter();
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

    window.applyFilter();
  });

  window.rangeSliderSetDefault();
})();
