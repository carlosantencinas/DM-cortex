import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCampaign } from '../context/useCampaign';

const conditions = ['Asustado', 'Paralizado', 'Envenenado', 'Cegado', 'Incapacitado'];
const conditionText = {
  Asustado: 'Desventaja en pruebas y ataques mientras la fuente del miedo esté a la vista.',
  Paralizado: 'Incapacitado; falla salvaciones de FUE y DES automáticamente.',
  Envenenado: 'Desventaja en tiradas de ataque y pruebas de característica.',
  Cegado: 'No puede ver; ataques contra él tienen ventaja y sus ataques desventaja.',
  Incapacitado: 'No puede realizar acciones ni reacciones.',
};

export default function DmDashboard() {
  const { campaignId, campaign, isDm } = useCampaign();
  const [characters, setCharacters] = useState([]);
  const [condition, setCondition] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!campaignId) return undefined;

    return onSnapshot(
      collection(db, 'campaigns', campaignId, 'characters'),
      (snapshot) => setCharacters(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
      (error) => console.error('No se pudieron cargar los personajes de la campaña:', error),
    );
  }, [campaignId]);

  const hp = useMemo(
    () => characters.reduce((total, character) => total + (character.hp?.actual || 0), 0),
    [characters],
  );

  if (!campaignId || !campaign) {
    return (
      <div className="dm-console stitch-card">
        <span className="stitch-kicker">DUNGEON MASTER</span>
        <h1>Tu mesa aún no está activa</h1>
        <p>Crea una campaña desde el Lobby para abrir el panel táctico.</p>
      </div>
    );
  }

  if (!isDm) {
    return (
      <div className="dm-console stitch-card">
        <span className="stitch-kicker">ACCESO RESTRINGIDO</span>
        <h1>Panel del DM</h1>
        <p>El panel de <b>{campaign.name}</b> pertenece al Dungeon Master.</p>
      </div>
    );
  }

  return (
    <section className="dm-console">
      <header className="dm-console-head">
        <div>
          <span className="stitch-kicker">PANEL DEL DUNGEON MASTER</span>
          <h1>{campaign.name}</h1>
          <p>{characters.length} personaje(s) conectados · estado de mesa en tiempo real</p>
        </div>
        <div className="dm-head-actions">
          <span className="privacy-pill">◉ Pantalla DM: Privada</span>
          <span className="invite-code">{campaign.inviteCode}</span>
        </div>
      </header>

      <div className="dm-statbar">
        <div><small>GRUPO</small><strong>{characters.length}</strong></div>
        <div><small>PV ACTUALES</small><strong>{hp}</strong></div>
        <div><small>CAMPAÑA</small><strong>ACTIVA</strong></div>
        <div><small>CÓDIGO</small><strong>{campaign.inviteCode}</strong></div>
      </div>

      <div className="dm-layout">
        <main className="dm-main">
          <section className="stitch-card combat-panel">
            <div className="dm-section-head">
              <div>
                <span className="stitch-kicker">ENCUENTRO</span>
                <h2>Rastreador de Iniciativa</h2>
              </div>
              <button type="button" className="stitch-secondary">＋ Añadir criatura</button>
            </div>

            <div className="turn-list">
              {characters.map((character, index) => {
                const maxHp = Math.max(1, character.hp?.max || 1);
                const percent = Math.max(0, Math.min(100, ((character.hp?.actual || 0) / maxHp) * 100));

                return (
                  <article className={'turn-row ' + (index === 0 ? 'turn-active' : '')} key={character.id}>
                    <div className="initiative">{character.initiative ?? 0}</div>
                    <div className="turn-info">
                      <strong>{character.name || 'Personaje'}</strong>
                      <span>{character.race || '—'} · {character.class || '—'} · Jugador</span>
                    </div>
                    <div className="turn-hp">
                      <span>PG {character.hp?.actual ?? 0}/{character.hp?.max ?? 0} · CA {character.ac ?? 10}</span>
                      <i><b style={{ width: percent + '%' }} /></i>
                    </div>
                    <button type="button" className="combat-action">⚔ Atacar</button>
                  </article>
                );
              })}

              {characters.length === 0 && (
                <p className="muted">Ningún personaje de la campaña está disponible todavía.</p>
              )}
            </div>
          </section>

          <section className="dm-quick-grid">
            <div className="stitch-card">
              <span className="stitch-kicker">TIRADAS RÁPIDAS</span>
              <h2>Dado del DM</h2>
              <div className="dm-dice">
                {[20, 12, 10, 8, 6, 4].map((die) => (
                  <button type="button" key={die} onClick={() => window.alert('d' + die + ': ' + (Math.floor(Math.random() * die) + 1))}>
                    d{die}
                  </button>
                ))}
              </div>
            </div>

            <div className="stitch-card">
              <span className="stitch-kicker">CD</span>
              <h2>Dificultades</h2>
              <div className="dc-grid">
                <b>Fácil <em>10</em></b>
                <b>Media <em>15</em></b>
                <b>Difícil <em>20</em></b>
                <b>Muy difícil <em>25</em></b>
              </div>
            </div>
          </section>
        </main>

        <aside className="dm-side">
          <section className="stitch-card">
            <div className="dm-side-title"><span>▣</span><h2>Bitácora &amp; Secretos DM</h2></div>
            <div className="secret-note">
              <b>Táctica de sesión</b>
              <p>Notas privadas del Dungeon Master para mantener el estado narrativo y táctico.</p>
            </div>
            <textarea rows="4" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Añadir nota rápida de la sesión…" />
            <button type="button" className="stitch-secondary full-width">Guardar nota</button>
          </section>

          <section className="stitch-card">
            <div className="dm-side-title"><span>♙</span><h2>PNJs en escena</h2></div>
            <div className="npc-empty">Añade PNJs desde tus notas de sesión.</div>
          </section>

          <section className="stitch-card">
            <div className="dm-side-title"><span>☷</span><h2>Condiciones rápidas</h2></div>
            <div className="condition-list">
              {conditions.map((item) => (
                <button type="button" key={item} className={condition === item ? 'selected' : ''} onClick={() => setCondition(item)}>
                  {item}
                </button>
              ))}
            </div>
            {condition && (
              <p className="condition-detail"><b>{condition}:</b> {conditionText[condition]}</p>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}
