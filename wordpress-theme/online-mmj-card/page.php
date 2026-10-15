<?php
/**
 * The template for displaying all default pages
 *
 * Fully compatible with Gutenberg block editor, Elementor, Divi, and Beaver Builder.
 * Standard WordPress loop with the_content() and post thumbnail support.
 * Also provides the #online-mmj-card-root container for the React SPA.
 *
 * @package Online_MMJ_Card
 */

get_header();
?>

<!-- Telehealth SPA Interactive Mount with Instant Semantic HTML Fallback -->
<div id="online-mmj-card-root" class="w-full">
  <main id="main-content" class="site-main py-10 sm:py-14 min-h-[60vh] mmj-static-fallback">
    <div class="mmj-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <?php
      while (have_posts()) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('entry-page'); ?>>
          
          <?php if (!is_front_page()) : ?>
            <header class="entry-header mb-8 pb-4 border-b border-slate-100">
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                <?php the_title(); ?>
              </h1>
            </header>
          <?php endif; ?>

          <?php if (has_post_thumbnail()) : ?>
            <div class="entry-thumbnail mb-8 rounded-2xl overflow-hidden shadow-sm">
              <?php the_post_thumbnail('full', array(
                'class' => 'w-full h-auto object-cover rounded-2xl',
                'alt'   => get_post_meta(get_post_thumbnail_id(), '_wp_attachment_image_alt', true) ?: get_the_title()
              )); ?>
            </div>
          <?php endif; ?>

          <!-- Post/Page Body Content -->
          <div class="entry-content prose prose-slate max-w-none">
            <?php
            the_content();

            wp_link_pages(array(
              'before' => '<div class="page-links text-center py-4 font-bold">' . esc_html__('Pages:', 'online-mmj-card'),
              'after'  => '</div>',
            ));
            ?>
          </div>
        </article>
        <?php
      endwhile;
      ?>
    </div>
  </main>
</div>

<?php
get_footer();
