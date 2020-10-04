const request = require("request");
const cheerio = require("cheerio");
function getFull(id, callback) {
    request.get('https://www.imdb.com/title/tt0816692/', function (
        error,
        response,
        data
    ) {
        const $ = cheerio.load(data);
        callback(error, {
            story: $("div.inline:nth-child(3) > p:nth-child(1) > span:nth-child(1)")
                .text()
                .trim()
        });
    });
}