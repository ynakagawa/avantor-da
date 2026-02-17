export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const ul = document.createElement('ul');
  let startIdx = 0;
  let headingText = null;

  // Check if first row is heading-only (e.g. "Featured content")
  const firstRow = rows[0];
  const firstContent = firstRow.children[1];
  const hasImage = firstRow.querySelector('picture, img');
  if (!hasImage && firstContent && firstContent.childNodes.length <= 2) {
    headingText = firstContent?.textContent?.trim() || 'Featured content';
    startIdx = 1;
  }

  rows.slice(startIdx).forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture, img')) {
        div.className = 'cards-featured-card-image';
      } else {
        div.className = 'cards-featured-card-body';
      }
    });
    ul.append(li);
  });

  block.textContent = '';
  if (headingText) {
    const heading = document.createElement('h2');
    heading.className = 'cards-featured-title';
    heading.textContent = headingText;
    block.append(heading);
  }
  block.append(ul);

  if (ul.children.length === 2) block.classList.add('two-cards');
  if (ul.children.length === 3) block.classList.add('three-cards');
}
