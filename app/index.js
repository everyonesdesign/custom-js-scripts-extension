(function() {
  const RUN_MODE = {
    DOCUMENT_START: 0, // Run before any other scripts
    DOCUMENT_READY: 1, // Run on document ready (DEFAULT)
    DOCUMENT_READY_DEFERRED: 2, // Run on document ready, but also wait a bit for other scripts
    WINDOW_LOAD: 3, // Run on window.load
  };

  // Run some of registered on the page hooks
  // Ctrl+Option+Cmd+H
  // Register hook via calling `registerHook` function
  // (look up usages in "examples" folder)
  const CUSTOM_HOOKS_PROPERTY = 'js__extension__custom__hooks';
  window[CUSTOM_HOOKS_PROPERTY] = new Proxy({}, {
    get: function(obj, prop) {
      return prop in obj ? obj[prop] : () => console.log(`Hook ${prop} was not found!`);
    },
  });

  run({
    host: /.*/,
    fn: () => {
      document.body.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.metaKey && e.code === 'KeyH') {
          const hooks = Object.keys(window[CUSTOM_HOOKS_PROPERTY]);
          if (hooks.length) {
            const question = hooks.map((i) => `- ${i}`).join('\n');
            const input = window.prompt(question);
            if (input) {
              window[CUSTOM_HOOKS_PROPERTY][input]();
            }
          } else {
            alert('No hooks available for this page');
          }
        }
      });
    },
  });

  /** 📝 PUT YOUR CODE UNDER THIS COMMENT: **/

  /**
   * EXAMPLES
    // Add custom styles to Google
    run({
      host: /google.com/,
      fn: () => {
        injectStyles(`
          body {
            background: red;
          }
        `);
      },
    });

    // Run code only on Google Flights
    run({
      host: /google.com/,
      path: /\/flights/,
      fn: () => {
        console.log('you are on flghts page');
      },
    });

    // Run code on window load event
    run({
      host: /google.com/,
      runMode: RUN_MODE.WINDOW_LOAD,
      fn: () => {
        console.log('page loaded!');
      },
    });

     * EXAMPLES END
     **/

  /**
   * FUNCTIONS DEFINITIONS
   */

  /**
   * Basic function to run script for a certain host
   * @param  {Object}      - configuration for the run
   * @param  {Function} fn - callback for a given host
   *                         (receives `window.location` as a param)
   */
  function run({
    host,
    path = /.*/,
    fn,
    runMode = RUN_MODE.DOCUMENT_READY,
  }) {
    if (
      host.test(window.location.hostname) &&
      path.test(window.location.pathname)
    ) {
      const callback = () => fn(window.location);
      switch (runMode) {
        case RUN_MODE.DOCUMENT_START:
          callback();
          return;
        case RUN_MODE.DOCUMENT_READY:
          onDocumentReady(callback);
          return;
        case RUN_MODE.DOCUMENT_READY_DEFERRED:
          onDocumentReady(() => {
            setTimeout(callback, 1000);
          });
          return;
        case RUN_MODE.WINDOW_LOAD:
          window.addEventListener('load', callback);
          return;
      }
    }
  }

  /**
   * Run a function on document ready event
   * @param  {Function} fn - callback to run
   */
  function onDocumentReady(fn) {
    // see https://stackoverflow.com/a/9899701/2376826
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /**
   * Make the website accessible from keyboard
   * @param {String} selector - CSS selector of elements to be made accessible
   */
  function enableKeyboardFor(selector) {
    const elements = [...document.querySelectorAll(selector)];
    elements.forEach((i) => {
      i.removeAttribute('aria-hidden');
      i.setAttribute('tabindex', 1);
      i.setAttribute('role', 'button');
    });
  }

  /**
   * Reset the focus from the active element
   * @param {String} selector - CSS selector of elements to be made accessible
   */
  function blurActiveElement() {
    document.activeElement && document.activeElement.blur();
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

  /**
   * Register a custom hook for a website
   * The hook can be called through using "h" shortcut in address bar
   * Settings for Chrome:
   * - ⚙ Execute custom hook
   * - javascript:window.js__extension__custom__hooks['%s']()
   *
   * @param  {String}   hook — hook name
   * @param  {Function} fn   - hook callback
   */
  function registerHook(hook, fn) {
    window[CUSTOM_HOOKS_PROPERTY][hook] = fn;
  }

  /**
   * Execute a custom hook for a website
   * @param  {String}   hook   — hook name
   * @param  {Array}    params - params to execute the hook with
   */
  function executeHook(hook, params = []) {
    const hookFn = window[CUSTOM_HOOKS_PROPERTY][hook];
    if (typeof hookFn === 'function') {
      hookFn(...params);
    }
  }

  /**
   * Set title of the current document
   * If everyMs parameter is provider, an interval will be set
   * @param {Function}  getTitle - function providing a title
   * @param {Number?}   delay [description]
   */
  function setTitle(getTitle, delay) {
    if (delay) {
      setInterval(() => {
        document.title = getTitle() || document.title || window.location.href;
      }, delay);
    } else {
      document.title = getTitle() || document.title || window.location.href;
    }
  }

  /**
   * Disable beforeunload event
   * See details in beforeunload.js
   */
  function disableBeforeunload() {
    window.jsHelper__onbeforeunloadDisabled = true;
  }
})();
