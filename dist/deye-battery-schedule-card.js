/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const PROGRAM_COUNT = 6;
function normalizeTime(value) {
    if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value))
        return undefined;
    return value.length === 5 ? `${value}:00` : value;
}
function displayTime(value) {
    return value ? (value.endsWith(':00') ? value.slice(0, 5) : value) : '—';
}
function numberValue(value) {
    if (typeof value !== 'string' || value.trim() === '')
        return undefined;
    const result = Number(value);
    return Number.isFinite(result) ? result : undefined;
}
function socLimits(entity) {
    if (!entity)
        return undefined;
    const { min = 0, max = 100, step = 1, unit_of_measurement: unit } = entity.attributes;
    if (![min, max, step].every(Number.isFinite) || step <= 0 || min > max || (unit && unit !== '%'))
        return undefined;
    // Keep native input constraints aligned with the entity's step anchor.
    const low = Number((min + Math.ceil((Math.max(0, min) - min) / step - 1e-8) * step).toFixed(8)), high = Number((min + Math.floor((Math.min(100, max) - min) / step + 1e-8) * step).toFixed(8));
    if (low > high)
        return undefined;
    return { min: low, max: high, step, anchor: min };
}
function validSoc(value, limits) {
    const steps = (value - limits.anchor) / limits.step;
    return (Number.isFinite(value) && value >= limits.min && value <= limits.max && Math.abs(steps - Math.round(steps)) < 1e-6);
}
function stepSoc(value, direction, limits) {
    const steps = (value - limits.anchor) / limits.step;
    const next = direction > 0 ? Math.floor(steps + 1e-6) + 1 : Math.ceil(steps - 1e-6) - 1;
    const target = Number((limits.anchor + next * limits.step).toFixed(8));
    return target >= limits.min && target <= limits.max ? target : value;
}
function validateConfig(config) {
    if (!config || !Array.isArray(config.programs) || config.programs.length !== PROGRAM_COUNT)
        throw new Error('Потрібно налаштувати рівно 6 програм.');
    if (config.title !== undefined && typeof config.title !== 'string')
        throw new Error('Назва має бути рядком.');
    const ids = new Set();
    for (const program of config.programs) {
        if (!program || typeof program.time !== 'string' || typeof program.soc !== 'string')
            throw new Error('Кожна програма потребує полів time і soc.');
        for (const id of [program.time, program.soc]) {
            if (id && ids.has(id))
                throw new Error('Сутності програм не повинні повторюватися.');
            if (id)
                ids.add(id);
        }
    }
    return { ...config, programs: config.programs.map((program) => ({ ...program })) };
}
function entityIssue(hass, id, domain) {
    if (!id)
        return 'Виберіть сутність';
    if (!new RegExp(`^${domain}\\.[a-z0-9_]+$`).test(id))
        return 'Неправильний тип сутності';
    if (!hass)
        return 'Очікування Home Assistant';
    const entity = hass.states[id];
    if (!entity)
        return 'Сутність не знайдено';
    if (entity.state === 'unavailable' || entity.state === 'unknown')
        return 'Немає зв’язку';
    return '';
}
function programViews(programs, hass) {
    return programs.map((program, index) => {
        const start = normalizeTime(hass?.states[program.time]?.state);
        const next = programs[(index + 1) % programs.length];
        const end = /^time\./.test(next.time) ? normalizeTime(hass?.states[next.time]?.state) : undefined;
        const soc = numberValue(hass?.states[program.soc]?.state);
        const limits = socLimits(hass?.states[program.soc]);
        const issue = entityIssue(hass, program.time, 'time') ||
            entityIssue(hass, program.soc, 'number') ||
            (!start
                ? 'Некоректний час'
                : soc === undefined || soc < 0 || soc > 100 || !limits
                    ? 'Некоректний рівень заряду'
                    : '');
        return {
            start,
            end,
            soc,
            limits,
            issue,
            endMissing: !end,
            nextDay: index === programs.length - 1 || !!(start && end && end < start),
        };
    });
}

const CONFIRMATION_TIMEOUT = 15000;
// Commands are scoped by program. Object identity protects against stale service callbacks.
class Commands {
    constructor(changed) {
        this.changed = changed;
        this.pending = new Map();
        this.errors = new Map();
    }
    send(row, field, entity, target, hass) {
        if (this.pending.has(row))
            return;
        this.errors.delete(row);
        const command = { field, entity, target };
        this.pending.set(row, command);
        command.timer = setTimeout(() => this.finish(row, command, 'Немає підтвердження. Спробуйте ще раз.'), CONFIRMATION_TIMEOUT);
        this.changed();
        try {
            const promise = hass.callService(field === 'time' ? 'time' : 'number', 'set_value', field === 'time' ? { entity_id: entity, time: String(target) } : { entity_id: entity, value: Number(target) });
            void promise.catch(() => this.finish(row, command, 'Не вдалося зберегти. Спробуйте ще раз.'));
        }
        catch {
            this.finish(row, command, 'Не вдалося зберегти. Спробуйте ще раз.');
        }
    }
    reconcile(hass) {
        for (const [row, command] of this.pending) {
            const state = hass?.states[command.entity]?.state;
            const actual = command.field === 'time' ? normalizeTime(state) : numberValue(state);
            if (actual === undefined)
                this.finish(row, command, 'Немає зв’язку. Зміну не підтверджено.');
            else if (typeof actual === 'number' && typeof command.target === 'number'
                ? Math.abs(actual - command.target) < 1e-7
                : actual === command.target)
                this.finish(row, command);
        }
    }
    finish(row, command, error) {
        if (this.pending.get(row) !== command)
            return;
        clearTimeout(command.timer);
        this.pending.delete(row);
        if (error)
            this.errors.set(row, error);
        this.changed();
    }
    clear() {
        for (const command of this.pending.values())
            clearTimeout(command.timer);
        this.pending.clear();
        this.errors.clear();
    }
}

let DeyeBatteryScheduleCardEditor = class DeyeBatteryScheduleCardEditor extends i {
    setConfig(config) {
        this.config = {
            ...config,
            programs: Array.from({ length: 6 }, (_, index) => ({
                time: config.programs?.[index]?.time ?? '',
                soc: config.programs?.[index]?.soc ?? '',
            })),
        };
    }
    changed() {
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config }, bubbles: true, composed: true }));
    }
    titleChanged(event) {
        if (!this.config)
            return;
        const title = event.target.value;
        this.config = { ...this.config, title };
        if (!title)
            delete this.config.title;
        this.changed();
    }
    entityChanged(row, field, event) {
        if (!this.config)
            return;
        const value = event.target.value;
        this.config = {
            ...this.config,
            programs: this.config.programs.map((program, index) => index === row ? { ...program, [field]: value } : program),
        };
        this.changed();
    }
    select(row, field) {
        const value = this.config?.programs[row][field] ?? '';
        const domain = field === 'time' ? 'time' : 'number';
        const ids = Object.keys(this.hass?.states ?? {})
            .filter((id) => id.startsWith(`${domain}.`))
            .sort();
        return b `<label
      >${field === 'time' ? 'Час початку' : 'Рівень заряду (SOC)'}<select
        data-row=${row}
        data-field=${field}
        .value=${value}
        @change=${(event) => this.entityChanged(row, field, event)}
      >
        <option value="">Виберіть сутність</option>
        ${value && !ids.includes(value) ? b `<option value=${value} selected>${value} — недоступна</option>` : ''}
        ${ids.map((id) => b `<option value=${id} ?selected=${id === value}>${this.hass?.states[id]?.attributes.friendly_name || id} (${id})</option>`)}
      </select></label
    >`;
    }
    render() {
        if (!this.config)
            return b ``;
        return b `<label
        >Назва (необов’язково)<input
          placeholder="Розклад батареї"
          .value=${this.config.title ?? ''}
          @input=${this.titleChanged}
      /></label>
      <p>Виберіть час і заряд для кожної програми в порядку інвертора.</p>
      ${this.config.programs.map((_, row) => b `<fieldset>
            <legend>Програма ${row + 1}</legend>
            ${this.select(row, 'time')}${this.select(row, 'soc')}
          </fieldset>`)}`;
    }
    static { this.styles = i$3 `
    :host {
      display: block;
      /* Hide browsing carets outside editable controls. */
      caret-color: transparent;
      color: var(--primary-text-color, #273536);
      font-family: var(--ha-font-family, system-ui, sans-serif);
    }
    label {
      display: block;
      font-size: 13px;
      min-width: 0;
    }
    p {
      color: var(--secondary-text-color, #667b76);
      font-size: 13px;
      line-height: 1.5;
    }
    input,
    select {
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      display: block;
      margin-top: 6px;
      padding: 10px;
      border: 1px solid var(--divider-color, #d7e3df);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: inherit;
      font: inherit;
      min-height: 44px;
    }
    input {
      caret-color: auto;
    }
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color, #467c70);
      outline-offset: 2px;
    }
    fieldset {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px;
      margin: 16px 0;
      padding: 12px;
      border: 1px solid var(--divider-color, #d7e3df);
      border-radius: 10px;
      min-width: 0;
    }
    legend {
      padding: 0 6px;
      font-size: 13px;
    }
    @media (max-width: 500px) {
      fieldset {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `; }
};
__decorate([
    n({ attribute: false })
], DeyeBatteryScheduleCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], DeyeBatteryScheduleCardEditor.prototype, "config", void 0);
DeyeBatteryScheduleCardEditor = __decorate([
    t('deye-battery-schedule-card-editor')
], DeyeBatteryScheduleCardEditor);

let DeyeBatteryScheduleCard = class DeyeBatteryScheduleCard extends i {
    constructor() {
        super(...arguments);
        this.commands = new Commands(() => this.requestUpdate());
    }
    setConfig(config) {
        const validated = validateConfig(config);
        this.commands.clear();
        this.closeEditor(false);
        this.config = validated;
    }
    static getConfigElement() {
        return document.createElement('deye-battery-schedule-card-editor');
    }
    static getStubConfig() {
        // Pairing entities by name could silently target the wrong inverter.
        return {
            type: 'custom:deye-battery-schedule-card',
            programs: Array.from({ length: 6 }, () => ({ time: '', soc: '' })),
        };
    }
    getCardSize() {
        return 7;
    }
    getGridOptions() {
        return { columns: 'full', rows: 'auto', min_columns: 6 };
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.commands.clear();
        this.closeEditor(false);
    }
    connectedCallback() {
        super.connectedCallback();
        this.requestUpdate();
    }
    willUpdate(changed) {
        if (changed.has('hass'))
            this.commands.reconcile(this.hass);
    }
    get views() {
        return programViews(this.config?.programs ?? [], this.hass);
    }
    async openEditor(row, field, event) {
        const view = this.views[row];
        if (!view || view.issue || this.commands.pending.has(row) || !this.isConnected)
            return;
        const original = field === 'time' ? view.start : view.soc;
        if (original === undefined)
            return;
        this.returnFocus = event.currentTarget;
        this.draft = { row, field, original, value: String(original), error: '' };
        await this.updateComplete;
        const dialog = this.renderRoot?.querySelector('dialog');
        if (!this.draft || !this.isConnected || !dialog)
            return;
        if (!dialog.open)
            dialog.showModal();
        this.renderRoot.querySelector('#value')?.focus();
    }
    closeEditor(restore = true) {
        this.draft = undefined;
        const dialog = this.renderRoot?.querySelector('dialog');
        if (dialog?.open)
            dialog.close();
        if (restore && this.isConnected)
            this.returnFocus?.focus({ preventScroll: true });
        this.returnFocus = undefined;
    }
    changeDraft(event) {
        if (this.draft)
            this.draft = { ...this.draft, value: event.target.value, error: '' };
    }
    step(direction) {
        if (!this.draft)
            return;
        const limits = this.views[this.draft.row]?.limits;
        const current = numberValue(this.draft.value);
        if (limits && current !== undefined)
            this.draft = { ...this.draft, value: String(stepSoc(current, direction, limits)), error: '' };
    }
    save(event) {
        event.preventDefault();
        const draft = this.draft;
        if (!draft || !this.config || !this.hass || !this.isConnected || this.commands.pending.has(draft.row))
            return;
        const view = this.views[draft.row];
        const error = (message) => {
            this.draft = { ...draft, error: message };
        };
        if (view.issue) {
            error(view.issue);
            return;
        }
        const actual = draft.field === 'time' ? view.start : view.soc;
        if (actual !== draft.original) {
            error('Значення вже змінилося. Закрийте й відкрийте редактор знову.');
            return;
        }
        const target = draft.field === 'time' ? normalizeTime(draft.value) : numberValue(draft.value);
        if (target === undefined || (typeof target === 'number' && (!view.limits || !validSoc(target, view.limits)))) {
            error(draft.field === 'time' ? 'Вкажіть коректний час.' : 'Вкажіть заряд у межах і з кроком цієї сутності.');
            return;
        }
        this.closeEditor();
        if (target === actual)
            return;
        this.commands.send(draft.row, draft.field, this.config.programs[draft.row][draft.field], target, this.hass);
    }
    dialogClick(event) {
        if (event.target !== event.currentTarget)
            return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom)
            this.closeEditor();
    }
    dialogKeyDown(event) {
        if (event.key !== 'Tab')
            return;
        const dialog = event.currentTarget;
        const controls = [...dialog.querySelectorAll('button, input')].filter((control) => !control.disabled && control.tabIndex >= 0);
        const first = controls[0];
        const last = controls.at(-1);
        const active = this.shadowRoot?.activeElement;
        if (event.shiftKey && active === first) {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first?.focus();
        }
    }
    renderEditor() {
        const draft = this.draft;
        const limits = draft ? this.views[draft.row]?.limits : undefined;
        const soc = draft?.field === 'soc';
        return b `<dialog
      aria-labelledby="dialog-title"
      @cancel=${(event) => {
            event.preventDefault();
            this.closeEditor();
        }}
      @close=${() => this.closeEditor()}
      @click=${this.dialogClick}
      @keydown=${this.dialogKeyDown}
    >
      ${draft
            ? b `<form novalidate @submit=${this.save}>
              <div class="dialog-heading">
                <h3 id="dialog-title">${soc ? 'Рівень заряду' : 'Початок програми'}</h3>
                <button type="button" class="close" aria-label="Закрити" @click=${() => this.closeEditor()}>×</button>
              </div>
              <p class="dialog-subtitle">Програма ${draft.row + 1}</p>
              <label class="sr-only" for="value">${soc ? 'Заряд, %' : 'Час початку'}</label>
              ${soc
                ? b `<div class="stepper">
                        <button
                          type="button"
                          aria-label="Зменшити заряд"
                          ?disabled=${!!limits && stepSoc(Number(draft.value), -1, limits) === Number(draft.value)}
                          @click=${() => this.step(-1)}
                        >
                          −
                        </button>
                        <div class="number-wrap">
                          <input
                            id="value"
                            type="number"
                            inputmode="decimal"
                            required
                            .value=${draft.value}
                            min=${limits?.min ?? 0}
                            max=${limits?.max ?? 100}
                            step=${limits?.step ?? 1}
                            @input=${this.changeDraft}
                          /><span aria-hidden="true">%</span>
                        </div>
                        <button
                          type="button"
                          aria-label="Збільшити заряд"
                          ?disabled=${!!limits && stepSoc(Number(draft.value), 1, limits) === Number(draft.value)}
                          @click=${() => this.step(1)}
                        >
                          +
                        </button>
                      </div>
                      <p class="limits">${limits?.min}–${limits?.max}% · крок ${limits?.step}%</p>`
                : b `<input
                        id="value"
                        class="time-input"
                        type="time"
                        required
                        step=${draft.original.toString().endsWith(':00') ? '60' : '1'}
                        .value=${draft.value}
                        @input=${this.changeDraft}
                      />
                      <p class="limits">Змінює також кінець попереднього інтервалу.</p>`}
              <p class="dialog-error" role="alert">${draft.error}</p>
              <div class="actions">
                <button type="button" @click=${() => this.closeEditor()}>Скасувати</button
                ><button class="save" type="submit">Зберегти</button>
              </div>
            </form>`
            : ''}
    </dialog>`;
    }
    render() {
        if (!this.config)
            return b ``;
        const views = this.views;
        const errorEntry = [...this.commands.errors.entries()].at(-1);
        const pendingRow = this.commands.pending.keys().next().value;
        const unavailableRow = views.findIndex((view) => !!view.issue);
        const footer = errorEntry
            ? `Програма ${errorEntry[0] + 1}: ${errorEntry[1]}`
            : pendingRow !== undefined
                ? `Програма ${pendingRow + 1}: очікуємо підтвердження…`
                : unavailableRow >= 0
                    ? `Програма ${unavailableRow + 1}: ${views[unavailableRow].issue}`
                    : 'Натисніть на час або заряд';
        return b `<ha-card
        ><div class="content">
          <header>
            <ha-icon icon="mdi:battery-clock" aria-hidden="true"></ha-icon>
            <h2>${this.config.title || 'Розклад батареї'}</h2>
          </header>
          <ol aria-label="Програми батареї">
            ${views.map((view, row) => {
            const pending = this.commands.pending.has(row);
            const error = this.commands.errors.get(row);
            return b `<li class=${view.issue ? 'unavailable' : ''} aria-busy=${String(pending)}>
                <span class="row-icon" aria-hidden="true"
                  >${pending ? b `<span class="spinner"></span>` : b `<ha-icon icon=${error ? 'mdi:alert-circle-outline' : 'mdi:clock-outline'}></ha-icon>`}</span
                >
                <button
                  class="interval"
                  aria-label=${`Програма ${row + 1}: ${displayTime(view.start)} — ${displayTime(view.end)}${view.nextDay ? ', наступного дня' : ''}. Змінити час початку.`}
                  aria-describedby=${`row-info-${row}`}
                  aria-disabled=${String(pending || !!view.issue)}
                  ?disabled=${!!view.issue}
                  @click=${(event) => this.openEditor(row, 'time', event)}
                >
                  <span>${displayTime(view.start)}</span><span class="dash">—</span
                  ><span class="end">${displayTime(view.end)}</span>
                </button>
                <button
                  class="soc"
                  aria-label=${`Програма ${row + 1}: заряд ${view.soc ?? 'невідомий'}%. Змінити заряд.`}
                  aria-describedby=${`row-info-${row}`}
                  aria-disabled=${String(pending || !!view.issue)}
                  ?disabled=${!!view.issue}
                  @click=${(event) => this.openEditor(row, 'soc', event)}
                >
                  ${view.issue ? b `<span class="unavailable-label">Недоступно</span>` : b `${view.soc}<span class="unit">%</span>`}
                </button>
                <span id=${`row-info-${row}`} class="sr-only"
                  >${view.issue || error || (pending ? 'Очікуємо підтвердження' : view.endMissing ? 'Час наступної програми недоступний' : `Програма ${row + 1}`)}</span
                >
              </li>`;
        })}
          </ol>
          <p class="feedback ${errorEntry ? 'error' : ''}" role=${errorEntry ? 'alert' : 'status'} aria-live="polite">
            ${footer}
          </p>
        </div></ha-card
      >${this.renderEditor()}`;
    }
    static { this.styles = i$3 `
    :host {
      display: block;
      min-width: 0;
      height: 100%;
      /* Hide browsing carets outside editable controls. */
      caret-color: transparent;
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      height: 100%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #273536);
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #dde5e3));
      border-radius: var(--ha-card-border-radius, 16px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .content {
      max-width: 460px;
      margin: 0 auto;
      padding: 18px 16px 10px;
      font-family: var(--ha-font-family, system-ui, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 32px;
      margin: 0 4px 10px;
    }
    header ha-icon {
      color: var(--primary-color, #467c70);
      --mdc-icon-size: 22px;
      flex-shrink: 0;
    }
    h2 {
      margin: 0;
      font-size: 17px;
      line-height: 24px;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    ol {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    li {
      display: grid;
      grid-template-columns: 20px minmax(0, 1fr) auto;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      border-bottom: 1px solid var(--divider-color, #e5ebe9);
    }
    li:last-child {
      border-bottom: 0;
    }
    .row-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color, #7a8b88);
    }
    .row-icon ha-icon {
      --mdc-icon-size: 16px;
    }
    button,
    input {
      font: inherit;
      color: inherit;
    }
    button {
      cursor: pointer;
      border: 0;
      border-radius: 8px;
      background: transparent;
      min-height: 44px;
      padding: 8px;
      touch-action: manipulation;
      transition: background 0.12s;
    }
    button:hover {
      background: var(--secondary-background-color, #f1f5f3);
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color, #467c70);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: default;
    }
    button[aria-disabled='true'] {
      cursor: default;
    }
    .interval {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      white-space: nowrap;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      padding-inline: 6px;
    }
    .dash,
    .end {
      color: var(--secondary-text-color, #667b76);
    }
    .soc {
      min-width: 66px;
      text-align: right;
      font-size: 16px;
      font-weight: 550;
      font-variant-numeric: tabular-nums;
    }
    .unit {
      margin-left: 4px;
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color, #667b76);
    }
    .unavailable .interval,
    .unavailable .row-icon {
      opacity: 0.5;
    }
    .unavailable-label {
      font-size: 11px;
      font-weight: 400;
      color: var(--secondary-text-color, #667b76);
    }
    .feedback {
      height: 34px;
      overflow: auto;
      margin: 8px 4px 0;
      font-size: 11px;
      line-height: 16px;
      color: var(--secondary-text-color, #667b76);
    }
    .error,
    .dialog-error {
      color: var(--error-color, #ba4444);
    }
    .spinner {
      width: 13px;
      height: 13px;
      border: 1.5px solid var(--divider-color, #d7e3df);
      border-top-color: var(--primary-color, #467c70);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    dialog {
      width: 320px;
      max-width: calc(100vw - 32px);
      max-height: calc(100dvh - 32px);
      overflow: auto;
      border: 1px solid var(--divider-color, #dde5e3);
      border-radius: 18px;
      padding: 20px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #273536);
      font-family: var(--ha-font-family, system-ui, sans-serif);
      box-shadow: 0 12px 40px #0002;
    }
    dialog::backdrop {
      background: #0006;
    }
    .dialog-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    h3 {
      font-size: 17px;
      font-weight: 500;
      margin: 0;
    }
    .close {
      font-size: 24px;
      width: 44px;
      margin: -10px -10px -10px 0;
    }
    .dialog-subtitle,
    .limits {
      font-size: 12px;
      line-height: 18px;
      color: var(--secondary-text-color, #667b76);
    }
    .dialog-subtitle {
      margin: 6px 0 20px;
    }
    input {
      min-width: 0;
      caret-color: auto;
      border: 1px solid var(--divider-color, #d9e3df);
      background: var(--secondary-background-color, #f3f6f5);
      border-radius: 8px;
      padding: 10px;
      min-height: 44px;
    }
    .time-input {
      width: 100%;
      font-size: 22px;
      text-align: center;
      color-scheme: var(--deye-color-scheme, normal);
    }
    .time-input::-webkit-calendar-picker-indicator {
      caret-color: transparent;
      cursor: pointer;
      user-select: none;
    }
    .stepper {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) 44px;
      gap: 12px;
      align-items: center;
    }
    .stepper > button {
      font-size: 26px;
      background: var(--secondary-background-color, #f3f6f5);
    }
    .stepper > button:disabled {
      opacity: 0.35;
    }
    .number-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 22px;
    }
    .number-wrap input {
      width: 100%;
      text-align: center;
      padding: 8px 2px;
      appearance: textfield;
      -moz-appearance: textfield;
    }
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    .limits {
      margin: 10px 0 0;
    }
    .dialog-error {
      min-height: 36px;
      font-size: 12px;
      line-height: 18px;
      margin: 10px 0;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .save {
      background: var(--primary-color, #467c70);
      color: var(--text-primary-color, #fff);
      padding-inline: 16px;
    }
    .save:hover {
      filter: brightness(0.94);
      background: var(--primary-color, #467c70);
    }
    @media (max-width: 360px) {
      .content {
        padding-inline: 10px;
      }
      .interval {
        gap: 4px;
        font-size: 13px;
      }
      .soc {
        min-width: 55px;
        padding-inline: 5px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `; }
};
__decorate([
    n({ attribute: false })
], DeyeBatteryScheduleCard.prototype, "hass", void 0);
__decorate([
    r()
], DeyeBatteryScheduleCard.prototype, "config", void 0);
__decorate([
    r()
], DeyeBatteryScheduleCard.prototype, "draft", void 0);
DeyeBatteryScheduleCard = __decorate([
    t('deye-battery-schedule-card')
], DeyeBatteryScheduleCard);
window.customCards ??= [];
window.customCards.push({
    type: 'deye-battery-schedule-card',
    name: 'Розклад батареї Deye',
    description: 'Шість програм: час і рівень заряду батареї',
    preview: true,
    documentationURL: 'https://github.com/Zoreslaw/deye-battery-schedule-card',
});

export { DeyeBatteryScheduleCard };
