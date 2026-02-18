/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta block
 *
 * Source: https://www.avantorsciences.com/us/en/products
 * Base Block: hero
 *
 * Block Structure (from markdown):
 * - Single column table
 * - Row: heading + body text + CTA link (bold)
 * - No image
 *
 * Source HTML Pattern:
 * div.avtr-card.Content_Cta_Gradient
 *   > div.avtr-card-content-container > div.avtr-card-content
 *     > h2.avtr-card-title (heading)
 *     > div.avtr-card-body
 *       > p (body text)
 *       > p > app-generic-link > a.av-btn (CTA button)
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const cells = [];
  const contentCell = document.createElement('div');

  // Extract heading
  const titleEl = element.querySelector('.avtr-card-title');
  if (titleEl) {
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.trim();
    contentCell.append(h2);
  }

  // Extract body text
  const bodyEl = element.querySelector('.avtr-card-body');
  if (bodyEl) {
    const paragraphs = bodyEl.querySelectorAll('p');
    paragraphs.forEach((p) => {
      // Skip paragraphs that only contain CTA buttons
      const ctaLink = p.querySelector('a.av-btn');
      if (ctaLink) {
        // Create CTA as bold link
        const ctaPara = document.createElement('p');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        strong.append(a);
        ctaPara.append(strong);
        contentCell.append(ctaPara);
      } else {
        const text = p.textContent.trim();
        if (text) {
          const para = document.createElement('p');
          para.textContent = text;
          contentCell.append(para);
        }
      }
    });
  }

  // Single column: [content]
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Cta', cells });
  element.replaceWith(block);
}
