<?php

/**
 * Register post type `maps`
 *
 */
function register_post_type_maps() {

	register_post_type( 'map', array(
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
		'map',
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

function get_geolonia_open_gis_capabilities() {
	return apply_filters( 'geolonia-open-gis-capabilities', array(
		'delete_maps' => array( 'editor', 'author', 'contributor' ),
		'delete_others_maps' => array( 'editor' ),
		'delete_private_maps' => array( 'editor', 'author' ),
		'delete_published_maps' => array( 'editor', 'author' ),
		'edit_maps' => array( 'editor', 'author', 'contributor' ),
		'edit_others_maps' => array( 'editor' ),
		'edit_private_maps' => array( 'editor', 'author' ),
		'edit_published_maps' => array( 'editor', 'author' ),
		'publish_maps' => array( 'editor', 'author' ),
		'read_private_maps' => array( 'editor', 'author', 'contributor', 'subscriber' ),
		'assign_maptags' => array( 'editor', 'author', 'contributor' ),
		'delete_maptags' => array( 'editor', 'author' ),
		'edit_maptags' => array( 'editor', 'author' ),
		'manage_maptags' => array( 'editor' ),
	) );
}

/**
 * Add capabilities to custom post type `maps`
 */
function define_map_caps() {
	$caps = get_geolonia_open_gis_capabilities();

	foreach ( $caps as $cap => $roles ) {
		foreach ( $roles as $role ) {
			$_role = get_role( $role );
			$_role->add_cap( $cap );
		}
	}
}

register_activation_hook( __FILE__, function() {
	register_post_type_maps();
	define_map_caps();

	flush_rewrite_rules( false );
} );


register_deactivation_hook( __FILE__, function() {
	$caps = get_geolonia_open_gis_capabilities();
	$roles = array( 'administrator', 'editor', 'author', 'contributor', 'subscriber');

	foreach ( array_keys( $caps ) as $cap ) {
		foreach ( $roles as $role ) {
			$_role = get_role( $role );
			$_role->remove_cap( $cap );
		}
	}

	flush_rewrite_rules( false );
} );
