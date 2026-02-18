export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  let startIdx = 0;
  let headingText = null;

  // Check if first row is heading-only (empty col1, heading in col2)
  const firstRow = rows[0];
  const firstCols = [...firstRow.children];
  const hasImage = firstRow.querySelector('picture, img');
  const col2 = firstCols[1];
  if (!hasImage && firstCols.length >= 2 && col2 && col2.childNodes.length <= 2) {
    headingText = col2?.textContent?.trim() || '';
    if (headingText) startIdx = 1;
  }

  const ul = document.createElement('ul');
  rows.slice(startIdx).forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cards-highlight-card');

    const imageCell = document.createElement('div');
    imageCell.className = 'cards-highlight-card-image';

    const contentCell = document.createElement('div');
    contentCell.className = 'cards-highlight-card-content';

    // Col 1: image, Col 2: content (matches hero-promo / cards-product structure)
    if (cols[0]) {
      while (cols[0].firstChild) imageCell.append(cols[0].firstChild);
    }
    if (cols[1]) {
      while (cols[1].firstChild) contentCell.append(cols[1].firstChild);
    }

    if (imageCell.children.length) li.append(imageCell);
    if (contentCell.children.length) li.append(contentCell);

    if (li.children.length) ul.append(li);
  });

  block.textContent = '';

  if (headingText) {
    const heading = document.createElement('h2');
    heading.className = 'cards-highlight-title';
    heading.textContent = headingText;
    block.append(heading);
  }

  block.append(ul);

  if (ul.children.length === 2) block.classList.add('two-cards');
  if (ul.children.length === 3) block.classList.add('three-cards');
  if (ul.children.length === 4) block.classList.add('four-cards');
}
