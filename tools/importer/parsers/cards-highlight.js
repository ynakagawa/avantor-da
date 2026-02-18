/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-highlight block
 *
 * Source: https://www.avantorsciences.com/us/en/digital-solutions
 * Target: app-cmscard-container containing h2 "Explore Digital Solutions by SmartScience"
 *
 * Block Structure:
 * - Row 0: [empty | "Explore Digital Solutions by SmartScience"] (section heading with highlight)
 * - Row 1+: [image | title + description + CTA] per card
 *
 * Source HTML Pattern:
 * app-cmscard-container with h2.av-cards-title "Explore Digital Solutions by SmartScience"
 * div.Column containing app-card elements.
 * Each card has .avtr-card.Simple_Card:
 * - .avtr-card-media > img (image with optional link)
 * - .avtr-card-content-container > .avtr-card-content
 *   - h3.avtr-card-title (title with optional link)
 *   - .avtr-card-body > p (description)
 *   - .avtr-card-body > p > a.av-btn (CTA button)
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const container = element;
  const h2 = container.querySelector('h2.av-cards-title');
  if (!h2) return;

  const headingText = h2.textContent.trim();
  if (!headingText.includes('Explore Digital Solutions') && !headingText.includes('Digital Solutions by SmartScience')) {
    return; // Not the Digital Solutions highlight section - skip
  }

  const column = container.querySelector('.Column');
  const cards = column?.querySelectorAll('.avtr-card.Simple_Card') || [];

  const cells = [];

  // Row 0: Section heading
  const headingCell = document.createElement('div');
  headingCell.textContent = headingText;
  cells.push([document.createElement('div'), headingCell]);

  cards.forEach((card) => {
    const imgEl = card.querySelector('.avtr-card-media cx-media img') ||
      card.querySelector('.avtr-card-media img');
    const imageCell = document.createElement('div');
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      imageCell.append(img);
    }

    const contentCell = document.createElement('div');

    const titleEl = card.querySelector('h3.avtr-card-title');
    if (titleEl) {
      const titleLink = titleEl.querySelector('a');
      const heading = document.createElement('strong');
      if (titleLink?.href) {
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

    const bodyParagraphs = card.querySelectorAll('.avtr-card-body > p');
    bodyParagraphs.forEach((para) => {
      if (para.querySelector('a.av-btn')) return;
      const p = document.createElement('p');
      p.innerHTML = para.innerHTML;
      contentCell.append(p);
    });

    const ctaLink = card.querySelector('.avtr-card-body a.av-btn');
    if (ctaLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      a.className = 'av-btn av-btn--primary';
      const strong = document.createElement('strong');
      strong.append(a);
      p.append(strong);
      contentCell.append(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Highlight', cells });
  container.replaceWith(block);
}
