<?php

class Test_Register_Post_Type_Maps extends WP_UnitTestCase {

	/**
	 * @covers ::register_post_type_maps
	 */
	public function test_maps_post_type_registered() {

		unregister_post_type( 'maps' );
		$this->assertNull( get_post_type_object( 'maps' ) );

		register_post_type_maps();

		$pobj = get_post_type_object( 'maps' );

        $this->assertInstanceOf( 'WP_Post_Type', $pobj );
		$this->assertSame( 'maps', $pobj->name );
	}
}
