<?
require("config.php");
require("connect.php");

$ss = $_GET['ss'];
$ss = str_replace(" ","%",$ss);
$ss = str_replace("-","%",$ss);
$ss = $ss."%";

$sth = mysql_query("SELECT * FROM `Student` WHERE lcase(concat(`name`,`surname`)) LIKE '$ss' OR lcase(concat(`surname`,`name`)) LIKE '$ss'");

$rows = array();
while($r = mysql_fetch_assoc($sth)) {
    $rows[] = $r;
}
print json_encode($rows);

mysql_close($link);
?>
