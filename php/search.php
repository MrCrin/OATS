<?
require("config.php");
require("connect.php");

$result = mysql_query("SELECT * FROM `Student` WHERE name LIKE '$_GET[term]%' OR surname LIKE '$_GET[term]%'");

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
