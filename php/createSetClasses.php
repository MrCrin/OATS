<?
require("config.php");
require("connect.php");

//Query variables
$whichStudent = 0;
while($whichStudent<2000){
	$assessmentList = mysql_query("SELECT * FROM Assessment WHERE Student_idStudent='$whichStudent'");
	$studentQuery = mysql_query("SELECT * FROM Student WHERE form LIKE '7%' AND idStudent='$whichStudent'");
	
	while ($studentInfo = mysql_fetch_array($studentQuery, MYSQL_ASSOC)) {
			printf($studentInfo[name] . "," . $studentInfo[surname] . "," . $studentInfo[form] . ",");
	}
	$total=0;
	$assessmentCount=0;
	while ($rowAssessment = mysql_fetch_array($assessmentList, MYSQL_ASSOC)) {
		if($rowAssessment[ncLevel]!="XX"){$assessmentCount++;};
		switch($rowAssessment[ncLevel]){
			case "1C":
				$total = $total + 1;
				break;
			case "1B":
				$total = $total + 2;
				break;
			case "1A":
				$total = $total + 3;
				break;
			case "2C":
				$total = $total + 4;
				break;
			case "2B":
				$total = $total + 5;
				break;
			case "2A":
				$total = $total + 6;
				break;
			case "3C":
				$total = $total + 7;
				break;
			case "3B":
				$total = $total + 8;
				break;
			case "3A":
				$total = $total + 9;
				break;
			case "4C":
				$total = $total + 10;
				break;
			case "4B":
				$total = $total + 11;
				break;
			case "4A":
				$total = $total + 12;
				break;
			case "5C":
				$total = $total + 13;
				break;
			case "5B":
				$total = $total + 14;
				break;
			case "5A":
				$total = $total + 15;
				break;
			case "6C":
				$total = $total + 16;
				break;
			case "6B":
				$total = $total + 17;
				break;
			case "6A":
				$total = $total + 18;
				break;
			case "7C":
				$total = $total + 19;
				break;
			case "7B":
				$total = $total + 20;
				break;
			case "7A":
				$total = $total + 21;
				break;
		}
	}
//	if($total>0){
		printf($total . "," . $assessmentCount ."\n");
//	}
	$whichStudent++;
}

mysql_close($link);
?>
