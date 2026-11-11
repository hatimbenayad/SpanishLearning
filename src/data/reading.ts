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
  {
    id: 'read-3',
    title: 'El Monte de las Ánimas (Fragmento adaptado)',
    author: 'Gustavo Adolfo Bécquer',
    cefrLevel: 'B1',
    durationMinutes: 8,
    wordCount: 185,
    excerpt: 'En Soria, junto al río Duero, se alza una colina envuelta en antiguas leyendas que los ancianos cuentan junto al fuego...',
    fullText: `Cuando cae la tarde de otoño sobre las tierras altas de Soria y el viento frío agita los árboles secos, las campanas de la vieja ciudad comienzan a doblar con lentitud.

Beatriz y su primo Alonso regresaban de una jornada de caza por las riberas del Duero. Aunque el cielo se teñía de violeta, ambos conversaban con tranquilidad sobre las viejas historias de templarios y nobles que habían defendido aquel monte siglos atrás.

—Dicen los habitantes del pueblo —explicó Alonso en voz baja— que durante la noche de Todos los Santos nadie debe cruzar este bosque, pues los espíritus antiguos despiertan entre la niebla.

Beatriz sonrió incrédula y miró hacia la colina oscura. Sin embargo, al advertir que había perdido su banda azul entre los senderos del monte, un silencio inquietante descendió sobre ambos. El valor de Alonso sería puesto a prueba antes de que sonara la medianoche.`,
    translationGlossary: {
      otoño: { translation: 'autumn', phonetic: '[o-ˈto-ɲo]' },
      campanas: { translation: 'church bells', phonetic: '[kam-ˈpa-nas]' },
      lentitud: { translation: 'slowness', phonetic: '[len-ti-ˈtuð]' },
      caza: { translation: 'hunting', phonetic: '[ˈka-θa]' },
      riberas: { translation: 'riverbanks', phonetic: '[ri-ˈβe-ɾas]' },
      niebla: { translation: 'fog / mist', phonetic: '[ˈnje-βla]' },
      incrédula: { translation: 'disbelieving / skeptical', phonetic: '[iŋ-ˈkɾe-ðu-la]' },
      senderos: { translation: 'footpaths / trails', phonetic: '[sen-ˈde-ɾos]' },
      inquietante: { translation: 'unsettling / eerie', phonetic: '[iŋ-kje-ˈtan-te]' },
      medianoche: { translation: 'midnight', phonetic: '[me-ðja-ˈno-tʃe]' },
    },
    comprehensionQuestions: [
      {
        id: 'comp-becquer-1',
        type: 'multiple_choice',
        instruction: 'Comprensión literaria (B1)',
        question: '¿Por qué motivo se generó un silencio inquietante entre Beatriz y Alonso?',
        options: [
          'Porque empezó a nevar intensamente',
          'Porque Beatriz había perdido su banda azul en el monte',
          'Porque los caballos huyeron hacia el río',
          'Porque las puertas de la ciudad estaban cerradas',
        ],
        correctAnswer: 'Porque Beatriz había perdido su banda azul en el monte',
        explanation: 'El relato indica: "al advertir que había perdido su banda azul entre los senderos del monte, un silencio inquietante descendió sobre ambos".',
        difficulty: 'B1',
      },
    ],
    source: 'Project Gutenberg / Leyendas de Bécquer',
    license: 'Public Domain',
  },
  {
    id: 'read-4',
    title: 'Cervantes y la invención de la novela moderna',
    author: 'Ensayo de Literatura Hispánica',
    cefrLevel: 'B2',
    durationMinutes: 10,
    wordCount: 195,
    excerpt: 'Al publicar la primera parte de Don Quijote en 1605, Miguel de Cervantes transformó radicalmente el arte de narrar en Europa...',
    fullText: `Antes de la aparición de Don Quijote de la Mancha en 1605, la ficción europea solía dividirse en compartimentos rígidos: por un lado, los libros de caballerías repletos de héroes invencibles; por otro, la sátira picaresca centrada en la supervivencia cotidiana.

Miguel de Cervantes logró desentrañar los límites de ambos géneros y fundirlos en una síntesis inédita. A través del diálogo constante entre Alonso Quijano —un lector apasionado que confunde sus lecturas con el mundo real— y Sancho Panza —un escudero pragmático pero capaz de asimilar la fantasía de su señor—, la obra introduce la polifonía narrativa y el perspectivismo.

Lejos de imponer una única verdad moral, Cervantes permite que cada personaje interprete la realidad según su experiencia y lenguaje. Ese contraste entre el idealismo y la verosimilitud convirtió a la obra en la piedra angular de la novela moderna, demostrando que el humor, la ironía y la compasión pueden convivir en una misma página.`,
    translationGlossary: {
      ficción: { translation: 'fiction', phonetic: '[fik-ˈθjon]' },
      desentrañar: { translation: 'to unravel / penetrate', phonetic: '[de-sen-tɾa-ˈɲaɾ]' },
      inédita: { translation: 'unprecedented / unpublished', phonetic: '[i-ˈne-ði-ta]' },
      escudero: { translation: 'squire', phonetic: '[es-ku-ˈðe-ɾo]' },
      pragmático: { translation: 'pragmatic', phonetic: '[pɾaɣ-ˈma-ti-ko]' },
      polifonía: { translation: 'polyphony (multiple voices)', phonetic: '[po-li-fo-ˈni-a]' },
      perspectivismo: { translation: 'perspectivism', phonetic: '[peɾs-pek-ti-ˈβiz-mo]' },
      verosimilitud: { translation: 'plausibility / realism', phonetic: '[be-ɾo-si-mi-li-ˈtuð]' },
      compasión: { translation: 'compassion', phonetic: '[kom-pa-ˈsjon]' },
    },
    comprehensionQuestions: [
      {
        id: 'comp-b2-1',
        type: 'multiple_choice',
        instruction: 'Análisis textual (B2)',
        question: '¿Qué aporta fundamentalmente el diálogo entre Don Quijote y Sancho Panza según el ensayo?',
        options: [
          'Una crítica exclusiva contra la poesía lírica',
          'La polifonía narrativa y el perspectivismo al contrastar idealismo y pragmatismo',
          'La desaparición total de las novelas de aventuras',
          'Un manual histórico sobre arquitectura castellana',
        ],
        correctAnswer: 'La polifonía narrativa y el perspectivismo al contrastar idealismo y pragmatismo',
        explanation: 'El segundo párrafo señala que el diálogo entre ambos introduce la polifonía narrativa y el perspectivismo.',
        difficulty: 'B2',
      },
    ],
    source: 'Redacción Educativa / Patrimonio Literario',
    license: 'CC-BY-SA 4.0',
  },
];

