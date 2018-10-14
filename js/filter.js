'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var KindsMap = {
    'icecream': 'Мороженое',
    'marshmallows': 'Зефир',
    'soda': 'Газировка',
    'gum': 'Жевательная резинка',
    'marmalade': 'Мармелад',
  };

  var filterForm = document.querySelector('.catalog__sidebar form');
  var filterClearBtn = filterForm.querySelector('.catalog__submit');
  var rangePriceMinElem = filterForm.querySelector('.range__price--min');
  var rangePriceMaxElem = filterForm.querySelector('.range__price--max');

  var countSpans = {
    'filter-price': filterForm.querySelector('.range__count'),
  };

  var filterProps;

  var translateKind = function (value) {
    return KindsMap[value];
  };

  // функции для фильтрации

  // для каждого условия
  var atomicFilterFunctions = {
    'filter-price': function (item) {
      return item.price >= filterProps.price.min && item.price <= filterProps.price.max;
    },

    'filter-icecream': function (item) {
      return item.kind === translateKind('icecream');
    },

    'filter-soda': function (item) {
      return item.kind === translateKind('soda');
    },

    'filter-gum': function (item) {
      return item.kind === translateKind('gum');
    },

    'filter-marmalade': function (item) {
      return item.kind === translateKind('marmalade');
    },

    'filter-marshmallows': function (item) {
      return item.kind === translateKind('marshmallows');
    },

    'filter-sugar-free': function (item) {
      return item.nutritionFacts.sugar === false;
    },

    'filter-vegetarian': function (item) {
      return item.nutritionFacts.vegetarian === true;
    },

    'filter-gluten-free': function (item) {
      return item.nutritionFacts.gluten === false;
    },

    'filter-favorite': function (item) {
      return item.isFavorite;
    },

    'filter-availability': function (item) {
      return item.amount > 0;
    },
  };

  var filterFunctions = {
    filterByKind: function (item) {
      if (!filterProps.foodTypes.length) {
        return true;
      }

      return filterProps.foodTypes.some(function (elem) {
        return atomicFilterFunctions[elem](item);
      });
    },

    filterByProps: function (item) {
      var rank = 0;
      var propsLength = filterProps.foodProps.length;

      if (propsLength) {
        rank = filterProps.foodProps.filter(function (elem) {
          return atomicFilterFunctions[elem](item);
        }).length;

        rank = rank === propsLength;
      } else {
        rank++;
      }

      return !!rank;
    },

    filterByPrice: atomicFilterFunctions['filter-price'],

    filterByFavorite: function (item) {
      return filterProps.favorite ? atomicFilterFunctions['filter-favorite'](item) : true;
    },

    filterByAvailability: function (item) {
      return filterProps.available ? atomicFilterFunctions['filter-availability'](item) : true;
    },
  };

  var sortFunctions = {
    'filter-popular': function (left, right) {
      return right.rating.number - left.rating.number;
    },
    'filter-expensive': function (left, right) {
      return right.price - left.price;
    },
    'filter-cheep': function (left, right) {
      return left.price - right.price;
    },
    'filter-rating': function (left, right) {
      return (right.rating.value - left.rating.value) || sortFunctions['filter-popular'](left, right);
    },
  };

  var setFilteredValues = function () {
    Object.keys(countSpans).forEach(function (key) {
      countSpans[key].textContent = '(' + window.goods.filter(atomicFilterFunctions[key]).length + ')';
    });
  };

  var setFilterProps = function () {
    var checkedInputs = {
      foodTypeInputs: filterForm.querySelectorAll('input[name="food-type"]:checked'),
      foodPropInputs: filterForm.querySelectorAll('input[name="food-property"]:checked'),
      favoriteInput: filterForm.querySelector('#filter-favorite:checked'),
      availabilityInput: filterForm.querySelector('#filter-availability:checked'),
      sortInput: filterForm.querySelector('input[name="sort"]:checked'),
    };

    filterProps = {
      foodTypes: [],
      foodProps: [],
      price: {
        min: parseInt(rangePriceMinElem.textContent, 10),
        max: parseInt(rangePriceMaxElem.textContent, 10),
      },
      favorite: !!checkedInputs.favoriteInput,
      available: !!checkedInputs.availabilityInput,
      sort: checkedInputs.sortInput ? checkedInputs.sortInput.id : null,
    };

    if (checkedInputs.foodTypeInputs.length) {
      filterProps.foodTypes = Array.prototype.slice.call(checkedInputs.foodTypeInputs).map(function (elem) {
        return elem.id;
      });
    }

    if (checkedInputs.foodPropInputs.length) {
      filterProps.foodProps = Array.prototype.slice.call(checkedInputs.foodPropInputs).map(function (elem) {
        return elem.id;
      });
    }
  };

  window.applyFilter = window.debounce(function () {
    var filteredArray;

    setFilterProps();

    // фильтрация
    filteredArray = window.goods.filter(function (item) {
      return (
        filterFunctions.filterByKind(item) &&
        filterFunctions.filterByProps(item) &&
        filterFunctions.filterByPrice(item) &&
        filterFunctions.filterByFavorite(item) &&
        filterFunctions.filterByAvailability(item)
      );
    });

    if (filterProps.sort) {
      filteredArray = filteredArray.sort(sortFunctions[filterProps.sort]);
    }

    setFilteredValues();

    window.renderGoodsList(filteredArray);
  }, DEBOUNCE_INTERVAL);

  var clearFilter = function () {
    var inputs = filterForm.querySelectorAll('input');
    var filterPopularInput = filterForm.querySelector('#filter-popular');

    inputs.forEach(function (item) {
      item.checked = false;
    });

    filterPopularInput.checked = true;

    window.rangeSliderSetDefault();

    window.applyFilter();
  };

  var onFilterClearBtnClick = function (evt) {
    evt.preventDefault();

    clearFilter();
  };

  var onFilterFormChange = function (evt) {
    var target = evt.target;
    var isChecked;

    if (target.name === 'mark') {
      isChecked = target.checked;

      // этот инпут тоже сбрасывается этой функцией
      clearFilter();

      // поэтому возвращаем ему состояние до сброса
      target.checked = isChecked;
    }

    window.applyFilter();
  };

  // заполнение countSpans
  document.querySelectorAll('.catalog__filter input').forEach(function (elem) {
    var currentValueSpan = elem.closest('.input-btn').querySelector('span');

    if (currentValueSpan) {
      countSpans[elem.id] = currentValueSpan;
    }
  });

  filterForm.addEventListener('change', onFilterFormChange);
  filterClearBtn.addEventListener('click', onFilterClearBtnClick);
})();
