<?
require("../php/config.php");
require("../php/connect.php");

//retrieve our data from POST
$realname = $_POST['realname'];
$realsurname = $_POST['realsurname'];
$username = $_POST['username'];
$pass1 = $_POST['pass1'];
$pass2 = $_POST['pass2'];
if($pass1 != $pass2)
    header('Location: index.php');
if(strlen($username) > 30)
    header('Location: index.php');
	
//hashing
$hash = hash('sha256', $pass1);

//salt
function createSalt(){
	$string = md5(uniqid(rand(), true));
	return substr($string, 0, 3);
	};
$salt = createSalt();
$hash = hash('sha256', $salt . $hash);

//sanitize username
$username = mysql_real_escape_string($username);
$query = "INSERT INTO Users ( username, password, salt, realname, realsurname )
        VALUES ( '$username' , '$hash' , '$salt' , '$realname' , '$realsurname' );";
mysql_query($query);

echo $query;

mysql_close($link);
?>
