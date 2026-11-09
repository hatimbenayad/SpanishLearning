import { ListeningMaterial } from '../types';

export const listeningLibrary: ListeningMaterial[] = [
  {
    id: 'listen-1',
    title: 'Un paseo matutino por el mercado de San Miguel',
    speaker: 'Lucía Navarro (Madrid)',
    cefrLevel: 'A1',
    durationSeconds: 95,
    audioUrl: 'https://example.com/audio/san-miguel-mercado.mp3',
    transcript: [
      {
        id: 'sent-1',
        startTime: 0,
        endTime: 12,
        spanish: '¡Buenos días a todos! Hoy los invito a recorrer conmigo uno de los lugares con más sabor de Madrid.',
        english: 'Good morning everyone! Today I invite you to explore with me one of the most flavorful places in Madrid.',
      },
      {
        id: 'sent-2',
        startTime: 13,
        endTime: 28,
        spanish: 'Estamos en el corazón de la ciudad, en el histórico Mercado de San Miguel, justo al lado de la Plaza Mayor.',
        english: "We are in the heart of the city, in the historic San Miguel Market, right next to the Plaza Mayor.",
      },
      {
        id: 'sent-3',
        startTime: 29,
        endTime: 48,
        spanish: 'Miren la estructura de hierro y cristal de 1916. En los puestos hay aceitunas verdes, quesos manchegos y tapas variadas.',
        english: 'Look at the iron and glass structure from 1916. In the stalls there are green olives, Manchego cheeses, and assorted tapas.',
      },
      {
        id: 'sent-4',
        startTime: 49,
        endTime: 70,
        spanish: 'El dependiente me dice: «¿Qué le ponemos hoy, señorita? Tenemos un jamón ibérico extraordinario recién cortado».',
        english: 'The clerk tells me: "What can we get for you today, miss? We have an extraordinary freshly sliced Iberian ham."',
      },
      {
        id: 'sent-5',
        startTime: 71,
        endTime: 95,
        spanish: 'El ambiente está lleno de risas, aromas a pan recién horneado y el sonido inconfundible de la vida madrileña.',
        english: 'The atmosphere is filled with laughter, scents of freshly baked bread, and the unmistakable sound of Madrid life.',
      },
    ],
    comprehensionQuestions: [
      {
        id: 'lis-q1',
        type: 'multiple_choice',
        instruction: 'Pregunta auditiva',
        question: '¿Al lado de qué lugar histórico está el mercado?',
        options: ['Del Museo del Prado', 'De la Plaza Mayor', 'Del Parque del Retiro', 'De la Puerta de Alcalá'],
        correctAnswer: 'De la Plaza Mayor',
        explanation: 'En el segundo párrafo Lucía aclara: "justo al lado de la Plaza Mayor".',
        difficulty: 'A1',
      },
    ],
    source: 'Dominio Público / Archivo Sonoro Educativo',
    license: 'CC-BY-SA 4.0',
  },
];
