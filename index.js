var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');

var startLink = process.argv[2];
var depthLevel = process.argv[3];
var searchPhrase = process.argv.slice(4).join(" ");

// console.group("arguments:");
// console.log("startLink - " + startLink);
// console.log("depthLevel - " + depthLevel);
// console.log("searchPhrase - " + searchPhrase);
// console.groupEnd();

var pagesToVisit = [];
var pagesVisited = {};
var numPagesVisited = 0;

var url = new URL(startLink);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(startLink);
crawl();

function crawl() {
    if(numPagesVisited > depthLevel) {
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        crawl();
    } else {
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    pagesVisited[url] = true;

    console.log("Visiting page " + url);
    request(url, function(error, response, body) {
        console.log("Status code: " + response.statusCode);
        if(response.statusCode !== 200) {
            callback();
            return;
        }
        var $ = cheerio.load(body);
        var number_of_finds = searchForWord($, searchPhrase);
        if (number_of_finds && number_of_finds.length > 0){
            numPagesVisited++;
            console.log("Number of finds " + number_of_finds.length);
            writeToFile(url, number_of_finds.length);
        }
        if (url === startLink)collectInternalLinks($);
        callback();
    });
}

function searchForWord($, searchWord) {
    var text = $('html > body').text().toLowerCase();
    var reg = new RegExp('(' + searchWord + ')', 'img');
    text = text.replace(/\s+/g, " ")
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase()
        .match(reg);
    return text;
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}

function writeToFile(url, numberOfFinds) {
    var message = url + " " + numberOfFinds + "\n";
    fs.appendFile('result.txt', message, function (err) {
        if (err) throw err;
        console.log('Saved to a file');
    })
}
