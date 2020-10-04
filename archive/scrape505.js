// input: ferry page or frame
// output: outputs to mqtt feed
// action: scrapes the next arrival at Langdale and 
// 
// scenarios:
// 1. no ferries en route 
// 2. 1 ferry en route
// 3. 2 ferries en route
// 4. add status comment
// 5. ferry delayed
// 6. ferry cancelled
// 7. generalize with additional fields

// to do
// 1. investigate parsing rendered HTML ie using a virtual browser
// 2. allow for zero to n results for ETA

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var hour;
var minute;
var AMPM;
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')


request("http://localhost/test_arrival.html", function (error, response, body) {

  // request("http://orca.bcferries.com:8080/cc/marqui/arrivals-departures.asp?dept=HSB&route=03", function(error, response, body) {
  // request("https://orca.bcferries.com/cc/marqui/arrivals-departures.asp?dept=HSB&amp;route=03", function (error, response, body) {
  // https://orca.bcferries.com/cc/marqui/arrivals-departures.asp?dept=HSB&amp;route=03
  if (error) {
    console.log("Error: " + error);
    //console.log("Status code: " + response.statusCode);
    //console.log("Body empty: ");
  }

  if (body) {
    var $ = cheerio.load(body);
    //    console.log(body);
    // $('td').each(function (index) {
    $('tr').each(function (index) {
      var test = $(this);

      var test1 = /ETA:<\/font> <font style="font-weight: normal" color="green">((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))<\/font>/.exec(test);
      // var test2 = /((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/.exec(test);

      if (test1 !== '') {
        var json = JSON.stringify(test1);
        // parse the json object
      }
      var obj = JSON.parse(json);

      // if (!json.isNull){
      // console.log(obj);
      // }


      for (i in obj) {
        hour = obj[2];
        previousHour = parseInt(hour, 10) - 1;
        minute = obj[3];
        AMPM = obj[4];
        if (AMPM == "PM" && hour !== "12") {
          hour = parseInt(hour, 10) + 12;
        }
        else if (AMPM == "PM" && hour == "12") {
          hour = parseInt(hour, 10);
        }
        if (hour !== null && minute !== null && AMPM !== null) {
          console.log(obj);
          client.on('connect', () => {
            // subscribe to
            // mosquitto_sub -h broker.hivemq.com -v -t 'klk/langdale/alert'
            client.publish('klk/langdale/alert', json)
          })

        }
      }

      //    console.log(minute, hour, "* * * nodejs /home/alastair/source/runtime.secure/scrape305.js && sh /home/alastair/source/alastairrough.github.com/git2.sh && sh /home/alastair/source/alastairrough.github.com/alexa/skill-sample-ferry/ferryfact5rpi81.sh");
      // console.log(minute, hour, "* * * nodejs /home/alastair/source/runtime.secure/scrape305.js && sh /home/alastair/source/alastairrough.github.com/git2.sh");
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
  }
  else {
    console.log("Body empty");
  }
});
