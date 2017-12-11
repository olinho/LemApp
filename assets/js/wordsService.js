
var wordsArray = [];
var prevChildNumber=0;

function wordsUpdatingService() {
	currentChildNumber = getCurrentChildNumber()['lastChildNumber'];
	
	if (currentKeyCode == 32)
		autocorrectWordsWithSmallMistake();

	if (prevChildNumber == currentChildNumber)
		return;
	else
		prevChildNumber = currentChildNumber;

	var newWords = getNewWords();
	askAboutNewWordsjQuery(newWords);
	// autocorrectWordsWithSmallMistake();
}

function onClickCheckBox() {
	var checkBox = document.getElementById('autocorrectionInput');
	if (checkBox.checked) 
		autocorrectWordsWithSmallMistake();
}

function autocorrectWordsWithSmallMistake() {
	var checkBox = document.getElementById('autocorrectionInput');
	if (!checkBox.checked)
		return;

	var notCompletelyUnknownWords = getNotCompletelyUnknowWordsArray();
	for (var i = notCompletelyUnknownWords.length - 1; i >= 0; i--) {
		var word = notCompletelyUnknownWords[i];
		askAboutWordsToAutocorrection(word);
	};
	changeWordWithSmallMistakeToKnownWord();
}

function changeWordWithSmallMistakeToKnownWord() {
	var wordsWithSmallMistake = getWordsWithSmallMistakeArray();
	var wordsInCyrillicTextPanel = getArrayOfWordsFromCyrillicTextPanel();
	var nodes = r.childNodes;
	for (var i = nodes.length - 1; i >= 0; i--) {
		var theNode = nodes[i];
		var wordInNode = theNode.textContent;
		if (wordsWithSmallMistake.includes(wordInNode)) {
			var elementWithWordFromWordsArray = getObjectFromWordsArrayWithWord(wordInNode);
			var wordCorrector = elementWithWordFromWordsArray['wordCorrector'];
			changeWordWithAnimation(theNode, wordCorrector);
			var newClass = getValueForKnownWords()+"Class";
			addClassToNode(theNode, newClass);
		}
	};
}

function changeWordWithAnimation(theNode, newWord) {
	$(theNode).animate({'font-weight': 'bold'}, 200).animate({'font-weight': 'normal'}, 200).text(newWord);
}

function askAboutWordsToAutocorrection(word) {

	if (word == null || getTypeOfWord(word)!='unknownWord')
		return;
	var similarWords = getSimilarWordsWithOtherY(word);
	$.ajax({
		type: "POST",
		url: "getAutocorrectWord.php",
		data: {similarWords: similarWords},
		dataType: "JSON",
		success: function(response) {
			console.log("Response:"+JSON.stringify(response)); // return one row or null if there aren't any rows or there are more than 1 row
			if (response == null) {
				setUnknownWordAsCompletelyUnknown(word);
			}
			else {
				var responseWord = response['word'];
				wordCorrector = findWordWithCaseSensitive(similarWords, responseWord);
				changeTypeOfWordFromUnknownToWordWithSmallMistake(word, wordCorrector);
				changeWordInSameNodesToKnownWord(word,wordCorrector);
			}
		}
	});
}

function findWordWithCaseSensitive(arrayOfWords, wordLowercase) {
	for (i=0; i<arrayOfWords.length; i++) {
		var word = arrayOfWords[i];
		if (word.toLowerCase() == wordLowercase)
			return word;
	}
}

function changeWordInSameNodesToKnownWord(oldWord, newWord) {
	var arrayWithIndexes = getIndexesForNodesWithWord(oldWord);
	var nodes = r.childNodes;
	for (var i = arrayWithIndexes.length - 1; i >= 0; i--) {
		var index = arrayWithIndexes[i];
		var theNode = nodes[index];
		// theNode.textContent = newWord;
		changeWordWithAnimation(theNode, wordCorrector);
		var newClass = getValueForKnownWords()+"Class";
		addClassToNode(theNode, newClass)
	};
}

function getIndexesForNodesWithWord(word){
	var nodes = r.childNodes;
	var indexes = [];
	for (var i = nodes.length - 1; i >= 0; i--) {
		if (nodes[i].textContent == word){
			indexes.push(i);
		}
	}
	return indexes;
}

function changeTypeOfWordFromWordWithSmallMistakeToKnownWord(word) {
	var elementWithWordFromWordsArray = getObjectFromWordsArrayWithWord(word);
	elementWithWordFromWordsArray['typeOfWord'] = getValueForWordsWithSmallMistake();
}

function changeTypeOfWordFromUnknownToWordWithSmallMistake(word, wordCorrector) {
	var elementWithWordFromWordsArray = getObjectFromWordsArrayWithWord(word);
	elementWithWordFromWordsArray['typeOfWord'] = getValueForWordsWithSmallMistake();
	elementWithWordFromWordsArray['wordCorrector'] = wordCorrector;
}

function setUnknownWordAsCompletelyUnknown(word) {
	var elementWithWordFromWordsArray = getObjectFromWordsArrayWithWord(word);
	if (getTypeOfWord(word) == getValueForUnknownWords())
		elementWithWordFromWordsArray['completelyUnknown'] = true;
}

function getSimilarWordsWithOtherLetter(word, letter1, letter2) {
	if (!word.includes(letter1) && !word.includes(letter2)) 
		return [];
	
	var result = [];
	for (i=0; i<word.length; i++){
		if (word[i] == letter1) {
			result[result.length] = changeLetterInWordInPos(letter2,word,i);
		}
		else if (word[i] == letter2) {
			result[result.length] = changeLetterInWordInPos(letter1,word,i);
		}
	}
	return result;
}

function getSimilarWordsWithOtherY(word){
	var deepY = '\u044B';
	var normalY = '\u0438';
	if (!word.includes(deepY) && !word.includes(normalY)) 
		return [];
	
	var result = [];
	for (i=0; i<word.length; i++){
		if (word[i] == deepY) {
			result[result.length] = changeLetterInWordInPos(normalY,word,i);
		}
		else if (word[i] == normalY) {
			result[result.length] = changeLetterInWordInPos(deepY,word,i);
		}
	}
	return result;
}

function changeLetterInWordInPos(newLetter,word,pos) {
	if (word.length == 0)
		return "";
	if ((word.length == 1) && (pos == 0))
		return newLetter;
	
	if (word.length > 1) {
		if (pos == 0)
			return newLetter+word.substr(1);
		else if (pos == word.length-1)
			return word.substr(0,word.length-1)+newLetter;
		else 
			return word.substr(0,pos)+newLetter+word.substr(pos+1);
	}
}

function askAboutNewWordsjQuery(words) {
	if (words.length == 0)
		return;
	$.ajax({
		type: "POST",
		url: "getTypeOfWords.php",
		data: {words: words},
		dataType: "JSON",
		success: function(response){
			console.log("Response:"+JSON.stringify(response));
			console.log(response);

			updateWordsTable(response['knownWords'], getValueForKnownWords());
			updateWordsTable(response['partiallyKnownWords'], getValueForPartiallyKnownWords());
			updateWordsTable(response['unknownWords'], getValueForUnknownWords());

			setWordsClass();
			autocorrectWordsWithSmallMistake();
		}
	});
}

function updateWordsTable(arrayOfWords, typeOfWords) {
	for(i=0; i<arrayOfWords.length; i++){
		var theWord = arrayOfWords[i];
		if ( !wordBelongsToWordsArray(theWord) )
			wordsArray.push({word: theWord, typeOfWord: typeOfWords});
	}
}

function wordBelongsToWordsArray(word) {
	var words = getWordsFromWordsArray();
	return words.indexOf(word)!=-1?true:false;
}

function getTypeOfWord(word) {
	if (wordBelongsToWordsArray(word))
		return getInformationAboutWord(word).typeOfWord;
}

function wordIsKnown(word) {
	return getKnownWordsFromWordsArray().includes(word);
}

function wordIsUnknown(word) {
	return getUnknownWordsFromWordsArray().includes(word);
}

function wordIsPartiallyKnown(word) {
	return getPartiallyKnownWordsFromWordsArray().includes(word);
}

function getPartiallyKnownWordsFromWordsArray() {
	var wordsFromWordsArray = getWordsFromWordsArray();
	var partiallyKnownWords = [];
	for (i=0; i<wordsFromWordsArray.length; i++){
		var word = wordsFromWordsArray[i];
		if (getInformationAboutWord(word).typeOfWord == getValueForPartiallyKnownWords())
			partiallyKnownWords.push(word);
	}
	return partiallyKnownWords;
}

function getUnknownWordsFromWordsArray() {
	var wordsFromWordsArray = getWordsFromWordsArray();
	var unknownWords = [];
	for (i=0; i<wordsFromWordsArray.length; i++){
		var word = wordsFromWordsArray[i];
		if (getInformationAboutWord(word).typeOfWord == getValueForUnknownWords())
			unknownWords.push(word);
	}
	return unknownWords;
}

function getCompletelyUnknownWordsArray() {
	var wordsFromWordsArray = getWordsFromWordsArray();
	var completelyUnknownWords = [];
	for (i=0; i<wordsFromWordsArray.length; i++){
		var word = wordsFromWordsArray[i];
		if ((getInformationAboutWord(word).typeOfWord == getValueForUnknownWords()) && (getInformationAboutWord(word)['completelyUnknown']))
			completelyUnknownWords.push(word);
	}
	return completelyUnknownWords;
}

function getNotCompletelyUnknowWordsArray() {
	var wordsFromWordsArray = getWordsFromWordsArray();
	var notCompletelyUnknownWords = [];
	for (i=0; i<wordsFromWordsArray.length; i++){
		var word = wordsFromWordsArray[i];
		if ((getInformationAboutWord(word).typeOfWord == getValueForUnknownWords()) && (getInformationAboutWord(word)['completelyUnknown'] == undefined))
			notCompletelyUnknownWords.push(word);
	}
	return notCompletelyUnknownWords;
}

function getKnownWordsFromWordsArray() {
	var wordsFromWordsArray = getWordsFromWordsArray();
	var knownWords = [];
	for (i=0; i<wordsFromWordsArray.length; i++){
		var word = wordsFromWordsArray[i];
		if (getInformationAboutWord(word).typeOfWord == getValueForKnownWords())
			knownWords.push(word);
	}
	return knownWords;
}

function getWordsWithSmallMistakeArray() {
	var wordsFromWordsArray = getWordsFromWordsArray();
	var wordsWithSmallMistake = [];
	for (i=0; i<wordsFromWordsArray.length; i++){
		var word = wordsFromWordsArray[i];
		if (getInformationAboutWord(word).typeOfWord == getValueForWordsWithSmallMistake())
			wordsWithSmallMistake.push(word);
	}
	return wordsWithSmallMistake;
}

function getInformationAboutWord(theWord) {
	for (i=0; i<wordsArray.length; i++){
		var el = wordsArray[i];
		if (el.word == theWord)
			return el;
	}
}

function getWordsFromWordsArray() {
	var result = [];
	for (i=0; i<wordsArray.length; i++){
		result.push(wordsArray[i].word);
	}
	return result;
}

function setWordsClass() {
	var cyrillicText = document.getElementById('cyrillicText');
	for (n=0; n<cyrillicText.childNodes.length; n++){
		var node = cyrillicText.childNodes[n];
		var word = node.textContent;
		if (wordBelongsToWordsArray(word)){
			if (getTypeOfWord(word) == 'unknownWord' && getInformationAboutWord(word)['smallMistake'] == true) {
				addClassToNode(node,'wordWithSmallMistakeClass');	
			}
			else {
				var newClass = getTypeOfWord(word)+"Class";
				addClassToNode(node,newClass);		
			}
			
		}
	}
}

function getNewWords() {
	var cyrillicText = document.getElementById('cyrillicText');
	var wordsToCheck = [];
	var wordsInCyrillicTextPanel = getArrayOfWordsFromCyrillicTextPanel();
	for (n=0; n < wordsInCyrillicTextPanel.length; n++) {
		var word = wordsInCyrillicTextPanel[n];

		if (wordBelongsToWordsArray(word)) 
			continue;	// word was checked before
		else 
			wordsToCheck.push(word);	
	}

	return wordsToCheck;	
}

function addWordToWordsArray(word_, typeOfWord_) {
	wordsArray.push({word: word_, typeOfWord: typeOfWord_});
}

function getObjectFromWordsArrayWithWord(word) {
	for (i=0; i<wordsArray.length; i++){
		if (wordsArray[i]['word'] == word)
			return wordsArray[i];
	}
}

function getValueForKnownWords() {
	return "knownWord";
}

function getValueForUnknownWords() {
	return "unknownWord";
}

function getValueForPartiallyKnownWords() {
	return "partiallyKnownWord";
}

function getValueForWordsWithSmallMistake() {
	return "wordWithSmallMistake";
}

function getArrayOfWordsFromCyrillicTextPanel() {
	var wordsArr = [];
	for(i=0; i<r.childNodes.length; i++){
		
		if (r.childNodes[i].classList.contains("word"))
			wordsArr.push(r.childNodes[i].textContent);	

	}
	return wordsArr;
}