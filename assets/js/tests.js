
QUnit.test("Tests", function(assert){
	r.innerHTML = "асдасд яшдасд яшда сд яшцхзсц ашд";
	setCaretPositionInDiv(r,10);


	assert.equal(getCaretPositionInDiv(r), 10, "Correct position");
	assert.ok(availableKeys instanceof Array, "`availableKeys` variable is Array");
	assert.ok(isTheKeyAvailable('a'), "Key is available");


});

QUnit.test("Test buttons", function(assert) {
	var button = document.getElementsByName('r cyr')[0];

	r.innerHTML = "асдасд яшдасд яшда с яшцхзсц ашд";
	var newPosition = 20;
	var charAtPos = r.textContent.charAt(newPosition);
	setCaretPositionInDiv(r, newPosition);
	var curPos = getCaretPositionInDiv(r);

	assert.equal(curPos, newPosition, newPosition+" Correct position setting");
	assert.notEqual(charAtPos, button.innerHTML, charAtPos+" is different from "+button.innerHTML);

	button.click();
	curPos = getCaretPositionInDiv(r);
	alert(curPos);
	assert.equal(curPos, newPosition+1, "Correct cursor move.");
	charAtPos = r.textContent.charAt(curPos-1);
	assert.equal(charAtPos, button.innerHTML, charAtPos+" is equal to "+button.innerHTML);
});