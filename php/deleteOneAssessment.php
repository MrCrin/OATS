<?
$link = mysql_connect('localhost', 'web86-techassess', '12qwas');
if (!$link) {
    die("fail");
}

mysql_select_db("web86-techassess", $link);

$did = $_GET[did];

$result = mysql_query("UPDATE Assessment SET deleted=NOW() WHERE idAssessment='$did'");         

echo $result;

mysql_close($link);
?>
