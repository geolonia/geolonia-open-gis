<?php
/**
 * Class TestLoadTextdomain
 */

class Test_LoadTextdomain extends WP_UnitTestCase {
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
	 * @covers ::geolonia_gis_load_textdomain
	 */
	public function test_load_textdomain() {

		add_filter('locale', function() {
			return 'ja';
		});
		$this->assertTrue( geolonia_gis_load_textdomain() );
	}

	/**
	 * @covers ::geolonia_gis_load_textdomain
	 */
	public function test_load_textdomain_by_plugin_locale() {
		add_filter('plugin_locale', function() {
			return 'ja';
		});
		$this->assertTrue( geolonia_gis_load_textdomain() );
	}

	/**
	 * @covers ::geolonia_gis_load_textdomain
	 */
	public function test_load_textdomain_when_locale_is_english() {
		add_filter('locale', function() {
			return 'en_US';
		});
		$this->assertFalse( geolonia_gis_load_textdomain() );
	}

	/**
	 * @covers ::geolonia_gis_load_textdomain
	 */
	public function test_load_textdomain_plugin_locale_is_english() {
		add_filter('plugin_locale', function() {
			return 'en_US';
		});
		$this->assertFalse( geolonia_gis_load_textdomain() );
	}

	/**
	 * @covers ::geolonia_gis_load_textdomain
	 */
	public function test_load_textdomain_user_locale_is_japanese() {

		add_filter('locale', function() {
			return 'en_US';
		});

		set_current_screen( 'dashboard' );
		wp_set_current_user( self::$user_id );

		$this->assertTrue( geolonia_gis_load_textdomain() );
	}
}
