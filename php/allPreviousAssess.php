<?
require("config.php");
require("connect.php");

$sid = $_GET[sid];
$a = $_GET[a];
$s = $_GET[s];
$t = $_GET[t];

$result = mysql_query("SELECT * FROM Assessment WHERE Student_idStudent='$sid' AND deleted IS NULL");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);

mysql_close($link);
?>
