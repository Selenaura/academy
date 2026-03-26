const fs = require('fs');
const path = require('path');

const dir = __dirname;

const updates = {
  13: [
    {
      type: "process_diagram",
      title: "De memoria a intuicion",
      steps: [
        "Memorizar significados",
        "Practicar asociaciones",
        "Observar imagenes sin libro",
        "Registrar sensaciones corporales",
        "Confiar en primera impresion",
        "Integrar significado + sensacion"
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "La intuicion se entrena, no se tiene o no se tiene",
        "Sistema 1 (rapido) y Sistema 2 (lento) trabajan juntos",
        "El cuerpo es tu brujula: marcadores somaticos"
      ]
    }
  ],
  14: [
    {
      type: "process_diagram",
      title: "Lectura somatica de una carta",
      steps: [
        "Respira 3 veces",
        "Mira la carta sin interpretar",
        "Escanea tu cuerpo de pies a cabeza",
        "Registra donde sientes algo",
        "Nombra la sensacion",
        "Conecta con el significado"
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Bechara y Damasio demostraron que el cuerpo registra informacion emocional antes que la mente consciente (marcadores somaticos)",
        "La interocepcion es una habilidad entrenable que mejora la toma de decisiones y la lectura intuitiva",
        "El escaner corporal antes y durante la lectura permite distinguir entre senales relevantes y ruido corporal habitual"
      ]
    }
  ],
  15: [
    {
      type: "branching_scenario",
      title: "Lectura libre: practica",
      scenario: "Sacas el 7 de Oros y sientes pesadez en el pecho",
      options: [
        {
          label: "Consulto el libro",
          outcome: "Valido pero pierdes la senal corporal",
          feedback: "La proxima vez, registra primero tu sensacion y luego compara con el libro"
        },
        {
          label: "Digo lo que siento: espera, paciencia",
          outcome: "Correcto: el 7 de Oros habla de esperar resultados",
          feedback: "Tu cuerpo reconocio el mensaje antes que tu mente. Eso es intuicion entrenada"
        }
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "La lectura libre es el ejercicio definitivo: leer sin referencia, solo desde la imagen y la sensacion corporal",
        "Csikszentmihalyi demostro que el flow emerge cuando el desafio coincide con la habilidad",
        "El conocimiento tacito produce lecturas intuitivas paralelas a los significados tradicionales pero mas ricas"
      ]
    }
  ],
  16: [
    {
      type: "process_diagram",
      title: "Ritual de carta diaria",
      steps: [
        "Manana: baraja y pregunta",
        "Extrae 1 carta",
        "30 seg observacion",
        "Escribe en diario",
        "Noche: revisa el dia",
        "Conecta carta con vivencias"
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "La tirada diaria proporciona las dos condiciones de Kahneman para la intuicion fiable: entorno regular y practica suficiente",
        "Las preguntas abiertas de orientacion producen lecturas mas ricas que las cerradas",
        "La reflexion vespertina es el componente esencial: sin retroalimentacion, la practica no construye intuicion"
      ]
    }
  ],
  17: [
    {
      type: "comparison",
      headers: ["", "3 cartas", "5 cartas (cruz)", "10 cartas (Cruz Celta)"],
      rows: [
        ["Complejidad", "Baja", "Media", "Alta"],
        ["Tiempo", "5-10 min", "15-20 min", "30-45 min"],
        ["Mejor para", "Pregunta concreta", "Situacion con contexto", "Analisis profundo"],
        ["Nivel", "Principiante", "Intermedio", "Avanzado"]
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Tres cartas crean una narrativa: el cerebro busca automaticamente la historia que las conecta",
        "Leer la interaccion entre cartas anade informacion que las lecturas individuales no contienen",
        "La cruz de cinco cartas captura las fuerzas en tension de la teoria del campo de Lewin"
      ]
    }
  ],
  18: [
    {
      type: "process_diagram",
      title: "Cruz Celta: 10 posiciones",
      steps: [
        "1 Situacion presente",
        "2 Desafio inmediato",
        "3 Base/raiz",
        "4 Pasado reciente",
        "5 Corona/posibilidad",
        "6 Futuro proximo",
        "7 Tu actitud",
        "8 Entorno",
        "9 Esperanzas/miedos",
        "10 Resultado"
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "La Cruz Celta se lee en cinco capas sucesivas para gestionar la complejidad",
        "Crear tiradas propias permite que la forma refleje exactamente la estructura de la exploracion",
        "Una tirada personalizada bien disenada puede ser mas poderosa que la Cruz Celta"
      ]
    }
  ],
  19: [
    {
      type: "process_diagram",
      title: "Estructura de sesion profesional",
      steps: [
        "Apertura (rapport, pregunta)",
        "Desarrollo (tirada, lectura)",
        "Profundizacion (preguntas abiertas)",
        "Cierre (resumen, accion concreta)"
      ]
    },
    {
      type: "branching_scenario",
      title: "La persona llora durante la lectura",
      scenario: "Estas en medio de una lectura y la persona empieza a llorar.",
      options: [
        {
          label: "Seguir leyendo para no incomodar",
          outcome: "Error: la persona necesita espacio",
          feedback: "Pausa, ofrece silencio, pregunta si desea continuar"
        },
        {
          label: "Hacer una pausa empatica",
          outcome: "Correcto: respetas el proceso emocional",
          feedback: "Rogers llama a esto presencia incondicional"
        }
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Una sesion profesional tiene tres fases: apertura, desarrollo y cierre",
        "Rogers demostro que la aceptacion incondicional, la empatia y la congruencia son imprescindibles",
        "Cada sesion se registra despues: cartas, interpretaciones, reacciones y aprendizajes"
      ]
    }
  ],
  20: [
    {
      type: "comparison",
      headers: ["", "Nunca decir", "Alternativa etica"],
      rows: [
        ["Salud", "Veo enfermedad", "Las cartas sugieren cuidar tu energia"],
        ["Muerte", "Alguien va a morir", "Un ciclo importante esta cerrando"],
        ["Relacion", "Tu pareja te engana", "Hay una energia de desconfianza que explorar"],
        ["Dependencia", "Necesitas volver cada semana", "Tienes las herramientas para decidir"]
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Nunca predecir muerte, enfermedad ni crear dependencia",
        "La responsabilidad etica incluye derivar a profesionales de salud mental cuando corresponde",
        "El tarotista es un espejo que refleja y empodera, no un oraculo que dicta verdades absolutas"
      ]
    }
  ],
  21: [
    {
      type: "branching_scenario",
      title: "Comunicar la Torre",
      scenario: "Sale La Torre en posicion de futuro proximo. La persona te mira asustada.",
      options: [
        {
          label: "Es una carta terrible, preparate",
          outcome: "Error grave: generas panico",
          feedback: "Nunca confirmes el miedo. Reencuadra: La Torre libera lo que ya no te sirve"
        },
        {
          label: "Esta carta habla de liberacion. Algo que sostienes con esfuerzo puede soltar",
          outcome: "Correcto: reencuadras sin mentir",
          feedback: "Honestidad + empatia. No minimizas ni aterras"
        }
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Toda carta del tarot contiene potencial de crecimiento: reencuadrar es presentar la totalidad del simbolo",
        "La escucha empatica de Rogers es la herramienta clave para comunicar insights dificiles",
        "Las preguntas poderosas devuelven la agencia a la persona"
      ]
    }
  ],
  22: [
    {
      type: "comparison",
      headers: ["", "Principiante", "Intermedio", "Experto"],
      rows: [
        ["Precio/sesion", "15-30\u20ac", "40-80\u20ac", "80-150\u20ac"],
        ["Experiencia", "<100 lecturas", "100-500", "500+"],
        ["Formato", "Online texto", "Online video", "Presencial + online"],
        ["Senal de subida", "Lista de espera", "Repetidores >50%", "Derivaciones profesionales"]
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Los rangos reales del mercado son: principiante 15-30 euros, intermedio 40-80 euros, experimentado 80-150+ euros",
        "Una estructura por niveles ofrece opciones al cliente y maximiza ingresos de forma etica",
        "Subir precios es necesario cuando la demanda, la experiencia y las resenas lo justifican"
      ]
    }
  ],
  23: [
    {
      type: "process_diagram",
      title: "Tu presencia online",
      steps: [
        "Perfil en plataformas (Fiverr, Etsy)",
        "Redes sociales (carta del dia)",
        "Web propia (cuando tengas base)",
        "Blog/contenido SEO",
        "Comunidad y boca a boca"
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Empieza por una plataforma, consolida y luego expande",
        "El reto de las 100 lecturas transforma el conocimiento teorico en competencia real",
        "Los testimonios especificos son tu herramienta de marketing mas poderosa"
      ]
    }
  ],
  24: [
    {
      type: "comparison",
      headers: ["", "Solo tarot", "Tarot + astro", "Tarot + coaching"],
      rows: [
        ["Duracion", "30 min", "60 min", "90 min"],
        ["Precio", "30-60\u20ac", "60-100\u20ac", "100-150\u20ac"],
        ["Profundidad", "Situacional", "Natal + situacional", "Transformacional"],
        ["Recurrencia", "Puntual", "Trimestral", "Mensual"]
      ]
    },
    {
      type: "lesson_summary",
      points: [
        "Las combinaciones mas rentables son tarot + astrologia, tarot + coaching y formatos grupales",
        "Los ingresos pasivos son esenciales para la sostenibilidad profesional",
        "Un ecosistema diversificado genera mas ingresos y menor riesgo de agotamiento"
      ]
    }
  ]
};

for (let i = 13; i <= 24; i++) {
  const file = path.join(dir, `ti-l${i}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const before = data.interactive.length;
  data.interactive.push(...updates[i]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`ti-l${i}.json: ${before} -> ${data.interactive.length} interactive elements (+${updates[i].length})`);
}
console.log('All 12 files updated successfully.');
