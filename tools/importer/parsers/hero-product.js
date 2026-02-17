/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, description, CTA)
 *
 * Source HTML Patterns:
 * 1. Hero_Card (Section1): .avtr-card.Hero_Card with background image in .avtr-card-media,
 *    heading in h3.avtr-card-title, body in .avtr-card-body p, CTA in a.av-btn
 * 2. Content_Cta (Section3): .avtr-card.Content_Cta with image in .avtr-card-media,
 *    pre-title in .avtr-card-pre-title, heading in h3.avtr-card-title,
 *    body in .avtr-card-body p, CTA in a.av-btn
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  // Validated: Found in captured DOM as .avtr-card-media > cx-media > img
  const heroImage = element.querySelector('.avtr-card-media cx-media img') ||
                    element.querySelector('.avtr-card-media img');

  // Extract pre-title (eyebrow text) - present on Content_Cta cards
  // Validated: Found as <div class="avtr-card-pre-title"> in Content_Cta cards
  const preTitle = element.querySelector('.avtr-card-pre-title');

  // Extract heading
  // Validated: Found as <h3 class="avtr-card-title"><div>text</div></h3>
  const heading = element.querySelector('h3.avtr-card-title') ||
                  element.querySelector('.avtr-card-title') ||
                  element.querySelector('h2, h1');

  // Extract body text
  // Validated: Found as <div class="avtr-card-body"><p>text</p>
  const bodyParagraphs = element.querySelectorAll('.avtr-card-body > p:not(:has(app-generic-link))');
  const bodyText = bodyParagraphs.length > 0
    ? Array.from(bodyParagraphs).filter((p) => !p.querySelector('app-generic-link, a.av-btn'))
    : [];

  // Extract CTA link
  // Validated: Found as <a class="av-btn av-btn--primary"> inside .avtr-card-body > p > app-generic-link
  const ctaLink = element.querySelector('.avtr-card-body a.av-btn') ||
                  element.querySelector('a.av-btn');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (if present)
  if (heroImage) {
    const img = document.createElement('img');
    img.src = heroImage.src;
    img.alt = heroImage.alt || '';
    cells.push([img]);
  }

  // Row 2: Content (heading, description, CTA in single cell)
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

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Product', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
