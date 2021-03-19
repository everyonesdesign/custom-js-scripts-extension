const script = document.createElement('script');
script.textContent = `
  (function () {
    window.jsHelper__onbeforeunloadDisabled = false;
    const isOnbeforeunloadDisabled = () => {
      return window.jsHelper__onbeforeunloadDisabled;
    };

    const originalAEL = window.addEventListener;
    window.addEventListener = function(eventName, fn, ...rest) {
      if (eventName === 'beforeunload') {
        return originalAEL.call(this, eventName, (event) => {
          if (!isOnbeforeunloadDisabled()) {
            return fn(event);
          }
        }, ...rest);
      }

      return originalAEL.apply(this, arguments);
    };

    const resetOBU = () => {
      const originalOBU = window.onbeforeunload;
      if (originalOBU) {
        window.onbeforeunload = function() {
          if (isOnbeforeunloadDisabled()) return;
          return originalOBU.apply(this, arguments);
        };
      }
    };
    resetOBU();
    setInterval(resetOBU, 5000);
  })();
`;
(document.head||document.documentElement).prepend(script);
