'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var kindsMap = {
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

  document.querySelectorAll('.catalog__filter input').forEach(function (elem) {
    if (elem.closest('.input-btn').querySelector('span')) {
      countSpans[elem.id] = elem.closest('.input-btn').querySelector('span');
    }
  });

  var filterProps;

  var translateKind = function (value) {
    return kindsMap[value];
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
      var rank = 0;

      if (filterProps.foodTypes.length) {
        filterProps.foodTypes.forEach(function (elem) {
          if (atomicFilterFunctions[elem](item)) {
            rank++;
          }
        });
      } else {
        rank++;
      }

      return !!rank;
    },

    filterByProps: function (item) {
      var rank = 0;
      var propsLength = filterProps.foodProps.length;

      if (propsLength) {
        filterProps.foodProps.forEach(function (elem) {
          if (atomicFilterFunctions[elem](item)) {
            rank++;
          }
        });

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
      return right.rating.value - left.rating.value;
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
      sortInputs: filterForm.querySelectorAll('input[name="sort"]:checked'),
    };

    if (checkedInputs.foodTypeInputs.length) {
      checkedInputs.foodTypeInputs.forEach(function (elem) {
        filterProps.foodTypes.push(elem.id);
      });
    }

    if (checkedInputs.foodPropInputs.length) {
      checkedInputs.foodPropInputs.forEach(function (elem) {
        filterProps.foodProps.push(elem.id);
      });
    }

    if (checkedInputs.favoriteInput) {
      filterProps.favorite = true;
    }

    if (checkedInputs.availabilityInput) {
      filterProps.available = true;
    }

    if (checkedInputs.sortInputs.length) {
      checkedInputs.sortInputs.forEach(function (elem) {
        filterProps.sort = elem.id;
      });
    }
  };

  window.applyFilter = window.debounce(function () {
    var filteredArray;

    filterProps = {
      foodTypes: [],
      foodProps: [],
      price: {
        min: parseInt(rangePriceMinElem.textContent, 10),
        max: parseInt(rangePriceMaxElem.textContent, 10),
      },
      favorite: null,
      available: null,
      sort: null,
    };

    setFilterProps();

    // фильтрация
    filteredArray = window.goods
                      .filter(filterFunctions.filterByKind)
                      .filter(filterFunctions.filterByProps)
                      .filter(filterFunctions.filterByPrice)
                      .filter(filterFunctions.filterByFavorite)
                      .filter(filterFunctions.filterByAvailability);

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

  filterForm.addEventListener('change', onFilterFormChange);
  filterClearBtn.addEventListener('click', onFilterClearBtnClick);
})();
