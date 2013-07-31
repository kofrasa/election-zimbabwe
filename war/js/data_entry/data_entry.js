$(document).ready(function(){
	console.log(role);
	
	if(role == 'ADMIN'){
		loadUserList(null);
	}else{
		$('#navUser').hide();		
		loadNav($('#navPollingStation'));
		$('#navPollingStation').closest('li').addClass('active');
	}
	
	$('#deleteUser').on('shown', function(){
		  $('#deleteUser .text-error').text($('#data-table tbody tr.selected td:nth-child(1)').html());		  
	 });
	 
	 $('#editUser').on('shown', function(){
		  $('#editUser .inputEmail').val($('#data-table tbody tr.selected td:nth-child(1)').html());
		  
		  setValueOfDropDown('#editUser .dropdown-menu li a', $('#data-table tbody tr.selected td:nth-child(2)').html());	  
		  
	 });
	 
	 $('#btnDeleteResult').click(function() {
		 var postData = {id:$('.polling_result table tbody tr.selected').attr('data-id'), action:'DELETE',
				 polling_station: $('#data-table .pollingstation tbody tr.selected').attr('data-id')};
		 console.log(postData);
		 $.ajax({
			 type: 'POST',
			 url: "/result",
			 data: postData,
			 dataType: "json",
			 success: function(data){
				console.log(data);
			    renderResults($('.'+$('#data-table .pollingstation tbody tr.selected').attr('data-id')), data);
			 },
			 failure: function(xhr, errMsg) {
			    alert(errMsg);
			 }
		 });
		 
		 $('#deletePollingResult').modal('hide');
	});
	 
	 $('#overrideCandidateResult').on('shown', function(){
		  $('#overrideCandidateResult .candidate').html($('#data-table .constituencies tbody tr.selected td:nth-child(1)').html());
		  $('#overrideCandidateResult .party').html($('#data-table .constituencies tbody tr.selected td:nth-child(2)').html());
		  $('#overrideCandidateResult .constituency').html($('#c-constituency-filter .dropdown-menu li a.selected').html());
		  $('#overrideCandidateResult .current_result').html($('#data-table .constituencies tbody tr.selected td:nth-child(3)').html());	  
		  
	 });
	 
	  $('.sidebar-nav li').not('.nav-header').click(function(){
		  removeActiveOnTab();
		  $(this).addClass('active');
		  
		  loadNav($(this));
	  });
	  
	  $('#filter .users .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#filter .users .dropdown-menu li a');
			$(this).addClass('selected');			
			loadUserList($(this).attr('value'));
	  });
	  
	  
	  $('#btnApproveResult').click(function(){
		  var postData = {approved_by:$('#user-id').html(), id:$('.polling_result table tbody tr.selected').attr('data-id'), 
				  action:'APPROVE', polling_station: $('#data-table .pollingstation tbody tr.selected').attr('data-id') };
		  
		 console.log(postData);
		 $.ajax({
			 type: 'POST',
			 url: "/result",
			 data: postData,
			 dataType: "json",
			 success: function(data){
				console.log(data);
			    renderResults($('.'+$('#data-table .pollingstation tbody tr.selected').attr('data-id')), data);
			 },
			 failure: function(xhr, errMsg) {
			    alert(errMsg);
			 }
		 });
		 
		 $('#approvePollingResult').modal('hide');
	  });
	  
	  $('#btnOverideResult').click(function() {
		  var result = $('#overrideCandidateResult .inputResult').val();
		  var isValid = true;
			 
		 if(isTextEmpty(result) || !isNumber(result)){
			 if(!$('#overrideCandidateResult .inputResult').closest('.control-group').hasClass('error')){
				 $('<span class="help-inline">Please enter correct result</span>').insertAfter('#overrideCandidateResult .inputResult');
				 $('#overrideCandidateResult .inputResult').closest('.control-group').addClass('error');
			 }
			 
			 isValid = false;
		 }
		  
		if(isValid){
		  var postData = {id:$('#data-table .constituencies table tbody tr.selected').attr('data-id'), 
				  action:'OVERRIDE', override_result: $('#overrideCandidateResult .inputResult').val()};
		  console.log(postData);
		  
		  $.ajax({
			 type: 'POST',
			 url: "/candidate",
			 data: postData,
			 dataType: "json",
			 success: function(data){
				console.log(data);
			    renderCandidates(data);
			 },
			 failure: function(xhr, errMsg) {
			    alert(errMsg);
			 }
		 });
		  
		$('#overrideCandidateResult').modal('hide');
		}
	});
	  
	  $('#savePollingResult').click(function(){
		  var result = $('#addPollingResultForm .inputResult').val();
		  var isValid = true;
			 
		 if(isTextEmpty(result) || !isNumber(result)){
			 if(!$('#addPollingResultForm .inputResult').closest('.control-group').hasClass('error')){
				 $('<span class="help-inline">Please enter correct result</span>').insertAfter('#addPollingResultForm .inputResult');
				 $('#addPollingResultForm .inputResult').closest('.control-group').addClass('error');
			 }
			 
			 isValid = false;
		 }
		 
		 if($('#addPollingResultForm .cand .dropdown-menu .selected').length == 0){
			 if(!$('#addPollingResultForm .cand .dropdown-menu').closest('.control-group').hasClass('error')){
				 $('#addPollingResultForm .cand .dropdown-menu').closest('.control-group').addClass('error');
				 $('<span class="help-inline">Please select a candidate</span>').insertAfter('#addPollingResultForm .dropdown-menu');
			 }
			 isValid = false;
		 }
		 
		 if(isValid){
			 var postData = {entered_by:$('#user-id').html(), candidate: $('#addPollingResult .dropdown-menu li .selected').closest('li').attr('data-id'),
					 result: $('#addPollingResult .inputResult').val(), polling_station: $('#data-table .pollingstation tbody tr.selected').attr('data-id'),
					 action:'ADD'};
			 console.log(postData);
			 $.ajax({
				 type: 'POST',
				 url: "/result",
				 data: postData,
				 dataType: "json",
				 success: function(data){
					console.log(data);
				    renderResults($('.'+$('#data-table .pollingstation tbody tr.selected').attr('data-id')), data);
				 },
				 failure: function(xhr, errMsg) {
				    alert(errMsg);
				 }
			 });
		 }
		 
		 $('#addPollingResult .inputResult').val(0);
		 removeSelectedOnDropDown('#addPollingResultForm .cand .dropdown-menu li a');
		 $('#addPollingResult').modal('hide');
	  });
	    
	  
	  $('#addUser .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#addUser .dropdown-menu li a');
			$(this).addClass('selected');
	  });
	  
	  $('#editUser .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#editUser .dropdown-menu li a');
			$(this).addClass('selected');
	  });
	    
	 /* $.ajaxPrefilter(function( options, originalOptions, jqXHR ){
		options.url = 'http://www.e-peer.appspot.com' + options.url;
	  });*/
	  $('#delUser').click(function(){
		  var postData = {action:'DELETE', email:$('#data-table tbody tr.selected td:nth-child(1)').html()};
		  console.log(postData);
		 $.ajax({
			 type: 'POST',
			 url: "/user",
			 data: postData,
			 dataType: "json",
			 success: function(data){
				console.log(data);
			    renderUsers(data);
			 },
			 failure: function(xhr, errMsg) {
			    alert(errMsg);
			 }
		 });
		 
		 $('#deleteUser').modal('hide');
		 $('#btnEditUser').addClass('disabled');
		 $('#btnDeleteUser').addClass('disabled');
		 $('#btnEditUser').removeAttr('data-toggle');
		 $('#btnDeleteUser').removeAttr('data-toggle');
		 removeSelectedOnDropDown('#filter .dropdown-menu li a');		 
		 $('#filter .dropdown-menu li a').first().addClass('selected');
	  });
	  
	  
	  $('#updateUser').click( function(){		 
		  
		 var postData = {action:'EDIT', email:$('#editUser .inputEmail').val(), role: $('#editUserForm .dropdown-menu li .selected').html()};
		 console.log(postData);
		 $.ajax({
			 type: 'POST',
			 url: "/user",
			 data: postData,
			 dataType: "json",
			 success: function(data){
				console.log(data);
			    renderUsers(data);
			 },
			 failure: function(xhr, errMsg) {
			    alert(errMsg);
			 }
		 });
		 
		 $('#editUser').modal('hide');
		 $('#btnEditUser').addClass('disabled');
		 $('#btnDeleteUser').addClass('disabled');
	  });
	  
	  
	 $('#saveUser').click( function(){
		 var email = $('#addUser .inputEmail').val();
		 var name = $('#addUser .inputName').val();
		 var isValid = true;
		 
		 if(isTextEmpty(email) || !isValidEmailAddress(email)){
			 if(!$('#addUser .inputEmail').closest('.control-group').hasClass('error')){
				 $('<span class="help-inline">Please enter correct email</span>').insertAfter('#addUser .inputEmail');
				 $('#addUser .inputEmail').closest('.control-group').addClass('error');
			 }
			 
			 isValid = false;
		 }
		 
		 if(isTextEmpty(name)){
			 if(!$('#addUser .inputName').closest('.control-group').hasClass('error')){
				 $('<span class="help-inline">Please enter correct name</span>').insertAfter('#addUser .inputName');
				 $('#addUser .inputName').closest('.control-group').addClass('error');
			 }
			 
			 isValid = false;
		 }
		 
		 if($('#addUserForm .dropdown-menu .selected').length == 0){
			 if(!$('#addUserForm .dropdown-menu').closest('.control-group').hasClass('error')){
				 $('#addUserForm .dropdown-menu').closest('.control-group').addClass('error');
				 $('<span class="help-inline">Please select a role</span>').insertAfter('#addUserForm .dropdown-menu');
			 }
			 isValid = false;
		 }
		
		 
		 if(isValid){
			 var postData = {email:$('#addUser .inputEmail').val(), role: $('#addUserForm .dropdown-menu li .selected').html(),
					 name: name};
			 console.log(postData);
			 $.ajax({
				 type: 'POST',
				 url: "/user",
				 data: postData,
				 dataType: "json",
				 success: function(data){
					console.log(data);
				    renderUsers(data);
				 },
				 failure: function(xhr, errMsg) {
				    alert(errMsg);
				 }
			 });
			 
			 $('#addUser').modal('hide');
		 }
		 
			 
		 
		 
	 });
	  
	 
		
});

function renderUsers(data){
	$('#data-table').html(_.template($('#user-list-template').html(), {data: data}));
	
	$('#data-table .users tbody tr').click( function(){		
		 removeActiveOnTableRow();
		 $(this).addClass('selected');
		 $('#btnEditUser').removeClass('disabled');
		 $('#btnDeleteUser').removeClass('disabled');
		 $('#btnEditUser').attr('data-toggle', 'modal');
		 $('#btnDeleteUser').attr('data-toggle', 'modal');
	});
}

function renderPollingStations(pollingstations){
	$('#data-table').html(_.template($('#pollingstation-list-template').html(), {pollingstations: pollingstations}));
	$('#data-table .pollingstation tbody tr').not('.polling_result').click( function(){		
		$('#data-table .pollingstation tbody tr').not('.polling_result').each(function() {
			$(this).removeClass('selected');			
		});
		$('#data-table .pollingstation tbody tr.polling_result td').each(function() {
			$(this).hide();
			$(this).html('');
		});	
		 $(this).addClass('selected');
		 $('#btnAddPollingResult').removeClass('disabled')
		 	.attr('data-toggle','modal')
		 	.click(function(){
		 		var constCol = $('#data-table .pollingstation tbody tr.selected .const-col');
		 				 		
		 		loadCandidateDropDown(constCol.attr('data-id'));		 		
		 		
		 		$('#addPollingResultForm .const-val').html(constCol.html());
		 		$('#addPollingResultForm .pol-val').html( $('#data-table .pollingstation tbody tr.selected .pol-col').html());
		 	});
		 
		 	
		 
	
		 var currentRow = $('.'+$(this).attr('data-id'));		 
		 currentRow.show();	
		 currentRow.css('border', 'none');
		 currentRow.html('<div class="loading"><label>Loading...</label></div>');
		 
		 loadResults(currentRow);
	});
}

function loadResults(row){
	$.ajax({
	    url: "result?polling_station="+$('#data-table .pollingstation tbody tr.selected').attr('data-id')+"&election_type="+$('#pl-race-filter .dropdown-menu li a.selected').html(),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",	    
	    success: function(data){	
	    	console.log('result data'+data);
	    	
	    	if(data.length > 0){
	    		renderResults(row, data); 
	    	}else{
	    		row.hide();	
	    	}
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});	
}

function renderResults(row, data){
	var html = '<table class="table table-bordered" style="margin-bottom:-8px;margin-top:-8px;margin-left: 20px;-webkit-border-radius:0px;border-radius:0px;font-size: 13px;">'
		+ '<thead><tr style="cursor: default;"><th>Entered By</th><th>Candidate</th><th>Party</th>'
		+ '<th>Result</th><th>Approved By</th></tr><tbody>';
	if (typeof data === 'object') {	    		
		$.each(data, function(k, v) {
			if(data.length <= 0){
				row.hide();
				return;
			}
			
			if(v.approved){
				html = html + '<tr data-id='+v.id+' class="success">';
			}else{
				html = html + '<tr data-id='+v.id+'>';
			}
			html = html + '<td>'+v.enteredBy+'</td><td>'+v.candidateName+'</td><td>'+v.party+'</td>'
				+'<td>'+v.result+'</td>'
				
				if(!isTextEmpty(v.approvedBy)){
					html = html + '<td>'+v.approvedBy+'</td></tr>';
				}else{
					html = html + '<td></td></tr>';
				}
		});	    		
	}
	html = html + '</tbody></table>';
	
	row.html(html);
	row.show();
	
	$('.polling_result table tbody tr').click( function(){		
		$('.polling_result table tbody tr').each(function() {
			$(this).removeClass('selected');			
		});
		$(this).addClass('selected');
		if(role != 'DATA_ENTRY'){
			$('#btnApprovePollingResult').removeClass('disabled')
				.attr('data-toggle', 'modal');		
			$('#btnDeletePollingResult').removeClass('disabled')
		 		.attr('data-toggle','modal');
		}
	});

}

function loadUserList(role){
	var call;
	if(isTextEmpty(role)){
		call = "/user";
	}else{
		call = "/user?role="+role;
	}
	$.ajax({
	    url: call,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",	    
	    success: function(data){
	    	renderUsers(data);	    	
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});	
	$('#btnEditUser').addClass('disabled');
	 $('#btnDeleteUser').addClass('disabled');
	 $('#btnEditUser').removeAttr('data-toggle');
	 $('#btnDeleteUser').removeAttr('data-toggle');
}

function loadPollingStationData(province, constituency, ward){
	var call = null;
	if(!(isTextEmpty(province) || province == null)){		
		call = "/pollingstation?province="+province;
	}
	if(!(isTextEmpty(constituency) || constituency == 'ALL')){		
		if(call == null){
			call = "/pollingstation?constituency="+constituency;
		}else{
			call = call + "&constituency="+constituency;
		}
	}
	if(!(isTextEmpty(ward) || ward == 'ALL')){		
		if(call == null){
			call = "/pollingstation?ward="+ward;
		}else{
			call = call + "&ward="+ward;
		}
	}
	
	if(call == null){
		call = "/pollingstation";
	}
	$.ajax({
	    url: call,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    beforeSend: function(){
            $("#main-loading-indicator").show();
        },
	    success: function(pollingstations){
	    	renderPollingStations(pollingstations);
	    	$("#main-loading-indicator").hide();
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});	
	
}

function loadCandidateDropDown(constituency){
	$.ajax({
	    url: "/candidate?constituency=" + constituency+"&election_type="+$('#pl-race-filter .dropdown-menu li a.selected').html(),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(data){	    	
	    	var html = '<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px; height:123px; overflow-y:scroll\">';
	    	if (typeof data === 'object') {	    		
	    		$.each(data, function(k, v) {	    			
	    			html = html + '<li data-id='+v.id+'><a tabindex=\"-1\" href=\"#\">'+ v.name +' ('+v.party+')</a></li>';
	    		});	    		
	    	}
	    	html= html+'</ul>';
	    	$('#addPollingResultForm .cand .dropdown').html(html);
	    	
	    	$('#addPollingResultForm .cand .dropdown-menu li a').click( function(){
			  	removeSelectedOnDropDown('#addPollingResultForm .cand .dropdown-menu li a');
				$(this).addClass('selected');			
				//loadUserList($(this).attr('value'));
			});
	    	
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});
}

function getConstituencyData(){	
	$.ajax({
	    url: "/constituency",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    beforeSend: function(){
            $("#pl-constituency-dd-loading-indicator").show();
        },
	    success: function(data){	
	    	var html = '<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px; height:123px; overflow-y:scroll\">'
				+'<li><a tabindex=\"-1\" class=\"selected\" href=\"#\">ALL</a></li>';
	    	if (typeof data === 'object') {
	    		
	    		$.each(data, function(k, v) {
	    			html = html + '<li><a data-id='+v.id+' tabindex=\"-1\" href=\"#\">'+ v.name +'</a></li>';
	    		})
	    		
	    	}
	    	html= html+'</ul>';
	    	$('#pl-constituency-filter').html(html);
	    	$("#pl-constituency-dd-loading-indicator").hide();
	    	
	    	$('#pl-constituency-filter .dropdown-menu li a').click( function(){
			  	removeSelectedOnDropDown('#pl-constituency-filter .dropdown-menu li a');
				$(this).addClass('selected');	
				loadPollingStationData($('#pl-province-filter .dropdown-menu li a.selected').attr('data-id'),
						$('#pl-constituency-filter .dropdown-menu li a.selected').attr('data-id'), 
						$('#pl-ward-filter .dropdown-menu li a.selected').html());
				//loadUserList($(this).attr('value'));
			});
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});		
}

function loadConstituencies(province) {
	$.ajax({
	    url: "/constituency?province="+province,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(data){
	    	var html = '<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px; height:123px; overflow-y:scroll\">';
	    	if (typeof data === 'object') {
	    		
	    		$.each(data, function(k, v) {
	    			if(k == 0){
	    				html = html + '<li><a class="selected" data-id='+v.id+' tabindex=\"-1\" href=\"#\">'+ v.name +'</a></li>';
	    			}else{
	    				html = html + '<li><a data-id='+v.id+' tabindex=\"-1\" href=\"#\">'+ v.name +'</a></li>';
	    			}
	    		});
	    		
	    	}
	    	html= html+'</ul>';
	    	$('#c-constituency-filter').html(html);
	    	
	    	$('#c-constituency-filter .dropdown-menu li a').click( function(){
			  	removeSelectedOnDropDown('#c-constituency-filter .dropdown-menu li a');
				$(this).addClass('selected');			
				loadCandidates($('#c-constituency-filter .dropdown-menu li a.selected').attr('data-id'),
						$('#c-race-filter .dropdown-menu li a.selected').html());
			});
	    	
	    	loadCandidates($('#c-constituency-filter .dropdown-menu li a.selected').attr('data-id'),
					$('#c-race-filter .dropdown-menu li a.selected').html());
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});		
}



function removeActiveOnTableRow(){
	 $('#data-table .users tbody tr').each(function() {		 
		$(this).removeClass('selected');		
	});
}

function removeActiveOnTab(){
	 $('.sidebar-nav li').not('.nav-header').each(function() {
		$(this).removeClass("active");		
	});
}


function removeSelectedOnDropDown(selector){
	 $(selector).each(function() {
		$(this).removeClass("selected");		
	});
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

function isTextEmpty(str) {
    return (!str || 0 === str.length);
}

function setValueOfDropDown(selector, value){
	$(selector).each(function (){
		if($(this).html() == value){
			removeSelectedOnDropDown('#editUser .dropdown-menu li a');
			$(this).addClass('selected');			
		}		
	})
}

function loadCandidates(constituency, electionType){
	$.ajax({
	    url: "/candidate?constituency="+constituency+"&election_type="+electionType,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(data){
	    	renderCandidates(data);
	    },
	    failure: function(errMsg) {
	        alert(errMsg);
	    }
	});	
}

function renderCandidates(data){
	$('#data-table').html(_.template($('#candidate-list-template').html(), {data: data}));
	
	$('#data-table .constituencies table tbody tr').click( function(){		
		$('#data-table .constituencies table tbody tr').each(function() {
			$(this).removeClass('selected');			
		});
		$(this).addClass('selected');
		$('#btnOverrideResult').removeClass('disabled')
			.attr('data-toggle', 'modal');
		
	});
}

function loadNav(nav){	
	if(nav.html().indexOf('Users') >= 0){
		$('#filter').html('<div class="users">'
				+'<label style=\"display: inline-block; vertical-align: top; margin-right: 15px;\">By Province:</label>'
				+'<div style=\"display: inline-block;\" class=\"dropdown clearfix\">'
				+'<ul class="dropdown-menu" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px;\">'
				+'<li><a tabindex=\"-1\" class=\"selected\" href=\"#\">ALL</a></li>'
				+'<li><a tabindex="-1" href=\"#\">ADMIN</a></li>'
				+'<li><a tabindex="-1" href=\"#\">DATA_ENTRY</a></li>'
				+'<li><a tabindex="-1" href=\"#\">SUPERVISOR</a></li>'                
				+'</ul>'
				+'</div>'
				+'</div>');
		
		$('.btn-toolbar').html('<a data-toggle="modal" href="#addUser" class="btn btn-primary" id="btnAddUser">Add</a>'
				+'<a href="#editUser" class="btn btn-warning disabled" id="btnEditUser">Edit</a>'
				+'<a href="#deleteUser" class="btn btn-danger disabled" id="btnDeleteUser">Delete</a>');
		
		loadUserList(null);
		
		$('#filter .users .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#filter .users .dropdown-menu li a');
			$(this).addClass('selected');			
			loadUserList($(this).html());
	  });
		
	}else if(nav.html().indexOf('Polling Stations') >= 0){
		$('#data-table').html('<div id="main-loading-indicator" style="display: none;">'
					+'<label>Loading...</label>'
					+'</div>');
		loadPollingStationData(null);
		
		$('#filter').html(pollingStationFilterHTML());
		
		$('.btn-toolbar').html('<a href="#addPollingResult" class="btn btn-primary disabled" id="btnAddPollingResult">Add</a>'
				+'<a href="#deletePollingResult" class="btn btn-danger disabled" id="btnDeletePollingResult">Delete</a>'
				+'<a style="float: right" href="#approvePollingResult" class="btn btn-success disabled" id="btnApprovePollingResult">Approve</a>');
		
		getConstituencyData();
		
		$('#pl-province-filter .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#pl-province-filter .dropdown-menu li a');
			$(this).addClass('selected');			
			//loadUserList($(this).attr('value'));
			loadPollingStationData($('#pl-province-filter .dropdown-menu li a.selected').attr('data-id'),
					$('#pl-constituency-filter .dropdown-menu li a.selected').attr('data-id'), 
					$('#pl-ward-filter .dropdown-menu li a.selected').html());
		});		
		
		
		$('#pl-ward-filter .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#pl-ward-filter .dropdown-menu li a');
			$(this).addClass('selected');
			
			
			loadPollingStationData($('#pl-province-filter .dropdown-menu li a.selected').attr('data-id'),
					$('#pl-constituency-filter .dropdown-menu li a.selected').attr('data-id'), 
					$('#pl-ward-filter .dropdown-menu li a.selected').html());
			//loadUserList($(this).attr('value'));
		});
		
		$('#pl-race-filter .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#pl-race-filter .dropdown-menu li a');
			$(this).addClass('selected');
			
			loadResults($('.'+$('#data-table .pollingstation tbody tr.selected').attr('data-id')));
			
			//var callpasedResult = 
			
			//loadUserList($(this).attr('value'));
		});
		
		
	}else if(nav.html().indexOf('Constituencies') >= 0){
		$('#filter').html('<div class="constituencies">'
				+'<div class="span2" style="width:180px"><label style=\"display: inline-block; vertical-align: top;\">By Race:</label>'
				+'<div style=\"display: inline-block;vertical-align: top;\" class=\"dropdown clearfix\" id=\"c-race-filter\">'
				+'<ul class="dropdown-menu" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px;vertical-align: top;\">'
				+'<li><a tabindex="-1" href=\"#\" class="selected">Presidential</a></li>'
				+'<li><a tabindex="-1" href=\"#\">House</a></li>' 
				+'</ul>'
				+'</div>'
				+'</div>'
				+'<div class="span2" style="width:200px"><label style=\"display: inline-block; vertical-align: top;\">By Province:</label>'
				+'<div style=\"display: inline-block;\" class=\"dropdown clearfix\" id=\"c-province-filter\">'
				+'<ul class="dropdown-menu" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px; height:123px; overflow-y:scroll\">'
				+'<li><a class="selected" data-id="5196850298617856" tabindex="-1" href=\"#\">Mashonaland Central</a></li>'
				+'<li><a data-id="5653972257865728" tabindex="-1" href=\"#\">Mashonaland East</a></li>'
				+'<li><a data-id="5693417237512192" tabindex="-1" href=\"#\">Matabeleland South</a></li>'
				+'<li><a data-id="5813401443893248" tabindex="-1" href=\"#\">Mashonaland West</a></li>' 
				+'<li><a data-id="5707298571812864" tabindex="-1" href=\"#\">Masvingo</a></li>'   
				+'<li><a data-id="5759800252039168" tabindex="-1" href=\"#\">Harare</a></li>'   
				+'<li><a data-id="5786738286919680" tabindex="-1" href=\"#\">Bulawayo</a></li>'   
				+'<li><a data-id="5800069865406464" tabindex="-1" href=\"#\">Midlands</a></li>'  
				+'<li><a data-id="5866452879933440" tabindex="-1" href=\"#\">Manicaland</a></li>' 
				+'<li><a data-id="5906310176440320" tabindex="-1" href=\"#\">Matebeleland North</a></li>' 
				+'</ul>'
				+'</div>'	
				+'</div>'
				+ '<div class="span2" style="width:230px"><label style=\"display: inline-block; vertical-align: top;\">By Constituency:</label>'
				+'<div style=\"display: inline-block;\" class=\"dropdown clearfix\" id=\"c-constituency-filter\">'
				+'<div id=\"pl-constituency-dd-loading-indicator\">'
				+'	<label>Loading...</label>'
				+'</div>'
				+'</div>'
				+'</div>'
				+'</div>');
		
		$('.btn-toolbar').html('<a href="#overrideCandidateResult" class="btn btn-danger disabled" id="btnOverrideResult">Override Result</a>');
		
		loadConstituencies($('#c-province-filter .dropdown-menu li a.selected').attr('data-id'));
		
		$('#c-province-filter .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#c-province-filter .dropdown-menu li a');
			$(this).addClass('selected');			
			loadConstituencies($('#c-province-filter .dropdown-menu li a.selected').attr('data-id'));			
		});
		
		$('#c-race-filter .dropdown-menu li a').click( function(){
		  	removeSelectedOnDropDown('#c-race-filter .dropdown-menu li a');
			$(this).addClass('selected');
			
			loadCandidates($('#c-constituency-filter .dropdown-menu li a.selected').attr('data-id'),
					$('#c-race-filter .dropdown-menu li a.selected').html());
		});
		
					
		
	}else{
		$('#filter').html('Under Construction');
		$('#data-table').html('');
	}
	
	function pollingStationFilterHTML(){
		var html = '<div class="pollingstation">'
			+'<div class="span2" style="width:180px"><label style=\"display: inline-block; vertical-align: top;\">By Race:</label>'
			+'<div style=\"display: inline-block;vertical-align: top;\" class=\"dropdown clearfix\" id=\"pl-race-filter\">'
			+'<ul class="dropdown-menu" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px;vertical-align: top;\">'
			+'<li><a tabindex="-1" href=\"#\" class="selected">Presidential</a></li>'
			+'<li><a tabindex="-1" href=\"#\">House</a></li>' 
			+'</ul>'
			+'</div>'
			+'</div>'
			+'<div class="span2" style="width:200px"><label style=\"display: inline-block; vertical-align: top;\">By Province:</label>'
			+'<div style=\"display: inline-block;\" class=\"dropdown clearfix\" id=\"pl-province-filter\">'
			+'<ul class="dropdown-menu" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px; height:123px; overflow-y:scroll\">'
			+'<li><a tabindex=\"-1\" class=\"selected\" href=\"#\">ALL</a></li>'
			+'<li><a data-id="5196850298617856" tabindex="-1" href=\"#\">Mashonaland Central</a></li>'
			+'<li><a data-id="5653972257865728" tabindex="-1" href=\"#\">Mashonaland East</a></li>'
			+'<li><a data-id="5693417237512192" tabindex="-1" href=\"#\">Matabeleland South</a></li>'
			+'<li><a data-id="5813401443893248" tabindex="-1" href=\"#\">Mashonaland West</a></li>' 
			+'<li><a data-id="5707298571812864" tabindex="-1" href=\"#\">Masvingo</a></li>'   
			+'<li><a data-id="5759800252039168" tabindex="-1" href=\"#\">Harare</a></li>'   
			+'<li><a data-id="5786738286919680" tabindex="-1" href=\"#\">Bulawayo</a></li>'   
			+'<li><a data-id="5800069865406464" tabindex="-1" href=\"#\">Midlands</a></li>'  
			+'<li><a data-id="5866452879933440" tabindex="-1" href=\"#\">Manicaland</a></li>' 
			+'<li><a data-id="5906310176440320" tabindex="-1" href=\"#\">Matebeleland North</a></li>'
			+'</ul>'
			+'</div>'	
			+'</div>'
			+ '<div class="span2" style="width:230px"><label style=\"display: inline-block; vertical-align: top;\">By Constituency:</label>'
			+'<div style=\"display: inline-block;\" class=\"dropdown clearfix\" id=\"pl-constituency-filter\">'
			+'<div id=\"pl-constituency-dd-loading-indicator\" style=\"display: none;\">'
			+'	<label>Loading...</label>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'<div class="span2" style="width:180px"><label style=\"display: inline-block; vertical-align: top;\">By Ward:</label>'
			+'<div style=\"display: inline-block;\" class=\"dropdown clearfix\" id=\"pl-ward-filter\">'
			+'<ul class="dropdown-menu" role=\"menu\" aria-labelledby=\"dropdownMenu\" style=\"display: block; position: static; margin-bottom: 5px; *width: 180px; height:123px; overflow-y:scroll\">'
			+'<li><a tabindex=\"-1\" class=\"selected\" href=\"#\">ALL</a></li>'
			+'<li><a tabindex="-1" href=\"#\">1</a></li>'
			+'<li><a tabindex="-1" href=\"#\">2</a></li>'
			+'<li><a tabindex="-1" href=\"#\">3</a></li>'     
			+'<li><a tabindex="-1" href=\"#\">4</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">5</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">6</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">7</a></li>'
			+'<li><a tabindex="-1" href=\"#\">8</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">9</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">10</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">11</a></li>'
			+'<li><a tabindex="-1" href=\"#\">12</a></li>'
			+'<li><a tabindex="-1" href=\"#\">13</a></li>'     
			+'<li><a tabindex="-1" href=\"#\">14</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">15</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">16</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">17</a></li>'
			+'<li><a tabindex="-1" href=\"#\">18</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">19</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">20</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">21</a></li>'
			+'<li><a tabindex="-1" href=\"#\">22</a></li>'
			+'<li><a tabindex="-1" href=\"#\">23</a></li>'     
			+'<li><a tabindex="-1" href=\"#\">24</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">25</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">26</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">27</a></li>'
			+'<li><a tabindex="-1" href=\"#\">28</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">29</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">30</a></li>'   
			+'<li><a tabindex="-1" href=\"#\">31</a></li>' 
			+'<li><a tabindex="-1" href=\"#\">32</a></li>' 
			+'</ul>'
			+'</div>'
			+'</div>'
			+'</div>';		
		
			
		return html;
	}	
	
}

function isNumber(n) {
	 return !isNaN(parseFloat(n)) && isFinite(n);
}

