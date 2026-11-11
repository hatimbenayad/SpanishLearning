import { GrammarLesson } from '../types';

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'gram-1',
    title: 'Ser vs. Estar: La esencia y el estado',
    subtitle: 'Aprende cuándo usar los dos verbos fundamentales del español.',
    cefrLevel: 'A1',
    order: 1,
    summary: 'En español existen dos verbos para "to be": Ser define la naturaleza o identidad permanente, mientras que Estar expresa el estado temporal y la ubicación.',
    ruleCards: [
      {
        id: 'rule-ser',
        title: 'Uso de SER (Identidad y Naturaleza)',
        explanation: 'Utilizamos SER para definir identidad, nacionalidad, profesión, posesión y características inherentes.',
        examples: [
          { spanish: 'Soy estudiante de español.', english: 'I am a Spanish student.', highlight: 'Soy' },
          { spanish: 'Madrid es la capital de España.', english: 'Madrid is the capital of Spain.', highlight: 'es' },
          { spanish: 'El libro es de madera y papel.', english: 'The book is made of wood and paper.', highlight: 'es' },
        ],
      },
      {
        id: 'rule-estar',
        title: 'Uso de ESTAR (Ubicación y Estado)',
        explanation: 'Utilizamos ESTAR para describir ubicación geográfica, condiciones físicas o anímicas temporales.',
        examples: [
          { spanish: 'El libro está en la mesa.', english: 'The book is on the table.', highlight: 'está' },
          { spanish: 'Hoy estoy muy contento.', english: 'Today I am very happy.', highlight: 'estoy' },
          { spanish: 'La sopa está caliente.', english: 'The soup is hot.', highlight: 'está' },
        ],
      },
    ],
    comparisonCards: [
      {
        title: 'Regla mnemotécnica rápida',
        leftConcept: {
          label: 'SER (DOCTOGRAM)',
          rules: ['Descripción', 'Ocupación', 'Característica', 'Tiempo/Fecha', 'Origen', 'Relación'],
        },
        rightConcept: {
          label: 'ESTAR (PLACE)',
          rules: ['Posición', 'Lugar/Ubicación', 'Acción continua', 'Condición', 'Emoción'],
        },
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Estoy de España.',
        correct: 'Soy de España.',
        explanation: 'El origen y la nacionalidad son rasgos permanentes de identidad; siempre requieren SER.',
      },
      {
        incorrect: 'El museo es en la plaza mayor.',
        correct: 'El museo está en la plaza mayor.',
        explanation: 'La localización física de lugares y edificios siempre se expresa con ESTAR.',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-1',
        type: 'multiple_choice',
        instruction: 'Elige el verbo correcto',
        question: 'Mi amiga Carmen _____ médica en el hospital central.',
        options: ['está', 'es', 'son', 'están'],
        correctAnswer: 'es',
        explanation: 'Las profesiones y ocupaciones expresan identidad, por lo que se utiliza SER (es).',
        difficulty: 'A1',
      },
      {
        id: 'gram-ex-2',
        type: 'multiple_choice',
        instruction: 'Completa la frase',
        question: '¿Dónde _____ los libros que compré ayer?',
        options: ['son', 'están', 'es', 'estar'],
        correctAnswer: 'están',
        explanation: 'Para preguntar por la ubicación física de objetos se utiliza ESTAR en plural (están).',
        difficulty: 'A1',
      },
    ],
  },
  {
    id: 'gram-2',
    title: 'El Presente de Indicativo (Verbos Regulares)',
    subtitle: 'Domina los patrones de las terminaciones -AR, -ER e -IR.',
    cefrLevel: 'A1',
    order: 2,
    summary: 'Los verbos regulares en presente conservan su raíz y añaden terminaciones fijas según el pronombre.',
    ruleCards: [
      {
        id: 'rule-ar',
        title: 'Verbos en -AR (hablar)',
        explanation: 'yo hablo, tú hablas, él habla, nosotros hablamos, vosotros habláis, ellos hablan.',
        examples: [
          { spanish: 'Hablamos con los vecinos.', english: 'We speak with the neighbors.', highlight: 'Hablamos' },
        ],
      },
      {
        id: 'rule-er-ir',
        title: 'Verbos en -ER / -IR (comer / vivir)',
        explanation: 'yo como/vivo, tú comes/vives, él come/vive, nosotros comemos/vivimos.',
        examples: [
          { spanish: 'Ella vive en Sevilla.', english: 'She lives in Seville.', highlight: 'vive' },
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Nosotros hablais español.',
        correct: 'Nosotros hablamos español.',
        explanation: 'La terminación de nosotros para verbos en -AR es siempre -amos.',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-3',
        type: 'multiple_choice',
        instruction: 'Selecciona la conjugación',
        question: 'Todos los días yo _____ café por la mañana.',
        options: ['tomo', 'tomas', 'toma', 'tomamos'],
        correctAnswer: 'tomo',
        explanation: 'La primera persona del singular (yo) para tomar es tomo.',
        difficulty: 'A1',
      },
    ],
  },
  {
    id: 'gram-3',
    title: 'Por vs. Para: Guía definitiva',
    subtitle: 'Distingue entre causa y propósito en español.',
    cefrLevel: 'A2',
    order: 3,
    summary: 'Por indica motivo, causa, duración o medio. Para indica destinatario, objetivo final, fecha límite o dirección.',
    ruleCards: [
      {
        id: 'rule-por',
        title: 'Uso de POR',
        explanation: 'Motivo ("gracias por venir"), duración ("estudió por dos horas"), intercambio ("pagué 10 euros por el libro").',
        examples: [
          { spanish: 'Caminamos por el parque.', english: 'We walked through the park.' },
        ],
      },
      {
        id: 'rule-para',
        title: 'Uso de PARA',
        explanation: 'Destinatario ("un regalo para ti"), propósito ("estudio para aprender"), límite de tiempo ("para el lunes").',
        examples: [
          { spanish: 'Este libro es para ti.', english: 'This book is for you.' },
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Estudio español por viajar a Colombia.',
        correct: 'Estudio español para viajar a Colombia.',
        explanation: 'Cuando se expresa un objetivo o meta futura ("in order to"), se utiliza PARA.',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-4',
        type: 'multiple_choice',
        instruction: 'Elige la preposición correcta',
        question: 'Compré estas flores _____ mi madre.',
        options: ['por', 'para', 'con', 'en'],
        correctAnswer: 'para',
        explanation: 'Se usa PARA para indicar el destinatario de una acción o regalo.',
        difficulty: 'A2',
      },
    ],
  },
  {
    id: 'gram-4',
    title: 'Artículos, Género y Concordancia',
    subtitle: 'Cómo combinar correctamente sustantivos, artículos y adjetivos.',
    cefrLevel: 'A1',
    order: 4,
    summary: 'Todos los sustantivos en español tienen género gramatical (masculino o femenino) y número (singular o plural), y sus artículos y adjetivos deben concordar con ellos.',
    ruleCards: [
      {
        id: 'rule-gender',
        title: 'Reglas generales de género',
        explanation: 'Los sustantivos terminados en -o suelen ser masculinos (el libro) y los terminados en -a, -ción, -dad suelen ser femeninos (la mesa, la canción, la ciudad).',
        examples: [
          { spanish: 'El cuaderno amarillo está abierto.', english: 'The yellow notebook is open.', highlight: 'El cuaderno amarillo' },
          { spanish: 'Las bibliotecas antiguas son hermosas.', english: 'The old libraries are beautiful.', highlight: 'Las bibliotecas antiguas' },
        ],
      },
      {
        id: 'rule-exceptions',
        title: 'Excepciones frecuentes importantes',
        explanation: 'Algunas palabras de origen griego terminadas en -ma son masculinas (el problema, el tema, el idioma), mientras que "la mano" o "la foto" son femeninas.',
        examples: [
          { spanish: 'El idioma español es muy expresivo.', english: 'The Spanish language is very expressive.', highlight: 'El idioma' },
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'La problema es difícil.',
        correct: 'El problema es difícil.',
        explanation: 'Sustantivos terminados en -ma de origen griego (problema, sistema, tema, idioma) son masculinos.',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-5',
        type: 'multiple_choice',
        instruction: 'Elige el artículo y adjetivo correctos',
        question: 'Me encanta estudiar _____ literatura clásica española.',
        options: ['el', 'la', 'los', 'un'],
        correctAnswer: 'la',
        explanation: '"Literatura" es un sustantivo femenino singular, por lo que requiere el artículo "la".',
        difficulty: 'A1',
      },
    ],
  },
  {
    id: 'gram-5',
    title: 'Indefinido vs. Imperfecto: Narrar el pasado',
    subtitle: 'Combina acciones puntuales con descripciones y hábitos pasados.',
    cefrLevel: 'A2',
    order: 5,
    summary: 'El Pretérito Indefinido narra hechos terminados y puntuales en la historia; el Imperfecto describe el escenario, costumbres y acciones en curso.',
    ruleCards: [
      {
        id: 'rule-indefinido',
        title: 'Pretérito Indefinido (Acción acabada)',
        explanation: 'Responde a "¿qué pasó?". Se usa con marcadores como ayer, el año pasado, en 1998, de repente.',
        examples: [
          { spanish: 'Ayer visité el Museo del Prado.', english: 'Yesterday I visited the Prado Museum.', highlight: 'visité' },
        ],
      },
      {
        id: 'rule-imperfecto',
        title: 'Pretérito Imperfecto (Escenario y hábito)',
        explanation: 'Responde a "¿cómo era?" o "¿qué solía pasar?". Describe edad, hora, clima, emociones y rutinas de la infancia.',
        examples: [
          { spanish: 'De niño, leía cuentos todas las noches.', english: 'As a child, I used to read stories every night.', highlight: 'leía' },
        ],
      },
    ],
    comparisonCards: [
      {
        title: 'Indefinido vs. Imperfecto en una misma escena',
        leftConcept: {
          label: 'INDEFINIDO (Evento)',
          rules: ['Acción puntual completada', 'Avanza la trama', 'Interrumpe una acción', 'Ej: Llegó la carta'],
        },
        rightConcept: {
          label: 'IMPERFECTO (Contexto)',
          rules: ['Descripción o escenario', 'Hábito repetido', 'Acción paralela en progreso', 'Ej: Llovía suavemente'],
        },
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Cuando fui niño, viví en Sevilla siempre.',
        correct: 'Cuando era niño, vivía en Sevilla.',
        explanation: 'Las etapas de la vida y situaciones prolongadas en el pasado requieren Imperfecto (era, vivía).',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-6',
        type: 'multiple_choice',
        instruction: 'Elige el tiempo verbal del pasado',
        question: 'Mientras yo _____ (leer) en la terraza, empezó a llover.',
        options: ['leí', 'leía', 'leo', 'leeré'],
        correctAnswer: 'leía',
        explanation: 'La acción en progreso que sirve de fondo y es interrumpida se expresa en Imperfecto ("leía").',
        difficulty: 'A2',
      },
    ],
  },
  {
    id: 'gram-6',
    title: 'Verbos Reflexivos y Rutina Cotidiana',
    subtitle: 'Expresa acciones que recaen sobre el propio sujeto.',
    cefrLevel: 'A2',
    order: 6,
    summary: 'Los verbos reflexivos se acompañan de los pronombres me, te, se, nos, os, se para indicar que quien realiza la acción también la recibe.',
    ruleCards: [
      {
        id: 'rule-reflexive',
        title: 'Colocación del pronombre reflexivo',
        explanation: 'El pronombre va delante del verbo conjugado (me levanto), o unido al final de un infinitivo o gerundio (quiero levantarme).',
        examples: [
          { spanish: 'Me despierto a las siete y me preparo un café.', english: 'I wake up at seven and make myself a coffee.', highlight: 'Me despierto' },
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Yo levanto a las ocho.',
        correct: 'Yo me levanto a las ocho.',
        explanation: '"Levantar" sin pronombre significa alzar un objeto; levantarse de la cama exige el pronombre reflexivo "me".',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-7',
        type: 'multiple_choice',
        instruction: 'Completa con el pronombre adecuado',
        question: 'Nosotros _____ acostamos temprano los días laborables.',
        options: ['me', 'te', 'nos', 'se'],
        correctAnswer: 'nos',
        explanation: 'El pronombre reflexivo correspondiente a "nosotros" es "nos".',
        difficulty: 'A2',
      },
    ],
  },
  {
    id: 'gram-7',
    title: 'El Presente de Subjuntivo: Deseos y Dudas',
    subtitle: 'Expresa subjetividad, voluntad, emoción e incertidumbre con naturalidad.',
    cefrLevel: 'B1',
    order: 7,
    summary: 'A diferencia del indicativo (hechos objetivos), el subjuntivo se utiliza en oraciones subordinadas tras expresar deseos, recomendaciones, emociones o duda.',
    ruleCards: [
      {
        id: 'rule-subjunctive-triggers',
        title: 'Los activadores del subjuntivo (WEIRDO)',
        explanation: 'Usa subjuntivo tras expresiones con cambio de sujeto como "espero que", "quiero que", "dudo que", "es importante que" o "me alegra que".',
        examples: [
          { spanish: 'Espero que disfrutes mucho de esta novela.', english: 'I hope that you enjoy this novel very much.', highlight: 'disfrutes' },
          { spanish: 'Es necesario que practiquemos cada día.', english: 'It is necessary that we practice every day.', highlight: 'practiquemos' },
        ],
      },
      {
        id: 'rule-subjunctive-forms',
        title: 'Formación regular (vocal temática invertida)',
        explanation: 'Toma la raíz de "yo" en presente: los verbos en -AR cambian a -e (hable) y los de -ER/-IR cambian a -a (coma, viva).',
        examples: [
          { spanish: 'No creo que llueva esta tarde.', english: 'I don’t think it will rain this afternoon.', highlight: 'llueva' },
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Quiero que vienes conmigo al teatro.',
        correct: 'Quiero que vengas conmigo al teatro.',
        explanation: 'Tras "querer que" con distinto sujeto es obligatorio usar el Presente de Subjuntivo ("vengas").',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-8',
        type: 'multiple_choice',
        instruction: 'Selecciona la forma en subjuntivo',
        question: 'Ojalá _____ (tener, nosotros) tiempo suficiente para visitar la biblioteca.',
        options: ['tenemos', 'tengamos', 'tendremos', 'tuvimos'],
        correctAnswer: 'tengamos',
        explanation: 'La expresión de deseo "Ojalá" siempre rige subjuntivo: tengamos.',
        difficulty: 'B1',
      },
    ],
  },
  {
    id: 'gram-8',
    title: 'Condicionales Irreales e Imperfecto de Subjuntivo',
    subtitle: 'Construye hipótesis elegantes y situaciones improbables o imaginarias.',
    cefrLevel: 'B2',
    order: 8,
    summary: 'Para expresar hipótesis poco probables o contrarias a la realidad presente combinamos: Si + Pretérito Imperfecto de Subjuntivo + Condicional Simple.',
    ruleCards: [
      {
        id: 'rule-si-imperfecto',
        title: 'Estructura hipotética de segundo tipo',
        explanation: 'La cláusula introducida por "si" lleva Imperfecto de Subjuntivo (-ra / -se) y la consecuencia principal lleva Condicional Simple (-ría).',
        examples: [
          { spanish: 'Si tuviera más tiempo libre, leería toda la obra de Cervantes.', english: 'If I had more free time, I would read all of Cervantes’s work.', highlight: 'tuviera ... leería' },
          { spanish: 'Si viajáramos a Granada, visitaríamos la Alhambra al alba.', english: 'If we traveled to Granada, we would visit the Alhambra at dawn.', highlight: 'viajáramos ... visitaríamos' },
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Si tendría dinero, compraría esa librería.',
        correct: 'Si tuviera dinero, compraría esa librería.',
        explanation: 'Nunca se debe colocar el Condicional ("tendría") inmediatamente detrás de "si" en hipótesis.',
      },
    ],
    practiceQuestions: [
      {
        id: 'gram-ex-9',
        type: 'multiple_choice',
        instruction: 'Completa la oración condicional',
        question: 'Si _____ (poder) vivir en cualquier época, elegiría el Siglo de Oro.',
        options: ['puedo', 'podría', 'pudiera', 'podré'],
        correctAnswer: 'pudiera',
        explanation: 'Tras "si" en hipótesis irreales se emplea el Imperfecto de Subjuntivo ("pudiera").',
        difficulty: 'B2',
      },
    ],
  },
];

