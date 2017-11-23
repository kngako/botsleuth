var tokenizer = require('./botsleuth-tokenizer.js');
var testString = "Hi, @kpangako. Is @test! a bot?";

console.log("All handles: ", tokenizer.getHandles(testString));

console.log("All @ the things: ", tokenizer.getHandles(" wtw @kpangako rhw w", "kpangako"));

console.log("Is this a question: ", tokenizer.isTextAQuestion("Hello @botsleuth, I wanna know if @kpangako a bot?"));