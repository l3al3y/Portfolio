// ==UserScript==
// @name         IrfanLLM Manga Controller
// @namespace    https://irfanfahmi.com/
// @version      1.0
// @description  Touchless AI gesture scrolling for DemonicScans, Asura, and Webtoons using your front camera.
// @author       Muhammad Irfan Fahmi
// @match        *://*.demonicscans.org/*
// @match        *://demonicscans.org/*
// @match        *://*.asuracomics.com/*
// @match        *://*.mangadex.org/*
// @match        *://*.flamecomics.xyz/*
// @match        *://*.reaperscans.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const s = document.createElement('script');
    s.src = 'https://irfanfahmi.com/manga.js';
    document.head.appendChild(s);
})();
