/**
 * Hero Product Video - variant of hero-product with video in the media cell.
 * Modeled after app-simple-card-ui .avtr-card.Hero_Card_Video on digital-solutions.
 */
function createVideoFromSource(block, mediaCell) {
  const videoEl = block.querySelector('video');
  const videoSrc = block.querySelector('a[href*=".mp4"], a[href*=".webm"]');
  const ytLink = block.querySelector('a[href*="youtube.com"], a[href*="youtu.be"]');
  const posterImg = block.querySelector('picture img, img');

  if (videoEl) {
    const vid = videoEl.cloneNode(true);
    vid.setAttribute('playsinline', '');
    vid.muted = true;
    vid.loop = true;
    vid.autoplay = true;
    mediaCell.append(vid);
    return;
  }

  if (videoSrc) {
    const vid = document.createElement('video');
    vid.src = videoSrc.href;
    vid.setAttribute('playsinline', '');
    vid.muted = true;
    vid.loop = true;
    vid.autoplay = true;
    if (posterImg?.src) vid.poster = posterImg.src;
    mediaCell.append(vid);
    return;
  }

  if (ytLink) {
    const url = new URL(ytLink.href);
    const id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.split('/').pop();
    if (id) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
      iframe.setAttribute('allow', 'autoplay; encrypted-media');
      iframe.className = 'hero-product-video-embed';
      mediaCell.append(iframe);
      return;
    }
  }

  if (posterImg) {
    const img = posterImg.cloneNode(true);
    img.setAttribute('loading', 'lazy');
    mediaCell.append(img);
  }
}

export default function decorate(block) {
  const img = block.querySelector('picture img, img');
  const hasVideo = block.querySelector('video, a[href*=".mp4"], a[href*=".webm"], a[href*="youtube"], a[href*="youtu.be"]');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const allParagraphs = block.querySelectorAll('p');
  const ctaLink = block.querySelector('p a[href], a.btn, strong a');
  const bodyParagraphs = [...allParagraphs].filter(
    (p) => !ctaLink || !p.contains(ctaLink),
  );

  const row = document.createElement('div');
  row.className = 'hero-product-video-row';

  /* Cell 1: Copy */
  const copyCell = document.createElement('div');
  copyCell.className = 'hero-product-video-cell hero-product-video-cell--copy';
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
  svgCell.className = 'hero-product-video-cell hero-product-video-cell--svg';
  const imgUrl = new URL('./light-theme.svg', import.meta.url).href;
  const curveImg = document.createElement('img');
  curveImg.src = imgUrl;
  curveImg.alt = '';
  curveImg.setAttribute('loading', 'lazy');
  curveImg.classList.add('hero-product-video-curve-svg');
  svgCell.append(curveImg);
  row.append(svgCell);

  /* Cell 3: Video or image */
  const mediaCell = document.createElement('div');
  mediaCell.className = 'hero-product-video-cell hero-product-video-cell--media';

  if (hasVideo) {
    createVideoFromSource(block, mediaCell);
    block.classList.add('has-video');
  } else if (img) {
    const imgClone = img.cloneNode(true);
    imgClone.setAttribute('loading', 'lazy');
    mediaCell.append(imgClone);
  }

  row.append(mediaCell);
  block.textContent = '';
  block.append(row);

  if (!hasVideo && !img) {
    block.classList.add('no-media');
  }
}
