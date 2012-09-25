<?
$link = mysql_connect('localhost', 'web86-techassess', '12qwas');
if (!$link) {
    die("fail");
}

mysql_select_db("web86-techassess", $link);

$sid = $_GET[sid];
$a = $_GET[a];
$s = $_GET[s];
$tc = mysql_real_escape_string($_GET[tc]);
$t = $_GET[t];
$l = mysql_real_escape_string($_GET[l]);
$e = mysql_real_escape_string($_GET[e]);

$result = mysql_query("UPDATE Assessment SET teacher='$t', teacherComment='$tc', ncLevel='$l', effort='$e', updated=NOW() WHERE Student_idStudent='$sid' AND subjectArea='$s' AND assessmentArea='$a' AND deleted IS NULL");         
if (mysql_affected_rows()==0) {
    $result = mysql_query("INSERT INTO Assessment (Student_idStudent, assessmentArea, subjectArea, teacherComment, teacher, ncLevel, effort, created) VALUES ('$sid', '$a', '$s', '$tc', '$t', '$l', '$e', NOW())");
}

echo $result;

mysql_close($link);
?>
