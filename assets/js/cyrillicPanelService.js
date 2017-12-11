var currentKeyCode = 0;
var caretPosition;

// function which return code of triggered event
function getCode(event) {
	var code = event.keyCode ? event.keyCode : event.which;
	return code;
}

// get char after press on button action
function getChar(event){
	var code = getCode(event);
	var actualChar = String.fromCharCode(code);
	return actualChar;
}

function setCurrentKeyCode(event) {
	currentKeyCode = getCode(event);
	caretPosition=getCaretPosition();
	
}



function testKey(event) {
	var keyTester = document.getElementById('keyTester');
	keyTester.innerHTML = "";
	var label = document.getElementById('keyLabel');
	var actualKey = getChar(event || window.event);
	keyTester.innerHTML = actualKey;
	keyTester.innerHTML += " | "+ currentKeyCode  +" | ";
	label.textContent = isTheKeyCodeAvailable();
	return false;
}

function insertCyrillicLetter(event)
{
	var cyrillicText = document.getElementById('cyrillicText');
	setCapsLock(event);
	
	var k=0;
	if (event.altKey) {
		k=1; //it will point to the first element assigned to keyss
	}
	// if ctrl is down don't insert letter
	else if (event.ctrlKey){
		return true;
	}
	else
		down = {};

	var cyrillicKey = '';
	var actualKey = getChar(event || window.event);
	
	
	if (isTheKeyCodeAvailable(currentKeyCode))
	{
		if (actualKey == ' '){
			cyrillicKey = ' ';
		} else if (String.charCodeAt(actualKey)>=48 && String.charCodeAt(actualKey)<=57){
			// if actualKey is a digit
			cyrillicKey = actualKey;
		} else {
			if (!isKeyssAvailable(actualKey))
				cyrillicKey="";
			else if (k==1 && keyss[actualKey.toUpperCase()].length < 2) //to this key+alt is not assigned cyrillic char
				cyrillicKey="";
			else if (specialCharactersWithoutShift.indexOf(actualKey)!=-1 && isCapsOn)
				cyrillicKey = keyss[actualKey.toUpperCase()][k].upper;	
			else if (specialCharactersActiveWithShift.indexOf(actualKey) != -1)
				cyrillicKey = keyss[actualKey.toUpperCase()][k].upper;	
			else if (actualKey.toUpperCase() == actualKey  && actualKey != actualKey.toLowerCase())
				cyrillicKey = keyss[actualKey.toUpperCase()][k].upper;	
			else if (isCapsOn)
				cyrillicKey = keyss[actualKey.toUpperCase()][k].upper;	
			else 
				cyrillicKey = keyss[actualKey.toUpperCase()][k].lower;
		}

		var cursorPosition = getCaretPosition();

		if(cyrillicText.textContent.length == 0){
			if (cyrillicKey == " ")
				insertLetterAsNodeAndMoveCursor(cyrillicKey);

			insertLetterAsNodeAndMoveCursor(cyrillicKey);
			return false;
		}

		insertLetterAsNodeAndMoveCursor(cyrillicKey);

		return false;
	}
	else if (isItUnwrittenKeyCode(currentKeyCode)){
		return true;
	}
	return false;
	// transcriptCyrillicToLatin();
}

function createSpan(className, text) {
	var span = document.createElement('span');
	span.className = className;
	span.appendChild(document.createTextNode(text));
	span.normalize();
	return span;
}


function insertLetterAsNodeAndMoveCursor(letter) {
	var pos = getCaretPosition();
	if (cyrillicText.textContent == "") {
		var newSpan = createSpan(getCurWordClassName(), letter);
		window.getSelection().getRangeAt(0).insertNode(newSpan);
	}
	else if (getPrevChar() == " " && letter != " "){
		var newSpan = createSpan(getCurWordClassName(), letter);
		window.getSelection().getRangeAt(0).insertNode(newSpan);	
	}
	else {
		var target = document.createTextNode(letter);
		document.getSelection().getRangeAt(0).insertNode(target);
		document.getElementById('cyrillicText').innerHTML = document.getElementById('cyrillicText').innerHTML;	
	}
	var letterLen = letter.length; // in case of sending more than one char as param we need to check that and move cursor equivalently
	var newPos = pos + letterLen;
	setCaretPosition(newPos);
}

function removeCharAt(str, index)
{
	if (index > str.length-1) return str;
	return str.substr(0,index-1)+str.substr(index);
}

function changeCharAt(str, index, chr)
{
	return str.substr(0,index-1)+chr+str.substr(index);
}

function insertCharAt(str, index, chr)
{
	return str.substr(0,index)+chr+str.substr(index);
}
//function changing the letter into textarea after click on the button
function addLetter(character)
{
	document.getElementById("cyrillicText").textContent+=character;
}


function extractLettersAndEnterFromInnerHTML()
{
	var cyrillicInnerHTML = document.getElementById("cyrillicText").innerHTML;
	return cyrillicInnerHTML.replace(/<span[^>]+>|<\/span>|&nbsp/g, "");
}