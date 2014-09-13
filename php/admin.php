<?
$dbServer = "localhost";
$dbUsername = "cl40-techass13";
$dbPassword = "12qwas";
$dbSelect = "cl40-techass13";
$con = mysqli_connect($dbServer, $dbUsername, $dbPassword, $dbSelect );
$subjectGet = $_GET[sg];
$areaGet = $_GET[ag];
$subjectPut = $_GET[sp];
$areaPut = $_GET[ap];
if (!$con) {
    die('Could not connect: ' . mysqli_error());
}
$getLastMarks = "SELECT * FROM Assessment WHERE assessmentArea='$areaGet' AND subjectArea='$subjectGet' AND teacher='MCr'";
$resultMarks = mysqli_query($con,$getLastMarks);
while ($row = mysqli_fetch_array($resultMarks, MYSQL_ASSOC)) {
	$id=$row[Student_idStudent];   
	$level=$row[ncLevel];
	$effort=$row[effort];
	switch($areaPut){
		case "Research":
			if($level[0]==2){			
				$comment = "";
			}else if($level[0]==3){
				$comment = "You have found images beyond the classroom. You are able to explain how these could be used. You can produce simple research data to use in your design work.";
			}else if($level[0]==4){
				$comment = "You use ideas from others. Your research gives some important technical information for your specification. You can produce analysis that is related to the design task.";
			}else if($level[0]==5){
				$comment = "You have shown research from two sources independently. You can analyse your research. You can gather user opinions.";
			}else if($level[0]==6){
				$comment = "You show an understanding of production processes which would be used in industry. Your research shows trends and patterns in the design of similar products. You consider primary and secondary users. You use ICT to display results.";
			}else if($level[0]==7){
				$comment = "You analyse form and function of other peoples design work. You can apply my understanding of form and function. You apply the conclusions from your research to show how your ideas fit the target market using ICT.";
			}
			break;
		case "Specification":
			if($level[0]==2){			
				$comment = "";
			}else if($level[0]==3){
				$comment = "You can write a basic 7-10 point specification. Your specification is appropriate to the task. Your specification includes at least 2 measurable points.";
			}else if($level[0]==4){
				$comment = "Your specification includes 3 appropriate measurable points within a 10 point spec. Your specification has some users views included. Your specification is mostly relevant.";
			}else if($level[0]==5){
				$comment = "Your specification has 10-15 points and has been done mostly independently. You can produce a specification that includes 5 important measurable points. All other points are relevant to the design task.";
			}else if($level[0]==6){
				$comment = "Your specification has been done independently and relates to your analysed research. Your specification includes client feedback. Your specification will be 12-15 relevant points, 8 of which are measurable.";
			}else if($level[0]==7){
				$comment = "Your specification has at least 15 points with the majority measurable. Client input/feedback is clearly evident. You have clear evidence of specification points derived from appropriate research.";
			}
			break;
		case "Planning":
			if($level[0]==2){			
				$comment = "";
			}else if($level[0]==3){
				$comment = "You can select the correct tools and equipment for the main manufacture of your work. You can think ahead about an order of work and re-arrange it. You can plan ahead with some help.";
			}else if($level[0]==4){
				$comment = "You can plan ahead without help. Your planning will show correct tools and equipment.  You can make simple changes to the making with limited help.";
			}else if($level[0]==5){
				$comment = "You can plan using a flow chart and include timings. You can plan to include health and safety procedures You include simple Quality Control points in your plans.";
			}else if($level[0]==6){
				$comment = "You can plan ahead without teacher input Quality assurance will be added to your planning. Your practical shows obvious evidence that planning has occurred.";
			}else if($level[0]==7){
				$comment = "You are able to overcome problems in manufacturing. You can produce a full flow chart with accurate timings. You can produce suitable contingency planning in advance of practical tasks.";
			}
			break;
		case "Evaluation":
			if($level[0]==2){			
				$comment = "";
			}else if($level[0]==3){
				$comment = "You can identify what is working well and what could be improved. You can think about your specification and say where it is successful and not. You can say/document where your product does/doesnt fit your specification and why.";
			}else if($level[0]==4){
				$comment = "You can reflect upon your design work in writing. You can identify what is working well or not. You can compare the final product with the main points of the specification.";
			}else if($level[0]==5){
				$comment = "You can test your product. You can comment upon your specification points. You can suggest the main changes you would need to make in the future.";
			}else if($level[0]==6){
				$comment = "You have evaluated your product in use and gained user feedback. You have identified a number of key weaknesses and suggested improvements.";
			}else if($level[0]==7){
				$comment = "You can select appropriate techniques to evaluate how your product performs. You explain how you solved any technical problems. Your final product is fully functional and made with precision.";
			}
			break;
	}
	$insertNewMarks = "INSERT INTO Assessment (Student_idStudent, assessmentArea, subjectArea, teacherComment, teacher, ncLevel, effort, created) VALUES ('$id', '$areaPut', '$subjectPut', '$comment', 'MCr', '$level', '$effort', NOW())";
	$resultInsert=mysqli_query($con,$insertNewMarks);
	if ($resultInsert) {
	  printf("SUCCESSFULL ADMIN ADJUSTMENT ON RECORD: " . $row[Student_idStudent] . ",\n");
	} else {
	  printf("UNSUCCESSFULL ADMIN ADJUSTMENT ON RECORD: " . $row[Student_idStudent] . ",\n");
	  die('Error: ' . mysqli_error($con));
	}
}

mysql_close($con);
?>
