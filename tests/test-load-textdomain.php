<?php
/**
 * Class TestLoadTextdomain
 *
 * @package Geolonia_Gis
 */

class TestLoadTextdomain extends WP_UnitTestCase {
	protected static $user_id;

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ) {
		self::$user_id = $factory->user->create(
			array(
				'role'   => 'administrator',
				'locale' => 'ja',
			)
		);
	}

	/**
	 * Test load_textdomain when locale is Japanese
	 */
	public function test_load_textdomain() {

		add_filter('locale', function() {
			return 'ja';
		});
		$this->assertTrue( geolonia_gis_load_textdomain() );
	}

	/**
	 * Test load_textdomain when plugin_locale is Japanese
	 */
	public function test_load_textdomain_plugin_locale() {
		add_filter('plugin_locale', function() {
			return 'ja';
		});
		$this->assertTrue( geolonia_gis_load_textdomain() );
	}

	/**
	 * Test load_textdomain when locale is English
	 */
	public function test_load_textdomain_en() {
		add_filter('locale', function() {
			return 'en_US';
		});
		$this->assertFalse( geolonia_gis_load_textdomain() );
	}

	/**
	 * Test load_textdomain when plugin_locale is English
	 */
	public function test_load_textdomain_plugin_locale_en() {
		add_filter('plugin_locale', function() {
			return 'en_US';
		});
		$this->assertFalse( geolonia_gis_load_textdomain() );
	}

	/**
	 * Test load_textdomain when user locale is Japanese
	 */
	public function test_load_textdomain_ja_user() {

		add_filter('locale', function() {
			return 'en_US';
		});

		set_current_screen( 'dashboard' );
		wp_set_current_user( self::$user_id );

		$this->assertTrue( geolonia_gis_load_textdomain() );
	}
}
