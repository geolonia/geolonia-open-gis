<?php

class Test_Register_Post_Type_Maps extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();

		unregister_post_type( 'map' );
	}

	/**
	 * @covers ::register_post_type_maps
	 */
	public function test_maps_post_type_registered() {

		$this->assertNull( get_post_type_object( 'map' ) );

		register_post_type_maps();

		$maps_object = get_post_type_object( 'map' );

        $this->assertInstanceOf( 'WP_Post_Type', $maps_object );
		$this->assertSame( 'map', $maps_object->name );
	}

    /**
     * @covers ::register_post_type_maps
     */
    public function test_maps_post_type_options() {

        $this->assertNull( get_post_type_object( 'map' ) );

        register_post_type_maps();

        $maps_object = get_post_type_object( 'map' );

        // labels の設定値を確認
        $this->assertSame( '地図', $maps_object->label );

        // public の設定値を確認
        $this->assertTrue( $maps_object->public );

        // hierarchical の設定値を確認
        $this->assertFalse( $maps_object->hierarchical );

        // show_ui の設定値を確認
        $this->assertTrue( $maps_object->show_ui );

        // show_in_menu の設定値を確認
        $this->assertTrue( $maps_object->show_in_nav_menus );

		// カスタム投稿タイプの supports に title が含まれているか確認
		$this->assertTrue( post_type_supports( 'map', 'title' ), 'Title support is enabled' );

		// カスタム投稿タイプの supports に editor が含まれているか確認
		$this->assertTrue( post_type_supports( 'map', 'editor' ), 'Editor support is enabled' );

		// カスタム投稿タイプの supports に author が含まれているか確認
		$this->assertTrue( post_type_supports( 'map', 'revisions' ), 'Revisions support is enabled' );

		// カスタム投稿タイプの supports に excerpt が含まれているか確認
		$this->assertTrue( post_type_supports( 'map', 'excerpt' ), 'Excerpt support is enabled' );

        // archive の設定値を確認
        $this->assertFalse( $maps_object->has_archive );

        // rewrite の設定値を確認
        $this->assertSame( array('slug' => 'maps'), $maps_object->rewrite );

        // query_var の設定値を確認
        $this->assertSame( 'map', $maps_object->query_var );

        // menu_icon の設定値を確認
        $this->assertSame( 'dashicons-location', $maps_object->menu_icon );

        // show_in_rest の設定値を確認
        $this->assertTrue( $maps_object->show_in_rest );

        // rest_base の設定値を確認
        $this->assertSame( GEOLONIA_GIS_POST_TYPE, $maps_object->rest_base );

		// rest_controller_class の設定値を確認
        $this->assertSame( 'WP_REST_Posts_Controller', $maps_object->rest_controller_class );

        // taxonomies の設定値を確認
        $this->assertSame( array( 'map_tag' ), $maps_object->taxonomies );

        // capability_type の設定値を確認
        $this->assertSame( 'map', $maps_object->capability_type );

        // map_meta_cap の設定値を確認
        $this->assertTrue( $maps_object->map_meta_cap );
    }
}
