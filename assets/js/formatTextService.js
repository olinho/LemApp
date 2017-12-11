function updateSpanService() {
	wrapEachWordBySpan();
	updateCurrentWordSpan();
	setPrompterPosition();
	joinWordsWithNoSpacesBetweenThem();
	updateCurrentWordSpan();
	removeMoreThanOneCurWordClass();
	removeNodesWithNoText();
	removeNodesWithNbsp();
}


function wrapEachWordBySpan() {
	var pos = getCaretPosition();
	var cyrillicText = document.getElementById('cyrillicText');
	wrapNewLineElements();

	for (i=0; i<cyrillicText.childNodes.length; i++){
		if (cyrillicText.childNodes[i].tagName == undefined || (cyrillicText.childNodes[i].textContent.split(' ').length > 1 && cyrillicText.childNodes[i].textContent != " ") ) {
			var selectedText = extractContentsOfNode(cyrillicText.childNodes[i]);
			createSpansForText(selectedText);
			removeNodesWithNoText();
		}
		else if (cyrillicText.childNodes[i].tagName == "SPAN" && cyrillicText.childNodes[i].className == ""){
			var selectedText = extractContentsOfNode(cyrillicText.childNodes[i]);
			createSpansForText(selectedText);
			removeNodesWithNoText();
		}
	}
	setCaretPosition(pos);
}

function joinWordsWithNoSpacesBetweenThem() {
	var pos = getCaretPosition();
	var cyrillicText = document.getElementById('cyrillicText');
	var selection = window.getSelection().getRangeAt(0);
	for (i=0; i<cyrillicText.childNodes.length-1; i++){
		if (cyrillicText.childNodes[i].classList.contains('word') && cyrillicText.childNodes[i+1].classList.contains('word')){
			var text = cyrillicText.childNodes[i].textContent+cyrillicText.childNodes[i+1].textContent;
			cyrillicText.removeChild(cyrillicText.childNodes[i]);
			cyrillicText.removeChild(cyrillicText.childNodes[i]); // now i = old 'i+1'
			createAndInsertSpan(text, selection);
		}
	}
	setCaretPosition(pos);
}

function removeMoreThanOneCurWordClass() {
	if (document.getElementsByClassName(getCurWordClassName()).length > 1) {
		for (i=0; i<document.getElementsByClassName(getCurWordClassName()).length; i++ ) {
			var node = document.getElementsByClassName(getCurWordClassName())[i];
			removeClassFromNode(node, getCurWordClassName());
		}
		
	}
}

function addWordClassToCurWordClassSpan() {
	if (document.getElementsByClassName(getCurWordClassName()).length > 0) {
		document.getElementsByClassName(getCurWordClassName())[0].classList.add('word');
	}
}

// function which remove selection from div
function removeAllSelections() {
	var pos = getCaretPosition();
	window.getSelection().removeAllRanges();
	setCaretPosition(pos);
}

function createSpansForText(selText) {	
	var selection = window.getSelection().getRangeAt(0);
	var countOfWords = selText.textContent.split(' ').length;
	for (i=countOfWords-1; i>=0; i--){
		var span = document.createElement('span');
		span.className = 'word';
		span.appendChild(document.createTextNode(selText.textContent.split(' ')[i]));
		span.normalize();
		selection.insertNode(span);
		if (i>0) {
			var span = createSpaceSpan();
			selection.insertNode(span);
		}
	}
}

function createAndInsertSpaceSpan() {
	var selection = window.getSelection().getRangeAt(0);
	var span = createSpaceSpan();
	selection.insertNode(span);
	removeAllSelections();
}

function createSpaceSpan() {
	var span = document.createElement('span');
	span.className = 'space';
	span.appendChild(document.createTextNode(" "));
	span.normalize();
	return span;
}

function crateAndInsertNewLineSpan() {
	var selection = window.getSelection().getRangeAt(0);
	var span = createNewLineSpan();
	selection.insertNode(span);
	removeAllSelections();
}

function createNewLineSpan() {
	var span = document.createElement('span');
	span.className = 'newLine';
	span.innerHTML = "<br>";
	span.normalize();
	return span;
}

function createAndInsertSpan(text, selection){
	var pos = getCaretPosition();
	var newSpan;
	
	if (text == ' ') 
		newSpan = createSpan('space', text);
	else 
		newSpan = createSpan('word', text);

	selection.insertNode(newSpan);
	removeAllSelections();
}


// select #text in node and return it
function extractContentsOfNode(theNode) {
	var cyrillicText = document.getElementById('cyrillicText');
	var range = document.createRange();
	range.selectNode(theNode);
	window.getSelection().addRange(range);
	var selection = window.getSelection().getRangeAt(0);
	var selectedText = selection.extractContents();
	return selectedText;
}

function getCurrentNode() {
	var cyrillicText = document.getElementById('cyrillicText');
	var currNodeIndex = getCurrentChildNumber()['lastChildNumber'];
	var sel = window.getSelection();
	if (r.childNodes[currNodeIndex].textContent != sel.focusNode.textContent) {
		currNodeIndex = getCurrentChildNumber()['startingChildNumber'];
		console.log("curNodeText and window.getSelection()'s text are different");	
	}
	return cyrillicText.childNodes[currNodeIndex];
}

function insertChoosenWord(choosenWord) {
	var cyrillicText = document.getElementById('cyrillicText');
	var currNode = getCurrentNode();
	cyrillicText.removeChild(currNode);
	var selection = window.getSelection().getRangeAt(0);
	createAndInsertSpan(choosenWord, selection);
}

function wrapNewLineElements() {
	var cyrillicText = document.getElementById('cyrillicText');
	var range = document.createRange();
	var br = "<br>";
	var startIndxOfBr;
	var lastIndxOfBr;
	for (i=cyrillicText.childNodes.length-1; i>=0; i--){
		var inner = cyrillicText.childNodes[i].innerHTML;
		if (inner.includes("<br>") && inner != "<br>") {
			var selection = window.getSelection().getRangeAt(0);
			var selText = extractContentsOfNode(cyrillicText.childNodes[i]);
			var pos = getCaretPosition();
			var text = selText.textContent;
			var innerHTML = selText.childNodes[0].innerHTML;
			startIndxOfBr = innerHTML.indexOf("<br>");
			if (startIndxOfBr == 0){
				var newSpan = createNewLineSpan();
				selection.insertNode(newSpan);
				createAndInsertSpan(text, selection);
			}
			else {
				if(text.length > startIndxOfBr) {
					createAndInsertSpan(text.substr(startIndxOfBr,text.length), selection);
				}
				var newSpan = createNewLineSpan();
				selection.insertNode(newSpan);
				createAndInsertSpan(text.substr(0,startIndxOfBr), selection);
			}
			setCaretPosition(pos + text.length);
		}
	}
}

function removeClassFromNode(theNode, className) {
	theNode.classList.remove(className);
}

function addClassToNode(theNode, className) {
	var currClassList = theNode.classList;

	if (!currClassList.contains(className))
		theNode.className += " "+className;

	var otherClasses = getOtherClassesDescribingWordFormatting(className);
	for (i=0; i<otherClasses.length; i++){
		removeClassFromNode(theNode, otherClasses[i]);
	}
}

function getOtherClassesDescribingWordFormatting(className) {
	var classList = [];
	classList.push("knownWordClass");
	classList.push("unknownWordClass");
	classList.push("partiallyKnownWordClass");
	classList.push("wordWithSmallMistakeClass");
	if (classList.includes(className)){
		var index = classList.indexOf(className);
		classList.splice(index,1);
		return classList;
	}
	else
		return [];
}

function changeClassOfNode(theNode, className) {
	theNode.className = className;
}


function highlightSelectedText() {
	var selection = window.getSelection().getRangeAt(0);
	var selectedText = selection.extractContents();
	var span = document.createElement("span");
	span.style.background = "#a1d3cc";
	span.appendChild(selectedText);
	span.normalize();
	selection.insertNode(span);
}

function surroundSelectedTextBySpan(className) {
	var currNodeIndex = getCurrentChildNumber['lastChildNumber'];
	var cyrillicText = document.getElementById('cyrillicText');
	try {
		if (cyrillicText.childNodes[currNodeIndex].tagName == "SPAN") {
			cyrillicText.childNodes[currNodeIndex].className = className;
			return;
		}
	} catch (err){

	}
	
	var selection = window.getSelection().getRangeAt(0);
	var selectedText = selection.extractContents();
	var span = document.createElement("span");
	span.appendChild(selectedText);
	span.className = className;
	span.normalize();
	selection.insertNode(span);	
}


function findNodeWithCurWordClass() {
	for (i=0; i<r.childNodes.length; i++) {
		if (r.childNodes[i].classList.contains(getCurWordClassName())) {
			return r.childNodes[i];
		}
	}
}


function updateCurrentWordSpan() {
	var indexOfNode = getCurrentChildNumber()['lastChildNumber'];
	var sel = window.getSelection();

	var node = cyrillicText.childNodes[indexOfNode];
	if (node.textContent != sel.focusNode.textContent) {
		indexOfNode = getCurrentChildNumber()['startingChildNumber'];
		node = cyrillicText.childNodes[indexOfNode];
	}
	if (node.className.includes('word') && node.textContent != "") {
		removeCurrentWordSpan();
		addClassToNode(node, getCurWordClassName());
	}
		
}

// select current word
// surround selected text by 'curWordClass' span
// remove selection
// set old position
function updateCurrentWordSpan3() {
	var pos = getCaretPosition();
	var cyrillicText = document.getElementById('cyrillicText');

	removeCurrentWordSpan();
	var indexOfNode = getCurrentChildNumber()['lastChildNumber'];
	var node = cyrillicText.childNodes[indexOfNode];
	var classList = node.classList;

	if (cyrillicText.childNodes.length == 1) {
		var pos = getCaretPosition();
		selectCurrentWord();
		surroundSelectedTextBySpan(getCurWordClassName());
		// clear after operations
		var selection = window.getSelection();
		selection.removeAllRanges();
		removeNodesWithNoText();
	}
	else if (getCurrentWord() == ""){

	}
	else {
		var childNum = getCurrentChildNumber()['lastChildNumber'];
		cyrillicText.childNodes[childNum].className = getCurWordClassName();
	}
	for (n=0; n<classList; n++) {
		node.classList.add(classList[n]);	
	}
	addWordClassToCurWordClassSpan();
	setCaretPosition(pos);
}

function updateCurrentWordSpan2() {
	var pos = getCaretPosition();
	var cyrillicText = document.getElementById('cyrillicText');
	removeCurrentWordSpan();
	if (cyrillicText.childNodes.length == 1) {
		var pos = getCaretPosition();
		selectCurrentWordSpan();
		surroundSelectedTextBySpan(getCurWordClassName());
		

		// clear after operations
		var selection = window.getSelection();
		selection.removeAllRanges();
		removeNodesWithNoText();
	}
	else if (getCurrentWord() == ""){

	}
	else {
		var childNum = getCurrentChildNumber()['lastChildNumber'];
		cyrillicText.childNodes[childNum].className = getCurWordClassName();
	}
	setCaretPosition(pos);
}

function removeCurrentWordSpan() {
	if (findNodeWithCurWordClass() != null) {
		var node = findNodeWithCurWordClass();
		removeClassFromNode(node, getCurWordClassName());
	}	
}

function removeCurrentWordSpanOLD() {

	var pos = getCaretPosition();
	var cyrillicPanel = document.getElementById('cyrillicText');
	if (cyrillicPanel.getElementsByClassName(getCurWordClassName()).length > 0) {
		for (n=0; n<cyrillicPanel.getElementsByClassName(getCurWordClassName()).length; n++) {
			cyrillicPanel.getElementsByClassName('curWordClass')[n].removeAttribute('class');
		}	
	}
	setCaretPosition(pos);
}

function removeNodesWithNoText() {
	var cyrillicPanel = document.getElementById('cyrillicText');
	
	for (i=0; i<cyrillicText.childNodes.length; i++){ 
		var text = cyrillicText.childNodes[i].innerHTML;
		if (cyrillicText.childNodes[i].innerHTML == "") {
			cyrillicText.removeChild(cyrillicText.childNodes[i]); 
			i--;
		}
	}
}

function removeNodesWithNbsp() {
	var cyrillicPanel = document.getElementById('cyrillicText');

	for (i=0; i<cyrillicText.childNodes.length; i++){ 
		var node = cyrillicText.childNodes[i];
		var innerHTML = node.innerHTML;
		if (innerHTML == "&nbsp" || innerHTML == "&nbsp;") 
			cyrillicText.removeChild(node);
	}
}

function selectCurrentWordSpan() {
	var node = document.getElementsByClassName(getCurWordClassName())[0];
	var range = document.createRange();
	range.selectNode(node);
	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

function selectCurrentWord(){
	var cyrillicPanel = document.getElementById('cyrillicText');
	var startingPosOfCurWord = getStartingPositionOfCurrentWord();
	var lastPosOfCurWord = getLastPositionOfCurrentWord();
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(cyrillicPanel);
 	var startingChildNumber = getCurrentChildNumber()['startingChildNumber'];
	console.log("startingChildNumber= " + startingChildNumber);
	var lastChildNumber = getCurrentChildNumber()['lastChildNumber'];
	console.log("lastChildNumber= " + lastChildNumber);
	var countOfCharsBeforeStartingChild = 0;
	if (startingChildNumber > 0)
	 	countOfCharsBeforeStartingChild = getTextLengthInChilds(0,startingChildNumber-1);
	console.log("countOfCharsBeforeStartingChild= " + countOfCharsBeforeStartingChild);
	var countOfCharsBeforeLastChild = 0;
	if (lastChildNumber > 0)
		countOfCharsBeforeLastChild = getTextLengthInChilds(0,lastChildNumber-1);
	console.log("countOfCharsBeforeLastChild= " + countOfCharsBeforeLastChild);
	if (cyrillicPanel.childNodes[startingChildNumber].hasChildNodes())
		startNode = cyrillicPanel.childNodes[startingChildNumber].firstChild;
	else 
		startNode = cyrillicPanel.childNodes[startingChildNumber];
	range.setStart(startNode, startingPosOfCurWord - countOfCharsBeforeStartingChild);

	if (cyrillicPanel.childNodes[startingChildNumber].hasChildNodes())
		lastNode = cyrillicPanel.childNodes[startingChildNumber].firstChild;
	else 
		lastNode = cyrillicPanel.childNodes[startingChildNumber];
	range.setEnd(lastNode, lastPosOfCurWord - countOfCharsBeforeLastChild);

	selection.removeAllRanges();
	selection.addRange(range);
}


function surroundWordBySpan(curWord) {
	var cyrillicText = document.getElementById('cyrillicText');
	var firstPos = getStartingPositionOfCurrentWord(cyrillicText);
	var lastPos = getLastPositionOfCurrentWord(cyrillicText);
	// to not underline space. Not treat space as word
	if (curWord == " " || curWord == '' || curWord.indexOf(" ") != -1)
		newInnerHtml = cyrillicText.textContent.substr(0,firstPos) + curWord + cyrillicText.textContent.substr(lastPos+1);	
	else 
		newInnerHtml = cyrillicText.textContent.substr(0,firstPos)+"<span class='curWordClass'>"+curWord+"</span> "+ cyrillicText.textContent.substr(lastPos+1);

	// unknownWords =  getUnknownWords();
	// cyrillicText.innerHTML = addSpanForUnknownWords(unknownWords, newInnerHtml);
	cyrillicText.innerHTML = newInnerHtml;
	// loadTranslationjQuery(curWord);
}
function getStartingPositionOfCurrentWordFromInnerHTML() {

}

function getCurrentChildNumber() {
	var cyrillicText = document.getElementById('cyrillicText');
	var firstPos = getStartingPositionOfCurrentWord(cyrillicText);
	var lastPos = getLastPositionOfCurrentWord(cyrillicText);

	var result = {};

	var textLen=0;
	for (i=0; i<cyrillicText.childNodes.length; i++) {
		textLen+=cyrillicText.childNodes[i].textContent.length;
		if (firstPos < textLen && result['startingChildNumber'] == undefined){
			result['startingChildNumber'] = i;
		}
		if (lastPos <= textLen && result['lastChildNumber'] == undefined) {
			result['lastChildNumber'] = i;	
		}
	}
	return result;
}


// returns sum of chars in cyrillicText nodes with indexes from specified range
function getTextLengthInChilds(firstChild, lastChild) {
	var cyrillicText = document.getElementById('cyrillicText');
	var textLen=0;

	for (i=firstChild; i<=lastChild; i++) {
		textLen+=getTextLengthInNthChild(i);
	}
	return textLen;
}

function getTextLengthInNthChild(n) {
	return cyrillicText.childNodes[n].textContent.length;
}

function getCurWordClassName() {
	return 'curWordClass';
}

function getPrevChar() {
	var cyrillicText = document.getElementById('cyrillicText');
	return getCharAtPosInDiv(r,getCaretPosition()-1);
}

function clearTextFromSpaces(text) {
	var  array = text.split(" ");
	var words = array.filter(String);
	for (i=0; i<words.length; i++ ){
		words[i]=words[i].replace(/\s/g, '');
	}
	return words.join(" ");
}

function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}