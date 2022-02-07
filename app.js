'use strict';

function addListener(element, event, callback) {
    return document.querySelector(element).addEventListener(event, callback);
}

function getQuestions(element, tags, response) {
    document.querySelector(element).innerHTML = '' +
        '<p>' +
        'Query of ' + tags + ' returned ' + response.items.length + ' results' +
        '</p>';
}

function getResponseDescription(element, response) {
    document.querySelector(element).innerHTML = response.items.map(function(item) {
            return '' +
                '<div>' +
                '<p>Title: ' + item.title + '</p>' +
                '<p>Date: ' + new Date(item.creation_date) + '</p>' +
                '<p>Link: <a href="' + item.link + '">Click here</a></p>' +
                '<p>Owner: ' + item.owner.display_name + '</p>' +
                '</div>'
        })
        .join('<br>');
}

function checkResponse(xhr, tags) {
    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        getQuestions("#results-summary", tags, response)
        getResponseDescription('#results-body', response);
    } else {
        console.log('Status Code: ' + xhr.status);
    }
}

addListener('#form-unanswered', 'submit', function(e) {
    e.preventDefault();

    var form = e.target;
    var tags = form.querySelector('input[name=tags]').value;
    var url =
        "https://api.stackexchange.com/2.2/questions/unanswered?order=desc&sort=activity&site=stackoverflow&tagged=" +
        tags;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
        checkResponse(xhr, tags)
    });

    xhr.open('GET', url);
    xhr.send();
});


addListener('#form-answerers', 'submit', function(e) {
    e.preventDefault();

    var form = e.target;
    var tag = form.querySelector('input[name=tags]').value;
    var url = 'http://api.stackexchange.com/2.2/tags/' + tag + '/top-answerers/all_time?site=stackoverflow'

    var xhr = new XMLHttpRequest();


    xhr.addEventListener('load', function() {
        checkResponse(xhr, tag)
    });

    xhr.open('GET', url);
    xhr.send();
});