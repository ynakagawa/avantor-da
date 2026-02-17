import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/nav/footer';

/**
 * loads and decorates the footer
 * Matches app-avtr-footer-navigation structure from avantorsciences.com
 * @param {Element} el The footer element
 */
export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    fragment.classList.add('footer-content');

    let sections = [...fragment.querySelectorAll('.section')];
    if (sections.length === 0) {
      [...fragment.children].forEach((child) => child.classList.add('section'));
      sections = [...fragment.querySelectorAll('.section')];
    }

    const copyright = sections.pop();
    if (copyright) copyright.classList.add('section-copyright');

    const legal = sections.pop();
    if (legal) legal.classList.add('section-legal');

    // Wrap in body-container/row structure to match app-avtr-footer-navigation
    const bodyContainer = document.createElement('div');
    bodyContainer.className = 'footer-body-container';
    const row = document.createElement('div');
    row.className = 'footer-row';

    // First section = description (company blurb), rest = nav columns
    const descriptionSection = sections.shift();
    if (descriptionSection) {
      descriptionSection.classList.add('footer-description');
      row.append(descriptionSection);
    }
    if (sections.length > 0) {
      const navCol = document.createElement('div');
      navCol.className = 'footer-nav-column';
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'Footer links');
      sections.forEach((section) => {
        section.classList.add('footer-nav-group');
        nav.append(section);
      });
      navCol.append(nav);
      row.append(navCol);
    }
    bodyContainer.append(row);
    if (legal || copyright) {
      const bottom = document.createElement('div');
      bottom.className = 'footer-bottom';
      if (legal) bottom.append(legal);
      if (copyright) bottom.append(copyright);
      bodyContainer.append(bottom);
    }
    fragment.textContent = '';
    fragment.append(bodyContainer);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
