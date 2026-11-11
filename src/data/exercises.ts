import { ExerciseItem } from '../types';
import { MatchPair } from '../components/learning/WordMatchExercise';

export interface ExerciseSessionQuestion {
  item: ExerciseItem;
  matchingPairs?: MatchPair[];
}

export const sampleExerciseSession: ExerciseSessionQuestion[] = [
  {
    item: {
      id: 'sess-ex-1',
      type: 'multiple_choice',
      instruction: 'Elige el verbo adecuado',
      question: 'Carmen _____ de Madrid, pero actualmente vive en Barcelona.',
      options: ['es', 'está', 'son', 'están'],
      correctAnswer: 'es',
      explanation: 'El origen y la procedencia son características permanentes de identidad; siempre se utiliza el verbo SER (es).',
      difficulty: 'A1',
    },
  },
  {
    item: {
      id: 'sess-ex-2',
      type: 'sentence_reorder',
      instruction: 'Ordena las palabras para formar una frase correcta',
      question: 'Construye la frase:',
      options: ['todos', 'los', 'días', 'español', 'estudio'],
      correctAnswer: 'estudio español todos los días',
      explanation: 'En español, el orden sintáctico habitual es Sujeto/Verbo + Complemento directo + Complemento circunstancial de tiempo.',
      difficulty: 'A1',
    },
  },
  {
    item: {
      id: 'sess-ex-3',
      type: 'word_match',
      instruction: 'Empareja los términos culturales españoles con su significado',
      question: 'Vocabulario cultural:',
      correctAnswer: 'matched',
      explanation: '¡Excelente! Estos términos son esenciales para comprender la vida cotidiana en España.',
      difficulty: 'A1',
    },
    matchingPairs: [
      { id: 'm1', spanish: 'la sobremesa', english: 'post-meal talk' },
      { id: 'm2', spanish: 'la biblioteca', english: 'library' },
      { id: 'm3', spanish: 'el café con leche', english: 'coffee with milk' },
      { id: 'm4', spanish: 'la merienda', english: 'afternoon snack' },
    ],
  },
  {
    item: {
      id: 'sess-ex-4',
      type: 'fill_in_the_blank',
      instruction: 'Selecciona la preposición correcta',
      question: 'Compré este libro de poesía _____ mi mejor amigo.',
      options: ['para', 'por', 'con', 'en'],
      correctAnswer: 'para',
      explanation: 'Se utiliza PARA cuando indicamos el destinatario o beneficiario de una acción o regalo.',
      difficulty: 'A2',
    },
  },
  {
    item: {
      id: 'sess-ex-5',
      type: 'translation',
      instruction: 'Traduce la frase al español',
      question: '"We have lunch together every Sunday."',
      options: [
        'Comemos juntos todos los domingos.',
        'Comemos juntos cada sábados.',
        'Desayunamos juntos los domingos.',
        'Cenamos solos los domingos.',
      ],
      correctAnswer: 'Comemos juntos todos los domingos.',
      explanation: '"We have lunch" se traduce habitualmente como "comemos" o "almorzamos", y "every Sunday" como "todos los domingos".',
      difficulty: 'A1',
    },
  },
];

