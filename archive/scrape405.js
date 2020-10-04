// converts BCFerries daily schedule to crontab
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var hour;
var minute;
var AMPM;

//request("http://localhost/schedule_data.html", function(error, response, body) {
request("http://orca.bcferries.com:8080/cc/marqui/arrivals-departures.asp?dept=HSB&route=03", function(error, response, body) {
    if (error) {
        console.log("Error: " + error);
        //console.log("Status code: " + response.statusCode);
        //console.log("Body empty: ");
    }

    if (body) {
        var $ = cheerio.load(body);
        //    console.log(body);
        $('td').each(function(index) {
            var test = $(this);
            var test1 = /((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/.exec(test);

            //        if (test1 !== ''){}
            var json = JSON.stringify(test1);
            // parse the json object
            var obj = JSON.parse(json);

            for (i in obj) {
                hour = obj[2];
                previousHour = parseInt(hour, 10) - 1;
                minute = obj[3];
                AMPM = obj[4];
                if (AMPM == "PM" && hour !== "12") {
                    hour = parseInt(hour, 10) + 12;
                } else if (AMPM == "PM" && hour == "12") {
                    hour = parseInt(hour, 10);
                }
            }
            //    console.log(minute, hour, "* * * nodejs /home/alastair/source/runtime.secure/scrape305.js && sh /home/alastair/source/alastairrough.github.com/git2.sh && sh /home/alastair/source/alastairrough.github.com/alexa/skill-sample-ferry/ferryfact5rpi81.sh");
            console.log(minute, hour, "* * * nodejs /home/alastair/source/runtime.secure/scrape305.js && sh /home/alastair/source/alastairrough.github.com/git2.sh");
            // 2300
            // create daily a new crontab from the next day's sailing schedule
            // then pipe to awk and crontab
            // nodejs scrape405.js | awk '!seen[$0]++' | tee root.crontab
            // as root, cp root.crontab /var/spool/cron/crontabs/root
            // root.crontab has to retain all other fixed cron jobs not associated with ferry data
            //
            // 6 23 * * * /etc/webmin/package-updates/update.pl
            // # nmap
            // 0 6 * * * sh /home/alastair/source/nmap/nmap.sh
            // # email IP address on boot
            // @reboot sudo sh /home/alastair/source/Linux-shell-scripts/address.sh | mailx -s "address on boot" rough.alastair@gmail.com
            // # generate daily crontab
            // 0 23 * * * nodejs scrape405.js | awk '!seen[$0]++' | tee root.crontab
            // cat fixed_cronjobs.crontab root.crontab > /var/spool/cron/crontabs/root
            // 

            //  console.log(obj);
        });
    } else {
        console.log("Body empty");
    }
});