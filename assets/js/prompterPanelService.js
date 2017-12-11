

// function using ajax to query psql db
function loadTranslationjQuery(str) 
{
	var curWord = '';
	if (str == undefined)
		curWord = getCurrentWordSpanText();
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
			var resp;
			console.log("Response: "+response.replace("ok",""));
			resp = response.replace("ok","");
			if (select.textContent.replace(/\s/g,'') != $($.parseXML(resp)).text().replace(/\s/g,'') ){
				// setPrompterPositionListener();
				select.innerHTML=response.replace("ok","");	
				actionsForMouseAndRows();
				if (response.slice(-4).indexOf("ok") > -1){
					// textArea.style.color='black';
					// textArea.style.textDecoration="none";
				} else {
					// textArea.style.color='grey';
				}
				// console.log(response);
			}
		}
	});
}
// set prompter position
function setPrompterPositionListener(){
	$('#cyrillicText').bind('keyup mouseup', function(e){
		setPrompterPosition();
	});
}

function setPrompterPosition() {
	if (document.getElementsByClassName(getCurWordClassName()) == undefined)
		return;
	if (document.getElementsByClassName(getCurWordClassName()).length == 0)
		return;

	var prompter = $('#prompter');
	var cyrillicText = document.getElementById('cyrillicText');
	var offsetLeftCyrillicTextPanel = cyrillicText.offsetLeft;
	var offsetTopCyrillicTextPanel = cyrillicText.offsetTop;

	var posLeft = document.getElementsByClassName(getCurWordClassName())[0].offsetLeft;
	var posTop = document.getElementsByClassName(getCurWordClassName())[0].offsetTop;
	prompter.css({
		left: offsetLeftCyrillicTextPanel +  posLeft - 10,
		top: offsetTopCyrillicTextPanel + posTop+10
	});
	prompter.show();
}

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

function actionsForMouseAndRows() {
	actionOnMouseOverRow(); // this function enable to distinct element under mouse in table
	actionOnClickMouseOnRow();
}


// hover action  has 2 functions as parameters. First is loaded
// on mouse over element and the second - on mouse outside
function actionOnMouseOverRow(){
	$("#promptsTable tr").hover(function() {
		$(this).addClass('selected-word').siblings().removeClass('selected-word');
	}, function() {
		$(this).removeClass('selected-word');
	});
}

function actionOnClickMouseOnRow() {
	$("#promptsTable tr").click(function() {
		var pos = getCaretPosition();
		var curWordLen = getCurrentWordSpanText().length;
		var startStr = getCurrentWordSpanText();
		var endStr = clearTextFromSpaces($(".selected-word").text()).substr(curWordLen);
		var choosenWord = startStr+endStr;
		insertChoosenWord(choosenWord);
		$("#promptsSelector").text("");
		$("#prompter").hide();
		// loadTranslationjQuery();
		var cyrillicText = document.getElementById('cyrillicText');
		cyrillicText.focus();
		setCaretPosition(pos+endStr.length);
		transcriptCyrillicToLatin();
	});
}

// check if prompter div is visible
function isPrompterVisible() {
	return $('#prompter').is(":visible")?true:false;
}
