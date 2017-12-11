var r;
var wasShift = false;
var wasAlt = false;
var wasCtrl = false;

window.onload =  function(event)
{
	init(event);
}

function init(event) {
	var cyrillicText = document.getElementById('cyrillicText');
	cyrillicText.onkeypress = insertLetterAndTranscriptToLatin;
	cyrillicText.onkeydown = setCurrentKeyCode;
	cyrillicText.onkeyup = actionOnKeyUpInCyrillicTextPanel;
	cyrillicText.onmouseup = actionOnMouseUpInCyrillicTextPanel;
	
	// var keyTester = document.getElementById('keyTester');
	cyrillicText.focus();
	// keyTester.onkeydown=setCurrentKeyCode;
	// keyTester.onkeypress=testKey;

	
	waitForElementToDisplay("#copyall", 10);
	setTimeout(function() {
        fillButtons();
        actionOnShiftOrAlt();
    }, 1000);
    // actionOnShift(); // change letters in keyboard to small or big
	r = cyrillicText;
	cyrillicText.focus();
	setPrompterPositionListener();

	setInterval(function(){
		var textAreaWithInner = document.getElementById('textAreaWithInner');
		textAreaWithInner.textContent = r.innerHTML;
	}, 500);
}


$(document).on('keyup keydown', function (e){
	
	var code = getCode(e);

	// Caps lock
	if(code == 20){
		alert('Caps');
		isCapsOn = !isCapsOn;
	}
	// F5
	else if (code == 116){
		location.reload(true);
	}
	else if (code == 9){
		var cyrillicPanel = $("#cyrillicText");
		if (document.getElementById('cyrillicText') !== document.activeElement) {
			document.getElementById('cyrillicText').focus();
		}
	} else if (code == 27 || code == 32){
		$('#prompter').hide();
	}
	else {
		transcriptCyrillicToLatin();
	}

	if (!isPrompterVisible() && !isTheKeyCodeAvailable())
		return;

	if (code != 27 && code != 32) {
		$('#prompter').show();	
	}
});


$(document).on('keydown', function (e){
	var code = e.keyCode ? e.keyCode : e.which;
	// we try to detect if user click arrow up/down to choose word - prompt and focus on cyrillicText
	if (code == 38 && $("#cyrillicText").is(":focus") && isPrompterVisible()) {
		selectRowAbove();
	}
	else if (code == 40 && $("#cyrillicText").is(":focus") && isPrompterVisible()) {
		selectRowBelow();
	}
});



// Two functions packed into one
// Inserting cyrillic letter into cyrillicTextPanel
// And then making transcription and insert result into latinTextPanel
// wrap words in cyrillicTextPanel by span
function insertLetterAndTranscriptToLatin(event) {
	var textAreaWithInner = document.getElementById('textAreaWithInner');
	textAreaWithInner.textContent = r.innerHTML;

	var boolVal = insertCyrillicLetter(event);
	if (boolVal == false) {
		updateListOfHintsInPrompterPanel();
		// loadTranslationjQuery();	

	}
	else {
		if ( isPrompterVisible()) {
		 	if (currentKeyCode == 38 || currentKeyCode == 40) { //up or down arrow
				boolVal = false;
			}
			else if (currentKeyCode == 13) {
				 // insert additional space
				var curWordLen = getCurrentWordSpanText().length;
				var startStr = getCurrentWordSpanText();
				var endStr = clearTextFromSpaces($(".selected-word").text()).substr(curWordLen);
				var choosenWord = startStr+endStr;
				insertChoosenWord(choosenWord);
				$("#promptsSelector").text("");
				$("#prompter").hide();
				boolVal = false;
			}
		}
		// updateSpanService();
	}

	var cyrillicText = document.getElementById('cyrillicText');
	if (cyrillicText.textContent == "" || (cyrillicText.textContent.length == 1  && currentKeyCode == 8)) {
		cyrillicText.innerHTML = "";
		$("#prompter").hide();
	}

	transcriptCyrillicToLatin();
	return boolVal;
}



function actionOnKeyUpInCyrillicTextPanel(event) {

	// SHOW INNER FROM CyrillicTextPanel
	var textAreaWithInner = document.getElementById('textAreaWithInner');
	textAreaWithInner.textContent = r.innerHTML;

	var cyrillicText = document.getElementById('cyrillicText');
	if (cyrillicText.textContent == "") {
		cyrillicText.innerHTML = "";
	}
	//
	if (event.shiftKey || event.altKey || currentKeyCode == 16 || event.ctrlKey) {
		wasCtrl = true;
		wasShift = true;
		wasAlt = true;
		return;
	}

	if (wasShift && !event.shiftKey) {
		wasShift = false;
		return;
	}	
	if (wasAlt && !event.altKey) {
		wasAlt = false;
		return;
	}
	if (wasCtrl && !event.ctrlKey) {
		wasCtrl = false;
		return;
	}

	
	if (currentKeyCode != 13) {
		updateSpanService();
		wordsUpdatingService();
	}

	if (currentKeyCode == 8) { // backspace
		updateListOfHintsInPrompterPanel();
	}

	if (isPrompterVisible() || currentKeyCode == 8){ // backspace
		// updateListOfHintsInPrompterPanel();
		//loadTranslationjQuery();
	}

	if (getNodeWithCurWordClass() == undefined) {
		// $("#prompter").text("");
		$("#prompter").hide();
	}

}


function actionOnMouseUpInCyrillicTextPanel(event)
{
	var text = getSelectedText();
	if (text!='') {
		return;
	}
	updateSpanService();
	wordsUpdatingService();
	
	if (! $("#prompter").is(":visible") && getNodeWithCurWordClass() != undefined){
		$("#prompter").show();
	}
	else if(getNodeWithCurWordClass() == undefined) {
		$("#prompter").hide();
	}
	
	updateListOfHintsInPrompterPanel();
	//loadTranslationjQuery();
}