
<?php
function translate($word)
{

	// Nawiązanie połączenia, wybór bazy danych
	$dbconn = pg_connect("host=localhost dbname=slownik user=postgres password=postgres") or die('Nie można nawiązać połączenia: ' . pg_last_error());
	// Wykonanie zapytania SQL
	$query = "SELECT base_form FROM terms WHERE terms.polish_translation LIKE '%kolega%';";
	$result = pg_query($query) or die('Nieprawidłowe zapytanie: ' . pg_last_error());

	// Wyświetlenie wyników w postaci HTML
	echo "<table>\n";
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
	    echo "\t<tr>\n";
	    foreach ($line as $col_value) {
	        echo "\t\t<td>$col_value</td>\n";
	    }
	    echo "\t</tr>\n";
	}
	echo "</table>\n";

	// Zwolnienie zasobów wyniku zapytania
	pg_free_result($result);

	// Zamknięcie połączenia
	pg_close($dbconn);
	
}

?>