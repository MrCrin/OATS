<?
require("config.php");
require("connect.php");

$result = mysql_query("
	SELECT teacher, COUNT(teacher) as teacherCount 
	FROM Assessment
	GROUP BY teacher
	ORDER BY COUNT(teacher) DESC
");

$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);

mysql_close($link);
?>
