
module.exports.getHandles = function(tweet, exclude) {
    var handles = [];
    exclude = exclude == null ? "" : exclude.toLowerCase();
    
    var words = tweet.split(/\s/);
    words.forEach(word => {
        if(word.startsWith("@")) {
            handle = word.replace("@", "").split(/\W/)[0];
            if(handle.length > 0 && handle.toLowerCase() != exclude.toLowerCase()) {
                handles.push(handle);
            }
        }
    });
    return handles;
}

// Temp function to find stuff in the list...s
module.exports.isBotIdentified = function(handle, identifiedList) {
    function botIdentified(element) {
        return element["user.screen_name"].toLowerCase() == handle.toLowerCase() && element["Prediction"] == "1"; 
    }
    return identifiedList.find(botIdentified) != null;
}

module.exports.findBot = function(handle, identifiedList) {
    function botIdentified(element) {
        return element["user.screen_name"].toLowerCase() == handle.toLowerCase() && element["Prediction"] == "1"; 
    }
    return identifiedList.find(botIdentified);
}

// TODO: Use a more sophisticated approach...
module.exports.isTextAQuestion = function(text) { // TODO: Pass a tweet instead...
    // TODO: substring to the start of the tweet...
    // display_text_range: [ 19, 129 ]
    var sample = text.toLowerCase();
    return sample.includes("?") || sample.includes("is ");
}