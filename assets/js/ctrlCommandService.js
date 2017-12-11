var down = {};
function actionsWithPressedCtrl() {
	$("#cyrillicText").on('keydown', function(e) {
		code = getCode(e);
	  down[code] = true;
	}).keyup(function(e) {
		code = getCode(e);
	  delete down[code];
	});
}
$("#cyrillicText").on("keyup", function(e) {
	code= getCode(e);
	if( code == 17 ){
		down[17] = false;
	}
});



