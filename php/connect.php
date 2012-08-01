<?

//$dbServer, $dbUsername, $dbPassword and $dbSelect are all defined in config.php

$link = mysql_connect($dbServer, $dbUsername, $dbPassword);
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

mysql_select_db($dbSelect, $link);

?>