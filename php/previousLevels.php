<?
require("config.php");
require("connect.php");

$sid = $_GET[sid];
$n = $_GET[n];

$result = mysql_query("
	SELECT ncLevel, idAssessment
	FROM Assessment
	WHERE Student_idStudent =  '$sid'
	AND deleted IS NULL 
	ORDER BY idAssessment DESC
	LIMIT 0 , $n
");

$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);

mysql_close($link);
?>
