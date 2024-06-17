<?php

if ( !function_exists( 'is_rest' ) ) {

	function is_rest() {
		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			// Probably a CLI request
			return false;
		}

		$rest_prefix         = trailingslashit( rest_get_url_prefix() );
		$is_rest_api_request = strpos( $_SERVER['REQUEST_URI'], $rest_prefix ) !== false;

		return apply_filters( 'is_rest_api_request', $is_rest_api_request );
	}
}
