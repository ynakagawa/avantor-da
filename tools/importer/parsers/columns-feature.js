/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Single row with 2 columns: [text content | image]
 *
 * Source HTML Pattern:
 * .avtr-card.Feature_Card_Img_After
 * - .avtr-card-content-container > .avtr-card-content
 *   - .avtr-card-pre-title (heading text)
 *   - .avtr-card-body > p (description with inline links)
 *   - .avtr-card-body > p > app-generic-link > a.av-btn (CTA button)
 * - .avtr-card-media > cx-media > img (feature image)
 *
 * Note: Feature_Card_Img_After puts image AFTER content (image on right)
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  // Column 1: Text content (heading, body, CTA)
  const col1 = document.createElement('div');

  // Extract heading from pre-title
  // Validated: Found as <div class="avtr-card-pre-title"> in Feature_Card_Img_After
  const preTitle = element.querySelector('.avtr-card-pre-title');
  if (preTitle) {
    const h2 = document.createElement('h2');
    h2.textContent = preTitle.textContent.trim();
    col1.append(h2);
  }

  // Extract body text (excluding CTA paragraphs)
  // Validated: Found as .avtr-card-body > p
  const bodyParagraphs = element.querySelectorAll('.avtr-card-body > p');
  bodyParagraphs.forEach((para) => {
    // Skip paragraphs that only contain CTA buttons
    if (para.querySelector('a.av-btn') && !para.textContent.replace(para.querySelector('a.av-btn')?.textContent || '', '').trim()) {
      return;
    }

    const p = document.createElement('p');
    p.innerHTML = para.innerHTML;
    col1.append(p);
  });

  // Extract CTA link
  // Validated: Found as a.av-btn inside .avtr-card-body > p > app-generic-link
  const ctaLink = element.querySelector('.avtr-card-body a.av-btn');
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    const strong = document.createElement('strong');
    strong.append(a);
    p.append(strong);
    col1.append(p);
  }

  // Column 2: Image
  // Validated: Found as .avtr-card-media > cx-media > img
  const col2 = document.createElement('div');
  const imgEl = element.querySelector('.avtr-card-media cx-media img') ||
                element.querySelector('.avtr-card-media img');
  if (imgEl) {
    const img = document.createElement('img');
    img.src = imgEl.src;
    img.alt = imgEl.alt || '';
    col2.append(img);
  }

  // Build cells array: single row with 2 columns [text | image]
  const cells = [
    [col1, col2],
  ];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Feature', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
