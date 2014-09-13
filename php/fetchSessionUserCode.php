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

print($_SESSION['user']);

?>