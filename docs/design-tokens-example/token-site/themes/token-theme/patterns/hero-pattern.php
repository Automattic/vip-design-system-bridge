<?php
/**
 * Title: Hero Page Pattern
 * Slug: alecg/hero-pattern
 * Block Types: core/post-content
 * Categories: text
 * Description: Marketing hero header
 * Keywords: hero, marketing
 */

?>

<!-- wp:group {"align":"full","templateLock":"contentOnly"} -->
<div class="wp-block-group alignfull">
	<!-- wp:cover {"overlayColor":"surface-variant","minHeight":200,"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","right":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-cover" style="padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50);min-height:200px">
		<span aria-hidden="true" class="wp-block-cover__background has-surface-variant-background-color has-background-dim-100 has-background-dim"></span>

		<div class="wp-block-cover__inner-container">
			<!-- wp:heading {"textColor":"on-surface-variant"} -->
			<h2 class="has-on-surface-variant-color has-text-color">Primary Hero</h2>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"textColor":"on-surface-variant"} -->
			<p class="has-on-surface-variant-color has-text-color">Primary Subtitle</p>
			<!-- /wp:paragraph -->
		</div>
	</div>
	<!-- /wp:cover -->
</div>
<!-- /wp:group -->
