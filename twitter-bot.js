var config = require('config');
var Twitter = require('twitter');
var tokenizer = require('./botsleuth-tokenizer.js');
var botData = require('./data/bot-list.json');

var authToken = {
    consumer_key: config.get("twitter.consumer_key"),
    consumer_secret: config.get("twitter.consumer_secret"),
    access_token_key: config.get("twitter.access_token_key"),
    access_token_secret: config.get("twitter.access_token_secret")
};

var client = new Twitter(authToken);
console.log("Twitter client instantiated");

client.stream('statuses/filter', {track: '@' + config.get("twitter.handle")}, function(stream) {
    console.log("Stream should be starting now...");
    stream.on('data', function(streamedTweet) {
        console.log(streamedTweet && streamedTweet.text);
        console.log("New tweet: ", streamedTweet);
        if(streamedTweet.retweeted_status == null && tokenizer.isTextAQuestion(streamedTweet.text)){
            var tweetText = "Hi @" + streamedTweet.user.screen_name + ". give me a moment... as I flood the timeline...";
            var handles = tokenizer.getHandles(streamedTweet.text, config.get("twitter.handle"));
            if(handles.length > 1) {
                tweetText = "Hello @" + streamedTweet.user.screen_name + ". Please ask me about one user account at a time. Or visit " + config.get("server.url") + " for more details.";
            } else if (tokenizer.isBotIdentified(handles[0], botData)) {
                // TODO: Reply to the tweet... with verdict of if something is a bot or not...
                // TODO: Integrate the botometer stuff...
                tweetText = "Hello @" + streamedTweet.user.screen_name + ". Based on the account behavour @" + handles[0] + " appears to be a bot or sock puppet. Visit " + config.get("server.url") + "/search?query=" + handles[0] + " for more details.";
            } else {
                tweetText = "Sho @" + streamedTweet.user.screen_name + ". That account hasn't been flagged in our database. Visit " + config.get("server.url") + " for more details.";
            }
            var newTweet = {
                in_reply_to_user_id: streamedTweet.user.id_str, 
                in_reply_to_status_id: streamedTweet.id_str, 
                status: tweetText
            };
            client.post('statuses/update', newTweet)
            .then(function (tweet) {
                console.log("Tweet successfully sent...");
                console.log(tweet);
            })
            .catch(function (error) {
                console.error("Error posting: ", error)
            })
        }
        
    });
   
    stream.on('error', function(error) {
        console.error("Error streaming: ", error);
    });
});