(function() {

  /**
   * EXAMPLES

  // insert custom styles to 'google.com'
  // (first parameter is a hostname)
  runOn(/google.com/, () => {
    injectStyles(`
      body {
        background: red;
      }
    `);
  });

  // run custom scripts on google flights only
  // (second parameter is a pathname regex)
  runOn(/www.google.com/, /\/flights/, () => {
    console.log('flights');
  });

   * EXAMPLES END
   **/







  /**
   * FUNCTIONS DEFINITIONS
   */

  /**
   * Basic function to run script for a certain host
   * @param  {RegExp}   hostExpression - window.location.hostname regex for a given host
   * @param  {RegExp?}  pathExpression - window.location.pathname regex for a given host
   * @param  {Function} fn             - callback for a given host
   */
  function runOn(...args) {
    let [hostExpression, pathExpression, fn] = args;

    if (!fn) {
      fn = pathExpression;
      pathExpression = /.*/;
    }

    if (
      hostExpression.test(window.location.hostname) &&
      pathExpression.test(window.location.pathname)
    ) {
      fn();
    }
  }

  /**
   * Make the website accessible from keyboard
   * @param {String} selector - CSS selector of elements to be made accessible
   */
  function enableKeyboardFor(selector) {
    const elements = [...document.querySelectorAll(selector)];
    elements.forEach((i) => i.setAttribute('tabindex', 1));
  }

  /**
   * Reset the focus from the active element
   * @param {String} selector - CSS selector of elements to be made accessible
   */
  function blurActiveElement() {
    document.activeElement.blur();
  }

  /**
   * Add styles to the document
   * @param  {String} styles - CSS to inject
   */
  function injectStyles(styles) {
    const style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);
  }
})();
