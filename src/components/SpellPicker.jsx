import { useMemo, useState } from 'react';
import spellsEs from '../data/es/spells.json';

// spellsEs es generado por scripts/translate-data.js a partir del SRD 2024
// en inglés. Formato esperado por elemento:
// { name, nameOriginal, level, school, description, source }

export default function SpellPicker({ selected, onChange }) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return spellsEs;
    return spellsEs.filter((s) => s.name.toLowerCase().includes(f));
  }, [filter]);

  function toggle(spellName) {
    const has = selected.includes(spellName);
    onChange(has ? selected.filter((s) => s !== spellName) : [...selected, spellName]);
  }

  return (
    <div className="spell-picker">
      <input
        placeholder="Buscar hechizo (ej: bola de fuego)…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul className="spell-list">
        {filtered.slice(0, 50).map((spell) => (
          <li key={spell.name}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(spell.name)}
                onChange={() => toggle(spell.name)}
              />
              <strong>{spell.name}</strong>
              <span className="spell-meta"> — Nv. {spell.level} · {spell.school}</span>
            </label>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p>No se encontraron hechizos con ese nombre.</p>}
      <ul className="spell-selected-detail">
        {spellsEs.filter((s) => selected.includes(s.name)).map((s) => (
          <li key={s.name}>
            <h4>{s.name} <small>({s.nameOriginal})</small></h4>
            <p>{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
