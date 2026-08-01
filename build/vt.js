/* Rueckfallebene fuer Browser ohne View Transitions + Fortschrittslinie. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.startViewTransition) return;
  var root = document.documentElement;
  addEventListener('pageshow', function () { root.removeAttribute('data-leaving'); });
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-vt')) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // nur Anker
    e.preventDefault();
    root.setAttribute('data-leaving', '');
    setTimeout(function () { location.href = url.href; }, 130);
  });
})();
