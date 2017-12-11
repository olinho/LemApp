
function cmdButtonsActions() {
	var element = $("#copyall");
	actionForButton(element, 'copy');
	element = $("#undo");
	actionForButton(element, 'undo');
	element = $("#redo");
	actionForButton(element, 'redo');
	selectAllAction();
	clearAllAction();
}


jQuery.fn.selectText = function(){
  var element = this[0];  // this[0] means element for which we called this function ex. $('#myEl').selectText(); -> this[0] = $('#myEl');
  if (document.body.createTextRange) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
  } else if (window.getSelection) {
      var selection = window.getSelection();        
      var range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
  }
}

function actionForButton(element, cmd) {
	element.on("click", function(event){
	  $('#cyrillicText').selectText();
	  try {
	    var successful = document.execCommand(cmd);
	    var msg = successful ? 'successful' : 'unsuccessful';
	    console.log(cmd+' action was ' + msg);
	  } catch (err) {
	    console.log('Oops, unable to '+ cmd);
	  }
	  window.getSelection().removeAllRanges(); // deselect the text
	  $('#cyrillicText').focus();
	});
}

function clearAllAction() {
	var element = $("#clear");
	var cyrillicPanel = document.getElementById('cyrillicText');
	element.on("click", function(event){
		cyrillicPanel.innerHTML = "";
		cyrillicPanel.focus();
	});
}

function selectAllAction() {
	var element = $("#selectall");
	var cyrillicPanel = $("#cyrillicText");
	element.on("click", function(event){
		cyrillicPanel.selectText();
		cyrillicPanel.focus();
	});
}

// after press on copyAll button
function copyAllAction() {	
	var element = $("#copyall");
	var cmd = 'copy';
	element.on("click", function(event){
	  $('#cyrillicText').selectText();
	  try {
	    var successful = document.execCommand(cmd);
	    var msg = successful ? 'successful' : 'unsuccessful';
	    console.log('Copying text command was ' + msg);
	  } catch (err) {
	    console.log('Oops, unable to copy');
	  }
	  window.getSelection().removeAllRanges(); // deselect the text
	  $('#cyrillicText').focus();
	});
}

// function that waits until element is loaded
function waitForElementToDisplay(selector, time) {
  if(document.querySelector(selector)!=null) {
    console.log(selector + " is loaded");
    cmdButtonsActions();
    return;
  }
  else {
    setTimeout(function() {
        waitForElementToDisplay(selector, time);
    }, time);
  }
}



// function which changes cyrillic letters into buttons
function fillButtons()
{
	var countOfButtons, butt, letter, countOfButtons;
	countOfButtons = Object.keys(chars).length;
	for (i=0; i<countOfButtons; i++)
	{
		// we use function that allows get element from array indexed non numerically, like 'chars' array defined below
		nonNumericIndexOfButton = Object.keys(chars)[i];  // for example 'a cyr'
		if (document.getElementsByName(nonNumericIndexOfButton).length == 0)
			continue;

		butt = document.getElementsByName(nonNumericIndexOfButton)[0];

		letter = chars[nonNumericIndexOfButton].lower;
		butt.innerHTML = letter;

		butt.onclick = insertCyrillicLetterAfterClickOnButton;
		//butt.addEventListener("click", function(){loadTranslationjQuery(getCurrentWord());}, false);
		// surround word by span and return caret pos to suitable position
		butt.addEventListener("click", function(){curpos=getCaretPositionInDiv();
		//surroundWordBySpan(getCurrentWord());
		setCaretPositionInDiv(curpos);
	}, false);
	}
}

// insert letter in cyrillicText div after click on button
function insertCyrillicLetterAfterClickOnButton(event)
{
	var cyrillicKey = this.innerHTML;
	var cyrillicText = document.getElementById('cyrillicText');
	if(cyrillicText.textContent.length == 0){
		cyrillicText.textContent = cyrillicKey;
		transcriptCyrillicToLatin();
		return false;
	}

	var cursorPosition = getCaretPositionInDiv(cyrillicText);
	// var newStr = insertCharAt(cyrillicText.textContent, cursorPosition, cyrillicKey);
	var target = document.createTextNode(cyrillicKey);
	document.getSelection().getRangeAt(0).insertNode(target);

	// cyrillicText.textContent = newStr;
	
	transcriptCyrillicToLatin(); // additional function
	setCaretPositionInDiv(cyrillicText, cursorPosition+cyrillicKey.length);
	cyrillicText.focus();
	updateSpanService();
	loadTranslationjQuery();
	return false;
}

// function which change letter to small or big when shift isn't or is pressed
function actionOnShift() {
	window.onkeydown = function (e)
	{
		var code = e.keyCode ? e.keyCode : e.which;

		// action on shift down
		if(code == 16)
			setUpperCase();
	}

	window.onkeyup = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;

		// action on shift up
		if(code == 16)
			setLowerCase();
	}
}
function actionOnShiftOrAlt() {
	window.onkeydown = function (e)
	{
		var code = e.keyCode ? e.keyCode : e.which;
		if(!e.altKey) 
			setLowerCase();
		// action on shift down
		if (code == 16)
			if (e.altKey)
				setAltSetOfUpperLetters();	
			else
				setUpperCase();
		// left and right alt vary value of e.which
		else if(code == 18 && e.which == 18) {
			
			if (e.shiftKey)
				setAltSetOfUpperLetters();	
			else 
				setAltSetOfLowerLetters();
		}
	}

	window.onkeyup = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;

		// action on shift up
		if(code == 16)
			if (e.altKey)
				setAltSetOfLowerLetters();
			else
				setLowerCase();
		// left and right alt vary value of e.which
		else if(code == 17 && e.which == 17) {
			setLowerCase();
		}
	}
}


// function changing letter on button to lower case
function setLowerCase()
{
	var countOfButtons, butt, nonNumericIndexOfButton;
	
	countOfButtons = Object.keys(chars).length;
	for (i=0; i<countOfButtons; i++)
	{
		// we use function that allows get element from array indexed non numerically, like 'chars' array defined below
		nonNumericIndexOfButton = Object.keys(chars)[i];  // for example 'a cyr'

		// if we can't find this element then go to next element
		if (document.getElementsByName(nonNumericIndexOfButton).length == 0)
			continue;

		butt = document.getElementsByName(nonNumericIndexOfButton)[0];

		butt.innerHTML = chars[nonNumericIndexOfButton].lower;
	}
}

// function activated after click on shift
// this function change letters on button to uppercase
function setUpperCase()
{
	var butt, nonNumericIndexOfButton, countOfButtons;
	
	countOfButtons = Object.keys(chars).length;
	for (i=0; i<countOfButtons; i++)
	{
		// we use function that allows get element from array indexed non numerically, like 'chars' array defined below
		nonNumericIndexOfButton = Object.keys(chars)[i];  // for example 'a cyr'
		if (document.getElementsByName(nonNumericIndexOfButton).length == 0)
			continue;

		butt = document.getElementsByName(nonNumericIndexOfButton)[0];
		if (typeof chars[nonNumericIndexOfButton].upper != "undefined")
		{
			butt.innerHTML = chars[nonNumericIndexOfButton].upper;	
		}
		else butt.innerHTML = chars[nonNumericIndexOfButton].lower;
	}
}

function setAltSetOfUpperLetters() {
	setAltSetOfLetters("upper");
}

function setAltSetOfLowerLetters() {
	setAltSetOfLetters("lower");
}

// arg typeOfSet can be "upper" or "lower"
function setAltSetOfLetters(typeOfSet) 
{
	var butt, nonNumericIndexOfButton, countOfButtons;
	
	countOfButtons = Object.keys(chars).length;
	for (i=0; i<countOfButtons; i++)
	{
		// we use function that allows get element from array indexed non numerically, like 'chars' array defined below
		nonNumericIndexOfButton = Object.keys(chars)[i];  // for example 'a cyr'
		if (document.getElementsByName(nonNumericIndexOfButton).length == 0)
			continue;
		
		butt = document.getElementsByName(nonNumericIndexOfButton)[0];
		if (typeof chars[nonNumericIndexOfButton].lower != "undefined")
		{
			var keyssParam = keyssFromChars(nonNumericIndexOfButton);
			if (typeof keyss[keyssParam] === "undefined") {
				butt.innerHTML = "";
				continue;
			}
			if (keyss[keyssParam].length == 2) {
				var charsElement = keyss[keyssParam][1];
				if (typeOfSet == "upper")
					butt.innerHTML = charsElement.upper;
				else 
					butt.innerHTML = charsElement.lower;
			}
			else {
				butt.innerHTML = "";	
			}
		}
		else butt.innerHTML = "";
	}
}
