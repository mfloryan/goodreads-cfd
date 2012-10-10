var application = (function() {
    var cfdData = [];
    var pub = {};
    const localStorageKey = "mmsquare.goodreads-cdn.books";

    pub.showFormIfBrowserDataNoAvailable = function () {
        var goodreadsData = localStorage.getItem(localStorageKey);
        if (goodreadsData) {
            cfdData = JSON.parse(goodreadsData);
            //Well, rehydrating object from JSON kills dates. Sadly.
            cfdData.forEach(function(item, index, array) {
                if (item.dateAdded) item.dateAdded = new Date(Date.parse(item.dateAdded));
                if (item.dateStarted) item.dateStarted = new Date(Date.parse(item.dateStarted));
                if (item.dateFinished) item.dateFinished = new Date(Date.parse(item.dateFinished));
            });
        } else {
            $('#goodreads-api').show();
        }
    };

    pub.loadGoodReadsData = function() {
        //var url = "http://www.goodreads.com/review/list/2924969?format=xml&key="+$('#apiKey').val()+"&v=2&per_page=40";
        var url = "sample1.xml";
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

                    book.shelves = [];

                    $(this).find('shelf').each(function() {
                        book.shelves.push($(this).attr('name'));
                    });

                    cfdData.push(book);
                });
                localStorage.setItem(localStorageKey, JSON.stringify(cfdData));
            },
            done: function() {
                $('#goodreads-api').hide();
            }
        });

    };

    pub.drawCfd = function() {
        var cfdDataStageOne = [];
        var firstDate = new Date(2020,0,1);
        var lastDate = new Date(0);

        cfdData.forEach(function(book, index, array) {
            var bookDataPoint = {};

            var updateMinAndMaxDate =function(date) {
                if (date < firstDate) firstDate = date;
                if (date > lastDate) lastDate = date;
            }

            if (book.dateStarted && book.dateFinished) {
                if (book.dateAdded > book.dateStarted) {
                    bookDataPoint.ready = book.dateStarted;
                } else {
                    bookDataPoint.ready = book.dateAdded;
                }
                bookDataPoint.reading = book.dateStarted;
                bookDataPoint.done = book.dateFinished;
                cfdDataStageOne.push(bookDataPoint);
            } else {
                if (book.dateAdded && book.dateStarted && book.shelves.some(function(element, index, array) { return element == "reading" })) {
                    if (book.dateAdded > book.dateStarted) {
                        bookDataPoint.ready = book.dateStarted;
                    } else {
                        bookDataPoint.ready = book.dateAdded;
                    }
                    bookDataPoint.reading = book.dateStarted;
                    cfdDataStageOne.push(bookDataPoint);
                } else if (book.dateAdded && book.shelves.some(function(element, index, array) { return element == "to-read" })) {
                    bookDataPoint.ready = book.dateAdded;
                    cfdDataStageOne.push(bookDataPoint);
                }
            }

            if (bookDataPoint) {
                if (bookDataPoint.ready) {
                    updateMinAndMaxDate(bookDataPoint.ready);
                }
                if (bookDataPoint.reading) {
                    updateMinAndMaxDate(bookDataPoint.reading);
                }
                if (bookDataPoint.done) {
                    updateMinAndMaxDate(bookDataPoint.done);
                }

            }

        });

        console.log("Done");

        var chartData = {
          'label' : ['ready', 'reading', 'done'],
          'values': []
        };

        var calculateReady = function(date) {
            var matching = cfdDataStageOne.filter(function(item, index, array) {
                return (item.ready <= date && (!item.reading || item.reading > date));
            });
            return matching.length;
        }

        var calculateReading = function(date) {
            var matching = cfdDataStageOne.filter(function(item, index, array) {
                return (item.reading &&
                        item.reading <= date
                        && (!item.done || item.done > date));
            });
            return matching.length;
        }

        var calculateDone = function(date) {
            var matching = cfdDataStageOne.filter(function(item, index, array) {
                return (
                    item.done &&
                    item.done <= date
                    );
            });
            return matching.length;
        }

        var ms = (lastDate - firstDate);

        var numberOfSteps = 20;
        var step = Math.round(ms / numberOfSteps);

        for (var i=0; i < numberOfSteps; i++) {
            var dateForDataPoint = new Date(firstDate.getTime() + (i * step));

            console.log(dateForDataPoint);

            var dataPoint = {
                label:i.toString(),
                values: [calculateReady(dateForDataPoint), calculateReading(dateForDataPoint), calculateDone(dateForDataPoint)]
            };
            chartData.values.push(dataPoint);
        }

        console.log("Done Done");
    };

    return pub;
}());


$(document).ready(function() {
    application.showFormIfBrowserDataNoAvailable();
    $('#get-goodreads-data').click(application.loadGoodReadsData);
    $('#draw-button').click(application.drawCfd);
});