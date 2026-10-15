<?php
/**
 * Template Name: Page Builder (Full Width)
 * Template Post Type: page, post
 *
 * Clean, full-width canvas template retaining the theme header and footer.
 * Contains ZERO theme-imposed margin, padding, or container width restrictions,
 * allowing Elementor, Divi, Beaver Builder, and Gutenberg to author 100% full-bleed hero sections,
 * grids, sliders, and responsive landing pages with complete on-page SEO freedom.
 *
 * @package Online_MMJ_Card
 */

get_header();
?>

<main id="main-content" class="site-main page-builder-fullwidth-canvas" style="width:100%; min-height:60vh; padding:0; margin:0;">
    <?php
    while (have_posts()) :
        the_post();
        the_content();

        wp_link_pages(array(
            'before' => '<div class="page-links text-center py-4">' . esc_html__('Pages:', 'online-mmj-card'),
            'after'  => '</div>',
        ));
    endwhile;
    ?>
    
    <!-- Interactive Telehealth Mount for Full Responsive React SPA -->
    <div id="online-mmj-card-root"></div>
</main>

<?php
get_footer();
