// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionPosition: 'left'
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
};

/* Start Search Redirect */
function submitSearchFormMobile(t,e){e.preventDefault();var o=bcsffilter.getSearchRedirectUrl(bcsffilter.currentTerm);o?window.location.href=o:jQ(t).closest("form").submit()}function beforeSubmitSearchForm(t,e){var o=jQ(t).val(),i=bcsffilter.getSearchRedirectUrl(o);i&&(e.stopImmediatePropagation(),e.stopPropagation(),e.preventDefault(),window.location.href=i)}BCSfFilter.prototype.setSuggestionPosition=function(t){var e=this;if("function"==typeof getSuggestionPosition&&"function"==typeof this.checkIsFullWidthSuggestionMobile){var o=getSuggestionPosition(t),i=this.checkIsFullWidthSuggestionMobile(t)?"top":"top+12";"function"!=typeof e.isSuggestionStyle2||e.isSuggestionStyle2(),"left"==o?jQ(t).autocomplete("option","position",{my:"left "+i,at:"left bottom",collision:"none"}):jQ(t).autocomplete("option","position",{my:"right "+i,at:"right bottom",collision:"none"})}else"left"==this.getSettingValue("search.suggestionPosition")?jQ(t).autocomplete("option","position",{my:"left top+12",at:"left bottom",collision:"none"}):jQ(t).autocomplete("option","position",{my:"right top+12",at:"right bottom",collision:"none"});if(jQ(t).length>0&&jQ(t).on("keydown",function(o){13==o.keyCode&&e.enterSearchBoxEvent(t,o)}),jQ(t).closest("form").length>0){var n=jQ(t).closest("form").find('[type="submit"]');n&&n.length>0&&n.each(function(e,o){o.setAttribute("onclick","beforeSubmitSearchForm('"+t+"', event)")})}},BCSfFilter.prototype.enterSearchBoxEvent=function(t,e){var o=jQ(t).val(),i=this.getSearchRedirectUrl(o);i&&(e.preventDefault(),window.location.href=i)},BCSfFilter.prototype.getSearchRedirectUrl=function(t){if(this.suggestionCache&&this.suggestionCache.hasOwnProperty(t))for(var e=this.suggestionCache[t],o=0;o<e.length;o++)if("redirect"==e[o].key&&e[o].values){var i=e[o].values;return i=(i=i.replace("https://"+bcSfFilterMainConfig.shop.domain,"")).replace("http://"+bcSfFilterMainConfig.shop.domain,"")}return""};
/* End Search Redirect */
