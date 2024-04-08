<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Customizer_Admin {
	
	private static $screen_id = 'customizer_framework';

	private static $screen_title = 'Customizer Framework'; 
	
	/**
	 * Get the class instance
	 *
	 * @since  1.0
	 * @return Customizer_Admin
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
		//add_filter( 'alp_customizer_email_options', array( $this, 'alp_customizer_email_options' ), 10, 2);
		//add_filter( 'alp_customizer_preview_content', array( $this, 'alp_customizer_preview_content' ), 10, 1);
		
	}
	
	/*
	 * Admin Menu add function
	 *
	 * @since  2.4
	 * WC sub menu 
	*/
	public function register_woocommerce_menu() {
		add_menu_page( __( self::$screen_title, 'advanced-local-pickup-pro' ), __( self::$screen_title, 'advanced-local-pickup-pro' ), 'manage_options', self::$screen_id, array( $this, 'react_settingsPage' ) );
	}

	/*
	 * Call Admin Menu data function
	 *
	 * @since  2.4
	 * WC sub menu 
	*/
	public function react_settingsPage() {
		echo '<div id="root"></div>';
	}

	/*
	 * Add admin javascript
	 *
	 * @since  2.4
	 * WC sub menu 
	*/
	public function admin_footer_enqueue_scripts() {
		echo '<style type="text/css">#toplevel_page_' . esc_html(self::$screen_id) . ' { display: none !important; }</style>';

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
				'admin_email' => get_option('admin_email'),
				'send_test_email_btn' => true,
				'iframeUrl'	=> array(
					'processing' => admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=processing'),
				),
				'back_to_wordpress_link' => admin_url(),
				'rest_nonce'	=> wp_create_nonce('wp_rest'),
				'rest_base'	=> esc_url_raw( rest_url() ),
			));

			//Custom CSS and JS includes
			wp_enqueue_style( self::$screen_id . '-css', plugin_dir_url(__FILE__) . 'assets/custom.css', array(), time() );
			wp_enqueue_script( self::$screen_id . '-js', plugin_dir_url(__FILE__) . 'assets/custom.js', ['jquery', 'wp-util', 'wp-color-picker'], time(), true );
		}
		
	}


	/*
	 * Customizer Routes API 
	*/
	public function route_api_functions() {

		register_rest_route( self::$screen_id, 'settings', array(
			'methods'  => 'GET',
			'callback' => [$this, 'return_json_sucess_settings_route_api'],
			'permission_callback' => '__return_true',
		));

		register_rest_route( self::$screen_id, 'store/update', array(
			'methods'				=> 'POST',
			'callback'				=> [$this, 'update_store_settings'],
			'permission_callback'	=> '__return_true',
		));

		register_rest_route( self::$screen_id, 'send-test-email', array(
			'methods'				=> 'POST',
			'callback'				=> [$this, 'send_test_email_func'],
			'permission_callback'	=> '__return_true',
		));

	}

	/*
	 * Settings API 
	*/
	public function return_json_sucess_settings_route_api( $request ) {
		$preview = !empty($request->get_param('preview')) ? $request->get_param('preview') : 'ready_pickup';
		return wp_send_json_success($this->customize_setting_options_func( $preview ));

	}

	public function customize_setting_options_func( $preview ) {

		$settings = apply_filters(  self::$screen_id . '_email_options' , $settings = array(), $preview );
		
		return $settings; 

	}


	public function get_preview_func() {
		$preview = isset($_GET['preview']) ? sanitize_text_field($_GET['preview']) : 'ready_pickup';
		echo $this->get_preview_email($preview);
		die();
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

				if ( !isset($data[$key]) || ( isset($val['show']) && true != $val['show'] ) ) {
					continue;
				}

				//check column exist
				if ( isset( $val['option_type'] ) && 'key' == $val['option_type'] ) {
					$data[$key] = isset($data[$key]) ? wp_kses_post( wp_unslash( $data[$key] ) ) : '';
					update_option( $key, $data[$key] );
				} elseif ( isset( $val['option_type'] ) && 'array' == $val['option_type'] ) {
					if ( isset( $val['option_key'] ) && isset( $val['option_name'] ) ) {
						$option_data = get_option( $val['option_name'], array() );
						if ( 'enabled' == $val['option_key'] ) {
							$option_data[$val['option_key']] = isset($data[$key]) && 1 == $data[$key] ? wp_kses_post( wp_unslash( 'yes' ) ) : wp_kses_post( wp_unslash( 'no' ) );
						} else {
							$option_data[$val['option_key']] = isset($data[$key]) ? wp_kses_post( wp_unslash( $data[$key] ) ) : '';
						}
						update_option( $val['option_name'], $option_data );
					} elseif ( isset($val['option_name']) ) {
						$option_data = get_option( $val['option_name'], array() );
						$option_data[$key] = isset($data[$key]) ? wp_kses_post( wp_unslash( $data[$key] ) ) : '';
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
	public function send_test_email_func( $request ) {
		
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
	 * allow css tags for emails.
	 *
	 * @return $tags
	 */
	public function allowed_css_tags( $tags ) {
		$tags['style'] = array( 'type' => true, );
		return $tags;
	}
	/**
	 * allow style css for emails.
	 *
	 * @return $styles
	 */
	public function safe_style_css( $styles ) {
		$styles[] = 'display';
		return $styles;
	}

}
