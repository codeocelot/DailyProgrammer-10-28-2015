var fs = require('fs')
var readLine = require('readline');
var Promise = require('bluebird');
var difficulty = 1;
var wordLength;
var win = false;
var attemptsLeft;
var targetWord = '';
var wordBank = [];

var rl = readLine.createInterface({
	input:process.stdin,
	output:process.stdout
});

rl.question("Difficulty? (1-5)",function(response){
	difficulty = +response;
	attemptsLeft = 10-difficulty;
	wordLength = difficulty+2;
	getWords().then(function(words){
		var eligWords = words.filter(function(word){
			return word.length === wordLength;
		});
		for(var i = 0;i<(difficulty*3);i++){
			var index = Math.floor(Math.random()*eligWords.length);
			targetWord = eligWords[index];
			if(wordBank.indexOf(targetWord) != -1){
				i--;
			}
			else{
				wordBank.push(targetWord)
			}
		}
		console.log(wordBank)
		console.log(`Guess? (${attemptsLeft} left)`)
	})
})

rl.prompt();
rl.on('line',function(guess){
	guess = guess.toLowerCase();
	var matches = 0;
	guess.split('').forEach(function(char,i){
		if(char === targetWord[i])
			matches++;
	})

	if(matches === targetWord.length) {
		win = true;
		console.log('you won');
		process.exit();
	}
	else{

		if(attemptsLeft-- === 1){
			console.log('you lost');
			return process.exit();
		}
		console.log(`${matches}/${targetWord.length} correct`)
		console.log(`Guess (${attemptsLeft} left)`)
	}
})

var getWords = exports.getWords = ()=>{
	return new Promise(function(resolve,reject){
		fs.readFile('enable1.txt',function(err,data){
			if(err) reject(err);
			else resolve(data.toString().split('\r\n'));
		})
	})
}
