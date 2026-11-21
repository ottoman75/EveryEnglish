#!/usr/bin/env node
/*
 * index.html의 로컬 스크립트·스타일 주소에 ?v=<시각>을 붙여 브라우저 캐시를 무효화한다.
 * 배포 전에 실행 (npm run stamp). 안 하면 폰이 옛 JS를 계속 쓸 수 있다(GitHub Pages 캐시 10분 + 브라우저 휴리스틱 캐시).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "index.html");
const v = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
const html = fs.readFileSync(file, "utf8")
    .replace(/((?:src|href)="(?:js|css|assets)\/[^"?]+\.(?:js|css))(?:\?v=\w+)?"/g, `$1?v=${v}"`);
fs.writeFileSync(file, html);
console.log("stamped v=" + v + " · " + (html.match(/\?v=/g) || []).length + " files");
