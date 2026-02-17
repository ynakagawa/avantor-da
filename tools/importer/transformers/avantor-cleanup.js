/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Avantor Sciences website cleanup
 * Purpose: Remove non-content elements and Angular/Spartacus artifacts
 * Applies to: www.avantorsciences.com (all templates)
 * Generated: 2026-02-17
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://www.avantorsciences.com/us/en/
 * - Page structure analysis from Spartacus/Angular storefront
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation elements (not part of content migration)
    // Found in captured DOM: <cx-page-layout class="header"> and <cx-page-layout class="navigation">
    WebImporter.DOMUtils.remove(element, [
      'cx-page-layout.header',
      'cx-page-layout.navigation',
    ]);

    // Remove footer
    // Found in captured DOM: <cx-page-slot class="Footer has-components">
    WebImporter.DOMUtils.remove(element, [
      'cx-page-slot.Footer',
    ]);

    // Remove bottom header slot (empty but present)
    // Found in captured DOM: <cx-page-slot class="cx-bottom-header-slot BottomHeaderSlot">
    WebImporter.DOMUtils.remove(element, [
      'cx-page-slot.BottomHeaderSlot',
    ]);

    // Remove empty page slots (Section2A, Section2B, Section2C, Section4, Section5)
    // Found in captured DOM as empty cx-page-slot elements
    WebImporter.DOMUtils.remove(element, [
      'cx-page-slot.Section2A',
      'cx-page-slot.Section2B',
      'cx-page-slot.Section2C',
      'cx-page-slot.Section4',
      'cx-page-slot.Section5',
    ]);

    // Remove global message area
    // Found in captured DOM: <cx-global-message>
    WebImporter.DOMUtils.remove(element, [
      'cx-global-message',
    ]);

    // Remove popup containers
    // Found in captured DOM: <div id="popup_container">, <div id="static_popup_container">, <div id="fixed_container">
    WebImporter.DOMUtils.remove(element, [
      '#popup_container',
      '#static_popup_container',
      '#fixed_container',
    ]);

    // Remove skip link (accessibility element not needed in content)
    // Found in captured DOM: <cx-skip-link>
    WebImporter.DOMUtils.remove(element, [
      'cx-skip-link',
    ]);

    // Remove chat widget
    // Found in captured DOM: <app-avtr-chat> inside footer
    WebImporter.DOMUtils.remove(element, [
      'app-avtr-chat',
    ]);

    // Remove consent banner
    // Found in captured DOM: <app-consent-banner>
    WebImporter.DOMUtils.remove(element, [
      'app-consent-banner',
    ]);

    // Remove tooltip containers from recommendation section
    // Found in captured DOM: <span class="tooltip-container custom-tooltip"> in recently-viewed-title
    WebImporter.DOMUtils.remove(element, [
      '.tooltip-container',
    ]);

    // Remove carousel navigation buttons and tab controls (not content)
    // Found in captured DOM: <div class="carousel-tabs"> and navigation <button class="btn previous/next">
    WebImporter.DOMUtils.remove(element, [
      '.carousel-tabs',
      'button.previous',
      'button.next',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
    ]);

    // Remove HTML comment nodes (Angular template artifacts: <!---->)
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_COMMENT,
      null,
      false,
    );
    const comments = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode);
    }
    comments.forEach((comment) => comment.remove());
  }
}
