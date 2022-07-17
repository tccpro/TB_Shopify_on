var onSale = false;
var soldOut = false;
var priceVaries = false;
var images = [];
var firstVariant = {};
// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        /* Optional */
        loadProductFirst: true
    }
};
// Declare Templates
var bcSfFilterTemplate = {
    'soldOutClass': ' sold-out',
    'saleClass': ' on-sale',
    'soldOutLabelHtml': '<span class="soldout bc-sf-filter-label">' + bcSfFilterConfig.label_basic.sold_out + '</span>',
    'saleLabelHtml': '<span class="sale bc-sf-filter-label">' + bcSfFilterConfig.label_basic.sale + '</span>',
    'tagLabelHtml': '<span class="tag bc-sf-filter-label {{labelTag}}" >{{labelTag}}</span>',
    'vendorHtml': '<p class="bc-sf-filter-product-item-vendor">{{itemVendorLabel}}</p>',
    // Grid Template
    'productGridItemHtml': '<div class="jsgsiel list-item box grid__item small--one-half medium--one-half large--one-quarter {{gridWidthClass}}{{soldOutClass}}{{saleClass}} {{itemActiveSwapClass}}">' +
                                '<!-- {{collections}} -->' +
                                '<script class="bc-sf-filter-product-script" data-id="bc-product-json-{{itemId}}" type="application/json">{{itemJson}}</script>' +
                                '<div class="product-grid-item">' +
  									'<span class="grid-link__image ab-grid-link__image--product clearfix">'+
    									'<span class="img grid-link__image-centered">'+
  											'<a href="{{itemUrl}}" class="bc-sf-filter-product-item-image-link">{{itemImages}}</a>' +
    									'</span>'+
  									'</span>'+
                                    '<div class="bc-sf-filter-product-item-label">{{itemLabels}}{{itemTagLabels}}</div>' +
                                    '<div class="block">' +
                                        '<h4><a href="{{itemUrl}}" class="bc-sf-filter-product-item-title">{{itemTitle}}</a></h4>' +
                                        '<div class="prices">' +
  										  '<span class="prices-container">'+
                                          '{{itemPrice}}' +
  											'<div class="yotpo bottomLine" data-appkey="Z27A76DgfCrjO46QR080KW7KFQubD2Wh2Wso5hUL" data-domain="{{itemDomain}}" data-product-id="{{itemId}}" data-product-models="{{itemId}}" data-name="{{itemTitle}}" data-url="{{itemUrl}}" data-image-url="{{itemThumbUrl}}" data-description="{{itemDescription}}" data-bread-crumbs="{{itemTags}}"> </div>' +
 											 '</span>'+
  										  '<span class="reviews-container">'+
  												'<div><a href="{{itemUrl}}">{{variantLength}} Options</a></div>'+
                                                 '<a href="{{itemUrl}}" class="btn">Shop Now</a>'+
                                            '</span>'+
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>',
    // For List View
    // List Template
    'productListItemHtml': '<div class="bc-sf-filter-product-item bc-sf-filter-product-item-list {{soldOutClass}}{{saleClass}} {{itemActiveSwapClass}}">' +
                                '<div class="bc-sf-filter-product-item-list-col-1">' +
                                    '<div class="bc-sf-filter-product-item-image">' +
                                        '<div class="bc-sf-filter-product-item-label">{{itemLabels}}{{itemTagLabels}}</div>' +
                                        '<a href="{{itemUrl}}" class="bc-sf-filter-product-item-image-link">{{itemImages}}</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="bc-sf-filter-product-bottom">' +
                                    '<div class="bc-sf-filter-product-item-list-col-2">' +
                                        '<a href="{{itemUrl}}" class="bc-sf-filter-product-item-title">{{itemTitle}}</a>' +
                                        '{{itemVendor}}' +
                                        '<p class="bc-sf-filter-des">{{itemDescription}}</p>' +
                                    '</div>' +
                                    '<div class="bc-sf-filter-product-item-list-col-3">{{itemPrice}}</div>' +
                                '</div>'+
                            '</div>',
    // End For List View
    // Pagination Template
    'previousActiveHtml': '<li><a href="{{itemUrl}}">&larr;</a></li>',
    'previousDisabledHtml': '<li class="disabled"><span>&larr;</span></li>',
    'nextActiveHtml': '<li><a href="{{itemUrl}}">&rarr;</a></li>',
    'nextDisabledHtml': '<li class="disabled"><span>&rarr;</span></li>',
    'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
    'paginateHtml': '<ul>{{previous}}{{pageItems}}{{next}}</ul>',
    // Sorting Template
    'sortingHtml': '<label><span><span>' + bcSfFilterConfig.label.sorting + '</span></span></label><ul class="bc-sf-filter-filter-dropdown">{{sortingItems}}</ul>',
    // Show Limit Template
    'showLimitHtml': '<label>' + bcSfFilterConfig.label.show_limit + '</label><select class="bc-sf-filter-filter-dropdown">{{showLimitItems}}</select>',
    // Breadcrumb Template
    'breadcrumbHtml': '<a href="/">' + bcSfFilterConfig.label.breadcrumb_home + '</a> {{breadcrumbDivider}} {{breadcrumbItems}}',
    'breadcrumbDivider': '<span class="divider">/</span>',
    'breadcrumbItemLink': '<a href="{{itemLink}}">{{itemTitle}}</a>',
    'breadcrumbItemSelected': '<span>{{itemTitle}}</span>',
};
/************************** CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
function prepareShopifyData(data) {
  console.log(data);
  // Displaying price base on the policy of Shopify, have to multiple by 100
  soldOut = !data.available; // Check a product is out of stock
  onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Convert images to array
  images = data.images_info;
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  return data;
}
/************************** END CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
/************************** BUILD PRODUCT LIST **************************/
// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
  // Get Template
  var dataLength = data.variants.length;
  var dataImage = data.featured_image.src;
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;
  // Customize API data to get the Shopify data
  data = prepareShopifyData(data);
  console.log(data);
  var collectionList = []
  for (var i = 0; i < data.collections.length; i++) {
    collectionList.push(data.collections[i].title)
  }
  itemHtml = itemHtml.replace(/{{collections}}/g, collectionList.join(', '));
  // Add Custom class
  var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
  itemHtml = itemHtml.replace(/{{variantLength}}/g, dataLength);
  itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);
  itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);
  // Add Grid Width class
  itemHtml = itemHtml.replace(/{{gridWidthClass}}/g, buildGridWidthClass(data));
  // Add Label
  itemHtml = itemHtml.replace(/{{itemLabels}}/g, buildLabels(data));
  // Add TAG Label
  itemHtml = itemHtml.replace(/{{itemTagLabels}}/g, buildTagLabels(data, false));
  // Add Images
  itemHtml = itemHtml.replace(/{{itemImages}}/g, buildImages(data));
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, dataImage);
  // Add Price
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, buildPrice(data));
  // Add Vendor
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, buildVendor(data));
  // itemActiveSwapClass
  var itemActiveSwapClass = bcSfFilterConfig.custom.active_image_swap ? 'has-bc-swap-image' : '';
  itemHtml = itemHtml.replace(/{{itemActiveSwapClass}}/g, itemActiveSwapClass);

  // Add data json
  var self = this;
  var itemJson = {
    "id": data.id,
    "title": data.title,
    "handle": data.handle,
    "vendor": data.vendor,
    "variants": data.variants,
    "url": self.buildProductItemUrl(data),
    "options_with_values": data.options_with_values,
    "images": data.images,
    "available": data.available,
    "price_min": data.price_min,
    "price_max": data.price_max,
    "compare_at_price_min": data.compare_at_price_min,
    "compare_at_price_max": data.compare_at_price_max
  };
  itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

  // Build Domain
  itemHtml = itemHtml.replace(/{{itemDomain}}/g, this.escape(bcSfFilterConfig.shop.domain));
  // Build Description
  var itemDescription = data.description;
  itemDescription = itemDescription.substr(0, itemDescription.indexOf('##highlights##'));
  itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);
  // Build Tags
  itemHtml = itemHtml.replace(/{{itemTags}}/g, this.escape(data.tags.join(';')));
  
  // Add main attribute (Always put at the end of this function)
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
//   itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, data.url);
  return itemHtml;
};
// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function(data) {
  // For List View
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/
  // Get Template
  var itemHtml = bcSfFilterTemplate.productListItemHtml;
  // Customize API data to get the Shopify data
  data = prepareShopifyData(data);
  // Add Custom class
  var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
  itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);
  itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);
  // Add Label
  itemHtml = itemHtml.replace(/{{itemLabels}}/g, buildLabels(data));
  // Add TAG Label
  itemHtml = itemHtml.replace(/{{itemTagLabels}}/g, buildTagLabels(data, false));
  // Add Images
  itemHtml = itemHtml.replace(/{{itemImages}}/g, buildImages(data));
  // Add Vendor
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, buildVendor(data));
  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, priceVaries);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);
  // Description
  var itemDescription = jQ('<p>' + data.body_html + '</p>').text();
  itemDescription = (itemDescription.split(" ")).length > 40 ? itemDescription.split(" ").splice(0, 40).join(" ") + '...' : itemDescription.split(" ").splice(0, 40).join(" ");
  itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);
  // itemActiveSwapClass
  var itemActiveSwapClass = bcSfFilterConfig.custom.active_image_swap ? 'has-bc-swap-image' : '';
  itemHtml = itemHtml.replace(/{{itemActiveSwapClass}}/g, itemActiveSwapClass);
  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
//   itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, data.url);
  return itemHtml;
  // End For List View
};
/************************** END BUILD PRODUCT LIST **************************/
/************************** BUILD PRODUCT ITEM ELEMENTS **************************/
function buildGridWidthClass() {
  var gridWidthClass = '';
  // On PC
  switch (bcSfFilterConfig.custom.products_per_row) {
    case 2:
      gridWidthClass = 'bc-sf-filter-grid-width-2';
      break;
    case 3:
      gridWidthClass = 'bc-sf-filter-grid-width-3';
      break;
    case 5:
      gridWidthClass = 'bc-sf-filter-grid-width-5';
      break;
    default:
      gridWidthClass = 'bc-sf-filter-grid-width-4';
      break;
  }
  // On Mobile
  switch (bcSfFilterConfig.custom.products_per_row_mobile) {
    case 1:
      gridWidthClass += ' bc-sf-filter-grid-width-mb-1';
      break;
    case 3:
      gridWidthClass += ' bc-sf-filter-grid-width-mb-3';
      break;
    default:
      gridWidthClass += ' bc-sf-filter-grid-width-mb-2';
      break;
  }
  return gridWidthClass;
}

function buildImages(data) {
  var html = '';
  // Build Main Image
  var thumbUrl = images.length > 0 ? bcsffilter.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
  html += '<img src="' + thumbUrl + '" class="bc-sf-filter-product-item-main-image" />';
  // Build Image Swap
  if (bcSfFilterConfig.custom.active_image_swap) {
    var flipImageUrl = images.length > 1 ? bcsffilter.optimizeImage(images[1]['src']) : thumbUrl;
    html += '<img src="' + flipImageUrl + '" class="bc-sf-filter-product-item-flip-image" />';
  }
  return html;
}

function buildVendor(data) {
  var html = '';
  if (bcSfFilterConfig.custom.show_vendor) {
    html = bcSfFilterTemplate.vendorHtml;
  }
  return html;
}

function buildPrice(data) {
  var html = '';
  if (bcSfFilterConfig.custom.show_price) {
    if (priceVaries) {
      html += '<div class="price">'+bcsffilter.formatMoney(data.price_min) + "-" + bcsffilter.formatMoney(data.price_max)+'</div>';
    }else{
      html += '<div class="price">'+bcsffilter.formatMoney(data.price_min)+'</div>' ;
    }
  }
  return html;
}

function buildLabels(data) {
  // Build Sold out label
  var soldOutLabel = '';
  if (bcSfFilterConfig.custom.show_sold_out_label && soldOut) {
    soldOutLabel = bcSfFilterTemplate.soldOutLabelHtml.replace(/{{style}}/g, '');
  }
  // Build Sale label
  var saleLabel = '';
  if (bcSfFilterConfig.custom.show_sale_label && onSale && !soldOut) {
    saleLabel = bcSfFilterTemplate.saleLabelHtml.replace(/{{style}}/g, '');
  }
  // Build Labels
  return soldOutLabel + saleLabel;
}
// BUILD LABEL PRODUCT WITH TAGS
function buildTagLabels(data, showall) {
  if (showall) {
    var tagLabel = '';
    if (data.tags) {
      for (var i = 0; i < data.tags.length; i++) {
        var tag = data.tags[i];
        if (tag.indexOf("pfs:label") !== -1) {
          var preTagLabel = bcSfFilterTemplate.tagLabelHtml.replace(/{{labelTag}}/g, tag.split('pfs:label-')[1]);
          tagLabel += preTagLabel;
        }
      }
    }
  } else {
    var tagLabel = '';
    if (data.tags) {
      for (var i = data.tags.length - 1; i >= 0; i--) {
        tag = data.tags[i];
        if (tag.indexOf("pfs:label") !== -1) {
          var preTagLabel = bcSfFilterTemplate.tagLabelHtml.replace(/{{labelTag}}/g, tag.split('pfs:label-')[1]);
          tagLabel += preTagLabel;
          break;
        }
      }
    }
  }
  return tagLabel;
}
/************************** END BUILD PRODUCT ITEM ELEMENTS **************************/
/************************** BUILD TOOLBAR **************************/
// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);
  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }
  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;
    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);
    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);
    // Create page items array
    var beforeCurrentPageArr = [];
    for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
      beforeCurrentPageArr.unshift(iBefore);
    }
    if (currentPage - 4 > 0) {
      beforeCurrentPageArr.unshift('...');
    }
    if (currentPage - 4 >= 0) {
      beforeCurrentPageArr.unshift(1);
    }
    beforeCurrentPageArr.push(currentPage);
    var afterCurrentPageArr = [];
    for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
      afterCurrentPageArr.push(iAfter);
    }
    if (currentPage + 3 < totalPage) {
      afterCurrentPageArr.push('...');
    }
    if (currentPage + 3 <= totalPage) {
      afterCurrentPageArr.push(totalPage);
    }
    // Build page items
    var pageItemsHtml = '';
    var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
    for (var iPage = 0; iPage < pageArr.length; iPage++) {
      if (pageArr[iPage] == '...') {
        pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
      } else {
        pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
      }
      pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
      pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
    }
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);
    jQ(this.selector.pagination).html(paginationHtml);
  }
};
// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterConfig.custom.show_sorting && bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');
    var sortingArr = this.getSortingList();
    if (sortingArr) {
      var paramSort = this.queryParams.sort || '';
      // Build content
      var sortingItemsHtml = '';
      for (var k in sortingArr) {
        activeClass = '';
        if(paramSort == k) {
          activeClass = 'active';
        }
        sortingItemsHtml += '<li><a href="#" data-sort="' + k + '" class="' + activeClass+ '">' + sortingArr[k] + '</a></li>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
      jQ('.bc-sf-filter-custom-sorting').html(html);
      if(jQ('.bc-sf-filter-custom-sorting').hasClass("bc-sf-filter-sort-active")) {
        jQ('.bc-sf-filter-custom-sorting').toggleClass('bc-sf-filter-sort-active');
      }

      var labelSort = '';
      if(paramSort.length > 0) {
        var labelHandle = 'sorting_' + paramSort.replace(/\-/g, '_');
        labelSort = bcSfFilterConfig.label[labelHandle];
      } else {
        labelSort = bcSfFilterConfig.label.sorting;
      }
      
      jQ('.bc-sf-filter-custom-sorting label span span').text(labelSort);
    }
  }
};

// Build Sorting event
BCSfFilter.prototype.buildSortingEvent = function() {
  var _this = this;
  jQ('.bc-sf-filter-filter-dropdown a').click(function(e){
    e.preventDefault();
    onInteractWithToolbar(e, 'sort', _this.queryParams.sort, jQ(this).data('sort'));
  });

  jQ(".bc-sf-filter-custom-sorting > label").click(function(){
    if (!jQ('.bc-sf-filter-filter-dropdown').is(':animated')) {
      jQ('.bc-sf-filter-filter-dropdown').toggle().parent().toggleClass('bc-sf-filter-sort-active');
      jQ('#bc-sf-filter-tree').hide();
    }
  });

  jQ(this.getSelector('filterTreeMobileButton')).click(function(){
    jQ('#bc-sf-filter-top-sorting-mobile .bc-sf-filter-filter-dropdown').hide();
  });
};
// For Toolbar - Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function() {
  var itemHtml = '<span>' + bcSfFilterConfig.label.toolbar_viewas + '</span>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="bc-sf-filter-display-item bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><i class="fa fa-th" aria-hidden="true"></i><span class="fallback-text">Grid view</span></span></a>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="bc-sf-filter-display-item bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><i class="fa fa-list" aria-hidden="true"></i><span class="fallback-text">List view</span></span></a>';
  var topDisplayTypeSelector = jQ(this.getSelector('topDisplayType'));
  var listProductSelector = jQ(this.getSelector('products'));
  topDisplayTypeSelector.html(itemHtml);
  // Active current display type
  topDisplayTypeSelector.find('.bc-sf-filter-display-item').removeClass('active');
  if (this.queryParams.display == 'list') {
    topDisplayTypeSelector.find('.bc-sf-filter-display-list').addClass('active');
    listProductSelector.removeClass('bc-sf-filter-grid-view-items').addClass('bc-sf-filter-list-view-items');
  } else if (this.queryParams.display == 'grid') {
    topDisplayTypeSelector.find('.bc-sf-filter-display-grid').addClass('active');
    listProductSelector.removeClass('bc-sf-filter-list-view-items').addClass('bc-sf-filter-grid-view-items');
  }
};
// Build Display type event
BCSfFilter.prototype.buildDisplayTypeEvent = function() {
  var _this = this;
  var topDisplayTypeSelector = jQ(this.getSelector('topDisplayType'));
  var listProductSelector = jQ(this.getSelector('products'));
  jQ(this.getSelector('topDisplayType') + ' a').click(function(e) {
    e.preventDefault();
    _this.internalClick = true;
    jQ(this).parent().children().removeClass('active');
    jQ(this).addClass('active');
    if (_this.queryParams.display == 'list') {
      topDisplayTypeSelector.find('.bc-sf-filter-display-list').addClass('active');
      listProductSelector.removeClass('bc-sf-filter-grid-view-items').addClass('bc-sf-filter-list-view-items');
    } else if (_this.queryParams.display == 'grid') {
      topDisplayTypeSelector.find('.bc-sf-filter-display-grid').addClass('active');
      listProductSelector.removeClass('bc-sf-filter-list-view-items').addClass('bc-sf-filter-grid-view-items');
    }
    var newUrl = jQ(this).attr('href');
    _this.onChangeData(newUrl, 'display');
  })
};
// Build Show Limit
BCSfFilter.prototype.buildFilterShowLimit = function() {
  if (bcSfFilterConfig.custom.show_limit && bcSfFilterTemplate.hasOwnProperty('showLimitHtml')) {
    jQ(this.selector.topShowLimit).html('');
    var numberList = this.getSettingValue('general.showLimitList');
    if (numberList != '') {
      // Build content
      var showLimitItemsHtml = '';
      var arr = numberList.split(',');
      for (var k = 0; k < arr.length; k++) {
        showLimitItemsHtml += '<option value="' + arr[k].trim() + '">' + arr[k].trim() + '</option>';
      }
      var html = bcSfFilterTemplate.showLimitHtml.replace(/{{showLimitItems}}/g, showLimitItemsHtml);
      jQ(this.selector.topShowLimit).html(html);
      // Set value
      jQ(this.selector.topShowLimit + ' select').val(this.queryParams.limit);
    }
  }
};
// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function(colData, apiData) {
  if (bcSfFilterTemplate.hasOwnProperty('breadcrumbHtml')) {
    var breadcrumbItemsHtml = '';
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
      var colInfo = colData.collection;
      if (typeof this.collectionTags !== 'undefined' && this.collectionTags !== null) {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemLink.replace(/{{itemLink}}/g, '/collections/' + colInfo.handle).replace(/{{itemTitle}}/g, colInfo.title);
        breadcrumbItemsHtml += " {{breadcrumbDivider}} ";
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.collectionTags[0]);
      } else {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, colInfo.title);
      }
    } else {
      breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.getSettingValue('label.defaultCollectionHeader'));
    }
    var html = bcSfFilterTemplate.breadcrumbHtml.replace(/{{breadcrumbItems}}/g, breadcrumbItemsHtml)
    html = html.replace(/{{breadcrumbDivider}}/g, bcSfFilterTemplate.breadcrumbDivider);
    jQ(this.selector.breadcrumb).html(html);
  }
};
/************************** END BUILD TOOLBAR **************************/
function matchHeightImage() {
  jQ('.bc-sf-filter-product-item-main-image').load(function() {
    var imageContainer = jQ(this).parent();
    imageContainer.css('width', '100%').css('height', $(this).height());
  }).each(function() {
    if (this.complete) jQ(this).load();
  });
}
// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
    /* start-initialize-bc-al */
    var self = this;
    var alEnable = true;
    if(self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != ''){
      alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
    }
    if (typeof Yotpo !== 'undefined') {
      var api = new Yotpo.API(yotpo);
      api.refreshWidgets();
    }
    if (alEnable === true && typeof BCActionList !== 'undefined') {
        if (typeof bcActionList === 'undefined') {
            bcActionList = new BCActionList();
        }else{
          if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
              bcActionList.initFlag = false;
              bcActionList.alInit(bcSfFilterParams, bcAlParams);
          } else {
              bcActionList.alInit();
          }
        }
    }
    /* end-initialize-bc-al */
  // Call theme init function
  if (typeof theme !== 'undefined' && typeof theme.init === 'function') {
    $(theme.init);
  }
  // End For List View
};
// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  var _this = this;
  var totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_other + '</span>';
  if (data.total_product == 1) {
    totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_one + '</span>';
  }
  jQ('#bc-sf-filter-total-product').html(totalProduct);
  matchHeightImage();
  jQ(window).resize(function() {
    matchHeightImage();
  });

  jQ('body').find('.bc-sf-filter-skeleton-button').remove();

  // Prevent double tap on iOS
  this.isMobile()&&jQ(".bc-sf-filter-product-item").find("a").on("touchstart",function(){isScrolling=!1}).on("touchmove",function(){isScrolling=!0}).on("touchend",function(){isScrolling||(window.location=jQ(this).attr("href"))});

  // Fix image not loaded on mobile
  (this.isMobile()||null!=navigator.userAgent.match(/iPad/i))&&(setTimeout(function(){jQ(".bc-sf-filter-product-item-image img").each(function(){var a=jQ(this).attr("src")+"3";jQ(this).attr("src",a)})},200),setTimeout(function(){jQ(".bc-sf-filter-product-item-image img").each(function(){var a=jQ(this).attr("src")+"3";jQ(this).attr("src",a)})},2e3));
};


// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

BCSfFilter.prototype.prepareProductData = function(data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; if(data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0){ data[k].tags = data[k]['original_tags'].slice(0); }} return data };

BCSfFilter.prototype.getFilterData=function(eventType,errorCount){function BCSend(eventType,errorCount){var self=bcsffilter;var errorCount=typeof errorCount!=="undefined"?errorCount:0;self.showLoading();if(typeof self.buildPlaceholderProductList=="function"){self.buildPlaceholderProductList(eventType)}self.beforeGetFilterData(eventType);self.prepareRequestParams(eventType);self.queryParams["callback"]="BCSfFilterCallback";self.queryParams["event_type"]=eventType;var url=self.isSearchPage()?self.getApiUrl("search"):self.getApiUrl("filter");var script=document.createElement("script");script.type="text/javascript";var timestamp=(new Date).getTime();script.src=url+"?t="+timestamp+"&"+jQ.param(self.queryParams);script.id="bc-sf-filter-script";script.async=true;var resendAPITimer,resendAPIDuration;resendAPIDuration=2e3;script.addEventListener("error",function(e){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}if(errorCount<3){errorCount++;if(resendAPITimer){clearTimeout(resendAPITimer)}resendAPITimer=setTimeout(self.getFilterData("resend",errorCount),resendAPIDuration)}else{self.buildDefaultElements(eventType)}});document.getElementsByTagName("head")[0].appendChild(script);script.onload=function(){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}}}this.requestFilter(BCSend,eventType,errorCount)};BCSfFilter.prototype.requestFilter=function(sendFunc,eventType,errorCount){sendFunc(eventType,errorCount)};


/* start-boost-2.4.8 */
BCSfFilter.prototype.buildFilterOptionItem=function(html,iLabel,iValue,fOType,fOId,fOLabel,fODisplayType,fOSelectType,fOItemValue,fOData){var keepValuesStatic=fOData.hasOwnProperty("keepValuesStatic")?fOData.keepValuesStatic:false;if(fOType=="review_ratings"&&this.getSettingValue("general.ratingSelectionStyle")=="text"){var title=this.getReviewRatingsLabel(fOItemValue.from)}else{var title=this.customizeFilterOptionLabel(iLabel,fOData.prefix,fOType)}if(keepValuesStatic===true)var productNumber=null;else var productNumber=fOItemValue.hasOwnProperty("doc_count")?fOItemValue.doc_count:0;html=html.replace(/{{itemLabel}}/g,this.buildFilterOptionLabel(iLabel,productNumber,fOData));html=html.replace(/{{itemLink}}/g,this.buildFilterOptionLink(fOId,iValue,fOType,fODisplayType,fOSelectType,keepValuesStatic));html=html.replace(/{{itemValue}}/g,encodeURIParamValue(iValue));html=html.replace(/{{itemTitle}}/g,title);html=html.replace(/{{itemFunc}}/g,"onInteractWithFilterOptionValue(event, this, '"+fOType+"', '"+fODisplayType+"', '"+fOSelectType+"', '"+keepValuesStatic+"')");html=this.checkFilterOptionSelected(fOId,iValue,fOType,fODisplayType)?html.replace(/{{itemSelected}}/g,"selected"):html.replace(/{{itemSelected}}/g,"");var htmlElement=jQ(html);htmlElement.children().attr({"data-id":fOId,"data-value":encodeURIParamValue(iValue),"data-parent-label":fOLabel,"data-title":title,"data-count":productNumber});if(fOType!="collection"){htmlElement.children().attr("rel","nofollow")}if(fOType=="collection")htmlElement.children().attr("data-collection-scope",fOItemValue.key);return jQ(htmlElement)[0].outerHTML};
/* end-boost-2.4.8 */

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
