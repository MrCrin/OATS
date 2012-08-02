<?
require("config.php");
require("connect.php");

$ss = $_GET['term'];
$ss = str_replace(" ","%",$ss);
$ss = str_replace("-","%",$ss);
$ss = $ss."%";

$result = mysql_query("SELECT * FROM `Student` WHERE lcase(concat(`name`,`surname`)) LIKE '$ss' OR lcase(concat(`surname`,`name`)) LIKE '$ss'");

$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = array(
		label => $r[name].' '.$r[surname].' ('.substr($r[form],0,1).'/'.substr($r[form],1,2).')',
		value => $r[name].' '.$r[surname]
		);
}
print json_encode($rows);

mysql_close($link);
?>
