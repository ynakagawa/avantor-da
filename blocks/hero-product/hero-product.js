export default function decorate(block) {
  const img = block.querySelector('picture img, img');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const allParagraphs = block.querySelectorAll('p');
  const ctaLink = block.querySelector('p a[href], a.btn, strong a');
  const bodyParagraphs = [...allParagraphs].filter(
    (p) => !ctaLink || !p.contains(ctaLink),
  );

  const row = document.createElement('div');
  row.className = 'hero-product-row';

  /* Cell 1: Copy */
  const copyCell = document.createElement('div');
  copyCell.className = 'hero-product-cell hero-product-cell--copy';
  const content = document.createElement('div');
  content.className = 'avtr-card-content';

  if (heading) {
    const title = document.createElement('h3');
    title.className = 'avtr-card-title';
    const titleInner = document.createElement('div');
    titleInner.textContent = heading.textContent.trim();
    title.append(titleInner);
    content.append(title);
  }

  const body = document.createElement('div');
  body.className = 'avtr-card-body';
  bodyParagraphs.forEach((p) => {
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    body.append(para);
  });
  if (ctaLink) {
    const cta = ctaLink.tagName === 'A' ? ctaLink : ctaLink.querySelector('a');
    if (cta) {
      const ctaP = document.createElement('p');
      const a = document.createElement('a');
      a.className = 'av-btn av-btn--primary av-btn--on-dark';
      a.href = cta.href;
      if (cta.target) a.target = cta.target;
      a.textContent = cta.textContent.trim() || 'LEARN MORE';
      ctaP.append(a);
      body.append(ctaP);
    }
  }
  content.append(body);
  copyCell.append(content);
  row.append(copyCell);

  /* Cell 2: SVG curve */
  const svgCell = document.createElement('div');
  svgCell.className = 'hero-product-cell hero-product-cell--svg';
  const svgUrl = new URL('./dark-theme.svg', import.meta.url).href;
  const svgImg = document.createElement('img');
  svgImg.src = svgUrl;
  svgImg.alt = '';
  svgImg.setAttribute('loading', 'lazy');
  svgImg.classList.add('hero-product-curve-svg');
  svgCell.append(svgImg);
  row.append(svgCell);

  /* Cell 3: Hero image */
  const imageCell = document.createElement('div');
  imageCell.className = 'hero-product-cell hero-product-cell--image';
  if (img) {
    const imgClone = img.cloneNode(true);
    imgClone.setAttribute('loading', 'lazy');
    imageCell.append(imgClone);
  }
  row.append(imageCell);

  block.textContent = '';
  block.append(row);

  if (!img) {
    block.classList.add('no-image');
  }
}
