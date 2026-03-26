const fs = require('fs');
const path = require('path');
const dir = __dirname;

// L1
const l1 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-l1.json'), 'utf8'));
l1.interactive.push(
  {
    type: "concept_map",
    title: "Mapa conceptual: La Carta Natal",
    centerNode: "Carta Natal",
    nodes: [
      { label: "Planetas", icon: "\uD83E\uDE90", description: "Fuerzas psicol\u00f3gicas: Sol, Luna, Mercurio, Venus, Marte y m\u00e1s. Representan funciones internas." },
      { label: "Signos", icon: "\u2648", description: "Estilos de expresi\u00f3n: c\u00f3mo se manifiesta cada fuerza planetaria. 12 arquetipos zodiacales." },
      { label: "Casas", icon: "\uD83C\uDFE0", description: "\u00c1reas de vida: identidad, recursos, comunicaci\u00f3n, hogar, creatividad, relaciones y m\u00e1s." },
      { label: "Aspectos", icon: "\uD83D\uDD17", description: "Relaciones angulares entre planetas: conjunci\u00f3n, tr\u00edgono, cuadratura, oposici\u00f3n." }
    ]
  },
  {
    type: "process_diagram",
    title: "De tu nacimiento a tu autoconocimiento",
    steps: [
      { icon: "\uD83D\uDC76", label: "Nacimiento", detail: "Momento y lugar exactos de tu llegada al mundo" },
      { icon: "\uD83C\uDF0C", label: "Posici\u00f3n planetaria", detail: "Fotograf\u00eda astron\u00f3mica del cielo en ese instante" },
      { icon: "\uD83D\uDDFA\uFE0F", label: "Carta natal", detail: "Mapa simb\u00f3lico que organiza esas posiciones" },
      { icon: "\uD83D\uDD0D", label: "Interpretaci\u00f3n", detail: "Lectura de patrones, tendencias y din\u00e1micas internas" },
      { icon: "\u2728", label: "Autoconocimiento", detail: "Permiso para ser compleja, contradictoria y m\u00faltiple" }
    ]
  },
  {
    type: "lesson_summary",
    title: "Resumen",
    points: [
      { title: "La carta natal es un mapa", detail: "Una fotograf\u00eda simb\u00f3lica del cielo al nacer que describe patrones y tendencias, no un destino fijo." },
      { title: "Tu signo solar no te define", detail: "Es solo una pieza de un sistema con 10 planetas, 12 casas y m\u00faltiples aspectos interconectados." },
      { title: "Base cronobiol\u00f3gica real", detail: "La estaci\u00f3n de nacimiento afecta el desarrollo neuroendocrino seg\u00fan la investigaci\u00f3n cient\u00edfica." },
      { title: "Nombrar es transformar", detail: "La carta no crea tus tendencias, las se\u00f1ala. Y se\u00f1alarlas es el primer paso para integrarlas." }
    ],
    nextLesson: "No es fe ciega: es atenci\u00f3n entrenada"
  }
);
fs.writeFileSync(path.join(dir, 'b1-l1.json'), JSON.stringify(l1, null, 2), 'utf8');
console.log('L1 done, interactive count:', l1.interactive.length);

// L2
const l2 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-l2.json'), 'utf8'));
l2.interactive.push(
  {
    type: "branching_scenario",
    title: "Escenario: Reacci\u00f3n vs. observaci\u00f3n",
    scenario: {
      start: {
        text: "Recibes un mensaje inesperado con cr\u00edticas sobre un proyecto en el que pusiste mucho esfuerzo. Sientes un nudo en el est\u00f3mago. \u00bfQu\u00e9 haces?",
        choices: [
          { text: "Respondo inmediatamente defendiendo mi trabajo con enojo", next: "reactivo" },
          { text: "Noto la emoci\u00f3n, respiro, y decido leer el mensaje completo antes de responder", next: "mindful" }
        ]
      },
      reactivo: {
        text: "Tu respuesta impulsiva escala el conflicto. La otra persona se pone a la defensiva y la conversaci\u00f3n se vuelve una pelea de egos. Al d\u00eda siguiente te arrepientes del tono.",
        outcome: "bad",
        feedback: "Esta es una reacci\u00f3n autom\u00e1tica: la emoci\u00f3n te controla y el resultado te aleja de lo que realmente quieres. La pr\u00f3xima vez, prueba a pausar antes de actuar."
      },
      mindful: {
        text: "Al releer con calma, descubres que las cr\u00edticas tienen puntos v\u00e1lidos mezclados con malentendidos. Respondes reconociendo lo v\u00e1lido y aclarando lo dem\u00e1s. La relaci\u00f3n se fortalece.",
        outcome: "good",
        feedback: "Esto es observaci\u00f3n no reactiva en acci\u00f3n: notas la emoci\u00f3n sin que te arrastre, ganas perspectiva y eliges tu respuesta. Es exactamente la habilidad que entrenamos en este curso."
      }
    }
  },
  {
    type: "lesson_summary",
    title: "Resumen",
    points: [
      { title: "Ni fe ciega ni escepticismo r\u00edgido", detail: "El tercer camino es la observaci\u00f3n atenta: tratar la informaci\u00f3n como hip\u00f3tesis para investigar en tu experiencia." },
      { title: "La atenci\u00f3n dirigida transforma el cerebro", detail: "Davidson (2003) demostr\u00f3 que 8 semanas de mindfulness cambian la estructura de la corteza prefrontal." },
      { title: "De adjetivos a tendencias", detail: "Transformar \u00absoy impaciente\u00bb en \u00abtiendo a la impaciencia cuando...\u00bb abre espacio para el cambio." }
    ],
    nextLesson: "Tu cerebro como antena: neuroplasticidad"
  }
);
fs.writeFileSync(path.join(dir, 'b1-l2.json'), JSON.stringify(l2, null, 2), 'utf8');
console.log('L2 done, interactive count:', l2.interactive.length);

// L3
const l3 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-l3.json'), 'utf8'));
l3.interactive.push(
  {
    type: "process_diagram",
    title: "C\u00f3mo se forma un nuevo h\u00e1bito neural",
    steps: [
      { icon: "\uD83D\uDD01", label: "Repetici\u00f3n", detail: "Practicar una nueva respuesta de forma consistente y deliberada" },
      { icon: "\u26A1", label: "Sinapsis reforzada", detail: "Las neuronas involucradas fortalecen su conexi\u00f3n (regla de Hebb)" },
      { icon: "\uD83E\uDDE0", label: "Patr\u00f3n neural", detail: "Se forma una red neuronal estable que se activa con facilidad" },
      { icon: "\uD83C\uDFAF", label: "H\u00e1bito", detail: "La nueva respuesta se vuelve autom\u00e1tica y requiere menos esfuerzo" },
      { icon: "\uD83C\uDF1F", label: "Transformaci\u00f3n", detail: "Tu relaci\u00f3n con el patr\u00f3n original cambia permanentemente" }
    ]
  },
  {
    type: "concept_map",
    title: "Herramientas de neuroplasticidad",
    centerNode: "Neuroplasticidad",
    nodes: [
      { label: "Meditaci\u00f3n", icon: "\uD83E\uDDD8", description: "Lazar (2005): aumenta el grosor cortical en regiones de atenci\u00f3n e interocepci\u00f3n." },
      { label: "Visualizaci\u00f3n", icon: "\uD83D\uDCA1", description: "Imaginar una acci\u00f3n activa las mismas redes neuronales que ejecutarla realmente." },
      { label: "HeartMath", icon: "\uD83D\uDC9A", description: "Coherencia card\u00edaca: respiraci\u00f3n r\u00edtmica que reduce cortisol y mejora autorregulaci\u00f3n." },
      { label: "Atenci\u00f3n plena", icon: "\uD83D\uDD2E", description: "Observaci\u00f3n no reactiva que fortalece la conexi\u00f3n corteza prefrontal-am\u00edgdala." }
    ]
  },
  {
    type: "lesson_summary",
    title: "Resumen",
    points: [
      { title: "Tu cerebro cambia con la pr\u00e1ctica", detail: "La neuroplasticidad permite reorganizar conexiones neuronales a cualquier edad mediante atenci\u00f3n sostenida." },
      { title: "Las tendencias no son condenas", detail: "Tu carta natal muestra puntos de partida. Puedes abrir nuevos senderos neurales con pr\u00e1ctica deliberada." },
      { title: "Coherencia card\u00edaca funciona", detail: "5 minutos diarios de respiraci\u00f3n r\u00edtmica (HeartMath) reducen reactividad emocional en semanas." },
      { title: "Responder en vez de reaccionar", detail: "Cada elecci\u00f3n consciente fortalece la conexi\u00f3n entre corteza prefrontal y am\u00edgdala." }
    ],
    nextLesson: "Tu mapa c\u00f3smico \u2014 La carta natal"
  }
);
fs.writeFileSync(path.join(dir, 'b1-l3.json'), JSON.stringify(l3, null, 2), 'utf8');
console.log('L3 done, interactive count:', l3.interactive.length);

// L4
const l4 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-l4.json'), 'utf8'));
l4.interactive.push(
  {
    type: "concept_map",
    title: "Los planetas personales en tu carta",
    centerNode: "Tu Carta",
    nodes: [
      { label: "Sol", icon: "\u2600\uFE0F", description: "Tu identidad esencial. Qui\u00e9n eres en tu centro, tu prop\u00f3sito vital." },
      { label: "Luna", icon: "\uD83C\uDF19", description: "Tu vida emocional profunda. C\u00f3mo sientes y qu\u00e9 necesitas para sentirte segura." },
      { label: "Mercurio", icon: "\uD83D\uDCAC", description: "Tu mente y comunicaci\u00f3n. C\u00f3mo piensas, procesas y te expresas." },
      { label: "Venus", icon: "\uD83D\uDC96", description: "Tu forma de amar y valorar. Qu\u00e9 te atrae y c\u00f3mo te relacionas." },
      { label: "Marte", icon: "\uD83D\uDD25", description: "Tu impulso de acci\u00f3n. C\u00f3mo act\u00faas, qu\u00e9 te motiva y tu energ\u00eda vital." },
      { label: "Ascendente", icon: "\u2B06\uFE0F", description: "Tu m\u00e1scara social. La primera impresi\u00f3n que generas al interactuar." }
    ]
  },
  {
    type: "lesson_summary",
    title: "Resumen",
    points: [
      { title: "Tres componentes fundamentales", detail: "Planetas (qu\u00e9), signos (c\u00f3mo) y casas (d\u00f3nde) se combinan para describir tu complejidad psicol\u00f3gica." },
      { title: "Los aspectos crean din\u00e1mica", detail: "Las relaciones angulares entre planetas hacen cada carta irrepetible y generan tensiones creativas." },
      { title: "Las tensiones son oportunidades", detail: "Jung: el crecimiento viene de sostener las contradicciones internas, no de eliminarlas." },
      { title: "Conversaci\u00f3n, no diagn\u00f3stico", detail: "La carta natal es un di\u00e1logo continuo con tus patrones internos que evoluciona con el tiempo." }
    ],
    nextLesson: "Sol, Luna, Ascendente: tu tri\u00e1ngulo esencial"
  }
);
fs.writeFileSync(path.join(dir, 'b1-l4.json'), JSON.stringify(l4, null, 2), 'utf8');
console.log('L4 done, interactive count:', l4.interactive.length);

// L5
const l5 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-l5.json'), 'utf8'));
l5.interactive.push(
  {
    type: "comparison",
    title: "Sol, Luna y Ascendente comparados",
    headers: ["Aspecto", "Sol", "Luna", "Ascendente"],
    rows: [
      ["Representa", "Identidad esencial y prop\u00f3sito vital", "Paisaje emocional y necesidades profundas", "Interfaz social y primera impresi\u00f3n"],
      ["Elemento clave", "Fuego de la voluntad consciente", "Agua de las emociones subconscientes", "El signo del horizonte al nacer"],
      ["Se expresa en", "Lo que haces cuando nadie observa", "Lo que sientes cuando no puedes fingir", "C\u00f3mo te perciben al conocerte"],
      ["Ejemplo", "Sol en Acuario: necesita innovar y cuestionar", "Luna en C\u00e1ncer: necesita hogar y conexi\u00f3n", "Ascendente en Aries: proyecta decisi\u00f3n y energ\u00eda"]
    ]
  },
  {
    type: "lesson_summary",
    title: "Resumen",
    points: [
      { title: "El tri\u00e1ngulo esencial", detail: "Sol (identidad), Luna (emociones) y Ascendente (interfaz social) son los tres pilares m\u00e1s importantes de tu carta." },
      { title: "Tu cuerpo sabe primero", detail: "Los marcadores som\u00e1ticos (Damasio) demuestran que el cuerpo toma decisiones emocionales antes que la mente consciente." },
      { title: "Integrar, no elegir", detail: "Siegel: el bienestar surge de integrar sistemas internos diferentes, no de eliminar las tensiones entre ellos." }
    ],
    nextLesson: "Cronobiolog\u00eda: tu estaci\u00f3n de nacimiento importa"
  }
);
fs.writeFileSync(path.join(dir, 'b1-l5.json'), JSON.stringify(l5, null, 2), 'utf8');
console.log('L5 done, interactive count:', l5.interactive.length);

// L6
const l6 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-l6.json'), 'utf8'));
l6.interactive.push(
  {
    type: "timeline",
    title: "Descubrimientos clave en cronobiolog\u00eda",
    events: [
      { year: "1729", title: "De Mairan: mimosa se abre sin sol", detail: "Jean-Jacques d\u2019Ortous de Mairan descubre que la mimosa abre y cierra sus hojas incluso en oscuridad constante, evidenciando un reloj biol\u00f3gico interno." },
      { year: "1962", title: "Aschoff: ritmo circadiano humano ~25h", detail: "J\u00fcrgen Aschoff demuestra en b\u00fankeres sin luz que el ritmo circadiano humano end\u00f3geno es de aproximadamente 25 horas." },
      { year: "2013", title: "Cajochen: luna afecta sue\u00f1o", detail: "Christian Cajochen demuestra en laboratorio que los ciclos lunares afectan la latencia, duraci\u00f3n y profundidad del sue\u00f1o humano." },
      { year: "2014", title: "Gonda: estaci\u00f3n nacimiento y temperamento", detail: "Xenia Gonda encuentra correlaciones significativas entre mes de nacimiento y rasgos temperamentales en m\u00e1s de 400 participantes." },
      { year: "2017", title: "Nobel de Medicina a Hall, Rosbash y Young", detail: "Jeffrey Hall, Michael Rosbash y Michael Young reciben el Nobel por descubrir los mecanismos moleculares que controlan el ritmo circadiano." }
    ]
  },
  {
    type: "lesson_summary",
    title: "Resumen",
    points: [
      { title: "La estaci\u00f3n de nacimiento importa", detail: "El fotoperiodo durante el desarrollo fetal programa la producci\u00f3n de serotonina, dopamina y melatonina." },
      { title: "Los ciclos lunares afectan el sue\u00f1o", detail: "Cajochen (2013) demostr\u00f3 en laboratorio que la luna llena reduce la calidad del sue\u00f1o y los niveles de melatonina." },
      { title: "Ciencia y s\u00edmbolo coexisten", detail: "La cronobiolog\u00eda y la carta natal son dos lenguajes que describen la misma realidad desde \u00e1ngulos complementarios." },
      { title: "Trabaja con tu naturaleza", detail: "Tu temperamento estacional no es un destino: es informaci\u00f3n para dise\u00f1ar estrategias adaptadas a tu ritmo." }
    ],
    nextLesson: "M\u00f3dulo 3: Mercurio, Venus y Marte"
  }
);
fs.writeFileSync(path.join(dir, 'b1-l6.json'), JSON.stringify(l6, null, 2), 'utf8');
console.log('L6 done, interactive count:', l6.interactive.length);

console.log('\nAll 6 files updated successfully.');
