/* ============================================================
   n8n Notebook UI — dot-grid icon language
   Turns a small ASCII bitmap into a grid of rounded-square dots,
   matching the pixel-icon pattern used on n8n's own product UI
   (confirmed against the live site's icon tiles: small rounded
   squares as "on" cells, never circles).
   ============================================================ */

function parseDotBitmap(rows) {
  return rows.map(function (row) {
    return row.split("").map(function (c) { return c === "1"; });
  });
}

// dotSize/gap in px. A good default for a ~36px avatar tile is
// dotSize 1.8-2.2, gap 0.6-0.8. For a large ~44px agent-home icon,
// go up to dotSize 2.8, gap 1.0. For a tiny ~18px sidebar badge,
// drop to dotSize 1.5, gap 0.5 (any bigger and it overflows the tile).
function renderDotIcon(bitmap, dotSize, gap, color) {
  var w = bitmap[0].length;
  var html = '<div style="display:grid; grid-template-columns:repeat(' + w + ', ' + dotSize + 'px); gap:' + gap + 'px;">';
  bitmap.forEach(function (row) {
    row.forEach(function (on) {
      var radius = Math.max(1, dotSize * 0.25);
      html += '<div style="width:' + dotSize + 'px;height:' + dotSize + 'px;border-radius:' + radius + 'px;background:' + (on ? color : "transparent") + ';"></div>';
    });
  });
  html += "</div>";
  return html;
}

// Starter set of 7 icons. Each row is a string of "1" (on) and "."
// (off); rows don't need to be the same length across icons, but
// should be within one icon. Add new agents here as you invent
// their glyphs — keep bitmaps small (6-9 rows) and simple: a single
// clear silhouette reads far better at this scale than internal
// detail (checkmarks, small text, faces tend to blur into noise).
var ICON_BITMAPS = {
  assistant: parseDotBitmap([
    "..1.1..",
    "..1.1..",
    ".11111.",
    "1111111",
    "1110111",
    "1111111",
    ".11111.",
    "1111111",
    "1111111"
  ]),
  support: parseDotBitmap([
    "..11111..",
    ".1111111.",
    "11.....11",
    "11.....11",
    "111...111",
    "111...111"
  ]),
  chat: parseDotBitmap([
    ".11111.",
    "1.....1",
    "1.....1",
    "1.....1",
    "1.....1",
    ".11111.",
    "..11...",
    "...1..."
  ]),
  search: parseDotBitmap([
    ".11111.",
    "1.....1",
    "1.....1",
    "1.....1",
    ".11111.",
    "....1..",
    ".....1.",
    "......1"
  ]),
  flag: parseDotBitmap([
    "1.....",
    "1.....",
    "1111..",
    "111111",
    "11111.",
    "1111..",
    "1.....",
    "1.....",
    "1....."
  ]),
  funnel: parseDotBitmap([
    "1.....1",
    "11...11",
    ".11.11.",
    "..111..",
    "...1...",
    "...1...",
    "...1..."
  ]),
  notepad: parseDotBitmap([
    ".1.1.1.1.",
    "111111111",
    "1.......1",
    "1.......1",
    "1..111..1",
    "1.......1",
    "1..111..1",
    "1.......1",
    "111111111"
  ])
};

// Node/module export is optional — these functions and ICON_BITMAPS
// work as plain globals when this file is loaded via <script src="...">.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { parseDotBitmap: parseDotBitmap, renderDotIcon: renderDotIcon, ICON_BITMAPS: ICON_BITMAPS };
}
