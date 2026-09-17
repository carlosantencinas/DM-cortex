/**
 * scripts/translate-data.js
 * ---------------------------------------------------------------
 * Traduce automáticamente los datos en inglés (src/data/en/*.json,
 * basados en el SRD 5.2.1 de D&D 2024, licencia CC-BY-4.0) al
 * español, y guarda el resultado en src/data/es/*.json.
 *
 * Se corre UNA VEZ (o cuando cambian los datos de origen), no en
 * cada carga de la app: así evitamos exponer una API key en el
 * navegador, evitamos límites de rate en vivo, y la app queda
 * funcionando 100% estática para GitHub Pages.
 *
 * Uso:
 *   1. Poné tu clave de DeepL en .env.local como DEEPL_API_KEY=...
 *      (tienen un free tier de 500.000 caracteres/mes, de sobra
 *      para esto). https://www.deepl.com/pro-api
 *   2. Poné los JSON de origen en src/data/en/ (spells.json, etc.)
 *      con el formato { name, level, school, description, source }.
 *   3. Corré: npm run translate
 *
 * Si preferís no depender de una API paga, podés cambiar
 * `translateText` por otro proveedor (LibreTranslate self-hosted,
 * Google Cloud Translate, o incluso pedirle a Claude que traduzca
 * el JSON por lotes desde este mismo script).
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';

const EN_DIR = new URL('../src/data/en/', import.meta.url);
const ES_DIR = new URL('../src/data/es/', import.meta.url);
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = DEEPL_API_KEY?.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

async function translateText(text) {
  if (!text) return text;
  if (!DEEPL_API_KEY) {
    throw new Error('Falta DEEPL_API_KEY en .env.local. Ver instrucciones arriba en este archivo.');
  }
  const res = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: [text], source_lang: 'EN', target_lang: 'ES' }),
  });
  if (!res.ok) throw new Error(`DeepL respondió ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.translations[0].text;
}

async function translateSpell(spell) {
  const [name, description] = await Promise.all([
    translateText(spell.name),
    translateText(spell.description),
  ]);
  return {
    name,
    nameOriginal: spell.name,
    level: spell.level,
    school: spell.school, // TODO: mapear a un diccionario ES fijo (ver README)
    description,
    source: spell.source ?? 'SRD 5.2.1 (CC-BY-4.0)',
  };
}

async function processFile(fileName) {
  const enPath = new URL(fileName, EN_DIR);
  const esPath = new URL(fileName, ES_DIR);

  let raw;
  try {
    raw = await fs.readFile(enPath, 'utf-8');
  } catch {
    console.warn(`⚠ No existe ${fileName} en src/data/en/, lo salteo.`);
    return;
  }

  const items = JSON.parse(raw);
  console.log(`Traduciendo ${items.length} elementos de ${fileName}…`);

  const translated = [];
  for (const item of items) {
    translated.push(await translateSpell(item));
    // Pequeña pausa para no saturar la API gratuita.
    await new Promise((r) => setTimeout(r, 150));
  }

  await fs.mkdir(path.dirname(new URL(esPath).pathname), { recursive: true });
  await fs.writeFile(esPath, JSON.stringify(translated, null, 2), 'utf-8');
  console.log(`✔ Guardado en src/data/es/${fileName}`);
}

async function main() {
  await processFile('spells.json');
  // Agregá más líneas a medida que sumes datasets:
  // await processFile('items.json');
  // await processFile('feats.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
