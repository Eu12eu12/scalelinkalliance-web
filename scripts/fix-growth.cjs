// js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed-services.cjs');

if (!fs.existsSync(filePath)) {
  console.error(`❌ Could not find: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing Growth/growth formatting...');

// ============================================================
// 1. PACKAGE / OBJECT KEYS
// ============================================================
// These MUST be lowercase because they are application keys.
//
// WRONG:
// "Growth ":
// "Growth  ":
// "growth ":
//
// CORRECT:
// "growth":

content = content.replace(/"Growth\s*"\s*:/g, '"growth":');
content = content.replace(/"growth\s*"\s*:/g, '"growth":');

// ============================================================
// 2. PACKAGE COMPARISON VALUES
// ============================================================
// Example:
// "values": {
//   "basic": true,
//   "Growth ": false,
//   "premium": false
// }
//
// becomes:
//
// "values": {
//   "basic": true,
//   "growth": false,
//   "premium": false
// }

content = content.replace(/"Growth\s*"\s*:/g, '"growth":');

// ============================================================
// 3. TIER ARRAYS
// ============================================================
// Make sure the internal tier identifier is always:
//
// basic
// growth
// premium

content = content.replace(/"growth\s+"/g, '"growth"');

// ============================================================
// 4. DISPLAY PACKAGE NAMES
// ============================================================
// These are visible to customers, so they should use:
//
// Starter Package
// Growth Package
// Premium Package

content = content.replace(/Growth\s+Package/g, 'Growth Package');

// ============================================================
// 5. REMOVE ACCIDENTAL DOUBLE SPACES AFTER GROWTH
// ============================================================
//
// "Growth  Package" -> "Growth Package"
// "Growth  strategy" -> "Growth strategy"

content = content.replace(/Growth {2,}/g, 'Growth ');

// ============================================================
// 6. FIX SENTENCES WHERE "Growth" WAS ACCIDENTALLY
//    CAPITALIZED IN THE MIDDLE OF A SENTENCE
// ============================================================
//
// These are normal English phrases, so they should be:
//
// business growth
// brand growth
// search growth
// support growth
// drive growth
// achieve sustainable growth
//
// while "Growth Package" remains capitalized.

const lowercaseGrowthPhrases = [
  'business Growth',
  'brand Growth',
  'search Growth',
  'support Growth',
  'drive Growth',
  'achieve sustainable Growth',
  'aggressive search Growth',
  'higher-value activities that drive Growth',
  'clear path to Growth',
  'opportunities for Growth',
  'Growth procedures',
];

for (const phrase of lowercaseGrowthPhrases) {
  const fixed = phrase.replace(/Growth/g, 'growth');
  content = content.split(phrase).join(fixed);
}

// ============================================================
// 7. FIX "Growth ." / "Growth ," / "Growth :"
// ============================================================

content = content.replace(/Growth\s+\./g, 'growth.');
content = content.replace(/Growth\s+,/g, 'growth,');
content = content.replace(/Growth\s+:/g, 'growth:');

// ============================================================
// 8. FIX COMMON SENTENCE-LEVEL CASES
// ============================================================

content = content.replace(
  /business Growth/g,
  'business growth'
);

content = content.replace(
  /brand Growth/g,
  'brand growth'
);

content = content.replace(
  /search Growth/g,
  'search growth'
);

content = content.replace(
  /support Growth/g,
  'support growth'
);

content = content.replace(
  /drive Growth/g,
  'drive growth'
);

content = content.replace(
  /sustainable Growth/g,
  'sustainable growth'
);

content = content.replace(
  /path to Growth/g,
  'path to growth'
);

content = content.replace(
  /regular Growth/g,
  'regular growth'
);

content = content.replace(
  /business goals and Growth/g,
  'business goals and growth'
);

// ============================================================
// 9. PACKAGE DISPLAY TEXT MUST STAY CAPITALIZED
// ============================================================

content = content.replace(
  /"name":\s*"growth package"/gi,
  '"name": "Growth Package"'
);

content = content.replace(
  /"packageName":\s*"growth package"/gi,
  '"packageName": "Growth Package"'
);

// ============================================================
// 10. FINAL SAFETY NORMALIZATION
// ============================================================

// Never allow these broken package keys to remain.
content = content.replace(/"Growth\s+"/g, '"growth"');
content = content.replace(/"Growth\s{2,}"/g, '"growth"');

// Never allow multiple spaces inside the visible package name.
content = content.replace(
  /"Growth\s{2,}Package"/g,
  '"Growth Package"'
);

// ============================================================
// WRITE FILE
// ============================================================

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Growth/growth cleanup completed!');
console.log('');
console.log('Correct internal keys:');
console.log('  basic');
console.log('  growth');
console.log('  premium');
console.log('');
console.log('Correct customer-facing names:');
console.log('  Starter Package');
console.log('  Growth Package');
console.log('  Premium Package');
console.log('');
console.log(`📁 Updated: ${filePath}`);

