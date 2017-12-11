
QUnit.test("Tests", function(assert){
	var r = document.getElementById('cyrillicText');
	r.innerHTML = "асдасд яшдасд яшда сд яшцхзсц ашд";
	setCaretPositionInDiv(r,10);


	assert.equal(getCaretPositionInDiv(r), 10, "Correct position");
	assert.ok(availableKeys instanceof Array, "`availableKeys` variable is Array");
	assert.ok(isTheKeyAvailable('a'), "Key is available");

});
