<?	
session_start();

function logout()
{
    $_SESSION = array(); //destroy all of the session variables
    session_destroy();
}
logout();
?>