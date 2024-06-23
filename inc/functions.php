<?php

/**
 * Register post type `maps`
 *
 */
function register_post_type_maps() {

	// $capabilities = array(
	// 	'publish_posts' 		=> 'publish_maps',
	// 	'edit_posts' 			=> 'edit_maps',
	// 	'edit_others_posts' 	=> 'edit_others_maps',
	// 	'delete_posts' 			=> 'delete_maps',
	// 	'delete_others_posts' 	=> 'delete_others_maps',
	// 	'read_private_posts' 	=> 'read_private_maps',
	// 	'edit_post' 			=> 'edit_map',
	// 	'delete_post' 			=> 'delete_map',
	// 	'read_post' 			=> 'read_map',
	// );

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
// 		'capabilities' 			=> array(
// // delete_others_posts
// // delete_posts
// // delete_private_posts
// // delete_published_posts
// // edit_others_posts
// // edit_posts
// // edit_private_posts
// // edit_published_posts
// // manage_categories
// // moderate_comments
// // publish_posts
// // read_private_posts
// 			'publish_posts' 		=> 'publish_maps',
// 			'edit_posts' 			=> 'edit_maps',
// 			'edit_others_posts' 	=> 'edit_others_maps',
// 			'delete_posts' 			=> 'delete_maps',
// 			'delete_others_posts' 	=> 'delete_others_maps',
// 			'read_private_posts' 	=> 'read_private_maps',
// 			'edit_post' 			=> 'edit_map',
// 			'delete_post' 			=> 'delete_map',
// 			'read_post' 			=> 'read_map',
// 			'manage_terms'          => 'manage_map_tag',
// 			'edit_terms'            => 'edit_map_tag',
// 			'delete_terms'          => 'delete_map_tag',
// 			'assign_terms'          => 'assign_map_tag',
// 		),
	) );

	register_taxonomy(
		'map-tag',
		'maps',
		array(
			'label' => 'タグ',
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
	// `author` 公開済みの地図の編集を許可
	$author = get_role( 'author' );
	$author->add_cap( 'edit_published_maps' );
}
