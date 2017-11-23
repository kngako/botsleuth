var botData = require('./data/bot-list.json');
var tokenizer = require('./botsleuth-tokenizer.js');

var handle = "CountryDutyZA";
if(tokenizer.isBotIdentified(handle, botData)) {
    console.log("Found: " + handle);
} else {
    console.log("That user isn't in our database check botometer.");
}
