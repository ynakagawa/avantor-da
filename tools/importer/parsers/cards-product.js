/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row per card: [image | heading + description + CTA]
 * Each card is a 2-column row with image in column 1 and text content in column 2
 *
 * Source HTML Pattern:
 * The element is a .Auto_Fit div containing multiple app-card elements.
 * Each card has:
 * - .avtr-card.Simple_Card wrapper
 * - .avtr-card-media > app-generic-link > a > cx-media > img (image with optional link)
 * - .avtr-card-content-container > .avtr-card-content
 *   - h3.avtr-card-title > app-generic-link > a > div (heading with optional link)
 *   - .avtr-card-body > p (description text)
 *   - .avtr-card-body > p > app-generic-link > a.av-btn (CTA button)
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all card items within the Auto_Fit grid
  // Validated: Cards are inside .avtr-card.Simple_Card wrappers
  const cards = element.querySelectorAll('.avtr-card.Simple_Card');

  cards.forEach((card) => {
    // Column 1: Extract image
    // Validated: Found as .avtr-card-media cx-media img
    const imgEl = card.querySelector('.avtr-card-media cx-media img') ||
                  card.querySelector('.avtr-card-media img');

    const imageCell = document.createElement('div');
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      imageCell.append(img);
    }

    // Column 2: Extract text content (heading, body, CTA)
    const contentCell = document.createElement('div');

    // Extract heading
    // Validated: Found as <h3 class="avtr-card-title"> containing text or link
    const titleEl = card.querySelector('h3.avtr-card-title');
    if (titleEl) {
      const titleLink = titleEl.querySelector('a');
      const heading = document.createElement('strong');

      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = titleEl.textContent.trim();
        heading.append(a);
      } else {
        heading.textContent = titleEl.textContent.trim();
      }
      const p = document.createElement('p');
      p.append(heading);
      contentCell.append(p);
    }

    // Extract body text (excluding CTA paragraphs)
    // Validated: Found as .avtr-card-body > p
    const bodyParagraphs = card.querySelectorAll('.avtr-card-body > p');
    bodyParagraphs.forEach((para) => {
      // Skip paragraphs that only contain CTA buttons
      if (para.querySelector('a.av-btn')) return;

      const p = document.createElement('p');
      p.innerHTML = para.innerHTML;
      contentCell.append(p);
    });

    // Extract CTA link
    // Validated: Found as .avtr-card-body a.av-btn
    const ctaLink = card.querySelector('.avtr-card-body a.av-btn');
    if (ctaLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      const strong = document.createElement('strong');
      strong.append(a);
      p.append(strong);
      contentCell.append(p);
    }

    // Add row with 2 columns: [image | content]
    cells.push([imageCell, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
