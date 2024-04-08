# customizer-framework
## Introduction
The Customizer framework is a great tool to add options to your plugin so users can customize it. The framework that allows you to add controls to the customizer, in a simple, fast and easily maintainable way. In this guide, I'm going to introduce you to customizer framework. We'll also create several settings and demonstrate how they work.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Panels and Controls](#panels-and-sections)
- [Adding Controls](#adding-controls)

## Installation
You can simply copy the files in your plugin and then include the main plugin file.

Go to the Github and download the zip file OR clone the repository from Git.

### where its located in Git
<code>git clone https://github.com/kuldip-navadiya/customizer-framework.git  // Clone this repo into your own directory.</code>
After, clone this repo into your own directory and you will see in directory <code>customizer</code> folder in your plugin folder is created.
<p><strong>OR</strong></p>
<code>https://github.com/kuldip-navadiya/customizer-framework/archive/refs/heads/main.zip // Download this repo from the link.</code>

After, Download this repo from the link. you need to unzip this zip file and copy the <code>customizer</code> folder in your plugin.

Then, Add the following code to include in the main plugin file of your plugin's.

<pre><code>
  //Hooks
  add_action( 'plugins_loaded', array( $this, 'on_plugins_loaded' ) );

  /*
  * include file on plugin load
  */
  public function on_plugins_loaded() {
    // customizer
    require_once $this->get_plugin_path() . '/customizer/customizer-admin.php';	
    $this->customizer = Customizer_Admin::get_instance();
  }

  /**
  * Gets the absolute plugin path without a trailing slash, e.g.
  * /path/to/wp-content/plugins/plugin-directory.
  *
  * @return string plugin path
  */
  public function get_plugin_path() {
    if ( isset( $this->plugin_path ) ) {
      return $this->plugin_path;
    }

    $this->plugin_path = untrailingslashit( plugin_dir_path( __FILE__ ) );
    return $this->plugin_path;
  }
</code></pre>

## Configuration
To configure customizer framework, we're going to path <code>your-pluign-folder/customizer/customizer-admin.php</code> and open PHP-file in your plugin. This file will contain all the controls and the basic configuration.

After, Open <code>customizer-admin.php</code> file and chnage <code>$screen_id</code> and <code>$screen_title</code> as per your admin page.

<code>private static $screen_id = 'customizer_framework'; // Enter your admin page id</code><br>
<code>private static $screen_title = 'Customizer Framework'; // Enter your customizer title</code>

Then, please set below localize script parameter as per requirment
<pre><code>
	wp_localize_script( self::$screen_id, self::$screen_id, array(
		'main_title'	=> self::$screen_title,		// Customizer main title
		'admin_email' => get_option('admin_email'),	// Admin email address
		'send_test_email_btn' => true,		// Show/Hide a send test email button in framework
		'iframeUrl'	=> apply_filters(  self::$screen_id . '_iframeUrls' , array('processing_lp' => admin_url('admin-ajax.php?action=' . self::$screen_id . '_email_preview&preview=processing_lp'),), self::$screen_id ),	// Preview irameURL as order status and preview id
		'back_to_wordpress_link' => admin_url(),	// redirect after close customizer framework
		'rest_nonce'	=> wp_create_nonce('wp_rest'),	// Nonce for security perpose
		'rest_base'	=> esc_url_raw( rest_url() ),	// Rest base URL for API
	));
</code></pre>

Then, Use filter hooks to add controls and preview.

<pre><code>
// hooks for return settings options
apply_filters(  self::$screen_id . '_email_options' , $settings = array(), $preview );	// Parameter $setting and $preview = 'preview id'

// hooks for return Preview content
apply_filters( self::$screen_id . '_preview_content' , $preview );	// Parameter $preview = 'preview id'
</code></pre>

## Panels and Controls

## Adding Controls