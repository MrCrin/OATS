<?
require("config.php");
require("connect.php");

$sid = $_GET[sid];
$a = $_GET[a];
$s = $_GET[s];
$tc = mysql_real_escape_string($_GET[tc]);
$t = $_GET[t];
$l = mysql_real_escape_string($_GET[l]);
$li = mysql_real_escape_string($_GET[li]);
$e = mysql_real_escape_string($_GET[e]);
$h = mysql_real_escape_string($_GET[h]);

$result = mysql_query("UPDATE Assessment SET teacher='$t', teacherComment='$tc', ncLevel='$l', ncLevelImp='$li', effort='$e', homework='$h', updated=NOW() WHERE Student_idStudent='$sid' AND subjectArea='$s' AND assessmentArea='$a' AND deleted IS NULL");         
if (mysql_affected_rows()==0) {
    $result = mysql_query("INSERT INTO Assessment (Student_idStudent, assessmentArea, subjectArea, teacherComment, teacher, ncLevel,  ncLevelImp, effort,  homework, created) VALUES ('$sid', '$a', '$s', '$tc', '$t', '$l', '$li', '$e', '$h', NOW())");
}

echo $result;

mysql_close($link);
?>
