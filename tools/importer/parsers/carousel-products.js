/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-products block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: carousel
 *
 * Block Structure (from markdown example):
 * - Row per slide: [image | heading + description]
 * Each product is a row with image in column 1 and text in column 2
 *
 * Source HTML Pattern:
 * app-avtr-carousel
 * - .carousel-panel > .slides > .slide > .item
 *   - section (individual product card)
 *     - cx-media > img (product image)
 *     - .text-container
 *       - a.cx-link (product name link)
 *       - p.supplier (catalog number: "Catalog #: XXXXX")
 *       - p.supplier (supplier name)
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all product items in the carousel
  // Validated: Each product is a <section> inside .item within .slides
  const items = element.querySelectorAll('.slides .item section');

  items.forEach((item) => {
    // Column 1: Product image
    // Validated: Found as cx-media > img inside each section
    const imgEl = item.querySelector('cx-media img') ||
                  item.querySelector('img');
    const imageCell = document.createElement('div');
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      imageCell.append(img);
    }

    // Column 2: Product text (name + catalog number)
    const contentCell = document.createElement('div');

    // Extract product name (preserve link if present)
    const nameLink = item.querySelector('.text-container a.cx-link') ||
                     item.querySelector('.text-container a');
    if (nameLink) {
      const heading = document.createElement('strong');
      if (nameLink.href) {
        const a = document.createElement('a');
        a.href = nameLink.href;
        a.textContent = nameLink.textContent.trim();
        heading.append(a);
      } else {
        heading.textContent = nameLink.textContent.trim();
      }
      const p = document.createElement('p');
      p.append(heading);
      contentCell.append(p);
    }

    // Extract catalog number
    // Validated: Found as first <p class="supplier"> with "Catalog #:" prefix
    const supplierParagraphs = item.querySelectorAll('.text-container p.supplier');
    supplierParagraphs.forEach((para) => {
      const text = para.textContent.trim();
      if (text && text.startsWith('Catalog #:')) {
        const p = document.createElement('p');
        p.textContent = text.replace('Catalog #:', '').trim();
        contentCell.append(p);
      }
    });

    // Add row with 2 columns: [image | content]
    cells.push([imageCell, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Products', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
