<?php
/**
 * Front Page Template for Online MMJ Card
 *
 * Seamlessly integrates the full-scale interactive telemedicine React SPA
 * while providing instant server-rendered static HTML fallback (zero CLS,
 * guaranteed SEO crawler indexing, and 100% visible body content even before JS mounts).
 *
 * Also fully supports live authoring inside Elementor, Divi, and Gutenberg canvases.
 *
 * @package Online_MMJ_Card
 */

get_header();

// Determine if an administrator is actively inside an interactive visual page builder editor
$is_elementor_editing = class_exists('\Elementor\Plugin') && (
    \Elementor\Plugin::$instance->editor->is_edit_mode() ||
    \Elementor\Plugin::$instance->preview->is_preview_mode() ||
    (isset($_GET['elementor-preview']) || (isset($_GET['action']) && $_GET['action'] === 'elementor'))
);
$is_divi_editing = (function_exists('et_core_is_fb_enabled') && et_core_is_fb_enabled()) || isset($_GET['et_fb']);

if ($is_elementor_editing || $is_divi_editing) : ?>
  <!-- Render Page Builder & Gutenberg Canvas (Active editor mode only) -->
  <main id="main-content" class="site-main front-page-builder-canvas" style="width:100%; min-height:60vh; padding:0; margin:0;">
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
  </main>
<?php else : ?>
  <!-- Render Telemedicine Application Root & Pre-rendered Semantic Body Content -->
  <div id="online-mmj-card-root">
    
    <!-- Instant Semantic HTML: Guarantees full body visibility even before React hydrates -->
    <main class="flex-1 mmj-static-prerender">
      
      <!-- 1. Hero Section -->
      <section class="bg-white pt-8 pb-14 border-b border-slate-100 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div class="lg:col-span-6 space-y-6 text-left pt-2">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs">
                <span class="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
                <span>#1 Telehealth MMJ Doctor &amp; 420 Evaluations Clinic</span>
              </div>
              <h1 class="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Apply For Your <span class="text-[#16a34a] underline decoration-[#16a34a]/30 decoration-wavy underline-offset-4">Medical Marijuana Card Online</span> with a Licensed MMJ Doctor
              </h1>
              <p class="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Get certified fast with legal, HIPAA-compliant 420 evaluations and nationwide medical marijuana evaluations. Connect 100% online with a compassionate MMJ doctor for your new or renewal medical cannabis card in under 15 minutes.
              </p>

              <div class="flex flex-wrap gap-4 pt-2">
                <a href="<?php echo esc_url(home_url('/new-patient-medical-marijuana-card/')); ?>" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md transition-all">
                  <span>GET MY CARD NOW</span>
                  <span>&rarr;</span>
                </a>
                <a href="#states-directory" class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all">
                  <span>SELECT YOUR STATE</span>
                </a>
              </div>

              <!-- Trust Points -->
              <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div class="p-3 bg-slate-50 rounded-xl text-center">
                  <div class="text-xs font-extrabold text-[#16a34a]">100% Legal</div>
                  <div class="text-[10px] text-slate-500">State Certified</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl text-center">
                  <div class="text-xs font-extrabold text-[#16a34a]">No Risk Policy</div>
                  <div class="text-[10px] text-slate-500">100% Money Back</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl text-center">
                  <div class="text-xs font-extrabold text-[#16a34a]">Fast Process</div>
                  <div class="text-[10px] text-slate-500">Same-Day Approval</div>
                </div>
              </div>
            </div>

            <!-- Quick Evaluation Card -->
            <div class="lg:col-span-6">
              <div class="bg-white rounded-3xl border-2 border-emerald-500/20 p-6 sm:p-8 shadow-xl shadow-emerald-500/5 relative">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span class="text-xs font-bold uppercase tracking-wider text-[#16a34a]">Online MMJ Telehealth Portal</span>
                  <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">Doctors Online Now</span>
                </div>
                <h3 class="text-xl font-extrabold text-slate-900 mt-4 mb-2">Book Your Doctor Consultation</h3>
                <p class="text-xs text-slate-500 mb-6">Select your state and schedule your 15-minute private video evaluation today.</p>

                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">1. Select Your State</label>
                    <div class="p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700">
                      California (CA) &bull; Evaluation from $39
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">2. Evaluation Service</label>
                    <div class="p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700">
                      New Patient Recommendation &amp; State Certificate
                    </div>
                  </div>
                  <a href="<?php echo esc_url(home_url('/new-patient-medical-marijuana-card/')); ?>" class="block w-full py-4 px-6 text-center rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-sm shadow-md transition-all">
                    CONTINUE TO ONLINE DOCTOR EVALUATION &rarr;
                  </a>
                  <p class="text-[11px] text-center text-slate-400">100% Money-Back Guarantee if not approved by licensed doctor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Trust Stats Proof Bar -->
      <section class="bg-slate-900 text-white py-8 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div class="border-r border-slate-800 last:border-0">
              <div class="text-2xl sm:text-3xl font-black text-[#16a34a]">99.2%</div>
              <div class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Approval Guarantee</div>
            </div>
            <div class="border-r border-slate-800 last:border-0">
              <div class="text-2xl sm:text-3xl font-black text-[#16a34a]">15 Mins</div>
              <div class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Turnaround Time</div>
            </div>
            <div class="border-r border-slate-800 last:border-0">
              <div class="text-2xl sm:text-3xl font-black text-[#16a34a]">50,000+</div>
              <div class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Certified Patients</div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-black text-[#16a34a]">100% HIPAA</div>
              <div class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Compliant &amp; Private</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. How It Works (3 Steps) -->
      <section id="how-it-works" class="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-[#16a34a]">Simple 3-Step Process</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            How to Get Your Medical Marijuana Card Online
          </h2>
          <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-12">
            From initial intake to doctor recommendation in 15 minutes without visiting a physical clinic.
          </p>

          <div class="grid md:grid-cols-3 gap-8 text-left">
            <div class="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16a34a] flex items-center justify-center font-black text-lg">1</div>
              <h3 class="text-lg font-bold text-slate-900">Fill Out Quick Intake</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Complete our secure 3-minute medical questionnaire from any smartphone, tablet, or computer.</p>
            </div>
            <div class="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16a34a] flex items-center justify-center font-black text-lg">2</div>
              <h3 class="text-lg font-bold text-slate-900">Consult With Doctor</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Connect with a compassionate, state-licensed medical marijuana physician via private telehealth video.</p>
            </div>
            <div class="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16a34a] flex items-center justify-center font-black text-lg">3</div>
              <h3 class="text-lg font-bold text-slate-900">Instant Recommendation</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Receive your official doctor recommendation certificate immediately via email for legal dispensary purchases.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. State-by-State Pricing Directory -->
      <section id="states-directory" class="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-[#16a34a]">Nationwide Telehealth Care</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            Find Your State's Online MMJ Card Program
          </h2>
          <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-10">
            Select your state to view legal requirements, state fees, and book your same-day evaluation.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-left">
            <?php
            $sample_states = array(
              array('id' => 'california', 'name' => 'California', 'price' => '$39'),
              array('id' => 'florida', 'name' => 'Florida', 'price' => '$149'),
              array('id' => 'new-york', 'name' => 'New York', 'price' => '$99'),
              array('id' => 'texas', 'name' => 'Texas', 'price' => '$149'),
              array('id' => 'pennsylvania', 'name' => 'Pennsylvania', 'price' => '$129'),
              array('id' => 'ohio', 'name' => 'Ohio', 'price' => '$89'),
              array('id' => 'illinois', 'name' => 'Illinois', 'price' => '$129'),
              array('id' => 'michigan', 'name' => 'Michigan', 'price' => '$79'),
              array('id' => 'arizona', 'name' => 'Arizona', 'price' => '$119'),
              array('id' => 'missouri', 'name' => 'Missouri', 'price' => '$79'),
              array('id' => 'massachusetts', 'name' => 'Massachusetts', 'price' => '$129'),
              array('id' => 'virginia', 'name' => 'Virginia', 'price' => '$99'),
            );
            foreach ($sample_states as $st) :
            ?>
              <a href="<?php echo esc_url(home_url('/medical-marijuana-card-' . $st['id'] . '/')); ?>" class="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group">
                <span class="text-xs font-bold text-slate-800 group-hover:text-[#16a34a]"><?php echo esc_html($st['name']); ?></span>
                <span class="text-[11px] font-extrabold text-[#16a34a] mt-2">From <?php echo esc_html($st['price']); ?></span>
              </a>
            <?php endforeach; ?>
          </div>
        </div>
      </section>

      <!-- 5. Comprehensive Services -->
      <section id="services" class="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-wider text-[#16a34a]">Telehealth MMJ Doctor Services</span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Medical Cannabis Evaluations &amp; Renewals
            </h2>
            <p class="text-sm text-slate-600">
              100% online telehealth evaluations with compassionate physicians. Fast approvals with same-day digital certificates.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span class="text-xs font-extrabold text-[#16a34a] uppercase">New Patient</span>
                <h3 class="text-lg font-bold text-slate-900 mt-1 mb-2">New Medical MMJ Card</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">Complete physician evaluation for first-time applicants seeking safe, legal medical cannabis access.</p>
              </div>
              <a href="<?php echo esc_url(home_url('/new-patient-medical-marijuana-card/')); ?>" class="w-full py-2.5 text-center text-xs font-bold text-white bg-[#16a34a] hover:bg-[#15803d] rounded-xl transition-colors">
                Apply as New Patient
              </a>
            </div>

            <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span class="text-xs font-extrabold text-[#16a34a] uppercase">Card Renewal</span>
                <h3 class="text-lg font-bold text-slate-900 mt-1 mb-2">MMJ Card Renewal</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">Fast annual renewals for existing patients. Even if you were certified by another clinic or doctor previously.</p>
              </div>
              <a href="<?php echo esc_url(home_url('/medical-marijuana-card-renewal/')); ?>" class="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Renew Medical Card
              </a>
            </div>

            <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span class="text-xs font-extrabold text-[#16a34a] uppercase">Grower License</span>
                <h3 class="text-lg font-bold text-slate-900 mt-1 mb-2">99-Plant Cultivation</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">Doctor recommendation to cultivate up to 99 plants or possess up to 6 lbs of cannabis legally for medical needs.</p>
              </div>
              <a href="<?php echo esc_url(home_url('/99-plant-cultivation-recommendation/')); ?>" class="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Cultivation Details
              </a>
            </div>

            <div class="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span class="text-xs font-extrabold text-[#16a34a] uppercase">ESA Support</span>
                <h3 class="text-lg font-bold text-slate-900 mt-1 mb-2">ESA Letter Support</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">Official licensed doctor recommendation for emotional support animals with Fair Housing Act compliance.</p>
              </div>
              <a href="<?php echo esc_url(home_url('/emotional-support-animal-letter/')); ?>" class="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                ESA Letter Info
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. FAQ Section -->
      <section id="faq" class="py-16 sm:py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="text-xs font-bold uppercase tracking-wider text-[#16a34a]">Got Questions?</span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p class="text-sm text-slate-600">Everything you need to know about getting your medical marijuana card online.</p>
          </div>

          <div class="space-y-4">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="text-sm font-bold text-slate-900 mb-2">How fast will I receive my doctor recommendation?</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Once you complete your 15-minute video consultation and are approved by our licensed physician, your digital medical marijuana recommendation is emailed to you immediately.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="text-sm font-bold text-slate-900 mb-2">What happens if the doctor does not approve me?</h3>
              <p class="text-xs text-slate-600 leading-relaxed">We maintain a 100% money-back guarantee. In the rare event that our physician cannot certify you for a medical cannabis recommendation, you are automatically issued a full refund.</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 class="text-sm font-bold text-slate-900 mb-2">Why should I get a medical card if recreational cannabis is legal in my state?</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Medical cannabis patients save up to 38% on sales and excise taxes at dispensaries, possess higher legal quantities, grow more plants, and enjoy lower age requirements (18+ instead of 21+).</p>
            </div>
          </div>
        </div>
      </section>

    </main>

  </div>
<?php endif;

get_footer();
