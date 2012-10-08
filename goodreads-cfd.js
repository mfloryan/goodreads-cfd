var application = (function() {
    var cfdData = {};
    var pub = {};

    pub.showFormIfBrowserDataNoAvailable = function () {
        var goodreadsData = localStorage.getItem("mmsquare.goodreads-cdn.books");
        if (goodreadsData) {
            cfdData.data = goodreadsData;
        } else {
            $('#goodreads-api').show();
        }
    };

    return pub;
}());


$(document).ready(function() {
    application.showFormIfBrowserDataNoAvailable();
});