/* Tamagotchi del Reporterito — juego local, sin dependencias. */

const STORAGE_KEY = "reporterito-save-v1";
const WINDOW_SAVE_PREFIX = "REPORTERITO_SAVE::";
const STAT_INFO = {
  hugs: { label: "Abrazos", icon: "🫂" },
  affection: { label: "Cariño", icon: "💗" },
  messages: { label: "Mensajes", icon: "💬" },
  energy: { label: "Energía emocional", icon: "⚡" },
  trust: { label: "Confianza", icon: "🔐" }
};

const DEFAULT_STATE = {
  stats: { hugs: 68, affection: 72, messages: 61, energy: 66, trust: 74 },
  achievements: [], counts: { hugs: 0, messages: 0, piojitos: 0, thoughts: 0 },
  chat: { totalSent: 0, recent: [], unlockedSpecials: [] },
  tree: { loveTreeXP: 0, loveTreeLevel: 1, stage: "Semillita", memories: [] },
  album: { memories: [], streak: 1, lastPlayedDate: "" },
  world: { timePeriod: "morning", roomTheme: "romantic", reporterVisualState: "idle", roomVisits: 0, lastDailyGift: "" },
  panchito: { mood: "happy", action: "idle", pets: 0, feeds: 0, plays: 0, eventsSeen: [] },
  gifts: { owned: [], visible: [], positions: {} },
  novel: { completed: [], choices: [], totalCompleted: 0, helpedCount: 0, history: [] },
  rewardOpened: false, startedAt: Date.now(), lastSaved: Date.now(), highLoveSince: null,
  petTaps: 0, daringUntil: 0
};

const achievementInfo = {
  firstHug: ["🫂", "Primer abrazo", "El protocolo de apapacho comenzó"],
  teAmo: ["💘", "Te amo", "Declaración oficial registrada"],
  perfectDay: ["💯", "Día perfecto", "Todas las barras al máximo"],
  survivor: ["🏅", "Sobreviviente", "Una larga guardia de amor"],
  spoiled: ["👑", "Consentido", "Recibió muchos abrazos"],
  simp: ["📸", "Simp", "Pensó demasiado en la directiva"],
  speedrun: ["💍", "Matrimonio speedrun", "Amor alto sin interrupciones"],
  burger: ["🍔", "Hamburguesa salvadora", "La energía volvió al sistema"],
  present: ["🚪", "Directiva presente", "El reporterito recibió la mejor visita del día"],
  eternalChat: ["💬", "Chat eterno", "El reporterito podría hablar con la Directiva todo el día"],
  lifetimeMessages: ["📱", "Mensajes para toda la vida", "La Directiva y el reporterito podrían hablar durante siglos"],
  romanticBibles: ["📖", "Biblias románticas", "Se detectó una cantidad peligrosa de amor escrito"],
  whatsappPremium: ["💎", "WhatsApp Premium", "El reporterito ya no distingue entre el juego y extrañar a la Directiva"],
  loveSeed: ["🌱", "Semillita de amor", "El reporterito vio crecer el primer brote del árbol"],
  emotionalGardener: ["🌿", "Jardinero emocional", "El reporterito está cuidando algo bonito"],
  branchHearts: ["💗", "Corazones en las ramas", "El árbol empezó a florecer con corazones"],
  prettyAutumn: ["🍂", "Otoño bonito", "El árbol se llenó de colores cálidos"],
  legendaryTree: ["🌳", "Árbol legendario", "El reporterito desbloqueó el árbol más bonito del juego"],
  panchitoFriend: ["🐾", "Mejor amigo de Panchito", "Panchito considera al reporterito su compañero oficial de aventuras"],
  happyPanchito: ["🐶", "Panchito feliz", "Panchito movió la colita tantas veces que desbloqueó felicidad premium"],
  cozyRoom: ["🏠", "Habitación acogedora", "El cuarto del reporterito se llenó de recuerdos bonitos"],
  confidant: ["🫶", "Confidente", "El reporterito siente que puede contarle todo a la Directiva"]
};

const moodMessages = {
  enamorado: ["El reporterito volvió a quedarse viendo la foto.", "El reporterito lleva varios minutos sonriendo frente a la foto.", "El reporterito activó modo enamorado frente al marco de la Directiva."],
  feliz: ["El reporterito anda feliz por algo que dijo la Directiva.", "El reporterito está caminando por el cuarto con sonrisita mensa.", "El reporterito recibió cariño y ahora no puede quedarse quieto."],
  tranquilo: ["El reporterito está trabajando, pero pensando en la directiva cada 5 minutos.", "El reporterito está estable, pero necesita cariñito preventivo.", "Todo tranquilo en el departamento de amor."],
  triste: ["El reporterito está sentado pensando en la Directiva.", "El reporterito necesita un poquito de cariño.", "El reporterito está abrazando una almohadita porque extraña a la Directiva."],
  "muy-triste": ["El reporterito lleva horas esperando un mensaje.", "Emergencia emocional: la directiva debe intervenir.", "El reporterito está en modo dramático."],
  abrazos: ["Se detectó una severa falta de abrazos.", "El reporterito necesita un abrazo urgentemente.", "Sin abrazos, el sistema del reporterito empieza a fallar."],
  esperando: ["El reporterito revisó el celular otra vez.", "El reporterito detectó una notificación fantasma.", "El reporterito está esperando mensajito de la Directiva."],
  critico: ["El reporterito necesita atención urgente antes de ponerse dramático."],
  dormido: ["El reporterito duerme pensando en la Directiva.", "El reporterito está soñando con abrazos.", "El reporterito entró en modo sueño pixelado."],
  enfermo: ["Diagnóstico: enamorado hasta las orejas.", "El reporterito tiene sobredosis de amor.", "No hay cura. Solo más besitos."],
  atrevido: ["La directiva se veía demasiado guapa hoy.", "Pensamientos impuros detectados.", "Alerta: reporterito extremadamente enamorado."]
};

const ambientMessages = [
  "El reporterito está escribiendo un mensaje de 4 párrafos.",
  "El reporterito acaba de presumir a la directiva.",
  "El reporterito encontró una foto de ustedes y se quedó viendo 10 minutos.",
  "El reporterito fue productivo durante 3 minutos antes de pensar en la directiva.",
  "El reporterito está escuchando canciones románticas otra vez.",
  "El reporterito recibió piojito imaginario.",
  "El reporterito está contando los días para volver a verla.",
  "El reporterito activó el modo extrañar.",
  "El reporterito acaba de sonreír viendo una notificación.",
  "El reporterito está orgulloso de la directiva.",
  "Última hora: periodista local pierde la concentración por una mujer guapísima.",
  "El reporterito redactó un boletín titulado: ‘La amo mucho’."
];

/* Las únicas frases escritas desde la voz de la Directiva viven aquí. */
const CHAT_CATEGORIES = {
  "Románticas": [
    "Te amo muchísimo.", "Te extraño.", "Estoy pensando en ti.", "Gracias por existir.",
    "Hoy me acordé de ti todo el día.", "Eres mi persona favorita.", "Quiero abrazarte.",
    "Quiero verte.", "Me haces muy feliz.", "Me encanta hablar contigo.",
    "Eres mi lugar seguro.", "Estoy orgullosa de ti.", "Me haces sentir querida.",
    "Gracias por cuidarme.", "No olvides que te amo."
  ],
  "Ternuritas": [
    "¿Ya comiste?", "¿Ya tomaste agua?", "¿Cómo te sientes hoy?", "¿Dormiste bien?",
    "¿Necesitas un abrazo?", "¿Cómo estuvo tu día?", "Espero que estés bien.",
    "Cuídate mucho.", "No trabajes demasiado.", "Descansa tantito.",
    "Te mando piojito virtual.", "Aquí tienes un besito.", "Aquí tienes dos besitos.",
    "Aquí tienes diez besitos.", "Te mando un abrazo gigante."
  ],
  "Directiva oficial": [
    "La directiva solicita un reporte emocional.", "La directiva autoriza abrazos ilimitados.",
    "La directiva autoriza una cita.", "La directiva exige sonrisas.",
    "La directiva solicita una actualización amorosa.", "La directiva aprueba piojito premium.",
    "La directiva activó protocolo de besitos.", "La directiva detectó exceso de ternura.",
    "La directiva autoriza descanso emocional.", "La directiva solicita fotos del reporterito."
  ],
  "Coquetas": [
    "Hoy te ves muy guapo.", "¿Por qué eres tan lindo?", "Me gustas mucho.",
    "Extraño tus abrazos.", "Extraño tus besos.", "Quiero verte ya.",
    "Te ves demasiado bonito hoy.", "No me distraigas que estoy pensando en ti.",
    "¿Sabías que me encantas?", "Creo que estoy enamorada de ti otra vez."
  ],
  "Divertidas": [
    "¿Sigues vivo reporterito?", "Reporte oficial de supervivencia.",
    "¿Cuántas veces pensaste en mí hoy?", "¿Ya presumiste a la directiva?",
    "¿Ya escuchaste canciones románticas?", "¿Ya activaste modo extrañar?",
    "¿Cuántas hamburguesas llevas hoy?", "¿Otra vez viendo mis fotos?",
    "¿Otra vez sonriendo por mis mensajes?", "¿Otra vez enamorado?"
  ],
  "Especiales": [
    "Te adoro en aceite.", "Gracias por quedarte.", "Me haces sentir en casa.",
    "Ojalá pudiera abrazarte ahora.", "Estoy feliz de que existas.",
    "Siempre voy a apoyarte.", "Confío en ti.", "Gracias por tu paciencia.",
    "Gracias por amarme.", "Eres mi reporterito favorito."
  ]
};

/* 80 respuestas diferentes. Las primeras 70 corresponden una a una con las frases anteriores. */
const REPORTER_RESPONSES = [
  "El reporterito acaba de reiniciar su corazón en modo amor.",
  "El reporterito activó modo extrañar y quiere verla ya.",
  "El reporterito se quedó pensando que quizá ambos se pensaban al mismo tiempo.",
  "El reporterito agradeció en silencio que ella exista.",
  "El reporterito confirmó que también pensó en ella demasiadas veces.",
  "El reporterito recibió el nombramiento más bonito de su vida.",
  "El reporterito quiere correr directo a esos abrazos.",
  "El reporterito ya empezó a contar los segundos para verla.",
  "El reporterito recibió un golpe crítico de felicidad.",
  "El reporterito podría quedarse hablando con ella hasta que salga el sol.",
  "El reporterito guardó ese mensaje como refugio emocional.",
  "El reporterito desbloqueó fuerza emocional nivel legendario.",
  "El reporterito se sintió afortunado de poder quererla bonito.",
  "El reporterito prometió seguir cuidándola con todo el corazón.",
  "Sistema emocional actualizado: el cariño subió demasiado rápido.",
  "El reporterito se sintió cuidado y prometió comer algo rico.",
  "El reporterito tomó agua inmediatamente para evitar un reporte administrativo.",
  "Reporte del reporterito: sensible, enamorado y mucho mejor después de leerla.",
  "El reporterito confesó que durmió pensando en ella.",
  "El reporterito acepta el abrazo y solicita que dure aproximadamente para siempre.",
  "El reporterito guardó lo mejor de su día para contárselo a ella.",
  "El reporterito se sintió acompañado incluso a través de la pantalla.",
  "El reporterito prometió cuidarse para que la Directiva no se preocupe.",
  "El reporterito cerró la computadora tres minutos antes de lo previsto. Progreso.",
  "El reporterito activó una pausa de cariño preventivo.",
  "El reporterito recibió piojito emocional y entró en paz absoluta.",
  "Alerta pixelada: un besito aterrizó directo en el corazón del reporterito.",
  "El reporterito archivó dos besitos en la carpeta de asuntos urgentes.",
  "El reporterito colapsó feliz bajo una cantidad irresponsable de besitos.",
  "El reporterito también quiere abrazarla como si fuera su lugar seguro.",
  "Reporte del reporterito: enamorado, sensible y con necesidad urgente de abrazos.",
  "El reporterito acepta oficialmente todos los abrazos autorizados.",
  "El reporterito cancelaría todo su calendario por esa cita.",
  "El reporterito obedeció y sonrió como menso frente a la pantalla.",
  "Sistema emocional actualizado: nivel de amor peligrosamente saludable.",
  "El reporterito entró en modo paz absoluta gracias al piojito premium.",
  "Alerta pixelada: protocolo de besitos recibido y procesado con emoción.",
  "El reporterito intentó ocultar la ternura, pero los píxeles lo delataron.",
  "El reporterito recuperó estabilidad emocional y bajó los hombritos.",
  "El reporterito está buscando su mejor ángulo pixelado.",
  "Alerta pixelada: el reporterito se puso rojo en resolución 8 bits.",
  "El reporterito tampoco entiende por qué se derrite tan fácil con ella.",
  "El reporterito se quedó viendo la pantalla demasiado tiempo.",
  "El reporterito también extraña abrazarla como si fuera su lugar seguro.",
  "El reporterito tuvo pensamientos intensos, pero se hizo el inocente.",
  "El reporterito ya estaba listo desde antes de terminar de leer.",
  "El reporterito no supo qué contestar y se puso rojo en 8 bits.",
  "El reporterito activó modo nerviosito enamorado.",
  "El reporterito confirmó que ella le encanta todavía más.",
  "El reporterito acaba de morir, revivir y volver a enamorarse.",
  "Reporte del reporterito: sigue vivo gracias a dosis regulares de cariño.",
  "El reporterito sobrevivió, aunque extrañar a la Directiva estuvo cerca de vencerlo.",
  "El reporterito perdió la cuenta después de pensar en ella cuarenta y siete veces.",
  "El reporterito confirmó que presumirla ya forma parte de su rutina diaria.",
  "El reporterito lleva tres canciones imaginando que todas hablan de ustedes.",
  "El reporterito activó modo extrañar desde que abrió los ojos.",
  "El reporterito declaró que esa información está protegida por secreto profesional.",
  "El reporterito fue descubierto mirando sus fotos con cara de enamorado.",
  "El reporterito leyó el mensaje tres veces y sonrió como menso.",
  "El reporterito confirmó que el enamoramiento sigue fuera de control.",
  "El reporterito procesó el aceite y determinó que era amor de alta calidad.",
  "El reporterito guardó ese agradecimiento para los días difíciles.",
  "El reporterito sintió que podía descansar porque estaba en casa con ella.",
  "El reporterito cerró los ojos e imaginó ese abrazo con lujo de detalle.",
  "El reporterito está feliz de compartir el planeta y el mismo huso horario con ella.",
  "El reporterito recibió fuerza emocional y se sintió invencible.",
  "El reporterito recibió esa confianza con cuidado y la guardó cerca del corazón.",
  "El reporterito agradeció que ella entienda incluso sus días lentos.",
  "El reporterito pensó que amarla es una de sus cosas favoritas.",
  "El reporterito recibió el título oficial que siempre había querido.",
  "El reporterito acaba de sonreír como menso porque le habló la Directiva.",
  "Sistema emocional actualizado: felicidad premium desbloqueada.",
  "Alerta pixelada: daño crítico de ternura detectado.",
  "El reporterito está pateando los pies de felicidad.",
  "El reporterito quiere guardar este mensaje en una vitrina.",
  "El reporterito se derritió un poquito y necesita rearmarse.",
  "El reporterito abrazó el celular como medida emocional de emergencia.",
  "Reporte del reporterito: día mejorado en un 300%.",
  "El reporterito recibió medicina emocional directamente en el chat.",
  "Sistema emocional estable: el reporterito se siente querido y acompañado."
];

const SPECIAL_CONVERSATIONS = [
  { id: "favorite", trigger: "El reporterito respiró hondo y escribió: ‘Yo también te amo’.\nEl reporterito pregunta: ‘¿Sabías que eres mi persona favorita?’", options: [
    ["Sí ❤️", { affection: 1 }], ["Obviamente ❤️", { trust: 1 }], ["Siempre ❤️", { energy: 1 }]
  ] },
  { id: "date", trigger: "El reporterito abrió su agenda imaginaria y preguntó: ‘¿Nuestra cita puede durar todo el día?’", options: [
    ["Todo el día 💕", { affection: 1 }], ["Y toda la noche ✨", { energy: 1 }], ["Hasta que nos corran 😂", { trust: 1 }]
  ] },
  { id: "hug", trigger: "El reporterito extendió los bracitos pixelados: ‘¿Qué tipo de abrazo necesita la Directiva?’", options: [
    ["Uno infinito", { affection: 1 }], ["Uno apretadito", { energy: 1 }], ["Todos", { trust: 1 }]
  ] },
  { id: "proud", trigger: "El reporterito se emocionó y preguntó: ‘¿Puedo guardar este mensaje para leerlo en días difíciles?’", options: [
    ["Para siempre", { trust: 1 }], ["Es tuyo 💗", { affection: 1 }], ["Te mandaré más", { energy: 1 }]
  ] },
  { id: "home", trigger: "El reporterito bajó la voz: ‘Si tú eres mi casa, ¿puedo quedarme cerquita?’", options: [
    ["Siempre", { trust: 1 }], ["Aquí cabes", { affection: 1 }], ["Ven ya", { energy: 1 }]
  ] }
];

const LOVE_TREE_STAGES = [
  { level: 1, xp: 0, name: "Semillita", message: "El reporterito plantó una semillita con el primer poquito de cariño." },
  { level: 2, xp: 250, name: "Brote", message: "El reporterito ve que algo bonito empieza a crecer." },
  { level: 3, xp: 650, name: "Arbolito", message: "El reporterito cuida este arbolito como cuida lo que siente por la Directiva." },
  { level: 4, xp: 1300, name: "Árbol con corazones", message: "El árbol empezó a florecer con corazones porque el reporterito se siente querido." },
  { level: 5, xp: 2200, name: "Árbol de otoño", message: "Las hojas se volvieron cálidas, como los recuerdos bonitos del reporterito." },
  { level: 6, xp: 3500, name: "Árbol legendario", message: "El reporterito desbloqueó un árbol legendario hecho de amor, paciencia y besitos imaginarios." }
];

const TREE_AMBIENT_MESSAGES = [
  "El reporterito riega el árbol con recuerdos bonitos.",
  "El árbol crece cada vez que el reporterito se siente querido.",
  "Una hojita cayó y tenía forma de corazón.",
  "El reporterito se sentó bajo el árbol a pensar en la Directiva.",
  "El árbol guarda todos los mensajes bonitos.",
  "El reporterito prometió cuidar este árbol todos los días.",
  "El árbol brilló cuando llegó un mensaje de la Directiva.",
  "El reporterito dice que este árbol se parece a lo que siente.",
  "Las raíces crecieron con paciencia y cariño.",
  "El árbol sobrevivió otro día gracias al amor recibido."
];

const GIFT_DEFINITIONS = [
  { id: "bow", icon: "🎀", name: "Moño", description: "Un moñito para que el cuarto se vea más bonito." },
  { id: "specialBurger", icon: "🍔", name: "Hamburguesa especial", description: "Una hamburguesa que sobrevivirá como recuerdo." },
  { id: "photo", icon: "📷", name: "Foto", description: "Una foto que el reporterito mira demasiado." },
  { id: "teddy", icon: "🧸", name: "Peluche", description: "Guardián oficial de la cama." },
  { id: "rose", icon: "🌹", name: "Rosa", description: "Todavía conserva un poquito de magia." },
  { id: "star", icon: "⭐", name: "Estrella", description: "Brilla cuando el reporterito se siente querido." },
  { id: "letter", icon: "💌", name: "Carta", description: "Un mensaje que merecía quedarse para siempre." },
  { id: "song", icon: "🎵", name: "Canción favorita", description: "Hace que el cuarto suene romántico en silencio." },
  { id: "clover", icon: "🍀", name: "Trébol", description: "Panchito asegura que trae buena suerte." },
  { id: "balloon", icon: "🎈", name: "Globo", description: "Nunca termina de desinflarse porque es pixelado." }
];

const PANCHITO_EVENTS = [
  { id: "beside", text: "Panchito se acostó junto al reporterito.", changes: { energy: 1 } },
  { id: "oldPhoto", text: "Panchito encontró una foto vieja.", changes: { affection: 1 }, gift: "photo" },
  { id: "support", text: "Panchito detectó tristeza y activó apoyo emocional.", changes: { trust: 2 } },
  { id: "smile", text: "Panchito hizo sonreír al reporterito.", changes: { energy: 1, affection: 1 } },
  { id: "tail", text: "Panchito apareció moviendo la cola.", changes: { affection: 1 } },
  { id: "phone", text: "Panchito se sentó frente al celular como esperando mensaje también.", changes: { messages: 1 } },
  { id: "mystery", text: "Panchito llevó un regalo misterioso al cuarto.", changes: { trust: 1 }, randomGift: true },
  { id: "bed", text: "Panchito se durmió junto a la cama del reporterito.", changes: { energy: 1 } }
];

const NOVEL_SCENES = [
  { id:"howAreYou", title:"Un momento tranquilo", initial:"¿Cómo estás?", reply:"El reporterito bajó un poquito la voz: ‘Un poquito cansado’.", options:[
    ["❤️ Dar abrazo","El reporterito recibió un abrazo y se sintió mucho mejor.",{hugs:3,affection:1}],
    ["🫳 Dar piojito","El reporterito activó modo paz absoluta.",{trust:2,affection:1}],
    ["👂 Escuchar","El reporterito agradeció sentirse escuchado.",{trust:2}]
  ]},
  { id:"hardDay",title:"Después de un día largo",initial:"Cuéntame qué pasó hoy.",reply:"El reporterito admitió que el día pesó un poquito más de lo normal.",options:[
    ["Estoy aquí","El reporterito dejó de sentirse solo.",{trust:3}], ["Descansa conmigo","El reporterito soltó los hombros y respiró.",{energy:2}], ["Mañana será bonito","El reporterito recuperó una esperanza pequeñita.",{affection:1,energy:1}]
  ]},
  { id:"photoRequest",title:"Una foto improvisada",initial:"Quiero una foto de mi reporterito.",reply:"El reporterito se puso nervioso y buscó su mejor ángulo pixelado.",options:[
    ["Sonríe bonito","El reporterito sonrió como menso para la cámara.",{affection:2},"photo"], ["Así te ves precioso","El reporterito sufrió daño crítico de ternura.",{affection:3}], ["Con Panchito también","El reporterito llamó a Panchito para la foto oficial.",{trust:2},"photo"]
  ]},
  { id:"futureDate",title:"Plan de emergencia romántica",initial:"¿A dónde iríamos en nuestra próxima cita?",reply:"El reporterito abrió un mapa imaginario y marcó todos los lugares.",options:[
    ["Por hamburguesas","El reporterito votó a favor inmediatamente.",{energy:2},"specialBurger"], ["A ver estrellas","El reporterito imaginó la noche más bonita.",{affection:2},"star"], ["A cualquier lado contigo","El reporterito guardó esa respuesta en el corazón.",{trust:2}]
  ]},
  { id:"safePlace",title:"Lugar seguro",initial:"Puedes contarme lo que sea.",reply:"El reporterito se quedó callado un segundo porque eso significaba mucho.",options:[
    ["Sin prisa","El reporterito agradeció no tener que apresurarse.",{trust:3}], ["No estás solo","El reporterito recuperó estabilidad emocional.",{energy:1,trust:2}], ["Te quiero completo","El reporterito se sintió querido incluso en sus partes difíciles.",{affection:2,trust:1}]
  ]},
  { id:"food",title:"Supervisión alimenticia",initial:"Dime la verdad, ¿ya comiste?",reply:"El reporterito miró hacia otro lado de forma sospechosa.",options:[
    ["Vamos por comida","El reporterito aceptó el operativo hamburguesa.",{energy:3}], ["Te estoy vigilando","El reporterito prometió cuidarse mejor.",{trust:1,energy:1}], ["Come y me cuentas","El reporterito se sintió cuidado a la distancia.",{affection:1,energy:2}]
  ]},
  { id:"proud",title:"Informe de orgullo",initial:"Estoy muy orgullosa de ti.",reply:"El reporterito leyó la frase tres veces antes de poder responder.",options:[
    ["Por todo lo que haces","El reporterito recibió fuerza emocional.",{energy:3}], ["Por quien eres","El reporterito se sintió suficiente.",{trust:3}], ["Y te lo repetiré","El reporterito quiso guardar esas palabras en una vitrina.",{affection:2},"letter"]
  ]},
  { id:"rain",title:"Tarde de lluvia",initial:"Si estuviera lloviendo, ¿qué haríamos?",reply:"El reporterito imaginó una tarde escondidos del mundo.",options:[
    ["Película y cobija","El reporterito apartó el lugar más calientito.",{hugs:2,energy:1},"teddy"], ["Escuchar la lluvia","El reporterito entró en calma.",{energy:2}], ["Bailar de todos modos","El reporterito se rió y aceptó mojarse.",{affection:2}]
  ]},
  { id:"song",title:"Canción compartida",initial:"Escuché una canción que me recordó a ti.",reply:"El reporterito ya quería saber cada palabra.",options:[
    ["Te la dedico","El reporterito convirtió la canción en recuerdo.",{affection:2},"song"], ["La escuchamos juntos","El reporterito preparó sus audífonos imaginarios.",{trust:1,affection:1}], ["Adivina cuál","El reporterito empezó una investigación periodística.",{energy:2}]
  ]},
  { id:"missing",title:"Modo extrañar",initial:"Te extraño más de lo normal hoy.",reply:"El reporterito confesó que llevaba horas sintiendo lo mismo.",options:[
    ["Abrazo pendiente","El reporterito registró oficialmente un abrazo futuro.",{hugs:3}], ["Nos veremos pronto","El reporterito empezó a contar los días.",{energy:2}], ["Piensa en mí","El reporterito respondió que nunca había dejado de hacerlo.",{affection:2}]
  ]},
  { id:"panchitoTalk",title:"Consulta con Panchito",initial:"¿Qué opina Panchito de mí?",reply:"El reporterito consultó al experto, que respondió moviendo la cola.",options:[
    ["Eso significa que me ama","Panchito confirmó el diagnóstico con otra vuelta.",{affection:1,trust:1}], ["Mándale un beso","Panchito recibió el beso y estornudó feliz.",{energy:2}], ["Somos equipo","El reporterito sintió que su pequeña familia estaba completa.",{trust:2},"clover"]
  ]},
  { id:"letter",title:"Carta sin papel",initial:"Quiero decirte algo que puedas guardar.",reply:"El reporterito abrió una página nueva en su memoria interna.",options:[
    ["Gracias por quedarte","El reporterito guardó esas palabras para los días grises.",{trust:3},"letter"], ["Me haces sentir en casa","El reporterito sintió calorcito en el pecho.",{affection:2}], ["Siempre voy a apoyarte","El reporterito se sintió invencible por un momento.",{energy:2,trust:1}]
  ]},
  { id:"work",title:"Pausa del escritorio",initial:"Deja de trabajar un ratito y mírame.",reply:"El reporterito cerró exactamente una pestaña y obedeció.",options:[
    ["Muy bien","El reporterito se sintió orgulloso de su mínimo progreso.",{energy:1}], ["Otra pestaña","El reporterito negoció, pero aceptó.",{energy:2}], ["Ven por piojito","El reporterito abandonó el escritorio sin mirar atrás.",{affection:1,trust:2}]
  ]},
  { id:"stars",title:"Una estrella para ustedes",initial:"Elige una estrella y pide un deseo.",reply:"El reporterito eligió la que parecía parpadear más fuerte.",options:[
    ["Que nos veamos pronto","El reporterito pidió exactamente lo mismo.",{affection:2},"star"], ["Que estés tranquilo","El reporterito sintió que el deseo ya funcionaba.",{energy:2}], ["No te diré el mío","El reporterito sonrió porque creyó adivinarlo.",{trust:1,affection:1}]
  ]},
  { id:"gift",title:"Un regalo invisible",initial:"Tengo un regalo para ti, pero debes elegir.",reply:"El reporterito extendió las manos con emoción pixelada.",options:[
    ["Algo suave","El reporterito recibió un guardián abrazable.",{hugs:2},"teddy"], ["Algo bonito","El reporterito recibió una rosa que no se marchita.",{affection:2},"rose"], ["Algo divertido","El reporterito recibió un globo imposible de ponchar.",{energy:2},"balloon"]
  ]},
  { id:"fear",title:"Una preocupación pequeña",initial:"¿Hay algo que te preocupe?",reply:"El reporterito admitió que a veces teme no hacerlo suficientemente bien.",options:[
    ["No tienes que ser perfecto","El reporterito respiró como si soltara un peso.",{trust:3}], ["Lo resolvemos juntos","El reporterito dejó de sentir que debía con todo.",{energy:1,trust:2}], ["Ya eres suficiente","El reporterito guardó la frase como medicina emocional.",{affection:1,trust:2}]
  ]},
  { id:"morning",title:"Buenos días",initial:"Buenos días, mi reporterito bonito.",reply:"El reporterito abrió los ojos y el día mejoró inmediatamente.",options:[
    ["Desayuna bien","El reporterito prometió iniciar el día con energía.",{energy:2}], ["Te mando un beso","El reporterito recibió el primer golpe de ternura del día.",{affection:2}], ["Hoy será bonito","El reporterito decidió creerle.",{trust:1,energy:1}]
  ]},
  { id:"night",title:"Antes de dormir",initial:"No quería dormir sin hablar contigo.",reply:"El reporterito se acomodó para quedarse un ratito más.",options:[
    ["Sueña conmigo","El reporterito programó oficialmente ese sueño.",{affection:2}], ["Descansa mucho","El reporterito cerró los ojos sintiéndose cuidado.",{energy:3}], ["Un último abrazo","El reporterito abrazó la almohada como sustituto temporal.",{hugs:3}]
  ]},
  { id:"laugh",title:"Risa urgente",initial:"Necesito que me hagas reír.",reply:"El reporterito activó su archivo de chistes cuestionables.",options:[
    ["Uno malo","El chiste fue terrible y por eso funcionó.",{energy:2}], ["Imita a Panchito","Panchito presentó una queja formal moviendo la cola.",{affection:1,energy:1}], ["Solo sonríeme","El reporterito sonrió y olvidó qué iba a decir.",{affection:2}]
  ]},
  { id:"forever",title:"El futuro del árbol",initial:"¿Crees que nuestro Árbol de Amor llegue a legendario?",reply:"El reporterito miró las ramas y respondió sin dudar.",options:[
    ["Lo cuidaremos juntos","Las raíces parecieron crecer un poquito.",{trust:2}], ["Aunque tome años","El reporterito entendió que lo bonito no tiene prisa.",{energy:1,trust:1}], ["Claro que sí","Una hojita nueva apareció como si hubiera escuchado.",{affection:2},"bow"]
  ]}
];

/* Estas utilidades deben existir antes de cargar la partida guardada. */
const $ = (selector) => document.querySelector(selector);
const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];
const clamp = (number) => Math.max(0, Math.min(100, Math.round(number)));
const cloneDefaultState = () => JSON.parse(JSON.stringify(DEFAULT_STATE));

let offlinePenaltyNotice = false;
let state = loadState();
let loveTreeXP = Number(state.tree.loveTreeXP) || 0;
let loveTreeLevel = calculateTreeLevel(loveTreeXP);
let currentMood = "tranquilo";
let currentEvent = null;
let messageTimer;
let activeChatCategory = Object.keys(CHAT_CATEGORIES)[0];
let chatBusy = false;
let pendingSpecial = null;
let decayCycles = 0;
const actionCooldowns = {};
const panchitoCooldowns = {};
let currentNovel = null;
let novelResolved = false;

const average = () => Object.values(state.stats).reduce((a, b) => a + b, 0) / 5;

function calculateOfflineLoss(lastSaved, now) {
  const totals = { hugs: 0, affection: 0, messages: 0, energy: 0, trust: 0, attention: 0 };
  const awakeLoss = { messages: 10, hugs: 8, attention: 8, affection: 7, energy: 7, trust: 5 };
  const sleepLoss = { messages: 6, hugs: 6, attention: 6, affection: 6, energy: 6, trust: 6 };
  const maxLoss = 55;
  const totalHours = Math.floor((now - lastSaved) / 3600000);
  for (let i = 1; i <= totalHours; i++) {
    const hour = new Date(lastSaved + i * 3600000).getHours();
    const sleeping = hour >= 0 && hour < 8;
    const table = sleeping ? sleepLoss : awakeLoss;
    Object.keys(totals).forEach(key => totals[key] += table[key] || 0);
  }
  Object.keys(totals).forEach(key => totals[key] = Math.min(maxLoss, totals[key]));
  return totals;
}

function loadState() {
  try {
    let rawSave = null;
    try { rawSave = localStorage.getItem(STORAGE_KEY); } catch { /* El navegador bloqueó el almacenamiento local. */ }
    if (!rawSave && window.name.startsWith(WINDOW_SAVE_PREFIX)) rawSave = window.name.slice(WINDOW_SAVE_PREFIX.length);
    const saved = rawSave ? JSON.parse(rawSave) : null;
    if (!saved) return cloneDefaultState();
    const hoursAway = Math.floor((Date.now() - (saved.lastSaved || Date.now())) / 3600000);
    const merged = {
      ...cloneDefaultState(), ...saved,
      stats: { ...DEFAULT_STATE.stats, ...saved.stats },
      counts: { ...DEFAULT_STATE.counts, ...saved.counts },
      chat: { ...DEFAULT_STATE.chat, ...(saved.chat || {}) },
      tree: { ...DEFAULT_STATE.tree, ...(saved.tree || {}) },
      album: { ...DEFAULT_STATE.album, ...(saved.album || {}) },
      world: { ...DEFAULT_STATE.world, ...(saved.world || {}) },
      panchito: { ...DEFAULT_STATE.panchito, ...(saved.panchito || {}) },
      gifts: { ...DEFAULT_STATE.gifts, ...(saved.gifts || {}) },
      novel: { ...DEFAULT_STATE.novel, ...(saved.novel || {}) }
    };
    merged.tree.memories = Array.isArray(merged.tree.memories) ? merged.tree.memories : [];
    merged.album.memories = Array.isArray(merged.album.memories) ? merged.album.memories : [];
    merged.panchito.eventsSeen = Array.isArray(merged.panchito.eventsSeen) ? merged.panchito.eventsSeen : [];
    merged.gifts.owned = Array.isArray(merged.gifts.owned) ? merged.gifts.owned : [];
    merged.gifts.visible = Array.isArray(merged.gifts.visible) ? merged.gifts.visible : [];
    merged.gifts.positions = merged.gifts.positions && typeof merged.gifts.positions === "object" ? merged.gifts.positions : {};
    merged.novel.completed = Array.isArray(merged.novel.completed) ? merged.novel.completed : [];
    merged.novel.choices = Array.isArray(merged.novel.choices) ? merged.novel.choices : [];
    merged.novel.history = Array.isArray(merged.novel.history) ? merged.novel.history : [];
    if (merged.stats.attention === undefined) merged.stats.attention = 65;
    if (hoursAway >= 1) {
      const offlineLoss = calculateOfflineLoss(saved.lastSaved || Date.now(), Date.now());
      Object.entries(offlineLoss).forEach(([key, loss]) => {
        if (merged.stats[key] !== undefined) merged.stats[key] = clamp(merged.stats[key] - loss);
      });
      offlinePenaltyNotice = true;
    }
    return merged;
  } catch { return cloneDefaultState(); }
}

function saveState() {
  state.lastSaved = Date.now();
  state.tree.loveTreeXP = loveTreeXP;
  state.tree.loveTreeLevel = loveTreeLevel;
  state.tree.stage = LOVE_TREE_STAGES[loveTreeLevel - 1].name;
  const serializedState = JSON.stringify(state);
  try { localStorage.setItem(STORAGE_KEY, serializedState); } catch { /* Se conserva el respaldo de la pestaña. */ }
  window.name = WINDOW_SAVE_PREFIX + serializedState;
}

function buildInterface() {
  $("#statusPanel").innerHTML = Object.entries(STAT_INFO).map(([key, info]) => `
    <div class="stat" data-stat="${key}">
      <div class="stat-label"><span>${info.icon} ${info.label}</span><b>0%</b></div>
      <div class="stat-track"><div class="stat-fill"></div></div>
    </div>`).join("");
  $("#achievementGrid").innerHTML = Object.entries(achievementInfo).map(([key, info]) => `
    <div class="achievement" data-achievement="${key}">
      <span class="achievement-icon">${info[0]}</span><div><strong>${info[1]}</strong><small>${info[2]}</small></div>
    </div>`).join("");
  createSky();
  initializeAlbum();
  initializeLoveTree();
  initializeWorld();
  initializeGifts();
  initializePanchito();
  renderNovelProgress();
  buildChatInterface();
  checkChatAchievements();
  render(true);
  if (offlinePenaltyNotice) setTimeout(() => {
    setMessage("El reporterito esperó a la Directiva y se puso un poquito sensible.");
    toast("⏰", "EL REPORTERITO VOLVIÓ A VERLA", "El progreso offline fue calculado con un límite justo.");
  }, 500);
}

function calculateTreeLevel(xp) {
  return LOVE_TREE_STAGES.reduce((level, stage) => xp >= stage.xp ? stage.level : level, 1);
}

function initializeLoveTree() {
  loveTreeXP = Math.max(0, Number(state.tree.loveTreeXP) || 0);
  loveTreeLevel = calculateTreeLevel(loveTreeXP);
  state.tree.loveTreeLevel = loveTreeLevel;
  state.tree.stage = LOVE_TREE_STAGES[loveTreeLevel - 1].name;
  if (!state.tree.memories.length) addTreeMemory("El árbol llegó a la etapa Semillita.", "tree-stage-1");
  unlockTreeAchievements();
  renderLoveTree();
}

function addTreeXP(amount) {
  const points = Math.max(0, Number(amount) || 0);
  if (!points) return;
  const previousLevel = loveTreeLevel;
  loveTreeXP += points;
  loveTreeLevel = calculateTreeLevel(loveTreeXP);
  state.tree.loveTreeXP = loveTreeXP;
  state.tree.loveTreeLevel = loveTreeLevel;
  state.tree.stage = LOVE_TREE_STAGES[loveTreeLevel - 1].name;
  renderLoveTree();
  if (loveTreeLevel > previousLevel) {
    for (let level = previousLevel + 1; level <= loveTreeLevel; level++) celebrateTreeLevel(level);
    unlockTreeAchievements();
  }
  saveState();
}

function celebrateTreeLevel(level) {
  const stage = LOVE_TREE_STAGES[level - 1];
  const memory = `El árbol llegó a la etapa ${stage.name}.`;
  addTreeMemory(memory, `tree-stage-${level}`);
  toast("🌳", `El Árbol de Amor subió a nivel ${level}.`, stage.name);
  setMessage("El reporterito sintió que algo bonito creció dentro de él.");
  const scene = $("#loveTreeVisual");
  scene.classList.remove("growing"); void scene.offsetWidth; scene.classList.add("growing");
  setTimeout(() => scene.classList.remove("growing"), 1200);
  createTreeParticles(22);
  if (level === 4) grantGift("star", "ÁRBOL DE AMOR");
}

function createTreeParticles(count = 16) {
  const scene = $("#loveTreeVisual");
  const symbols = ["♥", "✦", "✧", "❀"];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("i");
    particle.className = "tree-particle"; particle.textContent = randomFrom(symbols);
    particle.style.color = randomFrom(["#ff77ad", "#ffd0e2", "#ffe18f", "#c785ee"]);
    particle.style.setProperty("--tx", `${(Math.random() - .5) * 250}px`);
    particle.style.setProperty("--ty", `${-40 - Math.random() * 170}px`);
    particle.style.setProperty("--turn", `${(Math.random() - .5) * 180}deg`);
    scene.appendChild(particle); setTimeout(() => particle.remove(), 1700);
  }
}

function renderLoveTree(message) {
  const stage = LOVE_TREE_STAGES[loveTreeLevel - 1];
  const nextStage = LOVE_TREE_STAGES[loveTreeLevel];
  const visual = $("#loveTreeVisual");
  visual.dataset.treeLevel = String(loveTreeLevel);
  visual.setAttribute("aria-label", `${stage.name}, nivel ${loveTreeLevel} del Árbol de Amor`);
  $("#loveTreeLevel").textContent = loveTreeLevel;
  $("#loveTreeStage").textContent = stage.name;
  $("#loveTreeMessage").textContent = message || stage.message;
  const progress = nextStage ? Math.min(100, loveTreeXP / nextStage.xp * 100) : 100;
  $("#loveTreeXPFill").style.width = `${progress}%`;
  $("#loveTreeXPText").textContent = nextStage ? `${loveTreeXP} / ${nextStage.xp} XP` : "Nivel máximo alcanzado";
  const track = document.querySelector(".tree-xp-track");
  track.setAttribute("aria-valuenow", String(loveTreeXP));
  track.setAttribute("aria-valuemax", String(nextStage?.xp || loveTreeXP));
  $("#treeMemories").innerHTML = state.tree.memories.slice(-3).map(item => `<span class="tree-memory">${escapeHTML(item.text)}</span>`).join("");
}

function addTreeMemory(text, id) {
  if (state.tree.memories.some(item => item.id === id)) return;
  state.tree.memories.push({ id, text, unlockedAt: Date.now() });
  state.tree.memories = state.tree.memories.slice(-12);
  addAlbumMemory(text, "ETAPA DEL ÁRBOL", "🌳", id);
}

function unlockTreeAchievements() {
  const keys = { 2: "loveSeed", 3: "emotionalGardener", 4: "branchHearts", 5: "prettyAutumn", 6: "legendaryTree" };
  for (let level = 2; level <= loveTreeLevel; level++) unlock(keys[level]);
}

function showTreeAmbientMessage() { renderLoveTree(randomFrom(TREE_AMBIENT_MESSAGES)); }

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function initializeAlbum() {
  const today = localDateKey();
  let startedNewDay = false;
  if (state.album.lastPlayedDate !== today) {
    if (state.album.lastPlayedDate) {
      const previous = new Date(`${state.album.lastPlayedDate}T12:00:00`);
      const current = new Date(`${today}T12:00:00`);
      const gap = Math.round((current - previous) / 86400000);
      state.album.streak = gap === 1 ? (Number(state.album.streak) || 0) + 1 : 1;
    } else state.album.streak = 1;
    state.album.lastPlayedDate = today;
    startedNewDay = true;
  }
  if (startedNewDay) addAlbumMemory("El reporterito comenzó un nuevo día y encontró todos sus recuerdos a salvo.", "NUEVO DÍA", "☀", `day-${today}`);
  renderAlbum(); saveState();
}

function addAlbumMemory(text, type = "RECUERDO", icon = "♥", id = null) {
  if (id && state.album.memories.some(memory => memory.id === id)) return;
  state.album.memories.push({ id: id || `memory-${Date.now()}-${Math.random()}`, text, type, icon, createdAt: Date.now() });
  state.album.memories = state.album.memories.slice(-60);
  if ($("#memoryAlbum")) renderAlbum();
}

function renderAlbum() {
  if (!$("#memoryAlbum")) return;
  const memories = state.album.memories.slice(-12).reverse();
  $("#memoryCount").textContent = state.album.memories.length;
  $("#albumDayCount").textContent = Math.max(1, Math.floor((Date.now() - state.startedAt) / 86400000) + 1);
  $("#albumStreak").textContent = state.album.streak || 1;
  $("#memoryAlbum").innerHTML = memories.length ? memories.map(memory => `
    <article class="memory-card" data-icon="${escapeHTML(memory.icon)}">
      <span class="memory-type">${escapeHTML(memory.type)}</span>
      <p>${escapeHTML(memory.text)}</p>
      <time>${new Date(memory.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</time>
    </article>`).join("") : '<p class="memory-empty">El álbum está esperando su primer recuerdo bonito.<br>Cuida al reporterito y algo aparecerá aquí.</p>';
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
}

/* Mundo, habitación y ciclo horario */
function getTimePeriod(hour = new Date().getHours()) {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "afternoon";
  if (hour >= 19 && hour < 23) return "night";
  return "late";
}

const TIME_PERIOD_INFO = {
  morning: ["☀", "MAÑANA", "El reporterito acaba de despertar."],
  afternoon: ["▣", "TARDE", "El reporterito anda trabajando."],
  night: ["♥", "NOCHE", "El reporterito está extrañando a la Directiva."],
  late: ["☾", "MADRUGADA", "El reporterito está dormido."]
};

function initializeWorld() {
  state.world.roomVisits = (Number(state.world.roomVisits) || 0) + 1;
  applyRoomTheme(state.world.roomTheme || "romantic");
  updateWorldTime(false);
  const today = localDateKey();
  if (state.world.lastDailyGift !== today) {
    state.world.lastDailyGift = today;
    setTimeout(() => grantNextGift("VISITA DIARIA"), 900);
  }
}

function applyRoomTheme(theme) {
  const allowed = ["romantic", "cozy", "berry"];
  state.world.roomTheme = allowed.includes(theme) ? theme : "romantic";
  $("#roomScene").dataset.theme = state.world.roomTheme;
  document.querySelectorAll("[data-room-theme]").forEach(button => button.classList.toggle("active", button.dataset.roomTheme === state.world.roomTheme));
  saveState();
}

function updateWorldTime(announce = true) {
  const previous = state.world.timePeriod;
  const period = getTimePeriod();
  state.world.timePeriod = period;
  $("#roomScene").dataset.time = period;
  $("#roomPeriodIcon").textContent = TIME_PERIOD_INFO[period][0];
  $("#roomPeriodName").textContent = TIME_PERIOD_INFO[period][1];
  if (announce && previous !== period) {
    setMessage(TIME_PERIOD_INFO[period][2]);
    toast(TIME_PERIOD_INFO[period][0], TIME_PERIOD_INFO[period][1], TIME_PERIOD_INFO[period][2]);
    saveState();
  }
}

function updateRoomState(mood) {
  const pet = $("#pet");
  const states = ["happy", "sad", "critical", "sleeping", "phone", "photo", "working", "idle"];
  states.forEach(name => pet.classList.remove(`room-state-${name}`));
  let visual = "idle";
  if (mood === "critico") visual = "critical";
  else if (["triste", "muy-triste", "abrazos"].includes(mood)) visual = "sad";
  else if (mood === "dormido") visual = "sleeping";
  else if (mood === "esperando") visual = "phone";
  else if (["enamorado", "enfermo", "atrevido"].includes(mood)) visual = "photo";
  else if (mood === "feliz") visual = "happy";
  else visual = "working";
  pet.classList.add(`room-state-${visual}`);
  state.world.reporterVisualState = visual;
  if (["sad", "critical"].includes(visual)) setPanchitoVisual("supporting");
  else if (visual === "sleeping") setPanchitoVisual("sleeping");
}

function interactWithRoomObject(object) {
  const messages = {
    window: TIME_PERIOD_INFO[state.world.timePeriod][2],
    photo: "El reporterito volvió a quedarse viendo la foto de la Directiva.",
    bed: "El reporterito acomodó la almohadita donde guarda recuerdos bonitos.",
    desk: "El reporterito intentó trabajar, pero pensó en la Directiva otra vez.",
    plant: "El reporterito regó la planta con la misma paciencia que cuida el Árbol de Amor.",
    phone: "El reporterito abrió el celular esperando un mensajito."
  };
  if (object === "phone") openChat();
  setMessage(messages[object] || "El cuarto guarda un pequeño recuerdo.");
}

/* Panchito */
function initializePanchito() { renderPanchito(); }

function setPanchitoVisual(action) {
  state.panchito.action = action;
  const dog = $("#panchito");
  ["happy", "sleeping", "supporting", "playing"].forEach(name => dog.classList.remove(`is-${name}`));
  if (action !== "idle") dog.classList.add(`is-${action}`);
}

function renderPanchito() {
  $("#panchitoPets").textContent = state.panchito.pets || 0;
  $("#panchitoFeeds").textContent = state.panchito.feeds || 0;
  $("#panchitoPlays").textContent = state.panchito.plays || 0;
  setPanchitoVisual(state.panchito.action || "happy");
}

function handlePanchitoAction(action) {
  const remaining = (panchitoCooldowns[action] || 0) - Date.now();
  if (remaining > 0) {
    setMessage("Panchito sigue procesando tanto cariño y mueve la colita pacientemente.");
    return;
  }
  const actions = {
    pet: { changes: { trust: 2, energy: 1 }, message: "El reporterito acarició a Panchito y se sintió un poquito mejor.", counter: "pets", visual: "happy" },
    feed: { changes: { energy: 2 }, message: "Panchito comió feliz y el reporterito sonrió.", counter: "feeds", visual: "happy" },
    play: { changes: { affection: 2, energy: 2 }, message: "El reporterito jugó con Panchito y recuperó alegría.", counter: "plays", visual: "playing" }
  };
  const data = actions[action];
  if (!data) return;
  changeStats(data.changes); addTreeXP(1);
  state.panchito[data.counter] = (Number(state.panchito[data.counter]) || 0) + 1;
  panchitoCooldowns[action] = Date.now() + 6000;
  setPanchitoVisual(data.visual); renderPanchito();
  setMessage(data.message); burstHearts(5, action === "feed" ? "🍖" : action === "play" ? "🎾" : "♥");
  setTimeout(() => { setPanchitoVisual("happy"); saveState(); }, 1800);
  checkWorldAchievements(); render(); saveState();
}

function cyclePanchitoBehavior() {
  if (isCritical() || average() < 35) setPanchitoVisual("supporting");
  else setPanchitoVisual(randomFrom(["happy", "idle", "sleeping", "happy"]));
  saveState();
}

function showPanchitoEvent() {
  if (document.visibilityState === "hidden" || currentEvent) return;
  const unseen = PANCHITO_EVENTS.filter(event => !state.panchito.eventsSeen.includes(event.id));
  const event = randomFrom(unseen.length ? unseen : PANCHITO_EVENTS);
  if (!state.panchito.eventsSeen.includes(event.id)) state.panchito.eventsSeen.push(event.id);
  changeStats(event.changes); addTreeXP(1);
  if (event.gift) grantGift(event.gift, "HALLAZGO DE PANCHITO");
  if (event.randomGift) grantNextGift("REGALO DE PANCHITO");
  setMessage(`Panchito: ${event.text}`); toast("🐶", "EVENTO DE PANCHITO", event.text);
  $("#panchitoMessage").textContent = event.text;
  addAlbumMemory(`Panchito: ${event.text}`, "PANCHITO", "🐶", `panchito-event-${event.id}`);
  setPanchitoVisual(event.id === "bed" ? "sleeping" : event.id === "support" ? "supporting" : "happy");
  saveState(); render();
}

/* Regalos coleccionables */
function initializeGifts() { renderGifts(); checkWorldAchievements(); }

function grantNextGift(source = "MOMENTO ESPECIAL") {
  const gift = GIFT_DEFINITIONS.find(item => !state.gifts.owned.includes(item.id));
  if (gift) grantGift(gift.id, source);
}

function grantGift(id, source = "MOMENTO ESPECIAL") {
  const gift = GIFT_DEFINITIONS.find(item => item.id === id);
  if (!gift || state.gifts.owned.includes(id)) return false;
  state.gifts.owned.push(id); state.gifts.visible.push(id);
  state.gifts.positions[id] = state.gifts.owned.length - 1;
  addTreeXP(2);
  addAlbumMemory(`El reporterito recibió ${gift.name.toLowerCase()} y lo colocó en su cuarto.`, "REGALO", gift.icon, `gift-${id}`);
  toast(gift.icon, "NUEVO REGALO", `${gift.name} apareció en el cuarto.`);
  renderGifts(); checkWorldAchievements(); saveState();
  return true;
}

function toggleGift(id) {
  if (!state.gifts.owned.includes(id)) return;
  const visible = state.gifts.visible.includes(id);
  state.gifts.visible = visible ? state.gifts.visible.filter(item => item !== id) : [...state.gifts.visible, id];
  renderGifts(); checkWorldAchievements(); saveState();
}

function moveGift(id) {
  if (!state.gifts.owned.includes(id)) return;
  state.gifts.positions[id] = ((Number(state.gifts.positions[id]) || 0) + 1) % 10;
  renderGifts(); saveState();
}

function renderGifts() {
  $("#giftCount").textContent = state.gifts.owned.length;
  $("#giftGrid").innerHTML = GIFT_DEFINITIONS.map(gift => {
    const owned = state.gifts.owned.includes(gift.id), visible = state.gifts.visible.includes(gift.id);
    return `<article class="gift-card ${owned ? "owned" : ""}"><span class="gift-icon">${owned ? gift.icon : "?"}</span><strong>${owned ? gift.name : "Regalo oculto"}</strong><small>${owned ? gift.description : "Todavía no encontrado"}</small><div><button data-gift-toggle="${gift.id}">${visible ? "Guardar" : "Mostrar"}</button><button data-gift-move="${gift.id}">Mover</button></div></article>`;
  }).join("");
  $("#roomGifts").innerHTML = state.gifts.visible.map(id => {
    const gift = GIFT_DEFINITIONS.find(item => item.id === id); if (!gift) return "";
    return `<button class="room-gift pos-${Number(state.gifts.positions[id]) || 0}" data-gift-move="${id}" aria-label="Mover ${gift.name}">${gift.icon}</button>`;
  }).join("");
}

/* Conversaciones tipo visual novel */
function renderNovelProgress() {
  if (!$("#novelCompletedCount")) return;
  $("#novelCompletedCount").textContent = state.novel.totalCompleted || 0;
}

function startNovelScene() {
  const pending = NOVEL_SCENES.filter(scene => !state.novel.completed.includes(scene.id));
  currentNovel = pending.length ? pending[0] : randomFrom(NOVEL_SCENES);
  novelResolved = false;
  $("#novelTitle").textContent = currentNovel.title;
  $("#novelProgress").textContent = `${String(NOVEL_SCENES.indexOf(currentNovel) + 1).padStart(2, "0")}/20`;
  $("#novelSpeaker").textContent = "DIRECTIVA";
  $("#novelText").textContent = currentNovel.initial;
  $("#novelOptions").innerHTML = '<button data-novel-advance="true">Leer la respuesta del reporterito →</button>';
  $("#nextNovelButton").classList.add("hidden");
  renderNovelProgress(); openModal("novelModal");
}

function advanceNovelScene() {
  if (!currentNovel) return;
  $("#novelSpeaker").textContent = "REPORTERITO";
  $("#novelText").textContent = currentNovel.reply;
  $("#novelOptions").innerHTML = currentNovel.options.map((option, index) => `<button data-novel-choice="${index}">${option[0]}</button>`).join("");
}

function chooseNovelOption(index) {
  if (!currentNovel || novelResolved) return;
  const option = currentNovel.options[index]; if (!option) return;
  novelResolved = true;
  changeStats(option[2]); addTreeXP(2);
  state.novel.totalCompleted = (Number(state.novel.totalCompleted) || 0) + 1;
  state.novel.helpedCount = (Number(state.novel.helpedCount) || 0) + 1;
  if (!state.novel.completed.includes(currentNovel.id)) state.novel.completed.push(currentNovel.id);
  state.novel.choices.push({ sceneId: currentNovel.id, choice: option[0], at: Date.now() });
  state.novel.choices = state.novel.choices.slice(-100);
  state.novel.history.push({ sceneId: currentNovel.id, initial: currentNovel.initial, response: option[1], at: Date.now() });
  state.novel.history = state.novel.history.slice(-60);
  if (option[3]) grantGift(option[3], "ESCENA ROMÁNTICA");
  addAlbumMemory(option[1], "ESCENA ROMÁNTICA", "▣", `novel-${currentNovel.id}`);
  $("#novelSpeaker").textContent = "REPORTERITO"; $("#novelText").textContent = option[1];
  $("#novelOptions").innerHTML = ""; $("#nextNovelButton").classList.remove("hidden");
  renderNovelProgress(); checkWorldAchievements(); render(); saveState();
}

function checkWorldAchievements() {
  if ((state.panchito.plays || 0) >= 20) unlock("panchitoFriend");
  if ((state.panchito.pets || 0) >= 50) unlock("happyPanchito");
  if (state.gifts.visible.length >= 10) unlock("cozyRoom");
  if ((state.novel.totalCompleted || 0) >= 25) unlock("confidant");
}

function buildChatInterface() {
  $("#chatCategories").innerHTML = Object.keys(CHAT_CATEGORIES).map(category =>
    `<button data-chat-category="${category}" class="${category === activeChatCategory ? "active" : ""}">${category}</button>`
  ).join("");
  renderChatOptions();
  restoreRecentChat();
  updateChatCounter();
}

function renderChatOptions() {
  $("#chatOptions").innerHTML = CHAT_CATEGORIES[activeChatCategory].map((text, index) =>
    `<button class="chat-option" data-chat-message="${index}">${text}</button>`
  ).join("");
  document.querySelectorAll("[data-chat-category]").forEach(button =>
    button.classList.toggle("active", button.dataset.chatCategory === activeChatCategory)
  );
}

function restoreRecentChat() {
  const area = $("#chatMessages");
  area.innerHTML = '<p class="chat-welcome">CANAL CIFRADO CON AMOR · MENSAJES GUARDADOS</p>';
  (state.chat.recent || []).slice(-6).forEach(item => {
    appendChatBubble("directiva", item.text, false);
    appendChatBubble("reporterito", item.response, false);
  });
  scrollChat();
}

function openChat() {
  restoreRecentChat();
  showChatComposer();
  openModal("chatModal");
}

function appendChatBubble(sender, text, animate = true) {
  const row = document.createElement("div");
  row.className = `chat-bubble-row ${sender}`;
  if (!animate) row.style.animation = "none";
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;
  const time = document.createElement("small");
  time.textContent = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  bubble.appendChild(time);
  if (sender === "reporterito") {
    const avatar = document.createElement("span"); avatar.className = "chat-mini-avatar"; avatar.textContent = "R";
    row.append(avatar, bubble);
  } else row.appendChild(bubble);
  $("#chatMessages").appendChild(row);
  scrollChat();
  return row;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "chat-bubble-row reporterito"; row.id = "typingIndicator";
  row.innerHTML = '<span class="chat-mini-avatar">R</span><div class="chat-bubble typing-bubble">Reporterito está escribiendo <span class="typing-dots"><i></i><i></i><i></i></span></div>';
  $("#chatMessages").appendChild(row); scrollChat();
}

function scrollChat() { const area = $("#chatMessages"); area.scrollTop = area.scrollHeight; }

function pickChatResponse(text) {
  const allMessages = Object.values(CHAT_CATEGORIES).flat();
  const pairedResponse = REPORTER_RESPONSES[allMessages.indexOf(text)];
  const wasRecentlyUsed = state.chat.recent.some(item => item.text === text);
  if (!wasRecentlyUsed) return pairedResponse;
  const recentResponses = state.chat.recent.map(item => item.response);
  const freshAlternatives = REPORTER_RESPONSES.slice(70).filter(response => !recentResponses.includes(response));
  return randomFrom(freshAlternatives.length ? freshAlternatives : REPORTER_RESPONSES.slice(70));
}

function sendChatMessage(index) {
  if (chatBusy) return;
  const text = CHAT_CATEGORIES[activeChatCategory][index];
  if (!text) return;
  const response = pickChatResponse(text);
  chatBusy = true;
  $("#chatComposer").classList.add("hidden");
  $("#anotherMessageButton").classList.add("hidden");
  appendChatBubble("directiva", text);

  state.chat.totalSent++;
  state.counts.messages++;
  if (state.chat.totalSent === 1 || state.chat.totalSent % 10 === 0) {
    addAlbumMemory(`El reporterito guardó el mensaje número ${state.chat.totalSent} del chat.`, "CHAT", "💬", `chat-${state.chat.totalSent}`);
  }
  state.chat.recent.push({ text, response });
  state.chat.recent = state.chat.recent.slice(-10);
  const bonuses = { messages: 2, affection: 1 };
  /* Las categorías especiales sustituyen cariño por otro punto: nunca superan +3 total. */
  if (activeChatCategory === "Ternuritas") { delete bonuses.affection; bonuses.energy = 1; }
  if (activeChatCategory === "Directiva oficial") { delete bonuses.affection; bonuses.trust = 1; }
  changeStats(bonuses);
  addTreeXP(1);
  updateChatCounter(); checkChatAchievements(); render(); saveState();
  showTyping();

  setTimeout(() => {
    $("#typingIndicator")?.remove();
    appendChatBubble("reporterito", response);
    setMessage(response); burstHearts(4, "💬");
    if (Math.random() < .10) beginSpecialConversation();
    else finishChatTurn();
  }, 1000);
}

function beginSpecialConversation() {
  const locked = SPECIAL_CONVERSATIONS.filter(item => !state.chat.unlockedSpecials.includes(item.id));
  pendingSpecial = randomFrom(locked.length ? locked : SPECIAL_CONVERSATIONS);
  const lines = pendingSpecial.trigger.split("\n");
  lines.forEach((line, index) => setTimeout(() => appendChatBubble("reporterito", line), 350 * (index + 1)));
  setTimeout(() => {
    $("#specialReplyOptions").innerHTML = pendingSpecial.options.map((option, index) =>
      `<button data-special-reply="${index}">${option[0]}</button>`
    ).join("");
    $("#specialReplies").classList.remove("hidden");
    scrollChat(); chatBusy = false;
  }, 350 * (lines.length + 1));
}

function answerSpecialConversation(index) {
  if (!pendingSpecial || chatBusy) return;
  const option = pendingSpecial.options[index];
  if (!option) return;
  chatBusy = true;
  appendChatBubble("directiva", option[0]);
  state.chat.totalSent++; state.counts.messages++;
  state.chat.recent.push({ text: option[0], response: "Sistema emocional actualizado: el reporterito guardó esta conversación como recuerdo favorito." });
  state.chat.recent = state.chat.recent.slice(-10);
  changeStats({ messages: 2, ...option[1] });
  addTreeXP(1);
  if (!state.chat.unlockedSpecials.includes(pendingSpecial.id)) {
    state.chat.unlockedSpecials.push(pendingSpecial.id);
    addAlbumMemory("El reporterito desbloqueó una conversación especial y la guardó para siempre.", "CONVERSACIÓN ESPECIAL", "💞", `special-${pendingSpecial.id}`);
    grantNextGift("CONVERSACIÓN ESPECIAL");
  }
  $("#specialReplies").classList.add("hidden");
  showTyping(); updateChatCounter(); checkChatAchievements(); render(); saveState();
  setTimeout(() => {
    $("#typingIndicator")?.remove();
    appendChatBubble("reporterito", "Sistema emocional actualizado: el reporterito guardó esta conversación como recuerdo favorito.");
    pendingSpecial = null; finishChatTurn();
  }, 1000);
}

function finishChatTurn() {
  chatBusy = false;
  $("#anotherMessageButton").classList.remove("hidden");
  scrollChat();
}

function showChatComposer() {
  pendingSpecial = null; chatBusy = false;
  $("#specialReplies").classList.add("hidden");
  $("#anotherMessageButton").classList.add("hidden");
  $("#chatComposer").classList.remove("hidden");
  renderChatOptions();
}

function updateChatCounter() {
  $("#chatCounter").textContent = `${state.chat.totalSent} ${state.chat.totalSent === 1 ? "mensaje enviado" : "mensajes enviados"}`;
}

function checkChatAchievements() {
  if (state.chat.totalSent >= 15) unlock("eternalChat");
  if (state.chat.totalSent >= 50) unlock("lifetimeMessages");
  if (state.chat.totalSent >= 100) unlock("romanticBibles");
  if (state.chat.unlockedSpecials.length >= SPECIAL_CONVERSATIONS.length) unlock("whatsappPremium");
}

function createSky() {
  const sky = $("#skyEffects");
  sky.innerHTML = Array.from({ length: 34 }, (_, i) => `<i class="sky-speck" style="left:${(i * 37) % 100}%;top:${(i * 61) % 100}%;animation-delay:-${i * .17}s">${i % 3 ? "·" : "✦"}</i>`).join("") +
    Array.from({ length: 9 }, (_, i) => `<i class="sky-heart" style="left:${(i * 23 + 4) % 100}%;animation-delay:-${i * 1.1}s">♥</i>`).join("");
}

function determineMood() {
  const s = state.stats;
  const hour = new Date().getHours();
  const redBars = Object.values(s).filter(value => value < 25).length;
  if (isCritical()) return "critico";
  if (Date.now() < state.daringUntil) return "atrevido";
  if (hour >= 22 || hour < 6) return "dormido";
  if (s.affection >= 100) return "enfermo";
  if (redBars >= 3) return "muy-triste";
  if (s.hugs < 25) return "abrazos";
  if (s.messages < 25) return "esperando";
  if (Object.values(s).every(value => value > 80)) return "enamorado";
  const avg = average();
  if (avg >= 60) return "feliz";
  if (avg >= 40) return "tranquilo";
  return "triste";
}

const moodLabel = mood => ({ enamorado: "ENAMORADO", feliz: "FELIZ", tranquilo: "TRANQUILO", triste: "TRISTE", "muy-triste": "MUY TRISTE", abrazos: "NECESITA ABRAZOS", esperando: "ESPERANDO MENSAJE", critico: "MODO CRÍTICO", dormido: "DORMIDO", enfermo: "ENFERMO DE AMOR", atrevido: "MODO ATREVIDO" }[mood]);
const visualMood = mood => mood === "critico" ? "muy-triste" : mood === "abrazos" || mood === "esperando" ? "triste" : mood === "enfermo" ? "enamorado" : mood;

function render(forceMessage = false) {
  Object.entries(state.stats).forEach(([key, value]) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    element.querySelector("b").textContent = `${clamp(value)}%`;
    element.querySelector(".stat-fill").style.width = `${clamp(value)}%`;
    element.classList.toggle("low", value < 30);
    element.classList.toggle("medium", value >= 30 && value < 55);
  });
  const newMood = determineMood();
  if (forceMessage || newMood !== currentMood) setMessage(randomFrom(moodMessages[newMood]));
  currentMood = newMood;
  const viewMood = visualMood(newMood);
  document.body.dataset.mood = viewMood;
  $("#screen").dataset.mood = viewMood;
  $("#statusChip").textContent = moodLabel(newMood);
  $("#loveLevel").textContent = Math.round(average());
  $("#pet").classList.toggle("sad", ["triste", "muy-triste", "abrazos", "esperando", "critico"].includes(newMood));
  $("#pet").classList.toggle("sleepy", newMood === "dormido");
  $("#rewardButton").classList.toggle("hidden", !(state.stats.affection > 90 && state.stats.trust > 80 && !state.rewardOpened));
  updateRoomState(newMood);
  renderPanchito();
  renderWeather(viewMood);
  renderAchievements();
  checkAchievements();
  saveState();
}

function renderWeather(mood) {
  const layer = $("#weatherLayer");
  if (["triste", "muy-triste"].includes(mood)) {
    if (!layer.querySelector(".rain-drop")) layer.innerHTML = Array.from({ length: 15 }, (_, i) => `<i class="rain-drop" style="left:${i * 7}%;animation-delay:-${i * .09}s"></i>`).join("");
  } else if (mood === "dormido") {
    layer.innerHTML = Array.from({ length: 16 }, (_, i) => `<i class="sky-speck" style="left:${(i * 29) % 100}%;top:${(i * 43) % 75}%">✦</i>`).join("");
  } else if (["feliz", "enamorado"].includes(mood)) {
    layer.innerHTML = Array.from({ length: 8 }, (_, i) => `<i class="sky-heart" style="left:${i * 13}%;animation-delay:-${i}s">♥</i>`).join("");
  } else layer.innerHTML = "";
}

function changeStats(changes) {
  Object.entries(changes).forEach(([key, amount]) => state.stats[key] = clamp(state.stats[key] + amount));
}

function isCritical() { return Object.values(state.stats).filter(value => value < 20).length >= 3; }

function applyCareStats(changes) {
  const recoveryBonus = isCritical() ? 1 : 0;
  const adjusted = Object.fromEntries(Object.entries(changes).map(([key, amount]) => [key, amount > 0 ? amount + recoveryBonus : amount]));
  changeStats(adjusted);
}

const actionMap = {
  hug: () => { applyCareStats({ hugs: 5, energy: 2 }); state.counts.hugs++; addTreeXP(1); unlock("firstHug"); if (state.counts.hugs >= 10) unlock("spoiled"); react("El reporterito recibió un abrazo pequeño pero poderoso.", "🫂"); },
  message: () => { applyCareStats({ messages: 4, affection: 1 }); addTreeXP(1); openChat(); },
  love: () => { applyCareStats({ affection: 6, trust: 2 }); addTreeXP(2); unlock("teAmo"); react("El reporterito se puso rojo y guardó cada palabra.", "💘"); },
  piojito: () => { applyCareStats({ affection: 4, hugs: 3, trust: 3 }); state.counts.piojitos++; addTreeXP(1); react("El reporterito recibió piojito y respiró más tranquilo.", "✨"); },
  visit: () => { applyCareStats({ hugs: 10, affection: 8, messages: 6, energy: 8, trust: 6 }); addTreeXP(3); unlock("present"); react("¡LA DIRECTIVA ESTÁ AQUÍ! El reporterito recuperó estabilidad.", "🚪", 18); },
  burger: () => { applyCareStats({ energy: 7, affection: 1 }); addTreeXP(1); unlock("burger"); react("El reporterito recibió hamburguesa y recuperó energía.", "🍔"); },
  reward: openReward
};

function handleAction(action) {
  if (!actionMap[action]) return;
  const remaining = (actionCooldowns[action] || 0) - Date.now();
  if (remaining > 0) {
    setMessage("El reporterito intenta procesar tanto amor, pero su corazoncito pixelado necesita un respiro.");
    toast("⏳", "CORAZONCITO EN PAUSA", `${Math.ceil(remaining / 1000)} segundos para volver a intentarlo.`);
    return;
  }
  actionMap[action]();
  actionCooldowns[action] = Date.now() + 6000;
  updateCooldownButtons();
  render();
}

function updateCooldownButtons() {
  document.querySelectorAll("[data-action]").forEach(button => {
    const remaining = (actionCooldowns[button.dataset.action] || 0) - Date.now();
    button.classList.toggle("cooling", remaining > 0);
    if (remaining > 0) button.dataset.cooldown = `${Math.ceil(remaining / 1000)}s`;
    else delete button.dataset.cooldown;
  });
}

function react(message, icon = "♥", hearts = 7) {
  setMessage(message);
  $("#pet").classList.remove("jump");
  void $("#pet").offsetWidth;
  $("#pet").classList.add("jump");
  $("#screen").classList.add("flash");
  setTimeout(() => $("#screen").classList.remove("flash"), 450);
  burstHearts(hearts, icon);
}

function burstHearts(count = 8, icon = "♥") {
  const box = $("#heartBurst");
  const rect = $("#pet").getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("i");
    heart.className = "burst-heart";
    heart.textContent = icon;
    heart.style.left = `${rect.left + rect.width / 2}px`; heart.style.top = `${rect.top + rect.height / 2}px`;
    heart.style.setProperty("--x", `${(Math.random() - .5) * 260}px`); heart.style.setProperty("--y", `${-60 - Math.random() * 180}px`); heart.style.setProperty("--r", `${(Math.random() - .5) * 90}deg`);
    box.appendChild(heart); setTimeout(() => heart.remove(), 1500);
  }
}

function setMessage(message) {
  const output = $("#moodMessage");
  output.textContent = "";
  let index = 0;
  clearInterval(messageTimer);
  messageTimer = setInterval(() => { output.textContent += message[index++] || ""; if (index >= message.length) clearInterval(messageTimer); }, 15);
}

function unlock(key) {
  if (state.achievements.includes(key)) return;
  state.achievements.push(key);
  const info = achievementInfo[key];
  addAlbumMemory(`Logro desbloqueado: ${info[1]}. ${info[2]}.`, "LOGRO", info[0], `achievement-${key}`);
  toast(info[0], "LOGRO DESBLOQUEADO", info[1]);
  addTreeXP(15);
  if (state.achievements.length % 3 === 0) grantNextGift("LOGRO DESBLOQUEADO");
  renderAchievements();
}

function renderAchievements() {
  document.querySelectorAll("[data-achievement]").forEach(card => card.classList.toggle("unlocked", state.achievements.includes(card.dataset.achievement)));
}

function checkAchievements() {
  if (Object.values(state.stats).every(value => value === 100)) unlock("perfectDay");
  if (Date.now() - state.startedAt > 12 * 60 * 1000) unlock("survivor");
  if (state.counts.thoughts >= 8) unlock("simp");
  if (state.stats.affection > 90 && state.stats.trust > 80) {
    if (!state.highLoveSince) state.highLoveSince = Date.now();
    if (Date.now() - state.highLoveSince > 4 * 60 * 1000) unlock("speedrun");
  } else state.highLoveSince = null;
}

function toast(icon, title, text) {
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = `<span>${icon}</span><div><b>${title}</b><small>${text}</small></div>`;
  $("#toastStack").appendChild(element);
  setTimeout(() => element.remove(), 3700);
}

const events = [
  { icon: "🍽️", title: "Hambre", text: "El reporterito tiene hambre.", choices: [{ label: "Mandar hamburguesa", treeXP: 1, result: () => { changeStats({ energy: 6 }); unlock("burger"); grantGift("specialBurger", "EVENTO DE HAMBRE"); react("El reporterito recibió hamburguesa y recuperó energía.", "🍔"); } }] },
  { icon: "📞", title: "Llamada entrante", text: "El celular del reporterito comenzó a sonar con la llamada más bonita del día.", choices: [{ label: "Contestar", treeXP: 2, result: () => { changeStats({ affection: 7, trust: 4, messages: 3 }); react("El reporterito escuchó su voz y recuperó cariño al instante.", "💞"); } }] },
  { icon: "💌", title: "Carta inesperada", text: "El reporterito encontró una carta inesperada.", choices: [{ label: "Abrir carta", treeXP: 2, result: () => { changeStats({ affection: 5, trust: 3 }); grantGift("letter", "CARTA INESPERADA"); showLetter("Una carta inesperada", "El reporterito leyó la carta, recibió cariño directo al corazón pixelado y se quedó sonriendo durante demasiado tiempo."); } }] },
  { icon: "⚠️", title: "Alerta emocional", text: "El reporterito sintió que algo estaba raro.", choices: [
    { label: "Escuchar con calma", treeXP: 2, result: () => { changeStats({ trust: 6, energy: 2 }); react("El reporterito respiró, escuchó y ganó confianza.", "💚"); } },
    { label: "Ponerse dramático", danger: true, result: () => { changeStats({ trust: -20, affection: -8, energy: -8 }); react("El reporterito se puso intensito y perdió inteligencia emocional.", "💥", 4); } }
  ] },
  { icon: "💋", title: "Bono de besitos", text: "Alerta pixelada: el reporterito encontró un bono extraordinario de amor.", choices: [{ label: "Recibir bono", treeXP: 2, result: () => { changeStats({ affection: 9, hugs: 5, trust: 3 }); react("Sistema emocional actualizado: el reporterito recibió besitos imaginarios y recuperó felicidad.", "💋", 14); } }] }
];

function showRandomEvent() {
  if (currentEvent || document.visibilityState === "hidden" || !$("#chatModal").classList.contains("hidden")) return;
  currentEvent = randomFrom(events);
  $("#eventIcon").textContent = currentEvent.icon;
  $("#eventTitle").textContent = currentEvent.title;
  $("#eventText").textContent = currentEvent.text;
  $("#eventActions").innerHTML = currentEvent.choices.map((choice, index) => `<button data-choice="${index}" class="${choice.danger ? "danger" : ""}">${choice.label}</button>`).join("");
  openModal("eventModal");
}

function resolveEvent(index) {
  if (!currentEvent) return;
  const choice = currentEvent.choices[index];
  closeModal("eventModal");
  currentEvent = null;
  choice.result();
  if (!choice.danger) {
    addTreeXP(choice.treeXP || 0);
    addAlbumMemory("El reporterito resolvió un evento y recuperó un poquito de estabilidad emocional.", "EVENTO SUPERADO", "✦");
    if (Math.random() < .18) grantNextGift("EVENTO ALEATORIO");
  }
  render();
}

function openReward() {
  state.rewardOpened = true;
  applyCareStats({ affection: 5, trust: 4, energy: 4 });
  addTreeXP(3);
  addAlbumMemory("El reporterito desbloqueó besitos ilimitados imaginarios.", "RECOMPENSA SECRETA", "🎁", "secret-reward");
  grantGift("rose", "RECOMPENSA SECRETA");
  showLetter("Recompensa secreta", "El reporterito ha desbloqueado una recompensa secreta: besitos ilimitados imaginarios. Gracias por cuidarlo, quererlo y hacerlo sobrevivir otro día. Este reporterito vive más bonito porque existe usted.");
  burstHearts(20, "♥"); render();
}

function showLetter(title, text) {
  $("#letterTitle").textContent = title; $("#letterText").textContent = text; openModal("letterModal");
}
function openModal(id) { $("#" + id).classList.remove("hidden"); }
function closeModal(id) { $("#" + id).classList.add("hidden"); }

function tapPet() {
  state.petTaps++;
  react(randomFrom(["El reporterito recibió una caricia digital.", "Je. La directiva lo tocó.", "El reporterito intenta mantener la compostura."]), "♥", 3);
  if (state.petTaps >= 7 && state.stats.affection > 70) {
    state.petTaps = 0; state.daringUntil = Date.now() + 25000;
    toast("🚨", "ESTADO RARO", "Modo atrevido desbloqueado");
  }
  render();
}

function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  $("#dayCounter").textContent = `DÍA ${Math.max(1, Math.floor((Date.now() - state.startedAt) / 86400000) + 1)}`;
  updateWorldTime(true);
}

function decay() {
  const hour = new Date().getHours();
  const nighttime = hour >= 22 || hour < 6;
  const baseLoss = nighttime
    ? { hugs: 1, affection: 1, messages: 1, energy: 1, trust: 1 }
    : { hugs: 3, affection: 2, messages: 3, energy: 3, trust: 2 };
  const criticalMultiplier = isCritical() ? 1.25 : 1;
  Object.entries(baseLoss).forEach(([key, loss]) => {
    state.stats[key] = Math.max(0, state.stats[key] - loss * criticalMultiplier);
  });
  decayCycles++;
  if (decayCycles % 3 === 0) {
    const randomStat = randomFrom(Object.keys(state.stats));
    state.stats[randomStat] = Math.max(0, state.stats[randomStat] - 4 * criticalMultiplier);
  }
  render();
}

document.addEventListener("click", event => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) handleAction(actionButton.dataset.action);
  const choiceButton = event.target.closest("[data-choice]");
  if (choiceButton) resolveEvent(Number(choiceButton.dataset.choice));
  const closeButton = event.target.closest("[data-close]");
  if (closeButton) closeModal(closeButton.dataset.close);
  const categoryButton = event.target.closest("[data-chat-category]");
  if (categoryButton && !chatBusy) { activeChatCategory = categoryButton.dataset.chatCategory; renderChatOptions(); }
  const chatMessageButton = event.target.closest("[data-chat-message]");
  if (chatMessageButton) sendChatMessage(Number(chatMessageButton.dataset.chatMessage));
  const specialReplyButton = event.target.closest("[data-special-reply]");
  if (specialReplyButton) answerSpecialConversation(Number(specialReplyButton.dataset.specialReply));
  const worldTarget = event.target.closest("[data-world-target]");
  if (worldTarget) document.getElementById(worldTarget.dataset.worldTarget)?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (event.target.closest('[data-world-action="chat"]')) openChat();
  const roomObject = event.target.closest("[data-room-object]");
  if (roomObject) interactWithRoomObject(roomObject.dataset.roomObject);
  const panchitoAction = event.target.closest("[data-panchito-action]");
  if (panchitoAction) handlePanchitoAction(panchitoAction.dataset.panchitoAction);
  const giftToggle = event.target.closest("[data-gift-toggle]");
  if (giftToggle) toggleGift(giftToggle.dataset.giftToggle);
  const giftMove = event.target.closest("[data-gift-move]");
  if (giftMove) moveGift(giftMove.dataset.giftMove);
  if (event.target.closest("[data-novel-advance]")) advanceNovelScene();
  const novelChoice = event.target.closest("[data-novel-choice]");
  if (novelChoice) chooseNovelOption(Number(novelChoice.dataset.novelChoice));
  const roomTheme = event.target.closest("[data-room-theme]");
  if (roomTheme) applyRoomTheme(roomTheme.dataset.roomTheme);
});

$("#pet").addEventListener("click", tapPet);
$("#sceneAlert")?.addEventListener("click", openPendingEvent);
$("#helpButton").addEventListener("click", () => openModal("helpModal"));
$("#anotherMessageButton").addEventListener("click", showChatComposer);
$("#novelButton").addEventListener("click", () => { closeModal("chatModal"); startNovelScene(); });
$("#nextNovelButton").addEventListener("click", startNovelScene);
$("#panchito").addEventListener("click", () => handlePanchitoAction("pet"));
document.querySelectorAll(".modal-backdrop").forEach(modal => modal.addEventListener("click", event => { if (event.target === modal && modal.id !== "eventModal") closeModal(modal.id); }));
document.addEventListener("keydown", event => { if (event.key === "Escape") document.querySelectorAll(".modal-backdrop:not(.hidden)").forEach(modal => { if (modal.id !== "eventModal") closeModal(modal.id); }); });
window.addEventListener("beforeunload", saveState);



/* === FINAL DEFINITIVO: dificultad, alertas sobre el reporterito, sueño 00-08 y chat contextual === */
const DECAY_INTERVAL_MS = 10000;
let sceneAlertTimer = null;
let sceneAlertDeadline = 0;
let pendingFollowUp = null;

const SLEEP_START = 0;
const SLEEP_END = 8;
const isSleepTime = () => {
  const hour = new Date().getHours();
  return hour >= SLEEP_START && hour < SLEEP_END;
};

function getTimePeriod(hour = new Date().getHours()) {
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "afternoon";
  if (hour >= 19 && hour < 24) return "night";
  return "late";
}

function updateSleepLock() {
  const locked = isSleepTime();
  document.body.classList.toggle("sleep-lock", locked);
  document.querySelectorAll("[data-action], [data-panchito-action], .chat-option, #novelButton, #anotherMessageButton, .special-replies button").forEach(button => {
    button.disabled = locked;
    button.setAttribute("aria-disabled", locked ? "true" : "false");
  });
  if (locked) {
    currentEvent = null;
    clearTimeout(sceneAlertTimer);
    $("#sceneAlert")?.classList.add("hidden");
    closeModal("eventModal");
  }
  let banner = $("#sleepBanner");
  if (locked && !banner) {
    banner = document.createElement("div");
    banner.id = "sleepBanner";
    banner.className = "sleep-banner";
    banner.textContent = "🌙 00:00–08:00 · El reporterito y Panchito están dormidos. Las acciones se desbloquean al despertar.";
    $("#roomScene").appendChild(banner);
  }
  if (!locked && banner) banner.remove();
}

function sleepMessageForNow() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 8) return "Buenas noches, Directiva. El reporterito está dormido soñando con usted y Panchito duerme junto a la cama.";
  if (hour >= 8 && hour < 10) return "Buenos días, Directiva. El reporterito acaba de despertar y Panchito ya está moviendo la colita.";
  return TIME_PERIOD_INFO[getTimePeriod()][2];
}

function determineMood() {
  const s = state.stats;
  const redBars = Object.values(s).filter(value => value < 25).length;
  if (isSleepTime()) return "dormido";
  if (isCritical()) return "critico";
  if (Date.now() < state.daringUntil) return "atrevido";
  if (s.affection >= 100) return "enfermo";
  if (redBars >= 3) return "muy-triste";
  if (s.hugs < 25) return "abrazos";
  if (s.messages < 25) return "esperando";
  if (Object.values(s).every(value => value > 80)) return "enamorado";
  const avg = average();
  if (avg >= 60) return "feliz";
  if (avg >= 40) return "tranquilo";
  return "triste";
}

function updateWorldTime(announce = true) {
  const previous = state.world.timePeriod;
  const period = getTimePeriod();
  state.world.timePeriod = period;
  $("#roomScene").dataset.time = period;
  $("#roomPeriodIcon").textContent = TIME_PERIOD_INFO[period][0];
  $("#roomPeriodName").textContent = TIME_PERIOD_INFO[period][1];
  updateSleepLock();
  if (announce && previous !== period) {
    const msg = sleepMessageForNow();
    setMessage(msg);
    toast(TIME_PERIOD_INFO[period][0], TIME_PERIOD_INFO[period][1], msg);
    addAlbumMemory(msg, period === "late" ? "BUENAS NOCHES" : "BUENOS DÍAS", period === "late" ? "🌙" : "☀");
    saveState();
  }
}

function updateFaceClasses(mood) {
  const pet = $("#pet");
  ["feliz", "enamorado", "triste", "muy-triste", "dormido", "atrevido", "critico"].forEach(name => pet.classList.remove(`mood-${name}`));
  const face = mood === "enfermo" ? "enamorado" : mood === "abrazos" || mood === "esperando" ? "triste" : mood;
  if (["feliz", "enamorado", "triste", "muy-triste", "dormido", "atrevido", "critico"].includes(face)) pet.classList.add(`mood-${face}`);
}

function render(forceMessage = false) {
  Object.entries(state.stats).forEach(([key, value]) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    element.querySelector("b").textContent = `${clamp(value)}%`;
    element.querySelector(".stat-fill").style.width = `${clamp(value)}%`;
    element.classList.toggle("low", value < 30);
    element.classList.toggle("medium", value >= 30 && value < 55);
  });
  const newMood = determineMood();
  if (forceMessage || newMood !== currentMood) setMessage(isSleepTime() ? sleepMessageForNow() : randomFrom(moodMessages[newMood]));
  currentMood = newMood;
  const viewMood = visualMood(newMood);
  document.body.dataset.mood = viewMood;
  $("#screen").dataset.mood = viewMood;
  $("#statusChip").textContent = moodLabel(newMood);
  $("#loveLevel").textContent = Math.round(average());
  $("#pet").classList.toggle("sad", ["triste", "muy-triste", "abrazos", "esperando", "critico"].includes(newMood));
  $("#pet").classList.toggle("sleepy", newMood === "dormido");
  updateFaceClasses(newMood);
  $("#rewardButton").classList.toggle("hidden", !(state.stats.affection > 90 && state.stats.trust > 80 && !state.rewardOpened));
  updateRoomState(newMood);
  renderPanchito();
  renderWeather(viewMood);
  renderAchievements();
  checkAchievements();
  updateSleepLock();
  saveState();
}

function handleAction(action) {
  if (isSleepTime()) {
    setMessage("Shhh... el reporterito está dormido. Puede recibir amor otra vez a partir de las 8:00 AM.");
    return;
  }
  if (!actionMap[action]) return;
  const remaining = (actionCooldowns[action] || 0) - Date.now();
  if (remaining > 0) {
    setMessage("El reporterito intenta procesar tanto amor, pero su corazoncito pixelado necesita un respiro.");
    toast("⏳", "CORAZONCITO EN PAUSA", `${Math.ceil(remaining / 1000)} segundos para volver a intentarlo.`);
    return;
  }
  actionMap[action]();
  actionCooldowns[action] = Date.now() + 7000;
  updateCooldownButtons();
  render();
}

function handlePanchitoAction(action) {
  if (isSleepTime()) {
    setMessage("Panchito también está dormido. Se desbloquea otra vez a las 8:00 AM.");
    return;
  }
  const remaining = (panchitoCooldowns[action] || 0) - Date.now();
  if (remaining > 0) {
    setMessage("Panchito sigue procesando tanto cariño y mueve la colita pacientemente.");
    return;
  }
  const actions = {
    pet: { changes: { trust: 2, energy: 1 }, message: "El reporterito acarició a Panchito y se sintió un poquito mejor.", counter: "pets", visual: "happy" },
    feed: { changes: { energy: 2 }, message: "Panchito comió feliz y el reporterito sonrió.", counter: "feeds", visual: "happy" },
    play: { changes: { affection: 2, energy: 2 }, message: "El reporterito jugó con Panchito y recuperó alegría.", counter: "plays", visual: "playing" }
  };
  const data = actions[action];
  if (!data) return;
  changeStats(data.changes); addTreeXP(1);
  state.panchito[data.counter] = (Number(state.panchito[data.counter]) || 0) + 1;
  panchitoCooldowns[action] = Date.now() + 7000;
  setPanchitoVisual(data.visual); renderPanchito();
  setMessage(data.message); burstHearts(5, action === "feed" ? "🍖" : action === "play" ? "🎾" : "♥");
  setTimeout(() => { setPanchitoVisual("happy"); saveState(); }, 1800);
  checkWorldAchievements(); render(); saveState();
}

function showRandomEvent() {
  if (isSleepTime() || currentEvent || document.visibilityState === "hidden" || !$("#chatModal").classList.contains("hidden")) return;
  currentEvent = randomFrom(events);
  sceneAlertDeadline = Date.now() + 30000;
  const alert = $("#sceneAlert");
  if (!alert) return;
  alert.classList.remove("hidden");
  alert.textContent = "❗";
  alert.title = "Toca para ver qué le pasa al reporterito";
  setMessage("El reporterito tiene algo pasando. Toca el signo ❗ sobre su cabeza para decidir qué hacer.");
  clearTimeout(sceneAlertTimer);
  sceneAlertTimer = setTimeout(autoResolvePendingEvent, 30000);
}

function openPendingEvent() {
  if (!currentEvent) return;
  clearTimeout(sceneAlertTimer);
  $("#sceneAlert")?.classList.add("hidden");
  $("#eventIcon").textContent = currentEvent.icon;
  $("#eventTitle").textContent = currentEvent.title;
  $("#eventText").textContent = currentEvent.text;
  $("#eventActions").innerHTML = currentEvent.choices.map((choice, index) => `<button data-choice="${index}" class="${choice.danger ? "danger" : ""}">${choice.label}</button>`).join("");
  openModal("eventModal");
}

function autoResolvePendingEvent() {
  if (!currentEvent) return;
  const badChoiceIndex = currentEvent.choices.findIndex(choice => choice.danger);
  $("#sceneAlert")?.classList.add("hidden");
  const title = currentEvent.title;
  currentEvent = null;
  changeStats({ affection: -6, messages: -5, trust: -4, energy: -4 });
  addAlbumMemory(`La Directiva no alcanzó a responder la escena: ${title}.`, "ESCENA PERDIDA", "❗");
  setMessage("El reporterito esperó una respuesta, se puso dramático y perdió un poquito de estabilidad emocional.");
  toast("❗", "ESCENA PERDIDA", "El reporterito decidió solito y no le salió muy bien.");
  render();
}

function resolveEvent(index) {
  if (!currentEvent) return;
  clearTimeout(sceneAlertTimer);
  $("#sceneAlert")?.classList.add("hidden");
  const choice = currentEvent.choices[index];
  closeModal("eventModal");
  currentEvent = null;
  choice.result();
  if (!choice.danger) {
    addTreeXP(choice.treeXP || 0);
    addAlbumMemory("La Directiva tomó una decisión y el reporterito sintió que sus acciones importan.", "DECISIÓN DE LA DIRECTIVA", "❗");
    if (Math.random() < .18) grantNextGift("EVENTO ALEATORIO");
  }
  render();
}

function decay() {
  const sleepLossPerTick = 6 / (3600000 / DECAY_INTERVAL_MS);
  const baseLoss = isSleepTime()
    ? { hugs: sleepLossPerTick, affection: sleepLossPerTick, messages: sleepLossPerTick, energy: sleepLossPerTick, trust: sleepLossPerTick, attention: sleepLossPerTick }
    : { hugs: 0.24, affection: 0.18, messages: 0.30, energy: 0.20, trust: 0.14, attention: 0.24 };
  const criticalMultiplier = isCritical() ? 1.08 : 1;
  Object.entries(baseLoss).forEach(([key, loss]) => {
    state.stats[key] = Math.max(0, state.stats[key] - loss * criticalMultiplier);
  });
  decayCycles++;
  if (!isSleepTime() && decayCycles % 6 === 0) {
    const randomStat = randomFrom(Object.keys(state.stats));
    state.stats[randomStat] = Math.max(0, state.stats[randomStat] - 0.6 * criticalMultiplier);
  }
  render();
}

const CONTEXT_RESPONSES = {
  "¿Ya comiste?": [
    "Todavía no, pero prometo comer algo después de este reporte emocional.",
    "Sí, la Directiva puede estar tranquila.",
    "Panchito me está juzgando porque todavía no como.",
    "Estoy considerando seriamente una hamburguesa.",
    "Comí poquito, pero acepto supervisión alimenticia.",
    "Voy a comer, lo prometo por Panchito.",
    "No mucho, pero tu mensaje ya me dio energía.",
    "Ya casi, la Directiva no tiene que preocuparse."
  ],
  "¿Ya tomaste agua?": ["Ya tomé, reporte hidratado entregado.", "Voy por agua ahorita porque la Directiva lo ordenó.", "Panchito me está acompañando al vaso de agua.", "Casi se me olvida, gracias por cuidarme."],
  "¿Cómo te sientes hoy?": ["Te extraño, pero estoy mejor porque apareciste.", "Un poquito cansado, pero con ganas de hablar contigo.", "Sensible, enamorado y necesitando piojito.", "Bien, aunque pensando en ti cada cinco minutos."],
  "¿Dormiste bien?": ["Dormí pensando en ti y eso cuenta como descanso emocional.", "Más o menos, soñé cosas bonitas pero desperté extrañándote.", "Sí, Panchito cuidó la guardia nocturna.", "No tanto, necesito una siesta y un abrazo."],
  "¿Necesitas un abrazo?": ["Sí, de esos que reinician el sistema.", "Necesito uno larguito y sin prisa.", "El reporterito solicita abrazo urgente.", "Sí, pero si trae piojito, mejor."],
  "¿Cómo estuvo tu día?": ["Pesadito, pero quería contártelo.", "Bonito porque pensé en ti mucho.", "Productivo por tres minutos y luego te extrañé.", "Mejoró cuando llegaste al chat."],
  "Te amo muchísimo.": ["Yo también te amo muchísimo, Directiva.", "El reporterito se quedó sin palabras y con ojos de corazón.", "Sistema emocional: amor recibido en cantidad peligrosa.", "Yo más, aunque el sistema diga que no compita."],
  "Te extraño.": ["Yo también te extraño, más de lo recomendado.", "El modo extrañar ya estaba activado desde antes.", "Estoy contando los días para verte.", "Extrañarte ya es parte de mi horario."],
  "Estoy orgullosa de ti.": ["Eso me dio fuerza para todo el día.", "El reporterito guardó ese mensaje para sus días difíciles.", "Me hiciste sentir suficiente.", "Panchito también se emocionó al leer eso."],
  "Buenas noches, reporterito.": ["Buenas noches, Directiva. Voy a soñar bonito con usted.", "El reporterito se duerme abrazando recuerdos bonitos.", "Panchito ya se acomodó y yo también.", "Modo sueño activado: pensando en la Directiva."]
};

const CHAT_FOLLOWUPS = {
  "¿Ya comiste?": [
    ["🍔 Te mando hamburguesa", "El reporterito aceptó oficialmente la hamburguesa emocional.", { energy: 3, affection: 1 }, "specialBurger"],
    ["😠 Ve a comer ahora", "El reporterito obedeció con miedo respetuoso a la Directiva.", { trust: 1, energy: 2 }],
    ["❤️ Cuídate mucho", "El reporterito se sintió cuidado y prometió comer bien.", { affection: 1, trust: 1 }],
    ["😂 Te estoy vigilando", "El reporterito activó modo supervisión alimenticia.", { messages: 1, energy: 1 }]
  ],
  "¿Cómo te sientes hoy?": [
    ["❤️ Dar abrazo", "El reporterito recibió un abrazo y se sintió menos cansado.", { hugs: 3, affection: 1 }],
    ["👂 Escuchar", "El reporterito agradeció sentirse escuchado.", { trust: 2 }],
    ["☕ Dar descanso", "El reporterito bajó los hombritos y respiró.", { energy: 2 }],
    ["🐶 Mandar a Panchito", "Panchito se sentó junto al reporterito como apoyo oficial.", { energy: 1, trust: 1 }]
  ],
  "Te extraño.": [
    ["❤️ Abrazo virtual", "El reporterito abrazó el celular como medida emocional de emergencia.", { hugs: 2, affection: 1 }],
    ["💌 Carta", "El reporterito guardó la carta para leerla cuando extrañe mucho.", { trust: 2 }, "letter"],
    ["📞 Llamarlo", "El reporterito escuchó su voz imaginaria y sonrió.", { messages: 2, affection: 1 }],
    ["📸 Mandar foto", "El reporterito se quedó viendo la foto con cara de enamorado.", { affection: 2 }, "photo"]
  ],
  "Buenas noches, reporterito.": [
    ["🌙 Taparlo", "El reporterito se sintió cuidado antes de dormir.", { trust: 1, energy: 1 }],
    ["💌 Dejar carta", "El reporterito encontrará la carta al despertar.", { affection: 1 }, "letter"],
    ["⭐ Mirar estrellas", "Panchito y el reporterito durmieron bajo una noche bonita.", { energy: 1 }]
  ]
};

function pickChatResponse(text) {
  if (CONTEXT_RESPONSES[text]) return randomFrom(CONTEXT_RESPONSES[text]);
  const allMessages = Object.values(CHAT_CATEGORIES).flat();
  const pairedResponse = REPORTER_RESPONSES[allMessages.indexOf(text)];
  const wasRecentlyUsed = state.chat.recent.some(item => item.response === pairedResponse);
  if (pairedResponse && !wasRecentlyUsed) return pairedResponse;
  const recentResponses = state.chat.recent.map(item => item.response);
  const freshAlternatives = REPORTER_RESPONSES.slice(70).filter(response => !recentResponses.includes(response));
  return randomFrom(freshAlternatives.length ? freshAlternatives : REPORTER_RESPONSES.slice(70));
}

function maybeShowFollowUp(text) {
  const explicit = CHAT_FOLLOWUPS[text];
  if (!explicit && Math.random() > .45) return false;
  const options = explicit || [
    ["❤️ Seguirle la plática", "El reporterito sintió que la Directiva no solo escribió, también se quedó.", { messages: 1, affection: 1 }],
    ["👂 Escucharlo", "El reporterito se sintió acompañado de verdad.", { trust: 1 }],
    ["🫂 Mandar cariño extra", "El reporterito recibió cariño preventivo.", { hugs: 1, affection: 1 }]
  ];
  pendingFollowUp = { options };
  $("#specialReplyOptions").innerHTML = options.map((option, index) => `<button data-special-reply="${index}">${option[0]}</button>`).join("");
  $("#specialReplies").classList.remove("hidden");
  scrollChat();
  return true;
}

function sendChatMessage(index) {
  if (isSleepTime()) { setMessage("El chat está en modo sueño. El reporterito leerá mensajes a partir de las 8:00 AM."); return; }
  if (chatBusy) return;
  const text = CHAT_CATEGORIES[activeChatCategory][index];
  if (!text) return;
  const response = pickChatResponse(text);
  chatBusy = true;
  $("#chatComposer").classList.add("hidden");
  $("#anotherMessageButton").classList.add("hidden");
  appendChatBubble("directiva", text);
  state.chat.totalSent++; state.counts.messages++;
  state.chat.recent.push({ text, response }); state.chat.recent = state.chat.recent.slice(-10);
  const bonuses = { messages: 2, affection: 1 };
  if (activeChatCategory === "Ternuritas") { delete bonuses.affection; bonuses.energy = 1; }
  if (activeChatCategory === "Directiva oficial") { delete bonuses.affection; bonuses.trust = 1; }
  changeStats(bonuses); addTreeXP(1); updateChatCounter(); checkChatAchievements(); render(); saveState(); showTyping();
  setTimeout(() => {
    $("#typingIndicator")?.remove();
    appendChatBubble("reporterito", response);
    setMessage(response); burstHearts(4, "💬");
    if (maybeShowFollowUp(text)) { chatBusy = false; return; }
    if (Math.random() < .10) beginSpecialConversation();
    else finishChatTurn();
  }, 1000);
}

function answerSpecialConversation(index) {
  if (pendingFollowUp) {
    const option = pendingFollowUp.options[index];
    if (!option || chatBusy) return;
    chatBusy = true;
    appendChatBubble("directiva", option[0]);
    changeStats({ messages: 1, ...option[2] });
    if (option[3]) grantGift(option[3], "CHAT CON CONTINUACIÓN");
    addTreeXP(1);
    $("#specialReplies").classList.add("hidden");
    showTyping();
    setTimeout(() => {
      $("#typingIndicator")?.remove();
      appendChatBubble("reporterito", option[1]);
      setMessage(option[1]);
      state.chat.recent.push({ text: option[0], response: option[1] });
      state.chat.recent = state.chat.recent.slice(-10);
      pendingFollowUp = null;
      finishChatTurn();
      render(); saveState();
    }, 850);
    return;
  }
  if (!pendingSpecial || chatBusy) return;
  const option = pendingSpecial.options[index];
  if (!option) return;
  chatBusy = true;
  appendChatBubble("directiva", option[0]);
  state.chat.totalSent++; state.counts.messages++;
  state.chat.recent.push({ text: option[0], response: "Sistema emocional actualizado: el reporterito guardó esta conversación como recuerdo favorito." });
  state.chat.recent = state.chat.recent.slice(-10);
  changeStats({ messages: 2, ...option[1] });
  addTreeXP(1);
  if (!state.chat.unlockedSpecials.includes(pendingSpecial.id)) {
    state.chat.unlockedSpecials.push(pendingSpecial.id);
    addAlbumMemory("El reporterito desbloqueó una conversación especial y la guardó para siempre.", "CONVERSACIÓN ESPECIAL", "💞", `special-${pendingSpecial.id}`);
    grantNextGift("CONVERSACIÓN ESPECIAL");
  }
  $("#specialReplies").classList.add("hidden");
  showTyping(); updateChatCounter(); checkChatAchievements(); render(); saveState();
  setTimeout(() => {
    $("#typingIndicator")?.remove();
    appendChatBubble("reporterito", "Sistema emocional actualizado: el reporterito guardó esta conversación como recuerdo favorito.");
    pendingSpecial = null; finishChatTurn();
  }, 1000);
}

function showChatComposer() {
  pendingSpecial = null; pendingFollowUp = null; chatBusy = false;
  $("#specialReplies").classList.add("hidden");
  $("#anotherMessageButton").classList.add("hidden");
  $("#chatComposer").classList.remove("hidden");
  renderChatOptions(); updateSleepLock();
}

// Barra extra obligatoria de cuidado: Atención.
STAT_INFO.attention = { label: "Atención", icon: "👀" };
if (state.stats.attention === undefined) state.stats.attention = 65;
actionMap.message = () => { applyCareStats({ messages: 4, attention: 2, affection: 1 }); addTreeXP(1); openChat(); };
actionMap.visit = () => { applyCareStats({ hugs: 8, affection: 7, messages: 5, energy: 6, trust: 5, attention: 8 }); addTreeXP(3); unlock("present"); react("¡LA DIRECTIVA ESTÁ AQUÍ! El reporterito recuperó estabilidad.", "🚪", 18); };
actionMap.hug = () => { applyCareStats({ hugs: 5, affection: 2, attention: 1 }); state.counts.hugs++; addTreeXP(1); unlock("firstHug"); if (state.counts.hugs >= 10) unlock("spoiled"); react("El reporterito recibió un abrazo pequeño pero poderoso.", "🫂"); };
actionMap.piojito = () => { applyCareStats({ affection: 4, hugs: 3, trust: 2, attention: 1 }); state.counts.piojitos++; addTreeXP(1); react("El reporterito recibió piojito y respiró más tranquilo.", "✨"); };

buildInterface(); updateClock();
setInterval(updateClock, 30000);
setInterval(decay, DECAY_INTERVAL_MS);
setInterval(updateCooldownButtons, 250);
setInterval(showTreeAmbientMessage, 28000);
setInterval(cyclePanchitoBehavior, 12000);
setTimeout(showPanchitoEvent, 45000);
setInterval(showPanchitoEvent, 90000);
setInterval(() => {
  if (!currentEvent) {
    setMessage(randomFrom(ambientMessages)); state.counts.thoughts++; checkAchievements(); saveState();
  }
}, 24000);
// Las escenas NO se abren solas: cada 5 minutos aparece un ❗ sobre el reporterito.
// La Directiva debe tocarlo para abrir la escena y decidir qué hacer.
setTimeout(showRandomEvent, 300000);
setInterval(showRandomEvent, 300000);


/* Diario del Reporterito: registra acciones, decisiones y pensamientos sin cambiar la mecánica principal. */
const DIARY_THOUGHTS = [
  "El reporterito pensó que la Directiva tiene una forma muy bonita de cuidarlo.",
  "El reporterito guardó mentalmente cada abrazo como si fuera una estampita importante.",
  "Panchito se quedó mirando al reporterito como diciendo: ‘sí la queremos mucho’. ",
  "El reporterito recordó que no necesita estar perfecto para ser querido.",
  "El reporterito anotó que hoy también sobrevivió gracias a la Directiva.",
  "El reporterito pensó en mandar un mensaje larguísimo, pero decidió respirar primero.",
  "Panchito movió la colita cuando vio que la Directiva volvió al juego.",
  "El reporterito se preguntó si la Directiva ya comió y luego se sintió cuidado también.",
  "El reporterito volvió a mirar la foto y sonrió poquito.",
  "El reporterito puso en su diario: ‘hoy me cuidaron bonito’. ",
  "El reporterito cree que la Directiva debería saber que él está orgulloso de ella.",
  "El reporterito escuchó una canción romántica y fingió que no le pegó.",
  "El reporterito dejó una nota mental: pedir más piojito cuando sea posible.",
  "Panchito se acostó cerca del reporterito y el cuarto se sintió menos solito.",
  "El reporterito pensó que algunas personas son hogar, y luego pensó en la Directiva."
];

function ensureDiaryState() {
  if (!state.diary || typeof state.diary !== "object") state.diary = { entries: [], lastThoughtAt: 0 };
  if (!Array.isArray(state.diary.entries)) state.diary.entries = [];
  if (!state.diary.lastThoughtAt) state.diary.lastThoughtAt = 0;
}

function addDiaryEntry(text, type = "DIARIO", icon = "📝") {
  ensureDiaryState();
  const last = state.diary.entries[state.diary.entries.length - 1];
  if (last && last.text === text && Date.now() - last.createdAt < 5000) return;
  state.diary.entries.push({ text, type, icon, createdAt: Date.now() });
  state.diary.entries = state.diary.entries.slice(-120);
  renderDiary();
  saveState();
}

function addReporterThought(manual = false) {
  ensureDiaryState();
  if (!manual && Date.now() - state.diary.lastThoughtAt < 90000) return;
  state.diary.lastThoughtAt = Date.now();
  const thought = randomFrom(DIARY_THOUGHTS);
  addDiaryEntry(thought, "PENSAMIENTO DEL REPORTERITO", "💭");
  if (manual) {
    setMessage(thought);
    toast("💭", "PENSAMIENTO GUARDADO", "El reporterito escribió algo nuevo en su diario.");
  }
}

function renderDiary() {
  ensureDiaryState();
  const list = document.getElementById("diaryList");
  const count = document.getElementById("diaryCount");
  const highlight = document.getElementById("diaryHighlight");
  if (!list || !count || !highlight) return;
  const entries = state.diary.entries.slice().reverse();
  count.textContent = state.diary.entries.length;
  highlight.textContent = entries[0]?.text || "El diario está esperando su primer pensamiento bonito.";
  list.innerHTML = entries.length ? entries.slice(0, 40).map(entry => `
    <article class="diary-entry" data-icon="${escapeHTML(entry.icon)}">
      <b>${escapeHTML(entry.type)}</b>
      <p>${escapeHTML(entry.text)}</p>
      <time>${new Date(entry.createdAt).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
    </article>`).join("") : '<p class="diary-empty">Todavía no hay entradas. Cuando la Directiva cuide al reporterito, él lo va a guardar aquí.</p>';
}

const originalAddAlbumMemoryForDiary = addAlbumMemory;
addAlbumMemory = function(text, type = "RECUERDO", icon = "♥", id = null) {
  originalAddAlbumMemoryForDiary(text, type, icon, id);
  if (!["LOGRO"].includes(type)) addDiaryEntry(text, type, icon);
};

const originalHandleActionForDiary = handleAction;
handleAction = function(action) {
  const labels = { hug: "La Directiva le dio un abrazo al reporterito.", message: "La Directiva abrió el chat para escribirle al reporterito.", love: "La Directiva le dijo te amo al reporterito.", piojito: "La Directiva le dio piojito al reporterito.", visit: "La Directiva visitó al reporterito y el cuarto se sintió vivo.", burger: "La Directiva mandó hamburguesa para salvar la energía emocional.", reward: "La Directiva abrió una recompensa secreta." };
  originalHandleActionForDiary(action);
  if (labels[action]) addDiaryEntry(labels[action], "ACCIÓN DE LA DIRECTIVA", "❤️");
};

const originalResolveEventForDiary = resolveEvent;
resolveEvent = function(index) {
  const eventTitle = currentEvent?.title || "Escena";
  const choiceLabel = currentEvent?.choices?.[index]?.label || "una decisión";
  originalResolveEventForDiary(index);
  addDiaryEntry(`En “${eventTitle}”, la Directiva eligió: ${choiceLabel}.`, "DECISIÓN", "❗");
};

const originalSendChatMessageForDiary = sendChatMessage;
sendChatMessage = function(index) {
  const text = CHAT_CATEGORIES[activeChatCategory]?.[index];
  originalSendChatMessageForDiary(index);
  if (text) addDiaryEntry(`La Directiva escribió en el chat: “${text}”`, "CHAT", "💬");
};

const originalAnswerSpecialForDiary = answerSpecialConversation;
answerSpecialConversation = function(index) {
  const label = pendingFollowUp?.options?.[index]?.[0] || pendingSpecial?.options?.[index]?.[0];
  originalAnswerSpecialForDiary(index);
  if (label) addDiaryEntry(`La Directiva continuó la conversación con: “${label}”`, "CHAT CON CONTINUACIÓN", "💞");
};

const originalPanchitoActionForDiary = handlePanchitoAction;
handlePanchitoAction = function(action) {
  const labels = { pet: "La Directiva acarició a Panchito.", feed: "La Directiva le dio comida a Panchito.", play: "La Directiva jugó con Panchito." };
  originalPanchitoActionForDiary(action);
  if (labels[action]) addDiaryEntry(labels[action], "PANCHITO", "🐶");
};

const originalNovelChoiceForDiary = chooseNovelOption;
chooseNovelOption = function(index) {
  const sceneTitle = currentNovel?.title || "Escena romántica";
  const choiceLabel = currentNovel?.options?.[index]?.[0] || "una respuesta";
  originalNovelChoiceForDiary(index);
  addDiaryEntry(`En la escena “${sceneTitle}”, la Directiva eligió: ${choiceLabel}.`, "ESCENA ROMÁNTICA", "▣");
};

ensureDiaryState();
renderDiary();
document.getElementById("diaryThoughtButton")?.addEventListener("click", () => addReporterThought(true));
setInterval(() => addReporterThought(false), 150000);
setTimeout(() => addDiaryEntry("El reporterito abrió su diario y revisó que todo siguiera guardado para la Directiva.", "DIARIO", "📝"), 1200);
