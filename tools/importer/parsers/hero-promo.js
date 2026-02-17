/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Image (optional)
 * - Row 2: Content (heading, description, CTA)
 *
 * Derived from hero-product parser.
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const heroImage = element.querySelector('.avtr-card-media cx-media img') ||
                    element.querySelector('.avtr-card-media img');
  const preTitle = element.querySelector('.avtr-card-pre-title');
  const heading = element.querySelector('h3.avtr-card-title') ||
                  element.querySelector('.avtr-card-title') ||
                  element.querySelector('h2, h1');
  const bodyParagraphs = element.querySelectorAll('.avtr-card-body > p:not(:has(app-generic-link))');
  const bodyText = bodyParagraphs.length > 0
    ? Array.from(bodyParagraphs).filter((p) => !p.querySelector('app-generic-link, a.av-btn'))
    : [];
  const ctaLink = element.querySelector('.avtr-card-body a.av-btn') ||
                  element.querySelector('a.av-btn');

  const cells = [];

  if (heroImage) {
    const img = document.createElement('img');
    img.src = heroImage.src;
    img.alt = heroImage.alt || '';
    cells.push([img]);
  }

  const contentCell = [];

  if (preTitle) {
    const em = document.createElement('em');
    em.textContent = preTitle.textContent.trim();
    contentCell.push(em);
  }

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Promo', cells });
  element.replaceWith(block);
}
