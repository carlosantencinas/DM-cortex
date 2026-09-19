export const CLASS_DATA = {
  'Bárbaro': {
    hitDie: 'd12',
    primary: 'Fuerza',
    saves: ['Fuerza', 'Constitución'],
    skills: { choose: 2, options: ['Trato con Animales','Atletismo','Intimidación','Naturaleza','Percepción','Supervivencia'] },
    weapons: 'Armas sencillas y marciales',
    armor: 'Armaduras ligeras y medias, escudos',
    tools: 'Ninguna',
    equipment: [
      'A: Gran hacha, 4 hachas de mano, paquete de explorador y 15 PO',
      'B: 75 PO'
    ],
    masteryCount: level => level >= 10 ? 4 : level >= 4 ? 3 : 2,
    masteryPool: ['Hacha de batalla','Gran hacha','Hacha de mano','Jabalina','Martillo ligero','Maza','Lanza','Espada larga','Espadón','Mandoble'],
    level1Features: ['Furia','Defensa sin armadura','Maestría de armas']
  },
  'Bardo': {
    hitDie: 'd8',
    primary: 'Carisma',
    saves: ['Destreza', 'Carisma'],
    skills: { choose: 3, options: 'Cualquier 3 habilidades' },
    weapons: 'Armas sencillas',
    armor: 'Armadura ligera',
    tools: 'Elige 3 instrumentos musicales',
    equipment: [
      'A: Armadura de cuero, 2 dagas, un instrumento musical, paquete de artista y 19 PO',
      'B: 90 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Inspiración de Bardo','Lanzamiento de conjuros']
  },
  'Clérigo': {
    hitDie: 'd8',
    primary: 'Sabiduría',
    saves: ['Sabiduría', 'Carisma'],
    skills: { choose: 2, options: ['Historia','Perspicacia','Medicina','Persuasión','Religión'] },
    weapons: 'Armas sencillas',
    armor: 'Armaduras ligeras y medias, escudos',
    tools: 'Ninguna',
    equipment: [
      'A: Camisa de malla, escudo, maza, símbolo sagrado, paquete de sacerdote y 7 PO',
      'B: 110 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Lanzamiento de conjuros','Orden Divina']
  },
  'Druida': {
    hitDie: 'd8',
    primary: 'Sabiduría',
    saves: ['Inteligencia', 'Sabiduría'],
    skills: { choose: 2, options: ['Arcanos','Trato con Animales','Perspicacia','Medicina','Naturaleza','Percepción','Religión','Supervivencia'] },
    weapons: 'Armas sencillas',
    armor: 'Armaduras ligeras y escudos',
    tools: 'Kit de herboristería',
    equipment: [
      'A: Armadura de cuero, escudo, hoz, foco druídico (bastón), paquete de explorador, kit de herboristería y 9 PO',
      'B: 50 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Lanzamiento de conjuros','Druídico','Orden Primordial']
  },
  'Guerrero': {
    hitDie: 'd10',
    primary: 'Fuerza o Destreza',
    saves: ['Fuerza', 'Constitución'],
    skills: { choose: 2, options: ['Acrobacias','Trato con Animales','Atletismo','Historia','Perspicacia','Intimidación','Persuasión','Percepción','Supervivencia'] },
    weapons: 'Armas sencillas y marciales',
    armor: 'Armaduras ligeras, medias y pesadas, escudos',
    tools: 'Ninguna',
    equipment: [
      'A: Cota de malla, espada grande, mayal, 8 jabalinas, paquete de dungeoneer y 4 PO',
      'B: Armadura de cuero tachonado, cimitarra, espada corta, arco largo, 20 flechas, carcaj, paquete de dungeoneer y 11 PO',
      'C: 155 PO'
    ],
    masteryCount: level => level >= 16 ? 6 : level >= 10 ? 5 : level >= 4 ? 4 : 3,
    masteryPool: ['Arco largo','Arco corto','Daga','Espada corta','Espada larga','Cimitarra','Estoque','Lanza','Martillo de guerra','Gran hacha','Espada grande','Mayal','Pica','Alabarda','Ballesta ligera','Ballesta pesada'],
    level1Features: ['Estilo de combate','Segundo aliento','Maestría de armas']
  },
  'Monje': {
    hitDie: 'd8',
    primary: 'Destreza y Sabiduría',
    saves: ['Fuerza', 'Destreza'],
    skills: { choose: 2, options: ['Acrobacias','Atletismo','Historia','Perspicacia','Religión','Sigilo'] },
    weapons: 'Armas sencillas y armas marciales con propiedad Ligera',
    armor: 'Ninguna',
    tools: 'Elige un tipo de herramientas de artesano o instrumento musical',
    equipment: [
      'A: Lanza, 5 dagas, herramienta o instrumento elegido, paquete de explorador y 11 PO',
      'B: 50 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Artes marciales','Defensa sin armadura']
  },
  'Paladín': {
    hitDie: 'd10',
    primary: 'Fuerza y Carisma',
    saves: ['Sabiduría', 'Carisma'],
    skills: { choose: 2, options: ['Atletismo','Perspicacia','Intimidación','Medicina','Persuasión','Religión'] },
    weapons: 'Armas sencillas y marciales',
    armor: 'Armaduras ligeras, medias y pesadas, escudos',
    tools: 'Ninguna',
    equipment: [
      'A: Cota de malla, escudo, espada larga, 6 jabalinas, símbolo sagrado, paquete de sacerdote y 9 PO',
      'B: 150 PO'
    ],
    masteryCount: () => 2,
    masteryPool: ['Espada larga','Gran hacha','Espada grande','Lanza','Mayal','Jabalina','Maza','Martillo de guerra','Estoque','Espada corta'],
    level1Features: ['Imposición de manos','Lanzamiento de conjuros','Maestría de armas']
  },
  'Explorador': {
    hitDie: 'd10',
    primary: 'Destreza y Sabiduría',
    saves: ['Fuerza', 'Destreza'],
    skills: { choose: 3, options: ['Trato con Animales','Atletismo','Perspicacia','Investigación','Naturaleza','Percepción','Sigilo','Supervivencia'] },
    weapons: 'Armas sencillas y marciales',
    armor: 'Armaduras ligeras y medias, escudos',
    tools: 'Ninguna',
    equipment: [
      'A: Armadura de cuero tachonado, cimitarra, espada corta, arco largo, 20 flechas, carcaj, foco druídico, paquete de explorador y 7 PO',
      'B: 150 PO'
    ],
    masteryCount: () => 2,
    masteryPool: ['Arco largo','Espada corta','Cimitarra','Daga','Jabalina','Lanza','Arco corto','Estoque','Espada larga'],
    level1Features: ['Lanzamiento de conjuros','Enemigo predilecto','Maestría de armas']
  },
  'Pícaro': {
    hitDie: 'd8',
    primary: 'Destreza',
    saves: ['Destreza', 'Inteligencia'],
    skills: { choose: 4, options: ['Acrobacias','Atletismo','Engaño','Perspicacia','Intimidación','Investigación','Percepción','Persuasión','Juego de Manos','Sigilo'] },
    weapons: 'Armas sencillas y armas marciales con propiedad Sutil o Ligera',
    armor: 'Armaduras ligeras',
    tools: 'Herramientas de ladrón',
    equipment: [
      'A: Armadura de cuero, 2 dagas, espada corta, arco corto, 20 flechas, carcaj, herramientas de ladrón, paquete de ladrón y 8 PO',
      'B: 100 PO'
    ],
    masteryCount: () => 2,
    masteryPool: ['Daga','Arco corto','Espada corta','Cimitarra','Estoque','Espada larga','Hoz','Martillo ligero','Hacha de mano'],
    level1Features: ['Pericia','Ataque furtivo','Jerga de ladrones','Maestría de armas']
  },
  'Hechicero': {
    hitDie: 'd6',
    primary: 'Carisma',
    saves: ['Constitución', 'Carisma'],
    skills: { choose: 2, options: ['Arcanos','Engaño','Perspicacia','Intimidación','Persuasión','Religión'] },
    weapons: 'Armas sencillas',
    armor: 'Ninguna',
    tools: 'Ninguna',
    equipment: [
      'A: Lanza, 2 dagas, foco arcano (cristal), paquete de dungeoneer y 28 PO',
      'B: 50 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Lanzamiento de conjuros','Hechicería innata']
  },
  'Brujo': {
    hitDie: 'd8',
    primary: 'Carisma',
    saves: ['Sabiduría', 'Carisma'],
    skills: { choose: 2, options: ['Arcanos','Engaño','Historia','Intimidación','Investigación','Naturaleza','Religión'] },
    weapons: 'Armas sencillas',
    armor: 'Armaduras ligeras',
    tools: 'Ninguna',
    equipment: [
      'A: Armadura de cuero, hoz, 2 dagas, foco arcano (orbe), libro de saber oculto, paquete de erudito y 15 PO',
      'B: 100 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Invocaciones sobrenaturales','Magia de pacto']
  },
  'Mago': {
    hitDie: 'd6',
    primary: 'Inteligencia',
    saves: ['Inteligencia', 'Sabiduría'],
    skills: { choose: 2, options: ['Arcanos','Historia','Perspicacia','Investigación','Medicina','Naturaleza','Religión'] },
    weapons: 'Armas sencillas',
    armor: 'Ninguna',
    tools: 'Ninguna',
    equipment: [
      'A: 2 dagas, foco arcano (bastón), túnica, libro de conjuros, paquete de erudito y 5 PO',
      'B: 55 PO'
    ],
    masteryCount: () => 0,
    masteryPool: [],
    level1Features: ['Lanzamiento de conjuros','Adepto ritual','Recuperación arcana']
  }
};

export function getClassData(className) {
  return CLASS_DATA[className] || null;
}

export function getMasteryCount(className, level = 1) {
  const data = getClassData(className);
  return data ? data.masteryCount(Number(level) || 1) : 0;
}
