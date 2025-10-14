/*
 Seed myths from the frontend data file into MongoDB.
 Usage:
   NODE_ENV=development node backend/scripts/seedMyths.js
 Requirements:
   - Ensure MONGO_URI is set in your environment or .env file at backend root
*/

const path = require('path');
const fs = require('fs');
const vm = require('vm');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Myth = require('../models/Myth');

function slugify(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function loadFrontendMyths() {
  const filePath = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'mythsData.js');
  const raw = fs.readFileSync(filePath, 'utf8');

  // Extract the array assigned to mythsData.
  // 1) Replace `export const mythsData =` with `const mythsData =`
  // 2) Trim everything after the closing `];` of the array
  const startMarker = 'export const mythsData =';
  const startIdx = raw.indexOf(startMarker);
  if (startIdx === -1) throw new Error('Could not find `export const mythsData =` in mythsData.js');

  // Find the first '[' after the start marker
  const arrayStart = raw.indexOf('[', startIdx);
  if (arrayStart === -1) throw new Error('Could not find start of array in mythsData.js');

  // We need to find the matching closing '];'. We'll do a simple bracket counter.
  let i = arrayStart;
  let depth = 0;
  let arrayEnd = -1;
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        // Expect next chars to include ';' but we'll stop at ']'
        arrayEnd = i;
        break;
      }
    }
    i++;
  }
  if (arrayEnd === -1) throw new Error('Could not find end of array in mythsData.js');

  const arrayLiteral = raw.slice(arrayStart, arrayEnd + 1);

  // Build a small JS program we can run to get mythsData as a variable
  const program = `const mythsData = ${arrayLiteral};\nmodule.exports = mythsData;`;

  const sandbox = { module: { exports: {} }, exports: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(program, sandbox, { filename: 'mythsData.vm.js' });
  const myths = sandbox.module.exports;
  if (!Array.isArray(myths)) throw new Error('Parsed mythsData is not an array');
  return myths;
}

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI not set. Please set it in backend/.env or environment');
  }
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Backfill: ensure all existing docs have a slug to avoid unique index collisions on null
  const docsMissingSlug = await Myth.find({ $or: [ { slug: { $exists: false } }, { slug: null }, { slug: '' } ] });
  if (docsMissingSlug.length) {
    console.log(`Backfilling slug for ${docsMissingSlug.length} existing myths...`);
    for (const d of docsMissingSlug) {
      const base = slugify(d.title || `myth-${d._id}`);
      let candidate = base;
      let n = 0;
      // ensure uniqueness
      // eslint-disable-next-line no-await-in-loop
      while (await Myth.exists({ slug: candidate, _id: { $ne: d._id } })) {
        n += 1;
        candidate = `${base}-${n}`;
      }
      d.slug = candidate;
      // eslint-disable-next-line no-await-in-loop
      await d.save();
    }
    console.log('Backfill completed.');
  }

  const myths = await loadFrontendMyths();
  console.log(`Loaded ${myths.length} myths from frontend data`);

  let inserted = 0;
  let updated = 0;

  for (const m of myths) {
    const doc = {
      title: m.title,
      category: m.category,
      image: m.image, // alias imageUrl -> image in schema
      excerpt: m.shortDescription, // alias shortDescription -> excerpt
      content: m.fullStory, // alias fullStory -> content
      status: 'approved',
      tags: [],
      references: [],
    };

    // Find by title, then update and save (pre-save hook will handle slug)
    const existing = await Myth.findOne({ title: m.title });
    if (existing) {
      Object.assign(existing, doc);
      await existing.save();
      updated++;
    } else {
      const created = new Myth(doc);
      await created.save(); // triggers pre-save to generate unique slug
      inserted++;
    }
  }

  console.log(`Seeding complete. Inserted: ${inserted}, Updated: ${updated}`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
