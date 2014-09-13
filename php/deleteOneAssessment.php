<?
require("config.php");
require("connect.php");

$did = $_GET[did];

$result = mysql_query("UPDATE Assessment SET deleted=NOW() WHERE idAssessment='$did'");         

echo $result;

mysql_close($link);
?>
