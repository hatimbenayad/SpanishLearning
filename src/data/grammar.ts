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
];
