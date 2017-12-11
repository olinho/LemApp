<?php
  if(isset($_POST['similarWords']) && !empty($_POST['similarWords'])) {
  	$words = $_POST['similarWords'];
    $wordWithSmallMistake = array();
    $unknownWords = array();

  	$dbconn = pg_connect("host=localhost dbname=slownik user=postgres password=postgres") or die('Nie można nawiązać połączenia: ' . pg_last_error());

    for($i=0; $i < count($words); $i++) {
      $words[$i]=mb_convert_case($words[$i], MB_CASE_LOWER, "UTF-8"); 
    }
    $arrayOfWords =  implode("','", $words);
    $query = "SELECT word from words_lem_app where lower(word) in ('".$arrayOfWords."');";
		$result = pg_query($query) or die('Nieprawidłowe zapytanie: ' . pg_last_error());
		$arrayResult = pg_fetch_all($result); // get all result's rows
    if (count($arrayResult) > 1) {
      $res = null;
    }
    else {
      $res = $arrayResult[0];
    }

		pg_free_result($result);
	  echo json_encode($res);
    // echo json_encode(array($arrayOfWords));
	  pg_close($dbconn);
  }
?>