var origin  = window.location.origin;
var origin_admin  = origin+"/administrator";
jQuery(document).ready(function($){

	//mark badge as zero
	$(".see-notif-btn").click(function(){
        $.ajax({
		    type: "GET",
		    url: origin+"/administrator/unset-badge-count",
		    success: function(result) {	
		    	if(result.success==1){
			    	$(".see-notif-btn .label.label-primary, .notif-link-badge").hide();
			    }
		    }
		});
    });

	//validate login form
	$("#login-form").validate({
        rules: {
            email: {
                required: true,
                email: true,
                noSpace: true,
            },
            password: {
		      	required: true,
		      	noSpace: true,
                minlength: 6,
                maxlength: 15
		    }
        },
        messages :{
	        email : {
	            required : 'Fill email'
	        },
	        password : {
	            required : 'Fill password'
	        }
	    }
    });
    //validate forgot form
	$("#forgot-form").validate({
        rules: {
            email: {
                required: true,
                email: true,
                noSpace: true,
            }
        },
        messages :{
	        email : {
	            required : 'Fill email'
	        }
	    }
    });
    //validate reset form
	$("#reset-form").validate({
        rules: {
            password: {
		      	required: true,
		      	noSpace: true,
                minlength: 6,
                maxlength: 15
		    },
		    confirm_password: {
		      	required: true,
		      	noSpace: true,
                equalTo : "#password"
		    }
        },
        messages :{
	        password : {
	            required : 'Fill password'
	        },
	        confirm_password : {
	            required : 'Fill confirm password',
	            equalTo : 'Password and confirm password should be same'
	        }
	    }
    });
    //validate edit profile form
	$("#profile-form").validate({
        rules: {
            firstname: {
		      	required: true
		    },
		    lastname: {
		      	required: true
		    },
		    password: {
		      	minlength: 6,
                maxlength: 15
		    }
        },
        messages :{
	        firstname: {
		      	required: 'Fill firstname'
		    },
		    lastname: {
		      	required: 'Fill lastname'
		    }
	    }
    });
    
    //validate admin form
	$("#admin-form").validate({
        rules: {
            firstname: {
		      	required: true
		    },
		    lastname: {
		      	required: true
		    },
		    email: {
		      	required: true,
                email: true
		    },
		    password: {
		      	required: true,
		      	noSpace: true,
                minlength: 6,
                maxlength: 15
		    },
		    confirm_password: {
		      	required: true,
		      	noSpace: true,
                equalTo : "#password"
		    },
		    state: {
		      	required: true
		    }
        },
        messages :{
	        firstname: {
		      	required: 'Fill firstname'
		    },
		    lastname: {
		      	required: 'Fill lastname'
		    },
		    email: {
		      	required: 'Fill email'
		    },
		    password : {
	            required : 'Fill password'
	        },
	        confirm_password : {
	            required : 'Fill confirm password',
	            equalTo : 'Password and confirm password should be same'
	        },
	        state : {
	            required : 'Select state'
	        }
	    }
    });

    //validate admin edit form
	$("#admin-edit-form").validate({
        rules: {
            firstname: {
		      	required: true
		    },
		    lastname: {
		      	required: true
		    },
		    state: {
		      	required: true
		    }
        },
        messages :{
	        firstname: {
		      	required: 'Fill firstname'
		    },
		    lastname: {
		      	required: 'Fill lastname'
		    },
	        state : {
	            required : 'Select state'
	        }
	    }
    });

    /*** Start Private QA ***/

    //search doctors
	$("#search-doctor-btn").click(function(){
        $('.search-loader').show();
        $('table.doctors tbody').empty();
        $('table.doctors,.load-more,.search-loader-more').hide();
        $('#page-no').val('1');
        getDoctors();
    });

    //load doctors
	$("#load-more-doctors").click(function(){
        $('.search-loader-more').show();
        $('.load-more').hide();
        getDoctors();
    });

	//get doctors list
    function getDoctors(){
    	setTimeout(function(){
	    	var page = $('#page-no').val();
	    	page = parseInt(page);
	    	//doctors
		    $.ajax({
			    type: "POST",
			    url: origin+"/api/v1/data/doctors",
			    dataType:"json",
			    data: "user_id="+($("#user-id").val())+"&search="+($('#search').val())+"&page="+page,
			    success: function(result) {	
			    	$('.search-loader,.search-loader-more').hide();
			    	$('table.doctors').show();
			    	$('#page-no').val(page+1);
			    	if(result.success==1){
				    	var doctors = result.data.doctors.data;
				    	var html = '';
				    	if(doctors.length>0){
				    		if(doctors.length>4){
				    			$('.load-more').show();	    	
				    		}
				    		$.each(doctors, function( index, val) {
				    			if( val.image == null || val.image == 'undefined'){
				    				var link = origin+"/admin/img/avator48x48.png";				    				
				    			}else{
									var link = val.image;
				    			}
								html+='<tr><td><div class="checkbox checkbox-primary"><input onClick="return addRemoveDoctor(this);" id="checkbox-'+val.id+'" type="checkbox" class="doctor-check-qa" value="'+val.id+'" data-name="'+val.firstname+' '+val.lastname+'"><label for="checkbox-'+val.id+'"></label></div></td><td><img alt="image" class="img-circle img-thumb" src="'+link+'" /></td><td>'+val.firstname+' '+val.lastname+'</td></tr>';
							});
							$("table.doctors tbody").append(html);
				    	}
				    }else{
				    	alert('Something went wrong');
				    }
			    },
			    error: function(err) {	
			    	$('.search-loader,.search-loader-more').hide();
			    	$('.load-more').show();
			    	//alert('Something went wrong');
			    } 
			});
		},1000);
    }

    //validate doctor-form
	$("#doctor-form").validate({
        rules: {
            doctor_ids: {
		      	required: true
		    }
        },
        messages :{
	        doctor_ids: {
		      	required: 'Please select doctor'
		    }
	    },
	    submitHandler: function() {
	    	var check = $(".doctors-ids").val();
	    	if( check == null || check == 'undefined'){
	    		$('#danger-alert').show().empty().text('Please select doctor').fadeOut(3000);
	    		return false;
	    	}	    	
	    	$('.doctor-submit-btns').hide();
	    	$('.doctor-submit-loader').show();
	    	$("#doctor-form").submit();
		}
    }); 

	/*** End Private QA ***/

	/*** Start Second Opinion ***/

    //search doctors
	$("#search-doctor-so").click(function(){
        $('.search-loader').show();
        $('table.doctors tbody').empty();
        $('table.doctors,.load-more,.search-loader-more').hide();
        $('#page-no').val('1');
        getNizcareDoctors();
    });

    //load doctors
	$("#load-more-doctors-so").click(function(){
        $('.search-loader-more').show();
        $('.load-more').hide();
        getNizcareDoctors();
    });

	//get nizcare doctors list
    function getNizcareDoctors(){
    	setTimeout(function(){
	    	var page = $('#page-no').val();
	    	page = parseInt(page);
	    	//doctors
		    $.ajax({
			    type: "POST",
			    url: origin+"/api/v1/data/nizcareDoctors",
			    dataType:"json",
			    data: "search="+($('#search').val())+"&page="+page,
			    success: function(result) {	
			    	$('.search-loader,.search-loader-more').hide();
			    	$('table.doctors').show();
			    	$('#page-no').val(page+1);
			    	if(result.success==1){
				    	var doctors = result.data.doctors.data;
				    	var html = '';
				    	if(doctors.length>0){
				    		if(doctors.length>4){
				    			$('.load-more').show();	    	
				    		}
				    		$.each(doctors, function( index, val) {
				    			if( val.image == null || val.image == 'undefined'){
				    				var link = origin+"/admin/img/avator48x48.png";				    				
				    			}else{
									var link = val.image;
				    			}
								html+='<tr><td><div class="checkbox checkbox-primary"><input onClick="return addRemoveDoctor(this);" id="checkbox-'+val.doctor.id+'" type="checkbox" class="doctor-check-qa" value="'+val.doctor.id+'" data-name="'+val.doctor.firstname+' '+val.doctor.lastname+'"><label for="checkbox-'+val.doctor.id+'"></label></div></td><td><img alt="image" class="img-circle img-thumb" src="'+link+'" /></td><td>'+val.doctor.firstname+' '+val.doctor.lastname+'</td></tr>';
							});
							$("table.doctors tbody").append(html);
				    	}
				    }else{
				    	alert('Something went wrong');
				    }
			    },
			    error: function(err) {	
			    	$('.search-loader,.search-loader-more').hide();
			    	$('.load-more').show();
			    } 
			});
		},1000);
    }

    //validate nizcare doctor form
	$("#niz-doctor-form").validate({
        rules: {
            doctor_ids: {
		      	required: true
		    }
        },
        messages :{
	        doctor_ids: {
		      	required: 'Please select doctor'
		    }
	    },
	    submitHandler: function() {
	    	var check = $(".doctors-ids").val();
	    	if( check == null || check == 'undefined'){
	    		$('#danger-alert').show().empty().text('Please select doctor').fadeOut(3000);
	    		return false;
	    	}	    	
	    	$('.doctor-submit-btns').hide();
	    	$('.doctor-submit-loader').show();
	    	$("#niz-doctor-form").submit();
		}
    });

    //validate nizcare doctor form
	$(".patient-btn-forward").click(function(){
        var admin_user_id = $(this).attr('data-admin-id');
        var second_opinion_id = $(this).attr('data-second-opinion-id');
        var reply_id = $(this).attr('data-reply-id');
        $(".patient-btn-forward").hide();
        $("#f-p-loader-"+reply_id).show();
        setTimeout(function(){        	
	    	//doctors
		    $.ajax({
			    type: "POST",
			    url: origin+"/api/v1/forwardSoToPatient",
			    dataType:"json",
			    data: "admin_user_id="+admin_user_id+"&second_opinion_id="+second_opinion_id+"&reply_id="+reply_id,
			    success: function(result) {	
			    	$("#f-p-loader-"+reply_id).hide();
			    	if(result.success==1){
				    	$('#f-p-badge-'+reply_id).show();
				    }else{
				    	$("#f-p-loader-"+reply_id).hide();
			    		$(".patient-btn-forward").show();
				    	alert(result.msg);
				    }
			    },
			    error: function(err) {	
			    	$("#f-p-loader-"+reply_id).hide();
			    	$(".patient-btn-forward").show();        			
			    } 
			});
		},1000);
    }); 

	/*** End Second Opinion ***/



	//custom validation method
    $.validator.addMethod("noSpace", function(value, element) { 
	  	return value.indexOf(" ") < 0 && value != ""; 
	}, "Space isn't allowed");

	//state list
	$("#select_country").change(function(){
	    $("#select_state,#state").empty().append('<option value="">Choose state</option>').val('');
	    $("#select_city").empty().append('<option value="">Choose city</option>').val('');
	    //countries
	    $.ajax({
		    type: "POST",
		    url: origin+"/api/v1/data/countrywiseStates",
		    dataType:"json",
		    data: "country_id="+this.value,
		    success: function(result) {	
		    	if(result.success==1){
			    	var states = result.data.states;
			    	var html = '';
			    	$.each(states, function( index, val) {
						html+='<option value="'+val.id+'">'+val.name+'</option>';
					});
					$("#select_state,#state").append(html);
			    }else{
			    	alert('Something went wrong');
			    }
		    },
		    error: function(err) {	
		    	alert('Something went wrong');
		    } 
		});	    
	});	

	//state list
	$("#select_state").change(function(){
	    $("#select_city").empty().append('<option value="">Choose city</option>').val('');
	    //countries
	    $.ajax({
		    type: "POST",
		    url: origin+"/api/v1/data/statewiseCities",
		    dataType:"json",
		    data: "state_id="+this.value,
		    success: function(result) {	
		    	if(result.success==1){
			    	var cities = result.data.cities;
			    	var html = '';
			    	$.each(cities, function( index, val) {
						html+='<option value="'+val.id+'">'+val.name+'</option>';
					});
					$("#select_city").append(html);
			    }else{
			    	alert('Something went wrong1');
			    }
		    },
		    error: function(err) {	
		    	alert('Something went wrong');
		    } 
		});	    
	});	

	/*** Start Banner ***/
	//banner form
	$("#banner-submit-btn").click(function(){
		if($("#banner-form .en").val()==''){
			$("#banner-form .en").focus();
			$(".en-error").show().text('Please choose banner');
			return false;
		}
		$(this).hide();
	    $(".form-loader").show();
	});	

	//edit banner form
	$("#banner-edit-btn").click(function(){
		$(this).hide();
		$(".go-back").hide();
	    $(".form-loader").show();	    	    
	});

	//confirm delete banner
    $(".banner-dlt-btn").click(function(){
        var banner_id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover this banner!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/banners/"+banner_id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Banner deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                        swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	
    /*** End Banner ***/

    /*** Start Video ***/
	//video form
	$("#video-submit-btn").click(function(){
		if($("#video-form .en").val()==''){
			$("#video-form .en").focus();
			$(".en-error").show().text('Please fill url');
			return false;
		}
		if($("#video-form .thumb-en").val()==''){
			$("#video-form .thumb-en").focus();
			$(".thumb-en-error").show().text('Please select thumbnail');
			return false;
		}
		$(this).hide();
	    $(".form-loader").show();	       
	});	

	//edit video form
	$("#video-edit-btn").click(function(){
		if($("#video-edit-form .en").val()==''){
			$("#video-edit-form .en").focus();
			$(".en-error").show().text('Please fill url');
			return false;
		}
		$(this).hide();
		$(".go-back").hide();
	    $(".form-loader").show();	      
	});

	//confirm delete video
    $(".video-dlt-btn").click(function(){
        var video_id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover this video!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/videos/"+video_id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Video deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                        swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Video ***/

    /*** Start ut ***/
	//video form
	$("#ut-submit-btn").click(function(){
		if($("#ut-form .en").val()==''){
			$("#ut-form .en").focus();
			$(".en-error").show().text('Please fill title');
			return false;
		}
		$(this).hide();
	    $(".form-loader").show();	       
	});	

	//edit ut form
	$("#ut-edit-btn").click(function(){
		if($("#ut-edit-form .en").val()==''){
			$("#ut-edit-form .en").focus();
			$(".en-error").show().text('Please fill title');
			return false;
		}
		$(this).hide();
		$(".go-back").hide();
	    $(".form-loader").show();	      
	});

	//confirm delete video
    $(".ut-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover this title!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/user-titles/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Title deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End ut ***/

    /*** Start Service Category ***/
	//video form
	$("#sc-submit-btn").click(function(){
		if($("#sc-form .en").val()==''){
			$("#sc-form .en").focus();
			$(".en-error").show().text('Please fill speciality');
			return false;
		}
		$(this).hide();
	    $(".form-loader").show();	       
	});	

	//edit sc form
	$("#sc-edit-btn").click(function(){
		if($("#sc-edit-form .en").val()==''){
			$("#sc-edit-form .en").focus();
			$(".en-error").show().text('Please fill speciality');
			return false;
		}
		$(this).hide();
		$(".go-back").hide();
	    $(".form-loader").show();	      
	});

	//confirm delete video
    $(".sc-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover this speciality!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/service-categories/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "speciality deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Service Category ***/

    /*** Start Home Care Service ***/
	//hcs form
	$("#hcs-submit-btn").click(function(){
		if($("#hcs-form .en").val()==''){
			$("#hcs-form .en").focus();
			$(".en-error").show().text('Please fill service');
			return false;
		}
		$(this).hide();
	    $(".form-loader").show();	       
	});	

	//edit hcs form
	$("#hcs-edit-btn").click(function(){
		if($("#hcs-edit-form .en").val()==''){
			$("#hcs-edit-form .en").focus();
			$(".en-error").show().text('Please fill service');
			return false;
		}
		$(this).hide();
		$(".go-back").hide();
	    $(".form-loader").show();	      
	});

	//confirm delete video
    $(".hcs-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/home-care-services/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "speciality deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Home Care Service ***/

    /*** Start TSS ***/
	//video form
	$("#tss-submit-btn").click(function(){		
		if($("#tss-form .service-categories").val()==null){
			$("#tss-form .service-categories").focus();
			$(".sc-error").show().text('Please choose specialities');
			return false;
		}

		if($("#tss-form .en").val()==''){
			$("#tss-form .en").focus();
			$(".en-error").show().text('Please fill');
			return false;
		}
		
		$(this).hide();
	    $(".form-loader").show();	       
	});	

	//edit tss form
	$("#tss-edit-btn").click(function(){
		if($("#tss-edit-form .service-categories").val()==null){
			$("#tss-edit-form .service-categories").focus();
			$(".sc-error").show().text('Please choose specialities');
			return false;
		}
		if($("#tss-edit-form .en").val()==''){
			$("#tss-edit-form .en").focus();
			$(".en-error").show().text('Please fill');
			return false;
		}
		$(this).hide();
		$(".go-back").hide();
	    $(".form-loader").show();	      
	});

	//confirm delete video
    $(".tss-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/tss/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End TSS ***/

    /*** Start Subscription Plan ***/
	//validate sp form
	$("#sp-form").validate({
        rules: {
            sp_en: {
                required: true
            },
            no_of_branch: {
		      	required: true,
		      	number: true
		    },
            price: {
		      	required: true,
		      	number: true
		    }
        },
        messages :{
	        sp_en : {
	            required : 'Fill name'
	        },
	        no_of_branch : {
	            required : 'Fill number of clinics',
	            number : 'Only numbers are allowed'
	        },
	        price : {
	            required : 'Fill price',
	            number : 'Only numbers are allowed'
	        }
	    },
	    submitHandler: function(){
			$("#sp-submit-btn").hide();
			$(".form-loader").show();
			$("#sp-form").submit();
	    }
    });	

    //validate sp form
	$("#sp-edit-form").validate({
        rules: {
            sp_en: {
                required: true
            },
            no_of_branch: {
		      	required: true,
		      	number: true
		    },
            no_of_secondary: {
		      	required: true,
		      	number: true
		    },
            price: {
		      	required: true,
		      	number: true
		    }
        },
        messages :{
	        sp_en : {
	            required : 'Fill name'
	        },
	        no_of_branch : {
	            required : 'Fill number of clinics',
	            number : 'Only numbers are allowed'
	        },
	        no_of_secondary : {
	            required : 'Fill number of secondary',
	            number : 'Only numbers are allowed'
	        },
	        price : {
	            required : 'Fill price',
	            number : 'Only numbers are allowed'
	        }
	    },
	    submitHandler: function(){
			$(".sp-edit-btn").hide();
			$(".form-loader").show();
			$("#sp-edit-form").submit();
	    }
    });

	//confirm delete video
    $(".sp-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/subscription-plans/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Subscription Plan ***/

    /*** Start Branch Plan ***/
	//validate sp form
	$("#bp-form").validate({
        rules: {
            sp_en: {
                required: true
            },
            no_of_branch: {
		      	required: true,
		      	number: true,
		      	min: 1
		    },
            no_of_secondary: {
		      	required: true,
		      	number: true,
		      	min: 1
		    },
            price: {
		      	required: true,
		      	number: true
		    }
        },
        messages :{
	        sp_en : {
	            required : 'Fill name'
	        },
	        no_of_branch : {
	            required : 'Fill number of clinics',
	            number : 'Only numbers are allowed'
	        },
	        no_of_secondary : {
	            required : 'Fill number of secondary user',
	            number : 'Only numbers are allowed'
	        },
	        price : {
	            required : 'Fill price',
	            number : 'Only numbers are allowed'
	        }
	    },
	    submitHandler: function(){
			$("#bp-submit-btn").hide();
			$(".form-loader").show();
			$("#bp-form").submit();
	    }
    });	

    //validate sp form
	$("#bp-edit-form").validate({
        rules: {
            sp_en: {
                required: true
            },
            no_of_branch: {
		      	required: true,
		      	number: true
		    },
            no_of_secondary: {
		      	required: true,
		      	number: true
		    },
            price: {
		      	required: true,
		      	number: true
		    }
        },
        messages :{
	        sp_en : {
	            required : 'Fill name'
	        },
	        no_of_branch : {
	            required : 'Fill number of clinics',
	            number : 'Only numbers are allowed'
	        },
	        no_of_secondary : {
	            required : 'Fill number of secondary',
	            number : 'Only numbers are allowed'
	        },
	        price : {
	            required : 'Fill price',
	            number : 'Only numbers are allowed'
	        }
	    },
	    submitHandler: function(){
			$(".bp-edit-btn").hide();
			$(".form-loader").show();
			$("#bp-edit-form").submit();
	    }
    });

	//confirm delete video
    $(".bp-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/branch-plans/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Branch Plan ***/

    /*** Start Document Type ***/
	//validate dt form
	$("#dt-form").validate({
        rules: {
            dt_en: {
                required: true
            }
        },
        messages :{
	        dt_en : {
	            required : 'Fill name'
	        }
	    },
	    submitHandler: function(){
			$("#dt-submit-btn").hide();
			$(".form-loader").show();
			$("#dt-form").submit();
	    }
    });	

    //validate dt form
	$("#dt-edit-form").validate({
        rules: {
            dt_en: {
                required: true
            }
        },
        messages :{
	        dt_en : {
	            required : 'Fill name'
	        }
	    },
	    submitHandler: function(){
			$(".dt-edit-btn").hide();
			$(".form-loader").show();
			$("#dt-edit-form").submit();
	    }
    });

	//confirm delete dt
    $(".dt-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/document-types/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Document Type ***/

    /*** Start Blood Relation ***/
	//validate br form
	$("#br-form").validate({
        rules: {
            br_en: {
                required: true
            }
        },
        messages :{
	        br_en : {
	            required : 'Fill name'
	        }
	    },
	    submitHandler: function(){
			$("#br-submit-btn").hide();
			$(".form-loader").show();
			$("#br-form").submit();
	    }
    });	

    //validate br form
	$("#br-edit-form").validate({
        rules: {
            br_en: {
                required: true
            }
        },
        messages :{
	        br_en : {
	            required : 'Fill name'
	        }
	    },
	    submitHandler: function(){
			$(".br-edit-btn").hide();
			$(".form-loader").show();
			$("#br-edit-form").submit();
	    }
    });

	//confirm delete br
    $(".br-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/blood-relations/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Blood Relation ***/

    /*** Start Report Reason ***/
	//validate rr form
	$("#rr-form").validate({
        rules: {
            rr_en: {
                required: true
            }
        },
        messages :{
	        rr_en : {
	            required : 'Fill name'
	        }
	    },
	    submitHandler: function(){
			$("#rr-submit-btn").hide();
			$(".form-loader").show();
			$("#rr-form").submit();
	    }
    });	

    //validate rr form
	$("#rr-edit-form").validate({
        rules: {
            rr_en: {
                required: true
            }
        },
        messages :{
	        rr_en : {
	            required : 'Fill name'
	        }
	    },
	    submitHandler: function(){
			$(".rr-edit-btn").hide();
			$(".form-loader").show();
			$("#rr-edit-form").submit();
	    }
    });

	//confirm delete rr
    $(".rr-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/report-reasons/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Report Reason ***/

    /*** Start Country ***/
	//validate country form
	$("#country-form").validate({
        rules: {
            name: {
                required: true
            },
            sortname: {
                required: true
            },
            phonecode: {
                required: true,
                number: true
            }
        },
        messages :{
	        name : {
	            required : 'Fill country name'
	        },
	        sortname : {
	            required : 'Fill shortname'
	        },
	        phonecode : {
	            required : 'Fill phone code'
	        }
	    },
	    submitHandler: function(){
			$("#country-submit-btn").hide();
			$(".form-loader").show();
			$("#country-form").submit();
	    }
    });	

    //validate country form
	$("#country-edit-form").validate({
        rules: {
            name: {
                required: true
            },
            sortname: {
                required: true
            },
            phonecode: {
                required: true,
                number: true
            }
        },
        messages :{
	        name : {
	            required : 'Fill country name'
	        },
	        sortname : {
	            required : 'Fill shortname'
	        },
	        phonecode : {
	            required : 'Fill phone code'
	        }
	    },
	    submitHandler: function(){
			$(".country-edit-btn").hide();
			$(".form-loader").show();
			$("#country-edit-form").submit();
	    }
    });

	//confirm delete country
    $(".country-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/countries/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Country ***/

    /*** Start States ***/
	//validate state form
	$("#state-form").validate({
        rules: {
            name: {
                required: true
            }
        },
        messages :{
	        name : {
	            required : 'Fill state name'
	        }
	    },
	    submitHandler: function(){
			$("#state-submit-btn").hide();
			$(".form-loader").show();
			$("#state-form").submit();
	    }
    });	

    //validate state form
	$("#state-edit-form").validate({
        rules: {
            name: {
                required: true
            }
        },
        messages :{
	        name : {
	            required : 'Fill state name'
	        }
	    },
	    submitHandler: function(){
			$(".state-edit-btn").hide();
			$(".form-loader").show();
			$("#state-edit-form").submit();
	    }
    });

	//confirm delete state
    $(".state-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/states/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End State ***/

    /*** Start City ***/
	//validate city form
	$("#city-form").validate({
        rules: {
            name: {
                required: true
            },
            state: {
                required: true
            },
        },
        messages :{
	        name : {
	            required : 'Fill city name'
	        },
	        state : {
	            required : 'Select state'
	        }
	    },
	    submitHandler: function(){
			$("#city-submit-btn").hide();
			$(".form-loader").show();
			$("#city-form").submit();
	    }
    });	

    //validate city form
	$("#city-edit-form").validate({
        rules: {
            name: {
                required: true
            },
            state: {
                required: true
            },
        },
        messages :{
	        name : {
	            required : 'Fill city name'
	        },
	        state : {
	            required : 'Select state'
	        }
	    },
	    submitHandler: function(){
			$(".city-edit-btn").hide();
			$(".form-loader").show();
			$("#city-edit-form").submit();
	    }
    });

	//confirm delete city
    $(".city-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/cities/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End City ***/

    /*** Start Language ***/
	//validate language form
	$("#language-form").validate({
        rules: {
            name: {
                required: true
            },
            code: {
                required: true
            },
        },
        messages :{
	        name : {
	            required : 'Fill language name'
	        },
	        code : {
	            required : 'Fill code'
	        }
	    },
	    submitHandler: function(){
			$("#language-submit-btn").hide();
			$(".form-loader").show();
			$("#language-form").submit();
	    }
    });	

    //validate language form
	$("#language-edit-form").validate({
        rules: {
            name: {
                required: true
            },
            code: {
                required: true
            },
        },
        messages :{
	        name : {
	            required : 'Fill language name'
	        },
	        code : {
	            required : 'Fill code'
	        }
	    },
	    submitHandler: function(){
			$(".language-edit-btn").hide();
			$(".form-loader").show();
			$("#language-edit-form").submit();
	    }
    });

	//confirm delete language
    $(".language-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/languages/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Language ***/

    /*** Start Currency ***/
	//validate currency form
	$("#currency-form").validate({
        rules: {
            currency: {
                required: true
            },
            code: {
                required: true
            },
            symbol: {
                required: true
            },
        },
        messages :{
	        currency : {
	            required : 'Fill currency name'
	        },
	        code : {
	            required : 'Fill code'
	        },
	        symbol : {
	            required : 'Fill symbol'
	        }
	    },
	    submitHandler: function(){
			$("#currency-submit-btn").hide();
			$(".form-loader").show();
			$("#currency-form").submit();
	    }
    });	

    //validate language form
	$("#currency-edit-form").validate({
        rules: {
            currency: {
                required: true
            },
            code: {
                required: true
            },
            symbol: {
                required: true
            },
        },
        messages :{
	        currency : {
	            required : 'Fill currency name'
	        },
	        code : {
	            required : 'Fill code'
	        },
	        symbol : {
	            required : 'Fill symbol'
	        }
	    },
	    submitHandler: function(){
			$(".currency-edit-btn").hide();
			$(".form-loader").show();
			$("#currency-edit-form").submit();
	    }
    });

	//confirm delete currency
    $(".currency-dlt-btn").click(function(){
        var id = $(this).attr('data-id');
        var return_page = $(this).attr('data-url');
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
        	$.ajax({
                type: "GET",
			    url: origin_admin+"/currencies/"+id+"/delete",
			    success: function(result) {	
			    	if(result.success == 1){
                        swal({
                          title: "Deleted!",
                          text: "Deleted successfully!",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "ok!",
                          closeOnConfirm: false
                        },
                        function(){
                            $(location).attr('href', return_page);
                        });
                    }else{
                    	swal("Failed!", result.msg, "error");
                    }
			    },
			    error: function(err) {	
			    	
			    }
            });
        });
    });	

    /*** End Canguage ***/

    /*** Start Nizcar Fees ***/
    $("#country-nf").change(function(){
    	var optVal = $( "#country-nf option:selected" );
    	$(".currency-symbol").text('Fixed ( '+optVal.attr('data-currency')+' - '+optVal.attr('data-currency-code')+' )');
    });
	
	//validate niz fees form
	$("#niz-fee-form").validate({
        rules: {
            commission_fees: {
                required: true,
                number: true
            },
            commission_fee_type: {
                required: true
            },
            internet_handling_fees: {
                required: true,
                number: true
            },
            internet_handling_fees_type: {
                required: true
            },
        },
        messages :{
	        commission_fees : {
	            required : 'Fill commission fees'
	        },
	        commission_fee_type : {
	            required : 'Select commission type'
	        },
	        internet_handling_fees : {
	            required : 'Fill internet handling fees'
	        },
	        internet_handling_fees_type : {
	            required : 'Select internet handling type'
	        }
	    },
	    submitHandler: function(){
			$("#niz-fee-submit-btn").hide();
			$(".form-loader").show();
			$("#niz-fee-form").submit();
	    }
    });	

    //validate language form
	$("#niz-fee-edit-form").validate({
        rules: {
            commission_fees: {
                required: true,
                number: true
            },
            commission_fee_type: {
                required: true
            },
            internet_handling_fees: {
                required: true,
                number: true
            },
            internet_handling_fees_type: {
                required: true
            },
        },
        messages :{
	        commission_fees : {
	            required : 'Fill commission fees'
	        },
	        commission_fee_type : {
	            required : 'Select commission type'
	        },
	        internet_handling_fees : {
	            required : 'Fill internet handling fees'
	        },
	        internet_handling_fees_type : {
	            required : 'Select internet handling type'
	        }
	    },
	    submitHandler: function(){
			$(".niz-fee-edit-btn").hide();
			$(".form-loader").show();
			$("#niz-fee-edit-form").submit();
	    }
    });

    /*** End Nizcar Fees ***/

    /*** Start Fee Validation ***/    
	$("#country-fv").change(function(){
    	var optVal = $( "#country-fv option:selected" );
    	$(".currency-symbol").text(optVal.attr('data-currency'));
    });
	//validate fee validation form
	$("#fee-validation-form").validate({
        rules: {
            consultation_plan: {
                required: true,
                number: true,
                min: 1,
                max: 9999
            },
            second_opinion: {
                required: true,
                number: true,
                min: 1,
                max: 9999
            }
        },
        messages :{
	        consultation_plan : {
	            required : 'Fill Consultation Plan Fees'
	            ,
	            min : 'Amount should be 1 to 9999',
	            max : 'Amount should be 1 to 9999',
	        },
	        second_opinion : {
	            required : 'Fill Second Opinion Fees'
	            ,
	            min : 'Amount should be 1 to 9999',
	            max : 'Amount should be 1 to 9999',
	        }
	    },
	    submitHandler: function(){
			$("#fee-validation-submit-btn").hide();
			$(".form-loader").show();
			$("#fee-validation-form").submit();
	    }
    });	

    //validate fee validation form
	$("#fee-validation-edit-form").validate({
        rules: {
            consultation_plan: {
                required: true,
                number: true,
                min: 1,
                max: 9999
            },
            second_opinion: {
                required: true,
                number: true,
                min: 1,
                max: 9999
            }
        },
        messages :{
	        consultation_plan : {
	            required : 'Fill Consultation Plan Fees'
	            ,
	            min : 'Amount should be 1 to 9999',
	            max : 'Amount should be 1 to 9999',
	        },
	        second_opinion : {
	            required : 'Fill Second Opinion Fees'
	            ,
	            min : 'Amount should be 1 to 9999',
	            max : 'Amount should be 1 to 9999',
	        }
	    },
	    submitHandler: function(){
			$(".fee-validation-edit-btn").hide();
			$(".form-loader").show();
			$("#fee-validation-edit-form").submit();
	    }
    });

    /*** End Fee Validation ***/

    /*** Start IC Countries ***/    
	//validate fee validation form
    $("#ic-country-submit-btn").click(function(){
        var country_flg = false;
        var countries = [];
		$('input[name^="countries"]').each(function() {
		    if($(this).prop("checked") == true){
                country_flg = true;
            	countries.push($(this).val());
            }
		});

		console.log(countries);
		return false;
		if(country_flg){
			console.log('sdfsdfsfsf');
			$("#ic-country-submit-btn").hide();
			$(".form-loader").show();
			$("#ic-country-form").submit();
		}else{
			swal("Error!", "Please select minimum one country", "error");
		}
    });	

    //validate fee validation form
	/*$("#fee-validation-edit-form").validate({
        rules: {
            consultation_plan: {
                required: true,
                number: true,
                min: 1,
                max: 9999
            },
            second_opinion: {
                required: true,
                number: true,
                min: 1,
                max: 9999
            }
        },
        messages :{
	        consultation_plan : {
	            required : 'Fill Consultation Plan Fees'
	            ,
	            min : 'Amount should be 1 to 9999',
	            max : 'Amount should be 1 to 9999',
	        },
	        second_opinion : {
	            required : 'Fill Second Opinion Fees'
	            ,
	            min : 'Amount should be 1 to 9999',
	            max : 'Amount should be 1 to 9999',
	        }
	    },
	    submitHandler: function(){
			$(".fee-validation-edit-btn").hide();
			$(".form-loader").show();
			$("#fee-validation-edit-form").submit();
	    }
    });*/

    /*** End IC Countries ***/

});