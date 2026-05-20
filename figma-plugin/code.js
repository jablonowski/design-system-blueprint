// =============================================================================
// DSB — Design System Blueprint · Figma Plugin
// Creates:
//   • Variable collections: 01 Options, 02 Decisions, 03 Components
//   • Component library page with all 13 components
// =============================================================================

// ─── Colour helpers ───────────────────────────────────────────────────────────

function hex(h) {
  const n = h.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
  };
}
function rgba(r, g, b, a) { return { r: r / 255, g: g / 255, b: b / 255, a }; }
function solidPaint(color) { return { type: 'SOLID', color }; }
function boundPaint(variable) {
  const paint = solidPaint({ r: 0, g: 0, b: 0 });
  return figma.variables.setBoundVariableForPaint(paint, 'color', variable);
}
function noFill() { return []; }

// ─── Variable helpers ─────────────────────────────────────────────────────────

function makeColorVar(name, collection, modeId, value, varMap) {
  const v = figma.variables.createVariable(name, collection, 'COLOR');
  v.setValueForMode(modeId, value);
  varMap.set(name, v);
  return v;
}
function makeFloatVar(name, collection, modeId, value, varMap) {
  const v = figma.variables.createVariable(name, collection, 'FLOAT');
  v.setValueForMode(modeId, value);
  varMap.set(name, v);
  return v;
}
function makeStringVar(name, collection, modeId, value, varMap) {
  const v = figma.variables.createVariable(name, collection, 'STRING');
  v.setValueForMode(modeId, value);
  varMap.set(name, v);
  return v;
}
function makeAliasColorVar(name, refName, collection, modeId, varMap) {
  const ref = varMap.get(refName);
  if (!ref) { console.warn(`Missing ref: ${refName}`); return null; }
  const v = figma.variables.createVariable(name, collection, 'COLOR');
  v.setValueForMode(modeId, figma.variables.createVariableAlias(ref));
  varMap.set(name, v);
  return v;
}
function makeAliasFloatVar(name, refName, collection, modeId, varMap) {
  const ref = varMap.get(refName);
  if (!ref) { console.warn(`Missing ref: ${refName}`); return null; }
  const v = figma.variables.createVariable(name, collection, 'FLOAT');
  v.setValueForMode(modeId, figma.variables.createVariableAlias(ref));
  varMap.set(name, v);
  return v;
}
function makeAliasStringVar(name, refName, collection, modeId, varMap) {
  const ref = varMap.get(refName);
  if (!ref) { console.warn(`Missing ref: ${refName}`); return null; }
  const v = figma.variables.createVariable(name, collection, 'STRING');
  v.setValueForMode(modeId, figma.variables.createVariableAlias(ref));
  varMap.set(name, v);
  return v;
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function autoFrame(name, direction, spacing, padH, padV) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.itemSpacing = spacing;
  f.paddingLeft = padH; f.paddingRight = padH;
  f.paddingTop = padV; f.paddingBottom = padV;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.fills = noFill();
  return f;
}

function autoComponent(name, direction, spacing, padH, padV) {
  const c = figma.createComponent();
  c.name = name;
  c.layoutMode = direction;
  c.itemSpacing = spacing;
  c.paddingLeft = padH; c.paddingRight = padH;
  c.paddingTop = padV; c.paddingBottom = padV;
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'AUTO';
  return c;
}

function addLabel(text, size, weight, colorVar) {
  const t = figma.createText();
  t.characters = text;
  t.fontSize = size;
  t.fontName = { family: 'Inter', style: weight };
  if (colorVar) t.fills = [boundPaint(colorVar)];
  return t;
}

function sectionHeading(text, vm) {
  const t = figma.createText();
  t.characters = text;
  t.fontSize = 11;
  t.fontName = { family: 'Inter', style: 'Semi Bold' };
  t.fills = [boundPaint(vm.get('decisions/color/text/subtle'))];
  t.letterSpacing = { value: 8, unit: 'PERCENT' };
  return t;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });

  const varMap = new Map();

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. VARIABLE COLLECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 01 / Options ──────────────────────────────────────────────────────────
  const optColl = figma.variables.createVariableCollection('01 / Options');
  const optMode = optColl.modes[0].modeId;
  optColl.renameMode(optMode, 'Value');

  // Colors
  const neutral = { '0':'#ffffff','50':'#fafafa','75':'#f7f7f7','100':'#f5f5f5','150':'#f0f0f0','200':'#ebebeb','300':'#e8e8e8','350':'#d4d4d4','400':'#c0c0c0','450':'#bbbbbb','500':'#aaaaaa','550':'#999999','600':'#888888','650':'#666666','700':'#555555','800':'#333333','900':'#111111','1000':'#000000' };
  for (const [k, v] of Object.entries(neutral)) makeColorVar(`options/color/neutral/${k}`, optColl, optMode, hex(v), varMap);

  const reds = { '50':'#fef2f2','100':'#fce8e6','200':'#f0a9a4','500':'#d93025','600':'#c5221f','700':'#b0261e' };
  for (const [k, v] of Object.entries(reds)) makeColorVar(`options/color/red/${k}`, optColl, optMode, hex(v), varMap);

  makeColorVar('options/color/green/50',  optColl, optMode, hex('#e6f4ea'), varMap);
  makeColorVar('options/color/green/700', optColl, optMode, hex('#1a7f3c'), varMap);
  makeColorVar('options/color/yellow/50',  optColl, optMode, hex('#fef3cd'), varMap);
  makeColorVar('options/color/yellow/700', optColl, optMode, hex('#92600a'), varMap);
  makeColorVar('options/color/blue/50',  optColl, optMode, hex('#e8f0fe'), varMap);
  makeColorVar('options/color/blue/700', optColl, optMode, hex('#1a56db'), varMap);
  makeColorVar('options/color/black/a40', optColl, optMode, rgba(0,0,0,0.40), varMap);
  makeColorVar('options/color/black/a06', optColl, optMode, rgba(0,0,0,0.06), varMap);
  makeColorVar('options/color/black/a08', optColl, optMode, rgba(0,0,0,0.08), varMap);
  makeColorVar('options/color/black/a14', optColl, optMode, rgba(0,0,0,0.14), varMap);
  makeColorVar('options/color/red-a10',   optColl, optMode, rgba(217,48,37,0.10), varMap);

  // Floats
  const optFloats = [
    ['options/border-width/1', 1], ['options/border-width/1-5', 1.5], ['options/border-width/2', 2],
    ['options/border-radius/3', 3], ['options/border-radius/4', 4], ['options/border-radius/5', 5],
    ['options/border-radius/6', 6], ['options/border-radius/8', 8], ['options/border-radius/10', 10],
    ['options/border-radius/full', 9999],
    ['options/font-size/11', 11], ['options/font-size/12', 12], ['options/font-size/13', 13],
    ['options/font-size/14', 14], ['options/font-size/15', 15], ['options/font-size/16', 16],
    ['options/font-weight/medium', 500], ['options/font-weight/semibold', 600],
    ['options/opacity/disabled', 0.42],
    ['options/z-index/100', 100], ['options/z-index/1000', 1000],
    ['options/duration/fast', 100], ['options/duration/base', 120], ['options/duration/slow', 200],
  ];
  for (const [n, v] of optFloats) makeFloatVar(n, optColl, optMode, v, varMap);
  makeStringVar('options/easing/standard', optColl, optMode, 'ease', varMap);

  // ── 02 / Decisions ────────────────────────────────────────────────────────
  const decColl = figma.variables.createVariableCollection('02 / Decisions');
  const decMode = decColl.modes[0].modeId;
  decColl.renameMode(decMode, 'Light');

  const decColors = [
    // text
    ['decisions/color/text/primary',     'options/color/neutral/900'],
    ['decisions/color/text/body',         'options/color/neutral/800'],
    ['decisions/color/text/secondary',    'options/color/neutral/700'],
    ['decisions/color/text/muted',        'options/color/neutral/650'],
    ['decisions/color/text/subtle',       'options/color/neutral/600'],
    ['decisions/color/text/placeholder',  'options/color/neutral/500'],
    ['decisions/color/text/disabled',     'options/color/neutral/550'],
    ['decisions/color/text/inverse',      'options/color/neutral/0'],
    // surface
    ['decisions/color/surface/base',      'options/color/neutral/0'],
    ['decisions/color/surface/subtle',    'options/color/neutral/50'],
    ['decisions/color/surface/hover',     'options/color/neutral/100'],
    ['decisions/color/surface/row-hover', 'options/color/neutral/75'],
    ['decisions/color/surface/selected',  'options/color/neutral/150'],
    ['decisions/color/surface/avatar',    'options/color/neutral/300'],
    // border
    ['decisions/color/border/control',       'options/color/neutral/350'],
    ['decisions/color/border/control-hover', 'options/color/neutral/450'],
    ['decisions/color/border/subtle',        'options/color/neutral/200'],
    ['decisions/color/border/hairline',      'options/color/neutral/150'],
    ['decisions/color/border/separator',     'options/color/neutral/400'],
    // overlay
    ['decisions/color/overlay/backdrop', 'options/color/black/a40'],
    // feedback — error
    ['decisions/color/feedback/error/text',         'options/color/red/600'],
    ['decisions/color/feedback/error/icon',         'options/color/red/500'],
    ['decisions/color/feedback/error/icon-hover',   'options/color/red/700'],
    ['decisions/color/feedback/error/surface',      'options/color/red/100'],
    ['decisions/color/feedback/error/surface-hover','options/color/red/50'],
    ['decisions/color/feedback/error/border',       'options/color/red/200'],
    // feedback — success / warning / info
    ['decisions/color/feedback/success/text',    'options/color/green/700'],
    ['decisions/color/feedback/success/surface', 'options/color/green/50'],
    ['decisions/color/feedback/warning/text',    'options/color/yellow/700'],
    ['decisions/color/feedback/warning/surface', 'options/color/yellow/50'],
    ['decisions/color/feedback/info/text',       'options/color/blue/700'],
    ['decisions/color/feedback/info/surface',    'options/color/blue/50'],
  ];
  for (const [n, r] of decColors) makeAliasColorVar(n, r, decColl, decMode, varMap);

  const decFloats = [
    ['decisions/font-size/2xs', 'options/font-size/11'],
    ['decisions/font-size/xs',  'options/font-size/12'],
    ['decisions/font-size/sm',  'options/font-size/13'],
    ['decisions/font-size/md',  'options/font-size/14'],
    ['decisions/font-size/lg',  'options/font-size/15'],
    ['decisions/font-size/xl',  'options/font-size/16'],
    ['decisions/font-weight/medium',   'options/font-weight/medium'],
    ['decisions/font-weight/semibold', 'options/font-weight/semibold'],
    ['decisions/border-width/hairline', 'options/border-width/1'],
    ['decisions/border-width/control',  'options/border-width/1-5'],
    ['decisions/border-width/focus',    'options/border-width/2'],
    ['decisions/border-radius/xs',   'options/border-radius/3'],
    ['decisions/border-radius/sm',   'options/border-radius/4'],
    ['decisions/border-radius/md',   'options/border-radius/5'],
    ['decisions/border-radius/lg',   'options/border-radius/6'],
    ['decisions/border-radius/xl',   'options/border-radius/8'],
    ['decisions/border-radius/2xl',  'options/border-radius/10'],
    ['decisions/border-radius/full', 'options/border-radius/full'],
    ['decisions/opacity/disabled', 'options/opacity/disabled'],
    ['decisions/z-index/dropdown', 'options/z-index/100'],
    ['decisions/z-index/modal',    'options/z-index/1000'],
    ['decisions/motion/duration/fast', 'options/duration/fast'],
    ['decisions/motion/duration/base', 'options/duration/base'],
    ['decisions/motion/duration/slow', 'options/duration/slow'],
  ];
  for (const [n, r] of decFloats) makeAliasFloatVar(n, r, decColl, decMode, varMap);
  makeAliasStringVar('decisions/motion/easing/standard', 'options/easing/standard', decColl, decMode, varMap);

  // ── 03 / Components ───────────────────────────────────────────────────────
  const cmpColl = figma.variables.createVariableCollection('03 / Components');
  const cmpMode = cmpColl.modes[0].modeId;
  cmpColl.renameMode(cmpMode, 'Default');

  const cmpColors = [
    // button
    ['component/button/primary/background',      'decisions/color/text/primary'],
    ['component/button/primary/text',            'decisions/color/text/inverse'],
    ['component/button/primary/border',          'decisions/color/text/primary'],
    ['component/button/secondary/background',    'decisions/color/surface/base'],
    ['component/button/secondary/text',          'decisions/color/text/primary'],
    ['component/button/secondary/border',        'decisions/color/border/control'],
    ['component/button/ghost/background',        'decisions/color/surface/base'],
    ['component/button/ghost/text',              'decisions/color/text/secondary'],
    ['component/button/danger/background',       'decisions/color/surface/base'],
    ['component/button/danger/text',             'decisions/color/feedback/error/icon'],
    ['component/button/danger/border',           'decisions/color/feedback/error/border'],
    // input
    ['component/input/background',   'decisions/color/surface/base'],
    ['component/input/text',         'decisions/color/text/primary'],
    ['component/input/placeholder',  'decisions/color/text/placeholder'],
    ['component/input/border',       'decisions/color/border/control'],
    ['component/input/border-focus', 'decisions/color/text/primary'],
    ['component/input/disabled/background', 'decisions/color/surface/hover'],
    ['component/input/disabled/text',       'decisions/color/text/disabled'],
    ['component/input/error/border',        'decisions/color/feedback/error/icon'],
    // checkbox
    ['component/checkbox/border',            'decisions/color/border/control'],
    ['component/checkbox/checked/background','decisions/color/text/primary'],
    ['component/checkbox/checked/text',      'decisions/color/text/inverse'],
    ['component/checkbox/error/border',      'decisions/color/feedback/error/icon'],
    // radio
    ['component/radio/border',       'decisions/color/border/control'],
    ['component/radio/dot-color',    'decisions/color/text/primary'],
    ['component/radio/error/border', 'decisions/color/feedback/error/icon'],
    // dropdown
    ['component/dropdown/background',          'decisions/color/surface/base'],
    ['component/dropdown/text',                'decisions/color/text/primary'],
    ['component/dropdown/placeholder',         'decisions/color/text/placeholder'],
    ['component/dropdown/border',              'decisions/color/border/control'],
    ['component/dropdown/menu/option-hover',   'decisions/color/surface/hover'],
    ['component/dropdown/menu/option-selected','decisions/color/surface/selected'],
    // tag
    ['component/tag/default/background', 'decisions/color/surface/selected'],
    ['component/tag/default/text',       'decisions/color/text/secondary'],
    ['component/tag/primary/background', 'decisions/color/text/primary'],
    ['component/tag/primary/text',       'decisions/color/text/inverse'],
    ['component/tag/success/background', 'decisions/color/feedback/success/surface'],
    ['component/tag/success/text',       'decisions/color/feedback/success/text'],
    ['component/tag/warning/background', 'decisions/color/feedback/warning/surface'],
    ['component/tag/warning/text',       'decisions/color/feedback/warning/text'],
    ['component/tag/danger/background',  'decisions/color/feedback/error/surface'],
    ['component/tag/danger/text',        'decisions/color/feedback/error/text'],
    ['component/tag/info/background',    'decisions/color/feedback/info/surface'],
    ['component/tag/info/text',          'decisions/color/feedback/info/text'],
    // avatar
    ['component/avatar/background', 'decisions/color/surface/avatar'],
    ['component/avatar/text',       'decisions/color/text/secondary'],
    // modal
    ['component/modal/background',            'decisions/color/surface/base'],
    ['component/modal/backdrop',              'decisions/color/overlay/backdrop'],
    ['component/modal/title/text',            'decisions/color/text/primary'],
    ['component/modal/body/text',             'decisions/color/text/body'],
    ['component/modal/close/text',            'decisions/color/text/subtle'],
    ['component/modal/close/background-hover','decisions/color/surface/selected'],
    // table
    ['component/table/background',        'decisions/color/surface/base'],
    ['component/table/border',            'decisions/color/border/subtle'],
    ['component/table/header/background', 'decisions/color/surface/subtle'],
    ['component/table/header/text',       'decisions/color/text/subtle'],
    ['component/table/cell/text',         'decisions/color/text/body'],
    ['component/table/cell/border',       'decisions/color/border/hairline'],
    ['component/table/row/hover',         'decisions/color/surface/row-hover'],
    ['component/table/empty/text',        'decisions/color/text/placeholder'],
    // list
    ['component/list/border',           'decisions/color/border/subtle'],
    ['component/list/divider',          'decisions/color/border/hairline'],
    ['component/list/item/text',        'decisions/color/text/primary'],
    ['component/list/item/description', 'decisions/color/text/muted'],
    ['component/list/item/meta',        'decisions/color/text/placeholder'],
    ['component/list/indicator/default','decisions/color/border/control'],
    ['component/list/indicator/info',   'decisions/color/feedback/info/text'],
    ['component/list/indicator/success','decisions/color/feedback/success/text'],
    ['component/list/indicator/warning','decisions/color/feedback/warning/text'],
    ['component/list/indicator/error',  'decisions/color/feedback/error/text'],
    // accordion
    ['component/accordion/border',       'decisions/color/border/hairline'],
    ['component/accordion/title/text',   'decisions/color/text/primary'],
    ['component/accordion/body/text',    'decisions/color/text/secondary'],
    ['component/accordion/chevron/color','decisions/color/text/subtle'],
    // breadcrumbs
    ['component/breadcrumbs/link/text',      'decisions/color/text/muted'],
    ['component/breadcrumbs/link/text-hover','decisions/color/text/primary'],
    ['component/breadcrumbs/current/text',   'decisions/color/text/primary'],
    ['component/breadcrumbs/separator',      'decisions/color/border/separator'],
    // header
    ['component/header/background',        'decisions/color/surface/base'],
    ['component/header/border',            'decisions/color/border/subtle'],
    ['component/header/brand/text',        'decisions/color/text/primary'],
    ['component/header/nav/text',          'decisions/color/text/secondary'],
    ['component/header/nav/background-hover','decisions/color/surface/hover'],
    ['component/header/cta/background',    'decisions/color/text/primary'],
    ['component/header/cta/text',          'decisions/color/text/inverse'],
    // footer
    ['component/footer/background',          'decisions/color/surface/base'],
    ['component/footer/border',              'decisions/color/border/subtle'],
    ['component/footer/brand/text',          'decisions/color/text/primary'],
    ['component/footer/tagline/text',        'decisions/color/text/subtle'],
    ['component/footer/column/heading/text', 'decisions/color/text/primary'],
    ['component/footer/column/link/text',    'decisions/color/text/muted'],
    ['component/footer/divider',             'decisions/color/border/hairline'],
    ['component/footer/copyright/text',      'decisions/color/text/placeholder'],
  ];
  for (const [n, r] of cmpColors) makeAliasColorVar(n, r, cmpColl, cmpMode, varMap);

  const cmpFloats = [
    ['component/button/border-radius',  'decisions/border-radius/lg'],
    ['component/button/border-width',   'decisions/border-width/control'],
    ['component/button/disabled/opacity','decisions/opacity/disabled'],
    ['component/input/border-radius',   'decisions/border-radius/lg'],
    ['component/input/border-width',    'decisions/border-width/control'],
    ['component/checkbox/border-radius','decisions/border-radius/sm'],
    ['component/checkbox/border-width', 'decisions/border-width/control'],
    ['component/dropdown/border-radius','decisions/border-radius/lg'],
    ['component/dropdown/border-width', 'decisions/border-width/control'],
    ['component/tag/border-radius',     'decisions/border-radius/sm'],
    ['component/modal/border-radius',   'decisions/border-radius/2xl'],
    ['component/modal/title/font-size', 'decisions/font-size/xl'],
    ['component/table/border-radius',   'decisions/border-radius/xl'],
    ['component/list/border-radius',    'decisions/border-radius/xl'],
    ['component/accordion/title/font-size',   'decisions/font-size/md'],
    ['component/accordion/title/font-weight', 'decisions/font-weight/medium'],
    ['component/breadcrumbs/link/font-size',  'decisions/font-size/sm'],
    ['component/header/brand/font-size',      'decisions/font-size/lg'],
    ['component/header/brand/font-weight',    'decisions/font-weight/semibold'],
    ['component/footer/brand/font-size',      'decisions/font-size/lg'],
    ['component/footer/brand/font-weight',    'decisions/font-weight/semibold'],
  ];
  for (const [n, r] of cmpFloats) makeAliasFloatVar(n, r, cmpColl, cmpMode, varMap);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. COMPONENT LIBRARY PAGE
  // ═══════════════════════════════════════════════════════════════════════════

  const vm = varMap; // short alias

  // ── Pages ──
  figma.currentPage.name = '🧩 Components';
  const tokPage = figma.createPage(); tokPage.name = '🎯 Design Tokens (reference)';
  const page = figma.currentPage;

  let cursorY = 0;
  const COL_GAP = 24;
  const ROW_GAP = 72;

  // ── Canvas helpers ──────────────────────────────────────────────────────

  function addToPage(node, x, y) { node.x = x; node.y = y; page.appendChild(node); return node; }

  // Section wrapper: title + one or more labelled variant rows
  // rows: Array<{ label?: string, items: SceneNode[] }>
  function makeSection(title, rows) {
    const wrap = figma.createFrame();
    wrap.name = title;
    wrap.layoutMode = 'VERTICAL';
    wrap.itemSpacing = 16;
    wrap.paddingLeft = wrap.paddingRight = 20;
    wrap.paddingTop = 14;
    wrap.paddingBottom = 20;
    wrap.primaryAxisSizingMode = 'AUTO';
    wrap.counterAxisSizingMode = 'AUTO';
    wrap.fills = [{ type: 'SOLID', color: hex('#fafafa') }];
    wrap.strokes = [{ type: 'SOLID', color: hex('#e8e8e8') }];
    wrap.strokeWeight = 1;
    wrap.cornerRadius = 8;

    const titleNode = figma.createText();
    titleNode.characters = title.toUpperCase();
    titleNode.fontSize = 10;
    titleNode.fontName = { family: 'Inter', style: 'Semi Bold' };
    titleNode.fills = [boundPaint(vm.get('decisions/color/text/subtle'))];
    titleNode.letterSpacing = { value: 10, unit: 'PERCENT' };
    wrap.appendChild(titleNode);

    for (const row of rows) {
      const rowWrap = autoFrame('row', 'VERTICAL', 6, 0, 0);
      if (row.label) {
        const sub = figma.createText();
        sub.characters = row.label;
        sub.fontSize = 11;
        sub.fontName = { family: 'Inter', style: 'Regular' };
        sub.fills = [boundPaint(vm.get('decisions/color/text/placeholder'))];
        rowWrap.appendChild(sub);
      }
      const itemsRow = autoFrame('items', 'HORIZONTAL', COL_GAP, 0, 0);
      itemsRow.counterAxisAlignItems = 'MIN';
      for (const item of row.items) itemsRow.appendChild(item);
      rowWrap.appendChild(itemsRow);
      wrap.appendChild(rowWrap);
    }
    return wrap;
  }

  function applyRadius(node, r) { node.cornerRadius = r; }
  function applyStroke(node, variable, weight) {
    node.strokes = [boundPaint(variable)];
    node.strokeWeight = weight;
    node.strokeAlign = 'INSIDE';
  }
  function applyFill(node, variable) { node.fills = [boundPaint(variable)]; }

  // A thin 1-px horizontal line used as a row divider (avoids per-side stroke APIs)
  function makeDivider(width, variable) {
    const r = figma.createRectangle();
    r.name = 'divider';
    r.resize(width, 1);
    r.fills = [boundPaint(variable)];
    r.strokes = [];
    return r;
  }

  // ─── BUTTON ──────────────────────────────────────────────────────────────
  // Returns a Frame (not Component) so it can be safely nested anywhere.

  function makeBtn(label, variant, size) {
    size = size || 'md';
    const padH     = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
    const padV     = size === 'sm' ?  6 : size === 'lg' ? 10 :  8;
    const fontSize = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
    const f = autoFrame('btn', 'HORIZONTAL', 6, padH, padV);
    f.name = variant + '-' + size;
    f.counterAxisAlignItems = 'CENTER';
    applyRadius(f, 6);

    const styleMap = {
      primary:   { bg: 'component/button/primary/background',   text: 'component/button/primary/text',   border: 'component/button/primary/border' },
      secondary: { bg: 'component/button/secondary/background', text: 'component/button/secondary/text', border: 'component/button/secondary/border' },
      ghost:     { bg: null,                                     text: 'component/button/ghost/text',     border: null },
      danger:    { bg: 'component/button/danger/background',    text: 'component/button/danger/text',    border: 'component/button/danger/border' },
    };
    const s = styleMap[variant];
    if (s.bg) applyFill(f, vm.get(s.bg)); else f.fills = noFill();
    if (s.border) applyStroke(f, vm.get(s.border), 1.5); else f.strokes = [];

    f.appendChild(addLabel(label, 14, 'Medium', vm.get(s.text)));
    return f;
  }

  // ─── INPUT ───────────────────────────────────────────────────────────────
  // variant: 'default' | 'hint' | 'error' | 'disabled' | 'password'
  function makeInput(variant) {
    const wrapper = autoFrame('input', 'VERTICAL', 5, 0, 0);
    wrapper.name = variant;

    const isDisabled = variant === 'disabled';
    const isError    = variant === 'error';
    const isHint     = variant === 'hint';
    const isPassword = variant === 'password';

    const labelText =
      isError    ? 'Email' :
      isHint     ? 'Username' :
      isPassword ? 'Password' :
      'Full name';
    const labelColor = isDisabled
      ? vm.get('component/input/disabled/text')
      : vm.get('decisions/color/text/primary');
    wrapper.appendChild(addLabel(labelText, 13, 'Medium', labelColor));

    const field = autoFrame('field', 'HORIZONTAL', 0, 12, 8);
    field.resize(220, 1);
    field.primaryAxisSizingMode = 'FIXED';
    field.counterAxisSizingMode = 'AUTO';
    applyRadius(field, 6);
    applyFill(field, isDisabled
      ? vm.get('component/input/disabled/background')
      : vm.get('component/input/background'));
    applyStroke(field, isError
      ? vm.get('component/input/error/border')
      : vm.get('component/input/border'), 1.5);

    const placeholder =
      isError    ? 'you@example.com' :
      isHint     ? 'e.g. john_doe' :
      isPassword ? '••••••••' :
      'Enter your name';
    field.appendChild(addLabel(
      placeholder, 14, 'Regular',
      isDisabled ? vm.get('component/input/disabled/text') : vm.get('component/input/placeholder')
    ));
    wrapper.appendChild(field);

    if (isHint) {
      wrapper.appendChild(addLabel('Only letters, numbers and underscores.', 12, 'Regular', vm.get('decisions/color/text/subtle')));
    }
    if (isError) {
      wrapper.appendChild(addLabel('Please enter a valid email address.', 12, 'Regular', vm.get('decisions/color/feedback/error/text')));
    }
    return wrapper;
  }

  // ─── CHECKBOX ────────────────────────────────────────────────────────────
  // state: 'unchecked' | 'checked' | 'hint' | 'error' | 'disabled' | 'disabled-checked'
  function makeCheckbox(state) {
    const root = autoFrame('checkbox', 'VERTICAL', 4, 0, 0);
    root.name = state;

    const isChecked  = state === 'checked' || state === 'disabled-checked';
    const isDisabled = state === 'disabled' || state === 'disabled-checked';
    const isError    = state === 'error';

    const row = autoFrame('row', 'HORIZONTAL', 9, 0, 0);
    row.counterAxisAlignItems = 'CENTER';

    const box = figma.createFrame();
    box.name = 'box';
    box.resize(16, 16);
    applyRadius(box, 4);

    if (isChecked) {
      applyFill(box, vm.get('component/checkbox/checked/background'));
      applyStroke(box, vm.get('component/checkbox/checked/background'), 1.5);
      box.layoutMode = 'HORIZONTAL';
      box.primaryAxisAlignItems = 'CENTER';
      box.counterAxisAlignItems = 'CENTER';
      box.primaryAxisSizingMode = 'FIXED';
      box.counterAxisSizingMode = 'FIXED';
      box.appendChild(addLabel('✓', 11, 'Semi Bold', vm.get('component/checkbox/checked/text')));
    } else if (isError) {
      applyFill(box, vm.get('decisions/color/surface/base'));
      applyStroke(box, vm.get('component/checkbox/error/border'), 1.5);
    } else {
      applyFill(box, vm.get('decisions/color/surface/base'));
      applyStroke(box, vm.get('component/checkbox/border'), 1.5);
    }

    row.appendChild(box);
    const labelStr =
      state === 'disabled-checked' ? 'Already enabled' :
      state === 'disabled'         ? 'This option is unavailable' :
      state === 'hint'             ? 'Enable notifications' :
      state === 'error'            ? 'Accept terms and conditions' :
      state === 'checked'          ? 'Subscribe to newsletter' :
      'Accept terms and conditions';
    row.appendChild(addLabel(labelStr, 14, 'Regular',
      isDisabled ? vm.get('decisions/color/text/placeholder') : vm.get('decisions/color/text/primary')
    ));
    root.appendChild(row);

    if (isDisabled) root.opacity = 0.5;
    if (state === 'hint') {
      root.appendChild(addLabel('You can change this in settings at any time.', 12, 'Regular', vm.get('decisions/color/text/subtle')));
    }
    if (isError) {
      root.appendChild(addLabel('You must accept the terms to continue.', 12, 'Regular', vm.get('decisions/color/feedback/error/text')));
    }
    return root;
  }

  // ─── RADIO GROUP ─────────────────────────────────────────────────────────
  // variant: 'default' | 'inline' | 'error' | 'disabled'
  function makeRadioGroup(variant) {
    const root = autoFrame('radio-group', 'VERTICAL', 10, 0, 0);
    root.name = variant;

    const isInline   = variant === 'inline';
    const isError    = variant === 'error';
    const isDisabled = variant === 'disabled';

    root.appendChild(addLabel(isInline ? 'Appearance' : 'Choose a plan', 13, 'Medium', vm.get('decisions/color/text/primary')));

    const opts = isInline
      ? [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]
      : [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }];
    const selectedVal = isInline ? 'system' : 'free';

    const groupFrame = autoFrame('options', isInline ? 'HORIZONTAL' : 'VERTICAL', 10, 0, 0);
    groupFrame.counterAxisAlignItems = 'MIN';

    for (const opt of opts) {
      const item = autoFrame('option', 'HORIZONTAL', 9, 0, 0);
      item.counterAxisAlignItems = 'CENTER';

      const circle = figma.createEllipse();
      circle.resize(16, 16);
      circle.strokeWeight = 1.5;
      circle.strokeAlign = 'INSIDE';
      applyFill(circle, vm.get('decisions/color/surface/base'));
      applyStroke(circle, isError ? vm.get('component/radio/error/border') : vm.get('component/radio/border'), 1.5);

      if (opt.value === selectedVal) {
        const container = figma.createFrame();
        container.resize(16, 16);
        container.fills = noFill();
        container.strokes = [];
        container.clipsContent = false;
        container.appendChild(circle);
        const dot = figma.createEllipse();
        dot.resize(8, 8);
        dot.x = 4; dot.y = 4;
        applyFill(dot, vm.get('component/radio/dot-color'));
        dot.strokes = [];
        container.appendChild(dot);
        item.appendChild(container);
      } else {
        item.appendChild(circle);
      }
      item.appendChild(addLabel(opt.label, 14, 'Regular', vm.get('decisions/color/text/primary')));
      groupFrame.appendChild(item);
    }
    root.appendChild(groupFrame);

    if (isError) {
      root.appendChild(addLabel('Please select a plan to continue.', 12, 'Regular', vm.get('decisions/color/feedback/error/text')));
    }
    if (isDisabled) root.opacity = 0.42;
    return root;
  }

  // ─── DROPDOWN ────────────────────────────────────────────────────────────
  // variant: 'default' | 'withValue' | 'hint' | 'error' | 'disabled'
  function makeDropdown(variant) {
    const wrapper = autoFrame('dropdown', 'VERTICAL', 5, 0, 0);
    wrapper.name = variant;

    const isDisabled = variant === 'disabled';
    const isError    = variant === 'error';
    const isHint     = variant === 'hint';
    const hasValue   = variant === 'withValue';

    wrapper.appendChild(addLabel('Country', 13, 'Medium',
      isDisabled ? vm.get('component/input/disabled/text') : vm.get('decisions/color/text/primary')
    ));

    const trigger = autoFrame('trigger', 'HORIZONTAL', 8, 12, 10);
    trigger.resize(220, 1);
    trigger.primaryAxisSizingMode = 'FIXED';
    trigger.counterAxisSizingMode = 'AUTO';
    trigger.counterAxisAlignItems = 'CENTER';
    applyRadius(trigger, 6);
    applyFill(trigger, isDisabled
      ? vm.get('component/input/disabled/background')
      : vm.get('component/dropdown/background'));
    applyStroke(trigger, isError
      ? vm.get('component/input/error/border')
      : vm.get('component/dropdown/border'), 1.5);

    const valueText = hasValue ? 'Germany' : 'Select a country';
    const textVar = hasValue
      ? vm.get('component/dropdown/text')
      : (isDisabled ? vm.get('component/input/disabled/text') : vm.get('component/dropdown/placeholder'));
    const ph = addLabel(valueText, 14, 'Regular', textVar);
    ph.layoutGrow = 1;
    trigger.appendChild(ph);
    trigger.appendChild(addLabel('▾', 12, 'Regular', vm.get('decisions/color/text/subtle')));
    wrapper.appendChild(trigger);

    if (isHint) {
      wrapper.appendChild(addLabel('This will be used for billing purposes.', 12, 'Regular', vm.get('decisions/color/text/subtle')));
    }
    if (isError) {
      wrapper.appendChild(addLabel('Please select a country.', 12, 'Regular', vm.get('decisions/color/feedback/error/text')));
    }
    if (isDisabled) wrapper.opacity = 0.5;
    return wrapper;
  }

  // ─── TAG ─────────────────────────────────────────────────────────────────
  function makeTag(variant, size) {
    size = size || 'md';
    const padH     = size === 'sm' ? 6 : 9;
    const padV     = size === 'sm' ? 2 : 3;
    const fontSize = size === 'sm' ? 11 : 12;
    const f = autoFrame('tag', 'HORIZONTAL', 0, padH, padV);
    f.name = variant + '-' + size;
    applyRadius(f, 4);
    applyFill(f, vm.get('component/tag/' + variant + '/background'));
    f.appendChild(addLabel(
      variant.charAt(0).toUpperCase() + variant.slice(1),
      fontSize, 'Medium',
      vm.get('component/tag/' + variant + '/text')
    ));
    return f;
  }

  // ─── AVATAR ──────────────────────────────────────────────────────────────
  function makeAvatar(size, shape) {
    shape = shape || 'circle';
    const dim      = { xs: 24, sm: 32, md: 40, lg: 52, xl: 68 }[size];
    const fontSize = { xs:  9, sm: 12, md: 14, lg: 18, xl: 22 }[size];
    const f = figma.createFrame();
    f.name = size + '-' + shape;
    f.resize(dim, dim);
    f.cornerRadius = shape === 'circle' ? 9999 : Math.round(dim * 0.2);
    applyFill(f, vm.get('component/avatar/background'));
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisAlignItems = 'CENTER';
    f.counterAxisAlignItems = 'CENTER';
    f.primaryAxisSizingMode = 'FIXED';
    f.counterAxisSizingMode = 'FIXED';
    f.appendChild(addLabel('AB', fontSize, 'Semi Bold', vm.get('component/avatar/text')));
    return f;
  }

  cursorY = 0;

  // ─── BUTTON section ──────────────────────────────────────────────────────
  {
    const disabledBtn = makeBtn('Disabled', 'primary');
    disabledBtn.opacity = 0.42;

    const loadingBtn = autoFrame('btn-loading', 'HORIZONTAL', 6, 16, 8);
    loadingBtn.counterAxisAlignItems = 'CENTER';
    applyRadius(loadingBtn, 6);
    applyFill(loadingBtn, vm.get('component/button/primary/background'));
    applyStroke(loadingBtn, vm.get('component/button/primary/border'), 1.5);
    loadingBtn.appendChild(addLabel('⟳', 14, 'Regular', vm.get('component/button/primary/text')));
    loadingBtn.appendChild(addLabel('Saving…', 14, 'Medium', vm.get('component/button/primary/text')));

    const s = makeSection('Button', [
      {
        label: 'Variants',
        items: [
          makeBtn('Primary', 'primary'),
          makeBtn('Secondary', 'secondary'),
          makeBtn('Ghost', 'ghost'),
          makeBtn('Danger', 'danger'),
        ],
      },
      {
        label: 'Sizes',
        items: [
          makeBtn('Small', 'primary', 'sm'),
          makeBtn('Medium', 'primary', 'md'),
          makeBtn('Large', 'primary', 'lg'),
        ],
      },
      {
        label: 'States',
        items: [makeBtn('Default', 'primary'), disabledBtn, loadingBtn],
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── INPUT section ───────────────────────────────────────────────────────
  {
    const s = makeSection('Input', [
      {
        label: 'States',
        items: ['default', 'hint', 'error', 'disabled', 'password'].map(v => makeInput(v)),
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── CHECKBOX section ────────────────────────────────────────────────────
  {
    const s = makeSection('Checkbox', [
      {
        label: 'States',
        items: ['unchecked', 'checked', 'disabled', 'disabled-checked'].map(v => makeCheckbox(v)),
      },
      {
        label: 'With hint & error',
        items: [makeCheckbox('hint'), makeCheckbox('error')],
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── RADIO section ───────────────────────────────────────────────────────
  {
    const s = makeSection('Radio', [
      {
        label: 'Variants',
        items: ['default', 'inline', 'error', 'disabled'].map(v => makeRadioGroup(v)),
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── DROPDOWN section ────────────────────────────────────────────────────
  {
    const s = makeSection('Dropdown', [
      {
        label: 'States',
        items: ['default', 'withValue', 'hint', 'error', 'disabled'].map(v => makeDropdown(v)),
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── TAG section ─────────────────────────────────────────────────────────
  {
    const allVariants = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
    const s = makeSection('Tag', [
      {
        label: 'Variants (md)',
        items: allVariants.map(v => makeTag(v, 'md')),
      },
      {
        label: 'Sizes',
        items: [makeTag('primary', 'sm'), makeTag('primary', 'md')],
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── AVATAR section ───────────────────────────────────────────────────────
  {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    const s = makeSection('Avatar', [
      {
        label: 'Circle',
        items: sizes.map(sz => makeAvatar(sz, 'circle')),
      },
      {
        label: 'Rounded square',
        items: sizes.map(sz => makeAvatar(sz, 'rounded')),
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── MODAL section ───────────────────────────────────────────────────────
  {
    function makeModal(size) {
      const W = { sm: 360, md: 480, lg: 640 }[size];
      const modal = autoFrame('modal-' + size, 'VERTICAL', 0, 0, 0);
      modal.resize(W, 1);
      modal.primaryAxisSizingMode = 'AUTO';
      modal.counterAxisSizingMode = 'FIXED';
      applyRadius(modal, 10);
      modal.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.14 }, offset: { x: 0, y: 8 }, radius: 32, spread: 0, visible: true, blendMode: 'NORMAL' }];
      applyFill(modal, vm.get('component/modal/background'));

      // header
      const mHeader = autoFrame('header', 'HORIZONTAL', 0, 20, 20);
      mHeader.resize(W, 1);
      mHeader.primaryAxisSizingMode = 'FIXED';
      mHeader.counterAxisSizingMode = 'AUTO';
      mHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
      mHeader.counterAxisAlignItems = 'CENTER';
      mHeader.paddingBottom = 0;
      const mTitle = addLabel(
        size === 'sm' ? 'Session expired' : size === 'lg' ? 'Edit profile' : 'Confirm action',
        16, 'Semi Bold', vm.get('component/modal/title/text')
      );
      mTitle.layoutGrow = 1;
      mHeader.appendChild(mTitle);
      const closeBtn = autoFrame('close', 'HORIZONTAL', 0, 6, 6);
      applyRadius(closeBtn, 5);
      closeBtn.primaryAxisAlignItems = 'CENTER';
      closeBtn.counterAxisAlignItems = 'CENTER';
      closeBtn.appendChild(addLabel('✕', 14, 'Regular', vm.get('component/modal/close/text')));
      mHeader.appendChild(closeBtn);
      modal.appendChild(mHeader);

      // body
      const mBody = autoFrame('body', 'VERTICAL', 0, 20, 16);
      mBody.resize(W, 1);
      mBody.primaryAxisSizingMode = 'AUTO';
      mBody.counterAxisSizingMode = 'FIXED';
      mBody.paddingTop = 0;
      const bodyText = addLabel(
        size === 'sm'
          ? 'Your session has expired. Please sign in again to continue.'
          : size === 'lg'
            ? 'Update your profile information below. Changes will be saved immediately.'
            : 'Are you sure you want to delete this item? This action cannot be undone.',
        14, 'Regular', vm.get('component/modal/body/text')
      );
      bodyText.textAutoResize = 'WIDTH_AND_HEIGHT';
      mBody.appendChild(bodyText);
      modal.appendChild(mBody);

      // footer
      const mFooter = autoFrame('footer', 'HORIZONTAL', 8, 20, 20);
      mFooter.primaryAxisAlignItems = 'MAX';
      mFooter.paddingTop = 0;
      if (size !== 'sm') mFooter.appendChild(makeBtn('Cancel', 'secondary'));
      const ctaLabel   = size === 'sm' ? 'Sign in'      : size === 'lg' ? 'Save changes' : 'Delete';
      const ctaVariant = size === 'lg' ? 'primary' : size === 'sm' ? 'primary' : 'danger';
      mFooter.appendChild(makeBtn(ctaLabel, ctaVariant));
      modal.appendChild(mFooter);
      return modal;
    }

    const s = makeSection('Modal', [
      { label: 'Small (sm)',  items: [makeModal('sm')] },
      { label: 'Medium (md)', items: [makeModal('md')] },
      { label: 'Large (lg)',  items: [makeModal('lg')] },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── TABLE section ───────────────────────────────────────────────────────
  {
    function makeTable(variant) {
      const TABLE_W = 560;
      const dataCols = ['Name', 'Role', 'Status', 'Joined'];
      const dataRows = [
        ['Alice Brown',  'Admin',  'Active',   'Jan 2024'],
        ['Bob Smith',    'Editor', 'Active',   'Mar 2024'],
        ['Carol White',  'Viewer', 'Inactive', 'Jun 2024'],
        ['Dan Torres',   'Editor', 'Pending',  'Aug 2024'],
      ];
      const COL_W = TABLE_W / dataCols.length;
      const statusTag = { Active: 'success', Inactive: 'default', Pending: 'warning' };

      const tableWrap = autoFrame('table-' + variant, 'VERTICAL', 0, 0, 0);
      tableWrap.resize(TABLE_W, 1);
      tableWrap.primaryAxisSizingMode = 'AUTO';
      tableWrap.counterAxisSizingMode = 'FIXED';
      applyRadius(tableWrap, 8);
      applyFill(tableWrap, vm.get('component/table/background'));
      applyStroke(tableWrap, vm.get('component/table/border'), 1);
      tableWrap.clipsContent = true;

      // header row
      const tHead = autoFrame('thead', 'HORIZONTAL', 0, 0, 0);
      tHead.resize(TABLE_W, 1);
      tHead.primaryAxisSizingMode = 'FIXED';
      tHead.counterAxisSizingMode = 'AUTO';
      applyFill(tHead, vm.get('component/table/header/background'));
      for (const col of dataCols) {
        const th = autoFrame('th', 'HORIZONTAL', 0, 16, 10);
        th.resize(COL_W, 1);
        th.primaryAxisSizingMode = 'FIXED';
        th.counterAxisSizingMode = 'AUTO';
        const thText = addLabel(col.toUpperCase(), 11, 'Semi Bold', vm.get('component/table/header/text'));
        thText.letterSpacing = { value: 6, unit: 'PERCENT' };
        th.appendChild(thText);
        tHead.appendChild(th);
      }
      tableWrap.appendChild(tHead);
      tableWrap.appendChild(makeDivider(TABLE_W, vm.get('component/table/border')));

      if (variant === 'empty') {
        const emptyRow = autoFrame('empty', 'HORIZONTAL', 0, 0, 20);
        emptyRow.resize(TABLE_W, 1);
        emptyRow.primaryAxisSizingMode = 'FIXED';
        emptyRow.counterAxisSizingMode = 'AUTO';
        emptyRow.primaryAxisAlignItems = 'CENTER';
        emptyRow.appendChild(addLabel('No users found.', 14, 'Regular', vm.get('component/table/header/text')));
        tableWrap.appendChild(emptyRow);
      } else {
        for (let ri = 0; ri < dataRows.length; ri++) {
          if (ri > 0) tableWrap.appendChild(makeDivider(TABLE_W, vm.get('component/table/cell/border')));
          const tRow = autoFrame('tr', 'HORIZONTAL', 0, 0, 0);
          tRow.resize(TABLE_W, 1);
          tRow.primaryAxisSizingMode = 'FIXED';
          tRow.counterAxisSizingMode = 'AUTO';
          applyFill(tRow, (variant === 'striped' && ri % 2 === 1)
            ? vm.get('component/table/header/background')
            : vm.get('component/table/background'));

          for (let ci = 0; ci < dataRows[ri].length; ci++) {
            const cell = dataRows[ri][ci];
            const td = autoFrame('td', 'HORIZONTAL', 0, 16, 12);
            td.resize(COL_W, 1);
            td.primaryAxisSizingMode = 'FIXED';
            td.counterAxisSizingMode = 'AUTO';
            td.counterAxisAlignItems = 'CENTER';
            if (ci === 2 && variant === 'default') {
              td.appendChild(makeTag(statusTag[cell] || 'default', 'sm'));
            } else {
              td.appendChild(addLabel(cell, 14, 'Regular', vm.get('component/table/cell/text')));
            }
            tRow.appendChild(td);
          }
          tableWrap.appendChild(tRow);
        }
      }
      return tableWrap;
    }

    const s = makeSection('Table', [
      { label: 'Default',  items: [makeTable('default')] },
      { label: 'Striped',  items: [makeTable('striped')] },
      { label: 'Empty',    items: [makeTable('empty')]   },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── LIST section ────────────────────────────────────────────────────────
  {
    function makeList(variant) {
      const LIST_W = 400;
      const listWrap = autoFrame('list-' + variant, 'VERTICAL', 0, 0, 0);
      listWrap.resize(LIST_W, 1);
      listWrap.primaryAxisSizingMode = 'AUTO';
      listWrap.counterAxisSizingMode = 'FIXED';
      applyRadius(listWrap, 8);
      applyFill(listWrap, vm.get('decisions/color/surface/base'));
      applyStroke(listWrap, vm.get('component/list/border'), 1);
      listWrap.clipsContent = true;

      if (variant === 'simple') {
        const items = [
          { label: 'Project created',        desc: 'The repository was initialised with a default branch.'    },
          { label: 'CI pipeline configured', desc: 'GitHub Actions workflow added to the project.'             },
          { label: 'First commit pushed',    desc: 'Initial codebase committed to the main branch.'            },
          { label: 'Code review requested',  desc: 'Pull request #1 opened and review assigned.'               },
        ];
        for (let i = 0; i < items.length; i++) {
          if (i > 0) listWrap.appendChild(makeDivider(LIST_W, vm.get('component/list/divider')));
          const li = autoFrame('li', 'VERTICAL', 3, 16, 12);
          li.resize(LIST_W, 1);
          li.primaryAxisSizingMode = 'AUTO';
          li.counterAxisSizingMode = 'FIXED';
          li.appendChild(addLabel(items[i].label, 14, 'Medium',  vm.get('component/list/item/text')));
          li.appendChild(addLabel(items[i].desc,  13, 'Regular', vm.get('component/list/item/description')));
          listWrap.appendChild(li);
        }
      } else if (variant === 'activity') {
        const items = [
          { label: 'Deployment succeeded', desc: 'Production deployed from commit a3f92b1 by alice.', meta: '2 min ago',  dot: 'success' },
          { label: 'Build started',        desc: 'Running test suite and static analysis.',           meta: '4 min ago',  dot: 'info'    },
          { label: 'Linting warning',      desc: '3 unused variables detected in src/utils.ts.',     meta: '5 min ago',  dot: 'warning' },
          { label: 'Test run failed',      desc: '2 of 48 unit tests failed — ButtonComponent.',     meta: '12 min ago', dot: 'error'   },
          { label: 'PR merged',            desc: 'feat: add checkbox merged into main.',              meta: '1 hr ago',   dot: 'default' },
        ];
        const dotKeys = {
          success: 'component/list/indicator/success',
          info:    'component/list/indicator/info',
          warning: 'component/list/indicator/warning',
          error:   'component/list/indicator/error',
          default: 'component/list/indicator/default',
        };
        for (let i = 0; i < items.length; i++) {
          if (i > 0) listWrap.appendChild(makeDivider(LIST_W, vm.get('component/list/divider')));
          const item = items[i];
          const li = autoFrame('li', 'HORIZONTAL', 12, 16, 12);
          li.resize(LIST_W, 1);
          li.primaryAxisSizingMode = 'FIXED';
          li.counterAxisSizingMode = 'AUTO';
          li.counterAxisAlignItems = 'CENTER';

          const dot = figma.createEllipse();
          dot.resize(8, 8);
          applyFill(dot, vm.get(dotKeys[item.dot]));
          dot.strokes = [];
          li.appendChild(dot);

          const body = autoFrame('body', 'VERTICAL', 3, 0, 0);
          body.layoutGrow = 1;
          const labelRow = autoFrame('label-row', 'HORIZONTAL', 0, 0, 0);
          labelRow.primaryAxisSizingMode = 'FIXED';
          labelRow.resize(LIST_W - 16 * 2 - 8 - 12, 1);
          labelRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
          const lbl = addLabel(item.label, 14, 'Medium', vm.get('component/list/item/text'));
          lbl.layoutGrow = 1;
          labelRow.appendChild(lbl);
          labelRow.appendChild(addLabel(item.meta, 11, 'Regular', vm.get('component/list/item/meta')));
          body.appendChild(labelRow);
          body.appendChild(addLabel(item.desc, 13, 'Regular', vm.get('component/list/item/description')));
          li.appendChild(body);
          listWrap.appendChild(li);
        }
      } else if (variant === 'compact') {
        const items = [
          { label: 'node_modules excluded',     dot: 'default' },
          { label: 'dist/ excluded',            dot: 'default' },
          { label: '.storybook/ tracked',       dot: 'success' },
          { label: 'package-lock.json tracked', dot: 'success' },
          { label: '.env missing',              dot: 'error'   },
        ];
        for (let i = 0; i < items.length; i++) {
          if (i > 0) listWrap.appendChild(makeDivider(LIST_W, vm.get('component/list/divider')));
          const item = items[i];
          const li = autoFrame('li', 'HORIZONTAL', 10, 16, 8);
          li.resize(LIST_W, 1);
          li.primaryAxisSizingMode = 'FIXED';
          li.counterAxisSizingMode = 'AUTO';
          li.counterAxisAlignItems = 'CENTER';
          const dot = figma.createEllipse();
          dot.resize(7, 7);
          applyFill(dot, vm.get(
            item.dot === 'success' ? 'component/list/indicator/success' :
            item.dot === 'error'   ? 'component/list/indicator/error'   :
            'component/list/indicator/default'
          ));
          dot.strokes = [];
          li.appendChild(dot);
          li.appendChild(addLabel(item.label, 13, 'Regular', vm.get('component/list/item/text')));
          listWrap.appendChild(li);
        }
      }
      return listWrap;
    }

    const s = makeSection('List', [
      { label: 'Simple',       items: [makeList('simple')]   },
      { label: 'Activity log', items: [makeList('activity')] },
      { label: 'Compact',      items: [makeList('compact')]  },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── ACCORDION section ───────────────────────────────────────────────────
  {
    function makeAccordion(variant) {
      const ACC_W = 460;
      const accordionWrap = autoFrame('accordion-' + variant, 'VERTICAL', 0, 0, 0);
      accordionWrap.resize(ACC_W, 1);
      accordionWrap.primaryAxisSizingMode = 'AUTO';
      accordionWrap.counterAxisSizingMode = 'FIXED';
      applyFill(accordionWrap, vm.get('decisions/color/surface/base'));
      applyStroke(accordionWrap, vm.get('component/accordion/border'), 1);
      applyRadius(accordionWrap, 8);
      accordionWrap.clipsContent = true;

      const accData = [
        { title: 'What is a design system?',       body: 'A design system is a collection of reusable components guided by clear standards.',           open: variant === 'expanded' },
        { title: 'How do design tokens work?',     body: 'Tokens store raw values (colours, spacing, fonts) as variables that components consume.',     open: false },
        { title: 'Can I customise the components?', body: 'Yes — override tokens at the decision tier to retheme the entire system.',                   open: false },
      ];

      for (let i = 0; i < accData.length; i++) {
        if (i > 0) accordionWrap.appendChild(makeDivider(ACC_W, vm.get('component/accordion/border')));
        const acc = accData[i];
        const item = autoFrame('item', 'VERTICAL', 0, 0, 0);
        item.resize(ACC_W, 1);
        item.primaryAxisSizingMode = 'AUTO';
        item.counterAxisSizingMode = 'FIXED';
        item.fills = noFill();

        const trigger = autoFrame('trigger', 'HORIZONTAL', 12, 20, 16);
        trigger.resize(ACC_W, 1);
        trigger.primaryAxisSizingMode = 'FIXED';
        trigger.counterAxisSizingMode = 'AUTO';
        trigger.primaryAxisAlignItems = 'SPACE_BETWEEN';
        trigger.counterAxisAlignItems = 'CENTER';
        trigger.fills = noFill();
        const titleText = addLabel(acc.title, 14, 'Medium', vm.get('component/accordion/title/text'));
        titleText.layoutGrow = 1;
        trigger.appendChild(titleText);
        trigger.appendChild(addLabel(acc.open ? '▲' : '▼', 10, 'Regular', vm.get('component/accordion/chevron/color')));
        item.appendChild(trigger);

        if (acc.open) {
          const body = autoFrame('body', 'VERTICAL', 0, 20, 16);
          body.paddingTop = 0;
          body.resize(ACC_W, 1);
          body.primaryAxisSizingMode = 'AUTO';
          body.counterAxisSizingMode = 'FIXED';
          body.fills = noFill();
          const bodyText = addLabel(acc.body, 14, 'Regular', vm.get('component/accordion/body/text'));
          bodyText.textAutoResize = 'WIDTH_AND_HEIGHT';
          body.appendChild(bodyText);
          item.appendChild(body);
        }
        accordionWrap.appendChild(item);
      }
      return accordionWrap;
    }

    const s = makeSection('Accordion', [
      { label: 'Collapsed',                   items: [makeAccordion('collapsed')] },
      { label: 'Expanded (first item open)',  items: [makeAccordion('expanded')]  },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── BREADCRUMBS section ─────────────────────────────────────────────────
  {
    function makeBreadcrumbs(items) {
      const bcWrap = autoFrame('breadcrumbs', 'HORIZONTAL', 4, 0, 0);
      bcWrap.counterAxisAlignItems = 'CENTER';
      for (let i = 0; i < items.length; i++) {
        if (i > 0) bcWrap.appendChild(addLabel('/', 13, 'Regular', vm.get('component/breadcrumbs/separator')));
        const item = items[i];
        bcWrap.appendChild(addLabel(
          item.label, 13,
          item.current ? 'Medium' : 'Regular',
          vm.get(item.current ? 'component/breadcrumbs/current/text' : 'component/breadcrumbs/link/text')
        ));
      }
      return bcWrap;
    }

    const s = makeSection('Breadcrumbs', [
      {
        label: 'Default',
        items: [makeBreadcrumbs([
          { label: 'Home', current: false },
          { label: 'Products', current: false },
          { label: 'Design System', current: true },
        ])],
      },
      {
        label: 'Shallow',
        items: [makeBreadcrumbs([
          { label: 'Home', current: false },
          { label: 'Blog', current: true },
        ])],
      },
      {
        label: 'Deep',
        items: [makeBreadcrumbs([
          { label: 'Home', current: false },
          { label: 'Docs', current: false },
          { label: 'Components', current: false },
          { label: 'Button', current: true },
        ])],
      },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── HEADER section ───────────────────────────────────────────────────────
  {
    function makeHeader(variant) {
      const HEADER_W = 900;
      const header = autoFrame('header-' + variant, 'HORIZONTAL', 0, 24, 0);
      header.resize(HEADER_W, 56);
      header.primaryAxisSizingMode = 'FIXED';
      header.counterAxisSizingMode = 'FIXED';
      header.counterAxisAlignItems = 'CENTER';
      header.primaryAxisAlignItems = 'SPACE_BETWEEN';
      applyFill(header, vm.get('component/header/background'));
      applyStroke(header, vm.get('component/header/border'), 1);

      header.appendChild(addLabel('Blueprint', 15, 'Semi Bold', vm.get('component/header/brand/text')));

      if (variant === 'default' || variant === 'navOnly') {
        const nav = autoFrame('nav', 'HORIZONTAL', 4, 0, 0);
        nav.counterAxisAlignItems = 'CENTER';
        nav.layoutGrow = 1;
        nav.paddingLeft = 32;
        for (const item of ['Home', 'Products', 'Pricing', 'Docs']) {
          nav.appendChild(addLabel(item, 14, 'Regular', vm.get('component/header/nav/text')));
        }
        header.appendChild(nav);
      } else {
        const spacer = autoFrame('spacer', 'HORIZONTAL', 0, 0, 0);
        spacer.layoutGrow = 1;
        spacer.fills = noFill();
        header.appendChild(spacer);
      }

      if (variant === 'default') {
        const cta = autoFrame('cta', 'HORIZONTAL', 0, 16, 8);
        applyRadius(cta, 6);
        applyFill(cta, vm.get('component/header/cta/background'));
        cta.appendChild(addLabel('Get started', 14, 'Medium', vm.get('component/header/cta/text')));
        header.appendChild(cta);
      }
      return header;
    }

    const s = makeSection('Header', [
      { label: 'Default (nav + cta)', items: [makeHeader('default')]  },
      { label: 'Logo only',           items: [makeHeader('logoOnly')] },
      { label: 'Nav, no CTA',         items: [makeHeader('navOnly')]  },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ─── FOOTER section ───────────────────────────────────────────────────────
  {
    function makeFooter(variant) {
      const FOOTER_W = 900;
      const isMinimal = variant === 'minimal';
      const footer = autoFrame('footer-' + variant, 'VERTICAL', isMinimal ? 0 : 40, 24, isMinimal ? 24 : 40);
      footer.resize(FOOTER_W, 1);
      footer.primaryAxisSizingMode = 'AUTO';
      footer.counterAxisSizingMode = 'FIXED';
      applyFill(footer, vm.get('component/footer/background'));
      applyStroke(footer, vm.get('component/footer/border'), 1);

      if (!isMinimal) {
        const footerTop = autoFrame('top', 'HORIZONTAL', 0, 0, 0);
        footerTop.resize(FOOTER_W - 48, 1);
        footerTop.primaryAxisSizingMode = 'FIXED';
        footerTop.counterAxisSizingMode = 'AUTO';
        footerTop.primaryAxisAlignItems = 'SPACE_BETWEEN';

        const brand = autoFrame('brand', 'VERTICAL', 8, 0, 0);
        brand.appendChild(addLabel('Blueprint', 15, 'Semi Bold', vm.get('component/footer/brand/text')));
        brand.appendChild(addLabel('Beautiful components\nfor modern web apps.', 13, 'Regular', vm.get('component/footer/tagline/text')));
        footerTop.appendChild(brand);

        const nav = autoFrame('nav', 'HORIZONTAL', 48, 0, 0);
        const cols = [
          { heading: 'Product',    links: ['Features', 'Pricing', 'Changelog', 'Roadmap']         },
          { heading: 'Developers', links: ['Documentation', 'Components', 'GitHub']               },
          { heading: 'Company',    links: ['About', 'Blog', 'Careers', 'Contact']                 },
        ];
        for (const col of cols) {
          const colFrame = autoFrame(col.heading, 'VERTICAL', 10, 0, 0);
          const h = addLabel(col.heading.toUpperCase(), 12, 'Semi Bold', vm.get('component/footer/column/heading/text'));
          h.letterSpacing = { value: 6, unit: 'PERCENT' };
          colFrame.appendChild(h);
          for (const link of col.links) {
            colFrame.appendChild(addLabel(link, 13, 'Regular', vm.get('component/footer/column/link/text')));
          }
          nav.appendChild(colFrame);
        }
        footerTop.appendChild(nav);
        footer.appendChild(footerTop);
        footer.appendChild(makeDivider(FOOTER_W - 48, vm.get('component/footer/divider')));
      }

      const bottom = autoFrame('bottom', 'HORIZONTAL', 0, 0, 0);
      bottom.resize(FOOTER_W - 48, 1);
      bottom.primaryAxisSizingMode = 'FIXED';
      bottom.counterAxisSizingMode = 'AUTO';
      bottom.primaryAxisAlignItems = 'SPACE_BETWEEN';
      bottom.counterAxisAlignItems = 'CENTER';
      bottom.fills = noFill();
      bottom.appendChild(addLabel('© 2026 Blueprint. All rights reserved.', 12, 'Regular', vm.get('component/footer/copyright/text')));
      const legal = autoFrame('legal', 'HORIZONTAL', 24, 0, 0);
      for (const l of ['Privacy Policy', 'Terms of Service']) {
        legal.appendChild(addLabel(l, 12, 'Regular', vm.get('component/footer/copyright/text')));
      }
      bottom.appendChild(legal);
      footer.appendChild(bottom);
      return footer;
    }

    const s = makeSection('Footer', [
      { label: 'Full (with columns)', items: [makeFooter('full')]    },
      { label: 'Minimal',             items: [makeFooter('minimal')] },
    ]);
    addToPage(s, 0, cursorY);
    cursorY += s.height + ROW_GAP;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DEMO PAGE — 4 screens: Login · Dashboard · Users Table · User Detail Modal
  // ═══════════════════════════════════════════════════════════════════════════

  const demoPage = figma.createPage();
  demoPage.name = '🖥 Demo';
  figma.currentPage = demoPage;

  const SCREEN_GAP   = 80;
  const SCREEN_W     = 1280;
  const SCREEN_H     = 1200;
  let   demoX        = 0;

  // ── helpers scoped to demo page ─────────────────────────────────────────

  function demoScreen(name) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(SCREEN_W, SCREEN_H);
    f.fills = [{ type: 'SOLID', color: hex('#f5f5f5') }];
    f.x = demoX;
    f.y = 0;
    demoPage.appendChild(f);
    demoX += SCREEN_W + SCREEN_GAP;
    return f;
  }

  // fixed-size frame (no auto-layout)
  function fixedFrame(name, w, h) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = noFill();
    return f;
  }

  // auto-layout card
  function card(name, w, padH, padV, gap) {
    const f = autoFrame(name, 'VERTICAL', gap, padH, padV);
    f.resize(w, 1);
    f.primaryAxisSizingMode = 'AUTO';
    f.counterAxisSizingMode = 'FIXED';
    f.fills = [{ type: 'SOLID', color: hex('#ffffff') }];
    f.strokes = [boundPaint(vm.get('decisions/color/border/base'))];
    f.strokeWeight = 1;
    f.cornerRadius = 10;
    f.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 8, spread: 0, visible: true, blendMode: 'NORMAL' }];
    return f;
  }

  function hRow(name, gap, padH, padV) {
    const f = autoFrame(name, 'HORIZONTAL', gap, padH, padV);
    f.counterAxisAlignItems = 'CENTER';
    return f;
  }

  function demoTag(text, variant) {
    const padH = 8, padV = 3;
    const f = autoFrame('tag', 'HORIZONTAL', 0, padH, padV);
    f.counterAxisAlignItems = 'CENTER';
    f.cornerRadius = 4;
    applyFill(f, vm.get('component/tag/' + variant + '/background'));
    f.appendChild(addLabel(text, 11, 'Medium', vm.get('component/tag/' + variant + '/text')));
    return f;
  }

  function demoAvatar(initials, size) {
    const dim = { xs: 24, sm: 32, md: 40 }[size] || 40;
    const fs  = { xs:  9, sm: 12, md: 14 }[size] || 14;
    const av  = figma.createFrame();
    av.resize(dim, dim);
    av.cornerRadius = 9999;
    applyFill(av, vm.get('component/avatar/background'));
    av.layoutMode = 'HORIZONTAL';
    av.primaryAxisAlignItems = 'CENTER';
    av.counterAxisAlignItems = 'CENTER';
    av.primaryAxisSizingMode = 'FIXED';
    av.counterAxisSizingMode = 'FIXED';
    av.appendChild(addLabel(initials, fs, 'Semi Bold', vm.get('component/avatar/text')));
    return av;
  }

  function demoBtn(label, variant) {
    const f = autoFrame('btn', 'HORIZONTAL', 0, 14, 8);
    f.counterAxisAlignItems = 'CENTER';
    f.cornerRadius = 6;
    const style = {
      primary:   { bg: 'component/button/primary/background',   text: 'component/button/primary/text',   border: 'component/button/primary/border' },
      secondary: { bg: 'component/button/secondary/background', text: 'component/button/secondary/text', border: 'component/button/secondary/border' },
      ghost:     { bg: null,                                     text: 'component/button/ghost/text',     border: null },
      danger:    { bg: 'component/button/danger/background',    text: 'component/button/danger/text',    border: 'component/button/danger/border' },
    }[variant];
    if (style.bg) applyFill(f, vm.get(style.bg)); else f.fills = [{ type: 'SOLID', color: hex('#ffffff') }];
    if (style.border) { f.strokes = [boundPaint(vm.get(style.border))]; f.strokeWeight = 1.5; f.strokeAlign = 'INSIDE'; } else f.strokes = [];
    f.appendChild(addLabel(label, 13, 'Medium', vm.get(style.text)));
    return f;
  }

  // w: explicit pixel width for the input field
  function inputField(labelText, placeholderText, disabled, w) {
    w = w || 280;
    // wrapper: VERTICAL, AUTO sizing on both axes — width is driven by the fixed-width field inside
    const wrapper = autoFrame('input-wrapper', 'VERTICAL', 5, 0, 0);
    wrapper.fills = noFill();
    if (labelText) wrapper.appendChild(addLabel(labelText, 12, 'Medium',
      disabled ? vm.get('component/input/disabled/text') : vm.get('decisions/color/text/primary')
    ));
    // field: HORIZONTAL with fixed width — mirrors the working makeInput() pattern exactly
    const field = autoFrame('field', 'HORIZONTAL', 0, 12, 8);
    field.resize(w, 1);
    field.primaryAxisSizingMode = 'FIXED';
    field.counterAxisSizingMode = 'AUTO';
    applyRadius(field, 6);
    applyFill(field, disabled ? vm.get('component/input/disabled/background') : vm.get('component/input/background'));
    applyStroke(field, vm.get('component/input/border'), 1.5);
    field.appendChild(addLabel(placeholderText, 13, 'Regular',
      disabled ? vm.get('component/input/disabled/text') : vm.get('component/input/placeholder')
    ));
    wrapper.appendChild(field);
    return wrapper;
  }

  function dividerH(w) {
    const r = figma.createRectangle();
    r.name = 'divider';
    r.resize(w, 1);
    r.fills = [boundPaint(vm.get('decisions/color/border/base'))];
    r.strokes = [];
    return r;
  }

  // minimal footer bar for demo screens
  function makeDemoFooter() {
    const f = figma.createFrame();
    f.name = 'footer';
    f.resize(SCREEN_W, 56);
    f.layoutMode = 'HORIZONTAL';
    f.itemSpacing = 0;
    f.paddingLeft = f.paddingRight = 32;
    f.paddingTop  = f.paddingBottom = 0;
    f.primaryAxisSizingMode = 'FIXED';
    f.counterAxisSizingMode = 'FIXED';
    f.primaryAxisAlignItems = 'SPACE_BETWEEN';
    f.counterAxisAlignItems = 'CENTER';
    applyFill(f, vm.get('component/footer/background'));
    f.strokes = [boundPaint(vm.get('component/footer/border'))];
    f.strokeWeight = 1;
    f.strokeAlign = 'INSIDE';
    f.appendChild(addLabel('\u00a9 2026 Blueprint. All rights reserved.', 12, 'Regular', vm.get('component/footer/copyright/text')));
    const links = figma.createFrame();
    links.name = 'links';
    links.layoutMode = 'HORIZONTAL';
    links.itemSpacing = 24;
    links.paddingLeft = links.paddingRight = links.paddingTop = links.paddingBottom = 0;
    links.primaryAxisSizingMode = 'AUTO';
    links.counterAxisSizingMode = 'AUTO';
    links.counterAxisAlignItems = 'CENTER';
    links.fills = noFill();
    for (const l of ['Privacy Policy', 'Terms of Service']) {
      links.appendChild(addLabel(l, 12, 'Regular', vm.get('component/footer/copyright/text')));
    }
    f.appendChild(links);
    return f;
  }

  // ─── SCREEN 1: Login ──────────────────────────────────────────────────────

  {
    const scr = demoScreen('Login');

    // centered card 400px wide
    const loginCard = figma.createFrame();
    loginCard.name = 'login-card';
    loginCard.resize(400, 1);
    loginCard.layoutMode = 'VERTICAL';
    loginCard.itemSpacing = 20;
    loginCard.paddingLeft = loginCard.paddingRight = 40;
    loginCard.paddingTop = loginCard.paddingBottom = 40;
    loginCard.primaryAxisSizingMode = 'AUTO';
    loginCard.counterAxisSizingMode = 'FIXED';
    loginCard.fills = [{ type: 'SOLID', color: hex('#ffffff') }];
    loginCard.strokes = [boundPaint(vm.get('decisions/color/border/base'))];
    loginCard.strokeWeight = 1;
    loginCard.cornerRadius = 12;
    loginCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];

    // logo / brand
    const brand = addLabel('Blueprint', 22, 'Semi Bold', vm.get('component/button/primary/background'));
    loginCard.appendChild(brand);

    // heading
    const heading = addLabel('Sign in to your account', 18, 'Semi Bold', vm.get('decisions/color/text/primary'));
    loginCard.appendChild(heading);

    const sub = addLabel('Welcome back! Please enter your details.', 13, 'Regular', vm.get('decisions/color/text/subtle'));
    sub.textAutoResize = 'WIDTH_AND_HEIGHT';
    loginCard.appendChild(sub);

    // fields
    const emailField = inputField('Email address', 'you@example.com', false, 320);
    loginCard.appendChild(emailField);

    const pwField = inputField('Password', '••••••••', false, 320);
    loginCard.appendChild(pwField);

    // remember + forgot row
    const remRow = figma.createFrame();
    remRow.name = 'remember-row';
    remRow.resize(320, 1);
    remRow.layoutMode = 'HORIZONTAL';
    remRow.itemSpacing = 0;
    remRow.paddingLeft = remRow.paddingRight = remRow.paddingTop = remRow.paddingBottom = 0;
    remRow.primaryAxisSizingMode = 'FIXED';
    remRow.counterAxisSizingMode = 'AUTO';
    remRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
    remRow.counterAxisAlignItems = 'CENTER';
    remRow.fills = noFill();
    const remBox = figma.createFrame();
    remBox.resize(16, 16); remBox.cornerRadius = 4;
    applyFill(remBox, vm.get('decisions/color/surface/base'));
    applyStroke(remBox, vm.get('component/checkbox/border'), 1.5);
    const remInner = figma.createFrame();
    remInner.name = 'rem-inner';
    remInner.layoutMode = 'HORIZONTAL';
    remInner.itemSpacing = 8;
    remInner.paddingLeft = remInner.paddingRight = remInner.paddingTop = remInner.paddingBottom = 0;
    remInner.primaryAxisSizingMode = 'AUTO';
    remInner.counterAxisSizingMode = 'AUTO';
    remInner.counterAxisAlignItems = 'CENTER';
    remInner.fills = noFill();
    remInner.appendChild(remBox);
    remInner.appendChild(addLabel('Remember me', 13, 'Regular', vm.get('decisions/color/text/primary')));
    remRow.appendChild(remInner);
    remRow.appendChild(addLabel('Forgot password?', 13, 'Medium', vm.get('component/button/primary/background')));
    loginCard.appendChild(remRow);

    // primary CTA — full-width button
    const ctaBtn = figma.createFrame();
    ctaBtn.name = 'cta-btn';
    ctaBtn.resize(320, 42);
    ctaBtn.layoutMode = 'HORIZONTAL';
    ctaBtn.itemSpacing = 0;
    ctaBtn.paddingLeft = ctaBtn.paddingRight = 0;
    ctaBtn.paddingTop  = ctaBtn.paddingBottom = 0;
    ctaBtn.primaryAxisSizingMode = 'FIXED';
    ctaBtn.counterAxisSizingMode = 'FIXED';
    ctaBtn.primaryAxisAlignItems = 'CENTER';
    ctaBtn.counterAxisAlignItems = 'CENTER';
    ctaBtn.cornerRadius = 6;
    applyFill(ctaBtn, vm.get('component/button/primary/background'));
    ctaBtn.appendChild(addLabel('Sign in', 14, 'Semi Bold', vm.get('component/button/primary/text')));
    loginCard.appendChild(ctaBtn);

    loginCard.appendChild(dividerH(320));

    const signupRow = figma.createFrame();
    signupRow.name = 'signup-row';
    signupRow.resize(320, 1);
    signupRow.layoutMode = 'HORIZONTAL';
    signupRow.itemSpacing = 6;
    signupRow.paddingLeft = signupRow.paddingRight = signupRow.paddingTop = signupRow.paddingBottom = 0;
    signupRow.primaryAxisSizingMode = 'FIXED';
    signupRow.counterAxisSizingMode = 'AUTO';
    signupRow.primaryAxisAlignItems = 'CENTER';
    signupRow.counterAxisAlignItems = 'CENTER';
    signupRow.fills = noFill();
    signupRow.appendChild(addLabel("Don't have an account?", 13, 'Regular', vm.get('decisions/color/text/subtle')));
    signupRow.appendChild(addLabel('Sign up', 13, 'Medium', vm.get('component/button/primary/background')));
    loginCard.appendChild(signupRow);

    // centre the card on the screen
    loginCard.x = (SCREEN_W - 400) / 2;
    loginCard.y = (SCREEN_H - 500) / 2;
    scr.appendChild(loginCard);
  }

  // ─── SCREEN 2: Dashboard ──────────────────────────────────────────────────

  {
    const scr = demoScreen('Dashboard');

    // Top nav bar
    const navbar = figma.createFrame();
    navbar.name = 'navbar';
    navbar.resize(SCREEN_W, 56);
    navbar.layoutMode = 'HORIZONTAL';
    navbar.itemSpacing = 0;
    navbar.paddingLeft = navbar.paddingRight = 32;
    navbar.primaryAxisSizingMode = 'FIXED';
    navbar.counterAxisSizingMode = 'FIXED';
    navbar.primaryAxisAlignItems = 'SPACE_BETWEEN';
    navbar.counterAxisAlignItems = 'CENTER';
    applyFill(navbar, vm.get('component/header/background'));
    navbar.strokes = [boundPaint(vm.get('component/header/border'))];
    navbar.strokeWeight = 1;

    navbar.appendChild(addLabel('Blueprint', 15, 'Semi Bold', vm.get('component/header/brand/text')));
    const navLinks = autoFrame('links', 'HORIZONTAL', 24, 0, 0);
    navLinks.counterAxisAlignItems = 'CENTER';
    navLinks.layoutGrow = 1;
    navLinks.paddingLeft = 40;
    for (const l of ['Overview', 'Metrics', 'Logs', 'Settings']) {
      navLinks.appendChild(addLabel(l, 14, 'Regular', vm.get('component/header/nav/text')));
    }
    navbar.appendChild(navLinks);
    const navRight = hRow('nav-right', 12, 0, 0);
    navRight.appendChild(demoTag('Online', 'success'));
    navRight.appendChild(demoAvatar('AB', 'sm'));
    navbar.appendChild(navRight);
    scr.appendChild(navbar);

    // Page title
    const pageTitle = addLabel('System Overview', 20, 'Semi Bold', vm.get('decisions/color/text/primary'));
    pageTitle.x = 32; pageTitle.y = 72;
    scr.appendChild(pageTitle);
    const pageSub = addLabel('Last updated: 19 May 2026, 14:32 UTC', 13, 'Regular', vm.get('decisions/color/text/subtle'));
    pageSub.x = 32; pageSub.y = 100;
    scr.appendChild(pageSub);

    const CARD_TOP = 132;
    const CARD_GAP = 20;
    const CARD_ROW_W = SCREEN_W - 64;

    // ── Row 1: 4 metric cards ──
    const metricDefs = [
      { title: 'Active Users',    value: '2,847',  delta: '+12%',  dv: 'success', sub: 'vs last 7 days' },
      { title: 'Avg. Response',   value: '142 ms', delta: '−8%',   dv: 'success', sub: 'p95 latency' },
      { title: 'Error Rate',      value: '0.4%',   delta: '+0.1%', dv: 'warning', sub: 'last 24 h' },
      { title: 'Uptime',          value: '99.98%', delta: null,    dv: null,       sub: 'last 30 days' },
    ];
    const metricW = (CARD_ROW_W - CARD_GAP * 3) / 4;
    let mx = 32;
    for (const m of metricDefs) {
      const mc = card(m.title, metricW, 20, 20, 8);
      mc.x = mx; mc.y = CARD_TOP;

      const titleRow = hRow('title-row', 8, 0, 0);
      titleRow.appendChild(addLabel(m.title, 12, 'Medium', vm.get('decisions/color/text/subtle')));
      mc.appendChild(titleRow);

      const valRow = hRow('val-row', 10, 0, 0);
      valRow.counterAxisAlignItems = 'CENTER';
      valRow.appendChild(addLabel(m.value, 26, 'Semi Bold', vm.get('decisions/color/text/primary')));
      if (m.delta) valRow.appendChild(demoTag(m.delta, m.dv));
      mc.appendChild(valRow);

      mc.appendChild(addLabel(m.sub, 12, 'Regular', vm.get('decisions/color/text/placeholder')));
      scr.appendChild(mc);
      mx += metricW + CARD_GAP;
    }

    // ── Row 2: health-check card (left) + data-summary card (right) ──
    const ROW2_TOP = CARD_TOP + 140 + CARD_GAP;
    const healthW  = Math.floor((CARD_ROW_W - CARD_GAP) * 0.45);
    const summaryW = CARD_ROW_W - healthW - CARD_GAP;
    const hcInner  = healthW - 40;   // content width inside health card (padding 20 each side)

    // Health-check card
    const hc = card('Health Check', healthW, 20, 20, 0);
    hc.x = 32; hc.y = ROW2_TOP;
    hc.itemSpacing = 0;
    hc.appendChild(addLabel('System Status', 13, 'Semi Bold', vm.get('decisions/color/text/primary')));

    const services = [
      { name: 'API Gateway',   status: 'Online',  v: 'success' },
      { name: 'Database',      status: 'Online',  v: 'success' },
      { name: 'Auth Service',  status: 'Online',  v: 'success' },
      { name: 'Queue Worker',  status: 'Degraded',v: 'warning' },
      { name: 'CDN',           status: 'Online',  v: 'success' },
      { name: 'Email Service', status: 'Offline', v: 'danger'  },
    ];
    for (let si = 0; si < services.length; si++) {
      const svc = services[si];
      // top divider before each row
      hc.appendChild(makeDivider(hcInner, vm.get('decisions/color/border/base')));

      const row = figma.createFrame();
      row.name = 'svc-row';
      row.resize(hcInner, 1);
      row.layoutMode = 'HORIZONTAL';
      row.itemSpacing = 0;
      row.paddingLeft = row.paddingRight = 0;
      row.paddingTop  = row.paddingBottom = 10;
      row.primaryAxisSizingMode = 'FIXED';
      row.counterAxisSizingMode = 'AUTO';
      row.primaryAxisAlignItems = 'SPACE_BETWEEN';
      row.counterAxisAlignItems = 'CENTER';
      row.fills = noFill();
      row.appendChild(addLabel(svc.name, 13, 'Regular', vm.get('decisions/color/text/primary')));
      row.appendChild(demoTag(svc.status, svc.v));
      hc.appendChild(row);
    }
    scr.appendChild(hc);

    // Data summary card — bar-chart-like
    const ds = card('Data Summary', summaryW, 20, 20, 14);
    ds.x = 32 + healthW + CARD_GAP; ds.y = ROW2_TOP;
    ds.appendChild(addLabel('Request Throughput', 13, 'Semi Bold', vm.get('decisions/color/text/primary')));
    ds.appendChild(addLabel('Requests per minute over the last 6 hours', 12, 'Regular', vm.get('decisions/color/text/subtle')));
    ds.appendChild(dividerH(summaryW - 40));

    const barLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
    const barVals   = [320,     480,     610,     540,     720,     695    ];
    const maxVal    = Math.max(...barVals);
    const BAR_MAX_H = 80;
    const barW      = (summaryW - 40 - 8 * 5) / 6;

    const chartRow = hRow('chart', 8, 0, 0);
    chartRow.counterAxisAlignItems = 'MAX';
    for (let i = 0; i < 6; i++) {
      const barCol = autoFrame('bar-col', 'VERTICAL', 4, 0, 0);
      barCol.counterAxisAlignItems = 'CENTER';

      const barH = Math.max(4, Math.round((barVals[i] / maxVal) * BAR_MAX_H));
      const bar  = figma.createRectangle();
      bar.name   = 'bar';
      bar.resize(barW > 4 ? barW : 40, barH);
      bar.cornerRadius = 3;
      applyFill(bar, vm.get('component/button/primary/background'));
      barCol.appendChild(bar);
      barCol.appendChild(addLabel(barLabels[i], 10, 'Regular', vm.get('decisions/color/text/placeholder')));
      chartRow.appendChild(barCol);
    }
    ds.appendChild(chartRow);

    const statsRow = hRow('stats', 32, 0, 0);
    const statItems = [
      { label: 'Peak',    value: '720 rpm' },
      { label: 'Average', value: '561 rpm' },
      { label: 'Total',   value: '202,040' },
    ];
    for (const st of statItems) {
      const sc2 = autoFrame('stat', 'VERTICAL', 2, 0, 0);
      sc2.appendChild(addLabel(st.value, 15, 'Semi Bold', vm.get('decisions/color/text/primary')));
      sc2.appendChild(addLabel(st.label, 11, 'Regular', vm.get('decisions/color/text/subtle')));
      statsRow.appendChild(sc2);
    }
    ds.appendChild(statsRow);
    scr.appendChild(ds);

    // ── Row 3: Logs card — activity list style ──
    const ROW3_TOP = ROW2_TOP + 290 + CARD_GAP;
    const LOGS_W = CARD_ROW_W;
    const logsCard = card('System Logs', LOGS_W, 20, 20, 0);
    logsCard.x = 32; logsCard.y = ROW3_TOP;
    logsCard.itemSpacing = 0;

    const logsHeader = figma.createFrame();
    logsHeader.name = 'logs-header';
    logsHeader.resize(LOGS_W - 40, 1);
    logsHeader.layoutMode = 'HORIZONTAL';
    logsHeader.itemSpacing = 0;
    logsHeader.paddingLeft = logsHeader.paddingRight = logsHeader.paddingTop = logsHeader.paddingBottom = 0;
    logsHeader.primaryAxisSizingMode = 'FIXED';
    logsHeader.counterAxisSizingMode = 'AUTO';
    logsHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
    logsHeader.counterAxisAlignItems = 'CENTER';
    logsHeader.fills = noFill();
    logsHeader.appendChild(addLabel('Live Logs', 13, 'Semi Bold', vm.get('decisions/color/text/primary')));
    logsHeader.appendChild(demoTag('Live', 'success'));
    logsCard.appendChild(logsHeader);

    const logItems = [
      { label: 'Deployment succeeded', desc: 'Production deployed from commit a3f92b1 by alice.',        meta: '2 min ago',  dot: 'success' },
      { label: 'Build started',        desc: 'Running test suite and static analysis.',                   meta: '4 min ago',  dot: 'info'    },
      { label: 'Queue worker warning', desc: 'Latency spike detected: 420 ms (threshold 300 ms).',        meta: '5 min ago',  dot: 'warning' },
      { label: 'Email delivery failed',desc: 'SMTP connection refused — smtp.example.com:587.',           meta: '12 min ago', dot: 'error'   },
      { label: 'PR merged',            desc: 'feat: add checkbox component merged into main by alice.',   meta: '1 hr ago',   dot: 'default' },
    ];
    const dotKeys2 = {
      success: 'component/list/indicator/success',
      info:    'component/list/indicator/info',
      warning: 'component/list/indicator/warning',
      error:   'component/list/indicator/error',
      default: 'component/list/indicator/default',
    };
    for (let li2 = 0; li2 < logItems.length; li2++) {
      logsCard.appendChild(makeDivider(LOGS_W - 40, vm.get('component/list/divider')));
      const item2 = logItems[li2];
      const li2f = figma.createFrame();
      li2f.name = 'log-item';
      li2f.resize(LOGS_W - 40, 1);
      li2f.layoutMode = 'HORIZONTAL';
      li2f.itemSpacing = 12;
      li2f.paddingLeft = li2f.paddingRight = 0;
      li2f.paddingTop  = li2f.paddingBottom = 10;
      li2f.primaryAxisSizingMode = 'FIXED';
      li2f.counterAxisSizingMode = 'AUTO';
      li2f.counterAxisAlignItems = 'CENTER';
      li2f.fills = noFill();

      const dot2 = figma.createEllipse();
      dot2.resize(8, 8);
      applyFill(dot2, vm.get(dotKeys2[item2.dot]));
      dot2.strokes = [];
      li2f.appendChild(dot2);

      const bodyF = figma.createFrame();
      bodyF.name = 'body';
      bodyF.layoutMode = 'VERTICAL';
      bodyF.itemSpacing = 2;
      bodyF.paddingLeft = bodyF.paddingRight = bodyF.paddingTop = bodyF.paddingBottom = 0;
      bodyF.primaryAxisSizingMode = 'AUTO';
      bodyF.counterAxisSizingMode = 'AUTO';
      bodyF.layoutGrow = 1;
      bodyF.fills = noFill();

      const labelRowF = figma.createFrame();
      labelRowF.name = 'label-row';
      labelRowF.resize(LOGS_W - 40 - 20, 1);
      labelRowF.layoutMode = 'HORIZONTAL';
      labelRowF.itemSpacing = 0;
      labelRowF.paddingLeft = labelRowF.paddingRight = labelRowF.paddingTop = labelRowF.paddingBottom = 0;
      labelRowF.primaryAxisSizingMode = 'FIXED';
      labelRowF.counterAxisSizingMode = 'AUTO';
      labelRowF.primaryAxisAlignItems = 'SPACE_BETWEEN';
      labelRowF.counterAxisAlignItems = 'CENTER';
      labelRowF.fills = noFill();
      labelRowF.appendChild(addLabel(item2.label, 13, 'Medium', vm.get('component/list/item/text')));
      labelRowF.appendChild(addLabel(item2.meta, 11, 'Regular', vm.get('component/list/item/meta')));
      bodyF.appendChild(labelRowF);
      bodyF.appendChild(addLabel(item2.desc, 12, 'Regular', vm.get('component/list/item/description')));
      li2f.appendChild(bodyF);
      logsCard.appendChild(li2f);
    }
    scr.appendChild(logsCard);

    // ── Footer ──
    const dashFooter = makeDemoFooter();
    dashFooter.x = 0;
    dashFooter.y = ROW3_TOP + 340;
    scr.appendChild(dashFooter);
  }

  // ─── SCREEN 3: Users Table ────────────────────────────────────────────────

  {
    const scr = demoScreen('Users Table');

    // nav bar (same as dashboard)
    const navbar = figma.createFrame();
    navbar.name = 'navbar';
    navbar.resize(SCREEN_W, 56);
    navbar.layoutMode = 'HORIZONTAL';
    navbar.itemSpacing = 0;
    navbar.paddingLeft = navbar.paddingRight = 32;
    navbar.primaryAxisSizingMode = 'FIXED';
    navbar.counterAxisSizingMode = 'FIXED';
    navbar.primaryAxisAlignItems = 'SPACE_BETWEEN';
    navbar.counterAxisAlignItems = 'CENTER';
    applyFill(navbar, vm.get('component/header/background'));
    navbar.strokes = [boundPaint(vm.get('component/header/border'))];
    navbar.strokeWeight = 1;
    navbar.appendChild(addLabel('Blueprint', 15, 'Semi Bold', vm.get('component/header/brand/text')));
    const navLinks2 = autoFrame('links', 'HORIZONTAL', 24, 0, 0);
    navLinks2.counterAxisAlignItems = 'CENTER';
    navLinks2.layoutGrow = 1;
    navLinks2.paddingLeft = 40;
    for (const l of ['Overview', 'Metrics', 'Logs', 'Settings']) {
      navLinks2.appendChild(addLabel(l, 14, 'Regular', vm.get('component/header/nav/text')));
    }
    navbar.appendChild(navLinks2);
    navbar.appendChild(demoAvatar('AB', 'sm'));
    scr.appendChild(navbar);

    // toolbar: title + invite button
    const toolbar = figma.createFrame();
    toolbar.name = 'toolbar';
    toolbar.resize(SCREEN_W - 64, 40);
    toolbar.x = 32; toolbar.y = 76;
    toolbar.layoutMode = 'HORIZONTAL';
    toolbar.itemSpacing = 0;
    toolbar.primaryAxisSizingMode = 'FIXED';
    toolbar.counterAxisSizingMode = 'FIXED';
    toolbar.primaryAxisAlignItems = 'SPACE_BETWEEN';
    toolbar.counterAxisAlignItems = 'CENTER';
    toolbar.fills = noFill();
    toolbar.appendChild(addLabel('Team Members', 18, 'Semi Bold', vm.get('decisions/color/text/primary')));
    toolbar.appendChild(demoBtn('+ Invite Member', 'primary'));
    scr.appendChild(toolbar);

    // table
    const TABLE_W = SCREEN_W - 64;
    const colDefs = [
      { header: 'User',    w: 280 },
      { header: 'Email',   w: 200 },
      { header: 'Role',    w: 140 },
      { header: 'Status',  w: 120 },
      { header: 'Joined',  w: 120 },
      { header: '',        w: 240 },
    ];

    const users = [
      { name: 'Alice Brown',  initials: 'AB', email: 'alice@example.com',  role: 'Admin',  roleV: 'danger',  status: 'Active',   statusV: 'success', joined: 'Jan 2024' },
      { name: 'Bob Smith',    initials: 'BS', email: 'bob@example.com',    role: 'Editor', roleV: 'info',    status: 'Active',   statusV: 'success', joined: 'Mar 2024' },
      { name: 'Carol White',  initials: 'CW', email: 'carol@example.com',  role: 'Viewer', roleV: 'default', status: 'Inactive', statusV: 'default', joined: 'Jun 2024' },
      { name: 'Dan Torres',   initials: 'DT', email: 'dan@example.com',    role: 'Editor', roleV: 'info',    status: 'Active',   statusV: 'success', joined: 'Aug 2024' },
      { name: 'Eva Nguyen',   initials: 'EN', email: 'eva@example.com',    role: 'Admin',  roleV: 'danger',  status: 'Pending',  statusV: 'warning', joined: 'Nov 2024' },
    ];

    const tableWrap = figma.createFrame();
    tableWrap.name = 'users-table';
    tableWrap.resize(TABLE_W, 1);
    tableWrap.x = 32; tableWrap.y = 132;
    tableWrap.layoutMode = 'VERTICAL';
    tableWrap.itemSpacing = 0;
    tableWrap.primaryAxisSizingMode = 'AUTO';
    tableWrap.counterAxisSizingMode = 'FIXED';
    tableWrap.fills = [{ type: 'SOLID', color: hex('#ffffff') }];
    tableWrap.strokes = [boundPaint(vm.get('component/table/border'))];
    tableWrap.strokeWeight = 1;
    tableWrap.cornerRadius = 10;
    tableWrap.clipsContent = true;
    tableWrap.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 8, spread: 0, visible: true, blendMode: 'NORMAL' }];

    // table header
    const thead = figma.createFrame();
    thead.name = 'thead';
    thead.resize(TABLE_W, 1);
    thead.layoutMode = 'HORIZONTAL';
    thead.itemSpacing = 0;
    thead.primaryAxisSizingMode = 'FIXED';
    thead.counterAxisSizingMode = 'AUTO';
    applyFill(thead, vm.get('component/table/header/background'));
    for (const col of colDefs) {
      const th = autoFrame('th', 'HORIZONTAL', 0, 16, 12);
      th.resize(col.w, 1);
      th.primaryAxisSizingMode = 'FIXED';
      th.counterAxisSizingMode = 'AUTO';
      if (col.header) {
        const thText = addLabel(col.header.toUpperCase(), 11, 'Semi Bold', vm.get('component/table/header/text'));
        thText.letterSpacing = { value: 6, unit: 'PERCENT' };
        th.appendChild(thText);
      }
      thead.appendChild(th);
    }
    tableWrap.appendChild(thead);
    tableWrap.appendChild(makeDivider(TABLE_W, vm.get('component/table/border')));

    // data rows
    for (let ri = 0; ri < users.length; ri++) {
      if (ri > 0) tableWrap.appendChild(makeDivider(TABLE_W, vm.get('component/table/cell/border')));
      const u = users[ri];
      const tr = figma.createFrame();
      tr.name = 'tr';
      tr.resize(TABLE_W, 1);
      tr.layoutMode = 'HORIZONTAL';
      tr.itemSpacing = 0;
      tr.primaryAxisSizingMode = 'FIXED';
      tr.counterAxisSizingMode = 'AUTO';
      applyFill(tr, vm.get('component/table/background'));

      // User cell
      const userCell = autoFrame('td-user', 'HORIZONTAL', 10, 16, 12);
      userCell.resize(colDefs[0].w, 1);
      userCell.primaryAxisSizingMode = 'FIXED';
      userCell.counterAxisSizingMode = 'AUTO';
      userCell.counterAxisAlignItems = 'CENTER';
      userCell.appendChild(demoAvatar(u.initials, 'sm'));
      const nameCol = autoFrame('name-col', 'VERTICAL', 2, 0, 0);
      nameCol.appendChild(addLabel(u.name, 13, 'Medium', vm.get('component/table/cell/text')));
      userCell.appendChild(nameCol);
      tr.appendChild(userCell);

      // Email cell
      const emailCell = autoFrame('td-email', 'HORIZONTAL', 0, 16, 12);
      emailCell.resize(colDefs[1].w, 1);
      emailCell.primaryAxisSizingMode = 'FIXED';
      emailCell.counterAxisSizingMode = 'AUTO';
      emailCell.counterAxisAlignItems = 'CENTER';
      emailCell.appendChild(addLabel(u.email, 13, 'Regular', vm.get('decisions/color/text/subtle')));
      tr.appendChild(emailCell);

      // Role cell
      const roleCell = autoFrame('td-role', 'HORIZONTAL', 0, 16, 12);
      roleCell.resize(colDefs[2].w, 1);
      roleCell.primaryAxisSizingMode = 'FIXED';
      roleCell.counterAxisSizingMode = 'AUTO';
      roleCell.counterAxisAlignItems = 'CENTER';
      roleCell.appendChild(demoTag(u.role, u.roleV));
      tr.appendChild(roleCell);

      // Status cell
      const statusCell = autoFrame('td-status', 'HORIZONTAL', 0, 16, 12);
      statusCell.resize(colDefs[3].w, 1);
      statusCell.primaryAxisSizingMode = 'FIXED';
      statusCell.counterAxisSizingMode = 'AUTO';
      statusCell.counterAxisAlignItems = 'CENTER';
      statusCell.appendChild(demoTag(u.status, u.statusV));
      tr.appendChild(statusCell);

      // Joined cell
      const joinedCell = autoFrame('td-joined', 'HORIZONTAL', 0, 16, 12);
      joinedCell.resize(colDefs[4].w, 1);
      joinedCell.primaryAxisSizingMode = 'FIXED';
      joinedCell.counterAxisSizingMode = 'AUTO';
      joinedCell.counterAxisAlignItems = 'CENTER';
      joinedCell.appendChild(addLabel(u.joined, 13, 'Regular', vm.get('component/table/cell/text')));
      tr.appendChild(joinedCell);

      // Actions cell — spacer pushes buttons to the right
      const actCell = figma.createFrame();
      actCell.name = 'td-actions';
      actCell.resize(colDefs[5].w, 1);
      actCell.layoutMode = 'HORIZONTAL';
      actCell.itemSpacing = 6;
      actCell.paddingLeft = actCell.paddingRight = 16;
      actCell.paddingTop  = actCell.paddingBottom = 10;
      actCell.primaryAxisSizingMode = 'FIXED';
      actCell.counterAxisSizingMode = 'AUTO';
      actCell.counterAxisAlignItems = 'CENTER';
      actCell.primaryAxisAlignItems = 'MIN';
      actCell.fills = noFill();
      const actSpacer = figma.createFrame();
      actSpacer.name = 'spacer';
      actSpacer.resize(1, 1);
      actSpacer.fills = noFill();
      actSpacer.layoutGrow = 1;
      actCell.appendChild(actSpacer);
      actCell.appendChild(demoBtn('Edit', 'ghost'));
      actCell.appendChild(demoBtn('Details', 'secondary'));
      actCell.appendChild(demoBtn('Delete', 'danger'));
      tr.appendChild(actCell);

      tableWrap.appendChild(tr);
    }
    scr.appendChild(tableWrap);

    // ── Footer ──
    const tableFooter = makeDemoFooter();
    tableFooter.x = 0;
    tableFooter.y = 132 + 48 * (users.length + 1) + 48;
    scr.appendChild(tableFooter);
  }

  // ─── SCREEN 4: User Detail (Modal over table) ─────────────────────────────

  {
    const scr = demoScreen('User Detail Modal');

    // dimmed background
    const backdrop = figma.createRectangle();
    backdrop.name = 'backdrop';
    backdrop.resize(SCREEN_W, SCREEN_H);
    backdrop.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.45 }];
    scr.appendChild(backdrop);

    const MODAL_W = 560;

    function buildModal(title, disabled) {
      const modal = figma.createFrame();
      modal.name = disabled ? 'modal-details' : 'modal-edit';
      modal.resize(MODAL_W, 1);
      modal.layoutMode = 'VERTICAL';
      modal.itemSpacing = 0;
      modal.primaryAxisSizingMode = 'AUTO';
      modal.counterAxisSizingMode = 'FIXED';
      modal.fills = [{ type: 'SOLID', color: hex('#ffffff') }];
      modal.cornerRadius = 12;
      modal.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.22 }, offset: { x: 0, y: 12 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];

      // modal header
      const mHead = figma.createFrame();
      mHead.name = 'modal-header';
      mHead.resize(MODAL_W, 1);
      mHead.layoutMode = 'HORIZONTAL';
      mHead.itemSpacing = 0;
      mHead.paddingLeft = mHead.paddingRight = 24;
      mHead.paddingTop = mHead.paddingBottom = 20;
      mHead.primaryAxisSizingMode = 'FIXED';
      mHead.counterAxisSizingMode = 'AUTO';
      mHead.primaryAxisAlignItems = 'SPACE_BETWEEN';
      mHead.counterAxisAlignItems = 'CENTER';
      mHead.fills = noFill();
      const mTitle = addLabel(title, 16, 'Semi Bold', vm.get('component/modal/title/text'));
      mTitle.layoutGrow = 1;
      mHead.appendChild(mTitle);
      if (disabled) mHead.appendChild(demoTag('Read only', 'default'));
      const closeX = autoFrame('close', 'HORIZONTAL', 0, 6, 6);
      closeX.cornerRadius = 5;
      closeX.counterAxisAlignItems = 'CENTER';
      closeX.primaryAxisAlignItems = 'CENTER';
      closeX.appendChild(addLabel('✕', 14, 'Regular', vm.get('component/modal/close/text')));
      mHead.appendChild(closeX);
      modal.appendChild(mHead);

      modal.appendChild(dividerH(MODAL_W));

      // modal body — form fields
      const mBody = figma.createFrame();
      mBody.name = 'modal-body';
      mBody.resize(MODAL_W, 1);
      mBody.layoutMode = 'VERTICAL';
      mBody.itemSpacing = 16;
      mBody.paddingLeft = mBody.paddingRight = 24;
      mBody.paddingTop = mBody.paddingBottom = 24;
      mBody.primaryAxisSizingMode = 'AUTO';
      mBody.counterAxisSizingMode = 'FIXED';
      mBody.fills = noFill();

      // avatar + name row
      const userRow = hRow('user-row', 14, 0, 0);
      userRow.counterAxisAlignItems = 'CENTER';
      userRow.appendChild(demoAvatar('AB', 'md'));
      const userInfo = autoFrame('user-info', 'VERTICAL', 2, 0, 0);
      userInfo.appendChild(addLabel('Alice Brown', 15, 'Semi Bold', vm.get('decisions/color/text/primary')));
      userInfo.appendChild(addLabel('Member since January 2024', 12, 'Regular', vm.get('decisions/color/text/subtle')));
      userRow.appendChild(userInfo);
      mBody.appendChild(userRow);

      // two-column grid row (first name / last name)
      const gridRow = figma.createFrame();
      gridRow.name = 'grid-row';
      gridRow.layoutMode = 'HORIZONTAL';
      gridRow.itemSpacing = 16;
      gridRow.paddingLeft = gridRow.paddingRight = gridRow.paddingTop = gridRow.paddingBottom = 0;
      gridRow.primaryAxisSizingMode = 'AUTO';
      gridRow.counterAxisSizingMode = 'AUTO';
      gridRow.counterAxisAlignItems = 'CENTER';
      gridRow.fills = noFill();
      const fn = inputField('First name', disabled ? 'Alice' : 'Alice', disabled, 236);
      const ln = inputField('Last name', disabled ? 'Brown' : 'Brown', disabled, 236);
      gridRow.appendChild(fn);
      gridRow.appendChild(ln);
      mBody.appendChild(gridRow);

      const emailF = inputField('Email address', 'alice@example.com', disabled, MODAL_W - 48);
      mBody.appendChild(emailF);

      // Role dropdown mock
      const roleWrapper = autoFrame('role-wrapper', 'VERTICAL', 5, 0, 0);
      roleWrapper.resize(MODAL_W - 48, 1);
      roleWrapper.primaryAxisSizingMode = 'AUTO';
      roleWrapper.counterAxisSizingMode = 'FIXED';
      roleWrapper.appendChild(addLabel('Role', 12, 'Medium',
        disabled ? vm.get('component/input/disabled/text') : vm.get('decisions/color/text/primary')
      ));
      const roleField = autoFrame('role-field', 'HORIZONTAL', 0, 12, 8);
      roleField.resize(MODAL_W - 48, 1);
      roleField.primaryAxisSizingMode = 'FIXED';
      roleField.counterAxisSizingMode = 'AUTO';
      roleField.counterAxisAlignItems = 'CENTER';
      roleField.cornerRadius = 6;
      applyFill(roleField, disabled ? vm.get('component/input/disabled/background') : vm.get('component/dropdown/background'));
      applyStroke(roleField, vm.get('component/dropdown/border'), 1.5);
      const roleVal = addLabel('Admin', 13, 'Regular',
        disabled ? vm.get('component/input/disabled/text') : vm.get('component/dropdown/text')
      );
      roleVal.layoutGrow = 1;
      roleField.appendChild(roleVal);
      if (!disabled) roleField.appendChild(addLabel('▾', 12, 'Regular', vm.get('decisions/color/text/subtle')));
      roleWrapper.appendChild(roleField);
      mBody.appendChild(roleWrapper);

      // Status toggles (read-only: tags)
      const statusRow = hRow('status-row', 8, 0, 0);
      statusRow.counterAxisAlignItems = 'CENTER';
      statusRow.appendChild(addLabel('Status', 12, 'Medium', vm.get('decisions/color/text/primary')));
      statusRow.appendChild(demoTag('Active', 'success'));
      mBody.appendChild(statusRow);

      modal.appendChild(mBody);
      modal.appendChild(dividerH(MODAL_W));

      // modal footer
      const mFoot = figma.createFrame();
      mFoot.name = 'modal-footer';
      mFoot.resize(MODAL_W, 1);
      mFoot.layoutMode = 'HORIZONTAL';
      mFoot.itemSpacing = 8;
      mFoot.paddingLeft = mFoot.paddingRight = 24;
      mFoot.paddingTop = mFoot.paddingBottom = 16;
      mFoot.primaryAxisSizingMode = 'FIXED';
      mFoot.counterAxisSizingMode = 'AUTO';
      mFoot.primaryAxisAlignItems = 'SPACE_BETWEEN';
      mFoot.counterAxisAlignItems = 'CENTER';
      mFoot.fills = noFill();

      if (!disabled) {
        mFoot.appendChild(demoBtn('Delete user', 'danger'));
        const rightBtns = hRow('right-btns', 8, 0, 0);
        rightBtns.appendChild(demoBtn('Cancel', 'secondary'));
        rightBtns.appendChild(demoBtn('Save changes', 'primary'));
        mFoot.appendChild(rightBtns);
      } else {
        mFoot.appendChild(addLabel('To make changes, request Admin access.', 12, 'Regular', vm.get('decisions/color/text/subtle')));
        mFoot.appendChild(demoBtn('Close', 'secondary'));
      }
      modal.appendChild(mFoot);
      return modal;
    }

    // Edit modal (left)
    const editModal = buildModal('Edit Member', false);
    editModal.x = (SCREEN_W / 2) - MODAL_W - 40;
    editModal.y = (SCREEN_H - 560) / 2;
    scr.appendChild(editModal);

    // Details / read-only modal (right)
    const detailModal = buildModal('Member Details', true);
    detailModal.x = (SCREEN_W / 2) + 40;
    detailModal.y = (SCREEN_H - 560) / 2;
    scr.appendChild(detailModal);
  }

  // ─── Switch back to components page & wrap up ─────────────────────────────
  figma.currentPage = page;

  // ─── Done ─────────────────────────────────────────────────────────────────
  figma.viewport.scrollAndZoomIntoView(page.children);
  figma.closePlugin('✅ Design System Blueprint created! Variables + 13 components ready.');
}

main().catch(err => {
  console.error(err);
  figma.closePlugin('❌ Error: ' + err.message);
});

