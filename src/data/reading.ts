import { ReadingMaterial } from '../types';

export const readingLibrary: ReadingMaterial[] = [
  {
    id: 'read-1',
    title: 'El café de la esquina y la tertulia de la tarde',
    author: 'Crónica cultural española',
    cefrLevel: 'A1',
    durationMinutes: 4,
    wordCount: 145,
    excerpt: 'En una pequeña plaza de Madrid, el viejo café abre sus puertas cuando el reloj de la iglesia marca las cuatro...',
    fullText: `En una pequeña plaza de Madrid, el viejo café abre sus puertas cuando el reloj de la iglesia marca las cuatro. Las mesas de madera brillan bajo la luz dorada del sol de otoño. 

Don Antonio, el dueño del local, saluda con una sonrisa a los primeros clientes. Lleva un delantal blanco y prepara el café con paciencia y esmero. El aroma a café tostado y pan caliente llena toda la calle.

Aquí la gente no tiene prisa. Los amigos se sientan a conversar, leen el periódico del día o abren un libro de poemas. En España, este momento de charla tranquila se llama sobremesa. Es una costumbre entrañable donde el tiempo parece detenerse entre tazas de café y buenas historias.`,
    translationGlossary: {
      plaza: { translation: 'town square', phonetic: '[ˈpla-θa]' },
      puertas: { translation: 'doors', phonetic: '[ˈpwer-tas]' },
      iglesia: { translation: 'church', phonetic: '[i-ˈɣle-sja]' },
      madera: { translation: 'wood', phonetic: '[ma-ˈðe-ɾa]' },
      otoño: { translation: 'autumn', phonetic: '[o-ˈto-ɲo]' },
      sonrisa: { translation: 'smile', phonetic: '[son-ˈri-sa]' },
      delantal: { translation: 'apron', phonetic: '[de-lan-ˈtal]' },
      paciencia: { translation: 'patience', phonetic: '[pa-ˈθjen-θja]' },
      aroma: { translation: 'scent / aroma', phonetic: '[a-ˈɾo-ma]' },
      prisa: { translation: 'hurry / rush', phonetic: '[ˈpɾi-sa]', notes: '"No tener prisa" = to be in no hurry' },
      sobremesa: { translation: 'post-meal conversation', phonetic: '[so-βɾe-ˈme-sa]', notes: 'Unique Spanish cultural concept' },
      costumbre: { translation: 'custom / habit', phonetic: '[kos-ˈtum-bɾe]' },
      entrañable: { translation: 'endearing / warm', phonetic: '[en-tɾa-ˈɲa-βle]' },
      historias: { translation: 'stories', phonetic: '[is-ˈto-ɾjas]' },
    },
    comprehensionQuestions: [
      {
        id: 'comp-1',
        type: 'multiple_choice',
        instruction: 'Pregunta de comprensión lectora',
        question: '¿A qué hora abre sus puertas el viejo café?',
        options: ['A las dos', 'A las cuatro', 'A las seis', 'A las ocho'],
        correctAnswer: 'A las cuatro',
        explanation: 'El texto menciona explícitamente: "cuando el reloj de la iglesia marca las cuatro".',
        difficulty: 'A1',
      },
      {
        id: 'comp-2',
        type: 'multiple_choice',
        instruction: 'Pregunta cultural',
        question: '¿Qué significa la palabra "sobremesa" según el texto?',
        options: [
          'Limpiar la mesa rápidamente',
          'Un momento de charla tranquila tras comer',
          'Pagar la cuenta con tarjeta',
          'Ordenar postres caros',
        ],
        correctAnswer: 'Un momento de charla tranquila tras comer',
        explanation: 'La sobremesa es la costumbre española de conversar tranquilamente en la mesa.',
        difficulty: 'A1',
      },
    ],
    source: 'Dominio Público / Redacción Educativa',
    license: 'CC-BY-SA 4.0',
  },
  {
    id: 'read-2',
    title: 'Rinconete y Cortadillo (Adaptación literaria)',
    author: 'Miguel de Cervantes Saavedra',
    cefrLevel: 'A2',
    durationMinutes: 7,
    wordCount: 220,
    excerpt: 'En la venta del Molinillo, situada en el límite de los campos de Castilla y Andalucía, dos muchachos se encontraron por casualidad...',
    fullText: `En la famosa venta del Molinillo, situada entre los campos dorados de Castilla y Andalucía, dos muchachos jóvenes se encontraron una calurosa tarde de verano. 

Ninguno de los dos pasaba de los diecisiete años. Ambos vestían ropas viejas y rotas, pero en sus ojos brillaba el ingenio y el deseo de libertad. Uno se llamaba Pedro del Rincón y el otro Diego Cortado.

—¿Hacia dónde camina vuestra merced? —preguntó Cortado con cortesía.
—A Sevilla voy —respondió Rincón—, que es la ciudad más rica y alegre de este reino, donde cualquier hombre despierto puede labrarse una nueva vida.

Juntos decidieron compartir el camino, sus escasas monedas y su comida. Aquel pacto de amistad marcaría el inicio de una de las aventuras picarescas más inolvidables de las letras universales.`,
    translationGlossary: {
      venta: { translation: 'roadside inn', phonetic: '[ˈben-ta]' },
      muchachos: { translation: 'young boys', phonetic: '[mu-ˈtʃa-tʃos]' },
      ingenio: { translation: 'wit / sharpness', phonetic: '[iŋ-ˈxe-njo]' },
      libertad: { translation: 'freedom', phonetic: '[li-βeɾ-ˈtað]' },
      picarescas: { translation: 'picaresque', phonetic: '[pi-ka-ˈɾes-kas]' },
    },
    comprehensionQuestions: [
      {
        id: 'comp-cerv-1',
        type: 'multiple_choice',
        instruction: 'Comprensión de lectura',
        question: '¿Hacia qué ciudad decidieron viajar juntos los dos muchachos?',
        options: ['Madrid', 'Toledo', 'Sevilla', 'Granada'],
        correctAnswer: 'Sevilla',
        explanation: 'Rincón responde: "A Sevilla voy, que es la ciudad más rica y alegre de este reino".',
        difficulty: 'A2',
      },
    ],
    source: 'Project Gutenberg / Novelas Ejemplares',
    license: 'Public Domain',
  },
];
