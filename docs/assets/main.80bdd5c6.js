import{p as e,c as t,L as n,h as o}from"./vendor.a33a6d70.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var r=Object.defineProperty,i=Object.getOwnPropertyDescriptor,l=(e,t,n,o)=>{for(var l,s=o>1?void 0:o?i(t,n):t,a=e.length-1;a>=0;a--)(l=e[a])&&(s=(o?l(t,n,s):l(s))||s);return o&&s&&r(t,n,s),s};class s extends CustomEvent{}let a=class extends n{constructor(){super(),console.log(this.firstElementChild),this.addEventListener("layoutchange",(e=>{var t;null==(t=this._onlayoutchange)||t.call(this,e)})),this.bindScrollEvent()}render(){return o`<slot></slot>`}get onlayoutchange(){return this._onlayoutchange||null}set onlayoutchange(e){"string"==typeof e&&(e=Function("event",`(${e})&&event.preventDefault()`)),"function"!=typeof e&&(e=void 0),this._onlayoutchange=e}bindScrollEvent(){const e=this.querySelector("[name='scroll-container']");if(!e)throw new Error("Please set the attribute name='scroll-container' in you scroll template");e.addEventListener("scroll",(e=>{const t=e.target;if(t){const e=t.getBoundingClientRect(),n={x:e.x,y:e.y},o={x:e.x+e.width,y:e.y+e.height},r=t.childElementCount,i=t.children;for(let t=0;t<r;t++){const e=i[t],r=e.getBoundingClientRect(),l={x:r.x,y:r.y},s={x:r.x+r.width,y:r.y+r.height};if(n.x<=l.x&&n.y<=l.y&&o.x>=s.x&&o.y>=s.y){this._emitLayoutChange({index:t,target:e});break}}}}))}_emitLayoutChange(e){this._layoutChangeEvent=new s("layoutchange",{detail:e,cancelable:!0,bubbles:!1,composed:!0}),this.dispatchEvent(this._layoutChangeEvent)}};l([e({attribute:"onlayoutchange"})],a.prototype,"onlayoutchange",1),a=l([t("scroll-snap")],a);