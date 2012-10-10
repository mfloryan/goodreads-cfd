var application = (function() {
    var cfdData = [];
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

                function getDateFromXml(jQueryElement, fieldName) {
                    var dateString = jQueryElement.find(fieldName).text();
                    if (dateString) {
                        return new Date(Date.parse(dateString));
                    } else {
                        return null;
                    }
                }

                $(data).find('review').each(function() {
                    var book = {};

                    book.dateAdded = getDateFromXml($(this),'date_added');
                    book.dateStarted = getDateFromXml($(this),'started_at');
                    book.dateFinished = getDateFromXml($(this),'read_at');
                    book.isbn = $(this).find('isbn').text();

                    cfdData.push(book);
                });
                localStorage.setItem(localStorageKey, cfdData);
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