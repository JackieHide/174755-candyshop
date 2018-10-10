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

  var iceCreamCountSpan = filterForm.querySelector('#filter-icecream').parentElement.querySelector('span');
  var sodaCountSpan = filterForm.querySelector('#filter-soda').parentElement.querySelector('span');
  var gumCountSpan = filterForm.querySelector('#filter-gum').parentElement.querySelector('span');
  var marmaladeCountSpan = filterForm.querySelector('#filter-marmalade').parentElement.querySelector('span');
  var marshmallowsCountSpan = filterForm.querySelector('#filter-marshmallows').parentElement.querySelector('span');
  var sugarCountSpan = filterForm.querySelector('#filter-sugar-free').parentElement.querySelector('span');
  var vegetarianCountSpan = filterForm.querySelector('#filter-vegetarian').parentElement.querySelector('span');
  var glutenCountSpan = filterForm.querySelector('#filter-gluten-free').parentElement.querySelector('span');
  var priceCountSpan = filterForm.querySelector('.range__count');
  var favoriteCountSpan = filterForm.querySelector('#filter-favorite').parentElement.querySelector('span');
  var availableCountSpan = filterForm.querySelector('#filter-availability').parentElement.querySelector('span');

  var filterProps;

  var translateKind = function (value) {
    return kindsMap[value];
  };

  // функции для фильтрации
  var filterByKind = function (item) {
    var rank = 0;

    if (filterProps.foodTypes.length) {
      filterProps.foodTypes.forEach(function (elem) {
        if (item.kind === translateKind(elem)) {
          rank++;
        }
      });
    } else {
      rank++;
    }

    return !!rank;
  };

  var filterBySugar = function (item) {
    return filterProps.foodProps && filterProps.foodProps.sugar !== undefined ?
      item.nutritionFacts.sugar === filterProps.foodProps.sugar :
      true;
  };

  var filterByVegetarian = function (item) {
    return filterProps.foodProps && filterProps.foodProps.vegetarian !== undefined ?
      item.nutritionFacts.vegetarian === filterProps.foodProps.vegetarian :
      true;
  };

  var filterByGluten = function (item) {
    return filterProps.foodProps && filterProps.foodProps.gluten !== undefined ?
      item.nutritionFacts.gluten === filterProps.foodProps.gluten :
      true;
  };

  var filterByPrice = function (item) {
    return item.price >= filterProps.price.min && item.price <= filterProps.price.max;
  };

  var filterByFavorite = function (item) {
    return filterProps.favorite ? item.isFavorite : true;
  };

  var filterByAvailability = function (item) {
    return filterProps.available ? item.amount > 0 : true;
  };

  var sortGoods = function (array, type) {
    var tempArray;

    if (type === 'popularity') {
      tempArray = array.slice().sort(function (left, right) {
        return right.rating.number - left.rating.number;
      });
    }

    if (type === 'priceUp') {
      tempArray = array.slice().sort(function (left, right) {
        return right.price - left.price;
      });
    }

    if (type === 'priceDown') {
      tempArray = array.slice().sort(function (left, right) {
        return left.price - right.price;
      });
    }

    if (type === 'rating') {
      tempArray = array.slice().sort(function (left, right) {
        return right.rating.value - left.rating.value;
      });
    }

    return tempArray;
  };

  var setFilteredValues = function () {
    iceCreamCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.kind === translateKind('icecream');
    }).length + ')';

    sodaCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.kind === translateKind('soda');
    }).length + ')';

    gumCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.kind === translateKind('gum');
    }).length + ')';

    marmaladeCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.kind === translateKind('marmalade');
    }).length + ')';

    marshmallowsCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.kind === translateKind('marshmallows');
    }).length + ')';

    sugarCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.nutritionFacts.sugar === false;
    }).length + ')';

    vegetarianCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.nutritionFacts.vegetarian === true;
    }).length + ')';

    glutenCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.nutritionFacts.gluten === false;
    }).length + ')';

    priceCountSpan.textContent = '(' + window.goods.filter(filterByPrice).length + ')';

    favoriteCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.isFavorite;
    }).length + ')';

    availableCountSpan.textContent = '(' + window.goods.filter(function (item) {
      return item.amount > 0;
    }).length + ')';
  };

  window.applyFilter = window.debounce(function () {
    var foodTypeInputs = filterForm.querySelectorAll('input[name="food-type"]:checked');

    var foodPropSugar = filterForm.querySelector('#filter-sugar-free:checked');
    var foodPropVegetarian = filterForm.querySelector('#filter-vegetarian:checked');
    var foodPropGluten = filterForm.querySelector('#filter-gluten-free:checked');

    var favoriteInput = filterForm.querySelector('#filter-favorite:checked');
    var availabilityInput = filterForm.querySelector('#filter-availability:checked');

    var sortInputPopular = filterForm.querySelector('#filter-popular:checked');
    var sortInputPriceUp = filterForm.querySelector('#filter-expensive:checked');
    var sortInputPriceDown = filterForm.querySelector('#filter-cheep:checked');
    var sortInputRating = filterForm.querySelector('#filter-rating:checked');

    var filteredArray;

    filterProps = {
      foodTypes: [],
      foodProps: {},
      price: {
        min: parseInt(rangePriceMinElem.textContent, 10),
        max: parseInt(rangePriceMaxElem.textContent, 10),
      },
      favorite: null,
      available: null,
      sort: {
        popularity: true,
        priceUp: false,
        priceDown: false,
        rating: false,
      }
    };

    if (foodTypeInputs.length) {
      foodTypeInputs.forEach(function (elem) {
        filterProps.foodTypes.push(elem.value);
      });
    }

    if (foodPropSugar || foodPropVegetarian || foodPropGluten) {
      if (foodPropSugar) {
        filterProps.foodProps.sugar = false;
      }
      if (foodPropVegetarian) {
        filterProps.foodProps.vegetarian = true;
      }
      if (foodPropGluten) {
        filterProps.foodProps.gluten = false;
      }
    } else {
      filterProps.foodProps = null;
    }

    if (favoriteInput) {
      filterProps.favorite = true;
    }

    if (availabilityInput) {
      filterProps.available = true;
    }

    if (sortInputPopular) {
      filterProps.sort.popularity = true;
    } else if (sortInputPriceUp) {
      filterProps.sort.priceUp = true;
    } else if (sortInputPriceDown) {
      filterProps.sort.priceDown = true;
    } else if (sortInputRating) {
      filterProps.sort.rating = true;
    } else {
      filterProps.sort = null;
    }

    // фильтрация
    filteredArray = window.goods
                      .filter(filterByKind)
                      .filter(filterBySugar)
                      .filter(filterByVegetarian)
                      .filter(filterByGluten)
                      .filter(filterByPrice)
                      .filter(filterByFavorite)
                      .filter(filterByAvailability);

    if (filterProps.sort) {
      Object.keys(filterProps.sort).forEach(function (elem) {
        if (filterProps.sort[elem]) {
          filteredArray = sortGoods(filteredArray, elem);
        }
      });
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

      clearFilter();

      if (isChecked) {
        target.checked = true;
      } else {
        target.checked = false;
      }
    }

    window.applyFilter();
  };

  filterForm.addEventListener('change', onFilterFormChange);
  filterClearBtn.addEventListener('click', onFilterClearBtnClick);
})();
