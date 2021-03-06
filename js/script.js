 /*

Author:Michael Crinnion

All custom JavaScript is in this file and is copyright Michael Crinnion

The code is fully annotated so other people might be able fix it when stuff goes wrong and I'm half way around the world on my jollies. I'm looking at you Joe.

*/

//This defines the function then sets a height for the #main div based on the total height of the window minus the header and footer
dynamicPositioning = function() {
    var windowHeight = ($(window).height() - 121);
    $('#main').css("height", (windowHeight + 'px'));
    var multiActionButtonsRightPos = (($(window).width() / 2) - 420);
    $('#saveAll').css("right", (multiActionButtonsRightPos + 'px'));
    $('#expandAll').css("right", (multiActionButtonsRightPos + 'px'));
    $('#collapseAll').css("right", (multiActionButtonsRightPos + 'px'));
    $('#printAll').css("right", (multiActionButtonsRightPos + 'px'));
    var errorTrayRightPos = (($(window).width() / 2) - 100);
    $('#errorTray').css("right", (errorTrayRightPos + 'px'));
    var loadingTrayRightPos = (($(window).width() / 2) - 100);
    $('#loadingTray').css("right", (loadingTrayRightPos + 'px'));
    if (($(window).width() <= 1050)) {
        $('header').fadeOut(100);
        $('#user').css('left', '50px')
    } else {
        $('header').delay(450).fadeIn(100);
        $('#user').css('left', '460px')
    }
}

containerArray =  new Array;
positionArray =  new Array;
floatingHeaderArray =  new Array;

//Everything below here waits for the document to be ready
$(document).ready(function() {
	//Declare usercode here so it's available globally
	var $userCode;
	
	//Set the usercode from the session variable
	$.get('php/fetchSessionUserCode.php', function(data) {
		userCode = data;
		$("#user").html(userCode);
	});
	
	//Create logout button
	$('#main').append('<div id="logout"></div>"');
	$('#logout').click(function() {
		loadMessage = "Logging out...";
		$.get('php/logout.php', function(data) {
    		location.reload();
		});
	});
	
	//New login system now means these should fade in immediatly on page load; legacy code is commented out further down (for now)
	$("ul.menu").fadeIn(100);
    $("#user").fadeIn(100);
	
	//Fancy Box
	$(".changelog").fancybox({
		maxWidth	: 800,
		maxHeight	: 600,
		fitToView	: false,
		width		: '70%',
		height		: '70%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'fade',
		closeEffect	: 'fade'
	});
	
	//Unix timestamp in seconds for appending URL's in order to prevent caching.
	timestamp = Math.round(+new Date()/1000);	

    //Header click 'home' effect by reloading page body asynchronously - Unsuprisingly not working properly in IE
	//REMOVED IN VERSION 0.1.0 TO MAKE WAY FOR NEW LOGOUT BUTTON IN BOTTOM RIGHT CORNER.
//    $("header").click(function() {
//        loadMessage = "Cleaning up...";
//        areaCode = "";
//        subjectCode = "";
//        assessCmtArray = "";
//        assessEffArray = "";
//        assessLvlArray = "";
//        tabSelector = "";
//        userCode = "";
//        $.ajax({
//            url: "",
//            context: document.body,
//            success: function(s, x) {
//                $(this).html(s);
//            }
//        });
//    });
	
	//Enable Spell Checker
	enableSpellCheck = function() {
      $('.inputAssessComment').spellAsYouType();
	};	
	
	//Delete assessment function
	deleteAssessment = function(delAssID,event){
		$("#loadingLightshade").fadeIn(400);
		loadMessage = "Deleting..."
		$("#main").append('<div id="dialogConfirm">Are you sure you want to delete this assessment?</div>');
		$("#dialogConfirm").dialog({
			buttons: [{
					text: "Delete",
					draggable: false,
					resizeable: false,
					click: function(){
						$.post('php/deleteOneAssessment.php?did=' + delAssID, function(result){
							if (result == 1) {
								loadMessage = "Deleted"
								$(event).parent("li").delay(200).slideUp(500).delay(500).remove();
							} else {
							}
						});
						$(this).dialog("close")
					;}				
				},{
					text: "Leave it",
					draggable: false,
					click: function(){
						$("#loadingLightshade").fadeOut(400);
						$(this).dialog("close")
					}
				}
			]
			});
	}
	
	//Function to create marking Teacher Stats Tab
	createTeacherStatsTab = function(){
		$('#mainContent').append('<div id="teacherStatsTab></div>"');
		$.getJSON("php/countMarkingPerTeacher.php", function(data) {
			$.each(data, function(key, val) {
				$('#teacherStatsTab').append(val.teacher + ' : ' + val.teacherCount);
			});
		});
	}
	
	createTeacherStatsTab();
	
	//Kludge code to allow averaging functions to work in IE8 and below (probably temporary)
	if (!Array.prototype.indexOf) { 
		Array.prototype.indexOf = function(obj, start) {
			 for (var i = (start || 0), j = this.length; i < j; i++) {
				 if (this[i] === obj) { return i; }
			 }
			 return -1;
		}
	}
	
	//Functions for mapping NC Levels to Numbers and visa versa for averaging and stuff
	valueMatrix = new Array("1C","1B","1A","2C","2B","2A","3C","3B","3A","4C","4B","4A","5C","5B","5A","6C","6B","6A","7C","7B","7A","8C","8B","8A");
	levelToNumber = function(level){
		return (valueMatrix.indexOf(level))+1;
	}
	numberToLevel = function(number){
		return valueMatrix[number-1];
	}
	
	//Calculates an average level for a given student from a given number of past assessments and appends the div "avg(id)" which must exist in the DOM already.
	averageLevel = function(id, n){//id = id of student, n = number of past assessments to use
		var avgLevel = 0;
		var noLevels = 0;
		var url = 'php/previousLevels.php?sid=' + id + '&n=' + n;
		$.getJSON(url, function(data) {
			$.each(data, function(key, val) {
				if(val.ncLevel!="XX"){
					//Find average level
					avgLevel = avgLevel + levelToNumber(val.ncLevel);
					noLevels = noLevels + 1;
				}
			});
			avgLevel = Math.round(avgLevel/noLevels);
			avgLevel = numberToLevel(avgLevel);
			var div = '#avg' + id;
			$(div).append(avgLevel);
		});
	};
		
	//Tab building function 
	buildTabs = function(url, id){
		$.getJSON(url, function(data) {		
			if (($.isEmptyObject(data))) {
			//Something to do with a student which has no previous assessments?
			} else {
				var cardSelector = '#' + id;
				var prevAssListSelector = '#previousAssessments' + id;
				$(cardSelector).append(
				'<ul class="previousAssessments" id="previousAssessments' + id + '"></ul>'
				);
				$.each(data, function(key, val) {
					if (val.updated != null) {
						prevUpdateString = $.format.date(val.updated, "ddd dd MMM yyyy @ hh:mm a");
					} else {
						prevUpdateString = "Never"
					}
					//Add delete button only to tabs created by current user
					if(val.teacher==userCode){
						deleteButton = '<div class="deleteButton" onClick="deleteAssessment(' + val.idAssessment + ',this)">delete</div>';
					} else {
						deleteButton = '';
					}
					if(val.ncLevelImp){
						$(prevAssListSelector).append(
						'<li class="previousAssessTab collapsed" id="prevTab' + val.idAssessment + '">' + 
						deleteButton + 
						'<div class="prevTeacher">' + val.teacher + ' </div>' + 
						'<div class="prevLvlCur">' + val.ncLevelImp + '</div>' + 
						'<div class="prevLvlOld">(' + val.ncLevel + ')</div>' + 
						'<div class="prevEff">' + val.effort + '</div>' + 
						'<div class="prevHwk">' + val.homework + '</div>' + 
						'<div class="prevArea" onClick="toggleTab(this)">' + val.assessmentArea + '</div>' + 
						'<div class="prevCreated">First Created: ' + $.format.date(val.created, "ddd dd MMM yyyy @ hh:mm a") + ' </div>' + 
						'<div class="prevUpdated">Last Updated: ' + prevUpdateString + ' </div>' + 
						'<div class="prevSubject">' + val.subjectArea + '</div>' + 
						'<div class="prevComment">' + val.teacherComment + '</div>' + 
						'</li>')
					} else {
						$(prevAssListSelector).append(
						'<li class="previousAssessTab collapsed" id="prevTab' + val.idAssessment + '">' + 
						deleteButton + 
						'<div class="prevTeacher">' + val.teacher + ' </div>' + 
						'<div class="prevLvlCur">' + val.ncLevel + '</div>' + 
						'<div class="prevEff">' + val.effort + '</div>' + 
						'<div class="prevHwk">' + val.homework + '</div>' + 
						'<div class="prevArea" onClick="toggleTab(this)">' + val.assessmentArea + '</div>' + 
						'<div class="prevCreated">First Created: ' + $.format.date(val.created, "ddd dd MMM yyyy @ hh:mm a") + ' </div>' + 
						'<div class="prevUpdated">Last Updated: ' + prevUpdateString + ' </div>' + 
						'<div class="prevSubject">' + val.subjectArea + '</div>' + 
						'<div class="prevComment">' + val.teacherComment + '</div>' + 
						'</li>')
					}
					tabSelector = "#prevTab" + val.idAssessment
					$(tabSelector).slideDown(300);
				});
			}
		});
	}
	
	toggleTab = function(event) { //Triggered by onClick attribute on tabs in HTML
		if($(event).parent("li").hasClass("collapsed")){
		$(event).parent("li").switchClass("collapsed","expanded");
		} else {
		$(event).parent("li").switchClass("expanded","collapsed");
		}
	}

    //Autocomplete search box with names and forms
    $("#searchBoxOATS").autocomplete({
        source: "php/search.php",
        minLength: 2,
		appendTo: '#searchMenu',
        select: function(event, ui) {
            log(ui.item ? 
            "Selected: " + ui.item.value + " aka " + ui.item.id : 
            "Nothing selected, input was " + this.value);
        }
    });

    //Set defaults for validation plugin
    $.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    //Adds regex as a validation method in forms
    $.validator.addMethod("regex", 
    
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, "Please check your input.");

    //Loading message
    loadMessage = "";

    //Ajax Listeners and Popups
    $(document).ajaxStart(function() {
        $("#loadingTray").html(loadMessage);
        $("#loadingTray").slideDown(200);
        $("#loadingLightshade").fadeIn(400);
    
    });
    $(document).ajaxStop(function() {
        $("#loadingLightshade").fadeOut(400);
        $("#loadingTray").fadeOut(500, function() {
            loadMessage = "";
            $("#loadingTray").html(loadMessage);
        });
    });
    $(document).ajaxError(function() {
        alert("Ooops! :( \nSome of the data may not have loaded correctly. \nTry reloading the page. ");
    });
	
    //This fetches a JSON object via a PHP script which queries the database and returns a JSON encoded object
    loadMessage = "Loading class lists...";
    $.getJSON('php/listClasses.php', function(data) {
        $.each(data, function(key, val) {
            //The object is then looped through and each class name in the object is appended to each of the top menus
            $('#print').append('<div class="menuOption" id="' + val.techClass + '" >' + val.techClass + '</div>');
            $('#mark').append('<div class="menuOption" id="' + val.techClass + '" >' + val.techClass + '</div>');
            $('#view').append('<div class="menuOption" id="' + val.techClass + '" >' + val.techClass + '</div>');
        });
    });
	
	//Some tings for the search function, which is buggy on IE
	//This autosubmits the selected value, it might be the use of timeouts that's messing things up in IE
	$('#search').bind( "autocompleteselect", function(event, ui) {
		window.setTimeout(function(){$('#search').submit();},200);
		window.setTimeout(function(){$('#searchBoxOATS').val("");},300);
	});
	//This stops people hitting enter and sumbitting half an entry
	$('.noEnterSubmit').keypress(function(e){
    	if ( e.which == 13 ) return false;
   		 //or...
    	if ( e.which == 13 ) e.preventDefault();
	});
	//This clears the search box when it receives focus
	$("#searchBoxOATS").focus(function(){
		$("#searchBoxOATS").val("");
    });
	
	//Expand all / Collapse all tabs functions
	collapseAll = function(){
		$(".expanded").children(".prevArea").click().trigger(scroll);
	}
	expandAll = function(){
		$(".collapsed").children(".prevArea").click().trigger(scroll);
	}
	//Print all function
	printAll = function(){
		var currentURL = $(location).attr('href');
		var w = window.open();
		var pf = $("#printFriendly").html();
		var ts = new Date().getTime()
		//$(w.document.head).html('<link rel="stylesheet" href="' + currentURL + 'css/printView.css">'); 
		$(w.document.head).html('<link rel="stylesheet" href="' + currentURL + 'css/printView.css?' + ts + '">'); //Testing version
		$(w.document.body).html(pf);//printFriendly is a global variable that is updated from inside the each loop in the view section
		w.print();
	}
	
    //This is the main man, this function waits for clicks in the menu and then calls and displays the appropriate data in the #main div	
    $(".menuContent").click(function(event) {
		
        //Set the action type from the menu that was used
        actionIntent = $(event.target).parent(".menuContent").attr("id");
		groupCode = $(event.target).attr("id");
		yearCode = groupCode.split("",1);
		//alert ("Year group selected is " + yearCode[0]);
        $("#mainTitle").fadeOut(200);
        //Make scroll bar innvisible
        $(".multiChoice").remove();
        $("#errorTray").fadeOut(200);
        //Create array object's for collecting inputted information;
        assessCmtArray = new Array();
        assessLvlArray = new Array();
        assessLvlImpArray = new Array();
        assessEffArray = new Array();
        assessHwkArray = new Array();
        //This clears the #main of all html
        $('#mainContent').html("");
        $('#subjectSelect').remove();
        $('#mainContent').fadeOut(0);
        $('#action').fadeOut(0);
        $('#subject').fadeOut(0);
        $('#area').fadeOut(0);
		//Create a hidden div to hold print friendly version of content for view mode.
		//$('#mainContent').append('<div id="printFriendly"></div>'); //Taken out as not working as expected and creating duplicates in view mode
        //Switch statement to determine which menu was used and generate the appropriate HTML
        switch (actionIntent) {
            case "mark":
                $('#mainContent').append('<div id="saveAll">Save All</div>');
                //Add this later to stop people leaving without saving
                //$(window).bind('beforeunload', function(){
                //	return '>>>>>Before You Go<<<<<<<< \n Your custom message go here';
                //});
                $('#main').append('<div class="multiChoice" id="subjectSelect">' + '<div class="boxTop">Subject</div>' + '<ul>' + '<li title="RM Project 1">RM Project 1</li>' + '<li title="RM Project 2">RM Project 2</li>' + '<li title="Textiles">Textiles</li>' + '<li title="Food Tech">Food Tech</li>' + '<li title="Cad Cam">Cad Cam</li>' + '<li title="Building Crafts">Building Crafts</li>' + '</ul>' + '</div>');
                $('#subjectSelect').fadeIn(300);
                $("#subjectSelect li").hover(
					function() {
						subjectCode = $(this).attr("title");
						$('#subject').html('> ' + $(this).text());
						$(this).attr("title", "");
					}, 
					function() {
						$(this).attr("title", subjectCode);
					}
				);
                $("#subjectSelect li").click(function() {
                    $("#subjectSelect").fadeOut(100, function() {
                        $("#subjectSelect").remove()
                    });
					//alert ("Year group selected is still " + yearCode[0]);
                    $("#subject").fadeIn(100);
					switch (yearCode[0]) {
						case "7":
							//alert ("Loading menu for year " + yearCode[0]);
							$('#main').append('<div class="multiChoice" id="areaSelect">' + '<div class="boxTop">Area</div>' + '<ul>' + '<li title="Innovation">Innovation</li>' +'<li title="Something">Something</li>' + '<li title="Anotherthing">Anotherthing</li>' + '<li title="Lastthing">Lastthing</li>' + '</ul>' + '</div>');
						break;
						default:
							//alert ("Loading default menu");
							$('#main').append('<div class="multiChoice" id="areaSelect">' + '<div class="boxTop">Area</div>' + '<ul>' + '<li title="Research">Research</li>' +'<li title="Specification">Specification</li>' + '<li title="Ideas">Ideas</li>' + '<li title="Development">Development</li>' + '<li title="Planning">Planning</li>' + '<li title="Making">Making</li>' + '<li title="Evaluation">Evaluation</li>' + '</ul>' + '</div>');
						break;
						};
                    $("#areaSelect").delay(100).fadeIn(100);
                    $("#areaSelect li").hover(
                    
                    function() {
                        areaCode = $(this).attr("title");
                        $('#area').html('> ' + $(this).text());
                        $(this).attr("title", "");
                    }, 
                    
                    function() {
                        $(this).attr("title", areaCode);
                    });
                    $("#areaSelect li").click(function() {
                        $("#areaSelect").fadeOut(50, function() {
                            $("#areaSelect").remove()
                        });
                        $("#area").fadeIn(100);
                        $("#mainContent").fadeIn(0);
                        //This fetches a JSON object via a PHP script which queries the database and returns a JSON encoded object, the PHP script is passed a class variable which is set by the menu option which was clicked
                        loadMessage = "Loading data for " + event.target.id;
                        $.getJSON('php/oneFullClass.php?techClass=' + event.target.id, function(data) {
                            $('#mainTitle').fadeOut(0);
                            $('#action').html('You are ' + actionIntent + 'ing ' + event.target.id);
                            $('#action').fadeIn(300);
                            $('#mainTitle').fadeIn(300);
                            dynamicPositioning();
                            $.each(data, function(key, val) {
                                $('#mainContent').append(
                                '<div class="studentContainer studentMark" id="' + val.idStudent + '">' + 
                                '<div class="studentName">' + val.name + ' ' + val.surname + ' - (' + val.form.substr(0, 1) + '/' + val.form.substr(1, 2) + ')</div>' + 
                                '<div class="studentTarget"> Target: <strong>' + val.target + '</strong></div>' + 
                                '<form id="form' + val.idStudent + '">' + 
                                '<textarea disabled="" maxlength="480" id="inputAssessComment' + val.idStudent + '" name="commentField" class="inputAssessComment"></textarea>' + 
                                '<label class="inputAssessLevelLabel">Level:</label>' + 
                                '<input disabled="" type="text" maxlength="2" id="inputAssessLevel' + val.idStudent + '" name="levelField" class="inputAssessLevel"></input>' + 
                                '<label class="inputAssessEffortLabel">Effort:</label>' + 
                                '<input disabled="" type="text" maxlength="2" id="inputAssessEffort' + val.idStudent + '" name="effortField" class="inputAssessEffort"></input>' + 
                                '<label class="inputAssessLevelImprovedLabel">New Level:</label>' + 
                                '<input disabled="" type="text" maxlength="2" id="inputAssessLevelImproved' + val.idStudent + '" name="levelImpField" class="inputAssessLevelImproved"></input>' + 
                                '<label class="inputHomeworkLabel">Hwk:</label>' + 
                                '<input disabled="" type="text" maxlength="2" id="inputHomework' + val.idStudent + '" name="levelHomework" class="inputHomework"></input>' + 
								'</form>' + 
                                '<div id="save' + val.idStudent + '" class="save">Save</div>' + 
                                '<div id="editableBy' + val.idStudent + '" class="editableBy"></div>' + 
                                '<div id="saveInProg' + val.idStudent + '" class="saveInProg"></div>' + 
                                '</div>');
                                $(".studentContainer").hide().each(function(i) {
                                    $(this).delay(i * 50).slideDown(300).fadeIn(500);
                                });
                                //Set some variable for use in the currentAssess JSON loop
                                var thisTextBox = "#inputAssessComment" + val.idStudent, 
                                thisLevelBox = "#inputAssessLevel" + val.idStudent, 
                                thisEffortBox = "#inputAssessEffort" + val.idStudent,
                                thisLevelImpBox = "#inputAssessLevelImproved" + val.idStudent, 
                                thisHomework = "#inputHomework" + val.idStudent, 
								thisEditableBy = "#editableBy" + val.idStudent;
                                //Get previous assessment data for this card and load the data into the relevant fields
                                $.getJSON('php/currentAssess.php?sid=' + val.idStudent + '&a=' + areaCode + '&s=' + subjectCode + '&t=' + userCode, function(data) {
                                    if (($.isEmptyObject(data))) {
											$(thisTextBox).removeAttr("disabled");
											$(thisLevelBox).removeAttr("disabled");
											$(thisEffortBox).removeAttr("disabled");
											$(thisHomework).removeAttr("disabled");
                                    } else {
										if(userCode==data[data.length-1].teacher){
											$(thisTextBox).fadeOut(200,function(){$(thisTextBox).val(data[data.length-1].teacherComment).removeAttr("disabled").fadeIn(200);});
											$(thisLevelBox).fadeOut(200,function(){$(thisLevelBox).val(data[data.length-1].ncLevel).removeAttr("disabled").fadeIn(200);});
											$(thisEffortBox).fadeOut(200,function(){$(thisEffortBox).val(data[data.length-1].effort).removeAttr("disabled").fadeIn(200);});
											$(thisHomework).fadeOut(200,function(){$(thisHomework).val(data[data.length-1].homework).removeAttr("disabled").fadeIn(200);});
											if(data){
												$(thisLevelImpBox).fadeOut(200,function(){$(thisLevelImpBox).val(data[data.length-1].ncLevelImp).removeAttr("disabled").fadeIn(200);});
											}
										} else {
											$(thisTextBox).fadeOut(200,function(){$(thisTextBox).val(data[data.length-1].teacherComment).attr("disabled", "disabled").fadeIn(200);});
											$(thisLevelBox).fadeOut(200,function(){$(thisLevelBox).val(data[data.length-1].ncLevel).attr("disabled", "disabled").fadeIn(200);});
											$(thisEffortBox).fadeOut(200,function(){$(thisEffortBox).val(data[data.length-1].effort).attr("disabled", "disabled").fadeIn(200);});
											$(thisHomework).fadeOut(200,function(){$(thisHomework).val(data[data.length-1].homework).attr("disabled", "disabled").fadeIn(200);});
											var thisEditableByStr = 'Only editable by ' + data[data.length-1].teacher;
											$(thisEditableBy).html(thisEditableByStr).delay(400).fadeIn(500);
										}
                                    }
                                });
                                //Get previous assessments for this student and build tabs
								buildTabs('php/previousAssess.php?sid=' + val.idStudent + '&s=' + subjectCode + '&a=' + areaCode, val.idStudent);
                            });
							$('.inputAssessComment, .inputAssessLevel, .inputAssessLevelImproved, .inputAssessEffort, .inputHomework').bind("keydown focus keyup change", function(event) {
                                currentStudentID = $(event.target).closest("div").attr("id");
                                saveSelector = "#save" + currentStudentID;
                                assessCmtSelecter = "#inputAssessComment" + currentStudentID;
                                assessCmtArray[currentStudentID] = $(assessCmtSelecter).val();
                                assessLvlSelecter = "#inputAssessLevel" + currentStudentID;
                                assessLvlArray[currentStudentID] = $(assessLvlSelecter).val().toUpperCase();
                                assessLvlImpSelecter = "#inputAssessLevelImproved" + currentStudentID;
                                assessLvlImpArray[currentStudentID] = $(assessLvlImpSelecter).val().toUpperCase();
                                assessEffSelecter = "#inputAssessEffort" + currentStudentID;
                                assessEffArray[currentStudentID] = $(assessEffSelecter).val().toUpperCase();
                                assessHwkSelecter = "#inputHomework" + currentStudentID;
                                assessHwkArray[currentStudentID] = $(assessHwkSelecter).val().toUpperCase();
                                $(saveSelector).fadeIn(100);
                                unsaved = $(".save:visible").length;
                                if (unsaved >= 2) {
                                    $('#saveAll').fadeIn(100);
                                }
                            //Wrote this to fix a problem which was more easily solved another way, leaving it here as an option, it clears the contents of error fields when you click on them.
                            //var	errorSelect = "input#inputAssessLevel" + currentStudentID + ".inputAssessLevel.error, input#inputAssessEffort" + currentStudentID + ".inputAssessEffort.error";
                            //$(errorSelect).click(function () {
                            //	$(errorSelect).val("");
                            //});
                            });
                            $('.inputAssessComment, .inputAssessLevel, .inputAssessLevelImproved, .inputAssessEffort, .inputHomework').bind("blur", function(event) {
                                if (assessCmtArray[currentStudentID] == [] && assessLvlArray[currentStudentID] == [] && assessEffArray[currentStudentID] == [] && assessHwkArray[currentStudentID] == []) {
                                    $(saveSelector).fadeOut(100, function() {
                                        unsaved = $(".save:visible").length;
                                        if (unsaved <= 1) {
                                            $('#saveAll').fadeOut(100);
                                        }
                                    });
                                }
                            });
                            $(".save").click(function(event) {
                                var currentStudentID = $(event.target).parent("div").attr("id");
                                var currentForm = "#form" + currentStudentID;
                                //Form validation using jQuery validate plugin (ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js)
                                $(currentForm).validate({
                                    rules: {
                                        //Use regex to only allow valid National Curriculum Levels from 1C to 8A
                                        levelField: {
                                            regex: "[1-8][a-cA-C]|\\bxx\\b|\\bXX\\b",
                                            required: true,
                                            minlength: 2
                                        },
                                        levelImpField: {
                                            regex: "[1-8][a-cA-C]|\\bxx\\b|\\bXX\\b",
                                            required: false,
                                            minlength: 2
                                        },
                                        //Use regex to only allow valid effort grades in the range UN, IM, GD, EX
                                        effortField: {
                                            regex: "\\bun\\b|\\bUN\\b|\\bim\\b|\\bIM\\b|\\bgd\\b|\\bGD\\b|\\bex\\b|\\bEX\\b|\\bxx\\b|\\bXX\\b",
                                            required: true,
                                            minlength: 2
                                        },
                                        //Use regex to only allow valid homework grades in the range UN, IM, GD, EX
                                        homeworkField: {
                                            regex: "\\bun\\b|\\bUN\\b|\\bim\\b|\\bIM\\b|\\bgd\\b|\\bGD\\b|\\bex\\b|\\bEX\\b|\\bxx\\b|\\bXX\\b",
                                            required: true,
                                            minlength: 2
                                        },
                                        commentField: {
                                            required: true,
                                            minlength: 2,
                                            maxlength: 480
                                        }
                                    },
                                    messages: {
                                        levelField: {
                                            regex: 'Please enter a valid level for this student',
                                            required: 'Please enter a level for this student',
                                            minlength: 'Please enter a valid level for this student'
                                        },
                                        levelImpField: {
                                            regex: 'Please enter a valid level for this student',
                                            required: 'Please enter a level for this student',
                                            minlength: 'Please enter a valid level for this student'
                                        },
                                        effortField: {
                                            regex: 'Please enter a valid effort grade for this student',
                                            required: 'Please enter an effort grade for this student',
                                            minlength: 'Please enter a valid effort grade for this student'
                                        },
                                        homeworkField: {
                                            regex: 'Please enter a valid effort grade for this student',
                                            required: 'Please enter an effort grade for this student',
                                            minlength: 'Please enter a valid effort grade for this student'
                                        },
                                        commentField: {
                                            required: 'Please enter an AFL comment for this student',
                                            minlength: 'Please enter an AFL comment for this student',
                                        },
                                    },
                                    errorPlacement: function(error) {
                                        $("#errorTray").html("Please fill out all highlighted boxes correctly before saving.");
                                    }
                                });
                                if (($(currentForm).valid()) == true) {
                                    $(event.target).fadeOut(100);
                                    var saveInProgSelector = "#saveInProg" + currentStudentID;
                                    $(saveInProgSelector).fadeIn(50);
                                    loadMessage = "Saving data...";
                                    $.post('php/insertOneAssessment.php?sid=' + currentStudentID + '&a=' + areaCode + '&s=' + subjectCode + '&tc=' + assessCmtArray[currentStudentID] + '&t=' + userCode + '&l=' + assessLvlArray[currentStudentID]  + '&li=' + assessLvlImpArray[currentStudentID] + '&e=' + assessEffArray[currentStudentID] + '&h=' + assessHwkArray[currentStudentID], function(result) {
                                        if (result == 1) {
                                            $(saveInProgSelector).delay(200).fadeOut(500);
                                            unsaved = $(".save:visible").length;
                                            if (unsaved < 3) {
                                                $('#saveAll').fadeOut(100);
                                            }
                                        } else {
											alert("Save did not complete.");
                                            $(event.target).fadeIn(0);
                                            $(saveInProgSelector).fadeOut(0);
                                            //$.validator.resetForm(currentForm);
                                        }
                                    });
                                } else {
                                    $("#errorTray").dequeue();
                                    $("#errorTray").slideDown(200);
                                    $("#errorTray").delay(4000).fadeOut(200);
                                }
                                ;
                            });
                            $("#saveAll").click(function() {
                                $(".save:visible").click();
                            });
                        });
                    });
                });
				//enableSpellCheck();
                break;
            case "view":
                $("#mainContent").fadeIn(0);
                $("#printFriendly").html("");				
				//var balloonInst = new Balloon({
				//	stackHeaders: false,
				//	scrollView: document.getElementById('main')
				//});
                //This fetches a JSON object via a PHP script which queries the database and returns a JSON encoded object, the PHP script is passed a class variable which is set by the menu option which was clicked
                currentClassView = event.target.id;
				loadMessage = "Loading data for " + event.target.id;
                $.getJSON('php/oneFullClass.php?techClass=' + event.target.id, function(data) {
                    $('#mainTitle').fadeOut(0);
                    $('#action').html('You are ' + actionIntent + 'ing ' + event.target.id);
                    $('#action').fadeIn(300);
                    $('#mainTitle').fadeIn(300);
					scrollTopDisplay = $("#main").scrollTop();
					$('#mainContent').append('<div id="scrollTopDisplay"></div>')
                    dynamicPositioning();
                    $.each(data, function(key, val) {
						var thisPosition = positionArray[0]
                        $('#mainContent, #printFriendly').append(
                        '<div class="studentContainer studentView" id="' + val.idStudent + '">' +
                        '<div class="studentName" id="floatingHeader' + val.idStudent + '" >' + val.name + ' ' + val.surname + ' - (' + val.form.substr(0, 1) + '/' + val.form.substr(1, 2) + ')</div>' + 
                        '<div class="studentAvg" id="avg' + val.idStudent + '"> Avg: </div>' +  
                        '<div class="studentTarget"> Target: <strong>' + val.target + '</strong></div>' +  
                        '</div>');
						averageLevel(val.idStudent,4);
                        $(".studentContainer").hide().each(function(i) {
							//$(this).slideDown(0);
                            $(this).delay(i * 50).slideDown(300).fadeIn(500);
                        })
						//balloonInst.inflate('floatingHeader1');
                        //Get previous assessments for this student and build tabs
						buildTabs('php/allPreviousAssess.php?sid=' + val.idStudent, val.idStudent);
                    });
                });
				
                $('#mainContent').append('<div id="expandAll" onClick="expandAll()">Expand</div>');
                $('#mainContent').append('<div id="collapseAll" onClick="collapseAll()">Collapse</div>');
                //$('#mainContent').append('<div id="printAll" onClick="printAll()">Print</div>');
				dynamicPositioning();
				$('#expandAll').delay(300).fadeIn(300);
				$('#collapseAll').delay(300).fadeIn(300);
				$('#printAll').delay(300).fadeIn(300);
                break;
            case "print":
				$('#main').append('<div class="multiChoice" id="subjectSelect">' + '<div class="boxTop">Subject</div>' + '<ul>' + '<li title="RM Project 1">RM Project 1</li>' + '<li title="RM Project 2">RM Project 2</li>' + '<li title="Textiles">Textiles</li>' + '<li title="Food Tech">Food Tech</li>' + '<li title="Cad Cam">Cad Cam</li>' + '<li title="Building Crafts">Building Crafts</li>' + '</ul>' + '</div>');
				$('#subjectSelect').fadeIn(300);
				$("#subjectSelect li").hover(
				
				function() {
					subjectCode = $(this).attr("title");
					$('#subject').html('> ' + $(this).text());
					$(this).attr("title", "");
				}, 
				
				function() {
					$(this).attr("title", subjectCode);
				});
				$("#subjectSelect li").click(function() {
					$("#subjectSelect").fadeOut(100, function() {
						$("#subjectSelect").remove()
					});
					$("#subject").fadeIn(100);
					$('#main').append('<div class="multiChoice" id="areaSelect">' + '<div class="boxTop">Area</div>' + '<ul>' + '<li title="Research">Research</li>' + '<li title="Ideas">Ideas</li>' + '<li title="Specification">Specification</li>' + '<li title="Development">Development</li>' + '<li title="Planning">Planning</li>' + '<li title="Making">Making</li>' + '<li title="Evaluation">Evaluation</li>' + '</ul>' + '</div>');
					$("#areaSelect").delay(100).fadeIn(100);
					$("#areaSelect li").hover(
					
					function() {
						areaCode = $(this).attr("title");
						$('#area').html('> ' + $(this).text());
						$(this).attr("title", "");
					}, 
					
					function() {
						$(this).attr("title", areaCode);
					});
					$("#areaSelect li").click(function() {
						$("#areaSelect").fadeOut(50, function() {
							$("#areaSelect").remove()
						});
						$('#action').html('You are ' + actionIntent + 'ing ' + event.target.id);
						$('#action').fadeIn(300);
						$("#area").fadeIn(100);
						$("#mainContent").fadeIn(0);
						$('#mainTitle').fadeIn(300);
						window.open('php/printClass.php?c=' + event.target.id + '&s=' + subjectCode + '&a=' + areaCode + '&'  + timestamp);
					});
				});
                break;
			case "rank":
				$('#main').append('<div class="multiChoice" id="subjectSelect">' + '<div class="boxTop">Subject</div>' + '<ul>' + '<li title="RM Project 1">RM Project 1</li>' + '<li title="RM Project 2">RM Project 2</li>' + '<li title="Textiles">Textiles</li>' + '<li title="Food Tech">Food Tech</li>' + '<li title="Cad Cam">Cad Cam</li>' + '<li title="Building Crafts">Building Crafts</li>' + '</ul>' + '</div>');
				$('#subjectSelect').fadeIn(300);
				$("#subjectSelect li").hover(
				
				function() {
					subjectCode = $(this).attr("title");
					$('#subject').html('> ' + $(this).text());
					$(this).attr("title", "");
				}, 
				
				function() {
					$(this).attr("title", subjectCode);
				});
				$("#subjectSelect li").click(function() {
					$("#subjectSelect").fadeOut(100, function() {
						$("#subjectSelect").remove()
					});
					$("#subject").fadeIn(100);
					$('#main').append('<div class="multiChoice" id="areaSelect">' + '<div class="boxTop">Area</div>' + '<ul>' + '<li title="Research">Research</li>' + '<li title="Ideas">Ideas</li>' + '<li title="Specification">Specification</li>' + '<li title="Development">Development</li>' + '<li title="Planning">Planning</li>' + '<li title="Making">Making</li>' + '<li title="Evaluation">Evaluation</li>' + '</ul>' + '</div>');
					$("#areaSelect").delay(100).fadeIn(100);
					$("#areaSelect li").hover(
					
					function() {
						areaCode = $(this).attr("title");
						$('#area').html('> ' + $(this).text());
						$(this).attr("title", "");
					}, 
					
					function() {
						$(this).attr("title", areaCode);
					});
					$("#areaSelect li").click(function() {
						$("#areaSelect").fadeOut(50, function() {
							$("#areaSelect").remove()
						});
						$('#action').html('You are ' + actionIntent + 'ing ' + event.target.id);
						$('#action').fadeIn(300);
						$("#area").fadeIn(100);
						$("#mainContent").fadeIn(0);
						$('#mainTitle').fadeIn(300);
						window.open('php/printClass.php?c=' + event.target.id + '&s=' + subjectCode + '&a=' + areaCode + '&'  + timestamp);
					});
				});
                break;
        }
    
    });

    //Div positioning
    $(window).resize(dynamicPositioning);
    dynamicPositioning();
    
    //$("#userSelect li").hover(
//    
//    function() {
//        userCode = $(this).attr("title");
//        $("#user").html(userCode);
//        $(this).attr("title", "");
//    }, 
//    
//    function() {
//        $(this).attr("title", userCode);
//    });
//    
//    $("#userSelect li").click(function() {
//        $("#userSelect").fadeOut(100, function() {
//            $("#userSelect").remove()
//        });
//        $("ul.menu").fadeIn(100);
//        $("#user").fadeIn(100);
//    });

    //Search function executed when hitting enter on the search box
    $('#search').submit(function() {
        $("#mainContent").fadeIn(0);
        searchedValue = $('#searchBoxOATS').val()
        namesSeperate = searchedValue.split(" ");
        //This fetches a JSON object via a PHP script which queries the database and returns a JSON encoded object, the PHP script is passed a class variable which is set by the menu option which was clicked
        loadMessage = "Loading data for " + namesSeperate[0];
        $.getJSON('php/oneStudent.php?ss=' + searchedValue, function(data) {
            $('#mainTitle').fadeOut(0);
            $('#action').html('You are viewing ' + searchedValue);
            $('#action').fadeIn(300);
            $('#mainTitle').fadeIn(300);
            dynamicPositioning();
            $.each(data, function(key, val) {
                $('#mainContent').append(
                '<div class="studentContainer studentView" id="' + val.idStudent + '">' + 
                '<div class="studentName">' + val.name + ' ' + val.surname + ' - (' + val.form.substr(0, 1) + '/' + val.form.substr(1, 2) + ')</div>' + 
                '<div class="studentTechClass">' + val.techClass + '</div>' + 
                '<div class="studentTarget"> Target: <strong>' + val.target + '</strong></div>' + 
                '</div>');
                $(".studentContainer").hide().each(function(i) {
                    $(this).delay(i * 50).slideDown(300).fadeIn(500);
                });
                //Get previous assessments for this student and build tabs
				buildTabs('php/allPreviousAssess.php?sid=' + val.idStudent, val.idStudent);
            });
        });
    });
});