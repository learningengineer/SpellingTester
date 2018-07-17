
 
buzz.defaults.formats = [ 'ogg' ]; //Initializes buzz.js for audio
buzz.defaults.preload = 'metadata'; //Initializes buzz.js for audio
var img = new Image();
img.src = "play.png";


var questions = [	
	{ word: 'abandoned', sound: 'sounds/abandoned' }, 
	{ word: 'acumen', sound: 'sounds/acumen' }, 
	{ word: 'aerodynamic', sound: 'sounds/aerodynamic' }, 
	{ word: 'algorithm', sound: 'sounds/algorithm' },
	{ word: 'analogy', sound: 'sounds/analogy' },
	{ word: 'anonymous', sound: 'sounds/anonymous' }, 
	{ word: 'assessment', sound: 'sounds/assessment' }, 
	{ word: 'bacteria', sound: 'sounds/bacteria' }, 
	{ word: 'biochemical', sound: 'sounds/biochemical' }, 
	{ word: 'browser', sound: 'sounds/browser' }, 
	{ word: 'cadence', sound: 'sounds/cadence' }, 
	{ word: 'canonized', sound: 'sounds/canonized' }, //no audio
	{ word: 'carbohydrates', sound: 'sounds/carbohydrates' }, 
	{ word: 'carpe diem', sound: 'sounds/carpediem' }, 
	{ word: 'chromosomes', sound: 'sounds/chromosomes' }, 
	{ word: 'cognitive', sound: 'sounds/cognitive' }, 
	{ word: 'commercial', sound: 'sounds/commercial' }, 
	{ word: 'consciousness', sound: 'sounds/consciousness' }, 
	{ word: 'consequence', sound: 'sounds/consequence' }, 
	{ word: 'culpable', sound: 'sounds/culpable' }

]; /*This is the array for the program.  There is the image file, which is replaying the word and the sentence it appears in.  Then, there is the color of the background.  
Next, is the word that you want the student to spell.  And last, is the location and name of the sound file minus the extension which will be added later */
var games = questions;

var winSound        = new buzz.sound('sounds/win' ), //This variable represents the sound made when you get an answer correct
    errorSound      = new buzz.sound('sounds/error' ), //This variable represents the sound made when you make a mistake
    alphabetSounds  = {}, //This is the variable for the array of sounds used for the names of the letters of the alphabet.
    alphabet        = 'abcdefghijklmnopqrstuvwxyz'.split( '' ), //This is the variable for the array of alphabet letters.
	scoreKK			= 0, //This is the variable for scoring
	ez				= false, //This is the variable used to determine the level--easy or hard
	scoreK,	//Another variable for scoring
	gameSound;  //variable for the Buzz game engine

	NumOfQues = games.length;  //Variable for the number of spelling words or questions available.
	ScoreTotal = NumOfQues * 10; //Variable for the raw score.  Each answer is worth 10 points.
	
var scorm = pipwerks.SCORM; 
var NumOfQues = games.length;  //Variable for the number of spelling words or questions available.
var ScoreTotal = NumOfQues * 10; //Variable for the raw score.  Each answer is worth 10 points.
var PercentTotal; //Variable for determining the percent correct.
var RawTotal; 
var incorrectLetter = 0;
var modelLetter;
var game; 
var numcorrect = 0;



	
	
  window.onbeforeunload = function() {
		RawTotal = numcorrect / games.length;
		console.log(RawTotal);
		var callSucceeded1 = scorm.set("cmi.score.raw", RawTotal);
		console.log("Rawtotal send " + callSucceeded1)
		var callSucceededData = scorm.set("cmi.suspend_data", idx); 
		var callSucceededSave = scorm.save();  
		var callSucceededQuit = scorm.quit();
    return "Are you sure you want to leave this page?";
}
	
	
for( var i in alphabet ) {
    var letter = alphabet[ i ];
    alphabetSounds[ letter ] = new buzz.sound('sounds/kid/'+ letter );  //This loads the alphabet array into the letter variable and the loads the sounds into the alphabetSounds array.  
}

$( function() {
    if ( !buzz.isSupported() ) {  //This line determines if Buzz is supported by the browser, and if it doesn't, it shows a warning.
        $('#warning').show();
    }
	scorm.version = "2004";
	
	
	var callSucceeded = scorm.init();
	
	

	
		
    var idx = 0,
        $container  = $( '#container' ), //This creates and assigns the variables for the div in the index.html file this is attached to.
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' );
		
	var nidx = scorm.get("cmi.suspend_data");
		if (nidx > 0) {
			RawTotal = scorm.get("cmi.score.raw"); 
			idx = nidx; 
			//gameSound.stop();  //stops whatever sound is playing
			$( '#models' ).html( '' ); //empties these div tags in the index.html file
			$( '#letters' ).html( '' );
			incorrectLetter = 0;
			PercentTotal = RawTotal * 50;
			NumOfQues = NumOfQues - idx; 
			numcorrect = idx;
			document.getElementById( "score" ).innerHTML = "Number Correct = " + numcorrect + " | Percent Correct = " + PercentTotal.toFixed(2) + "% | Remaining questions = " + NumOfQues; 
			//buildGame(idx);
		}		
	
    $( '#resets' ).click( function() {   //this sets the ez variable and then changes the text from hard to easy or easy to hard.
      
		refreshGame(); 
		buildGame( idx );
        return false;
    });

	$( '#saves' ).click( function() {   //this sets the ez variable and then changes the text from hard to easy or easy to hard.
		RawTotal = numcorrect / games.length;
		console.log(RawTotal);
		var callSucceeded1 = scorm.set("cmi.score.raw", RawTotal);
		console.log("Rawtotal send " + callSucceeded1)
		//var callSucceeded2 = scorm.set("cmi.completion_status", "incomplete");
		//console.log(callSucceeded2); 
		var callSucceededData = scorm.set("cmi.suspend_data", idx); 
		console.log(idx); 
		console.log("did it send idx data? = " + callSucceededData);
		var callSucceededSave = scorm.save(); 
		console.log(callSucceededSave); 
        return false;
    });
	
	
	
	$( '#closes').click( function() {
		RawTotal = numcorrect / games.length;
		console.log(RawTotal);
		var callSucceeded1 = scorm.set("cmi.score.raw", RawTotal);
		console.log("Rawtotal send " + callSucceeded1)
		var callSucceededData = scorm.set("cmi.suspend_data", idx); 
		var callSucceededSave = scorm.save();  
		var callSucceededQuit = scorm.quit();
		window.top.close();
		
	});
	
    function refreshGame() {  //this is the refresh game function.  
		gameSound.stop();  //stops whatever sound is playing
        $( '#models' ).html( '' ); //empties these div tags in the index.html file
        $( '#letters' ).html( '' );
        incorrectLetter = 0;
    }
	
	
    function buildGame( x ) {  //this is the build game function
		

        game  = games[ idx ]; //sets the game variable to where we are at in the games array
	
	
        if ( x > games.length - 1 ) { //checks the game array to see where the player is at in the array.  This prevents the game from having a negative number of questions. 
            idx = 0;
        }
        if ( x < 0 ) { 
            idx = games.length - 1;
        }
		
		
		scoreK = 0;  //sets the scoreK variable to zero
		
		
        gameSound = new buzz.sound( game.sound ); 
		gameSound.load().play();
		
		

        // Fade the background color
        var gmclr = "#808"+((1<<24)*Math.random()|0).toString(16);
        // Fade the background color
        $( 'body' ).stop().animate({
            backgroundColor: gmclr
        }, 1000);
        
		
		//Updates the score

		//reinserts the image because winGame function removes it.
		document.getElementById("sent").innerHTML = "<img src='"+img.src+"' alt='my image' id='picture'>";

        // Puts the letters of the word into the modelLetters array
        var modelLetters = game.word.split( '' );

        // Appeneds the letters into index.html
		for( var i in modelLetters ) {
            var letter = modelLetters[ i ];
			$models.append( '<li>' + letter + '</li>' ); 
        }
		
		//Sets the letterWidth variable to the outWidth of the models combined
        var letterWidth = $models.find( 'li' ).outerWidth( true );
		//Centers the models and the letters in the approximate middle of the web page.  
        $models.width( letterWidth * $models.find( 'li' ).length + 19 );

        // Build shuffled letters
		
		var letters = game.word.split('');
		//This adds extra letters if the game is set to hard using the most common letters
		if ( ez == false ) {
            letters.push('a','e','i','s','h','o','u');
			
        }
		//Shuffles the letters in a random pile
		var shuffled = letters.sort( function() { return Math.random() < 0.5 ? -1 : 1 });
		//Places the letters into the pile
        for( var i in shuffled ) {
            $letters.append( '<li class="draggable">' + shuffled[ i ] + '</li>' );
        }
		//Assigns values to the variables top and left
        $letters.find( 'li' ).each( function( i ) {
            //if then statement checking if the variable ez is equal to false and if it is, it assigns the variables.
			if (ez == false) {
				var top   = ( $models.position().top ) + ( Math.random() * 200 ) + 80,
					left  = ( $models.offset().left - $container.offset().left - 10) + ( Math.random() * 20 ) + ( i * letterWidth / 2),  //this line divides by two because of the extra letters added to the more difficult class
					angle = ( Math.random() * 30 ) - 10;		
			} else {
				var top   = ( $models.position().top ) + ( Math.random() * 100 ) + 80,
                left  = ( $models.offset().left - $container.offset().left ) + ( Math.random() * 20 ) + ( i * letterWidth ),
                angle = ( Math.random() * 30 ) - 10;
			
			}
			//Places the letters on the web page
            $( this ).css({
                top:  top  + 'px',
                left: left + 'px'
            }); 
			//rotates the letters so they look randomly placed. 
            rotate( this, angle );
			//If you click on the letter, it identifies the letter with audio using the alphabetSounds array and the letter variable.
            $( this ).mousedown( function() {
				gameSound.stop(); //stops any sound being played
                var letter = $( this ).text();  //assigns the letter variable based on the letter that the user clicks.
                if ( alphabetSounds[ letter ] ) { //checks to make sure that the letter has a value
                    alphabetSounds[ letter ].play(); //plays the audio.  
                }
            });
			
			
        });
		//If the user clicks the picker it plays the audio attached to the gameSound variable
		
		
		
		
		$( '#picture' ).click( function() {
			gameSound.stop();//stops any sound playing
			gameSound.load().play(); //loads and plays the sound
				});
		//Identifies that all the letters are draggable
        $letters.find( 'li.draggable' ).draggable({ 
            zIndex: 9999,
            stack: '#letters li'
        });
		//Identifies that all the models are droppable
        $models.find( 'li' ).droppable( {
            accept:     '.draggable',
            hoverClass: 'hover',
            drop: function( e, ui ) { //Identifies what to do if dropped onto
                	modelLetter      = $( this ).text(), //sets the modelLetter variable to the letter that has been dropped upon
                    droppedLetter = ui.helper.text(); //identifies the letter being dropped 
				
                if ( modelLetter == droppedLetter ) { //checks to see if the two variables or letters are a match and if they are continues on.
                    ui.draggable.animate( {  //drops the letter and removes the ability to drag it.
                        top:     $( this ).position().top,
                        left:     $( this ).position().left
                    } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true );
                    //rotates the letter so that it is straight
                    rotate( ui.draggable, 0 );
                    
                    scoreK++; //Adds one to the scoreK++ variable
                    //checks to see if the scoreK variable is equal to the modelLetters variable length.  If it is true it means that all the letters in the word are a match, and the user wins
                    console.log(scoreK)
                    console.log(game.word.length)
                    if ( scoreK == game.word.length ) {
                        if (incorrectLetter > 0) {
                        	console.log(incorrectLetter);
                        	loseGame();
                        } else { winGame(); } //run the winGame function
                    }    
                } else if (modelLetter != droppedLetter) {
                	scoreK++ //if it doesn't match do this
                	incorrectLetter++
                	console.log(incorrectLetter);
					ui.draggable.animate( {  //drops the letter and removes the ability to drag it.
                        top:     $( this ).position().top,
                        left:     $( this ).position().left
                    } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true );
                    //rotates the letter so that it is straight
                    rotate( ui.draggable, 0 );
					if ( scoreK == game.word.length ) {
						if (incorrectLetter > 0) {
                        loseGame();
                        }
                    }
					
                }
            }
        });
    }
	function loseGame() {
			//scoreKK = (incorrectLetter - game.word.length) / 10; //subtracts 10 from the score
			PercentTotal = (numcorrect / games.length) * 100; //sets the percent score
			//Adds the changes to the document
			document.getElementById("sent").style.textAlign = "center";
			document.getElementById( "sent" ).innerHTML = '<font style="color:red;  font-size:1em;"></br>Incorrect +10</font>'; 
			//Plays the error boing sound
			errorSound.play();
			nextWord();
		
		
	}
	
	//This function plays when all the letters match
    function winGame() {
    	numcorrect++
		winSound.play(); //plays the win sound which is Chris Hardwick saying points.
		document.getElementById("sent").style.textAlign = "center";
		document.getElementById( "sent" ).innerHTML = '<font style="color:#00FF00;  font-size:1em;"></br>Correct</font>'; 
		nextWord();
	} 
	
	function nextWord() {
		NumOfQues = NumOfQues - 1; //substracts one from the total number of questions
		//Asks if the number of question is greater than 1, and if so sets the score
		if ( NumOfQues < 1) {  
			PercentTotal = (numcorrect / games.length) * 100;
			document.getElementById( "score" ).innerHTML = "Number Correct = " + numcorrect + " | Percent Correct = " + PercentTotal.toFixed(2) + "% | Remaining questions = " + NumOfQues; 
			document.getElementById("sent").style.textAlign = "center";
			document.getElementById( "sent" ).innerHTML = '<font style="color:#00FF00; font-size:1em;"></br>Percent Correct</br></br>' + PercentTotal.toFixed(2) + '%</font>'; 
			//document.getElementById( "previous" ).innerHTML = "";
			//document.getElementById( "next" ).innerHTML = "";
			RawTotal = numcorrect / games.length;
			var callSucceeded = scorm.set("cmi.score.scaled", RawTotal);
			var callSucceeded = scorm.set("cmi.completion_status", "completed");
		} else { //If the number of questions is not greater than one do this. 
			PercentTotal = (numcorrect / games.length) * 100;
			document.getElementById( "score" ).innerHTML = "Number Correct = " + numcorrect + " | Percent Correct = " + PercentTotal.toFixed(2) + "% | Remaining questions = " + NumOfQues; 
			//drops all the letters down away from the model frames
			$( '#letters li' ).each( function( i ) {
				var $$ = $( this );
				setTimeout( function() {
					$$.animate({
						top:'+=60px'
					});
				}, i * 300 );
			});
			//this is a timeout function for generating the next set of letters--set to three seconds
			setTimeout( function() {
				refreshGame();
				buildGame( ++idx );
			}, 3000);
		}
		
	}
	//This is the rotate function that is called previously
    function rotate( el, angle ) {
        $( el ).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    buildGame( idx );
});