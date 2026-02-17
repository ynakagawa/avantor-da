const fetchPlaceholders = async () => ({});

const PRODUCTS_PER_SLIDE = 5;

function getVisibleSlides(block) {
  const filter = block.dataset.activeFilter;
  const all = block.querySelectorAll('.carousel-products-slide');
  if (!filter || filter === '__all__') return [...all];
  return [...all].filter((s) => s.dataset.group === filter);
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-products');
  const visible = getVisibleSlides(block);
  const idx = visible.indexOf(slide);
  if (idx < 0) return;
  block.dataset.activeSlide = idx;

  visible.forEach((aSlide, i) => {
    aSlide.setAttribute('aria-hidden', i !== idx);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (i !== idx) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  const indicators = block.querySelectorAll('.carousel-products-slide-indicator');
  indicators.forEach((indicator, i) => {
    const btn = indicator.querySelector('button');
    if (indicator.dataset.targetSlide === String(idx)) btn?.setAttribute('disabled', 'true');
    else btn?.removeAttribute('disabled');
  });
}

export function showSlide(block, slideIndex = 0) {
  const visible = getVisibleSlides(block);
  let real = slideIndex < 0 ? slideIndex + visible.length : slideIndex;
  if (real >= visible.length) real = 0;
  const active = visible[real];

  active?.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  if (active) {
    block.querySelector('.carousel-products-slides').scrollTo({
      top: 0,
      left: active.offsetLeft,
      behavior: 'smooth',
    });
  }
}

function bindEvents(block, placeholders) {
  const slideIndicators = block.querySelector('.carousel-products-slide-indicators');
  if (slideIndicators) {
    slideIndicators.addEventListener('click', (e) => {
      const li = e.target.closest('.carousel-products-slide-indicator');
      if (li) showSlide(block, parseInt(li.dataset.targetSlide, 10));
    });
  }

  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const filterBar = block.querySelector('.carousel-products-filter');
  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.carousel-products-filter-btn');
      if (!btn) return;
      const filter = btn.dataset.filter;
      block.dataset.activeFilter = filter;
      block.querySelectorAll('.carousel-products-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilterVisibility(block);
      const visible = getVisibleSlides(block);
      rebuildIndicators(block, visible.length, placeholders);
      showSlide(block, 0);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-products-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function getGroupKey(row) {
  const cols = row.querySelectorAll(':scope > div');
  return cols.length >= 3 ? cols[1].textContent.trim() || '__default__' : '__default__';
}

function createProductCard(row) {
  const card = document.createElement('div');
  card.classList.add('carousel-products-card');

  const cols = row.querySelectorAll(':scope > div');
  const hasGroupColumn = cols.length >= 3;
  const imageColIdx = 0;
  const contentColIdx = hasGroupColumn ? 2 : 1;

  const imageColumn = cols[imageColIdx];
  const contentColumn = cols[contentColIdx];
  if (!imageColumn) return card;

  imageColumn.classList.add('carousel-products-card-image');
  card.append(imageColumn);

  if (contentColumn) {
    const overlayImage = contentColumn.querySelector('picture') || contentColumn.querySelector('img');
    if (overlayImage) {
      overlayImage.classList.add('carousel-products-card-image-overlay');
      overlayImage.removeAttribute('width');
      overlayImage.removeAttribute('height');
      overlayImage.querySelectorAll('img').forEach((img) => {
        img.removeAttribute('width');
        img.removeAttribute('height');
      });
      imageColumn.append(overlayImage);
    }
    contentColumn.classList.add('carousel-products-card-content');
    card.append(contentColumn);
  }

  return card;
}

function createSlide(products, slideIndex, carouselId, groupKey) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  if (groupKey) slide.dataset.group = groupKey;
  slide.setAttribute('id', `carousel-products-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-products-slide');

  products.forEach((productRow) => {
    const card = createProductCard(productRow);
    slide.append(card);
  });

  return slide;
}

function applyFilterVisibility(block) {
  const filter = block.dataset.activeFilter;
  block.querySelectorAll('.carousel-products-slide').forEach((slide) => {
    const group = slide.dataset.group;
    const hide = filter && filter !== '__all__' && group !== filter;
    slide.classList.toggle('carousel-products-slide-hidden', !!hide);
  });
}

function rebuildIndicators(block, count, placeholders) {
  const nav = block.querySelector('.carousel-products-slide-indicators');
  if (!nav) return;
  nav.innerHTML = '';
  for (let i = 0; i < count; i += 1) {
    const li = document.createElement('li');
    li.classList.add('carousel-products-slide-indicator');
    li.dataset.targetSlide = String(i);
    li.innerHTML = `<button type="button" aria-label="${placeholders?.showSlide || 'Show Slide'} ${i + 1} ${placeholders?.of || 'of'} ${count}"></button>`;
    nav.append(li);
  }
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-products-${carouselId}`);
  const rows = [...block.querySelectorAll(':scope > div')];

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-products-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-products-slides');

  const grouped = new Map();
  rows.forEach((row) => {
    const key = getGroupKey(row) || '__default__';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  });

  const productChunks = [];
  const groupKeys = [...grouped.keys()].filter((k) => k !== '__default__');
  const hasFilterBar = groupKeys.length >= 1;

  grouped.forEach((groupRows, groupKey) => {
    for (let i = 0; i < groupRows.length; i += PRODUCTS_PER_SLIDE) {
      productChunks.push({ chunk: groupRows.slice(i, i + PRODUCTS_PER_SLIDE), groupKey });
    }
  });

  const isSingleSlide = productChunks.length < 2;

  let filterBar;
  if (hasFilterBar) {
    filterBar = document.createElement('div');
    filterBar.className = 'carousel-products-filter';
    filterBar.setAttribute('role', 'tablist');
    filterBar.setAttribute('aria-label', placeholders.filterBy || 'Filter by category');
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'carousel-products-filter-btn active';
    allBtn.dataset.filter = '__all__';
    allBtn.textContent = placeholders.all || 'All';
    allBtn.setAttribute('role', 'tab');
    filterBar.append(allBtn);
    groupKeys.forEach((key) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-products-filter-btn';
      btn.dataset.filter = key;
      btn.textContent = key;
      btn.setAttribute('role', 'tab');
      filterBar.append(btn);
    });
  }

  if (!isSingleSlide) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-products-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    container.append(slideNavButtons);
  }

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-products-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);
  }

  productChunks.forEach(({ chunk, groupKey }, idx) => {
    const slide = createSlide(chunk, idx, carouselId, groupKey === '__default__' ? null : groupKey);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-products-slide-indicator');
      indicator.dataset.targetSlide = String(idx);
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${productChunks.length}"></button>`;
      slideIndicators.append(indicator);
    }
  });

  container.append(slidesWrapper);
  block.prepend(container);
  if (filterBar) block.prepend(filterBar);

  // Remove original rows – column 2 (group) is used only for the filter, not rendered in cards
  rows.forEach((row) => row.remove());

  if (hasFilterBar) {
    block.dataset.activeFilter = '__all__';
  }

  if (!isSingleSlide) {
    bindEvents(block, placeholders);
  }
}
