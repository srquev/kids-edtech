# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> responsive layouts, keyboard access and accessibility
- Location: e2e/journey.spec.ts:19:5

# Error details

```
Error: /: [{"id":"color-contrast","nodes":[[".topbar-note"],[".home-greeting > div > .eyebrow"],[".home-greeting > div > p"],[".hero-pill"],[".hero-copy > p"],[".button[routerlink=\"/learn\"][href$=\"learn\"]"],[".hero-note"],[".section-title > div > p"],[".text-link[routerlink=\"/learn\"][href$=\"learn\"]"],[".lavender > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".peach > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],["a[href$=\"animals\"] > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".pink > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".blue > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],["a[href$=\"fruits\"] > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".play-banner > div > p"],[".light"],[".daily-label > .eyebrow"],[".daily-card > p:nth-child(3)"],["strong > small"],[".goal-ring > div > span:nth-child(3)"],[".daily-message"],[".step-row:nth-child(2) > span:nth-child(2)"],[".step-row:nth-child(3) > span:nth-child(2)"],[".text-link[routerlink=\"/rewards\"][href$=\"rewards\"]"],[".practice-card > strong"],[".parent-tip > .eyebrow"],[".parent-tip > p"],["footer > span:nth-child(1)"],["footer > span:nth-child(2)"]]}]

expect(received).toEqual(expected) // deep equality

- Expected  -    1
+ Received  + 1079

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 3.63,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#89808d",
+               "fontSize": "8.4pt (11.2px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.63 (foreground color: #89808d, background color: #fcfaf6, font size: 8.4pt (11.2px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.63 (foreground color: #89808d, background color: #fcfaf6, font size: 8.4pt (11.2px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c1879244121=\"\" class=\"topbar-note\">Play • Listen • Learn</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".topbar-note",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 3.13,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9d86aa",
+               "fontSize": "7.8pt (10.4px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.13 (foreground color: #9d86aa, background color: #fcfaf6, font size: 7.8pt (10.4px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.13 (foreground color: #9d86aa, background color: #fcfaf6, font size: 7.8pt (10.4px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\" class=\"eyebrow\">A LITTLE WONDER, EVERY DAY</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".home-greeting > div > .eyebrow",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 2.85,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "10.6pt (14.08px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.85 (foreground color: #99949b, background color: #fcfaf6, font size: 10.6pt (14.08px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.85 (foreground color: #99949b, background color: #fcfaf6, font size: 10.6pt (14.08px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\">What shall we discover today?</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".home-greeting > div > p",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fbf8f3",
+               "contrastRatio": 3.16,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#83907f",
+               "fontSize": "7.6pt (10.08px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.16 (foreground color: #83907f, background color: #fbf8f3, font size: 7.6pt (10.08px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span _ngcontent-ng-c4001793256=\"\" class=\"hero-pill\"><span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">✦</span> Play • Listen • Learn</span>",
+                 "target": Array [
+                   ".hero-pill",
+                 ],
+               },
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"hero\">",
+                 "target": Array [
+                   ".hero",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.16 (foreground color: #83907f, background color: #fbf8f3, font size: 7.6pt (10.08px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\" class=\"hero-pill\"><span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">✦</span> Play • Listen • Learn</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hero-pill",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f1f4eb",
+               "contrastRatio": 2.66,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#92988b",
+               "fontSize": "9.6pt (12.8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.66 (foreground color: #92988b, background color: #f1f4eb, font size: 9.6pt (12.8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"hero\">",
+                 "target": Array [
+                   ".hero",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.66 (foreground color: #92988b, background color: #f1f4eb, font size: 9.6pt (12.8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\">A world of playful learning, made just for you.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hero-copy > p",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#9d86aa",
+               "contrastRatio": 3.23,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#fefefc",
+               "fontSize": "9.4pt (12.48px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.23 (foreground color: #fefefc, background color: #9d86aa, font size: 9.4pt (12.48px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/learn\" class=\"button\" href=\"/learn\">Let’s explore <span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">→</span></a>",
+                 "target": Array [
+                   ".button[routerlink=\"/learn\"][href$=\"learn\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.23 (foreground color: #fefefc, background color: #9d86aa, font size: 9.4pt (12.48px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/learn\" class=\"button\" href=\"/learn\">Let’s explore <span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">→</span></a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".button[routerlink=\"/learn\"][href$=\"learn\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f1f4eb",
+               "contrastRatio": 2.34,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9ba391",
+               "fontSize": "6.8pt (9.12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.34 (foreground color: #9ba391, background color: #f1f4eb, font size: 6.8pt (9.12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"hero\">",
+                 "target": Array [
+                   ".hero",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.34 (foreground color: #9ba391, background color: #f1f4eb, font size: 6.8pt (9.12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\" class=\"hero-note\">Curiosity looks good on you!</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hero-note",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 2.85,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.6pt (12.8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.85 (foreground color: #99949b, background color: #fcfaf6, font size: 9.6pt (12.8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.85 (foreground color: #99949b, background color: #fcfaf6, font size: 9.6pt (12.8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\">So much to discover. Where will you go?</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".section-title > div > p",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 3.13,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9d86aa",
+               "fontSize": "9.6pt (12.8px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.13 (foreground color: #9d86aa, background color: #fcfaf6, font size: 9.6pt (12.8px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.13 (foreground color: #9d86aa, background color: #fcfaf6, font size: 9.6pt (12.8px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/learn\" class=\"text-link\" href=\"/learn\">Explore all <span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">→</span></a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-link[routerlink=\"/learn\"][href$=\"learn\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f3edf7",
+               "contrastRatio": 2.58,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.1pt (12.16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.58 (foreground color: #99949b, background color: #f3edf7, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c3121388917=\"\" class=\"category-card lavender\" href=\"/learn/alphabet\">",
+                 "target": Array [
+                   ".lavender",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.58 (foreground color: #99949b, background color: #f3edf7, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c3121388917=\"\">Little letters, big discoveries</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".lavender > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fbefe5",
+               "contrastRatio": 2.63,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.1pt (12.16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.63 (foreground color: #99949b, background color: #fbefe5, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c3121388917=\"\" class=\"category-card peach\" href=\"/learn/numbers\">",
+                 "target": Array [
+                   ".peach",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.63 (foreground color: #99949b, background color: #fbefe5, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c3121388917=\"\">A little counting adventure</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".peach > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ecf3ec",
+               "contrastRatio": 2.63,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.1pt (12.16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.63 (foreground color: #99949b, background color: #ecf3ec, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c3121388917=\"\" class=\"category-card mint\" href=\"/learn/animals\">",
+                 "target": Array [
+                   "a[href$=\"animals\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.63 (foreground color: #99949b, background color: #ecf3ec, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c3121388917=\"\">Make some wild new friends</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"animals\"] > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#faeced",
+               "contrastRatio": 2.58,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.1pt (12.16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.58 (foreground color: #99949b, background color: #faeced, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c3121388917=\"\" class=\"category-card pink\" href=\"/learn/colors\">",
+                 "target": Array [
+                   ".pink",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.58 (foreground color: #99949b, background color: #faeced, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c3121388917=\"\">A world full of wonder</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".pink > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#edf1f6",
+               "contrastRatio": 2.62,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.1pt (12.16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.62 (foreground color: #99949b, background color: #edf1f6, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c3121388917=\"\" class=\"category-card blue\" href=\"/learn/shapes\">",
+                 "target": Array [
+                   ".blue",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.62 (foreground color: #99949b, background color: #edf1f6, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c3121388917=\"\">Find shapes everywhere</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".blue > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fbf3de",
+               "contrastRatio": 2.68,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "9.1pt (12.16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.68 (foreground color: #99949b, background color: #fbf3de, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c3121388917=\"\" class=\"category-card yellow\" href=\"/learn/fruits\">",
+                 "target": Array [
+                   "a[href$=\"fruits\"]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.68 (foreground color: #99949b, background color: #fbf3de, font size: 9.1pt (12.16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c3121388917=\"\">Sweet little discoveries</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"fruits\"] > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f3eef5",
+               "contrastRatio": 2.59,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "8.6pt (11.52px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.59 (foreground color: #99949b, background color: #f3eef5, font size: 8.6pt (11.52px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"play-banner\">",
+                 "target": Array [
+                   ".play-banner",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.59 (foreground color: #99949b, background color: #f3eef5, font size: 8.6pt (11.52px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\">Find, match, and count your way to new discoveries.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".play-banner > div > p",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefefc",
+               "contrastRatio": 3.97,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#8d7799",
+               "fontSize": "8.4pt (11.2px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.97 (foreground color: #8d7799, background color: #fefefc, font size: 8.4pt (11.2px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/play\" class=\"button light\" href=\"/play\">Play together <span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">→</span></a>",
+                 "target": Array [
+                   ".light",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.97 (foreground color: #8d7799, background color: #fefefc, font size: 8.4pt (11.2px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/play\" class=\"button light\" href=\"/play\">Play together <span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">→</span></a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".light",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 3.21,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9d86aa",
+               "fontSize": "7.8pt (10.4px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.21 (foreground color: #9d86aa, background color: #fefdf9, font size: 7.8pt (10.4px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"daily-card panel\">",
+                 "target": Array [
+                   ".daily-card",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.21 (foreground color: #9d86aa, background color: #fefdf9, font size: 7.8pt (10.4px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\" class=\"eyebrow\">TODAY</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".daily-label > .eyebrow",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 2.92,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "8.6pt (11.52px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.6pt (11.52px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"daily-card panel\">",
+                 "target": Array [
+                   ".daily-card",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.6pt (11.52px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\">Every little step counts</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".daily-card > p:nth-child(3)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 2.92,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "10.8pt (14.4px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 10.8pt (14.4px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div _ngcontent-ng-c4001793256=\"\"><span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">🌱</span><strong _ngcontent-ng-c4001793256=\"\">0<small _ngcontent-ng-c4001793256=\"\"> / 5</small></strong><span _ngcontent-ng-c4001793256=\"\">minutes</span></div>",
+                 "target": Array [
+                   ".goal-ring > div",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 10.8pt (14.4px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<small _ngcontent-ng-c4001793256=\"\"> / 5</small>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "strong > small",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 2.92,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "7.7pt (10.24px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 7.7pt (10.24px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div _ngcontent-ng-c4001793256=\"\"><span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">🌱</span><strong _ngcontent-ng-c4001793256=\"\">0<small _ngcontent-ng-c4001793256=\"\"> / 5</small></strong><span _ngcontent-ng-c4001793256=\"\">minutes</span></div>",
+                 "target": Array [
+                   ".goal-ring > div",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 7.7pt (10.24px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\">minutes</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".goal-ring > div > span:nth-child(3)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 2.92,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "8.8pt (11.68px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.8pt (11.68px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"daily-card panel\">",
+                 "target": Array [
+                   ".daily-card",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.8pt (11.68px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\" class=\"daily-message\">Your adventure starts with one little tap.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".daily-message",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 2.92,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "8.2pt (10.88px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.2pt (10.88px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"little-steps panel\">",
+                 "target": Array [
+                   ".little-steps",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.2pt (10.88px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\">Stars collected</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".step-row:nth-child(2) > span:nth-child(2)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 2.92,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99949b",
+               "fontSize": "8.2pt (10.88px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.2pt (10.88px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"little-steps panel\">",
+                 "target": Array [
+                   ".little-steps",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.92 (foreground color: #99949b, background color: #fefdf9, font size: 8.2pt (10.88px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\">Things discovered</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".step-row:nth-child(3) > span:nth-child(2)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fefdf9",
+               "contrastRatio": 3.21,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9d86aa",
+               "fontSize": "8.6pt (11.52px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.21 (foreground color: #9d86aa, background color: #fefdf9, font size: 8.6pt (11.52px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section _ngcontent-ng-c4001793256=\"\" class=\"little-steps panel\">",
+                 "target": Array [
+                   ".little-steps",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.21 (foreground color: #9d86aa, background color: #fefdf9, font size: 8.6pt (11.52px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/rewards\" class=\"text-link\" href=\"/rewards\">My treasures <span _ngcontent-ng-c4001793256=\"\" aria-hidden=\"true\">→</span></a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-link[routerlink=\"/rewards\"][href$=\"rewards\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#eef1f5",
+               "contrastRatio": 2.81,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#8790a9",
+               "fontSize": "9.2pt (12.32px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.81 (foreground color: #8790a9, background color: #eef1f5, font size: 9.2pt (12.32px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a _ngcontent-ng-c4001793256=\"\" routerlink=\"/play/find-it\" class=\"practice-card\" href=\"/play/find-it?practice=true\">",
+                 "target": Array [
+                   ".practice-card",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.81 (foreground color: #8790a9, background color: #eef1f5, font size: 9.2pt (12.32px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<strong _ngcontent-ng-c4001793256=\"\">Practice for me</strong>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".practice-card > strong",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 2.52,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#ac9d8e",
+               "fontSize": "6.7pt (8.96px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.52 (foreground color: #ac9d8e, background color: #fcfaf6, font size: 6.7pt (8.96px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.52 (foreground color: #ac9d8e, background color: #fcfaf6, font size: 6.7pt (8.96px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c4001793256=\"\" class=\"eyebrow\">A LITTLE TIP FOR GROWN-UPS</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".parent-tip > .eyebrow",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 2.43,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#aba197",
+               "fontSize": "8.8pt (11.68px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.43 (foreground color: #aba197, background color: #fcfaf6, font size: 8.8pt (11.68px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.43 (foreground color: #aba197, background color: #fcfaf6, font size: 8.8pt (11.68px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p _ngcontent-ng-c4001793256=\"\">Learn together. Ask “What do you notice?” and let your little one lead the way.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".parent-tip > p",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 4.01,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#817986",
+               "fontSize": "7.8pt (10.4px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.01 (foreground color: #817986, background color: #fcfaf6, font size: 7.8pt (10.4px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.01 (foreground color: #817986, background color: #fcfaf6, font size: 7.8pt (10.4px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c1879244121=\"\">♡ No ads. No rush. Just discovery.</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "footer > span:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fcfaf6",
+               "contrastRatio": 4.01,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#817986",
+               "fontSize": "7.8pt (10.4px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.01 (foreground color: #817986, background color: #fcfaf6, font size: 7.8pt (10.4px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"en\" data-beasties-container=\"\" dir=\"ltr\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.01 (foreground color: #817986, background color: #fcfaf6, font size: 7.8pt (10.4px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span _ngcontent-ng-c1879244121=\"\">✧ Little adventures, even offline</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "footer > span:nth-child(2)",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - link "Skip to learning" [ref=f1e3] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=f1e4]:
    - link "TinySteps" [ref=f1e5] [cursor=pointer]:
      - /url: /
      - generic [ref=f1e6]:
        - text: TinySteps
        - generic [ref=f1e7]: Play • Listen • Learn
    - navigation "TinySteps" [ref=f1e8]:
      - link "Home" [ref=f1e9] [cursor=pointer]:
        - /url: /
      - link "Learn" [ref=f1e14] [cursor=pointer]:
        - /url: /learn
      - link "Play" [ref=f1e19] [cursor=pointer]:
        - /url: /play
      - link "Trace" [ref=f1e24] [cursor=pointer]:
        - /url: /trace
      - link "My treasures" [ref=f1e29] [cursor=pointer]:
        - /url: /rewards
    - generic [ref=f1e34]:
      - generic [ref=f1e35]:
        - paragraph [ref=f1e36]: Made for curious little minds
        - text: No ads. No rush. Just discovery.
      - link "Parent Zone" [ref=f1e37] [cursor=pointer]:
        - /url: /parent
        - text: Parent Zone
        - generic [aria-hidden] [ref=f1e40]: ↗
  - generic [ref=f1e41]:
    - banner [ref=f1e42]:
      - generic [ref=f1e43]: Play • Listen • Learn
      - generic [ref=f1e44]:
        - generic [ref=f1e45]: EN
        - button "Sound off" [ref=f1e46] [cursor=pointer]
        - link "0 stars" [ref=f1e49] [cursor=pointer]:
          - /url: /rewards
          - generic [aria-hidden] [ref=f1e50]: ★
          - text: "0"
          - generic [ref=f1e51]: stars
        - link "Parent Zone" [ref=f1e52] [cursor=pointer]:
          - /url: /parent
          - generic [aria-hidden] [ref=f1e53]: 🐻
          - generic [ref=f1e54]: Sunny
          - generic [aria-hidden] [ref=f1e55]: ⌄
    - main [active] [ref=f1e56]:
      - generic [ref=f1e58]:
        - generic [ref=f1e59]:
          - generic [ref=f1e60]:
            - text: A LITTLE WONDER, EVERY DAY
            - heading "Hello, Sunny!" [level=1] [ref=f1e61]:
              - text: Hello, Sunny!
              - generic [aria-hidden] [ref=f1e62]: ☀
            - paragraph [ref=f1e63]: What shall we discover today?
          - generic [aria-hidden] [ref=f1e64]: ✳
        - generic [ref=f1e65]:
          - generic [ref=f1e66]:
            - generic [ref=f1e67]:
              - generic [ref=f1e68]:
                - generic [ref=f1e69]:
                  - generic [aria-hidden] [ref=f1e70]: ✦
                  - text: Play • Listen • Learn
                - heading "Small steps. Big discoveries." [level=2] [ref=f1e71]
                - paragraph [ref=f1e72]: A world of playful learning, made just for you.
                - link "Let’s explore" [ref=f1e73] [cursor=pointer]:
                  - /url: /learn
                  - text: Let’s explore
                  - generic [aria-hidden] [ref=f1e74]: →
              - generic [ref=f1e75]: Curiosity looks good on you!
              - generic [aria-hidden] [ref=f1e79]: ✦
            - generic [ref=f1e80]:
              - generic [ref=f1e81]:
                - generic [ref=f1e82]:
                  - heading "Pick a little adventure" [level=2] [ref=f1e83]
                  - paragraph [ref=f1e84]: So much to discover. Where will you go?
                - link "Explore all" [ref=f1e85] [cursor=pointer]:
                  - /url: /learn
                  - text: Explore all
                  - generic [aria-hidden] [ref=f1e86]: →
              - generic [ref=f1e87]:
                - link "ABC Little letters, big discoveries" [ref=f1e89] [cursor=pointer]:
                  - /url: /learn/alphabet
                  - generic [ref=f1e91]:
                    - strong [ref=f1e92]: ABC
                    - generic [ref=f1e93]: Little letters, big discoveries
                  - generic [aria-hidden] [ref=f1e94]: ↗
                - link "Numbers A little counting adventure" [ref=f1e96] [cursor=pointer]:
                  - /url: /learn/numbers
                  - generic [ref=f1e98]:
                    - strong [ref=f1e99]: Numbers
                    - generic [ref=f1e100]: A little counting adventure
                  - generic [aria-hidden] [ref=f1e101]: ↗
                - link "Animals Make some wild new friends" [ref=f1e103] [cursor=pointer]:
                  - /url: /learn/animals
                  - generic [ref=f1e105]:
                    - strong [ref=f1e106]: Animals
                    - generic [ref=f1e107]: Make some wild new friends
                  - generic [aria-hidden] [ref=f1e108]: ↗
                - link "Colors A world full of wonder" [ref=f1e110] [cursor=pointer]:
                  - /url: /learn/colors
                  - generic [ref=f1e112]:
                    - strong [ref=f1e113]: Colors
                    - generic [ref=f1e114]: A world full of wonder
                  - generic [aria-hidden] [ref=f1e115]: ↗
                - link "Shapes Find shapes everywhere" [ref=f1e117] [cursor=pointer]:
                  - /url: /learn/shapes
                  - generic [ref=f1e119]:
                    - strong [ref=f1e120]: Shapes
                    - generic [ref=f1e121]: Find shapes everywhere
                  - generic [aria-hidden] [ref=f1e122]: ↗
                - link "Fruits Sweet little discoveries" [ref=f1e124] [cursor=pointer]:
                  - /url: /learn/fruits
                  - generic [ref=f1e126]:
                    - strong [ref=f1e127]: Fruits
                    - generic [ref=f1e128]: Sweet little discoveries
                  - generic [aria-hidden] [ref=f1e129]: ↗
            - generic [ref=f1e130]:
              - generic [aria-hidden] [ref=f1e131]:
                - text: ✿
                - generic [ref=f1e132]: ✦
              - generic [ref=f1e133]:
                - heading "A little play, a lot of learning" [level=3] [ref=f1e134]
                - paragraph [ref=f1e135]: Find, match, and count your way to new discoveries.
              - link "Play together" [ref=f1e136] [cursor=pointer]:
                - /url: /play
                - text: Play together
                - generic [aria-hidden] [ref=f1e137]: →
          - complementary [ref=f1e138]:
            - generic [ref=f1e139]:
              - generic [ref=f1e140]:
                - generic [ref=f1e141]: TODAY
                - generic [aria-hidden] [ref=f1e142]: ☀
              - heading "Today’s adventure" [level=3] [ref=f1e143]
              - paragraph [ref=f1e144]: Every little step counts
              - generic [ref=f1e146]:
                - generic [aria-hidden] [ref=f1e147]: 🌱
                - strong [ref=f1e148]: 0 / 5
                - generic [ref=f1e149]: minutes
              - paragraph [ref=f1e150]: Your adventure starts with one little tap.
              - generic [aria-hidden] [ref=f1e151]:
                - generic [ref=f1e152]: ✦
                - generic [ref=f1e154]: ✦
                - generic [ref=f1e156]: ★
            - generic [ref=f1e157]:
              - heading "Your little steps" [level=3] [ref=f1e158]
              - generic [ref=f1e159]:
                - generic [aria-hidden] [ref=f1e160]: ★
                - generic [ref=f1e161]: Stars collected
                - strong [ref=f1e162]: "0"
              - generic [ref=f1e163]:
                - generic [aria-hidden] [ref=f1e164]: ⚑
                - generic [ref=f1e165]: Things discovered
                - strong [ref=f1e166]: "0"
              - link "My treasures" [ref=f1e167] [cursor=pointer]:
                - /url: /rewards
                - text: My treasures
                - generic [aria-hidden] [ref=f1e168]: →
            - link [ref=f1e169] [cursor=pointer]:
              - /url: /play/find-it?practice=true
              - generic [aria-hidden] [ref=f1e170]: ✧
              - strong [ref=f1e171]: Practice for me
              - generic [aria-hidden] [ref=f1e172]: →
            - generic [ref=f1e173]:
              - generic [aria-hidden] [ref=f1e174]: ♡
              - text: A LITTLE TIP FOR GROWN-UPS
              - paragraph [ref=f1e175]: Learn together. Ask “What do you notice?” and let your little one lead the way.
    - contentinfo [ref=f1e176]:
      - generic [ref=f1e177]: ♡ No ads. No rush. Just discovery.
      - generic [ref=f1e178]: ✧ Little adventures, even offline
```

# Test source

```ts
  1  | import { expect, Page, test } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | async function onboard(page:Page,name='Sunny'):Promise<void>{await page.goto('/');await page.getByRole('button',{name:'Let’s get started'}).click();await page.getByRole('textbox').fill(name);await page.getByRole('button',{name:'Continue',exact:false}).click();await page.getByRole('button',{name:'Start my adventure'}).click();await expect(page.getByRole('heading',{name:`Hello, ${name}!`})).toBeVisible();}
  4  | async function gate(page:Page):Promise<void>{await page.goto('/parent');const challenge=await page.locator('.challenge').innerText();const numbers=challenge.match(/\d+/g)?.map(Number)??[];await page.getByRole('spinbutton').fill(String(numbers[0]*numbers[1]));await page.getByRole('button',{name:'Enter Parent Zone'}).click();await expect(page.getByRole('heading',{name:'A window into their world'})).toBeVisible();}
  5  | test('complete learning flow, gentle retry, stars and persisted progress',async({page})=>{
  6  |  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await onboard(page);await page.locator('app-category-card').filter({hasText:'Animals'}).click();await page.getByRole('link',{name:'Elephant',exact:false}).click();await page.getByRole('button',{name:'Listen again'}).click();await page.getByRole('link',{name:'Let’s find it!'}).click();await expect(page.getByRole('heading',{name:'Can you find Elephant?'})).toBeVisible();const wrong=page.locator('.answer-card').filter({hasNotText:'Elephant'}).first();await wrong.click();await expect(page.getByText('Almost! Let’s try again.')).toBeVisible();await page.getByRole('button',{name:'Elephant',exact:true}).click();await expect(page.locator('.feedback')).toHaveText('You found it! Wonderful!');await page.reload();await page.goto('/rewards');await expect(page.locator('.star-collection>strong')).toHaveText('1');await gate(page);await expect(page.locator('.category-progress-row').filter({hasText:'Animals'})).toContainText('1 / 16');await expect(page.locator('.stats-grid .panel').nth(2).locator('strong')).toHaveText('0');expect(errors).toEqual([]);
  7  | });
  8  | test('English and Hindi profile preferences, protected settings and profile isolation',async({page})=>{
  9  |  await onboard(page);await page.goto('/parent/settings');await expect(page.getByRole('heading',{name:'Hello, grown-up!'})).toBeVisible();await gate(page);await page.getByRole('link',{name:'Little learners',exact:true}).click();await page.getByRole('link',{name:'Add a little learner'}).click();await page.getByRole('textbox').fill('Tara');await page.getByRole('button',{name:'Continue',exact:false}).click();await page.getByRole('button',{name:'हिन्दी',exact:true}).click();await page.getByRole('button',{name:'मेरा सफ़र शुरू करें'}).click();await expect(page.getByRole('heading',{name:'नमस्ते, Tara!'})).toBeVisible();await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','hi');await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'हाथी',exact:true})).toBeVisible();await page.goto('/rewards');await expect(page.locator('.star-collection>strong')).toHaveText('0');
  10 | });
  11 | test('all four games can finish and memory pairs are accessible',async({page})=>{
  12 |  await onboard(page);
  13 |  for(const kind of ['find-it','match','count']){await page.goto('/play/'+kind);for(let n=0;n<5;n++){await expect(page.locator('.answer-card').first()).toBeVisible();const options=page.locator('.answer-card');const count=await options.count();for(let k=0;k<count;k++){await options.nth(k).click();if(await page.locator('.answer-card.correct').count())break;}await page.getByRole('button',{name:'Keep exploring'}).click();}await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();}
  14 |  await page.goto('/play/memory');const cards=page.locator('.memory-card');const found=new Map<string,number>();while(!(await page.locator('.result').count())){let paired=false;for(let n=0;n<4;n++){if(await cards.nth(n).isDisabled())continue;await cards.nth(n).click();const label=await cards.nth(n).getAttribute('aria-label');if(label){const prior=found.get(label);if(prior!==undefined && prior!==n && !(await cards.nth(prior).isDisabled())){await cards.nth(prior).click();paired=true;break;}found.set(label,n);}if(await page.locator('.memory-card.face-up:not(.matched)').count()===2)await page.waitForTimeout(1300);}if(!paired)await page.waitForTimeout(1300);}await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();
  15 | });
  16 | test('offline reload reaches uncached routes and Hindi content',async({page,context})=>{
  17 |  await onboard(page);await page.evaluate(async()=>{const registration=await navigator.serviceWorker.ready;if(!registration.active)throw new Error('No active service worker');});await page.reload();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.goto('/learn/fruits');await expect(page.getByRole('link',{name:'Apple',exact:false})).toBeVisible();await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'Elephant',exact:true})).toBeVisible();await expect(page.getByText('You’re offline. Let’s keep learning!')).toBeVisible();const hi=await page.evaluate(async()=>{const r=await fetch('/assets/content/hi/animals.json');return r.ok;});expect(hi).toBe(true);
  18 | });
  19 | test('responsive layouts, keyboard access and accessibility',async({page},testInfo)=>{
> 20 |  await onboard(page);for(const route of ['/','/learn','/learn/animals','/learn/animals/elephant','/play','/play/find-it','/rewards','/parent/gate','/trace']){await page.goto(route);await expect(page.locator('main h1').first()).toBeVisible();await page.waitForTimeout(100);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations,`${route}: ${JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}await page.goto('/');await page.screenshot({path:`test-results/home-${testInfo.project.name}.png`,fullPage:true});if(testInfo.project.name==='mobile'){await page.setViewportSize({width:320,height:720});await page.screenshot({path:'test-results/home-320.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ^ Error: /: [{"id":"color-contrast","nodes":[[".topbar-note"],[".home-greeting > div > .eyebrow"],[".home-greeting > div > p"],[".hero-pill"],[".hero-copy > p"],[".button[routerlink=\"/learn\"][href$=\"learn\"]"],[".hero-note"],[".section-title > div > p"],[".text-link[routerlink=\"/learn\"][href$=\"learn\"]"],[".lavender > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".peach > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],["a[href$=\"animals\"] > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".pink > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".blue > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],["a[href$=\"fruits\"] > .category-copy[_ngcontent-ng-c3121388917=\"\"] > span[_ngcontent-ng-c3121388917=\"\"]"],[".play-banner > div > p"],[".light"],[".daily-label > .eyebrow"],[".daily-card > p:nth-child(3)"],["strong > small"],[".goal-ring > div > span:nth-child(3)"],[".daily-message"],[".step-row:nth-child(2) > span:nth-child(2)"],[".step-row:nth-child(3) > span:nth-child(2)"],[".text-link[routerlink=\"/rewards\"][href$=\"rewards\"]"],[".practice-card > strong"],[".parent-tip > .eyebrow"],[".parent-tip > p"],["footer > span:nth-child(1)"],["footer > span:nth-child(2)"]]}]
  21 | });
  22 | 
```