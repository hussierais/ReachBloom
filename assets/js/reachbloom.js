/* ReachBloom: vanilla filtering; storefront anchors are never intercepted. */
(() => {
  const input = document.querySelector('#business-search');
  if (!input) return;
  const cards = [...document.querySelectorAll('.business-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  let category = 'All';
  const normalise = text => text.normalize('NFKD').toLocaleLowerCase().trim();
  function update() {
    const words = normalise(input.value).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const match = (category === 'All' || card.dataset.category === category) && words.every(word => normalise(card.dataset.search).includes(word));
      card.hidden = !match;
      if (match) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    document.querySelector('#result-count').textContent = `Showing ${count} ${count === 1 ? 'business' : 'businesses'}`;
    document.querySelector('#empty-state').hidden = count !== 0;
  }
  function reset() { input.value = ''; category = 'All'; update(); input.focus(); }
  input.addEventListener('input', update);
  document.querySelector('#search-form').addEventListener('submit', event => { event.preventDefault(); update(); });
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  document.querySelector('#clear-filters').addEventListener('click', reset);
  document.querySelector('#empty-reset').addEventListener('click', reset);
  update();
})();
