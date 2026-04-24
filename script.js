// ══════════════════════════════════════════
//  MOBILE SLIDE-IN DRAWER NAV
// ══════════════════════════════════════════
(function () {
  var hamburger = document.querySelector('.hamburger');
  var nav       = document.querySelector('nav');
  if (!hamburger || !nav) return;

  var ul = nav.querySelector('ul');

  // ── Inject branding header at top of drawer ──
  var drawerHeader = document.createElement('li');
  drawerHeader.className = 'drawer-brand';
  drawerHeader.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;padding:20px 20px 16px;background:rgba(0,0,0,0.25);border-bottom:1px solid rgba(212,175,55,0.2);">' +
      '<img src="logo.png" alt="SVS Logo" style="width:38px;height:38px;border-radius:50%;border:2px solid rgba(212,175,55,0.4);object-fit:cover;flex-shrink:0;"/>' +
      '<div>' +
        '<div style="color:#d4af37;font-size:13px;font-weight:700;line-height:1.3;">SVS College</div>' +
        '<div style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:1px;text-transform:uppercase;">Bantwal &middot; Est. 1968</div>' +
      '</div>' +
    '</div>';
  ul.insertBefore(drawerHeader, ul.firstChild);

  // ── Mark active page ──
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  ul.querySelectorAll('li > a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('?')[0].split('/').pop();
    if (href === currentPage) a.closest('li').classList.add('active-page');
  });

  // ── Auto-detect dropdowns, add has-dropdown + arrow ──
  ul.querySelectorAll('li').forEach(function (li) {
    if (li.classList.contains('drawer-brand')) return;
    if (li.querySelector('.dropdown, .home-dropdown')) {
      li.classList.add('has-dropdown');
      var link = li.querySelector(':scope > a');
      if (link && !link.querySelector('.nav-arrow')) {
        var arrow = document.createElement('span');
        arrow.className = 'nav-arrow';
        arrow.innerHTML = '&#9658;';
        link.appendChild(arrow);
      }
    }
  });

  // ── Open / close drawer ──
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ── Tap backdrop (click on nav overlay but not on the ul drawer) → close ──
  nav.addEventListener('click', function (e) {
    if (!ul.contains(e.target) && !hamburger.contains(e.target)) closeDrawer();
  });
  // Also allow clicking outside entirely
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !ul.contains(e.target) && !hamburger.contains(e.target)) {
      closeDrawer();
    }
  });

  // ── Tap parent link → toggle its dropdown ──
  ul.querySelectorAll('li.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      var li = link.parentElement;
      var wasOpen = li.classList.contains('dd-open');
      ul.querySelectorAll('li.has-dropdown').forEach(function (el) {
        el.classList.remove('dd-open');
      });
      if (!wasOpen) li.classList.add('dd-open');
    });
  });

  // ── Tap a leaf link → close drawer ──
  ul.querySelectorAll('.dropdown a, .home-dropdown a, li:not(.has-dropdown) > a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 768) closeDrawer();
    });
  });

  // ── Resize back to desktop → reset ──
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeDrawer();
  });

  function closeDrawer() {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    ul.querySelectorAll('li.has-dropdown').forEach(function (el) {
      el.classList.remove('dd-open');
    });
  }
})();


// ══════════════════════════════════════════
//  UNIMATE POPUP (desktop only)
// ══════════════════════════════════════════
const unimateLink  = document.querySelector('nav a[href="unimate.html"]') ||
                     document.querySelector('nav li a[onclick*="checkUnimate"]');
const unimatePopup = document.getElementById("unimate-popup");

if (unimateLink && unimatePopup) {
  function showPopup() { if (window.innerWidth > 768) unimatePopup.style.display = "flex"; }
  function hidePopup() {
    setTimeout(() => {
      if (!unimatePopup.matches(":hover") && !unimateLink.matches(":hover"))
        unimatePopup.style.display = "none";
    }, 50);
  }
  unimateLink.addEventListener("mouseenter", showPopup);
  unimateLink.addEventListener("mouseleave", hidePopup);
  unimatePopup.addEventListener("mouseenter", showPopup);
  unimatePopup.addEventListener("mouseleave", hidePopup);
}

// ══════════════════════════════════════════
//  PAGE FUNCTIONS
// ══════════════════════════════════════════
function checkUnimate(e) {
  // No login gate
}

function checkAndApply(e) {
  e.preventDefault();
  if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'admissions.html';
  } else {
    window.location.replace('auth.html?next=admissions.html');
  }
}

// ══════════════════════════════════════════
//  COUNTER ANIMATION
// ══════════════════════════════════════════
const statItems = document.querySelectorAll('.stat-item');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const counter = entry.target.querySelector('.counter');
      if (!counter) return;
      const target = +counter.getAttribute('data-target');
      const step = target / (2000 / 16);
      let current = 0;
      const update = () => {
        current += step;
        if (current < target) { counter.textContent = Math.floor(current); requestAnimationFrame(update); }
        else { counter.textContent = target; }
      };
      update();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
statItems.forEach(item => counterObserver.observe(item));

// ══════════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));
