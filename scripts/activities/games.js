vocabWords = {
	나: "I / Me",
	회사원: "Employee of a company",
	너무: "Too / Very",
	바쁘다: "To be busy",
	우리: "We / Our",
	보통: "Usually / Usual / Regular",
	주말: "Weekend",
	만나다: "To meet",
	영화: "Movie",
	카페: "Cafe",
	매일: "Everyday",
	일찍: "Early",
	일어나다: "To get up / To wake up",
	물: "Water",
	마시다: "To drink",
	세수하다: "To wash your face",
	옷: "Clothes",
	입다: "To wear / To put on (clothes)",
	화장: "Make-up",
	회사: "Company",
};

function typingGame(message) {
	try {
		// Creates Global Typing Game object
		global.typingGame = global.typingGame || {};

		// Checks if waiting to receive input from users
		if (typeof global.typingGame.listenerFlag === "undefined" || !global.typingGame.listenerFlag) {
			endTypingGame(message);
		}

		// Sets flag showing game is in play to true
		global.typingFlag = true;

		// Pulls random word from vocabWords
		max = Object.keys(vocabWords).length;
		seed = Math.floor(Math.random() * Math.floor(max));
		key = Object.keys(vocabWords)[seed];

		if (!global.tgFirstRoundStarted) {
			setTimeout(() => message.channel.send(`So you're professor fasty fast. :smirk:\nWell let's see you type this word in Korean then!`), 1000);
			setTimeout(
				() =>
					message.channel.send("I'll give you the first word in **5**").then((msg) => {
						setTimeout(() => msg.edit("I'll give you the first word in **4**"), 1000);
						setTimeout(() => msg.edit("I'll give you the first word in **3**"), 2000);
						setTimeout(() => msg.edit("I'll give you the first word in **2**"), 3000);
						setTimeout(() => msg.edit("I'll give you the first word in **1**"), 4000);
						setTimeout(() => msg.edit("Quick, type the **Korean** word below!"), 5000);
					}),
				2000
			);

			// Send Korean vocab word to chat
			global.typingGameTimeout = setTimeout(() => {
				message.channel.send(`**${key}** - (${vocabWords[key]})`);
				// 500 ms to approximately account for slight latency
				global.typingGame.startTime = Date.now() + 500;
			}, 7200);
		} else {
			message.channel.send(`**${key}** - (${vocabWords[key]})`);
			global.typingGame.startTime = Date.now() + 500;
		}

		// Sets flag showing first round started to true
		global.tgFirstRoundStarted = true;
		global.typingGameKey = key;
	} catch (error) {
		console.log(error);
		return;
	}
}

function typingGameListener(message, client) {
	global.typingGame.listenerFlag = true;
	try {
		if (message.content === global.typingGameKey) {
			global.typingGameKey = undefined;

			// Creates round counter and increases count
			global.typingGame.roundCount = global.typingGame.roundCount + 1 || 1;

			author = message.author;

			//Creates list of winners
			global.typingGame.winners = global.typingGame.winners || {};

			// Keeps track of how many times a user has won in the round
			global.typingGame.winners[author] = global.typingGame.winners[author] + 1 || 1;

			// Calculates time elapsed
			global.typingGame.endTime = Date.now();
			global.typingGame.elapsed = global.typingGame.endTime - global.typingGame.startTime;
			inSeconds = (global.typingGame.elapsed / 1000).toFixed(2);

			message.channel.send(`Manomanoman, you sure are good at this!\n**${author} won round ${global.typingGame.roundCount}!**\nI wasn't really counting or anything, but it took you **${inSeconds} seconds**.`);

			if (global.typingGame.roundCount < 3) {
				setTimeout(
					() =>
						message.channel.send(`Round ${global.typingGame.roundCount + 1} starts in **5**`).then((msg) => {
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **4**`), 1000);
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **3**`), 2000);
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **2**`), 3000);
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **1**`), 4000);
							setTimeout(() => msg.edit("Quick, type the Korean word below!"), 5000);
							setTimeout(() => typingGame(message), 5000);
						}),
					1000
				);
			} else {
				winners = global.typingGame.winners;
				setTimeout(() => message.channel.send("I'm going to have to bring my A game next time."), 1000);
				setTimeout(() => message.channel.send(`Here are this exercise's **results**:`), 1500);
				Object.keys(winners).forEach((winner) => {
					setTimeout(() => message.channel.send(`${winner}: ${winners[winner]} wins`), 1600);
				});
				// Ends game
				global.typingGame.listenerFlag = false;
				global.typingFlag = false;
				endTypingGame(message);
			}
		}
	} catch (error) {
		console.log(error);
		return;
	}
}

// Ends Typing Game
function endTypingGame(message) {
	if (wroteStopFlag) {
		if (global.typingFlag) {
			message.channel.send('Fine, just don\'t ask me to call you "professor fasty fast" anymore.');
		} else {
			message.channel.send("We weren't doing any exercises, silly.");
		}
	} else if (global.typingFlag) {
		message.channel.send('Okay, let\'s restart the exercise then, "professor fasty fast".');
	}
	clearTimeout(global.typingGameTimeout);
	global.typingGame = {};
	// Sets flag showing game is in play to false
	global.typingFlag = false;
	global.tgFirstRoundStarted = false;
}

module.exports = { typingGame, typingGameListener, endTypingGame };