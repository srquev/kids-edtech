import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const svg = await readFile("public/assets/illustrations/logo.svg", "utf8");
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, size, maskable] of [
  ["icon-192", 192, false],
  ["icon-512", 512, false],
  ["maskable-512", 512, true],
]) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<style>html,body{margin:0;width:100%;height:100%;background:#fcfaf6}body{display:grid;place-items:center}svg{width:${maskable ? "76%" : "100%"};height:${maskable ? "76%" : "100%"}}</style>${svg}`,
  );
  await page.screenshot({ path: `public/assets/icons/${name}.png` });
  await page.close();
}
await browser.close();
