<?
session_start();

function isLoggedIn()
{
    if(isset($_SESSION['valid']) && $_SESSION['valid'])
        return true;
    return false;
}

if(!isLoggedIn())
	{
    header("Location: http://rvhs.co.uk/techassess/");//This needs to use path variables not hardcoded urls
    die();
	}
?>

<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>OATS (α 0.0.5)</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">
	<link rel="stylesheet" href="../css/style.css">
	<link rel="stylesheet" href="../css/web.css">
	<link rel="stylesheet" type="text/css" href="../fancyBox/jquery.fancybox.css">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
	<script src="../js/libs/modernizr-2.5.3.min.js"></script>
	<script src="../js/libs/jquery-1.7.1.min.js"></script>
	<script src="../js/libs/jquery-ui-1.8.22.min.js"></script>
	<script src="../js/libs/jquery.validate.min.js"></script>
	<script src="../js/libs/jquery.dateFormat-1.0.min.js"></script>
	<script src="../spellcheck/include.js"></script>
	<script src="../fancyBox/jquery.fancybox.js"></script>
	<script>window.jQuery || document.write('<script src="../js/libs/jquery-1.7.1.min.js"><\/script>')</script>
	<script src="../js/plugins.js"></script>
	<script src="../js/scriptAdmin.js"></script>
	
</head>
<body>
    <form id="register" action="registerUser.php" method="post">
    	Add new user...<br/>
        Name: <input type="text" name="realname" maxlength="30" /><br/>
        Surname: <input type="text" name="realsurname" maxlength="30" /><br/>
        Username: <input type="text" name="username" maxlength="30" /><br/>
        Password: <input type="password" name="pass1" /><br/>
        Password Again: <input type="password" name="pass2" /><br/>
        <input type="submit" value="Register" />
    </form>
</body>
</html>