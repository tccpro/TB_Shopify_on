(function (algolia) {
  if (!algolia.config.autocomplete_enabled) return;

  var _ = algolia._,
      $ = algolia.jQuery;

  var autocomplete;

  function index (name) {
    return algolia.client.initIndex('' + algolia.config.index_prefix + name);
  }

  function addPositionToHits(hits, queryID) {
    return hits.map(function (entry, index) {
      entry._position = index + 1;
      entry._queryID = queryID
      return entry
    })
  }

  function autocompleteSection (section) {
    var params = autocomplete[section];
    if (params.enabled !== true) return null;

    var templates = {
      empty: function displayEmptyResultSet (props) {
        return algolia.render(params.templates.empty, Object.assign({}, props, { translations: algolia.translations }));
      },
      suggestion: function displaySuggestion (hit) {
        return algolia.render(params.templates.hit, Object.assign({ _distinct: params.distinct }, hit, {translations: algolia.translations}));
      }
    };

    if (params.templates.footer) {
      templates.footer = function displayFooter (props, content) {
        if (content.nbHits <= params.hitsPerPage) return null;
        if (!autocomplete.showFooter) return null;

        return algolia.render(params.templates.footer, {
          query: props.query,
          nbHits: content.nbHits,
          translations: algolia.translations,
          helpers: algolia.helpers
        });
      }

    }

    return {
      name: section,
      source: function(query, callback) {
        var searchOpts = {
          clickAnalytics: true,
          hitsPerPage: params.hitsPerPage,
          highlightPreTag: '<span class="aa-highlight">',
          highlightPostTag: '</span>',
        };
        if (params.distinct) {
          searchOpts.distinct = true;
        }
        index(section).search(query, searchOpts).then(function(answer) {
          var hits = addPositionToHits(answer.hits, answer.queryID);
          callback(hits, answer);
        });
      },
      displayKey: 'title',
      templates: templates
    }
  };

  function readjust($this) {
    var data = $this.data('aaAutocomplete');
    if (!data) return;
    var $node = data.$node;
    var $dropdown = data.dropdown.$menu;

    var width = $this.outerWidth();
    var vpWidth = document.body.clientWidth;
    var offset = $this.offset();
    var left = offset.left;
    var right = vpWidth - width - left;
    var top = offset.top;
    var height = $this.outerHeight();

    var align = left < right ? 'left' : 'right';
    var dist = Math.min(left, right);

    // For small centered inputs, take half the screen
    if (4 * dist > vpWidth) {
      align = 'left';
      dist = Math.round(vpWidth / 4);
    }

    var newWidth = vpWidth - 2 * dist;

    // For big inputs, follow the input
    if (width >= 600) {
      align = 'left';
      dist = left;
      newWidth = width;
    }

    $node
      .css('left', '')
      .css('right', '')
      .css('top', (top + height + 8) + 'px')
      .css(align, dist)
      .css('width', '' + newWidth + 'px');

    var suffix = 'lg';
    if (newWidth < 300) suffix = 'xs';
    else if (newWidth < 600) suffix = 'sm';
    else if (newWidth < 900) suffix = 'md';

    $dropdown
      .removeClass('aa-dropdown-menu-size-xs')
      .removeClass('aa-dropdown-menu-size-sm')
      .removeClass('aa-dropdown-menu-size-md')
      .removeClass('aa-dropdown-menu-size-lg')
      .addClass('aa-dropdown-menu-size-' + suffix);
  }

  autocomplete = algolia.autocomplete = {
    articles: {
      enabled: algolia.config.index_articles,
      hitsPerPage: algolia.config.articles_autocomplete_hits_per_page,
      index: index('articles'),
      templates: {
        empty: algolia.compileTemplate('autocomplete_articles_empty'),
        hit: algolia.compileTemplate('autocomplete_article')
      }
    },
    pages: {
      enabled: algolia.config.index_pages,
      hitsPerPage: algolia.config.pages_autocomplete_hits_per_page,
      index: index('pages'),
      templates: {
        empty: algolia.compileTemplate('autocomplete_pages_empty'),
        hit: algolia.compileTemplate('autocomplete_page')
      }
    },
    collections: {
      enabled: algolia.config.index_collections,
      hitsPerPage: algolia.config.collections_autocomplete_hits_per_page,
      index: index('collections'),
      templates: {
        empty: algolia.compileTemplate('autocomplete_collections_empty'),
        hit: algolia.compileTemplate('autocomplete_collection')
      }
    },
    colors: algolia.config.colors,
    debug: algolia.config.autocomplete_debug,
    poweredBy: algolia.config.powered_by,
    products: {
      enabled: algolia.config.index_products,
      distinct: algolia.config.show_products,
      hitsPerPage: algolia.config.products_autocomplete_hits_per_page,
      index: index('products'),
      templates: {
        empty: algolia.compileTemplate('autocomplete_products_empty'),
        footer: algolia.compileTemplate('autocomplete_footer'),
        hit: algolia.compileTemplate('autocomplete_product')
      },
    },
    selector: algolia.config.input_selector + ', .algolia-shopify-autocomplete',
    showFooter: algolia.config.instant_search_enabled,
    storeName: algolia.storeName,
    templates: {
      dropdown: algolia.compileTemplate('autocomplete'),
      empty: '<div></div>',
      style: algolia.compileTemplate('autocomplete.css')
    }
  };

  if (autocomplete.poweredBy) {
    console.log('Algolia: Autocomplete');
  }

  algolia.appendStyle(algolia.render(autocomplete.templates.style, {
    colors: autocomplete.colors
  }));

  $(document).ready(function mainAutocomplete () {
    autocomplete.$input = $(autocomplete.selector);
    autocomplete.$input.autocomplete({
      debug: autocomplete.debug,
      hint: false,
      appendTo: 'body',
      templates: {
        dropdownMenu: algolia.render(autocomplete.templates.dropdown, {
          storeName: autocomplete.storeName,
          with: {
            articles: autocomplete.articles.enabled,
            collections: autocomplete.collections.enabled,
            pages: autocomplete.pages.enabled,
            footer: autocomplete.showFooter,
            poweredBy: autocomplete.poweredBy,
            products: autocomplete.products.enabled
          }
        }),
        empty: autocomplete.templates.empty
      }
    }, _.compact([
      autocompleteSection('collections'),
      autocompleteSection('articles'),
      autocompleteSection('pages'),
      autocompleteSection('products')
    ]));

    // Hack to handle buggy onclick event on iOS
    autocomplete.$input.each(function () {
      var data = $(this).data('aaAutocomplete');
      var dropdown = data.dropdown;
      var suggestionClass = '.' + dropdown.cssClasses.prefix + '-' + dropdown.cssClasses.suggestion;
      var onSuggestionClick = dropdown._onSuggestionClick.bind(dropdown);

      var touchmoved;
      dropdown.$menu.on('touchend', suggestionClass, function (e) {
        if(touchmoved === false) {
          e.preventDefault();
          e.stopPropagation();
          onSuggestionClick.apply(this, arguments);
        }
      }).on('touchmove', function (){
        touchmoved = true;
      }).on('touchstart', function(){
        touchmoved = false;
      });
    });

    autocomplete.$input.on('autocomplete:selected', function (obj, datum, name) {
      if (algolia.config.analytics_enabled) {
        window.aa('click', { objectID: datum.objectID, position: datum._position, queryID: datum._queryID });
      }
      if (name === 'products') {
        var addVariantId = !autocomplete.products.distinct && datum.objectID !== datum.id;
        window.location.href = '/' + name + '/' + datum.handle + (addVariantId ? ('?variant=' + datum.objectID) : '');
      } else if (name === 'articles') {
        window.location.href = '/blogs/' + datum.blog.handle + '/' + datum.handle;
      } else {
        window.location.href = '/' + name + '/' + datum.handle;
      }
    })

    autocomplete.$input.on('autocomplete:redrawn', function () {
      readjust($(this));
    });

    $(window).resize(function () {
      autocomplete.$input.each(function () {
        readjust($(this));
      });
    });
  });
}(algoliaShopify));
