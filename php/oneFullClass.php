<?
require("config.php");
require("connect.php");

$result = mysql_query("SELECT * FROM `Student` WHERE techClass='$_GET[techClass]' ORDER BY `Student`.`surname`  ASC");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);

mysql_close($link);
?>
