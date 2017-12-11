var chars=[];
var chars2=[];
var keyss=[];
var isCapsOn = false;
var r;

$(document).on('keyup keydown', function (e){ if (e.which || e.keyCode || e.charCode == 8 ) transcriptCyrillicToLatin();} );
$(document).on('keyup keydown', function (e){ if (e.which || e.keyCode || e.charCode == 46 ) transcriptCyrillicToLatin();} );
$(document).on('keyup keydown', function (e){
	var code = e.keyCode ? e.keyCode : e.which;
	if(code == 20){
		isCapsOn = !isCapsOn;
	}
	else if (code == 27 || code == 32){
		$('#prompter').hide();
	}
});


// set prompter position
function setPrompterPosition(){
	var prompter = $('#prompter');	
	$('#cyrillicText').bind('keyup', function(e){
		{
			var cyrillicTextArea = document.getElementById('cyrillicText');
			var curPos = cyrillicTextArea.selectionStart;
			setCursorPosition(cyrillicTextArea, getStartingPositionOfCurrentWord());
			var pos= $(this).getCaretPosition();
			prompter.css({
				left: this.offsetLeft + pos.left,
				top: this.offsetTop + pos.top + 1
			});
			setCursorPosition(cyrillicTextArea, curPos);
		}
		prompter.show();
	})
}


window.onkeydown = function (e)
{
	var code = e.keyCode ? e.keyCode : e.which;
	if(code == 16)
		setUpperCase();
}

window.onkeyup = function(e)
{
	var code = e.keyCode ? e.keyCode : e.which;
	if(code == 16)
		setLowerCase();
}

window.onload = function()
{
	alert("Let's go");
	document.getElementById('cyrillicText').value='';
	fillButtons();
	document.getElementById('cyrillicText').onkeypress=insertCyrillicLetter;
	setCaretPositionInDiv(document.getElementById('rect'), 10);
	document.getElementById('rect').focus();
	setPrompterPosition();
	r=document.getElementById('rect');
}

function capsCheck(e){ 
	var s = String.fromCharCode( e.which );

	if (s.charCodeAt(0) <= 46 && s.charCodeAt(0) != 20)
		isCapsOn = isCapsOn;
	else if (specialCharactersWithoutShift.indexOf(s)!=-1 && isCapsOn)
		isCapsOn = true;
  else if ( specialCharactersWithoutShift.indexOf(s)==-1 && (s.toUpperCase() === s && !e.shiftKey) || (s.toLowerCase() === s && e.shiftKey) ) 
  	isCapsOn = true; 	   
	else 
		isCapsOn = false;
}

function insertCyrillicLetter(event)
{
	capsCheck(event);
	var cyrillicKey = '';
	var actualKey = getChar(event || window.event);

	// if (actualKey < 'a' || actualKey > 'z')
	// 	return false;
	if (isTheKeyAvailable(actualKey))
	{
		if (actualKey == ' '){
			cyrillicKey = ' ';
		} else if (String.charCodeAt(actualKey)>=48 && String.charCodeAt(actualKey)<=57){
			// if actualKey is a digit
			cyrillicKey = actualKey;
		} else {
			if (specialCharactersWithoutShift.indexOf(actualKey)!=-1 && isCapsOn)
				cyrillicKey = keyss[actualKey.toUpperCase()][0].upper;	
			else if (specialCharactersActiveWithShift.indexOf(actualKey) != -1)
				cyrillicKey = keyss[actualKey.toUpperCase()][0].upper;	
			else if (actualKey.toUpperCase() == actualKey  && actualKey != actualKey.toLowerCase())
				cyrillicKey = keyss[actualKey.toUpperCase()][0].upper;	
			else if (isCapsOn)
				cyrillicKey = keyss[actualKey.toUpperCase()][0].upper;	
			else 
				cyrillicKey = keyss[actualKey.toUpperCase()][0].lower;
		}

		if(this.value.length == 0){
			this.value = cyrillicKey;
			transcriptCyrillicToLatin();
			return false;
		}

		var cursorPosition = this.selectionStart;
		var newStr = insertCharAt(this.value, cursorPosition, cyrillicKey);

		this.value = newStr;

		transcriptCyrillicToLatin(); // additional function
		setCursorPosition(this, cursorPosition+1);
		return false;
	}

	transcriptCyrillicToLatin();
}

function insertCyrillicLetterAfterClickOnButton(event)
{
	var cyrillicKey = this.innerHTML;
	var cyrillicTextArea = document.getElementById('cyrillicText');
	if(cyrillicTextArea.value.length == 0){
		cyrillicTextArea.value = cyrillicKey;
		transcriptCyrillicToLatin();
		return false;
	}

	var cursorPosition = cyrillicTextArea.selectionStart;
	var newStr = insertCharAt(cyrillicTextArea.value, cursorPosition, cyrillicKey);

	cyrillicTextArea.value = newStr;
	
	transcriptCyrillicToLatin(); // additional function
	setCursorPosition(cyrillicTextArea, cursorPosition+1);
	cyrillicTextArea.focus();
	return false;
}



function changeLetterToUpperCase(event){
		var character = getChar(event || window.event);
		this.value = character.toUpperCase();
		return false;
}

// here we check if given key is
function isTheKeyAvailable(key)
{
	if (key.charCodeAt(0) == 46) // delete key
		return false;
	if (availableKeys.indexOf(key) != -1) {
		return true;
	} else if (/[0-9A-Za-z]+/.test(key)){
		return true;
	}
	return false;
}

var availableKeys= [
	';','\'','\=','\,','\.',' ','[',']','\\', '{', '}', '|', ':', '\"', '<', '>', '+'
];

var specialCharactersActiveWithShift = [
	'{', '}', '|', ':', '\"', '+'
];

var specialCharactersWithoutShift = [
	';','\'','\=','\,','\.','[',']', '\\'
];


function getChar(event){
	var code = event.keyCode ? event.keyCode : event.which;
	var actualChar = String.fromCharCode(code);
	return actualChar;
}

function removeLatinLetter(e)
{
	var cyrillicTextArea = document.getElementById('cyrillicText');
	var cursorPosition = cyrillicTextArea.selectionStart;
	removeCharAt(cyrillicTextArea.value, cursorPosition);
}


function insertCyrillicLetter2(e)
{
	var cyrillicTextArea = document.getElementById('cyrillicText');
	
	cyrillicTextArea.value = cyrillicTextArea.value.replace(/[a-z]/gi, function changeToCyrillic(l){return keyss[l.toUpperCase()][0].lower;});
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
	}
}

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

function command(cmdName)
{
	if (cmdName == 'ClearAll')
	{
		document.getElementById('cyrillicText').value = '';
		document.getElementById('latinText').readOnly = false;
		document.getElementById('latinText').value = '';
		document.getElementById('latinText').readOnly = true;
		document.getElementById('cyrillicText').focus();
	}
	else if (cmdName == 'Undo')
	{

	}
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
	document.getElementById("cyrillicText").value+=character;
}


//this function returns all available cyrillic chars - upper case and lower case
function getAvailableCyrillicChars()
{
	var list = new Array();
	var a = '';
	for (var item in Object.keys(chars)) {
		if (Object.keys(chars).hasOwnProperty(item)){
			a = Object.keys(chars)[item];
		}
		
	 	list.push(chars[a].lower);
	 	
	 	if (chars[a].upper!==undefined) list.push(chars[a].upper);
	}

	return list;
}

function transcriptCyrillicToLatin()
{
	var cyrillicText = document.getElementById('cyrillicText').value;
	var latinText = '';
	var prevChar = '';
	var myagkiyZnak = chars['myagkiy znak cyr'].lower;
	var currentChar = '';

	for (var item in cyrillicText)
	{
		if (cyrillicText.hasOwnProperty(item))
			currentChar = cyrillicText[item];
		
		if (item > 0)
			prevChar = cyrillicText[item-1];

		if (currentChar == " "){
			latinText+=" ";
		} else if (String.charCodeAt(currentChar)>=48 && String.charCodeAt(currentChar)<=57){
			latinText+=currentChar;
		} else {
			if (prevChar == ''){
				latinText+=getLatinEquivalentToCyrillic2(currentChar);	
			}
			else if (currentChar == myagkiyZnak){
				if (softCyrillicChars.indexOf(prevChar) != -1){
					latinText = latinText.slice(0,-1) + chars2[prevChar].extended;
				}
			}
			else if (doubleCyrillicChars.indexOf(currentChar) != -1){
				if (softCyrillicChars.indexOf(prevChar) != -1){
					latinText = latinText.slice(0,-1) + chars2[prevChar].diextended + chars2[currentChar].extended;
				}
				else
					latinText+=getLatinEquivalentToCyrillic2(currentChar);		
			}
			else if (softingCyrillicChars.indexOf(currentChar) != -1){
				if (chars2[prevChar].base == 'ł' || chars2[prevChar].base == 'Ł'){
					latinText = latinText.slice(0,-1) + chars2[prevChar].extended + getLatinEquivalentToCyrillic2(currentChar);
				} 
				else
					latinText+=getLatinEquivalentToCyrillic2(currentChar);
			}
			else
				latinText+=getLatinEquivalentToCyrillic2(currentChar);	
		}
		
	}
	// alert(latinText);
	document.getElementById('latinText').value = latinText;
}

function getLatinEquivalentToCyrillic2(cyrillicChar)
{
	var a = '';
	if (chars2[cyrillicChar] != undefined)
		return (chars2[cyrillicChar].base != undefined ? chars2[cyrillicChar].base : '');
	else 
		return cyrillicChar;
}

function getLatinEquivalentToCyrillic(cyrillicChar)
{
	var a = '';
	for (var item in Object.keys(keyss)){
		if (Object.keys(keyss).hasOwnProperty(item)){
			a = Object.keys(keyss)[item];
		}
		if (keyss[a][0].lower == cyrillicChar){
		 return a.toLowerCase();
		} else if (keyss[a][0].upper == cyrillicChar){
			return a;
		} 
	}
	// if input char doesn't exist in list of cyrillic chars then return input char
	return cyrillicChar;
}


function setPositionForPrompter()
{
	var cyrillicTextArea = document.getElementById('cyrillicText');
	var curPos = cyrillicTextArea.selectionStart;
	cyrillicTextArea.selectionStart = getStartingPositionOfCurrentWord();
	
	setCursorPosition(cyrillicTextArea, curPos);
}


function getCurrentWordInDiv(editableDiv) {
	var firstPos = getStartingPositionOfCurrentWordInDiv(editableDiv);
	var lastPos = getLastPositionOfCurrentWordInDiv(editableDiv);

	return editableDiv.textContent.substr(firstPos, lastPos-firstPos);
}


function getCurrentWord(){
	var cyrillicTextArea = document.getElementById('cyrillicText');
	var firstPos = getStartingPositionOfCurrentWord();
	var lastPos = getLastPositionOfCurrentWord();

	return cyrillicTextArea.value.substr(firstPos, lastPos-firstPos);
}



// function returning positon of the last letter in the word where the caret is located
function getLastPositionOfCurrentWordInDiv(editableDiv) {
	var caretPos = getCaretPositionInDiv(editableDiv);
	var curLetter = getCharAtPosInDiv(editableDiv, caretPos);
	var curPos = caretPos;
	var textLen = editableDiv.textContent.length;

	do {
		curPos = curPos+1;
		curLetter	= getCharAtPosInDiv(editableDiv, curPos);

	} while (curLetter != ' ' && curPos < textLen);
	return curPos<textLen ? curPos:curPos-1;
}

function getLastPositionOfCurrentWord()
{
	var cyrillicTextArea = document.getElementById('cyrillicText');
	var cyrillicText = cyrillicTextArea.value;
	var curPos = cyrillicTextArea.selectionStart;
	var startingPos = curPos;
	var lastPos = cyrillicText.length-1;

	if (curPos >= lastPos)
		return cyrillicText.length;
	while (cyrillicText.charAt(curPos) != ' '){
		if (curPos >= lastPos){
			setCursorPosition(cyrillicTextArea, startingPos);
			return cyrillicText.length;
		}
		setCursorPosition(cyrillicTextArea, curPos+1);
		curPos = cyrillicTextArea.selectionStart;
	}
	setCursorPosition(cyrillicTextArea, startingPos);
	return curPos;
}

// function which returns starting position of word in which is cursor
function getStartingPositionOfCurrentWord()
{
	var cyrillicTextArea = document.getElementById('cyrillicText');
	var cyrillicText = cyrillicTextArea.value;
	var curPos = cyrillicTextArea.selectionStart;
	var startingPos = curPos;
	if (curPos == 0)
		return 0;
	while (cyrillicText.charAt(curPos-1) != ' '){
		if (curPos == 1){
			setCursorPosition(cyrillicTextArea, startingPos);
			return 0;
		}
		setCursorPosition(cyrillicTextArea, curPos-1);
		curPos = cyrillicTextArea.selectionStart;
	}
	setCursorPosition(cyrillicTextArea, startingPos);
	return curPos;
}

function loadTranslationjQuery(str) 
{
	var curWord = getCurrentWord();
	$.ajax({
		type: "GET",
		url: "getLemkoWord.php?q="+curWord,
		data: "call=getLemkoWord",
		dataType: "text",
		success: function(response){
			var textArea = document.getElementById('cyrillicText');
			var select = document.getElementById('promptsSelector');
			setPositionForPrompter();
			select.innerHTML=response.replace("ok","");	
			if (response.slice(-4).indexOf("ok") > -1){
				// textArea.style.color='black';
				// textArea.style.textDecoration="none";
			} else {
				// textArea.style.color='grey';
				var re = new RegExp("m", "g");
				// document.getElementById('cyrillicText').value = document.getElementById('cyrillicText').value.replace(re, "<span style='text-decoration: underline;'>" + "Janek" + "</span>");
			}
			document.getElementById("txtHint").innerHTML=response;
		}
	});
}


chars2['\u0430'] = {base: 'a'};
chars2['\u0431'] = {base: 'b'};
chars2['\u0432'] = {base: 'w'};
chars2['\u0433'] = {base: 'h'};
chars2['\u0491'] = {base: 'g'};
chars2['\u0434'] = {base: 'd'};
chars2['\u0435'] = {base: 'e'};
chars2['\u0451'] = {base: 'jo'};
chars2['\u0436'] = {base: 'ż'};
chars2['\u0437'] = {base: 'z', extended: 'z', diextended: 'z'};
chars2['\u0438'] = {base: 'i'};
chars2['\u0439'] = {base: 'j'};
chars2['\u043A'] = {base: 'k'};
chars2['\u043B'] = {base: 'ł', extended: 'l', diextended: 'l'};
chars2['\u043C'] = {base: 'm'};
chars2['\u043D'] = {base: 'n', extended: 'ń', diextended: "ni"};
chars2['\u043E'] = {base: 'o'};
chars2['\u043F'] = {base: 'p'};
chars2['\u0440'] = {base: 'r'};
chars2['\u0441'] = {base: 's', extended: 'ś', diextended: 'si'};
chars2['\u0442'] = {base: 't'};
chars2['\u0443'] = {base: 'u'};
chars2['\u0444'] = {base: 'f'};
chars2['\u0445'] = {base: 'ch'};
chars2['\u0446'] = {base: 'c', extended: 'ć', diextended: 'ci'};
chars2['\u0447'] = {base: 'cz'};
chars2['\u0448'] = {base: 'sz'};
chars2['\u0449'] = {base: 'szcz'};
chars2['\u044B'] = {base: 'y'};
chars2['\u0454'] = {base: 'je', extended: 'e'};
chars2['\u044E'] = {base: 'ju', extended: 'u'};
chars2['\u044F'] = {base: 'ja', extended: 'a'};
chars2['\u044A'] = {other: 'tvyordy'};
chars2['\u044C'] = {other: 'myagkiy'};

chars2['\u0410'] = { base: 'A'};
chars2['\u0411'] = { base: 'B'};
chars2['\u0412'] = { base: 'W'};
chars2['\u0413'] = { base: 'G'};
chars2['\u0414'] = { base: 'D'};
chars2['\u0415'] = { base: 'E'};
chars2['\u0401'] = { base: 'Jo'};
chars2['\u0416'] = { base: 'Ż'};
chars2['\u0417'] = { base: 'Z', extended: 'Z', diextended: 'Zi'};
chars2['\u0418'] = { base: 'I'};
chars2['\u0419'] = { base: 'J'};
chars2['\u041A'] = { base: 'K'};
chars2['\u041B'] = { base: 'Ł', extended: 'L', diextended: 'L'};
chars2['\u041C'] = { base: 'M'};
chars2['\u041D'] = { base: 'N', extended: 'Ń', diextended: "Ni"};
chars2['\u041E'] = { base: 'O'};
chars2['\u041F'] = { base: 'P'};
chars2['\u0420'] = { base: 'R'};
chars2['\u0421'] = { base: 'S', extended: 'Ś', diextended: "Si"};
chars2['\u0422'] = { base: 'T'};
chars2['\u0423'] = { base: 'U'};
chars2['\u0424'] = { base: 'F'};
chars2['\u0425'] = { base: 'H'};
chars2['\u0426'] = { base: 'C', extended: 'Ć', diextended: "Ci"};
chars2['\u0427'] = { base: 'Cz'};
chars2['\u0428'] = { base: 'Sz'};
chars2['\u0429'] = { base: 'Szcz'};
chars2['\u042B'] = { base: 'Y'};
chars2['\u0404'] = { base: 'Je'};
chars2['\u042E'] = { base: 'Ju'};
chars2['\u042F'] = { base: 'Ja'};
chars2['\u042A'] = { other: 'Tvyordy'};
chars2['\u042C'] = { other: 'Myagkiy'};
chars2[' '] = { base: ' '};

chars['a cyr'] = { lower: '\u0430', upper: '\u0410' };
chars['b cyr'] = { lower: '\u0431', upper: '\u0411' };
chars['v cyr'] = { lower: '\u0432', upper: '\u0412' };
chars['g cyr'] = { lower: '\u0491', upper: '\u0490' };
chars['d cyr'] = { lower: '\u0434', upper: '\u0414' };
chars['e cyr'] = { lower: '\u0435', upper: '\u0415' };
chars['yo cyr'] = { lower: '\u0451', upper: '\u0401' };
chars['zh cyr'] = { lower: '\u0436', upper: '\u0416' };
chars['z cyr'] = { lower: '\u0437', upper: '\u0417' };
chars['i cyr'] = { lower: '\u0438', upper: '\u0418' };
chars['j cyr'] = { lower: '\u0439', upper: '\u0419' };
chars['k cyr'] = { lower: '\u043A', upper: '\u041A' };
chars['l cyr'] = { lower: '\u043B', upper: '\u041B' };
chars['m cyr'] = { lower: '\u043C', upper: '\u041C' };
chars['n cyr'] = { lower: '\u043D', upper: '\u041D' };
chars['o cyr'] = { lower: '\u043E', upper: '\u041E' };
chars['p cyr'] = { lower: '\u043F', upper: '\u041F' };
chars['r cyr'] = { lower: '\u0440', upper: '\u0420' };
chars['s cyr'] = { lower: '\u0441', upper: '\u0421' };
chars['t cyr'] = { lower: '\u0442', upper: '\u0422' };
chars['u cyr'] = { lower: '\u0443', upper: '\u0423' };
chars['f cyr'] = { lower: '\u0444', upper: '\u0424' };
chars['h cyr'] = { lower: '\u0445', upper: '\u0425' };
chars['c cyr'] = { lower: '\u0446', upper: '\u0426' };
chars['ch cyr'] = { lower: '\u0447', upper: '\u0427' };
chars['sh cyr'] = { lower: '\u0448', upper: '\u0428' };
chars['shch cyr'] = { lower: '\u0449', upper: '\u0429' };
chars['tvyordy znak cyr'] = { lower: '\u044A', upper: '\u042A' };
chars['y cyr'] = { lower: '\u044B', upper: '\u042B' };
chars['myagkiy znak cyr'] = { lower: '\u044C', upper: '\u042C' };
chars['ye cyr'] = { lower: '\u0454', upper: '\u0404' };
chars['yu cyr'] = { lower: '\u044E', upper: '\u042E' };
chars['ya cyr'] = { lower: '\u044F', upper: '\u042F' };
chars['<<'] = { lower: '\u00AB' };
chars['>>'] = { lower: '\u00BB' };
chars['dash'] = { lower: '-' };
chars['endash'] = { lower: '\u2013' };
chars['emdash'] = { lower: '\u2014' };
chars['straight quote'] = { lower: '"' };
chars['low quote'] = { lower: '\u201E' };
chars['high inverted quote'] = { lower: '\u201C' };
chars['high quote'] = { lower: '\u201D' };
chars['apostrophe'] = { lower: '\u2019' };
chars['straight apostrophe'] = { lower: '\'' };
chars['comma-semicolon'] = { lower: ',', upper: ';' };
chars['period-colon'] = { lower: '.', upper: ':' };
chars[';'] = { lower: ';' };
chars[':'] = { lower: ':' };
chars['numero sign'] = { lower: '\u2116' };
chars['euro'] = { lower: '\u20AC' };
chars['@'] = { lower: '@' };
chars['+'] = { lower: '+' };
chars['='] = { lower: '=' };
chars['combining acute accent'] = { lower: '\u0301', combChars: 1 };
chars['1'] = { lower: '1' };
chars['2'] = { lower: '2' };
chars['3'] = { lower: '3' };
chars['4'] = { lower: '4' };
chars['5'] = { lower: '5' };
chars['6'] = { lower: '6' };
chars['7'] = { lower: '7' };
chars['8'] = { lower: '8' };
chars['9'] = { lower: '9' };
chars['0'] = { lower: '0' };

keyss['Q'] = [ chars['ya cyr'] ];
keyss['W'] = [ chars['sh cyr'] ];
keyss['E'] = [ chars['e cyr'] ];
keyss['R'] = [ chars['r cyr'] ];
keyss['T'] = [ chars['t cyr'] ];
keyss['Y'] = [ chars['y cyr'] ];
keyss['U'] = [ chars['u cyr'] ];
keyss['I'] = [ chars['i cyr'] ];
keyss['O'] = [ chars['o cyr'] ];
keyss['P'] = [ chars['p cyr'] ];
keyss['['] = [ chars['yu cyr'] ];
keyss['\\'] = [ chars['ye cyr'] ];
keyss[']'] = [ chars['shch cyr'] ];
keyss['\u005C'] = [ chars['ye cyr'] ];
keyss['A'] = [ chars['a cyr'] ];
keyss['S'] = [ chars['s cyr'] ];
keyss['D'] = [ chars['d cyr'] ];
keyss['F'] = [ chars['f cyr'] ];
keyss['G'] = [ chars['g cyr'] ];
keyss['H'] = [ chars['ch cyr'] ];
keyss['J'] = [ chars['j cyr'] ];
keyss['K'] = [ chars['k cyr'] ];
keyss['L'] = [ chars['l cyr'] ];
keyss[';'] = [ chars['myagkiy znak cyr'] ];
keyss['\''] = [ chars['zh cyr'] ];
keyss['Z'] = [ chars['z cyr'] ];
keyss['X'] = [ chars['h cyr'] ];
keyss['C'] = [ chars['c cyr'] ];
keyss['V'] = [ chars['v cyr'] ];
keyss['B'] = [ chars['b cyr'] ];
keyss['N'] = [ chars['n cyr'] ];
keyss['M'] = [ chars['m cyr'] ];
keyss[','] = [ chars[';'] ];
keyss['.'] = [ chars[':'] ];

keyss['Ctrl+E'] = [ chars['e cyr'], chars['yo cyr'] ];
keyss['Ctrl+Z'] = [ chars['zh cyr'] ];
keyss['Ctrl+O'] = [ chars['yo cyr'] ];
keyss['Ctrl+U'] = [ chars['yu cyr'] ];
keyss['Ctrl+W'] = [ chars['shch cyr'] ];
keyss['Ctrl+B'] = [ chars['myagkiy znak cyr'], chars['tvyordy znak cyr'] ];

keyss['`~'] = [ chars['yo cyr'] ];
keyss['-'] = [ chars['dash'], chars['endash'], chars['emdash'] ];
keyss['='] = [ chars['tvyordy znak cyr'] ];
keyss['Ctrl+N'] = [ chars['endash'] ];
keyss['Ctrl+M'] = [ chars['emdash'] ];
keyss['Ctrl+/?'] = keyss['Ctrl+1'] = [ chars['combining acute accent'] ];

keyss['Ctrl+\'"'] = [ chars['apostrophe'] ];
keyss['Ctrl+Shift+\'"'] = [ chars['high inverted quote'], chars['high quote'], chars['straight quote'] ];
keyss['Ctrl+,<'] = [ chars['low quote'] ];
keyss['Ctrl+.>'] = [ chars['high inverted quote'] ];
keyss['Ctrl+Shift+,<'] = [ chars['<<'] ];
keyss['Ctrl+Shift+.>'] = [ chars['>>'] ];                
keyss['Ctrl+2'] = [ chars['@'] ];
keyss['Ctrl+3'] = [ chars['numero sign'] ];
keyss['Ctrl+4'] = [ chars['apostrophe'] ];
keyss['Ctrl+5'] = [ chars['high inverted quote'], chars['high quote'], chars['straight quote'] ];
keyss['Ctrl+6'] = [ chars['endash'], chars['emdash'] ];
keyss['Ctrl+Shift+=+'] = keyss['Ctrl+9'] = [ chars['+'] ];
keyss['Ctrl+=+'] = keyss['Ctrl+0'] = [ chars['='] ];
keyss['Ctrl+-_'] = [ chars['endash'], chars['emdash'] ];
// keyss['\''] = [ chars['apostrophe'], chars['straight apostrophe'] ];
// keyss['"'] = [ chars['high inverted quote'], chars['high quote'], chars['straight quote'] ];
keyss['"'] = [ chars['zh cyr'] ]; 
keyss['{'] = [ chars['yu cyr'] ]; 
keyss['}'] = [ chars['shch cyr'] ];  
keyss['|'] = [ chars['ye cyr'] ];  
keyss[':'] = [ chars['myagkiy znak cyr'] ];  
keyss['+'] = [ chars['tvyordy znak cyr'] ];  
keyss['<'] = [ chars[';'] ];
keyss['>'] = [ chars[':'] ];
keyss['Ctrl+Shift+4'] = [ chars['euro'] ];

// bukwy, kotry możeme zmiakczyty
var softCyrillicChars = [
	chars['c cyr'].lower, chars['c cyr'].upper,
	chars['n cyr'].lower, chars['n cyr'].upper,
	chars['s cyr'].lower, chars['s cyr'].upper,
	chars['z cyr'].lower, chars['z cyr'].upper,
	chars['l cyr'].lower, chars['l cyr'].upper,
];

var doubleCyrillicChars = [
	chars['ya cyr'].lower, chars['ya cyr'].upper,
	chars['yu cyr'].lower, chars['yu cyr'].upper,
	chars['ye cyr'].lower, chars['ye cyr'].upper,
];

// bukwy zmiakczajuczy ł na l
var softingCyrillicChars = [
	chars['i cyr'].lower, chars['i cyr'].upper, 
	chars['e cyr'].lower, chars['e cyr'].upper, 
];

function setCursorPosition(textarea, cursorPosition)
{
	textarea.selectionStart = cursorPosition;
	textarea.selectionEnd = cursorPosition;
}


// function returning starting positon of the word where the caret is located
function getStartingPositionOfCurrentWordInDiv(editableDiv) {
	var caretPos = getCaretPositionInDiv(editableDiv);
	var curLetter = getCharAtPosInDiv(editableDiv, caretPos);
	var curPos = caretPos;

	do {
		curPos = curPos-1;
		curLetter	= getCharAtPosInDiv(editableDiv, curPos);

	} while (curLetter != ' ' && curPos > 0);
	return curPos==0 ? 0:curPos+1;
}

// function returning char at given position in the editableDiv, given as parameter
// pos is indexed from 0
function getCharAtPosInDiv(editableDiv, pos) {
	return editableDiv.innerHTML.charAt(pos);
}

// function that return position of caret in div
function getCaretPositionInDiv(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}


function setCaretPositionInDiv(el, sPos)
{
	/*range = document.createRange();
	range.setStart(el.firstChild, sPos);
	range.setEnd (el.firstChild, sPos);*/
	var charIndex = 0, range = document.createRange();
	range.setStart(el, 0);
	range.collapse(true);
	var nodeStack = [el], node, foundStart = false, stop = false;

	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
			var nextCharIndex = charIndex + node.length;
		if (!foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
			range.setStart(node, sPos - charIndex);
			foundStart = true;
		}
		if (foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
			range.setEnd(node, sPos - charIndex);
			stop = true;
		}
		charIndex = nextCharIndex;
		} else {
			var i = node.childNodes.length;
			while (i--) {
				nodeStack.push(node.childNodes[i]);
			}
		}
	}
	selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
} 