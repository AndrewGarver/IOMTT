// X Need a function to generate random pattern and store into variable 
//   for checking against player, adding to pattern by one each time
// X Take that variable and use it to fire lights on UI
// X Then needs to wait for player to input pattern, checking as they go,
//   alerting game over if wrong button is pressed
// X If player does not press anything wrong, computer should repeat cycle.


var choices = ["green", "red", "yellow", "blue"];
var counter = 0;
var computerPattern = [];
var playerPattern = [];

//generates computer pattern

var generatePattern = function() {
	for (var i = 0; i < counter; i++) {
		computerPattern.push(choices[Math.floor(Math.random()*4)]);
	}
}





//player turn and check against computer pattern
//intitialized in the function below

var playerTurn = function() {
	var correct = true;
	var x = 0;
	var playerClick = function(event) {
			playerPattern[x] = event.target.id;
			correct = (playerPattern[x] === computerPattern[x]);
			if (x < counter && correct === true) {
				x += 1;
				if (x === counter && correct === true) {
				$(".color").off('click', playerClick);
				playGame();
				}
			}
			else {
				$(".color").off('click', playerClick);
				window.alert("You Lose")
				counter = 0;
				window.alert("Play Again?");
				playGame();
			}
		}

		$(".color").on('click', playerClick);

}



//Plays back computer pattern and then initializes player turn after
//playback is finished

var computerPlaybackAndStartPlayerTurn = function() {
	for (var i = 0; i < computerPattern.length; i++) {
		(function(n){
       window.setTimeout(function(){
        var $colorToFlash = $("."+computerPattern[n]);
				$colorToFlash.toggleClass("flash"+computerPattern[n]);
      }, (n * 500));
       window.setTimeout(function(){
        var $colorToFlash = $("."+computerPattern[n]);
				$colorToFlash.toggleClass("flash"+computerPattern[n]);
      }, (n * 500) + 250);
		})(i)
	}
	window.setTimeout(playerTurn, (counter * 500));
}



var playGame = function() {
	counter += 1;
	computerPattern = [];
	playerPattern = [];
	generatePattern();
	computerPlaybackAndStartPlayerTurn();
}

var initialPlay = function() {
	window.alert("Ready?");
	playGame();
}

window.onload = initialPlay;







