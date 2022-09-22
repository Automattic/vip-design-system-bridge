<?php

namespace TokenTheme;

if (!defined('WPINC')) {
	die;
}

class Enqueue {
	public $version = '';

	public function __construct() {
		$theme = wp_get_theme();
		$this->version = $theme->get('Version');

		add_action('admin_init', [$this, 'enqueue_editor_styles']);
		add_action('wp_enqueue_scripts', [$this, 'enqueue_main_styles']);
	}

	public function enqueue_main_styles() {
		wp_enqueue_style(
			'token-theme-css',
			get_theme_file_uri('/assets/css/main.css'),
			false,
			$this->version,
			'screen, print'
		);
	}

	public function enqueue_editor_styles() {
		add_editor_style('assets/css/editor.css');
	}
}

add_action('after_setup_theme', function () {
	return new \TokenTheme\Enqueue;
});
