
function test()
{
	alert("test");
}

function checkWords()
{
	var textArea = document.getElementById("cyrillicText");
	if (textArea.value != "jan")
	{
		textArea.style.color='grey';
		textArea.style.textDecoration="underline";
	}
	else 
	{
		textArea.style.color='black';
		textArea.style.textDecoration="none";
	}
}


function loadTranslation(str)
{
	if (str=="")
	{
		document.getElementById("txtHint").innerHTML="";
		return;
	}
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else 
	{
		xhtpp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.onreadystatechange=function() 
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			document.getElementById("txtHint").innerHTML=xhttp.responseText;
		}	
	}
	xhttp.open("GET","getLemkoWord.php?q="+str+"&call=getLemkoWord",true);
	xhttp.send();
}


function loadTranslationjQuery(str) 
{
	$.ajax({
		type: "GET",
		url: "getLemkoWord.php?q="+str,
		data: "call=getLemkoWord",
		dataType: "text",
		success: function(response){
			var textArea = document.getElementById('cyrillicText');
			if (response.slice(-4).indexOf("ok") > -1){
				textArea.style.color='black';
				textArea.style.textDecoration="none";
			} else {
				textArea.style.color='grey';
				textArea.style.textDecoration="underline";
			}
			document.getElementById("txtHint").innerHTML=response;

		}
	});

}