<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class React_Customizer_Admin {
	
	private static $screen_id = 'react_customizer';

	private static $text_domain = 'react-customizer-framework';

	private static $screen_title = 'React Customizer'; 

	// WooCommerce email classes.
	public static $email_types_class_names  = array(
		'new_order'                         => 'WC_Email_New_Order',
		'cancelled_order'                   => 'WC_Email_Cancelled_Order',
		'customer_processing_order'         => 'WC_Email_Customer_Processing_Order',
		'customer_completed_order'          => 'WC_Email_Customer_Completed_Order',
		'customer_refunded_order'           => 'WC_Email_Customer_Refunded_Order',
		'customer_on_hold_order'            => 'WC_Email_Customer_On_Hold_Order',
		'customer_invoice'                  => 'WC_Email_Customer_Invoice',
		'failed_order'                      => 'WC_Email_Failed_Order',
		'customer_new_account'              => 'WC_Email_Customer_New_Account',
		'customer_note'                     => 'WC_Email_Customer_Note',
		'customer_reset_password'           => 'WC_Email_Customer_Reset_Password',
	);
	
	public static $email_types_order_status = array(
		'new_order'                         => 'processing',
		'cancelled_order'                   => 'cancelled',
		'customer_processing_order'         => 'processing',
		'customer_completed_order'          => 'completed',
		'customer_refunded_order'           => 'refunded',
		'customer_on_hold_order'            => 'on-hold',
		'customer_invoice'                  => 'processing',
		'failed_order'                      => 'failed',
		'customer_new_account'              => null,
		'customer_note'                     => 'processing',
		'customer_reset_password'           => null,
	);
	
	/**
	 * Get the class instance
	 *
	 * @since  1.0
	 * @return WC_ASRE_Customizer_Admin
	*/
	public static function get_instance() {

		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Instance of this class.
	 *
	 * @var object Class Instance
	*/
	private static $instance;
	
	/**
	 * Initialize the main plugin function
	 * 
	 * @since  1.0
	*/
	public function __construct() {
		$this->init();
	}
	
	/*
	 * init function
	 *
	 * @since  1.0
	*/
	public function init() {

		//adding hooks
		add_action( 'admin_menu', array( $this, 'register_woocommerce_menu' ), 99 );

		add_action('rest_api_init', array( $this, 'route_api_functions' ) );
						
		add_action('admin_enqueue_scripts', array( $this, 'customizer_enqueue_scripts' ) );

		add_action('admin_footer', array( $this, 'admin_footer_enqueue_scripts' ) );

		add_action( 'wp_ajax_' . self::$screen_id . '_email_preview', array( $this, 'get_preview_func' ) );
		add_action( 'wp_ajax_send_' . self::$screen_id . '_test_email', array( $this, 'send_test_email_func' ) );

		// Custom Hooks for everyone
		add_filter( 'react_customizer_email_options', array( $this, 'react_customizer_email_options' ), 10, 2);
		add_filter( 'react_customizer_preview_content', array( $this, 'react_customizer_preview_content' ), 10, 1);
		
	}
	
	/*
	 * Admin Menu add function
	 *
	 * @since  2.4
	 * WC sub menu 
	*/
	public function register_woocommerce_menu() {
		add_menu_page( __( self::$screen_title, self::$text_domain ), __( self::$screen_title, self::$text_domain ), 'manage_options', self::$screen_id, array( $this, 'react_settingsPage' ) );
	}

	/*
	 * Call Admin Menu data function
	 *
	 * @since  2.4
	 * WC sub menu 
	*/
	public function react_settingsPage()
    {
        echo '<div id="root"></div>';
    }

	/*
	 * Add admin javascript
	 *
	 * @since  2.4
	 * WC sub menu 
	*/
	public function admin_footer_enqueue_scripts() {
		//echo '<style type="text/css">#toplevel_page_'. self::$screen_id .' { display: none !important; }</style>';
	}
	
	/*
	* Add admin javascript
	*
	* @since 1.0
	*/	
	public function customizer_enqueue_scripts() {
		
		
		$page = isset( $_GET['page'] ) ? sanitize_text_field($_GET['page']) : '' ;
		
		// Add condition for css & js include for admin page  
		if ( self::$screen_id == $page ) {
			// Add the WP Media 
			wp_enqueue_media();
			
			wp_enqueue_script( self::$screen_id, plugin_dir_url(__FILE__) . 'dist/main.js', ['jquery', 'wp-util', 'wp-color-picker'], time(), true);
			wp_localize_script( self::$screen_id, self::$screen_id, array(
				'main_title'	=> self::$screen_title,
				'text_domain'	=> self::$text_domain,
				'admin_email' => get_option('admin_email'),
				'send_test_email_btn' => true,
				'iframeUrl'	=> array(
					'new_order'					=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=new_order'),
					'cancelled_order'			=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=cancelled_order'),
					'customer_processing_order' => admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_processing_order'),
					'customer_completed_order'	=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_completed_order'),
					'customer_refunded_order'	=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_refunded_order'),
					'customer_on_hold_order'	=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_on_hold_order'),
					'customer_invoice'			=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_invoice'),
					'failed_order'				=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=failed_order'),
					'customer_new_account'		=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_new_account'),
					'customer_note'				=> admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=customer_note'),
				),
				'back_to_wordpress_link' => '',
				'rest_nonce'	=> wp_create_nonce('wp_rest'),
				'rest_base'	=> esc_url_raw( rest_url() ),
			));
		}
		
	}


	/*
	 * Customizer Routes API 
	*/
	public function route_api_functions() {

		register_rest_route( self::$screen_id, 'settings',array(
			'methods'  => 'GET',
			'callback' => [$this, 'return_json_sucess_settings_route_api'],
			'permission_callback' => '__return_true',
		));

		/*register_rest_route( self::$screen_id, 'preview', array(
			'methods'  => 'GET',
			'callback' => [$this, 'return_json_sucess_preview_route_api'],
			'permission_callback' => '__return_true',
		));*/

		register_rest_route( self::$screen_id, 'store/update',array(
			'methods'				=> 'POST',
			'callback'				=> [$this, 'update_store_settings'],
			'permission_callback'	=> '__return_true',
		));

		register_rest_route( self::$screen_id, 'send-test-email',array(
			'methods'				=> 'POST',
			'callback'				=> [$this, 'send_test_email_func'],
			'permission_callback'	=> '__return_true',
		));

	}

	/*
	 * Settings API 
	*/
	public function return_json_sucess_settings_route_api( $request ) {
		$preview = !empty($request->get_param('preview')) ? $request->get_param('preview') : '';
		return wp_send_json_success($this->customize_setting_options_func( $preview ));

	}

	public function customize_setting_options_func( $preview) {

		$settings = apply_filters(  self::$screen_id . '_email_options' , $settings = array(), $preview );
		
		return $settings; 

	}

	/*
	 * Preview API 
	*/
	/*public function return_json_sucess_preview_route_api($request) {
		$preview = !empty($request->get_param('preview')) ? $request->get_param('preview') : '';
		return wp_send_json_success($this->get_preview_email($preview));
	}*/

	public function get_preview_func() {
		$preview = isset($_GET['preview']) ? $_GET['preview'] : '';
		echo $this->get_preview_email($preview);die();
	}

	/**
	 * Get the email content
	 *
	 */
	public function get_preview_email( $preview ) { 

		

		$content = apply_filters( self::$screen_id . '_preview_content' , $preview );

		$content .= '<style type="text/css">body{margin: 0;}</style>';

		add_filter( 'wp_kses_allowed_html', array( $this, 'allowed_css_tags' ) );
		add_filter( 'safe_style_css', array( $this, 'safe_style_css' ), 10, 1 );

		return wp_kses_post($content);
	}

	/*
	* update a customizer settings
	*/
	public function update_store_settings( $request ) {

		$preview = !empty($request->get_param('preview')) ? $request->get_param('preview') : '';

		$data = $request->get_params() ? $request->get_params() : array();

		if ( ! empty( $data ) ) {

			//data to be saved
			
			$settings = $this->customize_setting_options_func( $preview );
			
			foreach ( $settings as $key => $val ) {
				if ( !isset($data[$key] ) || (isset($val['show']) && $val['show'] != true) ) {
					continue;
				}

				//check column exist
				if ( isset( $val['type'] ) && 'textarea' == $val['type'] && !isset( $val['option_key'] ) && isset($val['option_name']) ) {
					$option_data = isset($data[$key]) ? wp_kses_post( wp_unslash( $data[$key] ) ) : '';
                    update_option( $val['option_name'], $option_data );
				} elseif ( isset( $val['option_type'] ) && 'key' == $val['option_type'] ) {
					$data[$key] = isset($data[$key]) ? wc_clean( wp_unslash( $data[$key] ) ) : '';
					update_option( $key, $data[$key] );
				} elseif ( isset( $val['option_type'] ) && 'array' == $val['option_type'] ) {
					if ( isset( $val['option_key'] ) && isset( $val['option_name'] ) ) {
						$option_data = get_option( $val['option_name'], array() );
						if ( $val['option_key'] == 'enabled' ) {
							$option_data[$val['option_key']] = isset($data[$key]) && $data[$key] == 1 ? wc_clean( wp_unslash( "yes" ) ) : wc_clean( wp_unslash( "no" ) );
						} else {
							$option_data[$val['option_key']] = isset($data[$key]) ? wp_kses_post( wp_unslash( $data[$key] ) ) : '';
						}
						update_option( $val['option_name'], $option_data );
					} else if ( isset($val['option_name']) ) {
						$option_data = get_option( $val['option_name'], array() );
						$option_data[$key] = isset($data[$key]) ? wc_clean( wp_unslash( $data[$key] ) ) : '';
						update_option( $val['option_name'], $option_data );
					}
				}
			}
			
			echo json_encode( array('success' => true, 'preview' => $preview) );
			die();
	
		}

		echo json_encode( array('success' => false) );
		die();
	}

	/*
	* send a test email
	*/
	public function send_test_email_func($request) {

		$data = $request->get_params() ? $request->get_params() : array();

		$preview = !empty( $data['preview'] ) ? sanitize_text_field($data['preview']) : '';
		$recipients = !empty( $data['recipients'] ) ? sanitize_text_field($data['recipients']) : '';

		if ( ! empty( $preview ) && ! empty( $recipients ) ) {
			
			$message 		= apply_filters( self::$screen_id . '_preview_content' , $preview );
			$subject_email 	= 'email';
			$subject = str_replace('{site_title}', get_bloginfo( 'name' ), 'Test ' . $subject_email );
			
			// create a new email
			$email 		= new WC_Email();
			add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
			add_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );

			$recipients = explode( ',', $recipients );
			if ($recipients) {
				foreach ( $recipients as $recipient) {
					wp_mail( $recipient, $subject, $message, $email->get_headers() );
				}
			}
			
			echo json_encode( array('success' => true) );
			die();
			
		}

		echo json_encode( array('success' => false) );
		die();
	}

	public function react_customizer_email_options($settings, $preview) {
						
		$pickup_instruction = get_option('pickup_instruction_customize_settings', array());
		
		$settings = array(
			
			//panels
			'email_content'	=> array(
				'title'	=> esc_html__( 'Email Content', self::$text_domain ),
				'type'	=> 'panel',
			),
			'email_design'	=> array(
				'title'	=> esc_html__( 'Email Design', self::$text_domain ),
				'type'	=> 'panel',
			),
			'import_export'	=> array(
				'title'	=> esc_html__( 'Import / Export', self::$text_domain ),
				'type'	=> 'panel',
			),
			
			//sub-panels
			'widget_style' => array(
				'title'       => esc_html__( 'Widget Style', self::$text_domain ),
				'type'     => 'sub-panel',
				'parent'	=> 'email_design',
				'preview' => 'customer_on_hold_order'
			), 
			
			//settings
			'title1' => array(
				'title'    => esc_html__( 'Header Section', self::$text_domain ),
				'parent'	=> 'widget_style',
				'type'     => 'title',
				'show'     => true,
			),
			'branding_logo' => array(
				'title'    => esc_html__( 'Change header image', self::$text_domain ),
				'parent'	=> 'widget_style',
				'type'     => 'media',
				'show'     => true,
				'option_type' => 'array',
				'desc'     => esc_html( 'image size requirements: 200px/40px.', 'sales-report-email-pro' ),
				'default'	=> ''
			),
			'widget_layout' => array(
				'title'    => esc_html__( 'Widget Layout', self::$text_domain ),
				'parent'	=> 'widget_style',
				'type'     => 'radio',
				'default'  => !empty($pickup_instruction['widget_layout']) ? $pickup_instruction['widget_layout'] : '2column',
				'show'     => true,
				'refresh'     => true,
				'choices'  => array(
					'2colums' => '2 Columns',
					'1colums' => '1 Column'
				),
				'option_name' => 'pickup_instruction_customize_settings',
				'option_type' => 'array',
			),
			'background_color' => array(
				'title'    => esc_html__( 'Background Color', self::$text_domain ),
				'parent'	=> 'widget_style',
				'type'     => 'color',
				'default'  => !empty($pickup_instruction['background_color']) ? $pickup_instruction['background_color'] : '#f5f5f5',
				'show'     => true,
				'option_name' => 'pickup_instruction_customize_settings',
				'option_type' => 'array',
			),
			'padding' => array(
				'title'    => esc_html__( 'Padding', self::$text_domain ),
				'parent'	=> 'widget_style',
				'type'     => 'range',
				'default'  => !empty($pickup_instruction['padding']) ? $pickup_instruction['padding'] : '15',
				'show'     => true,
				'option_name' => 'pickup_instruction_customize_settings',
				'option_type' => 'array',
				'min' => "0",
				'max' => "30",
				"unit"=> "px"
			),

			'export' => array(
				'title'		=> esc_html__( 'Export', self::$text_domain ),
				'parent'	=> 'import_export',
				'type'		=> 'export',
				'show'		=> true,
				'desc'		=> esc_html__( 'Click the button below to export the customization settings for this plugin.', self::$text_domain ),
			),
			'import' => array(
				'title'		=> esc_html__( 'Import', self::$text_domain ),
				'parent'	=> 'import_export',
				'type'		=> 'import',
				'show'		=> true,
				'desc'		=> esc_html__( 'Upload a file to import customization settings for this plugin.', self::$text_domain ),
			),

		);
		
		//settings			
		$email_types = array(
			'new_order'                         => 'New Order',
			'cancelled_order'                   => 'Cancelled Order',
			'customer_processing_order'         => 'Processing Order',
			'customer_completed_order'          => 'Completed Order',
			'customer_refunded_order'           => 'Refunded Order',
			'customer_on_hold_order'            => 'On Hold Order',
			'customer_invoice'                  => 'Customer Invoice',
			'failed_order'                      => 'Failed Order',
			'customer_new_account'              => 'Customer New Account',
			'customer_note'                     => 'Customer Note',
		);
		
		$settings[ 'email_type' ] = array(
			'title'    => esc_html__( 'Email type', self::$text_domain ),
			'type'     => 'select',
			'default'  => $preview ? $preview : 'new_order',
			'options'  => $email_types,
			'show'     => true,
			'previewType' => true,
			'parent'=> 'email_content',
		);
		
		foreach ( $email_types as $key => $value ) {
			
			$email_settings = get_option('woocommerce_' . $key . '_settings', array());
			
			$settings[ $key . '_enabled' ] = array(
				'title'    => esc_html__( 'Enable email', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => !empty($email_settings['enabled']) && $email_settings['enabled'] == 'no' ? 0 : 1,
				'type'     => 'tgl-btn',
				'show'     => true,
				'sorting'     => true,
				'breakdown' => array(
					'default' => '5',
					'option' => array( '5'=>'5','10'=>'10', '20'=>'20', '100'=>'All' ),
				),
				'option_name'=> 'woocommerce_'.$key.'_settings',
				'option_key'=> 'enabled',
				'option_type'=> 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			
			$settings[ $key . '_recipient' ] = array(
				'title'    => esc_html__( 'Recipients', self::$text_domain ),
				'parent'=> 'email_content',
				'desc'  => esc_html__( 'add recipient and press enter or comma to add recipients, defaults to placeholder {customer_email} ', self::$text_domain ),
				'default'  => !empty($email_settings['recipient']) ? $email_settings['recipient'] : '{customer_email}',
				'placeholder' => esc_html__( 'add recipient and press enter or comma', self::$text_domain ),
				'type'     => 'tags-input',
				'show'     => true,
				'option_name' => 'woocommerce_'.$key.'_settings',
				'option_key'=> 'recipient',
				'option_type' => 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_subject' ] = array(
				'title'    => esc_html__( 'Email Subject', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => !empty($email_settings['subject']) ? wp_kses_post($email_settings['subject']) : '',
				'placeholder' => '',
				'type'     => 'text',
				'show'     => true,
				'option_name' => 'woocommerce_'.$key.'_settings',
				'option_key'=> 'subject',
				'option_type' => 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			
			$settings[ $key . '_heading' ] = array(
				'title'    => esc_html__( 'Email heading', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => !empty($email_settings['heading']) ? wp_kses_post($email_settings['heading']) : '',
				'placeholder' => '',
				'type'     => 'text',
				'show'     => true,
				'class'	=> 'heading',
				'option_name' => 'woocommerce_'.$key.'_settings',
				'option_key'=> 'heading',
				'option_type' => 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_additional_content' ] = array(
				'title'    => esc_html__( 'Email content', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => !empty($email_settings['additional_content']) ? wp_kses_post($email_settings['additional_content']) : '',
				'placeholder' => '',
				'type'     => 'textarea',
				'show'     => true,
				'class'	=> 'additional_content',
				'option_key'=> 'additional_content',
				'option_name' => 'woocommerce_'.$key.'_settings',
				'option_type' => 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_codeinfoblock' ] = array(
				'title'    => esc_html__( 'Available Placeholders:', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => '<code>{customer_first_name}<br>{customer_last_name}<br>{site_title}<br>{order_number}</code>',
				'type'     => 'codeinfo',
				'show'     => true,
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_display_product_images' ] = array(
				'title'    => esc_html__( 'Display Product Image', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => isset($email_settings['display_product_images']) ? $email_settings['display_product_images'] : '1',
				'type'     => 'checkbox',
				'show'     => true,
				'option_name'=> 'woocommerce_'.$key.'_settings',
				'option_key'=> 'display_product_images',
				'option_type'=> 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_display_product_prices' ] = array(
				'title'    => esc_html__( 'Display Product Price', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => isset($email_settings['display_product_prices']) ? $email_settings['display_product_prices'] : '1',
				'type'     => 'checkbox',
				'show'     => true,
				'option_name'=> 'woocommerce_'.$key.'_settings',
				'option_key'=> 'display_product_prices',
				'option_type'=> 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_display_shipping_address' ] = array(
				'title'    => esc_html__( 'Display Customer Details', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => isset($email_settings['display_shipping_address']) ? $email_settings['display_shipping_address'] : '1',
				'type'     => 'checkbox',
				'show'     => true,
				'option_name'=> 'woocommerce_'.$key.'_settings',
				'option_key'=> 'display_shipping_address',
				'option_type'=> 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
			$settings[ $key . '_display_billing_address' ] = array(
				'title'    => esc_html__( 'Display Billing Address', self::$text_domain ),
				'parent'=> 'email_content',
				'default'  => isset($email_settings['display_billing_address']) ? $email_settings['display_billing_address'] : '1',
				'type'     => 'checkbox',
				'show'     => true,
				'option_name'=> 'woocommerce_'.$key.'_settings',
				'option_key'=> 'display_billing_address',
				'option_type'=> 'array',
				'class'		=> $key . '_sub_menu all_status_submenu',
			);
		};

		return $settings;
	}

	public function react_customizer_preview_content( $preview ) {

		// Load WooCommerce emails.
		$wc_emails      = WC_Emails::instance();
		$emails         = $wc_emails->get_emails();		
		
		$preview_id = 'mockup';

		$preview = self::get_email_class_name( $preview );

		if ( false === $preview ) {
			return false;
		}		 				
		
		// Reference email.
		if ( isset( $emails[ $preview ] ) && is_object( $emails[ $preview ] ) ) {
			$email = $emails[ $preview ];
		
		}
		$order_status = self::get_email_order_status( $preview );
		
		// Get an order
		$order = self::get_wc_order_for_preview( $order_status, $preview_id );		

		if ( is_object( $order ) ) {
			// Get user ID from order, if guest get current user ID.
			$user_id = (int) get_post_meta( $order->get_id(), '_customer_user', true );
			if ( 0 === $user_id ) {
				$user_id = get_current_user_id();
			}
		} else {
			$user_id = get_current_user_id();
		}
		// Get user object
		$user = get_user_by( 'id', $user_id );
		
		if ( isset( $email ) ) {
			// Make sure gateways are running in case the email needs to input content from them.
			WC()->payment_gateways();
			// Make sure shipping is running in case the email needs to input content from it.
			WC()->shipping();
			switch ( $preview ) {
				/**
				 * WooCommerce (default transactional mails).
				 */
				case 'customer_invoice':
					$email->object = $order;
					if ( is_object( $order ) ) {
						$email->invoice = ( function_exists( 'wc_gzdp_get_order_last_invoice' ) ? wc_gzdp_get_order_last_invoice( $order ) : null );
						$email->find['order-date']   = '{order_date}';
						$email->find['order-number'] = '{order_number}';
						$email->replace['order-date']   = wc_format_datetime( $email->object->get_date_created() );
						$email->replace['order-number'] = $email->object->get_order_number();
						// Other properties
						$email->recipient = $email->object->get_billing_email();
					}
					break;
				case 'customer_refunded_order':
					$email->object               = $order;
					$email->partial_refund       = $partial_status;
					if ( is_object( $order ) ) {
						$email->find['order-date']   = '{order_date}';
						$email->find['order-number'] = '{order_number}';
						$email->replace['order-date']   = wc_format_datetime( $email->object->get_date_created() );
						$email->replace['order-number'] = $email->object->get_order_number();
						// Other properties
						$email->recipient = $email->object->get_billing_email();
					}
					break;
				case 'customer_new_account':
					$email->object             = $user;
					$email->user_pass          = '{user_pass}';
					$email->user_login         = stripslashes( $email->object->user_login );
					$email->user_email         = stripslashes( $email->object->user_email );
					$email->recipient          = $email->user_email;
					$email->password_generated = true;
					break;
				case 'customer_note':
					$email->object                  = $order;
					$email->customer_note           = __( 'Hello! This is an example note', 'woocommerce' );
					if ( is_object( $order ) ) {
						$email->find['order-date']      = '{order_date}';
						$email->find['order-number']    = '{order_number}';
						$email->replace['order-date']   = wc_format_datetime( $email->object->get_date_created() );
						$email->replace['order-number'] = $email->object->get_order_number();
						// Other properties
						$email->recipient = $email->object->get_billing_email();
					}
					break;
				case 'customer_reset_password':
					$email->object     = $user;
					$email->user_id    = $user_id;
					$email->user_login = $user->user_login;
					$email->user_email = stripslashes( $email->object->user_email );
					$email->reset_key  = '{{reset-key}}';
					$email->recipient  = stripslashes( $email->object->user_email );
					break;
				
				/**
				 * Everything else.
				 */
				default:
					$email->object               = $order;
					$user_id = get_post_meta( $email->object->get_order_number(), '_customer_user', true );
					if ( is_object( $order ) ) {
						$email->find['order-date']   = '{order_date}';
						$email->find['order-number'] = '{order_number}';
						$email->find['customer-first-name'] = '{customer_first_name}';
						$email->find['customer-last-name'] = '{customer_last_name}';
						$email->replace['order-date']   = wc_format_datetime( $email->object->get_date_created() );
						$email->replace['order-number'] = $email->object->get_order_number();
						$email->replace['customer-first-name'] = get_user_meta( $user_id, 'shipping_first_name', true );
						$email->replace['customer-last-name'] = get_user_meta( $user_id, 'shipping_last_name', true );
						// Other properties
						$email->recipient = $email->object->get_billing_email();
					}
					break;
			}

			if ( ! empty( $email ) ) {

				$content = $email->get_content();
				$content = $email->style_inline( $content );				
				$content = apply_filters( 'woocommerce_mail_content', $content );	
				
			} else {
				if ( false == $email->object ) {
					$content = '<div style="padding: 35px 40px; background-color: white;">' . __( 'This email type can not be previewed please try a different order or email type.', self::$text_domain ) . '</div>';
				}
			}
		} else {
			$content = false;
		}
		
		return $content;
		die();
	}

	/**
	 * Get WooCommerce order for preview
	 *
	 * @param string $order_status
	 * @return object
	 */
	public static function get_wc_order_for_preview( $order_status = null, $order_id = null ) {
		if ( ! empty( $order_id ) && 'mockup' != $order_id ) { 
			return wc_get_order( $order_id );
		} else {
			// Use mockup order

			// Instantiate order object
			$order = new WC_Order();

			// Other order properties
			$order->set_props( array(
				'id'                 => 1,
				'status'             => ( null === $order_status ? 'processing' : $order_status ),
				'billing_first_name' => 'Sherlock',
				'billing_last_name'  => 'Holmes',
				'billing_company'    => 'Detectives Ltd.',
				'billing_address_1'  => '221B Baker Street',
				'billing_city'       => 'London',
				'billing_postcode'   => 'NW1 6XE',
				'billing_country'    => 'GB',
				'billing_email'      => 'sherlock@holmes.co.uk',
				'billing_phone'      => '02079304832',
				'date_created'       => gmdate( 'Y-m-d H:i:s' ),
				'total'              => 24.90,
			) );

			// Item #1
			$order_item = new WC_Order_Item_Product();
			$order_item->set_props( array(
				'name'     => 'A Study in Scarlet',
				'subtotal' => '9.95',
			) );
			$order->add_item( $order_item );

			// Item #2
			$order_item = new WC_Order_Item_Product();
			$order_item->set_props( array(
				'name'     => 'The Hound of the Baskervilles',
				'subtotal' => '14.95',
			) );
			$order->add_item( $order_item );

			// Return mockup order
			return $order;
		}

	} 

	/**
	 * Get the from name for outgoing emails.
	 *
	 * @return string
	 */
	public function get_from_name() {
		$from_name = apply_filters( 'woocommerce_email_from_name', get_option( 'woocommerce_email_from_name' ), $this );
		return wp_specialchars_decode( esc_html( $from_name ), ENT_QUOTES );
	}

	/**
	 * Get the from address for outgoing emails.
	 *
	 * @return string
	 */
	public function get_from_address() {
		$from_address = apply_filters( 'woocommerce_email_from_address', get_option( 'woocommerce_email_from_address' ), $this );
		return sanitize_email( $from_address );
	}
	
	/**
	 * Get the email order status
	 *
	 * @param string $email_template the template string name.
	 */
	public function get_email_order_status( $email_template ) {
		
		$order_status = apply_filters( 'customizer_email_type_order_status_array', self::$email_types_order_status );
		
		$order_status = self::$email_types_order_status;
		
		if ( isset( $order_status[ $email_template ] ) ) {
			return $order_status[ $email_template ];
		} else {
			return 'processing';
		}
	}

	/**
	 * Get the email class name
	 *
	 * @param string $email_template the email template slug.
	 */
	public function get_email_class_name( $email_template ) {
		
		$class_names = apply_filters( 'customizer_email_type_class_name_array', self::$email_types_class_names );

		$class_names = self::$email_types_class_names;
		if ( isset( $class_names[ $email_template ] ) ) {
			return $class_names[ $email_template ];
		} else {
			return false;
		}
	}

	public function allowed_css_tags( $tags ) {
		$tags['style'] = array( 'type' => true, );
		return $tags;
	}
	
	public function safe_style_css( $styles ) {
		 $styles[] = 'display';
		return $styles;
	}

}
