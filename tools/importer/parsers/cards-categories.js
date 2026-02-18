/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-categories block
 *
 * Source: https://www.avantorsciences.com/us/en/products
 * Base Block: cards (no-images variant)
 *
 * Block Structure (from markdown):
 * - Single column table, one row per card
 * - Each row: heading (linked) + description paragraph
 *
 * Source HTML Pattern:
 * app-cmscard-container > div > div.Categories > app-card
 *   > div.cms-card > app-simple-card-ui > div.avtr-card.Simple_Card
 *     > div.avtr-card-content-container > div.avtr-card-content
 *       > h3.avtr-card-title > cx-generic-link > a (linked title)
 *       > div.avtr-card-body > p (description)
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all Simple_Card items within the Categories container
  const cards = element.querySelectorAll('.avtr-card.Simple_Card');

  cards.forEach((card) => {
    const contentCell = document.createElement('div');

    // Extract linked title
    const titleLink = card.querySelector('.avtr-card-title a') ||
                      card.querySelector('.avtr-card-title cx-generic-link a');
    if (titleLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent.trim();
      h3.append(a);
      contentCell.append(h3);
    } else {
      // Fallback: title without link
      const titleEl = card.querySelector('.avtr-card-title');
      if (titleEl) {
        const h3 = document.createElement('h3');
        h3.textContent = titleEl.textContent.trim();
        contentCell.append(h3);
      }
    }

    // Extract body description
    // Note: Source HTML has invalid nested <p> inside <p>, which browsers split into
    // multiple <p> elements. Use textContent of the body div to avoid duplicates.
    const bodyEl = card.querySelector('.avtr-card-body');
    if (bodyEl) {
      const text = bodyEl.textContent.trim();
      if (text) {
        const para = document.createElement('p');
        para.textContent = text;
        contentCell.append(para);
      }
    }

    // Single column: [content]
    cells.push([contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Categories', cells });
  element.replaceWith(block);
}
