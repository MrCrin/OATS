 /*

Author:Michael Crinnion

All custom JavaScript is in this file and is copyright Michael Crinnion

The code is fully annotated so other people might be able fix it when stuff goes wrong and I'm half way around the world on my jollies. I'm looking at you Joe.

*/

$(document).ready(function() {
	
	$("#login").click(function() {
		 var username=$("#loginForm #uField").val();
		 var password=$("#loginForm #pField").val();
		 $.getJSON('php/login.php?u=' + username + '&p=' + password, function(data) {
			 if(data.loginResult=="valid"){
				 window.location.replace("/techassess/oats.php")/*<----This needs to use path variables not hardcoded urls */
			 }
			 if(data.loginResult=="wrongPass"){
				 alert("Wrong password");
			 }
			 if(data.loginResult=="noUser"){
				 alert("The user " + username + " doesn't exist.");
			 }
		 });
	});	
	
});