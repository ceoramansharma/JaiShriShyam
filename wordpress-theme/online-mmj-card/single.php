<?php
/**
 * The template for displaying all single blog posts & clinical articles
 *
 * Fully editable via Gutenberg Block Editor, Elementor, and Divi.
 * Includes dynamic alt tags on post thumbnails, category taxonomy, and standard hooks.
 *
 * @package Online_MMJ_Card
 */

get_header();
?>

<main id="main-content" class="site-main py-10 sm:py-14 min-h-[60vh]">
  <div class="mmj-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <?php
    while (have_posts()) :
      the_post();
      ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class('single-article'); ?>>
        
        <header class="entry-header mb-8 pb-4 border-b border-slate-100">
          <div class="text-xs font-bold uppercase tracking-wider text-[#16a34a] mb-2 flex items-center gap-2">
            <?php the_category(' &middot; '); ?>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            <?php the_title(); ?>
          </h1>

          <div class="flex items-center gap-4 text-xs text-slate-500">
            <span>Published on <time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time></span>
            <span>&middot;</span>
            <span>By <strong class="text-slate-800"><?php the_author(); ?></strong></span>
          </div>
        </header>

        <?php if (has_post_thumbnail()) : ?>
          <div class="entry-featured-image mb-8 rounded-3xl overflow-hidden shadow-sm">
            <?php the_post_thumbnail('full', array(
              'class' => 'w-full h-auto object-cover rounded-3xl',
              'alt'   => get_post_meta(get_post_thumbnail_id(), '_wp_attachment_image_alt', true) ?: get_the_title()
            )); ?>
          </div>
        <?php endif; ?>

        <!-- Post Content -->
        <div class="entry-content prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
          <?php
          the_content();

          wp_link_pages(array(
            'before' => '<div class="page-links text-center py-6 font-bold">' . esc_html__('Pages:', 'online-mmj-card'),
            'after'  => '</div>',
          ));
          ?>
        </div>

        <!-- Post Tags Taxonomy for SEO Interlinking -->
        <?php if (has_tag()) : ?>
          <div class="entry-tags mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags:</span>
            <?php the_tags('<span class="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors">', '</span> <span class="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors">', '</span>'); ?>
          </div>
        <?php endif; ?>

        <!-- Dynamic Post Navigation -->
        <nav class="post-navigation mt-10 pt-6 border-t border-slate-200 grid sm:grid-cols-2 gap-4 text-xs font-bold" aria-label="<?php esc_attr_e('Posts Navigation', 'online-mmj-card'); ?>">
          <div class="prev-post text-left">
            <?php previous_post_link('&larr; %link'); ?>
          </div>
          <div class="next-post text-right">
            <?php next_post_link('%link &rarr;'); ?>
          </div>
        </nav>

        <?php
        if (comments_open() || get_comments_number()) :
          comments_template();
        endif;
        ?>

        <!-- Telehealth SPA Interactive Mount -->
        <div id="online-mmj-card-root" class="mt-8"></div>
      </article>
      <?php
    endwhile;
    ?>
  </div>
</main>

<?php
get_footer();
