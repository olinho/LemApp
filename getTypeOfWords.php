<?php
  if(isset($_POST['words']) && !empty($_POST['words'])) {
  	$words = $_POST['words'];
  	$res = array();
  	$knownWords = array();
  	$unknownWords = array();
  	$partiallyKnownWords = array();

  	$dbconn = pg_connect("host=localhost dbname=slownik user=postgres password=postgres") or die('Nie można nawiązać połączenia: ' . pg_last_error());
  	for ($i=0; $i < count($words); $i++) { 
  		$word = $words[$i];
  		//$query = "SELECT EXISTS(select count(*) from terms where lower(terms.base_form) = LOWER('".$word."');)";
  		//$query = "SELECT 1 from terms where lower(terms.base_form) = LOWER('".$word."');";
      $query = "SELECT 1 from words_lem_app where lower(word) = LOWER('".$word."');";
  		$result = pg_query($query) or die('Nieprawidłowe zapytanie: ' . pg_last_error());
  		$arrayResult = pg_fetch_array($result, null, PGSQL_ASSOC);
  		if ($arrayResult != false)
  			array_push($knownWords, $word);
  		// else {
  		// 	$query = "SELECT 1 FROM terms WHERE lower(terms.base_form) like LOWER('".$word."%');";
  		// 	$result = pg_query($query) or die('Nieprawidłowe zapytanie: ' . pg_last_error());
  		// 	$arrayResult = pg_fetch_array($result, null, PGSQL_ASSOC);
  		// 	if ($arrayResult != false)
  		// 		array_push($partiallyKnownWords, $word);
  		// 	else 
  		// 		array_push($unknownWords, $word);
  		// }
      else {
        array_push($unknownWords, $word);
      }
  		pg_free_result($result);
  	}
	  // echo json_encode(array("words"=>$words, "knownWords"=>$knownWords, "partiallyKnownWords"=>$partiallyKnownWords, "unknownWords"=>$unknownWords, "count"=>count($words)));
	  echo json_encode(array("knownWords"=>$knownWords, "partiallyKnownWords"=>$partiallyKnownWords, "unknownWords"=>$unknownWords));
	  pg_close($dbconn);
  }
?>