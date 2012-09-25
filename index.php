<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>OATS (α 0.0.3)</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/web.css">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
	<script src="js/libs/modernizr-2.5.3.min.js"></script>
	<script src="js/libs/jquery-1.7.1.min.js"></script>
	<script src="js/libs/jquery-ui-1.8.22.min.js"></script>
	<script src="js/libs/jquery.validate.min.js"></script>
	<script src="js/libs/jquery.dateFormat-1.0.min.js"></script>
	<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
	<script src="js/plugins.js"></script>
	<script src="js/script.js"></script>
	
</head>
<body>
<div id="loadingLightshade"></div>
<div id="topnav">
	<header>Online Assessment and Tracking System <div id="build">(α 0.0.3)</div></header>
	<div id="user"></div>
	<ul class="menu">
		<li>
			<div class="menuTitle">Search</div>
			<div id="searchMenu" class="menuContent">
				<form onsubmit="return false" id="search">
					<input class="noEnterSubmit" id="searchBoxOATS" type="text">
				</form>
			</div>
		</li>
		<li>
			<div class="menuTitle">Mark</div>
			<div id="mark" class="menuContent">
			</div>
		</li>
		<li>
			<div class="menuTitle">View</div>
			<div id="view" class="menuContent">
			</div>
		</li>
		<li>
			<div class="menuTitle">Print</div>
			<div id="print" class="menuContent">
			</div>
		</li>
	</ul>
</div>
<div id="mainTitle">
<div id="action"></div>
<div id="subject"></div>
<div id="area"></div>
</div>
<div id="main">
	<div id="mainContent"></div>
	<div class="multiChoice" id="userSelect">
		<div class="boxTop">Login</div>
		<ul>
			<li title="MCr">Michael Crinnion</li>
			<li title="SDe">Sue Dean</li>
			<li title="VJa">Veryan James</li>
			<li title="OJe">Oli Jefferson</li>
			<li title="SLa">Sophie Lancaster</li>
			<li title="AMi">Annie Mitchell</li>
			<li title="ASt">Alex Stubbs</li>
		</ul>
	</div>
</div>
<div id="errorTray"></div>
<div id="loadingTray"></div>
<footer>© Michael Crinnion 2012 || <a href="changelog.txt">ChangeLog</a></footer>
  
</body>
</html>