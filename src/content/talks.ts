// Talk library, ported from prototype/index.html (TALKS + ES).
// Content is data: changing wording means a new version, and saved records keep the version that was read.
// Spanish is "draft" until a native speaker who knows jobsite safety reviews it (see CLAUDE.md).
import type { Talk } from "@/core/talks";

export const TALKS: Talk[] = [
  {
    "id": "fall",
    "industries": [
      "con"
    ],
    "code": "1926.501",
    "minutes": 6,
    "content": {
      "en": {
        "title": "Fall Protection",
        "hook": "Falls are the number one killer in construction. There's no such thing as \"just a quick trip to the edge.\"",
        "sections": [
          {
            "heading": "The rule",
            "items": [
              "If you're 6 feet or more above a lower level, you need fall protection. That's the federal construction line.",
              "That can be a guardrail, a safety net, or a personal fall arrest system. Your supervisor will tell you which one this job uses."
            ]
          },
          {
            "heading": "Before you clip in",
            "items": [
              "Inspect your harness every time: frayed webbing, cracked buckles, a deployed impact indicator. Any of those and it goes out of service today.",
              "Anchor point rated for 5,000 lbs per worker, or designed by a qualified person. A vent pipe is not an anchor.",
              "Check your clearance. A 6-foot lanyard can need nearly 18 feet below you before it stops you."
            ]
          },
          {
            "heading": "Holes and skylights",
            "items": [
              "Every hole over 2 inches gets covered, secured, and marked HOLE or COVER.",
              "Skylights are holes. People fall through them every year."
            ]
          }
        ],
        "ask": "Who knows where today's anchor points and edge protection are? Point them out before we start."
      },
      "es": {
        "title": "Protección contra caídas",
        "hook": "Las caídas son la causa número uno de muertes en la construcción. No existe tal cosa como \"solo una vueltita rápida al borde\".",
        "sections": [
          {
            "heading": "La regla",
            "items": [
              "Si estás a 6 pies o más sobre un nivel más bajo, necesitas protección contra caídas. Esa es la regla federal para la construcción.",
              "Puede ser una baranda, una red de seguridad o un sistema personal de detención de caídas. Tu supervisor te dirá cuál se usa en este trabajo."
            ]
          },
          {
            "heading": "Antes de engancharte",
            "items": [
              "Revisa tu arnés cada vez: correas deshilachadas, hebillas rotas o un indicador de impacto activado. Si tiene cualquiera de esas, se saca de servicio hoy.",
              "El punto de anclaje debe aguantar 5,000 libras por trabajador, o estar diseñado por una persona calificada. Un tubo de ventilación no es un anclaje.",
              "Revisa el espacio libre. Una línea de 6 pies puede necesitar casi 18 pies debajo de ti para detenerte."
            ]
          },
          {
            "heading": "Huecos y tragaluces",
            "items": [
              "Todo hueco de más de 2 pulgadas se cubre, se asegura y se marca HOLE o COVER (hueco o tapa).",
              "Los tragaluces son huecos. Cada año hay gente que se cae a través de ellos."
            ]
          }
        ],
        "ask": "¿Quién sabe dónde están hoy los puntos de anclaje y la protección de bordes? Señálenlos antes de empezar."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "heat",
    "industries": [
      "all"
    ],
    "code": "HEAT",
    "minutes": 5,
    "content": {
      "en": {
        "title": "Heat Illness: Water, Rest, Shade",
        "hook": "Roofs, attics, pavement and enclosed spaces can run far hotter than the air temperature. Heat illness can take down the strongest person on the crew.",
        "sections": [
          {
            "heading": "Water, rest, shade",
            "items": [
              "Drink about a cup of water every 15 to 20 minutes, even if you're not thirsty.",
              "Take breaks in the shade. Longer breaks as the heat index climbs.",
              "New or returning workers need about a week to build up to full workload. Most heat deaths happen in the first few days."
            ]
          },
          {
            "heading": "Know the signs",
            "items": [
              "Heat exhaustion: heavy sweating, dizziness, headache, cramps, nausea. Move them to shade, cool them down, give water.",
              "Heat stroke: confusion, slurred speech, passing out, hot skin, seizures. This is a 911 call. Cool them with water and ice while you wait."
            ]
          },
          {
            "heading": "Look out for each other",
            "items": [
              "People with heat stroke often don't know they're in trouble. Watch your partner."
            ]
          }
        ],
        "ask": "Where's the water and shade on this job today, and who's calling 911 if we need it?"
      },
      "es": {
        "title": "Enfermedades por calor: agua, descanso y sombra",
        "hook": "Los techos, áticos, el pavimento y los espacios cerrados pueden estar mucho más calientes que el aire. El calor puede tumbar hasta al más fuerte del equipo.",
        "sections": [
          {
            "heading": "Agua, descanso y sombra",
            "items": [
              "Toma más o menos una taza de agua cada 15 a 20 minutos, aunque no tengas sed.",
              "Descansa en la sombra. Los descansos deben ser más largos cuando sube el índice de calor.",
              "Los trabajadores nuevos o que regresan necesitan como una semana para acostumbrarse a la carga completa. La mayoría de las muertes por calor pasan en los primeros días."
            ]
          },
          {
            "heading": "Conoce las señales",
            "items": [
              "Agotamiento por calor: sudor abundante, mareo, dolor de cabeza, calambres, náuseas. Llévalo a la sombra, refréscalo y dale agua.",
              "Golpe de calor: confusión, habla arrastrada, desmayo, piel caliente, convulsiones. Esto es para llamar al 911. Enfríalo con agua y hielo mientras esperas."
            ]
          },
          {
            "heading": "Cuídense entre todos",
            "items": [
              "Quien sufre un golpe de calor muchas veces no se da cuenta. Vigila a tu compañero."
            ]
          }
        ],
        "ask": "¿Dónde están el agua y la sombra hoy, y quién llama al 911 si hace falta?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "ladder",
    "industries": [
      "con"
    ],
    "code": "1926.1053",
    "minutes": 5,
    "content": {
      "en": {
        "title": "Ladder Setup and Use",
        "hook": "Most ladder falls happen getting on or off at the top, not from way up high.",
        "sections": [
          {
            "heading": "Setup",
            "items": [
              "Extend the ladder at least 3 feet above the landing so you have something to grab.",
              "Use the 4-to-1 rule: for every 4 feet up, the base goes 1 foot out.",
              "Secure it at the top. Firm, level footing at the bottom."
            ]
          },
          {
            "heading": "Climbing",
            "items": [
              "Face the ladder and keep three points of contact.",
              "No carrying bundles in your hands. Use a hoist or a hand line.",
              "Stay off the top step of a stepladder, and keep metal ladders away from power lines."
            ]
          },
          {
            "heading": "Inspect it",
            "items": [
              "Broken rungs, bent rails, missing feet: tag it out and get it off the job."
            ]
          }
        ],
        "ask": "Who set up the ladder today? Let's check it together before anyone climbs."
      },
      "es": {
        "title": "Instalación y uso de escaleras",
        "hook": "La mayoría de las caídas de escalera pasan al subir o bajar en la parte de arriba, no desde muy alto.",
        "sections": [
          {
            "heading": "Instalación",
            "items": [
              "Extiende la escalera por lo menos 3 pies sobre el nivel de llegada para tener de dónde agarrarte.",
              "Usa la regla de 4 a 1: por cada 4 pies de altura, la base va 1 pie hacia afuera.",
              "Asegúrala arriba. Abajo, que quede en suelo firme y nivelado."
            ]
          },
          {
            "heading": "Al subir",
            "items": [
              "Mira hacia la escalera y mantén tres puntos de contacto.",
              "No subas con bultos en las manos. Usa un polipasto o una cuerda.",
              "No te pares en el último escalón de una escalera de tijera, y mantén las escaleras de metal lejos de las líneas eléctricas."
            ]
          },
          {
            "heading": "Revísala",
            "items": [
              "Peldaños rotos, rieles doblados, patas faltantes: márcala fuera de servicio y sácala del trabajo."
            ]
          }
        ],
        "ask": "¿Quién instaló la escalera hoy? Revisémosla juntos antes de que alguien suba."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "loto",
    "industries": [
      "mfg"
    ],
    "code": "1910.147",
    "minutes": 6,
    "content": {
      "en": {
        "title": "Lockout/Tagout",
        "hook": "Machines that start up during cleaning or repair cause amputations and deaths every year. A lock is the only thing that keeps the power off while you're inside.",
        "sections": [
          {
            "heading": "Six steps",
            "items": [
              "Tell the operators the machine is going down.",
              "Shut it down the normal way.",
              "Isolate every energy source: electrical, air, hydraulic, gravity, steam.",
              "Put your own lock and tag on each isolation point.",
              "Release stored energy. Bleed air lines, block raised parts, discharge capacitors.",
              "Verify. Try to start it. Nothing should move."
            ]
          },
          {
            "heading": "The rules that don't bend",
            "items": [
              "One person, one lock. If three people are working on it, there are three locks.",
              "Only the person who put the lock on takes it off.",
              "Never rely on an e-stop or a switch someone else is watching."
            ]
          }
        ],
        "ask": "Which machine on this floor has more than one energy source? Walk us through where they are."
      },
      "es": {
        "title": "Bloqueo y etiquetado (Lockout/Tagout)",
        "hook": "Las máquinas que arrancan durante una limpieza o reparación causan amputaciones y muertes cada año. Un candado es lo único que mantiene la energía apagada mientras estás adentro.",
        "sections": [
          {
            "heading": "Seis pasos",
            "items": [
              "Avisa a los operadores que la máquina se va a apagar.",
              "Apágala de la forma normal.",
              "Aísla todas las fuentes de energía: eléctrica, aire, hidráulica, gravedad, vapor.",
              "Pon tu propio candado y etiqueta en cada punto de aislamiento.",
              "Libera la energía acumulada. Purga las líneas de aire, bloquea las piezas levantadas, descarga los capacitores.",
              "Verifica. Intenta arrancarla. Nada debe moverse."
            ]
          },
          {
            "heading": "Reglas que no se doblan",
            "items": [
              "Una persona, un candado. Si tres personas trabajan en ella, hay tres candados.",
              "Solo quien puso el candado lo quita.",
              "Nunca confíes en un paro de emergencia o un interruptor que otra persona está vigilando."
            ]
          }
        ],
        "ask": "¿Qué máquina de este piso tiene más de una fuente de energía? Explícanos dónde están."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "guard",
    "industries": [
      "mfg"
    ],
    "code": "1910.212",
    "minutes": 4,
    "content": {
      "en": {
        "title": "Machine Guarding",
        "hook": "Guards are there because a machine moves faster than you can pull your hand back.",
        "sections": [
          {
            "heading": "Guards stay on",
            "items": [
              "Never remove, bypass or tape over a guard or interlock.",
              "If a guard is missing or damaged, stop and report it before you run the machine."
            ]
          },
          {
            "heading": "Around moving parts",
            "items": [
              "No loose sleeves, gloves near rotating parts, jewelry, or loose long hair.",
              "Never reach around, over or under a guard.",
              "Jammed? Lock it out before you clear it. Every time."
            ]
          }
        ],
        "ask": "Has anyone seen a guard propped open or missing this week? Where?"
      },
      "es": {
        "title": "Guardas de máquinas",
        "hook": "Las guardas existen porque una máquina se mueve más rápido de lo que puedes retirar la mano.",
        "sections": [
          {
            "heading": "Las guardas se quedan puestas",
            "items": [
              "Nunca quites, puentees ni tapes con cinta una guarda o un interruptor de seguridad.",
              "Si falta una guarda o está dañada, detente y repórtalo antes de usar la máquina."
            ]
          },
          {
            "heading": "Cerca de piezas en movimiento",
            "items": [
              "Nada de mangas sueltas, guantes cerca de piezas que giran, joyas ni pelo largo suelto.",
              "Nunca metas la mano alrededor, por encima ni por debajo de una guarda.",
              "¿Se atoró? Bloquéala antes de destrabarla. Siempre."
            ]
          }
        ],
        "ask": "¿Alguien ha visto esta semana una guarda abierta o que falte? ¿Dónde?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hazcom",
    "industries": [
      "ag",
      "mfg"
    ],
    "code": "1910.1200",
    "minutes": 5,
    "content": {
      "en": {
        "title": "Chemical Labels and SDS",
        "hook": "Every chemical on site comes with instructions for staying safe. Most people never read them.",
        "sections": [
          {
            "heading": "Read before you handle",
            "items": [
              "Check the label: the signal word, the pictograms, and the PPE it calls for.",
              "Know where the Safety Data Sheets are kept. Section 4 tells you first aid, Section 8 tells you PPE."
            ]
          },
          {
            "heading": "Handling",
            "items": [
              "Never move a chemical into an unlabeled container. Drink bottles are the worst offender.",
              "Know where the nearest eyewash and water are before you open anything.",
              "Wash your hands before you eat, drink or smoke."
            ]
          }
        ],
        "ask": "Where are the SDS binders and the eyewash station from where we're standing?"
      },
      "es": {
        "title": "Etiquetas de químicos y hojas SDS",
        "hook": "Cada químico en el trabajo viene con instrucciones para usarlo con seguridad. La mayoría de la gente nunca las lee.",
        "sections": [
          {
            "heading": "Lee antes de usar",
            "items": [
              "Revisa la etiqueta: la palabra de advertencia, los pictogramas y el equipo de protección que pide.",
              "Sabe dónde están las Hojas de Datos de Seguridad (SDS). La Sección 4 dice los primeros auxilios y la Sección 8 dice el equipo de protección."
            ]
          },
          {
            "heading": "Manejo",
            "items": [
              "Nunca pases un químico a un envase sin etiqueta. Las botellas de bebida son lo peor.",
              "Sabe dónde están el lavaojos y el agua más cercanos antes de abrir cualquier cosa.",
              "Lávate las manos antes de comer, beber o fumar."
            ]
          }
        ],
        "ask": "Desde donde estamos, ¿dónde están las carpetas SDS y el lavaojos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "nh3",
    "industries": [
      "ag"
    ],
    "code": "1910.111",
    "minutes": 6,
    "content": {
      "en": {
        "title": "Anhydrous Ammonia Safety",
        "hook": "Anhydrous ammonia pulls water out of whatever it touches, including your eyes, skin and lungs. Seconds matter.",
        "sections": [
          {
            "heading": "Gear up",
            "items": [
              "Chemical splash goggles and ammonia-rated gloves, every time you connect or disconnect.",
              "Stand upwind when you open valves or break connections."
            ]
          },
          {
            "heading": "Before you hook up",
            "items": [
              "Inspect hoses, valves and couplers. Cracks, bulges or a strong smell mean stop.",
              "Bleed pressure from hoses before you disconnect.",
              "Carry clean water on the tank and on you."
            ]
          },
          {
            "heading": "If you're exposed",
            "items": [
              "Flush with water right away for at least 15 minutes. Remove clothing that got hit.",
              "Get medical help. Eye exposure always gets checked by a doctor."
            ]
          }
        ],
        "ask": "Where's the water on this rig, and how much is in it right now?"
      },
      "es": {
        "title": "Seguridad con amoníaco anhidro",
        "hook": "El amoníaco anhidro le saca el agua a todo lo que toca, incluyendo tus ojos, tu piel y tus pulmones. Los segundos cuentan.",
        "sections": [
          {
            "heading": "Equípate",
            "items": [
              "Gafas contra salpicaduras químicas y guantes aptos para amoníaco, cada vez que conectes o desconectes.",
              "Colócate del lado de donde viene el viento cuando abras válvulas o desconectes."
            ]
          },
          {
            "heading": "Antes de conectar",
            "items": [
              "Revisa mangueras, válvulas y acoples. Grietas, abultamientos o un olor fuerte significan alto.",
              "Libera la presión de las mangueras antes de desconectar.",
              "Lleva agua limpia en el tanque y contigo."
            ]
          },
          {
            "heading": "Si te expones",
            "items": [
              "Enjuágate con agua de inmediato por lo menos 15 minutos. Quítate la ropa que haya recibido el químico.",
              "Busca atención médica. Si fue en los ojos, siempre debe revisarlo un médico."
            ]
          }
        ],
        "ask": "¿Dónde está el agua en este equipo y cuánta tiene ahora mismo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "fork",
    "industries": [
      "wh",
      "mfg"
    ],
    "code": "1910.178",
    "minutes": 5,
    "content": {
      "en": {
        "title": "Forklift Safety",
        "hook": "Forklifts weigh several tons and the operator can't always see you.",
        "sections": [
          {
            "heading": "Operators",
            "items": [
              "Only trained and evaluated operators drive. Evaluations repeat at least every 3 years.",
              "Do a pre-shift check: forks, chains, tires, horn, brakes, leaks.",
              "Wear the seatbelt. If it tips, stay in the seat, hold on, and lean away from the fall."
            ]
          },
          {
            "heading": "Everyone else",
            "items": [
              "Make eye contact with the driver before you walk into their path.",
              "No riders. Nobody stands on the forks.",
              "Parked means forks down, controls neutral, brake set."
            ]
          }
        ],
        "ask": "Where are the blind corners in this building?"
      },
      "es": {
        "title": "Seguridad con montacargas",
        "hook": "Los montacargas pesan varias toneladas y el operador no siempre te puede ver.",
        "sections": [
          {
            "heading": "Operadores",
            "items": [
              "Solo manejan operadores entrenados y evaluados. Las evaluaciones se repiten por lo menos cada 3 años.",
              "Haz la revisión antes del turno: horquillas, cadenas, llantas, claxon, frenos, fugas.",
              "Usa el cinturón. Si se vuelca, quédate en el asiento, agárrate fuerte e inclínate hacia el lado contrario de la caída."
            ]
          },
          {
            "heading": "Todos los demás",
            "items": [
              "Haz contacto visual con el operador antes de cruzar por su camino.",
              "No se lleva a nadie de pasajero. Nadie se para en las horquillas.",
              "Estacionado significa horquillas abajo, controles en neutral y freno puesto."
            ]
          }
        ],
        "ask": "¿Dónde están las esquinas ciegas en este edificio?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "lift",
    "industries": [
      "wh",
      "con",
      "ag"
    ],
    "code": "ERGO",
    "minutes": 4,
    "content": {
      "en": {
        "title": "Lifting Without Getting Hurt",
        "hook": "Back injuries are among the most common injuries on the job, and they can follow you for life.",
        "sections": [
          {
            "heading": "Plan the lift",
            "items": [
              "Check the weight first. Heavy or awkward means get help or use equipment.",
              "Clear your path before you pick it up."
            ]
          },
          {
            "heading": "Do the lift",
            "items": [
              "Feet apart, bend your knees, keep your back straight.",
              "Keep the load close to your body.",
              "Don't twist. Turn your feet instead."
            ]
          }
        ],
        "ask": "What's the heaviest thing we'll move today, and how are we moving it?"
      },
      "es": {
        "title": "Cargar sin lastimarte",
        "hook": "Las lesiones de espalda están entre las más comunes en el trabajo, y te pueden seguir toda la vida.",
        "sections": [
          {
            "heading": "Planea la carga",
            "items": [
              "Revisa el peso primero. Si es pesado o incómodo, pide ayuda o usa equipo.",
              "Despeja tu camino antes de levantarlo."
            ]
          },
          {
            "heading": "Al levantar",
            "items": [
              "Pies separados, dobla las rodillas, espalda recta.",
              "Mantén la carga cerca del cuerpo.",
              "No gires la cintura. Mejor mueve los pies."
            ]
          }
        ],
        "ask": "¿Qué es lo más pesado que vamos a mover hoy y cómo lo vamos a mover?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "cold",
    "industries": [
      "all"
    ],
    "code": "COLD",
    "minutes": 5,
    "content": {
      "en": {
        "title": "Cold Stress",
        "hook": "Cold doesn't have to mean snow. Wind, rain and wet clothes can pull heat out of your body even on a mild day.",
        "sections": [
          {
            "heading": "Dress for it",
            "items": [
              "Wear layers you can take off as you warm up. Cotton next to the skin stays wet; synthetics and wool don't.",
              "Cover your head, hands and feet. Keep a dry pair of socks and gloves in the truck.",
              "Wind makes it colder than the thermometer says."
            ]
          },
          {
            "heading": "Know the signs",
            "items": [
              "Frostbite: numb, white or grayish skin on fingers, toes, ears or nose. Warm it slowly. Don't rub it.",
              "Hypothermia: uncontrolled shivering, then confusion, slurred speech, clumsiness and drowsiness. Call 911, get them somewhere warm, and swap wet clothes for dry ones."
            ]
          },
          {
            "heading": "On the job",
            "items": [
              "Take warm-up breaks somewhere out of the wind.",
              "Warm, sweet drinks help. Skip alcohol; it makes you lose heat faster."
            ]
          }
        ],
        "ask": "Where can we warm up today, and who has spare dry gloves?"
      },
      "es": {
        "title": "Estrés por frío",
        "hook": "El frío no tiene que ser nieve. El viento, la lluvia y la ropa mojada pueden sacarle el calor a tu cuerpo hasta en un día templado.",
        "sections": [
          {
            "heading": "Vístete para el frío",
            "items": [
              "Usa capas que te puedas quitar cuando entres en calor. El algodón pegado a la piel se queda mojado; la lana y las telas sintéticas no.",
              "Cúbrete la cabeza, las manos y los pies. Deja un par de calcetines y guantes secos en la camioneta.",
              "El viento hace que se sienta más frío de lo que marca el termómetro."
            ]
          },
          {
            "heading": "Conoce las señales",
            "items": [
              "Congelación: piel entumecida, blanca o grisácea en dedos, orejas o nariz. Caliéntala despacio. No la frotes.",
              "Hipotermia: temblor que no se controla, luego confusión, habla arrastrada, torpeza y sueño. Llama al 911, llévalo a un lugar caliente y cámbiale la ropa mojada por ropa seca."
            ]
          },
          {
            "heading": "En el trabajo",
            "items": [
              "Toma descansos para calentarte en un lugar sin viento.",
              "Las bebidas calientes y dulces ayudan. Evita el alcohol; hace que pierdas calor más rápido."
            ]
          }
        ],
        "ask": "¿Dónde podemos calentarnos hoy y quién tiene guantes secos de repuesto?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "fatigue",
    "industries": [
      "all"
    ],
    "code": "HEALTH",
    "minutes": 4,
    "content": {
      "en": {
        "title": "Fatigue and Sleep",
        "hook": "Being awake 17 to 19 hours can slow you down about as much as having a couple of drinks. Tired people get hurt.",
        "sections": [
          {
            "heading": "The basics",
            "items": [
              "Most adults need at least 7 hours of sleep. Long shifts and early starts eat into that fast.",
              "Eat real food and drink water through the day. Energy drinks wear off right when you need focus."
            ]
          },
          {
            "heading": "On the job",
            "items": [
              "Watch for nodding off, missed steps, or short tempers in yourself and others.",
              "Save the riskiest work for when you're sharpest, not the end of a long shift.",
              "If you're too tired to drive home safely, say so. That's a safety call, not a weakness."
            ]
          }
        ],
        "ask": "Who's coming off a long stretch of shifts this week?"
      },
      "es": {
        "title": "Cansancio y sueño",
        "hook": "Estar despierto de 17 a 19 horas te puede hacer tan lento como haber tomado un par de tragos. La gente cansada se lastima.",
        "sections": [
          {
            "heading": "Lo básico",
            "items": [
              "La mayoría de los adultos necesitan por lo menos 7 horas de sueño. Los turnos largos y las madrugadas te las quitan rápido.",
              "Come comida de verdad y toma agua durante el día. Las bebidas energéticas se te pasan justo cuando más necesitas concentrarte."
            ]
          },
          {
            "heading": "En el trabajo",
            "items": [
              "Fíjate si alguien cabecea, se salta pasos o anda de mal humor, incluyéndote a ti.",
              "Deja el trabajo más riesgoso para cuando estés más alerta, no para el final de un turno largo.",
              "Si estás demasiado cansado para manejar a casa con seguridad, dilo. Es una decisión de seguridad, no una debilidad."
            ]
          }
        ],
        "ask": "¿Quién viene saliendo de varios turnos largos esta semana?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "slips",
    "industries": [
      "all"
    ],
    "code": "1910.22",
    "minutes": 4,
    "content": {
      "en": {
        "title": "Slips, Trips and Falls",
        "hook": "Falls on the same level are one of the most common injuries in every industry. Most come down to housekeeping.",
        "sections": [
          {
            "heading": "Keep it clear",
            "items": [
              "Cords, hoses and scrap don't belong in walkways. Route them along the edges or overhead.",
              "Clean up spills right away, or mark them until you can."
            ]
          },
          {
            "heading": "Watch your step",
            "items": [
              "Wear footwear with grip that fits the surface you work on.",
              "Use handrails on stairs. Don't carry so much that you can't see your feet.",
              "Take extra care on wet, muddy, icy or oily surfaces."
            ]
          }
        ],
        "ask": "What's the biggest trip hazard on site right now? Let's fix it before we start."
      },
      "es": {
        "title": "Resbalones, tropiezos y caídas",
        "hook": "Las caídas al mismo nivel son de las lesiones más comunes en todas las industrias. La mayoría se deben al orden y la limpieza.",
        "sections": [
          {
            "heading": "Mantén despejado",
            "items": [
              "Los cables, mangueras y desperdicios no van en los pasillos. Pásalos por las orillas o por arriba.",
              "Limpia los derrames de inmediato, o márcalos hasta que puedas limpiarlos."
            ]
          },
          {
            "heading": "Fíjate dónde pisas",
            "items": [
              "Usa calzado con buen agarre para la superficie donde trabajas.",
              "Usa los pasamanos en las escaleras. No cargues tanto que no puedas ver tus pies.",
              "Ten más cuidado en superficies mojadas, con lodo, hielo o aceite."
            ]
          }
        ],
        "ask": "¿Cuál es el peor peligro de tropiezo en el trabajo ahora mismo? Arreglémoslo antes de empezar."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "ppe",
    "industries": [
      "all"
    ],
    "code": "1910.132",
    "minutes": 4,
    "content": {
      "en": {
        "title": "PPE: Wear It Right",
        "hook": "Personal protective equipment only works if it fits, it's in good shape, and it's actually on.",
        "sections": [
          {
            "heading": "Every day",
            "items": [
              "Know what today's task requires: eyes, ears, hands, head, feet, hi-vis.",
              "Inspect it before you use it. Cracked glasses, worn gloves and damaged hard hats get replaced, not taped."
            ]
          },
          {
            "heading": "Fit matters",
            "items": [
              "Gloves that are too big get caught. Earplugs that aren't seated don't protect.",
              "If your PPE doesn't fit or makes the job harder, say so. There's usually a better option."
            ]
          }
        ],
        "ask": "Is anyone missing PPE or using something worn out? Speak up now."
      },
      "es": {
        "title": "Equipo de protección: úsalo bien",
        "hook": "El equipo de protección personal solo funciona si te queda bien, está en buen estado y lo traes puesto.",
        "sections": [
          {
            "heading": "Todos los días",
            "items": [
              "Sabe lo que pide la tarea de hoy: ojos, oídos, manos, cabeza, pies, ropa de alta visibilidad.",
              "Revísalo antes de usarlo. Lentes rotos, guantes gastados y cascos dañados se cambian, no se parchan con cinta."
            ]
          },
          {
            "heading": "La talla importa",
            "items": [
              "Los guantes muy grandes se atoran. Los tapones de oído mal puestos no protegen.",
              "Si tu equipo no te queda o te complica el trabajo, dilo. Casi siempre hay una mejor opción."
            ]
          }
        ],
        "ask": "¿A alguien le falta equipo de protección o está usando algo gastado? Díganlo ahora."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "emerg",
    "industries": [
      "all"
    ],
    "code": "EMERG",
    "minutes": 4,
    "content": {
      "en": {
        "title": "If Something Goes Wrong",
        "hook": "In an emergency, nobody has time to figure out where the first aid kit is. Decide now.",
        "sections": [
          {
            "heading": "Know before you need it",
            "items": [
              "The exact address of this site, so you can give it to 911.",
              "Where the first aid kit, fire extinguisher and AED are, if there is one.",
              "Where we meet if we evacuate, so we can count heads."
            ]
          },
          {
            "heading": "Fire extinguisher: P.A.S.S.",
            "items": [
              "Pull the pin. Aim at the base of the fire. Squeeze the handle. Sweep side to side.",
              "If it's spreading or the room is filling with smoke, get out and call 911."
            ]
          }
        ],
        "ask": "Without looking it up, what's the address here? Where's the first aid kit?"
      },
      "es": {
        "title": "Si algo sale mal",
        "hook": "En una emergencia nadie tiene tiempo para buscar el botiquín. Decídanlo ahora.",
        "sections": [
          {
            "heading": "Sábelo antes de necesitarlo",
            "items": [
              "La dirección exacta de este lugar, para dársela al 911.",
              "Dónde están el botiquín, el extintor y el desfibrilador (DEA), si hay uno.",
              "Dónde nos juntamos si hay que evacuar, para contar a todos."
            ]
          },
          {
            "heading": "Extintor: P.A.S.S.",
            "items": [
              "Jala el seguro. Apunta a la base del fuego. Aprieta la manija. Barre de lado a lado.",
              "Si el fuego se está extendiendo o el cuarto se llena de humo, sal y llama al 911."
            ]
          }
        ],
        "ask": "Sin buscarlo, ¿cuál es la dirección de aquí? ¿Dónde está el botiquín?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "storm",
    "industries": [
      "all"
    ],
    "code": "STORM",
    "minutes": 5,
    "content": {
      "en": {
        "title": "Hurricane and Storm Prep",
        "hook": "Hurricane season runs June 1 through November 30. A loose sheet of plywood or a bundle of shingles becomes a missile in a storm.",
        "sections": [
          {
            "heading": "Before a storm",
            "items": [
              "Secure or bring down loose materials, tools and debris. Anything that can blow away will.",
              "Lower and secure lifts and booms within the manufacturer's wind limits.",
              "Know the company's call: when work stops and how you'll be told."
            ]
          },
          {
            "heading": "High wind and lightning",
            "items": [
              "Stop work at height when the wind picks up. A gust can knock you off balance or turn a panel into a sail.",
              "When you hear thunder, get off roofs, lifts and open ground and into a building or a hard-top vehicle. Wait 30 minutes after the last thunder."
            ]
          },
          {
            "heading": "After the storm",
            "items": [
              "Treat every downed line as live. Stay far away and call the utility.",
              "Watch for weakened structures, standing water, and debris with nails. Cleanup brings its own hazards."
            ]
          }
        ],
        "ask": "If a storm warning comes in today, what do we secure first, and who makes the call to stop?"
      },
      "es": {
        "title": "Preparación para huracanes y tormentas",
        "hook": "La temporada de huracanes va del 1 de junio al 30 de noviembre. Una hoja de plywood suelta o un bulto de tejas se vuelve un proyectil en una tormenta.",
        "sections": [
          {
            "heading": "Antes de una tormenta",
            "items": [
              "Asegura o baja los materiales sueltos, las herramientas y los desperdicios. Todo lo que pueda volar, va a volar.",
              "Baja y asegura las plataformas y brazos elevadores dentro de los límites de viento del fabricante.",
              "Conoce la decisión de la empresa: cuándo se para el trabajo y cómo te van a avisar."
            ]
          },
          {
            "heading": "Viento fuerte y rayos",
            "items": [
              "Para el trabajo en alturas cuando sube el viento. Una ráfaga te puede desbalancear o convertir un panel en una vela.",
              "Cuando oigas truenos, bájate de techos, plataformas y terreno abierto, y métete a un edificio o a un vehículo de techo duro. Espera 30 minutos después del último trueno."
            ]
          },
          {
            "heading": "Después de la tormenta",
            "items": [
              "Trata todo cable caído como si tuviera corriente. Mantente lejos y llama a la compañía de luz.",
              "Cuidado con estructuras debilitadas, agua estancada y escombros con clavos. La limpieza trae sus propios peligros."
            ]
          }
        ],
        "ask": "Si hoy llega un aviso de tormenta, ¿qué aseguramos primero y quién decide parar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  }
];
