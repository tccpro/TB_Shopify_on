(function (algolia) {
  'use strict';

  var _ = algolia._;

  var TYPES_TO_WIDGET = {
    slider: { name: 'rangeSlider', useDefault: true },
    menu: { name: 'menu', params: { limit: 10 } },
    conjunctive: { name: 'refinementList', params: { operator: 'and', limit: 10 } },
    disjunctive: { name: 'refinementList', params: { operator: 'or', limit: 10 } },
  };

  var sortByRefined = function sortByRefined (sortFunction) {
    return function (a, b) {
      if (a.refined !== b.refined) {
        if (a.refined) {
          return -1;
        }
        if (b.refined) {
          return 1;
        }
      }
      return sortFunction(a, b);
    };
  };

  /*
   * Sorting functions : Allows to chose in which order you want to display the facets
   * Algolia will always send you back the most relevant values for each facet (the ones
   * with the highest count). These sorting functions won't change which results come back
   * but how they are displayed. To retrieve more results, change the maxValuesPerFacet
   * parameter in your Algolia Dashboard.
   * The default sort function is refined > count > name.
   */
  algolia.facetSortFunctions = {
    price_range: sortByRefined(function sortRanges (a, b) {
      if (a.name.length === b.name.length) {
        return a.name.localeCompare(b.name);
      }
      return a.name.length - b.name.length;
    })
  };

  /*
   * Display functions
   * When the object sent back for a facet item doesn't match how you would want it to look
   * like, use a function to reformat it how you want.
   */
  algolia.facetDisplayFunctions = {
    price_range: function displayRange (value) {
      var values = value.split(':');

      return _.map(values, function (e) {
        return algolia.formatMoney(+e * 100).replace(/\.\d+/, '');
      }).join(' - ');
    }
  }

  algolia.facetCssClasses = {
    root: 'ais-facet',
    header: 'ais-facet--header',
    body: 'ais-facet--body',
    item: 'ais-facet--item',
    label: 'ais-facet--label',
    checkbox: 'ais-facet--checkbox',
    active: 'ais-facet--active',
    count: 'ais-facet--count'
  };

  var enabledFacets = _.filter(algolia.config.facets, function (facet) { return facet.enabled || parseInt(facet.enabled); });
  algolia.facets = _.map(enabledFacets, function (facet) { return Object.assign({}, facet, { escapedName: encodeURIComponent(facet.name) }) });
  algolia.shownFacets = _.filter(algolia.facets, function (facet) { return facet.type !== 'hidden' });
  algolia.hiddenFacets = _.filter(algolia.config.facets, function (facet) { return facet.type === 'hidden'; });
  algolia.facetTitles = {};
  _.each(algolia.facets, function (facet) {
    algolia.facetTitles[facet.name] = facet.title;
  });
  algolia.facetsWidgets = _.map(algolia.shownFacets, function (facet) {
    var widget = TYPES_TO_WIDGET[facet.type],
        params = _.cloneDeep(widget.params) || {};

    params.container = "[class~='ais-facet-" + facet.escapedName + "']";
    params.attributeName = facet.name;
    params.templates = {};
    params.cssClasses = algolia.facetCssClasses;

    if (facet.searchable) {
      params.searchForFacetValues = {placeholder: 'Search for ' + facet.name, isAlwaysActive: true};
      params.searchForFacetValues.templates = {noResults: '<div> No matching ' + facet.name + '</div>'};
    }

    params.templates.header = function () {
      return facet.title;
    }

    if (!widget.useDefault) {
      params.templates.item = algolia.getTemplate('instant_search_facet_item');
    }

    if (algolia.facetSortFunctions[facet.name]) {
      params.sortBy = algolia.facetSortFunctions[facet.name];
    }

    var displayFunction = algolia.facetDisplayFunctions[facet.name];
    params.transformData = function (data) {
      data.type = {};
      data.type[facet.type] = true;
      if (displayFunction) {
        data.name = displayFunction(data.name);
      }
      return data;
    }

    return {
      name: widget.name,
      params: params
    };
  });
}(algoliaShopify));
