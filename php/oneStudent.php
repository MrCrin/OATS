<?
require("config.php");
require("connect.php");

$sth = mysql_query("SELECT * FROM `Student` WHERE name='$_GET[n]' AND surname='$_GET[s]'");
$rows = array();
while($r = mysql_fetch_assoc($sth)) {
    $rows[] = $r;
}
print json_encode($rows);

mysql_close($link);
?>
