<?
session_start();
require("config.php");
require("connect.php");

$username = $_GET['u'];
$password = $_GET['p'];
//connect to the database here
$username = mysql_real_escape_string($username);
$query = mysql_query("	SELECT username, password, salt
						FROM Users
						WHERE username = '$username';");
						
$loginResult="valid";

$userData = mysql_fetch_assoc($query);
$hash = hash('sha256', $userData['salt'] . hash('sha256', $password) );
if($hash != $userData['password']) //incorrect password
{
    $loginResult="wrongPass";
}
if(mysql_num_rows($query) < 1) //no such user exists
{
    $loginResult="noUser";
}
if($loginResult=="valid"){
	$_SESSION['valid'] = 1;
	$_SESSION['user'] = $userData["username"];
}

$jsonreturn ='
	{"loginResult":"' . $loginResult . '",
	"returnCode":"' . $userData["username"] . '"}
';


print $jsonreturn;

mysql_close($link);
?>
