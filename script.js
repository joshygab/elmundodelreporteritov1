/* Tamagotchi del Reporterito — juego local, sin dependencias. */

const STORAGE_KEY = "reporterito-save-v1";
const WINDOW_SAVE_PREFIX = "REPORTERITO_SAVE::";
const STAT_INFO = {
  affection: { label: "Cariño", icon: "💗" },
  attention: { label: "Atención", icon: "✦" },
  messages: { label: "Mensajes", icon: "💬" },
  energy: { label: "Energía emocional", icon: "⚡" },
  trust: { label: "Confianza", icon: "🔐" },
  hugs: { label: "Abrazos", icon: "🫂" }
};

const DEFAULT_STATE = {
  stats: { hugs: 68, affection: 72, attention: 65, messages: 61, energy: 66, trust: 74 },
  achievements: [], counts: { hugs: 0, messages: 0, piojitos: 0, thoughts: 0 },
  chat: { totalSent: 0, recent: [], unlockedSpecials: [] },
  tree: { loveTreeXP: 0, loveTreeLevel: 1, stage: "Semillita", memories: [] },
  album: { memories: [], streak: 1, lastPlayedDate: "" },
  world: { timePeriod: "morning", roomTheme: "romantic", reporterVisualState: "idle", roomVisits: 0, lastDailyGift: "" },
  panchito: { mood: "happy", action: "idle", pets: 0, feeds: 0, plays: 0, eventsSeen: [], hunger: 75, energy: 72, happiness: 78, mischief: 12, friendship: 65 },
  directiva: { present: false, mood: "calm", activity: "visit", lastVisitAt: 0, nextVisitAt: 0, stats: { affection: 78, happiness: 76, energy: 72, hunger: 70, stress: 24, mood: 82, trust: 74 }, messages: [], dates: [], sharedMemories: [] },
  gifts: { owned: [], visible: [], positions: {} },
  novel: { completed: [], choices: [], totalCompleted: 0, helpedCount: 0, history: [] },
  economy: { coins: 0, totalEarned: 0, unlockedOutfits: ["classic"], equippedOutfit: "classic", awardedLevels: [1], ownedItems: [], giftsForDirectiva: 0 },
  simulation: { happiness: 70, hunger: 75, motivation: 66, fun: 64, prestige: 10, officeLevel: 1, lastAutonomyAt: Date.now(), autonomousActions: 0, workSessions: 0, lettersWritten: 0, extremeSince: 0, hungerZeroSince: 0, currentActivity: null },
  eventEngine: { pending: null, nextAt: 0, history: [], decisions: [], seenIds: [], rarityCounts: {}, traits: { support:0, avoidance:0, flowers:0, generosity:0, courage:0, humor:0, panchoCare:0 }, unlockedMythics: [], totalResolved: 0 },
  timeline: [],
  minigames: { played: 0, wins: 0, bestScores: {} },
  life: { mood: "happy", moodExpiresAt: 0, weather: "beautiful", weatherDate: "", recentThoughts: [], recentScenes: [], scenesSeen: [], sceneChoices: [], letters: [], dreams: [], lastDreamDate: "", dreamShownDate: "", dailyVisits: 0, visitDates: [], lastVisitAt: 0, journal: [], roomInteractions: 0, criticalRecoveries: 0, firstMemories: {}, lastImportant: {}, pendingScene: null, aliveSince: Date.now(), isDead: false, deathAt: 0, deathCount: 0, lastAliveDays: 0, lastOfflineHours: 0, totalOfflinePenalty: 0, deathSummary: null },
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
  confidant: ["🫶", "Confidente", "El reporterito siente que puede contarle todo a la Directiva"],
  firstWorldVisit: ["🚪", "Primera visita al mundo", "El reporterito notó que la Directiva entró a su pequeño mundo"],
  livingRoom: ["🛏", "Cuarto vivo", "La Directiva exploró los rincones del cuarto del reporterito"],
  constantDirector: ["📅", "Directiva constante", "El reporterito recibió visitas durante siete días distintos"],
  fullDiary: ["📓", "Diario lleno", "El diario guardó cincuenta momentos del reporterito"],
  romanticCollector: ["🎁", "Coleccionista romántica", "Los quince regalos encontraron un lugar en el mundo"],
  starryNight: ["🌙", "Noche de estrellas", "La Directiva visitó el cuarto durante la madrugada"],
  prettyMorning: ["☀", "Mañana bonita", "El reporterito empezó la mañana acompañado"],
  savedReporter: ["🛟", "Reporterito salvado", "El reporterito salió del modo crítico gracias al cuidado recibido"],
  growingWorld: ["🌎", "Mundo en crecimiento", "El cuarto, los recuerdos y el Árbol de Amor comenzaron a florecer"],
  hundredHugs: ["🫂", "Cien abrazos", "El reporterito recibió cien abrazos durante su vida"],
  infiniteLove: ["💞", "Amor infinito", "El amor se mantuvo peligrosamente alto"],
  bestDirector: ["👑", "Mejor Directiva del mundo", "El reporterito construyó una historia llena de apoyo"],
  supremeDirector: ["🏢", "Director supremo", "La oficina alcanzó su forma legendaria"],
  eventExplorer: ["❗", "Vida inesperada", "Cincuenta decisiones cambiaron la historia"],
  mythHunter: ["🌌", "Imposible pero cierto", "El reporterito vivió un evento mítico"],
  gameMaster: ["🎮", "Recreo legendario", "La Directiva ganó veinte minijuegos"]
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
  muerto: ["El reporterito se quedó sin vida y el mundo deberá comenzar completamente desde cero."],
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
  { id: "balloon", icon: "🎈", name: "Globo", description: "Nunca termina de desinflarse porque es pixelado." },
  { id: "dogCollar", icon: "🦴", name: "Collar de Panchito", description: "Panchito camina orgulloso cuando lo usa." },
  { id: "hugPillow", icon: "🛏", name: "Almohada de abrazos", description: "Sustituto temporal para días de extrañar." },
  { id: "moonLamp", icon: "🌙", name: "Lámpara de luna", description: "Ilumina suavemente las madrugadas." },
  { id: "memoryFrame", icon: "🖼", name: "Marco de recuerdo", description: "Protege uno de los momentos favoritos." },
  { id: "specialPlant", icon: "🪴", name: "Planta especial", description: "Creció con paciencia y conversaciones bonitas." }
];

const OUTFIT_DEFINITIONS = [
  { id:"classic", icon:"👔", name:"Reportero clásico", description:"La ropa con la que empezó todo.", cost:0, color:"#e8e5d5" },
  { id:"sweater", icon:"🩷", name:"Suéter rosita", description:"Calientito y peligrosamente tierno.", cost:35, color:"#d9658f" },
  { id:"hoodie", icon:"💜", name:"Sudadera morada", description:"Para tardes de trabajo y piojito.", cost:60, color:"#7650a1" },
  { id:"suit", icon:"🕴", name:"Traje de gala", description:"El reporterito se siente muy importante.", cost:90, color:"#282a35" },
  { id:"pajamas", icon:"🌙", name:"Pijama pixelada", description:"Uniforme oficial para soñar bonito.", cost:120, color:"#7ca0b9" },
  { id:"press", icon:"📰", name:"Chaleco de prensa", description:"Listo para una cobertura romántica.", cost:160, color:"#8d354a" },
  { id:"legendary", icon:"✨", name:"Atuendo legendario", description:"Tejido con hojas del Árbol de Amor.", cost:250, color:"#e0ad4f" },
  { id:"spider", icon:"🕸", name:"Disfraz arácnido", description:"Héroe rojo para coberturas imposibles.", cost:180, color:"#c92f45" },
  { id:"flash", icon:"⚡", name:"Disfraz velocista", description:"Llega antes que cualquier noticia.", cost:180, color:"#d63b32" },
  { id:"bat", icon:"🦇", name:"Disfraz nocturno", description:"Periodismo desde las sombras.", cost:190, color:"#27283a" },
  { id:"super", icon:"🦸", name:"Disfraz superreportero", description:"Capa roja y confianza de acero.", cost:200, color:"#3264a8" },
  { id:"dj", icon:"🎧", name:"Disfraz de DJ", description:"Mezcla canciones para la Directiva.", cost:145, color:"#8147a8" },
  { id:"football", icon:"⚽", name:"Futbolista", description:"Uniforme para reportar desde la cancha.", cost:130, color:"#3b8a62" },
  { id:"director", icon:"💼", name:"Director general", description:"El traje del jefe máximo del amor.", cost:260, color:"#33323c" },
  { id:"baseball", icon:"⚾", name:"Beisbolista", description:"Gorra, uniforme y jonrón emocional.", cost:140, color:"#eee7d9" }
];

const LIFE_STAT_INFO = {
  love:{icon:"❤️",label:"Amor"}, happiness:{icon:"😊",label:"Felicidad"}, energy:{icon:"⚡",label:"Energía"}, hunger:{icon:"🍔",label:"Hambre"},
  motivation:{icon:"🧠",label:"Motivación"}, pancho:{icon:"🐶",label:"Amistad Pancho"}, prestige:{icon:"🏢",label:"Prestigio"}, trust:{icon:"🌟",label:"Confianza"}, fun:{icon:"😂",label:"Diversión"}
};

const LIFE_STORE_ITEMS = [
  {id:"plantDecor",icon:"🪴",name:"Planta de oficina",cost:28,type:"decor"},{id:"romanticFrame",icon:"🖼",name:"Cuadro romántico",cost:35,type:"decor"},
  {id:"panchoToy",icon:"🎾",name:"Juguete de Pancho",cost:24,type:"pancho"},{id:"panchoBed",icon:"🧺",name:"Cama de Pancho",cost:48,type:"pancho"},
  {id:"deskTeddy",icon:"🧸",name:"Peluche de escritorio",cost:32,type:"decor"},{id:"moonLight",icon:"🌙",name:"Lámpara lunar",cost:55,type:"decor"},
  {id:"giftBurger",icon:"🍔",name:"Hamburguesa regalo",cost:12,type:"gift"},{id:"giftCoffee",icon:"☕",name:"Café regalo",cost:9,type:"gift"},
  {id:"giftFlower",icon:"🌹",name:"Flor regalo",cost:16,type:"gift"},{id:"giftLetter",icon:"💌",name:"Carta bonita",cost:8,type:"gift"},
  {id:"giftKiss",icon:"💋",name:"Besitos pixelados",cost:6,type:"gift"},{id:"premiumDesk",icon:"🖥",name:"Escritorio premium",cost:90,type:"decor"}
];

/* Motor modular de eventos: 720 semillas producen miles de variaciones narrativas. */
const EVENT_CONTENT_COUNTS = { common:300, romantic:150, pancho:100, rare:100, legendary:50, mythical:20 };
const EVENT_RARITIES = {
  common:{label:"COMÚN",weight:610,icon:"☕"}, romantic:{label:"ROMÁNTICO",weight:225,icon:"💗"}, pancho:{label:"PANCHO",weight:105,icon:"🐶"},
  rare:{label:"RARO",weight:45,icon:"💎"}, legendary:{label:"LEGENDARIO",weight:13,icon:"🏆"}, mythical:{label:"MÍTICO",weight:2,icon:"🌌"}
};
const EVENT_BANKS = {
  common:{titles:["Una pausa inesperada","Decisión de oficina","La tarde cambió","Un pendiente pequeño","Momento cotidiano"],situations:["El reporterito encontró tiempo para {activity} en {place}.","Mientras intentaba {activity}, algo llamó su atención: {object}.","El reporterito debía decidir qué hacer con {object} antes de seguir trabajando."],icons:["☕","🧹","📚","🎵","🌤"]},
  romantic:{titles:["Un asunto del corazón","Mensaje que cambió el día","Ataque de ternura","La Directiva apareció en sus pensamientos","Celos de oficina"],situations:["La Directiva {romance}. El reporterito sintió que el corazón le iba demasiado rápido.","Mientras miraba {object}, el reporterito recordó que la Directiva {romance}.","En {place}, el reporterito quiso responder después de que la Directiva {romance}."],icons:["💗","🌹","💌","📱","🥺"]},
  pancho:{titles:["Pancho anda sospechoso","Travesura con manchas cafés","Operativo Pancho","Una pista de patitas","Pancho tomó una decisión"],situations:["Pancho {panchoAction} cerca de {place} y ahora mira al reporterito como si nada.","El reporterito descubrió que Pancho {panchoAction} usando {object}.","Pancho quiere atención después de que {panchoAction}."],icons:["🐶","🐾","🦴","🎾","🍔"]},
  rare:{titles:["Hallazgo improbable","Algo que estaba perdido","Una coincidencia extraña","El cajón secreto","Señal inesperada"],situations:["El reporterito encontró {rareFind} escondido junto a {object}.","En {place} apareció {rareFind} con una nota sin firma.","Un recuerdo olvidado condujo al reporterito hasta {rareFind}."],icons:["💎","🔎","📜","🌹","🗝"]},
  legendary:{titles:["El día dio un giro legendario","Momento para recordar siempre","La visita imposible","Una historia digna del álbum","El gran día"],situations:["La Directiva apareció de sorpresa en {place} y Pancho comenzó a correr de felicidad.","El reporterito consiguió {legendaryThing} después de recordar todo el apoyo recibido.","Un aniversario imaginario convirtió {object} en un recuerdo legendario."],icons:["🏆","✨","🌠","👑","💞"]},
  mythical:{titles:["Amor infinito","Pancho CEO","Director Supremo","Abrazo cósmico","La rosa eterna","El día donde todo sale bien","Sueño compartido","La foto perfecta"],situations:["El mundo pixelado se detuvo: {mythicThing} apareció frente al reporterito.","Durante un instante imposible, {mythicThing} conectó todos los recuerdos de esta vida.","Pancho ladró hacia las estrellas cuando {mythicThing} se volvió real."],icons:["🌌","♾️","🌹","🪐","👑"]}
};
const EVENT_WORDS = {
  activities:["tomar café","leer una noticia","ordenar el cuarto","escribir una carta","escuchar música","mirar las estrellas","preparar una hamburguesa","revisar fotografías"],
  places:["el escritorio","la ventana","la oficina","la cocina pixelada","el rincón de Pancho","el Árbol de Amor","la cama","el archivo de recuerdos"],
  objects:["una fotografía","una flor","una taza de café","una carta doblada","un juguete de Pancho","una moneda brillante","un recorte de periódico","una hamburguesa sospechosa"],
  romances:["tardó un poco en responder","subió una selfie muy bonita","dijo ‘te extraño’","dijo ‘te amo’","tuvo un día difícil","quiere una cita","contó un sueño bonito","apareció inesperadamente"],
  panchoActions:["robó una hamburguesa","escondió una carta","encontró unas monedas","rompió una maceta","trajo una flor","desenterró un regalo","se sentó frente al celular","ladró porque quiere atención"],
  rareFinds:["una foto olvidada","una carta misteriosa","dinero inesperado","una rosa única","un recuerdo perdido","una llave diminuta"],
  legendaryThings:["la carta perfecta","un tesoro de Pancho","un viaje imaginario","la oficina de sus sueños","un día perfecto"],
  mythicThings:["un abrazo cósmico","la rosa eterna","la carta legendaria","un sueño compartido","la foto perfecta","Pancho CEO","el amor infinito"]
};
const DECISION_ARCHETYPES = {
  supportive:{label:"💬 Hablar con honestidad",result:"El reporterito eligió hablar y la relación se volvió un poquito más fuerte.",effects:{love:4,trust:3,motivation:-2},trait:"support"},
  playful:{label:"😂 Convertirlo en una broma",result:"El reporterito hizo reír a todos, aunque dejó una parte del problema pendiente.",effects:{fun:5,happiness:3,prestige:-2},trait:"humor"},
  practical:{label:"🧠 Resolverlo con calma",result:"El reporterito encontró una solución razonable, pero terminó algo cansado.",effects:{motivation:4,prestige:3,energy:-3},trait:"courage"},
  generous:{label:"🎁 Gastar en un detalle",result:"El detalle creó un recuerdo bonito y dejó la cartera un poco más ligera.",effects:{love:5,happiness:3,money:-8},trait:"generosity",memory:true},
  avoidant:{label:"😎 Fingir que no importa",result:"El reporterito siguió adelante, aunque el corazón guardó una pequeña duda.",effects:{motivation:3,trust:-4,love:-2},trait:"avoidance"},
  pancho:{label:"🐾 Incluir a Pancho",result:"Pancho movió la cola y convirtió el problema en una aventura.",effects:{pancho:5,fun:3,energy:-2},trait:"panchoCare"},
  flower:{label:"🌹 Comprar una flor",result:"La flor quedó como recuerdo, pero costó algunas monedas.",effects:{love:6,memories:1,money:-10},trait:"flowers",memory:true},
  work:{label:"🏢 Concentrarse en el trabajo",result:"El reporterito avanzó profesionalmente y dejó el descanso para después.",effects:{prestige:5,money:7,happiness:-3,energy:-3},trait:"courage"},
  rest:{label:"😴 Tomarse un descanso",result:"El reporterito recuperó fuerzas, aunque perdió un poco de ritmo.",effects:{energy:6,happiness:2,motivation:-3,prestige:-1},trait:"support"}
};

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

const LIFE_MOODS = {
  happy: { icon:"😊", name:"Feliz", hours:[3,8], messages:["El reporterito amaneció de buenas.","Hoy el reporterito tiene energía extra.","El reporterito no puede dejar de sonreír."], visual:"happy" },
  inLove: { icon:"❤️", name:"Enamorado", hours:[4,12], messages:["Hoy el reporterito está peligrosamente enamorado.","El reporterito sigue pensando en la Directiva.","El reporterito está viendo fotos otra vez."], visual:"photo" },
  tired: { icon:"😴", name:"Cansado", hours:[2,6], messages:["El reporterito no durmió tan bien.","Hoy el reporterito anda lento.","El reporterito necesita una siesta."], visual:"sleeping" },
  sensitive: { icon:"🥺", name:"Sensible", hours:[2,7], messages:["Hoy el reporterito está más sentimental.","El reporterito necesita un poquito más de cariño.","El reporterito se emocionó por cosas pequeñas."], visual:"sad" },
  thoughtful: { icon:"🤔", name:"Pensativo", hours:[3,9], messages:["El reporterito está reflexionando.","Hoy el reporterito anda muy pensativo.","El reporterito se quedó viendo por la ventana."], visual:"working" },
  inspired: { icon:"🎵", name:"Inspirado", hours:[4,10], messages:["Hoy el reporterito tiene ideas.","El reporterito despertó inspirado.","El reporterito quiere crear cosas bonitas."], visual:"working" },
  needsAttention: { icon:"🫂", name:"Necesita atención", hours:[2,5], messages:["Hoy el reporterito quiere pasar tiempo con la Directiva.","El reporterito necesita compañía.","El reporterito está esperando interacción."], visual:"phone" },
  nostalgic: { icon:"🌧️", name:"Nostálgico", hours:[3,8], messages:["Hoy el reporterito está recordando momentos bonitos.","El reporterito encontró recuerdos.","El reporterito se puso sentimental."], visual:"photo" },
  confident: { icon:"😎", name:"Presumido", hours:[2,6], messages:["Hoy el reporterito se siente muy guapo.","El reporterito cree que se ve bien en 8 bits.","El reporterito anda con confianza."], visual:"happy" },
  panchitoMode: { icon:"🐶", name:"Modo Panchito", hours:[2,5], messages:["Panchito y el reporterito están inseparables.","Hoy el reporterito quiere pasar tiempo con Panchito.","Panchito decidió acompañarlo todo el día."], visual:"panchito" }
};

const HEART_WEATHERS = {
  beautiful:{icon:"☀️",name:"Día bonito"}, romantic:{icon:"🌸",name:"Día romántico"}, sensitive:{icon:"🌧️",name:"Día sensible"}, special:{icon:"⭐",name:"Día especial"}, calm:{icon:"🌙",name:"Día tranquilo"}
};

const THOUGHT_OPENINGS = [
  "El reporterito se pregunta si la Directiva ya comió", "El reporterito está orgulloso de la Directiva", "El reporterito quiere darle un abrazo", "El reporterito cree que Panchito la extraña también", "El reporterito sigue pensando que la Directiva es muy bonita", "El reporterito quiere contarle algo cuando llegue", "El reporterito está feliz porque la Directiva volvió", "El reporterito miró el celular y pensó en ella", "El reporterito encontró una canción que le recuerda a la Directiva", "El reporterito imaginó una cita improvisada", "El reporterito guardó una sonrisa para cuando ella vuelva", "El reporterito espera que la Directiva esté teniendo un día bonito", "El reporterito recordó una conversación importante", "El reporterito quiere presumir a la Directiva otra vez", "El reporterito pensó que su mundo es mejor cuando ella entra"
];
const THOUGHT_ENDINGS = [
  "y sonrió bajito.", "mientras Panchito movía la cola.", "antes de volver a mirar la ventana.", "y lo guardó como pensamiento favorito.", "aunque intentó concentrarse durante tres minutos.", "mientras el Árbol de Amor movía una hojita.", "y sintió calorcito en el corazón pixelado.", "porque algunas cosas bonitas aparecen sin avisar.", "y decidió escribirlo en su memoria interna.", "mientras esperaba una notificación real."
];
const REPORTER_THOUGHTS = THOUGHT_OPENINGS.flatMap(opening => THOUGHT_ENDINGS.map(ending => `${opening} ${ending}`));

const LETTER_OPENINGS = [
  "Hoy Panchito se quedó dormido junto a mí", "El reporterito tuvo un día raro", "El árbol movió una rama cuando pensé en ti", "Encontré una foto que no recordaba", "Hoy el cuarto se sintió demasiado silencioso", "Panchito llevó su pelota hasta el escritorio", "Escuché una canción que parecía hablar de nosotros", "Me senté un rato junto a la ventana", "Guardé uno de tus mensajes en mi memoria", "Hoy intenté ser productivo y casi lo logro"
];
const LETTER_ENDINGS = [
  "y pensé que habría sido bonito que estuvieras aquí.", "pero recordar algo bonito de la Directiva arregló un poquito el día.", "y confirmé que sigo guardando cada palabra bonita que recibo.", "mientras imaginaba el próximo abrazo pendiente.", "y quise agradecer que este pequeño mundo también sea tuyo."
];
const SPONTANEOUS_LETTERS = LETTER_OPENINGS.flatMap(opening => LETTER_ENDINGS.map(ending => `${opening} ${ending}`));

const DREAM_PLACES = ["caminaba con la Directiva","Panchito perseguía estrellas","el Árbol estaba lleno de corazones","la Directiva visitaba el jardín","el cuarto flotaba entre nubes rosas","encontraban una cafetería diminuta","todos los regalos empezaban a brillar","la luna entraba por la ventana"];
const DREAM_ENDINGS = ["y nadie tenía prisa.","mientras sonaba una canción bonita.","y Panchito cuidaba el camino.","antes de despertar con una sonrisa.","y el corazón pixelado se sentía en casa."];
const REPORTER_DREAMS = DREAM_PLACES.flatMap(place => DREAM_ENDINGS.map(ending => `El reporterito soñó que ${place} ${ending}`));

const SCENE_OPTION_SETS = [
  [["Escucharlo","El reporterito se sintió acompañado.",{trust:2,attention:2}],["Dar piojito","El reporterito activó modo paz absoluta.",{affection:2,energy:1}],["Mandar mensaje bonito","El reporterito sonrió al leerlo.",{messages:2,affection:1}]],
  [["Sentarse con él","El reporterito agradeció la compañía silenciosa.",{attention:3}],["Dar abrazo","El reporterito respiró dentro del abrazo.",{hugs:3}],["Preguntar cómo está","El reporterito sintió que importaba.",{trust:2,attention:1}]],
  [["Dejarlo descansar","El reporterito cerró los ojos unos minutos.",{energy:3}],["Llevarle agua","El reporterito prometió cuidarse mejor.",{energy:2,trust:1}],["Compartir el momento","El reporterito dejó de sentirse solo.",{affection:1,attention:2}]],
  [["Jugar con Panchito","Panchito provocó una sonrisa de emergencia.",{energy:2,affection:1}],["Acariciar a Panchito","El reporterito y Panchito entraron en calma.",{trust:2}],["Tomar una foto","El momento quedó guardado para siempre.",{affection:2},null,true]],
  [["Hablar con calma","El reporterito recuperó seguridad.",{trust:3}],["Decir algo bonito","El reporterito recibió cariño directo al corazón.",{affection:3}],["Quedarse un ratito","El reporterito recuperó atención emocional.",{attention:3}]],
  [["Mirar el recuerdo","El reporterito sonrió recordando aquel momento.",{affection:2,trust:1}],["Guardarlo en el diario","El sistema protegió el recuerdo.",{attention:2},null,true],["Contarle a Panchito","Panchito escuchó el informe completo.",{energy:1,trust:1}]]
];

function createScene(id, category, icon, title, text, visual, optionIndex, extra = {}) {
  return { id, category, icon, title, text, visual, options: SCENE_OPTION_SETS[optionIndex % SCENE_OPTION_SETS.length], ...extra };
}

const TIME_SCENE_SEEDS = {
  morning:["Primer bostezo","Buscando el celular","Panchito quiere jugar","Luz en la ventana","La planta tiene sed","Desayuno pendiente","Una canción mañanera","Cama sin tender","El primer mensaje","Una idea temprana","Panchito trae energía","El cuarto despierta"],
  afternoon:["Mucho trabajo","Distracción romántica","Siesta de Panchito","Celular entre tareas","Hambre de reportero","Pausa necesaria","Escritorio desordenado","Una nota pendiente","La planta observa","Tarde productiva","Ventana luminosa","Cinco minutos de descanso"],
  night:["Modo extrañar","Canciones románticas","La foto en el marco","Panchito se acerca","Charla antes de dormir","Luz cálida","Un mensaje pendiente","La cena imaginaria","El árbol al anochecer","Recuerdos en la cama","Silencio acompañado","Una estrella visible"],
  late:["Sueño pixelado","Soñando con abrazos","Panchito junto a la cama","Luna en el cuarto","El árbol brilla","Una vuelta en sueños","La ventana estrellada","Todo está tranquilo"]
};
const TIME_SCENE_TEXTS = {
  morning:"El reporterito está empezando el día y parece necesitar un pequeño gesto de compañía.", afternoon:"El reporterito hizo una pausa entre tareas; su mundo sigue moviéndose aunque intente concentrarse.", night:"El cuarto se volvió cálido y el reporterito está pensando un poquito más en la Directiva.", late:"El mundo está en silencio; Panchito y el reporterito comparten una madrugada tranquila."
};
const TIME_WORLD_SCENES = Object.entries(TIME_SCENE_SEEDS).flatMap(([period,titles]) => titles.map((title,index) => createScene(`${period}-${index}`,period,period==="late"?"🌙":period==="morning"?"☀️":period==="afternoon"?"▣":"♥",title,TIME_SCENE_TEXTS[period],period==="late"?"sleeping":period==="night"?"photo":"working",index)));
const MOOD_WORLD_SCENES = Object.entries(LIFE_MOODS).map(([mood,data],index) => createScene(`mood-${mood}`,"mood",data.icon,`${data.name} por unas horas`,data.messages[index % data.messages.length],data.visual,index,{mood}));
const PANCHITO_WORLD_SCENES = ["Panchito trae una carta","Panchito busca compañía","Panchito encontró una foto","Panchito detectó tristeza","La hamburguesa desapareció","Panchito quiere jugar","Guardia frente al celular","Un ladrido importante","Panchito encontró una estrella","Misión: hacer sonreír"].map((title,index)=>createScene(`dog-scene-${index}`,"panchito","🐶",title,`Panchito inició una pequeña aventura dentro del cuarto: ${title.toLowerCase()}.`,`panchito`,index,{panchito:true}));
const GIFT_WORLD_SCENES = GIFT_DEFINITIONS.slice(0,10).map((gift,index)=>createScene(`gift-scene-${gift.id}`,"gift",gift.icon,`${gift.name} en el cuarto`,`El reporterito encontró ${gift.name.toLowerCase()} y recordó cómo llegó a su mundo.`,`gift`,index,{requiresGift:gift.id}));
const WORLD_SCENES = [...TIME_WORLD_SCENES,...MOOD_WORLD_SCENES,...PANCHITO_WORLD_SCENES,...GIFT_WORLD_SCENES];

/* Estas utilidades deben existir antes de cargar la partida guardada. */
const $ = (selector) => document.querySelector(selector);
const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];
const clamp = (number) => Math.max(0, Math.min(100, Math.round(number)));
const cloneDefaultState = () => JSON.parse(JSON.stringify(DEFAULT_STATE));

let offlinePenaltyNotice = false;
let state = loadGame();
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
let currentWorldScene = null;
let resetArmed = false;
let hardResetInProgress = false;
let currentDirectivaInteraction = null;

const average = () => Object.values(state.stats).reduce((a, b) => a + b, 0) / Object.values(state.stats).length;

function calculateOfflineDecay(lastSaved, now = Date.now()) {
  const elapsed = Math.max(0, now - (Number(lastSaved) || now));
  if (!elapsed) return { loss: 0, sleptMs: 0, awakeMs: 0 };
  const step = 20 * 60 * 1000;
  let cursor = Number(lastSaved) || now;
  let loss = 0, sleptMs = 0, awakeMs = 0;
  while (cursor < now) {
    const next = Math.min(now, cursor + step);
    const hours = (next - cursor) / 3600000;
    if (isReporterSleepingNow(new Date(cursor))) {
      loss += 6 * hours;
      sleptMs += next - cursor;
    } else {
      loss += 5 * ((next - cursor) / step);
      awakeMs += next - cursor;
    }
    cursor = next;
  }
  return { loss: Math.min(100, loss), sleptMs, awakeMs };
}

function applyOfflineDecayToMergedState(merged, lastSaved) {
  const { loss, sleptMs, awakeMs } = calculateOfflineDecay(lastSaved);
  if (!loss || merged.life.isDead) return false;
  Object.keys(merged.stats).forEach(key => merged.stats[key] = Math.max(0, Number(merged.stats[key] || 0) - loss));
  ["hunger", "happiness", "motivation", "fun", "prestige"].forEach(key => {
    if (typeof merged.simulation[key] === "number") merged.simulation[key] = Math.max(0, merged.simulation[key] - loss);
  });
  ["hunger", "energy", "happiness", "friendship"].forEach(key => {
    if (typeof merged.panchito[key] === "number") merged.panchito[key] = Math.max(0, merged.panchito[key] - loss);
  });
  merged.life.lastOfflineHours = Math.round(((sleptMs + awakeMs) / 3600000) * 10) / 10;
  merged.life.totalOfflinePenalty = (Number(merged.life.totalOfflinePenalty) || 0) + loss;
  merged.life.lastOfflineSleepHours = Math.round((sleptMs / 3600000) * 10) / 10;
  merged.life.lastOfflineAwakeMinutes = Math.round(awakeMs / 60000);
  return true;
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
      directiva: { ...DEFAULT_STATE.directiva, ...(saved.directiva || {}), stats:{...DEFAULT_STATE.directiva.stats,...(saved.directiva?.stats || {})} },
      gifts: { ...DEFAULT_STATE.gifts, ...(saved.gifts || {}) },
      novel: { ...DEFAULT_STATE.novel, ...(saved.novel || {}) },
      economy: { ...DEFAULT_STATE.economy, ...(saved.economy || {}) },
      simulation: { ...DEFAULT_STATE.simulation, ...(saved.simulation || {}) },
      eventEngine: { ...DEFAULT_STATE.eventEngine, ...(saved.eventEngine || {}), traits:{...DEFAULT_STATE.eventEngine.traits,...(saved.eventEngine?.traits || {})} },
      minigames: { ...DEFAULT_STATE.minigames, ...(saved.minigames || {}) },
      timeline: Array.isArray(saved.timeline) ? saved.timeline : [],
      life: { ...DEFAULT_STATE.life, ...(saved.life || {}) }
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
    merged.economy.unlockedOutfits = Array.isArray(merged.economy.unlockedOutfits) ? merged.economy.unlockedOutfits : ["classic"];
    if (!merged.economy.unlockedOutfits.includes("classic")) merged.economy.unlockedOutfits.unshift("classic");
    merged.economy.awardedLevels = Array.isArray(merged.economy.awardedLevels) ? merged.economy.awardedLevels : [1];
    merged.economy.ownedItems = Array.isArray(merged.economy.ownedItems) ? merged.economy.ownedItems : [];
    ["history","decisions","seenIds","unlockedMythics"].forEach(key => merged.eventEngine[key] = Array.isArray(merged.eventEngine[key]) ? merged.eventEngine[key] : []);
    merged.eventEngine.rarityCounts = merged.eventEngine.rarityCounts && typeof merged.eventEngine.rarityCounts === "object" ? merged.eventEngine.rarityCounts : {};
    merged.minigames.bestScores = merged.minigames.bestScores && typeof merged.minigames.bestScores === "object" ? merged.minigames.bestScores : {};
    ["recentThoughts", "recentScenes", "scenesSeen", "sceneChoices", "letters", "dreams", "visitDates", "journal"].forEach(key => {
      merged.life[key] = Array.isArray(merged.life[key]) ? merged.life[key] : [];
    });
    merged.life.firstMemories = merged.life.firstMemories && typeof merged.life.firstMemories === "object" ? merged.life.firstMemories : {};
    merged.life.lastImportant = merged.life.lastImportant && typeof merged.life.lastImportant === "object" ? merged.life.lastImportant : {};
    if (applyOfflineDecayToMergedState(merged, saved.lastSaved || Date.now())) offlinePenaltyNotice = true;
    return merged;
  } catch { return cloneDefaultState(); }
}

function loadGame() { return loadState(); }

function saveState() {
  if (hardResetInProgress) return;
  state.lastSaved = Date.now();
  state.tree.loveTreeXP = loveTreeXP;
  state.tree.loveTreeLevel = loveTreeLevel;
  state.tree.stage = LOVE_TREE_STAGES[loveTreeLevel - 1].name;
  const serializedState = JSON.stringify(state);
  try { localStorage.setItem(STORAGE_KEY, serializedState); } catch { /* Se conserva el respaldo de la pestaña. */ }
  window.name = WINDOW_SAVE_PREFIX + serializedState;
}

function saveGame() { saveState(); }

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
  if (state.life.isDead) {
    loveTreeXP = 0; loveTreeLevel = 1; updateWorldTime(false); applyRoomTheme("romantic");
    renderLoveTree(); renderGifts(); renderOutfitShop(); applyEquippedOutfit(); renderAlbum(); renderDiary(); renderPanchito(); initializeDirectiva(); renderNovelProgress(); buildChatInterface(); renderReporterLife(); renderLifeStore(); renderTimeline(); renderOffice(); render(true);
    return;
  }
  initializeAlbum();
  initializeLoveTree();
  initializeWorld();
  initializeDirectiva();
  initializeLife();
  initializeGifts();
  initializeOutfitShop();
  initializePanchito();
  initializeReporterLife();
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
  awardLevelCoins(level);
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
  if (state.life) addJournalEntry(text, type, icon, id ? `album-${id}` : null);
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
function isSleepHour(hour = new Date().getHours()) {
  return hour >= 0 && hour < 8;
}

function isReporterSleepingNow(date = new Date()) {
  return isSleepHour(date.getHours());
}

function sleepBlockedMessage() {
  const text = "El reporterito está durmiendo de 12:00 a.m. a 8:00 a.m. 😴 Zzz... No puede hacer acciones, responder mensajes ni abrir escenas hasta que despierte.";
  setMessage(text);
  toast("😴", "REPORTERITO DORMIDO", "Vuelve después de las 8:00 a.m. para cuidarlo.");
  showLifeEventAlert(false);
  return text;
}

function getTimePeriod(hour = new Date().getHours()) {
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "afternoon";
  if (hour >= 19 && hour < 24) return "night";
  return "late";
}

const TIME_PERIOD_INFO = {
  morning: ["☀", "MAÑANA", "El reporterito acaba de despertar."],
  afternoon: ["▣", "TARDE", "El reporterito anda trabajando."],
  night: ["♥", "NOCHE", "El reporterito está extrañando a la Directiva."],
  late: ["☾", "DORMIDO", "El reporterito está durmiendo. Zzz..."]
};

function initializeWorld() {
  state.world.roomVisits = (Number(state.world.roomVisits) || 0) + 1;
  applyRoomTheme(state.world.roomTheme || "romantic");
  updateWorldTime(false);
  const today = localDateKey();
  if (state.world.lastDailyGift !== today) {
    state.world.lastDailyGift = today;
    setTimeout(() => { if (!state.life.isDead) grantNextGift("VISITA DIARIA"); }, 900);
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
  if (period === "late") showLifeEventAlert(false);
  $("#roomScene").dataset.time = period;
  $("#roomPeriodIcon").textContent = TIME_PERIOD_INFO[period][0];
  $("#roomPeriodName").textContent = TIME_PERIOD_INFO[period][1];
  if (announce && previous !== period) {
    setMessage(TIME_PERIOD_INFO[period][2]);
    toast(TIME_PERIOD_INFO[period][0], TIME_PERIOD_INFO[period][1], TIME_PERIOD_INFO[period][2]);
    handleDreamCycle();
    saveState();
  }
}

/* Vida y personalidad persistente */
function initializeLife() {
  checkReporterLife(); updateLifeMood(); updateHeartWeather(); registerDailyVisit(); handleDreamCycle(); renderDiary(); renderLifeStatus();
  if (isReporterSleepingNow() && !state.life.isDead) setTimeout(() => sleepBlockedMessage(), 700);
  checkLifeAchievements();
  setTimeout(() => showRandomThought(true), 1400);
  if (state.life.pendingScene) {
    const pending = WORLD_SCENES.find(scene => scene.id === state.life.pendingScene);
    if (pending) setTimeout(() => openWorldScene(pending), 2400);
  }
}

function updateLifeMood(force = false) {
  if (!force && LIFE_MOODS[state.life.mood] && Date.now() < Number(state.life.moodExpiresAt || 0)) return;
  let choices = Object.keys(LIFE_MOODS);
  if (state.stats.energy < 30) choices = ["tired","sensitive","needsAttention"];
  else if (state.stats.attention < 30) choices = ["needsAttention","sensitive","nostalgic"];
  else if (state.stats.affection > 80) choices = ["inLove","happy","confident"];
  state.life.mood = randomFrom(choices);
  const config = LIFE_MOODS[state.life.mood];
  const hours = config.hours[0] + Math.floor(Math.random() * (config.hours[1] - config.hours[0] + 1));
  state.life.moodExpiresAt = Date.now() + hours * 3600000;
  addJournalEntry(`Estado de ánimo: ${config.name}. ${randomFrom(config.messages)}`, "ESTADO DE ÁNIMO", config.icon, `mood-${localDateKey()}-${state.life.mood}`);
}

function updateHeartWeather() {
  const today = localDateKey();
  if (state.life.weatherDate !== today || !HEART_WEATHERS[state.life.weather]) {
    let options = ["beautiful","romantic","calm","special","sensitive"];
    if (["sensitive","nostalgic","tired"].includes(state.life.mood)) options = ["sensitive","calm","beautiful"];
    if (["inLove","happy"].includes(state.life.mood)) options = ["romantic","beautiful","special"];
    state.life.weather = randomFrom(options); state.life.weatherDate = today;
  }
}

function renderLifeStatus() {
  const mood = LIFE_MOODS[state.life.mood] || LIFE_MOODS.happy;
  const weather = HEART_WEATHERS[state.life.weather] || HEART_WEATHERS.beautiful;
  $("#lifeMoodIcon").textContent = mood.icon; $("#lifeMoodName").textContent = mood.name.toUpperCase();
  $("#heartWeatherIcon").textContent = weather.icon; $("#heartWeatherName").textContent = weather.name.toUpperCase();
  $("#roomScene").dataset.heartWeather = state.life.weather;
  document.body.dataset.lifeMood = state.life.mood;
}

function registerDailyVisit() {
  const today = localDateKey();
  const isNewDay = !state.life.visitDates.includes(today);
  state.life.lastVisitAt = Date.now();
  if (!isNewDay) return;
  state.life.visitDates.push(today); state.life.visitDates = state.life.visitDates.slice(-365);
  state.life.dailyVisits = state.life.visitDates.length;
  if (!state.life.isDead) changeStats({ attention: 2, energy: 1 });
  const welcomes = ["El reporterito notó que la Directiva volvió.","El reporterito estuvo esperando esta visita.","Panchito movió la colita al verla llegar."];
  const welcome = randomFrom(welcomes);
  addJournalEntry(`Día ${getGameDay()}: ${welcome}`, "VISITA DIARIA", "🚪", `visit-${today}`);
  addTimeline("🚪",welcome,"NUEVO DÍA",`timeline-visit-${today}`);
  rememberFirst("firstVisit", "El reporterito recordó la primera vez que la Directiva entró a su mundo.");
  setTimeout(() => { setMessage(welcome); toast("🚪","VISITA DIARIA",welcome); }, 700);
  unlock("firstWorldVisit");
}

function getGameDay() { return Math.max(1, Math.floor((Date.now() - state.startedAt) / 86400000) + 1); }

function showRandomThought(announce = false) {
  const memoryThoughts = Object.values(state.life.firstMemories).map(text => `El reporterito recordó algo importante: ${text.toLowerCase()}`);
  const weatherThoughts = {
    beautiful:"El reporterito sintió que hoy puede ser un día bonito.", romantic:"El clima del corazón hizo que el reporterito pensara todavía más en la Directiva.", sensitive:"El reporterito está tratando sus recuerdos con un poquito más de cuidado hoy.", special:"El reporterito sospecha que algo especial puede pasar en su mundo.", calm:"El reporterito disfruta el silencio tranquilo del cuarto."
  };
  const traitThoughts = {support:"El reporterito recordó que hablar con honestidad suele hacerlo sentir acompañado.",avoidance:"El reporterito se preguntó si ha estado evitando demasiadas conversaciones difíciles.",flowers:"El reporterito volvió a pensar que algunas flores pueden guardar historias completas.",generosity:"El reporterito pensó en preparar otro detalle bonito.",courage:"El reporterito se siente capaz de enfrentar un día difícil.",humor:"El reporterito está ensayando un chiste malo para la Directiva.",panchoCare:"El reporterito cree que Pancho entiende más de emociones de lo que aparenta."};
  const lastDecision = state.eventEngine.decisions.at(-1);
  const decisionThought = lastDecision ? `El reporterito sigue pensando en aquella vez que eligió “${lastDecision.choice}”.` : null;
  const pool = [...REPORTER_THOUGHTS, ...memoryThoughts, weatherThoughts[state.life.weather], traitThoughts[dominantTrait()], decisionThought].filter(Boolean);
  const available = pool.filter(thought => !state.life.recentThoughts.includes(thought));
  const thought = randomFrom(available.length ? available : pool);
  state.life.recentThoughts.push(thought); state.life.recentThoughts = state.life.recentThoughts.slice(-14);
  $("#dailyThought").textContent = thought; $("#diaryDate").textContent = new Date().toLocaleDateString("es-MX", { weekday:"long", day:"numeric", month:"long" }).toUpperCase();
  if (announce) setMessage(thought);
  saveState(); return thought;
}

function maybeShowSpontaneousLetter() {
  if (state.life.isDead || isReporterSleepingNow() || document.visibilityState === "hidden" || anyModalOpen() || Math.random() > .22) return;
  const recent = state.life.letters.slice(-12).map(item => item.text);
  const available = SPONTANEOUS_LETTERS.filter(letter => !recent.includes(letter));
  let text = randomFrom(available.length ? available : SPONTANEOUS_LETTERS);
  const lastDecision = state.eventEngine.decisions.at(-1);
  if (lastDecision && Math.random() < .35) text += ` Todavía sigo pensando en cuando elegí ${lastDecision.choice.toLowerCase()}; creo que esa decisión cambió un poquito quién soy.`;
  const letter = { text, at:Date.now() };
  state.life.letters.push(letter); state.life.letters = state.life.letters.slice(-50);
  addJournalEntry(text, "CARTA ESPONTÁNEA", "💌");
  showLetter("Carta espontánea del Reporterito", text); saveState();
}

function handleDreamCycle() {
  const today = localDateKey(), period = getTimePeriod();
  if (period === "late" && state.life.lastDreamDate !== today) {
    let text = randomFrom(REPORTER_DREAMS.filter(dream => !state.life.dreams.slice(-10).some(item => item.text === dream)));
    if (state.eventEngine.decisions.length && Math.random() < .45) text += ` En el sueño reapareció una decisión del día ${state.eventEngine.decisions.at(-1).day}.`;
    state.life.dreams.push({ text, at:Date.now() }); state.life.dreams = state.life.dreams.slice(-40);
    state.life.lastDreamDate = today; addJournalEntry(text, "SUEÑO", "🌙", `dream-${today}`);
    if (state.life.dreams.length === 1) addAlbumMemory(text,"PRIMER SUEÑO","🌙","first-dream");
  }
  if (period === "morning" && state.life.dreams.length && state.life.dreamShownDate !== today) {
    state.life.dreamShownDate = today;
    setTimeout(() => { setMessage("El reporterito abrió los ojos, se estiró y recordó un sueño bonito."); toast("🌙","SUEÑO GUARDADO",state.life.dreams.at(-1).text); describeLatestDream(); }, 1800);
  }
}

function addJournalEntry(text, type = "RECUERDO", icon = "♥", id = null) {
  if (!state.life) return;
  if (id && state.life.journal.some(entry => entry.id === id)) return;
  state.life.journal.push({ id:id || `journal-${Date.now()}-${Math.random()}`, text, type, icon, at:Date.now(), day:getGameDay() });
  state.life.journal = state.life.journal.slice(-220);
  if ($("#diaryEntries")) renderDiary();
  checkLifeAchievements();
}

function renderDiary() {
  if (!$("#diaryEntries")) return;
  $("#diaryCount").textContent = state.life.journal.length;
  const entries = state.life.journal.slice(-70).reverse();
  $("#diaryEntries").innerHTML = entries.length ? entries.map(entry => `<article class="diary-entry"><span>${escapeHTML(entry.icon)}</span><b>DÍA ${entry.day} · ${escapeHTML(entry.type)}</b><p>${escapeHTML(entry.text)}</p><time>${new Date(entry.at).toLocaleString("es-MX",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</time></article>`).join("") : '<p class="diary-empty">El diario está abierto en la primera página.<br>El mundo pronto tendrá algo que contar.</p>';
}

function rememberFirst(key, text) {
  if (state.life.firstMemories[key]) return;
  state.life.firstMemories[key] = text;
  addJournalEntry(text, "PRIMERA VEZ", "✦", `first-${key}`);
}

function anyModalOpen() { return Boolean(document.querySelector(".modal-backdrop:not(.hidden)")); }

function lowStatScene() {
  const lowest = Object.entries(state.stats).sort((a,b) => a[1]-b[1])[0];
  if (!lowest || lowest[1] >= 32) return null;
  const info = {
    affection:["Cariño bajito","El reporterito está abrazando una almohada.",0,"♥"], messages:["Otra notificación fantasma","El reporterito revisó el celular otra vez.",0,"📱"], attention:["Necesita compañía","El reporterito se siente un poquito ignorado.",1,"🫂"], energy:["Día pesado","El reporterito parece agotado.",2,"⚡"], trust:["Un lugar seguro","El reporterito necesita sentirse seguro.",4,"🔐"], hugs:["Abrazo urgente","El reporterito necesita un abrazo urgente.",1,"🫂"]
  }[lowest[0]];
  return createScene(`low-${lowest[0]}`,"low",info[3],info[0],info[1],lowest[0]==="messages"?"phone":lowest[0]==="energy"?"sleeping":"sad",info[2]);
}

function contextualScenePool() {
  const period = getTimePeriod();
  const pool = WORLD_SCENES.filter(scene => scene.category === period);
  const moodScene = WORLD_SCENES.find(scene => scene.mood === state.life.mood); if (moodScene) pool.push(moodScene,moodScene);
  const weatherMood = { romantic:"inLove", sensitive:"nostalgic", calm:"thoughtful", special:"inspired", beautiful:"happy" }[state.life.weather];
  const weatherScene = WORLD_SCENES.find(scene => scene.mood === weatherMood); if (weatherScene) pool.push(weatherScene);
  const low = lowStatScene(); if (low) pool.push(low,low,low);
  if (state.life.mood === "panchitoMode" || Math.random() < .3) pool.push(...PANCHITO_WORLD_SCENES);
  pool.push(...GIFT_WORLD_SCENES.filter(scene => state.gifts.owned.includes(scene.requiresGift)));
  return pool;
}

function showContextualWorldScene() {
  if (state.life.isDead || isReporterSleepingNow() || document.visibilityState === "hidden" || anyModalOpen()) return;
  if (Math.random() < .12) { startNovelScene(); return; }
  const pool = contextualScenePool();
  const available = pool.filter(scene => !state.life.recentScenes.includes(scene.id));
  openWorldScene(randomFrom(available.length ? available : pool));
}

function openWorldScene(scene) {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (!scene) return;
  currentWorldScene = scene; state.life.pendingScene = scene.id;
  $("#worldSceneIcon").textContent = scene.icon; $("#worldSceneCategory").textContent = scene.category.toUpperCase();
  $("#worldSceneTitle").textContent = scene.title; $("#worldSceneText").textContent = scene.text; $("#worldSceneEffect").textContent = scene.icon;
  $("#worldSceneOptions").innerHTML = scene.options.map((option,index) => `<button data-world-scene-choice="${index}">${option[0]}</button>`).join("");
  forceReporterVisual(scene.visual); openModal("worldSceneModal"); saveState();
}

function forceReporterVisual(visual) {
  const pet = $("#pet"), states = ["happy","sad","critical","sleeping","phone","photo","working","idle","read","dj","music","game","pancho","coffee","gift","stars","clean"];
  states.forEach(name => pet.classList.remove(`room-state-${name}`));
  pet.classList.add(`room-state-${LIFE_MOODS[state.life.mood]?.visual === "panchito" ? "happy" : visual || "idle"}`);
}

function resolveWorldScene(index) {
  if (state.life.isDead) return;
  if (!currentWorldScene) return;
  const option = currentWorldScene.options[index]; if (!option) return;
  changeStats(option[2]); addTreeXP(currentWorldScene.category === "mood" ? 2 : 1);
  if (!state.life.scenesSeen.includes(currentWorldScene.id)) state.life.scenesSeen.push(currentWorldScene.id);
  state.life.recentScenes.push(currentWorldScene.id); state.life.recentScenes = state.life.recentScenes.slice(-12);
  state.life.sceneChoices.push({ sceneId:currentWorldScene.id, choice:option[0], result:option[1], at:Date.now() }); state.life.sceneChoices = state.life.sceneChoices.slice(-150);
  if (option[4]) addAlbumMemory(option[1], "ESCENA DEL MUNDO", currentWorldScene.icon, `world-scene-${currentWorldScene.id}`);
  if (currentWorldScene.panchito) state.panchito.eventsSeen.push(`scene-${currentWorldScene.id}`);
  if (currentWorldScene.category === "gift" && Math.random() < .2) grantNextGift("ESCENA DE RECUERDO");
  addJournalEntry(option[1], `ESCENA · ${currentWorldScene.title}`, currentWorldScene.icon);
  setMessage(option[1]); closeModal("worldSceneModal"); state.life.pendingScene = null; currentWorldScene = null;
  checkLifeAchievements(); render(); saveState();
}

function checkLifeAchievements() {
  if (!state.life) return;
  if (state.life.visitDates.length >= 7) unlock("constantDirector");
  if (state.life.journal.length >= 50) unlock("fullDiary");
  if (state.gifts?.owned?.length >= 15) unlock("romanticCollector");
  if (state.world?.roomInteractions >= 5) unlock("livingRoom");
  if (getTimePeriod() === "late" && state.life.dailyVisits > 0) unlock("starryNight");
  if (getTimePeriod() === "morning" && state.life.dailyVisits > 0) unlock("prettyMorning");
  if (loveTreeLevel >= 3 && state.gifts?.owned?.length >= 5 && state.life.scenesSeen.length >= 10) unlock("growingWorld");
}

function resetGame() {
  hardResetInProgress = true;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* El respaldo también se limpia. */ }
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Sin sessionStorage. */ }
  window.name = "";
  state = cloneDefaultState();
  state.startedAt = Date.now(); state.lastSaved = Date.now();
  loveTreeXP = 0; loveTreeLevel = 1; currentMood = "tranquilo";
  setTimeout(() => location.replace(`${location.pathname}?nuevo=${Date.now()}`), 40);
}

function getVitality() { return Math.max(0, Math.round((state.stats.affection + state.simulation.hunger + state.stats.energy + state.simulation.happiness) / 4)); }
function getAliveDays() { return state.life.isDead ? 0 : Math.max(1, Math.floor((Date.now() - Number(state.life.aliveSince || Date.now())) / 86400000) + 1); }

function checkReporterLife() {
  if (state.life.isDead) { renderLifeCounter(); return; }
  const now = Date.now();
  if (state.simulation.hunger <= 0) state.simulation.hungerZeroSince ||= now; else state.simulation.hungerZeroSince = 0;
  const extremeSadness = state.simulation.happiness <= 1 && state.stats.affection < 10;
  if (extremeSadness) state.simulation.extremeSince ||= now; else state.simulation.extremeSince = 0;
  let cause = "";
  if (state.stats.affection <= 0) cause = "El amor llegó a cero.";
  else if (state.simulation.hungerZeroSince && now - state.simulation.hungerZeroSince >= 15 * 60 * 1000) cause = "El hambre permaneció en cero demasiado tiempo.";
  else if (state.simulation.extremeSince && now - state.simulation.extremeSince >= 15 * 60 * 1000) cause = "La tristeza extrema duró demasiado tiempo.";
  if (!cause) { renderLifeCounter(); return; }
  const deathAt = Date.now();
  const lastAliveDays = Math.max(1, Math.floor((deathAt - Number(state.life.aliveSince || state.startedAt)) / 86400000) + 1);
  const deathCount = (Number(state.life.deathCount) || 0) + 1;
  const summary = { cause, days:lastAliveDays, hugs:state.counts.hugs || 0, letters:(state.simulation.lettersWritten || 0) + state.life.letters.length, earned:state.economy.totalEarned || 0, achievements:state.achievements.length, decisions:state.eventEngine.totalResolved || 0, memories:state.album.memories.length };
  state = cloneDefaultState(); state.startedAt = deathAt; state.lastSaved = deathAt;
  Object.keys(state.stats).forEach(key => state.stats[key] = 0);
  Object.keys(state.simulation).forEach(key => { if (typeof state.simulation[key] === "number") state.simulation[key] = 0; });
  state.economy.coins = 0; state.panchito.friendship = 0;
  state.life.isDead = true; state.life.deathAt = deathAt; state.life.lastAliveDays = lastAliveDays; state.life.deathCount = deathCount; state.life.aliveSince = deathAt; state.life.deathSummary = summary;
  loveTreeXP = 0; loveTreeLevel = 1; currentMood = "muerto";
  renderLoveTree(); renderGifts(); renderOutfitShop(); applyEquippedOutfit(); renderAlbum(); renderDiary(); renderPanchito(); renderNovelProgress(); updateChatCounter(); renderReporterLife(); renderLifeStore(); renderTimeline(); renderOffice(); showLifeEventAlert(false);
  $("#deathOverlay").classList.remove("hidden"); $("#pet").classList.add("is-dead");
  toast("×_×", "GAME OVER", `La vida duró ${lastAliveDays} día(s). Todo el progreso se perdió.`);
  renderLifeCounter(); saveState();
}

function renderLifeCounter() {
  if (!$("#aliveDaysCount")) return;
  $("#aliveDaysCount").textContent = getAliveDays(); $("#vitalityValue").textContent = `${getVitality()}%`;
  $("#aliveWorldFrame").classList.toggle("is-dead", Boolean(state.life.isDead));
  $("#deathOverlay").classList.toggle("hidden", !state.life.isDead);
  $("#pet").classList.toggle("is-dead", Boolean(state.life.isDead));
  if (state.life.isDead && state.life.deathSummary && $("#deathSummary")) {
    const s = state.life.deathSummary;
    $("#deathSummary").innerHTML = `<span>📅 Días vividos <b>${s.days}</b></span><span>🫂 Abrazos <b>${s.hugs}</b></span><span>💌 Cartas <b>${s.letters}</b></span><span>💰 Dinero ganado <b>$${s.earned}</b></span><span>🏆 Logros <b>${s.achievements}</b></span><span>❗ Decisiones <b>${s.decisions}</b></span><span>📖 Recuerdos <b>${s.memories}</b></span><span>🕯 Causa <b>${escapeHTML(s.cause)}</b></span>`;
  }
}

function restartReporterLife() {
  resetGame();
}

function updateRoomState(mood) {
  const pet = $("#pet");
  const states = ["happy", "sad", "critical", "dead", "sleeping", "phone", "photo", "working", "idle", "read", "dj", "music", "game", "pancho", "coffee", "gift", "stars", "clean"];
  states.forEach(name => pet.classList.remove(`room-state-${name}`));
  let visual = "idle";
  if (mood === "muerto") visual = "dead";
  else if (mood === "critico") visual = "critical";
  else if (["triste", "muy-triste", "abrazos"].includes(mood)) visual = "sad";
  else if (mood === "dormido") visual = "sleeping";
  else if (mood === "esperando") visual = "phone";
  else if (["enamorado", "enfermo", "atrevido"].includes(mood)) visual = "photo";
  else if (state.simulation?.currentActivity?.visual && Date.now() < Number(state.simulation.currentActivity.endsAt || 0)) visual = state.simulation.currentActivity.visual;
  else {
    const personalityVisual = LIFE_MOODS[state.life.mood]?.visual || "working";
    visual = personalityVisual === "panchito" ? "happy" : personalityVisual;
  }
  pet.classList.add(`room-state-${visual}`);
  state.world.reporterVisualState = visual;
  if (["sad", "critical"].includes(visual)) setPanchitoVisual("supporting");
  else if (visual === "sleeping") setPanchitoVisual("sleeping");
  else if (state.life.mood === "panchitoMode") setPanchitoVisual("supporting");
}

function interactWithRoomObject(object) {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) { setMessage("El mundo está esperando que el reporterito comience una nueva vida."); return; }
  const messages = {
    window: TIME_PERIOD_INFO[state.world.timePeriod][2],
    photo: "El reporterito volvió a quedarse viendo la foto de la Directiva.",
    bed: "El reporterito acomodó la almohadita donde guarda recuerdos bonitos.",
    desk: "El reporterito intentó trabajar, pero pensó en la Directiva otra vez.",
    plant: "El reporterito regó la planta con la misma paciencia que cuida el Árbol de Amor.",
    phone: "El reporterito abrió el celular esperando un mensajito."
  };
  const cooldownKey = `room-${object}`;
  if ((actionCooldowns[cooldownKey] || 0) > Date.now()) { setMessage(messages[object]); return; }
  actionCooldowns[cooldownKey] = Date.now() + 6000;
  state.world.roomInteractions = (Number(state.world.roomInteractions) || 0) + 1;
  changeStats({ attention: 1 });
  if (object === "phone") { if (Math.random() < .45) phoneNotification(); else openChat(); }
  setMessage(messages[object] || "El cuarto guarda un pequeño recuerdo.");
  rememberFirst(`room-${object}`, `El reporterito recordó la primera vez que la Directiva prestó atención a ${object === "photo" ? "su foto favorita" : `su ${object}`}.`);
  checkLifeAchievements(); render(); saveState();
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
  $("#panchitoHunger").textContent = `${Math.round(state.panchito.hunger)}%`;
  $("#panchitoEnergy").textContent = `${Math.round(state.panchito.energy)}%`;
  $("#panchitoHappiness").textContent = `${Math.round(state.panchito.happiness)}%`;
  $("#panchitoFriendship").textContent = `${Math.round(state.panchito.friendship)}%`;
  setPanchitoVisual(state.panchito.action || "happy");
}

function handlePanchitoAction(action) {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) return;
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
  if (action === "pet") { state.panchito.friendship = clamp(state.panchito.friendship + 3); state.panchito.happiness = clamp(state.panchito.happiness + 4); applyLifeEffects({happiness:1}); }
  if (action === "feed") { state.panchito.hunger = clamp(state.panchito.hunger + 15); state.panchito.happiness = clamp(state.panchito.happiness + 2); applyLifeEffects({pancho:1}); }
  if (action === "play") { state.panchito.energy = clamp(state.panchito.energy - 3); state.panchito.happiness = clamp(state.panchito.happiness + 7); applyLifeEffects({pancho:3,fun:2}); }
  state.panchito[data.counter] = (Number(state.panchito[data.counter]) || 0) + 1;
  panchitoCooldowns[action] = Date.now() + 6000;
  setPanchitoVisual(data.visual); renderPanchito();
  setMessage(data.message); burstHearts(5, action === "feed" ? "🍖" : action === "play" ? "🎾" : "♥");
  setTimeout(() => { setPanchitoVisual("happy"); saveState(); }, 1800);
  checkWorldAchievements(); render(); saveState();
}

function cyclePanchitoBehavior() {
  if (state.life.isDead) { setPanchitoVisual("sleeping"); return; }
  if (isCritical() || average() < 35) setPanchitoVisual("supporting");
  else setPanchitoVisual(randomFrom(["happy", "idle", "sleeping", "happy"]));
  saveState();
}

function showPanchitoEvent() {
  if (state.life.isDead || isReporterSleepingNow() || document.visibilityState === "hidden" || currentEvent || anyModalOpen()) return;
  const unseen = PANCHITO_EVENTS.filter(event => !state.panchito.eventsSeen.includes(event.id));
  const event = randomFrom(unseen.length ? unseen : PANCHITO_EVENTS);
  if (!state.panchito.eventsSeen.includes(event.id)) state.panchito.eventsSeen.push(event.id);
  rememberFirst("firstPanchitoEvent", "El reporterito recordó el primer evento especial que compartió con Panchito.");
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
  rememberFirst("firstGift", `El reporterito recordó su primer regalo: ${gift.name}.`);
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
  state.gifts.positions[id] = ((Number(state.gifts.positions[id]) || 0) + 1) % 15;
  renderGifts(); saveState();
}

function renderGifts() {
  $("#giftCount").textContent = state.gifts.owned.length;
  $("#giftGrid").innerHTML = GIFT_DEFINITIONS.map(gift => {
    const owned = state.gifts.owned.includes(gift.id), visible = state.gifts.visible.includes(gift.id);
    return `<article class="gift-card ${owned ? "owned" : ""}"><span class="gift-icon">${owned ? gift.icon : "?"}</span><strong>${owned ? gift.name : "Regalo oculto"}</strong><small>${owned ? gift.description : "Todavía no encontrado"}</small><div><button data-gift-toggle="${gift.id}">${visible ? "Guardar" : "Mostrar"}</button><button data-gift-move="${gift.id}">Mover</button></div></article>`;
  }).join("");
  const memoryGifts = state.gifts.visible.map(id => {
    const gift = GIFT_DEFINITIONS.find(item => item.id === id); if (!gift) return "";
    return `<button class="room-gift pos-${Number(state.gifts.positions[id]) || 0}" data-gift-move="${id}" aria-label="Mover ${gift.name}">${gift.icon}</button>`;
  }).join("");
  const purchasedDecor = state.economy.ownedItems.map((id,index) => {
    const item = LIFE_STORE_ITEMS.find(entry => entry.id === id && entry.type !== "gift");
    return item ? `<span class="room-gift pos-${(index + 8) % 15}" aria-label="${item.name}">${item.icon}</span>` : "";
  }).join("");
  $("#roomGifts").innerHTML = memoryGifts + purchasedDecor;
}

/* Monedas y guardarropa */
function initializeOutfitShop() {
  for (let level = 2; level <= loveTreeLevel; level++) awardLevelCoins(level, false);
  renderOutfitShop(); applyEquippedOutfit();
}

function awardLevelCoins(level, announce = true) {
  if (state.economy.awardedLevels.includes(level)) return;
  const rewards = { 2:40, 3:60, 4:90, 5:130, 6:200 };
  const amount = rewards[level] || level * 20;
  state.economy.coins = (Number(state.economy.coins) || 0) + amount;
  state.economy.awardedLevels.push(level);
  addJournalEntry(`El Árbol de Amor llegó al nivel ${level} y entregó ${amount} monedas.`, "RECOMPENSA DE NIVEL", "◉", `coins-level-${level}`);
  if (announce) toast("◉", `${amount} MONEDAS OBTENIDAS`, `Recompensa por alcanzar el nivel ${level}.`);
  if ($("#outfitGrid")) renderOutfitShop();
}

function buyOrEquipOutfit(id) {
  if (state.life.isDead) return;
  const outfit = OUTFIT_DEFINITIONS.find(item => item.id === id); if (!outfit) return;
  if (!state.economy.unlockedOutfits.includes(id)) {
    if (state.economy.coins < outfit.cost) { toast("◉", "MONEDAS INSUFICIENTES", `Faltan ${outfit.cost - state.economy.coins} monedas.`); return; }
    state.economy.coins -= outfit.cost; state.economy.unlockedOutfits.push(id);
    addJournalEntry(`El reporterito compró ${outfit.name.toLowerCase()} y lo guardó en su ropero.`, "ROPA NUEVA", outfit.icon, `outfit-${id}`);
    toast(outfit.icon, "ROPA DESBLOQUEADA", outfit.name);
  }
  state.economy.equippedOutfit = id; applyEquippedOutfit(); renderOutfitShop(); saveState();
}

function applyEquippedOutfit() {
  const valid = OUTFIT_DEFINITIONS.some(item => item.id === state.economy.equippedOutfit);
  if (!valid || !state.economy.unlockedOutfits.includes(state.economy.equippedOutfit)) state.economy.equippedOutfit = "classic";
  $("#pet").dataset.outfit = state.economy.equippedOutfit;
  const outfit = OUTFIT_DEFINITIONS.find(item => item.id === state.economy.equippedOutfit);
  $("#pet").style.setProperty("--equipped-outfit", outfit?.color || "#e8e5d5");
}

function renderOutfitShop() {
  $("#coinCount").textContent = state.economy.coins || 0;
  $("#outfitGrid").innerHTML = OUTFIT_DEFINITIONS.map(outfit => {
    const owned = state.economy.unlockedOutfits.includes(outfit.id), equipped = state.economy.equippedOutfit === outfit.id;
    const label = equipped ? "Equipado" : owned ? "Usar" : `Comprar · ${outfit.cost} ◉`;
    return `<article class="outfit-card ${equipped ? "equipped" : ""}"><div class="outfit-preview" style="--outfit-color:${outfit.color}">${outfit.icon}</div><strong>${outfit.name}</strong><small>${outfit.description}</small><button data-outfit="${outfit.id}" ${equipped ? "disabled" : ""}>${label}</button></article>`;
  }).join("");
}

/* Reporterito Life: simulación, feed, economía y eventos con decisiones. */

/* V8 · Directiva como segundo personaje, llamadas, citas y sueños visuales */
const DIRECTIVA_ACTIVITIES = {
  visit: { label:"Visita la oficina", className:"is-happy", text:"La Directiva llegó a la oficina y el reporterito corrió emocionado." },
  read: { label:"Lee cartas", className:"is-reading", text:"La Directiva está leyendo una carta del reporterito en el escritorio." },
  pancho: { label:"Busca a Pancho", className:"is-pancho", text:"La Directiva se acercó a Pancho y él movió la colita como gerente de felicidad." },
  coffee: { label:"Toma café", className:"is-coffee", text:"La Directiva tomó café y el reporterito fingió trabajar para no ponerse nervioso." },
  tree: { label:"Pasea junto al árbol", className:"is-tree", text:"La Directiva se quedó viendo el Árbol de Amor y una hoja de corazón cayó despacito." }
};
const DIRECTIVA_INTERACTIONS = [
  { id:"hug", label:"🤗 Pedir abrazo", result:"La Directiva le dio un abrazo al reporterito. El sistema emocional se estabilizó.", effects:{love:6,happiness:5,trust:3,energy:-1}, directiva:{affection:2,happiness:2,energy:-1}, memory:"Primer abrazo compartido dentro del mundo." },
  { id:"letter", label:"💌 Entregar carta", result:"El reporterito le entregó una carta y se puso rojito esperando su reacción.", effects:{love:4,trust:4,motivation:-1,memories:1}, directiva:{affection:3,trust:2,stress:-2}, memory:"Una carta quedó guardada entre los recuerdos compartidos." },
  { id:"flower", label:"🌹 Regalar flor", result:"El reporterito le regaló una flor a la Directiva. El Árbol de Amor brilló un poquito.", effects:{love:5,happiness:3,money:-8,memories:1}, directiva:{affection:4,happiness:2}, memory:"La primera flor entregada a la Directiva dentro del juego." },
  { id:"coffee", label:"☕ Dar café", result:"La Directiva aceptó el café. El reporterito ganó puntos de empleado atento.", effects:{prestige:3,trust:2,money:-4}, directiva:{energy:5,stress:-3,hunger:1}, memory:"Café compartido en la oficina." },
  { id:"joke", label:"😂 Contar chiste", result:"El chiste fue malísimo, pero la Directiva se rió por ternura.", effects:{fun:6,happiness:3,prestige:-1}, directiva:{happiness:3,stress:-2}, memory:null },
  { id:"song", label:"🎵 Compartir canción", result:"El reporterito compartió una canción y el momento quedó sonando en el cuarto.", effects:{love:3,fun:3,memories:1}, directiva:{affection:2,mood:3}, memory:"Una canción compartida desde el celular del escritorio." },
  { id:"photo", label:"📸 Tomar foto", result:"Tomaron una foto pixelada. El celular la guardó en el álbum de recuerdos.", effects:{love:4,happiness:4,memories:1}, directiva:{happiness:3,affection:2}, memory:"Primera foto de la Directiva y el reporterito en la oficina." },
  { id:"pancho", label:"🐶 Hablar de Pancho", result:"Pancho se sintió incluido y exigió un cargo importante en la empresa.", effects:{pancho:5,fun:3}, directiva:{happiness:2}, memory:"Pancho fue tema oficial de conversación." }
];
const DIRECTIVA_CALL_TOPICS = [
  {label:"❤️ Decir que la extraña", text:"La llamada terminó con el reporterito sonriendo como menso.", effects:{love:4,trust:2}, directiva:{affection:2}},
  {label:"☕ Hablar del día", text:"La Directiva escuchó el reporte completo del día y el reporterito se sintió acompañado.", effects:{trust:3,motivation:2}, directiva:{stress:-2}},
  {label:"🐶 Hablar de Pancho", text:"Pancho ladró en medio de la llamada como si también quisiera opinar.", effects:{pancho:3,fun:3}, directiva:{happiness:2}},
  {label:"🌌 Hablar de sueños", text:"El reporterito contó un sueño y el celular lo guardó para la noche.", effects:{love:2,memories:1}, directiva:{mood:2}},
  {label:"😂 Contar algo divertido", text:"La Directiva se rió y el reporterito decidió que ese sonido debía guardarse en el álbum.", effects:{fun:5,happiness:2}, directiva:{happiness:3}}
];
const DIRECTIVA_DATES = [
  {id:"park", icon:"🌳", name:"Parque", text:"La Directiva y el reporterito caminaron por un parque imaginario lleno de hojas de corazón."},
  {id:"coffee", icon:"☕", name:"Cafetería", text:"Compartieron café en una cafetería pixelada donde Pancho intentó pagar con una croqueta."},
  {id:"stars", icon:"🌌", name:"Ver estrellas", text:"Vieron estrellas desde la ventana y el reporterito pidió el mismo deseo de siempre."},
  {id:"burger", icon:"🍔", name:"Hamburguesería", text:"La cita terminó con hamburguesas y un reporterito demasiado feliz."},
  {id:"fair", icon:"🎡", name:"Feria", text:"Subieron a una rueda de la fortuna imaginaria y el mundo se llenó de luces rosas."},
  {id:"cinema", icon:"🎬", name:"Cine", text:"Vieron una película romántica y Pancho se durmió a la mitad."}
];
function ensureDirectivaState() {
  state.directiva = { ...DEFAULT_STATE.directiva, ...(state.directiva || {}), stats:{...DEFAULT_STATE.directiva.stats,...(state.directiva?.stats || {})} };
  state.directiva.messages = Array.isArray(state.directiva.messages) ? state.directiva.messages : [];
  state.directiva.dates = Array.isArray(state.directiva.dates) ? state.directiva.dates : [];
  state.directiva.sharedMemories = Array.isArray(state.directiva.sharedMemories) ? state.directiva.sharedMemories : [];
}
function initializeDirectiva() {
  ensureDirectivaState();
  if (!state.directiva.nextVisitAt) state.directiva.nextVisitAt = Date.now() + 90000 + Math.floor(Math.random()*150000);
  if (state.directiva.present) summonDirectiva(state.directiva.activity || "visit", false);
  renderDirectiva();
}
function renderDirectiva() {
  ensureDirectivaState();
  const directiva = $("#directivaCharacter"); if (!directiva) return;
  directiva.classList.toggle("hidden", !state.directiva.present || state.life.isDead);
  Object.values(DIRECTIVA_ACTIVITIES).forEach(a => directiva.classList.remove(a.className));
  const activity = DIRECTIVA_ACTIVITIES[state.directiva.activity] || DIRECTIVA_ACTIVITIES.visit;
  if (state.directiva.present && !state.life.isDead) directiva.classList.add(activity.className);
}
function maybeDirectivaVisit() {
  if (state.life.isDead || isReporterSleepingNow() || getTimePeriod() === "late" || anyModalOpen()) return;
  ensureDirectivaState();
  if (state.directiva.present) return;
  if (Date.now() >= Number(state.directiva.nextVisitAt || 0)) summonDirectiva(randomFrom(Object.keys(DIRECTIVA_ACTIVITIES)), true);
}
function summonDirectiva(activity="visit", announce=true) {
  ensureDirectivaState();
  state.directiva.present = true; state.directiva.activity = DIRECTIVA_ACTIVITIES[activity] ? activity : "visit"; state.directiva.lastVisitAt = Date.now();
  const data = DIRECTIVA_ACTIVITIES[state.directiva.activity];
  if (announce) { setMessage(data.text); toast("❤️", "LA DIRECTIVA LLEGÓ", data.label); addTimeline("❤️", data.text, "DIRECTIVA"); addJournalEntry(data.text, "VISITA DE LA DIRECTIVA", "❤️"); }
  applyLifeEffects({love:2,happiness:2,trust:1});
  renderDirectiva(); saveState();
  clearTimeout(window.__directivaLeaveTimer);
  window.__directivaLeaveTimer = setTimeout(() => dismissDirectiva(true), 90000 + Math.floor(Math.random()*60000));
}
function dismissDirectiva(announce=false) {
  ensureDirectivaState();
  if (!state.directiva.present) return;
  state.directiva.present = false; state.directiva.nextVisitAt = Date.now() + 180000 + Math.floor(Math.random()*240000);
  if (announce && !state.life.isDead) setMessage("La Directiva salió de la oficina, pero dejó el mundo oliendo a cariño.");
  renderDirectiva(); saveState();
}
function openDirectivaPanel() {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) return;
  if (!state.directiva.present) summonDirectiva("visit", true);
  ensureDirectivaState();
  const activity = DIRECTIVA_ACTIVITIES[state.directiva.activity] || DIRECTIVA_ACTIVITIES.visit;
  $("#directivaModalTitle").textContent = activity.label;
  $("#directivaModalText").textContent = activity.text;
  const labels = {affection:"❤️ Cariño",happiness:"😊 Felicidad",energy:"😴 Energía",hunger:"🍔 Hambre",stress:"😤 Estrés",mood:"🌸 Ánimo",trust:"🤝 Confianza"};
  $("#directivaStatGrid").innerHTML = Object.entries(labels).map(([key,label]) => `<span>${label}<b>${clamp(state.directiva.stats[key] || 0)}%</b></span>`).join("");
  $("#directivaActions").innerHTML = DIRECTIVA_INTERACTIONS.map((item,index) => `<button data-directiva-action="${index}">${item.label}</button>`).join("") + `<button data-directiva-call="true">📞 Llamar después</button><button data-directiva-date="true">💞 Invitar a cita</button>`;
  openModal("directivaModal");
}
function applyDirectivaStats(changes={}) {
  ensureDirectivaState();
  Object.entries(changes).forEach(([key, delta]) => { state.directiva.stats[key] = clamp((Number(state.directiva.stats[key]) || 0) + delta); });
}
function chooseDirectivaInteraction(index) {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  const interaction = DIRECTIVA_INTERACTIONS[index]; if (!interaction || state.life.isDead) return;
  if (interaction.effects.money < 0 && state.economy.coins < Math.abs(interaction.effects.money)) { toast("💰","FALTAN MONEDAS","El reporterito quiere hacerlo, pero no le alcanza todavía."); return; }
  applyLifeEffects(interaction.effects); applyDirectivaStats(interaction.directiva);
  if (interaction.memory) addSharedMemory(interaction.memory, interaction.id === "photo" ? "📸" : interaction.id === "flower" ? "🌹" : "💞");
  addTreeXP(3); setMessage(interaction.result); addTimeline("💞", interaction.result, "DIRECTIVA"); addJournalEntry(interaction.result,"INTERACCIÓN CON LA DIRECTIVA","💞");
  renderDirectiva(); openDirectivaPanel(); render(); saveState();
}
function addSharedMemory(text, icon="💞") {
  ensureDirectivaState();
  const id = `shared-${Date.now()}-${Math.random()}`;
  state.directiva.sharedMemories.push({id,text,icon,at:Date.now(),day:getGameDay()}); state.directiva.sharedMemories = state.directiva.sharedMemories.slice(-100);
  addAlbumMemory(text,"RECUERDO COMPARTIDO",icon,id);
}
function makeDirectivaCall(topicIndex=null) {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  const topic = topicIndex === null ? randomFrom(DIRECTIVA_CALL_TOPICS) : DIRECTIVA_CALL_TOPICS[topicIndex];
  if (!topic || state.life.isDead) return;
  applyLifeEffects(topic.effects); applyDirectivaStats(topic.directiva);
  const text = `📞 ${topic.text}`; state.directiva.messages.push({text,at:Date.now()}); state.directiva.messages = state.directiva.messages.slice(-60);
  addJournalEntry(text,"LLAMADA CON LA DIRECTIVA","📞"); addTimeline("📞",text,"CELULAR"); setMessage(text); toast("📞","LLAMADA","La Directiva contestó."); closeModal("directivaModal"); render(); saveState();
}
function startDirectivaDate() {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) return;
  const cost = 18;
  if (state.economy.coins < cost) { toast("💰","FALTAN MONEDAS",`Necesitas $${cost} para invitarla a una cita.`); return; }
  state.economy.coins -= cost;
  const date = randomFrom(DIRECTIVA_DATES.filter(d => !state.directiva.dates.slice(-4).some(x => x.id === d.id)) || DIRECTIVA_DATES);
  state.directiva.dates.push({...date,at:Date.now(),day:getGameDay()}); state.directiva.dates = state.directiva.dates.slice(-80);
  applyLifeEffects({love:8,happiness:6,trust:4,fun:4,memories:1}); applyDirectivaStats({affection:5,happiness:5,stress:-4,mood:5}); addTreeXP(6);
  addSharedMemory(date.text,date.icon); addJournalEntry(date.text,`CITA · ${date.name}`,date.icon); addTimeline(date.icon,date.text,"CITA"); setMessage(date.text); toast(date.icon,"CITA DESBLOQUEADA",date.name); closeModal("directivaModal"); render(); saveState();
}
function phoneNotification() {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) return;
  const options = ["No olvides comer.","Hoy te extrañé.","Estoy orgullosa de ti.","Gracias por estar aquí.","La Directiva solicita reporte emocional."];
  const text = `📱 Notificación de la Directiva: “${randomFrom(options)}”`;
  state.directiva.messages.push({text,at:Date.now()}); state.directiva.messages = state.directiva.messages.slice(-60);
  addJournalEntry(text,"CELULAR DEL ESCRITORIO","📱"); addTimeline("📱",text,"CELULAR"); applyLifeEffects({love:2,trust:1,happiness:1}); setMessage(text); toast("📱","MENSAJE NUEVO","El celular del escritorio brilló."); render(); saveState();
}
function describeLatestDream() {
  const last = state.life.dreams.at(-1)?.text || randomFrom(REPORTER_DREAMS);
  const text = `💭 Al despertar, el reporterito contó: “${last}”`;
  addJournalEntry(text,"SUEÑO CONTADO","💭"); setMessage(text); toast("💭","SUEÑO DEL REPORTERITO",last); saveState();
}

function initializeReporterLife() {
  ensureAutonomousState();
  renderReporterLife(); renderLifeStore(); renderTimeline(); renderOffice(); renderCurrentActivity();
  runAutonomousLife(true);
  if (!state.eventEngine.nextAt) scheduleNextLifeEvent();
  if (state.eventEngine.pending) showLifeEventAlert(true);
  else checkLifeEventSchedule();
  addTimeline("🏠", "El reporterito comenzó otro capítulo dentro de su pequeño mundo.", "VISITA", `visit-life-${localDateKey()}`);
}

function getLifeValue(key) {
  const map = { love:state.stats.affection, happiness:state.simulation.happiness, energy:state.stats.energy, hunger:state.simulation.hunger, motivation:state.simulation.motivation, pancho:state.panchito.friendship, prestige:state.simulation.prestige, trust:state.stats.trust, fun:state.simulation.fun };
  return Math.round(Number(map[key]) || 0);
}

function setLifeValue(key, value) {
  const amount = clamp(value);
  if (key === "love") state.stats.affection = amount;
  else if (key === "energy") state.stats.energy = amount;
  else if (key === "trust") state.stats.trust = amount;
  else if (key === "pancho") state.panchito.friendship = amount;
  else if (["happiness","hunger","motivation","prestige","fun"].includes(key)) state.simulation[key] = amount;
}

function applyLifeEffects(effects = {}) {
  Object.entries(effects).forEach(([key, delta]) => {
    if (key === "money") {
      state.economy.coins = Math.max(0, (Number(state.economy.coins) || 0) + delta);
      if (delta > 0) state.economy.totalEarned = (Number(state.economy.totalEarned) || 0) + delta;
    } else if (key === "memories") {
      if (delta > 0) addAlbumMemory("El reporterito convirtió una decisión en un recuerdo que seguirá influyendo en su historia.", "DECISIÓN", "💌");
    } else setLifeValue(key, getLifeValue(key) + delta);
  });
  updateOfficeLevel(); renderReporterLife(); renderOffice(); renderOutfitShop(); renderLifeStore();
}

function renderReporterLife() {
  if (!$("#lifeStatGrid")) return;
  $("#lifeStatGrid").innerHTML = Object.entries(LIFE_STAT_INFO).map(([key, info]) => {
    const value = getLifeValue(key);
    return `<div class="life-stat" data-low="${value < 25}"><label><span>${info.icon} ${info.label}</span><b>${value}%</b></label><div class="life-stat-track"><div class="life-stat-fill" style="width:${value}%"></div></div></div>`;
  }).join("");
  $("#lifeMoney").textContent = state.economy.coins || 0;
  $("#prestigeLabel").textContent = `${getLifeValue("prestige")}%`;
  $("#panchoFriendshipLabel").textContent = `${getLifeValue("pancho")}%`;
  $("#lifeMemoryCount").textContent = state.album.memories.length;
  $("#officeLevelLabel").textContent = `Nivel ${state.simulation.officeLevel}`;
  renderPersonality();
}

function addTimeline(icon, text, type = "VIDA", id = null) {
  if (id && state.timeline.some(entry => entry.id === id)) return;
  state.timeline.push({ id:id || `timeline-${Date.now()}-${Math.random()}`, icon, text, type, day:getGameDay(), at:Date.now() });
  state.timeline = state.timeline.slice(-500);
  if ($("#lifeTimeline")) renderTimeline();
}

function renderTimeline() {
  if (!$("#lifeTimeline")) return;
  $("#timelineCount").textContent = state.timeline.length;
  const entries = state.timeline.slice(-100).reverse();
  $("#lifeTimeline").innerHTML = entries.length ? entries.map(entry => `<article class="timeline-entry"><span>${escapeHTML(entry.icon)}</span><b>DÍA ${entry.day} · ${escapeHTML(entry.type)}</b><p>${escapeHTML(entry.text)}</p><small>${new Date(entry.at).toLocaleString("es-MX",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</small></article>`).join("") : '<p class="diary-empty">La historia está esperando su primer momento.</p>';
}

function dominantTrait() {
  const entries = Object.entries(state.eventEngine.traits).sort((a,b) => b[1] - a[1]);
  return entries[0]?.[1] > 0 ? entries[0][0] : "support";
}

function renderPersonality() {
  if (!$("#personalitySummary")) return;
  const labels = {support:"Cariñoso y atento",avoidance:"Independiente, pero algo evasivo",flowers:"Romántico de las flores",generosity:"Generoso y detallista",courage:"Valiente y trabajador",humor:"Bromista profesional",panchoCare:"Mejor amigo de Pancho"};
  const trait = dominantTrait();
  $("#personalitySummary").textContent = labels[trait];
  const count = state.eventEngine.totalResolved || 0;
  $("#memoryInfluence").textContent = count ? `${count} decisiones ya influyen en sus pensamientos, cartas y eventos.` : "La historia apenas está comenzando.";
}

function eventPick(array, index, offset = 0) { return array[(index + offset) % array.length]; }
function fillEventText(text, index) {
  const memory = state.album.memories.at(-1)?.text;
  return text.replaceAll("{activity}",eventPick(EVENT_WORDS.activities,index)).replaceAll("{place}",eventPick(EVENT_WORDS.places,index,1)).replaceAll("{object}",eventPick(EVENT_WORDS.objects,index,2)).replaceAll("{romance}",eventPick(EVENT_WORDS.romances,index,3)).replaceAll("{panchoAction}",eventPick(EVENT_WORDS.panchoActions,index,4)).replaceAll("{rareFind}",eventPick(EVENT_WORDS.rareFinds,index,5)).replaceAll("{legendaryThing}",eventPick(EVENT_WORDS.legendaryThings,index,6)).replaceAll("{mythicThing}",eventPick(EVENT_WORDS.mythicThings,index,7)) + (memory && index % 5 === 0 ? ` Además, recordó: “${memory.slice(0,90)}”.` : "");
}

function generateLifeEvent(rarity, index) {
  const bank = EVENT_BANKS[rarity], title = eventPick(bank.titles,index), template = eventPick(bank.situations,index,2);
  const pools = {
    common:["practical","playful","work","rest","avoidant"], romantic:["supportive","flower","generous","avoidant","playful"], pancho:["pancho","practical","playful","generous","rest"],
    rare:["practical","generous","pancho","avoidant","work"], legendary:["supportive","generous","flower","pancho","work","rest"], mythical:["supportive","flower","generous","pancho","work","playful"]
  };
  let keys = pools[rarity].slice(0, 2 + (index % Math.min(5,pools[rarity].length)));
  const moodExtra = {inLove:"flower",tired:"rest",sensitive:"supportive",confident:"work",panchitoMode:"pancho"}[state.life.mood];
  if (moodExtra && !keys.includes(moodExtra) && keys.length < 6) keys.push(moodExtra);
  const options = keys.map((key, optionIndex) => ({...DECISION_ARCHETYPES[key], id:key, effects:{...DECISION_ARCHETYPES[key].effects}, result:`${DECISION_ARCHETYPES[key].result} ${optionIndex === 0 ? "El sistema guardó esa elección como parte de su personalidad." : ""}`}));
  return { id:`${rarity}-${index}`, rarity, icon:eventPick(bank.icons,index), title:`${title}${index % 7 === 0 ? ` · ${eventPick(EVENT_WORDS.places,index)}` : ""}`, description:fillEventText(template,index), options };
}

function rollLifeEventRarity() {
  if (state.panchito.mischief > 70 && Math.random() < .35) return "pancho";
  let roll = Math.random() * 1000, sum = 0;
  for (const [key,data] of Object.entries(EVENT_RARITIES)) { sum += data.weight; if (roll < sum) return key; }
  return "common";
}

function createPendingLifeEvent() {
  if (state.life.isDead || isReporterSleepingNow() || state.eventEngine.pending) return;
  const rarity = rollLifeEventRarity(), count = EVENT_CONTENT_COUNTS[rarity];
  const unseen = Array.from({length:count},(_,i)=>i).filter(i => !state.eventEngine.seenIds.includes(`${rarity}-${i}`));
  const index = randomFrom(unseen.length ? unseen : Array.from({length:count},(_,i)=>i));
  state.eventEngine.pending = generateLifeEvent(rarity,index);
  showLifeEventAlert(true); saveState();
}

function scheduleNextLifeEvent() {
  state.eventEngine.nextAt = Date.now() + 60000 + Math.floor(Math.random() * 120001);
  saveState();
}

function checkLifeEventSchedule() {
  if (state.life.isDead || isReporterSleepingNow() || getTimePeriod() === "late") { showLifeEventAlert(false); return; }
  if (state.eventEngine.pending) { showLifeEventAlert(true); return; }
  if (Date.now() >= Number(state.eventEngine.nextAt || 0)) createPendingLifeEvent();
}

function showLifeEventAlert(show) {
  const shouldShow = Boolean(show) && !isReporterSleepingNow();
  $("#lifeEventAlert")?.classList.toggle("hidden", !shouldShow);
}

function openPendingLifeEvent() {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  const event = state.eventEngine.pending; if (!event || state.life.isDead) return;
  $("#lifeEventRarity").textContent = EVENT_RARITIES[event.rarity].label;
  $("#lifeEventIcon").textContent = event.icon; $("#lifeEventTitle").textContent = event.title; $("#lifeEventDescription").textContent = event.description;
  $("#lifeEventIllustration").dataset.rarity = event.rarity;
  $("#lifeEventOptions").innerHTML = event.options.map((option,index) => {
    const effectText = Object.entries(option.effects).map(([key,value]) => `${value > 0 ? "+" : ""}${value} ${LIFE_STAT_INFO[key]?.label || (key === "money" ? "Dinero" : key === "memories" ? "Recuerdo" : key)}`).join(" · ");
    const unaffordable = option.effects.money < 0 && state.economy.coins < Math.abs(option.effects.money);
    return `<button data-life-event-option="${index}" ${unaffordable ? "disabled" : ""}><b>${escapeHTML(option.label)}</b><small>${escapeHTML(unaffordable ? "No hay suficiente dinero" : effectText)}</small></button>`;
  }).join("");
  showLifeEventAlert(false); openModal("lifeEventModal");
}

function resolveLifeEvent(index) {
  const event = state.eventEngine.pending, option = event?.options[index]; if (!event || !option) return;
  applyLifeEffects(option.effects); state.eventEngine.traits[option.trait] = (state.eventEngine.traits[option.trait] || 0) + 1;
  state.eventEngine.totalResolved++; state.eventEngine.rarityCounts[event.rarity] = (state.eventEngine.rarityCounts[event.rarity] || 0) + 1;
  if (!state.eventEngine.seenIds.includes(event.id)) state.eventEngine.seenIds.push(event.id);
  if (event.rarity === "mythical" && !state.eventEngine.unlockedMythics.includes(event.id)) {
    state.eventEngine.unlockedMythics.push(event.id); applyLifeEffects({money:50,happiness:5});
    if (!state.economy.unlockedOutfits.includes("legendary")) state.economy.unlockedOutfits.push("legendary");
    unlock("mythHunter"); grantNextGift("EVENTO MÍTICO"); toast("🌌","RECOMPENSA MÍTICA","$50 y atuendo legendario desbloqueados.");
  }
  const record = {eventId:event.id,title:event.title,choice:option.label,result:option.result,effects:option.effects,at:Date.now(),day:getGameDay(),rarity:event.rarity};
  state.eventEngine.decisions.push(record); state.eventEngine.decisions = state.eventEngine.decisions.slice(-500); state.eventEngine.history.push(record); state.eventEngine.history = state.eventEngine.history.slice(-300);
  addTimeline(event.icon, `${event.title}: ${option.result}`, EVENT_RARITIES[event.rarity].label);
  addJournalEntry(`${event.title}. ${option.result}`, "DECISIÓN", event.icon);
  if (option.memory || ["rare","legendary","mythical"].includes(event.rarity)) addAlbumMemory(`${event.title}: ${option.result}`, `EVENTO ${EVENT_RARITIES[event.rarity].label}`, event.icon, `life-event-${event.id}`);
  $("#eventResultIcon").textContent = event.icon; $("#eventResultTitle").textContent = option.label.replace(/^\S+\s/,""); $("#eventResultText").textContent = option.result;
  $("#eventResultEffects").innerHTML = Object.entries(option.effects).map(([key,value]) => `<span class="${value >= 0 ? "positive" : "negative"}">${value > 0 ? "+" : ""}${value} ${escapeHTML(LIFE_STAT_INFO[key]?.label || (key === "money" ? "Dinero" : "Recuerdo"))}</span>`).join("");
  state.eventEngine.pending = null; scheduleNextLifeEvent(); closeModal("lifeEventModal"); openModal("eventResultModal");
  if (state.eventEngine.totalResolved >= 50) unlock("eventExplorer");
  checkReporterLife(); render(); renderTimeline(); saveState();
}

const AUTONOMOUS_ACTIONS = [
  {icon:"📚",title:"Leyendo un libro",text:"El reporterito se sentó a leer un libro y recuperó motivación.",detail:"Leyendo junto al escritorio",effects:{motivation:4,energy:-1,fun:1},kind:"read",visual:"read",duration:[90,180]},
  {icon:"🎧",title:"Practicando como DJ",text:"El reporterito practicó una mezcla de DJ y se sintió inspirado.",detail:"Probando transiciones para la Directiva",effects:{fun:4,motivation:3,prestige:2,energy:-2},kind:"dj",visual:"dj",duration:[100,220]},
  {icon:"🎹",title:"Haciendo música",text:"El reporterito abrió su compu y empezó a hacer música.",detail:"Produciendo una canción pixelada",effects:{motivation:4,prestige:3,money:5,energy:-3},kind:"music",visual:"music",duration:[120,260]},
  {icon:"🐶",title:"Jugando con Pancho",text:"El reporterito jugó con Pancho sin que nadie se lo pidiera.",detail:"Corriendo con Pancho por el cuarto",effects:{pancho:5,fun:4,happiness:3,energy:-2},kind:"pancho",visual:"pancho",duration:[80,160]},
  {icon:"☕",title:"Preparando café",text:"El reporterito preparó café y volvió al escritorio con energía.",detail:"Café de oficina en proceso",effects:{energy:3,motivation:2,hunger:-1},kind:"coffee",visual:"coffee",duration:[60,120]},
  {icon:"🧹",title:"Ordenando la oficina",text:"El reporterito limpió el cuarto y se sintió más tranquilo.",detail:"Acomodando recuerdos y papeles",effects:{happiness:2,prestige:2,energy:-2},kind:"clean",visual:"clean",duration:[90,180]},
  {icon:"📷",title:"Viendo fotos de la Directiva",text:"El reporterito volvió a mirar una foto de la Directiva.",detail:"Recordando cosas bonitas",effects:{love:3,happiness:2,motivation:-1},kind:"photo",visual:"photo",duration:[60,150]},
  {icon:"✍️",title:"Escribiendo en su diario",text:"El reporterito escribió una página nueva en su diario.",detail:"Guardando pensamientos importantes",effects:{motivation:2,trust:1,energy:-1},kind:"write",visual:"working",duration:[80,170]},
  {icon:"🌹",title:"Preparando un regalo",text:"El reporterito usó $8 para preparar un regalo imaginario para la Directiva.",detail:"Buscando una sorpresa bonita",effects:{money:-8,love:4,memories:1},kind:"giftDirectiva",visual:"gift",duration:[90,190],requiresMoney:8},
  {icon:"🌌",title:"Viendo las estrellas",text:"El reporterito se quedó viendo las estrellas y pensó en la Directiva.",detail:"Mirando por la ventana",effects:{love:2,happiness:2,energy:-1},kind:"stars",visual:"stars",duration:[70,150],onlyNight:true},
  {icon:"😴",title:"Durmiendo",text:"El reporterito está dormido. Zzz...",detail:"De 12:00 a.m. a 8:00 a.m. no puede hacer acciones",effects:{energy:1},kind:"sleep",visual:"sleeping",duration:[300,600],sleepOnly:true}
];

function ensureAutonomousState() {
  if (!state.simulation) state.simulation = cloneDefaultState().simulation;
  if (!state.simulation.currentActivity || typeof state.simulation.currentActivity !== "object") state.simulation.currentActivity = null;
}

function activityByKind(kind) {
  return AUTONOMOUS_ACTIONS.find(action => action.kind === kind) || AUTONOMOUS_ACTIONS[0];
}

function getAvailableAutonomousActions() {
  if (isReporterSleepingNow()) return AUTONOMOUS_ACTIONS.filter(action => action.sleepOnly);
  const period = getTimePeriod();
  return AUTONOMOUS_ACTIONS.filter(action => {
    if (action.sleepOnly) return false;
    if (action.requiresMoney && (state.economy.coins || 0) < action.requiresMoney) return false;
    if (action.onlyNight && period !== "night") return false;
    return true;
  });
}

function startAutonomousActivity(action, catchUp = false) {
  if (!action || state.life.isDead) return;
  const durationSeconds = action.duration ? action.duration[0] + Math.floor(Math.random() * (action.duration[1] - action.duration[0] + 1)) : 120;
  state.simulation.currentActivity = {
    kind: action.kind,
    icon: action.icon,
    title: action.title,
    detail: action.detail,
    visual: action.visual,
    startedAt: Date.now(),
    endsAt: Date.now() + durationSeconds * 1000,
    text: action.text
  };
  if (!catchUp) {
    forceReporterVisual(action.visual);
    setMessage(action.kind === "sleep" ? "El reporterito está durmiendo. Zzz..." : `${action.icon} ${action.title}: ${action.detail}.`);
  }
  renderCurrentActivity();
}

function finishAutonomousActivity(catchUp = false) {
  ensureAutonomousState();
  const current = state.simulation.currentActivity;
  if (!current) return false;
  const action = activityByKind(current.kind);
  if (!action) { state.simulation.currentActivity = null; return false; }
  if (Date.now() < Number(current.endsAt || 0) && !catchUp) return false;
  applyLifeEffects(action.effects);
  addTimeline(action.icon, action.text, "VIDA AUTÓNOMA");
  addJournalEntry(action.text, "VIDA AUTÓNOMA", action.icon);
  state.simulation.autonomousActions++;
  if (action.kind === "work" || action.kind === "music" || action.kind === "dj") state.simulation.workSessions++;
  if (action.kind === "write") state.simulation.lettersWritten++;
  if (action.kind === "giftDirectiva") state.economy.giftsForDirectiva++;
  if (action.kind === "pancho") {
    state.panchito.plays = (Number(state.panchito.plays) || 0) + 1;
    state.panchito.happiness = clamp(state.panchito.happiness + 5);
  }
  state.simulation.currentActivity = null;
  if (!catchUp) {
    toast(action.icon, "ACTIVIDAD COMPLETADA", action.text);
    setMessage(action.text);
  }
  renderCurrentActivity();
  return true;
}

function renderCurrentActivity() {
  if (!$("#activityStatusCard")) return;
  ensureAutonomousState();
  const sleeping = isReporterSleepingNow();
  let current = state.simulation.currentActivity;
  if (state.life.isDead) {
    current = { icon:"×_×", title:"Fin de la vida", detail:"El reporterito necesita reiniciar su mundo.", endsAt:0, visual:"dead" };
  } else if (sleeping) {
    current = { icon:"😴", title:"Durmiendo", detail:"Zzz... De 12:00 a.m. a 8:00 a.m. no puede hacer acciones ni escenas.", endsAt: nextWakeTime().getTime(), visual:"sleeping" };
    forceReporterVisual("sleeping");
  } else if (!current) {
    current = { icon:"✨", title:"Esperando actividad", detail:"Pronto hará algo solo: leer, practicar DJ, producir música o jugar con Pancho.", endsAt:0, visual:"idle" };
  }
  $("#activityIcon").textContent = current.icon;
  $("#activityTitle").textContent = current.title;
  $("#activityDetail").textContent = current.detail;
  const remaining = Math.max(0, Math.ceil((Number(current.endsAt || 0) - Date.now()) / 1000));
  $("#activityTimer").textContent = remaining ? formatClock(remaining) : "AUTO";
  $("#activityStatusCard").dataset.kind = current.kind || (sleeping ? "sleep" : "idle");
}

function nextWakeTime(date = new Date()) {
  const wake = new Date(date);
  wake.setHours(8, 0, 0, 0);
  if (date.getHours() >= 8) wake.setDate(wake.getDate() + 1);
  return wake;
}

function formatClock(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function runAutonomousLife(catchUp = false) {
  if (state.life.isDead) return;
  ensureAutonomousState();
  if (isReporterSleepingNow()) {
    state.simulation.currentActivity = { kind:"sleep", icon:"😴", title:"Durmiendo", detail:"Zzz... De 12:00 a.m. a 8:00 a.m. no puede hacer acciones", visual:"sleeping", startedAt:Date.now(), endsAt:nextWakeTime().getTime(), text:"El reporterito durmió profundamente." };
    renderCurrentActivity();
    return;
  }
  if (state.simulation.currentActivity?.kind === "sleep") state.simulation.currentActivity = null;
  if (finishAutonomousActivity(catchUp)) saveState();
  const elapsed = Date.now() - Number(state.simulation.lastAutonomyAt || Date.now());
  const shouldStart = catchUp ? elapsed >= 180000 : elapsed >= 90000;
  if (!state.simulation.currentActivity && shouldStart) {
    const pool = getAvailableAutonomousActions();
    const action = randomFrom(pool.length ? pool : AUTONOMOUS_ACTIONS.filter(action => !action.sleepOnly));
    startAutonomousActivity(action, catchUp);
    state.simulation.lastAutonomyAt = Date.now();
  }
  renderCurrentActivity();
  saveState();
}

function updateOfficeLevel() {
  const thresholds = [0,15,30,45,60,75,90];
  const next = thresholds.reduce((level,value,index) => state.simulation.prestige >= value ? index + 1 : level,1);
  if (next > state.simulation.officeLevel) {
    state.simulation.officeLevel = next; addTimeline("🏢",`La oficina evolucionó al nivel ${next}.`,"CARRERA"); addAlbumMemory(`La oficina del reporterito llegó al nivel ${next}.`,"OFICINA","🏢",`office-${next}`);
    toast("🏢","OFICINA MEJORADA",`Nivel ${next} desbloqueado.`);
  }
}

function renderOffice() {
  if (!$("#officeVisual")) return;
  const level = Math.max(1,Number(state.simulation.officeLevel) || 1);
  const messages = ["El reporterito comenzó en una oficina pequeña, pero llena de ganas.","Una planta nueva acompaña sus jornadas.","Las fotos hicieron que la oficina se sintiera más suya.","Pancho ya tiene su propia cama de oficina.","Los recuerdos románticos llegaron a las paredes.","La oficina ahora parece de una publicación importante.","El reporterito dirige una oficina legendaria."];
  $("#officeLevel").textContent = level; $("#officeVisual").dataset.officeLevel = level; $("#officeMessage").textContent = messages[level-1];
  $("#roomScene").classList.toggle("office-tier-5",level>=5); $("#roomScene").classList.toggle("office-tier-7",level>=7);
  if (level >= 7) unlock("supremeDirector");
}

function renderLifeStore() {
  if (!$("#lifeStoreGrid")) return;
  $("#lifeStoreGrid").innerHTML = LIFE_STORE_ITEMS.map(item => {
    const owned = state.economy.ownedItems.includes(item.id), repeatable = item.type === "gift";
    return `<article class="store-item ${owned ? "owned" : ""}"><span>${item.icon}</span><b>${item.name}</b><small>${item.type === "gift" ? "Regalo con reacción única." : "Mejora permanente de esta vida."}</small><button data-store-item="${item.id}" ${owned && !repeatable ? "disabled" : ""}>${owned && !repeatable ? "Obtenido" : `$${item.cost}`}</button></article>`;
  }).join("");
}

function buyLifeStoreItem(id) {
  if (state.life.isDead) return;
  const item = LIFE_STORE_ITEMS.find(entry => entry.id === id); if (!item) return;
  if (state.economy.coins < item.cost) { toast("💰","DINERO INSUFICIENTE",`Faltan $${item.cost-state.economy.coins}.`); return; }
  if (item.type !== "gift" && state.economy.ownedItems.includes(id)) return;
  state.economy.coins -= item.cost;
  if (item.type !== "gift") { state.economy.ownedItems.push(id); applyLifeEffects({happiness:2,prestige:1}); addTimeline(item.icon,`El reporterito compró ${item.name.toLowerCase()} para su mundo.`,"COMPRA"); }
  else {
    const giftEffects = {giftBurger:{hunger:8,happiness:2},giftCoffee:{energy:5,motivation:2},giftFlower:{love:5,happiness:3},giftLetter:{love:4,trust:3},giftKiss:{love:3,fun:2}};
    applyLifeEffects(giftEffects[id] || {happiness:2});
    if (id === "giftFlower") rememberFirst("firstFlower","El reporterito recordó la primera flor que apareció en esta vida.");
    addTimeline(item.icon,`El reporterito recibió ${item.name.toLowerCase()} y tuvo una reacción imposible de ocultar.`,"REGALO"); react(`El reporterito recibió ${item.name.toLowerCase()} y lo guardó como un momento bonito.`,item.icon);
  }
  renderLifeStore(); renderGifts(); renderReporterLife(); saveState();
}

let activeMiniGame = null;
function startMiniGame(type) {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) return;
  const games = {kisses:["Atrapa tres besitos antes de tocar dos espacios vacíos.","💋"],hearts:["Encuentra tres corazones verdaderos.","💗"],pancho:["Encuentra a Pancho tres veces.","🐶"],coffee:["Entrega tres cafés por el camino correcto.","☕"]};
  if (!games[type]) return; activeMiniGame = {type,target:games[type][1],score:0,misses:0}; $("#miniGameTitle").textContent = games[type][0].split(".")[0]; $("#miniGamePrompt").textContent = games[type][0]; renderMiniGameRound(); openModal("miniGameModal");
}

function renderMiniGameRound() {
  if (!activeMiniGame) return;
  const targetIndex = Math.floor(Math.random()*12);
  $("#miniGameBoard").innerHTML = Array.from({length:12},(_,i)=>`<button data-minigame-cell="${i===targetIndex ? "target" : "empty"}">${i===targetIndex ? activeMiniGame.target : randomFrom(["·","✦","♡","?"])}</button>`).join("");
  $("#miniGameStatus").textContent = `Aciertos ${activeMiniGame.score}/3 · Fallos ${activeMiniGame.misses}/2`;
}

function playMiniGameCell(kind, button) {
  if (!activeMiniGame) return;
  if (kind === "target") { activeMiniGame.score++; button.classList.add("hit"); } else activeMiniGame.misses++;
  if (activeMiniGame.score >= 3 || activeMiniGame.misses >= 2) {
    const won = activeMiniGame.score >= 3, type = activeMiniGame.type; state.minigames.played++; if (won) state.minigames.wins++;
    state.minigames.bestScores[type] = Math.max(state.minigames.bestScores[type] || 0,activeMiniGame.score);
    if (won) { applyLifeEffects({money:8,fun:5,happiness:3}); addTimeline("🎮",`El reporterito ganó ${$("#miniGameTitle").textContent} y obtuvo $8.`,"MINIJUEGO"); $("#miniGameStatus").textContent = "¡Victoria! +$8 · +5 Diversión · +3 Felicidad"; }
    else { applyLifeEffects({fun:1,energy:-1}); $("#miniGameStatus").textContent = "Esta vez escaparon, pero el reporterito se divirtió."; }
    $("#miniGameBoard").innerHTML = ""; activeMiniGame = null; if (state.minigames.wins >= 20) unlock("gameMaster"); saveState(); return;
  }
  renderMiniGameRound();
}

/* Conversaciones tipo visual novel */
function renderNovelProgress() {
  if (!$("#novelCompletedCount")) return;
  $("#novelCompletedCount").textContent = state.novel.totalCompleted || 0;
}

function startNovelScene() {
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
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
  if (state.life.isDead) return;
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
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
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
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) { setMessage("Esta vida terminó y el chat comenzará desde cero con la siguiente generación."); return; }
  if (chatBusy) return;
  const text = CHAT_CATEGORIES[activeChatCategory][index];
  if (!text) return;
  const response = pickChatResponse(text);
  chatBusy = true;
  $("#chatComposer").classList.add("hidden");
  $("#anotherMessageButton").classList.add("hidden");
  appendChatBubble("directiva", text);

  state.chat.totalSent++;
  state.life.lastImportant.message = Date.now();
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
  if (state.life.isDead) return "muerto";
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

const moodLabel = mood => ({ enamorado: "ENAMORADO", feliz: "FELIZ", tranquilo: "TRANQUILO", triste: "TRISTE", "muy-triste": "MUY TRISTE", abrazos: "NECESITA ABRAZOS", esperando: "ESPERANDO MENSAJE", critico: "MODO CRÍTICO", muerto: "SIN VIDA", dormido: "DORMIDO", enfermo: "ENFERMO DE AMOR", atrevido: "MODO ATREVIDO" }[mood]);
const visualMood = mood => mood === "muerto" || mood === "critico" ? "muy-triste" : mood === "abrazos" || mood === "esperando" ? "triste" : mood === "enfermo" ? "enamorado" : mood;

function render(forceMessage = false) {
  checkReporterLife();
  const dead = state.life.isDead;
  if (!dead) { updateLifeMood(); updateHeartWeather(); }
  renderLifeStatus();
  Object.entries(state.stats).forEach(([key, value]) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    element.querySelector("b").textContent = `${clamp(value)}%`;
    element.querySelector(".stat-fill").style.width = `${clamp(value)}%`;
    element.classList.toggle("low", value < 30);
    element.classList.toggle("medium", value >= 30 && value < 55);
  });
  const newMood = determineMood();
  if (!dead && currentMood === "critico" && newMood !== "critico") {
    state.life.criticalRecoveries = (Number(state.life.criticalRecoveries) || 0) + 1;
    addJournalEntry("El reporterito salió del modo crítico gracias al cuidado recibido.", "RECUPERACIÓN", "🛟");
    unlock("savedReporter");
  }
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
  renderDirectiva();
  renderReporterLife();
  renderWeather(viewMood);
  renderAchievements();
  if (!dead) { checkAchievements(); checkLifeAchievements(); }
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
  hug: () => { applyCareStats({ hugs: 5, energy: 2 }); applyLifeEffects({happiness:2,love:1}); state.life.lastImportant.hug=Date.now(); state.counts.hugs++; addTreeXP(1); rememberFirst("firstHug", "El reporterito recordó el primer abrazo que recibió en su mundo."); unlock("firstHug"); if (state.counts.hugs >= 10) unlock("spoiled"); if (state.counts.hugs >= 100) unlock("hundredHugs"); react("El reporterito recibió un abrazo pequeño pero poderoso.", "🫂"); },
  message: () => { applyCareStats({ messages: 4, affection: 1 }); addTreeXP(1); openChat(); },
  love: () => { applyCareStats({ affection: 6, trust: 2 }); applyLifeEffects({happiness:2}); addTreeXP(2); rememberFirst("firstLove", "El reporterito todavía recuerda el primer ‘te amo’ de la Directiva."); unlock("teAmo"); react("El reporterito se puso rojo y guardó cada palabra.", "💘"); },
  piojito: () => { applyCareStats({ affection: 4, hugs: 3, trust: 3 }); state.counts.piojitos++; addTreeXP(1); react("El reporterito recibió piojito y respiró más tranquilo.", "✨"); },
  visit: () => { applyCareStats({ hugs: 10, affection: 8, attention: 6, messages: 6, energy: 8, trust: 6 }); applyLifeEffects({happiness:4,motivation:2,fun:2}); state.life.lastImportant.visit=Date.now(); addTreeXP(3); summonDirectiva("visit", true); addJournalEntry("El reporterito recibió una visita y el cuarto se sintió menos vacío.", "VISITA DE LA DIRECTIVA", "🚪"); addTimeline("🚪","La Directiva visitó al reporterito y cambió el tono de todo el día.","VISITA"); unlock("present"); react("¡LA DIRECTIVA ESTÁ AQUÍ! El reporterito recuperó estabilidad.", "🚪", 18); },
  burger: () => { applyCareStats({ energy: 7, affection: 1 }); applyLifeEffects({hunger:10,happiness:2}); state.life.lastImportant.burger=Date.now(); addTreeXP(1); rememberFirst("firstBurger", "El reporterito recordó la primera hamburguesa salvadora."); unlock("burger"); react("El reporterito recibió hamburguesa y recuperó energía.", "🍔"); },
  reward: openReward
};

function handleAction(action) {
  if (!actionMap[action]) return;
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) { setMessage("El reporterito necesita comenzar una nueva vida antes de recibir cuidados."); return; }
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
  const sleeping = isReporterSleepingNow();
  document.querySelectorAll("[data-action]").forEach(button => {
    const remaining = (actionCooldowns[button.dataset.action] || 0) - Date.now();
    button.disabled = sleeping;
    button.classList.toggle("cooling", remaining > 0 || sleeping);
    if (sleeping) button.dataset.cooldown = "Zzz";
    else if (remaining > 0) button.dataset.cooldown = `${Math.ceil(remaining / 1000)}s`;
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
  rememberFirst("firstAchievement", `El reporterito recordó su primer logro: ${info[1]}.`);
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
  if (state.counts.hugs >= 100) unlock("hundredHugs");
  if (state.stats.affection >= 98 && state.simulation.happiness >= 90) unlock("infiniteLove");
  if ((state.eventEngine.traits.support || 0) >= 20 && state.life.visitDates.length >= 7) unlock("bestDirector");
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
  if (state.life.isDead || currentEvent || document.visibilityState === "hidden" || anyModalOpen()) return;
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
  if (isReporterSleepingNow()) { sleepBlockedMessage(); return; }
  if (state.life.isDead) return;
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
  updateCooldownButtons();
  renderCurrentActivity();
}

function decay() {
  if (state.life.isDead) { renderLifeCounter(); return; }
  const sleeping = isReporterSleepingNow();
  const lossPerTick = sleeping ? 6 / (3600000 / 5000) : 5 / ((20 * 60 * 1000) / 5000);
  const criticalMultiplier = isCritical() ? 1.08 : 1;
  Object.keys(state.stats).forEach(key => {
    state.stats[key] = Math.max(0, state.stats[key] - lossPerTick * criticalMultiplier);
  });
  ["hunger", "happiness", "motivation", "fun", "prestige"].forEach(key => {
    state.simulation[key] = Math.max(0, state.simulation[key] - lossPerTick * criticalMultiplier);
  });
  ["hunger", "energy", "happiness", "friendship"].forEach(key => {
    state.panchito[key] = Math.max(0, state.panchito[key] - lossPerTick * criticalMultiplier);
  });
  decayCycles++;
  if (sleeping) {
    showLifeEventAlert(false);
    if (decayCycles % 12 === 0) setMessage("El reporterito está durmiendo. Zzz... De 12:00 a.m. a 8:00 a.m. no puede hacer acciones ni abrir escenas.");
  } else {
    checkLifeEventSchedule();
  }
  state.panchito.mischief = clamp(state.panchito.mischief + (state.panchito.hunger < 30 ? .005 : -.001));
  render();
}

document.addEventListener("click", event => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) handleAction(actionButton.dataset.action);
  const choiceButton = event.target.closest("[data-choice]");
  if (choiceButton) resolveEvent(Number(choiceButton.dataset.choice));
  const closeButton = event.target.closest("[data-close]");
  if (closeButton) { closeModal(closeButton.dataset.close); if (closeButton.dataset.close === "lifeEventModal" && state.eventEngine.pending) showLifeEventAlert(true); }
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
  const outfitButton = event.target.closest("[data-outfit]");
  if (outfitButton) buyOrEquipOutfit(outfitButton.dataset.outfit);
  const worldSceneChoice = event.target.closest("[data-world-scene-choice]");
  if (worldSceneChoice) resolveWorldScene(Number(worldSceneChoice.dataset.worldSceneChoice));
  const lifeEventOption = event.target.closest("[data-life-event-option]");
  if (lifeEventOption) resolveLifeEvent(Number(lifeEventOption.dataset.lifeEventOption));
  const storeItem = event.target.closest("[data-store-item]");
  if (storeItem) buyLifeStoreItem(storeItem.dataset.storeItem);
  const miniGame = event.target.closest("[data-minigame]");
  if (miniGame) startMiniGame(miniGame.dataset.minigame);
  const miniGameCell = event.target.closest("[data-minigame-cell]");
  if (miniGameCell) playMiniGameCell(miniGameCell.dataset.minigameCell,miniGameCell);
  const directivaAction = event.target.closest("[data-directiva-action]");
  if (directivaAction) chooseDirectivaInteraction(Number(directivaAction.dataset.directivaAction));
  if (event.target.closest("[data-directiva-call]")) makeDirectivaCall();
  if (event.target.closest("[data-directiva-date]")) startDirectivaDate();
});

$("#pet").addEventListener("click", tapPet);
$("#helpButton").addEventListener("click", () => openModal("helpModal"));
$("#anotherMessageButton").addEventListener("click", showChatComposer);
$("#novelButton").addEventListener("click", () => { closeModal("chatModal"); startNovelScene(); });
$("#nextNovelButton").addEventListener("click", startNovelScene);
$("#panchito").addEventListener("click", () => handlePanchitoAction("pet"));
$("#directivaCharacter")?.addEventListener("click", openDirectivaPanel);
$("#newThoughtButton").addEventListener("click", () => showRandomThought(true));
$("#restartLifeButton").addEventListener("click", restartReporterLife);
$("#lifeEventAlert").addEventListener("click", openPendingLifeEvent);
$("#resetGameButton").addEventListener("click", () => {
  if (resetArmed) { resetGame(); return; }
  resetArmed = true; $("#resetGameButton").classList.add("confirming");
  $("#resetGameButton").textContent = "Confirmar: borrar todo el mundo";
  setTimeout(() => { resetArmed = false; $("#resetGameButton").classList.remove("confirming"); $("#resetGameButton").textContent = "Reiniciar mundo (protegido)"; }, 6000);
});
document.querySelectorAll(".modal-backdrop").forEach(modal => modal.addEventListener("click", event => { if (event.target === modal && modal.id !== "eventModal") { closeModal(modal.id); if (modal.id === "lifeEventModal" && state.eventEngine.pending) showLifeEventAlert(true); } }));
document.addEventListener("keydown", event => { if (event.key === "Escape") document.querySelectorAll(".modal-backdrop:not(.hidden)").forEach(modal => { if (modal.id !== "eventModal") closeModal(modal.id); }); });
window.addEventListener("beforeunload", () => { if (!hardResetInProgress) saveState(); });

buildInterface(); updateClock();
setInterval(updateClock, 30000);
setInterval(decay, 5000);
setInterval(updateCooldownButtons, 250);
setInterval(showTreeAmbientMessage, 28000);
setInterval(cyclePanchitoBehavior, 12000);
setTimeout(showPanchitoEvent, 45000);
setInterval(showPanchitoEvent, 90000);
setTimeout(showContextualWorldScene, 18000);
setInterval(showContextualWorldScene, 80000);
setTimeout(maybeShowSpontaneousLetter, 120000);
setInterval(maybeShowSpontaneousLetter, 180000);
setInterval(() => {
  if (!currentEvent) {
    setMessage(randomFrom(ambientMessages)); state.counts.thoughts++; checkAchievements(); saveState();
  }
}, 24000);
setInterval(checkLifeEventSchedule, 10000);
setInterval(() => runAutonomousLife(false), 30000);
setInterval(renderCurrentActivity, 1000);

setInterval(maybeDirectivaVisit, 30000);
setInterval(() => { if (!state.life.isDead && getTimePeriod() === "late") handleDreamCycle(); }, 60000);
