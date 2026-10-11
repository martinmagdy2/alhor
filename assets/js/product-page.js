/* ==========================================================================
   ALHOR — Product Detail Page Interactive Logic (product-page.js)
   Gallery, Variant selection, Price calculation, Tabs, Lightbox & Cart
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Elements ---
  const mainImg = document.getElementById('pdp-main-img');
  const thumbs = document.querySelectorAll('.pdp-thumb');
  const countBadge = document.getElementById('pdp-img-count');
  const zoomBtn = document.getElementById('pdp-zoom-btn');
  const lightbox = document.getElementById('pdp-lightbox');
  const lightboxImg = document.getElementById('pdp-lightbox-img');
  const lightboxClose = document.getElementById('pdp-lightbox-close');

  const qtyInput = document.getElementById('pdp-qty');
  const qtyMinus = document.getElementById('pdp-qty-minus');
  const qtyPlus = document.getElementById('pdp-qty-plus');

  const priceCurrent = document.getElementById('pdp-price-now');
  const priceOld = document.getElementById('pdp-price-old');
  const saveBadge = document.getElementById('pdp-save-badge');
  const tabbyVal = document.getElementById('pdp-tabby-val');

  const sizeChips = document.querySelectorAll('[data-opt-size]');
  const colorChips = document.querySelectorAll('[data-opt-color]');
  const selectedSizeLabel = document.getElementById('pdp-selected-size');
  const selectedColorLabel = document.getElementById('pdp-selected-color');

  const btnAdd = document.getElementById('pdp-btn-add');
  const btnBuyNow = document.getElementById('pdp-btn-buy-now');
  const btnMobileAdd = document.getElementById('pdp-mobile-add');
  const mobilePriceVal = document.getElementById('pdp-mobile-price');

  const tabBtns = document.querySelectorAll('.pdp-tab-btn');
  const tabPanes = document.querySelectorAll('.pdp-tab-pane');

  const faqItems = document.querySelectorAll('.pdp-faq-item');
  const btnWish = document.getElementById('pdp-btn-wish');
  const btnShare = document.getElementById('pdp-btn-share');

  // --- State ---
  let currentBasePrice = 149;
  let currentOldPrice = 220;
  let currentExtra = 0;
  let currentSizeName = '34 سم (قياسي)';
  let currentColorName = 'برتقالي بري كلاسيكي';
  let activeImgIndex = 0;

  // --- Gallery Switcher ---
  const updateGallery = (index) => {
    if (!thumbs[index]) return;
    activeImgIndex = index;
    const targetThumb = thumbs[index];
    const fullSrc = targetThumb.dataset.full || targetThumb.querySelector('img').src;

    thumbs.forEach(t => t.classList.remove('is-active'));
    targetThumb.classList.add('is-active');

    if (mainImg) {
      mainImg.style.opacity = '0.4';
      mainImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        mainImg.src = fullSrc;
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'none';
      }, 150);
    }

    if (countBadge) {
      countBadge.textContent = `${index + 1} / ${thumbs.length}`;
    }
  };

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => updateGallery(idx));
  });

  // --- Lightbox Zoom ---
  const openLightbox = () => {
    if (!lightbox || !lightboxImg || !mainImg) return;
    lightboxImg.src = mainImg.src;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
  if (mainImg) {
    mainImg.parentElement.addEventListener('click', (e) => {
      if (e.target !== zoomBtn && !zoomBtn?.contains(e.target)) {
        openLightbox();
      }
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // --- Price & Variant Logic ---
  const updatePriceDisplay = () => {
    const finalPrice = currentBasePrice + currentExtra;
    const finalOld = currentOldPrice + currentExtra;
    const saveAmount = finalOld - finalPrice;
    const installment = (finalPrice / 4).toFixed(2);

    if (priceCurrent) {
      priceCurrent.innerHTML = `${finalPrice} <small>د.إ</small>`;
    }
    if (priceOld) {
      priceOld.textContent = `${finalOld} د.إ`;
    }
    if (saveBadge) {
      saveBadge.textContent = `وفر ${saveAmount} د.إ`;
    }
    if (tabbyVal) {
      tabbyVal.textContent = `${installment} د.إ`;
    }
    if (mobilePriceVal) {
      mobilePriceVal.innerHTML = `${finalPrice} <small>د.إ</small>`;
    }
  };

  // Size Options
  sizeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sizeChips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');

      currentExtra = parseInt(chip.dataset.extra || '0', 10);
      currentSizeName = chip.dataset.optSize;
      if (selectedSizeLabel) selectedSizeLabel.textContent = currentSizeName;

      updatePriceDisplay();
    });
  });

  // Color Options
  colorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      colorChips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');

      currentColorName = chip.dataset.optColor;
      if (selectedColorLabel) selectedColorLabel.textContent = currentColorName;
    });
  });

  // --- Quantity Selector ---
  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
  }
  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < 99) qtyInput.value = val + 1;
    });
  }

  // --- Add to Cart Implementation ---
  const handleAddToCart = (e) => {
    if (e) e.preventDefault();
    const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;
    const finalPrice = currentBasePrice + currentExtra;
    const productName = `صاج شواء كوري متعدد الاستخدامات غير لاصق (${currentSizeName})`;
    const productImg = mainImg ? mainImg.src : 'assets/img/products/gas-griddle.webp';

    const itemData = {
      id: `p4-${currentSizeName.replace(/\s+/g, '-')}`,
      name: productName,
      price: finalPrice,
      img: productImg,
      qty: qty
    };

    // Button visual animation
    const targetBtn = e?.currentTarget || btnAdd;
    if (targetBtn) {
      targetBtn.style.pointerEvents = 'none';
      const originalText = targetBtn.innerHTML;
      targetBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
        تمت الإضافة للسلة!
      `;
      setTimeout(() => {
        targetBtn.innerHTML = originalText;
        targetBtn.style.pointerEvents = '';
      }, 1400);
    }

    // Trigger Drawer if app.js is loaded
    const drawer = document.getElementById('drawer');
    const toast = document.getElementById('toast');
    const toastImg = document.querySelector('#toast-img img');
    const toastText = document.getElementById('toast-text');

    if (toast && toastText && toastImg) {
      toastImg.src = itemData.img;
      toastText.textContent = itemData.name;
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 3500);
    }

    // Open Cart Drawer
    if (drawer) {
      const backdrop = document.getElementById('backdrop');
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.classList.add('no-scroll');

      // Update cart count badge
      const badges = document.querySelectorAll('#cart-badge, #bn-cart .badge');
      badges.forEach(b => {
        let count = parseInt(b.textContent || '0', 10) + qty;
        b.textContent = count;
        b.dataset.empty = 'false';
      });

      // Append or update row in drawer-items
      const drawerItems = document.getElementById('drawer-items');
      const drawerTotal = document.getElementById('drawer-total');
      const drawerCount = document.getElementById('drawer-count');

      if (drawerItems) {
        drawer.classList.remove('is-empty');
        const itemHtml = `
          <div class="drawer-item" data-price="${itemData.price}">
            <div class="drawer-item__img"><img src="${itemData.img}" alt="${itemData.name}"></div>
            <div class="drawer-item__info">
              <h4 class="drawer-item__name">${itemData.name}</h4>
              <div class="drawer-item__price">${itemData.price.toLocaleString('ar-AE')} <small>د.إ</small></div>
              <div class="drawer-item__qty">
                <button class="qty-btn" onclick="this.nextElementSibling.textContent = Math.max(1, parseInt(this.nextElementSibling.textContent)-1)" aria-label="تقليل">-</button>
                <span>${itemData.qty}</span>
                <button class="qty-btn" onclick="this.previousElementSibling.textContent = parseInt(this.previousElementSibling.textContent)+1" aria-label="زيادة">+</button>
              </div>
            </div>
            <button class="drawer-item__rm" onclick="this.closest('.drawer-item').remove()" aria-label="حذف">
              <svg class="icon"><use href="#i-trash"/></svg>
            </button>
          </div>
        `;
        drawerItems.insertAdjacentHTML('afterbegin', itemHtml);
      }

      if (drawerTotal) {
        let currentTotal = parseInt(drawerTotal.textContent.replace(/[^\d]/g, '') || '0', 10);
        let newTotal = currentTotal + (itemData.price * qty);
        drawerTotal.textContent = `${newTotal.toLocaleString('ar-AE')} د.إ`;
      }
      if (drawerCount) {
        drawerCount.textContent = `(${badges[0]?.textContent || '1'})`;
      }
    }
  };

  if (btnAdd) btnAdd.addEventListener('click', handleAddToCart);
  if (btnMobileAdd) btnMobileAdd.addEventListener('click', handleAddToCart);

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart();
      setTimeout(() => {
        alert('جاري الانتقال الفوري لصفحة الدفع الآمن (Apple Pay / بطاقة بنكية)...');
      }, 400);
    });
  }

  // --- Tabs Navigation ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('is-active'));
      tabPanes.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('is-active');
    });
  });

  // --- FAQ Accordion ---
  faqItems.forEach(item => {
    const trigger = item.querySelector('.pdp-faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach(i => i.classList.remove('is-open'));
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });

  // --- Wishlist Toggle ---
  if (btnWish) {
    btnWish.addEventListener('click', () => {
      btnWish.classList.toggle('is-active');
      const icon = btnWish.querySelector('.icon');
      if (btnWish.classList.contains('is-active')) {
        btnWish.style.color = '#e63946';
        btnWish.style.borderColor = '#fecaca';
        btnWish.style.background = '#fdf2f2';
      } else {
        btnWish.style.color = '';
        btnWish.style.borderColor = '';
        btnWish.style.background = '';
      }
    });
  }

  // --- Share Button ---
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'صاج شواء كوري متعدد الاستخدامات غير لاصق — متجر الحر',
          text: 'شاهد صاج الشواء الكوري الفاخر غير اللاصق من متجر الحر لمستلزمات الصيد والرحلات',
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('تم نسخ رابط المنتج بنجاح إلى الحافظة!');
        }).catch(() => {});
      }
    });
  }
});
