<?php

/**
 * Register post type `maps`
 *
 */
function register_post_type_maps() {

	register_post_type( 'maps', array(
		'label'                 => 'Map',
		'public'                => true,
		'hierarchical'          => false,
		'show_ui'               => true,
		'show_in_nav_menus'     => true,
		'supports'              => array( 'title', 'editor', 'revisions', 'excerpt' ),
		'has_archive'           => false,
		'rewrite'               => array('slug' => 'maps'),
		'query_var'             => true,
		'menu_icon'             => 'dashicons-location',
		'show_in_rest'          => true,
		'rest_base'             => GEOLONIA_GIS_POST_TYPE,
		'rest_controller_class' => 'WP_REST_Posts_Controller',
		'taxonomies' 			=> array( 'map_tag' ),
        'capability_type' 		=> array( 'map', 'maps' ),
		'map_meta_cap' 			=> true
	) );

	register_taxonomy(
		'maptag',
		'maps',
		array(
			'label' => __( 'Tags' ),
			'hierarchical' => false,
			'public' => true,
			'show_in_rest' => true,
			'capabilities' => array(
				'manage_terms' => 'manage_maptags',
				'edit_terms' => 'edit_maptags',
				'delete_terms' => 'delete_maptags',
				'assign_terms' => 'assign_maptags',
			),
		)
	);
}

/**
 * Add capabilities to custom post type `maps`
 */
function define_map_caps() {
	$caps = array(
		'delete_maps' => array( 'editor', 'author', 'contributor' ),
		'delete_others_maps' => array( 'editor' ),
		'delete_private_maps' => array( 'editor', 'author' ),
		'delete_published_maps' => array( 'editor', 'author' ),
		'edit_maps' => array( 'editor', 'author', 'contributor' ),
		'edit_others_maps' => array( 'editor' ),
		'edit_private_maps' => array( 'editor', 'author' ),
		'edit_published_maps' => array( 'editor', 'author' ),
		'publish_maps' => array( 'editor', 'author' ),
		'read_private_maps' => array( 'editor', 'author' ),
		'assign_maptags' => array( 'editor', 'author', 'contributor' ),
		'delete_maptags' => array( 'editor', 'author' ),
		'edit_maptags' => array( 'editor', 'author' ),
		'manage_maptags' => array( 'editor' ),
	);

	foreach ( $caps as $cap => $roles ) {
		foreach ( $roles as $role ) {
			$role = get_role( $role );
			$role->add_cap( $cap );
		}
	}
}
