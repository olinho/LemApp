
lemkoWordsWithVariationsArrayLength = lemkoWordsWithVariationsArray.length;


// get hints. Search from given index and given start of word - word
function getHintsWordsAfterIndex_from_lemkoWordsWithVariationsArray(word, index) {
	resultArray = [];
	it=0;
	baseForms = Object.keys(lemkoWordsWithVariationsArray);
	
	for (i=index; i<baseForms.length; i++) {
		s = baseForms[i].toLowerCase();	
		if (s.indexOf(word) == 0) {
			resultArray.push(s);
			it++;
		}	
		if (it>=5){
			return resultArray;
		}
	}
	return resultArray;
}

function getNextHintAfterIndex(word,index) {
	resultArray = [];
	it=0;
	baseForms = Object.keys(lemkoWordsWithVariationsArray);
	
	for (i=index; i<baseForms.length; i++) {
		s = baseForms[i].toLowerCase();	
		if (s.indexOf(word) == 0) {
			resultArray.push(s);
			it++;
		}	
		if (it>=1){
			return resultArray;
		}
	}
	return resultArray;
}	

function getHintsWords_from_lemkoWordsWithVariationsArray(word) {
	return getHintsWordsAfterIndex_from_lemkoWordsWithVariationsArray(word,0);
}

// get table with hints
function getFormattedHintsWords(word) {
	if ((wordsTab = getHintsWords_from_lemkoWordsWithVariationsArray(word)).length == 0)
		return "";
	wordsTabLen = wordsTab.length;
	table = "<table id='promptsTable'>\n";
	table += "<tbody>";
	open = "\n\t<tr>\n\t\t<td>";
	close = "</td>\n\t</tr>\n";
	for (i=0; i<wordsTabLen; i++) {
		table += open + wordsTab[i] + close;	
	}
	table += "</tbody></table>";
	return table;
}


// get next hint (1 hint)
function getNextHint() {
	var curWord = getCurrentWord();
	lastHint = getLastHintFromPromptsTable();
	indexOfLastHint = getIndexOfWordFrom_lemkoWordsWithVariationsArray(lastHint);
	newFirstIndex = indexOfLastHint + 1;
	return getNextHintAfterIndex(curWord,newFirstIndex)[0];
}

// get next set of hint utilizing knowledge about last hint
// currently shown
function getNextSetOfHintWords() {
	var curWord = getCurrentWord();
	var lastHint = getLastHintFromPromptsTable();
	indexOfLastHint = getIndexOfWordFrom_lemkoWordsWithVariationsArray(lastHint);
	newFirstIndex = indexOfLastHint + 1;
	return getHintsWordsAfterIndex_from_lemkoWordsWithVariationsArray(curWord, newFirstIndex);
}

// get last shown hint
function getLastHintFromPromptsTable() {
	lastHint = $("#promptsTable >tbody >tr :last").text();
	return lastHint;
}

// get index of last hint word in promptsTable
function getIndexOfWordFrom_lemkoWordsWithVariationsArray(word) {
	return getBaseFormsFromLemkoWordsWithVariationsArray().indexOf(word);
}

function updateListOfHintsInPrompterPanel(str) 
{
	console.log('updateListOfHintsInPrompterPanel');
	var curWord = '';
	if (str == undefined)
		curWord = getCurrentWordSpanText();
	else 
		curWord = str;

	if (curWord == '')
		return;

	var select = document.getElementById('promptsSelector');
	
	if (getFormattedHintsWords(curWord) == "") {
		$("#promptsSelector").text("");
		$("#prompter").hide();
		return;
	}
		
	select.innerHTML=getFormattedHintsWords(curWord);
	actionsForMouseAndRows();
	//actionsForMouseAndRows();
}


// ----------------
// Functions which refer to slownik_3.js 
// ----------------

function getBaseFormsFromLemkoWordsWithVariationsArray() {
	return Object.keys(lemkoWordsWithVariationsArray);
}

function getHintsWords_from_lemkoWordsWithVariationsArray(word) {
	wordLen = word.length;
	resultArray = [];
	it=0;
	baseForms = Object.keys(lemkoWordsWithVariationsArray);
	
	for (i=0; i<baseForms.length; i++) {
		s = baseForms[i];	
		if (s.indexOf(word) == 0) {
			resultArray.push(s);
			it++;
		}	
		if (it>=5){
			return resultArray;
		}
	}
	return resultArray;
}