/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product-video block
 *
 * Source: https://www.avantorsciences.com/us/en/digital-solutions
 * Target: app-simple-card-ui containing div.avtr-card.Hero_Card_Video
 *
 * Block Structure:
 * - Row 1: Video or image (optional)
 * - Row 2: Content (heading, description, CTA)
 *
 * Source HTML Pattern:
 * app-simple-card-ui > .avtr-card.Hero_Card_Video
 * - .avtr-card-media: video, cx-media video, or img (poster)
 * - .avtr-card-content-container or similar: h3.avtr-card-title, .avtr-card-body, a.av-btn
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const card = element.querySelector('.avtr-card.Hero_Card_Video') || element;
  if (!card.classList?.contains('Hero_Card_Video') && !element.querySelector('.avtr-card.Hero_Card_Video')) {
    return;
  }
  const target = card.classList?.contains('Hero_Card_Video') ? card : element;

  // Extract video: video element, or video source link
  const videoEl = target.querySelector('.avtr-card-media video') ||
    target.querySelector('.avtr-card-media cx-media video') ||
    target.querySelector('video');
  const videoSrc = target.querySelector('.avtr-card-media a[href*=".mp4"]') ||
    target.querySelector('.avtr-card-media a[href*=".webm"]') ||
    target.querySelector('a[href*=".mp4"], a[href*=".webm"]');
  const ytLink = target.querySelector('a[href*="youtube.com"], a[href*="youtu.be"]');
  const posterImg = target.querySelector('.avtr-card-media img') ||
    target.querySelector('.avtr-card-media cx-media img');

  // Extract heading
  const heading = target.querySelector('h3.avtr-card-title') ||
    target.querySelector('.avtr-card-title') ||
    target.querySelector('h2, h1');

  // Extract body
  const bodyParagraphs = target.querySelectorAll('.avtr-card-body > p:not(:has(app-generic-link))');
  const bodyText = Array.from(bodyParagraphs).filter(
    (p) => !p.querySelector('app-generic-link, a.av-btn'),
  );

  // Extract CTA
  const ctaLink = target.querySelector('.avtr-card-body a.av-btn') ||
    target.querySelector('a.av-btn');

  const cells = [];

  // Row 1: Video or image
  const mediaCell = document.createElement('div');
  if (videoEl) {
    const vid = document.createElement('video');
    const src = videoEl.querySelector('source') || videoEl;
    vid.src = src.src || src.getAttribute('src');
    if (posterImg?.src) vid.poster = posterImg.src;
    mediaCell.append(vid);
  } else if (videoSrc) {
    const a = document.createElement('a');
    a.href = videoSrc.href;
    a.textContent = ''; // Link only for URL extraction
    mediaCell.append(a);
    if (posterImg) {
      const img = document.createElement('img');
      img.src = posterImg.src;
      img.alt = posterImg.alt || '';
      mediaCell.append(img);
    }
  } else if (ytLink) {
    const a = document.createElement('a');
    a.href = ytLink.href;
    a.textContent = '';
    mediaCell.append(a);
    if (posterImg) {
      const img = document.createElement('img');
      img.src = posterImg.src;
      img.alt = posterImg.alt || '';
      mediaCell.append(img);
    }
  } else if (posterImg) {
    const img = document.createElement('img');
    img.src = posterImg.src;
    img.alt = posterImg.alt || '';
    mediaCell.append(img);
  }
  cells.push([mediaCell]);

  // Row 2: Content
  const contentCell = [];
  if (heading) {
    const h = document.createElement('h1');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
  }
  bodyText.forEach((p) => {
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    contentCell.push(para);
  });
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    const strong = document.createElement('strong');
    strong.append(a);
    p.append(strong);
    contentCell.push(p);
  }
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Product-Video', cells });
  element.replaceWith(block);
}
