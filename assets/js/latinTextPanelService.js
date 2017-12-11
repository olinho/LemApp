// function which read text in cyrillicText div and fill latinText(textarea)
// transliterated text
function transcriptCyrillicToLatin()
{
	var cyrillicText = extractLettersAndEnterFromInnerHTML();
	var latinText = '';
	var prevChar = '';
	var myagkiyZnak = chars['myagkiy znak cyr'].lower;
	var currentChar = '';
	var innerEnter = false; // points if we are in the <br> tag

	for (var item in cyrillicText)
	{
		if (cyrillicText.hasOwnProperty(item))
			currentChar = cyrillicText[item];


		if (item > 0)
			prevChar = cyrillicText[item-1];


		if (currentChar == "<") {
			innerEnter = true;
			continue;
		} else if (currentChar == ">") {
			innerEnter = false;
			latinText+="\n";
			continue;
		} else if (innerEnter) {
			continue;
		}
		else if (currentChar == " "){
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
				if(chars2[prevChar] == undefined) {
					console.log("PrevChar:"+prevChar);
					latinText+=getLatinEquivalentToCyrillic2(currentChar);
				}
				else if (chars2[prevChar].base == 'ł' || chars2[prevChar].base == 'Ł'){
					latinText = latinText.slice(0,-1) + chars2[prevChar].extended + getLatinEquivalentToCyrillic2(currentChar);
				} 
				else
					latinText+=getLatinEquivalentToCyrillic2(currentChar);
			}
			else if (prevChar == myagkiyZnak && vowelSpecialCyrillicChars.indexOf(currentChar)!=-1 && item>1) {
				prevPrevChar = cyrillicText[item-2];
				if (softCyrillicChars.indexOf(prevPrevChar) != -1) {
					latinText = latinText.slice(0,-1) + chars2[prevPrevChar].diextended + getLatinEquivalentToCyrillic2(currentChar);
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

