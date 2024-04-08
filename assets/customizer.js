/* main adminmenu js */
jQuery(document).ready( function() {
    jQuery('#adminmenuback, #adminmenuwrap, #wpadminbar, #wpfooter').remove();
});

/* efc_snackbar jquery */
(function( $ ){
	$.fn.efc_snackbar = function(msg) {
		if ( jQuery('.snackbar-logs').length === 0 ){
			$("body").append("<section class=snackbar-logs></section>");
		}
		var efc_snackbar = $("<article></article>").addClass('snackbar-log snackbar-log-success snackbar-log-show').text( msg );
		$(".snackbar-logs").append(efc_snackbar);
		setTimeout(function(){ efc_snackbar.remove(); }, 3000);
		return this;
	}; 
})( jQuery );

/* efc_snackbar_warning jquery */
(function( $ ){
	$.fn.efc_snackbar_warning = function(msg) {
		if ( jQuery('.snackbar-logs').length === 0 ){
			$("body").append("<section class=snackbar-logs></section>");
		}
		var efc_snackbar_warning = $("<article></article>").addClass( 'snackbar-log snackbar-log-error snackbar-log-show' ).html( msg );
		$(".snackbar-logs").append(efc_snackbar_warning);
		setTimeout(function(){ efc_snackbar_warning.remove(); }, 3000);
		return this;
	}; 
})( jQuery );
/*header script end*/ 

/*
on change alert box open
*/
jQuery(document).on("click", ".back_to_notice", function(){
	var r = confirm( 'The changes you made will be lost if you navigate away from this page.' );
	if (r === true ) {
	} else {	
		return false;
	}
});

function setting_change_trigger() {	
	jQuery('.woocommerce-save-button').removeAttr("disabled");
	jQuery('.efc-save-content .efc-save').html('Save');
	jQuery('.zoremmail-back-wordpress-link').addClass('back_to_notice');
}

function save_customizer_email_setting(){
	
	jQuery('.zoremmail-layout-content-preview').addClass('customizer-unloading');
	setting_change_trigger();
	
	var form = jQuery('#zoremmail_email_options');
	jQuery.ajax({
		url: ajaxurl,//csv_workflow_update,		
		data: form.serialize(),
		type: 'POST',
		dataType:"json",		
		success: function(response) {
			if( response.success === "true" ){
				jQuery('iframe').attr('src', jQuery('iframe').attr('src'));
			} else {
				//
			}
		},
		error: function(response) {
			console.log(response);			
		}
	});
}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

jQuery(document).on("click", ".zoremmail-sub-panel-title", function(event){
	
	var Text = jQuery('.breadcrumb-sub-panel-title').text();
	
	var lable = jQuery(this).data('label');
	var id = jQuery(this).attr('id');
	var Status = jQuery('#orderStatus').val();

	jQuery('.zoremmail-sub-panels').hide();
	jQuery('.breadcrumb-sub-panel-title').remove();
	jQuery( ".customize-section-back" ).removeClass('panels').addClass('sub-panels').show();
	//jQuery( '.customizer_Breadcrumb' ).append( ' > ' +Text+ '<span class="breadcrumb-sub-panel-title"><br>' + lable + '</span>');
	
	
	jQuery('.zoremmail-menu-submenu-title').each(function(index, element) {
		if ( jQuery(this).data('id') ===  id ) {
			jQuery(this).addClass('open');
			jQuery('.zoremmail-menu-contain').addClass('active');
		} else {
			jQuery(this).removeClass('open');
			jQuery('.zoremmail-menu-contain').removeClass('active');
		}
	});

	jQuery( '#orderStatus' ).select2({
		templateSelection: text_contain,
		minimumResultsForSearch: Infinity
	});
	
	change_submenu_item();	
	
});

jQuery(document).on("click", "#zoremmail_email_options .efc-save", function(){
	
	"use strict";	
	var form = jQuery('#zoremmail_email_options');
	var btn = jQuery('#zoremmail_email_options .efc-save');
	jQuery.ajax({
		url: ajaxurl,//csv_workflow_update,		
		data: form.serialize(),
		type: 'POST',
		dataType:"json",
		beforeSend: function(){
			btn.prop('disabled', true).html('...');
		},		
		success: function(response) {
			if( response.success === "true" ){
				btn.prop('disabled', true).html('Saved');
				jQuery(document).efc_snackbar( "Settings Successfully Saved." );
				jQuery('.zoremmail-back-wordpress-link').removeClass('back_to_notice');
			} else {
				if( response.permission === "false" ){
					btn.prop('disabled', false).html('Save Changes');
					jQuery(document).efc_snackbar_warning( "you don't have permission to save settings." );
				}
			}
		},
		error: function(response) {
			console.log(response);			
		}
	});
});

jQuery(document).on("submit", "#send_to_email_options", function(){
	
	"use strict";
	var form = jQuery('#send_to_email_options');
	var btn = jQuery('.send-test-email');
	var recipient = jQuery("#send_to_email").val();
		
	if ( recipient == '' ) {
		jQuery("#send_to_email").css('border-color', 'red');
		return false;
	}
	
	jQuery.ajax({
		url: ajaxurl,//csv_workflow_update,		
		data: form.serialize(),
		type: 'POST',
		dataType:"json",
		beforeSend: function(){
			btn.html('<div class="dot-carousel"></div>');
		},		
		success: function(response) {
			if( response.success === "true" ){
				btn.html('Send');
				form.hide();
				jQuery('.popuprow h3').after('<p style="text-align:center;padding: 20px;"><span class="dashicons dashicons-yes-alt" style="color:#59c889;font-size:40px;"></span></p><p class="confirm_message" style="color:#000;font-size:14px;text-align:center;padding-bottom: 20px;">Test email was sent successfully</p>');
				
			} else {
				btn.html('Send');
				jQuery(document).efc_snackbar_warning( "Sending an email report failed." );
			}
		},
		error: function(response) {
			console.log(response);			
		}
	});
	return false;
});

function change_submenu_item() {
	var Status = jQuery('#orderStatus').val();
	jQuery( '.all_status_submenu' ).hide();
	jQuery( '.all_status_submenu.' + Status + '_sub_menu' ).show();
}

jQuery('iframe').load(function(){
	jQuery('.zoremmail-layout-content-preview').removeClass('customizer-unloading');
	jQuery("#email_preview").contents().find( 'div#query-monitor-main' ).css( 'display', 'none');
	jQuery( '.zoremmail-layout-content-media .last-checked .dashicons' ).trigger('click');	
});

jQuery(document).on("click", ".customize-section-back", function(){
	if ( jQuery(this).hasClass('panels') ) {
		jQuery('.header_orderStatus').hide();
		jQuery('.sub_options_panel').hide();
		jQuery('.tgl-btn-parent').hide();
		//jQuery( '.customizer_Breadcrumb' ).html('');
		jQuery( ".customize-section-back" ).hide();
		jQuery( ".zoremmail-panel-title, .zoremmail-layout-sider-heading .main_logo" ).show();
		jQuery( ".zoremmail-panels" ).show();
		jQuery('.zoremmail-sub-panel-heading').removeClass('open');
		jQuery('.zoremmail-sub-panel-heading').removeClass('active');
	}
	if ( jQuery(this).hasClass('sub-panels') ) {
		jQuery('.breadcrumb-sub-panel-title').remove();
		var Text = jQuery('.customizer_Breadcrumb').text().replace( /[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
		//jQuery( '.customizer_Breadcrumb' ).html('<span class="breadcrumb-sub-panel-title"><br>' + Text + '</span>');
		
		jQuery( ".customize-section-back" ).removeClass('sub-panels').addClass('panels');
		jQuery( ".zoremmail-sub-panels" ).show();
		if ( jQuery('.zoremmail-sub-panel-title:visible').length == 1 ) {
			jQuery(this).trigger('click');
		}
		jQuery('.zoremmail-menu-contain').removeClass('active');
		jQuery('.zoremmail-menu-submenu-title').removeClass('open');
		jQuery('.zoremmail-menu-submenu-title').removeClass('active');
	}
});

jQuery(document).on("click", ".send-to-email", function(){	
	"use strict";
	jQuery("#send_to_email_option_html, #send_to_email_options").show();
	
	jQuery(".popuprow p").hide();
	
});

jQuery(document).on("click", ".collapse-sidebar.button", function(){	
	"use strict";
	var hasClass = jQuery('.zoremmail-layout.zoremmail-layout-has-sider').hasClass('collapsed');
	
	if ( !hasClass ) {
		jQuery(".zoremmail-layout-has-sider").addClass('collapsed');
	} else {
		jQuery(".zoremmail-layout-has-sider").removeClass('collapsed');
	}
	

});

jQuery(document).on("click", ".popupclose, .popup_close_icon", function(){
	"use strict";
	jQuery('#send_to_email_option_html').hide();
});

/*** Default JS end***/

/*** Custom JS ***/

jQuery(document).ready(function(){
	
	var type = getUrlParameter('type');
	if ( type == 'email_content' ) {
		jQuery('#email_content').trigger('click');
	}
	
	jQuery('.zoremmail-input.color').wpColorPicker();
	jQuery( '#orderStatus' ).select2({
		templateSelection: text_contain,
		minimumResultsForSearch: Infinity
	});
	
	jQuery('.zoremmail-input').on("keyup", function(){
		setting_change_trigger();
	});
	
	jQuery(document).on("change", ".tgl.tgl-flat, .zoremmail-checkbox, .zoremmail-input.color, .zoremmail-range, .zoremmail-input.select", function(){
		setting_change_trigger();
	});
	
	jQuery( ".zoremmail-input.heading" ).keyup( function( event ) {
		var str = event.target.value;
		var res = str.replace("{site_title}", zorem_customizer.site_title);
		var res = res.replace("{order_number}", zorem_customizer.order_number);
		var res = res.replace("{customer_first_name}", zorem_customizer.customer_first_name);
		var res = res.replace("{customer_last_name}", zorem_customizer.customer_last_name);
		if( str ){				
			jQuery("#email_preview").contents().find( '#header_wrapper h1' ).text(res);
		} else{
			jQuery("#email_preview").contents().find( '#header_wrapper h1' ).text(event.target.placeholder);
		}
		//setting_change_trigger();
	});
	
	jQuery( ".zoremmail-input.heading" ).keyup( function( event ) {
		var str = event.target.value;
		var res = str.replace("{site_title}", zorem_customizer.site_title);
		var res = res.replace("{order_number}", zorem_customizer.order_number);
		var res = res.replace("{customer_first_name}", zorem_customizer.customer_first_name);
		var res = res.replace("{customer_last_name}", zorem_customizer.customer_last_name);
		var res = res.replace("{customer_company_name}", zorem_customizer.customer_company_name);
		var res = res.replace("{customer_username}", zorem_customizer.customer_username);
		var res = res.replace("{customer_email}", zorem_customizer.customer_email);
		var res = res.replace("{est_delivery_date}", zorem_customizer.est_delivery_date);
		if( str ){				
			jQuery("#email_preview").contents().find( '#header_wrapper h1' ).text(res);
		} else{
			jQuery("#email_preview").contents().find( '#header_wrapper h1' ).text('');
		}
	});
	
	jQuery( ".zoremmail-input.additional_content" ).keyup( function( event ) {
		var str = event.target.value;
		var res = str.replace("{site_title}", zorem_customizer.site_title);
		var res = res.replace("{order_number}", zorem_customizer.order_number);
		var res = res.replace("{customer_first_name}", zorem_customizer.customer_first_name);
		var res = res.replace("{customer_last_name}", zorem_customizer.customer_last_name);
		var res = res.replace("{customer_company_name}", zorem_customizer.customer_company_name);
		var res = res.replace("{customer_username}", zorem_customizer.customer_username);
		var res = res.replace("{customer_email}", zorem_customizer.customer_email);
		var res = res.replace("{est_delivery_date}", zorem_customizer.est_delivery_date);
		
		if( str ){				
			jQuery("#email_preview").contents().find( '.wclp_additional_content' ).text(res);
		} else{
			jQuery("#email_preview").contents().find( '.wclp_additional_content' ).text(event.target.placeholder);
		}
		setting_change_trigger();
	});
	
	jQuery( ".zoremmail-input.widget_header_text" ).keyup( function( event ) {
		var str = event.target.value;
		if( str ){				
			jQuery("#email_preview").contents().find( '.pickup-instruction h2' ).text(str);
		} else{
			jQuery("#email_preview").contents().find( '.pickup-instruction h2' ).text(event.target.placeholder);
		}
		setting_change_trigger();
	});
	
	jQuery( ".zoremmail-input.addres_header_text" ).keyup( function( event ) {
		var str = event.target.value;
		if( str ){				
			jQuery("#email_preview").contents().find( '.wclp_location_box1 .wclp_location_box_heading' ).text(str);
		} else{
			jQuery("#email_preview").contents().find( '.wclp_location_box1 .wclp_location_box_heading' ).text(event.target.placeholder);
		}
		setting_change_trigger();
	});
	
	jQuery( ".zoremmail-input.header_hours_text" ).keyup( function( event ) {
		var str = event.target.value;
		if( str ){				
			jQuery("#email_preview").contents().find( '.wclp_location_box2 .wclp_location_box_heading' ).text(str);
		} else{
			jQuery("#email_preview").contents().find( '.wclp_location_box2 .wclp_location_box_heading' ).text(event.target.placeholder);
		}
		setting_change_trigger();
	});
	
	jQuery( "#widget_layout" ).on( "change", function() {
		var value = jQuery(this).val();
		if ( value == '1colums' ) {
			jQuery("#email_preview").contents().find( '.wclp_mail_address' ).css( 'width', '50%' );
			jQuery("#email_preview").contents().find( '.wclp_location_box' ).css( 'width', '' );
			jQuery("#email_preview").contents().find( '.wclp_location_box2' ).css( 'margin-top', '5px' );
		} else {
			jQuery("#email_preview").contents().find( '.wclp_mail_address' ).css( 'width', '' );
			jQuery("#email_preview").contents().find( '.wclp_location_box' ).css( 'width', '49%' );
			jQuery("#email_preview").contents().find( '.wclp_location_box2' ).css( 'margin-top', '0' );
			jQuery("#email_preview").contents().find( '.wclp_location_box2' ).css( 'padding-top', '0' );
			
		}
		setting_change_trigger();
	});
	
	if ( jQuery.fn.wpColorPicker ) { 
		jQuery('#background_color').wpColorPicker({
			change: function(e, ui) {		
				var color = ui.color.toString();
				jQuery("#email_preview").contents().find( '.wclp_mail_address' ).css( 'background-color', color );
				setting_change_trigger();
			}, 	
		});
		jQuery('#border_color').wpColorPicker({
			change: function(e, ui) {		
				var color = ui.color.toString();
				jQuery("#email_preview").contents().find( '.wclp_mail_address' ).css( 'border-color', color );
				setting_change_trigger();
			}, 	
		});
	}	
	
	jQuery( "#padding" ).on( "change", function() {
		var value = jQuery(this).val();
		jQuery("#email_preview").contents().find( '.wclp_mail_address' ).css( 'padding', value );
		setting_change_trigger();
	});

	jQuery('.hide_widget_header input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery('.hide_addres_header input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery('.hide_hours_header input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery( ".zoremmail-input.pickup_items_heading" ).keyup( function( event ) {
		var str = event.target.value;
		if( str ){				
			jQuery("#email_preview").contents().find( '.pickup_items_heading' ).text(str);
		} else{
			jQuery("#email_preview").contents().find( '.pickup_items_heading' ).text(event.target.placeholder);
		}
		setting_change_trigger();
	});
	
	jQuery('.display_product_images input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery('.display_product_prices input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery('.display_shipping_address input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery('.display_billing_address input').on("click", function(){
		save_customizer_email_setting();
	});
	
	jQuery( ".zoremmail-layout-content-media .dashicons" ).on( "click", function() {
		jQuery(this).parent().siblings().removeClass('active');
		var width = jQuery(this).parent().data('width');
		var iframeWidth = jQuery(this).parent().data('iframe-width');
		jQuery('#template_container, #template_body').css('width', width);
		jQuery( ".zoremmail-layout-content-media .dashicons" ).css('color', '#bdbdbd');
		jQuery( ".zoremmail-layout-content-media .dashicons" ).css('border-bottom-color', '');
		jQuery(this).parent().addClass('active');
		jQuery(this).css('color', '#1d2327');
		jQuery(this).css('border-bottom-color', '#1d2327');
		jQuery("#email_preview").css('width', iframeWidth);
		jQuery("#email_preview").contents().find('#template_container, #template_body, #template_footer').css('width', width);
	});
	
	//hide_widget_header
	if ( jQuery('.hide_widget_header input').is(':checked') === true ) {
		jQuery('.widget_header_text .zoremmail-menu-item').hide();
	} else {
		jQuery('.widget_header_text .zoremmail-menu-item').show();
	}
	jQuery('.hide_widget_header input').on("click", function(){
		if ( jQuery(this).is(':checked') === true ) {
			jQuery('.widget_header_text .zoremmail-menu-item').hide();
		} else {
			jQuery('.widget_header_text .zoremmail-menu-item').show();
		}
	});
	
	//hide_addres_header
	if ( jQuery('.hide_addres_header input').is(':checked') === true ) {
		jQuery('.addres_header_text .zoremmail-menu-item').hide();
	} else {
		jQuery('.addres_header_text .zoremmail-menu-item').show();
	}
	jQuery('.hide_addres_header input').on("click", function(){
		if ( jQuery(this).is(':checked') === true ) {
			jQuery('.addres_header_text .zoremmail-menu-item').hide();
		} else {
			jQuery('.addres_header_text .zoremmail-menu-item').show();
		}
	});
	
	//hide_hours_header
	if ( jQuery('.hide_hours_header input').is(':checked') === true ) {
		jQuery('.header_hours_text .zoremmail-menu-item').hide();
	} else {
		jQuery('.header_hours_text .zoremmail-menu-item').show();
	}
	jQuery('.hide_hours_header input').on("click", function(){
		if ( jQuery(this).is(':checked') === true ) {
			jQuery('.header_hours_text .zoremmail-menu-item').hide();
		} else {
			jQuery('.header_hours_text .zoremmail-menu-item').show();
		}
	});
});

function text_contain(state) {
	var type = getUrlParameter('type');
	if ( type == 'email_content' ) {
		return state.text;	
	} else {
		return state.text;
	}

};

jQuery(document).on("change", "#orderStatus", function(){
	
	"use strict";
	jQuery('.zoremmail-layout-content-preview').addClass('customizer-unloading');
	var Status = jQuery('#orderStatus').val();
	var sPageURL = window.location.href.split('&')[0];
	var id = getUrlParameter('type');
	
	if ( Status == 'pickup' ) {
		jQuery('.customize-section-back').trigger('click');
		jQuery('#email_content').trigger('click');		
	}
	
	window.history.pushState("object or string", sPageURL, sPageURL+'&type='+id+'&email_type='+Status);

	var iframe_url = zorem_customizer.email_iframe_url+'&type='+id+'&email_type='+Status;
	var custom_iframe_url = zorem_customizer.custom_iframe_url+'&type='+id+'&email_type='+Status;
	if ( Status == 'pickup_reminder' ){
		jQuery('.options_panel').attr('data-iframe_url',custom_iframe_url);
		jQuery('iframe').attr('src', custom_iframe_url);
	} else {
		jQuery('.options_panel').attr('data-iframe_url',iframe_url);
		jQuery('iframe').attr('src', iframe_url);
	}

	change_submenu_item();
	jQuery( ".tgl-btn-parent span" ).hide();
	var type = getUrlParameter('type');
	if ( type == 'email_content' ) {
		jQuery( ".tgl-btn-parent .tgl_"+Status ).show();
	}

});

jQuery(document).on("click", ".zoremmail-panel-title", function(event){
	
	var lable = jQuery(this).data('label');
	var id = jQuery(this).attr('id');
	var Status = jQuery('#orderStatus').val();
	
	jQuery('.zoremmail-panels').hide();
	jQuery('.sub_options_panel').hide();
	jQuery( ".zoremmail-panel-title" ).hide(); 
	jQuery('.header_orderStatus').show();
	jQuery('.zoremmail-sub-panels, .zoremmail-sub-panels li.'+id).show();

	jQuery('.zoremmail-sub-panels li').each(function(index, element) {
		if ( jQuery(this).data('id') ===  id ) {
			jQuery(this).addClass('open');
		} else {
			jQuery(this).removeClass('open');
		}
	});
	
	jQuery( ".customize-section-back" ).addClass('panels').show();
	jQuery('.tgl-btn-parent').show();
	//jQuery( '.customizer_Breadcrumb' ).html( '<span class="breadcrumb-sub-panel-title"> <br>' + lable + '</span>' );
	
	var sPageURL = window.location.href.split('&')[0];
	window.history.pushState("object or string", sPageURL, sPageURL+'&type='+id+'&email_type='+Status);
	
	var iframe_url = zorem_customizer.email_iframe_url+'&type='+id+'&email_type='+Status;
	var custom_iframe_url = zorem_customizer.custom_iframe_url+'&type='+id+'&email_type='+Status;
	if ( Status == 'pickup_reminder' ){
		jQuery('.options_panel').attr('data-iframe_url',custom_iframe_url);
		jQuery('iframe').attr('src', custom_iframe_url);
	} else {
		jQuery('.options_panel').attr('data-iframe_url',iframe_url);
		jQuery('iframe').attr('src', iframe_url);
	}
	
	if ( jQuery('.zoremmail-sub-panel-title:visible').length == 1) {
		jQuery(".zoremmail-sub-panel-title:visible").trigger('click');
	}
	
	jQuery( '#orderStatus' ).select2({
		templateSelection: text_contain,
		minimumResultsForSearch: Infinity
	});
	
	change_submenu_item();
	jQuery( ".tgl-btn-parent span" ).hide();
	var type = getUrlParameter('type');
	if ( type == 'email_content' ) {
		jQuery( ".tgl-btn-parent .tgl_"+Status ).show();
	}
	
});

jQuery(document).on("click", ".customize-section-back", function(){
	var Status = jQuery('#orderStatus').val();
	if ( Status == 'pickup' ) {
		jQuery('#email_design').hide();
	} else {
		jQuery('#email_design').show();
	}

});

/*** Custom JS end ***/