<?php

class Test_Translation extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();

		add_filter('locale', function() {
			return 'ja';
		});

		load_plugin_textdomain( 'geolonia-open-gis', false, dirname(dirname( plugin_basename( __FILE__ ) )). '/languages' );
	}

	public function test_translation() {

		$domain = 'geolonia-open-gis';

		$this->assertSame( 'GeoJSON をアップロードしてください', __( 'Upload GeoJSON', $domain ) );
		$this->assertSame( '座標', __( 'Coordinates', $domain ) );
		$this->assertSame( '現在の座標を使用する', __( 'Use the current coordinates', $domain ) );
		$this->assertSame( 'ズーム', __( 'Zoom', $domain ) );
		$this->assertSame( '現在のズームレベルを使用する', __( 'Use the current zoom level', $domain ) );
		$this->assertSame( 'スタイル', __( 'Style', $domain ) );
		$this->assertSame( '地物の数: <span id="num-of-features"></span>', __( 'Number of features: <span id="num-of-features"></span>', $domain ) );
		$this->assertSame( '標準', __( 'Standard', $domain ) );
		$this->assertSame( '地理院地図', __( 'GSI', $domain ) );
		$this->assertSame( '白地図', __( 'Blank Map', $domain ) );
		$this->assertSame( '地図', __( 'Map', $domain ) );
		$this->assertSame( '株式会社 Geolonia', __( 'Geolonia Inc.', $domain ) );
	}
}
