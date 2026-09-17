import { Link } from 'react-router-dom';
import { useCharacters } from '../context/useCharacters';

export default function CharacterManager() {
  const { characters, activeCharacterId, createCharacter, deleteCharacter, duplicateCharacter, selectCharacter } = useCharacters();

  async function handleCreate() {
    const id = await createCharacter();
    selectCharacter(id);
  }

  return (
    <section className="character-manager">
      <div className="manager-hero">
        <div>
          <div className="eyebrow">DM CORTEX</div>
          <h1>Mis personajes</h1>
          <p className="muted">Crea y administra todos tus personajes de D&D desde un solo lugar.</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>＋ Crear personaje</button>
      </div>

      {characters.length === 0 ? (
        <div className="empty-characters">
          <div className="empty-d20">d20</div>
          <h2>Tu primera aventura comienza aquí</h2>
          <p className="muted">Crea un personaje y después podrás asociarlo a una campaña.</p>
          <button className="btn-primary" onClick={handleCreate}>Crear mi primer personaje</button>
        </div>
      ) : (
        <div className="character-grid">
          {characters.map(character => (
            <article className={`character-card ${activeCharacterId === character.id ? 'is-active' : ''}`} key={character.id}>
              <div className="character-card-art">{(character.name || '?').slice(0, 1).toUpperCase()}</div>
              <div className="character-card-body">
                <div className="character-card-top">
                  <span className="mini-label">Nivel {character.level || 1}</span>
                  {activeCharacterId === character.id && <span className="role-badge">ACTIVO</span>}
                </div>
                <h2>{character.name || 'Sin nombre'}</h2>
                <p>{[character.race, character.class].filter(Boolean).join(' · ') || 'Personaje sin configurar'}</p>
                <p className="muted">{character.background || 'Sin trasfondo'}{character.campaignId ? ' · En campaña' : ' · Sin campaña'}</p>
                <div className="character-card-actions">
                  <Link className="btn-primary" to={`/personaje/${character.id}`} onClick={() => selectCharacter(character.id)}>Abrir hoja</Link>
                  <button className="btn-secondary" onClick={() => duplicateCharacter(character)}>Duplicar</button>
                  <button className="icon-button danger" title="Eliminar personaje" onClick={() => { if (window.confirm(`¿Eliminar a ${character.name || 'este personaje'}?`)) deleteCharacter(character.id); }}>×</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
