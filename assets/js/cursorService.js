function getCurrentWordSpanText() {
	if (document.getElementsByClassName(getCurWordClassName()).length == 0)
		return '';
	
	var currNode = document.getElementsByClassName(getCurWordClassName())[0];
	var text = currNode.textContent;
	return text;
}

function getCurrentWordSpanStartingPos(){
	var nodeIndex = getCurrentChildNumber()['lastChildNumber'];
	if (nodeIndex == 0)
		return 0;
	else {
		var textLengthBeforeCurrentNode = getTextLengthInChilds(0, nodeIndex-1);
		return textLengthBeforeCurrentNode;
	}
}

function getCurrentWordSpanLastPos() {
	var nodeIndex = getCurrentChildNumber()['lastChildNumber'];
	var textLengthBeforeCurrentNode = getTextLengthInChilds(0, nodeIndex-1);
	var textLenInNode = getTextLengthInNthChild(nodeIndex);
	return textLengthBeforeCurrentNode+textLenInNode-1;
}

function getNodeWithCurWordClass() {
	return document.getElementsByClassName(getCurWordClassName())[0];
}

function getCurrentWord() {
	var cyrillicText = document.getElementById('cyrillicText');
	var firstPos = getStartingPositionOfCurrentWord(cyrillicText);
	var lastPos = getLastPositionOfCurrentWord(cyrillicText);
	var strWithoutSpaces = cyrillicText.textContent.substr(firstPos, lastPos-firstPos+1).replace(/\s+/g, '');
	var curPos = getCaretPositionInDiv(cyrillicText);
	if (curPos == 0) {
		if (getCharAtPosInDiv(cyrillicText, curPos) == '' || getCharAtPosInDiv(cyrillicText, curPos) == ' ')
			return '';
	}
	else {
		if ((getCharAtPosInDiv(cyrillicText, curPos) == '' || getCharAtPosInDiv(cyrillicText, curPos) == ' ')
			&& (getCharAtPosInDiv(cyrillicText, curPos-1) == '' || getCharAtPosInDiv(cyrillicText, curPos-1) == ' ')){
			return '';
		}
	}
	return strWithoutSpaces;
}


// function returning positon of the last letter in the word where the caret is located
function getLastPositionOfCurrentWord(editableDiv) {
	if (arguments.length == 0) {
		var cyrillicText = document.getElementById('cyrillicText');
		return getLastPositionOfCurrentWord(cyrillicText);
	}

	var caretPos = getCaretPositionInDiv(editableDiv);
	var curLetter = getCharAtPosInDiv(editableDiv, caretPos);
	var curPos = caretPos;
	var textLen = editableDiv.textContent.length;

	do {
		curLetter	= getCharAtPosInDiv(editableDiv, curPos);
		curPos = curPos+1;
	} while (curLetter != ' ' && curPos <= textLen);
	// return curPos<textLen ? curPos-1:curPos-1;
	return curPos-1;
}

// function returning positon of the first letter in the word where the caret is located
// indexed from 0
function getStartingPositionOfCurrentWord(editableDiv) {
	if (arguments.length == 0) {
		var cyrillicText = document.getElementById('cyrillicText');
		return getStartingPositionOfCurrentWord(cyrillicText);
	}

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




// get caret positon from cyrillicText div
function getCaretPosition() {
	var element = document.getElementById('cyrillicText');
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

// function that return position of caret in div
function getCaretPositionInDiv(element) {
	if (element == undefined) {
		var cyrillicPanel = document.getElementById('cyrillicText');
		return getCaretPositionInDiv(cyrillicPanel);
	}
	else {
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
}


// function that sets carePosition in cyrillicText
function setCaretPosition(sPos) {
	var el = document.getElementById('cyrillicText');

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

function setCaretPositionInDiv(el, sPos)
{
	// if we passed 1 arguments then it's position. Div is set default to cyrillicText
	if( arguments.length == 1){
		var pos = el;
		var cyrillicPanel = document.getElementById('cyrillicText');
		setCaretPositionInDiv(cyrillicPanel, pos);
	}
	else {
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
} 


