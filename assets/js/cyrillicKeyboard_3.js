var chars=[];
var chars2=[];
var keyss=[];
var isCapsOn = false;
var r;
var unknownWords = [];
// G means global
var wordsG = [];

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

$(document).on('keydown', function (e){
	var code = e.keyCode ? e.keyCode : e.which;
	// we try to detect if user click arrow up/down to choose word - prompt and focus on cyrillicText
	if (code == 38 && $("#cyrillicText").is(":focus")) {
		selectRowAbove();
	}
	else if (code == 40 && $("#cyrillicText").is(":focus")) {
		selectRowBelow();
	}
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// functions connected with changing prompt word using key up/down

function selectRowBelow() {
	if (!isPrompterVisible())
		return;
	var currTd = $("#promptsTable tr.selected-word");
	if (currTd.next().length > 0)
		currTd.next().addClass('selected-word').siblings().removeClass('selected-word');
	else 
		$("#promptsTable").find("tr:first").addClass('selected-word').siblings().removeClass('selected-word');
}

function selectRowAbove() {
	if (!isPrompterVisible())
		return;
	var currTd = $("#promptsTable tr.selected-word");
	if (currTd.prev().length > 0)
		currTd.prev().addClass('selected-word').siblings().removeClass('selected-word');
	else 
		$("#promptsTable").find("tr:last").addClass('selected-word').siblings().removeClass('selected-word');
}

// hover action  has 2 functions as parameters. First is loaded
// on mouse over element and the second - on mouse outside
function actionOnMouseOverRow(){
	$("#promptsTable tr").hover(function() {
		$(this).addClass('selected-word').siblings().removeClass('selected-word');;
	}, function() {
		$(this).removeClass('selected-word');
	});
}

// check if prompter div is visible
function isPrompterVisible() {
	return $('#prompter').is(":visible")?true:false;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function changeVisibility() {
var cyr=document.getElementById('cyrillicText');
if (cyr.classList.contains('disableDiv')){
		$('#cyrillicText').removeClass('disableDiv').addClass('enableDiv');
  } else {
  	$('#cyrillicText').removeClass('enableDiv').addClass('disableDiv');
  }
}


function highlightTextInDiv(editableDiv, text) {
	regex = new RegExp(text, 'g');
	$(editableDiv).html($(editableDiv).text().replace(regex, '<span>' + text + '</span>'));
}

// set prompter position
function setPrompterPosition(){
	var prompter = $('#prompter');	
	$('#cyrillicText').bind('keyup', function(e){
		{
			var cyrillicText = document.getElementById('cyrillicText');
			var curPos = getCaretPositionInDiv(cyrillicText);
			setCaretPositionInDiv(cyrillicText, getStartingPositionOfCurrentWord(cyrillicText));
			var pos= $(this).getCaretPosition();
			var posLeft = document.getElementsByClassName('curWordClass')[0].offsetLeft;
			var posTop = document.getElementsByClassName('curWordClass')[0].offsetTop;
			prompter.css({
				left: this.offsetLeft + posLeft - 10,
				top: this.offsetTop + posTop + 10
			});
			setCaretPositionInDiv(cyrillicText, curPos);
		}
		prompter.show();
	})
}


// function which return word which is located on given pos
function getWordOnPosition(editableDiv, pos) {
	var curPos = getCaretPositionInDiv(editableDiv);
	setCaretPositionInDiv(editableDiv, pos);
	var word = getCurrentWord();
	setCaretPositionInDiv(editableDiv, curPos);
	return word;
}

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



window.onload = function(e)
{
	alert("рисныця");
	var cyrillicText = document.getElementById('cyrillicText');
	fillButtons();
	cyrillicText.onkeypress=insertCyrillicLetter;
	cyrillicText.focus();
	setPrompterPosition();
	actionOnMouseOverRow();
	r=document.getElementById('cyrillicText');
}

// set caps lock on/off after click on this key
function setCapsLock(e){ 
	var s = String.fromCharCode( e.which );

	if (s.charCodeAt(0) <= 46 && s.charCodeAt(0) != 20)
		isCapsOn = isCapsOn;
	else if (specialCharactersWithoutShift.indexOf(s)!=-1 && isCapsOn)
		isCapsOn = true;
  // else if ( specialCharactersWithoutShift.indexOf(s)==-1 && (s.toUpperCase() === s && !e.shiftKey) || (s.toLowerCase() === s && e.shiftKey) ) 
  // 	isCapsOn = true; 	   
	else 
		isCapsOn = false;
}




function insertCyrillicLetter(event)
{
	setCapsLock(event);
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

		var cursorPosition = getCaretPositionInDiv(this);

		if(this.textContent.length == 0){
			if (cyrillicKey == " ")
				this.innerHTML = cyrillicKey;
			else
				this.innerHTML = "<span class='curWordClass'>" + cyrillicKey + "</span>";
			transcriptCyrillicToLatin();
			setCaretPositionInDiv(this, cursorPosition+1);
			return false;
		}

		var newStr = insertCharAt(this.textContent, cursorPosition, cyrillicKey);

		var newWord = addLetterToCurrentWord(this, cyrillicKey);
		
		// document.getElementById('cyrillicText').innerHTML = newWord;
		
		surroundWordBySpan(newWord);
		

		transcriptCyrillicToLatin(); // additional function
		setCaretPositionInDiv(this, cursorPosition+1);
		return false;
	}

	transcriptCyrillicToLatin();
}


// function gets currentWord and adds letter on currentPosition.
// Then returns new word.
// This function DOES NOT MODIFY this word in editableDiv
function addLetterToCurrentWord(editableDiv, letter) {
	var oldStr = editableDiv.textContent;
	var curPos = getCaretPositionInDiv(editableDiv);
	var firstPos = getStartingPositionOfCurrentWord(editableDiv);
	var lastPos = getLastPositionOfCurrentWord(editableDiv);
	var newWord = oldStr.substr(firstPos, curPos-firstPos)+letter+oldStr.substr(curPos, lastPos-curPos+1);
	return newWord;
}



function surroundWordBySpan(curWord) {
	var cyrillicText = document.getElementById('cyrillicText');
	var firstPos = getStartingPositionOfCurrentWord(cyrillicText);
	var lastPos = getLastPositionOfCurrentWord(cyrillicText);
	// to not underline space. Not treat space as word
	if (curWord == " " || curWord == '' || curWord.indexOf(" ") != -1)
		newInnerHtml = cyrillicText.textContent.substr(0,firstPos) + curWord + cyrillicText.textContent.substr(lastPos+1);	
	else 
		newInnerHtml = cyrillicText.textContent.substr(0,firstPos)+"<span class='curWordClass'>"+curWord+"</span>" + cyrillicText.textContent.substr(lastPos+1);

	// unknownWords =  getUnknownWords();
	// cyrillicText.innerHTML = addSpanForUnknownWords(unknownWords, newInnerHtml);
	cyrillicText.innerHTML = newInnerHtml;
	// loadTranslationjQuery(curWord);
}

function addSpanForUnknownWords(words2, text) {
	// copy array to save original array unchanged
	words = words2.slice();
	if (words.length > 0){
		firstWord = words.shift();
		newText = text.replace(RegExp(firstWord,"gi"),"<span class=unknownWordClass>"+firstWord+"</span>");
		addSpanForUnknownWords(words, newText);
		if (words.length == 0)
			return newText;
	}
	else
		return text;
}


function getUnknownWords() {
	words = getWordsFromCyrillicText();
	do{
		word = words.shift();
		if (unknownWords.includes(word)){
			alert(word + " is unknown");
			continue;
		}
		$.when(searchWordsByAjax(word)).done(function(response){
			if (response.slice(-4).indexOf("ok") < 0) {
				unknownWords.push(word);
			}
		});
	} while (words.length > 0);
	return unknownWords;
}

function searchWordsByAjax(word) {
	return $.ajax({
			type: "GET",
			url: "getLemkoWord.php?q="+word+"&typeOfQuery=existenceOfWord",
			data: "call=getLemkoWord",
			async: false,
			dataType: "text"
		});
}

// set new innerHTML for cyryllicText. Add span with class unknownWordClass for unknown words
// it makes them underlined
function setClassForUnknownWords() {
	cyrillicText = document.getElementById('cyrillicText');
	words = getUnknownWords();
	cyrillicText.innerHTML = addSpanForUnknownWords(words, cyrillicText.textContent);
}

// funciton returns positions of substring in string
function locations(string,substring){
  var a=[],i=-1;
  while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
  return a;
}

// function returns array of words in cyrillicText div
function getWordsFromCyrillicText() {
	text = $('#cyrillicText').text();
	spacePositions = locations(text, " ");
	var words = [];
	beforePos = 0;
	
	do {
		afterPos = spacePositions.shift();
		word=text.substr(beforePos, afterPos-beforePos);
		if (word != '')
			words.push(word);
		
		beforePos = afterPos+1;
	}while (spacePositions.length > 0);
	beforePos = afterPos+1;
	afterPos = text.length;
	word=text.substr(beforePos, afterPos);
	words.push(word);
	return words;
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
	var newStr = insertCharAt(cyrillicText.textContent, cursorPosition, cyrillicKey);

	cyrillicText.textContent = newStr;
	
	transcriptCyrillicToLatin(); // additional function
	setCaretPositionInDiv(cyrillicText, cursorPosition+1);
	cyrillicText.focus();
	return false;
}


var availableKeys = [
	';','\'','\=','\,',".",' ','[',']','\\', '{', '}', '|', ':', '\"', '<', '>', '+'
];

var specialCharactersActiveWithShift = [
	'{', '}', '|', ':', '\"', '+'
];

var specialCharactersWithoutShift = [
	';','\'','\=',',','.','[',']', '\\'
];


// here we check if given key is available
function isTheKeyAvailable(key)
{
	// delete and dot(.) has the same charCode so firstly check if given key is dot
	if (key == ".")
		return true;
	if (key.charCodeAt(0) == 46) // delete key
		return false;
	if (availableKeys.indexOf(key) != -1) {
		return true;
	} else if (/[0-9A-Za-z]+/.test(key)){
		return true;
	}
	return false;
}

// get char after press on button action
function getChar(event){
	var code = event.keyCode ? event.keyCode : event.which;
	var actualChar = String.fromCharCode(code);
	return actualChar;
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
		butt.addEventListener("click", function(){loadTranslationjQuery(getCurrentWord());}, false);
		// surround word by span and return caret pos to suitable position
		butt.addEventListener("click", function(){curpos=getCaretPositionInDiv(r);
		surroundWordBySpan(getCurrentWord());
		setCaretPositionInDiv(r, curpos);
	}, false);
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

// command which action dependent on parameter
function command(cmdName)
{
	if (cmdName == 'ClearAll')
	{
		document.getElementById('cyrillicText').innerHTML  = '';
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
	document.getElementById("cyrillicText").textContent+=character;
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

// function which read text in cyrillicText div and fill latinText(textarea)
// transliterated text
function transcriptCyrillicToLatin()
{
	var cyrillicText = document.getElementById('cyrillicText').textContent;
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


// returns transliteration to latin for given word in cyrillic
function getLatinEquivalentToCyrillic2(cyrillicChar)
{
	var a = '';
	if (chars2[cyrillicChar] != undefined)
		return (chars2[cyrillicChar].base != undefined ? chars2[cyrillicChar].base : '');
	else 
		return cyrillicChar;
}


// function using ajax to query psql db
function loadTranslationjQuery(str) 
{
	var curWord = '';
	if (str == undefined)
		curWord = getCurrentWord();
	else 
		curWord = str;

	if (curWord == '')
		return;

	$.ajax({
		type: "GET",
		url: "getLemkoWord.php?q="+curWord+"&typeOfQuery=partOfWord",
		data: "call=getLemkoWord",
		dataType: "text",
		success: function(response){
			var textArea = document.getElementById('cyrillicText');
			var select = document.getElementById('promptsSelector');
			setPositionForPrompter();
			select.innerHTML=response.replace("ok","");	
			actionOnMouseOverRow(); // this function enable to distinct element under mouse in table
			if (response.slice(-4).indexOf("ok") > -1){
				// textArea.style.color='black';
				// textArea.style.textDecoration="none";
			} else {
				// textArea.style.color='grey';
			}

			document.getElementById("txtHint").innerHTML=response;
		}
	});
}



// chars2, chars and keyss arrays and functions connected with them

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
chars2['\u0438'] = {base: 'y'};
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
chars2['\u0418'] = { base: 'Y'};
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
chars['period-colon'] = { lower: ':', upper: ':' };
chars[';'] = { lower: ';', upper: ';' };
chars[':'] = { lower: ':', upper: ':' };
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
chars['space'] = { lower: '&nbsp', upper: '&nbsp' };

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
keyss[' '] = [ chars['space'] ];

// bukwy, kotry możeme zmiakczyty
var softCyrillicChars = [
	chars['c cyr'].lower, chars['c cyr'].upper,
	chars['n cyr'].lower, chars['n cyr'].upper,
	chars['s cyr'].lower, chars['s cyr'].upper,
	chars['z cyr'].lower, chars['z cyr'].upper,
	chars['l cyr'].lower, chars['l cyr'].upper,
];

// bukwy dwuelementowy
var doubleCyrillicChars = [
	chars['ya cyr'].lower, chars['ya cyr'].upper,
	chars['yu cyr'].lower, chars['yu cyr'].upper,
	chars['ye cyr'].lower, chars['ye cyr'].upper,
];

// bukwy zmiakczajuczy ł na l
// i, e, и
var softingCyrillicChars = [
	chars['i cyr'].lower, chars['i cyr'].upper, 
	chars['e cyr'].lower, chars['e cyr'].upper, 
];


function setPositionForPrompter()
{
	var cyrillicText = document.getElementById('cyrillicText');
	var curPos = getCaretPositionInDiv(cyrillicText);
	var firstPos = getStartingPositionOfCurrentWord(cyrillicText);
	setCaretPositionInDiv(cyrillicText, firstPos);	
	
	setCaretPositionInDiv(cyrillicText, curPos);
}

function getCurrentWord() {
	var cyrillicText = document.getElementById('cyrillicText');
	var firstPos = getStartingPositionOfCurrentWord(cyrillicText);
	var lastPos = getLastPositionOfCurrentWord(cyrillicText);
	var strWithoutSpaces = cyrillicText.textContent.substr(firstPos, lastPos-firstPos+1).replace(/\s+/g, '');
	var curPos = getCaretPositionInDiv(cyrillicText);
	if (curPos == 0) {
		if (getCaretPositionInDiv(cyrillicText, curPos) == '' || getCaretPositionInDiv(cyrillicText, curPos) == ' ')
			return '';
	}
	else {
		if ((getCaretPositionInDiv(cyrillicText, curPos) == '' || getCaretPositionInDiv(cyrillicText, curPos) == ' ')
			&& (getCaretPositionInDiv(cyrillicText, curPos-1) == '' || getCaretPositionInDiv(cyrillicText, curPos-1) == ' ')){
			return '';
		}
	}
	return strWithoutSpaces;
}


// function returning positon of the last letter in the word where the caret is located
function getLastPositionOfCurrentWord(editableDiv) {
	var caretPos = getCaretPositionInDiv(editableDiv);
	var curLetter = getCharAtPosInDiv(editableDiv, caretPos);
	var curPos = caretPos;
	var textLen = editableDiv.textContent.length;

	do {
		curPos = curPos+1;
		curLetter	= getCharAtPosInDiv(editableDiv, curPos);

	} while (curLetter != ' ' && curPos < textLen);
	// return curPos<textLen ? curPos-1:curPos-1;
	return curPos-1;
}


// function returning positon of the first letter in the word where the caret is located
// indexed from 0
function getStartingPositionOfCurrentWord(editableDiv) {
	var caretPos = getCaretPositionInDiv(editableDiv);
	var curLetter = getCharAtPosInDiv(editableDiv, caretPos);
	var curPos = caretPos;

	do {
		curPos = curPos-1;
		curLetter	= getCharAtPosInDiv(editableDiv, curPos);

	} while (curLetter != ' ' && curPos > 0);
	if (curPos == 0)
		return 0;
	return curPos==caretPos ? curPos:curPos + 1;
}

// function returning char at given position in the editableDiv, given as parameter
// pos is indexed from 0
function getCharAtPosInDiv(editableDiv, pos) {
	return editableDiv.textContent.charAt(pos);
}


// function that return position of caret in div
function getCaretPositionInDiv(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
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