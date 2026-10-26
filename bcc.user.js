// ==UserScript==
// @name Bondage Club Chaos
// @namespace https://www.bondageprojects.com/
// @version 2.0.1
// @description Cheat addon with quality of life features, own activities and magical mechanics
// @author Zoi
// @include /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include /^https:\/\/(www\.)?bondageeurope\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include /^https:\/\/(www\.)?bondage-asia\.com\/club\/R\d+(\/((index|\d+)\.html)?)?$/
// @run-at document-end
// @grant none
// ==/UserScript==

setTimeout(function(){let n=document.createElement("script");n.setAttribute("language","JavaScript");n.setAttribute("crossorigin","anonymous");n.setAttribute("src","https://furryzoi.github.io/Bondage-Club-Chaos/bundle.js");n.onload=()=>n.remove();document.head.appendChild(n);}, 1000);