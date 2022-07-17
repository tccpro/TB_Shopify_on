$(document).ready(function(){
  $('.the-nav').cbFlyout();
  $("#sort-by").on("click",function(){
  	$("#bc-sf-filter-top-sorting-mobile,#bc-sf-filter-top-sorting-mobile label").show();
    $("#bc-sf-filter-tree").hide();
    $(".bc-sf-filter-block-content,.bc-sf-filter-option-view-more,.bc-sf-filter-option-view-less").hide();
  });
  $("#filter-by").on("click",function(){
  	$("#bc-sf-filter-top-sorting-mobile,#bc-sf-filter-top-sorting-mobile label").hide();
    $("#bc-sf-filter-tree").show();
  });
  $("html,body").on("click",'#bc-sf-filter-options-wrapper .bc-sf-filter-option-block',function(){
//     alert(123);
    $(".bc-sf-filter-block-content,.bc-sf-filter-option-view-more,.bc-sf-filter-option-view-less").hide();
    if($(this).find(".bc-sf-filter-block-content").is(":visible")){
      $(this).find(".bc-sf-filter-block-content,.bc-sf-filter-option-view-more,.bc-sf-filter-option-view-less").hide();
    }else{
      $(this).find(".bc-sf-filter-block-content,.bc-sf-filter-option-view-more,.bc-sf-filter-option-view-less").show();
    }
  })
});