<?php
  if($_SERVER['REQUEST_METHOD']=="GET") 
  {
    $function = $_GET['call'];
    if(function_exists($function)) {        
        call_user_func($function);
    } else {
        echo 'Function Not Exists!!';
    }
  }
  function otherFunc()
  {
    echo "other function called";
  }


  // this function is searching for words having given part - $searchingString - in their content
  function getLemkoWord()
  {
  // Nawiązanie połączenia, wybór bazy danych
  $dbconn = pg_connect("host=localhost dbname=slownik user=postgres password=postgres") or die('Nie można nawiązać połączenia: ' . pg_last_error());
  // Wykonanie zapytania SQL
  $searchingString = $_GET['q'];
  $typeOfQuery = $_GET['typeOfQuery'];
  // $query = "SELECT base_form FROM terms WHERE terms.polish_translation ='".$searchingString."'";
  if ($typeOfQuery == "partOfWord") {
    // $query = "SELECT DISTINCT(base_form) FROM terms WHERE lower(terms.base_form) like LOWER('".$searchingString."%') limit 5;";
    // $query = "SELECT DISTINCT(word) FROM term_word_associations WHERE lower(word) like LOWER('".$searchingString."%') limit 5;";
    $query = "SELECT word FROM words_lem_app WHERE lower(word) like LOWER('".$searchingString."%') order by CHAR_LENGTH(word) limit 5;";
  } 
  else if ($typeOfQuery == "existenceOfWord") {
    // $query = "SELECT count(*) FROM terms WHERE lower(terms.base_form) = LOWER('".$searchingString."');";
    // $query = "SELECT count(*) FROM term_word_associations WHERE lower(word) = LOWER('".$searchingString."');";
    $query = "SELECT count(*) FROM words_lem_app WHERE lower(word) = LOWER('".$searchingString."');";
  }
  else {
    $query = "SELECT DISTINCT(base_form) FROM terms WHERE lower(terms.base_form) like LOWER('".$searchingString."%') limit 5;";
  }

  $result = pg_query($query) or die('Nieprawidłowe zapytanie: ' . pg_last_error());

  // Wyświetlenie wyników w postaci HTML
  echo "<table id='promptsTable'>\n";
  $i = 0;
  while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
      $i++;
      echo "\t<tr>\n";
      foreach ($line as $col_value) {
        $lastVal = $col_value;
        echo "\t\t<td>$col_value</td>\n";
      }
      echo "\t</tr>\n";
      if ($i > 10) 
      {
        break;
      }
  }
  echo "</table>\n";

  // this value point that we have found translation in db
  if ($i > 0 and $lastVal > 0) 
    echo "ok";

  // Zwolnienie zasobów wyniku zapytania
  pg_free_result($result);

  // Zamknięcie połączenia
  pg_close($dbconn);
  }  
?>

