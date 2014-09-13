<?
require_once("../dompdf/dompdf_config.inc.php");

require("config.php");
require("connect.php");

$a = $_GET[a];
$s = $_GET[s];
$c = $_GET[c];

$html .= "<html><head><link rel='stylesheet' href='../css/print.css'><link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'></head><body>";

$result = mysql_query("SELECT * FROM Assessment, Student WHERE techClass='$c' AND subjectArea='$s' AND assessmentArea='$a' AND idStudent=Student_idStudent");

$html .= '<div class="printWrapper">';

while($r = mysql_fetch_assoc($result)) {
	$html .=
	'<div class="printContainer">'.
		'<div class="printName">'.$r[name].' '.$r[surname].'</div>'.
		'<div class="printSubject">'.$r[subjectArea].'</div>'.
		'<div class="printArea">'.$r[assessmentArea].'</div>'.
		'<div class="printTeacher">'.$r[teacher].'</div>'.
		'<div class="printLevelLabel">Level:</div>'.
		'<div class="printLevel">'.$r[ncLevel].'</div>'.
		'<div class="printEffortLabel">Effort:</div>'.
		'<div class="printEffort">'.$r[effort].'</div>'.
		'<div class="printComment">'.$r[teacherComment].'</div>'.
	'</div>'.
	'<div class="clear"></div>';
	
}

$html .= '</div></html></body>';

/*print $html;
*/
$dompdf = new DOMPDF();
$dompdf->load_html($html);
$dompdf->render();
$dompdf->stream(str_replace("/","",$c)."-".str_replace(" ","",$s)."-".$a."-".time().".pdf");


mysql_close($link);
?>
