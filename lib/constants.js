// ═══════════════════════════════════════════════
// SELENE ACADEMIA — Constants & Data
// ═══════════════════════════════════════════════

// ── Design Tokens (complement Tailwind) ──
export const COLORS = {
  gold: '#C9A84C',
  teal: '#5B9E8F',
  blue: '#4A6FA5',
  purple: '#7B68AE',
  rose: '#C97B8B',
  success: '#5BB88F',
};

// ── Course Catalog ──
export const COURSES = [
  {
    id: 'brujula-interior',
    title: 'Despierta tu Brújula Interior',
    subtitle: 'Fundamentos de consciencia espiritual y autoconocimiento cósmico',
    level: 'Nivel 0',
    hours: '12h',
    modules: 6,
    lessons_count: 24,
    price: 0,
    price_label: 'GRATIS',
    stripe_price_id: null,
    icon: '🌟',
    color: COLORS.teal,
    tag: 'Lead Magnet',
    science: 'Neuroplasticidad (MBSR — Kabat-Zinn 1990), cronobiología introductoria, eje intestino-cerebro (Mayer 2011).',
    description: 'El punto de partida. Descubre que tienes un don dormido y aprende a despertarlo. Tu carta natal básica, tu primera meditación con resultados reales, y la hoja de ruta para tu camino formativo.',
    for_whom: 'Curiosos, escépticos, personas que sienten que "hay algo más" pero no saben por dónde empezar.',
    outcome: 'Entiendes tu carta natal básica, has hecho tu primera meditación con resultados, y sabes qué camino formativo seguir.',
    lessons: [
      { id: 'b1-l1', title: '¿Qué es la espiritualidad consciente?', duration: '18 min', type: 'lesson', module: 1, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l1.mp4' },
      { id: 'b1-l2', title: 'No es fe ciega: es atención entrenada', duration: '12 min', type: 'lesson', module: 1, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l2.mp4' },
      { id: 'b1-l3', title: 'Tu cerebro como antena: neuroplasticidad', duration: '15 min', type: 'lesson', module: 1, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l3.mp4' },
      { id: 'b1-q1', title: 'Quiz: Fundamentos de consciencia', duration: '5 min', type: 'quiz', module: 1 },
      { id: 'b1-l4', title: 'Tu mapa cósmico — La carta natal', duration: '22 min', type: 'lesson', module: 2, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l4.mp4' },
      { id: 'b1-l5', title: 'Sol, Luna, Ascendente: tu triángulo', duration: '18 min', type: 'lesson', module: 2, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l5.mp4' },
      { id: 'b1-l6', title: 'Cronobiología: tu estación de nacimiento importa', duration: '14 min', type: 'lesson', module: 2, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l6.mp4' },
      { id: 'b1-q2', title: 'Quiz: Tu mapa cósmico', duration: '5 min', type: 'quiz', module: 2 },
      { id: 'b1-l7', title: 'Meditación y cerebro: la ciencia real', duration: '20 min', type: 'lesson', module: 3, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l7.mp4' },
      { id: 'b1-l8', title: 'MBSR: el protocolo con más evidencia', duration: '16 min', type: 'lesson', module: 3, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l8.mp4' },
      { id: 'b1-l9', title: 'Práctica guiada: tu primera meditación', duration: '15 min', type: 'lesson', module: 3, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l9.mp4' },
      { id: 'b1-q3', title: 'Quiz: Meditación basada en evidencia', duration: '5 min', type: 'quiz', module: 3 },
      { id: 'b1-l10', title: 'El péndulo interno: intuición vs. ego', duration: '15 min', type: 'lesson', module: 4, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l10.mp4' },
      { id: 'b1-l11', title: 'Señales del cuerpo: el eje intestino-cerebro', duration: '14 min', type: 'lesson', module: 4, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l11.mp4' },
      { id: 'b1-l12', title: 'Práctica: escucha tu intuición 7 días', duration: '10 min', type: 'lesson', module: 4, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l12.mp4' },
      { id: 'b1-q4', title: 'Quiz: Intuición entrenada', duration: '5 min', type: 'quiz', module: 4 },
      { id: 'b1-l13', title: 'Los 4 pilares del autoconocimiento', duration: '18 min', type: 'lesson', module: 5, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l13.mp4' },
      { id: 'b1-l14', title: 'Tu perfil energético: descúbrelo', duration: '20 min', type: 'lesson', module: 5, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l14.mp4' },
      { id: 'b1-l15', title: 'Práctica: mapa de energía personal', duration: '12 min', type: 'lesson', module: 5, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l15.mp4' },
      { id: 'b1-q5', title: 'Quiz: Autoconocimiento', duration: '5 min', type: 'quiz', module: 5 },
      { id: 'b1-l16', title: 'Tu hoja de ruta formativa', duration: '15 min', type: 'lesson', module: 6, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l16.mp4' },
      { id: 'b1-l17', title: 'Resumen: lo que has aprendido', duration: '10 min', type: 'lesson', module: 6, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l17.mp4' },
      { id: 'b1-l18', title: 'Recursos y próximos pasos', duration: '8 min', type: 'lesson', module: 6, videoUrl: 'https://lerfefvqfwdsubchzqyk.supabase.co/storage/v1/object/public/course-videos/brujula-interior/m1_l18.mp4' },
      { id: 'b1-exam', title: 'Evaluación final + Certificado', duration: '15 min', type: 'exam', module: 6 },
    ],
  },
  {
    id: 'magnetismo-consciente',
    title: 'Magnetismo Consciente',
    subtitle: 'Neurociencia de la atracción y la intención — lo que la ley de atracción no te cuenta',
    level: 'Nivel 1',
    hours: '18h',
    modules: 8,
    lessons_count: 24,
    price: 2499,
    price_label: '€24,99',
    stripe_price_id: 'price_1TCyZs3w6LxSJCcMfKHSHQsA',
    icon: '🧲',
    color: COLORS.purple,
    tag: 'Popular',
    science: 'HeartMath Institute (McCraty 2015), neuroplasticidad (Lazar 2005), epigenética conductual (Meaney 2001), sistema de activación reticular.',
    description: 'La "ley de atracción" con base científica real. Coherencia cardíaca, rewiring neuronal, y cómo tus genes responden a tus estados emocionales.',
    for_whom: 'Personas interesadas en manifestación que quieren entender QUÉ funciona y POR QUÉ, sin pseudociencia.',
    outcome: 'Dominas la coherencia cardíaca HeartMath, entiendes la neuroplasticidad aplicada, y tienes una rutina de 21 días con base científica.',
    lessons: [],
  },
  {
    id: 'astrologia-natal',
    title: 'Astrología Natal Profunda',
    subtitle: 'Tu carta natal al detalle — planetas, casas, aspectos y tránsitos',
    level: 'Nivel 1',
    hours: '22h',
    modules: 10,
    lessons_count: 30,
    price: 2999,
    price_label: '€29,99',
    stripe_price_id: 'price_1TCyZt3w6LxSJCcM0ht4G5O5',
    icon: '🌙',
    color: COLORS.blue,
    tag: 'Nuevo',
    science: 'Astronomía posicional (efemérides JPL), cronobiología (Foster & Kreitzman 2017), psicología junguiana (arquetipos).',
    description: 'De saber tu signo solar a interpretar una carta natal completa. Planetas personales, casas, aspectos, y cómo leer los tránsitos actuales.',
    for_whom: 'Quienes quieren ir más allá del horóscopo del periódico y entender la astrología como sistema simbólico complejo.',
    outcome: 'Interpretas tu carta natal completa, identificas tus tránsitos activos, y puedes hacer una lectura básica para otros.',
    lessons: [],
  },
  {
    id: 'cronobiologia',
    title: 'Cronobiología y Ritmos Vitales',
    subtitle: 'La ciencia real de cómo los ciclos cósmicos afectan tu biología',
    level: 'Nivel 2',
    hours: '20h',
    modules: 8,
    lessons_count: 24,
    price: 2999,
    price_label: '€29,99',
    stripe_price_id: 'price_1TCyZu3w6LxSJCcM1Weo76QI',
    icon: '🧬',
    color: COLORS.teal,
    tag: 'Ciencia',
    science: 'Ritmos circadianos (Nobel 2017 — Hall, Rosbash, Young), genes PER1/CLOCK, melatonina, cortisol, serotonina, estudios Gonda 2014, Current Biology 2013/2021.',
    description: 'El curso más "científico" de Selene. Donde la astrología encuentra la biología molecular. Ritmos circadianos, ultradianos, lunares y estacionales con evidencia real.',
    for_whom: 'Escépticos curiosos, profesionales de salud/bienestar, y cualquiera que quiera entender la base real.',
    outcome: 'Entiendes cómo los ritmos biológicos afectan tu vida diaria y diseñas tu calendario personalizado en sincronía.',
    lessons: [],
  },
  {
    id: 'tarot-intuitivo',
    title: 'El Arte del Tarot Intuitivo',
    subtitle: 'De las cartas como adivinación a herramienta de transformación interior',
    level: 'Nivel 2',
    hours: '25h',
    modules: 10,
    lessons_count: 30,
    price: 3499,
    price_label: '€34,99',
    stripe_price_id: 'price_1TCyZv3w6LxSJCcMmK4xyzId',
    icon: '✨',
    color: COLORS.gold,
    tag: 'Certificación',
    science: 'Psicología proyectiva (Jung 1964), arquetipos del inconsciente colectivo, intuición como sistema neurológico (Kahneman 2011).',
    description: 'Olvida memorizar significados. Aprende a SENTIR las cartas. El tarot es un espejo del inconsciente, no una bola de cristal.',
    for_whom: 'Interesados en tarot que quieren ir más allá de "qué significa esta carta". Enfoque terapéutico y proyectivo.',
    outcome: 'Haces tiradas intuitivas de 30+ min con narrativa coherente, integras tarot + astrología, y puedes ofrecer lecturas.',
    lessons: [],
  },
  {
    id: 'raices-invisibles',
    title: 'Raíces Invisibles',
    subtitle: 'Astrogenealogía: descubre los patrones familiares ocultos en tu carta natal',
    level: 'Nivel 2',
    hours: '20h',
    modules: 8,
    lessons_count: 24,
    price: 3499,
    price_label: '€34,99',
    stripe_price_id: null,
    icon: '🌿',
    color: COLORS.rose,
    tag: 'Nuevo',
    science: 'Teoría de Sistemas Familiares de Bowen, epigenética transgeneracional (Yehuda 2016), teoría del apego (Bowlby 1969), IFS (Schwartz 1995), astronomía posicional (Casas 4, 8, 12).',
    description: 'Tu carta natal guarda las huellas de tu sistema familiar. Aprende a leer los patrones heredados en las Casas 4, 8 y 12, la Luna, Saturno y los Nodos Lunares — y a transformarlos con ejercicios sistémicos basados en evidencia.',
    for_whom: 'Personas que sienten que repiten patrones familiares, que quieren entender la herencia emocional invisible, o que buscan sanar dinámicas con su familia de origen.',
    outcome: 'Identificas los patrones transgeneracionales en tu carta natal, comprendes las dinámicas sistémicas de tu familia, y tienes herramientas concretas para transformar lealtades invisibles.',
    lessons: [
      // Module 1: Fundamentos sistémicos
      { id: 'ri-l1', title: '¿Qué son los patrones familiares invisibles?', duration: '16 min', type: 'lesson', module: 1 },
      { id: 'ri-l2', title: 'Teoría de Sistemas Familiares: de Bowen a la epigenética', duration: '18 min', type: 'lesson', module: 1 },
      { id: 'ri-l3', title: 'Las tres leyes sistémicas: pertenencia, orden y equilibrio', duration: '15 min', type: 'lesson', module: 1 },
      { id: 'ri-q1', title: 'Quiz: Fundamentos sistémicos', duration: '5 min', type: 'quiz', module: 1 },
      // Module 2: La carta natal como mapa familiar
      { id: 'ri-l4', title: 'Casa 4: tus raíces, tu hogar emocional', duration: '20 min', type: 'lesson', module: 2 },
      { id: 'ri-l5', title: 'Casa 8: herencias, transformación y secretos familiares', duration: '18 min', type: 'lesson', module: 2 },
      { id: 'ri-l6', title: 'Casa 12: el inconsciente colectivo familiar', duration: '17 min', type: 'lesson', module: 2 },
      { id: 'ri-q2', title: 'Quiz: Las casas familiares', duration: '5 min', type: 'quiz', module: 2 },
      // Module 3: Planetas de herencia
      { id: 'ri-l7', title: 'La Luna: tu herencia emocional materna', duration: '18 min', type: 'lesson', module: 3 },
      { id: 'ri-l8', title: 'Saturno: mandatos, límites y estructura heredada', duration: '16 min', type: 'lesson', module: 3 },
      { id: 'ri-l9', title: 'Los Nodos Lunares: karma generacional', duration: '20 min', type: 'lesson', module: 3 },
      { id: 'ri-q3', title: 'Quiz: Planetas de herencia', duration: '5 min', type: 'quiz', module: 3 },
      // Module 4: Epigenética y trauma transgeneracional
      { id: 'ri-l10', title: 'Epigenética: cómo el trauma se hereda biológicamente', duration: '18 min', type: 'lesson', module: 4 },
      { id: 'ri-l11', title: 'Lealtades invisibles: por qué repites lo que no viviste', duration: '15 min', type: 'lesson', module: 4 },
      { id: 'ri-l12', title: 'Ejercicio: tu genograma emocional', duration: '22 min', type: 'lesson', module: 4 },
      { id: 'ri-q4', title: 'Quiz: Herencia transgeneracional', duration: '5 min', type: 'quiz', module: 4 },
      // Module 5: Constelaciones y carta natal
      { id: 'ri-l13', title: 'Astrogenealogía: cuando la carta natal habla de tu familia', duration: '20 min', type: 'lesson', module: 5 },
      { id: 'ri-l14', title: 'Aspectos planetarios que revelan dinámicas familiares', duration: '18 min', type: 'lesson', module: 5 },
      { id: 'ri-l15', title: 'Práctica: lectura sistémica de tu propia carta', duration: '25 min', type: 'lesson', module: 5 },
      { id: 'ri-q5', title: 'Quiz: Astrogenealogía aplicada', duration: '5 min', type: 'quiz', module: 5 },
      // Module 6: Ejercicios de transformación
      { id: 'ri-l16', title: 'Movimientos sistémicos: ejercicios individuales guiados', duration: '22 min', type: 'lesson', module: 6 },
      { id: 'ri-l17', title: 'Ritual de reconexión: honrar tu linaje', duration: '18 min', type: 'lesson', module: 6 },
      { id: 'ri-l18', title: 'Práctica: carta de liberación a tu sistema familiar', duration: '20 min', type: 'lesson', module: 6 },
      { id: 'ri-q6', title: 'Quiz: Transformación sistémica', duration: '5 min', type: 'quiz', module: 6 },
      // Module 7: Relaciones y sistema actual
      { id: 'ri-l19', title: 'Cómo tus patrones familiares afectan tus relaciones', duration: '18 min', type: 'lesson', module: 7 },
      { id: 'ri-l20', title: 'Sinastría sistémica: tu pareja como espejo familiar', duration: '20 min', type: 'lesson', module: 7 },
      { id: 'ri-l21', title: 'Romper el ciclo: crear tu propio orden', duration: '16 min', type: 'lesson', module: 7 },
      { id: 'ri-q7', title: 'Quiz: Relaciones y sistema', duration: '5 min', type: 'quiz', module: 7 },
      // Module 8: Integración
      { id: 'ri-l22', title: 'Tu mapa completo: integrando carta natal + sistema familiar', duration: '22 min', type: 'lesson', module: 8 },
      { id: 'ri-l23', title: 'Plan de sanación sistémica personalizado', duration: '15 min', type: 'lesson', module: 8 },
      { id: 'ri-l24', title: 'Recursos, comunidad y próximos pasos', duration: '10 min', type: 'lesson', module: 8 },
      { id: 'ri-exam', title: 'Evaluación final + Certificado', duration: '15 min', type: 'exam', module: 8 },
    ],
  },
  {
    id: 'guia-profesional',
    title: 'Guía Espiritual Profesional',
    subtitle: 'El Máster: convierte tu don en tu profesión',
    level: 'Nivel 3',
    hours: '40h',
    modules: 10,
    lessons_count: 30,
    price: 5999,
    price_label: '€59,99',
    stripe_price_id: 'price_1TCyZw3w6LxSJCcM5cGtI6ER',
    icon: '🌀',
    color: COLORS.gold,
    tag: 'Máster',
    science: 'Integración de todos los pilares + ética profesional (ISAR/NCGR) + comunicación transformadora + emprendimiento.',
    description: 'Has desarrollado tu don. Ahora aprende a compartirlo profesionalmente, éticamente, y con éxito. Incluye prácticas supervisadas.',
    for_whom: 'Alumnos que han completado 3+ cursos Selene y quieren ejercer profesionalmente como guías espirituales.',
    outcome: 'Marca personal, oferta de servicios, 10+ consultas supervisadas, código ético, y perfil en directorio Selene.',
    lessons: [],
  },
];

// ── Levels ──
export const LEVELS = [
  { name: 'Semilla Cósmica', minXp: 0, maxXp: 500 },
  { name: 'Exploración Cósmica', minXp: 500, maxXp: 2000 },
  { name: 'Navegante Estelar', minXp: 2000, maxXp: 5000 },
  { name: 'Guardián Lunar', minXp: 5000, maxXp: 10000 },
  { name: 'Luz Maestra', minXp: 10000, maxXp: Infinity },
];

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.minXp && xp < l.maxXp) || LEVELS[0];
}

// ── XP Rewards ──
export const XP_REWARDS = {
  lesson_complete: 50,
  quiz_pass: 100,
  exam_pass: 250,
  streak_day: 25,
  course_complete: 500,
};

// ── Quiz Questions ──
// Keyed by lesson ID. Each quiz/exam has at least 3 questions.
export const QUIZ_QUESTIONS = {
  // Module 1: Fundamentos de consciencia
  'b1-q1': [
    {
      q: '¿Qué significa "espiritualidad consciente" en el contexto de este curso?',
      options: ['Seguir dogmas religiosos', 'Atención entrenada basada en evidencia', 'Creencia ciega en lo sobrenatural', 'Prácticas sin base científica'],
      correct: 1,
    },
    {
      q: '¿Qué propiedad del cerebro permite que la meditación modifique sus estructuras?',
      options: ['La memoria a largo plazo', 'La neuroplasticidad', 'El efecto placebo', 'La herencia genética'],
      correct: 1,
    },
    {
      q: '¿Cuál es la diferencia entre fe ciega y atención entrenada?',
      options: ['No hay diferencia', 'La atención entrenada se basa en práctica repetida y observable', 'La fe ciega es más efectiva', 'La atención entrenada requiere religión'],
      correct: 1,
    },
  ],
  // Module 2: Tu mapa cósmico
  'b1-q2': [
    {
      q: '¿Qué representa el "triángulo" Sol-Luna-Ascendente en astrología?',
      options: ['Tres planetas del sistema solar', 'Los tres aspectos fundamentales de tu personalidad', 'Tres fases de la luna', 'Tres constelaciones'],
      correct: 1,
    },
    {
      q: '¿Qué estudia la cronobiología?',
      options: ['Los horóscopos diarios', 'Los ritmos biológicos y su sincronización', 'La astrología natal', 'Las fases lunares exclusivamente'],
      correct: 1,
    },
    {
      q: '¿Qué es una carta natal?',
      options: ['Un horóscopo del periódico', 'Un mapa de las posiciones planetarias en el momento de tu nacimiento', 'Una lectura de tarot', 'Un test de personalidad'],
      correct: 1,
    },
  ],
  // Module 3: Meditación basada en evidencia
  'b1-q3': [
    {
      q: '¿Qué estructura cerebral se modifica con la práctica meditativa según los estudios de neuroplasticidad?',
      options: ['El hipocampo', 'La corteza prefrontal', 'La amígdala', 'Todas las anteriores'],
      correct: 3,
    },
    {
      q: '¿Qué protocolo tiene la mayor base de evidencia peer-reviewed para meditación?',
      options: ['Visualización creativa', 'MBSR (Mindfulness-Based Stress Reduction)', 'Meditación trascendental', 'Yoga nidra'],
      correct: 1,
    },
    {
      q: '¿Quién desarrolló el protocolo MBSR?',
      options: ['Deepak Chopra', 'Jon Kabat-Zinn', 'Matthieu Ricard', 'Thich Nhat Hanh'],
      correct: 1,
    },
  ],
  // Module 4: Intuición entrenada
  'b1-q4': [
    {
      q: '¿Qué es el eje intestino-cerebro?',
      options: ['Un ejercicio de yoga', 'La conexión bidireccional entre el sistema digestivo y el cerebro', 'Una dieta especial', 'Un tipo de meditación'],
      correct: 1,
    },
    {
      q: '¿Cuál es la diferencia entre intuición y ego según este módulo?',
      options: ['Son lo mismo', 'La intuición es serena y el ego genera urgencia/miedo', 'El ego es siempre correcto', 'La intuición no existe científicamente'],
      correct: 1,
    },
    {
      q: '¿Cómo se entrena la intuición según la evidencia presentada?',
      options: ['Leyendo horóscopos', 'Con práctica repetida de escucha corporal y atención plena', 'Con suplementos', 'No se puede entrenar'],
      correct: 1,
    },
  ],
  // Module 5: Autoconocimiento
  'b1-q5': [
    {
      q: '¿Cuáles son los 4 pilares del autoconocimiento presentados en el curso?',
      options: ['Tarot, astrología, meditación, yoga', 'Cuerpo, mente, emociones, espíritu', 'Tierra, agua, fuego, aire', 'Sol, luna, estrellas, planetas'],
      correct: 1,
    },
    {
      q: '¿Qué es un "perfil energético"?',
      options: ['Tu consumo eléctrico', 'Un mapa de tus patrones de energía personal basado en observación', 'Un análisis de sangre', 'Tu signo zodiacal'],
      correct: 1,
    },
    {
      q: '¿Por qué es importante el mapa de energía personal?',
      options: ['Para predecir el futuro', 'Para identificar patrones y optimizar tu bienestar diario', 'Para impresionar a otros', 'No tiene utilidad real'],
      correct: 1,
    },
  ],
  // ── Raíces Invisibles (Constelaciones + Astrogenealogía) ──
  // Module 1: Fundamentos sistémicos
  'ri-q1': [
    {
      q: '¿Cuál es la premisa central de la Teoría de Sistemas Familiares de Bowen?',
      options: ['Cada persona es independiente de su familia', 'La familia funciona como un sistema emocional interconectado', 'Solo importan los genes heredados', 'Los patrones familiares no se transmiten'],
      correct: 1,
    },
    {
      q: '¿Cuáles son las tres leyes sistémicas fundamentales?',
      options: ['Amor, verdad, justicia', 'Pertenencia, orden y equilibrio', 'Nacimiento, vida y muerte', 'Pasado, presente y futuro'],
      correct: 1,
    },
    {
      q: '¿Qué estudia la epigenética transgeneracional?',
      options: ['La secuencia del ADN', 'Cómo las experiencias de generaciones anteriores modifican la expresión genética en descendientes', 'Solo las enfermedades hereditarias', 'Las mutaciones genéticas al azar'],
      correct: 1,
    },
  ],
  // Module 2: Las casas familiares
  'ri-q2': [
    {
      q: '¿Qué representa la Casa 4 en la carta natal?',
      options: ['Las amistades', 'Las raíces, el hogar emocional y la familia de origen', 'La carrera profesional', 'Los viajes largos'],
      correct: 1,
    },
    {
      q: '¿Qué temas rige la Casa 8?',
      options: ['La comunicación', 'Herencias, transformación, secretos y recursos compartidos', 'El trabajo diario', 'La identidad personal'],
      correct: 1,
    },
    {
      q: '¿Por qué la Casa 12 se relaciona con el inconsciente familiar?',
      options: ['Es la última casa del zodíaco', 'Representa lo oculto, los patrones inconscientes y las memorias no procesadas del linaje', 'Solo habla de espiritualidad', 'No tiene relación con la familia'],
      correct: 1,
    },
  ],
  // Module 3: Planetas de herencia
  'ri-q3': [
    {
      q: '¿Qué herencia representa la Luna en la carta natal?',
      options: ['La herencia económica', 'La herencia emocional y los patrones maternos', 'La herencia intelectual', 'La herencia física'],
      correct: 1,
    },
    {
      q: '¿Qué función tiene Saturno en el sistema familiar?',
      options: ['Expansión y suerte', 'Estructura, límites, mandatos y responsabilidades heredadas', 'Creatividad y romance', 'Comunicación y viajes'],
      correct: 1,
    },
    {
      q: '¿Qué simbolizan los Nodos Lunares a nivel transgeneracional?',
      options: ['Las fases de la luna', 'El eje entre patrones heredados (Nodo Sur) y la evolución pendiente (Nodo Norte)', 'Los eclipses solamente', 'No tienen significado familiar'],
      correct: 1,
    },
  ],
  // Module 4: Herencia transgeneracional
  'ri-q4': [
    {
      q: '¿Qué demostró la investigación de Rachel Yehuda sobre descendientes del Holocausto?',
      options: ['Que el trauma no se transmite', 'Que los marcadores epigenéticos del trauma se encontraron en la siguiente generación', 'Que solo afecta a quienes lo vivieron', 'Que el ADN no cambia nunca'],
      correct: 1,
    },
    {
      q: '¿Qué son las "lealtades invisibles"?',
      options: ['Contratos legales familiares', 'Vínculos inconscientes que nos llevan a repetir patrones familiares por fidelidad al sistema', 'Promesas hechas en voz alta', 'Tradiciones culturales elegidas'],
      correct: 1,
    },
    {
      q: '¿Qué es un genograma emocional?',
      options: ['Un test de ADN', 'Un mapa visual de las relaciones y patrones emocionales de al menos 3 generaciones familiares', 'Un horóscopo familiar', 'Una lista de antepasados'],
      correct: 1,
    },
  ],
  // Module 5: Astrogenealogía aplicada
  'ri-q5': [
    {
      q: '¿Qué es la astrogenealogía?',
      options: ['Una rama de la astronomía', 'La disciplina que estudia cómo la carta natal refleja dinámicas del sistema familiar', 'Un tipo de tarot', 'Una pseudociencia sin aplicación'],
      correct: 1,
    },
    {
      q: '¿Qué aspecto planetario podría indicar conflictos familiares no resueltos?',
      options: ['Trígonos al Sol', 'Cuadraturas de Saturno o Plutón a la Luna o al IC', 'Conjunciones Venus-Júpiter', 'Sextiles a Mercurio'],
      correct: 1,
    },
    {
      q: '¿Por qué suelen repetirse temas astrológicos dentro de una misma familia?',
      options: ['Es pura casualidad', 'Porque los patrones sistémicos se reflejan en configuraciones planetarias compartidas entre miembros', 'Porque todos nacen el mismo día', 'No se repiten'],
      correct: 1,
    },
  ],
  // Module 6: Transformación sistémica
  'ri-q6': [
    {
      q: '¿Qué son los "movimientos sistémicos" individuales?',
      options: ['Ejercicios físicos', 'Ejercicios de visualización guiada donde representas a miembros de tu sistema familiar para revelar dinámicas', 'Mudanzas de casa', 'Técnicas de respiración'],
      correct: 1,
    },
    {
      q: '¿Cuál es el objetivo de honrar el linaje en el trabajo sistémico?',
      options: ['Idealizar a los antepasados', 'Reconocer que cada miembro del sistema tiene un lugar, lo que permite liberar lealtades inconscientes', 'Repetir sus errores', 'Olvidar el pasado'],
      correct: 1,
    },
    {
      q: '¿Para qué sirve la "carta de liberación" al sistema familiar?',
      options: ['Para romper lazos con la familia', 'Para expresar conscientemente lo no dicho, honrar lo vivido y soltar mandatos que ya no te sirven', 'Para quejarse', 'No tiene ningún propósito terapéutico'],
      correct: 1,
    },
  ],
  // Module 7: Relaciones y sistema
  'ri-q7': [
    {
      q: '¿Cómo influyen los patrones familiares en la elección de pareja?',
      options: ['No influyen en absoluto', 'Tendemos a elegir personas que activan dinámicas familiares no resueltas, como espejo inconsciente', 'Solo influye el aspecto físico', 'Es puro azar'],
      correct: 1,
    },
    {
      q: '¿Qué es la "sinastría sistémica"?',
      options: ['Comparar signos solares', 'Analizar cómo los patrones familiares de ambas personas interactúan a través de la comparación de cartas natales', 'Leer el tarot en pareja', 'Un tipo de terapia de grupo'],
      correct: 1,
    },
    {
      q: '¿Qué significa "romper el ciclo" en el contexto sistémico?',
      options: ['Cortar relación con la familia', 'Tomar consciencia de los patrones heredados y elegir activamente respuestas diferentes', 'Ignorar el pasado', 'Cambiar de nombre'],
      correct: 1,
    },
  ],
  // Module 8: Evaluación final Raíces Invisibles
  'ri-exam': [
    {
      q: '¿Qué tres casas de la carta natal se asocian con patrones familiares?',
      options: ['Casas 1, 5 y 9', 'Casas 4, 8 y 12', 'Casas 2, 6 y 10', 'Casas 3, 7 y 11'],
      correct: 1,
    },
    {
      q: '¿Qué evidencia científica respalda la transmisión transgeneracional del trauma?',
      options: ['Ninguna', 'Estudios de epigenética (Yehuda 2016) y la Teoría de Sistemas de Bowen', 'Solo estudios de astrología', 'Solo la tradición oral'],
      correct: 1,
    },
    {
      q: '¿Qué planeta representa los mandatos y limitaciones heredadas del sistema familiar?',
      options: ['Júpiter', 'Venus', 'Saturno', 'Marte'],
      correct: 2,
    },
    {
      q: '¿Qué son las lealtades invisibles?',
      options: ['Promesas conscientes', 'Vínculos inconscientes que nos llevan a repetir patrones por fidelidad al sistema familiar', 'Contratos familiares escritos', 'Herencias económicas'],
      correct: 1,
    },
    {
      q: '¿Cuál es el objetivo final del trabajo de astrogenealogía?',
      options: ['Culpar a la familia', 'Identificar patrones heredados, honrar el sistema y elegir conscientemente tu propio camino', 'Predecir el futuro familiar', 'Cortar lazos familiares'],
      correct: 1,
    },
  ],
  // ── Brújula Interior ──
  // Module 6: Evaluación final
  'b1-exam': [
    {
      q: '¿Qué estructura cerebral se modifica con la práctica meditativa según los estudios de neuroplasticidad?',
      options: ['El hipocampo', 'La corteza prefrontal', 'La amígdala', 'Todas las anteriores'],
      correct: 3,
    },
    {
      q: '¿Qué protocolo tiene la mayor base de evidencia peer-reviewed para meditación?',
      options: ['Visualización creativa', 'MBSR (Mindfulness-Based Stress Reduction)', 'Meditación trascendental', 'Yoga nidra'],
      correct: 1,
    },
    {
      q: 'La cronobiología estudia:',
      options: ['Los horóscopos diarios', 'Los ritmos biológicos y su sincronización', 'La astrología natal', 'Las fases lunares exclusivamente'],
      correct: 1,
    },
    {
      q: '¿Qué es el eje intestino-cerebro?',
      options: ['Un ejercicio de yoga', 'La conexión bidireccional entre el sistema digestivo y el cerebro', 'Una dieta especial', 'Un tipo de meditación'],
      correct: 1,
    },
    {
      q: '¿Qué representa el triángulo Sol-Luna-Ascendente?',
      options: ['Tres planetas lejanos', 'Los tres aspectos fundamentales de tu personalidad', 'Tres fases de la luna', 'Tres tipos de meditación'],
      correct: 1,
    },
  ],
};
