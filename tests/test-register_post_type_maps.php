<?php

class Test_Register_Post_Type_Maps extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();

		unregister_post_type( 'maps' );
	}

	/**
	 * @covers ::register_post_type_maps
	 */
	public function test_maps_post_type_registered() {

		$this->assertNull( get_post_type_object( 'maps' ) );

		register_post_type_maps();

		$maps_object = get_post_type_object( 'maps' );

        $this->assertInstanceOf( 'WP_Post_Type', $maps_object );
		$this->assertSame( 'maps', $maps_object->name );
	}

    /**
     * @covers ::register_post_type_maps
     */
    public function test_maps_post_type_options() {

        $this->assertNull( get_post_type_object( 'maps' ) );

        register_post_type_maps();

        $maps_object = get_post_type_object( 'maps' );

        // Check label
        $this->assertSame( 'Map', $maps_object->label );

        // Check public
        $this->assertTrue( $maps_object->public );

        // Check hierarchical
        $this->assertFalse( $maps_object->hierarchical );

        // Check show_ui
        $this->assertTrue( $maps_object->show_ui );

        // Check show_in_nav_menus
        $this->assertTrue( $maps_object->show_in_nav_menus );

		// Check title support
		$this->assertTrue( post_type_supports( 'maps', 'title' ), 'Title support is enabled' );

		// Check editor support
		$this->assertTrue( post_type_supports( 'maps', 'editor' ), 'Editor support is enabled' );

		// Check revisions support
		$this->assertTrue( post_type_supports( 'maps', 'revisions' ), 'Revisions support is enabled' );

		// Check excerpt support
		$this->assertTrue( post_type_supports( 'maps', 'excerpt' ), 'Excerpt support is enabled' );

        // Check has_archive
        $this->assertFalse( $maps_object->has_archive );

        // Check rewrite
        $this->assertSame( array('slug' => 'maps'), $maps_object->rewrite );

        // Check query_var
        $this->assertSame( 'maps', $maps_object->query_var );

        // Check menu_icon
        $this->assertSame( 'dashicons-location', $maps_object->menu_icon );

        // Check show_in_rest
        $this->assertTrue( $maps_object->show_in_rest );

        // Check rest_base
        $this->assertSame( GEOLONIA_GIS_POST_TYPE, $maps_object->rest_base );

        // Check rest_controller_class
        $this->assertSame( 'WP_REST_Posts_Controller', $maps_object->rest_controller_class );

        // Check taxonomies
        $this->assertSame( array( 'map_tag' ), $maps_object->taxonomies );

        // Check capability_type
        $this->assertSame( 'map', $maps_object->capability_type );

        // Check map_meta_cap
        $this->assertTrue( $maps_object->map_meta_cap );
    }
}
