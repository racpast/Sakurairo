/*! For license information please see 900.js.LICENSE.txt */
(globalThis.webpackChunksakurairo_scripts=globalThis.webpackChunksakurairo_scripts||[]).push([[900],{900:(e,t,r)=>{r.r(t),r.d(t,{default:()=>j});r(5226);var n=r(8219),o=r(6460),s=r(7028),i=r(5564),a=r(5914),l=r(4172),c=r(1176),u=r(4562),d=r(9225),h=r(4349),m=r(8744),p=r.n(m);class f{constructor(e){this.key=e,this.pull()}pull(){let e=window.history.state,t=null==e?void 0:e[this.key];if(void 0===t||this.index!==t){var r=window.sessionStorage.getItem(this.key),n=r?JSON.parse(r):[];n[this.index]=this.state,window.sessionStorage.setItem(this.key,JSON.stringify(n)),void 0===t?(this.index=n.length,this.state=null,window.history.replaceState({...e,[this.key]:this.index},document.title)):(this.index=t,this.state=r?n[t]:null)}}}let w=(e,t)=>{e.replaceWith(t)},g={default:w,innerHTML:(e,t)=>{e.innerHTML=t.innerHTML},textContent:(e,t)=>{e.textContent=t.textContent},innerText:(e,t)=>{e.innerText=t.innerText},attributes:(e,t)=>{let r=e.getAttributeNames();t.getAttributeNames().forEach((n=>{e.setAttribute(n,t.getAttribute(n)||""),r=r.filter((e=>e!==n))})),r.forEach((t=>{e.removeAttribute(t)}))},replaceWith:w};class v{constructor(e,t){this.form=e,this.submitButton=t}getAttribute(e){let{submitButton:t,form:r}=this;if(t&&t.hasAttribute(`form${e}`)){var n=`${e.charAt(0).toUpperCase()}${e.slice(1)}`;if(n=t[`form${n}`])return n}return r[e]}getEntryList(){let{form:e,submitButton:t}=this,r=new FormData(e);return t&&!t.disabled&&t.name&&r.append(t.name,t.value),r}getNameValuePairs(){return Array.from(this.getEntryList(),(([e,t])=>[e,t instanceof File?t.name:t]))}getURLSearchParams(){return new URLSearchParams(this.getNameValuePairs())}getTextPlain(){return this.getNameValuePairs().reduce(((e,[t,r])=>`${e}${t}=${r}\r\n`),"")}getRequestInfo(){let e=this.getAttribute("action");var t=new URL(e,document.baseURI);if(!/^https?:$/.test(t.protocol))return null;switch(this.getAttribute("method")){case"get":return t.search=this.getURLSearchParams().toString(),t.href;case"post":switch(this.getAttribute("enctype")){case"application/x-www-form-urlencoded":t=this.getURLSearchParams();break;case"multipart/form-data":t=this.getEntryList();break;case"text/plain":t=this.getTextPlain();break;default:return null}return new Request(e,{method:"POST",body:t});default:return null}}}let y=e=>{if(e===window.name)return window;switch(e.toLowerCase()){case"":case"_self":return window;case"_parent":return window.parent;case"_top":return window.top}};class b{constructor(e){this.pjax=e}test(e){let{defaultTrigger:t}=this.pjax.options;if("boolean"==typeof t)return t;let{enable:r,exclude:n}=t;return!(!1===r||n&&e.matches(n))}load(e,t){var r,n;let o={},s=null==(r=t.getAttribute("referrerpolicy"))?void 0:r.toLowerCase();void 0!==s&&(o.referrerPolicy=s),null!=(n=t.getAttribute("rel"))&&n.split(/\s+/).some((e=>"noreferrer"===e.toLowerCase()))&&(o.referrer=""),this.pjax.load(new Request(e,o)).catch((()=>{}))}onLinkOpen(e){if(!e.defaultPrevented){var{target:t}=e;if(t instanceof Element&&(t=t.closest("a[href], area[href]"))&&this.test(t)){if((e instanceof MouseEvent||e instanceof KeyboardEvent)&&(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey))return;y(t.target)===window&&t.origin===window.location.origin&&(e.preventDefault(),this.load(t.href,t))}}}onFormSubmit(e){if(!e.defaultPrevented){var{target:t,submitter:r}=e;if(t instanceof HTMLFormElement&&this.test(t)){var n=new v(t,r);y(n.getAttribute("target"))===window&&(n=n.getRequestInfo())&&new URL("string"==typeof n?n:n.url).origin===window.location.origin&&(e.preventDefault(),this.load(n,t))}}}register(){document.addEventListener("click",(e=>{this.onLinkOpen(e)})),document.addEventListener("keyup",(e=>{"Enter"===e.key&&this.onLinkOpen(e)})),"SubmitEvent"in window&&document.addEventListener("submit",(e=>{this.onFormSubmit(e)}))}}async function E(e,t={}){var r,n;let o,{selectors:s,switches:i,cache:a,timeout:l,hooks:c}={...this.options,...t},u={},d=(null==(r=this.abortController)?void 0:r.signal)||null;u.signal=d,r={cache:a,signal:d},e instanceof Request&&(r.referrer=e.referrer,r.referrerPolicy=e.referrerPolicy),(e=new Request(e,r)).headers.set("X-Requested-With","Fetch"),e.headers.set("X-Pjax","true"),e.headers.set("X-Pjax-Selectors",JSON.stringify(s)),e=await(null==(n=c.request)?void 0:n.call(c,e))||e,u.request=e,u.timeout=l,0<l&&(o=window.setTimeout((()=>{var e;null==(e=this.abortController)||e.abort()}),l),u.timeoutID=o),this.fire("send",u);try{var h,m,p;let r=await fetch(e).finally((()=>{window.clearTimeout(o)})),n=await(null==(h=c.response)?void 0:h.call(c,r))||r;u.response=n,this.fire("receive",u);let a=new URL(n.url);a.hash=new URL(e.url).hash,window.location.href!==a.href&&window.history.pushState(null,"",a.href);let l=(new DOMParser).parseFromString(await n.text(),"text/html"),f=await(null==(m=c.document)?void 0:m.call(c,l))||l;u.switches=i;let w=await async function(e,{selectors:t,switches:r,signal:n=null}){if(null!=n&&n.aborted)throw new DOMException("Aborted switches","AbortError");let o=!1,s=[];return t.forEach((t=>{let n=e.querySelectorAll(t),i=document.querySelectorAll(t);if(n.length!==i.length)throw new DOMException(`Selector '${t}' does not select the same amount of nodes`,"IndexSizeError");let{activeElement:a}=document;i.forEach(((e,i)=>{!o&&a&&e.contains(a)&&((a instanceof HTMLElement||a instanceof SVGElement)&&a.blur(),o=!0);let l=(null==r?void 0:r[t])||g.default,c=Promise.resolve().then((()=>l(e,n[i]))).catch((()=>{}));s.push(c)}))})),await Promise.race([Promise.all(s),new Promise(((e,t)=>{null==n||n.addEventListener("abort",(()=>{t(new DOMException("Aborted switches","AbortError"))}))}))]),{focusCleared:o}}(f,{selectors:s,switches:i,signal:d}),v=await(null==(p=c.switchesResult)?void 0:p.call(c,w))||w;u.switchesResult=v,await this.preparePage(v,t)}catch(e){throw u.error=e,this.fire("error",u),e}finally{this.fire("complete",u)}this.fire("success",u)}let x=/^((application|text)\/(x-)?(ecma|java)script|text\/(javascript1\.[0-5]|(j|live)script))$/;class L{constructor(e){if(this.evaluable=this.blocking=this.external=!1,this.target=e,e.hasAttribute("src")||e.text){var t=e.type?e.type.trim().toLowerCase():"text/javascript";if(x.test(t))this.type="classic";else{if("module"!==t)return;this.type="module"}e.noModule&&"classic"===this.type||(e.src&&(this.external=!0),this.blocking=!0,("classic"!==this.type||this.external&&(e.hasAttribute("async")||e.defer))&&(this.blocking=!1),this.evaluable=!0)}}eval(){return new Promise(((e,t)=>{let r=this.target,n=document.createElement("script");n.addEventListener("error",t),n.async=!1,r.getAttributeNames().forEach((e=>{n.setAttribute(e,r.getAttribute(e)||"")})),n.text=r.text,document.contains(r)?r.replaceWith(n):(document.head.append(n),this.external?n.addEventListener("load",(()=>n.remove())):n.remove()),this.external?n.addEventListener("load",(()=>e())):e()}))}}class S{constructor(e){this.signal=e}async exec(e){var t;if(null!=(t=this.signal)&&t.aborted)throw new DOMException("Execution aborted","AbortError");t=e.eval().catch((()=>{})),e.blocking&&await t}}async function A(e,t={}){if(t={...this.options,...t},e){var r;if(e.focusCleared){let e=document.querySelectorAll("[autofocus]")[0];(e instanceof HTMLElement||e instanceof SVGElement)&&e.focus()}let n=[];t.scripts&&document.querySelectorAll(t.scripts).forEach((e=>{e instanceof HTMLScriptElement&&n.push(e)})),t.selectors.forEach((e=>{document.querySelectorAll(e).forEach((e=>{e instanceof HTMLScriptElement?n.push(e):e.querySelectorAll("script").forEach((e=>{n.includes(e)||n.push(e)}))}))})),n.sort(((e,t)=>e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING||-1)),await async function(e,{signal:t=null}={}){if(null!=t&&t.aborted)throw new DOMException("Aborted execution","AbortError");e=Array.from(e,(e=>new L(e))).filter((e=>e.evaluable));let r=new S(t);e=e.reduce(((e,t)=>t.external?Promise.all([e,r.exec(t)]):e.then((()=>r.exec(t)))),Promise.resolve()),await Promise.race([e,new Promise(((e,r)=>{null==t||t.addEventListener("abort",(()=>{r(new DOMException("Aborted execution","AbortError"))}))}))])}(n,{signal:(null==(r=this.abortController)?void 0:r.signal)||null})}({scrollTo:r}=t),!1!==r&&(e=!!e&&[0,0],Array.isArray(r)?e=r:"number"==typeof r?e=[window.scrollX,r]:(r=(()=>{let e=null;const t=decodeURIComponent(window.location.hash.slice(1));return t&&(e=document.getElementById(t)||document.getElementsByName(t)[0]),e||t&&"top"!==t.toLowerCase()||(e=document.scrollingElement),e})())&&(r.scrollIntoView(),e=!1),e&&window.scrollTo(e[0],e[1]))}async function P(e,t={}){var r;this.storeHistory();let n=new AbortController;null==(r=this.abortController)||r.abort(),this.abortController=n,(r=new URL("string"==typeof e?e:e.url,document.baseURI)).pathname+r.search===this.location.pathname+this.location.search&&r.href.includes("#")?(window.location.hash!==r.hash&&window.history.pushState(null,"",r.href),await this.preparePage(null,t)):await this.switchDOM(e,t),this.history.pull(),this.location.href=window.location.href,this.abortController=null}class T{static reload(){window.location.reload()}constructor(e={}){this.options={defaultTrigger:!0,selectors:["title",".pjax"],switches:{},scripts:"script[data-pjax]",scrollTo:!0,scrollRestoration:!0,cache:"default",timeout:0,hooks:{}},this.history=new f("pjax"),this.location=new URL(window.location.href),this.abortController=null,this.switchDOM=E,this.preparePage=A,this.weakLoad=P,Object.assign(this.options,e),this.options.scrollRestoration&&(window.history.scrollRestoration="manual",window.addEventListener("beforeunload",(()=>{window.history.scrollRestoration="auto"}))),({defaultTrigger:e}=this.options),(!0===e||!1!==e&&!1!==e.enable)&&new b(this).register(),window.addEventListener("popstate",(e=>{this.storeHistory(),this.history.pull(),null!==e.state&&(e={},this.options.scrollRestoration&&this.history.state&&(e.scrollTo=this.history.state.scrollPos),this.load(window.location.href,e).catch((()=>{})))}))}storeHistory(){this.history.state={scrollPos:[window.scrollX,window.scrollY]}}fire(e,t){e=new CustomEvent(`pjax:${e}`,{bubbles:!0,cancelable:!1,detail:{abortController:this.abortController,...t}}),document.dispatchEvent(e)}async load(e,t={}){try{await this.weakLoad(e,t)}catch(t){if(t instanceof DOMException&&"AbortError"===t.name)throw t;window.location.assign("string"==typeof e?e:e.url)}}}T.switches=g;const k=T;var C=r(5565),R=r(8794);function j(){new k({selectors:["#page","title",".footer-content","#app-js-before","#entry-content-css"],scripts:"#app-js-before",timeout:5e3,defaultTrigger:{exclude:"a[data-no-pjax]"}}),document.addEventListener("pjax:send",(()=>{for(const e of document.getElementsByClassName("normal-cover-video"))e.pause(),e.src="",e.load="";document.getElementById("bar").style.width="0%",_iro.NProgressON&&p().start()})),document.addEventListener("pjax:complete",(()=>{(0,l.of)(),(0,l.PE)(),(0,l.CE)(),_iro.land_at_home?((0,d.UE)(),(0,C.A)()):(0,C.o)(),_iro.NProgressON&&p().done(),(0,a.S)();let e=document.getElementsByTagName("p");for(let t=0;t<e.length;t++)e[t].classList.remove("head-copyright");let t=document.getElementsByTagName("div"),r=document.getElementById("to-load-aplayer");r&&r.addEventListener("click",(()=>{for(let e=0;e<t.length;e++)t[e].classList.remove("load-aplayer")}));let o=document.getElementsByClassName("iconflat");0!=o.length&&(o[0].style.width="50px",o[0].style.height="50px"),(0,l.Zi)(),(0,l.sX)(),(0,i.A)(),(0,d.X3)(),(0,u.Br)(),(0,l.sA)(),(0,l.oo)();let s=document.getElementById("loading");s&&(s.classList.add("hide"),s.classList.remove("show")),document.querySelector(".js-search.is-visible")&&(document.getElementsByClassName("js-toggle-search")[0].classList.toggle("is-active"),document.getElementsByClassName("js-search")[0].classList.toggle("is-visible"),document.documentElement.style.overflowY="unset"),(0,c.A)(),(0,R.A)(),(0,n.A)(),(0,h.uv)()})),document.addEventListener("pjax:success",(()=>{if(!_iro.land_at_home&&!document.getElementById("app-page-js")){const e=document.getElementById("app-js"),t=document.createElement("script");t.src=e.src.replace("/app.js","/page.js"),t.id="app-page-js",document.body.appendChild(t)}window.gtag&&gtag("config",_iro.google_analytics_id,{page_path:window.location.pathname}),window._hmt&&_hmt.push(["_trackPageview",pageURL])})),document.addEventListener("pjax:error",(({detail:e})=>{const{status:t}=e.request;if(t)(0,o.I)((0,s._$)("页面加载出错了 HTTP {0}",t));else if(/aborterror/i.exec(e.error)){const{url:t}=e.request;if(t)return void(location=t)}console.warn("pjax:error",e)})),window.addEventListener("popstate",(e=>{(0,l.of)(),(0,c.A)(),(0,l.PE)(),(0,l.CE)(),(0,l.sX)(!0),(0,d.X3)(),(0,h.uv)()}),!1)}},8744:function(e,t,r){var n,o;n=function(){var e,t,r={version:"0.2.0"},n=r.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};function o(e,t,r){return e<t?t:e>r?r:e}function s(e){return 100*(-1+e)}function i(e,t,r){var o;return(o="translate3d"===n.positionUsing?{transform:"translate3d("+s(e)+"%,0,0)"}:"translate"===n.positionUsing?{transform:"translate("+s(e)+"%,0)"}:{"margin-left":s(e)+"%"}).transition="all "+t+"ms "+r,o}r.configure=function(e){var t,r;for(t in e)void 0!==(r=e[t])&&e.hasOwnProperty(t)&&(n[t]=r);return this},r.status=null,r.set=function(e){var t=r.isStarted();e=o(e,n.minimum,1),r.status=1===e?null:e;var s=r.render(!t),c=s.querySelector(n.barSelector),u=n.speed,d=n.easing;return s.offsetWidth,a((function(t){""===n.positionUsing&&(n.positionUsing=r.getPositioningCSS()),l(c,i(e,u,d)),1===e?(l(s,{transition:"none",opacity:1}),s.offsetWidth,setTimeout((function(){l(s,{transition:"all "+u+"ms linear",opacity:0}),setTimeout((function(){r.remove(),t()}),u)}),u)):setTimeout(t,u)})),this},r.isStarted=function(){return"number"==typeof r.status},r.start=function(){r.status||r.set(0);var e=function(){setTimeout((function(){r.status&&(r.trickle(),e())}),n.trickleSpeed)};return n.trickle&&e(),this},r.done=function(e){return e||r.status?r.inc(.3+.5*Math.random()).set(1):this},r.inc=function(e){var t=r.status;return t?("number"!=typeof e&&(e=(1-t)*o(Math.random()*t,.1,.95)),t=o(t+e,0,.994),r.set(t)):r.start()},r.trickle=function(){return r.inc(Math.random()*n.trickleRate)},e=0,t=0,r.promise=function(n){return n&&"resolved"!==n.state()?(0===t&&r.start(),e++,t++,n.always((function(){0==--t?(e=0,r.done()):r.set((e-t)/e)})),this):this},r.render=function(e){if(r.isRendered())return document.getElementById("nprogress");u(document.documentElement,"nprogress-busy");var t=document.createElement("div");t.id="nprogress",t.innerHTML=n.template;var o,i=t.querySelector(n.barSelector),a=e?"-100":s(r.status||0),c=document.querySelector(n.parent);return l(i,{transition:"all 0 linear",transform:"translate3d("+a+"%,0,0)"}),n.showSpinner||(o=t.querySelector(n.spinnerSelector))&&m(o),c!=document.body&&u(c,"nprogress-custom-parent"),c.appendChild(t),t},r.remove=function(){d(document.documentElement,"nprogress-busy"),d(document.querySelector(n.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&m(e)},r.isRendered=function(){return!!document.getElementById("nprogress")},r.getPositioningCSS=function(){var e=document.body.style,t="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return t+"Perspective"in e?"translate3d":t+"Transform"in e?"translate":"margin"};var a=function(){var e=[];function t(){var r=e.shift();r&&r(t)}return function(r){e.push(r),1==e.length&&t()}}(),l=function(){var e=["Webkit","O","Moz","ms"],t={};function r(e){return e.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,(function(e,t){return t.toUpperCase()}))}function n(t){var r=document.body.style;if(t in r)return t;for(var n,o=e.length,s=t.charAt(0).toUpperCase()+t.slice(1);o--;)if((n=e[o]+s)in r)return n;return t}function o(e){return e=r(e),t[e]||(t[e]=n(e))}function s(e,t,r){t=o(t),e.style[t]=r}return function(e,t){var r,n,o=arguments;if(2==o.length)for(r in t)void 0!==(n=t[r])&&t.hasOwnProperty(r)&&s(e,r,n);else s(e,o[1],o[2])}}();function c(e,t){return("string"==typeof e?e:h(e)).indexOf(" "+t+" ")>=0}function u(e,t){var r=h(e),n=r+t;c(r,t)||(e.className=n.substring(1))}function d(e,t){var r,n=h(e);c(e,t)&&(r=n.replace(" "+t+" "," "),e.className=r.substring(1,r.length-1))}function h(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function m(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return r},void 0===(o="function"==typeof n?n.call(t,r,t,e):n)||(e.exports=o)}}]);
//# sourceMappingURL=900.js.map