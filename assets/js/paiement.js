!(function () {
    "use strict";
    var e;
    !(function (e) {
      (e.NETWORK_STATE_CHANGED = "NETWORK_STATE_CHANGED"),
        (e.INIT_WIDGET = "INIT_WIDGET"),
        (e.WIDGET_SUCCESSFULLY_INIT = "WIDGET_SUCCESSFULLY_INIT"),
        (e.CLOSE_WIDGET = "CLOSE_WIDGET"),
        (e.DESTROY_WIDGET = "DESTROY_WIDGET"),
        (e.WIDGET_SUCCESSFULLY_DESTROYED = "WIDGET_SUCCESSFULLY_DESTROYED"),
        (e.PAYMENT_INIT = "PAYMENT_INIT"),
        (e.PAYMENT_ABORTED = "PAYMENT_ABORTED"),
        (e.PENDING_PAYMENT = "PENDING_PAYMENT"),
        (e.ON_USER_FEEDBACK = "ON_USER_FEEDBACK"),
        (e.PAYMENT_FAILED = "PAYMENT_FAILED"),
        (e.PAYMENT_SUCCESS = "PAYMENT_SUCCESS"),
        (e.PAYMENT_END = "PAYMENT_END"),
        (e.RETRY_PAYMENT = "RETRY_PAYMENT"),
        (e.WAVE_LINK = "WAVE_LINK");
    })(e || (e = {}));
    const t = { serviceId: "INTEGRATION" },
      n = {
        UI_APP_DEV: "https://widget-v3.kkiapay.me",
        UI_APP_CDN_LINK: "https://cdn.kkiapay.me/k.js",
      },
      i = [
        "amount",
        "sandbox",
        "position",
        "theme",
        "paymentmethod",
        "paymentMethods",
        "providers",
        "fullname",
        "name",
        "email",
        "phoneNumber",
        "phone",
        "data",
        "key",
        "sdk",
        "url",
        "callback",
        "buttontext",
        "direct",
        "split",
        "partnerid",
        "partnerId",
        "successCallback",
        "apikey",
        "api_key",
        "publicAPIKey",
        "countries",
      ],
      a = {
        phone: "phoneNumber",
        name: "fullname",
        paymentmethod: "paymentMethods",
        apikey: "key",
        successCallback: "callback",
        publicAPIKey: "key",
        api_key: "key",
        partnerid: "partnerId",
      },
      o = ["countries", "paymentMethods"];
    function d(e) {
      const t = e.split("-");
      return (
        t[0] +
        t
          .slice(1)
          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
          .join("")
      );
    }
    function r(e) {
      const t = JSON.parse(JSON.stringify(e));
      if ("" === t) return t;
      if (Number.isNaN(Number(t))) {
        if ("false" === t) return !1;
        if ("true" === t) return !0;
        if (t.indexOf(",") > -1) {
          return t.split(" ").join("").split(",");
        }
        return t;
      }
      return Number(t);
    }
    class s extends HTMLElement {
      constructor() {
        super();
        const e = this.attachShadow({ mode: "open" });
        let t,
          n = document.createElement("button");
        (n.innerHTML =
          "en" === window.navigator.language.split("-")[0]
            ? "Pay now"
            : "Payer maintenant"),
          n.setAttribute(
            "style",
            "\n        background-color: #4661b9;\n        color: white;\n        padding: 10px 20px;\n        font-size: 16px;\n        border: none;\n        border-radius: 5px;\n        cursor: pointer;\n      "
          ),
          e.appendChild(n),
          setTimeout(() => {
            t = Object.freeze({ ...this });
          }, 100),
          n.addEventListener("click", () => {
            window.openKkiapayWidget(t);
          });
      }
      static get observedAttributes() {
        return i;
      }
      attributeChangedCallback(e, t, n) {
        if (null !== t) return;
        if (((this[d(e)] = n), !this.shadowRoot)) return;
        const i = this.shadowRoot.querySelector("button");
        i &&
          (e === d("buttontext") && n && (i.innerHTML = n),
          "class" === e && n && i.setAttribute("class", n));
      }
    }
    let E,
      c = () => {};
    const p = (i) => {
      i = (function (e) {
        const t = { ...e };
        for (let e in a) t[e] && ((t[a[e]] = t[e]), delete t[e]);
        for (let e in t) {
          if (["data", "paymentMethods", "countries"].includes(e)) {
            try {
              t[e] = JSON.parse(JSON.stringify(t[e]));
            } catch (e) {}
            o.includes(e) &&
              ((t[e] = Array.isArray(r(t[e])) ? r(t[e]) : [r(t[e])]),
              "paymentMethods" === e) &&
              t.paymentMethods.find(
                (e) => !["momo", "card", "direct_debit"].includes(e)
              ) &&
              (t.paymentMethods = ["momo", "card", "direct_debit"]);
          }
          "amount" === e && (t[e] = Number(t[e])),
            "phoneNumber" === e && (t[e] = String(t[e])),
            "sandbox" === e &&
              "boolean" != typeof t.sandbox &&
              ("true" === t.sandbox
                ? (t.sandbox = !0)
                : (t.sandbox, (t.sandbox = !1))),
            "position" !== e ||
              ["left", "right", "center"].includes(t[e]) ||
              (t[e] = "center");
        }
        return t;
      })(i);
      const d = E.contentWindow;
      d &&
        d.postMessage(
          {
            name: e.INIT_WIDGET,
            data: { ...i, host: window.location.href, ...t },
          },
          n.UI_APP_DEV
        );
    };
    (() => {
      const e = new Date().getTime();
      (E = document.createElement("iframe")),
        (E.style.cssText = `\n    display: block;\n    height: 100svh; \n    width: 100%; \n    position: fixed;\n    top: 0;\n    left: 0;\n    z-index: ${e};`),
        (E.src = n.UI_APP_DEV),
        E.setAttribute("frameborder", "0"),
        E.addEventListener("load", () => c());
    })();
    const u = (e) => {
        (c = () => p(e)), document.body.appendChild(E);
      },
      T = () => E.remove(),
      _ = (e) => window.open(e, "_blank")?.focus(),
      N = (() => {
        const t = { [e.CLOSE_WIDGET]: T, [e.WAVE_LINK]: _ };
        for (const n in e) t[n] || (t[n] = () => {});
        return t;
      })();
    window.addEventListener("load", () =>
      (() => {
        const e = document.querySelector(".kkiapay-button"),
          t = document.querySelector(`script[src="${n.UI_APP_CDN_LINK}"]`);
        if (t && e) {
          let n = {};
          for (let e of i) {
            const i = t.getAttribute(e);
            i && (n[e] = i);
          }
          e.addEventListener("click", () => {
            u(n);
          });
        }
      })()
    ),
      window.addEventListener("message", (e) => {
        e.data && N[e.data.name] && N[e.data.name](e.data.data);
      });
    (window.openKkiapayWidget = u),
      (window.closeKkiapayWidget = T),
      (window.addWidgetInitListener = (e) => {
        N.INIT_WIDGET = e;
      }),
      (window.addKkiapayCloseListener = (e) => {
        N.CLOSE_WIDGET = () => {
          T(), e();
        };
      }),
      (window.addWidgetDestroyedListener = (e) => {
        N.DESTROY_WIDGET = e;
      }),
      (window.addPaymentInitListener = (e) => {
        N.PAYMENT_INIT = e;
      }),
      (window.addPaymentEndListener = (e) => {
        N.PAYMENT_END = e;
      }),
      (window.addPaymentAbortedListener = (e) => {
        N.PAYMENT_ABORTED = e;
      }),
      (window.addFeedbackListener = (e) => {
        N.ON_USER_FEEDBACK = e;
      }),
      (window.addPendingListener = (e) => {
        N.PENDING_PAYMENT = e;
      }),
      (window.addFailedListener = (e) => {
        N.PAYMENT_FAILED = e;
      }),
      (window.addSuccessListener = (e) => {
        N.PAYMENT_SUCCESS = e;
      }),
      (window.onNetworkStateChanged = (e) => {
        N.NETWORK_STATE_CHANGED = e;
      }),
      (window.addEventListener = addEventListener),
      (window.addKkiapayListener = (e, t) => {
        N[`PAYMENT_${e.toUpperCase()}`] = t;
      }),
      (window.removeKkiapayListener = (e) => {
        N[`PAYMENT_${e.toUpperCase()}`] = () => {};
      }),
      window.customElements.get("kkiapay-widget") ||
        window.customElements.define("kkiapay-widget", s);
  })();