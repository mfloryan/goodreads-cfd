var cfdData = cfdData || {};

$(document).ready(function() {

    var goodreadsData = localStorage.getItem("mmsquare.goodreads-cdn.books");
    if (goodreadsData) {
        cfdData.data = goodreadsData;
    } else {
        $('#goodreads-api').show();
    }


});