var application = (function() {
    var cfdData = {};
    var pub = {};
    const localStorageKey = "mmsquare.goodreads-cdn.books";

    pub.showFormIfBrowserDataNoAvailable = function () {

        var goodreadsData = localStorage.getItem(localStorageKey);
        if (goodreadsData) {
            cfdData.data = goodreadsData;
        } else {
            $('#goodreads-api').show();
        }
    };

    pub.loadGoodReadsData = function() {
        var url = "http://www.goodreads.com/review/list/2924969?format=xml&key="+$('#apiKey').val()+"&v=2&per_page=40";

        $.ajax({
            url: url,
            dataType: 'xml',
            type: 'GET',
            crossDomain: true,
            success: function(data, textStatus, jqXHR) {

                //localStorage.setItem(localStorageKey, data);
            },
            done: function() {
                $('#goodreads-api').hide();
            }
        });

    };

    return pub;
}());


$(document).ready(function() {
    application.showFormIfBrowserDataNoAvailable();
    $('#get-goodreads-data').click(application.loadGoodReadsData);
});