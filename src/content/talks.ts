// Talk library, ported from prototype/index.html (TALKS + ES).
// Content is data: changing wording means a new version, and saved records keep the version that was read.
// Spanish is "draft" until a native speaker who knows jobsite safety reviews it (see CLAUDE.md).
// Every talk lists its sources: OSHA standards (paragraph-level, in the label) and OSHA guidance pages.
// A source backs the wording. It is not a claim about any company's legal standing.
import type { Talk } from "@/core/talks";

export const TALKS: Talk[] = [
  {
    "id": "fall",
    "industries": [
      "con"
    ],
    "code": "1926.501 / 1926.502",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.501(b)(1): unprotected sides and edges",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(4): holes, including skylights",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d): personal fall arrest systems, incl. (d)(15) anchorages, (d)(19), (d)(21) inspection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(i): covers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA Stop Falls",
        "url": "https://www.osha.gov/stop-falls",
        "kind": "guidance"
      },
      {
        "label": "OSHA Subpart M Appendix C: personal fall arrest systems",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926SubpartMAppC",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Fall Protection",
        "hook": "Falls are the number one killer in construction. There's no such thing as \"just a quick trip to the edge.\"",
        "sections": [
          {
            "heading": "The rule",
            "items": [
              "If you're 6 feet or more above a lower level, you need fall protection. That's the federal construction line. Scaffolds and ladders have their own rules.",
              "That can be a guardrail, a safety net, or a personal fall arrest system. Your supervisor will tell you which one this job uses."
            ]
          },
          {
            "heading": "Before you clip in",
            "items": [
              "Inspect your harness every time: frayed webbing, cracked buckles, a deployed impact indicator. Any of those and it goes out of service today.",
              "Your anchor has to hold 5,000 pounds for each person tied to it, or be part of a system a qualified person set up and oversees. A vent pipe is not an anchor.",
              "Check your clearance. A 6-foot lanyard plus the shock pack stretch can drop you well past 6 feet. Make sure you won't hit the ground or anything below before it stops you."
            ]
          },
          {
            "heading": "Holes and skylights",
            "items": [
              "Any hole 2 inches or bigger gets a cover. Secure it so it can't move, and mark it HOLE or COVER or color-code it.",
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
              "Si estás a 6 pies o más sobre un nivel más bajo, necesitas protección contra caídas. Esa es la regla federal para la construcción. Los andamios y las escaleras tienen sus propias reglas.",
              "Puede ser una baranda, una red de seguridad o un sistema personal de detención de caídas. Tu supervisor te dirá cuál se usa en este trabajo."
            ]
          },
          {
            "heading": "Antes de engancharte",
            "items": [
              "Revisa tu arnés cada vez: correas deshilachadas, hebillas rotas o un indicador de impacto activado. Si tiene cualquiera de esas, se saca de servicio hoy.",
              "Tu anclaje tiene que aguantar 5,000 libras por cada persona amarrada a él, o ser parte de un sistema que una persona calificada instaló y supervisa. Un tubo de ventilación no es un anclaje.",
              "Revisa el espacio libre. Una línea de 6 pies más lo que se estira el amortiguador te puede dejar caer mucho más de 6 pies. Asegúrate de que no vas a pegar contra el suelo ni contra nada abajo antes de que te detenga."
            ]
          },
          {
            "heading": "Huecos y tragaluces",
            "items": [
              "Todo hueco de 2 pulgadas o más lleva tapa. Asegúrala para que no se mueva, y márcala HOLE o COVER (hueco o tapa) o márcala con un color.",
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
    "code": "OSHA HEAT",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Heat: Water. Rest. Shade.",
        "url": "https://www.osha.gov/heat-exposure/water-rest-shade",
        "kind": "guidance"
      },
      {
        "label": "OSHA Heat: illness and first aid",
        "url": "https://www.osha.gov/heat-exposure/illness-first-aid",
        "kind": "guidance"
      },
      {
        "label": "OSHA Heat: protecting new workers",
        "url": "https://www.osha.gov/heat-exposure/protecting-new-workers",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Heat Illness: Water, Rest, Shade",
        "hook": "Roofs and attics can be a lot hotter than the weather report says. Heat illness can take down the strongest person on the crew.",
        "sections": [
          {
            "heading": "Water, rest, shade",
            "items": [
              "Drink about a cup of water every 15 to 20 minutes, even if you're not thirsty.",
              "Take breaks in the shade. Longer breaks as the heat index climbs.",
              "Almost half of heat deaths happen on a worker's first day. New or returning workers build up over about a week."
            ]
          },
          {
            "heading": "Know the signs",
            "items": [
              "Heat exhaustion: heavy sweating, dizziness, nausea, feeling weak, thirsty or cranky. Move them somewhere cool, cool them down, and don't leave them alone. If it gets worse, call 911.",
              "Heat stroke: confusion, slurred speech, passing out, hot skin that may be dry or still sweaty, seizures. This is a 911 call. Cool them with water and ice while you wait."
            ]
          },
          {
            "heading": "Look out for each other",
            "items": [
              "Heat stroke makes people confused, so they may not notice. Watch your partner."
            ]
          }
        ],
        "ask": "Where's the water and shade on this job today, and who's calling 911 if we need it?"
      },
      "es": {
        "title": "Enfermedades por calor: agua, descanso y sombra",
        "hook": "Los techos y los áticos pueden estar mucho más calientes de lo que dice el pronóstico del tiempo. El calor puede tumbar hasta al más fuerte del equipo.",
        "sections": [
          {
            "heading": "Agua, descanso y sombra",
            "items": [
              "Toma más o menos una taza de agua cada 15 a 20 minutos, aunque no tengas sed.",
              "Descansa en la sombra. Los descansos deben ser más largos cuando sube el índice de calor.",
              "Casi la mitad de las muertes por calor pasan en el primer día de trabajo. Los trabajadores nuevos o que regresan se van acostumbrando en más o menos una semana."
            ]
          },
          {
            "heading": "Conoce las señales",
            "items": [
              "Agotamiento por calor: sudor abundante, mareo, náuseas, sentirse débil, con sed o de mal humor. Llévalo a un lugar fresco, refréscalo y no lo dejes solo. Si empeora, llama al 911.",
              "Golpe de calor: confusión, habla arrastrada, desmayo, piel caliente que puede estar seca o todavía sudada, convulsiones. Esto es para llamar al 911. Enfríalo con agua y hielo mientras esperas."
            ]
          },
          {
            "heading": "Cuídense entre todos",
            "items": [
              "El golpe de calor confunde a la persona, así que puede que no se dé cuenta. Vigila a tu compañero."
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
    "sources": [
      {
        "label": "OSHA 1926.1053(b)(1): side rails 3 feet above the landing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1053(b)(5)(i), (b)(6)-(7): 4-to-1 angle, firm footing, secured against displacement",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1053(b)(12)-(13): no metal ladders near energized lines; no standing on the top step",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1053(b)(15)-(16), (b)(20)-(22): inspection, defective ladders tagged out, facing the ladder, no loads that could cause a fall",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA Portable Ladder Safety QuickCard",
        "url": "https://www.osha.gov/sites/default/files/publications/portable_ladder_qc.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Ladder Setup and Use",
        "hook": "Ladder falls can kill even from a few feet up. Setup and climbing habits matter every time.",
        "sections": [
          {
            "heading": "Setup",
            "items": [
              "Extend the ladder at least 3 feet above the landing so you have something to grab.",
              "Use the 4-to-1 rule: for every 4 feet up, the base goes 1 foot out.",
              "Tie it off or secure it so it can't slide or kick out. Firm, level footing at the bottom."
            ]
          },
          {
            "heading": "Climbing",
            "items": [
              "Face the ladder and keep three points of contact.",
              "No carrying bundles in your hands. Use a hoist or a hand line.",
              "Stay off the top step of a stepladder. Near power lines, use a fiberglass ladder, never metal, and look up before you move it."
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
        "hook": "Una caída de escalera puede matar aunque sea de unos pocos pies. Cómo la instalas y cómo subes importa cada vez.",
        "sections": [
          {
            "heading": "Instalación",
            "items": [
              "Extiende la escalera por lo menos 3 pies sobre el nivel de llegada para tener de dónde agarrarte.",
              "Usa la regla de 4 a 1: por cada 4 pies de altura, la base va 1 pie hacia afuera.",
              "Amárrala o asegúrala para que no se deslice ni se le corra la base. Abajo, que quede en suelo firme y nivelado."
            ]
          },
          {
            "heading": "Al subir",
            "items": [
              "Mira hacia la escalera y mantén tres puntos de contacto.",
              "No subas con bultos en las manos. Usa un polipasto o una cuerda.",
              "No te pares en el último escalón de una escalera de tijera. Cerca de líneas eléctricas, usa una escalera de fibra de vidrio, nunca de metal, y mira hacia arriba antes de moverla."
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
      "mfg",
      "wh",
      "food",
      "auto",
      "facil",
      "retail"
    ],
    "code": "1910.147",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.147(c)(9): notify affected employees",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(d)(1)-(d)(6): preparation, shutdown, isolation, lockout, stored energy, verification",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(e)(3): lock removed only by the employee who applied it, or by the employer's written procedure",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(f)(3)(ii)(D): each authorized employee applies their own lock",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA Control of Hazardous Energy",
        "url": "https://www.osha.gov/control-hazardous-energy",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Lockout/Tagout",
        "hook": "Machines that start up during cleaning or repair cause amputations and deaths every year. A lock you control is the best way to keep the power off while you're inside.",
        "sections": [
          {
            "heading": "Six steps",
            "items": [
              "Know every energy source on the machine, and tell the operators it's going down.",
              "Shut it down the normal way.",
              "Isolate every energy source: electrical, air, hydraulic, gravity, steam.",
              "Put your own lock and tag on each isolation point.",
              "Release stored energy. Bleed air lines, block raised parts, discharge capacitors.",
              "Verify. Try to start it. Nothing should move. Then put the controls back to off."
            ]
          },
          {
            "heading": "The rules that don't bend",
            "items": [
              "One person, one lock. If three people are working on it, there are three locks.",
              "Only the person who put the lock on takes it off. If they're gone, only a supervisor can, using our written steps.",
              "Never rely on an e-stop or a switch someone else is watching."
            ]
          }
        ],
        "ask": "Which machine on this floor has more than one energy source? Walk us through where they are."
      },
      "es": {
        "title": "Bloqueo y etiquetado (Lockout/Tagout)",
        "hook": "Las máquinas que arrancan durante una limpieza o reparación causan amputaciones y muertes cada año. Un candado que tú controlas es la mejor forma de mantener la energía apagada mientras estás adentro.",
        "sections": [
          {
            "heading": "Seis pasos",
            "items": [
              "Conoce todas las fuentes de energía de la máquina y avisa a los operadores que se va a apagar.",
              "Apágala de la forma normal.",
              "Aísla todas las fuentes de energía: eléctrica, aire, hidráulica, gravedad, vapor.",
              "Pon tu propio candado y etiqueta en cada punto de aislamiento.",
              "Libera la energía acumulada. Purga las líneas de aire, bloquea las piezas levantadas, descarga los capacitores.",
              "Verifica. Intenta arrancarla. Nada debe moverse. Luego regresa los controles a apagado."
            ]
          },
          {
            "heading": "Reglas que no se doblan",
            "items": [
              "Una persona, un candado. Si tres personas trabajan en ella, hay tres candados.",
              "Solo quien puso el candado lo quita. Si esa persona no está, solo un supervisor puede quitarlo, siguiendo nuestros pasos por escrito.",
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
      "mfg",
      "food",
      "auto"
    ],
    "code": "1910.212",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1910.212(a)(1): machine guarding required",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.212(a)(3)(ii): point-of-operation guarding",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(a)(2)(ii): lockout during servicing, including clearing jams",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA Amputations QuickCard",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA-amputations.pdf",
        "kind": "guidance"
      }
    ],
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
      "mfg",
      "con",
      "wh",
      "auto",
      "facil",
      "health",
      "food",
      "retail",
      "oil",
      "util",
      "land"
    ],
    "code": "1910.1200 / 1926.59",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.1200(f)(1), (f)(6), (f)(8): container labels, workplace labels, labels kept legible",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(g)(2), (g)(8): Safety Data Sheet sections, SDS readily accessible",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.59: Hazard Communication in construction",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.59",
        "kind": "standard"
      },
      {
        "label": "OSHA Hazard Communication",
        "url": "https://www.osha.gov/hazcom",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Chemical Labels and SDS",
        "hook": "Every chemical on site comes with a label that tells you how to stay safe. Read it before you open it.",
        "sections": [
          {
            "heading": "Read before you handle",
            "items": [
              "Check the label: the signal word, the pictograms, and the safety steps it lists, like gloves or goggles.",
              "Know where the Safety Data Sheets are kept. Section 4 tells you first aid, Section 8 tells you PPE."
            ]
          },
          {
            "heading": "Handling",
            "items": [
              "Don't put chemicals in drink bottles or unlabeled containers. If you fill a container and walk away, it needs a label.",
              "Know where the nearest eyewash and water are before you open anything.",
              "Wash your hands before you eat, drink or smoke."
            ]
          }
        ],
        "ask": "Where are the SDS binders and the eyewash station from where we're standing?"
      },
      "es": {
        "title": "Etiquetas de químicos y hojas SDS",
        "hook": "Cada químico en el trabajo trae una etiqueta que te dice cómo cuidarte. Léela antes de abrirlo.",
        "sections": [
          {
            "heading": "Lee antes de usar",
            "items": [
              "Revisa la etiqueta: la palabra de advertencia, los pictogramas y las medidas de seguridad que indica, como guantes o gafas.",
              "Sabe dónde están las Hojas de Datos de Seguridad (SDS). La Sección 4 dice los primeros auxilios y la Sección 8 dice el equipo de protección."
            ]
          },
          {
            "heading": "Manejo",
            "items": [
              "No pongas químicos en botellas de bebida ni en envases sin etiqueta. Si llenas un envase y lo dejas, tiene que llevar etiqueta.",
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
    "code": "1910.111(b)",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.111(b): anhydrous ammonia systems and equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.111",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.21(a)(2): 1910.111 applies to agricultural operations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.21",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.151(c): eye and body flushing where corrosives are used",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Anhydrous Ammonia Safety",
        "hook": "Anhydrous ammonia burns eyes, skin and lungs fast. Seconds matter.",
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
              "Carry plenty of clean water on the rig, and a squeeze bottle on you."
            ]
          },
          {
            "heading": "If you're exposed",
            "items": [
              "Flush with lots of water right away and keep flushing. Take off clothes that got wet with it.",
              "Get medical help. Eye exposure always gets checked by a doctor."
            ]
          }
        ],
        "ask": "Where's the water on this rig, and how much is in it right now?"
      },
      "es": {
        "title": "Seguridad con amoníaco anhidro",
        "hook": "El amoníaco anhidro quema los ojos, la piel y los pulmones rápido. Los segundos cuentan.",
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
              "Lleva bastante agua limpia en el equipo, y una botella de chorro con agua contigo."
            ]
          },
          {
            "heading": "Si te expones",
            "items": [
              "Enjuágate con mucha agua de inmediato y sigue enjuagando. Quítate la ropa que se haya mojado con el químico.",
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
      "mfg",
      "retail",
      "truck"
    ],
    "code": "1910.178",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.178(l)(1)(ii), (l)(4)(iii): trained and evaluated operators, re-evaluated at least every 3 years",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(m)(3), (m)(5)(i): no riders; parked truck forks lowered, controls neutral, power off, brakes set, wheels blocked on an incline",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(n)(6), (q)(7): watch for pedestrians; pre-shift examination",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Forklift Safety",
        "hook": "Forklifts are hard to stop, and the operator can't always see you.",
        "sections": [
          {
            "heading": "Operators",
            "items": [
              "Only trained and evaluated operators drive. Evaluations repeat at least every 3 years.",
              "Do a pre-shift check: forks, chains, tires, horn, brakes, leaks.",
              "Wear the seatbelt. On a sit-down truck, if it tips: don't jump. Hold the wheel, brace your feet, lean away. On a stand-up truck, step off the back."
            ]
          },
          {
            "heading": "Everyone else",
            "items": [
              "Make eye contact with the driver before you walk into their path.",
              "No riders. Nobody stands on the forks.",
              "Parked means forks down, controls neutral, power off, brake set. Block the wheels on a slope."
            ]
          }
        ],
        "ask": "Where are the blind corners in this building?"
      },
      "es": {
        "title": "Seguridad con montacargas",
        "hook": "Los montacargas no frenan rápido, y el operador no siempre te puede ver.",
        "sections": [
          {
            "heading": "Operadores",
            "items": [
              "Solo manejan operadores entrenados y evaluados. Las evaluaciones se repiten por lo menos cada 3 años.",
              "Haz la revisión antes del turno: horquillas, cadenas, llantas, claxon, frenos, fugas.",
              "Usa el cinturón. En un montacargas de asiento, si se vuelca: no brinques. Agárrate del volante, apoya bien los pies e inclínate hacia el lado contrario. En un montacargas de pie, bájate por atrás."
            ]
          },
          {
            "heading": "Todos los demás",
            "items": [
              "Haz contacto visual con el operador antes de cruzar por su camino.",
              "No se lleva a nadie de pasajero. Nadie se para en las horquillas.",
              "Estacionado significa horquillas abajo, controles en neutral, máquina apagada y freno puesto. En una pendiente, calza las ruedas."
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
      "ag",
      "truck",
      "retail",
      "food",
      "facil",
      "land",
      "auto"
    ],
    "code": "ERGO",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA Materials Handling eTool: Heavy Lifting",
        "url": "https://www.osha.gov/etools/electrical-contractors/materials-handling/heavy",
        "kind": "guidance"
      },
      {
        "label": "OSHA ergonomics interpretation letter, 2024-03-18",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2024-03-18",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Lifting Without Getting Hurt",
        "hook": "Lifting is one of the leading causes of injury at work, and back injuries can follow you for life.",
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
              "Feet apart. Bend at your knees, not your waist, and keep your back in a natural straight line.",
              "Keep the load close to your body.",
              "Don't twist. Turn your feet instead."
            ]
          }
        ],
        "ask": "What's the heaviest thing we'll move today, and how are we moving it?"
      },
      "es": {
        "title": "Cargar sin lastimarte",
        "hook": "Levantar cosas es una de las principales causas de lesiones en el trabajo, y las lesiones de espalda te pueden seguir toda la vida.",
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
              "Pies separados. Dobla las rodillas, no la cintura, y mantén la espalda recta en su posición natural.",
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
    "code": "OSHA COLD",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Cold Stress card (OSHA 3156)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3156.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Cold Stress",
        "hook": "Cold doesn't have to mean snow. Wind, rain and wet clothes can pull heat out of your body even on a mild day.",
        "sections": [
          {
            "heading": "Dress for it",
            "items": [
              "Wear loose layers you can take off as you warm up. Wet clothes pull heat out fast.",
              "Cover your head, hands and feet. Keep a dry pair of socks and gloves in the truck.",
              "Wind makes it colder than the thermometer says."
            ]
          },
          {
            "heading": "Know the signs",
            "items": [
              "Frostbite: numb, white or grayish skin on fingers, toes, ears or nose. Don't rub it, and don't walk on frozen feet. Get medical help.",
              "Hypothermia: shivering at first. If the shivering stops, or they get confused or slur their words, it's serious. Call 911, get them somewhere warm, and swap wet clothes for dry ones."
            ]
          },
          {
            "heading": "On the job",
            "items": [
              "Take warm-up breaks somewhere out of the wind.",
              "Warm drinks help. Skip alcohol."
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
              "Usa capas holgadas que te puedas quitar cuando entres en calor. La ropa mojada te saca el calor rápido.",
              "Cúbrete la cabeza, las manos y los pies. Deja un par de calcetines y guantes secos en la camioneta.",
              "El viento hace que se sienta más frío de lo que marca el termómetro."
            ]
          },
          {
            "heading": "Conoce las señales",
            "items": [
              "Congelación: piel entumecida, blanca o grisácea en dedos, orejas o nariz. No la frotes, y no camines con los pies congelados. Busca atención médica.",
              "Hipotermia: primero temblores. Si deja de temblar, o se confunde o se le traba la lengua, es grave. Llama al 911, llévalo a un lugar caliente y cámbiale la ropa mojada por ropa seca."
            ]
          },
          {
            "heading": "En el trabajo",
            "items": [
              "Toma descansos para calentarte en un lugar sin viento.",
              "Las bebidas calientes ayudan. Evita el alcohol."
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
    "code": "OSHA FATIGUE",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA Worker Fatigue",
        "url": "https://www.osha.gov/worker-fatigue",
        "kind": "guidance"
      },
      {
        "label": "OSHA Drowsy Driving",
        "url": "https://www.osha.gov/motor-vehicle-safety/drowsy-driving",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Fatigue and Sleep",
        "hook": "After 17 hours awake, you can be as slow as someone who's been drinking. Tired people get hurt.",
        "sections": [
          {
            "heading": "The basics",
            "items": [
              "Most adults need at least 7 hours of sleep. Long shifts and early starts eat into that fast.",
              "Eat real food and drink water through the day. Caffeine doesn't replace sleep."
            ]
          },
          {
            "heading": "On the job",
            "items": [
              "Watch for nodding off, missed steps, or short tempers in yourself and others.",
              "If you're too tired to drive home safely, say so. That's a safety call, not a weakness."
            ]
          }
        ],
        "ask": "Who's coming off a long stretch of shifts this week?"
      },
      "es": {
        "title": "Cansancio y sueño",
        "hook": "Después de 17 horas despierto, puedes estar tan lento como alguien que ha estado tomando. La gente cansada se lastima.",
        "sections": [
          {
            "heading": "Lo básico",
            "items": [
              "La mayoría de los adultos necesitan por lo menos 7 horas de sueño. Los turnos largos y las madrugadas te las quitan rápido.",
              "Come comida de verdad y toma agua durante el día. La cafeína no reemplaza el sueño."
            ]
          },
          {
            "heading": "En el trabajo",
            "items": [
              "Fíjate si alguien cabecea, se salta pasos o anda de mal humor, incluyéndote a ti.",
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
    "code": "1910.22 / 1926.25",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1910.22(a)(1)-(3): clean, orderly and dry walking-working surfaces",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.22(d)(2): hazardous conditions corrected or guarded",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.25(a): housekeeping on construction sites",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.25",
        "kind": "standard"
      },
      {
        "label": "OSHA Walking-Working Surfaces",
        "url": "https://www.osha.gov/walking-working-surfaces",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Slips, Trips and Falls",
        "hook": "Slips, trips and falls are among the leading causes of serious injuries at work. Good housekeeping prevents a lot of them.",
        "sections": [
          {
            "heading": "Keep it clear",
            "items": [
              "Cords, hoses and scrap don't belong in walkways. Route them along the edges or overhead.",
              "Clean up spills right away. If you can't, block the area off so nobody walks through it."
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
        "hook": "Los resbalones, tropiezos y caídas están entre las principales causas de lesiones graves en el trabajo. El buen orden y la limpieza evitan muchos de ellos.",
        "sections": [
          {
            "heading": "Mantén despejado",
            "items": [
              "Los cables, mangueras y desperdicios no van en los pasillos. Pásalos por las orillas o por arriba.",
              "Limpia los derrames de inmediato. Si no puedes, bloquea el área para que nadie pase por ahí."
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
    "code": "1910.132 / 1926.95",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1910.132(a), (d)(1)(iii), (e): PPE provided, fitted to each worker, defective PPE not used",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.132",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.95(a), (c)(2): construction PPE, properly fitted",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.95",
        "kind": "standard"
      }
    ],
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
              "If it doesn't fit, tell your supervisor. Your PPE is supposed to fit you."
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
              "Si no te queda, avísale a tu supervisor. Tu equipo de protección tiene que quedarte bien."
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
    "code": "1926.35 / 1926.50",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1926.35(b): emergency action plan elements",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.35",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.50(f): emergency phone numbers posted",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.50",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.38: emergency action plans",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.38",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.151: medical services and first aid",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151",
        "kind": "standard"
      },
      {
        "label": "OSHA eTool: using portable fire extinguishers",
        "url": "https://www.osha.gov/etools/evacuation-plans-procedures/emergency-standards/portable-extinguishers/use",
        "kind": "guidance"
      }
    ],
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
              "If it's spreading, your extinguisher runs out, smoke is between you and the exit, or you have any doubt, get out and call 911."
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
              "Si el fuego se está extendiendo, se te acaba el extintor, hay humo entre tú y la salida, o tienes cualquier duda, sal y llama al 911."
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
    "code": "OSHA STORM",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA/NOAA lightning safety fact sheet",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3863.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA downed electrical wires fact sheet",
        "url": "https://www.osha.gov/sites/default/files/downed_electrical_wires.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA hurricane preparedness",
        "url": "https://www.osha.gov/hurricane/preparedness",
        "kind": "guidance"
      },
      {
        "label": "NOAA hurricane season",
        "url": "https://www.nhc.noaa.gov/climo/",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hurricane and Storm Prep",
        "hook": "Hurricane season runs June 1 through November 30. A loose sheet of plywood or a bundle of shingles becomes a missile in a storm.",
        "sections": [
          {
            "heading": "Before a storm",
            "items": [
              "Secure or bring down loose materials, tools and debris. Anything that can blow away will.",
              "Follow the manufacturer's wind limits for lifts and booms. Lower and secure them before the storm.",
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
              "Treat every downed line as live. Stay at least 10 feet away. Farther is better. Call the utility.",
              "Treat floodwater as dirty. Watch for weak structures and sharp debris. Cleanup brings its own hazards."
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
              "Sigue los límites de viento del fabricante para plataformas y brazos elevadores. Bájalos y asegúralos antes de la tormenta.",
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
              "Trata todo cable caído como si tuviera corriente. Mantente por lo menos a 10 pies de distancia. Más lejos es mejor. Llama a la compañía de luz.",
              "Trata el agua de inundación como agua sucia. Cuidado con estructuras débiles y escombros filosos. La limpieza trae sus propios peligros."
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
  },
  {
    "id": "roof-lowslope",
    "industries": [
      "con"
    ],
    "code": "1926.501(b)(10) / 1926.502(f), (h)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.500(b): definitions (low-slope roof, steep roof, warning line system, safety-monitoring system)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.500",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(10): roofing work on low-slope roofs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(f): warning line systems",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(h): safety monitoring systems",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 3755: Protecting Roofing Workers (Warning Lines and Safety Monitors)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3755.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Low-Slope Roofs: Warning Lines and Safety Monitors",
        "hook": "A flat roof feels safe. That's the trap. The edge sneaks up on you while your eyes are on your work.",
        "sections": [
          {
            "heading": "Know your roof",
            "items": [
              "A low-slope roof is 4 in 12 or flatter. Anything steeper is a steep roof, and it has different rules.",
              "If the edge is 6 feet or more above a lower level, you need fall protection. That can be guardrails, a safety net, or a personal fall arrest system.",
              "It can also be a warning line used together with guardrails, a net, a personal fall arrest system, or a safety monitor.",
              "On a roof 50 feet wide or less, a safety monitor alone is allowed, with no warning line."
            ]
          },
          {
            "heading": "Warning lines",
            "items": [
              "The warning line goes around all sides of the work area, at least 6 feet back from the edge.",
              "When mechanical equipment is running, the line stays at least 6 feet from the edges alongside the machine's path, and at least 10 feet from the edge the machine is moving toward.",
              "The line hangs 34 to 39 inches high, sag included, with high-visibility flags no more than 6 feet apart.",
              "The space between the line and the edge is for roofing work only. If you're not doing roofing work out there, stay inside the line."
            ]
          },
          {
            "heading": "Paths and equipment",
            "items": [
              "The path from the ladder, hoist, or material storage to the work area is marked with two warning lines.",
              "When a path isn't being used, close it off at the warning line with a rope, wire, chain, or barricade as strong and as high as the line. Or offset the path so nobody can walk straight in.",
              "Mechanical equipment can only be used or stored where people are protected by a warning line, guardrail, or personal fall arrest system."
            ]
          },
          {
            "heading": "The safety monitor",
            "items": [
              "The monitor is a competent person the company picks. Their job is to spot fall hazards and warn you when you don't see one or you're working unsafe.",
              "The monitor stays on the same roof as you, where they can see you and close enough to talk to you.",
              "The monitor takes on no other task that could pull their attention off the crew.",
              "No mechanical equipment is used or stored in an area where a safety monitor is the protection."
            ]
          }
        ],
        "ask": "Where is our warning line today, and who is the safety monitor? Point out the access path before we go up."
      },
      "es": {
        "title": "Techos de poca pendiente: líneas de advertencia y monitores de seguridad",
        "hook": "Un techo plano se siente seguro. Esa es la trampa. El borde se te acerca sin que te des cuenta mientras tienes los ojos en tu trabajo.",
        "sections": [
          {
            "heading": "Conoce tu techo",
            "items": [
              "Un techo de poca pendiente es de 4 en 12 o menos. Si es más inclinado, es un techo empinado y tiene otras reglas.",
              "Si el borde está a 6 pies o más sobre un nivel más bajo, necesitas protección contra caídas. Puede ser una baranda, una red de seguridad o un sistema personal de detención de caídas.",
              "También puede ser una línea de advertencia junto con barandas, una red, un sistema personal de detención de caídas o un monitor de seguridad.",
              "En un techo de 50 pies de ancho o menos, se permite usar solo un monitor de seguridad, sin línea de advertencia."
            ]
          },
          {
            "heading": "Líneas de advertencia",
            "items": [
              "La línea de advertencia va alrededor de todos los lados del área de trabajo, por lo menos a 6 pies del borde.",
              "Cuando hay equipo mecánico trabajando, la línea queda por lo menos a 6 pies de los bordes que van a lo largo del recorrido de la máquina, y por lo menos a 10 pies del borde hacia donde avanza la máquina.",
              "La línea cuelga entre 34 y 39 pulgadas de alto, contando la parte que se comba, con banderas de alta visibilidad a no más de 6 pies una de otra.",
              "El espacio entre la línea y el borde es solo para trabajo de techado. Si no estás haciendo trabajo de techado ahí, quédate adentro de la línea."
            ]
          },
          {
            "heading": "Pasillos y equipo",
            "items": [
              "El pasillo desde la escalera, el elevador de carga o el área de materiales hasta el área de trabajo se marca con dos líneas de advertencia.",
              "Cuando no se está usando un pasillo, ciérralo donde cruza la línea de advertencia con una cuerda, cable, cadena o barrera igual de fuerte y de alta que la línea. O desvía el pasillo para que nadie pueda entrar directo.",
              "El equipo mecánico solo se puede usar o guardar donde la gente está protegida por una línea de advertencia, una baranda o un sistema personal de detención de caídas."
            ]
          },
          {
            "heading": "El monitor de seguridad",
            "items": [
              "El monitor es una persona competente que escoge la compañía. Su trabajo es detectar peligros de caída y avisarte cuando no ves uno o cuando estás trabajando de forma insegura.",
              "El monitor se queda en el mismo techo que tú, donde te puede ver y lo bastante cerca para hablar contigo.",
              "El monitor no hace ninguna otra tarea que le pueda quitar la atención de la cuadrilla.",
              "No se usa ni se guarda equipo mecánico en un área donde la protección es un monitor de seguridad."
            ]
          }
        ],
        "ask": "¿Dónde está hoy nuestra línea de advertencia y quién es el monitor de seguridad? Señalen el pasillo de acceso antes de subir."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "roof-steep",
    "industries": [
      "con"
    ],
    "code": "1926.501(b)(11) / 1926.501(b)(13)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.500(b): definitions (steep roof, low-slope roof)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.500",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(11): steep roofs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(13): residential construction",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(k): fall protection plan",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(15): anchorages",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet: Fall Protection in Residential Construction (12/2010)",
        "url": "https://www.osha.gov/sites/default/files/2019-12/fall_protection_factsheet.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3755: Protecting Roofing Workers (Plan, Provide, Train; Using a Personal Fall Arrest System)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3755.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Stop Falls",
        "url": "https://www.osha.gov/stop-falls",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Steep Roofs: Residential Roofing Fall Protection",
        "hook": "On a steep roof, one slip can turn into a slide to the edge. Your protection has to be set up before that slip, not after.",
        "sections": [
          {
            "heading": "Know your pitch",
            "items": [
              "A steep roof is steeper than 4 in 12. Know the pitch before you go up, because the pitch decides which rules apply.",
              "On a steep roof with edges 6 feet or more above a lower level, you need guardrails with toeboards, a safety net, or a personal fall arrest system.",
              "Warning lines are a low-slope roof tool. They are not on the steep-roof list."
            ]
          },
          {
            "heading": "Houses count too",
            "items": [
              "Building or roofing a wood-frame home? The same 6-foot rule applies: guardrails, a safety net, or a personal fall arrest system.",
              "A fall restraint setup can be used instead of fall arrest. That's a harness tied to an anchor at the center of the roof, on a line short enough that you can't reach the edge.",
              "OSHA did away with the old policy that let home builders use things like slide guards instead of these systems."
            ]
          },
          {
            "heading": "When there's a fall protection plan",
            "items": [
              "If the company can show those systems won't work on a job, or would be more dangerous, a qualified person has to write a fall protection plan for that site.",
              "Any change to the plan has to be approved by a qualified person, and a copy stays on the job. Ask to see it and know what it says."
            ]
          },
          {
            "heading": "Anchors on a house",
            "items": [
              "Every worker who ties off gets their own harness.",
              "Your anchor has to hold 5,000 pounds for each person tied to it, or be part of a complete system with a safety factor of at least two, used under a qualified person's supervision.",
              "Don't attach an anchor to sheathing alone, a single truss, or most guardrails. Fasten it into a structural member.",
              "Install the anchor the way the manufacturer says, and put it above your work area."
            ]
          }
        ],
        "ask": "What's the pitch on this roof, and what's our protection today: fall arrest, restraint, or something else? Where are the anchors going?"
      },
      "es": {
        "title": "Techos empinados: protección contra caídas en techos residenciales",
        "hook": "En un techo empinado, un resbalón se puede volver una deslizada hasta el borde. Tu protección tiene que estar puesta antes de ese resbalón, no después.",
        "sections": [
          {
            "heading": "Conoce la pendiente",
            "items": [
              "Un techo empinado es más inclinado que 4 en 12. Conoce la pendiente antes de subir, porque la pendiente decide qué reglas aplican.",
              "En un techo empinado con bordes a 6 pies o más sobre un nivel más bajo, necesitas barandas con rodapiés, una red de seguridad o un sistema personal de detención de caídas.",
              "Las líneas de advertencia son para techos de poca pendiente. No están en la lista para techos empinados."
            ]
          },
          {
            "heading": "Las casas también cuentan",
            "items": [
              "¿Estás construyendo o techando una casa de estructura de madera? Aplica la misma regla de 6 pies: barandas, una red de seguridad o un sistema personal de detención de caídas.",
              "Se puede usar un sistema de restricción de caídas en vez de uno de detención. Es un arnés amarrado a un anclaje en el centro del techo, con una línea tan corta que no puedes llegar al borde.",
              "OSHA eliminó la política anterior que dejaba a los constructores de casas usar cosas como tablas de retención (slide guards) en lugar de estos sistemas."
            ]
          },
          {
            "heading": "Cuando hay un plan de protección contra caídas",
            "items": [
              "Si la compañía puede demostrar que esos sistemas no funcionan en un trabajo, o que serían más peligrosos, una persona calificada tiene que escribir un plan de protección contra caídas para ese sitio.",
              "Cualquier cambio al plan lo tiene que aprobar una persona calificada, y una copia se queda en el trabajo. Pide verlo y conoce lo que dice."
            ]
          },
          {
            "heading": "Anclajes en una casa",
            "items": [
              "Cada trabajador que se amarra recibe su propio arnés.",
              "Tu anclaje tiene que aguantar 5,000 libras por cada persona amarrada a él, o ser parte de un sistema completo con un factor de seguridad de por lo menos dos, usado bajo la supervisión de una persona calificada.",
              "No pongas un anclaje solo en el entablado (sheathing), en una sola armadura (truss) ni en la mayoría de las barandas. Fíjalo a un miembro estructural.",
              "Instala el anclaje como dice el fabricante, y ponlo más arriba de tu área de trabajo."
            ]
          }
        ],
        "ask": "¿Qué pendiente tiene este techo, y cuál es nuestra protección hoy: detención de caídas, restricción u otra cosa? ¿Dónde van a ir los anclajes?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "skylights",
    "industries": [
      "con"
    ],
    "code": "1926.501(b)(4) / 1926.502(i)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.500(b): definition of \"hole\"",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.500",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(4): holes, including skylights",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(i): covers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA construction video tool: Skylight (transcript)",
        "url": "https://www.osha.gov/vtools/construction/skylight-fnl-eng-web-transcript",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3755: Protecting Roofing Workers (Covers)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3755.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Stop Falls",
        "url": "https://www.osha.gov/stop-falls",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Skylights and Roof Openings",
        "hook": "In one OSHA case, a roofer nailing shingles stepped backward onto a skylight. It broke under him, and he fell 15 feet to the floor below.",
        "sections": [
          {
            "heading": "Skylights are holes",
            "items": [
              "A hole is any gap 2 inches or more at its narrowest point, in a floor, roof, or other surface you walk or work on.",
              "The rule names skylights as holes. Treat every one like an open hole.",
              "If you could fall more than 6 feet through it, it needs a cover or a guardrail around it, or you need to be in a personal fall arrest system.",
              "Covers also keep you from tripping or stepping into a hole, and keep things from falling through onto people below."
            ]
          },
          {
            "heading": "Covers done right",
            "items": [
              "A cover must hold at least twice the weight of the workers, equipment, and materials that could be on it at one time.",
              "Secure it when you put it down, so wind, equipment, or people can't knock it out of place.",
              "Mark it HOLE or COVER, or color-code it, so everyone knows what's under it.",
              "Don't count the plastic dome as a cover. In that OSHA case, the dome was the only thing over the opening, and it couldn't hold his weight."
            ]
          },
          {
            "heading": "Working near them",
            "items": [
              "Guardrails at the roof edge don't protect you from a skylight in the middle. That employer had edge guardrails and thought his crew was protected. He was wrong.",
              "Before you start, find every skylight and hole on the roof and plan around them.",
              "If a cover has to come off for the work, that hole still needs a guardrail, or you need to be tied off, until the cover goes back on.",
              "Watch where you step when you back up while you work. That's how the roofer in that case ended up on the skylight."
            ]
          }
        ],
        "ask": "How many skylights and openings are on this roof? Who is checking that every one is covered, secured, and marked?"
      },
      "es": {
        "title": "Tragaluces y aberturas en el techo",
        "hook": "En un caso de OSHA, un techador que clavaba tejas dio un paso hacia atrás y pisó un tragaluz. Se rompió debajo de él y cayó 15 pies hasta el piso de abajo.",
        "sections": [
          {
            "heading": "Los tragaluces son huecos",
            "items": [
              "Un hueco es cualquier abertura de 2 pulgadas o más en su parte más angosta, en un piso, techo u otra superficie donde caminas o trabajas.",
              "La regla dice que los tragaluces son huecos. Trata cada uno como un hueco abierto.",
              "Si te puedes caer más de 6 pies a través de él, necesita una tapa o una baranda alrededor, o tú necesitas estar en un sistema personal de detención de caídas.",
              "Las tapas también evitan que te tropieces o que metas el pie en un hueco, y evitan que caigan cosas sobre la gente de abajo."
            ]
          },
          {
            "heading": "Tapas bien puestas",
            "items": [
              "Una tapa tiene que aguantar por lo menos el doble del peso de los trabajadores, el equipo y los materiales que puedan estar encima al mismo tiempo.",
              "Asegúrala cuando la pongas, para que el viento, el equipo o la gente no la puedan mover de su lugar.",
              "Márcala HOLE o COVER (hueco o tapa), o márcala con un color, para que todos sepan lo que hay debajo.",
              "No cuentes el domo de plástico como una tapa. En ese caso de OSHA, el domo era lo único que cubría la abertura, y no aguantó su peso."
            ]
          },
          {
            "heading": "Trabajando cerca de ellos",
            "items": [
              "Las barandas en el borde del techo no te protegen de un tragaluz en el medio. Ese patrón tenía barandas en el borde y pensaba que su cuadrilla estaba protegida. Estaba equivocado.",
              "Antes de empezar, encuentra todos los tragaluces y huecos del techo y planea cómo trabajar alrededor de ellos.",
              "Si hay que quitar una tapa para el trabajo, ese hueco todavía necesita una baranda, o tú necesitas estar amarrado, hasta que la tapa vuelva a su lugar.",
              "Fíjate dónde pisas cuando te vas para atrás mientras trabajas. Así fue como el techador de ese caso terminó encima del tragaluz."
            ]
          }
        ],
        "ask": "¿Cuántos tragaluces y aberturas hay en este techo? ¿Quién está revisando que cada uno esté tapado, asegurado y marcado?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "harness",
    "industries": [
      "con"
    ],
    "code": "1926.502(d)",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.500(b): definition of \"personal fall arrest system\" (body belt prohibition)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.500",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(5)-(6): snaphooks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(15): anchorages",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(16): free fall and deceleration limits",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(19): equipment subjected to impact loading",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(20): prompt rescue",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(21): inspection prior to each use",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA Subpart M Appendix C: personal fall arrest systems (inspection, tie-off, free fall, obstruction considerations)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926SubpartMAppC",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3755: Protecting Roofing Workers (Personal Fall Arrest System; Rescue)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3755.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Harness, Lanyard and Anchor Check",
        "hook": "Your harness only works if every piece of it works. Check it before every use, not once a week.",
        "sections": [
          {
            "heading": "Check your gear",
            "items": [
              "Look over your harness, lanyard, and hooks before each use for wear, damage, or anything breaking down.",
              "Look for cuts, tears, scrapes, mold, or stretched spots. Look for damage from fire, acid, or other chemicals, bent hooks, and weak hook springs.",
              "Anything defective comes out of service. Don't patch it and keep going.",
              "If it has stopped a fall, it comes out of service right away. It is not used again until a competent person inspects it and says it's undamaged and fit to reuse."
            ]
          },
          {
            "heading": "Put it on right",
            "items": [
              "Adjust the harness so it fits snug. The back D-ring should sit centered between your shoulder blades.",
              "Body belts are not allowed for fall arrest. Full body harness only.",
              "Use locking snaphooks only. Never clip a hook to another hook, or straight onto webbing or rope, unless the hook is designed for that connection."
            ]
          },
          {
            "heading": "Pick the anchor",
            "items": [
              "Your anchor has to hold 5,000 pounds for each person tied to it, or be part of a complete system with a safety factor of at least two, under a qualified person's supervision.",
              "Never share an anchor that's holding up a scaffold or platform. Your anchor has to be separate.",
              "Tie off at or above your D-ring when you can, and pick a spot that keeps you from swinging wide if you fall.",
              "Keep your line off sharp or rough edges, and don't tie knots in it. Both cut its strength."
            ]
          },
          {
            "heading": "Clearance and rescue",
            "items": [
              "Your system has to be rigged so you can't free fall more than 6 feet or hit anything below you.",
              "Once it starts to catch you, it has to bring you to a full stop within 3.5 feet.",
              "Know the rescue plan before you clip in. A worker hanging in a harness needs help fast."
            ]
          }
        ],
        "ask": "Pull out your harness and lanyard right now. What's one thing that would take yours out of service today?"
      },
      "es": {
        "title": "Revisión de arnés, línea y anclaje",
        "hook": "Tu arnés solo funciona si cada parte funciona. Revísalo antes de cada uso, no una vez a la semana.",
        "sections": [
          {
            "heading": "Revisa tu equipo",
            "items": [
              "Revisa tu arnés, tu línea y tus ganchos antes de cada uso, buscando desgaste, daños o cualquier cosa que se esté deteriorando.",
              "Busca cortes, rasgaduras, raspones, moho o partes estiradas. Busca daños por fuego, ácido u otros químicos, ganchos doblados y resortes de gancho débiles.",
              "Todo lo que tenga defectos se saca de servicio. No lo remiendes para seguir trabajando.",
              "Si ya detuvo una caída, se saca de servicio de inmediato. No se vuelve a usar hasta que una persona competente lo inspeccione y diga que no tiene daños y que sirve para usarse otra vez."
            ]
          },
          {
            "heading": "Póntelo bien",
            "items": [
              "Ajusta el arnés para que quede apretado. El anillo D de la espalda debe quedar centrado entre tus omóplatos.",
              "Los cinturones de seguridad no se permiten para detener caídas. Solo arnés de cuerpo completo.",
              "Usa solo ganchos con seguro. Nunca enganches un gancho a otro gancho, ni directo a una correa o cuerda, a menos que el gancho esté diseñado para esa conexión."
            ]
          },
          {
            "heading": "Escoge el anclaje",
            "items": [
              "Tu anclaje tiene que aguantar 5,000 libras por cada persona amarrada a él, o ser parte de un sistema completo con un factor de seguridad de por lo menos dos, bajo la supervisión de una persona calificada.",
              "Nunca compartas un anclaje que está sosteniendo un andamio o una plataforma. Tu anclaje tiene que ser aparte.",
              "Amárrate a la altura de tu anillo D o más arriba cuando puedas, y escoge un punto que evite que te columpies muy lejos si te caes.",
              "Mantén tu línea lejos de bordes filosos o ásperos, y no le hagas nudos. Las dos cosas le quitan fuerza."
            ]
          },
          {
            "heading": "Espacio libre y rescate",
            "items": [
              "Tu sistema tiene que estar armado para que no caigas libremente más de 6 pies ni pegues contra nada abajo.",
              "Cuando empieza a detenerte, te tiene que parar por completo en 3.5 pies o menos.",
              "Conoce el plan de rescate antes de engancharte. Un trabajador colgado de un arnés necesita ayuda rápido."
            ]
          }
        ],
        "ask": "Saquen su arnés y su línea ahora mismo. ¿Qué es una cosa que sacaría el suyo de servicio hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "fall-rescue",
    "industries": [
      "con"
    ],
    "code": "1926.503 / 1926.502(d)(20)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.503(a)(1)-(a)(2): fall protection training program and topics",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.503",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.503(b)(1): written certification of training",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.503",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.503(c)(1)-(c)(3): retraining",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.503",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(20): prompt rescue",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA SHIB 03-24-2004 (updated 2011): Suspension Trauma/Orthostatic Intolerance",
        "url": "https://www.osha.gov/sites/default/files/publications/shib032404.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Fall Protection Training and Rescue",
        "hook": "A harness stops the fall. It doesn't end the emergency. A worker hanging in a harness needs to come down fast.",
        "sections": [
          {
            "heading": "What your training covers",
            "items": [
              "If you might be exposed to a fall hazard, you get trained by a competent person. The company keeps a written record of that training.",
              "You learn the fall hazards in your work area, and how to set up, maintain, take down, and inspect the fall protection you'll use.",
              "You learn how to use the systems on the job, like guardrails, harnesses, safety nets, and warning lines. You also learn your role in the job's fall protection plan."
            ]
          },
          {
            "heading": "When you get retrained",
            "items": [
              "When the job changes and your old training doesn't fit anymore.",
              "When the fall protection system or equipment changes.",
              "When your work shows you've forgotten how to use your fall protection the right way."
            ]
          },
          {
            "heading": "After a fall: rescue fast",
            "items": [
              "The company has to plan for prompt rescue after a fall, or make sure workers can rescue themselves. Know that plan before you go up.",
              "Hanging in a harness after a fall can make you pass out. OSHA warns it can lead to unconsciousness, then death, in less than 30 minutes.",
              "Get a hanging worker down as quickly as possible."
            ]
          },
          {
            "heading": "If you're the one hanging",
            "items": [
              "If you can't get yourself down and help isn't there fast, pump your legs often to keep your blood moving. If you can reach a foothold, use it to take the pressure off.",
              "Know the warning signs: feeling faint, dizzy, sweaty, sick to your stomach, short of breath, going pale, or your vision going grey.",
              "After any rescue, the worker gets checked by a health-care professional."
            ]
          }
        ],
        "ask": "If someone fell right now and was hanging in a harness, who would get them down, and how?"
      },
      "es": {
        "title": "Capacitación y rescate en protección contra caídas",
        "hook": "El arnés detiene la caída. Pero ahí no se acaba la emergencia. Un trabajador colgado en un arnés tiene que bajar rápido.",
        "sections": [
          {
            "heading": "Lo que cubre tu capacitación",
            "items": [
              "Si puedes estar expuesto a un peligro de caída, te tiene que capacitar una persona competente. La compañía guarda un registro por escrito de esa capacitación.",
              "Aprendes cuáles son los peligros de caída en tu área de trabajo, y cómo instalar, mantener, desmontar e inspeccionar la protección contra caídas que vas a usar.",
              "Aprendes a usar los sistemas del trabajo, como barandas, arneses, redes de seguridad y líneas de advertencia. También aprendes cuál es tu papel en el plan de protección contra caídas del trabajo."
            ]
          },
          {
            "heading": "Cuándo te vuelven a capacitar",
            "items": [
              "Cuando el trabajo cambia y tu capacitación anterior ya no sirve.",
              "Cuando cambia el sistema o el equipo de protección contra caídas.",
              "Cuando tu trabajo muestra que se te olvidó cómo usar bien tu protección contra caídas."
            ]
          },
          {
            "heading": "Después de una caída: rescate rápido",
            "items": [
              "La compañía tiene que tener listo un rescate rápido en caso de caída, o asegurarse de que los trabajadores puedan rescatarse solos. Conoce ese plan antes de subir.",
              "Quedarte colgado en un arnés después de una caída te puede hacer desmayar. OSHA advierte que puede causar pérdida del conocimiento y luego la muerte en menos de 30 minutos.",
              "Baja a un trabajador colgado lo más rápido posible."
            ]
          },
          {
            "heading": "Si eres tú el que está colgado",
            "items": [
              "Si no puedes bajarte solo y la ayuda no llega rápido, mueve las piernas seguido, como pedaleando, para que la sangre siga circulando. Si alcanzas dónde apoyar los pies, úsalo para quitarte presión.",
              "Conoce las señales de alerta: sentirte débil, mareado, sudando, con náuseas, sin aire, ponerte pálido o que se te nuble la vista.",
              "Después de cualquier rescate, al trabajador lo tiene que revisar un profesional de la salud."
            ]
          }
        ],
        "ask": "Si alguien se cayera ahorita y quedara colgado en el arnés, ¿quién lo bajaría y cómo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "scaffold",
    "industries": [
      "con"
    ],
    "code": "1926.451 / 1926.454",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.454(a): training for employees working on scaffolds",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.454",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(f)(7): erecting, moving, dismantling under a competent person",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(c)(2): footings, base plates, mud sills, unstable objects",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(b)(1), (b)(2), (b)(4), (b)(5)(i), (b)(7): platforms and planking",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(e)(1): access, crossbraces not used as access",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(g)(1), (g)(1)(vii), (g)(4)(ii), (g)(4)(iv): fall protection over 10 ft, guardrail heights",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(f)(14), (f)(15): makeshift devices and ladders on platforms",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(f)(1), (f)(3), (f)(4), (f)(13): loads, competent-person inspection, damaged parts, debris",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.451(f)(8), (f)(12): snow and ice, storms and high winds",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Scaffold Safety",
        "hook": "A scaffold is only as safe as the way it was built and the last time it was checked. Know both before you climb.",
        "sections": [
          {
            "heading": "Setup and footing",
            "items": [
              "Before you work on a scaffold, you get trained on its hazards, including electrical, fall, and falling object hazards, and on how much load it can carry.",
              "Only trained, experienced workers put up, move, change, or take down a scaffold, and a competent person directs that work.",
              "Legs and frames sit on base plates and mud sills, or another firm foundation. The footing has to be level and solid enough to hold the loaded scaffold without settling or shifting.",
              "Never set a scaffold or a plank on anything unstable."
            ]
          },
          {
            "heading": "Planks and platforms",
            "items": [
              "Every working level is fully planked or decked. Gaps between planks, and between planks and uprights, stay at 1 inch or less. If a wider gap is truly needed, like fitting around uprights when side brackets are used, the open space at the uprights still can't go over 9 and a half inches.",
              "Platforms and walkways are at least 18 inches wide in most cases.",
              "Each plank end runs at least 6 inches past the center of its support, unless it's cleated or hooked. On a plank 10 feet or shorter, the end can't stick out more than 12 inches past the support, unless it's built to hold weight there or guarded off.",
              "Where planks overlap, they overlap only over a support, by at least 12 inches, unless they're nailed or held together."
            ]
          },
          {
            "heading": "Getting up and staying on",
            "items": [
              "If the platform is more than 2 feet above or below where you get on, use a ladder, stair tower, ramp, or other built access. Never climb the cross braces.",
              "On most scaffolds, more than 10 feet up you need guardrails or a personal fall arrest system. On supported scaffolds made or put in service after January 1, 2000, the top rail sits 38 to 45 inches above the platform, with a midrail about halfway.",
              "Don't stand on boxes, barrels, or other makeshift steps to get higher. Ladders on a platform are only allowed in special cases on large area scaffolds."
            ]
          },
          {
            "heading": "Inspection, loads, and weather",
            "items": [
              "A competent person inspects the scaffold for visible defects before each shift, and again after anything that could weaken it.",
              "Damaged parts get fixed, replaced, or braced right away, or the scaffold comes out of service. Never load it past its rated capacity or its maximum intended load, whichever is less, and don't let debris pile up on the platforms.",
              "No work on a scaffold covered with snow, ice, or anything slippery, except to clear it off.",
              "No work in storms or high winds, unless a competent person says it's safe and you're protected by a personal fall arrest system or wind screens."
            ]
          }
        ],
        "ask": "Who is our competent person for this scaffold, and has it been inspected this shift?"
      },
      "es": {
        "title": "Seguridad en andamios",
        "hook": "Un andamio es tan seguro como la forma en que lo armaron y la última vez que lo revisaron. Conoce las dos cosas antes de subir.",
        "sections": [
          {
            "heading": "Armado y base",
            "items": [
              "Antes de trabajar en un andamio, te tienen que capacitar sobre sus peligros, incluyendo los peligros eléctricos, de caídas y de objetos que caen, y sobre cuánto peso aguanta.",
              "Solo trabajadores capacitados y con experiencia arman, mueven, cambian o desarman un andamio, y una persona competente dirige ese trabajo.",
              "Las patas y los marcos van sobre placas base y durmientes de madera, o sobre otra base firme. La base tiene que estar nivelada y ser lo bastante sólida para aguantar el andamio cargado sin hundirse ni moverse.",
              "Nunca pongas un andamio ni un tablón sobre algo inestable."
            ]
          },
          {
            "heading": "Tablones y plataformas",
            "items": [
              "Cada nivel de trabajo va completamente entablado o con cubierta. Los espacios entre tablones, y entre los tablones y los parales, no pueden pasar de 1 pulgada. Si de verdad se necesita más espacio, como para pasar alrededor de los parales cuando se usan ménsulas laterales, el espacio abierto junto a los parales aun así no puede pasar de 9 pulgadas y media.",
              "Las plataformas y pasillos miden por lo menos 18 pulgadas de ancho en la mayoría de los casos.",
              "Cada punta de tablón pasa por lo menos 6 pulgadas del centro de su apoyo, a menos que tenga tacos o ganchos. En un tablón de 10 pies o menos, la punta no puede salir más de 12 pulgadas del apoyo, a menos que esté hecho para aguantar peso ahí o tenga baranda que bloquee el paso.",
              "Donde se traslapan los tablones, se traslapan solo sobre un apoyo, por lo menos 12 pulgadas, a menos que estén clavados o sujetados entre sí."
            ]
          },
          {
            "heading": "Cómo subir y mantenerte arriba",
            "items": [
              "Si la plataforma está a más de 2 pies arriba o abajo de donde te subes, usa una escalera, una torre de escaleras, una rampa u otro acceso hecho para eso. Nunca subas por las crucetas.",
              "En la mayoría de los andamios, a más de 10 pies de altura necesitas barandas o un sistema personal de detención de caídas. En andamios apoyados fabricados o puestos en servicio después del 1 de enero de 2000, la baranda de arriba va entre 38 y 45 pulgadas sobre la plataforma, con una baranda intermedia más o menos a la mitad.",
              "No te pares en cajas, barriles ni otros escalones improvisados para alcanzar más alto. Las escaleras sobre la plataforma solo se permiten en casos especiales en andamios de área grande."
            ]
          },
          {
            "heading": "Inspección, peso y clima",
            "items": [
              "Una persona competente inspecciona el andamio buscando defectos visibles antes de cada turno, y otra vez después de cualquier cosa que lo pueda debilitar.",
              "Las piezas dañadas se arreglan, se cambian o se refuerzan de inmediato, o el andamio se saca de servicio. Nunca lo cargues más de su capacidad nominal o de su carga máxima prevista, la que sea menor, y no dejes que se acumule basura en las plataformas.",
              "No se trabaja en un andamio cubierto de nieve, hielo o cualquier cosa resbalosa, excepto para limpiarlo.",
              "No se trabaja con tormenta o vientos fuertes, a menos que una persona competente diga que es seguro y estés protegido con un sistema personal de detención de caídas o con pantallas contra el viento."
            ]
          }
        ],
        "ask": "¿Quién es nuestra persona competente para este andamio, y ya lo inspeccionaron en este turno?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "aerial-lift",
    "industries": [
      "con"
    ],
    "code": "1926.453 / 1926.451 / 1926.454",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.453(b)(2)(i)-(b)(2)(viii), (b)(2)(xii): aerial lift operation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.453",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet: Aerial Lifts (2011)",
        "url": "https://www.osha.gov/sites/default/files/publications/AERIAL-LIFTS-FACTSHEET.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hazard Alert: Working Safely with Scissor Lifts (OSHA 3842), citing 1926.451(g) and 1926.454",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3842.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Aerial Lifts: Booms and Scissors",
        "hook": "A lift gets you up fast. Skip the basics and it can tip over or throw you out just as fast.",
        "sections": [
          {
            "heading": "Before you go up",
            "items": [
              "Only trained and authorized people run a lift.",
              "Test the controls every day before use, and do a pre-start inspection each shift. If anything is defective, don't run it.",
              "Set the brakes. Put outriggers on pads or solid ground. On a slope, chock the wheels when it's safe to do so."
            ]
          },
          {
            "heading": "In a boom lift: tie off",
            "items": [
              "Wear a harness with a lanyard attached to the boom or basket.",
              "Never tie off to a nearby pole, structure, or other equipment.",
              "Stand firmly on the floor of the basket. Don't sit or climb on the edge, and don't use planks or ladders to get higher."
            ]
          },
          {
            "heading": "In a scissor lift: the rails are your protection",
            "items": [
              "A scissor lift must have guardrails. Stand only on the platform. Never stand on the rails or lean over them.",
              "OSHA covers many scissor lifts under its scaffold rules.",
              "Set up on firm, level ground, away from anything that could make the lift unstable."
            ]
          },
          {
            "heading": "Loads, travel, power lines, and wind",
            "items": [
              "Never go over the manufacturer's load limit for the platform.",
              "Don't drive with the platform raised unless the manufacturer says that lift is built for it. Before moving a boom lift for travel, cradle the boom and stow the outriggers.",
              "Treat every overhead power line as live, and stay at least 10 feet away.",
              "Don't run a lift in winds above the manufacturer's limit. Outdoor scissor lifts are generally limited to winds under 28 miles per hour."
            ]
          }
        ],
        "ask": "What's the load limit on today's lift, and how much are we putting on it?"
      },
      "es": {
        "title": "Elevadores aéreos: de brazo y de tijera",
        "hook": "Un elevador te sube rápido. Si te saltas lo básico, también se puede voltear o tirarte igual de rápido.",
        "sections": [
          {
            "heading": "Antes de subir",
            "items": [
              "Solo personas capacitadas y autorizadas manejan un elevador.",
              "Prueba los controles todos los días antes de usarlo, y haz una inspección antes de arrancar cada turno. Si algo está malo, no lo uses.",
              "Pon los frenos. Pon los estabilizadores sobre almohadillas o sobre suelo firme. En una pendiente, pon calzas en las llantas cuando sea seguro hacerlo."
            ]
          },
          {
            "heading": "En un elevador de brazo: amárrate",
            "items": [
              "Usa un arnés con una línea de vida enganchada al brazo o a la canasta.",
              "Nunca te amarres a un poste, una estructura u otro equipo cercano.",
              "Párate firme en el piso de la canasta. No te sientes ni te subas a la orilla, y no uses tablones ni escaleras para alcanzar más alto."
            ]
          },
          {
            "heading": "En un elevador de tijera: las barandas son tu protección",
            "items": [
              "Un elevador de tijera tiene que tener barandas. Párate solo en la plataforma. Nunca te pares en las barandas ni te asomes por encima de ellas.",
              "OSHA cubre muchos elevadores de tijera bajo sus reglas de andamios.",
              "Instálalo en suelo firme y nivelado, lejos de cualquier cosa que lo pueda hacer inestable."
            ]
          },
          {
            "heading": "Peso, traslado, cables eléctricos y viento",
            "items": [
              "Nunca pases el límite de carga del fabricante para la plataforma.",
              "No manejes con la plataforma levantada, a menos que el fabricante diga que ese elevador está hecho para eso. Antes de mover un elevador de brazo para trasladarlo, baja el brazo a su soporte y recoge los estabilizadores.",
              "Trata todo cable eléctrico aéreo como si tuviera corriente, y mantente por lo menos a 10 pies de distancia.",
              "No uses un elevador con vientos más fuertes que el límite del fabricante. Los elevadores de tijera para exteriores generalmente están limitados a vientos de menos de 28 millas por hora."
            ]
          }
        ],
        "ask": "¿Cuál es el límite de carga del elevador de hoy, y cuánto peso le estamos poniendo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "falling-objects",
    "industries": [
      "con"
    ],
    "code": "1926.501(c) / 1926.502(j) / 1926.100",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.100(a): head protection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.100",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(c), (c)(1)-(c)(3): protection from falling objects",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(j)(1)-(j)(4): toeboards, paneling and screening",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(j)(7): roofing material storage near edges",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(j)(8): canopies",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction eTool: Struck-By, Falling/Flying Objects",
        "url": "https://www.osha.gov/etools/construction/struck-by",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Falling Objects and Toe Boards",
        "hook": "A dropped wrench doesn't care who's standing under it. Working up top means protecting the people below.",
        "sections": [
          {
            "heading": "Hard hats, plus one more layer",
            "items": [
              "If something could fall or fly and hit you in the head, you wear a hard hat.",
              "A hard hat isn't enough by itself. When people are exposed to falling objects, the job also needs one of these: toe boards, screens, or guardrails; a canopy; or a barricaded area nobody enters."
            ]
          },
          {
            "heading": "Toe boards and screens",
            "items": [
              "A toe board is at least 3 and a half inches tall, sits no more than a quarter inch above the deck, and has no openings bigger than 1 inch.",
              "It has to hold at least 50 pounds of force without failing, and run far enough along the edge to protect the people below.",
              "If tools or materials are piled higher than the toe board, put up paneling or screening up to the top rail or midrail."
            ]
          },
          {
            "heading": "Canopies and barricades",
            "items": [
              "A canopy has to be strong enough not to collapse, and strong enough that falling objects can't punch through it.",
              "With a canopy or a barricade, keep materials far enough back from the edge that they won't go over if they get bumped.",
              "A barricaded area means nobody goes in. Respect the barricade and the warning signs."
            ]
          },
          {
            "heading": "Keep it secured up top",
            "items": [
              "On a roof, don't store materials or equipment within 6 feet of the edge unless there are guardrails. Anything stacked near the edge has to be stable and able to stand on its own.",
              "Secure your tools and materials so they can't fall on people below. Stack materials so they can't slide, fall, or collapse.",
              "On the ground, don't work under loads being moved."
            ]
          }
        ],
        "ask": "What's above us today, and what's keeping it from coming down on someone?"
      },
      "es": {
        "title": "Objetos que caen y rodapiés",
        "hook": "A una llave que se cae no le importa quién está parado abajo. Trabajar arriba significa proteger a la gente de abajo.",
        "sections": [
          {
            "heading": "Casco, y una protección más",
            "items": [
              "Si algo te puede caer o salir volando y pegarte en la cabeza, usas casco.",
              "El casco solo no es suficiente. Cuando hay gente expuesta a objetos que caen, el trabajo también necesita una de estas: rodapiés, mallas o barandas; un techo de protección; o un área acordonada donde nadie entra."
            ]
          },
          {
            "heading": "Rodapiés y mallas",
            "items": [
              "Un rodapié mide por lo menos 3 pulgadas y media de alto, no queda a más de un cuarto de pulgada sobre el piso, y no tiene aberturas de más de 1 pulgada.",
              "Tiene que aguantar por lo menos 50 libras de fuerza sin fallar, y cubrir suficiente orilla para proteger a la gente de abajo.",
              "Si hay herramientas o materiales amontonados más alto que el rodapié, pon paneles o malla hasta la baranda de arriba o la intermedia."
            ]
          },
          {
            "heading": "Techos de protección y áreas acordonadas",
            "items": [
              "Un techo de protección tiene que ser lo bastante fuerte para no derrumbarse, y para que los objetos que caen no lo atraviesen.",
              "Con un techo de protección o un área acordonada, mantén los materiales lo bastante lejos de la orilla para que no se caigan si alguien los golpea.",
              "Un área acordonada quiere decir que nadie entra. Respeta la barrera y los letreros de advertencia."
            ]
          },
          {
            "heading": "Arriba, todo bien asegurado",
            "items": [
              "En un techo, no guardes materiales ni equipo a menos de 6 pies de la orilla, a menos que haya barandas. Todo lo que esté apilado cerca de la orilla tiene que estar estable y sostenerse solo.",
              "Asegura tus herramientas y materiales para que no le caigan a la gente de abajo. Apila los materiales para que no se resbalen, se caigan ni se derrumben.",
              "Abajo, no trabajes debajo de cargas que se están moviendo."
            ]
          }
        ],
        "ask": "¿Qué tenemos arriba hoy, y qué está evitando que le caiga encima a alguien?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "debris-chute",
    "industries": [
      "con"
    ],
    "code": "1926.252 / 1926.25",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.252(a): enclosed chutes for drops over 20 feet",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.252(b): drops through floor holes, 42-inch barricades 6 feet back, signs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.252(c): removing scrap as work progresses",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.252(e): solvent waste and oily rags in covered containers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.25(a): housekeeping in work areas, passageways and stairs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.25",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction eTool: Struck-By (falling objects)",
        "url": "https://www.osha.gov/etools/construction/struck-by",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four: Struck-By Hazards Instructor Guide",
        "url": "https://www.osha.gov/sites/default/files/struckby_ig.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Debris Chutes and Tear-Off",
        "hook": "Tear-off makes a lot of trash fast, and all of it has to come down. Anything you drop can land on somebody below.",
        "sections": [
          {
            "heading": "Long drops need a chute",
            "items": [
              "If material drops more than 20 feet to a spot outside the building, it has to go down a chute.",
              "That chute must be enclosed, closed in on all sides, and made of wood or an equivalent material. No open drops from that height."
            ]
          },
          {
            "heading": "Dropping through a floor opening",
            "items": [
              "If debris goes down through a hole in the floor with no chute, the landing area gets barricaded all the way around.",
              "Those barricades are at least 42 inches high and at least 6 feet back from the edge of the opening above.",
              "Post falling-material warning signs at each level. Nobody clears debris from the bottom while debris is still being handled up top."
            ]
          },
          {
            "heading": "Protect the people below",
            "items": [
              "Wherever material is coming down, barricade the area and post signs. Keep people out of the drop zone.",
              "Secure your tools and materials up top so they can't fall on anyone below.",
              "Wear your hard hat anywhere something could fall from above."
            ]
          },
          {
            "heading": "Keep it clean as you go",
            "items": [
              "Clear scrap and debris out of the work area as the work moves along. Don't let it pile up.",
              "Keep walkways, passageways and stairs clear, especially of scrap lumber with nails sticking out.",
              "Oily rags and solvent waste go in covered, fire-resistant containers until they leave the site."
            ]
          }
        ],
        "ask": "Where is today's drop zone, and how are we keeping people out of it?"
      },
      "es": {
        "title": "Ductos de escombros y desmonte de techo",
        "hook": "El desmonte del techo hace mucha basura rápido, y toda tiene que bajar. Cualquier cosa que tires puede caerle a alguien abajo.",
        "sections": [
          {
            "heading": "Las caídas largas necesitan ducto",
            "items": [
              "Si el material cae más de 20 pies hasta un punto fuera del edificio, tiene que bajar por un ducto.",
              "Ese ducto debe estar cerrado por todos lados y hecho de madera o de un material equivalente. Nada de tirar al aire libre desde esa altura."
            ]
          },
          {
            "heading": "Tirar por un hueco en el piso",
            "items": [
              "Si los escombros bajan por un hueco en el piso sin ducto, el área donde caen se cierra con barricadas por todos lados.",
              "Esas barricadas miden por lo menos 42 pulgadas de alto y van por lo menos a 6 pies del borde del hueco de arriba.",
              "Pon letreros de aviso de caída de materiales en cada nivel. Nadie saca escombros de abajo mientras todavía se están manejando escombros arriba."
            ]
          },
          {
            "heading": "Protege a la gente de abajo",
            "items": [
              "Donde esté bajando material, pon barricadas y letreros. Mantén a la gente fuera de la zona de caída.",
              "Asegura tus herramientas y materiales arriba para que no le caigan a nadie abajo.",
              "Usa tu casco en cualquier lugar donde algo pueda caer desde arriba."
            ]
          },
          {
            "heading": "Limpia mientras trabajas",
            "items": [
              "Saca los desperdicios y escombros del área de trabajo a medida que avanza el trabajo. No dejes que se amontonen.",
              "Mantén libres los caminos, pasillos y escaleras, sobre todo de madera de desecho con clavos salidos.",
              "Los trapos con aceite y los desechos de solventes van en recipientes tapados y resistentes al fuego hasta que salgan de la obra."
            ]
          }
        ],
        "ask": "¿Dónde está hoy la zona de caída, y cómo vamos a mantener a la gente fuera de ella?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "struck-vehicle",
    "industries": [
      "con"
    ],
    "code": "1926.601 / 1926.602",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.601(b)(4): obstructed rear view, reverse alarm or observer",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.601",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.601(b)(14): vehicle checks at the start of each shift",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.601",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.602(a)(9)(ii): earthmoving and compacting equipment in reverse",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.602",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.600(a)(3)(i)-(ii): blocking suspended equipment, lowering blades and buckets, parking brakes and chocks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction Focus Four Training",
        "url": "https://www.osha.gov/training/outreach/construction/focus-four",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four Training: Introduction (the four leading causes of fatalities on construction sites)",
        "url": "https://www.osha.gov/sites/default/files/constrfocusfour_introduction.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four: Struck-By Hazards Instructor Guide",
        "url": "https://www.osha.gov/sites/default/files/struckby_ig.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction eTool: Struck-By",
        "url": "https://www.osha.gov/etools/construction/struck-by",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Struck-By: Vehicles and Backing Up",
        "hook": "Struck-by is one of OSHA's Focus Four, the four leading causes of death on construction sites. Trucks and heavy equipment moving around the site are part of that.",
        "sections": [
          {
            "heading": "The backing rule",
            "items": [
              "If a vehicle's rear view is blocked, it can only back up if it has a backup alarm you can hear over the noise, or a spotter signals that it's safe.",
              "Same goes for earthmoving and compacting equipment like loaders and dozers. Working alarm, or a person signaling it's safe.",
              "No working alarm means no backing without a spotter."
            ]
          },
          {
            "heading": "On foot around equipment",
            "items": [
              "Never cross the path of a backing vehicle.",
              "Make sure the operator knows you're there before you get close. Get eye contact or a radio call back.",
              "Stay out of blind spots and out of the swing zone of backhoes and cranes.",
              "Wear high-visibility clothing. You need to be seen in all levels of light."
            ]
          },
          {
            "heading": "For drivers and operators",
            "items": [
              "Check your vehicle at the start of every shift. Defects get fixed before you use it.",
              "Wear your seat belt.",
              "When you park, set the parking brake. On a slope, chock the wheels too.",
              "Lower blades, buckets and dump bodies all the way, or block them, when you're not using them."
            ]
          },
          {
            "heading": "Dumping, lifting and riding",
            "items": [
              "Make sure everyone is clear before you dump or lift.",
              "Never work under equipment held up by jacks, hoists or slings until it's blocked or cribbed so it can't fall or shift.",
              "Nobody rides on equipment unless there's a safe place to ride."
            ]
          }
        ],
        "ask": "Who's spotting for the trucks today, and what's the signal for stop?"
      },
      "es": {
        "title": "Golpes: vehículos y retroceso",
        "hook": "Los golpes son uno de los Cuatro Focos de OSHA, las cuatro causas principales de muerte en las obras de construcción. Los camiones y la maquinaria pesada que se mueven por la obra son parte de eso.",
        "sections": [
          {
            "heading": "La regla para dar reversa",
            "items": [
              "Si un vehículo no tiene vista clara hacia atrás, solo puede dar reversa si tiene una alarma de retroceso que se oiga por encima del ruido, o si un señalero le indica que es seguro.",
              "Lo mismo para la maquinaria de movimiento de tierra y de compactación, como cargadores y buldóceres. Alarma funcionando, o una persona que le indique que es seguro.",
              "Si la alarma no funciona, no se da reversa sin señalero."
            ]
          },
          {
            "heading": "A pie cerca de la maquinaria",
            "items": [
              "Nunca cruces por el camino de un vehículo que va en reversa.",
              "Asegúrate de que el operador sepa que estás ahí antes de acercarte. Busca contacto visual o una respuesta por radio.",
              "No te metas en los puntos ciegos ni en el área de giro de las retroexcavadoras y las grúas.",
              "Usa ropa de alta visibilidad. Te tienen que ver con cualquier luz."
            ]
          },
          {
            "heading": "Para choferes y operadores",
            "items": [
              "Revisa tu vehículo al empezar cada turno. Los defectos se arreglan antes de usarlo.",
              "Ponte el cinturón de seguridad.",
              "Cuando te estaciones, pon el freno de mano. En una pendiente, pon también calzas en las llantas.",
              "Baja por completo las cuchillas, los cucharones y las cajas de volteo, o bloquéalos, cuando no los estés usando."
            ]
          },
          {
            "heading": "Descargar, levantar y montarse",
            "items": [
              "Asegúrate de que todos estén retirados antes de descargar o levantar.",
              "Nunca trabajes debajo de maquinaria sostenida con gatos, polipastos o eslingas hasta que esté bloqueada o calzada para que no se caiga ni se mueva.",
              "Nadie se monta en la maquinaria si no hay un lugar seguro para ir."
            ]
          }
        ],
        "ask": "¿Quién va a ser el señalero de los camiones hoy, y cuál es la señal para parar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "electrical-gfci",
    "industries": [
      "con"
    ],
    "code": "1926.404 / 1926.405 / 1926.416",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.404(b)(1)(i)-(iii): GFCIs or assured equipment grounding conductor program",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.404",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.405(a)(2)(ii)(I)-(J): protecting cords; three-wire extension cords",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.405",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.405(g)(2)(ii)-(iv): cord marking; no splices or taps; strain relief",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.405",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.416(e): worn or frayed cords; staples, nails, wire",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.302(a): double-insulated or grounded tools; no hoisting by cord",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.302",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction Focus Four Training: Introduction (the four leading causes of fatalities on construction sites)",
        "url": "https://www.osha.gov/sites/default/files/constrfocusfour_introduction.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four Training",
        "url": "https://www.osha.gov/training/outreach/construction/focus-four",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four: Electrocution Hazards Instructor Guide",
        "url": "https://www.osha.gov/sites/default/files/electr_ig.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction eTool: Electrical Incidents",
        "url": "https://www.osha.gov/etools/construction/electrical-incidents",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Electrical: GFCIs, Cords and Tools",
        "hook": "Electrocution is one of OSHA's Focus Four, the four leading causes of death on construction sites. A beat-up cord or a missing GFCI is a common way it starts.",
        "sections": [
          {
            "heading": "Ground-fault protection",
            "items": [
              "The company protects you one of two ways. The first is a GFCI on every 120-volt, 15- or 20-amp outlet on site that isn't part of the building's permanent wiring.",
              "The second is an assured grounding program. A competent person runs it, the cords and tools get tested, and the tests are written down. Your supervisor will tell you which one this job uses.",
              "A GFCI cuts the power when it senses a ground fault. Test a portable GFCI before every use. If it fails the test, don't use it. Replace it."
            ]
          },
          {
            "heading": "Check your cords",
            "items": [
              "Look over every cord before you use it. Cuts, worn spots, frayed jacket, missing ground prong? That cord comes out of service.",
              "Extension cords must be 3-wire and made for hard or extra-hard use. Check the cord for that marking.",
              "A cord is used in one continuous length, with no splices or taps. The only exception is a repair on heavy 12-gauge or bigger hard-service cord, spliced so it keeps the cord's insulation, outer jacket and rating.",
              "Cords connect to plugs and fittings with strain relief, so a pull doesn't yank on the wires."
            ]
          },
          {
            "heading": "Protect the cord",
            "items": [
              "Don't staple cords, hang them on nails, or hang them from wire.",
              "Keep cords away from sharp corners and edges. If a cord runs through a doorway or pinch point, protect it.",
              "Unplug by pulling the plug, not the cord. Never use a cord to raise or lower a tool."
            ]
          },
          {
            "heading": "Power tools",
            "items": [
              "Power tools must be double-insulated or grounded. Never remove the ground prong from a tool or cord.",
              "Cracked case or damaged cord? That tool comes out of service.",
              "Keep electric tools out of wet and damp spots."
            ]
          }
        ],
        "ask": "Where are the GFCIs on this site? Let's test them and check our cords before we start."
      },
      "es": {
        "title": "Electricidad: GFCI, cables y herramientas",
        "hook": "La electrocución es uno de los Cuatro Focos de OSHA, las cuatro causas principales de muerte en las obras de construcción. Un cable maltratado o la falta de un GFCI es una manera común de que empiece.",
        "sections": [
          {
            "heading": "Protección contra fallas a tierra",
            "items": [
              "La compañía te protege de una de dos maneras. La primera es un GFCI en todo tomacorriente de 120 voltios y 15 o 20 amperios en la obra que no sea parte del cableado permanente del edificio.",
              "La segunda es un programa de conexión a tierra asegurada. Una persona competente lo maneja, se prueban los cables y las herramientas, y las pruebas quedan por escrito. Tu supervisor te dirá cuál se usa en este trabajo.",
              "Un GFCI corta la corriente cuando detecta una falla a tierra. Prueba un GFCI portátil antes de cada uso. Si no pasa la prueba, no lo uses. Cámbialo."
            ]
          },
          {
            "heading": "Revisa tus cables",
            "items": [
              "Revisa cada cable antes de usarlo. ¿Cortes, partes gastadas, forro deshilachado, le falta la pata de tierra? Ese cable se saca de servicio.",
              "Las extensiones tienen que ser de 3 hilos y hechas para uso pesado o extra pesado. Busca esa marca en el cable.",
              "Un cable se usa en un solo tramo continuo, sin empalmes ni derivaciones. La única excepción es una reparación en cable de servicio pesado calibre 12 o más grueso, empalmado de forma que conserve el aislamiento, la cubierta exterior y la clasificación del cable.",
              "Los cables se conectan a los enchufes y accesorios con alivio de tensión, para que un jalón no jale los alambres."
            ]
          },
          {
            "heading": "Protege el cable",
            "items": [
              "No sujetes los cables con grapas, no los cuelgues de clavos ni los cuelgues con alambre.",
              "Mantén los cables lejos de esquinas y bordes filosos. Si un cable pasa por una puerta o un punto donde se puede aplastar, protégelo.",
              "Desconecta jalando el enchufe, no el cable. Nunca uses un cable para subir o bajar una herramienta."
            ]
          },
          {
            "heading": "Herramientas eléctricas",
            "items": [
              "Las herramientas eléctricas tienen que tener doble aislamiento o estar conectadas a tierra. Nunca le quites la pata de tierra a una herramienta ni a un cable.",
              "¿Carcasa rajada o cable dañado? Esa herramienta se saca de servicio.",
              "No uses herramientas eléctricas en lugares mojados o húmedos."
            ]
          }
        ],
        "ask": "¿Dónde están los GFCI en esta obra? Vamos a probarlos y revisar nuestros cables antes de empezar."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "power-lines",
    "industries": [
      "con"
    ],
    "code": "1926.416 / 1926.600(a)(6) / 1926.1408",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.416(a)(1): no work near energized circuits unless deenergized and grounded or guarded",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.416(a)(3): locate lines, post warning signs, advise employees",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.600(a)(6): equipment clearance from power lines, observer, lines presumed energized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1408(a)(2), (b), (e), Table A: cranes near power lines, 20-foot rule up to 350 kV unless de-energized and visibly grounded",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1408",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1053(b)(12): nonconductive side rails near energized equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction eTool: Electrical Incidents (contact with power lines)",
        "url": "https://www.osha.gov/etools/construction/electrical-incidents",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four: Electrocution Hazards Instructor Guide",
        "url": "https://www.osha.gov/sites/default/files/electr_ig.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Overhead Power Lines",
        "hook": "You don't have to touch a power line with your hand to get hurt. A ladder, a tool, or a machine that touches it can bring the current to you.",
        "sections": [
          {
            "heading": "Before work starts",
            "items": [
              "Before the job starts, the company has to find out if any power lines are where a person, tool or machine could contact them.",
              "Where there are lines, warning signs go up, and you'll be told where the lines are, what the hazards are, and how we're protected.",
              "Treat every overhead line as live, unless the utility says it isn't and it's visibly grounded.",
              "Nobody works close enough to contact a power circuit unless it's de-energized and grounded, or guarded by insulation or other means."
            ]
          },
          {
            "heading": "Ladders, tools and materials",
            "items": [
              "If you or your ladder could touch energized electrical equipment, use a ladder with nonconductive side rails, like wood or fiberglass. Not metal.",
              "Stay at least 10 feet away from overhead power lines.",
              "Bring an extension ladder down before you move it.",
              "Don't store materials under power lines."
            ]
          },
          {
            "heading": "Trucks, equipment and cranes",
            "items": [
              "For lines 50 kV or less, keep at least 10 feet between the lines and any part of the machine or its load. Higher voltage means more distance.",
              "If the operator can't see the clearance well, a person is assigned to watch it and warn him in time.",
              "For cranes, if any part of the crane, load line or load could get closer than 20 feet to a line, and the utility hasn't confirmed the line is de-energized and visibly grounded, extra steps kick in. That means a planning meeting, a warning line, and at least one more safeguard like a dedicated spotter or a proximity alarm. This 20-foot rule covers lines up to 350 kV.",
              "If tag lines are used near power lines, they must be non-conductive."
            ]
          }
        ],
        "ask": "Look up. Where are the power lines on this job, and what's the closest we'll get to them today?"
      },
      "es": {
        "title": "Líneas eléctricas aéreas",
        "hook": "No tienes que tocar una línea eléctrica con la mano para lastimarte. Una escalera, una herramienta o una máquina que la toque te puede pasar la corriente.",
        "sections": [
          {
            "heading": "Antes de empezar",
            "items": [
              "Antes de empezar el trabajo, la compañía tiene que averiguar si hay líneas eléctricas donde una persona, una herramienta o una máquina las pueda tocar.",
              "Donde haya líneas, se ponen letreros de aviso, y te van a decir dónde están las líneas, cuáles son los peligros y cómo estamos protegidos.",
              "Trata toda línea aérea como si tuviera corriente, a menos que la compañía de luz diga que no y que esté conectada a tierra a la vista.",
              "Nadie trabaja tan cerca que pueda tocar un circuito eléctrico, a menos que esté desenergizado y conectado a tierra, o protegido con aislamiento u otro medio."
            ]
          },
          {
            "heading": "Escaleras, herramientas y materiales",
            "items": [
              "Si tú o tu escalera pueden tocar equipo eléctrico con corriente, usa una escalera con rieles laterales que no conduzcan electricidad, como de madera o fibra de vidrio. No de metal.",
              "Mantente por lo menos a 10 pies de las líneas eléctricas aéreas.",
              "Baja la escalera de extensión antes de moverla.",
              "No guardes materiales debajo de las líneas eléctricas."
            ]
          },
          {
            "heading": "Camiones, maquinaria y grúas",
            "items": [
              "Para líneas de 50 kV o menos, deja por lo menos 10 pies entre las líneas y cualquier parte de la máquina o de su carga. Más voltaje quiere decir más distancia.",
              "Si el operador no puede ver bien la distancia, se asigna a una persona para que la vigile y le avise a tiempo.",
              "Con las grúas, si cualquier parte de la grúa, el cable de carga o la carga se puede acercar a menos de 20 pies de una línea, y la compañía de luz no ha confirmado que la línea está desenergizada y con conexión a tierra visible, hay pasos extra. Eso quiere decir una reunión de planeación, una línea de advertencia y por lo menos otra protección, como un señalero dedicado o una alarma de proximidad. Esta regla de 20 pies sirve para líneas de hasta 350 kV.",
              "Si se usan cuerdas guía cerca de las líneas eléctricas, tienen que ser de material que no conduzca electricidad."
            ]
          }
        ],
        "ask": "Miren para arriba. ¿Dónde están las líneas eléctricas en este trabajo, y qué tan cerca vamos a estar de ellas hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "nail-gun",
    "industries": [
      "con"
    ],
    "code": "1926.302(b) / 1926.102",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA/NIOSH Nail Gun Safety: A Guide for Construction Contractors (OSHA 3459-8-11, NIOSH 2011-202): trigger types, risk factors, disconnecting air, 12-inch rule, PPE",
        "url": "https://stacks.cdc.gov/view/cdc/6013/cdc_6013_DS1.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1926.302(b)(5): manufacturer's safe operating pressure",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.302",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.302(b)(6): no hoisting or lowering tools by the hose",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.302",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(a)(2): side protection from flying objects",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Nail Gun Safety",
        "hook": "Nail guns send an estimated 37,000 people to the emergency room every year. More than half of nail gun injuries are to the hand and fingers.",
        "sections": [
          {
            "heading": "Know your trigger",
            "items": [
              "A full sequential trigger only fires when you do things in order: press the tip to the work, then pull the trigger. It's the safest kind of trigger.",
              "A contact trigger, the bump kind, can double fire. It can also fire if you're holding the trigger and the tip gets knocked. The overall injury risk is twice as high with a contact trigger.",
              "If you're working from a ladder, use a full sequential nailer. Keep three points of contact with the ladder."
            ]
          },
          {
            "heading": "Handle it right",
            "items": [
              "Keep your finger off the trigger when you carry the gun or hold it.",
              "Never bypass or disable a safety feature. That includes pulling the spring out of the safety contact tip.",
              "Keep your other hand at least 12 inches from the nailing point. Use a clamp to brace the piece if you can.",
              "Always shoot away from your body and away from the crew. About 1 in 10 nail gun injuries happen to a co-worker."
            ]
          },
          {
            "heading": "Disconnect the air",
            "items": [
              "Unhook the air when you clear a jam, do any maintenance, leave the gun, or hand it to someone.",
              "Unhook it before you go up or down a ladder or stairs. Never raise or lower a tool by its hose.",
              "Don't run the hose and fittings above the pressure the manufacturer says is safe."
            ]
          },
          {
            "heading": "Watch the wood, protect yourself",
            "items": [
              "Check the surface before you nail. Look for knots, old nails, straps and hangers. Knots and metal hardware are common causes of nails bouncing off and flying. Take extra care with toe-nailing.",
              "Wear safety glasses or goggles marked Z87.1 with side protection, plus hearing protection, a hard hat and safety shoes.",
              "Got hit, even a little? Report it and get medical attention right away."
            ]
          }
        ],
        "ask": "Who's running a contact trigger today? Show me, and let's talk about where you'll be using it."
      },
      "es": {
        "title": "Seguridad con pistolas de clavos",
        "hook": "Las pistolas de clavos mandan a unas 37,000 personas a la sala de emergencias cada año. Más de la mitad de las lesiones con pistola de clavos son en la mano y los dedos.",
        "sections": [
          {
            "heading": "Conoce tu gatillo",
            "items": [
              "Un gatillo secuencial completo solo dispara cuando haces las cosas en orden: primero aprietas la punta contra el material y luego jalas el gatillo. Es el tipo de gatillo más seguro.",
              "Un gatillo de contacto, el de \"rebote\", puede disparar dos veces. También puede disparar si tienes el gatillo apretado y la punta se golpea con algo. El riesgo de lesión es el doble con un gatillo de contacto.",
              "Si estás trabajando en una escalera, usa una pistola con gatillo secuencial completo. Mantén tres puntos de contacto con la escalera."
            ]
          },
          {
            "heading": "Úsala bien",
            "items": [
              "Mantén el dedo fuera del gatillo cuando cargas o sostienes la pistola.",
              "Nunca le quites ni le anules un dispositivo de seguridad. Eso incluye sacarle el resorte a la punta de contacto de seguridad.",
              "Mantén la otra mano a por lo menos 12 pulgadas del punto donde entra el clavo. Si puedes, usa una prensa para sujetar la pieza.",
              "Siempre dispara lejos de tu cuerpo y lejos de los compañeros. Más o menos 1 de cada 10 lesiones con pistola de clavos le pasa a un compañero de trabajo."
            ]
          },
          {
            "heading": "Desconecta el aire",
            "items": [
              "Desconecta el aire cuando saques un clavo atorado, le hagas cualquier mantenimiento, dejes la pistola o se la pases a alguien.",
              "Desconéctala antes de subir o bajar una escalera o escaleras. Nunca subas ni bajes una herramienta colgada de la manguera.",
              "No uses la manguera ni las conexiones a más presión de la que el fabricante dice que es segura."
            ]
          },
          {
            "heading": "Revisa la madera y protégete",
            "items": [
              "Revisa la superficie antes de clavar. Busca nudos, clavos viejos, flejes y colgadores. Los nudos y los herrajes de metal son causas comunes de que un clavo rebote y salga volando. Ten mucho cuidado al clavar en ángulo.",
              "Usa lentes de seguridad o goggles marcados Z87.1 con protección a los lados, y además protección para los oídos, casco y zapatos de seguridad.",
              "¿Te pegó un clavo, aunque sea poquito? Repórtalo y busca atención médica de inmediato."
            ]
          }
        ],
        "ask": "¿Quién va a usar hoy una pistola con gatillo de contacto? Enséñamela y hablemos de dónde la vas a usar."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hot-work",
    "industries": [
      "con"
    ],
    "code": "1926.352 / 1926.150 / 1926.153",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.352(a)-(b): move or protect fire hazards; confine heat, sparks and slag",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.352",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.352(d): fire extinguishing equipment immediately available",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.352",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.352(e): fire watch",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.352",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.352(f): precautions on the opposite side of walls, floors, ceilings",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.352",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.150(a)(2): access to firefighting equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.150",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.150(c)(1)(i): 100-foot travel distance to an extinguisher",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.150",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.150(c)(1)(vi): 10B extinguisher within 50 feet of flammable liquids or gas",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.150",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.151(a)(3): no smoking near fire hazards",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.151",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.153(g): containers outside buildings upright on firm foundations or firmly secured",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.153(j): no LPG storage inside buildings",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.153(l): 20-B:C extinguisher at LPG storage",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.153",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Hot Work and Torch-Down Roofing",
        "hook": "Heat and sparks from a torch can start a fire. And the fire watch doesn't end when the torch shuts off.",
        "sections": [
          {
            "heading": "Before you light up",
            "items": [
              "Move anything that can burn out of the way. If it can't be moved, protect it, and keep the heat and sparks contained.",
              "Working on a wall, floor or ceiling? Take the same fire precautions on the other side."
            ]
          },
          {
            "heading": "Fire watch",
            "items": [
              "When normal precautions aren't enough, an extra person is assigned to watch for fire. That's someone other than the person running the torch.",
              "The fire watch stays the whole time the torch is running, and after the work is done, long enough to make sure there's no chance of fire. Your supervisor will tell you how long.",
              "The fire watch has to know what fire hazards to look for and how to use the extinguisher on site."
            ]
          },
          {
            "heading": "Extinguishers",
            "items": [
              "A working fire extinguisher has to be right there in the work area, ready to use.",
              "Where more than 5 pounds of flammable gas like propane is being used, there must be an extinguisher rated at least 10B within 50 feet.",
              "Never block the path to an extinguisher. On the building, nobody should have to walk more than 100 feet to reach one."
            ]
          },
          {
            "heading": "Propane cylinders",
            "items": [
              "Set cylinders upright on a firm base, or secure them so they can't fall.",
              "Never store propane inside a building. Where cylinders are stored, there must be an extinguisher rated at least 20-B:C.",
              "No smoking near the torch work or the propane."
            ]
          }
        ],
        "ask": "Who's on fire watch today, and where's the closest extinguisher? Point to it."
      },
      "es": {
        "title": "Trabajo en caliente y techos con soplete",
        "hook": "El calor y las chispas de un soplete pueden empezar un incendio. Y la vigilancia contra incendios no termina cuando se apaga el soplete.",
        "sections": [
          {
            "heading": "Antes de prender",
            "items": [
              "Quita del camino todo lo que se pueda quemar. Si no se puede mover, protégelo, y mantén el calor y las chispas controlados.",
              "¿Trabajas en una pared, un piso o un techo? Toma las mismas precauciones contra incendios del otro lado."
            ]
          },
          {
            "heading": "Vigilancia contra incendios",
            "items": [
              "Cuando las precauciones normales no son suficientes, se asigna a una persona extra para vigilar que no haya fuego. Es alguien que no es el que está usando el soplete.",
              "El vigilante se queda todo el tiempo que el soplete está prendido, y después de terminar el trabajo, el tiempo suficiente para asegurarse de que no hay ninguna posibilidad de fuego. Tu supervisor te dirá cuánto tiempo.",
              "El vigilante tiene que saber qué peligros de incendio buscar y cómo usar el extintor que hay en el trabajo."
            ]
          },
          {
            "heading": "Extintores",
            "items": [
              "Tiene que haber un extintor que funcione ahí mismo en el área de trabajo, listo para usarse.",
              "Donde se usan más de 5 libras de gas inflamable, como el propano, tiene que haber un extintor de clasificación 10B o mayor a no más de 50 pies.",
              "Nunca bloquees el paso a un extintor. En el edificio, nadie debe tener que caminar más de 100 pies para llegar a uno."
            ]
          },
          {
            "heading": "Tanques de propano",
            "items": [
              "Pon los tanques parados sobre una base firme, o asegúralos para que no se caigan.",
              "Nunca guardes propano dentro de un edificio. Donde se guardan los tanques, tiene que haber un extintor de clasificación 20-B:C o mayor.",
              "Nada de fumar cerca del trabajo con soplete ni del propano."
            ]
          }
        ],
        "ask": "¿Quién es hoy el vigilante contra incendios, y dónde está el extintor más cercano? Señálalo."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "silica",
    "industries": [
      "con"
    ],
    "code": "1926.1153",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.1153(c)(1) Table 1, rows (i) stationary masonry saws and (ii) handheld power saws",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1153(c)(2)(ii): water flow sufficient to minimize visible dust",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1153(f): housekeeping (no dry sweeping or compressed air)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1153(g): written exposure control plan; (g)(4) competent person",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153",
        "kind": "standard"
      },
      {
        "label": "OSHA Silica, Crystalline (materials, tasks, health effects)",
        "url": "https://www.osha.gov/silica-crystalline",
        "kind": "guidance"
      },
      {
        "label": "OSHA Fact Sheet FS-3681: Silica Standard for Construction",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3681.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3902 small-entity guide to the construction silica standard (water supply, nozzle, hoses; task duration)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3902.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Silica Dust: Cutting Concrete, Stone and Tile",
        "hook": "The dust from cutting concrete and stone can cause silicosis. It's a lung disease with no cure, and it can kill you.",
        "sections": [
          {
            "heading": "What's in the dust",
            "items": [
              "Sand, stone, concrete and mortar contain crystalline silica. Silica is also used to make ceramics, brick and artificial stone.",
              "Cutting, grinding or drilling these makes a fine dust that can travel deep into your lungs. Besides silicosis, it causes lung cancer, COPD and kidney disease.",
              "That includes concrete, stone or ceramic tile. Treat that dust as silica dust."
            ]
          },
          {
            "heading": "Wet saws",
            "items": [
              "A handheld power saw or a stationary masonry saw needs a built-in water system that keeps feeding water to the blade.",
              "Run enough water to keep visible dust down. Check that you have enough water, the nozzle isn't clogged, and the hoses and connections are intact.",
              "Run and maintain the saw the way the manufacturer says, to keep the dust down."
            ]
          },
          {
            "heading": "When you need a respirator",
            "items": [
              "OSHA's table for handheld power saws: indoors or in an enclosed area, you need a respirator rated APF 10 or higher, no matter how long you cut.",
              "Outdoors, you need it once your cutting time on that task goes over 4 hours in a shift. Breaks and cleanup during the task count toward that time.",
              "When a respirator is required, the company provides it. Ask your supervisor if you're not sure which one to wear."
            ]
          },
          {
            "heading": "Cleanup",
            "items": [
              "No dry sweeping or dry brushing where it will put silica dust in the air. Use wet sweeping or a HEPA vacuum.",
              "Don't use compressed air to clean off your clothes or surfaces where it can put silica dust in the air.",
              "The company has a written silica plan and a competent person who inspects the jobsite. Know who that person is."
            ]
          }
        ],
        "ask": "What are we cutting today, inside or outside, and for how long? Let's figure out right now if anyone needs a respirator."
      },
      "es": {
        "title": "Polvo de sílice: cortar concreto, piedra y teja",
        "hook": "El polvo de cortar concreto y piedra puede causar silicosis. Es una enfermedad de los pulmones que no tiene cura, y te puede matar.",
        "sections": [
          {
            "heading": "Qué hay en el polvo",
            "items": [
              "La arena, la piedra, el concreto y la mezcla tienen sílice cristalina. La sílice también se usa para hacer cerámica, ladrillo y piedra artificial.",
              "Cortar, esmerilar o taladrar estos materiales hace un polvo fino que puede llegar hasta el fondo de los pulmones. Además de la silicosis, causa cáncer de pulmón, EPOC y enfermedad de los riñones.",
              "Eso incluye las tejas y los azulejos de concreto, piedra o cerámica. Trata ese polvo como polvo de sílice."
            ]
          },
          {
            "heading": "Sierras con agua",
            "items": [
              "Una sierra eléctrica de mano o una sierra fija de mampostería necesita un sistema de agua integrado que le eche agua al disco todo el tiempo.",
              "Usa suficiente agua para que no se vea polvo en el aire. Revisa que tengas suficiente agua, que la boquilla no esté tapada y que las mangueras y conexiones estén en buen estado.",
              "Usa y dale mantenimiento a la sierra como dice el fabricante, para que suelte menos polvo."
            ]
          },
          {
            "heading": "Cuándo necesitas respirador",
            "items": [
              "La tabla de OSHA para sierras de mano: adentro o en un área cerrada, necesitas un respirador con factor de protección APF 10 o mayor, sin importar cuánto tiempo cortes.",
              "Afuera, lo necesitas cuando tu tiempo cortando en esa tarea pasa de 4 horas en un turno. Los descansos y la limpieza durante la tarea cuentan en ese tiempo.",
              "Cuando se requiere respirador, la compañía te lo da. Pregúntale a tu supervisor si no estás seguro de cuál usar."
            ]
          },
          {
            "heading": "Limpieza",
            "items": [
              "Nada de barrer o cepillar en seco donde eso levante polvo de sílice. Barre en mojado o usa una aspiradora con filtro HEPA.",
              "No uses aire comprimido para limpiarte la ropa ni limpiar superficies donde eso pueda levantar polvo de sílice.",
              "La compañía tiene un plan escrito para la sílice y una persona competente que inspecciona el lugar de trabajo. Debes saber quién es esa persona."
            ]
          }
        ],
        "ask": "¿Qué vamos a cortar hoy, adentro o afuera, y por cuánto tiempo? Vamos a ver ahorita si alguien necesita respirador."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "eye-face",
    "industries": [
      "con"
    ],
    "code": "1926.102",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1926.102(a)(1): when eye or face protection is required",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(a)(2): side protection from flying objects",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(a)(3): prescription lenses",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(a)(4): manufacturer marking",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(a)(5)(ii)-(vi): comfort, fit, durable, cleanable",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(b)(1): ANSI Z87.1 consensus standards",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA Eye and Face Protection",
        "url": "https://www.osha.gov/eye-face-protection",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3151 Personal Protective Equipment: eye and face protection (face shields, prescription lenses)",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3151.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA/NIOSH Nail Gun Safety guide (OSHA 3459-8-11): eye protection marked ANSI Z87.1",
        "url": "https://stacks.cdc.gov/view/cdc/6013/cdc_6013_DS1.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Eye and Face Protection",
        "hook": "Thousands of people are blinded every year by work injuries that could have been prevented. Picking the right eye and face protection, and wearing it, is how you prevent them.",
        "sections": [
          {
            "heading": "When you need it",
            "items": [
              "Any time there's a hazard from flying particles, molten metal, chemicals, acids, gases or vapors, or harmful light, you need eye or face protection.",
              "Flying objects means side protection too. Clip-on or slide-on side shields are OK if they meet the standard.",
              "Look for safety glasses or goggles marked Z87.1. That's the ANSI standard OSHA points to. Eye protection also has to be marked so you can tell who made it."
            ]
          },
          {
            "heading": "Prescription glasses",
            "items": [
              "Regular prescription glasses don't give you enough protection.",
              "Wear safety glasses made with your prescription, or eye protection that fits over your glasses without pushing them out of place."
            ]
          },
          {
            "heading": "Face shields",
            "items": [
              "A face shield alone won't protect you from impact.",
              "Wear safety glasses or goggles under the face shield. Together they give you more protection."
            ]
          },
          {
            "heading": "Fit and care",
            "items": [
              "Your eye protection should fit snug, be reasonably comfortable, and not get in the way of your work.",
              "Keep it clean and in good shape. PPE has to be kept clean and reliable."
            ]
          }
        ],
        "ask": "What on today's job could throw something into your eyes? Everybody hold up your safety glasses."
      },
      "es": {
        "title": "Protección de ojos y cara",
        "hook": "Miles de personas quedan ciegas cada año por lesiones en el trabajo que se pudieron haber evitado. Escoger la protección correcta para los ojos y la cara, y usarla, es cómo se evitan.",
        "sections": [
          {
            "heading": "Cuándo la necesitas",
            "items": [
              "Siempre que haya peligro de partículas que salen volando, metal derretido, químicos, ácidos, gases o vapores, o luz dañina, necesitas protección para los ojos o la cara.",
              "Si hay objetos que salen volando, también necesitas protección a los lados. Los protectores laterales de clip o de deslizar están bien si cumplen con la norma.",
              "Busca lentes de seguridad o goggles marcados Z87.1. Esa es la norma ANSI que OSHA usa. La protección para los ojos también tiene que estar marcada para saber quién la fabricó."
            ]
          },
          {
            "heading": "Lentes de receta",
            "items": [
              "Los lentes normales de receta no te protegen lo suficiente.",
              "Usa lentes de seguridad hechos con tu receta, o protección que te quede encima de tus lentes sin moverlos de su lugar."
            ]
          },
          {
            "heading": "Caretas",
            "items": [
              "Una careta sola no te protege contra golpes.",
              "Usa lentes de seguridad o goggles debajo de la careta. Juntos te dan más protección."
            ]
          },
          {
            "heading": "Ajuste y cuidado",
            "items": [
              "Tu protección para los ojos debe quedarte firme, ser cómoda y no estorbarte en el trabajo.",
              "Mantenla limpia y en buen estado. El equipo de protección se tiene que mantener limpio y confiable."
            ]
          }
        ],
        "ask": "¿Qué hay en el trabajo de hoy que te pueda aventar algo a los ojos? Todos levanten sus lentes de seguridad."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "stairways",
    "industries": [
      "con"
    ],
    "code": "1926.1051 / 1926.1052",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.1051(a): when a stairway or ladder is required, incl. (a)(1) spiral stairs, (a)(3) single point of access",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1051",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1051(b): stairway fall protection installed before work begins",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1051",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1052(a): general, incl. (a)(3) uniform risers, (a)(5) pan stairs secured, (a)(6) projections, (a)(7) slippery conditions",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1052",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1052(b): temporary service, pan and skeleton metal stairs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1052",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1052(c): stairrails and handrails, incl. (c)(1), (c)(5), (c)(12)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1052",
        "kind": "standard"
      },
      {
        "label": "OSHA 3124: Stairways and Ladders, A Guide to OSHA Rules",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3124.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Stairways on the Job",
        "hook": "Stairs on a job site can be temporary or unfinished. Know what a safe stairway looks like before you use one.",
        "sections": [
          {
            "heading": "When you need stairs or a ladder",
            "items": [
              "If there's a step up or down of 19 inches or more, and no ramp, runway, sloped embankment, or personnel hoist, your company has to provide a stairway or a ladder.",
              "If there's only one way between levels, keep it clear. If work has to block it, a second way up and down has to be set up and used.",
              "Don't use a spiral stairway unless it's going to be a permanent part of the building."
            ]
          },
          {
            "heading": "Rails",
            "items": [
              "Stairs with 4 or more risers, or that rise more than 30 inches, need at least one handrail. Every open side also needs a stair rail.",
              "Open sides and edges of landings need guardrails.",
              "Your company has to put this rail protection in before the crew starts the work that needs the stairs.",
              "A handrail or top rail has to hold at least 200 pounds pushed down or out near the top."
            ]
          },
          {
            "heading": "Pan stairs and metal stairs",
            "items": [
              "Metal pan treads and landings get secured in place before they're filled with concrete or other material.",
              "Unless you're building the stairs, stay off pan stairs that haven't been filled yet, unless they're temporarily filled or covered with solid material up to the top of the pan.",
              "Same for skeleton metal stairs. Stay off them until secured temporary treads and landings cover the whole area.",
              "Temporary treads are wood or other solid material, and they cover the full width and depth of the step."
            ]
          },
          {
            "heading": "Keep them clean",
            "items": [
              "Slippery stairs get fixed before anyone uses them to get to another level.",
              "No sticking-out nails or other dangerous projections on any part of the stairs.",
              "Steps in a flight have to be the same height and depth, within a quarter inch."
            ]
          }
        ],
        "ask": "Which stairs are we using today, and does every open side have a rail?"
      },
      "es": {
        "title": "Escaleras en la obra",
        "hook": "Las escaleras en una obra pueden ser temporales o estar sin terminar. Aprende cómo se ve una escalera segura antes de usarla.",
        "sections": [
          {
            "heading": "Cuándo necesitas escalera fija o escalera de mano",
            "items": [
              "Si hay un desnivel de 19 pulgadas o más, y no hay rampa, pasarela, terraplén inclinado ni montacargas para personas, tu compañía tiene que poner una escalera fija o una escalera de mano.",
              "Si hay un solo paso entre niveles, mantenlo libre. Si el trabajo lo tiene que bloquear, hay que instalar y usar un segundo paso para subir y bajar.",
              "No uses una escalera de caracol a menos que vaya a quedar como parte permanente del edificio."
            ]
          },
          {
            "heading": "Barandas",
            "items": [
              "Las escaleras con 4 o más contrahuellas, o que suben más de 30 pulgadas, necesitan por lo menos un pasamanos. Cada lado abierto también necesita una baranda de escalera.",
              "Los lados y bordes abiertos de los descansos necesitan barandas de protección.",
              "Tu compañía tiene que instalar estas barandas antes de que la cuadrilla empiece el trabajo que necesita las escaleras.",
              "Un pasamanos o riel superior tiene que aguantar por lo menos 200 libras empujando hacia abajo o hacia afuera cerca de la parte de arriba."
            ]
          },
          {
            "heading": "Escaleras de bandeja y escaleras de metal",
            "items": [
              "Los escalones y descansos de bandeja de metal se aseguran en su lugar antes de rellenarlos con concreto u otro material.",
              "A menos que estés construyendo la escalera, no pises escaleras de bandeja que todavía no se han rellenado, a menos que estén rellenas o cubiertas temporalmente con material sólido hasta el borde de la bandeja.",
              "Lo mismo con las escaleras de esqueleto de metal. No las pises hasta que tengan escalones y descansos temporales asegurados que cubran toda el área.",
              "Los escalones temporales son de madera u otro material sólido, y cubren todo el ancho y toda la profundidad del escalón."
            ]
          },
          {
            "heading": "Mantenlas limpias",
            "items": [
              "Si una escalera está resbalosa, se arregla antes de que alguien la use para pasar a otro nivel.",
              "Nada de clavos salidos ni otras puntas peligrosas en ninguna parte de la escalera.",
              "Los escalones de un mismo tramo tienen que tener la misma altura y profundidad, con no más de un cuarto de pulgada de diferencia."
            ]
          }
        ],
        "ask": "¿Qué escaleras vamos a usar hoy, y tiene baranda cada lado abierto?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "rigging",
    "industries": [
      "con"
    ],
    "code": "1926.251 / 1926.1424 / 1926.1425",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.251(a): rigging general, incl. (a)(2)(ii) safe working load, (a)(6) daily sling inspection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.251",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.251(c): wire rope, incl. (c)(4)(iv) removal, (c)(6), (c)(7), (c)(9), (c)(11)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.251",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.251(e)(8): synthetic web sling removal",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.251",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1401: definitions, fall zone and tagline",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1401",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1417(w): tag or restraint lines",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1417",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1419(h), (j): one signal person at a time; anyone gives the stop signal",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1419",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1424(a)(2)-(a)(3): swing radius barriers and informing the operator",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1424",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1425(b)-(d): fall zone, hooking and guiding, receiving a load",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1425",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction Focus Four: Struck-By Hazards instructor guide",
        "url": "https://www.osha.gov/sites/default/files/struckby_ig.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hoisting and Rigging",
        "hook": "When materials are lifted, they can swing and strike workers. Loads can also slip out of their rigging.",
        "sections": [
          {
            "heading": "Inspect the rigging",
            "items": [
              "Each day before use, a competent person your company picks inspects every sling and all its fittings. A damaged or defective sling comes out of service right away.",
              "Pull a web sling for acid or caustic burns, melting or charring, snags, punctures, tears or cuts, broken or worn stitches, or bent fittings.",
              "Wire rope comes out of service for too many broken wires, or heavy wear, corrosion, or other defects.",
              "Never load rigging past its safe working load. Know what the load weighs and what the rigging is rated for."
            ]
          },
          {
            "heading": "Rig it right",
            "items": [
              "With wire rope slings, no kinked legs, and no shortening them with knots, bolts, or other makeshift fixes.",
              "Pad or protect wire rope slings from sharp edges on the load. No shock loading.",
              "A tag line is a rope tied to the load to control spinning and swinging. Use one when the load could spin in a dangerous way."
            ]
          },
          {
            "heading": "Stay out of the fall zone",
            "items": [
              "The fall zone is any area where the load could fall if something goes wrong, not just right under it.",
              "Stay clear of lifted loads, and never work under a suspended load.",
              "If you're in the fall zone to hook, unhook, or guide a load, it has to be rigged by a qualified rigger so it can't shift, with self-closing latch hooks.",
              "When a load is landing, only the people needed to receive it are in the fall zone."
            ]
          },
          {
            "heading": "Swing radius and signals",
            "items": [
              "Your company has to mark the crane's swing area with barriers like warning lines or railings, or with signs and markings where barriers won't work. Don't go into that zone.",
              "If you have to go in where the operator can't see you, make sure the operator knows first. The operator doesn't swing until told through the agreed signal system.",
              "Only one person gives signals to the crane at a time. But anyone who sees a safety problem gives the stop or emergency stop signal."
            ]
          }
        ],
        "ask": "Who is the signal person on today's lift, and where does the fall zone end?"
      },
      "es": {
        "title": "Izaje y aparejos",
        "hook": "Cuando se levantan materiales, pueden columpiarse y golpear a los trabajadores. Las cargas también se pueden zafar de sus aparejos.",
        "sections": [
          {
            "heading": "Revisa los aparejos",
            "items": [
              "Cada día antes de usarla, una persona competente que escoge tu compañía revisa cada eslinga y todos sus accesorios. Una eslinga dañada o defectuosa se saca de servicio de inmediato.",
              "Saca de servicio una eslinga de cinta si tiene quemaduras de ácido o químicos cáusticos, partes derretidas o chamuscadas, enganches, perforaciones, rasgaduras o cortes, costuras rotas o gastadas, o accesorios doblados.",
              "El cable de acero se saca de servicio si tiene demasiados alambres rotos, o mucho desgaste, corrosión u otros defectos.",
              "Nunca cargues un aparejo más allá de su carga de trabajo segura. Sabe cuánto pesa la carga y para cuánto está clasificado el aparejo."
            ]
          },
          {
            "heading": "Apareja bien",
            "items": [
              "Con eslingas de cable de acero, nada de ramales torcidos, y no las acortes con nudos, pernos ni otros inventos.",
              "Protege las eslingas de cable de acero de los filos de la carga con acolchado u otra protección. Nada de cargas de golpe.",
              "Un cabo guía es una cuerda amarrada a la carga para controlar que gire o se columpie. Úsalo cuando la carga pueda girar de forma peligrosa."
            ]
          },
          {
            "heading": "No te metas en la zona de caída",
            "items": [
              "La zona de caída es cualquier área donde la carga podría caer si algo sale mal, no solo justo debajo de ella.",
              "Mantente lejos de las cargas levantadas, y nunca trabajes debajo de una carga suspendida.",
              "Si estás en la zona de caída para enganchar, desenganchar o guiar una carga, la tiene que aparejar un aparejador calificado para que no se mueva, con ganchos con seguro de cierre automático.",
              "Cuando una carga está aterrizando, solo la gente que se necesita para recibirla está en la zona de caída."
            ]
          },
          {
            "heading": "Radio de giro y señales",
            "items": [
              "Tu compañía tiene que marcar el área de giro de la grúa con barreras como líneas de advertencia o barandas, o con letreros y marcas donde no se puedan poner barreras. No entres a esa zona.",
              "Si tienes que entrar donde el operador no te puede ver, asegúrate primero de que el operador sepa. El operador no gira hasta que le avisen con el sistema de señales acordado.",
              "Solo una persona le da señales a la grúa a la vez. Pero cualquiera que vea un problema de seguridad da la señal de parar o de parada de emergencia."
            ]
          }
        ],
        "ask": "¿Quién es el señalero en el izaje de hoy, y hasta dónde llega la zona de caída?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "work-zones",
    "industries": [
      "con",
      "util"
    ],
    "code": "1926.200 / 1926.201",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.200(a): signs visible during work, removed or covered when the hazard ends",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.200(g): traffic control signs and devices, MUTCD Part 6",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.201(a): flaggers and flagger garments per MUTCD Part 6",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.201",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(d): warning vests in excavations exposed to public traffic",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet: Work Zone Traffic Safety",
        "url": "https://www.osha.gov/sites/default/files/publications/work_zone_traffic_safety.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA QuickCard: Work Zone Traffic Safety (OSHA 4295)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA4295.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four: Struck-By Hazards instructor guide",
        "url": "https://www.osha.gov/sites/default/files/struckby_ig.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Highway Work Zones and Signs, Signals, and Barricades",
        "url": "https://www.osha.gov/highway-workzones",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Work Zones and Traffic",
        "hook": "Workers have been hit by vehicles while flagging, setting cones, and putting up signs. A work zone protects you only when it's set up right and everyone follows it.",
        "sections": [
          {
            "heading": "Signs and devices",
            "items": [
              "At points of hazard, the work area has to be posted with readable traffic signs and protected by traffic control devices.",
              "Signs, cones, barricades, and other devices follow Part 6 of the federal traffic control manual, called the MUTCD.",
              "Signs stay visible while work is going on. When the hazard is gone, they come down or get covered.",
              "Drivers should be warned with signs before they reach a flagger."
            ]
          },
          {
            "heading": "Flaggers",
            "items": [
              "Flagging, and the warning clothing flaggers wear, follow the MUTCD.",
              "Flaggers must be trained and use the signaling methods the road authority requires.",
              "Use STOP/SLOW paddles or paddles with lights. Flags are only for emergencies.",
              "If you're not the flagger, don't direct traffic."
            ]
          },
          {
            "heading": "Be seen",
            "items": [
              "Wear high-visibility reflective clothing in the work zone. You need to be seen in all levels of light.",
              "Flagger clothing is fluorescent orange-red or yellow-green with reflective material, so you can be seen from at least 1,000 feet. Check the label for performance class 2 or 3.",
              "If you're in an excavation next to public traffic, you must wear a warning vest or other high-visibility garment."
            ]
          },
          {
            "heading": "Inside the work zone",
            "items": [
              "There has to be a traffic control plan for moving vehicles where people are working.",
              "Know the routes trucks and equipment will use, and follow the site's entry and exit plan.",
              "Know the blind spots for every vehicle on site, and never cross the path of a backing vehicle."
            ]
          }
        ],
        "ask": "Where does our work zone start and end today, and who's flagging?"
      },
      "es": {
        "title": "Zonas de trabajo y tráfico",
        "hook": "A trabajadores los han atropellado mientras daban señales, ponían conos o instalaban letreros. Una zona de trabajo solo te protege cuando está bien armada y todos la respetan.",
        "sections": [
          {
            "heading": "Letreros y dispositivos",
            "items": [
              "En los puntos de peligro, el área de trabajo tiene que tener letreros de tráfico que se puedan leer y estar protegida con dispositivos de control de tráfico.",
              "Los letreros, conos, barricadas y otros dispositivos siguen la Parte 6 del manual federal de control de tráfico, llamado MUTCD.",
              "Los letreros se mantienen visibles mientras se trabaja. Cuando ya no hay peligro, se quitan o se tapan.",
              "A los conductores se les debe avisar con letreros antes de que lleguen a un banderero."
            ]
          },
          {
            "heading": "Bandereros",
            "items": [
              "El trabajo de banderero, y la ropa de advertencia que usan los bandereros, siguen el MUTCD.",
              "Los bandereros tienen que estar entrenados y usar los métodos de señales que exige la autoridad de la carretera.",
              "Usa paletas de STOP/SLOW (alto/despacio) o paletas con luces. Las banderas son solo para emergencias.",
              "Si no eres el banderero, no dirijas el tráfico."
            ]
          },
          {
            "heading": "Que te vean",
            "items": [
              "Usa ropa reflectante de alta visibilidad en la zona de trabajo. Te tienen que ver con cualquier nivel de luz.",
              "La ropa del banderero es de color fluorescente anaranjado rojizo o amarillo verdoso con material reflectante, para que te vean desde por lo menos 1,000 pies. Revisa que la etiqueta diga clase de desempeño 2 o 3.",
              "Si estás en una excavación junto al tráfico público, tienes que usar un chaleco de advertencia u otra prenda de alta visibilidad."
            ]
          },
          {
            "heading": "Dentro de la zona de trabajo",
            "items": [
              "Tiene que haber un plan de control de tráfico para los vehículos que se mueven donde hay gente trabajando.",
              "Conoce las rutas que van a usar los camiones y el equipo, y sigue el plan de entrada y salida de la obra.",
              "Conoce los puntos ciegos de cada vehículo en la obra, y nunca te cruces en el camino de un vehículo que va en reversa."
            ]
          }
        ],
        "ask": "¿Dónde empieza y dónde termina hoy nuestra zona de trabajo, y quién es el banderero?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "trenching",
    "industries": [
      "con",
      "util"
    ],
    "code": "1926.651 / 1926.652",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.652(a)(1): protective systems, exceptions (a)(1)(i)-(ii)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.652",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.652(b)-(c): sloping, benching, support and shield options, incl. (b)(3)(iii), (b)(4), (c)(2), (c)(3)(iii), (c)(4) engineer-approved and manufacturer's designs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.652",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926 Subpart P Appendix B, Table B-1 Note 3: sloping or benching over 20 ft designed by a registered professional engineer",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926SubpartPAppB",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926 Subpart P Appendix C(a): timber shoring tables for trenches not over 20 ft",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926SubpartPAppC",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.652(g)(1)(iv): no one in shields being installed, removed, or moved vertically",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.652",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(b)(1), (b)(3): underground installations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(c)(2): means of egress at 4 ft, 25 ft lateral travel",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(e): falling loads",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(g)(1): hazardous atmospheres, testing over 4 ft",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(h)(1)-(h)(2): water accumulation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(j)(2): materials and spoil 2 ft from the edge",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(k): competent person inspections",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet: Trenching and Excavation Safety (FS-3476)",
        "url": "https://osha.gov/sites/default/files/publications/trench_excavation_fs.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Alert: Trench collapses can be deadly (OSHA 3971)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3971.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Trenching and Excavation",
        "url": "https://www.osha.gov/trenching-excavation",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Trenching and Excavation",
        "hook": "Cave-ins are more likely than other excavation incidents to kill workers. It only takes seconds to get buried under thousands of pounds of soil.",
        "sections": [
          {
            "heading": "Cave-in protection",
            "items": [
              "A trench 5 feet deep or more needs a protective system, unless it's dug entirely in stable rock. Under 5 feet, you still need one unless a competent person checks the ground and sees no sign of a cave-in.",
              "Protection means slope it, shore it, or shield it with a trench box. The rule's ready-made slope and timber shoring tables only go to 20 feet. Deeper than that, the system has to be designed or approved by a registered professional engineer, or follow the trench box or shoring maker's data for that depth.",
              "Stay out of a trench box while it's being put in, taken out, or moved up or down."
            ]
          },
          {
            "heading": "The competent person",
            "items": [
              "A competent person inspects the trench, the area around it, and the protective system every day before work starts, and as needed during the shift.",
              "They inspect again after every rainstorm or anything else that makes it more dangerous. If they find a hazard, everyone gets out until it's made safe.",
              "Never go into a trench unless it has been properly inspected."
            ]
          },
          {
            "heading": "Getting out and the edges",
            "items": [
              "At 4 feet deep or more, there has to be a ladder, stairway, ramp, or other safe way out, no more than 25 feet of travel from where you're working.",
              "Keep spoil piles, materials, and equipment at least 2 feet back from the edge, or use retaining devices so nothing rolls in.",
              "Don't stand under loads handled by lifting or digging equipment. Stand away from trucks being loaded or unloaded."
            ]
          },
          {
            "heading": "Utilities, water and air",
            "items": [
              "Find out where underground utilities are before you dig. As you get close, find the exact location in a safe way.",
              "Don't work in a trench with water built up in it unless the right precautions are in place, like water removal watched by a competent person.",
              "In a trench over 4 feet deep where there could be low oxygen or hazardous air, the air gets tested before anyone goes in."
            ]
          }
        ],
        "ask": "Who's our competent person today, and where's the nearest way out of the trench?"
      },
      "es": {
        "title": "Zanjas y excavaciones",
        "hook": "Los derrumbes tienen más probabilidad que otros accidentes de excavación de matar a trabajadores. Solo toma unos segundos quedar enterrado bajo miles de libras de tierra.",
        "sections": [
          {
            "heading": "Protección contra derrumbes",
            "items": [
              "Una zanja de 5 pies de profundidad o más necesita un sistema de protección, a menos que esté excavada toda en roca estable. Si mide menos de 5 pies, igual lo necesita, a menos que una persona competente revise el terreno y no vea señales de derrumbe.",
              "Protegerla quiere decir inclinar las paredes, apuntalarlas o protegerlas con una caja de zanja. Las tablas de taludes y de apuntalamiento de madera que trae la regla solo llegan hasta 20 pies. Si es más profunda, el sistema lo tiene que diseñar o aprobar un ingeniero profesional registrado, o seguir los datos del fabricante de la caja o del apuntalamiento para esa profundidad.",
              "No te metas en una caja de zanja mientras la están instalando, sacando o moviendo hacia arriba o hacia abajo."
            ]
          },
          {
            "heading": "La persona competente",
            "items": [
              "Una persona competente revisa la zanja, el área alrededor y el sistema de protección todos los días antes de empezar el trabajo, y cuando haga falta durante el turno.",
              "Vuelve a revisar después de cada aguacero o de cualquier cosa que la haga más peligrosa. Si encuentra un peligro, todos salen hasta que se corrija.",
              "Nunca entres a una zanja a menos que se haya revisado bien."
            ]
          },
          {
            "heading": "Cómo salir y los bordes",
            "items": [
              "A 4 pies de profundidad o más, tiene que haber una escalera de mano, escalera fija, rampa u otra salida segura, a no más de 25 pies de donde estás trabajando.",
              "Mantén la tierra excavada, los materiales y el equipo a por lo menos 2 pies del borde, o usa dispositivos de retención para que nada ruede adentro.",
              "No te pares debajo de cargas que maneja el equipo de levantar o de excavar. Mantente lejos de los camiones que están cargando o descargando."
            ]
          },
          {
            "heading": "Servicios subterráneos, agua y aire",
            "items": [
              "Averigua dónde están las líneas de servicios subterráneos antes de excavar. Cuando te acerques, ubica el lugar exacto de forma segura.",
              "No trabajes en una zanja con agua acumulada a menos que haya las precauciones correctas, como sacar el agua con equipo vigilado por una persona competente.",
              "En una zanja de más de 4 pies donde podría faltar oxígeno o haber aire peligroso, se prueba el aire antes de que alguien entre."
            ]
          }
        ],
        "ask": "¿Quién es hoy nuestra persona competente, y dónde está la salida más cercana de la zanja?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "caught-equipment",
    "industries": [
      "con"
    ],
    "code": "1926.600(a)(3) / 1926.1424",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.600(a)(3)(i): suspended equipment blocked or cribbed; blades, buckets and dump bodies lowered or blocked; controls neutral",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.600(a)(3)(ii): parking brake set; wheels chocked on inclines",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.602(a)(9)(ii): earthmoving or compacting equipment with obstructed rear view needs a reverse signal alarm or a signal person",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.602",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1424(a)(1)-(a)(3): swing radius hazard areas, training, barriers, informing the operator",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1424",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.300(b)(2): guarding of exposed moving parts",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.300",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction Focus Four: Caught-In or -Between Hazards (instructor guide)",
        "url": "https://www.osha.gov/sites/default/files/caught_iorb_ig.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Focus Four Hazards",
        "url": "https://www.osha.gov/training/outreach/construction/focus-four",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Caught-In and Caught-Between",
        "hook": "Caught-in or -between is one of the Focus Four hazards in construction. It means getting squeezed, caught, crushed, pinched or compressed between two or more objects.",
        "sections": [
          {
            "heading": "Never get under it",
            "items": [
              "Equipment held up by slings, hoists or jacks has to be blocked or cribbed before anyone works under it or between it.",
              "Dozer and scraper blades, loader buckets and dump bodies get fully lowered or blocked when they're being repaired or not in use.",
              "During repairs or when it's sitting idle, controls go in neutral, the motor is stopped and the brakes are set, unless the job needs otherwise.",
              "Parked equipment gets the parking brake set. On a slope, chock the wheels too."
            ]
          },
          {
            "heading": "Stay out of the swing radius",
            "items": [
              "A crane's turning upper works can hit you, or crush you against the machine or something else.",
              "Your company has to train you to spot those zones. It also has to mark them with barriers like warning lines or railings, or with signs and markings where barriers won't work. Respect the line. Stay out of the swing radius of cranes and other equipment.",
              "If you have to go into that zone where the operator can't see you, make sure the operator knows first. The operator can't swing until they get the agreed signal that you're in a safe spot.",
              "Earthmoving or compacting equipment with a blocked rear view can't back up unless it has a backup alarm you can hear over the noise, or someone signals that it's safe."
            ]
          },
          {
            "heading": "Pinch points and moving parts",
            "items": [
              "Never put yourself between moving materials and something that won't move: a wall, a truck, or a stack of material.",
              "Belts, gears, shafts, pulleys and other moving parts you could touch have to be guarded. Never take a guard off while the tool or machine is in use.",
              "No loose clothing or jewelry around moving parts.",
              "Before you work on a machine, make sure it's shut off and can't start by accident. Lock out the power source if you can."
            ]
          }
        ],
        "ask": "Where are the swing zones and pinch points on this site today, and how do you let the operator know you're going in?"
      },
      "es": {
        "title": "Atrapado en o entre objetos",
        "hook": "Quedar atrapado en o entre objetos es uno de los cuatro peligros principales en la construcción. Significa quedar apretado, atrapado, aplastado, pellizcado o comprimido entre dos o más objetos.",
        "sections": [
          {
            "heading": "Nunca te metas debajo",
            "items": [
              "El equipo que está levantado con eslingas, polipastos o gatos tiene que estar bloqueado o calzado antes de que alguien trabaje debajo o entre él.",
              "Las cuchillas de bulldozer y traílla, los cucharones de cargador y las cajas de volteo se bajan por completo o se bloquean cuando se están reparando o no se usan.",
              "Durante reparaciones o cuando está parado sin usarse, los controles van en neutral, el motor apagado y los frenos puestos, a menos que el trabajo pida otra cosa.",
              "El equipo estacionado lleva el freno de mano puesto. En una pendiente, también calza las ruedas."
            ]
          },
          {
            "heading": "Quédate fuera del radio de giro",
            "items": [
              "La parte de arriba de una grúa, la que gira, te puede golpear o aplastar contra la máquina o contra otra cosa.",
              "Tu compañía tiene que entrenarte para reconocer esas zonas. También tiene que marcarlas con barreras como líneas de advertencia o barandas, o con letreros y marcas donde no se puedan poner barreras. Respeta la línea. Quédate fuera del radio de giro de las grúas y otros equipos.",
              "Si tienes que entrar a esa zona donde el operador no te ve, asegúrate primero de que el operador lo sepa. El operador no puede girar hasta que reciba la señal acordada de que estás en un lugar seguro.",
              "El equipo de movimiento de tierra o de compactación sin buena vista atrás no puede ir en reversa a menos que tenga una alarma de reversa que se oiga sobre el ruido, o que alguien le haga señas de que es seguro."
            ]
          },
          {
            "heading": "Puntos de pellizco y partes en movimiento",
            "items": [
              "Nunca te pongas entre materiales en movimiento y algo que no se mueve: una pared, un camión o una pila de material.",
              "Las bandas, engranes, ejes, poleas y otras partes en movimiento que puedas tocar tienen que tener guarda. Nunca quites una guarda mientras la herramienta o la máquina está en uso.",
              "Nada de ropa suelta ni joyas cerca de partes en movimiento.",
              "Antes de trabajar en una máquina, asegúrate de que está apagada y que no puede arrancar por accidente. Bloquea la fuente de energía si puedes."
            ]
          }
        ],
        "ask": "¿Dónde están hoy las zonas de giro y los puntos de pellizco en esta obra, y cómo le avisas al operador que vas a entrar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hand-tools-con",
    "industries": [
      "con"
    ],
    "code": "1926.300 / 1926.301 / 1926.302",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.300(a): tools kept in safe condition, employer- or employee-owned",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.300",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.300(b)(1): power tools designed for guards used with guards",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.300",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.301(b)-(d): sprung wrenches, mushroomed heads, wooden handles",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.301",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.302(a)(2) and (b)(6): no hoisting or lowering tools by cord or hose",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.302",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.302(b)(1): pneumatic tools secured to the hose by positive means",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.302",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.304(d): portable circular saw guards; lower guard returns automatically",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.304",
        "kind": "standard"
      },
      {
        "label": "OSHA 3080 Hand and Power Tools",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3080.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction Focus Four: Caught-In or -Between Hazards (instructor guide)",
        "url": "https://www.osha.gov/sites/default/files/caught_iorb_ig.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hand and Power Tools",
        "hook": "Every tool on this site has to be kept in safe condition, whether the company owns it or you brought it from home.",
        "sections": [
          {
            "heading": "Check it before you use it",
            "items": [
              "Look each tool over for damage before you use it. If it's damaged, don't use it.",
              "A damaged electric power tool comes out of service and gets tagged Do Not Use.",
              "Hand tools count too. No wrench with jaws so sprung they slip. No chisel or wedge with a mushroomed head. No wooden handle that's cracked, splintered or loose."
            ]
          },
          {
            "heading": "Guards stay on",
            "items": [
              "If a power tool is built to take a guard, the guard is on when you use it.",
              "A portable circular saw has guards above and below the base plate. When you pull the saw out of the cut, the lower guard has to snap back over the blade right away.",
              "Never take a guard off while a tool is being used."
            ]
          },
          {
            "heading": "Power off first",
            "items": [
              "Disconnect the tool before you change a blade, bit or cutter, before you service or clean it, and when you're not using it.",
              "Clamp the work or put it in a vise so both hands are free for the tool.",
              "Keep people who aren't part of the work at a safe distance. Point blades and knives away from walkways and from people working near you."
            ]
          },
          {
            "heading": "Cords and hoses",
            "items": [
              "Never carry a tool by its cord or hose. Never yank the cord or hose to disconnect it.",
              "Never raise or lower a tool by its cord or hose.",
              "Keep cords and hoses away from heat, oil and sharp edges.",
              "Air tools have to be secured to the hose by a positive means so they can't come apart."
            ]
          }
        ],
        "ask": "Pick up the tool you'll use most today. What would you check on it before you start?"
      },
      "es": {
        "title": "Herramientas manuales y eléctricas",
        "hook": "Toda herramienta en esta obra tiene que mantenerse en condiciones seguras, ya sea de la compañía o la hayas traído de tu casa.",
        "sections": [
          {
            "heading": "Revísala antes de usarla",
            "items": [
              "Revisa cada herramienta antes de usarla para ver si está dañada. Si está dañada, no la uses.",
              "Una herramienta eléctrica dañada se saca de servicio y se le pone una etiqueta de No Usar.",
              "Las herramientas manuales también cuentan. Nada de llaves con las quijadas tan abiertas que se resbalan. Nada de cinceles o cuñas con la cabeza aplastada como hongo. Nada de mangos de madera rajados, astillados o flojos."
            ]
          },
          {
            "heading": "Las guardas se quedan puestas",
            "items": [
              "Si una herramienta eléctrica está hecha para llevar guarda, la guarda va puesta cuando la usas.",
              "Una sierra circular portátil tiene guardas arriba y abajo de la base. Cuando sacas la sierra del corte, la guarda de abajo tiene que regresar sobre el disco de inmediato.",
              "Nunca quites una guarda mientras se está usando la herramienta."
            ]
          },
          {
            "heading": "Primero desconecta",
            "items": [
              "Desconecta la herramienta antes de cambiar un disco, una broca o una cuchilla, antes de darle mantenimiento o limpiarla, y cuando no la estés usando.",
              "Sujeta la pieza con una prensa o en un tornillo de banco para tener las dos manos libres para la herramienta.",
              "Mantén a una distancia segura a la gente que no es parte del trabajo. Apunta los discos y cuchillos lejos de los pasillos y de la gente que trabaja cerca de ti."
            ]
          },
          {
            "heading": "Cables y mangueras",
            "items": [
              "Nunca cargues una herramienta por el cable o la manguera. Nunca jales el cable o la manguera para desconectarla.",
              "Nunca subas ni bajes una herramienta colgada del cable o la manguera.",
              "Mantén los cables y mangueras lejos del calor, del aceite y de las orillas filosas.",
              "Las herramientas de aire tienen que estar bien aseguradas a la manguera con un medio firme para que no se suelten."
            ]
          }
        ],
        "ask": "Agarra la herramienta que más vas a usar hoy. ¿Qué le revisarías antes de empezar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "respirators",
    "industries": [
      "con",
      "mfg",
      "auto",
      "health",
      "oil",
      "ag"
    ],
    "code": "1910.134 / 1926.103",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.134(a)(1)-(a)(2): engineering controls first; respirator provided when necessary",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(c)(1)-(c)(2): written program; voluntary use and Appendix D",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(d)(3)(iii)(B): end-of-service-life indicator or cartridge change schedule",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(e)(1): medical evaluation before fit test or use",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(f)(1)-(f)(3): fit testing for tight-fitting respirators before first use, on facepiece change, at least annually, and on physical changes",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(g)(1)(i)-(iii): facial hair, glasses, user seal check each time (tight-fitting)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(g)(2)(ii): leaving the use area",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(h)(2)(i) and (h)(3)(i)(A): storage; inspection before each use",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134 Appendix B-1: user seal check procedures",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134AppB1",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134 Appendix D: information for employees using respirators when not required",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134AppD",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.103: construction respiratory protection, identical to 1910.134",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.103",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Respirators",
        "hook": "A respirator only protects you if it's the right one, it fits, and it seals. Poor fit, poor use or poor care can take that protection away.",
        "sections": [
          {
            "heading": "When you wear one",
            "items": [
              "The first goal is keeping the air clean, with things like ventilation or enclosing the work, as far as that's feasible. A respirator comes in when those aren't enough.",
              "Your company has to provide a respirator when you need one to protect your health. Required use comes with a written program for this worksite. Ask your supervisor what it says for today's task.",
              "Wearing one by choice? Use one NIOSH certifies for what you're around, follow the maker's instructions, and don't wear it into air it isn't made for. Keep track of yours so you don't grab someone else's."
            ]
          },
          {
            "heading": "Before you start wearing one",
            "items": [
              "Before you're fit tested or required to wear a respirator, your company has to get you a medical evaluation to make sure you can wear one.",
              "If you're required to wear a tight-fitting respirator, you need a fit test before you first use it, any time you switch to a different size, style, model or make, and at least once a year after that.",
              "You get fit tested again if something changes that could affect the fit, like facial scarring, dental work, cosmetic surgery, or an obvious change in weight."
            ]
          },
          {
            "heading": "Every time you put it on",
            "items": [
              "Inspect it before each use.",
              "With a tight-fitting respirator, do a seal check every time. Negative check: cover the cartridges with your palms, breathe in gently so the mask pulls in a little, and hold your breath for ten seconds. It should stay pulled in, with no air leaking in.",
              "Positive check: cover the exhale valve and breathe out gently. You should feel a little pressure build up, with no air leaking out at the seal.",
              "Beards and seals don't mix. If facial hair gets between the seal and your face, or gets in the way of a valve, you can't wear a tight-fitting respirator. If you wear glasses or goggles, wear them so they don't break the seal."
            ]
          },
          {
            "heading": "Cartridges and getting out",
            "items": [
              "Gas and vapor cartridges get changed by an end-of-service-life indicator or by the change schedule in your company's program. Know your schedule.",
              "Leave the area if you notice vapor or gas getting through, if it gets harder to breathe, or if the mask leaks. Also step out to wash your face or to change a filter or cartridge.",
              "Store it where it's protected from damage, dust, sunlight, extreme heat or cold, moisture and chemicals."
            ]
          }
        ],
        "ask": "Put your respirator on and show me your seal check right now. Who's due for a fit test?"
      },
      "es": {
        "title": "Respiradores",
        "hook": "Un respirador solo te protege si es el correcto, te queda bien y sella. Si no te queda bien, si lo usas mal o si no lo cuidas, puedes perder esa protección.",
        "sections": [
          {
            "heading": "Cuándo usas uno",
            "items": [
              "Lo primero es mantener el aire limpio, con cosas como ventilación o encerrar el trabajo, hasta donde se pueda. El respirador entra cuando eso no es suficiente.",
              "Tu compañía tiene que darte un respirador cuando lo necesitas para proteger tu salud. El uso obligatorio viene con un programa escrito para esta obra. Pregúntale a tu supervisor qué dice para el trabajo de hoy.",
              "¿Usas uno porque quieres? Usa uno certificado por NIOSH para lo que hay en el aire, sigue las instrucciones del fabricante y no lo uses en un aire para el que no está hecho. No pierdas de vista el tuyo para no agarrar el de otra persona."
            ]
          },
          {
            "heading": "Antes de empezar a usarlo",
            "items": [
              "Antes de tu prueba de ajuste o antes de que te pidan usar un respirador, tu compañía tiene que darte una evaluación médica para asegurarse de que puedes usarlo.",
              "Si te piden usar un respirador de ajuste apretado, necesitas una prueba de ajuste antes de usarlo por primera vez, cada vez que cambies a otro tamaño, estilo, modelo o marca, y por lo menos una vez al año después de eso.",
              "Te vuelven a hacer la prueba si cambia algo que pueda afectar el ajuste, como cicatrices en la cara, trabajo dental, cirugía cosmética o un cambio de peso notable."
            ]
          },
          {
            "heading": "Cada vez que te lo pones",
            "items": [
              "Revísalo antes de cada uso.",
              "Con un respirador de ajuste apretado, haz la prueba de sellado cada vez. Prueba negativa: tapa los cartuchos con las palmas, aspira suave para que la máscara se hunda un poco y aguanta la respiración diez segundos. Debe quedarse hundida, sin que entre aire.",
              "Prueba positiva: tapa la válvula de exhalación y sopla suave. Debes sentir que se acumula un poco de presión, sin que se salga aire por el sello.",
              "La barba y el sello no se llevan. Si el vello de la cara queda entre el sello y tu piel, o estorba una válvula, no puedes usar un respirador de ajuste apretado. Si usas lentes o gafas, póntelos de manera que no rompan el sello."
            ]
          },
          {
            "heading": "Cartuchos y cuándo salir",
            "items": [
              "Los cartuchos para gases y vapores se cambian según un indicador de fin de vida útil o según el calendario de cambio del programa de tu compañía. Conoce tu calendario.",
              "Sal del área si notas que pasa vapor o gas, si te cuesta más respirar o si la máscara tiene fuga. También sal para lavarte la cara o para cambiar un filtro o cartucho.",
              "Guárdalo donde esté protegido de golpes, polvo, sol, calor o frío extremo, humedad y químicos."
            ]
          }
        ],
        "ask": "Ponte el respirador y enséñame tu prueba de sellado ahorita. ¿A quién le toca la prueba de ajuste?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hearing-con",
    "industries": [
      "con"
    ],
    "code": "1926.52 / 1926.101",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.52(a)-(b) and Table D-2: permissible noise exposures; controls first, then PPE",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.52",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.52(d)(2): combined effect of different noise levels",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.52",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.101(a)-(c): ear protection provided and used; inserts fitted by competent persons; plain cotton not acceptable",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.101",
        "kind": "standard"
      },
      {
        "label": "OSHA 3498 Protecting Yourself from Noise in Construction (pocket guide)",
        "url": "https://www.osha.gov/Publications/3498noise-in-construction-pocket-guide.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Occupational Noise Exposure",
        "url": "https://www.osha.gov/noise",
        "kind": "guidance"
      },
      {
        "label": "OSHA Noise: Health Effects",
        "url": "https://www.osha.gov/noise/health-effects",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hearing Protection",
        "hook": "Hearing loss from noise is permanent. Surgery and hearing aids can't fix it, and it usually comes on so slowly you don't notice until it's too late.",
        "sections": [
          {
            "heading": "How loud is too loud",
            "items": [
              "Stand about an arm's length from a coworker. If you have to raise your voice to be heard 2 to 3 feet away, assume it's 85 decibels or more.",
              "Ringing or humming in your ears after work, or hearing that seems dull when you leave, are signs the noise may be hazardous.",
              "A jackhammer can hit 100 decibels."
            ]
          },
          {
            "heading": "The construction rule",
            "items": [
              "In construction, the limit is 90 decibels over 8 hours. The louder it gets, the less time is allowed: 95 for 4 hours, 100 for 2 hours, 105 for 1 hour, and 115 for 15 minutes or less.",
              "Time at different noise levels adds up. The whole day counts, not just the loudest job.",
              "Above those limits, your company has to try engineering or administrative controls first, like moving the generator farther away or turning it away from the crew. If that isn't enough, it has to provide hearing protection, and you have to wear it."
            ]
          },
          {
            "heading": "Wear it right",
            "items": [
              "Plain cotton in your ears is not hearing protection.",
              "Earplugs have to be fitted or picked for you individually by a competent person. Foam plugs only work if they're put in right and make a good seal. Follow the maker's directions.",
              "Wear them the whole time you're in the noise. Music earbuds are not hearing protection.",
              "Replace plugs or muffs that are worn, dirty or broken. Earmuffs can be harder to fit over glasses."
            ]
          }
        ],
        "ask": "Which jobs on this site today would make you raise your voice to talk at arm's length, and what are you wearing for them?"
      },
      "es": {
        "title": "Protección auditiva",
        "hook": "La pérdida de audición por ruido es permanente. Ni la cirugía ni los aparatos para oír la pueden arreglar, y casi siempre llega tan despacio que no te das cuenta hasta que ya es tarde.",
        "sections": [
          {
            "heading": "Qué tan fuerte es demasiado",
            "items": [
              "Párate a un brazo de distancia de un compañero. Si tienes que alzar la voz para que te oiga a 2 o 3 pies, da por hecho que el ruido está en 85 decibeles o más.",
              "Si te zumban o te pitan los oídos después del trabajo, o sientes que oyes apagado al salir, son señales de que el ruido puede ser peligroso.",
              "Un martillo neumático puede llegar a 100 decibeles."
            ]
          },
          {
            "heading": "La regla para la construcción",
            "items": [
              "En la construcción, el límite es 90 decibeles durante 8 horas. Entre más fuerte, menos tiempo se permite: 95 por 4 horas, 100 por 2 horas, 105 por 1 hora y 115 por 15 minutos o menos.",
              "El tiempo en diferentes niveles de ruido se suma. Cuenta todo el día, no solo el trabajo más ruidoso.",
              "Por encima de esos límites, tu compañía primero tiene que usar controles de ingeniería o administrativos, como mover el generador más lejos o voltearlo para el otro lado de la cuadrilla. Si eso no basta, tiene que darte protección auditiva, y tú tienes que usarla."
            ]
          },
          {
            "heading": "Úsala bien",
            "items": [
              "El algodón solo en los oídos no es protección auditiva.",
              "Los tapones tienen que ser ajustados o escogidos para ti en lo individual por una persona competente. Los tapones de espuma solo sirven si te los pones bien y sellan bien. Sigue las instrucciones del fabricante.",
              "Úsalos todo el tiempo que estés en el ruido. Los audífonos para música no son protección auditiva.",
              "Cambia los tapones u orejeras que estén gastados, sucios o rotos. Las orejeras pueden ajustar peor si usas lentes."
            ]
          }
        ],
        "ask": "¿Qué trabajos en esta obra hoy te harían alzar la voz para hablar a un brazo de distancia, y qué protección vas a usar para ellos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "asbestos",
    "industries": [
      "con"
    ],
    "code": "1926.1101",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.1101(a)(8): asphalt roof coatings, cements and mastics not covered",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(b): definitions of PACM, surfacing material, TSI, Class II asbestos work",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(g)(3): prohibited practices (dry sweeping, compressed air, high-speed abrasive disc saws)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(g)(7)(i): Class II work supervised by a competent person",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(g)(8)(i)(A): no sanding of asbestos flooring",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(g)(8)(ii)(A)-(C), (E)-(G): removing roofing material that contains asbestos",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(k)(1)(i): materials treated as asbestos-containing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(k)(3)(i) and (k)(4): identify before work; employer that discovers new material tells the owner and other employers within 24 hours",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1101(k)(9)(ii), (k)(9)(iv)(A): training before or at initial assignment; at least 8 hours, hands-on, for asbestos roofing work",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1101",
        "kind": "standard"
      },
      {
        "label": "OSHA Asbestos safety and health topic page",
        "url": "https://www.osha.gov/asbestos",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Asbestos in Old Building Materials",
        "hook": "Breathing asbestos fibers can cause lung scarring, lung cancer and mesothelioma. OSHA says there is no safe level of exposure.",
        "sections": [
          {
            "heading": "What gets treated as asbestos",
            "items": [
              "In buildings built in 1980 or earlier, pipe and boiler insulation and sprayed or troweled-on coatings, like acoustical plaster on ceilings and fireproofing on beams, are presumed to be asbestos. That's called PACM.",
              "Asphalt and vinyl flooring put in by 1980 is also treated as asbestos unless it's tested and shown not to be.",
              "Roofing isn't presumed asbestos by age alone. But if the company knows, or should know, that a material has asbestos, it gets treated as asbestos. Roofing and siding shingles are among the materials that can contain it.",
              "Asphalt roof coatings, cements and mastics are not covered by this rule."
            ]
          },
          {
            "heading": "Find it first",
            "items": [
              "Before work starts in an area with asbestos, the company has to find out where it is and how much.",
              "If a company on site finds asbestos material that nobody knew about, it has 24 hours to tell the building owner and the other employers working there."
            ]
          },
          {
            "heading": "Removing asbestos roofing",
            "items": [
              "Removing asbestos roofing is Class II work. A competent person supervises it. Your company has to train the crew first, in a course of at least 8 hours with hands-on practice.",
              "Take it off in one piece as much as you can. If it's broken, or will break coming off, keep it wet, unless wetting can't be done or would create a safety hazard. Keep cutting machines misted, unless the competent person decides misting makes the job less safe.",
              "Never drop or throw it off the roof. Hand it down, or lower it in a covered, dust-tight chute, a crane or a hoist. Get it all down by the end of the shift.",
              "Shut down or block off rooftop air intakes. On the ground, put unwrapped pieces in a closed container."
            ]
          },
          {
            "heading": "Never do this",
            "items": [
              "No dry sweeping or dry shoveling of asbestos dust and debris.",
              "No compressed air to blow it off, except inside an enclosed system built to capture the dust. No high-speed abrasive disc saws unless they have a HEPA-filtered dust capture at the cut. Asbestos flooring never gets sanded."
            ]
          }
        ],
        "ask": "What's on this building that was put in before 1981, and who do you tell if you find something you're not sure about?"
      },
      "es": {
        "title": "Asbesto en materiales de construcción viejos",
        "hook": "Respirar fibras de asbesto puede causar cicatrices en los pulmones, cáncer de pulmón y mesotelioma. OSHA dice que no hay un nivel seguro de exposición.",
        "sections": [
          {
            "heading": "Qué se trata como asbesto",
            "items": [
              "En edificios construidos en 1980 o antes, el aislamiento de tubos y calderas y las capas rociadas o aplicadas con llana, como el yeso acústico en los techos y el material contra incendios en las vigas, se presumen de asbesto. A eso se le llama PACM.",
              "El piso de asfalto y de vinilo instalado hasta 1980 también se trata como asbesto, a menos que se pruebe y se demuestre que no lo es.",
              "El techado no se presume de asbesto solo por la edad. Pero si la compañía sabe, o debería saber, que un material tiene asbesto, se trata como asbesto. Las tejas de techo y de pared están entre los materiales que pueden tenerlo.",
              "Los recubrimientos, cementos y masillas asfálticas para techo no están cubiertos por esta regla."
            ]
          },
          {
            "heading": "Primero hay que encontrarlo",
            "items": [
              "Antes de empezar a trabajar en un área con asbesto, la compañía tiene que averiguar dónde está y cuánto hay.",
              "Si una compañía en la obra encuentra material con asbesto que nadie conocía, tiene 24 horas para avisarle al dueño del edificio y a los otros empleadores que trabajan ahí."
            ]
          },
          {
            "heading": "Quitar techado con asbesto",
            "items": [
              "Quitar techado con asbesto es trabajo Clase II. Lo supervisa una persona competente. Tu compañía tiene que entrenar primero a la cuadrilla, con un curso de por lo menos 8 horas con práctica directa.",
              "Quítalo en una sola pieza lo más que puedas. Si está roto, o se va a romper al quitarlo, mantenlo mojado, a menos que no se pueda mojar o que mojarlo cree un peligro. Mantén las máquinas de cortar rociadas con agua, a menos que la persona competente decida que eso hace el trabajo menos seguro.",
              "Nunca lo dejes caer ni lo tires del techo. Pásalo a mano, o bájalo por un conducto cubierto y a prueba de polvo, una grúa o un montacargas. Bájalo todo antes de que termine el turno.",
              "Apaga o aísla las tomas de aire que están en el techo. En el suelo, mete los pedazos sin envolver en un contenedor cerrado."
            ]
          },
          {
            "heading": "Nunca hagas esto",
            "items": [
              "No barras ni palees en seco el polvo y los escombros de asbesto.",
              "No uses aire comprimido para soplarlo, excepto dentro de un sistema cerrado hecho para capturar el polvo. No uses sierras abrasivas de disco de alta velocidad a menos que tengan captura de polvo con filtro HEPA en el corte. El piso con asbesto nunca se lija."
            ]
          }
        ],
        "ask": "¿Qué hay en este edificio que se instaló antes de 1981, y a quién le avisas si encuentras algo de lo que no estás seguro?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "lead",
    "industries": [
      "con"
    ],
    "code": "1926.62",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.62(a): scope",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.62",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.62(d)(2)(i), (d)(2)(iv), (d)(2)(v): tasks treated as over the PEL, and interim protection, until exposure is assessed",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.62",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.62(g)(2)(viii): no blowing or shaking lead off clothing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.62",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.62(h)(2)-(h)(5): housekeeping",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.62",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.62(i)(1), (i)(4)(iii)-(iv), (i)(5): hygiene practices",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.62",
        "kind": "standard"
      },
      {
        "label": "OSHA 3142 Lead in Construction",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3142.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Lead safety and health topic page",
        "url": "https://www.osha.gov/lead",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Lead on the Job",
        "hook": "Lead can damage your brain and nerves, your kidneys, your blood and your ability to have healthy kids. Lead dust on your clothes and shoes can also go home with you to your family.",
        "sections": [
          {
            "heading": "Where it comes from",
            "items": [
              "Old paint, old lead on roofs, and the solder on copper pipe joints can all contain lead.",
              "Where there's lead paint, scraping, sanding, heat guns and tearing out painted material put lead in the air. Torch burning, cutting, welding and abrasive blasting are even worse.",
              "Until your company checks your exposure and shows it's not over the limit, it has to treat those jobs as over the limit and protect you, with things like respirators, protective clothing and a place to wash."
            ]
          },
          {
            "heading": "How it gets in you",
            "items": [
              "Mostly you breathe it in, as dust or fumes.",
              "You also swallow it from dirty hands, clothes and surfaces when you eat, drink or smoke."
            ]
          },
          {
            "heading": "Keep it off your hands and out of your house",
            "items": [
              "Wash your hands and face before you eat, drink or smoke, and again at the end of the shift.",
              "No food, drinks, tobacco or cosmetics in a lead work area that's over the limit. Look for the sign that says DO NOT EAT, DRINK OR SMOKE IN THIS AREA.",
              "Don't walk into the eating area in dusty work clothes unless the lead dust has been cleaned off them first.",
              "Never take lead-dusty work clothes home to wash. And don't blow or shake the dust off your clothes. That puts it right back in the air."
            ]
          },
          {
            "heading": "Clean up the right way",
            "items": [
              "Vacuum lead dust with a HEPA vacuum. Sweeping and shoveling are only allowed if vacuuming was tried and didn't work.",
              "No compressed air to clean lead off surfaces, unless it's used with a system that captures the dust."
            ]
          }
        ],
        "ask": "Where's the closest place to wash up on this job, and what are we doing today that could stir up old paint?"
      },
      "es": {
        "title": "El plomo en el trabajo",
        "hook": "El plomo puede dañar tu cerebro y tus nervios, tus riñones, tu sangre y tu capacidad de tener hijos sanos. El polvo de plomo en tu ropa y tus zapatos también se puede ir contigo a tu casa, con tu familia.",
        "sections": [
          {
            "heading": "De dónde viene",
            "items": [
              "La pintura vieja, el plomo viejo en los techos y la soldadura de las uniones de tubería de cobre pueden tener plomo.",
              "Donde hay pintura con plomo, raspar, lijar, usar pistolas de calor y arrancar material pintado echa plomo al aire. Quemar con soplete, cortar, soldar y limpiar con chorro abrasivo es todavía peor.",
              "Hasta que tu compañía revise tu exposición y demuestre que no pasa el límite, tiene que tratar esos trabajos como si pasaran el límite y protegerte, con cosas como respiradores, ropa de protección y un lugar para lavarte."
            ]
          },
          {
            "heading": "Cómo entra en tu cuerpo",
            "items": [
              "Casi siempre lo respiras, como polvo o humo.",
              "También te lo tragas por las manos, la ropa y las superficies sucias cuando comes, bebes o fumas."
            ]
          },
          {
            "heading": "Fuera de tus manos y fuera de tu casa",
            "items": [
              "Lávate las manos y la cara antes de comer, beber o fumar, y otra vez al final del turno.",
              "Nada de comida, bebidas, tabaco ni cosméticos en un área de trabajo con plomo que pasa el límite. Busca el letrero que dice DO NOT EAT, DRINK OR SMOKE IN THIS AREA (no comer, beber ni fumar en esta área).",
              "No entres al área de comer con la ropa de trabajo llena de polvo, a menos que primero le hayan quitado el polvo de plomo.",
              "Nunca te lleves a casa la ropa de trabajo con polvo de plomo para lavarla. Y no le soples ni le sacudas el polvo a tu ropa. Eso lo vuelve a echar al aire."
            ]
          },
          {
            "heading": "Limpia de la manera correcta",
            "items": [
              "Aspira el polvo de plomo con una aspiradora HEPA. Barrer y palear solo se permite si se probó aspirar y no funcionó.",
              "No uses aire comprimido para limpiar el plomo de las superficies, a menos que se use con un sistema que capture el polvo."
            ]
          }
        ],
        "ask": "¿Dónde está el lugar más cercano para lavarse en esta obra, y qué vamos a hacer hoy que pueda levantar pintura vieja?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "confined-con",
    "industries": [
      "con"
    ],
    "code": "1926.1202 / 1926.1203",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.1202: definitions of confined space, permit-required confined space, entry, attendant",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1202",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1203(a)-(d): identifying permit spaces, danger signs, preventing entry, written program",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1203",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1207(b): when training is given",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1207",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1208(e): when entrants must get out",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1208",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1209(c), (d), (f), (g), (i): attendant duties",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1209",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1211(c): non-entry rescue and retrieval systems",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1211",
        "kind": "standard"
      },
      {
        "label": "OSHA 3825 Protecting Construction Workers in Confined Spaces (small entity guide)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3825.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3914 Fact Sheet: Confined Spaces in Residential Construction",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3914.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Confined Spaces in Construction",
        "hook": "A space that is safe when you go in can turn deadly while you're inside. And people who jump in to help have died too.",
        "sections": [
          {
            "heading": "What counts",
            "items": [
              "A confined space is big enough to climb into, has a limited way in and out, and isn't built for people to stay in. Think manholes, tanks, pits, vaults, crawl spaces and some attics.",
              "It's permit-required if it has, or could have, a bad atmosphere, something that can bury you, walls or a floor that can trap you, or any other serious hazard.",
              "An attic with easy access usually isn't a confined space. But extreme attic heat can be a serious hazard. A crawl space with a live exposed wire is a hazard too."
            ]
          },
          {
            "heading": "Don't go in without the plan",
            "items": [
              "Before work starts, a competent person finds the confined spaces and decides which ones need a permit.",
              "A sign that says DANGER, PERMIT-REQUIRED CONFINED SPACE, DO NOT ENTER means exactly that. You don't go in unless you're authorized and trained.",
              "Sticking your head or arm through the opening counts as entering."
            ]
          },
          {
            "heading": "Inside and outside",
            "items": [
              "Before anyone enters a permit space, the air gets tested: oxygen first, then flammable gases, then toxic gases.",
              "The attendant stays outside the whole time, keeps count of who's inside, and orders everyone out if conditions turn dangerous inside or outside.",
              "If you're inside, get out fast when the attendant says so, when an alarm goes off, or when you notice any warning sign or symptom."
            ]
          },
          {
            "heading": "Rescue from outside",
            "items": [
              "If someone goes down inside, the attendant calls for rescue. Don't go in after them unless you're trained and equipped for rescue. Untrained rescuers have died this way.",
              "Rescue is done from outside whenever the gear can help, using a harness and retrieval line. For a vertical permit space more than 5 feet deep, a mechanical device to pull people out has to be there."
            ]
          }
        ],
        "ask": "Are there any confined spaces on this job today, and who is the attendant if we go in one?"
      },
      "es": {
        "title": "Espacios confinados en la construcción",
        "hook": "Un espacio que es seguro cuando entras se puede volver mortal mientras estás adentro. Y también se han muerto personas que se metieron a ayudar.",
        "sections": [
          {
            "heading": "Qué cuenta",
            "items": [
              "Un espacio confinado es lo bastante grande para meterte, tiene una entrada y salida limitada, y no está hecho para que la gente se quede ahí. Piensa en registros, tanques, fosas, bóvedas, espacios bajo el piso y algunos áticos.",
              "Requiere permiso si tiene, o podría tener, un aire peligroso, algo que te pueda enterrar, paredes o un piso que te puedan atrapar, o cualquier otro peligro serio.",
              "Un ático con acceso fácil por lo general no es un espacio confinado. Pero el calor extremo en un ático puede ser un peligro serio. Un espacio bajo el piso con un cable vivo expuesto también es un peligro."
            ]
          },
          {
            "heading": "No entres sin el plan",
            "items": [
              "Antes de empezar el trabajo, una persona competente encuentra los espacios confinados y decide cuáles necesitan permiso.",
              "Un letrero que dice DANGER, PERMIT-REQUIRED CONFINED SPACE, DO NOT ENTER (peligro, espacio confinado que requiere permiso, no entre) quiere decir exactamente eso. No entras a menos que estés autorizado y entrenado.",
              "Meter la cabeza o el brazo por la abertura cuenta como entrar."
            ]
          },
          {
            "heading": "Adentro y afuera",
            "items": [
              "Antes de que alguien entre a un espacio con permiso, se prueba el aire: primero el oxígeno, luego los gases inflamables, luego los gases tóxicos.",
              "El vigilante se queda afuera todo el tiempo, lleva la cuenta de quién está adentro, y ordena que todos salgan si las condiciones se vuelven peligrosas adentro o afuera.",
              "Si estás adentro, sal rápido cuando el vigilante te lo diga, cuando suene una alarma o cuando notes cualquier señal o síntoma de peligro."
            ]
          },
          {
            "heading": "Rescata desde afuera",
            "items": [
              "Si alguien cae adentro, el vigilante pide rescate. No te metas por él a menos que estés entrenado y equipado para rescates. Así se han muerto rescatadores sin entrenamiento.",
              "El rescate se hace desde afuera siempre que el equipo pueda ayudar, con un arnés y una línea de rescate. Para un espacio vertical con permiso de más de 5 pies de hondo, tiene que haber un aparato mecánico para sacar a la gente."
            ]
          }
        ],
        "ask": "¿Hay algún espacio confinado en esta obra hoy, y quién es el vigilante si entramos a uno?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "housekeeping",
    "industries": [
      "con"
    ],
    "code": "1926.25 / 1926.252",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.25(a): scrap lumber with protruding nails and debris kept clear",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.25",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.25(b): combustible scrap removed at regular intervals",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.25",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.25(c): waste containers and covers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.25",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.252(c), (e): scrap removed as work progresses; oily rags in fire resistant covered containers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.250(b)(8)(i): nails withdrawn from used lumber before stacking",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.250",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.416(b)(2), (e)(1)-(e)(2): cords kept out of walkways; worn cords; staples and nails",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.405(a)(2)(ii)(I): cords through doorways and pinch points protected",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.405",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.151(c)(5): no combustible storage outdoors within 10 feet of a building",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.151",
        "kind": "standard"
      },
      {
        "label": "OSHA standard interpretation, January 25, 2006: protruding nails on lumber",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2006-01-25",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Housekeeping on Site",
        "hook": "Scrap, debris and cords don't belong where people walk and work. Keeping them clear isn't extra work. It's part of the job.",
        "sections": [
          {
            "heading": "Nails and scrap lumber",
            "items": [
              "Scrap lumber with nails sticking out, and all other debris, has to be kept clear of work areas, walkways and stairs.",
              "Nails sticking out of lumber can stab and cut you. Pull them out or bend them over. Gloves often won't stop a nail.",
              "Used lumber gets all its nails pulled before it's stacked."
            ]
          },
          {
            "heading": "Clean as you go",
            "items": [
              "Scrap, waste and trash get removed from your work area as the work moves along, not saved for the end of the job.",
              "Burnable scrap and debris get hauled off on a regular schedule.",
              "Use the containers on site, and keep trash and waste separated the way they're set up."
            ]
          },
          {
            "heading": "Oily rags and flammables",
            "items": [
              "Oily rags, solvent waste and flammable liquids go in a fire resistant container with a lid. They stay there until they leave the site.",
              "Containers for oily, flammable or hazardous waste need covers.",
              "Don't store burnable material outside within 10 feet of the building."
            ]
          },
          {
            "heading": "Cords",
            "items": [
              "Keep cords out of walkways and work spaces where people can trip on them.",
              "Don't use a worn or frayed cord, and don't hang extension cords on nails, staple them, or hold them up with wire.",
              "A cord can run through a doorway or other pinch point only if it's protected from damage."
            ]
          }
        ],
        "ask": "Look around right now. What's one thing on this site someone could trip on, step on or set on fire, and who's going to fix it?"
      },
      "es": {
        "title": "Orden y limpieza en la obra",
        "hook": "Los desechos, los escombros y los cables no van donde la gente camina y trabaja. Mantenerlos fuera no es trabajo extra. Es parte del trabajo.",
        "sections": [
          {
            "heading": "Clavos y madera de desecho",
            "items": [
              "La madera de desecho con clavos salidos, y todos los demás escombros, se tienen que mantener fuera de las áreas de trabajo, los pasillos y las escaleras.",
              "Los clavos que salen de la madera te pueden atravesar y cortar. Sácalos o dóblalos. Muchas veces los guantes no paran un clavo.",
              "A la madera usada se le sacan todos los clavos antes de apilarla."
            ]
          },
          {
            "heading": "Limpia mientras trabajas",
            "items": [
              "Los desechos, la basura y los desperdicios se sacan de tu área de trabajo a medida que avanza el trabajo, no se dejan para el final.",
              "Los desechos y escombros que se pueden quemar se sacan con regularidad.",
              "Usa los contenedores de la obra, y separa la basura y los desperdicios como están organizados."
            ]
          },
          {
            "heading": "Trapos con aceite e inflamables",
            "items": [
              "Los trapos con aceite, los desechos de solventes y los líquidos inflamables van en un contenedor resistente al fuego con tapa. Se quedan ahí hasta que salen de la obra.",
              "Los contenedores para desechos con aceite, inflamables o peligrosos necesitan tapa.",
              "No guardes material que se queme afuera a menos de 10 pies del edificio."
            ]
          },
          {
            "heading": "Cables",
            "items": [
              "Mantén los cables fuera de los pasillos y los espacios de trabajo donde alguien se pueda tropezar.",
              "No uses un cable gastado o deshilachado, y no cuelgues las extensiones de clavos, no las engrapes ni las sostengas con alambre.",
              "Un cable puede pasar por una puerta u otro punto donde se pueda machucar solo si está protegido para que no se dañe."
            ]
          }
        ],
        "ask": "Miren alrededor ahora mismo. ¿Qué cosa hay en esta obra con la que alguien se podría tropezar, que podría pisar o que se podría incendiar, y quién la va a arreglar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "welding-con",
    "industries": [
      "con"
    ],
    "code": "1926.350 / 1926.352 / 1926.353",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.350(a)(1), (a)(7)-(a)(10): cylinder caps, securing, closing valves, upright, oxygen/fuel gas separation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.350",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.350(b)(1), (b)(4), (c)(3): cylinders away from sparks; none in confined spaces; no damaged cylinders",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.350",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.350(f)(1), (f)(3), (f)(4), (f)(7), (i): hoses and oxygen fittings",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.350",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.351(d)(1), (d)(4), (e): electrode holders, reporting defects, arc shielding",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.351",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.352(a), (c), (d), (e), (f): fire prevention and fire watch",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.352",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.353(a)(3), (b)(1)-(b)(2), (c)(1)-(c)(3), (e)(2): ventilation, toxic metals, eye protection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.353",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(c)(1): Table E-1 filter lens shade numbers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Welding and Cutting",
        "hook": "Welding and cutting bring fire, gas under pressure, and blinding light to the job all at once.",
        "sections": [
          {
            "heading": "Gas cylinders",
            "items": [
              "Cylinders stay upright and secured, chained or in a cart, so they can't get knocked over. The only exception is a short time while one is being hoisted or carried.",
              "When a cylinder is moved or stored, the valve cap goes on and gets secured. Close the valve when the job is done, when it's empty, and any time it's moved.",
              "In storage, keep oxygen at least 20 feet from fuel gas and anything that burns. Or put a noncombustible wall at least 5 feet high between them, with at least a half-hour fire rating.",
              "Keep cylinders back from the work, or behind fire-resistant shields, so sparks and slag can't reach them. Never take them into a confined space. A damaged cylinder doesn't get used."
            ]
          },
          {
            "heading": "Hoses and leads",
            "items": [
              "Inspect every gas hose at the start of each shift. A hose that's damaged, or one you're not sure about, doesn't get used.",
              "Keep hoses and cables out of walkways, ladders and stairs. Keep oil and grease away from oxygen cylinders and fittings.",
              "Stepping away from an arc welder? Pull the electrode and set the holder where it can't touch anyone or anything that conducts. Report bad equipment to your supervisor."
            ]
          },
          {
            "heading": "Fire",
            "items": [
              "If the piece can be moved to a safe spot, move it. If not, move anything nearby that can burn, or protect it.",
              "No welding or cutting where flammable paint, other flammable material, or heavy dust creates a hazard.",
              "A working fire extinguisher has to be right there in the work area. On a wall, floor or ceiling, sparks and heat can go through, so protect the other side too.",
              "When normal precautions aren't enough, someone is assigned as fire watch, during the work and long enough afterward to be sure there's no fire."
            ]
          },
          {
            "heading": "Eyes and air",
            "items": [
              "Anyone welding, cutting or heating wears eye protection made for it. OSHA's shade chart is the guide for picking the filter lens. A darker shade is fine if you need it.",
              "Where practicable, screen off arc welding so the rays don't hit people working nearby.",
              "In a confined space, ventilation is required. If venting would block the way in, use an air line respirator, with a helper outside. With a fume exhaust, put the hood as close to the work as you can.",
              "In an enclosed space, galvanized, lead or cadmium metal needs ventilation. Lead or cadmium needs local exhaust or an air line respirator. Outdoors, lead and cadmium take a filter-type respirator."
            ]
          }
        ],
        "ask": "Where's the closest fire extinguisher right now, and who's on fire watch if we need one today?"
      },
      "es": {
        "title": "Soldadura y corte",
        "hook": "La soldadura y el corte traen fuego, gas a presión y una luz que ciega, todo al mismo tiempo.",
        "sections": [
          {
            "heading": "Cilindros de gas",
            "items": [
              "Los cilindros siempre van parados y asegurados, con cadena o en un carrito, para que no se caigan. La única excepción es un rato corto mientras se están izando o cargando.",
              "Cuando se mueve o se guarda un cilindro, se le pone la tapa de la válvula y se asegura. Cierra la válvula cuando termines el trabajo, cuando esté vacío y cada vez que se mueva.",
              "Al guardarlos, mantén el oxígeno a por lo menos 20 pies del gas combustible y de todo lo que se queme. O pon entre ellos una pared que no se queme, de por lo menos 5 pies de alto y que resista el fuego por lo menos media hora.",
              "Mantén los cilindros lejos del trabajo, o detrás de protectores resistentes al fuego, para que no les lleguen chispas ni escoria. Nunca los metas a un espacio confinado. Un cilindro dañado no se usa."
            ]
          },
          {
            "heading": "Mangueras y cables",
            "items": [
              "Revisa cada manguera de gas al empezar cada turno. Una manguera dañada, o una de la que no estés seguro, no se usa.",
              "Mantén las mangueras y los cables fuera de los pasillos, las escaleras de mano y las escaleras. Mantén el aceite y la grasa lejos de los cilindros de oxígeno y sus conexiones.",
              "¿Te vas a alejar de la soldadora de arco? Quita el electrodo y deja el porta electrodo donde no pueda tocar a nadie ni nada que conduzca electricidad. Avísale a tu supervisor si el equipo está mal."
            ]
          },
          {
            "heading": "Fuego",
            "items": [
              "Si la pieza se puede llevar a un lugar seguro, llévala. Si no, quita todo lo que esté cerca y se pueda quemar, o protégelo.",
              "No se suelda ni se corta donde la pintura inflamable, otro material inflamable o mucho polvo creen un peligro.",
              "Tiene que haber un extintor que funcione ahí mismo en el área de trabajo. En una pared, piso o techo, las chispas y el calor pueden pasar, así que protege también el otro lado.",
              "Cuando las precauciones normales no son suficientes, se asigna a alguien para vigilar el fuego, durante el trabajo y el tiempo suficiente después para estar seguros de que no hay fuego."
            ]
          },
          {
            "heading": "Ojos y aire",
            "items": [
              "Todo el que suelde, corte o caliente usa protección para los ojos hecha para eso. La tabla de sombras de OSHA es la guía para escoger el lente con filtro. Puedes usar uno más oscuro si lo necesitas.",
              "Donde se pueda, pon pantallas alrededor de la soldadura de arco para que los rayos no les peguen a los que trabajan cerca.",
              "En un espacio confinado, se requiere ventilación. Si ventilar bloquearía la entrada, usa un respirador con línea de aire, con un ayudante afuera. Si usas un extractor de humos, pon la campana lo más cerca del trabajo que puedas.",
              "En un espacio cerrado, el metal galvanizado, el plomo o el cadmio necesitan ventilación. El plomo o el cadmio necesitan extracción local o un respirador con línea de aire. Afuera, el plomo y el cadmio necesitan un respirador con filtro."
            ]
          }
        ],
        "ask": "¿Dónde está ahorita el extintor más cercano, y quién vigila el fuego si hoy lo necesitamos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "sanitation-con",
    "industries": [
      "con"
    ],
    "code": "1926.51",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.51(a)(1)-(a)(5): potable water, closed dispensers, no dipping, marked containers, no common cup, single-service cups",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.51(b)(1): nonpotable water outlets identified by signs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.51(c)(1) Table D-1: toilets by number of employees",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.51(c)(3)-(c)(4): toilets without a sanitary sewer; mobile crews",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.51(f)(1)-(f)(3): washing facilities and lavatories",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.51",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Water, Toilets and Washing",
        "hook": "Clean water, a toilet, and a place to wash up are basics on every job. Your company has to provide them. Here's what should be on site, and how to use it right.",
        "sections": [
          {
            "heading": "Drinking water",
            "items": [
              "Your company has to provide enough clean drinking water everywhere you work.",
              "A water cooler has to close tight and have a tap. Never dip water out of it with a cup or a bottle.",
              "A drinking water container has to be clearly marked, and it can't be used for anything else.",
              "Water that isn't safe to drink comes out of outlets marked with a sign. Don't drink from those."
            ]
          },
          {
            "heading": "No shared cups",
            "items": [
              "The common drinking cup is not allowed. No one cup that everybody passes around.",
              "If single-use cups are supplied, there has to be a clean container for new cups and a trash can for used ones.",
              "Single-use means once. Use it, then toss it."
            ]
          },
          {
            "heading": "Toilets",
            "items": [
              "Your company has to provide toilets based on crew size. With 20 workers or fewer, at least 1.",
              "With 20 or more, 1 toilet seat and 1 urinal for every 40 workers. With 200 or more, 1 toilet seat and 1 urinal for every 50.",
              "No sewer on site? Then it's a chemical, recirculating, or combustion toilet, or a privy where it won't contaminate ground or surface water.",
              "Mobile crews with transportation ready to get to a nearby toilet are covered differently. If you can't get to a toilet, tell your supervisor."
            ]
          },
          {
            "heading": "Washing up",
            "items": [
              "Working with paint, coatings, herbicides, insecticides, or anything else that can harm you? Your company has to provide washing facilities near the work, set up so you can wash it off.",
              "Washing facilities have to be kept clean.",
              "Hand-washing sinks are required on site, except for mobile crews and normally unattended locations that have transportation ready to nearby washing facilities. Each one needs running water, hot and cold or warm, plus soap, and paper or cloth towels or a hand dryer."
            ]
          }
        ],
        "ask": "Where are the water and the nearest toilet on this site today, and is anything running low?"
      },
      "es": {
        "title": "Agua, baños y lavado",
        "hook": "Agua limpia, un baño y un lugar para lavarse son lo básico en todo trabajo. Tu compañía tiene que darlos. Esto es lo que debe haber en el sitio, y cómo usarlo bien.",
        "sections": [
          {
            "heading": "Agua para tomar",
            "items": [
              "Tu compañía tiene que dar suficiente agua limpia para tomar en todos los lugares donde trabajas.",
              "El termo de agua tiene que cerrar bien y tener llave. Nunca saques agua metiendo un vaso o una botella.",
              "El recipiente del agua para tomar tiene que estar bien marcado, y no se puede usar para nada más.",
              "El agua que no es segura para tomar sale de llaves marcadas con un letrero. No tomes de esas."
            ]
          },
          {
            "heading": "Nada de vasos compartidos",
            "items": [
              "No se permite el vaso común. Nada de un solo vaso que todos se pasan.",
              "Si dan vasos desechables, tiene que haber un recipiente limpio para los vasos nuevos y un bote de basura para los usados.",
              "Desechable quiere decir una sola vez. Úsalo y tíralo."
            ]
          },
          {
            "heading": "Baños",
            "items": [
              "Tu compañía tiene que poner baños según el tamaño de la cuadrilla. Con 20 trabajadores o menos, por lo menos 1.",
              "Con 20 o más, 1 inodoro y 1 orinal por cada 40 trabajadores. Con 200 o más, 1 inodoro y 1 orinal por cada 50.",
              "¿No hay drenaje en el sitio? Entonces es un baño químico, de recirculación o de combustión, o una letrina donde no contamine el agua del suelo ni la de la superficie.",
              "Las cuadrillas móviles que tienen transporte listo para llegar a un baño cercano tienen otra regla. Si no puedes llegar a un baño, avísale a tu supervisor."
            ]
          },
          {
            "heading": "Para lavarse",
            "items": [
              "¿Trabajas con pintura, recubrimientos, herbicidas, insecticidas o cualquier cosa que te pueda hacer daño? Tu compañía tiene que poner lugares para lavarse cerca del trabajo, preparados para que te lo puedas quitar.",
              "Los lugares para lavarse se tienen que mantener limpios.",
              "Se requieren lavamanos en el sitio, menos para cuadrillas móviles y lugares donde normalmente no hay nadie que tengan transporte listo a lugares para lavarse cercanos. Cada uno tiene que tener agua corriente, caliente y fría o tibia, más jabón, y toallas de papel o tela o un secador de manos."
            ]
          }
        ],
        "ask": "¿Dónde están hoy el agua y el baño más cercano en este sitio, y se está acabando algo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "vehicles",
    "industries": [
      "all"
    ],
    "code": "OSHA Motor Vehicle Safety (guidance)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Motor Vehicle Safety",
        "url": "https://www.osha.gov/motor-vehicle-safety",
        "kind": "guidance"
      },
      {
        "label": "OSHA Motor Vehicle Safety: Seat belt use",
        "url": "https://www.osha.gov/motor-vehicle-safety/seat-belt-use",
        "kind": "guidance"
      },
      {
        "label": "OSHA Motor Vehicle Safety: Distracted driving",
        "url": "https://www.osha.gov/motor-vehicle-safety/distracted-driving",
        "kind": "guidance"
      },
      {
        "label": "OSHA Motor Vehicle Safety: Drowsy driving",
        "url": "https://www.osha.gov/motor-vehicle-safety/drowsy-driving",
        "kind": "guidance"
      },
      {
        "label": "OSHA Motor Vehicle Safety: Drivers",
        "url": "https://www.osha.gov/motor-vehicle-safety/drivers",
        "kind": "guidance"
      },
      {
        "label": "OSHA Motor Vehicle Safety fact sheet for workers",
        "url": "https://www.osha.gov/sites/default/files/Motor-Vehicle-Safety_FactSheet_Workers.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Preventing Backovers",
        "url": "https://www.osha.gov/preventing-backovers",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Distracted Driving at Work",
        "url": "https://www.cdc.gov/niosh/motor-vehicle/distracted-driving/index.html",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Driver Fatigue on the Job",
        "url": "https://archive.cdc.gov/www_cdc_gov/niosh/newsroom/feature/driver-fatigue.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Company Vehicles and Distracted Driving",
        "hook": "On average, 39% of all work deaths come from transportation incidents. The drive to and from the job is part of the job.",
        "sections": [
          {
            "heading": "Buckle up",
            "items": [
              "Buckle your seat belt before the vehicle moves, every trip, no matter how short.",
              "Air bags are not enough. They're built to work with a seat belt, not instead of one.",
              "Without a belt, you can be thrown from the vehicle in a crash, and that is almost always deadly."
            ]
          },
          {
            "heading": "Phone down",
            "items": [
              "Distraction is anything that takes your eyes off the road, your hands off the wheel, or your mind off driving. Texting does all three.",
              "Don't use your phone while driving. Hands-free is just as distracting as holding it.",
              "Need to call, text, or look up directions? Pull off the road to a safe spot first, well lit if you can. The road shoulder is not the safest place to pull over.",
              "Set your GPS and controls before you start driving."
            ]
          },
          {
            "heading": "Rested and alert",
            "items": [
              "Never drive drowsy. After 24 hours awake, your driving is about as impaired as at a .10 blood alcohol level.",
              "Warning signs: drifting out of your lane, nodding off, or not remembering the last few miles.",
              "Getting tired? Pull over where it's safe and take a 15 to 30 minute nap before you go on. If you're too tired to drive, tell your supervisor."
            ]
          },
          {
            "heading": "Before you roll, and backing up",
            "items": [
              "Inspect your vehicle at the start of every workday: brakes, tires, lights, mirrors, and cargo secured. Don't drive a vehicle with safety problems.",
              "When backing, watch for people and objects. A worker on foot can be in your blind spot.",
              "People may not hear your backup alarm over jobsite noise, or the alarm may not be working.",
              "Use a spotter to help you back up. A backup camera helps you see what's behind you."
            ]
          }
        ],
        "ask": "What's one thing you'll do differently on the drive home today?"
      },
      "es": {
        "title": "Vehículos de la compañía y manejar distraído",
        "hook": "En promedio, el 39% de todas las muertes en el trabajo vienen de incidentes de transporte. El viaje de ida y vuelta al trabajo es parte del trabajo.",
        "sections": [
          {
            "heading": "Abróchate",
            "items": [
              "Abróchate el cinturón de seguridad antes de que el vehículo se mueva, en cada viaje, por corto que sea.",
              "Las bolsas de aire no son suficientes. Están hechas para funcionar con el cinturón, no en lugar de él.",
              "Sin cinturón, puedes salir disparado del vehículo en un choque, y eso casi siempre es mortal."
            ]
          },
          {
            "heading": "Suelta el teléfono",
            "items": [
              "Una distracción es cualquier cosa que te quita los ojos del camino, las manos del volante o la mente de manejar. Mandar mensajes hace las tres cosas.",
              "No uses el teléfono mientras manejas. El manos libres distrae igual que tenerlo en la mano.",
              "¿Tienes que llamar, mandar un mensaje o buscar direcciones? Primero sal del camino a un lugar seguro, con buena luz si se puede. El acotamiento no es el lugar más seguro para orillarte.",
              "Programa el GPS y ajusta los controles antes de empezar a manejar."
            ]
          },
          {
            "heading": "Descansado y alerta",
            "items": [
              "Nunca manejes con sueño. Después de 24 horas despierto, manejas casi tan mal como con un nivel de alcohol en la sangre de .10.",
              "Señales de alerta: te sales de tu carril, cabeceas o no te acuerdas de las últimas millas.",
              "¿Te está ganando el cansancio? Párate donde sea seguro y duerme de 15 a 30 minutos antes de seguir. Si estás demasiado cansado para manejar, avísale a tu supervisor."
            ]
          },
          {
            "heading": "Antes de salir, y al dar reversa",
            "items": [
              "Revisa tu vehículo al empezar cada día de trabajo: frenos, llantas, luces, espejos y la carga asegurada. No manejes un vehículo con problemas de seguridad.",
              "Al dar reversa, fíjate en las personas y los objetos. Un trabajador a pie puede estar en tu punto ciego.",
              "La gente puede no oír tu alarma de reversa por el ruido de la obra, o la alarma puede no estar funcionando.",
              "Usa a alguien que te guíe para dar reversa. Una cámara de reversa te ayuda a ver lo que hay atrás."
            ]
          }
        ],
        "ask": "¿Qué es una cosa que vas a hacer diferente hoy al manejar de regreso a casa?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "lightning",
    "industries": [
      "all"
    ],
    "code": "OSHA FS-3863 (guidance) / 1926.451(f)(12)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA/NOAA Fact Sheet FS-3863: Lightning Safety When Working Outdoors",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3863.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1926.451(f)(12): no scaffold work during storms or high winds unless a competent person determines it is safe",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.451",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Lightning Safety",
        "hook": "When thunder roars, go indoors! If you hear thunder, even a distant rumble, get to a safe place right away. Lightning can strike up to 10 miles from any rain.",
        "sections": [
          {
            "heading": "Plan before work starts",
            "items": [
              "Before outdoor work starts, your supervisor should check the weather report. Roofing, scaffold work and heavy equipment are on OSHA's higher-risk list.",
              "If a storm looks like it's coming, don't start any task you can't stop quickly.",
              "Warning systems help, but none of them can catch the first strike or predict every strike."
            ]
          },
          {
            "heading": "Where to go",
            "items": [
              "The safest place is a fully enclosed building with electrical wiring and plumbing.",
              "No building close by? Get in a hard-topped metal vehicle and roll the windows up.",
              "Inside, stay off electrical equipment and cords, plumbing fixtures, and corded phones, except in an emergency."
            ]
          },
          {
            "heading": "Where not to be",
            "items": [
              "Sheds, tents, pavilions and covered porches are not safe shelter.",
              "Get off the roof, the ladder, the scaffold and big equipment. Lightning tends to hit the tallest thing around. Don't be it.",
              "Stay away from metal, wiring, fencing and water. Stay out of open areas, and never lie flat on the ground.",
              "Scaffold work stops during storms or high winds, unless a competent person decides it's safe and the crew is protected by fall arrest or secured wind screens."
            ]
          },
          {
            "heading": "Waiting it out",
            "items": [
              "In a shelter, stay inside for at least 30 minutes after you hear the last sound of thunder.",
              "In a vehicle, same rule: stay in it for at least 30 minutes after you hear the last sound of thunder."
            ]
          }
        ],
        "ask": "If a storm rolls in right now, where exactly do we go, and who makes the call?"
      },
      "es": {
        "title": "Seguridad contra rayos",
        "hook": "¡Cuando truena, a cubierto! Si oyes truenos, aunque se oigan lejos, ve a un lugar seguro de inmediato. Un rayo puede caer hasta a 10 millas de donde está lloviendo.",
        "sections": [
          {
            "heading": "Planea antes de empezar",
            "items": [
              "Antes de empezar el trabajo afuera, tu supervisor debe revisar el pronóstico del tiempo. Los techos, el trabajo en andamios y el equipo pesado están en la lista de OSHA de más alto riesgo.",
              "Si parece que viene una tormenta, no empieces ninguna tarea que no puedas parar rápido.",
              "Los sistemas de alerta ayudan, pero ninguno puede detectar el primer rayo ni predecir todos los rayos."
            ]
          },
          {
            "heading": "A dónde ir",
            "items": [
              "El lugar más seguro es un edificio completamente cerrado, con cableado eléctrico y plomería.",
              "¿No hay un edificio cerca? Métete a un vehículo de metal con techo duro y sube las ventanas.",
              "Adentro, no toques equipo eléctrico ni cables, la plomería ni los teléfonos de cable, menos en una emergencia."
            ]
          },
          {
            "heading": "Dónde no estar",
            "items": [
              "Los cobertizos, las carpas, los pabellones y los porches techados no son un refugio seguro.",
              "Bájate del techo, de la escalera, del andamio y del equipo grande. El rayo suele caer en lo más alto que haya. No seas tú.",
              "Aléjate del metal, los cables, las cercas y el agua. No te quedes en áreas abiertas, y nunca te acuestes en el suelo.",
              "El trabajo en andamios se para durante tormentas o vientos fuertes, a menos que una persona competente decida que es seguro y la cuadrilla esté protegida con detención de caídas o con pantallas contra el viento bien aseguradas."
            ]
          },
          {
            "heading": "Espera a que pase",
            "items": [
              "En un refugio, quédate adentro por lo menos 30 minutos después de oír el último trueno.",
              "En un vehículo, la misma regla: quédate adentro por lo menos 30 minutos después de oír el último trueno."
            ]
          }
        ],
        "ask": "Si ahorita llega una tormenta, ¿a dónde vamos exactamente, y quién da la orden?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "first-aid-blood",
    "industries": [
      "all"
    ],
    "code": "1910.151 / 1926.50 / 1910.1030",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.151(b): trained first-aid person and supplies",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.50(c), (d)(1)-(2), (f)(2)(ii): first aid in construction, kits, posted location",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.50",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1030(b) universal precautions, (d)(1), (d)(2)(v)-(vi), (d)(3)(i), (d)(3)(ix), (d)(4)(ii)(A), (d)(4)(ii)(D), (f)(1), (f)(3), (g)(2)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
        "kind": "standard"
      },
      {
        "label": "OSHA interpretation, May 13, 1994: bloodborne pathogens standard and construction; first-aid provider training under 1926.21(b)(2)",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1994-05-13",
        "kind": "guidance"
      },
      {
        "label": "OSHA Bloodborne Pathogens and Needlestick Prevention",
        "url": "https://www.osha.gov/bloodborne-pathogens",
        "kind": "guidance"
      },
      {
        "label": "OSHA Medical and First Aid",
        "url": "https://www.osha.gov/medical-first-aid",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "First Aid and Blood Cleanup",
        "hook": "When someone gets hurt, the first few minutes count. Know who can help, where the kit is, and how to handle blood without putting yourself at risk.",
        "sections": [
          {
            "heading": "Who helps, and where's the kit",
            "items": [
              "If there's no clinic or hospital close by, someone on site has to be trained to give first aid. On construction jobs, that person needs a valid first-aid certificate or equivalent training they can prove.",
              "First aid supplies have to be easy to get to. On construction jobs, your company checks the kit before each job and at least weekly, so used items get replaced.",
              "On construction sites, if a 911 call won't send our location automatically, your company has to post the site's location where you can see it."
            ]
          },
          {
            "heading": "Treat all blood as infected",
            "items": [
              "That's called universal precautions. Treat all human blood as if it carries disease, no matter whose it is.",
              "Wear gloves any time you could touch blood, or touch things or surfaces with blood on them.",
              "Wash your hands right after you take off your gloves. If blood gets on your skin, wash with soap and water. If it gets in your eyes, nose or mouth, flush with water."
            ]
          },
          {
            "heading": "Cleaning up",
            "items": [
              "A surface with blood on it gets cleaned with a disinfectant right away, or as soon as you can.",
              "Don't pick up broken glass that may have blood on it with your hands. Use a brush and dustpan, or tongs."
            ]
          },
          {
            "heading": "If blood gets on you",
            "items": [
              "Flood the area with water and clean any wound with soap and water. Then report it to your supervisor right away and get medical attention.",
              "If OSHA's bloodborne pathogens rule covers your job, your company has to make a confidential medical evaluation available to you right away after you report an exposure.",
              "That rule covers jobs that can expose you to blood. There, your company has to give you protective gear at no cost, train you, and offer the hepatitis B vaccine free. It doesn't cover most construction work, but designated first-aiders on construction jobs still have to be trained on bloodborne hazards."
            ]
          }
        ],
        "ask": "Who's our first-aider today, and where are the first aid kit and the gloves? Point to them."
      },
      "es": {
        "title": "Primeros auxilios y limpieza de sangre",
        "hook": "Cuando alguien se lastima, los primeros minutos cuentan. Sabe quién puede ayudar, dónde está el botiquín y cómo manejar la sangre sin ponerte en riesgo.",
        "sections": [
          {
            "heading": "Quién ayuda y dónde está el botiquín",
            "items": [
              "Si no hay una clínica u hospital cerca, alguien en la obra tiene que estar entrenado para dar primeros auxilios. En trabajos de construcción, esa persona necesita un certificado válido de primeros auxilios o un entrenamiento equivalente que pueda comprobar.",
              "Los materiales de primeros auxilios tienen que estar fáciles de alcanzar. En trabajos de construcción, tu compañía revisa el botiquín antes de cada trabajo y por lo menos cada semana, para reponer lo que se usó.",
              "En obras de construcción, si una llamada al 911 no manda nuestra ubicación automáticamente, tu compañía tiene que poner la ubicación de la obra donde la puedas ver."
            ]
          },
          {
            "heading": "Trata toda la sangre como infectada",
            "items": [
              "Eso se llama precauciones universales. Trata toda la sangre humana como si tuviera una enfermedad, sin importar de quién sea.",
              "Usa guantes cada vez que puedas tocar sangre, o tocar cosas o superficies que tengan sangre.",
              "Lávate las manos justo después de quitarte los guantes. Si te cae sangre en la piel, lávate con agua y jabón. Si te cae en los ojos, la nariz o la boca, enjuágate con agua."
            ]
          },
          {
            "heading": "La limpieza",
            "items": [
              "Una superficie con sangre se limpia con desinfectante de inmediato, o lo antes posible.",
              "No recojas con las manos vidrio roto que pueda tener sangre. Usa una escoba y un recogedor, o unas pinzas."
            ]
          },
          {
            "heading": "Si te cae sangre",
            "items": [
              "Echa bastante agua en el área y limpia cualquier herida con agua y jabón. Luego avísale a tu supervisor de inmediato y busca atención médica.",
              "Si la regla de OSHA sobre patógenos en la sangre cubre tu trabajo, tu compañía tiene que darte acceso de inmediato a una evaluación médica confidencial después de que reportes una exposición.",
              "Esa regla cubre los trabajos que te pueden exponer a sangre. Ahí, tu compañía tiene que darte equipo de protección sin costo, entrenarte y ofrecerte gratis la vacuna contra la hepatitis B. No cubre la mayoría del trabajo de construcción, pero las personas asignadas a dar primeros auxilios en construcción igual tienen que recibir entrenamiento sobre los peligros de la sangre."
            ]
          }
        ],
        "ask": "¿Quién da los primeros auxilios hoy, y dónde están el botiquín y los guantes? Señálenlos."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "injury-reporting",
    "industries": [
      "all"
    ],
    "code": "1904.35 / OSH Act 11(c)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1904.35(b)(1)(i)-(iv), (b)(2): reasonable reporting procedure, right to report, no retaliation, record access (employers that keep records)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.35",
        "kind": "standard"
      },
      {
        "label": "OSHA 1904.36: section 11(c) of the OSH Act prohibits discrimination for reporting",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.36",
        "kind": "standard"
      },
      {
        "label": "OSHA 1904.1(a): partial exemption for 10 or fewer employees (1904.2(a) covers low-hazard industries)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.1",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet 3812: Protection From Retaliation for Engaging in Safety and Health Activity under the OSH Act",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3812.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Whistleblower Protection Program: how to file and filing deadlines",
        "url": "https://www.whistleblowers.gov/complaint_page",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workers' Rights",
        "url": "https://www.osha.gov/workers",
        "kind": "guidance"
      },
      {
        "label": "OSHA Bloodborne Pathogens and Needlestick Prevention",
        "url": "https://www.osha.gov/bloodborne-pathogens",
        "kind": "guidance"
      },
      {
        "label": "OSHA Recommended Practices: Hazard Identification and Assessment",
        "url": "https://www.osha.gov/safety-management/hazard-Identification",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Reporting Injuries",
        "hook": "If you get hurt or sick from work, report it. That's your right, and nobody can punish you for it.",
        "sections": [
          {
            "heading": "Your right to report",
            "items": [
              "You have the right to report a work-related injury or illness.",
              "If your company keeps OSHA injury and illness records, the recordkeeping rule says it has to tell you that right, and tell you how to report.",
              "That rule also says the way to report has to be reasonable. A process that would scare off or discourage a reasonable worker from reporting isn't allowed."
            ]
          },
          {
            "heading": "No retaliation",
            "items": [
              "Your company can't fire you or treat you worse for reporting an injury or illness. Section 11(c) of the OSH Act protects you.",
              "Retaliation includes being fired, demoted, disciplined, denied overtime, having your pay or hours cut, or being threatened or harassed.",
              "A company policy that discourages injury reporting, like certain incentive programs, can count as retaliation too."
            ]
          },
          {
            "heading": "How to report",
            "items": [
              "Report promptly and accurately, using the process your company gave you.",
              "Report illnesses too, not just injuries.",
              "Where your company keeps OSHA injury and illness records, you have the right to review them. You can also ask for copies of your own medical records."
            ]
          },
          {
            "heading": "Why reporting fast matters",
            "items": [
              "Some exposures need care right away. If you get blood in a cut or in your eyes, nose or mouth, report it immediately and get medical attention.",
              "Reports help find the hazards that would hurt the next person.",
              "If you're punished for reporting, you can file a retaliation complaint with OSHA. Under section 11(c), you have 30 days. Call 1-800-321-OSHA, that's 6742. You can also file online, or at your local OSHA office."
            ]
          }
        ],
        "ask": "On this job, who do you report an injury to, and how?"
      },
      "es": {
        "title": "Cómo reportar lesiones",
        "hook": "Si te lastimas o te enfermas por el trabajo, repórtalo. Es tu derecho, y nadie te puede castigar por hacerlo.",
        "sections": [
          {
            "heading": "Tu derecho a reportar",
            "items": [
              "Tienes el derecho de reportar una lesión o enfermedad relacionada con el trabajo.",
              "Si tu compañía lleva registros de lesiones y enfermedades de OSHA, la regla sobre registros dice que tiene que decirte que tienes ese derecho, y decirte cómo reportar.",
              "Esa regla también dice que la forma de reportar tiene que ser razonable. No se permite un proceso que asuste o desanime a un trabajador razonable de reportar."
            ]
          },
          {
            "heading": "Sin represalias",
            "items": [
              "Tu compañía no te puede despedir ni tratarte peor por reportar una lesión o enfermedad. La sección 11(c) de la Ley OSH te protege.",
              "Las represalias incluyen que te despidan, te bajen de puesto, te disciplinen, te nieguen horas extra, te reduzcan el pago o las horas, o te amenacen o acosen.",
              "Una política de la compañía que desanime a reportar lesiones, como ciertos programas de incentivos, también puede contar como represalia."
            ]
          },
          {
            "heading": "Cómo reportar",
            "items": [
              "Reporta pronto y con exactitud, usando el proceso que te dio tu compañía.",
              "Reporta también las enfermedades, no solo las lesiones.",
              "Donde tu compañía lleva registros de lesiones y enfermedades de OSHA, tienes el derecho de revisarlos. También puedes pedir copias de tus propios expedientes médicos."
            ]
          },
          {
            "heading": "Por qué importa reportar rápido",
            "items": [
              "Algunas exposiciones necesitan atención de inmediato. Si te cae sangre en una cortada o en los ojos, la nariz o la boca, repórtalo de inmediato y busca atención médica.",
              "Los reportes ayudan a encontrar los peligros que lastimarían a la siguiente persona.",
              "Si te castigan por reportar, puedes presentar una queja por represalia con OSHA. Bajo la sección 11(c), tienes 30 días. Llama al 1-800-321-OSHA, o sea 6742. También puedes presentarla en línea, o en tu oficina local de OSHA."
            ]
          }
        ],
        "ask": "En este trabajo, ¿a quién le reportas una lesión, y cómo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "near-miss",
    "industries": [
      "all"
    ],
    "code": "OSHA Recommended Practices / OSH Act 11(c)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Recommended Practices: Worker Participation (action items 2 and 5)",
        "url": "https://www.osha.gov/safety-management/worker-participation",
        "kind": "guidance"
      },
      {
        "label": "OSHA Recommended Practices: Hazard Identification and Assessment (action item 4)",
        "url": "https://www.osha.gov/safety-management/hazard-Identification",
        "kind": "guidance"
      },
      {
        "label": "OSHA Recommended Practices: Hazard Prevention and Control",
        "url": "https://www.osha.gov/safety-management/hazard-prevention",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workers' Right to Refuse Dangerous Work",
        "url": "https://www.osha.gov/workers/right-to-refuse",
        "kind": "guidance"
      },
      {
        "label": "OSHA Fact Sheet 3812: Protection From Retaliation for Engaging in Safety and Health Activity under the OSH Act",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3812.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Near Misses and Stopping Unsafe Work",
        "hook": "A near miss is a warning. Nobody got hurt this time. Report it, and we fix it before somebody does.",
        "sections": [
          {
            "heading": "Speak up",
            "items": [
              "If you see a hazard or have a close call, say something. OSHA recommends every workplace have a way to report injuries, close calls, hazards and concerns.",
              "Talking to management about safety is protected. Your company can't punish you for it.",
              "Some companies offer a way to report without your name. OSHA recommends that, so fear of getting in trouble doesn't stop anyone from speaking up."
            ]
          },
          {
            "heading": "Find the cause, not someone to blame",
            "items": [
              "Near misses get looked into, the same as injuries. That's how we find the hazards that would cause the next injury.",
              "A good investigation doesn't stop at \"somebody made a mistake.\" It looks for the root cause, and there's often more than one.",
              "People stop speaking up when investigations blame a person instead of the conditions that caused it."
            ]
          },
          {
            "heading": "Fix it",
            "items": [
              "Easy, cheap fixes get done right away, like housekeeping or clearing a loose cord someone could trip on.",
              "Bigger fixes take time. Until then, a temporary control goes in to keep people safe.",
              "You often know the hazard best. Tell your supervisor how you'd fix it."
            ]
          },
          {
            "heading": "Stopping unsafe work",
            "items": [
              "OSHA recommends that companies let any worker call for a pause or shutdown of unsafe work. Know how that works here.",
              "The law also protects you if you refuse truly dangerous work, but only when all of these are true: where you could, you asked your company to fix it and they didn't; you refuse in good faith; a reasonable person would agree there's a real danger of death or serious injury; and there isn't time to fix it through normal channels, like an OSHA inspection.",
              "If you refuse, tell your supervisor you won't do it until it's fixed. Ask to have it fixed or for other work, and stay on site unless you're told to leave."
            ]
          }
        ],
        "ask": "What's one near miss or hazard you've seen this week that hasn't been fixed yet?"
      },
      "es": {
        "title": "Casi accidentes y cómo parar el trabajo peligroso",
        "hook": "Un casi accidente es una advertencia. Esta vez nadie salió lastimado. Repórtalo, y lo arreglamos antes de que alguien se lastime.",
        "sections": [
          {
            "heading": "Habla",
            "items": [
              "Si ves un peligro o te salvas por poco, dilo. OSHA recomienda que todo lugar de trabajo tenga una forma de reportar lesiones, casi accidentes, peligros y preocupaciones.",
              "Hablar con los jefes sobre seguridad está protegido. Tu compañía no te puede castigar por eso.",
              "Algunas compañías tienen una forma de reportar sin dar tu nombre. OSHA lo recomienda, para que el miedo a meterse en problemas no impida que nadie hable."
            ]
          },
          {
            "heading": "Busca la causa, no a quién culpar",
            "items": [
              "Los casi accidentes se investigan, igual que las lesiones. Así encontramos los peligros que causarían la próxima lesión.",
              "Una buena investigación no se queda en \"alguien cometió un error\". Busca la causa de raíz, y muchas veces hay más de una.",
              "La gente deja de hablar cuando las investigaciones culpan a una persona en vez de las condiciones que lo causaron."
            ]
          },
          {
            "heading": "Arréglalo",
            "items": [
              "Los arreglos fáciles y baratos se hacen de inmediato, como limpiar y ordenar o quitar un cable suelto con el que alguien se puede tropezar.",
              "Los arreglos más grandes toman tiempo. Mientras tanto, se pone un control temporal para mantener a la gente segura.",
              "Muchas veces tú conoces el peligro mejor que nadie. Dile a tu supervisor cómo lo arreglarías."
            ]
          },
          {
            "heading": "Cómo parar el trabajo peligroso",
            "items": [
              "OSHA recomienda que las compañías dejen que cualquier trabajador pida una pausa o que se pare un trabajo peligroso. Infórmate de cómo funciona aquí.",
              "La ley también te protege si te niegas a hacer un trabajo de verdad peligroso, pero solo cuando todo esto es cierto: cuando pudiste, le pediste a tu compañía que lo arreglara y no lo hizo; te niegas de buena fe; una persona razonable estaría de acuerdo en que hay un peligro real de muerte o lesión grave; y no hay tiempo para arreglarlo por los medios normales, como una inspección de OSHA.",
              "Si te niegas, dile a tu supervisor que no lo vas a hacer hasta que se arregle. Pide que lo arreglen o que te den otro trabajo, y quédate en la obra a menos que te digan que te vayas."
            ]
          }
        ],
        "ask": "¿Cuál es un casi accidente o un peligro que hayas visto esta semana y que todavía no se ha arreglado?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "new-workers",
    "industries": [
      "all"
    ],
    "code": "OSHA Recommended Practices / Heat",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Recommended Practices: Education and Training (action items 1, 3 and 4)",
        "url": "https://www.osha.gov/safety-management/education-training",
        "kind": "guidance"
      },
      {
        "label": "OSHA Heat: Protecting New Workers",
        "url": "https://www.osha.gov/heat-exposure/protecting-new-workers",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workers' Rights",
        "url": "https://www.osha.gov/workers",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "New and Returning Workers",
        "hook": "New on the crew, or back after time off? Your first days are when you need to slow down, ask questions, and stick with a buddy.",
        "sections": [
          {
            "heading": "Ask questions",
            "items": [
              "You have the right to safety training in a language you understand.",
              "Training should cover the hazards of your job, what to do in an emergency, and how to report hazards, injuries and near misses.",
              "If something isn't clear, ask. Know who to go to with questions or safety concerns.",
              "Training isn't just for day one. You should get trained any time you're given a new task."
            ]
          },
          {
            "heading": "Know the hazards",
            "items": [
              "Before you start, learn the hazards you could run into on this job and how to spot them.",
              "You have the right to the safety gear the job requires, like gloves or a harness and lifeline for falls."
            ]
          },
          {
            "heading": "Heat: ease into it",
            "items": [
              "In the heat, the first days are the most dangerous. Almost half of heat-related deaths happen on a worker's first day on the job, and over 70 percent in the first week.",
              "Your body needs time to adjust to the heat. OSHA recommends new workers work only 20 percent of a normal day on day one, with at least one rest break, and add 20 percent each day after until they reach a normal schedule.",
              "Back after a week or more away from hot work? You need extra heat protections too, for at least a week."
            ]
          },
          {
            "heading": "Buddy up",
            "items": [
              "Use a buddy system. New workers shouldn't work alone.",
              "Watch new workers closely for signs of heat illness. If someone has symptoms, let them stop working and start first aid. Never leave them alone."
            ]
          }
        ],
        "ask": "New folks: what's one thing about this job you're not sure about yet? Everyone else: who's your buddy today?"
      },
      "es": {
        "title": "Trabajadores nuevos y los que regresan",
        "hook": "¿Eres nuevo en la cuadrilla, o regresas después de un tiempo fuera? En tus primeros días tienes que ir con calma, hacer preguntas y no separarte de un compañero.",
        "sections": [
          {
            "heading": "Haz preguntas",
            "items": [
              "Tienes el derecho a recibir entrenamiento de seguridad en un idioma que entiendas.",
              "El entrenamiento debe cubrir los peligros de tu trabajo, qué hacer en una emergencia, y cómo reportar peligros, lesiones y casi accidentes.",
              "Si algo no te queda claro, pregunta. Sabe a quién acudir con preguntas o preocupaciones de seguridad.",
              "El entrenamiento no es solo para el primer día. Te deben entrenar cada vez que te den una tarea nueva."
            ]
          },
          {
            "heading": "Conoce los peligros",
            "items": [
              "Antes de empezar, aprende cuáles son los peligros que te puedes encontrar en este trabajo y cómo reconocerlos.",
              "Tienes el derecho a recibir el equipo de seguridad que el trabajo requiere, como guantes o un arnés y una línea de vida para caídas."
            ]
          },
          {
            "heading": "El calor: acostúmbrate poco a poco",
            "items": [
              "En el calor, los primeros días son los más peligrosos. Casi la mitad de las muertes por calor pasan en el primer día de trabajo, y más del 70 por ciento en la primera semana.",
              "Tu cuerpo necesita tiempo para acostumbrarse al calor. OSHA recomienda que los trabajadores nuevos trabajen solo el 20 por ciento de un día normal el primer día, con por lo menos un descanso, y que agreguen 20 por ciento cada día después hasta llegar a un horario normal.",
              "¿Regresas después de una semana o más lejos del trabajo en calor? Tú también necesitas protecciones extra contra el calor, por lo menos durante una semana."
            ]
          },
          {
            "heading": "Trabaja con un compañero",
            "items": [
              "Usa el sistema de compañeros. Los trabajadores nuevos no deben trabajar solos.",
              "Vigila de cerca a los trabajadores nuevos por señales de enfermedad por calor. Si alguien tiene síntomas, déjalo parar de trabajar y empieza los primeros auxilios. Nunca lo dejes solo."
            ]
          }
        ],
        "ask": "Los nuevos: ¿qué es algo de este trabajo de lo que todavía no están seguros? Los demás: ¿quién es tu compañero hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "extinguishers",
    "industries": [
      "all"
    ],
    "code": "1910.157 / 1926.150",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.157(c)(1) and (c)(4): placement, kept charged and in place",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.157",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.157(d)(2) and (d)(4): travel distance, Class A and Class B",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.157",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.157(e)(2)-(e)(3): monthly inspection, annual maintenance",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.157",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.157(g)(1)-(g)(2): training when extinguishers are provided for employee use",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.157",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.150(a)(2)-(a)(4) and (c)(1)(i): access, location, inspection and replacement, 100-foot travel distance (construction)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.150",
        "kind": "standard"
      },
      {
        "label": "OSHA eTool: Fire Extinguisher Use (P.A.S.S.)",
        "url": "https://www.osha.gov/etools/evacuation-plans-procedures/emergency-standards/portable-extinguishers/use",
        "kind": "guidance"
      },
      {
        "label": "OSHA eTool: Extinguisher Basics (classes)",
        "url": "https://www.osha.gov/etools/evacuation-plans-procedures/emergency-standards/portable-extinguishers/about",
        "kind": "guidance"
      },
      {
        "label": "OSHA eTool: Fight or Flee?",
        "url": "https://www.osha.gov/etools/evacuation-plans-procedures/eap/fight-or-flee",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Fire Extinguishers",
        "hook": "An extinguisher can stop a small fire early. It is not for a big one. Today: where ours are, how to use one, and when to walk away.",
        "sections": [
          {
            "heading": "Know where they are",
            "items": [
              "Your company has to mount extinguishers where you can reach them fast without getting hurt on the way, and mark where they are.",
              "Inside a building, extinguishers for wood, paper and cardboard fires are generally no more than a 75-foot walk away. Near flammable liquids, it's 50 feet. On a construction job, it's no more than 100 feet from any point in the building area being protected.",
              "Never block one. Keep pallets, carts and material out of the way, and put it back in its spot after it's used."
            ]
          },
          {
            "heading": "Use it: P.A.S.S.",
            "items": [
              "Pull the pin. Aim low, at the base of the fire. Squeeze the handle. Sweep side to side at the base until it looks out.",
              "Watch the spot. If it flares up again, aim, squeeze and sweep again. Back away from it, in case it flames up.",
              "Use the right one. Never put water on a flammable liquid fire or an electrical fire. Read the label: A is wood and paper, B is liquids like gas, oil and grease, C is electrical.",
              "On a CO2 extinguisher, don't touch the plastic horn. It gets cold enough to hurt your skin."
            ]
          },
          {
            "heading": "When not to fight it",
            "items": [
              "Only fight a small fire: still on the thing that first caught, and flames no higher than your head.",
              "Keep your way out behind you. If fire, heat or smoke could get between you and the exit, leave.",
              "Get out if the fire is spreading, it's behind a wall or ceiling, smoke is filling the room, or the heat keeps you from getting within 10 to 15 feet. Get out if your extinguisher runs empty and the fire isn't out.",
              "If you have any doubt at all, get out."
            ]
          },
          {
            "heading": "Keep them ready",
            "items": [
              "In general industry, your company has to have each extinguisher looked over once a month, serviced once a year, and kept fully charged and in its place. On construction jobs, they get inspected regularly, and a bad one gets replaced right away.",
              "If you see one that's missing, blocked or already used, tell your supervisor today.",
              "In general industry, if your company provides extinguishers for you to use, it has to teach you how when you start, and at least once a year after."
            ]
          }
        ],
        "ask": "Where is the closest extinguisher to where you're working today, and what's your way out?"
      },
      "es": {
        "title": "Extintores de incendios",
        "hook": "Un extintor puede apagar un fuego pequeño a tiempo. No es para un fuego grande. Hoy vemos dónde están los nuestros, cómo se usan y cuándo hay que alejarse.",
        "sections": [
          {
            "heading": "Sabe dónde están",
            "items": [
              "Tu compañía tiene que colgar los extintores donde puedas alcanzarlos rápido sin lastimarte en el camino, y marcar dónde están.",
              "Dentro de un edificio, los extintores para fuegos de madera, papel y cartón por lo general no están a más de 75 pies de camino. Cerca de líquidos inflamables, son 50 pies. En una obra de construcción, no más de 100 pies desde cualquier punto del área del edificio que se protege.",
              "Nunca bloquees uno. Mantén las tarimas, los carritos y el material fuera del paso, y regrésalo a su lugar después de usarlo."
            ]
          },
          {
            "heading": "Úsalo: P.A.S.S.",
            "items": [
              "Jala el seguro. Apunta bajo, a la base del fuego. Aprieta la manija. Barre de lado a lado en la base hasta que parezca apagado.",
              "Vigila el lugar. Si se vuelve a prender, apunta, aprieta y barre otra vez. Aléjate de espaldas, por si vuelve a encenderse.",
              "Usa el correcto. Nunca le eches agua a un fuego de líquido inflamable ni a un fuego eléctrico. Lee la etiqueta: A es madera y papel, B es líquidos como gasolina, aceite y grasa, C es eléctrico.",
              "En un extintor de CO2, no toques la boquilla de plástico. Se pone tan fría que te puede lastimar la piel."
            ]
          },
          {
            "heading": "Cuándo no combatirlo",
            "items": [
              "Solo combate un fuego pequeño: que siga en lo primero que se prendió, y con llamas que no pasen de tu cabeza.",
              "Mantén tu salida detrás de ti. Si el fuego, el calor o el humo se pueden meter entre tú y la salida, vete.",
              "Sal si el fuego se está extendiendo, está detrás de una pared o del techo, el humo está llenando el cuarto, o el calor no te deja acercarte a 10 o 15 pies. Sal si se te acaba el extintor y el fuego no se ha apagado.",
              "Si tienes cualquier duda, sal."
            ]
          },
          {
            "heading": "Mantenlos listos",
            "items": [
              "En la industria general, tu compañía tiene que hacer que revisen cada extintor una vez al mes, que le den servicio una vez al año, y que se mantenga bien cargado y en su lugar. En obras de construcción, se revisan con regularidad, y uno en mal estado se reemplaza de inmediato.",
              "Si ves uno que falta, que está bloqueado o que ya se usó, avísale a tu supervisor hoy.",
              "En la industria general, si tu compañía tiene extintores para que tú los uses, tiene que enseñarte a usarlos cuando empiezas, y por lo menos una vez al año después."
            ]
          }
        ],
        "ask": "¿Dónde está el extintor más cercano a donde vas a trabajar hoy, y cuál es tu salida?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "workplace-violence",
    "industries": [
      "all"
    ],
    "code": "OSH Act Sec. 5(a)(1)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Workplace Violence: definition, risk factors, figures (BLS Census of Fatal Occupational Injuries, 2023)",
        "url": "https://www.osha.gov/workplace-violence",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workplace Violence: Enforcement (General Duty Clause)",
        "url": "https://www.osha.gov/workplace-violence/enforcement",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workplace Violence: Training & Other Resources",
        "url": "https://www.osha.gov/workplace-violence/resources",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workplace Violence Fact Sheet (FS-3509)",
        "url": "https://www.osha.gov/sites/default/files/publications/FACTSHEET-WORKPLACE-VIOLENCE.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3148: Guidelines for Preventing Workplace Violence for Healthcare and Social Service Workers",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3148.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3153: Workplace Violence Prevention Programs in Late-Night Retail Establishments",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3153.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Workplace Violence",
        "hook": "Workplace violence isn't only a fistfight. OSHA counts threats, harassment, intimidation and verbal abuse too. In 2023, violent acts were the third-leading cause of deaths on the job in the U.S.",
        "sections": [
          {
            "heading": "Know the risks and the signs",
            "items": [
              "Risk goes up when you work alone or in an isolated spot, handle money with the public, work late at night, or deal with people who are volatile or using drugs or alcohol.",
              "Watch for behavior that's building up: shouting, pushing, threats.",
              "A threat counts, even if nobody gets hurt."
            ]
          },
          {
            "heading": "Stop it early",
            "items": [
              "Learn to spot a situation that could turn violent, stay out of it, and calm it down when you can.",
              "Tell your supervisor about a dispute or problem early, before it blows up.",
              "Don't jump into a fight between other people if you can avoid it.",
              "If someone tries to rob you, hand it over. Don't resist."
            ]
          },
          {
            "heading": "Get out",
            "items": [
              "If a place or a person feels unsafe, don't go in. Back out and tell your supervisor.",
              "Know your way out. Don't let yourself get boxed in.",
              "Avoid going alone into places you don't know. Use a buddy when you can.",
              "If you are in immediate danger, call 911."
            ]
          },
          {
            "heading": "Report it",
            "items": [
              "Report every incident and every threat to your supervisor right away, in writing.",
              "A good program looks into every report quickly. No one who reports violence should face payback for it.",
              "Know your company's workplace violence policy and who to call."
            ]
          }
        ],
        "ask": "If a job started to feel unsafe, who would you call, and how would you get out?"
      },
      "es": {
        "title": "Violencia en el trabajo",
        "hook": "La violencia en el trabajo no es solo una pelea a golpes. OSHA también cuenta las amenazas, el acoso, la intimidación y los insultos. En 2023, los actos violentos fueron la tercera causa de muerte en el trabajo en los Estados Unidos.",
        "sections": [
          {
            "heading": "Conoce los riesgos y las señales",
            "items": [
              "El riesgo sube cuando trabajas solo o en un lugar aislado, manejas dinero con el público, trabajas tarde en la noche, o tratas con gente alterada o que está usando drogas o alcohol.",
              "Fíjate en el comportamiento que va subiendo de tono: gritos, empujones, amenazas.",
              "Una amenaza cuenta, aunque nadie salga lastimado."
            ]
          },
          {
            "heading": "Páralo a tiempo",
            "items": [
              "Aprende a reconocer una situación que se puede volver violenta, a mantenerte fuera de ella y a calmarla cuando puedas.",
              "Avísale a tu supervisor de un pleito o problema a tiempo, antes de que explote.",
              "No te metas en una pelea entre otras personas si lo puedes evitar.",
              "Si alguien te quiere robar, entrégale lo que pide. No te resistas."
            ]
          },
          {
            "heading": "Sal de ahí",
            "items": [
              "Si un lugar o una persona no te da confianza, no entres. Retírate y avísale a tu supervisor.",
              "Ten clara tu salida. No dejes que te acorralen.",
              "Evita entrar solo a lugares que no conoces. Ve con un compañero cuando puedas.",
              "Si estás en peligro inmediato, llama al 911."
            ]
          },
          {
            "heading": "Repórtalo",
            "items": [
              "Reporta cada incidente y cada amenaza a tu supervisor de inmediato, por escrito.",
              "Un buen programa investiga cada reporte rápido. Nadie que reporte violencia debe sufrir represalias por hacerlo.",
              "Conoce la política de tu compañía sobre violencia en el trabajo y a quién llamar."
            ]
          }
        ],
        "ask": "Si un trabajo empezara a sentirse inseguro, ¿a quién llamarías y cómo saldrías?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "fork-pedestrians",
    "industries": [
      "wh",
      "mfg",
      "retail"
    ],
    "code": "1910.178(m) / 1910.178(n)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.178(m)(1)-(m)(4): no driving up to people at fixed objects, no one under the elevated portion, riders, arms and legs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(n)(4) and (n)(6): horn at cross aisles, load trailing, look in direction of travel",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Pedestrian Traffic",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/workplace/pedestrian-traffic",
        "kind": "guidance"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Traveling & Maneuvering",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/operating-forklift/traveling-maneuvering",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Forklifts and People on Foot",
        "hook": "A forklift can't stop suddenly. Drivers, never assume the people on foot know you're there. Walkers, stay out of the way.",
        "sections": [
          {
            "heading": "On foot",
            "items": [
              "Use the marked walkways. If there aren't any, stay to one side of the aisle.",
              "Stand clear of a forklift that's working. Watch the back end. It swings wide.",
              "Give a moving forklift plenty of room. Remember it can't stop fast."
            ]
          },
          {
            "heading": "Never under the forks",
            "items": [
              "Nobody stands or walks under the raised forks or load, loaded or empty. That's the rule.",
              "Stay out of the path where a load could fall, and keep a safe distance from the people working.",
              "Drivers: never drive up to someone standing in front of a bench, a rack or anything else fixed.",
              "No riders, unless riding is allowed and there's a safe place made for it. Keep arms and legs inside the truck and out of the mast."
            ]
          },
          {
            "heading": "Drivers: corners and cross aisles",
            "items": [
              "Slow down and sound your horn at cross aisles and anywhere you can't see.",
              "Look where you're going and keep a clear view. If the load blocks your view, drive with the load behind you.",
              "Can't see? Don't move. Use a spotter, and use the mirrors where they're installed.",
              "Yield to people on foot, wait for them to pass, and make eye contact when you can. Sound your horn or alarm when you back up."
            ]
          }
        ],
        "ask": "Where are the blind corners in this building, and how do you get past them safely, on foot and driving?"
      },
      "es": {
        "title": "Montacargas y peatones",
        "hook": "Un montacargas no se puede detener de golpe. Choferes, nunca den por hecho que la gente a pie sabe que ustedes están ahí. Los que van a pie, manténganse fuera del camino.",
        "sections": [
          {
            "heading": "A pie",
            "items": [
              "Usa los pasillos marcados para peatones. Si no hay, quédate a un lado del pasillo.",
              "Mantente lejos de un montacargas que está trabajando. Cuidado con la parte de atrás. Da un giro muy abierto.",
              "Dale bastante espacio a un montacargas en movimiento. Recuerda que no puede frenar rápido."
            ]
          },
          {
            "heading": "Nunca debajo de las horquillas",
            "items": [
              "Nadie se para ni pasa por debajo de las horquillas levantadas o de la carga, con carga o vacías. Esa es la regla.",
              "Mantente fuera del camino por donde podría caer una carga, y guarda una distancia segura de la gente que está trabajando.",
              "Choferes: nunca manejen hacia alguien que está parado frente a una mesa de trabajo, un rack o cualquier otra cosa fija.",
              "Nada de llevar pasajeros, a menos que esté permitido y haya un lugar seguro hecho para eso. Mantén brazos y piernas dentro del montacargas y fuera del mástil."
            ]
          },
          {
            "heading": "Choferes: esquinas y cruces de pasillos",
            "items": [
              "Baja la velocidad y toca el claxon en los cruces de pasillos y en cualquier lugar donde no puedas ver.",
              "Mira hacia donde vas y mantén la vista despejada. Si la carga te tapa la vista, maneja con la carga detrás de ti.",
              "¿No ves? No te muevas. Usa a alguien que te guíe, y usa los espejos donde estén instalados.",
              "Dale el paso a la gente a pie, espera a que pasen, y míralos a los ojos cuando puedas. Toca el claxon o la alarma cuando vayas en reversa."
            ]
          }
        ],
        "ask": "¿Dónde están las esquinas ciegas en este edificio, y cómo se pasan con seguridad, a pie y manejando?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "loading-docks",
    "industries": [
      "wh",
      "truck",
      "retail",
      "food"
    ],
    "code": "1910.178(k) / 1910.26",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.178(k)(1)-(k)(4): highway trucks, railroad cars, fixed jacks ((k)(1) brake/chock rule not enforced by OSHA for commercial motor vehicles; FMCSA preempts)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(m)(6)-(m)(7): dock edges, freight doors, trailer floors ((m)(7) brake/wheel-block rule preempted by FMCSA for commercial motor vehicles)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(n)(11): dockboards secured, driven slowly, rated capacity",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.26(a), (c), (d): dockboard capacity, securing, preventing vehicle movement",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.26",
        "kind": "standard"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Load Handling (truck trailers and railroad cars)",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/operating-forklift/load-handling",
        "kind": "guidance"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Loading Docks",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/workplace/loading-docks",
        "kind": "guidance"
      },
      {
        "label": "OSHA Standard Interpretation 2005-11-08: chocking trailers docked to buildings with downward approaches",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2005-11-08",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Loading Docks and Trailers",
        "hook": "At the dock, three things go wrong: a forklift goes off the edge, the trailer moves, or the dock plate slips. Here is how to stop each one.",
        "sections": [
          {
            "heading": "Hold the trailer in place",
            "items": [
              "While anyone is on the dock plate, the trailer has to be kept from moving. Your company has to use a way to do that, such as wheel chocks. Know what's used here, and check that it's in place before you drive on.",
              "A trailer that isn't hooked to a tractor may need fixed jacks under it so it can't tip up while you load.",
              "Check the trailer floor before you drive on. Look for breaks and weak spots, and make sure it will hold the forklift and the load."
            ]
          },
          {
            "heading": "Dock plates",
            "items": [
              "The dock plate has to hold the forklift plus the load. Never go over its rated capacity.",
              "A portable dock plate has to be anchored or held so it can't slide out of position.",
              "Drive across slowly, carefully and straight."
            ]
          },
          {
            "heading": "Inside the trailer",
            "items": [
              "Dark trailer? Use the dock lights and your headlights.",
              "Make sure the door is tall enough for your forklift, counting the height of the dock.",
              "Sound your horn going in and coming out, and check for people and obstacles before you exit."
            ]
          },
          {
            "heading": "Dock edges",
            "items": [
              "Keep a safe distance from the edge of the dock.",
              "Slow down, watch for others, and know where the edge is. Wet or icy docks are slippery.",
              "Don't use the forklift to open or close freight doors."
            ]
          }
        ],
        "ask": "Before the next trailer gets loaded, who checks that it's held in place, and how do you know it's done?"
      },
      "es": {
        "title": "Muelles de carga y tráileres",
        "hook": "En el muelle hay tres cosas que salen mal: un montacargas se cae por la orilla, el tráiler se mueve, o la plancha del muelle se resbala. Así se evita cada una.",
        "sections": [
          {
            "heading": "Asegura el tráiler en su lugar",
            "items": [
              "Mientras alguien esté sobre la plancha, el tráiler no se puede mover. Tu compañía tiene que usar una forma de evitarlo, como calzas en las llantas. Sabe qué se usa aquí, y revisa que esté puesto antes de subirte.",
              "Un tráiler que no está enganchado a un tractor puede necesitar gatos fijos debajo para que no se levante mientras cargas.",
              "Revisa el piso del tráiler antes de entrar. Busca roturas y partes débiles, y asegúrate de que aguante el montacargas y la carga."
            ]
          },
          {
            "heading": "Planchas del muelle",
            "items": [
              "La plancha tiene que aguantar el montacargas más la carga. Nunca te pases de su capacidad.",
              "Una plancha portátil tiene que estar anclada o sujeta para que no se salga de su lugar.",
              "Cruza despacio, con cuidado y derecho."
            ]
          },
          {
            "heading": "Dentro del tráiler",
            "items": [
              "¿Tráiler oscuro? Usa las luces del muelle y los faros del montacargas.",
              "Asegúrate de que la puerta sea lo bastante alta para tu montacargas, contando la altura del muelle.",
              "Toca el claxon al entrar y al salir, y revisa que no haya gente ni obstáculos antes de salir."
            ]
          },
          {
            "heading": "Orillas del muelle",
            "items": [
              "Guarda una distancia segura de la orilla del muelle.",
              "Baja la velocidad, fíjate en los demás y sabe dónde está la orilla. Los muelles mojados o con hielo resbalan.",
              "No uses el montacargas para abrir o cerrar las puertas de carga."
            ]
          }
        ],
        "ask": "Antes de cargar el próximo tráiler, ¿quién revisa que esté bien sujeto, y cómo sabes que ya se hizo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "battery-charging",
    "industries": [
      "wh",
      "mfg"
    ],
    "code": "1910.178(g) / 1910.178(f)",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.178(g)(1)-(g)(12): changing and charging storage batteries",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(f)(2): LP-gas storage and handling (by reference to NFPA 58)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Power Sources, Electric",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/types-fundamentals/power-sources/electrical",
        "kind": "guidance"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Power Sources, Internal Combustion (LPG refueling)",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/types-fundamentals/power-sources/internal-combustion",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Forklift Battery Charging and Changing",
        "hook": "A forklift battery is very heavy, it's full of acid, and it gives off a gas that can explode. The charging area is not a break room.",
        "sections": [
          {
            "heading": "The charging area",
            "items": [
              "Charge batteries only in the area set aside for charging.",
              "Your company has to set that area up with a way to flush and neutralize spilled acid, fire protection, ventilation, and protection so trucks can't damage the chargers.",
              "Toward the end of a charge, batteries can give off hydrogen gas. It's highly explosive. No smoking, no open flames, no sparks in the charging area.",
              "Only trained people charge and change forklift batteries."
            ]
          },
          {
            "heading": "Before you charge",
            "items": [
              "Position the truck and set the brake before you change or charge a battery.",
              "Open the battery cover so heat can escape, and make sure the vent caps are working.",
              "Take off metal jewelry. Keep tools and other metal off the top of an uncovered battery. Touching the cells can cause a short that burns your skin.",
              "Unplug and turn off the charger before you connect or disconnect the clamps."
            ]
          },
          {
            "heading": "Acid protection",
            "items": [
              "Battery acid is sulfuric acid, and it's highly corrosive. Wear a face shield, safety goggles, and rubber or neoprene gloves and apron.",
              "Acid in your eyes? Flush them at the eyewash with clean water for 15 minutes. Acid on your skin? Take off the soaked clothes and flush the skin for 15 minutes.",
              "If you handle electrolyte, pour acid into water. Never pour water into acid."
            ]
          },
          {
            "heading": "Changing batteries and propane tanks",
            "items": [
              "Use the hoist, lifting beam, or other lifting equipment provided. Never use a chain with two hooks.",
              "Put the battery back in the right position and secure it in the truck.",
              "Only trained and authorized people replace propane tanks. Propane is extremely flammable, and it can give you frostbite on bare skin.",
              "Propane vapor is heavier than air and collects in low spots. Don't refuel in confined areas, and turn the service valve off when you park the truck for a long time."
            ]
          }
        ],
        "ask": "Where are the eyewash and the acid neutralizer for our charging area? Point to them."
      },
      "es": {
        "title": "Carga y cambio de baterías de montacargas",
        "hook": "La batería de un montacargas es muy pesada, está llena de ácido y suelta un gas que puede explotar. El área de carga no es un lugar para descansar.",
        "sections": [
          {
            "heading": "El área de carga",
            "items": [
              "Carga las baterías solo en el área designada para cargar.",
              "Tu compañía tiene que equipar esa área con una forma de lavar y neutralizar el ácido derramado, protección contra incendios, ventilación y protección para que los montacargas no dañen los cargadores.",
              "Al final de la carga, las baterías pueden soltar gas hidrógeno. Es muy explosivo. Nada de fumar, nada de llamas, nada de chispas en el área de carga.",
              "Solo personas capacitadas cargan y cambian las baterías de los montacargas."
            ]
          },
          {
            "heading": "Antes de cargar",
            "items": [
              "Coloca el montacargas en posición y pon el freno antes de cambiar o cargar una batería.",
              "Abre la tapa de la batería para que salga el calor, y asegúrate de que las tapas de ventilación funcionen.",
              "Quítate las joyas de metal. Mantén herramientas y otros objetos de metal fuera de la parte de arriba de una batería destapada. Tocar las celdas puede causar un corto que te quema la piel.",
              "Desconecta y apaga el cargador antes de conectar o quitar las pinzas."
            ]
          },
          {
            "heading": "Protección contra el ácido",
            "items": [
              "El ácido de batería es ácido sulfúrico, y es muy corrosivo. Usa careta, gafas de seguridad, y guantes y delantal de hule o neopreno.",
              "¿Te cayó ácido en los ojos? Lávalos en la estación lavaojos con agua limpia por 15 minutos. ¿Ácido en la piel? Quítate la ropa mojada y lava la piel por 15 minutos.",
              "Si manejas electrolito, echa el ácido al agua. Nunca eches agua al ácido."
            ]
          },
          {
            "heading": "Cambio de baterías y tanques de propano",
            "items": [
              "Usa el polipasto, la barra de levante u otro equipo de levante que te den. Nunca uses una cadena con dos ganchos.",
              "Vuelve a poner la batería en la posición correcta y asegúrala en el montacargas.",
              "Solo personas capacitadas y autorizadas cambian los tanques de propano. El propano es extremadamente inflamable, y te puede congelar la piel descubierta.",
              "El vapor de propano pesa más que el aire y se junta en lugares bajos. No cargues combustible en espacios cerrados, y cierra la válvula de servicio cuando dejes el montacargas estacionado por mucho tiempo."
            ]
          }
        ],
        "ask": "¿Dónde están la estación lavaojos y el neutralizador de ácido de nuestra área de carga? Señálenlos."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "pallet-jacks",
    "industries": [
      "wh",
      "retail",
      "food",
      "truck"
    ],
    "code": "1910.178(l) / 1910.178(n)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.178(a)(1): scope, includes motorized hand trucks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(l)(1), (l)(2), (l)(4): operator training, supervision of trainees, refresher and evaluation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(m)(3), (n)(4), (n)(7), (n)(10), (n)(13): riders and traveling",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.178(o)(1)-(o)(2), (p)(1), (q)(7): loads, unsafe trucks, daily examination",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
        "kind": "standard"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool: Ramps and Grades",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/workplace/ramps-grades",
        "kind": "guidance"
      },
      {
        "label": "OSHA Grocery Warehousing eTool: Transport Techniques (pallet jack maintenance)",
        "url": "https://www.osha.gov/etools/grocery-warehousing/transport-techniques",
        "kind": "guidance"
      },
      {
        "label": "OSHA Warehousing: Hazards and Solutions (mechanical handling equipment)",
        "url": "https://www.osha.gov/warehousing/hazards-solutions",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Pallet Jacks",
        "hook": "A powered pallet jack is in the same family as a forklift under the federal rules. A manual jack still moves a lot of weight. Both deserve respect.",
        "sections": [
          {
            "heading": "Powered jacks need training",
            "items": [
              "The federal forklift rule covers motorized hand trucks by name. That includes powered pallet jacks.",
              "Your company has to train you and evaluate you before you run one. A trainee only runs one under direct supervision, where nobody gets put in danger.",
              "If you have an accident or a near miss, or you're seen running it unsafely, your company has to give you refresher training. It also has to evaluate every operator at least once every three years."
            ]
          },
          {
            "heading": "Check it first",
            "items": [
              "A powered jack gets examined before it's put to work, at least once a day.",
              "If it's damaged, needs repair, or is unsafe in any way, it comes out of service until it's fixed. Tell your supervisor.",
              "Manual jacks wear out too. Flat spots on the wheels make loads unstable and steering hard. Report hard steering or stopping before it leads to an injury."
            ]
          },
          {
            "heading": "Loads and travel",
            "items": [
              "On a powered jack, only move loads that are stable and within the rated capacity.",
              "Slow down and sound the horn at cross aisles and blind spots. Slow down on wet or slippery floors.",
              "No unauthorized riders on a powered truck. Where riding is allowed, there has to be a safe place to ride."
            ]
          },
          {
            "heading": "Ramps and elevators",
            "items": [
              "Take ramps slowly. Never turn on a ramp. Make your turn before you start up or down.",
              "When you're walking with a pallet truck on a ramp, loaded or empty, OSHA says the forks should point downhill, no matter which way you're going.",
              "Going into an elevator or other tight space with a powered jack, go in load end first."
            ]
          }
        ],
        "ask": "What's one thing you'd find on a pallet jack that would make you take it out of service today?"
      },
      "es": {
        "title": "Patines hidráulicos (pallet jacks)",
        "hook": "Bajo las reglas federales, un patín eléctrico es de la misma familia que un montacargas. Un patín manual también mueve mucho peso. Los dos merecen respeto.",
        "sections": [
          {
            "heading": "Los patines eléctricos requieren capacitación",
            "items": [
              "La regla federal de montacargas incluye por nombre los carros de mano motorizados. Eso incluye los patines eléctricos.",
              "Tu compañía tiene que capacitarte y evaluarte antes de que manejes uno. Una persona en entrenamiento solo lo maneja bajo supervisión directa, donde no ponga a nadie en peligro.",
              "Si tienes un accidente o un casi accidente, o te ven manejarlo de forma insegura, tu compañía tiene que darte capacitación de repaso. También tiene que evaluar a cada operador por lo menos una vez cada tres años."
            ]
          },
          {
            "heading": "Revísalo primero",
            "items": [
              "Un patín eléctrico se revisa antes de ponerlo a trabajar, por lo menos una vez al día.",
              "Si está dañado, necesita reparación o es inseguro de cualquier forma, se saca de servicio hasta que lo arreglen. Avísale a tu supervisor.",
              "Los patines manuales también se desgastan. Las partes planas en las ruedas hacen que la carga sea inestable y que cueste dirigirlo. Reporta si cuesta dirigirlo o frenarlo antes de que alguien se lastime."
            ]
          },
          {
            "heading": "Cargas y recorrido",
            "items": [
              "En un patín eléctrico, solo mueve cargas que estén estables y dentro de la capacidad nominal.",
              "Baja la velocidad y toca la bocina en los cruces de pasillos y en los puntos ciegos. Baja la velocidad en pisos mojados o resbalosos.",
              "Nada de pasajeros no autorizados en un vehículo motorizado. Donde se permite subirse, tiene que haber un lugar seguro para ir."
            ]
          },
          {
            "heading": "Rampas y elevadores",
            "items": [
              "Sube y baja las rampas despacio. Nunca des la vuelta en una rampa. Da la vuelta antes de empezar a subir o bajar.",
              "Cuando vas caminando con un patín en una rampa, cargado o vacío, OSHA dice que las uñas deben apuntar hacia abajo de la rampa, sin importar hacia dónde vayas.",
              "Al entrar a un elevador o a otro espacio estrecho con un patín eléctrico, entra con la carga por delante."
            ]
          }
        ],
        "ask": "¿Qué cosa encontrarías en un patín que te haría sacarlo de servicio hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "racking",
    "industries": [
      "wh",
      "mfg",
      "retail"
    ],
    "code": "1910.176",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.176(a): clearance and aisles where mechanical handling equipment is used",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.176(b): secure storage",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.176(c): housekeeping in storage areas",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
        "kind": "standard"
      },
      {
        "label": "OSHA Warehousing: Hazards and Solutions (storage and handling, ladders, falling objects)",
        "url": "https://www.osha.gov/warehousing/hazards-solutions",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3220, Worker Safety Series: Warehousing (materials storage)",
        "url": "https://www.osha.gov/Publications/3220_Warehouse.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Racking and Stacking",
        "hook": "Racks and stacks hold a lot of weight. When storage goes wrong, loads slide, fall, or a whole rack collapses.",
        "sections": [
          {
            "heading": "Stack it stable",
            "items": [
              "The rule is simple: storage can't create a hazard.",
              "Bags, boxes and bundles stored in tiers have to be stacked, blocked, interlocked and limited in height, so they won't slide or collapse.",
              "Stack loads evenly and straight. Put heavier loads on the lower or middle shelves.",
              "Stack loose, unboxed material so it can't fall."
            ]
          },
          {
            "heading": "Respect the rack",
            "items": [
              "Every shelf and rack has a load capacity. Don't go over it.",
              "Racks get inspected and maintained so they don't collapse. Guards on the uprights help protect them from forklift bumps.",
              "When a rack is damaged, that area gets blocked off right away. Stay out of it.",
              "Take items off a shelf one at a time."
            ]
          },
          {
            "heading": "Aisles and clearance",
            "items": [
              "Where forklifts and other equipment run, aisles need safe clearance, including at docks, doorways and turns.",
              "Keep aisles clear and in good repair. Nothing left in or across an aisle that could cause a hazard.",
              "Permanent aisles are marked. Don't leave pallets or product in them.",
              "Keep storage areas free of piled-up material that could trip someone, start a fire, or attract pests."
            ]
          },
          {
            "heading": "Reaching high",
            "items": [
              "Need something up high? Use a ladder. Never set a ladder on a box, barrel or pallet to get more height.",
              "Keep three points of contact on a ladder. Never step on the top cap of a stepladder.",
              "If things could fall on you, wear the head protection you're given."
            ]
          }
        ],
        "ask": "Where's one spot in our racks or aisles right now that you would fix first?"
      },
      "es": {
        "title": "Estantería y apilado",
        "hook": "Los racks y las pilas aguantan mucho peso. Cuando el almacenamiento sale mal, las cargas se resbalan, se caen, o un rack entero se derrumba.",
        "sections": [
          {
            "heading": "Apila de forma estable",
            "items": [
              "La regla es sencilla: el almacenamiento no puede crear un peligro.",
              "Los sacos, cajas y paquetes guardados en niveles tienen que estar apilados, bloqueados, entrelazados y con altura limitada, para que no se resbalen ni se derrumben.",
              "Apila las cargas parejas y derechas. Pon las cargas más pesadas en los estantes de abajo o del medio.",
              "Apila el material suelto, sin caja, para que no se pueda caer."
            ]
          },
          {
            "heading": "Respeta el rack",
            "items": [
              "Cada estante y cada rack tiene una capacidad de carga. No te pases.",
              "Los racks se inspeccionan y se mantienen para que no se derrumben. Las guardas en los postes ayudan a protegerlos de los golpes de montacargas.",
              "Cuando un rack está dañado, esa área se bloquea de inmediato. No te metas ahí.",
              "Saca las cosas del estante una por una."
            ]
          },
          {
            "heading": "Pasillos y espacio libre",
            "items": [
              "Donde andan montacargas y otro equipo, los pasillos necesitan espacio libre seguro, también en los muelles, las puertas y las vueltas.",
              "Mantén los pasillos despejados y en buen estado. Nada dejado en un pasillo o atravesado que pueda causar un peligro.",
              "Los pasillos permanentes están marcados. No dejes tarimas ni producto en ellos.",
              "Mantén las áreas de almacenamiento libres de material amontonado que pueda hacer tropezar a alguien, causar un incendio o atraer plagas."
            ]
          },
          {
            "heading": "Para alcanzar lo alto",
            "items": [
              "¿Necesitas algo de arriba? Usa una escalera. Nunca pongas una escalera sobre una caja, un barril o una tarima para ganar altura.",
              "Mantén tres puntos de contacto en la escalera. Nunca te pares en la tapa de arriba de una escalera de tijera.",
              "Si te pueden caer cosas encima, usa la protección para la cabeza que te dan."
            ]
          }
        ],
        "ask": "¿Cuál es un lugar en nuestros racks o pasillos que tú arreglarías primero ahora mismo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "conveyors",
    "industries": [
      "wh",
      "mfg"
    ],
    "code": "1910.212 / 1910.147",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.212(a)(1)-(a)(2): machine guarding, general requirements",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(a)(2)(ii) and Note: servicing during normal production, minor servicing exception",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(b), (c)(5)(ii)(D), (d)(2)-(d)(6), (e)(2)-(e)(3): definitions, lock identification, applying and removing lockout",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA 3170, Safeguarding Equipment and Protecting Employees from Amputations (conveyors)",
        "url": "https://www.osha.gov/Publications/OSHA3170.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Machine Guarding eTool: Hazardous Mechanical Motions and Actions",
        "url": "https://www.osha.gov/etools/machine-guarding/introduction/hazardous-motions-actions",
        "kind": "guidance"
      },
      {
        "label": "OSHA Warehousing: Hazards and Solutions (conveyors)",
        "url": "https://www.osha.gov/warehousing/hazards-solutions",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Conveyor Safety",
        "hook": "A conveyor doesn't stop to see if your hand is in the way. Conveyor injuries usually happen when hands or fingers get caught in a nip point or shear point.",
        "sections": [
          {
            "heading": "Guards stay on",
            "items": [
              "Your company has to guard machines to protect you from nip points, rotating parts and other moving hazards.",
              "Where a belt meets its pulley is a nip point. Even a smooth, slow shaft can grab hair and clothing.",
              "Equipment must not run without its guards and covers in place."
            ]
          },
          {
            "heading": "Around the line",
            "items": [
              "No loose clothing or jewelry near a conveyor. Tie long hair back under a net or cap.",
              "Never ride on a conveyor.",
              "People have been hurt and killed working underneath conveyors. Take that area seriously."
            ]
          },
          {
            "heading": "Emergency stops",
            "items": [
              "Emergency stop buttons or pull cords should be clearly marked, unblocked, and within easy reach. Know where yours are before you start.",
              "Keep them clear. Never block a stop button or a pull cord."
            ]
          },
          {
            "heading": "Clearing jams",
            "items": [
              "Clearing a jam is servicing. The lockout rule lists unjamming.",
              "If clearing it means taking off a guard or putting any part of your body in the danger zone, lockout applies. An authorized person shuts it down, locks it out, releases stored energy, and verifies it's dead before anyone reaches in.",
              "There's a narrow exception for minor, routine jams, like some package jams. It only applies when your company uses another method that gives you effective protection. If you're not sure, ask before you reach in.",
              "Your lock shows who put it on, and normally only the person who put it on takes it off. Before power comes back, everyone has to be clear."
            ]
          }
        ],
        "ask": "Where is the nearest emergency stop to where you'll be working today?"
      },
      "es": {
        "title": "Seguridad con transportadores",
        "hook": "Un transportador no se detiene a ver si tu mano está en el camino. Las lesiones con transportadores casi siempre pasan cuando las manos o los dedos quedan atrapados en un punto de atrapamiento o de corte.",
        "sections": [
          {
            "heading": "Las guardas se quedan puestas",
            "items": [
              "Tu compañía tiene que poner guardas en las máquinas para protegerte de los puntos de atrapamiento, las piezas que giran y otras partes en movimiento.",
              "Donde la banda se junta con la polea hay un punto de atrapamiento. Hasta un eje liso que gira despacio puede agarrar el pelo y la ropa.",
              "El equipo no se debe operar sin sus guardas y tapas puestas."
            ]
          },
          {
            "heading": "Alrededor de la línea",
            "items": [
              "Nada de ropa suelta ni joyas cerca de un transportador. Amárrate el pelo largo debajo de una red o una gorra.",
              "Nunca te subas a un transportador para viajar en él.",
              "Ha habido gente lesionada y muerta trabajando debajo de transportadores. Toma esa área en serio."
            ]
          },
          {
            "heading": "Paros de emergencia",
            "items": [
              "Los botones de paro de emergencia o los cables de jalón deben estar bien marcados, despejados y fáciles de alcanzar. Antes de empezar, sabe dónde están los tuyos.",
              "Mantenlos despejados. Nunca bloquees un botón de paro ni un cable de jalón."
            ]
          },
          {
            "heading": "Para destrabar atascos",
            "items": [
              "Destrabar un atasco es dar servicio. La regla de bloqueo menciona destrabar por nombre.",
              "Si para destrabarlo tienes que quitar una guarda o meter cualquier parte del cuerpo en la zona de peligro, aplica el bloqueo. Una persona autorizada lo apaga, le pone candado, libera la energía acumulada y verifica que esté sin energía antes de que alguien meta la mano.",
              "Hay una excepción limitada para atascos menores y rutinarios, como algunos atascos de paquetes. Solo aplica cuando tu compañía usa otro método que te da protección efectiva. Si no estás seguro, pregunta antes de meter la mano.",
              "Tu candado muestra quién lo puso, y normalmente solo quien lo puso lo quita. Antes de que vuelva la energía, todos tienen que estar retirados."
            ]
          }
        ],
        "ask": "¿Dónde está el paro de emergencia más cercano a donde vas a trabajar hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "aisles-exits",
    "industries": [
      "wh",
      "mfg",
      "retail",
      "food",
      "facil",
      "health"
    ],
    "code": "1910.36 / 1910.37 / 1910.176(a)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.176(a): aisles and passageways kept clear, clearances, marking",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.22(a)(2)-(3): floors clean, dry, free of hazards",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.36(b), (d)(1), (g)(2): number of exit routes, exit doors unlocked, 28-inch exit access",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.36",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.37(a)(3), (b)(1)-(6): exit routes unobstructed, lighting, exit signs, Not an Exit",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.37",
        "kind": "standard"
      },
      {
        "label": "OSHA Warehousing: Hazards and Solutions",
        "url": "https://www.osha.gov/warehousing/hazards-solutions",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Aisles and Exits",
        "hook": "If the alarm went off right now, could you walk straight to an exit without moving anything? That's today's test.",
        "sections": [
          {
            "heading": "Keep aisles clear",
            "items": [
              "Where forklifts and other handling equipment run, aisles need enough room to pass safely. That includes loading docks, doorways, and turns.",
              "Aisles and walkways stay clear and in good repair. Nothing goes across or in an aisle where it could cause a hazard.",
              "Permanent aisles have to be marked. Keep pallets, product, and trash out of the marked lanes.",
              "Floors are kept clean and, as much as possible, dry. Pick up spills, cords, and hoses so nobody trips."
            ]
          },
          {
            "heading": "Exit routes",
            "items": [
              "Exit routes must be free and unobstructed. No materials or equipment go in an exit route, not even for a few minutes.",
              "The way to an exit has to be at least 28 inches wide at every point. One cart or one stack of boxes can take that away.",
              "A workplace needs at least two exit routes, as far apart as practical. One is allowed only if everyone can still get out safely, and some places need more than two. Know where yours are."
            ]
          },
          {
            "heading": "Exit doors and signs",
            "items": [
              "You must be able to open an exit door from the inside at all times, without a key, a tool, or special knowledge. If you find one chained or locked, report it right away.",
              "Each exit is marked with a sign that reads EXIT, and the sign is lit. Don't stack anything or hang anything that blocks the view of an exit sign or an exit door.",
              "A door that could be mistaken for an exit is marked Not an Exit, or with what it really is, like Closet.",
              "Exit routes have to be lit well enough to see along the way. If a light or an exit sign is out, report it."
            ]
          }
        ],
        "ask": "Where's the nearest exit from where you work, and where's the second one? Is anything in the way of either one right now?"
      },
      "es": {
        "title": "Pasillos y salidas",
        "hook": "Si la alarma sonara ahorita, ¿podrías caminar directo a una salida sin mover nada? Esa es la prueba de hoy.",
        "sections": [
          {
            "heading": "Mantén los pasillos libres",
            "items": [
              "Donde andan montacargas y otro equipo de carga, los pasillos necesitan espacio suficiente para pasar con seguridad. Eso incluye los muelles de carga, las puertas y las vueltas.",
              "Los pasillos y caminos se mantienen libres y en buen estado. Nada se pone atravesado ni dentro de un pasillo donde pueda causar un peligro.",
              "Los pasillos permanentes tienen que estar marcados. Mantén las tarimas, el producto y la basura fuera de los carriles marcados.",
              "Los pisos se mantienen limpios y, en lo posible, secos. Recoge derrames, cables y mangueras para que nadie se tropiece."
            ]
          },
          {
            "heading": "Rutas de salida",
            "items": [
              "Las rutas de salida tienen que estar libres y despejadas. No se pone ningún material ni equipo en una ruta de salida, ni siquiera por unos minutos.",
              "El camino hacia una salida tiene que medir por lo menos 28 pulgadas de ancho en todos sus puntos. Un carrito o una pila de cajas te puede quitar ese espacio.",
              "Un lugar de trabajo necesita por lo menos dos rutas de salida, lo más separadas posible. Solo se permite una si todos pueden salir seguros, y algunos lugares necesitan más de dos. Conoce cuáles son las tuyas."
            ]
          },
          {
            "heading": "Puertas de salida y letreros",
            "items": [
              "Tienes que poder abrir una puerta de salida desde adentro en todo momento, sin llave, sin herramienta y sin saber ningún truco. Si encuentras una con cadena o con llave, repórtala de inmediato.",
              "Cada salida está marcada con un letrero iluminado que dice EXIT (salida). No apiles ni cuelgues nada que tape la vista de un letrero de salida o de una puerta de salida.",
              "Una puerta que se pueda confundir con una salida se marca Not an Exit (no es salida), o con lo que realmente es, como Closet (armario).",
              "Las rutas de salida tienen que tener suficiente luz para ver por dónde vas. Si una luz o un letrero de salida no prende, repórtalo."
            ]
          }
        ],
        "ask": "¿Dónde está la salida más cercana a donde trabajas, y dónde está la segunda? ¿Hay algo bloqueando alguna de las dos ahorita?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "box-cutters",
    "industries": [
      "wh",
      "mfg",
      "retail",
      "food"
    ],
    "code": "1910.242(a) / 1910.138",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.242(a): employer responsible for safe condition of tools",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.242",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.138(a)-(b): hand protection, selection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.138",
        "kind": "standard"
      },
      {
        "label": "OSHA 3080: Hand and Power Tools",
        "url": "https://www.osha.gov/Publications/osha3080.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Box Cutters and Hand Tools",
        "hook": "Box cutters and hand tools look harmless. OSHA says the biggest hazards from hand tools come from misuse and poor upkeep.",
        "sections": [
          {
            "heading": "Good tools only",
            "items": [
              "Your company is responsible for the safe condition of the tools you use, even tools you bring from home.",
              "Your company can't hand out or allow unsafe hand tools.",
              "Check every tool for damage before you use it. If it's damaged, don't use it.",
              "A loose, cracked, or splintered handle on a hammer can let the head fly off and hit you or someone nearby."
            ]
          },
          {
            "heading": "Cutting safely",
            "items": [
              "Use the right tool for the job. A chisel used as a screwdriver can break, and the tip can fly off and hit someone.",
              "Point your blade away from aisles and away from people working close to you.",
              "Keep blades sharp. A dull blade causes more hazards than a sharp one.",
              "Keep the floor as clean and dry as you can, so you don't slip with a blade in your hand."
            ]
          },
          {
            "heading": "Gloves and glasses",
            "items": [
              "Where your hands could get severe cuts, punctures, or scrapes, your company has to require the right hand protection.",
              "Gloves are picked for the task and the conditions. Wear the ones your supervisor gives you for that job.",
              "Wear safety goggles and gloves when the job calls for them. The right protective gear has to be worn for hand tool hazards.",
              "Follow the manufacturer's instructions for every tool."
            ]
          }
        ],
        "ask": "What's the last tool you used that was dull, loose, or damaged? What did you do with it?"
      },
      "es": {
        "title": "Cortadores de cajas y herramientas de mano",
        "hook": "Los cortadores de cajas y las herramientas de mano parecen inofensivos. OSHA dice que los peores peligros de las herramientas de mano vienen del mal uso y del mal mantenimiento.",
        "sections": [
          {
            "heading": "Solo herramientas en buen estado",
            "items": [
              "Tu compañía es responsable de que las herramientas que usas estén en condiciones seguras, aunque sean herramientas que traes de tu casa.",
              "Tu compañía no puede entregar ni permitir herramientas de mano inseguras.",
              "Revisa cada herramienta antes de usarla para ver si tiene daños. Si está dañada, no la uses.",
              "Si el mango de un martillo está flojo, rajado o astillado, la cabeza se puede salir volando y pegarte a ti o a alguien cerca."
            ]
          },
          {
            "heading": "Corta con cuidado",
            "items": [
              "Usa la herramienta correcta para cada trabajo. Un cincel usado como desarmador se puede romper, y la punta puede salir volando y pegarle a alguien.",
              "Apunta la navaja lejos de los pasillos y lejos de la gente que trabaja cerca de ti.",
              "Mantén las navajas afiladas. Una navaja sin filo causa más peligros que una afilada.",
              "Mantén el piso lo más limpio y seco que puedas, para que no te resbales con una navaja en la mano."
            ]
          },
          {
            "heading": "Guantes y lentes",
            "items": [
              "Donde tus manos se puedan cortar, perforar o raspar fuerte, tu compañía tiene que exigir la protección de manos correcta.",
              "Los guantes se escogen según la tarea y las condiciones. Usa los que tu supervisor te da para ese trabajo.",
              "Usa gafas de seguridad y guantes cuando el trabajo lo pida. El equipo de protección correcto se tiene que usar contra los peligros de las herramientas de mano.",
              "Sigue las instrucciones del fabricante para cada herramienta."
            ]
          }
        ],
        "ask": "¿Cuál fue la última herramienta que usaste que estaba sin filo, floja o dañada? ¿Qué hiciste con ella?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "dock-edges",
    "industries": [
      "wh",
      "truck"
    ],
    "code": "1910.28(b) / 1910.29 / 1910.23",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.28(b)(1)(i): unprotected sides and edges, 4 feet",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.28",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.28(b)(1)(iii): loading dock working-side exception",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.28",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.28(b)(4): dockboards",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.28",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.29(b)(1), (b)(3): guardrail height and strength",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.29",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.23(b)(9)-(13), (c)(8), (c)(11): ladders",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.23",
        "kind": "standard"
      },
      {
        "label": "OSHA Warehousing: Hazards and Solutions (docks)",
        "url": "https://www.osha.gov/warehousing/hazards-solutions",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Dock Edges and Falls",
        "hook": "In a warehouse you don't need a roof to fall. A dock edge, a mezzanine, or a ladder is enough.",
        "sections": [
          {
            "heading": "The 4-foot rule",
            "items": [
              "If you're on a surface with an open side or edge 4 feet or more above a lower level, your company has to protect you from falling. That's the general industry line.",
              "That protection can be a guardrail, a safety net, or a personal fall protection system like fall arrest or travel restraint.",
              "A guardrail's top rail sits at 42 inches, give or take 3, and has to hold 200 pounds pushed down or out. Open dock doors and other spots where someone could fall get blocked."
            ]
          },
          {
            "heading": "Loading docks: a narrow exception",
            "items": [
              "On the working side of a loading dock platform, work can go on without fall protection only if your company can show fall protection isn't feasible there.",
              "Even then, all three have to be true: the work that needs the open edge is going on, only authorized workers are on the platform, and they've had the fall-hazard training the rules require. If that work isn't going on, the exception doesn't apply.",
              "Keep a safe distance from dock edges. Never back a forklift up to the dock edge."
            ]
          },
          {
            "heading": "Dockboards",
            "items": [
              "If you're on a dockboard where you could fall 4 feet or more, your company has to protect you with a guardrail or handrails.",
              "The exception: dockboards used only for forklifts and other motorized equipment, where the fall is no more than 10 feet and the workers are trained.",
              "Portable dockboards get anchored so they can't shift. Chock the truck's wheels so it can't move while anyone is on the dockboard."
            ]
          },
          {
            "heading": "Ladders",
            "items": [
              "Ladders get inspected before first use every shift. A ladder with a defect gets tagged and taken out of service until it's fixed.",
              "Face the ladder and keep at least one hand on it going up and down. Don't carry anything that could throw off your balance.",
              "Never use the top step or the cap of a stepladder as a step. A portable ladder up to a landing or mezzanine needs its side rails at least 3 feet above the top."
            ]
          }
        ],
        "ask": "Where are the open edges, dock doors, and ladders in our area today, and what's protecting each one?"
      },
      "es": {
        "title": "Bordes de muelle y caídas",
        "hook": "En un almacén no necesitas un techo para caerte. Basta con el borde de un muelle, un entrepiso o una escalera.",
        "sections": [
          {
            "heading": "La regla de los 4 pies",
            "items": [
              "Si estás en una superficie con un lado o borde abierto a 4 pies o más sobre un nivel más bajo, tu compañía tiene que protegerte contra caídas. Esa es la regla para la industria en general.",
              "Esa protección puede ser una baranda, una red de seguridad o un sistema personal de protección contra caídas, como uno de detención o de restricción de movimiento.",
              "El riel de arriba de una baranda va a 42 pulgadas, 3 más o 3 menos, y tiene que aguantar 200 libras empujando hacia abajo o hacia afuera. Las puertas de muelle abiertas y otros lugares donde alguien se pueda caer se bloquean."
            ]
          },
          {
            "heading": "Muelles de carga: una excepción muy limitada",
            "items": [
              "En el lado de trabajo de una plataforma de muelle de carga, se puede trabajar sin protección contra caídas solo si tu compañía puede demostrar que ahí no es factible.",
              "Aun así, las tres cosas tienen que cumplirse: el trabajo que necesita el borde abierto se está haciendo, solo trabajadores autorizados están en la plataforma, y ellos recibieron la capacitación sobre peligros de caídas que piden las reglas. Si ese trabajo no se está haciendo, la excepción no aplica.",
              "Mantén una distancia segura de los bordes del muelle. Nunca le des reversa a un montacargas hasta el borde del muelle."
            ]
          },
          {
            "heading": "Rampas de muelle",
            "items": [
              "Si estás en una rampa de muelle donde te puedes caer 4 pies o más, tu compañía tiene que protegerte con una baranda o pasamanos.",
              "La excepción: rampas usadas solo para montacargas y otro equipo motorizado, donde la caída no pasa de 10 pies y los trabajadores están capacitados.",
              "Las rampas portátiles se anclan para que no se muevan. Ponle calzas a las llantas del camión para que no se mueva mientras alguien esté en la rampa."
            ]
          },
          {
            "heading": "Escaleras",
            "items": [
              "Las escaleras se revisan antes de usarlas por primera vez en cada turno. Una escalera con un defecto se marca y se saca de servicio hasta que se arregle.",
              "Ponte de frente a la escalera y agárrate con por lo menos una mano al subir y bajar. No cargues nada que te haga perder el equilibrio.",
              "Nunca uses el último peldaño ni la tapa de una escalera de tijera como escalón. Una escalera portátil para subir a un descanso o entrepiso necesita que sus rieles laterales sobresalgan por lo menos 3 pies arriba."
            ]
          }
        ],
        "ask": "¿Dónde están hoy los bordes abiertos, las puertas de muelle y las escaleras en nuestra área, y qué protege a cada uno?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hearing",
    "industries": [
      "mfg",
      "oil",
      "util",
      "land",
      "auto"
    ],
    "code": "1910.95",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.95(c)(1)-(2): hearing conservation program, 85 dBA action level",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.95(g): audiometric testing, incl. (g)(1)-(2), (g)(5), (g)(6), (g)(8)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.95(i): hearing protectors, incl. (i)(1)-(5)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.95(k)(2): annual training",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
        "kind": "standard"
      },
      {
        "label": "OSHA Occupational Noise Exposure",
        "url": "https://www.osha.gov/noise",
        "kind": "guidance"
      },
      {
        "label": "NIOSH How to Wear Soft Foam Earplugs",
        "url": "https://www.cdc.gov/niosh/mining/tools/earplugs.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hearing Protection",
        "hook": "Hearing loss from noise is permanent. Surgery and medicine can't fix it. But it can be prevented.",
        "sections": [
          {
            "heading": "How loud is too loud",
            "items": [
              "If you have to raise your voice to talk to someone 3 feet away, the noise might be over 85 decibels.",
              "85 decibels averaged over an 8-hour shift is called the action level. At or above it, your company has to run a hearing conservation program.",
              "Ringing or humming in your ears when you leave work is a sign the noise may be too loud."
            ]
          },
          {
            "heading": "Hearing tests",
            "items": [
              "In the program, your company makes hearing tests, called audiograms, available to you at no cost.",
              "You get a baseline test within 6 months of first working at or above the action level, or within a year if a mobile test van is used. After that, you get tested at least once a year.",
              "The baseline test comes after at least 14 hours without workplace noise, and hearing protectors can count for that. You'll also be told to avoid loud noise off the job before the test.",
              "If a test shows a significant change in your hearing, called a standard threshold shift, your company has to tell you in writing within 21 days of finding it."
            ]
          },
          {
            "heading": "Hearing protectors",
            "items": [
              "Your company has to make hearing protectors available at no cost to everyone at or above the action level. You get to choose from a variety of suitable ones.",
              "You have to wear them if your noise is over the limit and other controls haven't brought it down, or if you're at the action level and haven't had your baseline test yet or have had a threshold shift.",
              "Your company has to train you on using and caring for them, make sure they fit right at the start, and supervise correct use. Training is repeated every year."
            ]
          },
          {
            "heading": "Wear foam plugs right: roll, pull, hold",
            "items": [
              "Roll the foam plug into a thin snake with your fingers.",
              "Pull the top of your ear up and back with your other hand, and slide the plug in.",
              "Hold it in with your finger until it expands. Your voice will sound muffled when it seals.",
              "Check it: most of the foam should be inside your ear canal. Cup your hands tight over your ears. If sounds get much more muffled, the plug may not be sealing. Take it out and try again."
            ]
          }
        ],
        "ask": "Show us how you put in your earplugs, right now. Roll, pull, hold. Then do the hand check."
      },
      "es": {
        "title": "Protección auditiva",
        "hook": "La pérdida de oído por ruido es permanente. Ni la cirugía ni las medicinas la arreglan. Pero se puede prevenir.",
        "sections": [
          {
            "heading": "Qué tan fuerte es demasiado",
            "items": [
              "Si tienes que alzar la voz para hablar con alguien a 3 pies de distancia, el ruido podría pasar de 85 decibeles.",
              "85 decibeles en promedio durante un turno de 8 horas se llama el nivel de acción. Si estás en ese nivel o más, tu compañía tiene que tener un programa de conservación auditiva.",
              "Si te zumban o te suenan los oídos cuando sales del trabajo, es señal de que el ruido puede estar demasiado fuerte."
            ]
          },
          {
            "heading": "Exámenes de oído",
            "items": [
              "En el programa, tu compañía te da acceso a exámenes de oído, llamados audiogramas, sin costo para ti.",
              "Te hacen un examen base dentro de los 6 meses después de empezar a trabajar en el nivel de acción o más, o dentro de un año si se usa una unidad móvil de pruebas. Después de eso, te hacen el examen por lo menos una vez al año.",
              "El examen base se hace después de por lo menos 14 horas sin ruido del trabajo, y usar protectores auditivos cuenta para eso. También te van a decir que evites el ruido fuerte fuera del trabajo antes del examen.",
              "Si un examen muestra un cambio importante en tu oído, llamado cambio del umbral estándar, tu compañía te tiene que avisar por escrito dentro de 21 días después de saberlo."
            ]
          },
          {
            "heading": "Protectores auditivos",
            "items": [
              "Tu compañía tiene que dar protectores auditivos sin costo a todos los que estén en el nivel de acción o más. Tú puedes escoger entre varios tipos adecuados.",
              "Tienes que usarlos si tu ruido pasa del límite y otros controles no lo han bajado, o si estás en el nivel de acción y todavía no te han hecho el examen base o ya tuviste un cambio del umbral.",
              "Tu compañía tiene que capacitarte en cómo usarlos y cuidarlos, asegurarse de que te queden bien desde el principio y supervisar que los uses bien. La capacitación se repite cada año."
            ]
          },
          {
            "heading": "Ponte bien los tapones de espuma: enrolla, jala, sostén",
            "items": [
              "Enrolla el tapón de espuma con los dedos hasta que quede como una culebrita delgada.",
              "Con la otra mano, jala la parte de arriba de tu oreja hacia arriba y hacia atrás, y mete el tapón.",
              "Sostenlo con el dedo hasta que se expanda. Tu voz se va a oír apagada cuando selle.",
              "Revísalo: la mayor parte de la espuma debe quedar dentro del oído. Tápate bien las orejas con las manos. Si los sonidos se oyen mucho más apagados, puede que el tapón no esté sellando. Sácalo y vuelve a intentarlo."
            ]
          }
        ],
        "ask": "Muéstranos ahorita cómo te pones los tapones. Enrolla, jala, sostén. Luego haz la prueba de las manos."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "confined-space",
    "industries": [
      "mfg",
      "oil",
      "facil"
    ],
    "code": "1910.146",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.146(b): definitions of confined space, permit-required confined space, entry, attendant, entry supervisor, hazardous atmosphere",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(c)(1)-(c)(2): evaluate the workplace; inform employees with danger signs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(d)(5): atmospheric testing before and during entry, testing order, chance to observe",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(d)(9): rescue procedures, incl. preventing unauthorized rescue attempts",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(e)(1), (e)(3), (e)(5), (f): permit prepared before entry, posted at the entry portal or equally effective means, cancelled by the entry supervisor, permit contents",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(h)(4)-(h)(5): entrant alerts the attendant and exits when ordered",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(i)(4), (i)(6)-(i)(7): attendant stays outside, orders evacuation, summons rescue",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.146(k)(3): retrieval systems for non-entry rescue",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
        "kind": "standard"
      },
      {
        "label": "OSHA Confined Spaces",
        "url": "https://www.osha.gov/confined-spaces",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3138, Permit-Required Confined Spaces",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3138.pdf",
        "kind": "guidance"
      },
      {
        "label": "NIOSH 86-110, Preventing Occupational Fatalities in Confined Spaces",
        "url": "https://www.cdc.gov/niosh/docs/86-110/",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Permit-Required Confined Spaces",
        "hook": "A tank, pit or silo can look harmless from the outside. NIOSH reports that more than 60 percent of confined space deaths are would-be rescuers.",
        "sections": [
          {
            "heading": "What makes it permit-required",
            "items": [
              "A confined space is big enough to get into and work in, has a limited way in and out, and isn't built for people to stay in. Think tanks, vessels, silos, bins, hoppers, vaults, pits and ductwork.",
              "It's permit-required if it has, or could have, a hazardous atmosphere, liquid or loose material that could engulf you, a shape that could trap you, or any other serious hazard.",
              "Your company has to find these spaces and warn you, usually with a danger sign. If you see one, you don't go in unless you're on the permit."
            ]
          },
          {
            "heading": "The permit",
            "items": [
              "Before anyone enters, a written permit is filled out and posted at the entry, or shared another way so entrants can check it. It lists the hazards, the safe entry conditions, who's going in, who the attendant is, the air test results, and how to call rescue.",
              "Entry starts the moment any part of your body breaks the plane of the opening. Leaning your head in counts.",
              "The entry supervisor cancels the permit when the work is done, or when a condition the permit doesn't allow shows up."
            ]
          },
          {
            "heading": "Test the air first",
            "items": [
              "The air is tested before anyone goes in, in this order: oxygen first, then flammable gases, then toxic gases.",
              "Oxygen below 19.5 percent or above 23.5 percent is a hazardous atmosphere. So is flammable gas above 10 percent of its lower flammable limit.",
              "Testing continues during the work as needed. You get the chance to watch the testing."
            ]
          },
          {
            "heading": "The attendant and rescue",
            "items": [
              "The attendant stays outside the whole time, keeps track of who's inside, and orders everyone out if something's wrong.",
              "If you're inside and notice a warning sign or symptom, a condition the permit doesn't allow, or an alarm, tell the attendant and get out fast. Same if the attendant or entry supervisor says get out.",
              "If someone goes down, the attendant calls rescue. Where a retrieval line is set up, they're pulled out from outside. Unless you're on the trained rescue team, never go in after them."
            ]
          }
        ],
        "ask": "Where is the nearest permit space in our area, and who do we call to rescue someone from it?"
      },
      "es": {
        "title": "Espacios confinados que requieren permiso",
        "hook": "Un tanque, una fosa o un silo pueden parecer inofensivos desde afuera. NIOSH informa que más del 60 por ciento de las muertes en espacios confinados son de personas que entraron a intentar un rescate.",
        "sections": [
          {
            "heading": "Qué hace que requiera permiso",
            "items": [
              "Un espacio confinado es lo bastante grande para meterte y trabajar, tiene una entrada y salida limitada, y no está hecho para que la gente se quede adentro. Piensa en tanques, recipientes, silos, tolvas, bóvedas, fosas y ductos.",
              "Requiere permiso si tiene, o podría tener, una atmósfera peligrosa, líquido o material suelto que te podría tragar, una forma que te podría atrapar, o cualquier otro peligro serio.",
              "Tu compañía tiene que identificar estos espacios y avisarte, normalmente con un letrero de peligro. Si ves uno, no entras a menos que estés en el permiso."
            ]
          },
          {
            "heading": "El permiso",
            "items": [
              "Antes de que alguien entre, se llena un permiso por escrito y se pone en la entrada, o se comparte de otra forma para que los que entran lo puedan revisar. Dice cuáles son los peligros, las condiciones seguras para entrar, quién entra, quién es el vigilante, los resultados de las pruebas de aire y cómo llamar al rescate.",
              "La entrada empieza en cuanto cualquier parte de tu cuerpo cruza el plano de la abertura. Meter la cabeza cuenta.",
              "El supervisor de entrada cancela el permiso cuando se termina el trabajo, o cuando aparece una condición que el permiso no permite."
            ]
          },
          {
            "heading": "Primero se prueba el aire",
            "items": [
              "El aire se prueba antes de que alguien entre, en este orden: primero el oxígeno, después los gases inflamables y después los gases tóxicos.",
              "Oxígeno por debajo de 19.5 por ciento o por encima de 23.5 por ciento es una atmósfera peligrosa. También lo es un gas inflamable por encima del 10 por ciento de su límite inferior de inflamabilidad.",
              "Las pruebas siguen durante el trabajo según haga falta. Tienes la oportunidad de ver cómo se hacen las pruebas."
            ]
          },
          {
            "heading": "El vigilante y el rescate",
            "items": [
              "El vigilante se queda afuera todo el tiempo, lleva la cuenta de quién está adentro y ordena que todos salgan si algo anda mal.",
              "Si estás adentro y notas una señal de alerta o un síntoma, una condición que el permiso no permite, o una alarma, avísale al vigilante y sal rápido. Lo mismo si el vigilante o el supervisor de entrada te dice que salgas.",
              "Si alguien se desmaya o se cae adentro, el vigilante llama al rescate. Donde hay una línea de rescate instalada, lo sacan desde afuera. A menos que seas parte del equipo de rescate entrenado, nunca entres por él."
            ]
          }
        ],
        "ask": "¿Dónde está el espacio con permiso más cercano en nuestra área, y a quién llamamos para rescatar a alguien de ahí?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "welding",
    "industries": [
      "mfg",
      "auto"
    ],
    "code": "1910.252 / 1910.253",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.252(a)(1): move fire hazards, use guards, or don't weld",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(a)(2)(i): sparks through openings and cracks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(a)(2)(iii): fire watch, incl. 35-foot conditions and half hour after work",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(a)(2)(iv): area inspected and authorized, preferably by written permit",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(a)(2)(v), (a)(2)(vii): sweep floors and relocate combustibles 35 feet",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(a)(3)(i): used drums, barrels, tanks and containers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(b)(2)(i)-(ii): helmets, hand shields, goggles, filter lens shades",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(b)(2)(iii): protecting nearby workers from arc rays",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(c)(1)(iii), (c)(2)(i)(A)-(B): ventilation and when mechanical ventilation is required",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.253(b)(5)(ii)(I)-(J): cylinders away from sparks; no arc on a cylinder",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253",
        "kind": "standard"
      },
      {
        "label": "OSHA FactSheet: Controlling Hazardous Fume and Gases during Welding",
        "url": "https://www.osha.gov/Publications/OSHA_FS-3647_Welding.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Welding and Cutting in the Plant",
        "hook": "Welding sparks can slip through cracks and openings and land on something that burns. And the arc can hurt the eyes of people who aren't even welding.",
        "sections": [
          {
            "heading": "Before you strike an arc",
            "items": [
              "Hot work needs approval first. The person who authorizes it inspects the area and sets the precautions, often on a written hot work permit.",
              "Where you can, move anything that burns at least 35 feet away. If it can't move, cover or shield it. If the area can't be made safe, there's no welding.",
              "If there's combustible debris on the floor, sweep it clean for 35 feet around.",
              "Never weld or cut on a used drum, barrel or tank until it's been cleaned so nothing flammable or toxic is left inside."
            ]
          },
          {
            "heading": "Fire watch",
            "items": [
              "A fire watcher is assigned when a fire could be more than minor, like when combustible material is closer than 35 feet.",
              "The fire watch has an extinguisher ready, knows how to use it, and knows how to sound the alarm.",
              "The watch stays at least a half hour after the welding or cutting is done, to catch smoldering fires."
            ]
          },
          {
            "heading": "Cylinders and fumes",
            "items": [
              "Keep gas cylinders far enough away that sparks, slag or flame can't reach them, or put up a fire-resistant shield. Never strike an arc on a cylinder.",
              "Your company has to provide ventilation that keeps fumes below OSHA's exposure limits. For general welding, mechanical ventilation is required if there's less than 10,000 cubic feet of space per welder or the ceiling is under 16 feet.",
              "Position yourself so you're not breathing the fumes. Outdoors, stay upwind."
            ]
          },
          {
            "heading": "Protect your eyes and everyone else's",
            "items": [
              "Arc welding or cutting: helmet or hand shield with the right filter shade. Gas welding or oxygen cutting: goggles or other suitable eye protection.",
              "Helpers need proper eye protection too.",
              "People working near you have to be protected from the arc rays with flameproof screens or proper goggles. Put the screens up before you start."
            ]
          }
        ],
        "ask": "What's within 35 feet of today's weld that could catch fire, and who's on fire watch?"
      },
      "es": {
        "title": "Soldadura y corte en la planta",
        "hook": "Las chispas de soldadura se pueden colar por grietas y aberturas y caer en algo que se quema. Y el arco puede lastimar los ojos de gente que ni siquiera está soldando.",
        "sections": [
          {
            "heading": "Antes de prender el arco",
            "items": [
              "El trabajo en caliente necesita aprobación primero. La persona que lo autoriza revisa el área y dice qué precauciones tomar, muchas veces en un permiso de trabajo en caliente por escrito.",
              "Cuando se pueda, mueve todo lo que se queme a por lo menos 35 pies. Si no se puede mover, cúbrelo o protégelo. Si el área no se puede hacer segura, no se suelda.",
              "Si hay basura que se quema en el piso, barre bien 35 pies alrededor.",
              "Nunca sueldes ni cortes un tambo, barril o tanque usado hasta que esté limpio y no le quede nada inflamable ni tóxico adentro."
            ]
          },
          {
            "heading": "Vigilancia de incendios",
            "items": [
              "Se asigna un vigilante de incendios cuando un fuego podría ser más que menor, por ejemplo cuando hay material que se quema a menos de 35 pies.",
              "El vigilante tiene un extintor listo, sabe usarlo y sabe cómo dar la alarma.",
              "La vigilancia se queda por lo menos media hora después de terminar de soldar o cortar, para agarrar cualquier fuego que esté ardiendo sin llama."
            ]
          },
          {
            "heading": "Cilindros y humos",
            "items": [
              "Mantén los cilindros de gas lo bastante lejos para que las chispas, la escoria o la llama no los alcancen, o pon una pantalla resistente al fuego. Nunca prendas un arco sobre un cilindro.",
              "Tu compañía tiene que dar ventilación que mantenga los humos por debajo de los límites de exposición de OSHA. Para soldadura en general, se requiere ventilación mecánica si hay menos de 10,000 pies cúbicos de espacio por soldador o si el techo mide menos de 16 pies.",
              "Colócate de manera que no respires los humos. Afuera, ponte de modo que el viento sople desde tu espalda hacia la soldadura."
            ]
          },
          {
            "heading": "Protege tus ojos y los de los demás",
            "items": [
              "Soldadura o corte con arco: careta o pantalla de mano con el filtro del tono correcto. Soldadura con gas o corte con oxígeno: gafas u otra protección de ojos adecuada.",
              "Los ayudantes también necesitan protección de ojos adecuada.",
              "La gente que trabaja cerca tiene que estar protegida de los rayos del arco con mamparas a prueba de llama o gafas adecuadas. Pon las mamparas antes de empezar."
            ]
          }
        ],
        "ask": "¿Qué hay a menos de 35 pies de la soldadura de hoy que se pueda prender, y quién está de vigilante de incendios?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "gas-cylinders",
    "industries": [
      "mfg",
      "wh",
      "auto"
    ],
    "code": "1910.101 / 1910.253",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.101(a): employer determines cylinders are in safe condition by visual inspection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.101",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.253 (oxygen-fuel gas welding and cutting) (b)(2)(i)-(iv): storage away from heat, assigned places, valves closed on empties, caps in place",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.253(b)(3)(ii): acetylene cylinders stored valve end up",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.253(b)(4)(i), (b)(4)(iii): oxygen away from oil and grease; 20 feet from fuel gas or a 5-foot, half-hour fire-rated barrier",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.253(b)(5)(ii)(A)-(K): moving and handling cylinders",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.253(b)(5)(iii)(A)-(B): fuel gas valve end up in use; handle carefully",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253",
        "kind": "standard"
      },
      {
        "label": "OSHA interpretation, Safety of Compressed Gas Cylinders on Portable Carts (Nov. 18, 2021)",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2021-11-18",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Oxygen and Fuel-Gas Cylinders",
        "hook": "A gas cylinder looks tough, but rough handling, knocks or a fall can damage the cylinder, the valve or its safety devices and cause a leak. Today is about storing and moving oxygen and fuel-gas cylinders, like acetylene, the right way.",
        "sections": [
          {
            "heading": "Storing cylinders",
            "items": [
              "Acetylene is stored valve end up, and fuel gas stands valve end up whenever it's in use. An OSHA interpretation letter says these cylinders are to be upright or valve end up.",
              "Each cylinder goes in an assigned spot where it can't be knocked over, hit by passing or falling objects, or tampered with. Keep that spot away from elevators, stairs and walkways.",
              "Store them dry and ventilated, away from radiators and other heat. Never in a closed locker or cupboard. Inside a building, keep them at least 20 feet from highly combustible material like oil.",
              "Your company has to make sure cylinders are in safe condition, as far as a visual check can tell. If one looks damaged, report it."
            ]
          },
          {
            "heading": "Caps on, valves closed",
            "items": [
              "If the cylinder takes a valve cap, the cap stays on hand-tight unless the cylinder is in use or hooked up for use.",
              "Close the valve when work is finished, and close the valve on every empty cylinder."
            ]
          },
          {
            "heading": "Keep oxygen apart",
            "items": [
              "In storage, oxygen cylinders stay at least 20 feet from fuel gas cylinders and combustible materials.",
              "If you can't get 20 feet, there has to be a barrier at least 5 feet high with at least a half-hour fire rating between them.",
              "Keep oxygen away from oil and grease."
            ]
          },
          {
            "heading": "Moving cylinders",
            "items": [
              "Before you move one, close the valve. Unless it's secured on a special cylinder truck, also take off the regulator and put the cap on.",
              "Never drop a cylinder or let cylinders bang into each other. Never use one as a roller or a support, full or empty.",
              "Never lift a cylinder by its cap. With a crane, use a cradle or platform, never a sling or a magnet."
            ]
          }
        ],
        "ask": "Where are our cylinders stored right now, and is the oxygen 20 feet from the fuel gas or behind a barrier?"
      },
      "es": {
        "title": "Cilindros de oxígeno y de gas combustible",
        "hook": "Un cilindro de gas parece fuerte, pero el maltrato, los golpes o una caída pueden dañar el cilindro, la válvula o sus dispositivos de seguridad y causar una fuga. Hoy hablamos de cómo guardar y mover bien los cilindros de oxígeno y de gas combustible, como el acetileno.",
        "sections": [
          {
            "heading": "Cómo guardar los cilindros",
            "items": [
              "El acetileno se guarda con la válvula hacia arriba, y el gas combustible va con la válvula hacia arriba siempre que se está usando. Una carta de interpretación de OSHA dice que estos cilindros deben estar parados o con la válvula hacia arriba.",
              "Cada cilindro va en un lugar asignado donde no lo puedan tumbar, golpear con cosas que pasan o que caen, ni manipular. Ese lugar tiene que estar lejos de elevadores, escaleras y pasillos.",
              "Guárdalos en un lugar seco y ventilado, lejos de radiadores y de otras fuentes de calor. Nunca en un casillero o gabinete cerrado. Dentro de un edificio, mantenlos a por lo menos 20 pies de materiales muy combustibles como el aceite.",
              "Tu compañía tiene que asegurarse de que los cilindros estén en buenas condiciones, hasta donde se pueda ver a simple vista. Si uno se ve dañado, repórtalo."
            ]
          },
          {
            "heading": "Tapas puestas, válvulas cerradas",
            "items": [
              "Si el cilindro lleva tapa de válvula, la tapa se queda puesta y apretada a mano, a menos que el cilindro se esté usando o esté conectado para usarse.",
              "Cierra la válvula cuando termines el trabajo, y cierra la válvula de todo cilindro vacío."
            ]
          },
          {
            "heading": "El oxígeno va aparte",
            "items": [
              "En almacenamiento, los cilindros de oxígeno se quedan a por lo menos 20 pies de los cilindros de gas combustible y de materiales combustibles.",
              "Si no se pueden separar 20 pies, tiene que haber entre ellos una barrera de por lo menos 5 pies de alto con una resistencia al fuego de por lo menos media hora.",
              "Mantén el oxígeno lejos del aceite y la grasa."
            ]
          },
          {
            "heading": "Cómo mover los cilindros",
            "items": [
              "Antes de mover uno, cierra la válvula. A menos que esté asegurado en una carretilla especial para cilindros, también quita el regulador y ponle la tapa.",
              "Nunca dejes caer un cilindro ni dejes que los cilindros se golpeen entre sí. Nunca uses uno como rodillo ni como soporte, esté lleno o vacío.",
              "Nunca levantes un cilindro por la tapa. Con una grúa, usa una cuna o una plataforma, nunca una eslinga ni un imán."
            ]
          }
        ],
        "ask": "¿Dónde están guardados nuestros cilindros ahora mismo, y el oxígeno está a 20 pies del gas combustible o detrás de una barrera?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "cranes-hoists",
    "industries": [
      "mfg"
    ],
    "code": "1910.179 / 1910.184",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.179(a)(35), (b)(8): only designated personnel operate the crane",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.179",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.179(b)(5): rated load marked on each side",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.179",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.179(j)(2)(i), (iii), (iv): daily inspection of operating mechanisms, hooks and hoist chains",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.179",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.179(l)(3)(iii)(a): defective hooks discarded",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.179",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.179(n): handling the load, incl. (n)(1) rated load, (n)(3)(ii)(c), (iii)(a), (v), (vi), (x), (xi), (n)(4)(i)-(ii) limit switch; (i) warning signal",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.179",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.184(c): sling safe operating practices",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.184",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.184(d): daily sling inspection by a competent person",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.184",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Overhead Cranes and Hoists",
        "hook": "A load in the air is only as safe as the hook, the sling and the person at the controls. Here are the checks that keep it up there and keep people out from under it.",
        "sections": [
          {
            "heading": "Who runs it",
            "items": [
              "Only people your company has designated as qualified can operate the crane. If that's not you, don't touch the controls.",
              "The operator never leaves the controls while a load is hanging."
            ]
          },
          {
            "heading": "Check before you lift",
            "items": [
              "Hooks get a look every day for bends or cracks. A damaged hook comes out of service.",
              "Hoist chain and controls get a daily look too: wear, twists, bent links, or anything that doesn't work right.",
              "At the start of each operator's shift, the upper limit switch is tested with no load. Never use the limit switch as a normal stop.",
              "Every sling and its hardware is checked each day before use by a competent person. A damaged sling comes out of service right away."
            ]
          },
          {
            "heading": "Know the rated load",
            "items": [
              "The crane's rated load is marked on each side. Never load it past that.",
              "Same for slings: never go over the rated capacity on the tag. No tag, don't use it.",
              "Never shorten a sling with a knot or a bolt, and pad it against sharp edges."
            ]
          },
          {
            "heading": "Moving the load",
            "items": [
              "Everyone stays clear of a load about to be lifted and any load in the air. The operator avoids carrying loads over people, and nobody rides the load or the hook.",
              "Bring the hook right over the load so it won't swing. Lift smooth, with no sudden starts or stops.",
              "If the crane has a warning signal, sound it when you start the bridge and when the load or hook gets near or over people.",
              "Keep your hands out from between the sling and the load while it's being tightened."
            ]
          }
        ],
        "ask": "Where is the rated load marked on our crane, and what's the heaviest thing we lift with it?"
      },
      "es": {
        "title": "Grúas puente y polipastos",
        "hook": "Una carga en el aire es tan segura como el gancho, la eslinga y la persona en los controles. Estas son las revisiones que la mantienen arriba y que mantienen a la gente fuera de debajo de ella.",
        "sections": [
          {
            "heading": "Quién la maneja",
            "items": [
              "Solo las personas que tu compañía ha designado como calificadas pueden operar la grúa. Si no eres tú, no toques los controles.",
              "El operador nunca deja los controles mientras haya una carga colgando."
            ]
          },
          {
            "heading": "Revisa antes de levantar",
            "items": [
              "Los ganchos se revisan todos los días para ver si están doblados o agrietados. Un gancho dañado se saca de servicio.",
              "La cadena del polipasto y los controles también se revisan a diario: desgaste, torceduras, eslabones doblados o cualquier cosa que no funcione bien.",
              "Al empezar el turno de cada operador, se prueba el interruptor de límite superior sin carga. Nunca uses el interruptor de límite como parada normal.",
              "Cada eslinga y sus accesorios los revisa una persona competente todos los días antes de usarlos. Una eslinga dañada se saca de servicio de inmediato."
            ]
          },
          {
            "heading": "Conoce la carga nominal",
            "items": [
              "La carga nominal de la grúa está marcada en cada lado. Nunca la cargues más de eso.",
              "Lo mismo con las eslingas: nunca pases la capacidad nominal que dice la etiqueta. Sin etiqueta, no se usa.",
              "Nunca acortes una eslinga con un nudo o un perno, y protégela de los filos de la carga."
            ]
          },
          {
            "heading": "Mover la carga",
            "items": [
              "Todos se mantienen lejos de una carga que se va a levantar y de cualquier carga en el aire. El operador evita pasar cargas por encima de la gente, y nadie se sube a la carga ni al gancho.",
              "Pon el gancho justo encima de la carga para que no se columpie. Levanta suave, sin arrancones ni frenones.",
              "Si la grúa tiene señal de aviso, suénala cuando arranques el puente y cuando la carga o el gancho se acerque a la gente o pase por encima.",
              "Mantén las manos fuera de entre la eslinga y la carga mientras se está apretando."
            ]
          }
        ],
        "ask": "¿Dónde está marcada la carga nominal de nuestra grúa, y qué es lo más pesado que levantamos con ella?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "grinders",
    "industries": [
      "mfg",
      "auto"
    ],
    "code": "1910.215 / 1910.243(c)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.215(a)(1): abrasive wheels used only on guarded machines",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.215",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.215(a)(4): work rests, 1/8 inch maximum opening",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.215",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.215(b)(9): tongue guard adjustment, 1/4 inch maximum",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.215",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.215(d)(1)-(2): inspection, ring test, speed check, fit on spindle",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.215",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.243(c)(1), (c)(3), (c)(5): portable grinder guards and mounting",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.243",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.133(a)(1)-(2): eye protection with side protection for flying objects",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA 3080 Hand and Power Tools: portable abrasive wheel tools",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3080.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Grinder Safety",
        "hook": "A cracked grinding wheel can fly apart, and it can happen right at start-up. A few quick checks keep the wheel together and keep the pieces off you.",
        "sections": [
          {
            "heading": "Bench grinders: two gaps",
            "items": [
              "The tool rest holds your work. Keep it close to the wheel, with a gap of 1/8 inch or less. A bigger gap lets the work jam between the wheel and the rest, and that can break the wheel.",
              "Never adjust the rest while the wheel is turning. Clamp it tight after every adjustment.",
              "Now look at the tongue guard at the top of the opening. The gap between it and the wheel can never be more than 1/4 inch. As the wheel wears down, move the tongue guard in."
            ]
          },
          {
            "heading": "Before you mount a wheel",
            "items": [
              "Look the wheel over closely. Then ring test it: make sure it's dry and clean, and tap it gently with something light that isn't metal.",
              "A good wheel gives a clear ring. If it sounds dead or cracked, don't use it.",
              "Check the speed. The machine's spindle speed can't be more than the maximum speed marked on the wheel.",
              "The wheel has to fit freely on the spindle."
            ]
          },
          {
            "heading": "Portable grinders",
            "items": [
              "Portable grinding wheels need a guard, apart from a few small or special wheels. On a right-angle grinder, the guard goes between you and the wheel, set so pieces of a broken wheel get thrown away from you.",
              "Let the grinder come up to full speed before you touch the work. Don't stand in line with the wheel while it speeds up.",
              "Turn it off when you set it down. Never clamp a hand-held grinder in a vise."
            ]
          },
          {
            "heading": "Your eyes",
            "items": [
              "Grinding throws particles. Your company has to make sure you wear eye protection with side protection whenever things can fly.",
              "With any powered grinder, always wear eye or face protection."
            ]
          }
        ],
        "ask": "Who can show us how to check the tool rest gap and the tongue guard gap on our bench grinder?"
      },
      "es": {
        "title": "Seguridad con esmeriles",
        "hook": "Un disco de esmeril rajado puede reventar, y puede pasar justo al arrancar. Unas revisiones rápidas mantienen el disco entero y los pedazos lejos de ti.",
        "sections": [
          {
            "heading": "Esmeril de banco: dos espacios",
            "items": [
              "El apoyo de herramienta sostiene tu pieza. Mantenlo cerca del disco, con un espacio de 1/8 de pulgada o menos. Si el espacio es más grande, la pieza se puede atorar entre el disco y el apoyo, y eso puede romper el disco.",
              "Nunca ajustes el apoyo mientras el disco está girando. Apriétalo bien después de cada ajuste.",
              "Ahora mira la lengüeta de protección arriba de la abertura. El espacio entre ella y el disco nunca puede ser de más de 1/4 de pulgada. Cuando el disco se gaste, acerca la lengüeta."
            ]
          },
          {
            "heading": "Antes de montar un disco",
            "items": [
              "Revisa bien el disco. Luego hazle la prueba de sonido: que esté seco y limpio, y golpéalo suavemente con algo ligero que no sea de metal.",
              "Un disco bueno suena claro, como campana. Si suena apagado o rajado, no lo uses.",
              "Revisa la velocidad. La velocidad del eje de la máquina no puede pasar la velocidad máxima marcada en el disco.",
              "El disco tiene que entrar libremente en el eje."
            ]
          },
          {
            "heading": "Esmeriles portátiles",
            "items": [
              "Los discos de esmeril portátil necesitan guarda, salvo algunos discos pequeños o especiales. En un esmeril de ángulo recto, la guarda va entre tú y el disco, colocada para que los pedazos de un disco roto salgan lejos de ti.",
              "Deja que el esmeril llegue a toda su velocidad antes de tocar la pieza. No te pongas en línea con el disco mientras agarra velocidad.",
              "Apágalo cuando lo dejes. Nunca prenses un esmeril de mano en una prensa de banco."
            ]
          },
          {
            "heading": "Tus ojos",
            "items": [
              "Esmerilar avienta partículas. Tu compañía tiene que asegurarse de que uses protección para los ojos con protección lateral siempre que puedan volar cosas.",
              "Con cualquier esmeril eléctrico, usa siempre protección para los ojos o la cara."
            ]
          }
        ],
        "ask": "¿Quién nos puede enseñar cómo revisar el espacio del apoyo y el de la lengüeta en nuestro esmeril de banco?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "eyewash",
    "industries": [
      "mfg",
      "wh",
      "auto",
      "facil"
    ],
    "code": "1910.133 / 1910.151(c)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.133(a)(1): when eye or face protection is required",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.133(a)(2): side protection from flying objects",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.133(a)(3): prescription lenses",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.133(a)(4), (b)(1)-(2): manufacturer marking; ANSI Z87.1 consensus standards or equally effective",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.151(c): facilities for quick drenching or flushing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151",
        "kind": "standard"
      },
      {
        "label": "OSHA Eye and Face Protection",
        "url": "https://www.osha.gov/eye-face-protection",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3151 Personal Protective Equipment: eye and face protection",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3151.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA letter of interpretation, April 18, 1997: eyewash immediately available (1910.151(c))",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1997-04-18",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Pocket Guide to Chemical Hazards: first aid, eye (irrigate immediately)",
        "url": "https://www.cdc.gov/niosh/npg/firstaid.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Eye Protection and Eyewash",
        "hook": "OSHA says thousands of people are blinded each year by work eye injuries that the right eye protection, used the right way, could have prevented. If a chemical gets in anyway, you flush right away.",
        "sections": [
          {
            "heading": "When you need it",
            "items": [
              "Your company has to make sure you wear eye or face protection when you're exposed to flying particles, molten metal, liquid chemicals, acids or caustics, chemical gases or vapors, or harmful light.",
              "If something can fly at you, you need side protection. Clip-on or slide-on side shields are OK if they meet the standard.",
              "Eye protection has to meet one of the ANSI Z87.1 standards OSHA lists, or be shown to protect just as well. It has to be marked so you can tell who made it."
            ]
          },
          {
            "heading": "Glasses, goggles, face shields",
            "items": [
              "Regular prescription glasses don't give you enough protection. Wear safety glasses made with your prescription, or eye protection that fits over your glasses without pushing them out of place.",
              "Goggles fit tight around your eyes. They protect against impact, dust and splashes.",
              "A face shield alone won't protect you from impact. Wear safety glasses or goggles under it."
            ]
          },
          {
            "heading": "Where eyewash is required",
            "items": [
              "Where corrosive materials could get in someone's eyes or on their body, your company has to provide a way to quickly drench or flush the eyes and body. It has to be in the work area, ready for emergency use.",
              "It only helps if you can reach it right away. Know where the nearest one is, and keep the way to it clear."
            ]
          },
          {
            "heading": "If something gets in your eyes",
            "items": [
              "Get to the eyewash right away. Wash your eyes with a lot of water.",
              "Every so often, lift your upper and lower eyelids so the water gets everywhere.",
              "Get medical attention right away."
            ]
          }
        ],
        "ask": "Where is the nearest eyewash from where you're working today? Point to it."
      },
      "es": {
        "title": "Protección para los ojos y lavaojos",
        "hook": "OSHA dice que miles de personas quedan ciegas cada año por lesiones de ojos en el trabajo que la protección correcta, bien usada, pudo haber evitado. Si aun así te cae un químico, enjuágate de inmediato.",
        "sections": [
          {
            "heading": "Cuándo la necesitas",
            "items": [
              "Tu compañía tiene que asegurarse de que uses protección para los ojos o la cara cuando estés expuesto a partículas que vuelan, metal derretido, químicos líquidos, ácidos o cáusticos, gases o vapores químicos, o luz dañina.",
              "Si algo te puede volar encima, necesitas protección lateral. Los protectores laterales de clip o deslizables están bien si llenan los requisitos de la norma.",
              "La protección para los ojos tiene que llenar los requisitos de una de las normas ANSI Z87.1 que OSHA nombra, o demostrar que protege igual de bien. Tiene que estar marcada para saber quién la fabricó."
            ]
          },
          {
            "heading": "Lentes, gafas y caretas",
            "items": [
              "Los lentes de receta normales no te protegen lo suficiente. Usa lentes de seguridad hechos con tu receta, o protección que te quede encima de tus lentes sin moverlos de su lugar.",
              "Las gafas de seguridad quedan apretadas alrededor de los ojos. Protegen contra golpes, polvo y salpicaduras.",
              "Una careta sola no te protege de los golpes. Usa lentes de seguridad o gafas debajo."
            ]
          },
          {
            "heading": "Dónde se requiere lavaojos",
            "items": [
              "Donde materiales corrosivos le puedan caer a alguien en los ojos o en el cuerpo, tu compañía tiene que poner algo para mojar o enjuagar rápido los ojos y el cuerpo. Tiene que estar en el área de trabajo, listo para una emergencia.",
              "Solo sirve si llegas a él de inmediato. Debes saber dónde está el más cercano, y mantener despejado el camino hacia él."
            ]
          },
          {
            "heading": "Si algo te cae en los ojos",
            "items": [
              "Ve al lavaojos de inmediato. Lávate los ojos con mucha agua.",
              "De vez en cuando, levanta los párpados de arriba y de abajo para que el agua llegue a todas partes.",
              "Busca atención médica de inmediato."
            ]
          }
        ],
        "ask": "¿Dónde está el lavaojos más cercano a donde vas a trabajar hoy? Señálalo."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "compressed-air",
    "industries": [
      "mfg",
      "auto"
    ],
    "code": "1910.242(b)",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1910.242(b): compressed air used for cleaning",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.242",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.133(a)(1)-(2): eye protection for flying particles",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA Instruction STD 01-13-001: reduction of air pressure below 30 psi for cleaning (dead-ending, chip guarding)",
        "url": "https://www.osha.gov/enforcement/directives/std-01-13-001",
        "kind": "guidance"
      },
      {
        "label": "OSHA letter of interpretation, Dec. 6, 1985: 1910.242(b) relief devices and PPE",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1985-12-06",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3080 Hand and Power Tools: pneumatic tools",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3080.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Compressed Air for Cleaning",
        "hook": "Blowing off a bench or a part looks harmless. But that air can drive a chip into your eye or your skin, or into the person next to you.",
        "sections": [
          {
            "heading": "The rule",
            "items": [
              "Compressed air can't be used for cleaning unless the pressure is cut to less than 30 psi.",
              "Even then, you need effective chip guarding and the right protective equipment.",
              "Under 30 psi means at the nozzle. Even if the tip is blocked or pressed against something, it still can't go over 30 psi."
            ]
          },
          {
            "heading": "Chip guarding and eye protection",
            "items": [
              "Chip guarding means anything that stops a chip or particle, of any size, from blowing into your eyes or skin, or anyone else's.",
              "A guard nozzle can protect you, the operator. People working nearby may need barriers, baffles or screens.",
              "Flying particles are an eye hazard. Wear your eye protection, with side protection, every time you blow something off."
            ]
          },
          {
            "heading": "Never at people",
            "items": [
              "Never point an air gun at anyone. Not as a joke, not for a second.",
              "Never dead-end it against yourself or anyone else. That means pressing the tip against your body or someone else's."
            ]
          },
          {
            "heading": "Hoses",
            "items": [
              "Air tools need to be fastened securely to the hose so they can't come loose.",
              "If a tool takes an attachment, like a chisel on a chipping hammer, it needs a safety clip or retainer so the attachment can't shoot out.",
              "Treat an air hose like an electric cord. It can get damaged or hit, and it's a trip hazard."
            ]
          }
        ],
        "ask": "Where do we use air for cleaning in this area, and how do you know that nozzle stays under 30 psi?"
      },
      "es": {
        "title": "Aire comprimido para limpiar",
        "hook": "Sopletear un banco o una pieza parece inofensivo. Pero ese aire puede meterte una rebaba en el ojo o en la piel, o a la persona de al lado.",
        "sections": [
          {
            "heading": "La regla",
            "items": [
              "No se puede usar aire comprimido para limpiar a menos que la presión esté bajada a menos de 30 psi.",
              "Aun así, necesitas una protección efectiva contra rebabas y el equipo de protección correcto.",
              "Menos de 30 psi quiere decir en la boquilla. Aunque la punta esté tapada o pegada contra algo, la presión no puede pasar de 30 psi."
            ]
          },
          {
            "heading": "Protección contra rebabas y para los ojos",
            "items": [
              "La protección contra rebabas es cualquier cosa que evite que una rebaba o partícula, de cualquier tamaño, te salga volando a los ojos o la piel, o a los de otra persona.",
              "Una boquilla con protector te puede proteger a ti, el que la usa. La gente que trabaja cerca puede necesitar barreras, deflectores o mamparas.",
              "Las partículas que vuelan son un peligro para los ojos. Usa tu protección para los ojos, con protección lateral, cada vez que sopletees algo."
            ]
          },
          {
            "heading": "Nunca a las personas",
            "items": [
              "Nunca le apuntes a nadie con una pistola de aire. Ni de broma, ni por un segundo.",
              "Nunca la pegues contra ti ni contra nadie. O sea, nunca pongas la punta pegada a tu cuerpo ni al de otra persona."
            ]
          },
          {
            "heading": "Mangueras",
            "items": [
              "Las herramientas de aire tienen que estar bien sujetas a la manguera para que no se suelten.",
              "Si una herramienta lleva un accesorio, como el cincel de un martillo cincelador, necesita un clip de seguridad o retenedor para que el accesorio no salga disparado.",
              "Trata la manguera de aire como un cable eléctrico. Se puede dañar o golpear, y te puedes tropezar con ella."
            ]
          }
        ],
        "ask": "¿Dónde usamos aire para limpiar en esta área, y cómo sabes que esa boquilla se queda por debajo de 30 psi?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "electrical-gi",
    "industries": [
      "mfg",
      "wh",
      "facil",
      "retail",
      "food",
      "health",
      "auto"
    ],
    "code": "1910.333 / 1910.303(g)(1)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.333(a)(1): deenergize live parts before work",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(2)(ii)(B), (b)(2)(iii)(A), (C)-(D), (b)(2)(iv)(B): disconnect, lock and tag, verify deenergized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(c)(2), (c)(4): only qualified persons on energized parts; no blind reaching",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.332(a), (b)(1)-(3): training for qualified and unqualified persons",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.332",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.334(a)(1), (a)(2), (a)(5), (b)(2): cord handling, inspection, defective equipment, reclosing circuits",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.334",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.303(g)(1)(i)-(ii) and Table S-1: working space, no storage",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.303",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.305(g)(1)(iv): uses of flexible cords not permitted",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.305",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Electrical Safety in the Plant",
        "hook": "Most electrical work is only safe with the power off and locked. If you're not qualified, live parts are not your job.",
        "sections": [
          {
            "heading": "Qualified people only",
            "items": [
              "Only qualified people may work on electrical parts that haven't been shut off. Qualified means trained to tell live parts from other parts, find the voltage, and know the safe distances.",
              "Your company has to train everyone who faces a shock risk in the safe practices for their own job. If you're not sure what yours are, ask.",
              "Don't reach blindly into a space that might have live parts. Don't go in where you can't see well enough to work safely."
            ]
          },
          {
            "heading": "Shut it off and lock it out",
            "items": [
              "Live parts you could touch get shut off before anyone works on or near them. There are only limited exceptions.",
              "Disconnect the equipment from every energy source. A push button or an interlock is not enough by itself.",
              "Put a lock and a tag on each disconnect used to shut it off. A tag without a lock is allowed only in limited cases, with an extra safety step.",
              "Before work starts, a qualified person uses a tester to make sure the parts are dead."
            ]
          },
          {
            "heading": "Cords and plugs",
            "items": [
              "Look over cords and cord-connected tools before use on every shift. Look for outside damage, and for signs of damage inside, like a crushed jacket.",
              "If it's damaged, take it out of service. Nobody uses it until it's repaired and tested.",
              "Don't use a cord in place of permanent wiring. Don't run cords through holes in walls, ceilings or floors, or through doorways and windows.",
              "Don't lift or lower equipment by its cord. Keep your hands dry when you plug or unplug."
            ]
          },
          {
            "heading": "Panels and breakers",
            "items": [
              "The space in front of electrical panels and equipment is working space. It can't be used for storage. Keep it clear.",
              "That space is at least 30 inches wide, or the width of the equipment if that's wider, and usually at least 3 feet deep. Some higher-voltage equipment needs more.",
              "Don't keep resetting a tripped breaker or swapping fuses. Generally it stays off until someone has checked that it's safe to turn back on."
            ]
          }
        ],
        "ask": "Where's the nearest electrical panel to your work area, and is the space in front of it clear right now?"
      },
      "es": {
        "title": "Seguridad eléctrica en la planta",
        "hook": "Casi todo trabajo eléctrico solo es seguro con la corriente apagada y con candado. Si no eres calificado, las partes energizadas no son tu trabajo.",
        "sections": [
          {
            "heading": "Solo personas calificadas",
            "items": [
              "Solo las personas calificadas pueden trabajar en partes eléctricas que no se han apagado. Calificado quiere decir entrenado para distinguir las partes energizadas de las demás, saber el voltaje y conocer las distancias seguras.",
              "Tu compañía tiene que entrenar a todos los que corren riesgo de choque eléctrico en las prácticas seguras de su propio trabajo. Si no estás seguro de cuáles son las tuyas, pregunta.",
              "No metas la mano a ciegas en un espacio que pueda tener partes energizadas. No entres donde no ves lo suficiente para trabajar seguro."
            ]
          },
          {
            "heading": "Apágalo y ponle candado",
            "items": [
              "Las partes energizadas que puedas tocar se apagan antes de que alguien trabaje en ellas o cerca de ellas. Solo hay unas pocas excepciones.",
              "Desconecta el equipo de todas sus fuentes de energía. Un botón o un interruptor de seguridad no es suficiente por sí solo.",
              "Pon un candado y una etiqueta en cada desconectador que se usó para apagarlo. Una etiqueta sin candado solo se permite en casos limitados, con una medida de seguridad extra.",
              "Antes de empezar, una persona calificada usa un probador para confirmar que las partes están sin corriente."
            ]
          },
          {
            "heading": "Cables y enchufes",
            "items": [
              "Revisa los cables y las herramientas con cable antes de usarlos en cada turno. Busca daños por fuera, y señales de daño por dentro, como un forro aplastado.",
              "Si está dañado, sácalo de servicio. Nadie lo usa hasta que lo reparen y lo prueben.",
              "No uses un cable en lugar de la instalación eléctrica fija. No pases cables por hoyos en paredes, techos o pisos, ni por puertas o ventanas.",
              "No subas ni bajes equipo jalándolo del cable. Ten las manos secas cuando conectes o desconectes."
            ]
          },
          {
            "heading": "Tableros y breakers",
            "items": [
              "El espacio enfrente de los tableros y equipos eléctricos es espacio de trabajo. No se puede usar para guardar cosas. Mantenlo despejado.",
              "Ese espacio mide por lo menos 30 pulgadas de ancho, o el ancho del equipo si es más ancho, y normalmente por lo menos 3 pies de fondo. Algunos equipos de más voltaje necesitan más.",
              "No sigas reiniciando un breaker que se botó ni cambiando fusibles. Por lo general se queda apagado hasta que alguien revise que es seguro volver a prenderlo."
            ]
          }
        ],
        "ask": "¿Dónde está el tablero eléctrico más cercano a tu área de trabajo, y está despejado el espacio enfrente ahorita?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "combustible-dust",
    "industries": [
      "mfg"
    ],
    "code": "1910.22(a) / OSH Act 5(a)(1)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.22(a)(1): workplaces kept clean and orderly",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22",
        "kind": "standard"
      },
      {
        "label": "OSHA Combustible Dust: Standards (no single standard; General Duty Clause)",
        "url": "https://www.osha.gov/combustible-dust/standards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Combustible Dust overview",
        "url": "https://www.osha.gov/combustible-dust",
        "kind": "guidance"
      },
      {
        "label": "OSHA FS 3791: Hazard Alert, Combustible Dust Explosions",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3791.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA FS 3878: Protecting Workers from Combustible Dust Explosion Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3878.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Combustible Dust Explosions poster",
        "url": "https://www.osha.gov/sites/default/files/publications/COMBUSTIBLEDUSTPOSTER.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA SHIB 07-31-2005: Combustible Dust in Industry",
        "url": "https://www.osha.gov/sites/default/files/publications/shib073105.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA CPL 03-00-008: Combustible Dust National Emphasis Program (compressed air cleaning)",
        "url": "https://www.osha.gov/sites/default/files/enforcement/directives/CPL_03-00-008.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Combustible Dust",
        "hook": "Fine dust from wood, flour, sugar, plastic or metal can burn fast. Put enough of it in the air, in a closed-in space, near a spark or heat, and it can explode.",
        "sections": [
          {
            "heading": "What it is",
            "items": [
              "Combustible dust is fine particles that can explode when they hang in the air. Wood, grain, flour, sugar, plastics, coal, and metals like aluminum and magnesium can all do it.",
              "It takes five things: the dust, a spark or heat, oxygen in the air, the dust stirred up into a cloud, and a closed-in space. Take away any one and it can't explode.",
              "The first blast is often not the worst. It shakes loose dust that settled on beams and ledges, and that dust can feed a second explosion that is far more destructive."
            ]
          },
          {
            "heading": "Keep it clean",
            "items": [
              "Settled dust is fuel. Clean work areas, overhead surfaces and hidden spaces often and thoroughly.",
              "Clean in a way that doesn't make a dust cloud: vacuum, sweep, or wash down. Only use vacuums approved for dust collection.",
              "Don't blow dust off with compressed air unless your supervisor says it's allowed for that dust. It's only OK for some dusts, with strict spark control, air pressure under 30 psi, and proper guarding and PPE."
            ]
          },
          {
            "heading": "Control sparks and heat",
            "items": [
              "Welding torches and other hot work can set dust off. Follow the hot work permit and the posted smoking rules.",
              "Keep dust away from hot surfaces, and watch for sparks from friction and metal parts.",
              "Grounding and bonding control static electricity. If you see a ground wire loose or cut, report it.",
              "Electrical equipment in dust areas has to be the right type for that location."
            ]
          },
          {
            "heading": "Speak up",
            "items": [
              "See dust building up, a leaking duct or collector, or a missing safeguard? Tell your supervisor right away.",
              "Know the emergency plan and your way out.",
              "There's no single OSHA rule just for combustible dust. Housekeeping and other rules cover parts of it, and your company still has to keep the workplace free of recognized serious hazards."
            ]
          }
        ],
        "ask": "Where does dust build up in our area, including up high, and when was it last cleaned?"
      },
      "es": {
        "title": "Polvo combustible",
        "hook": "El polvo fino de madera, harina, azúcar, plástico o metal puede quemarse muy rápido. Si hay suficiente en el aire, en un espacio cerrado, cerca de una chispa o de calor, puede explotar.",
        "sections": [
          {
            "heading": "Qué es",
            "items": [
              "El polvo combustible son partículas finas que pueden explotar cuando quedan flotando en el aire. La madera, el grano, la harina, el azúcar, los plásticos, el carbón y metales como el aluminio y el magnesio pueden hacerlo.",
              "Se necesitan cinco cosas: el polvo, una chispa o calor, el oxígeno del aire, el polvo levantado en una nube y un espacio cerrado. Si quitas cualquiera de ellas, no puede explotar.",
              "Muchas veces la primera explosión no es la peor. Sacude el polvo que se asentó en vigas y repisas, y ese polvo puede alimentar una segunda explosión mucho más destructiva."
            ]
          },
          {
            "heading": "Mantenlo limpio",
            "items": [
              "El polvo asentado es combustible. Limpia las áreas de trabajo, las superficies altas y los espacios escondidos seguido y a fondo.",
              "Limpia de una forma que no levante una nube de polvo: aspira, barre o lava con agua. Usa solo aspiradoras aprobadas para recoger polvo.",
              "No soples el polvo con aire comprimido a menos que tu supervisor diga que está permitido para ese polvo. Solo se permite para algunos polvos, con control estricto de chispas, presión de aire menor a 30 psi, y la protección y el equipo de protección personal adecuados."
            ]
          },
          {
            "heading": "Controla las chispas y el calor",
            "items": [
              "Los sopletes de soldar y otros trabajos en caliente pueden encender el polvo. Sigue el permiso de trabajo en caliente y las reglas que están publicadas sobre dónde se puede fumar.",
              "Mantén el polvo lejos de las superficies calientes, y ten cuidado con las chispas por fricción y por piezas de metal.",
              "La conexión a tierra y la unión eléctrica controlan la electricidad estática. Si ves un cable de tierra suelto o cortado, repórtalo.",
              "El equipo eléctrico en las áreas con polvo tiene que ser del tipo correcto para ese lugar."
            ]
          },
          {
            "heading": "Habla",
            "items": [
              "¿Ves polvo acumulándose, un ducto o colector con fugas, o falta alguna protección? Avísale a tu supervisor de inmediato.",
              "Conoce el plan de emergencia y tu ruta de salida.",
              "No hay una sola regla de OSHA solo para el polvo combustible. Las reglas de limpieza y otras cubren partes del tema, y tu compañía de todas formas tiene que mantener el lugar de trabajo libre de peligros graves conocidos."
            ]
          }
        ],
        "ask": "¿Dónde se acumula el polvo en nuestra área, incluso en lo alto, y cuándo se limpió por última vez?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "tractor-rops",
    "industries": [
      "ag"
    ],
    "code": "1928.51 / 1928 Subpart C App. A",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1928.51(b)(1): ROPS for tractors built after Oct. 25, 1976",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.51(b)(2): seatbelts; (b)(5) exempted uses",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.51(d): operating instructions, initially and annually",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.51",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928 Subpart C Appendix A: Employee Operating Instructions",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928SubpartCAppA",
        "kind": "standard"
      },
      {
        "label": "OSHA Agricultural Operations: Hazards (tractors, rollovers)",
        "url": "https://www.osha.gov/agricultural-operations/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Tractor Rollovers and Seat Belts",
        "hook": "A tractor can roll on a slope, a ditch bank or a fast turn. The rollover bar only protects you if the seat belt keeps you inside it.",
        "sections": [
          {
            "heading": "ROPS and the belt",
            "items": [
              "Tractors over 20 horsepower built after October 25, 1976 need a rollover protective structure, called a ROPS, when an employee runs them. Your company has to provide it.",
              "If the tractor has a ROPS, buckle up every time. Your company has to make sure you wear the belt while the tractor is moving, snug enough to keep you in the protected area.",
              "Some low-profile tractors, while used in orchards, vineyards or low farm buildings, and tractors while used with mounted equipment that can't take a ROPS, can be exempt. Ask if you're not sure about yours.",
              "Your company has to go over these tractor rules with you when you start and at least once a year."
            ]
          },
          {
            "heading": "Slopes, ditches and turns",
            "items": [
              "Where you can, stay away from ditches, embankments and holes.",
              "Slow down when turning, crossing slopes, and on rough, slick or muddy ground. Stay off slopes too steep to run safely.",
              "Harvesting equipment changes how the tractor balances. On slopes, set the wheels as wide apart as they go, and plan steep runs so you travel downhill.",
              "Drive smooth: no jerky turns, starts or stops. Watch where you're going, especially at row ends, on roads and around trees."
            ]
          },
          {
            "heading": "No riders, safe hitching",
            "items": [
              "Don't let anyone ride on the tractor with you.",
              "Hitch only to the drawbar and the hitch points the tractor maker recommends. Never tow an implement that's hitched wrong.",
              "When you stop, set the brakes and use the park lock if it has one."
            ]
          }
        ],
        "ask": "Which slopes and ditch banks on our ground are the riskiest, and how will you handle them today?"
      },
      "es": {
        "title": "Volcaduras de tractor y cinturones de seguridad",
        "hook": "Un tractor se puede volcar en una pendiente, en la orilla de una zanja o en una vuelta rápida. La barra antivuelco solo te protege si el cinturón te mantiene dentro de ella.",
        "sections": [
          {
            "heading": "La ROPS y el cinturón",
            "items": [
              "Los tractores de más de 20 caballos de fuerza fabricados después del 25 de octubre de 1976 necesitan una estructura de protección antivuelco, llamada ROPS, cuando los maneja un empleado. Tu compañía tiene que proporcionarla.",
              "Si el tractor tiene ROPS, abróchate el cinturón siempre. Tu compañía tiene que asegurarse de que uses el cinturón mientras el tractor se mueve, bien ajustado para mantenerte en el área protegida.",
              "Algunos tractores de perfil bajo, mientras se usan en huertos, viñedos o edificios bajos de la granja, y los tractores mientras se usan con equipo montado que no permite una ROPS, pueden estar exentos. Pregunta si no estás seguro del tuyo.",
              "Tu compañía tiene que repasar estas reglas del tractor contigo cuando empiezas y por lo menos una vez al año."
            ]
          },
          {
            "heading": "Pendientes, zanjas y vueltas",
            "items": [
              "Cuando se pueda, mantente lejos de zanjas, terraplenes y hoyos.",
              "Baja la velocidad al dar vuelta, al cruzar pendientes y en terreno disparejo, resbaloso o con lodo. No entres en pendientes demasiado empinadas para trabajar con seguridad.",
              "El equipo de cosecha cambia el balance del tractor. En pendientes, abre las ruedas lo más que se pueda, y planea las pasadas empinadas para ir cuesta abajo.",
              "Maneja con suavidad: sin vueltas, arranques ni frenazos bruscos. Fíjate por dónde vas, sobre todo al final de los surcos, en los caminos y cerca de los árboles."
            ]
          },
          {
            "heading": "Nadie de pasajero, enganche seguro",
            "items": [
              "No dejes que nadie se suba al tractor contigo.",
              "Engancha solo a la barra de tiro y a los puntos de enganche que recomienda el fabricante del tractor. Nunca remolques un implemento mal enganchado.",
              "Cuando te detengas, pon bien los frenos y usa el seguro de estacionamiento si lo tiene."
            ]
          }
        ],
        "ask": "¿Cuáles son las pendientes y orillas de zanja más peligrosas en nuestro terreno, y cómo las vas a manejar hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "pto",
    "industries": [
      "ag"
    ],
    "code": "1928.57",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1928.57(a)(6): operating instructions, initially and annually",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.57",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.57(b)(1): power take-off guarding, farm field equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.57",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.57(b)(4)(ii): parts that keep rotating after power is off",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.57",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.57(c)(1): power take-off guarding, farmstead equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.57",
        "kind": "standard"
      },
      {
        "label": "OSHA Agricultural Operations: Hazards (PTO shafts, machinery)",
        "url": "https://www.osha.gov/agricultural-operations/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "PTO Shafts and Machine Guards",
        "hook": "A spinning PTO shaft can catch a loose sleeve or a string and pull you into the shaft. That often means losing a limb, or your life.",
        "sections": [
          {
            "heading": "Guards stay on",
            "items": [
              "Every PTO shaft, rear, mid or side, has to be guarded. Tractors need a master shield over the rear PTO.",
              "Keep all guards in place while the machine runs. Damaged or missing shields should be replaced.",
              "If an implement needs the master shield off, the implement has to cover the part of the shaft sticking out of the tractor.",
              "Even with guards, be careful around a PTO shaft that's hooked up."
            ]
          },
          {
            "heading": "Shut it down first",
            "items": [
              "Before you service, adjust, clean or unclog anything: stop the engine, disconnect the power, and wait for all movement to stop. On farmstead equipment, lock out the electrical power.",
              "If a job truly needs the machine running, your company has to show you every step to do it safely first.",
              "Some parts keep spinning after the power is off. Look and listen, and don't open a guard until everything has stopped.",
              "Stop the PTO before you climb off the tractor."
            ]
          },
          {
            "heading": "Dress for it, and clear the area",
            "items": [
              "No loose clothing, strings or loose ends around a running machine. Tie back long hair.",
              "Make sure everyone is clear before you start the engine, engage the power, or run the machine.",
              "No riders on farm field equipment, except someone needed to teach or help run it.",
              "Your company has to go over these rules with you when you start and at least once a year."
            ]
          }
        ],
        "ask": "Pick one machine we run today: where are its guards, and how do you shut it all the way down?"
      },
      "es": {
        "title": "Ejes de toma de fuerza (PTO) y protecciones de máquinas",
        "hook": "Un eje de toma de fuerza que está girando puede agarrar una manga suelta o un cordón y jalarte hacia el eje. Muchas veces eso significa perder un brazo o una pierna, o la vida.",
        "sections": [
          {
            "heading": "Las protecciones se quedan puestas",
            "items": [
              "Todo eje de toma de fuerza, ya sea trasero, central o lateral, tiene que tener protección. Los tractores necesitan un escudo maestro sobre la toma de fuerza trasera.",
              "Mantén todas las protecciones en su lugar mientras la máquina trabaja. Los escudos dañados o que faltan se deben reemplazar.",
              "Si un implemento necesita que se quite el escudo maestro, el implemento tiene que cubrir la parte del eje que sale del tractor.",
              "Aun con protecciones, ten cuidado cerca de un eje de toma de fuerza que está conectado."
            ]
          },
          {
            "heading": "Primero apágala",
            "items": [
              "Antes de dar servicio, ajustar, limpiar o destapar algo: apaga el motor, desconecta la fuerza y espera a que todo deje de moverse. En el equipo fijo de la granja, bloquea la corriente eléctrica.",
              "Si un trabajo de verdad necesita la máquina encendida, tu compañía tiene que enseñarte primero cada paso para hacerlo con seguridad.",
              "Algunas partes siguen girando después de cortar la fuerza. Mira y escucha, y no abras una protección hasta que todo se haya detenido.",
              "Detén la toma de fuerza antes de bajarte del tractor."
            ]
          },
          {
            "heading": "Vístete para esto y despeja el área",
            "items": [
              "Nada de ropa suelta, cordones ni puntas sueltas cerca de una máquina encendida. Amárrate el pelo largo.",
              "Asegúrate de que todos estén lejos antes de arrancar el motor, conectar la fuerza o usar la máquina.",
              "Nadie se sube de pasajero al equipo de campo, excepto alguien que se necesite para enseñar o ayudar a operarlo.",
              "Tu compañía tiene que repasar estas reglas contigo cuando empiezas y por lo menos una vez al año."
            ]
          }
        ],
        "ask": "Escojan una máquina que usamos hoy: ¿dónde están sus protecciones y cómo se apaga por completo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "grain-bins",
    "industries": [
      "ag"
    ],
    "code": "1910.272(g)",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.272(b)(1): which grain handling facilities are covered",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.272",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.272(g)(1)(ii), (g)(1)(iii), (g)(1)(iv): lockout, air testing, no walking down grain",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.272",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.272(g)(2)-(g)(6): harness and lifeline, observer, rescue equipment, bridging",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.272",
        "kind": "standard"
      },
      {
        "label": "OSHA interpretation, July 29, 1991: 1910.272 and farms",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1991-07-29-0",
        "kind": "guidance"
      },
      {
        "label": "OSHA Grain Handling",
        "url": "https://www.osha.gov/grain-handling",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hazard Alert: Dangers of Engulfment and Suffocation in Grain Bins",
        "url": "https://www.osha.gov/sites/default/files/publications/hazard-alert_grain_bins.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3329 wallet card: Entering grain storage bins is extremely dangerous",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA_3329.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Agricultural Operations: Hazards (grain bins and silos)",
        "url": "https://www.osha.gov/agricultural-operations/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Grain Bins and Engulfment",
        "hook": "Moving grain acts like quicksand. OSHA cites an estimate that grain can cover a 6-foot worker in 11 seconds, and after the first 5 seconds they can't get free on their own.",
        "sections": [
          {
            "heading": "How bins kill",
            "items": [
              "Suffocation is a leading cause of death in grain storage bins.",
              "Pulling grain out of a bin while someone is inside creates a suction that drags them under fast.",
              "Bridged grain clumps together from moisture or mold and leaves an empty space underneath. It can cave in under you without warning. Grain built up on the walls can also fall and bury you."
            ]
          },
          {
            "heading": "Before anyone goes in",
            "items": [
              "Stay out of the bin if at all possible. If entry can't be avoided, everything here gets done first.",
              "Never go in while grain is being unloaded. Turn off and lock out all powered equipment, especially the augers. Once an auger starts, you may have only 2 to 3 seconds to react.",
              "Test the air for enough oxygen and for toxic or flammable gas.",
              "Check the entry permit to see that every precaution is in place."
            ]
          },
          {
            "heading": "Inside the bin",
            "items": [
              "If you go in from at or above the level of the grain, or stand on grain deep enough to bury you, your company has to give you a body harness with a lifeline, or a boatswain's chair. The lifeline is set so you can't sink past your waist.",
              "An observer stays outside, trained in rescue, with rescue equipment ready, and stays in contact with you the whole time.",
              "Never walk down grain or stand on moving grain to get it to flow.",
              "Never go in under bridged grain, or where grain built up on the walls could fall on you."
            ]
          },
          {
            "heading": "Farm or elevator",
            "items": [
              "At grain elevators, feed mills and similar facilities, OSHA's grain handling rule requires the permit, lockout, air testing, harness, observer and rescue steps above.",
              "Farms that mainly grow crops or raise livestock fall outside that rule. OSHA's farm safety guidance warns about the same engulfment danger on farms and points to the same lifeline, lockout and training steps. Use them on farm bins too."
            ]
          }
        ],
        "ask": "If someone had to go into a bin today, who would be the observer, and what would they do if the grain started to move?"
      },
      "es": {
        "title": "Silos de grano y sepultamiento",
        "hook": "El grano en movimiento es como arena movediza. OSHA cita un cálculo de que el grano puede cubrir a un trabajador de 6 pies de alto en 11 segundos, y después de los primeros 5 segundos ya no puede liberarse solo.",
        "sections": [
          {
            "heading": "Cómo matan los silos",
            "items": [
              "La asfixia es una de las principales causas de muerte en los silos de almacenamiento de grano.",
              "Sacar grano de un silo mientras alguien está adentro crea una succión que lo jala hacia abajo rápidamente.",
              "El grano puenteado se apelmaza por la humedad o el moho y deja un hueco vacío por debajo. Se puede derrumbar bajo tus pies sin aviso. El grano pegado a las paredes también se puede caer y enterrarte."
            ]
          },
          {
            "heading": "Antes de que alguien entre",
            "items": [
              "No entres al silo si es posible evitarlo. Si no se puede evitar, primero se hace todo lo que sigue.",
              "Nunca entres mientras se está descargando grano. Apaga y bloquea todo el equipo con motor, sobre todo los sinfines. Cuando un sinfín arranca, puede que solo tengas de 2 a 3 segundos para reaccionar.",
              "Prueba el aire para ver que haya suficiente oxígeno y que no haya gases tóxicos ni inflamables.",
              "Revisa el permiso de entrada para ver que todas las precauciones estén en su lugar."
            ]
          },
          {
            "heading": "Dentro del silo",
            "items": [
              "Si entras desde el nivel del grano o más arriba, o te paras sobre grano tan profundo que te puede sepultar, tu compañía te tiene que dar un arnés de cuerpo completo con línea de vida, o una silla de contramaestre. La línea de vida se ajusta para que no te hundas más allá de la cintura.",
              "Un observador se queda afuera, entrenado en rescate, con el equipo de rescate listo, y se mantiene en contacto contigo todo el tiempo.",
              "Nunca camines sobre el grano para hacerlo fluir, ni te pares sobre grano en movimiento.",
              "Nunca entres debajo de grano puenteado, ni donde el grano pegado a las paredes te pueda caer encima."
            ]
          },
          {
            "heading": "Granja o elevador",
            "items": [
              "En los elevadores de grano, molinos de alimento y lugares parecidos, la regla de OSHA para el manejo de grano exige los pasos de arriba: el permiso, el bloqueo, la prueba del aire, el arnés, el observador y el rescate.",
              "Las granjas que se dedican principalmente a cultivar o criar animales quedan fuera de esa regla. La guía de OSHA para granjas advierte del mismo peligro de quedar sepultado en las granjas y remite a los mismos pasos de línea de vida, bloqueo y capacitación. Úsalos también en los silos de la granja."
            ]
          }
        ],
        "ask": "Si alguien tuviera que entrar a un silo hoy, ¿quién sería el observador y qué haría si el grano empezara a moverse?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "field-sanitation",
    "industries": [
      "ag"
    ],
    "code": "1928.110",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1928.110(a): scope, 11 or more employees in hand labor in the field on any given day",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.110(b): definitions (hand-labor operations, handwashing facility, potable water, toilet facility)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.110(c)(1): potable drinking water",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.110(c)(2): toilet and handwashing facilities, incl. (c)(2)(iii) quarter-mile walk and (c)(2)(v) 3-hour exception",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.110(c)(3): maintenance",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.110(c)(4): reasonable use and hygiene practices",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Field Water, Toilets and Handwashing",
        "hook": "Heat, germs, holding your urine, and farm chemical residue all wear you down in the field. Clean water, a toilet, and a place to wash your hands are how you fight back.",
        "sections": [
          {
            "heading": "When this rule applies",
            "items": [
              "This federal rule covers farms where 11 or more workers do hand labor in the field on the same day. Hand labor means farm work done by hand or with hand tools.",
              "It does not cover logging, caring for or feeding livestock, or work inside permanent buildings like packing houses.",
              "When it applies, your company provides the water, toilets, and handwashing at no cost to you."
            ]
          },
          {
            "heading": "Drinking water",
            "items": [
              "Your company has to put clean drinking water where everyone can easily get to it. It has to be cool enough, and there has to be enough of it for the heat, the humidity, and the work.",
              "Water comes in single-use cups or from a fountain. No shared cups and no dippers.",
              "Water containers get refilled every day, or more often if needed, and stay covered."
            ]
          },
          {
            "heading": "Toilets and handwashing",
            "items": [
              "Your company has to provide one toilet and one handwashing station for every 20 workers, or part of 20.",
              "They go close to each other, within a quarter-mile walk of where you are working. If the land makes that impossible, they go at the closest point a vehicle can reach.",
              "A handwashing station has clean water, soap, and single-use towels. A toilet has toilet paper, privacy, and a door that closes on its own and latches from inside.",
              "If the whole job that day is 3 hours or less, counting travel to and from the field, toilets and handwashing are not required. Drinking water still is."
            ]
          },
          {
            "heading": "Use them",
            "items": [
              "Your company has to tell you where the water and toilets are, and give you reasonable chances during the day to use them.",
              "Drink water often, especially on hot days. Urinate as often as you need to. Don't hold it.",
              "Wash your hands before and after using the toilet, and before you eat or smoke.",
              "Your company has to keep the toilets working and clean, and refill the handwashing water. If something runs out or breaks, tell your supervisor."
            ]
          }
        ],
        "ask": "From where we're working today, where is the nearest drinking water, toilet, and handwashing station?"
      },
      "es": {
        "title": "Agua, baños y lavamanos en el campo",
        "hook": "El calor, los gérmenes, aguantarte las ganas de orinar y los residuos de químicos del campo te desgastan. El agua limpia, un baño y un lugar para lavarte las manos son tu defensa.",
        "sections": [
          {
            "heading": "Cuándo aplica esta regla",
            "items": [
              "Esta regla federal cubre las granjas donde 11 o más trabajadores hacen trabajo a mano en el campo el mismo día. Trabajo a mano es el trabajo agrícola que se hace con las manos o con herramientas de mano.",
              "No cubre la tala de árboles, el cuidado o la alimentación de animales, ni el trabajo dentro de edificios permanentes como las empacadoras.",
              "Cuando aplica, tu compañía te da el agua, los baños y los lavamanos sin ningún costo para ti."
            ]
          },
          {
            "heading": "Agua para tomar",
            "items": [
              "Tu compañía tiene que poner agua potable donde todos la puedan alcanzar fácilmente. Tiene que estar suficientemente fresca y tiene que haber bastante para el calor, la humedad y el tipo de trabajo.",
              "El agua se sirve en vasos desechables o de un bebedero. Nada de vasos compartidos ni cucharones.",
              "Los recipientes de agua se rellenan todos los días, o más seguido si hace falta, y se mantienen tapados."
            ]
          },
          {
            "heading": "Baños y lavamanos",
            "items": [
              "Tu compañía tiene que poner un baño y un lavamanos por cada 20 trabajadores, o fracción de 20.",
              "Van cerca uno del otro, a no más de un cuarto de milla caminando de donde estás trabajando. Si el terreno no lo permite, van en el punto más cercano adonde llegue un vehículo.",
              "Un lavamanos tiene agua limpia, jabón y toallas desechables. Un baño tiene papel higiénico, privacidad y una puerta que se cierra sola y se asegura por dentro.",
              "Si todo el trabajo del día dura 3 horas o menos, contando el viaje de ida y vuelta al campo, no se requieren baños ni lavamanos. El agua para tomar sí se requiere."
            ]
          },
          {
            "heading": "Úsalos",
            "items": [
              "Tu compañía tiene que decirte dónde están el agua y los baños, y darte oportunidades razonables durante el día para usarlos.",
              "Toma agua seguido, sobre todo en días calurosos. Orina cada vez que lo necesites. No te aguantes.",
              "Lávate las manos antes y después de usar el baño, y antes de comer o fumar.",
              "Tu compañía tiene que mantener los baños funcionando y limpios, y rellenar el agua de los lavamanos. Si algo se acaba o se descompone, avísale a tu supervisor."
            ]
          }
        ],
        "ask": "Desde donde estamos trabajando hoy, ¿dónde están el agua para tomar, el baño y el lavamanos más cercanos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "livestock",
    "industries": [
      "ag"
    ],
    "code": "No OSHA standard; NIOSH FACE program reports (guidance)",
    "minutes": 5,
    "sources": [
      {
        "label": "Michigan FACE 06MI205 (NIOSH FACE program): Farmer Dies Leading Heifer Toward a Loading Chute to a Livestock Trailer, Recommendation 2",
        "url": "https://stacks.cdc.gov/view/cdc/166183",
        "kind": "guidance"
      },
      {
        "label": "Michigan FACE 14MI014 (NIOSH FACE program): Dairy Farm Worker Mauled by Either a 2-Year-Old Bull or a Dairy Cow, Recommendations 1, 2, 4 and MIOSHA recommendation",
        "url": "https://www.cdc.gov/niosh/face/pdfs/14mi014.pdf",
        "kind": "guidance"
      },
      {
        "label": "Iowa FACE 00IA055 (NIOSH FACE program): Two Farmers / Brothers Killed By Young Angus Bull, Recommendation 2",
        "url": "https://stacks.cdc.gov/view/cdc/166789",
        "kind": "guidance"
      },
      {
        "label": "Minnesota FACE 96MN007 (NIOSH FACE program): Farmer Dies From Injuries Sustained When Attacked By A Bull, Recommendation 2",
        "url": "https://www.cdc.gov/niosh/face/stateface/mn/96mn007.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Livestock Handling",
        "hook": "In one investigation from NIOSH's fatality program, a farmer was moving a heifer down an alley toward a trailer. No one saw what happened, but he was kicked in the head and died the next day.",
        "sections": [
          {
            "heading": "Read the animal",
            "items": [
              "Every report here comes from a death investigation. One explains that every animal has a flight zone, its personal space. Step into it, and the animal turns and moves away from you.",
              "After the heifer death, investigators recommended learning each cow's behavior and flight zone before you try to load it.",
              "The dairy report notes that cattle see a wide area. Movement to their side and behind them can set them off, so don't assume they can't see you."
            ]
          },
          {
            "heading": "What startles them",
            "items": [
              "That report says sudden, quick moves and sudden or high-pitched noises can startle cattle. Even a stumble, a slip, or a sudden move near a dairy animal can set off a kick.",
              "It also says health problems can make an animal harder to handle and move. Investigators recommended training people to spot sick animals and the signs of an attack."
            ]
          },
          {
            "heading": "Tight spaces and a way out",
            "items": [
              "Two reports recommend escape routes or protected spots, like passage gates, where people work close to cattle and bulls. In one bull death, the pen had neither.",
              "Investigators said not to go into a freestall from behind the animal. Move the cow from the empty stall next to it.",
              "The dairy report warns that a cow getting up can pin a worker against a stanchion, and the crushing injury can be fatal.",
              "After a bull death in Minnesota, investigators recommended moving animals out of an area before you work there, whenever you can."
            ]
          },
          {
            "heading": "Bulls",
            "items": [
              "Investigators recommended that no one be in a pen with a bull alone. A second person trained in animal behavior should watch the bull and warn the worker.",
              "They also said to keep track of where the bull is and what it's doing whenever you go into a holding pen.",
              "The state safety agency in that case called for a barrier, like a tractor or a fence, to keep the animal out of the area where people work."
            ]
          }
        ],
        "ask": "In the pen or alley we're working in today, where is your way out?"
      },
      "es": {
        "title": "Manejo de ganado",
        "hook": "En una investigación del programa de muertes laborales de NIOSH, un granjero estaba llevando una novilla por un pasillo hacia un remolque. Nadie vio lo que pasó, pero recibió una patada en la cabeza y murió al día siguiente.",
        "sections": [
          {
            "heading": "Lee al animal",
            "items": [
              "Cada informe aquí viene de una investigación de una muerte. Uno explica que cada animal tiene una zona de fuga, su espacio personal. Si entras en ella, el animal se voltea y se aleja de ti.",
              "Después de la muerte con la novilla, los investigadores recomendaron conocer el comportamiento y la zona de fuga de cada vaca antes de tratar de cargarla.",
              "El informe de la lechería dice que el ganado ve un área muy amplia. El movimiento a sus lados y detrás de ellos los puede alterar, así que no pienses que no te pueden ver."
            ]
          },
          {
            "heading": "Lo que los asusta",
            "items": [
              "Ese informe dice que los movimientos bruscos y rápidos, y los ruidos repentinos o agudos, pueden asustar al ganado. Hasta un tropiezo, un resbalón o un movimiento repentino cerca de una vaca lechera la puede hacer patear.",
              "También dice que los problemas de salud pueden hacer que un animal sea más difícil de manejar y de mover. Los investigadores recomendaron capacitar a la gente para reconocer animales enfermos y las señales de un ataque."
            ]
          },
          {
            "heading": "Lugares estrechos y una salida",
            "items": [
              "Dos informes recomiendan rutas de escape o lugares protegidos, como puertas de paso, donde la gente trabaja cerca del ganado y de los toros. En una muerte por un toro, el corral no tenía ninguno de los dos.",
              "Los investigadores dijeron que no hay que entrar a un cubículo por detrás del animal. Mueve a la vaca desde el cubículo vacío de al lado.",
              "El informe de la lechería advierte que una vaca que se levanta puede aplastar a un trabajador contra un cepo, y esa lesión puede ser mortal.",
              "Después de una muerte por un toro en Minnesota, los investigadores recomendaron sacar a los animales de un área antes de trabajar ahí, siempre que se pueda."
            ]
          },
          {
            "heading": "Toros",
            "items": [
              "Los investigadores recomendaron que nadie esté solo en un corral con un toro. Otra persona capacitada en el comportamiento de los animales debe vigilar al toro y avisarle al trabajador.",
              "También dijeron que hay que saber dónde está el toro y qué está haciendo cada vez que entras a un corral de espera.",
              "La agencia estatal de seguridad en ese caso pidió una barrera, como un tractor o una cerca, para mantener al animal fuera del área donde trabaja la gente."
            ]
          }
        ],
        "ask": "En el corral o pasillo donde trabajamos hoy, ¿dónde está tu salida?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "atv-utv",
    "industries": [
      "ag"
    ],
    "code": "OSHA FS-3758 (guidance)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Fact Sheet FS-3758: All-Terrain Vehicle Hazards during Farm Work",
        "url": "https://www.osha.gov/Publications/OSHA3758.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Agricultural Operations: Hazards and Controls, All Terrain Vehicles (ATVs)",
        "url": "https://www.osha.gov/agricultural-operations/hazards",
        "kind": "guidance"
      },
      {
        "label": "Wisconsin FACE 00WI039 (NIOSH FACE site): Beef Farmer Pinned Under Overturned All-Terrain Vehicle",
        "url": "https://www.cdc.gov/niosh/face/stateface/wi/00WI039.html",
        "kind": "guidance"
      },
      {
        "label": "Washington FACE report (NIOSH collection): Farm Laborer Dies When UTV Struck by Vehicle",
        "url": "https://stacks.cdc.gov/view/cdc/228719",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "ATVs and UTVs on the Farm",
        "hook": "An ATV feels like an easy ride across the field. But losing control, rolling over, and getting thrown off are common causes of ATV incidents.",
        "sections": [
          {
            "heading": "Before you ride",
            "items": [
              "Your company should never let anyone drive an ATV until they've been trained on its owner's manual.",
              "Do a safety check before and after every ride to make sure it's working right.",
              "Don't ride when you're tired or impaired.",
              "Put it in neutral or park, with the parking brake on, before you start it."
            ]
          },
          {
            "heading": "Gear and riders",
            "items": [
              "Wear a helmet. A bicycle helmet doesn't protect your head and face enough. Goggles and gloves too.",
              "Most ATVs are built for one rider. Never carry a passenger unless the ATV is made for more than one."
            ]
          },
          {
            "heading": "Hills and rough ground",
            "items": [
              "Keep your speed right for the ground, how far you can see, and how much experience you have.",
              "Take hills and turns with care. Watch for holes, stumps, ruts, culverts, wires, fences, and big rocks.",
              "Check the ground before you start. In one case, a farmer's ATV hit a hay bale hidden in tall grass on a steep hill and rolled over on him. He wasn't found until the next morning.",
              "No wheelies, jumps, or stunts. Stay off streets, highways, and paved roads. If you have to cross one, stop on the shoulder, look both ways, and cross straight across."
            ]
          },
          {
            "heading": "Loads and UTVs",
            "items": [
              "The ATV, the load, and you together should stay under the maker's weight limit. Strap tools tight to the cargo rack.",
              "Attachments change how the ATV handles, stays stable, and brakes. Learn the trailer loading and pulling steps before you tow.",
              "UTVs, the side-by-sides, have their own manual. Follow it. In one case, the manual said to wear a helmet and seat belt and stay off paved roads. The driver wore neither, drove onto a highway, was hit by a vehicle, and died of head injuries."
            ]
          }
        ],
        "ask": "Who here has been trained on the ATV or UTV we use, and where is its weight limit posted or written?"
      },
      "es": {
        "title": "Cuatrimotos y UTV en la granja",
        "hook": "Una cuatrimoto parece un paseo fácil por el campo. Pero perder el control, volcarse y salir disparado son causas comunes de accidentes con cuatrimotos.",
        "sections": [
          {
            "heading": "Antes de manejar",
            "items": [
              "Tu compañía nunca debe dejar que alguien maneje una cuatrimoto hasta que lo hayan capacitado con el manual del dueño.",
              "Haz una revisión de seguridad antes y después de cada viaje para asegurarte de que funciona bien.",
              "No manejes si estás cansado o bajo los efectos de algo.",
              "Ponla en neutral o en park, con el freno de mano puesto, antes de arrancarla."
            ]
          },
          {
            "heading": "Equipo y pasajeros",
            "items": [
              "Usa casco. Un casco de bicicleta no protege lo suficiente la cabeza y la cara. También gafas protectoras y guantes.",
              "La mayoría de las cuatrimotos son para una sola persona. Nunca lleves pasajero a menos que la cuatrimoto esté hecha para más de una."
            ]
          },
          {
            "heading": "Lomas y terreno disparejo",
            "items": [
              "Mantén una velocidad adecuada para el terreno, para lo que alcanzas a ver y para tu experiencia.",
              "Ten cuidado al llegar a lomas y curvas. Fíjate en hoyos, troncos, surcos, alcantarillas, alambres, cercas y piedras grandes.",
              "Revisa el terreno antes de empezar. En un caso, la cuatrimoto de un granjero chocó con una paca de heno escondida en el pasto alto en una loma empinada y se volcó encima de él. No lo encontraron hasta la mañana siguiente.",
              "Nada de caballitos, saltos ni acrobacias. No manejes en calles, carreteras ni caminos pavimentados. Si tienes que cruzar uno, detente en el acotamiento, mira a los dos lados y cruza en línea recta."
            ]
          },
          {
            "heading": "Cargas y UTV",
            "items": [
              "El ATV, la carga y tú, todo junto, deben quedar por debajo del límite de peso del fabricante. Amarra bien las herramientas a la parrilla de carga.",
              "Los accesorios cambian cómo se maneja la cuatrimoto, su estabilidad y cómo frena. Aprende cómo cargar y jalar un remolque antes de remolcar.",
              "Los UTV, los de lado a lado, tienen su propio manual. Síguelo. En un caso, el manual decía usar casco y cinturón de seguridad y no manejar en caminos pavimentados. El conductor no usaba ninguno de los dos, se metió a una carretera, lo chocó un vehículo y murió por heridas en la cabeza."
            ]
          }
        ],
        "ask": "¿Quién de aquí está capacitado en la cuatrimoto o el UTV que usamos, y dónde está escrito su límite de peso?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "pesticides",
    "industries": [
      "ag"
    ],
    "code": "40 CFR 170 (EPA WPS) / 1910.1200(b)(5)(i)",
    "minutes": 6,
    "sources": [
      {
        "label": "EPA 40 CFR 170.401(a): worker pesticide safety training within the last 12 months; (c)(3) training topics",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 170.309(f): emergency assistance, transportation to medical care",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 170.407(a): entry restrictions after outdoor applications, REI and signs",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 170.409(a)-(c): posted and oral warnings, sign timing and content",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 170.411(a)-(d): decontamination supplies for workers",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 170.405(a) and 170.505(b): application exclusion zone; handler must suspend application",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 170.507(a)-(c): handler PPE specified on the pesticide labeling",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(b)(5)(i): HazCom labeling does not apply to FIFRA-labeled pesticides",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "EPA Agricultural Worker Protection Standard (WPS) overview (archived EPA page, Jan 19, 2025 snapshot)",
        "url": "https://19january2025snapshot.epa.gov/pesticide-worker-safety/agricultural-worker-protection-standard-wps",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Pesticides and the Worker Protection Standard",
        "hook": "The main rule that protects you from pesticides on the farm comes from EPA, not OSHA. It's called the Worker Protection Standard.",
        "sections": [
          {
            "heading": "An EPA rule",
            "items": [
              "This is EPA's rule, not OSHA's. Its goal is to cut pesticide poisonings and injuries among farmworkers and handlers.",
              "It covers workers on farms, forests, nurseries, and greenhouses, and the handlers who mix, load, or apply pesticides.",
              "OSHA's chemical labeling rule doesn't cover pesticide labels. EPA controls them, and the label sets things like how long to stay out and what gear handlers wear."
            ]
          },
          {
            "heading": "Training",
            "items": [
              "If pesticides were used on the farm, or an entry restriction was in effect, in the last 30 days, your company has to make sure you've had pesticide safety training before you do any task in a treated area.",
              "It has to be within the last 12 months.",
              "It covers warning signs, how pesticides get into your body, signs of poisoning, first aid and washing off, and your right to report problems without getting punished."
            ]
          },
          {
            "heading": "Stay out when you're told",
            "items": [
              "After an application, there's a restricted-entry interval, or REI, set by the label. Your company can't let you into the treated area until it ends and the signs are down or covered, except for early-entry work the rule allows.",
              "Your company has to warn you with posted signs, a spoken warning, or both, depending on the label and how long the REI is.",
              "The sign is white with DANGER and PELIGRO at the top, KEEP OUT and NO ENTRE at the bottom, and a red circle with a raised hand. It goes up no more than 24 hours before the application and stays up through the REI.",
              "Many outdoor applications have an exclusion zone around the equipment. Your company can't let workers into it during the application. If anyone is in it, the handler has to stop right away."
            ]
          },
          {
            "heading": "Washing up and gear",
            "items": [
              "If your work puts you in contact with treated plants, soil, or water, your company has to give you water, soap, and single-use towels, usually no more than a quarter mile from where you work.",
              "That's at least one gallon of water per worker at the start of each work period. Hand sanitizer and wet wipes don't count as soap.",
              "Handlers wear the gear the label lists. Your company has to provide it, clean and working, and make sure it's used right.",
              "If someone may have been exposed to a pesticide at work and needs emergency care, your company has to promptly offer a ride to medical care."
            ]
          }
        ],
        "ask": "If you saw a DANGER / PELIGRO sign on a field edge today, what would you do, and who would you tell?"
      },
      "es": {
        "title": "Pesticidas y la Norma de Protección al Trabajador",
        "hook": "La regla principal que te protege de los pesticidas en la granja viene de la EPA, no de OSHA. Se llama la Norma de Protección al Trabajador (WPS).",
        "sections": [
          {
            "heading": "Una regla de la EPA",
            "items": [
              "Esta es una regla de la EPA, no de OSHA. Su meta es reducir los envenenamientos y las lesiones por pesticidas entre los trabajadores agrícolas y los aplicadores.",
              "Cubre a los trabajadores en granjas, bosques, viveros e invernaderos, y a los que mezclan, cargan o aplican pesticidas.",
              "La regla de OSHA sobre etiquetas de químicos no cubre las etiquetas de pesticidas. La EPA las controla, y la etiqueta fija cosas como cuánto tiempo no se puede entrar y qué equipo usan los aplicadores."
            ]
          },
          {
            "heading": "Capacitación",
            "items": [
              "Si en los últimos 30 días se usaron pesticidas en la granja, o hubo una restricción de entrada, tu compañía tiene que asegurarse de que hayas recibido capacitación en seguridad con pesticidas antes de que hagas cualquier tarea en un área tratada.",
              "Tiene que ser de los últimos 12 meses.",
              "Cubre las señales de advertencia, cómo entran los pesticidas a tu cuerpo, las señales de envenenamiento, primeros auxilios y cómo lavarte, y tu derecho a reportar problemas sin que te castiguen."
            ]
          },
          {
            "heading": "No entres cuando te dicen",
            "items": [
              "Después de una aplicación hay un intervalo de entrada restringida, o REI, que fija la etiqueta. Tu compañía no te puede dejar entrar al área tratada hasta que termine y los letreros se quiten o se tapen, salvo el trabajo de entrada temprana que la regla permite.",
              "Tu compañía te tiene que avisar con letreros, con un aviso de palabra o con los dos, según la etiqueta y cuánto dure el REI.",
              "El letrero es blanco, con DANGER y PELIGRO arriba, KEEP OUT y NO ENTRE abajo, y un círculo rojo con una mano levantada. Se pone no más de 24 horas antes de la aplicación y se queda puesto durante todo el REI.",
              "Muchas aplicaciones al aire libre tienen una zona de exclusión alrededor del equipo. Tu compañía no puede dejar que los trabajadores entren ahí durante la aplicación. Si hay alguien adentro, el aplicador tiene que parar de inmediato."
            ]
          },
          {
            "heading": "Lavarte y el equipo",
            "items": [
              "Si tu trabajo te pone en contacto con plantas, tierra o agua tratadas, tu compañía te tiene que dar agua, jabón y toallas desechables, por lo general a no más de un cuarto de milla de donde trabajas.",
              "Eso es por lo menos un galón de agua por trabajador al empezar cada periodo de trabajo. El gel antibacterial y las toallitas húmedas no cuentan como jabón.",
              "Los aplicadores usan el equipo que dice la etiqueta. Tu compañía lo tiene que dar limpio y en buen estado, y asegurarse de que se use bien.",
              "Si alguien pudo haber estado expuesto a un pesticida en el trabajo y necesita atención de emergencia, tu compañía tiene que ofrecerle de inmediato transporte a atención médica."
            ]
          }
        ],
        "ask": "Si hoy vieras un letrero de DANGER / PELIGRO en la orilla de un campo, ¿qué harías y a quién le avisarías?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hot-kettle",
    "industries": [
      "roof"
    ],
    "code": "1926.150 / 1926.151 / 1926.153",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.150(c)(1)(vi): 10B extinguisher within 50 feet of flammable liquid or gas use",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.150",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.151(a)(3): no smoking near fire-hazard operations; \"No Smoking or Open Flame\" sign",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.151",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.153(g): LP-gas containers installed outside buildings upright on firm foundations or firmly secured",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.153(j): no LP-gas storage inside buildings",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.153",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.153(l): 20-B:C extinguisher at LP-gas storage locations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.153",
        "kind": "standard"
      },
      {
        "label": "OSHA 3755, Protecting Roofing Workers (pp. 25-27: hot tar, kettles, propane)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3755.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Safety and Health Topics: Asphalt Fumes",
        "url": "https://www.osha.gov/asphalt-fumes",
        "kind": "guidance"
      },
      {
        "label": "NIOSH 2003-107, Reducing Roofers' Exposure to Asphalt Fumes",
        "url": "https://www.cdc.gov/niosh/docs/2003-107/pdfs/2003-107.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hot Kettles and Tankers",
        "hook": "Hot tar at 500 degrees can cause severe burns if it's handled wrong. And kettles and tankers are a fire hazard every day they're on the job.",
        "sections": [
          {
            "heading": "Burns and splashes",
            "items": [
              "Kettles, tankers, luggers and mop buckets can all spill or splash hot tar.",
              "Your company has to provide protective gear. Wear all of it: gloves, work boots, a long-sleeve cotton shirt, long cotton pants with no cuffs, and eye protection or a face shield.",
              "Use long-handled tools where you can. Don't spend more time kneeling close to hot asphalt than you have to."
            ]
          },
          {
            "heading": "Keep the kettle from catching fire",
            "items": [
              "A kettle can catch fire or even explode if the material reaches its flash point.",
              "Follow the kettle and material manufacturers' precautions, and always keep the kettle at least 25 degrees below the flash point.",
              "No smoking at or near work that's a fire hazard. The area gets a \"No Smoking or Open Flame\" sign.",
              "Where more than 5 gallons of flammable or combustible liquid, or 5 pounds of flammable gas, are in use, there has to be an extinguisher rated at least 10B within 50 feet. Know where it is."
            ]
          },
          {
            "heading": "Propane cylinders",
            "items": [
              "Never heat a propane tank with a torch, and never lay it on its side.",
              "Outside, cylinders stand upright on firm footing, or are firmly secured some other way.",
              "Propane is never stored inside a building. Where it is stored, there has to be at least one extinguisher rated 20-B:C or better."
            ]
          },
          {
            "heading": "Fumes",
            "items": [
              "Asphalt fumes can cause headaches, skin rash, eye and throat irritation, and coughing.",
              "Keep lids closed on rooftop equipment. Keep the kettle away from air intakes, doors and windows.",
              "Work so the wind blows the fumes away from you, and stay out of the fume cloud whenever you can."
            ]
          }
        ],
        "ask": "Where is the fire extinguisher for the kettle today, and who is watching the kettle temperature?"
      },
      "es": {
        "title": "Calderas y tanques de asfalto caliente",
        "hook": "La brea caliente a 500 grados puede causar quemaduras graves si se maneja mal. Y las calderas y los tanques son un peligro de incendio todos los días que están en el trabajo.",
        "sections": [
          {
            "heading": "Quemaduras y salpicaduras",
            "items": [
              "Las calderas, los tanques, los carritos de acarreo y las cubetas de trapeador pueden derramar o salpicar brea caliente.",
              "Tu compañía tiene que darte equipo de protección. Úsalo todo: guantes, botas de trabajo, camisa de algodón de manga larga, pantalón largo de algodón sin dobladillo, y protección para los ojos o careta.",
              "Usa herramientas de mango largo cuando puedas. No pases más tiempo del necesario hincado cerca del asfalto caliente."
            ]
          },
          {
            "heading": "Que la caldera no se prenda",
            "items": [
              "Una caldera se puede prender o hasta explotar si el material llega a su punto de inflamación.",
              "Sigue las precauciones del fabricante de la caldera y del material, y siempre mantén la caldera por lo menos 25 grados por debajo del punto de inflamación.",
              "No se fuma en ni cerca de un trabajo que sea peligro de incendio. El área lleva un letrero de \"No Smoking or Open Flame\" (no fumar ni llamas abiertas).",
              "Donde se usan más de 5 galones de líquido inflamable o combustible, o 5 libras de gas inflamable, tiene que haber un extintor de por lo menos 10B a no más de 50 pies. Sabe dónde está."
            ]
          },
          {
            "heading": "Tanques de propano",
            "items": [
              "Nunca calientes un tanque de propano con un soplete, y nunca lo acuestes de lado.",
              "Afuera, los tanques van parados sobre una base firme, o bien asegurados de otra manera.",
              "El propano nunca se guarda dentro de un edificio. Donde se guarda, tiene que haber por lo menos un extintor de 20-B:C o mayor."
            ]
          },
          {
            "heading": "Humos",
            "items": [
              "Los humos del asfalto pueden causar dolor de cabeza, sarpullido, irritación de ojos y garganta, y tos.",
              "Mantén cerradas las tapas del equipo en el techo. Mantén la caldera lejos de las tomas de aire, puertas y ventanas.",
              "Trabaja de modo que el viento se lleve los humos lejos de ti, y quédate fuera de la nube de humo siempre que puedas."
            ]
          }
        ],
        "ask": "¿Dónde está hoy el extintor de la caldera, y quién está vigilando la temperatura?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "material-hoist",
    "industries": [
      "roof",
      "con"
    ],
    "code": "1926.552",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.552(a)(1): follow manufacturer's specifications and limitations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.552",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.552(a)(2): rated load, speeds and hazard warnings posted on cars and platforms",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.552",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.552(a)(3): wire rope removed from service",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.552",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.552(b)(1)(i)-(ii): posted operating rules and signals; \"No Riders Allowed\"; no riding except inspection and maintenance",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.552",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.552(b)(2): hoistway entrance gates or bars, incl. (b)(2)(i) bar size and position, (b)(2)(ii) latching device",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.552",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.552(b)(3)-(b)(4): overhead protection on cage and operator's station",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.552",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction eTool: Struck-By (cranes and hoists, falling objects)",
        "url": "https://www.osha.gov/etools/construction/struck-by",
        "kind": "guidance"
      },
      {
        "label": "OSHA interpretation letter, June 2, 1998: ladder hoisting wheel",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1998-06-02-0",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Material Hoists",
        "hook": "A material hoist is built to move loads, not people. Treat it that way every single time.",
        "sections": [
          {
            "heading": "Nobody rides",
            "items": [
              "No one rides a material hoist. The only exception is for inspection and maintenance.",
              "The car frame or crosshead has to carry a \"No Riders Allowed\" notice where everyone can see it."
            ]
          },
          {
            "heading": "Know the limits",
            "items": [
              "The rated load, the operating speed and any special hazard warnings are posted on the car or platform. Read them before you load.",
              "Your company has to run the hoist within the manufacturer's specs and limits. Never load a hoist past its capacity.",
              "Wire rope comes out of service if it has too many broken wires, wear that takes off more than a third of the outside wires, heat damage from a torch, or damage from touching electrical wires.",
              "Inspect the hoist before you use it, and stay out from under loads being moved. Barricade the area below and post warning signs."
            ]
          },
          {
            "heading": "Gates, covers and signals",
            "items": [
              "Every landing entrance gets a solid gate or bars across its full width, painted with diagonal stripes like black and yellow.",
              "Bars are at least 2-by-4 wood or equal, set 2 feet back from the hoistway and 36 to 42 inches off the floor. Gates and bars must have a latch.",
              "The cage or platform has overhead protection on top, and the operator's station is covered with planking at least 2 inches thick.",
              "The operating rules, including the signal system and line speeds for different loads, are posted at the operator's station."
            ]
          },
          {
            "heading": "Ladder hoists",
            "items": [
              "In a 1998 letter, OSHA said a ladder with a ladder-mounted hoisting wheel is not considered a hoist under OSHA's hoisting rules. Use it properly and within the manufacturer's guidelines.",
              "If you're exposed to a fall while lifting the load, fall protection rules still apply."
            ]
          }
        ],
        "ask": "What is the rated load on the hoist we're using today, and where is it posted?"
      },
      "es": {
        "title": "Montacargas de materiales",
        "hook": "Un montacargas de materiales está hecho para mover cargas, no personas. Trátalo así cada vez.",
        "sections": [
          {
            "heading": "Nadie se sube",
            "items": [
              "Nadie se sube a un montacargas de materiales. La única excepción es para inspección y mantenimiento.",
              "El marco de la cabina o el travesaño tiene que llevar un aviso de \"No Riders Allowed\" (prohibido subirse) donde todos lo vean."
            ]
          },
          {
            "heading": "Conoce los límites",
            "items": [
              "La carga nominal, la velocidad de operación y cualquier advertencia especial están puestas en la cabina o la plataforma. Léelas antes de cargar.",
              "Tu compañía tiene que operar el montacargas dentro de las especificaciones y límites del fabricante. Nunca cargues un montacargas más allá de su capacidad.",
              "El cable de acero se saca de servicio si tiene demasiados alambres rotos, desgaste que le quita más de un tercio a los alambres de afuera, daño por calor de un soplete, o daño por tocar cables eléctricos.",
              "Revisa el montacargas antes de usarlo, y no te pongas debajo de cargas que se están moviendo. Pon barricadas en el área de abajo y pon letreros de advertencia."
            ]
          },
          {
            "heading": "Puertas, cubiertas y señales",
            "items": [
              "Cada entrada de descarga lleva una puerta sólida o barras de lado a lado, pintadas con rayas diagonales, como negro y amarillo.",
              "Las barras son de madera de 2 por 4 o algo igual, puestas a 2 pies del hueco del montacargas y de 36 a 42 pulgadas sobre el piso. Las puertas y barras tienen que tener un seguro.",
              "La cabina o plataforma tiene protección arriba, y el puesto del operador está cubierto con tablones de por lo menos 2 pulgadas de grueso.",
              "Las reglas de operación, incluyendo el sistema de señales y las velocidades para diferentes cargas, están puestas en el puesto del operador."
            ]
          },
          {
            "heading": "Elevadores de escalera",
            "items": [
              "En una carta de 1998, OSHA dijo que una escalera con una rueda de izar montada en ella no se considera montacargas bajo las reglas de izaje de OSHA. Úsala bien y dentro de las indicaciones del fabricante.",
              "Si estás expuesto a una caída mientras subes la carga, las reglas de protección contra caídas siguen aplicando."
            ]
          }
        ],
        "ask": "¿Cuál es la carga nominal del montacargas que usamos hoy, y dónde está puesta?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "demolition-survey",
    "industries": [
      "site"
    ],
    "code": "1926.850",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.850(a): engineering survey by a competent person; written evidence",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.850(b): shoring or bracing damaged structures",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.850(c)-(d): service lines shut off, capped or controlled; utilities notified; lines kept in service protected",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.850(e)-(f): hazardous substances tested and purged; glass hazards removed",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.850(g), (i): wall openings protected to about 42 inches; floor openings covered",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(1): unprotected sides and edges, 6 feet or more",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA Safety and Health Topics: Demolition",
        "url": "https://www.osha.gov/demolition",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Before Demolition Starts",
        "hook": "Before the first wall comes down, you need to know three things: what's holding the building up, what's still live, and what's hiding inside.",
        "sections": [
          {
            "heading": "The engineering survey",
            "items": [
              "Before demolition starts, a competent person has to survey the structure: the framing, floors and walls, and the chance of an unplanned collapse.",
              "Nearby buildings where you could be exposed get checked too. Your company has to keep written proof that the survey was done.",
              "If the building was damaged by fire, flood or explosion, the walls or floors get shored or braced before anyone works inside."
            ]
          },
          {
            "heading": "Shut off the utilities",
            "items": [
              "Electric, gas, water, steam, sewer and other service lines are shut off, capped or controlled outside the building line before work starts.",
              "The utility companies involved get notified ahead of time.",
              "If a utility has to stay on during the work, the line gets moved as needed and protected."
            ]
          },
          {
            "heading": "Hazardous materials",
            "items": [
              "Old buildings can hide lead, asbestos and silica in the structure. Those need special handling, and health hazards should be assessed before any demolition work takes place.",
              "Your company has to find out if pipes, tanks or equipment held hazardous chemicals, gases, explosives or flammables. If so, or if it's suspected, they're tested and purged before demolition starts.",
              "Hazards from broken glass get removed."
            ]
          },
          {
            "heading": "Fall protection",
            "items": [
              "At an unprotected edge 6 feet or more above a lower level, your company has to protect you with a guardrail, a safety net, or a personal fall arrest system.",
              "Wall openings you could fall through are protected up to about 42 inches high.",
              "Floor openings that aren't used for dropping material get covered with material strong enough for the load, and secured so the cover can't slide."
            ]
          }
        ],
        "ask": "Who has seen the survey for this building, and which utilities have been confirmed off?"
      },
      "es": {
        "title": "Antes de empezar la demolición",
        "hook": "Antes de que caiga la primera pared, tienes que saber tres cosas: qué está sosteniendo el edificio, qué sigue con corriente o servicio, y qué está escondido adentro.",
        "sections": [
          {
            "heading": "La inspección de ingeniería",
            "items": [
              "Antes de empezar la demolición, una persona competente tiene que inspeccionar la estructura: el armazón, los pisos y las paredes, y el riesgo de un derrumbe inesperado.",
              "También se revisan los edificios cercanos donde te podrías exponer. Tu compañía tiene que guardar prueba por escrito de que se hizo la inspección.",
              "Si el edificio se dañó por incendio, inundación o explosión, las paredes o los pisos se apuntalan o refuerzan antes de que alguien trabaje adentro."
            ]
          },
          {
            "heading": "Cortar los servicios",
            "items": [
              "Las líneas de electricidad, gas, agua, vapor, drenaje y otros servicios se cortan, se tapan o se controlan fuera de la línea del edificio antes de empezar.",
              "A las compañías de servicios que tengan que ver se les avisa con anticipación.",
              "Si un servicio tiene que seguir funcionando durante el trabajo, la línea se mueve si hace falta y se protege."
            ]
          },
          {
            "heading": "Materiales peligrosos",
            "items": [
              "Los edificios viejos pueden esconder plomo, asbesto y sílice en la estructura. Eso necesita manejo especial, y los peligros para la salud se deben evaluar antes de cualquier trabajo de demolición.",
              "Tu compañía tiene que averiguar si las tuberías, tanques o equipos tuvieron químicos peligrosos, gases, explosivos o inflamables. Si es así, o si se sospecha, se prueban y se purgan antes de empezar la demolición.",
              "Se quitan los peligros de vidrios rotos."
            ]
          },
          {
            "heading": "Protección contra caídas",
            "items": [
              "En un borde sin protección a 6 pies o más sobre un nivel más bajo, tu compañía tiene que protegerte con una baranda, una red de seguridad o un sistema personal de detención de caídas.",
              "Las aberturas en las paredes por donde te podrías caer se protegen hasta unas 42 pulgadas de alto.",
              "Los huecos en el piso que no se usan para tirar material se tapan con material lo bastante fuerte para la carga, y se aseguran para que la tapa no se mueva."
            ]
          }
        ],
        "ask": "¿Quién ha visto la inspección de este edificio, y qué servicios ya se confirmaron cortados?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "demolition-walls",
    "industries": [
      "site"
    ],
    "code": "1926.852 / 1926.854 / 1926.855",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.850(j): demolition from the top down, story by story",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.850",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.851(a), (c): designated access only; stairwell lighting and cover two floors below",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.851",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.852(a)-(f): dropping material, enclosed chutes, discharge gate, guardrail, toeboard or bumper",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.852",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.854(a)-(e): debris load, wall stability, weather, load-supporting members, openings within 10 feet",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.854",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.855(c), (f): 18-inch walkways; no one under arches being removed",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.855",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Walls, Floors and Chutes in Demolition",
        "hook": "Demolition goes from the top down, one story at a time. Walls, floors and debris each have rules for how they come out.",
        "sections": [
          {
            "heading": "Taking down walls",
            "items": [
              "Exterior walls and floors come down starting at the top. Each story is removed before work starts on the story below, except for prep work like cutting chute holes.",
              "A wall more than one story tall can't stand without bracing unless it was built to stand on its own. Every wall is left stable at the end of each shift.",
              "Nobody works on top of a wall when the weather makes it dangerous.",
              "Don't let masonry fall onto a floor in loads bigger than that floor can safely carry."
            ]
          },
          {
            "heading": "Floors and openings",
            "items": [
              "Floor openings within 10 feet of a wall being torn down are fully planked, unless workers are kept out of the area below.",
              "Beams and other members holding up a floor aren't cut or removed until every story above is demolished. There are only narrow exceptions.",
              "When floor arches are being removed, nobody is allowed directly underneath, and that area is barricaded.",
              "Your company has to provide walkways at least 18 inches wide, made of 2-inch planks or metal just as strong, so you never have to walk on exposed beams. Use them."
            ]
          },
          {
            "heading": "Debris chutes",
            "items": [
              "No dropping material outside the walls unless the area below is effectively protected.",
              "A chute steeper than 45 degrees is fully enclosed, except for loading openings. On floors below the top, those openings stay closed when not in use.",
              "Where you dump into a chute, there's a guardrail about 42 inches high. Where wheelbarrows or equipment dump, there's a toeboard or bumper at least 4 inches thick and 6 inches high.",
              "The bottom of the chute has a gate run by a competent employee, who also directs trucks backing in and loading. When work stops, the discharge area is closed off."
            ]
          },
          {
            "heading": "Stairs and passageways",
            "items": [
              "Use only the stairs, passageways and ladders marked as access. All other ways in stay closed.",
              "In a multistory building, a stairwell in use is lit, and covered at least two floors below the floor being worked on."
            ]
          }
        ],
        "ask": "Where is the chute discharge today, and who is running the gate?"
      },
      "es": {
        "title": "Paredes, pisos y conductos en la demolición",
        "hook": "La demolición va de arriba hacia abajo, un piso a la vez. Las paredes, los pisos y los escombros tienen cada uno sus reglas para sacarlos.",
        "sections": [
          {
            "heading": "Tumbar paredes",
            "items": [
              "Las paredes exteriores y los pisos se tumban empezando desde arriba. Cada piso se quita antes de empezar con el de abajo, menos el trabajo de preparación como cortar huecos para el conducto.",
              "Una pared de más de un piso de alto no puede quedar parada sin refuerzo, a menos que se haya construido para sostenerse sola. Toda pared se deja estable al final de cada turno.",
              "Nadie trabaja encima de una pared cuando el clima lo hace peligroso.",
              "No dejes que la mampostería caiga sobre un piso en cargas más grandes de lo que ese piso aguanta con seguridad."
            ]
          },
          {
            "heading": "Pisos y huecos",
            "items": [
              "Los huecos en el piso a menos de 10 pies de una pared que se está tumbando se cubren completos con tablones, a menos que no se deje a nadie en el área de abajo.",
              "Las vigas y otras piezas que sostienen un piso no se cortan ni se quitan hasta que se demuelan todos los pisos de arriba. Solo hay excepciones muy limitadas.",
              "Cuando se están quitando los arcos del piso, no se permite a nadie directamente abajo, y esa área se cierra con barricadas.",
              "Tu compañía tiene que poner pasarelas de por lo menos 18 pulgadas de ancho, hechas de tablones de 2 pulgadas o metal igual de fuerte, para que nunca tengas que caminar sobre vigas expuestas. Úsalas."
            ]
          },
          {
            "heading": "Conductos de escombros",
            "items": [
              "No se tira material fuera de las paredes a menos que el área de abajo esté bien protegida.",
              "Un conducto con más de 45 grados de inclinación va completamente cerrado, menos las aberturas para cargar. En los pisos debajo del último, esas aberturas se mantienen cerradas cuando no se usan.",
              "Donde echas escombro al conducto, hay una baranda de unas 42 pulgadas de alto. Donde echan carretillas o equipo, hay un tope o defensa de por lo menos 4 pulgadas de grueso y 6 pulgadas de alto.",
              "La salida del conducto tiene una compuerta manejada por un empleado competente, que también dirige a los camiones que se echan en reversa y se cargan. Cuando para el trabajo, el área de descarga se cierra."
            ]
          },
          {
            "heading": "Escaleras y pasillos",
            "items": [
              "Usa solo las escaleras, pasillos y escaleras de mano marcados como acceso. Todas las otras entradas se mantienen cerradas.",
              "En un edificio de varios pisos, el hueco de escalera que se usa tiene luz, y se cubre por lo menos dos pisos debajo del piso donde se está trabajando."
            ]
          }
        ],
        "ask": "¿Dónde está hoy la salida del conducto, y quién está manejando la compuerta?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "equipment-rops",
    "industries": [
      "site",
      "con"
    ],
    "code": "1926.1000 / 1926.602(a)(2) / 1926.600(a)(3)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.1000(a)-(e): equipment that needs ROPS, remounting, labeling",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1000",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.1001(a): ROPS performance criteria, machines covered",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1001",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.602(a)(1), (a)(2)(i)-(ii): earthmoving equipment, seat belts provided",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.602",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.600(a)(1), (a)(3)(i)-(ii): lights at night, blades and buckets lowered, parking brake and chocks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction eTool: Struck-By (seat belts, parking, blades)",
        "url": "https://www.osha.gov/etools/construction/struck-by",
        "kind": "guidance"
      },
      {
        "label": "OSHA Construction eTool Glossary: rollover protective structure",
        "url": "https://www.osha.gov/etools/construction/glossary",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Alert: Preventing Injuries and Deaths from Skid-Steer Loaders (DHHS (NIOSH) Pub. 2011-128)",
        "url": "https://www.cdc.gov/niosh/docs/2011-128/pdfs/2011-128.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Heavy Equipment: Rollovers, Seat Belts and Parking",
        "hook": "A ROPS is the roll bar or cab frame built to keep you from being crushed if the machine rolls over. It only protects you if you stay inside it.",
        "sections": [
          {
            "heading": "Your ROPS",
            "items": [
              "Rubber-tired scrapers, loaders and dozers, wheel-type farm and industrial tractors, crawler tractors and loaders, and motor graders used in construction need a ROPS. So do compactors and rubber-tired skid steers built after July 15, 2019. Sideboom pipelayers are left out.",
              "If a ROPS is taken off for any reason, it goes back on at equal quality or better, bolted or welded the way the original mounting called for.",
              "Every ROPS has to carry a permanent label with the maker's name and address and the machine it was built to fit."
            ]
          },
          {
            "heading": "Buckle up",
            "items": [
              "Your company has to provide seat belts on earthmoving equipment like loaders, dozers, scrapers, graders and off-highway trucks. Machines built only for stand-up operation are the exception.",
              "Wear the belt, snug. OSHA's advice is to wear it on any machine that has a ROPS, unless it's a stand-up-only machine.",
              "On a skid steer, the ROPS and the seat belt work together to keep you inside the machine in a rollover. If it has a restraint bar, use that too."
            ]
          },
          {
            "heading": "Skid steers: getting on and off",
            "items": [
              "Face the seat when you climb in, and keep three points of contact with the handholds and steps. Get in and out only with the bucket flat on the ground or the lift-arm support in place.",
              "Before you leave the seat, put the bucket or attachment flat on the ground, set the parking brake, and turn off the engine.",
              "Run it only from the seat, never from outside. Keep your hands, arms, legs and head inside. Never bypass a safety device or an interlock.",
              "Don't travel across slopes. Go straight up or down with the heavy end pointed uphill, and travel and turn with the bucket as low as it goes."
            ]
          },
          {
            "heading": "Parking any machine",
            "items": [
              "When a machine isn't in use, blades, buckets and dump bodies are fully lowered or blocked.",
              "Controls go in neutral, motor stopped, brakes set, unless the work you're doing needs otherwise.",
              "Set the parking brake every time you park. Parked on a slope? Chock the wheels too.",
              "Equipment left at night next to a road or an active work area needs lights, reflectors, or lit barricades so people can see it."
            ]
          }
        ],
        "ask": "Who ran a machine yesterday? Show us how you climbed out: bucket, brake, engine, three points of contact."
      },
      "es": {
        "title": "Equipo pesado: volcaduras, cinturones y estacionamiento",
        "hook": "El ROPS es la barra antivuelco o el marco de la cabina, hecho para que no te aplaste si la máquina se voltea. Solo te protege si te quedas adentro.",
        "sections": [
          {
            "heading": "Tu ROPS",
            "items": [
              "Las traíllas, cargadores y bulldozers de llantas, los tractores agrícolas e industriales de ruedas, los tractores y cargadores de orugas, y las motoniveladoras que se usan en construcción necesitan ROPS. También las compactadoras y minicargadores de llantas fabricados después del 15 de julio de 2019. Los tiende-tubos de pluma lateral quedan fuera.",
              "Si se quita un ROPS por cualquier razón, se vuelve a montar con igual o mejor calidad, atornillado o soldado como lo pedía el montaje original.",
              "Todo ROPS tiene que llevar una etiqueta permanente con el nombre y la dirección del fabricante y la máquina para la que fue hecho."
            ]
          },
          {
            "heading": "Abróchate el cinturón",
            "items": [
              "Tu compañía tiene que poner cinturones de seguridad en el equipo de movimiento de tierra, como cargadores, bulldozers, traíllas, motoniveladoras y camiones fuera de carretera. Las máquinas hechas solo para operar de pie son la excepción.",
              "Usa el cinturón, bien ajustado. OSHA aconseja usarlo en toda máquina que tenga ROPS, a menos que sea una máquina para operar solo de pie.",
              "En un minicargador, el ROPS y el cinturón trabajan juntos para mantenerte dentro de la máquina en una volcadura. Si tiene barra de sujeción, úsala también."
            ]
          },
          {
            "heading": "Minicargadores: subir y bajar",
            "items": [
              "Mira hacia el asiento cuando subas y mantén tres puntos de contacto con las agarraderas y los escalones. Sube y baja solo con el cucharón plano en el suelo o con el soporte de los brazos de carga puesto.",
              "Antes de dejar el asiento, pon el cucharón o el accesorio plano en el suelo, pon el freno de estacionamiento y apaga el motor.",
              "Opéralo solo desde el asiento, nunca desde afuera. Mantén las manos, los brazos, las piernas y la cabeza adentro. Nunca anules un dispositivo de seguridad ni un interbloqueo.",
              "No cruces las pendientes de lado. Sube o baja derecho con el lado pesado hacia arriba, y viaja y gira con el cucharón lo más bajo posible."
            ]
          },
          {
            "heading": "Estacionar cualquier máquina",
            "items": [
              "Cuando una máquina no se está usando, las cuchillas, los cucharones y las cajas de volteo se bajan por completo o se bloquean.",
              "Los controles en neutral, el motor apagado y los frenos puestos, a menos que el trabajo que estás haciendo pida otra cosa.",
              "Pon el freno de estacionamiento cada vez que estaciones. ¿Estacionada en una pendiente? Pon calzas en las llantas también.",
              "El equipo que se deja de noche junto a una carretera o un área de trabajo activa necesita luces, reflectores o barricadas con luces para que la gente lo vea."
            ]
          }
        ],
        "ask": "¿Quién operó una máquina ayer? Muéstranos cómo te bajaste: cucharón, freno, motor y tres puntos de contacto."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "underground-utilities",
    "industries": [
      "elec",
      "plumb",
      "site",
      "util"
    ],
    "code": "1926.651(b)",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1926.651(b)(1): estimated location of utilities determined before opening an excavation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(b)(2): contact utility owners; 24 hours or longer state/local period; proceed with caution using detection equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(b)(3): exact location determined by safe and acceptable means",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.651(b)(4): exposed installations protected, supported or removed",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.651",
        "kind": "standard"
      },
      {
        "label": "OSHA Trenching and Excavation Safety (OSHA 2226-10R, 2015)",
        "url": "https://www.osha.gov/sites/default/files/publications/osha2226.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA interpretation, Oct. 23, 2003: hydro-vacuum excavation and non-conductive hand tools under 1926.651(b)(2)-(3)",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2003-10-23",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Digging Near Buried Utilities",
        "hook": "Sewer, phone, fuel, electric, and water lines can all be under your feet. Know where they are before the first bucket goes in the ground.",
        "sections": [
          {
            "heading": "Before you dig",
            "items": [
              "The estimated location of any utility you could reasonably run into has to be figured out before the excavation is opened.",
              "Your company has to contact the utility owners, tell them about the work, and ask them to locate their lines before digging starts.",
              "One common way to do this is to call 811, the \"Call Before You Dig\" number. Your supervisor will tell you how it was done for this job."
            ]
          },
          {
            "heading": "If the marks don't come",
            "items": [
              "If an owner doesn't respond within 24 hours, or longer if state or local law requires it, or can't find the exact spot, your company can go ahead, but only with caution.",
              "With caution means using detection equipment or another acceptable way to find the lines."
            ]
          },
          {
            "heading": "Getting close",
            "items": [
              "As you get near where a line is supposed to be, its exact location has to be found in a safe and acceptable way.",
              "Damaging the line or its insulation while you look for it can create a hazard. So use a method that won't damage the line you're trying to find.",
              "Non-conductive hand tools, used with care, are one acceptable way.",
              "Hydro-vacuum excavation is acceptable only if it's adjusted so it won't damage the utility. If it can't be adjusted enough, don't use it."
            ]
          },
          {
            "heading": "Once it's exposed",
            "items": [
              "While the excavation is open, exposed lines are protected, supported, or removed as needed to keep everyone safe.",
              "OSHA's advice comes down to one line: know where underground utilities are before you dig."
            ]
          }
        ],
        "ask": "Where are the marked lines on this job, and how are we going to find their exact spot before we dig close to them?"
      },
      "es": {
        "title": "Excavar cerca de servicios enterrados",
        "hook": "Las líneas de drenaje, teléfono, combustible, electricidad y agua pueden estar todas bajo tus pies. Debes saber dónde están antes de que la primera palada entre a la tierra.",
        "sections": [
          {
            "heading": "Antes de excavar",
            "items": [
              "Hay que averiguar la ubicación aproximada de cualquier servicio que razonablemente te podrías encontrar antes de abrir la excavación.",
              "Tu compañía tiene que contactar a los dueños de los servicios, informarles del trabajo y pedirles que ubiquen sus líneas antes de empezar a excavar.",
              "Una forma común de hacerlo es llamar al 811, el número de \"Llame antes de excavar\". Tu supervisor te dirá cómo se hizo para este trabajo."
            ]
          },
          {
            "heading": "Si no llegan las marcas",
            "items": [
              "Si un dueño no responde en 24 horas, o más si la ley estatal o local lo exige, o no puede encontrar el lugar exacto, tu compañía puede seguir, pero solo con precaución.",
              "Con precaución quiere decir usar equipo de detección u otra forma aceptable para encontrar las líneas."
            ]
          },
          {
            "heading": "Al acercarte",
            "items": [
              "Cuando te acerques a donde se supone que está una línea, hay que encontrar su ubicación exacta de una forma segura y aceptable.",
              "Dañar la línea o su aislamiento mientras la buscas puede crear un peligro. Por eso usa un método que no dañe la línea que estás buscando.",
              "Las herramientas de mano no conductoras, usadas con cuidado, son una forma aceptable.",
              "La excavación hidráulica por vacío solo es aceptable si está ajustada para que no dañe el servicio. Si no se puede ajustar lo suficiente, no la uses."
            ]
          },
          {
            "heading": "Cuando ya está expuesta",
            "items": [
              "Mientras la excavación esté abierta, las líneas expuestas se protegen, se sostienen o se retiran según haga falta para que todos estén seguros.",
              "El consejo de OSHA se resume en una frase: debes saber dónde están los servicios enterrados antes de excavar."
            ]
          }
        ],
        "ask": "¿Dónde están las líneas marcadas en este trabajo, y cómo vamos a encontrar su lugar exacto antes de excavar cerca de ellas?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "temp-power",
    "industries": [
      "elec",
      "con"
    ],
    "code": "1926.405(a)(2) / 1926.405(b) / 1926.404(b)(1) / 1926.403(i)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.405(a)(2)(i): temporary wiring scope; removed when done",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.405",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.405(a)(2)(ii)(A)-(G), (I)-(J): feeders, branch circuits, receptacles, disconnects, lamps, wet locations, cords",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.405",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.405(b)(1)-(2): openings closed; covers on boxes and fittings",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.405",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.404(b)(1)(i)-(ii): GFCIs or assured equipment grounding conductor program",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.404",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.404(c)(1)(ii): clearance from ground for outdoor open conductors, 600 volts or less",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.404",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.403(i)(2)(i), (i)(2)(iii): guarding live parts of 50 volts or more; warning signs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.403",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction Focus Four: Electrocution Hazards Instructor Guide",
        "url": "https://www.osha.gov/sites/default/files/electr_ig.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Temporary Power",
        "hook": "Temporary wiring for the job can be a lower class than the building's permanent wiring. But except where the temporary rules say otherwise, the permanent wiring rules still apply.",
        "sections": [
          {
            "heading": "Panels and covers",
            "items": [
              "Feeders start at a distribution center. Branch circuits start at a power outlet or panelboard.",
              "Every pull box, junction box and fitting gets a cover. Once it's energized, every outlet box needs a cover, faceplate or fixture canopy. Metal covers are grounded.",
              "Openings where wires enter boxes and cabinets are closed off, and so are unused openings.",
              "Each temporary circuit has a disconnect switch or plug connector that can cut all of its hot conductors."
            ]
          },
          {
            "heading": "GFCIs and grounding",
            "items": [
              "Your company protects you with GFCIs or with an assured grounding program. With GFCIs, every 120-volt, 15- or 20-amp outlet on site that you use and isn't part of the building's permanent wiring needs one. There's a narrow exception for some small generators.",
              "Receptacles are the grounding type and are connected to the grounding conductor.",
              "Portable lights in wet or conductive spots, like tanks and drums, run at 12 volts or less. 120-volt lights are allowed there only on a GFCI."
            ]
          },
          {
            "heading": "Cords and wiring",
            "items": [
              "Branch-circuit wires are never laid on the floor.",
              "Protect cords from damage and keep them off sharp corners. A cord can go through a doorway or pinch point only if it's protected there.",
              "Extension cords for tools are 3-wire and made for hard or extra-hard use.",
              "Don't hang temporary lights by their cords unless they're built for it. Bulbs need protection from contact or breakage."
            ]
          },
          {
            "heading": "Overhead and live parts",
            "items": [
              "Open wires run outdoors at 600 volts or less need height: 10 feet over ground, sidewalks, or anything someone could reach them from; 12 feet over areas with vehicles but no trucks; 15 feet where trucks run; 18 feet over public streets, alleys, roads and driveways.",
              "Live parts at 50 volts or more are guarded against accidental contact: by cabinets or other enclosures, in a room only qualified people can get into, behind partitions or screens, or 8 feet or more above the floor.",
              "Entrances to rooms and other guarded spots with exposed live parts have warning signs keeping unqualified people out.",
              "When the job or purpose is done, temporary wiring comes out right away."
            ]
          }
        ],
        "ask": "Let's walk the temp power together. Any missing covers, wires on the floor, unprotected cords at doorways, or open wires hanging low?"
      },
      "es": {
        "title": "Electricidad temporal",
        "hook": "El cableado temporal de la obra puede ser de una clase menor que el cableado permanente del edificio. Pero salvo donde las reglas temporales digan otra cosa, las reglas del cableado permanente siguen aplicando.",
        "sections": [
          {
            "heading": "Tableros y tapas",
            "items": [
              "Los alimentadores salen de un centro de distribución. Los circuitos derivados salen de una toma de corriente o de un tablero.",
              "Toda caja de paso, caja de empalme y accesorio lleva tapa. Una vez energizada, toda caja de salida necesita una tapa, una placa o una cubierta de lámpara. Las tapas de metal se conectan a tierra.",
              "Las aberturas por donde entran los cables a las cajas y gabinetes se cierran, y también las aberturas que no se usan.",
              "Cada circuito temporal tiene un interruptor de desconexión o un conector de enchufe que puede cortar todos sus conductores vivos."
            ]
          },
          {
            "heading": "GFCI y conexión a tierra",
            "items": [
              "Tu compañía te protege con GFCI o con un programa de conexión a tierra asegurada. Con GFCI, todo tomacorriente de 120 voltios y 15 o 20 amperios en la obra que tú uses y que no sea parte del cableado permanente del edificio necesita uno. Hay una excepción limitada para algunos generadores pequeños.",
              "Los receptáculos son del tipo con tierra y están conectados al conductor de tierra.",
              "Las lámparas portátiles en lugares mojados o conductores, como tanques y tambores, funcionan con 12 voltios o menos. Las lámparas de 120 voltios se permiten ahí solo con GFCI."
            ]
          },
          {
            "heading": "Cables y cableado",
            "items": [
              "Los cables de los circuitos derivados nunca se tienden en el piso.",
              "Protege los cables contra daños y mantenlos lejos de esquinas filosas. Un cable puede pasar por una puerta o un punto donde se puede aplastar solo si está protegido ahí.",
              "Las extensiones para herramientas son de 3 hilos y hechas para uso pesado o extra pesado.",
              "No cuelgues las lámparas temporales de sus cables a menos que estén hechas para eso. Los focos necesitan protección contra golpes o roturas."
            ]
          },
          {
            "heading": "Altura y partes vivas",
            "items": [
              "Los cables abiertos que van por afuera, de 600 voltios o menos, necesitan altura: 10 pies sobre el suelo, las banquetas o cualquier lugar desde donde alguien los pueda alcanzar; 12 pies sobre áreas con vehículos pero sin camiones; 15 pies donde pasan camiones; 18 pies sobre calles públicas, callejones, caminos y entradas de autos.",
              "Las partes vivas de 50 voltios o más se protegen contra el contacto accidental: con gabinetes u otros encierros, en un cuarto donde solo pueden entrar personas calificadas, detrás de divisiones o mallas, o a 8 pies o más sobre el piso.",
              "Las entradas a cuartos y otros lugares protegidos con partes vivas expuestas tienen letreros de advertencia que prohíben la entrada a personas no calificadas.",
              "Cuando se termina el trabajo o el propósito, el cableado temporal se quita de inmediato."
            ]
          }
        ],
        "ask": "Vamos a revisar juntos la electricidad temporal. ¿Faltan tapas, hay cables en el piso, cables sin protección en las puertas o cables abiertos colgando bajos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "lockout-con",
    "industries": [
      "elec",
      "plumb",
      "con"
    ],
    "code": "1926.417 / 1926.702(j) / 1926.600(a)(3)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.417(a)-(c): tag controls, render deenergized circuits inoperative, tags identify the work",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.417",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.416(a)(1): no work near power circuits unless deenergized and grounded or guarded",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.702(j)(1)-(2): lockout/tagout of concrete and masonry equipment; Do Not Start tags",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.702",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.600(a)(3)(i): blocking raised equipment; blades and buckets lowered; controls neutral, motors stopped, brakes set",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.600",
        "kind": "standard"
      },
      {
        "label": "OSHA Construction Focus Four: Electrocution Hazards Instructor Guide (lockout steps, testing, re-energizing)",
        "url": "https://www.osha.gov/sites/default/files/electr_ig.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Lockout and Tags on the Jobsite",
        "hook": "Simply turning a switch off is not enough. Before you work on a circuit or a machine, it should be shut down, locked or tagged, and tested.",
        "sections": [
          {
            "heading": "The tag rules",
            "items": [
              "Controls that get shut off while you work on equipment or circuits get tagged.",
              "Deenergized equipment and circuits are made so they can't run, with tags at every point where they could be turned back on.",
              "Tags plainly show which equipment or circuit is being worked on."
            ]
          },
          {
            "heading": "Shut it down right",
            "items": [
              "Construction has no general lockout standard. These steps are OSHA's recommended practice from its construction training. You should find every source of electrical energy for the equipment or circuit, and shut off backup sources too, like generators and batteries.",
              "Each worker should put on their own lock and keep their own key.",
              "Stored energy, like in capacitors, should be drained by bleeding, blocking or grounding it."
            ]
          },
          {
            "heading": "Test before you touch",
            "items": [
              "The equipment and circuits should be tested to make sure they're dead, and a qualified person should do the testing.",
              "Only qualified persons should work on circuit parts or equipment that hasn't been deenergized. And this one is a construction rule: your company can't put you close enough that you could contact a power circuit during the work, unless it's deenergized and grounded, or guarded.",
              "Before anything gets turned back on, every worker should be clear and accounted for, and only a qualified person should decide when it's safe to re-energize."
            ]
          },
          {
            "heading": "Machines, too",
            "items": [
              "On concrete and masonry work, no one does maintenance or repair on equipment like mixers, pumps, compressors or screens, if it could start by accident and hurt someone, until every hazardous energy source is locked out and tagged.",
              "Those tags say Do Not Start, or something like it.",
              "Blades, buckets and dump bodies are fully lowered or blocked when they're being repaired. Machinery held up by slings, hoists or jacks gets blocked or cribbed before anyone works under or between it.",
              "Controls go in neutral, motors stopped, brakes set, unless the work needs otherwise."
            ]
          }
        ],
        "ask": "Whose lock is on what today? Walk us through how you'd shut down and test the circuit or machine you're working on."
      },
      "es": {
        "title": "Candados y etiquetas en la obra",
        "hook": "Solo apagar un interruptor no es suficiente. Antes de trabajar en un circuito o una máquina, se debe apagar, ponerle candado o etiqueta, y probar.",
        "sections": [
          {
            "heading": "Las reglas de las etiquetas",
            "items": [
              "Los controles que se apagan mientras trabajas en equipos o circuitos se etiquetan.",
              "Los equipos y circuitos desenergizados se dejan de forma que no puedan funcionar, con etiquetas en cada punto donde se podrían volver a prender.",
              "Las etiquetas muestran claramente en qué equipo o circuito se está trabajando."
            ]
          },
          {
            "heading": "Apágalo bien",
            "items": [
              "En construcción no hay una norma general de bloqueo. Estos pasos son la práctica que recomienda OSHA en su entrenamiento para construcción. Debes encontrar todas las fuentes de energía eléctrica del equipo o del circuito, y apagar también las fuentes de respaldo, como generadores y baterías.",
              "Cada trabajador debe poner su propio candado y quedarse con su propia llave.",
              "La energía almacenada, como la de los capacitores, se debe descargar purgándola, bloqueándola o conectándola a tierra."
            ]
          },
          {
            "heading": "Prueba antes de tocar",
            "items": [
              "El equipo y los circuitos se deben probar para asegurarse de que no tienen corriente, y una persona calificada debe hacer la prueba.",
              "Solo las personas calificadas deben trabajar en partes de circuitos o equipos que no se han desenergizado. Y esta sí es una regla de construcción: tu compañía no te puede poner tan cerca que puedas tocar un circuito eléctrico durante el trabajo, a menos que esté desenergizado y conectado a tierra, o protegido.",
              "Antes de volver a prender cualquier cosa, todos los trabajadores deben estar fuera de peligro y contados, y solo una persona calificada debe decidir cuándo es seguro volver a energizar."
            ]
          },
          {
            "heading": "Las máquinas también",
            "items": [
              "En trabajos de concreto y mampostería, nadie le da mantenimiento ni repara equipo como mezcladoras, bombas, compresores o cribas, si se puede prender por accidente y lastimar a alguien, hasta que todas las fuentes de energía peligrosa tengan candado y etiqueta.",
              "Esas etiquetas dicen Do Not Start (No arrancar), o algo parecido.",
              "Las cuchillas, los cucharones y las cajas de volteo se bajan por completo o se bloquean cuando se están reparando. La maquinaria que está levantada con eslingas, polipastos o gatos se bloquea o se apuntala antes de que alguien trabaje debajo o entre ella.",
              "Los controles en neutral, los motores apagados y los frenos puestos, a menos que el trabajo pida otra cosa."
            ]
          }
        ],
        "ask": "¿De quién es cada candado hoy? Explícanos cómo apagarías y probarías el circuito o la máquina en que estás trabajando."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "test-before-touch",
    "industries": [
      "elec",
      "util",
      "mfg"
    ],
    "code": "1910.333(b) / 1910.334(c) / 1926.417",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.333(a)(1): deenergize live parts before work, limited exceptions",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(1): parts not locked out or tagged are treated as energized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(2)(ii)(B)-(C), (b)(2)(iii)(A)-(C): disconnect all sources, discharge capacitors, lock and tag",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(2)(iv)(A)-(B): verification of deenergized condition by a qualified person; tester checked before and after over 600 volts",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(2)(v)(A)-(D): reenergizing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.334(c)(1)-(3): test instruments, use, visual inspection, rating",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.334",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.416(a)(1): construction, deenergize and ground or guard",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.417(b): construction, tags at all points where circuits can be energized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.417",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.962(e): power line work, test for absence of nominal voltage before grounding",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.962",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Test Before You Touch",
        "hook": "Until a circuit is locked out, tagged, and tested, treat it as live. Parts that are shut off but not locked out or tagged count as energized.",
        "sections": [
          {
            "heading": "Shut it off and lock it out",
            "items": [
              "Live parts get shut off before you work on or near them. The exceptions are narrow, like when shutting off would create a bigger hazard or can't be done, and your company has to be able to show that.",
              "Disconnect every source that feeds the circuit, not just one.",
              "Each disconnect gets a lock and a tag. The tag says no one without authorization may operate it or remove the tag. A tag alone is allowed only if a lock can't go on, or your company can show the tag is just as safe.",
              "On construction jobs, the circuit is shut off and grounded, or guarded, before anyone works close enough to touch it. Tags go on at every point where it could be turned back on."
            ]
          },
          {
            "heading": "Verify it's dead",
            "items": [
              "A qualified person tries the controls, or checks another way, to make sure the equipment can't restart.",
              "Then a qualified person uses a tester on every part you'll be exposed to and confirms it's dead. The test also looks for voltage that sneaks in, like induced voltage or backfeed, even after the circuit was shut off.",
              "Stored energy counts too. Capacitors are discharged if the stored energy could hurt someone.",
              "On power lines and utility equipment, test for voltage before any ground goes on, unless a ground is already installed."
            ]
          },
          {
            "heading": "Check the tester",
            "items": [
              "Only qualified people do testing on electric circuits.",
              "Before each use, look over the meter, leads, probes, and connectors for damage. If it has damage that could hurt someone, it's out of service until it's repaired and tested.",
              "The tester has to be rated for the circuit you're testing and made for the place you're using it.",
              "Over 600 volts, the tester has to be checked for proper operation right before and right after the test."
            ]
          },
          {
            "heading": "Before it goes back on",
            "items": [
              "A qualified person checks that all tools, jumpers, shorts, and grounds are removed.",
              "Everyone who could be hurt is warned, and someone looks to make sure they're all clear.",
              "Each lock and tag comes off by the person who put it on, or under their direct supervision. If that person isn't at the workplace, a qualified person your company picks for the task can remove it, and your company makes sure the person who put it on knows before they go back to work."
            ]
          }
        ],
        "ask": "Who's the qualified person testing today, and when did they last look over the tester and leads?"
      },
      "es": {
        "title": "Prueba antes de tocar",
        "hook": "Hasta que un circuito esté bloqueado, etiquetado y probado, trátalo como si tuviera corriente. Las partes apagadas pero sin candado ni etiqueta cuentan como energizadas.",
        "sections": [
          {
            "heading": "Apágalo y bloquéalo",
            "items": [
              "Las partes con corriente se apagan antes de que trabajes en ellas o cerca de ellas. Las excepciones son pocas, como cuando apagarlas crearía un peligro mayor o no se puede hacer, y tu compañía tiene que poder demostrarlo.",
              "Desconecta todas las fuentes que alimentan el circuito, no solo una.",
              "Cada desconectador lleva un candado y una etiqueta. La etiqueta dice que nadie sin autorización puede operarlo ni quitar la etiqueta. Solo se permite la etiqueta sin candado si el candado no se puede poner, o si tu compañía puede demostrar que la etiqueta es igual de segura.",
              "En obras de construcción, el circuito se apaga y se conecta a tierra, o se protege, antes de que alguien trabaje tan cerca que lo pueda tocar. Se ponen etiquetas en cada punto donde se podría volver a encender."
            ]
          },
          {
            "heading": "Confirma que no tiene corriente",
            "items": [
              "Una persona calificada prueba los controles, o revisa de otra forma, para asegurarse de que el equipo no puede arrancar.",
              "Luego una persona calificada usa un probador en cada parte a la que vas a estar expuesto y confirma que no tiene corriente. La prueba también busca voltaje que se cuela, como voltaje inducido o retroalimentación, aun después de apagar el circuito.",
              "La energía almacenada también cuenta. Los capacitores se descargan si la energía almacenada puede lastimar a alguien.",
              "En líneas eléctricas y equipo de servicios públicos, prueba que no haya voltaje antes de poner cualquier tierra, a menos que ya haya una tierra instalada."
            ]
          },
          {
            "heading": "Revisa el probador",
            "items": [
              "Solo personas calificadas hacen pruebas en circuitos eléctricos.",
              "Antes de cada uso, revisa el medidor, los cables, las puntas y los conectores por daños. Si tiene un daño que pueda lastimar a alguien, queda fuera de servicio hasta que se repare y se pruebe.",
              "El probador tiene que estar clasificado para el circuito que vas a probar y hecho para el lugar donde lo usas.",
              "Con más de 600 voltios, hay que revisar que el probador funcione bien justo antes y justo después de la prueba."
            ]
          },
          {
            "heading": "Antes de volver a encender",
            "items": [
              "Una persona calificada revisa que se hayan quitado todas las herramientas, puentes, cortos y tierras.",
              "Se avisa a todos los que podrían salir lastimados, y alguien mira para asegurarse de que todos estén retirados.",
              "Cada candado y etiqueta lo quita la persona que lo puso, o alguien bajo su supervisión directa. Si esa persona no está en el lugar de trabajo, una persona calificada que tu compañía designe puede quitarlo, y tu compañía se asegura de que la persona que lo puso lo sepa antes de volver a trabajar."
            ]
          }
        ],
        "ask": "¿Quién es la persona calificada que va a probar hoy, y cuándo fue la última vez que revisó el probador y los cables?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "arc-flash",
    "industries": [
      "elec",
      "util",
      "mfg"
    ],
    "code": "1910.333 / 1910.335 / 1910.269(l)(8)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.333(a)(1): deenergize live parts before work, with notes on exceptions",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(1): deenergized parts not locked out or tagged are treated as energized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(c)(2), (c)(4), (c)(6), (c)(8): qualified persons only, no blind reaching, conductive materials, conductive jewelry",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.335(a)(1)(i)-(ii), (a)(1)(iv)-(v), (a)(2)(i): protective equipment, head and eye/face protection, insulated tools",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.335",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(l)(8)(iii), (l)(8)(v): no melting or flammable clothing; arc-rated gear above 2.0 cal/cm2",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.331(c)(1): utility generation, transmission and distribution work is covered by 1910.269",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.331",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.416(a)(1): construction work near electric power circuits",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA Electrical: Electric-Arc Flash Hazards",
        "url": "https://www.osha.gov/electrical/flash-hazards",
        "kind": "guidance"
      },
      {
        "label": "OSHA 4473: Being Aware of Arc Flash Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA4473.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Arc Flash and Energized Parts",
        "hook": "An arc flash is an electrical explosion. The hot gas can top 35,000 degrees Fahrenheit, and even a 120/208-volt circuit can make an arc strong enough to burn skin and set clothes on fire.",
        "sections": [
          {
            "heading": "Deenergize first",
            "items": [
              "Live parts get deenergized before anyone works on or near them. Exceptions include when shutting off adds a hazard, like killing alarms or life support, or when the work can't be done dead, like some testing. Your company has to be able to show that.",
              "Low voltage alone is not a reason to work hot.",
              "Off is not the same as safe. A part that's shut off but not locked out or tagged is treated as live."
            ]
          },
          {
            "heading": "Only qualified people work hot",
            "items": [
              "Only qualified persons may work on circuits or equipment that haven't been deenergized. They have to be familiar with the safe techniques, the PPE, the insulating materials and the insulated tools.",
              "Not qualified? Then you don't work on it. Anything conductive you're carrying, like pipe or ductwork, has to be handled so it can't touch exposed live parts.",
              "Don't reach blindly into a space that may have live parts, and don't go into one unless it's lit.",
              "On construction jobs, your company can't put you close enough that you could contact a power circuit during the work, unless it's deenergized and grounded, or guarded."
            ]
          },
          {
            "heading": "PPE and tools",
            "items": [
              "Where there's an electrical hazard, your company has to provide the right protective equipment, and you have to use it. It has to be kept in safe condition and inspected or tested.",
              "Wear eye or face protection where an arc, a flash, or flying parts from an electrical explosion could hurt you. Wear a nonconductive hard hat where shock or burns could injure your head.",
              "Use insulated tools near exposed live parts if the tools could touch them. Rings, watch bands, bracelets and key chains come off if they could touch live parts."
            ]
          },
          {
            "heading": "What you wear",
            "items": [
              "Most arc flash burns come from the arc lighting your clothes, not from the arc itself.",
              "On power generation, transmission and distribution work, if you're exposed to arcs or flames, your company has to make sure you don't wear clothing that can melt onto your skin or keep burning. That includes what you wear underneath.",
              "Under that same rule, when the estimated heat energy is over 2.0 cal/cm², your company has to make sure you wear arc-rated gear rated at least that high.",
              "Wear your gear right: shirt tucked in, sleeves down, everything buttoned."
            ]
          }
        ],
        "ask": "Who on this crew is qualified to work on energized parts here, and what has to happen before anyone opens a panel?"
      },
      "es": {
        "title": "Arco eléctrico y partes energizadas",
        "hook": "Un arco eléctrico es una explosión eléctrica. El gas caliente puede pasar de 35,000 grados Fahrenheit, y hasta un circuito de 120/208 voltios puede hacer un arco con fuerza suficiente para quemar la piel y prenderle fuego a la ropa.",
        "sections": [
          {
            "heading": "Primero desenergiza",
            "items": [
              "Las partes vivas se desenergizan antes de que alguien trabaje en ellas o cerca de ellas. Las excepciones incluyen cuando apagarlas crea otro peligro, como desactivar alarmas o equipo de soporte de vida, o cuando el trabajo no se puede hacer sin corriente, como algunas pruebas. Tu compañía tiene que poder demostrarlo.",
              "El voltaje bajo por sí solo no es razón para trabajar en caliente.",
              "Apagado no es lo mismo que seguro. Una parte que está apagada pero sin candado ni etiqueta se trata como si estuviera viva."
            ]
          },
          {
            "heading": "Solo personas calificadas trabajan en caliente",
            "items": [
              "Solo las personas calificadas pueden trabajar en circuitos o equipos que no se han desenergizado. Tienen que conocer las técnicas seguras, el equipo de protección, los materiales aislantes y las herramientas aisladas.",
              "¿No eres calificado? Entonces no trabajas en eso. Cualquier cosa conductora que cargues, como tubo o ducto, se tiene que manejar de forma que no toque partes vivas expuestas.",
              "No metas la mano a ciegas en un espacio que pueda tener partes vivas, y no entres a uno si no tiene luz.",
              "En trabajos de construcción, tu compañía no te puede poner tan cerca que puedas tocar un circuito eléctrico durante el trabajo, a menos que esté desenergizado y conectado a tierra, o protegido."
            ]
          },
          {
            "heading": "Equipo de protección y herramientas",
            "items": [
              "Donde hay un peligro eléctrico, tu compañía tiene que darte el equipo de protección adecuado, y tú lo tienes que usar. Se tiene que mantener en buen estado e inspeccionar o probar.",
              "Usa protección para los ojos o la cara donde un arco, un destello o pedazos que salen volando de una explosión eléctrica te puedan lastimar. Usa un casco no conductor donde un choque o una quemadura te pueda lastimar la cabeza.",
              "Usa herramientas aisladas cerca de partes vivas expuestas si las herramientas las pueden tocar. Los anillos, correas de reloj, pulseras y llaveros se quitan si pueden tocar partes vivas."
            ]
          },
          {
            "heading": "Lo que te pones",
            "items": [
              "La mayoría de las quemaduras por arco eléctrico vienen de que el arco prende la ropa, no del arco mismo.",
              "En trabajos de generación, transmisión y distribución de electricidad, si estás expuesto a arcos o llamas, tu compañía tiene que asegurarse de que no uses ropa que se pueda derretir sobre tu piel o que siga ardiendo. Eso incluye la ropa que llevas debajo.",
              "Bajo esa misma regla, cuando la energía de calor estimada pasa de 2.0 cal/cm², tu compañía tiene que asegurarse de que uses equipo con clasificación de arco igual o mayor.",
              "Ponte bien el equipo: camisa fajada, mangas abajo, todo abotonado."
            ]
          }
        ],
        "ask": "¿Quién en este equipo es calificado para trabajar en partes energizadas aquí, y qué tiene que pasar antes de que alguien abra un tablero?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "brazing",
    "industries": [
      "plumb"
    ],
    "code": "1926.352 / 1926.353 / 1926.350",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.352(a), (b), (d), (e), (f): move the work or the fire hazards, confine heat and sparks, extinguisher, fire watch, opposite side of walls",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.352",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.353(b)(1), (c)(1): ventilation in confined spaces; enclosed spaces with zinc, lead, or cadmium-bearing filler",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.353",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.350(a)(9), (b)(1), (f)(3)-(f)(4), (g)(3): cylinders upright and away from the work, hose inspection, friction lighters",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.350",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.102(c)(1), Table E-1: filter lens shade numbers (torch brazing 3 or 4, soldering 2)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.102",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.252(c)(1)(v)(C)-(D): labels on cadmium brazing filler and fluorine-compound fluxes",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252",
        "kind": "standard"
      },
      {
        "label": "OSHA Welding, Cutting, and Brazing: Hazards and Solutions",
        "url": "https://www.osha.gov/welding-cutting-brazing/hazards-solutions",
        "kind": "guidance"
      },
      {
        "label": "OSHA Fact Sheet: Controlling Hazardous Fume and Gases during Welding (DSG FS-3647, 2013)",
        "url": "https://www.osha.gov/Publications/OSHA_FS-3647_Welding.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Soldering and Brazing with Torches",
        "hook": "A torch on a pipe can start a fire on the other side of a wall you can't see. Set up for fire before you light up.",
        "sections": [
          {
            "heading": "Before you light up",
            "items": [
              "When you can, move the work to a safe spot. If you can't, move anything that can burn out of the way, or protect it.",
              "Take real steps to contain heat and sparks, and protect anything that can burn but can't be moved.",
              "Working on a wall, floor, or ceiling? Heat and sparks can get through. Take the same precautions on the other side.",
              "Keep a fire extinguisher right there in the work area, ready to use."
            ]
          },
          {
            "heading": "Fire watch",
            "items": [
              "When normal precautions aren't enough, your company assigns an extra person to watch for fire.",
              "The watch keeps going after the torch is off, long enough to be sure no fire can start.",
              "The fire watch has to be told what fire hazards to look for and how to use the extinguisher."
            ]
          },
          {
            "heading": "Fumes and flux",
            "items": [
              "Brazing can expose you to metal fumes. Read the labels on your filler and flux. OSHA's general industry welding rule says fillers with a significant amount of cadmium must warn of cancer and lung and kidney harm, and fluxes with fluorine compounds must warn of eye and breathing harm.",
              "Position yourself so you don't breathe the fumes. Outdoors, stay upwind.",
              "In an enclosed space, torch work with zinc, lead, or cadmium-bearing filler needs mechanical ventilation.",
              "In a confined space, any welding, cutting, or heating needs mechanical ventilation."
            ]
          },
          {
            "heading": "Cylinders, hoses, and eyes",
            "items": [
              "Keep cylinders upright and secured, and far enough from the work that sparks, hot slag, or flame can't reach them. If that's not practical, use fire-resistant shields.",
              "Check your hoses at the start of every shift. A bad hose, or one you're not sure about, doesn't get used.",
              "Light the torch with a striker or other approved lighter, never a match or another hot torch.",
              "Protect your eyes. OSHA's guide is filter shade 3 or 4 for torch brazing, and shade 2 for soldering."
            ]
          }
        ],
        "ask": "Where's the extinguisher, and what's on the other side of the wall or ceiling we're working on today?"
      },
      "es": {
        "title": "Soldadura blanda y fuerte con soplete",
        "hook": "Un soplete en un tubo puede empezar un incendio al otro lado de una pared que no ves. Prepárate contra el fuego antes de encender.",
        "sections": [
          {
            "heading": "Antes de encender",
            "items": [
              "Cuando se pueda, lleva el trabajo a un lugar seguro. Si no se puede, quita del camino todo lo que pueda quemarse, o protégelo.",
              "Toma medidas reales para contener el calor y las chispas, y protege todo lo que se puede quemar pero no se puede mover.",
              "¿Trabajas en una pared, un piso o un techo? El calor y las chispas pueden pasar. Toma las mismas precauciones del otro lado.",
              "Ten un extintor ahí mismo en el área de trabajo, listo para usar."
            ]
          },
          {
            "heading": "Vigilancia contra incendios",
            "items": [
              "Cuando las precauciones normales no son suficientes, tu compañía asigna a una persona más para vigilar que no haya fuego.",
              "La vigilancia sigue después de apagar el soplete, el tiempo suficiente para estar seguros de que no se puede empezar un incendio.",
              "A quien vigila hay que decirle qué peligros de fuego buscar y cómo usar el extintor."
            ]
          },
          {
            "heading": "Humos y fundente",
            "items": [
              "La soldadura fuerte te puede exponer a humos de metal. Lee las etiquetas del material de aporte y del fundente. La regla de soldadura de OSHA para la industria general dice que el material con una cantidad importante de cadmio tiene que advertir de cáncer y daño a los pulmones y los riñones, y los fundentes con compuestos de flúor tienen que advertir de daño a los ojos y la respiración.",
              "Ponte de forma que no respires los humos. Afuera, quédate con el viento a tu espalda.",
              "En un espacio cerrado, el trabajo con soplete con zinc, plomo o material de aporte con cadmio necesita ventilación mecánica.",
              "En un espacio confinado, cualquier trabajo de soldar, cortar o calentar necesita ventilación mecánica."
            ]
          },
          {
            "heading": "Cilindros, mangueras y ojos",
            "items": [
              "Mantén los cilindros de pie y asegurados, y lo bastante lejos del trabajo para que las chispas, la escoria caliente o la llama no los alcancen. Si eso no se puede, usa protectores resistentes al fuego.",
              "Revisa tus mangueras al comienzo de cada turno. Una manguera en mal estado, o de la que no estás seguro, no se usa.",
              "Enciende el soplete con un encendedor de chispa u otro encendedor aprobado, nunca con un cerillo ni con otro soplete encendido.",
              "Protege tus ojos. La guía de OSHA es un filtro de tono 3 o 4 para soldadura fuerte con soplete, y tono 2 para soldadura blanda."
            ]
          }
        ],
        "ask": "¿Dónde está el extintor, y qué hay al otro lado de la pared o el techo donde vamos a trabajar hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "refrigerants",
    "industries": [
      "plumb"
    ],
    "code": "EPA 40 CFR 82.154 / 82.161; OSHA 1910.1200 / 1910.101",
    "minutes": 5,
    "sources": [
      {
        "label": "EPA 40 CFR 82.161(a)(1)-(a)(2), (a)(4): Section 608 technician certification types, apprentices, keeping a copy of the certificate",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-82/subpart-F/section-82.161",
        "kind": "standard"
      },
      {
        "label": "EPA 40 CFR 82.154(a)(1)-(a)(2): no knowing venting of refrigerant; de minimis releases; exempt substitutes",
        "url": "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-82/subpart-F/section-82.154",
        "kind": "standard"
      },
      {
        "label": "EPA Section 608 Technician Certification Requirements",
        "url": "https://epa.gov/section608/section-608-technician-certification-requirements",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.1200(g)(1), (g)(8): safety data sheet for each hazardous chemical, accessible each shift (construction: 1926.59 adopts 1910.1200)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.59: hazard communication in construction, identical to 1910.1200",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.59",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.101(a) (general industry): employer determines cylinders are in safe condition by visual inspection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.101",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet FS-3836 (shipyard guidance, not a rule for this work): Hazards during the Repair and Maintenance of Refrigeration Systems on Vessels (2015)",
        "url": "https://www.osha.gov/Publications/OSHA3836.pdf",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Pocket Guide: Chlorodifluoromethane (Refrigerant 22)",
        "url": "https://www.cdc.gov/niosh/npg/npgd0124.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Handling Refrigerants",
        "hook": "Refrigerant can look harmless coming out of a hose. But liquid refrigerant can cause frostbite, and in a tight space the vapor can push out the air you need to breathe.",
        "sections": [
          {
            "heading": "EPA certification",
            "items": [
              "This part is an EPA rule, not OSHA. If you maintain, service, or repair equipment in a way that could release refrigerant, you need EPA Section 608 technician certification.",
              "There are four types: Type I for small appliances, Type II for medium-, high-, and very high-pressure equipment, Type III for low-pressure equipment, and Universal for all of them.",
              "An apprentice can do this work without it only while a certified tech closely and continually supervises them.",
              "Certified techs keep a copy of their certificate at their place of business."
            ]
          },
          {
            "heading": "Never vent it",
            "items": [
              "Under EPA rules, no one may knowingly vent refrigerant into the air while servicing, repairing, or disposing of equipment.",
              "Tiny releases during a good-faith effort to recover or recycle refrigerant, done the way EPA requires, are not counted. A few substitute refrigerants have their own exemptions."
            ]
          },
          {
            "heading": "What it can do to you",
            "items": [
              "Liquid refrigerant on your skin or in your eyes can cause frostbite.",
              "Halocarbon refrigerants are heavier than air. In a confined space, a leak can push out the oxygen and suffocate you.",
              "Breathing high levels of the vapor can cause confusion, drowsiness, an irregular heartbeat, and even death.",
              "OSHA guidance written for ship repair says hot work can break these refrigerants down into toxic acids. It says to stop all hot work during a refrigerant leak."
            ]
          },
          {
            "heading": "Leaks, cylinders, and gear",
            "items": [
              "If liquid gets on your skin, wash it with water right away and treat it for frostbite.",
              "That same ship-repair guidance says to handle refrigerant cylinders with extreme caution, because escaping liquid can cause frostbite, and to store them a safe distance from open flame and hot metal.",
              "Under OSHA's general industry rules, your company has to make sure the gas cylinders it controls are in safe condition, as far as a visual inspection can tell.",
              "Your company also has to keep a safety data sheet for each refrigerant you use, where you can get to it every shift. That guidance also lists gloves and splash-proof goggles to keep liquid refrigerant off your skin and out of your eyes."
            ]
          }
        ],
        "ask": "Where's the safety data sheet for the refrigerant we're using today, and who on this crew is 608 certified for this equipment?"
      },
      "es": {
        "title": "Manejo de refrigerantes",
        "hook": "El refrigerante puede parecer inofensivo cuando sale de una manguera. Pero el refrigerante líquido puede causar congelación en la piel, y en un espacio cerrado el vapor puede sacar el aire que necesitas para respirar.",
        "sections": [
          {
            "heading": "Certificación de la EPA",
            "items": [
              "Esta parte es una regla de la EPA, no de OSHA. Si das mantenimiento, servicio o reparas equipo de una forma que podría soltar refrigerante, necesitas la certificación de técnico de la Sección 608 de la EPA.",
              "Hay cuatro tipos: Tipo I para aparatos pequeños, Tipo II para equipo de presión media, alta y muy alta, Tipo III para equipo de baja presión, y Universal para todos.",
              "Un aprendiz puede hacer este trabajo sin ella solo mientras un técnico certificado lo supervisa de cerca y todo el tiempo.",
              "Los técnicos certificados guardan una copia de su certificado en su lugar de trabajo."
            ]
          },
          {
            "heading": "Nunca lo sueltes al aire",
            "items": [
              "Bajo las reglas de la EPA, nadie puede soltar refrigerante al aire a propósito mientras da servicio, repara o desecha equipo.",
              "Las emisiones muy pequeñas durante un esfuerzo de buena fe para recuperar o reciclar refrigerante, hecho como lo exige la EPA, no cuentan. Algunos refrigerantes sustitutos tienen sus propias excepciones."
            ]
          },
          {
            "heading": "Lo que te puede hacer",
            "items": [
              "El refrigerante líquido en la piel o en los ojos puede causar congelación.",
              "Los refrigerantes halocarbonados pesan más que el aire. En un espacio confinado, una fuga puede sacar el oxígeno y asfixiarte.",
              "Respirar niveles altos del vapor puede causar confusión, sueño, latidos irregulares del corazón y hasta la muerte.",
              "Una guía de OSHA escrita para la reparación de barcos dice que el trabajo en caliente puede descomponer estos refrigerantes en ácidos tóxicos. Dice que se pare todo trabajo en caliente durante una fuga de refrigerante."
            ]
          },
          {
            "heading": "Fugas, cilindros y equipo de protección",
            "items": [
              "Si te cae líquido en la piel, lávala con agua de inmediato y trátala como congelación.",
              "Esa misma guía de reparación de barcos dice que manejes los cilindros de refrigerante con mucho cuidado, porque el líquido que se escapa puede causar congelación, y que se guarden a una distancia segura de llamas y metal caliente.",
              "Según las reglas de OSHA para la industria general, tu compañía tiene que asegurarse de que los cilindros de gas bajo su control estén en buenas condiciones, hasta donde se puede ver en una inspección visual.",
              "Tu compañía también tiene que tener una hoja de datos de seguridad para cada refrigerante que usas, donde la puedas consultar en cada turno. Esa guía también menciona guantes y gafas contra salpicaduras para que el refrigerante líquido no te toque la piel ni los ojos."
            ]
          }
        ],
        "ask": "¿Dónde está la hoja de datos de seguridad del refrigerante que vamos a usar hoy, y quién en este equipo tiene la certificación 608 para este equipo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "solar-falls",
    "industries": [
      "solar"
    ],
    "code": "1926.501 / 1926.502",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.501(a)(2): surfaces must have the strength to support employees",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(1): unprotected sides and edges 6 feet or more",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(4)(i)-(iii): holes, including skylights",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.501(b)(11): steep roofs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(d)(15), (d)(16)(iii), (d)(21): anchorages, free fall, inspection and removal of defective parts",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.502(i)(2)-(4): covers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.250(a)(1): materials stored in tiers secured against sliding, falling or collapse",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.250",
        "kind": "standard"
      },
      {
        "label": "OSHA Green Job Hazards: Solar Energy, Falls",
        "url": "https://www.osha.gov/green-jobs/solar/falls",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Solar Roofs: Falls and Panel Handling",
        "hook": "Solar crews work on roofs, climb ladders, and carry big panels. Every row you set takes away walking room you had this morning.",
        "sections": [
          {
            "heading": "The 6-foot line",
            "items": [
              "Installing panels with a fall of 6 feet or more? Your company has to protect you with a guardrail, a safety net, or a personal fall arrest system.",
              "On a steep roof, guardrails need toeboards. Nets or a fall arrest system also work.",
              "Your company has to make sure the roof is strong enough to hold you before you work on it.",
              "Maintenance on finished systems usually falls under general industry rules, where protection starts at 4 feet."
            ]
          },
          {
            "heading": "Skylights and holes",
            "items": [
              "As panels fill a roof, walkways shrink. You end up squeezing past skylights and roof hatches.",
              "Where you could fall more than 6 feet through a skylight, your company has to cover it, put a guardrail around it, or have you tied off.",
              "A cover over a hole has to hold twice the weight that could be on it. Secure it so wind, equipment, or people can't knock it loose, and mark it HOLE or COVER or color-code it."
            ]
          },
          {
            "heading": "Tying off",
            "items": [
              "Your anchor has to hold 5,000 pounds for each person tied to it. The other option is a complete system with a safety factor of at least two, used under a qualified person's supervision.",
              "Rig it so you can't free fall more than 6 feet or hit anything below.",
              "Inspect your harness and lanyard before each use for wear and damage. Anything defective comes out of service."
            ]
          },
          {
            "heading": "Getting panels up there",
            "items": [
              "Never climb a ladder carrying a panel.",
              "Use a ladder hoist, swing hoist, or truck-mounted crane or conveyor wherever you can.",
              "Stack panels so they can't slide, fall, or collapse."
            ]
          }
        ],
        "ask": "Walk the roof with me: where are the skylights and hatches, and where are we tying off today?"
      },
      "es": {
        "title": "Techos solares: caídas y manejo de paneles",
        "hook": "Las cuadrillas solares trabajan en techos, suben escaleras y cargan paneles grandes. Cada fila que instalas te quita espacio para caminar que tenías en la mañana.",
        "sections": [
          {
            "heading": "La regla de los 6 pies",
            "items": [
              "¿Vas a instalar paneles donde puedes caer 6 pies o más? Tu compañía tiene que protegerte con una baranda, una red de seguridad o un sistema personal de detención de caídas.",
              "En un techo muy inclinado, las barandas necesitan rodapiés. Las redes o un sistema de detención de caídas también sirven.",
              "Tu compañía tiene que asegurarse de que el techo sea lo bastante fuerte para aguantarte antes de que trabajes en él.",
              "El mantenimiento de sistemas ya terminados normalmente cae bajo las reglas de la industria general, donde la protección empieza a los 4 pies."
            ]
          },
          {
            "heading": "Tragaluces y huecos",
            "items": [
              "Mientras los paneles llenan el techo, los pasillos se hacen más angostos. Terminas pasando muy cerca de tragaluces y escotillas.",
              "Donde podrías caer más de 6 pies por un tragaluz, tu compañía tiene que taparlo, ponerle una baranda alrededor, o tenerte amarrado.",
              "La tapa de un hueco tiene que aguantar el doble del peso que podría tener encima. Asegúrala para que el viento, el equipo o la gente no la muevan, y márcala HOLE o COVER (hueco o tapa) o márcala con un color."
            ]
          },
          {
            "heading": "Cómo amarrarte",
            "items": [
              "Tu anclaje tiene que aguantar 5,000 libras por cada persona amarrada a él. La otra opción es un sistema completo con un factor de seguridad de por lo menos dos, usado bajo la supervisión de una persona calificada.",
              "Ajústalo para que no puedas caer libremente más de 6 pies ni pegar contra nada abajo.",
              "Revisa tu arnés y tu línea antes de cada uso para ver si tienen desgaste o daño. Lo que esté defectuoso se saca de servicio."
            ]
          },
          {
            "heading": "Cómo subir los paneles",
            "items": [
              "Nunca subas una escalera cargando un panel.",
              "Usa un elevador de escalera, un elevador giratorio, o una grúa o banda transportadora montada en camión siempre que puedas.",
              "Apila los paneles para que no se puedan resbalar, caer ni derrumbar."
            ]
          }
        ],
        "ask": "Recorran el techo conmigo: ¿dónde están los tragaluces y las escotillas, y dónde nos vamos a amarrar hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "solar-electrical",
    "industries": [
      "solar"
    ],
    "code": "1926.416 / 1926.417 / 1910.333",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1926.416(a)(1): de-energize and ground, or guard, circuits an employee could contact",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.416",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.417(b)-(c): deenergized circuits made inoperative and tagged at all points of energizing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.417",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(a)(1): deenergize live parts before work on or near them",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(b)(2)(ii)(C), (b)(2)(iii)(A), (b)(2)(iv)(B): stored energy, lock and tag on each disconnect, test to verify deenergized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(c)(2): only qualified persons on parts not deenergized",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(c)(3)(i)(A): 10 ft from overhead lines 50 kV or below for unqualified persons",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA Green Job Hazards: Solar Energy",
        "url": "https://www.osha.gov/green-jobs/solar",
        "kind": "guidance"
      },
      {
        "label": "OSHA Green Job Hazards: Solar Energy, Electrical",
        "url": "https://www.osha.gov/green-jobs/solar/electrical",
        "kind": "guidance"
      },
      {
        "label": "OSHA Green Job Hazards: Solar Energy, Lockout/Tagout",
        "url": "https://www.osha.gov/green-jobs/solar/lockout-tagout",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Solar Electrical Hazards",
        "hook": "Solar panels use sunlight to make electricity. You can't switch off the sun, so the panels and the circuits they feed can both hurt you.",
        "sections": [
          {
            "heading": "Why solar is different",
            "items": [
              "The more panels in a system, the more electricity it makes.",
              "Workers can get shocked and burned when they hook panels up to a circuit. Arc flash can burn you too.",
              "When you install or service panels, your company should have you cover them. That's on top of protecting you from the circuits."
            ]
          },
          {
            "heading": "Shut it off and lock it out",
            "items": [
              "Your company can't put you close enough to touch a circuit unless it's shut off and grounded, or guarded with insulation or another barrier.",
              "Each disconnect used to shut it off gets locked and tagged. Tags go at every point where it could be turned back on.",
              "Only the person who put a lock or tag on takes it off, unless your company has a set procedure for it.",
              "Stored electrical energy that could hurt someone gets released before work starts."
            ]
          },
          {
            "heading": "Test before you touch",
            "items": [
              "Shut off doesn't mean safe. A qualified person tests the parts you'll be exposed to and makes sure they're dead.",
              "That test also checks for voltage feeding back from another source, even when part of the circuit was shut off.",
              "Only qualified people work on parts that haven't been shut off. They know the special methods, protective gear, and insulated tools it takes."
            ]
          },
          {
            "heading": "Look up",
            "items": [
              "If you're not qualified for line work, stay at least 10 feet from overhead lines up to 50,000 volts. Higher voltage needs more room.",
              "That 10 feet counts for you and the longest conductive thing you're holding, like metal conduit or a metal ladder."
            ]
          }
        ],
        "ask": "Where are the disconnects on this system, and who is putting the locks and tags on today?"
      },
      "es": {
        "title": "Peligros eléctricos en sistemas solares",
        "hook": "Los paneles solares usan la luz del sol para producir electricidad. No puedes apagar el sol, así que tanto los paneles como los circuitos que alimentan te pueden lastimar.",
        "sections": [
          {
            "heading": "Por qué lo solar es diferente",
            "items": [
              "Entre más paneles tenga un sistema, más electricidad produce.",
              "Los trabajadores pueden recibir descargas y quemaduras al conectar los paneles a un circuito. Un arco eléctrico también te puede quemar.",
              "Cuando instales o des servicio a los paneles, tu compañía debe hacer que los cubras. Eso es además de protegerte de los circuitos."
            ]
          },
          {
            "heading": "Apágalo y bloquéalo",
            "items": [
              "Tu compañía no puede ponerte tan cerca que puedas tocar un circuito a menos que esté apagado y conectado a tierra, o protegido con aislamiento u otra barrera.",
              "Cada desconectador que se usa para apagarlo lleva candado y etiqueta. Las etiquetas van en cada punto donde se podría volver a encender.",
              "Solo la persona que puso el candado o la etiqueta la quita, a menos que tu compañía tenga un procedimiento establecido para eso.",
              "La energía eléctrica almacenada que pueda lastimar a alguien se descarga antes de empezar el trabajo."
            ]
          },
          {
            "heading": "Prueba antes de tocar",
            "items": [
              "Apagado no quiere decir seguro. Una persona calificada prueba las partes a las que vas a estar expuesto y se asegura de que no tengan corriente.",
              "Esa prueba también revisa si hay voltaje que regresa desde otra fuente, aunque parte del circuito ya se haya apagado.",
              "Solo las personas calificadas trabajan en partes que no se han apagado. Ellas conocen los métodos especiales, el equipo de protección y las herramientas aisladas que se necesitan."
            ]
          },
          {
            "heading": "Mira hacia arriba",
            "items": [
              "Si no estás calificado para trabajar en líneas, mantente por lo menos a 10 pies de las líneas eléctricas aéreas de hasta 50,000 voltios. Un voltaje más alto necesita más distancia.",
              "Esos 10 pies cuentan para ti y para el objeto conductor más largo que tengas en la mano, como un tubo conduit de metal o una escalera de metal."
            ]
          }
        ],
        "ask": "¿Dónde están los desconectadores de este sistema, y quién va a poner hoy los candados y las etiquetas?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "min-approach",
    "industries": [
      "util"
    ],
    "code": "1910.269(l) / 1926.960(b)-(c) / 1910.333(c)(3)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.269(l)(1): only qualified employees work on or near exposed energized parts",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(l)(3)(i), (l)(3)(iii): employer-established minimum approach distances and exceptions",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269 Table R-6: alternative minimum approach distances for voltages of 72.5 kV and less",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(x): definition of minimum approach distance",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.960(b)(1), (c)(1), Table V-5: construction counterpart (qualified employees, minimum approach distances)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.960",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.333(c)(3)(i): unqualified persons near overhead lines, 10 ft plus 4 in per 10 kV over 50 kV",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Minimum Approach Distances",
        "hook": "The minimum approach distance is the closest you may get to an energized part. It's not a target. It's a line you don't cross.",
        "sections": [
          {
            "heading": "Who works near energized lines",
            "items": [
              "Only qualified employees may work on or with exposed energized lines or parts.",
              "Only qualified employees may work in areas with unguarded, uninsulated energized lines or parts at 50 volts or more. If you're not qualified, you don't work in those areas."
            ]
          },
          {
            "heading": "The rule",
            "items": [
              "Your company has to set minimum approach distances for this work. They can't be any shorter than the distances in OSHA's tables.",
              "You never get closer than that distance, and you never bring a conductive object closer, unless you're insulated from the part or the part is insulated from you.",
              "Rubber insulating gloves, or gloves and sleeves, count as insulation from the part you're working on, as long as you control that part so no bare part of your body is exposed to it.",
              "Barehand work is the other exception, and it has its own special rules."
            ]
          },
          {
            "heading": "Common distances",
            "items": [
              "OSHA has an alternative table for systems 72.5 kV and under, at sites 3,000 feet above sea level or lower. Here are some phase-to-ground distances from it. The voltage is the system's phase-to-phase voltage. For single-phase, use voltage to ground.",
              "50 to 300 volts: avoid contact. 301 to 750 volts: 1.09 feet. 751 volts to 5 kV: 2.07 feet. 5.1 to 15 kV: 2.14 feet. 15.1 to 36 kV: 2.53 feet.",
              "Higher voltages need more distance. Your company's distance for this job can be bigger than the table. Use the one you're given."
            ]
          },
          {
            "heading": "Not qualified? Ten feet",
            "items": [
              "Under OSHA's general electrical rules, a worker who isn't qualified stays at least 10 feet from unguarded, energized overhead lines up to 50 kV to ground. Over 50 kV, add 4 inches for every 10 kV.",
              "That counts for you and the longest conductive object you're holding, whether you're up high or on the ground.",
              "If an object isn't rated as insulating for that voltage, treat it as conductive."
            ]
          }
        ],
        "ask": "What voltage are we working near today, and what is our minimum approach distance for it?"
      },
      "es": {
        "title": "Distancias mínimas de acercamiento",
        "hook": "La distancia mínima de acercamiento es lo más cerca que puedes llegar a una parte energizada. No es una meta. Es una línea que no se cruza.",
        "sections": [
          {
            "heading": "Quién trabaja cerca de líneas energizadas",
            "items": [
              "Solo los empleados calificados pueden trabajar en o con líneas o partes energizadas expuestas.",
              "Solo los empleados calificados pueden trabajar en áreas con líneas o partes energizadas sin protección ni aislamiento, de 50 voltios o más. Si no estás calificado, no trabajas en esas áreas."
            ]
          },
          {
            "heading": "La regla",
            "items": [
              "Tu compañía tiene que fijar las distancias mínimas de acercamiento para este trabajo. No pueden ser más cortas que las distancias de las tablas de OSHA.",
              "Nunca te acercas más que esa distancia, y nunca acercas un objeto conductor más que eso, a menos que estés aislado de la parte o la parte esté aislada de ti.",
              "Los guantes aislantes de hule, o guantes y mangas, cuentan como aislamiento de la parte en la que trabajas, siempre que controles esa parte de modo que ninguna parte de tu cuerpo sin protección quede expuesta a ella.",
              "El trabajo a mano desnuda es la otra excepción, y tiene sus propias reglas especiales."
            ]
          },
          {
            "heading": "Distancias comunes",
            "items": [
              "OSHA tiene una tabla alternativa para sistemas de 72.5 kV o menos, en sitios a 3,000 pies sobre el nivel del mar o menos. Estas son algunas distancias de fase a tierra de esa tabla. El voltaje es el voltaje entre fases del sistema. Para sistemas monofásicos, usa el voltaje a tierra.",
              "De 50 a 300 voltios: evita el contacto. De 301 a 750 voltios: 1.09 pies. De 751 voltios a 5 kV: 2.07 pies. De 5.1 a 15 kV: 2.14 pies. De 15.1 a 36 kV: 2.53 pies.",
              "Los voltajes más altos necesitan más distancia. La distancia de tu compañía para este trabajo puede ser mayor que la de la tabla. Usa la que te den."
            ]
          },
          {
            "heading": "¿No estás calificado? Diez pies",
            "items": [
              "Según las reglas eléctricas generales de OSHA, un trabajador que no está calificado se mantiene al menos a 10 pies de líneas aéreas energizadas sin protección de hasta 50 kV a tierra. Arriba de 50 kV, se suman 4 pulgadas por cada 10 kV.",
              "Eso cuenta para ti y para el objeto conductor más largo que tengas en la mano, ya sea que estés en lo alto o en el suelo.",
              "Si un objeto no tiene clasificación de aislante para ese voltaje, trátalo como conductor."
            ]
          }
        ],
        "ask": "¿Cerca de qué voltaje estamos trabajando hoy, y cuál es nuestra distancia mínima de acercamiento para ese voltaje?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "grounding",
    "industries": [
      "util"
    ],
    "code": "1926.962 / 1910.269(n)(8)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.269(n)(8): removal of grounds for test",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.962(b), (c), (d)(1), (e), (f)(1)-(2), (h): grounding for the protection of employees (power line work)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.962",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269 Appendix C: protection from hazardous differences in electric potential",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269AppC",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Protective Grounding",
        "hook": "A line that's been switched off can still become energized. Protective grounds are what protect you if it does.",
        "sections": [
          {
            "heading": "Deenergized means grounded too",
            "items": [
              "To work a line or equipment as deenergized, it has to be deenergized under the rules and then grounded.",
              "There's only one exception. Your company has to show that grounding is impractical or would be more dangerous, and that there's no chance of contact with another energized source and no induced voltage hazard."
            ]
          },
          {
            "heading": "Test, then ground",
            "items": [
              "Unless a ground is already in place, you test the line or equipment for voltage before you put grounds on.",
              "You're checking that nominal voltage is gone before any ground goes on."
            ]
          },
          {
            "heading": "The equipotential zone",
            "items": [
              "Grounds have to be placed and arranged so no one is exposed to a dangerous difference in voltage across their body.",
              "That's called an equipotential zone. It protects workers inside it. It does not protect anyone standing wholly or partly outside it.",
              "Your company has to provide grounding equipment that can carry the maximum fault current, and no smaller than No. 2 copper in ampacity. Ground cables should be as short as possible."
            ]
          },
          {
            "heading": "Order on, order off",
            "items": [
              "Putting grounds on: attach the ground end first. Then attach the other end to the line with a live-line tool.",
              "Taking grounds off: remove the line end first with a live-line tool. The ground end comes off last.",
              "On lines 600 volts or less, other insulating equipment may be used instead of a live-line tool, under certain conditions. Ask before you assume.",
              "Grounds come off for a test only when your company allows it. Then you use insulating equipment and stay protected in case the line becomes energized."
            ]
          }
        ],
        "ask": "Where are the grounds going on today, and in what order do they come off?"
      },
      "es": {
        "title": "Puesta a tierra de protección",
        "hook": "Una línea que se apagó todavía puede quedar energizada. Las tierras de protección son las que te protegen si eso pasa.",
        "sections": [
          {
            "heading": "Desenergizado también quiere decir aterrizado",
            "items": [
              "Para trabajar una línea o un equipo como desenergizado, tiene que desenergizarse según las reglas y luego aterrizarse.",
              "Hay una sola excepción. Tu compañía tiene que demostrar que aterrizar es impráctico o sería más peligroso, y que no hay ninguna posibilidad de contacto con otra fuente energizada ni peligro de voltaje inducido."
            ]
          },
          {
            "heading": "Primero prueba, luego aterriza",
            "items": [
              "A menos que ya haya una tierra puesta, pruebas la línea o el equipo para ver si tiene voltaje antes de poner las tierras.",
              "Estás comprobando que ya no hay voltaje nominal antes de poner cualquier tierra."
            ]
          },
          {
            "heading": "La zona equipotencial",
            "items": [
              "Las tierras se tienen que colocar y acomodar de manera que nadie quede expuesto a una diferencia peligrosa de voltaje a través de su cuerpo.",
              "Eso se llama zona equipotencial. Protege a los trabajadores que están dentro de ella. No protege a nadie que esté total o parcialmente fuera de ella.",
              "Tu compañía tiene que darte equipo de puesta a tierra que aguante la corriente máxima de falla, y con una capacidad de corriente no menor a la del cobre No. 2. Los cables de tierra deberían ser lo más cortos posible."
            ]
          },
          {
            "heading": "Orden para poner, orden para quitar",
            "items": [
              "Para poner las tierras: conecta primero el extremo de tierra. Después conecta el otro extremo a la línea con una pértiga aislada.",
              "Para quitar las tierras: quita primero el extremo de la línea con una pértiga aislada. El extremo de tierra se quita al final.",
              "En líneas de 600 voltios o menos, se puede usar otro equipo aislante en lugar de la pértiga, bajo ciertas condiciones. Pregunta antes de suponer.",
              "Las tierras se quitan para una prueba solo cuando tu compañía lo permite. En ese caso usas equipo aislante y te mantienes protegido por si la línea se energiza."
            ]
          }
        ],
        "ask": "¿Dónde se van a poner las tierras hoy, y en qué orden se quitan?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "pole-climbing",
    "industries": [
      "util"
    ],
    "code": "1910.269(g)(2)(iv) / 1910.269(q)(1) / 1926.954(b) / 1926.964(a)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.269(g)(2)(iv)(A), (C)(2)-(3), (D), (E), (F): work-positioning inspection, fall protection on poles and towers, free fall, anchorages, snaphooks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(a)(4): condition of poles determined before work",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(q)(1)(i): elevated structures able to take the added stresses",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.954(b)(3)(i), (iii)-(vi), incl. Note 2: construction counterpart (inspection, fall protection, free fall, anchorages, snaphooks, proficiency)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.954",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.964(a)(2): construction counterpart, elevated structures",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.964",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269 Appendix D: methods of inspecting and testing wood poles",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269AppD",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Climbing Poles and Structures",
        "hook": "A pole can look fine from the ground and still be rotten inside. Check the pole and your gear before you leave the ground.",
        "sections": [
          {
            "heading": "Check the pole first",
            "items": [
              "Before anyone climbs, your company has to make sure the pole can take the extra stress of climbing and the work. If it can't, it gets braced or supported so it won't fail.",
              "Someone qualified should look for buckling at the ground line or an odd angle, horizontal cracks, hollow spots, woodpecker holes, rot, and burn marks.",
              "One check is a hammer test by someone qualified to inspect the pole. Sound wood gives a clear ring and the hammer bounces back sharply. A dull sound or a weak bounce points to decay. A pole with a lot of decay is unsafe."
            ]
          },
          {
            "heading": "Fall protection on the pole",
            "items": [
              "More than 4 feet up on a pole, tower, or similar structure that holds up power lines, you use a personal fall arrest system, work-positioning equipment, or a fall restraint system, unless your company has given you other fall protection that meets OSHA's rules.",
              "Qualified climbers also use fall protection while climbing or changing location, unless your company can show it's not workable or creates a greater hazard.",
              "Work-positioning systems are rigged so you can't free fall more than 2 feet."
            ]
          },
          {
            "heading": "Inspect your gear",
            "items": [
              "Inspect your work-positioning equipment before use every day. If it's not in safe working condition, don't use it.",
              "Anchorages for work positioning have to hold at least twice the impact load of a fall, or 3,000 pounds, whichever is more.",
              "Unless a snaphook is a locking type designed for it, don't hook it to webbing, rope, another snaphook, or a D ring that already has a connector on it."
            ]
          },
          {
            "heading": "Training comes first",
            "items": [
              "You're not treated as qualified to climb until your company makes sure you're skilled at climbing and using fall protection.",
              "Until then, and that includes trainees, you use fall protection any time you're more than 4 feet above the ground."
            ]
          }
        ],
        "ask": "Who's climbing today, and who checked the pole and the gear?"
      },
      "es": {
        "title": "Subir postes y estructuras",
        "hook": "Un poste puede verse bien desde el suelo y estar podrido por dentro. Revisa el poste y tu equipo antes de despegarte del suelo.",
        "sections": [
          {
            "heading": "Primero revisa el poste",
            "items": [
              "Antes de que alguien suba, tu compañía tiene que asegurarse de que el poste aguante el esfuerzo extra de la subida y del trabajo. Si no aguanta, se arriostra o se sostiene para que no falle.",
              "Una persona calificada debe buscar pandeo a nivel del suelo o un ángulo raro, grietas horizontales, huecos, agujeros de pájaro carpintero, podredumbre y marcas de quemadura.",
              "Una revisión es la prueba del martillo, hecha por una persona calificada para inspeccionar el poste. La madera sana suena claro y el martillo rebota con fuerza. Un sonido sordo o un rebote débil indica podredumbre. Un poste con mucha podredumbre no es seguro."
            ]
          },
          {
            "heading": "Protección contra caídas en el poste",
            "items": [
              "A más de 4 pies de altura en un poste, una torre o una estructura parecida que sostiene líneas eléctricas, usas un sistema personal de detención de caídas, equipo de posicionamiento o un sistema de restricción de caídas, a menos que tu compañía te haya dado otra protección contra caídas que cumpla con las reglas de OSHA.",
              "Los trabajadores calificados también usan protección contra caídas mientras suben o cambian de posición, a menos que tu compañía pueda demostrar que no se puede o que crea un peligro mayor.",
              "Los sistemas de posicionamiento se arman para que no puedas caer libremente más de 2 pies."
            ]
          },
          {
            "heading": "Revisa tu equipo",
            "items": [
              "Revisa tu equipo de posicionamiento antes de usarlo cada día. Si no está en buenas condiciones, no lo uses.",
              "Los anclajes para posicionamiento tienen que aguantar por lo menos el doble de la carga de impacto de una caída, o 3,000 libras, lo que sea mayor.",
              "A menos que el mosquetón sea de tipo con seguro y esté diseñado para eso, no lo enganches a correas, cuerda, otro mosquetón ni a un anillo D que ya tenga otro conector."
            ]
          },
          {
            "heading": "Primero el entrenamiento",
            "items": [
              "No se te considera calificado para subir hasta que tu compañía se asegure de que sabes subir y usar la protección contra caídas.",
              "Hasta entonces, y eso incluye a los aprendices, usas protección contra caídas cada vez que estés a más de 4 pies del suelo."
            ]
          }
        ],
        "ask": "¿Quién va a subir hoy, y quién revisó el poste y el equipo?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "manholes",
    "industries": [
      "util",
      "plumb"
    ],
    "code": "1910.268(o) / 1910.269(e) / 1910.269(t)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.268(o)(1), (o)(2), (o)(4), (o)(5): telecom manholes: guarding, atmosphere testing and ventilation, ladders, flames",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.268",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(e)(3)-(e)(14): enclosed spaces: rescue equipment, cover removal, guarding, attendants, calibration, testing, ventilation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(t)(1)-(t)(3): underground electrical installations: ladders, lowering equipment, attendants, communications",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA Confined Spaces (manholes listed as an example)",
        "url": "https://www.osha.gov/confined-spaces",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Manholes and Vaults",
        "hook": "A manhole can look empty and still have bad air. Nobody goes down until the air is tested.",
        "sections": [
          {
            "heading": "Opening it up",
            "items": [
              "The rules in this talk come from OSHA's telecom and electric utility standards, and they apply to that work. OSHA also lists manholes as an example of a confined space. Other crews, like plumbing and sewer crews, follow OSHA's confined space rules, which have their own steps. Your supervisor will tell you which rules apply.",
              "Under the electric utility rule, before a cover comes off, your company has to decide if it's safe to remove, checking for things like pressure, heat, and a hazardous atmosphere.",
              "Once it's off, guard the opening right away with a railing, a temporary cover, or another barrier. That keeps people from falling in and keeps objects from falling on the crew below."
            ]
          },
          {
            "heading": "Test the air",
            "items": [
              "Before entry, the air is tested for low oxygen, unless continuous forced-air ventilation is protecting you. It's also tested for flammable gas.",
              "If gas or low oxygen is found, ventilate. When continuous forced air is used, it starts before entry, runs until everyone is out, and comes from a clean source.",
              "Test meters have to be kept in calibration.",
              "Using an open flame? Test for flammable gas right before you light it, and at least once an hour while it's in use."
            ]
          },
          {
            "heading": "Someone stays up top",
            "items": [
              "On many jobs, a person with first-aid training has to stay at the surface near the opening while work goes on below. One example is a manhole with energized electric equipment.",
              "Your company has to provide equipment for a prompt, safe rescue. In electric vaults, everyone on the job keeps reliable communication, like two-way radios."
            ]
          },
          {
            "heading": "Getting in and out",
            "items": [
              "Use a ladder or other climbing device to get in and out of a manhole or vault deeper than 4 feet. Never climb on cables or hangers.",
              "Anything used to lower tools has to hold the weight and be checked for defects first. Before anything gets lowered, everyone below moves out from under the opening."
            ]
          }
        ],
        "ask": "Who's testing the air today, and who's staying up top?"
      },
      "es": {
        "title": "Registros y bóvedas",
        "hook": "Un registro puede verse vacío y aun así tener aire malo. Nadie baja hasta que se pruebe el aire.",
        "sections": [
          {
            "heading": "Al abrirlo",
            "items": [
              "Las reglas de esta charla vienen de las normas de OSHA para telecomunicaciones y servicios eléctricos, y aplican a ese trabajo. OSHA también pone los registros como ejemplo de espacio confinado. Otras cuadrillas, como las de plomería y drenaje, siguen las reglas de OSHA para espacios confinados, que tienen sus propios pasos. Tu supervisor te dirá cuáles reglas aplican.",
              "Según la regla de servicios eléctricos, antes de quitar una tapa, tu compañía tiene que decidir si es seguro quitarla, revisando cosas como presión, calor y una atmósfera peligrosa.",
              "En cuanto se quite, protege la abertura de inmediato con una baranda, una tapa temporal u otra barrera. Así nadie se cae adentro y no caen objetos sobre la cuadrilla de abajo."
            ]
          },
          {
            "heading": "Prueba el aire",
            "items": [
              "Antes de entrar, se prueba el aire para ver si falta oxígeno, a menos que te esté protegiendo ventilación forzada continua. También se prueba para gases inflamables.",
              "Si se encuentra gas o falta de oxígeno, se ventila. Cuando se usa aire forzado continuo, empieza antes de entrar, sigue hasta que todos salgan y viene de una fuente limpia.",
              "Los medidores de prueba se tienen que mantener calibrados.",
              "¿Vas a usar una llama abierta? Prueba si hay gas inflamable justo antes de encenderla, y por lo menos una vez por hora mientras se usa."
            ]
          },
          {
            "heading": "Alguien se queda arriba",
            "items": [
              "En muchos trabajos, una persona con entrenamiento en primeros auxilios tiene que quedarse en la superficie cerca de la abertura mientras se trabaja abajo. Un ejemplo es un registro con equipo eléctrico energizado.",
              "Tu compañía tiene que dar equipo para un rescate rápido y seguro. En bóvedas eléctricas, todos en el trabajo mantienen comunicación confiable, como radios de dos vías."
            ]
          },
          {
            "heading": "Para entrar y salir",
            "items": [
              "Usa una escalera u otro medio para subir y bajar en un registro o bóveda de más de 4 pies de profundidad. Nunca te subas en los cables ni en los soportes.",
              "Lo que se use para bajar herramientas tiene que aguantar el peso y revisarse antes por defectos. Antes de bajar cualquier cosa, todos los de abajo se quitan de debajo de la abertura."
            ]
          }
        ],
        "ask": "¿Quién va a probar el aire hoy, y quién se queda arriba?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "tower-climbing",
    "industries": [
      "util"
    ],
    "code": "1926.502(d) / OSHA CPL 02-01-056",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1926.502(d)(15) anchorages, (d)(16)(iii) free fall, (d)(19) impact loading, (d)(20) rescue, (d)(21) inspection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
        "kind": "standard"
      },
      {
        "label": "OSHA Communication Towers: hazards overview",
        "url": "https://www.osha.gov/communication-towers",
        "kind": "guidance"
      },
      {
        "label": "OSHA/FCC Communication Tower Best Practices (OSHA 3877, 2017, advisory)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3877.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Directive CPL 02-01-056, Inspection Procedures for Accessing Communication Towers by Hoist, Appendix A (II, V, VIII, IX, XIX)",
        "url": "https://www.osha.gov/sites/default/files/enforcement/directives/CPL_02-01-056.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Communication Tower Climbing",
        "hook": "Tower crews face falls from great heights, falling objects, hoist hazards and bad weather. Every move up or down the tower is a chance to fall.",
        "sections": [
          {
            "heading": "100 percent tie-off",
            "items": [
              "OSHA and FCC best practices call for 100 percent tie-off and zero tolerance for free climbing. Supervisors should enforce 100 percent tie-off at all times when anyone is climbing.",
              "On construction work, your fall arrest system has to be rigged so you can't free fall more than 6 feet or hit any lower level.",
              "Each anchor has to hold 5,000 pounds for each person tied to it, or be part of a system a qualified person designed and oversees."
            ]
          },
          {
            "heading": "Inspect your gear",
            "items": [
              "Inspect your harness, lanyards and connectors before each use. Anything worn or damaged comes out of service.",
              "Gear that has caught a fall comes out of service right away. It can't be used again until a competent person says it's good.",
              "If the right safety gear isn't here, or it isn't working, don't climb."
            ]
          },
          {
            "heading": "Have a rescue plan",
            "items": [
              "Your company has to provide prompt rescue if someone falls, or make sure workers can rescue themselves.",
              "Best practices call for an emergency action plan for every site. Know where the rescue equipment is before anyone goes up.",
              "A competent person should be on site at all times, with the authority to stop someone who isn't fit to climb."
            ]
          },
          {
            "heading": "Hoists and weather",
            "items": [
              "Under OSHA's tower hoist directive, people ride the hoist line only to reach or leave a work spot, in a personnel platform, or a boatswain's chair if a platform can't be used.",
              "No other load goes on a hoist line carrying people. Never use the gin pole raising line to raise or lower a person.",
              "There's a trial lift right before people go on the line. The operator stays at the controls, and you stay in sight of the operator or signal person.",
              "Watch overhead and stay clear of the load during lifts. Don't work at height when the weather makes it unsafe."
            ]
          }
        ],
        "ask": "Where is the rescue gear for this site, and who is our competent person today?"
      },
      "es": {
        "title": "Subir torres de comunicación",
        "hook": "Las cuadrillas de torres enfrentan caídas desde gran altura, objetos que caen, peligros de los malacates y mal tiempo. Cada movimiento para subir o bajar la torre es una oportunidad de caerte.",
        "sections": [
          {
            "heading": "Amarrado el 100 por ciento",
            "items": [
              "Las buenas prácticas de OSHA y la FCC piden estar amarrado el 100 por ciento del tiempo y cero tolerancia para subir sin protección. Los supervisores deben exigir que todos estén amarrados el 100 por ciento del tiempo mientras suben o bajan.",
              "En trabajos de construcción, tu sistema de detención de caídas tiene que estar armado para que no caigas libremente más de 6 pies ni pegues contra ningún nivel más bajo.",
              "Cada anclaje tiene que aguantar 5,000 libras por cada persona amarrada a él, o ser parte de un sistema que una persona calificada diseñó y supervisa."
            ]
          },
          {
            "heading": "Revisa tu equipo",
            "items": [
              "Revisa tu arnés, tus líneas y tus conectores antes de cada uso. Lo que esté gastado o dañado se saca de servicio.",
              "El equipo que ya detuvo una caída se saca de servicio de inmediato. No se puede volver a usar hasta que una persona competente diga que está bien.",
              "Si aquí no está el equipo de seguridad correcto, o no funciona, no subas."
            ]
          },
          {
            "heading": "Ten un plan de rescate",
            "items": [
              "Tu compañía tiene que dar un rescate rápido si alguien se cae, o asegurarse de que los trabajadores puedan rescatarse solos.",
              "Las buenas prácticas piden un plan de acción de emergencia para cada sitio. Sepan dónde está el equipo de rescate antes de que alguien suba.",
              "Debe haber una persona competente en el sitio todo el tiempo, con autoridad para detener a alguien que no esté en condiciones de subir."
            ]
          },
          {
            "heading": "Malacates y clima",
            "items": [
              "Según la directiva de OSHA sobre malacates en torres, las personas van en la línea del malacate solo para llegar a su puesto de trabajo o salir de él, en una plataforma para personal, o en una silla de contramaestre si no se puede usar una plataforma.",
              "No se pone ninguna otra carga en una línea que lleva personas. Nunca uses la línea de izar de la pluma (gin pole) para subir o bajar a una persona.",
              "Se hace un levantamiento de prueba justo antes de que las personas se suban a la línea. El operador se queda en los controles, y tú te quedas a la vista del operador o del señalero.",
              "Fíjate arriba y mantente lejos de la carga durante los levantamientos. No trabajes en altura cuando el clima lo hace inseguro."
            ]
          }
        ],
        "ask": "¿Dónde está el equipo de rescate de este sitio, y quién es hoy nuestra persona competente?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "rf-exposure",
    "industries": [
      "util"
    ],
    "code": "1910.97 (advisory limit) / 1926.54(l)",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1910.97(a)(2)(i)-(ii) radiation protection guide, (a)(3)(i) warning symbol",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.97",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.54(l): microwave exposure limit in construction",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.54",
        "kind": "standard"
      },
      {
        "label": "OSHA Radiofrequency and Microwave Radiation: Standards (1910.97 limit unenforceable; FCC rules are not OSHA regulations)",
        "url": "https://www.osha.gov/radiofrequency-and-microwave-radiation/standards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Radiofrequency and Microwave Radiation: Hazards and Solutions",
        "url": "https://www.osha.gov/radiofrequency-and-microwave-radiation/hazards-solutions",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hazard Information Bulletin: Radiofrequency Radiation-caused Burns (1990), linked from OSHA's RF Health Effects page",
        "url": "https://www.osha.gov/publications/hib19900905",
        "kind": "guidance"
      },
      {
        "label": "OSHA/FCC Communication Tower Best Practices (OSHA 3877, 2017, advisory)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3877.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "RF Energy Near Antennas",
        "hook": "You can't see radio-frequency energy. At high enough levels it heats the body, and OSHA warns it can cause blindness and sterility.",
        "sections": [
          {
            "heading": "What the rules say",
            "items": [
              "OSHA's general industry rule, 1910.97, sets an RF guide of 10 milliwatts per square centimeter, averaged over any 6-minute period. But it's written as a recommendation, and OSHA says that limit can't be enforced.",
              "On construction work, a separate OSHA rule says you can't be exposed to microwave power above that same 10 milliwatt level.",
              "The FCC has its own RF exposure rules for transmitters. Those are not OSHA rules. Best practices say tower owners should have a way to manage RF hazards at their towers."
            ]
          },
          {
            "heading": "Know the warning sign",
            "items": [
              "OSHA's RF warning sign is a red triangle over a black one, reading \"Warning, Radio-Frequency Radiation Hazard.\" Newer sign designs are also used.",
              "The 1910.97 guide covers your whole body and parts of it. Your eyes and testicles may be harmed by RF levels well above the guide."
            ]
          },
          {
            "heading": "Burns from cables near AM towers",
            "items": [
              "Near AM radio towers, RF energy can put current into crane cables. The cable acts like an antenna.",
              "Sparks can jump just before and after a worker grabs the cable. Those sparks have burned workers.",
              "OSHA's fixes: insulate the crane hook from the cable, or ground the cable. If that can't be done, wear rubber-insert leather gloves, long sleeves, a hard hat and safety glasses."
            ]
          }
        ],
        "ask": "Where are the RF warning signs on this site, and is any crane or cable we're using close to an AM radio tower?"
      },
      "es": {
        "title": "Energía de radiofrecuencia cerca de antenas",
        "hook": "La energía de radiofrecuencia no se ve. A niveles bastante altos calienta el cuerpo, y OSHA advierte que puede causar ceguera y esterilidad.",
        "sections": [
          {
            "heading": "Lo que dicen las reglas",
            "items": [
              "La regla de OSHA para la industria general, la 1910.97, pone una guía de RF de 10 milivatios por centímetro cuadrado, como promedio en cualquier periodo de 6 minutos. Pero está escrita como recomendación, y OSHA dice que ese límite no se puede hacer cumplir.",
              "En trabajos de construcción, otra regla de OSHA dice que no te pueden exponer a potencia de microondas por encima de ese mismo nivel de 10 milivatios.",
              "La FCC tiene sus propias reglas de exposición a RF para los transmisores. Esas no son reglas de OSHA. Las buenas prácticas dicen que los dueños de torres deben tener una forma de manejar los peligros de RF en sus torres."
            ]
          },
          {
            "heading": "Conoce el letrero de advertencia",
            "items": [
              "El letrero de advertencia de RF de OSHA es un triángulo rojo encima de uno negro, que dice \"Warning, Radio-Frequency Radiation Hazard\" (peligro de radiación de radiofrecuencia). También se usan diseños más nuevos.",
              "La guía de la 1910.97 cubre todo tu cuerpo y también partes de él. Los ojos y los testículos pueden dañarse con niveles de RF muy por encima de la guía."
            ]
          },
          {
            "heading": "Quemaduras por cables cerca de torres de AM",
            "items": [
              "Cerca de las torres de radio AM, la energía de RF puede meter corriente en los cables de las grúas. El cable funciona como una antena.",
              "Pueden saltar chispas justo antes y después de que un trabajador agarra el cable. Esas chispas han quemado a trabajadores.",
              "Las soluciones de OSHA: aislar el gancho de la grúa del cable, o conectar el cable a tierra. Si eso no se puede, usa guantes de cuero con forro de hule, manga larga, casco y lentes de seguridad."
            ]
          }
        ],
        "ask": "¿Dónde están los letreros de advertencia de RF en este sitio, y hay alguna grúa o cable que estemos usando cerca de una torre de radio AM?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "tree-electrical",
    "industries": [
      "land",
      "util"
    ],
    "code": "1910.333(c)(3) / 1910.269(r)(1)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.333(c)(3)(i)(A)-(B): unqualified persons, 10 feet from overhead lines; (c)(3)(iii)(A) vehicles and mechanical equipment",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(a)(1)(i)(E): scope, line-clearance tree trimming",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(r)(1)(i)-(vi): line-clearance tree trimming, electrical hazards",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.269(x): definitions of line-clearance tree trimmer (Note 2) and line-clearance tree trimming",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269",
        "kind": "standard"
      },
      {
        "label": "OSHA 3861: Electricity and Tree Care Work",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3861.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3940: Solutions for Tree Care Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3940.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Tree Work Near Power Lines",
        "hook": "Contact with electricity is one of the leading causes of death for tree care workers. You don't have to touch the line yourself. A limb or a tool touching it can bring the power to you.",
        "sections": [
          {
            "heading": "Assume it's live",
            "items": [
              "Treat every overhead line as energized, including phone and cable lines.",
              "Before work starts, you should be trained to spot power line hazards and stay clear of them.",
              "Your company can ask the utility to shut off nearby lines. If a line is going to be shut off, that's arranged with whoever runs it.",
              "Power can travel through the ground. Don't stand close to grounding equipment."
            ]
          },
          {
            "heading": "The 10-foot line",
            "items": [
              "If you are not a line-clearance tree trimmer or other qualified worker, you and anything you hold stay at least 10 feet from lines of 50,000 volts or less. Higher voltage means more distance.",
              "Anything not rated as insulation for that voltage counts, like pole saws, ropes and ladders. Make sure no limb or tool touches a line.",
              "Bucket trucks and other equipment with booms keep 10 feet too, unless it's an insulated lift run by a qualified worker.",
              "Never use a metal ladder near overhead lines. Don't use corded power tools in a tree near live lines."
            ]
          },
          {
            "heading": "Line-clearance work",
            "items": [
              "Cutting or removing trees within 10 feet of a line, or more for higher voltage, is line-clearance tree trimming. Only line-clearance tree trimmers or other qualified workers do it. They're trained in its special techniques and hazards.",
              "They still have to stay outside the minimum approach distances in the federal tables. A branch touching a line, or inside those distances, comes off only with insulating tools or equipment.",
              "If a trimmer will get closer than 10 feet to a line over 750 volts, a second line-clearance trimmer has to be within normal voice range.",
              "No line-clearance trimming when weather makes it hazardous, like thunderstorms nearby, high winds, or snow or ice storms."
            ]
          }
        ],
        "ask": "Where's the closest power line to the tree we're working today, and who on this crew is trained to work inside 10 feet of it?"
      },
      "es": {
        "title": "Trabajo en árboles cerca de líneas eléctricas",
        "hook": "El contacto con la electricidad es una de las principales causas de muerte en el trabajo de cuidado de árboles. No tienes que tocar la línea tú mismo. Una rama o una herramienta que la toque te puede pasar la corriente.",
        "sections": [
          {
            "heading": "Supón que tiene corriente",
            "items": [
              "Trata toda línea aérea como si tuviera corriente, incluso las de teléfono y cable.",
              "Antes de empezar, te deben capacitar para reconocer los peligros de las líneas eléctricas y mantenerte lejos de ellas.",
              "Tu compañía puede pedirle a la compañía de luz que corte la corriente de las líneas cercanas. Si se va a cortar la corriente de una línea, eso se arregla con quien la opera.",
              "La corriente puede viajar por el suelo. No te pares cerca del equipo de conexión a tierra."
            ]
          },
          {
            "heading": "La línea de 10 pies",
            "items": [
              "Si no eres podador de despeje de líneas ni otro trabajador calificado, tú y todo lo que tengas en la mano se quedan a por lo menos 10 pies de las líneas de 50,000 voltios o menos. Más voltaje quiere decir más distancia.",
              "Cuenta todo lo que no tenga clasificación de aislante para ese voltaje, como serruchos de pértiga, cuerdas y escaleras. Asegúrate de que ninguna rama ni herramienta toque una línea.",
              "Los camiones canasta y otros equipos con pluma también se quedan a 10 pies, a menos que sea una canasta aislada manejada por un trabajador calificado.",
              "Nunca uses una escalera de metal cerca de líneas aéreas. No uses herramientas eléctricas con cable en un árbol cerca de líneas con corriente."
            ]
          },
          {
            "heading": "Trabajo de despeje de líneas",
            "items": [
              "Cortar o quitar árboles a menos de 10 pies de una línea, o más si el voltaje es mayor, es poda de despeje de líneas. Solo lo hacen podadores de despeje de líneas u otros trabajadores calificados. Están capacitados en sus técnicas y peligros especiales.",
              "Aun ellos tienen que quedarse fuera de las distancias mínimas de acercamiento de las tablas federales. Una rama que toca una línea, o que está dentro de esas distancias, se quita solo con herramientas o equipo aislante.",
              "Si un podador se va a acercar a menos de 10 pies de una línea de más de 750 voltios, tiene que haber un segundo podador de despeje de líneas a una distancia donde se oigan con la voz normal.",
              "No se hace poda de despeje de líneas cuando el clima lo hace peligroso, como tormentas eléctricas cerca, vientos fuertes, o tormentas de nieve o hielo."
            ]
          }
        ],
        "ask": "¿Cuál es la línea eléctrica más cercana al árbol en que trabajamos hoy, y quién en esta cuadrilla está capacitado para trabajar a menos de 10 pies de ella?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "tree-felling",
    "industries": [
      "land"
    ],
    "code": "OSHA HB-3731 (guidance) / 1910.266(h) (logging) / 1910.135",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Hazard Bulletin HB-3731: Tree Care Work: Falls and Falling Object Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHAHB3731.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3752: Tree Care Work: Know the Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3752.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3940: Solutions for Tree Care Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3940.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Tree Care: Hazards and Solutions",
        "url": "https://www.osha.gov/tree-care/hazards-solutions",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.266(b), (c): logging scope and definition of logging operations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.266(h)(1)(i), (h)(1)(iv), (h)(2)(i): felling in logging operations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.135(a)(1): head protection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.135",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Felling Trees and Limbs",
        "hook": "When a tree or a big limb comes down, anyone in its path can be struck. Know where it will fall, and where you will go, before the first cut.",
        "sections": [
          {
            "heading": "Before the first cut",
            "items": [
              "Have a trained person check the tree and the site for hazards before work starts. That means the kind of tree and any weak spots in how it's built.",
              "Look up. Overhead power lines and falling branches are some of the dangers in tree work.",
              "Plan a retreat path so everyone on the ground can get away from a falling tree."
            ]
          },
          {
            "heading": "Keep your distance",
            "items": [
              "OSHA's tree care guidance says ground workers stay back at least two times the height of the tree being felled.",
              "If a rope is used to pull the tree over, everyone stays at least one and a half times the tree's height away.",
              "Logging crews have a federal rule on this. Nobody walks up on a feller closer than two tree lengths until the feller says it's safe. The feller plans and clears a retreat path, usually at an angle away from where the tree should fall, and moves out along it right after the back cut.",
              "Logging rules also say a tree is never felled where it could hit a rope, a cable, a power line or a machine and put someone in danger."
            ]
          },
          {
            "heading": "Drop zones and hard hats",
            "items": [
              "Wherever limbs or wood can fall, mark a drop zone with cones or caution tape.",
              "Only qualified workers go near the drop zone, and everyone gets trained on how to go in and out of it. Before a limb is cut and dropped, the worker up top calls \"stand clear\" and waits for \"all clear\" from below.",
              "Wear a hard hat wherever something can fall on your head. Your company has to make sure you do. Eye protection too."
            ]
          }
        ],
        "ask": "Where is this tree going to fall, and which way is your retreat path? Point to it before we start."
      },
      "es": {
        "title": "Tala de árboles y ramas",
        "hook": "Cuando cae un árbol o una rama grande, cualquiera que esté en su camino puede ser golpeado. Ten claro hacia dónde va a caer, y hacia dónde vas a ir tú, antes del primer corte.",
        "sections": [
          {
            "heading": "Antes del primer corte",
            "items": [
              "Que una persona capacitada revise el árbol y el sitio antes de empezar. Eso incluye el tipo de árbol y cualquier punto débil en su estructura.",
              "Mira hacia arriba. Las líneas eléctricas y las ramas que caen son algunos de los peligros en el trabajo con árboles.",
              "Planea una ruta de escape para que todos en el suelo puedan alejarse de un árbol que cae."
            ]
          },
          {
            "heading": "Mantén la distancia",
            "items": [
              "La guía de OSHA para el cuidado de árboles dice que los trabajadores en el suelo se quedan a una distancia de al menos dos veces la altura del árbol que se está talando.",
              "Si se usa una cuerda para jalar el árbol, todos se quedan a por lo menos una vez y media la altura del árbol.",
              "Para las cuadrillas de tala forestal hay una regla federal sobre esto. Nadie se acerca a menos de dos largos de árbol del talador hasta que él diga que es seguro. El talador planea y despeja una ruta de escape, por lo general en ángulo, alejándose de donde debe caer el árbol, y se retira por ella justo después del corte de tala.",
              "Las reglas de tala forestal también dicen que nunca se tala un árbol donde pueda pegarle a una cuerda, un cable, una línea eléctrica o una máquina y poner a alguien en peligro."
            ]
          },
          {
            "heading": "Zonas de caída y cascos",
            "items": [
              "Donde puedan caer ramas o madera, marca una zona de caída con conos o cinta de precaución.",
              "Solo los trabajadores calificados se acercan a la zona de caída, y a todos se les capacita sobre cómo entrar y salir de ella. Antes de cortar y soltar una rama, el trabajador de arriba grita \"aléjense\" y espera el \"todo libre\" de abajo.",
              "Usa casco dondequiera que algo te pueda caer en la cabeza. Tu compañía tiene que asegurarse de que lo uses. Protección para los ojos también."
            ]
          }
        ],
        "ask": "¿Hacia dónde va a caer este árbol, y cuál es tu ruta de escape? Señálala antes de empezar."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "chainsaw",
    "industries": [
      "land",
      "ag"
    ],
    "code": "OSHA FS-3920 / QuickCard 3269 (guidance) / 1910.266(d)(1)(iv) (logging)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.266(b)-(c): logging scope and definition of logging operations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.266(d)(1)(iv): cut-resistant leg protection for chain saw operators (logging)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.266(e)(2)(xii): carrying a chain saw (logging)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet FS-3920: Working Safely with Chainsaws",
        "url": "https://www.osha.gov/sites/default/files/publications/CHAINSAWS.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA QuickCard 3269: Chainsaw Safety",
        "url": "https://www.osha.gov/sites/default/files/publications/CHAIN_SAW_SAFETY.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Landscaping: Hazards and Solutions (tree care)",
        "url": "https://www.osha.gov/landscaping/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Chainsaw Safety",
        "hook": "Before anyone runs a saw today, let's cover four things: the gear you wear, how you start it, how to avoid kickback, and how you move with it.",
        "sections": [
          {
            "heading": "Gear up",
            "items": [
              "Wear protection for your head, eyes, face, ears, hands, feet, and legs every time you run the saw. No loose clothing.",
              "OSHA's chainsaw fact sheet says your company must provide that gear and make sure you use it.",
              "For your legs, wear chaps. In logging work, the rule says leg protection must be cut-resistant, like ballistic nylon, and the company pays for it."
            ]
          },
          {
            "heading": "Before you start it",
            "items": [
              "Check the controls, chain tension, bolts, and handles. Make sure every safety device works. If the saw is damaged or a safety device is off, don't run it.",
              "Fuel at least 10 feet away from anything that could ignite it.",
              "Start it at least 10 feet from where you fueled, on the ground or something solid, with the chain brake on. Never drop-start a saw."
            ]
          },
          {
            "heading": "Kickback",
            "items": [
              "To avoid kickback, don't cut with the tip, and keep the tip guard in place.",
              "OSHA's chainsaw card says gas saws must have a device that cuts down kickback, like a chain brake.",
              "Keep both hands on the handles and keep solid footing. Don't cut directly overhead.",
              "Watch for branches under tension. They can spring out when cut, and wood can bind the saw."
            ]
          },
          {
            "heading": "Moving with the saw",
            "items": [
              "Release the throttle or shut it off before you step back from a cut.",
              "Carrying it more than 50 feet, or over rough or uneven ground? Shut it off or set the chain brake.",
              "In logging work, the rule says to carry it so you can't touch the chain or the muffler. And never work alone."
            ]
          }
        ],
        "ask": "Show me where the chain brake is on your saw. How do you check that it works before you start?"
      },
      "es": {
        "title": "Seguridad con la motosierra",
        "hook": "Antes de que alguien use una sierra hoy, vamos a repasar cuatro cosas: el equipo que te pones, cómo arrancarla, cómo evitar el rebote y cómo moverte con ella.",
        "sections": [
          {
            "heading": "Ponte el equipo",
            "items": [
              "Usa protección para la cabeza, los ojos, la cara, los oídos, las manos, los pies y las piernas cada vez que uses la sierra. Nada de ropa suelta.",
              "La hoja informativa de OSHA sobre motosierras dice que tu compañía tiene que darte ese equipo y asegurarse de que lo uses.",
              "Para las piernas, usa chaparreras. En trabajos de tala, la regla dice que la protección de piernas tiene que ser resistente a cortes, como el nailon balístico, y la compañía la paga."
            ]
          },
          {
            "heading": "Antes de arrancarla",
            "items": [
              "Revisa los controles, la tensión de la cadena, los pernos y las manijas. Asegúrate de que todos los dispositivos de seguridad funcionen. Si la sierra está dañada o le falta un dispositivo de seguridad, no la uses.",
              "Ponle combustible por lo menos a 10 pies de cualquier cosa que lo pueda encender.",
              "Arráncala por lo menos a 10 pies de donde le pusiste combustible, en el suelo o sobre algo firme, con el freno de cadena puesto. Nunca la arranques dejándola caer."
            ]
          },
          {
            "heading": "El rebote",
            "items": [
              "Para evitar el rebote, no cortes con la punta, y mantén puesta la protección de la punta.",
              "La tarjeta de OSHA sobre motosierras dice que las sierras de gasolina deben tener un dispositivo que reduzca el rebote, como un freno de cadena.",
              "Mantén las dos manos en las manijas y los pies bien firmes. No cortes directamente por encima de tu cabeza.",
              "Ten cuidado con las ramas bajo tensión. Pueden saltar cuando las cortas, y la madera puede atorar la sierra."
            ]
          },
          {
            "heading": "Cómo moverte con la sierra",
            "items": [
              "Suelta el acelerador o apágala antes de alejarte de un corte.",
              "¿La vas a cargar más de 50 pies, o por terreno áspero o disparejo? Apágala o pon el freno de cadena.",
              "En trabajos de tala, la regla dice que la cargues de forma que no puedas tocar la cadena ni el mofle. Y nunca trabajes solo."
            ]
          }
        ],
        "ask": "Enséñame dónde está el freno de cadena en tu sierra. ¿Cómo revisas que funcione antes de arrancarla?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "chipper",
    "industries": [
      "land"
    ],
    "code": "1910.147",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.147(a)(2), (d)(2)-(d)(6), (e)(3): energy control during servicing",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA Safety and Health Information Bulletin SHIB 04-16-2008: Hazards of Wood Chippers",
        "url": "https://www.osha.gov/sites/default/files/publications/shib041608.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3940: Solutions for Tree Care Hazards",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3940.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Landscaping: Hazards and Solutions (tree care)",
        "url": "https://www.osha.gov/landscaping/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Wood Chipper Safety",
        "hook": "A chipper's feed rollers grab branches and force them into the knives. In one OSHA case, an operator standing right in front of the infeed chute was pulled in, maybe after his glove cuff caught on a branch.",
        "sections": [
          {
            "heading": "Before you start",
            "items": [
              "The chipper should be inspected and tested at the start of every shift. Make sure the guards, controls, and emergency shut-offs work.",
              "Close and latch the hood. Aim the discharge chute so chips can't hit anyone.",
              "Stow all ropes and lines away from the chipper.",
              "Know your feed control bar. Pushed to the center, it stops the feed rollers."
            ]
          },
          {
            "heading": "Feeding it",
            "items": [
              "Stand to the side of the infeed chute. While the chipper is running, never stand in front of the feed table, and never stand, sit, or climb on any part of it.",
              "Keep your hands and feet out of the infeed chute area. Push material in with a wooden tool or a long branch.",
              "Feed the cut end first. Lay short branches on top of long ones, and put small debris in a trash can.",
              "Only wood goes in. Never rocks or metal."
            ]
          },
          {
            "heading": "Dress for it",
            "items": [
              "Wear eye and face protection, a hard hat, and hearing protection. Chippers make hazardous noise, and material can get thrown out.",
              "Wear close-fitting, tucked-in clothing with no loose straps, gloves without cuffs, and no jewelry."
            ]
          },
          {
            "heading": "Jams and walking away",
            "items": [
              "Never reach into the infeed chute to clear a jam while the chipper is running.",
              "Before any servicing, shut it down and lock it out. Don't open an access cover until the disc or drum comes to a complete stop, and use the locking pins to hold the disc still.",
              "Leaving it unattended? Shut it down and take the key."
            ]
          }
        ],
        "ask": "Show me the feed control bar and the emergency stop on today's chipper. Who is our safety watch by the shut-off?"
      },
      "es": {
        "title": "Seguridad con la astilladora",
        "hook": "Los rodillos de alimentación de una astilladora agarran las ramas y las empujan hacia las cuchillas. En un caso de OSHA, un operador que estaba parado justo enfrente de la tolva fue jalado hacia adentro, posiblemente después de que el puño de su guante se enganchó en una rama.",
        "sections": [
          {
            "heading": "Antes de arrancar",
            "items": [
              "La astilladora se debe inspeccionar y probar al comienzo de cada turno. Asegúrate de que las guardas, los controles y los paros de emergencia funcionen.",
              "Cierra y asegura la tapa. Apunta el tubo de descarga para que las astillas no le peguen a nadie.",
              "Guarda todas las cuerdas y líneas lejos de la astilladora.",
              "Conoce tu barra de control de alimentación. Si la empujas al centro, detiene los rodillos."
            ]
          },
          {
            "heading": "Cómo alimentarla",
            "items": [
              "Párate a un lado de la tolva. Mientras la astilladora esté funcionando, nunca te pares enfrente de la mesa de alimentación, y nunca te pares, te sientes ni te subas a ninguna parte de ella.",
              "Mantén las manos y los pies fuera del área de la tolva. Empuja el material con una herramienta de madera o una rama larga.",
              "Mete primero el extremo cortado. Pon las ramas cortas encima de las largas, y echa los desechos pequeños en un bote de basura.",
              "Solo entra madera. Nunca piedras ni metal."
            ]
          },
          {
            "heading": "Vístete para el trabajo",
            "items": [
              "Usa protección para los ojos y la cara, casco y protección para los oídos. Las astilladoras hacen un ruido peligroso, y pueden salir disparados pedazos de material.",
              "Usa ropa ajustada y metida, sin correas sueltas, guantes sin puño y nada de joyas."
            ]
          },
          {
            "heading": "Atascos y cuando te alejas",
            "items": [
              "Nunca metas la mano en la tolva para destapar un atasco mientras la astilladora esté funcionando.",
              "Antes de darle cualquier servicio, apágala y bloquéala. No abras una tapa de acceso hasta que el disco o el tambor se detenga por completo, y usa los pasadores de seguridad para que el disco no se mueva.",
              "¿La vas a dejar sola? Apágala y llévate la llave."
            ]
          }
        ],
        "ask": "Enséñame la barra de control de alimentación y el paro de emergencia de la astilladora de hoy. ¿Quién va a vigilar junto al botón de apagado?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "mowers",
    "industries": [
      "land",
      "ag"
    ],
    "code": "OSHA Riding Mowers (guidance) / 1910.133(a)(2) / 1928.57(a)(6)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA: Dangers of Roll-Overs of Riding Mowers",
        "url": "https://www.osha.gov/riding-mowers",
        "kind": "guidance"
      },
      {
        "label": "OSHA Landscaping: Hazards and Solutions",
        "url": "https://www.osha.gov/landscaping/hazards",
        "kind": "guidance"
      },
      {
        "label": "NIOSH FACE Report 2013-04: worker struck by projectile from a nearby commercial lawnmower",
        "url": "https://www.cdc.gov/niosh/face/in-house/full201304.html",
        "kind": "guidance"
      },
      {
        "label": "NIOSH: FACE IT: worker safety matters during lawn care (2021)",
        "url": "https://stacks.cdc.gov/view/cdc/181946",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.133(a)(2): eye protection with side protection for flying objects (general industry)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA 1928.57(a)(6)(iii): stop engine and wait for movement to stop before unclogging (agricultural equipment)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.57",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Mowers and Trimmers",
        "hook": "A lawn worker was killed when a nearby mower hit a metal stake and threw a piece of it into his head from about 25 feet away. Riding mowers can also roll off a wall or down a bank.",
        "sections": [
          {
            "heading": "Before you mow",
            "items": [
              "OSHA's guidance says your company is responsible for training you before you run any mowing equipment.",
              "Walk the area first. Remove rocks, debris and anything else you can. Flag or mark what you can't move.",
              "Check that the rollover bar, guards, seat belt and shields are all in place.",
              "Riding mowers are one-person machines. No passengers, and never get on or off while it's running."
            ]
          },
          {
            "heading": "Slopes and drop-offs",
            "items": [
              "Follow the mower's slope limit. It's often on a label on the machine. If you don't know it, avoid slopes over 15 degrees.",
              "Mow slopes up and down, not side to side. Slow down going downhill and around sharp corners.",
              "Keep the drive wheels at least five feet from the open edge of walls, banks, ditches, culverts and excavations. Use a string trimmer or push mower there.",
              "If the mower has a rollover bar, keep it up and wear the belt. If you must lower it to clear something, take the belt off, and raise the bar and buckle back up as soon as you're clear."
            ]
          },
          {
            "heading": "Blades and thrown objects",
            "items": [
              "Never point the discharge at people or buildings. Keep a safe distance from others running equipment.",
              "On landscaping jobs, where things can fly, your company has to make sure you wear eye protection with side protection. Wear ear protection with power equipment.",
              "Keep clear of turning mower and brush-cutter blades. Before you leave a mower, set the brake, take the key, and wait until all moving parts stop. Never leave it on a slope.",
              "On farm field equipment, you'll be taught to stop the engine, disconnect power and wait for all movement to stop before you clean or unclog it."
            ]
          }
        ],
        "ask": "Where on today's job is there a slope, a ditch or a wall edge, and how are we going to cut it?"
      },
      "es": {
        "title": "Podadoras y desbrozadoras",
        "hook": "Un trabajador de jardinería murió cuando una podadora cercana golpeó una estaca de metal y le lanzó un pedazo a la cabeza desde unos 25 pies. Las podadoras de montar también se pueden caer de un muro o rodar por un talud.",
        "sections": [
          {
            "heading": "Antes de podar",
            "items": [
              "La guía de OSHA dice que tu compañía es responsable de capacitarte antes de que uses cualquier equipo para cortar pasto.",
              "Primero recorre el área. Quita las piedras, la basura y todo lo que puedas. Marca con bandera o señal lo que no puedas mover.",
              "Revisa que la barra antivuelco, las guardas, el cinturón y los protectores estén en su lugar.",
              "Las podadoras de montar son para una sola persona. Nada de pasajeros, y nunca te subas ni te bajes mientras está prendida."
            ]
          },
          {
            "heading": "Pendientes y desniveles",
            "items": [
              "Respeta el límite de pendiente de la podadora. Muchas veces viene en una etiqueta en la máquina. Si no lo sabes, evita pendientes de más de 15 grados.",
              "Corta las pendientes de arriba a abajo, no de lado a lado. Baja la velocidad cuesta abajo y en curvas cerradas.",
              "Mantén las ruedas de tracción a por lo menos cinco pies del borde abierto de muros, taludes, zanjas, alcantarillas y excavaciones. Ahí usa una desbrozadora o una podadora de empuje.",
              "Si la podadora tiene barra antivuelco, mantenla arriba y usa el cinturón. Si tienes que bajarla para pasar por debajo de algo, quítate el cinturón, y vuelve a subir la barra y abrocharte en cuanto pases."
            ]
          },
          {
            "heading": "Cuchillas y objetos lanzados",
            "items": [
              "Nunca apuntes la descarga hacia personas o edificios. Mantén una distancia segura de otros que estén usando equipo.",
              "En trabajos de jardinería, donde puedan salir volando cosas, tu compañía tiene que asegurarse de que uses protección para los ojos con protección lateral. Usa protección para los oídos con equipo motorizado.",
              "Aléjate de las cuchillas de podadoras y desbrozadoras cuando estén girando. Antes de dejar una podadora, pon el freno, saca la llave y espera a que todas las partes dejen de moverse. Nunca la dejes en una pendiente.",
              "En equipo agrícola de campo, te van a enseñar a apagar el motor, desconectar la energía y esperar a que todo deje de moverse antes de limpiarlo o destaparlo."
            ]
          }
        ],
        "ask": "¿Dónde hay hoy una pendiente, una zanja o el borde de un muro, y cómo lo vamos a cortar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "tank-gauging",
    "industries": [
      "oil"
    ],
    "code": "OSHA/NIOSH Hazard Alert (2016) / 1910.134",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA/NIOSH Hazard Alert: Health and Safety Risks for Workers Involved in Manual Tank Gauging and Sampling at Oil and Gas Extraction Sites (02/2016)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3843.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.134(a)(2): employer provides respirators when necessary",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(d)(2)(i)(A)-(B): respirators for IDLH atmospheres (pressure-demand SCBA, or SAR with auxiliary self-contained supply)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA Oil and Gas Extraction: Safety Hazards (explosions and fires)",
        "url": "https://www.osha.gov/oil-and-gas-extraction/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Gauging and Sampling Tanks",
        "hook": "From 2010 to 2014, nine workers died while gauging or sampling oil and gas production tanks. Each of them was working alone or wasn't being watched by a coworker.",
        "sections": [
          {
            "heading": "What comes out of the hatch",
            "items": [
              "Tanks can hold hydrocarbon gases and vapors under pressure. When you open the thief hatch, a plume can rush out and wrap around you.",
              "Those gases can push out the oxygen you breathe. In one of those deaths, oxygen fell as low as 6.9 percent.",
              "The vapors can make you dizzy and confused fast, knock you out, or throw your heart out of rhythm. They can also catch fire or explode."
            ]
          },
          {
            "heading": "Best fix: keep the hatch closed",
            "items": [
              "Remote or automatic gauging and sampling lets you do the job without opening the hatch. Use it wherever your company has it.",
              "Your company may add sampling ports so you don't have to open the hatch, and pressure indicators so you can see tank pressure before you get close."
            ]
          },
          {
            "heading": "If you have to open it",
            "items": [
              "Don't work alone. A trained observer should be stationed outside the hazard area, ready to do a rescue.",
              "Wear a calibrated multi-gas and oxygen monitor. Know its limits and what to do when it alarms.",
              "Work upwind and keep your distance from the open hatch.",
              "A cartridge respirator won't protect you here. It doesn't stop light hydrocarbon gases or low oxygen. Where the air could be immediately dangerous to life, your company has to provide a full-facepiece pressure-demand SCBA, or a full-facepiece supplied-air respirator with its own backup air supply."
            ]
          },
          {
            "heading": "Fire and emergencies",
            "items": [
              "Wear flame-resistant clothing. Equipment should be grounded, and spark-producing devices stay away from the tank.",
              "If you feel sick or dizzy, leave the area and tell your supervisor.",
              "Know the emergency plan before you climb. Your company should set it up and practice it, so help is on scene right away."
            ]
          }
        ],
        "ask": "Which tanks on our route can we gauge without opening the hatch, and who is the observer today?"
      },
      "es": {
        "title": "Medición y muestreo de tanques",
        "hook": "De 2010 a 2014, nueve trabajadores murieron mientras medían o tomaban muestras de tanques de producción de petróleo y gas. Todos estaban trabajando solos o sin que un compañero los estuviera vigilando.",
        "sections": [
          {
            "heading": "Lo que sale de la escotilla",
            "items": [
              "Los tanques pueden tener gases y vapores de hidrocarburos bajo presión. Cuando abres la escotilla de medición (thief hatch), puede salir de golpe una nube que te envuelve.",
              "Esos gases pueden desplazar el oxígeno que respiras. En una de esas muertes, el oxígeno bajó hasta 6.9 por ciento.",
              "Los vapores te pueden marear y confundir muy rápido, dejarte inconsciente o descontrolar el ritmo de tu corazón. También se pueden incendiar o explotar."
            ]
          },
          {
            "heading": "La mejor solución: mantener la escotilla cerrada",
            "items": [
              "La medición y el muestreo remotos o automáticos te dejan hacer el trabajo sin abrir la escotilla. Úsalos donde tu compañía los tenga.",
              "Tu compañía puede instalar puertos de muestreo para que no tengas que abrir la escotilla, e indicadores de presión para que veas la presión del tanque antes de acercarte."
            ]
          },
          {
            "heading": "Si tienes que abrirla",
            "items": [
              "No trabajes solo. Un observador capacitado debe estar fuera del área de peligro, listo para hacer un rescate.",
              "Usa un monitor de multigás y oxígeno calibrado. Conoce sus límites y qué hacer cuando suena la alarma.",
              "Trabaja con el viento a tu espalda y mantente alejado de la escotilla abierta.",
              "Un respirador de cartuchos no te protege aquí. No detiene los gases livianos de hidrocarburos ni la falta de oxígeno. Donde el aire puede ser un peligro inmediato para la vida, tu compañía tiene que darte un SCBA de cara completa de presión a demanda, o un respirador de aire suministrado de cara completa con su propio suministro de aire de respaldo."
            ]
          },
          {
            "heading": "Incendios y emergencias",
            "items": [
              "Usa ropa resistente a las llamas. El equipo debe estar conectado a tierra, y los aparatos que hacen chispas se mantienen lejos del tanque.",
              "Si te sientes mal o mareado, sal del área y avísale a tu supervisor.",
              "Conoce el plan de emergencia antes de subir. Tu compañía debe prepararlo y practicarlo, para que la ayuda llegue de inmediato."
            ]
          }
        ],
        "ask": "¿Cuáles tanques de nuestra ruta podemos medir sin abrir la escotilla, y quién es el observador hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "oil-struck-by",
    "industries": [
      "oil"
    ],
    "code": "1910.212(a)(1) / OSHA Oil and Gas eTool",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Oil and Gas Extraction: Safety Hazards (struck-by/caught-between, high pressure lines, machine hazards)",
        "url": "https://www.osha.gov/oil-and-gas-extraction/hazards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Oil and Gas eTool: Common Wellsite Incidents (struck-by, caught-in, caught-between)",
        "url": "https://www.osha.gov/etools/oil-and-gas/general-safety/common-wellsite-incidents",
        "kind": "guidance"
      },
      {
        "label": "OSHA Oil and Gas eTool: Drilling, Tripping Out/In",
        "url": "https://www.osha.gov/etools/oil-and-gas/drilling/tripping-out-in",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.212(a)(1)-(a)(2): machine guarding",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Struck-By and Caught-Between on the Well Site",
        "hook": "OSHA says three of every five deaths on oil and gas well sites come from being struck by, caught in, or caught between something. Moving vehicles, falling equipment and pressure lines are the big ones.",
        "sections": [
          {
            "heading": "Pressure lines",
            "items": [
              "If the connections holding a high-pressure line fail, the line can whip and hit you. Lines can also wear thin inside and burst.",
              "Secure any pressurized line that could whip if it comes loose.",
              "During high-pressure work, a work zone gets set up. If you're not needed for the job, stay out of it."
            ]
          },
          {
            "heading": "Falling pipe and dropped objects",
            "items": [
              "Don't stand under heavy equipment. Floor hands keep an eye on the wire ropes, slings and blocks above them.",
              "Tools that could fall get tied off or secured. Don't carry tools up the derrick ladder. Raise them with a line.",
              "Keep your hands and fingers out from between stands of pipe."
            ]
          },
          {
            "heading": "Rotating equipment",
            "items": [
              "Stand clear of the rotary table when it's turning, and stay out of the swing path of the elevators. No one stands in the red zone.",
              "If you're not running the tongs, stand outside the tong swing radius when breaking pipe. Check tong dies and snub lines every tour.",
              "Unguarded machines like pumps, compressors and drawworks can catch you. Your company has to guard rotating parts and nip points, and guards stay on."
            ]
          },
          {
            "heading": "Vehicles on location",
            "items": [
              "Wear high-visibility clothing drivers can see. When FRC is needed, wear high-visibility FRC.",
              "Follow the one-way traffic pattern. Back in when you park, so your first move out is forward.",
              "Don't stand on or work near tubulars, iron, vehicles or trailers. Watch for conditions around you that can change."
            ]
          }
        ],
        "ask": "Where is the red zone on this job today, and who keeps people out of it?"
      },
      "es": {
        "title": "Golpes y atrapamientos en el sitio del pozo",
        "hook": "OSHA dice que tres de cada cinco muertes en sitios de pozos de petróleo y gas son por golpes, atrapamientos o quedar prensado entre algo. Los vehículos en movimiento, el equipo que cae y las líneas de presión son los principales.",
        "sections": [
          {
            "heading": "Líneas de presión",
            "items": [
              "Si fallan las conexiones que sujetan una línea de alta presión, la línea puede latiguear y golpearte. Las líneas también se pueden desgastar por dentro y reventar.",
              "Asegura cualquier línea presurizada que pueda latiguear si se suelta.",
              "Durante trabajos de alta presión se marca una zona de trabajo. Si no te necesitan para esa tarea, quédate fuera."
            ]
          },
          {
            "heading": "Tubería que cae y objetos que se caen",
            "items": [
              "No te pares debajo de equipo pesado. Los ayudantes de piso vigilan los cables de acero, eslingas y bloques que tienen encima.",
              "Las herramientas que se puedan caer se amarran o se aseguran. No subas herramientas en la mano por la escalera de la torre. Súbelas con una cuerda.",
              "Mantén las manos y los dedos fuera de entre los tramos de tubería."
            ]
          },
          {
            "heading": "Equipo que gira",
            "items": [
              "Aléjate de la mesa rotaria cuando esté girando, y quédate fuera del recorrido de los elevadores. Nadie se para en la zona roja.",
              "Si no estás operando las llaves (tongs), párate fuera del radio de giro de las llaves al quebrar tubería. Revisa los dados de las llaves y las líneas de retención en cada turno.",
              "Las máquinas sin guardas como bombas, compresores y malacates te pueden atrapar. Tu compañía tiene que poner guardas en las partes que giran y en los puntos de atrapamiento, y las guardas se quedan puestas."
            ]
          },
          {
            "heading": "Vehículos en la locación",
            "items": [
              "Usa ropa de alta visibilidad que los choferes puedan ver. Cuando se necesite ropa resistente a las llamas (FRC), usa FRC de alta visibilidad.",
              "Sigue el patrón de tráfico en un solo sentido. Estaciónate de reversa, para que tu primer movimiento al salir sea hacia adelante.",
              "No te pares encima ni trabajes cerca de tubulares, fierros, vehículos o remolques. Fíjate en las condiciones a tu alrededor que pueden cambiar."
            ]
          }
        ],
        "ask": "¿Dónde está hoy la zona roja en este trabajo, y quién mantiene a la gente fuera de ella?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "oil-fires",
    "industries": [
      "oil"
    ],
    "code": "1910.132(a) / 1910.132(d)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.132(a): provide and use PPE; (d)(1): hazard assessment; (h)(1): PPE at no cost",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.132",
        "kind": "standard"
      },
      {
        "label": "OSHA memo: Enforcement Policy for Flame-Resistant Clothing in Oil and Gas Drilling, Well Servicing, and Production-Related Operations (2010)",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2010-03-19-0",
        "kind": "guidance"
      },
      {
        "label": "OSHA Oil and Gas eTool: Common Wellsite Incidents (fires and explosions, ignition sources)",
        "url": "https://www.osha.gov/etools/oil-and-gas/general-safety/common-wellsite-incidents",
        "kind": "guidance"
      },
      {
        "label": "OSHA Oil and Gas eTool: Hot Work/Welding",
        "url": "https://www.osha.gov/etools/oil-and-gas/general-safety/hot-work-welding",
        "kind": "guidance"
      },
      {
        "label": "OSHA Oil and Gas Extraction: Safety Hazards (explosions and fires)",
        "url": "https://www.osha.gov/oil-and-gas-extraction/hazards",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Fires and Explosions on the Well Site",
        "hook": "Fires and explosions are a leading cause of death at well sites. A hydrocarbon flash fire can reach 1,000 to 1,900 degrees Fahrenheit.",
        "sections": [
          {
            "heading": "Know where the fuel is",
            "items": [
              "Well gas, vapors and hydrogen sulfide can come off wells, trucks, production equipment, tanks and shale shakers.",
              "Stay out of zones that could hold flammable vapors: the wellhead, tanks, heater-treaters, tanker trucks and hot oilers. Keep hatches on tanks and vessels closed.",
              "Use an LEL meter. If it reads over 10 percent LEL, get out, and stay out until it's safe to go back."
            ]
          },
          {
            "heading": "Kill the ignition sources",
            "items": [
              "Fire starters include open flames, smoking, static, sparks from hand tools, engines, vehicles with catalytic converters, generators, and phones or radios that aren't intrinsically safe.",
              "Bond and ground hoses, buckets and fluid-handling equipment so static can't spark.",
              "Engines get spark arrestors. If there's a release, don't try to move a vehicle away from it. That has caused fires and explosions."
            ]
          },
          {
            "heading": "Hot work",
            "items": [
              "Get a hot work permit before welding, cutting or grinding where flammable vapors could be. Follow every step. Skipping steps gets people hurt.",
              "Test the air for flammable gas before you start, and keep monitoring while you work.",
              "Clear out combustible materials first, and have a fire watch with the right equipment."
            ]
          },
          {
            "heading": "Flame-resistant clothing",
            "items": [
              "Your company has to check the site for burn hazards and provide the protective gear those hazards call for. Required gear is provided at no cost to you.",
              "OSHA inspectors look for FRC during work like gauging, line breaking, hot work, fracturing and cementing, and on drilling sites before drilling into gas zones.",
              "Wear your FRC, but never wear FRC or any clothing that's soaked in flammable liquid."
            ]
          }
        ],
        "ask": "What could light a fire on this site today, and what are we doing about each one?"
      },
      "es": {
        "title": "Incendios y explosiones en el sitio del pozo",
        "hook": "Los incendios y las explosiones son una de las principales causas de muerte en los sitios de pozos. Un fogonazo de hidrocarburos puede llegar a entre 1,000 y 1,900 grados Fahrenheit.",
        "sections": [
          {
            "heading": "Sabe dónde está el combustible",
            "items": [
              "El gas del pozo, los vapores y el ácido sulfhídrico pueden salir de los pozos, camiones, equipo de producción, tanques y zarandas (shale shakers).",
              "Quédate fuera de las zonas que pueden tener vapores inflamables: la cabeza del pozo, tanques, separadores calentadores, camiones tanque y calentadores de aceite (hot oilers). Mantén cerradas las escotillas de tanques y recipientes.",
              "Usa un medidor de LEL. Si marca más de 10 por ciento del LEL, sal y no regreses hasta que sea seguro."
            ]
          },
          {
            "heading": "Elimina las fuentes de ignición",
            "items": [
              "Lo que puede prender un fuego incluye llamas abiertas, fumar, la estática, chispas de herramientas de mano, motores, vehículos con convertidor catalítico, generadores, y teléfonos o radios que no son intrínsecamente seguros.",
              "Conecta y aterriza las mangueras, cubetas y el equipo para manejar fluidos, para que la estática no haga chispa.",
              "Los motores llevan arrestachispas. Si hay una fuga, no trates de mover un vehículo para alejarlo. Eso ha causado incendios y explosiones."
            ]
          },
          {
            "heading": "Trabajo en caliente",
            "items": [
              "Saca un permiso de trabajo en caliente antes de soldar, cortar o esmerilar donde pueda haber vapores inflamables. Sigue cada paso. Saltarse pasos lastima a la gente.",
              "Mide el aire para gas inflamable antes de empezar, y sigue monitoreando mientras trabajas.",
              "Quita primero los materiales combustibles, y ten un vigilante de fuego con el equipo adecuado."
            ]
          },
          {
            "heading": "Ropa resistente a las llamas",
            "items": [
              "Tu compañía tiene que revisar el sitio para ver los peligros de quemaduras y darte el equipo de protección que esos peligros piden. El equipo requerido se da sin costo para ti.",
              "Los inspectores de OSHA buscan ropa FRC en trabajos como medición de tanques, apertura de líneas, trabajo en caliente, fracturamiento y cementación, y en sitios de perforación antes de perforar zonas de gas.",
              "Usa tu ropa FRC, pero nunca uses FRC ni ninguna otra ropa empapada en líquido inflamable."
            ]
          }
        ],
        "ask": "¿Qué podría prender un fuego en este sitio hoy, y qué estamos haciendo con cada cosa?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "frac-silica",
    "industries": [
      "oil"
    ],
    "code": "1910.1053",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA/NIOSH Hazard Alert: Worker Exposure to Silica during Hydraulic Fracturing (2012)",
        "url": "https://obis.osha.gov/dts/hazardalerts/hydraulic_frac_hazard_alert.html",
        "kind": "guidance"
      },
      {
        "label": "OSHA InfoSheet 3622 (2012): respirable silica exposure during hydraulic fracturing",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3622.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.1053(a): scope; (l)(3): dates for hydraulic fracturing operations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1053(c): PEL; (e)(1)-(e)(4): regulated areas, signs, access, respirators; (f)(1)-(f)(2): controls and written exposure control plan",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1053(g)(1)-(g)(2): respirators and program; (h)(1)-(h)(2): dry sweeping, compressed air; (i)(1)(i): medical surveillance",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1053",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(c)(1): program elements; (d)(3)(i)(A) and Table 1: assigned protection factors (half mask 10, full facepiece 50)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Silica Dust at Frac Sites",
        "hook": "Frac sand is crystalline silica. When NIOSH sampled the air at 11 frac sites, 47 percent of the samples were over OSHA's exposure limit at the time.",
        "sections": [
          {
            "heading": "What it does and where it comes from",
            "items": [
              "Breathing silica can cause silicosis. It scars your lungs so they can't take in oxygen as well. It can also cause lung cancer, and it's linked to TB, COPD and kidney disease.",
              "Dust blows out of thief hatches on top of the sand movers, and out of open side fill ports during refilling.",
              "It also comes off the transfer belts, the blender hopper, the end of the sand belt called the dragon's tail, and truck traffic on site."
            ]
          },
          {
            "heading": "Controls come first",
            "items": [
              "OSHA's general industry silica rule covers frac sites. Your company has to use engineering and work practice controls to keep dust at or below the limit where it can, and keep a written exposure control plan.",
              "Cap unused fill ports. Cut down how far the sand drops. Use curtains or enclosures where dust comes out.",
              "Put fresh water on roads and around the well site. Use enclosed cabs with HEPA filters where you have them.",
              "Limit who works in the dusty areas and for how long. Your company has to mark off areas over the limit and post signs at the entrances. Only people who need to be there go in, and they wear a respirator."
            ]
          },
          {
            "heading": "Respirators",
            "items": [
              "When a respirator is required, it's part of your company's program: the right respirator, fit testing, a medical evaluation and training.",
              "Respirators are rated by how much they protect. Under OSHA's respirator rule, a half-mask respirator with filters is good only up to 10 times the silica limit. Above that, your company has to pick a higher-rated respirator, like a full-facepiece one."
            ]
          },
          {
            "heading": "Cleanup and checkups",
            "items": [
              "No dry sweeping or dry brushing where it adds to the dust, unless wet sweeping or a HEPA vacuum won't work. No compressed air to clean clothes or surfaces, unless it's used with a system that captures the dust or nothing else will work.",
              "If you're exposed at or above the action level 30 or more days a year, your company has to offer you medical exams at no cost."
            ]
          }
        ],
        "ask": "Where does the dust come from on our site, and which of those spots can we cap, wet down or enclose today?"
      },
      "es": {
        "title": "Polvo de sílice en sitios de fracturamiento",
        "hook": "La arena de fracturamiento es sílice cristalina. Cuando NIOSH tomó muestras del aire en 11 sitios de fracturamiento, el 47 por ciento de las muestras pasaron el límite de exposición que OSHA tenía en ese tiempo.",
        "sections": [
          {
            "heading": "Lo que hace y de dónde viene",
            "items": [
              "Respirar sílice puede causar silicosis. Deja cicatrices en tus pulmones y ya no pueden tomar oxígeno igual de bien. También puede causar cáncer de pulmón, y está relacionada con la tuberculosis, la EPOC y enfermedades de los riñones.",
              "El polvo sale por las escotillas (thief hatches) arriba de los camiones de arena (sand movers), y por los puertos laterales de llenado abiertos durante el rellenado.",
              "También sale de las bandas transportadoras, la tolva del mezclador, la punta de la banda de arena llamada cola de dragón (dragon's tail), y el tráfico de camiones en el sitio."
            ]
          },
          {
            "heading": "Primero los controles",
            "items": [
              "La regla de sílice de OSHA para la industria general cubre los sitios de fracturamiento. Tu compañía tiene que usar controles de ingeniería y de prácticas de trabajo para mantener el polvo en el límite o por debajo donde se pueda, y tener un plan escrito de control de exposición.",
              "Tapa los puertos de llenado que no se usen. Reduce la altura desde donde cae la arena. Usa cortinas o encierros donde sale el polvo.",
              "Echa agua limpia en los caminos y alrededor del pozo. Usa cabinas cerradas con filtros HEPA donde las haya.",
              "Limita quién trabaja en las áreas con polvo y por cuánto tiempo. Tu compañía tiene que marcar las áreas que pasan el límite y poner letreros en las entradas. Solo entra la gente que tiene que estar ahí, y usa respirador."
            ]
          },
          {
            "heading": "Respiradores",
            "items": [
              "Cuando se requiere respirador, es parte del programa de tu compañía: el respirador correcto, prueba de ajuste, una evaluación médica y capacitación.",
              "Los respiradores tienen una clasificación según cuánto protegen. Según la regla de respiradores de OSHA, un respirador de media cara con filtros sirve solo hasta 10 veces el límite de sílice. Arriba de eso, tu compañía tiene que escoger un respirador de clasificación más alta, como uno de cara completa."
            ]
          },
          {
            "heading": "Limpieza y chequeos",
            "items": [
              "Nada de barrer o cepillar en seco si eso levanta más polvo, a menos que barrer en mojado o usar una aspiradora HEPA no funcione. Nada de aire comprimido para limpiar ropa o superficies, a menos que se use con un sistema que capture el polvo o no haya otra forma.",
              "Si estás expuesto al nivel de acción o más por 30 días o más al año, tu compañía te tiene que ofrecer exámenes médicos sin costo."
            ]
          }
        ],
        "ask": "¿De dónde sale el polvo en nuestro sitio, y cuáles de esos puntos podemos tapar, mojar o encerrar hoy?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "h2s",
    "industries": [
      "oil",
      "util",
      "plumb"
    ],
    "code": "1910.1000 Table Z-2 / 1926.55",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.1000 Table Z-2: hydrogen sulfide (20 ppm ceiling; 50 ppm peak, 10 minutes once, only if no other measurable exposure)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1000TABLEZ2",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.55(a) and Table 1: hydrogen sulfide 10 ppm TWA (construction)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.55",
        "kind": "standard"
      },
      {
        "label": "OSHA Hydrogen Sulfide: overview",
        "url": "https://www.osha.gov/hydrogen-sulfide",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hydrogen Sulfide: standards (general industry, construction 1926.55, NIOSH REL)",
        "url": "https://www.osha.gov/hydrogen-sulfide/standards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hydrogen Sulfide: hazards (short-term symptoms by ppm)",
        "url": "https://www.osha.gov/hydrogen-sulfide/hazards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hydrogen Sulfide in Workplaces",
        "url": "https://www.osha.gov/hydrogen-sulfide/hydrogen-sulfide-workplaces",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hydrogen Sulfide: evaluating and controlling exposure",
        "url": "https://www.osha.gov/hydrogen-sulfide/evaluating-controlling-exposure",
        "kind": "guidance"
      },
      {
        "label": "OSHA Oil and Gas eTool: H2S monitoring",
        "url": "https://www.osha.gov/etools/oil-and-gas/general-safety/h2s-monitoring",
        "kind": "guidance"
      },
      {
        "label": "OSHA QuickCard: Hydrogen Sulfide (OSHA 3300)",
        "url": "https://www.osha.gov/sites/default/files/publications/HYDROGEN_SULFIDE.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Fatal Facts: Hydrogen Sulfide Release (OSHA 4204)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA4204.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Hydrogen Sulfide (H2S)",
        "hook": "At high levels, hydrogen sulfide can drop you in one or two breaths. And the rotten-egg smell you count on to warn you can disappear.",
        "sections": [
          {
            "heading": "Know the gas",
            "items": [
              "H2S is a colorless gas that smells like rotten eggs at low levels. It's highly flammable, and it's toxic even at low levels.",
              "It's heavier than air. It can travel along the ground and collect in low spots and enclosed spaces like pits, manholes, tunnels and wells.",
              "You can find it in oil and gas wells, sewers, septic tanks and wastewater treatment."
            ]
          },
          {
            "heading": "Your nose will fool you",
            "items": [
              "After a while at low levels, or quickly at high levels, you can't smell it anymore.",
              "Never rely on your sense of smell to tell you H2S is there or how much is there.",
              "At 100 ppm and above, it's immediately dangerous to life and health. At 700 ppm and up, people collapse within one or two breaths.",
              "OSHA's general industry limit is a 20 ppm ceiling. The one exception is a single peak up to 50 ppm for up to 10 minutes, and only if there's no other measurable exposure that shift. In construction the limit is 10 ppm averaged over the shift."
            ]
          },
          {
            "heading": "Monitors and getting out",
            "items": [
              "Wear your personal monitor as close to your breathing zone as you can, like on your collar or above your chest.",
              "Monitors have to be maintained and calibrated. A detector left in test mode can't sound an alarm. That was part of a deadly release OSHA investigated.",
              "Industry practice is usually an alarm at 10 ppm, and that alarm means get out. Know the wind direction from the windsock, your escape routes, and where the safe briefing area is."
            ]
          },
          {
            "heading": "Rescue",
            "items": [
              "H2S can almost instantly overcome unprotected workers, including rescuers.",
              "Don't go in after someone unless you're trained and wearing a supplied-air respirator like an SCBA. Responders have to be trained and protected before they enter.",
              "Before anyone enters a space where H2S may be, the air gets tested from outside, and rescue people and gear are in place first."
            ]
          }
        ],
        "ask": "If your monitor goes off right now, which way do you go and where do we meet?"
      },
      "es": {
        "title": "Ácido sulfhídrico (H2S)",
        "hook": "En niveles altos, el ácido sulfhídrico te puede tumbar en una o dos respiraciones. Y el olor a huevo podrido que esperas que te avise puede desaparecer.",
        "sections": [
          {
            "heading": "Conoce el gas",
            "items": [
              "El H2S es un gas sin color que huele a huevo podrido en niveles bajos. Es muy inflamable y es tóxico aun en niveles bajos.",
              "Es más pesado que el aire. Puede viajar a ras del suelo y juntarse en lugares bajos y espacios cerrados como fosas, registros, túneles y pozos.",
              "Lo puedes encontrar en pozos de petróleo y gas, drenajes, fosas sépticas y plantas de tratamiento de aguas residuales."
            ]
          },
          {
            "heading": "Tu nariz te va a engañar",
            "items": [
              "Después de un rato en niveles bajos, o muy rápido en niveles altos, ya no lo puedes oler.",
              "Nunca confíes en tu olfato para saber si hay H2S o cuánto hay.",
              "A 100 ppm o más, es un peligro inmediato para la vida y la salud. A 700 ppm o más, la gente se desploma en una o dos respiraciones.",
              "El límite de OSHA para la industria general es un techo de 20 ppm. La única excepción es un solo pico de hasta 50 ppm por hasta 10 minutos, y solo si no hay otra exposición medible en ese turno. En construcción, el límite es 10 ppm en promedio durante el turno."
            ]
          },
          {
            "heading": "Monitores y cómo salir",
            "items": [
              "Usa tu monitor personal lo más cerca posible de tu zona de respiración, como en el cuello de la camisa o arriba del pecho.",
              "Los monitores tienen que tener mantenimiento y calibración. Un detector que se deja en modo de prueba no puede sonar la alarma. Eso fue parte de una fuga mortal que investigó OSHA.",
              "En la industria, la alarma normalmente se pone a 10 ppm, y esa alarma significa salir. Conoce la dirección del viento por la manga de viento, tus rutas de escape y dónde está el área segura de reunión."
            ]
          },
          {
            "heading": "Rescate",
            "items": [
              "El H2S puede vencer casi al instante a trabajadores sin protección, incluyendo a los rescatistas.",
              "No entres por alguien a menos que estés entrenado y uses un respirador con suministro de aire, como un SCBA. Los rescatistas tienen que estar entrenados y protegidos antes de entrar.",
              "Antes de que alguien entre a un espacio donde puede haber H2S, se prueba el aire desde afuera, y el personal y el equipo de rescate tienen que estar listos primero."
            ]
          }
        ],
        "ask": "Si tu monitor suena ahorita mismo, ¿hacia dónde te vas y dónde nos reunimos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "load-securement",
    "industries": [
      "truck"
    ],
    "code": "49 CFR 393.100-393.110 / 392.9 (FMCSA)",
    "minutes": 6,
    "sources": [
      {
        "label": "FMCSA 49 CFR 393.100(a)-(c): applicability; prevent loss and shifting of load",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-393/subpart-I/section-393.100",
        "kind": "standard"
      },
      {
        "label": "FMCSA 49 CFR 393.102(a)(1)(i)-(iii): tiedown assemblies withstand 0.8 g forward, 0.5 g rearward, 0.5 g lateral",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-393/subpart-I/section-393.102",
        "kind": "standard"
      },
      {
        "label": "FMCSA 49 CFR 393.104(b), (c), (f)(1), (f)(3), (f)(4): condition of devices and anchor points, no knots, stay fastened, edge protection",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-393/subpart-I/section-393.104",
        "kind": "standard"
      },
      {
        "label": "FMCSA 49 CFR 393.106(a)-(b), (d)(1)-(d)(3): commodity-specific rules take precedence; cargo firmly immobilized or secured; aggregate working load limit (half or full value by tiedown type) at least one-half the weight",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-393/subpart-I/section-393.106",
        "kind": "standard"
      },
      {
        "label": "FMCSA 49 CFR 393.108(a)-(f): working load limit of a tiedown; marked and default values",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-393/subpart-I/section-393.108",
        "kind": "standard"
      },
      {
        "label": "FMCSA 49 CFR 393.110(b)-(d): minimum number of tiedowns; special-purpose vehicle exception",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-393/subpart-I/section-393.110",
        "kind": "standard"
      },
      {
        "label": "FMCSA 49 CFR 392.9(a), (b)(1)-(b)(4): driver inspection of cargo and securement en route",
        "url": "https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-392/subpart-A/section-392.9",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Securing Cargo",
        "hook": "Nothing on your truck should leak, spill, blow off or fall off. And nothing should shift enough to change how the truck handles.",
        "sections": [
          {
            "heading": "Whose rule this is",
            "items": [
              "This is a DOT rule, not an OSHA rule: the FMCSA cargo securement rule in 49 CFR Part 393. It covers trucks, tractors and trailers hauling cargo on public roads.",
              "Cargo has to be firmly immobilized or secured, using the truck's structure, dunnage, shoring bars, tiedowns, or a mix.",
              "Tiedowns have to be strong enough to hold the load in a hard stop, at 0.8 g forward, and against 0.5 g pushing it backward or sideways."
            ]
          },
          {
            "heading": "Working load limits",
            "items": [
              "A tiedown's working load limit is the lowest rating of any part in it, or of the anchor point it hooks to, whichever is less.",
              "The total working load limit of the tiedowns on a piece of cargo must be at least half its weight. A tiedown going over the cargo from one side of the truck to the other counts its full rating. One hooked straight to the cargo, or back to the same side, counts half.",
              "Go by the rating marked on the strap, chain or binder. If it isn't marked, the rule sets a default value."
            ]
          },
          {
            "heading": "How many tiedowns",
            "items": [
              "If nothing blocks the cargo from sliding forward: 5 feet long or less and 1,100 pounds or less needs at least one tiedown.",
              "5 feet or less but over 1,100 pounds needs at least two. So does anything over 5 feet and up to 10 feet, at any weight.",
              "Over 10 feet needs two, plus one more for every 10 feet, or part of 10 feet, past the first 10.",
              "If a headerboard, bulkhead or other blocking keeps it from moving forward, it needs at least one tiedown for every 10 feet of length, or part of 10 feet. Some cargo, like logs, metal coils and heavy equipment, has its own extra rules."
            ]
          },
          {
            "heading": "Check it, then check it again",
            "items": [
              "Before you drive, make sure the cargo is secured. Inspect the cargo and tiedowns within the first 50 miles.",
              "Check again whenever you change duty status, or after 3 hours or 150 miles of driving, whichever comes first. These checks don't apply to a sealed load you've been told not to open, or one loaded so it can't practically be inspected.",
              "No damaged or weakened straps, chains or anchor points. No knots. Tiedowns have to stay tight and fastened in transit. Use edge protection wherever a tiedown could get rubbed or cut."
            ]
          }
        ],
        "ask": "Pick a load we haul this week. How many tiedowns does it need, and do they cover half its weight, counted the way the rule says?"
      },
      "es": {
        "title": "Asegurar la carga",
        "hook": "Nada en tu camión debe gotear, derramarse, volarse ni caerse. Y nada debe moverse tanto que cambie cómo maneja el camión.",
        "sections": [
          {
            "heading": "De quién es esta regla",
            "items": [
              "Esta es una regla del DOT, no de OSHA: la regla de aseguramiento de carga de la FMCSA en el 49 CFR Parte 393. Cubre camiones, tractocamiones y remolques que llevan carga en caminos públicos.",
              "La carga tiene que estar firmemente inmovilizada o asegurada, con la estructura del camión, calzas o madera de estiba, barras de apuntalamiento, amarres, o una combinación.",
              "Los amarres tienen que ser lo bastante fuertes para aguantar la carga en un frenón, a 0.8 g hacia adelante, y contra 0.5 g que la empuje hacia atrás o hacia los lados."
            ]
          },
          {
            "heading": "Límites de carga de trabajo",
            "items": [
              "El límite de carga de trabajo de un amarre es el valor más bajo de cualquiera de sus partes, o del punto de anclaje donde se engancha, el que sea menor.",
              "El total de los límites de carga de trabajo de los amarres de una pieza de carga tiene que ser por lo menos la mitad de su peso. Un amarre que pasa por encima de la carga de un lado del camión al otro cuenta su valor completo. Uno enganchado directo a la carga, o que regresa al mismo lado, cuenta la mitad.",
              "Guíate por el valor marcado en la correa, la cadena o el tensor. Si no está marcado, la regla fija un valor por defecto."
            ]
          },
          {
            "heading": "Cuántos amarres",
            "items": [
              "Si nada impide que la carga se deslice hacia adelante: 5 pies de largo o menos y 1,100 libras o menos necesita por lo menos un amarre.",
              "5 pies o menos pero más de 1,100 libras necesita por lo menos dos. Igual cualquier cosa de más de 5 pies y hasta 10 pies, de cualquier peso.",
              "Más de 10 pies necesita dos, más uno adicional por cada 10 pies, o parte de 10 pies, después de los primeros 10.",
              "Si una cabecera, un mamparo u otro bloqueo impide que se mueva hacia adelante, necesita por lo menos un amarre por cada 10 pies de largo, o parte de 10 pies. Alguna carga, como troncos, rollos de metal y equipo pesado, tiene sus propias reglas extra."
            ]
          },
          {
            "heading": "Revísala, y luego revísala otra vez",
            "items": [
              "Antes de manejar, asegúrate de que la carga esté asegurada. Revisa la carga y los amarres dentro de las primeras 50 millas.",
              "Revisa otra vez cada vez que cambies de estado de servicio, o después de 3 horas o 150 millas de manejo, lo que pase primero. Estas revisiones no aplican a una carga sellada que te ordenaron no abrir, o a una carga acomodada de forma que no se puede revisar en la práctica.",
              "Nada de correas, cadenas o puntos de anclaje dañados o debilitados. Nada de nudos. Los amarres tienen que quedarse apretados y abrochados en camino. Usa protección de esquinas donde un amarre se pueda rozar o cortar."
            ]
          }
        ],
        "ask": "Escojan una carga que llevamos esta semana. ¿Cuántos amarres necesita, y cubren la mitad de su peso, contados como dice la regla?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "trailer-falls",
    "industries": [
      "truck",
      "wh"
    ],
    "code": "No OSHA standard specific to truck access; OSHA and NIOSH FACE guidance",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA Powered Industrial Trucks eTool: Traveling and Maneuvering (mounting and dismounting)",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/operating-forklift/traveling-maneuvering",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3944: Safety Practices Once Tractor Trailer Drivers Arrive at a Destination",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3944.pdf",
        "kind": "guidance"
      },
      {
        "label": "Michigan FACE (MIFACE) Report 12MI054, case findings and recommendations: truck porter fell from ICC bumper or deck of a semi-trailer",
        "url": "https://www.cdc.gov/niosh/face/pdfs/12mi054.pdf",
        "kind": "guidance"
      },
      {
        "label": "Iowa FACE Program (NIOSH-funded), case findings and recommendations: farmer slipped off tractor step; three-point contact",
        "url": "https://stacks.cdc.gov/view/cdc/166805/cdc_166805_DS1.pdf",
        "kind": "guidance"
      },
      {
        "label": "Massachusetts FACE MA-92-08 (with NIOSH), case findings and recommendations: truck driver fell from load on flatbed trailer",
        "url": "https://stacks.cdc.gov/view/cdc/166740/cdc_166740_DS1.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Getting On and Off Trucks and Trailers",
        "hook": "In one Michigan case, a truck yard worker died of head injuries after falling from a trailer's rear bumper or deck. Investigators found he most likely used the bumper as a step to reach the deck. A short climb can still kill you.",
        "sections": [
          {
            "heading": "Climbing on and off: OSHA's advice",
            "items": [
              "OSHA's guidance for forklift operators warns about slips and falls when you climb on or off, especially feet slipping off the step.",
              "It says to check your shoes for grease before you climb on, wear footwear that won't skid, and keep your hands clean and dry so they don't slip.",
              "Grab the handhold and get a good grip. Never grab the steering wheel. It can move and throw you off balance.",
              "Climb down the opposite way you climbed up. Don't jump, and watch your footing."
            ]
          },
          {
            "heading": "What investigators found",
            "items": [
              "In an Iowa case, a farmer slipped off the top step of his tractor and fell backward. Investigators recommended keeping three points of contact every time you climb on or off equipment.",
              "They also said both feet should be set on the steps when you move a hand to a new grip, and that there should be a handrail or grip on both sides of the steps.",
              "In the Michigan case, investigators said the rear bumper is not a good way onto a trailer deck. It has no handholds and little room for your feet.",
              "They recommended that employers make access ladders available, like a light, portable ladder with slip-resistant steps and handrails."
            ]
          },
          {
            "heading": "On the trailer and the load",
            "items": [
              "In a Massachusetts case, a driver securing a load of fencing on a flatbed lost his balance, slid down the unsecured rolls, and fell about 10 feet. He died eight days later.",
              "Investigators recommended that employers use ways to load and unload that don't put an unsecured worker up on the load.",
              "OSHA's guidance for drivers at a delivery stop says to make sure your footing is stable when you release the fifth wheel or adjust the tandems."
            ]
          }
        ],
        "ask": "Which truck or trailer here has a step, handle or ladder that's slick, loose or missing? Tell us now so it gets fixed."
      },
      "es": {
        "title": "Subir y bajar de camiones y tráileres",
        "hook": "En un caso en Michigan, un trabajador de un patio de camiones murió de lesiones en la cabeza después de caerse de la defensa trasera o de la plataforma de un tráiler. Los investigadores encontraron que lo más probable es que usó la defensa como escalón para llegar a la plataforma. Una subida corta también te puede matar.",
        "sections": [
          {
            "heading": "Subir y bajar: lo que aconseja OSHA",
            "items": [
              "La guía de OSHA para operadores de montacargas advierte sobre resbalones y caídas al subir o bajar, sobre todo cuando los pies se resbalan del escalón.",
              "Dice que revises que tus zapatos no tengan grasa antes de subir, que uses calzado que no resbale, y que mantengas las manos limpias y secas para que no se resbalen.",
              "Agarra la manija y sujétate bien. Nunca te agarres del volante. Se puede mover y hacerte perder el equilibrio.",
              "Bájate al revés de como te subiste. No brinques, y fíjate dónde pisas."
            ]
          },
          {
            "heading": "Lo que encontraron los investigadores",
            "items": [
              "En un caso en Iowa, un agricultor se resbaló del escalón de arriba de su tractor y se cayó de espaldas. Los investigadores recomendaron mantener tres puntos de contacto cada vez que te subas o te bajes de un equipo.",
              "También dijeron que los dos pies deben estar firmes en los escalones cuando muevas una mano a otro agarre, y que debe haber un pasamanos o una manija en los dos lados de los escalones.",
              "En el caso de Michigan, los investigadores dijeron que la defensa trasera no es una buena forma de subirse a la plataforma de un tráiler. No tiene de dónde agarrarse y hay poco espacio para los pies.",
              "Recomendaron que los empleadores tengan escaleras de acceso disponibles, como una escalera ligera y portátil con escalones antiderrapantes y pasamanos."
            ]
          },
          {
            "heading": "En el tráiler y la carga",
            "items": [
              "En un caso en Massachusetts, un chofer que aseguraba una carga de malla de alambre en una plataforma perdió el equilibrio, se resbaló por los rollos sin asegurar y se cayó unos 10 pies. Murió ocho días después.",
              "Los investigadores recomendaron que los empleadores usen formas de cargar y descargar que no pongan a un trabajador sin protección arriba de la carga.",
              "La guía de OSHA para choferes en una parada de entrega dice que te asegures de pisar firme cuando sueltes la quinta rueda o ajustes los ejes tándem."
            ]
          }
        ],
        "ask": "¿Qué camión o tráiler aquí tiene un escalón, una manija o una escalera resbalosa, floja o que falta? Dilo ahora para que se arregle."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "fueling",
    "industries": [
      "truck",
      "auto",
      "ag"
    ],
    "code": "1910.106(g) / 1926.152(g)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.106(b)(6): sources of ignition (open flames, smoking, static, electrical and mechanical sparks)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.106",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.106(g)(1)(v): dispensing into portable containers (page 2 of the standard)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.106",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.106(g)(3)(iii), (g)(3)(vi)(b): emergency power shutoff switch; manual-closing nozzles held open by hand",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.106",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.106(g)(7): drainage and waste disposal",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.106",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.106(g)(8): sources of ignition at service stations (no smoking, signs, motors shut off)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.106",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.106(g)(9): fire extinguisher within 75 feet",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.106",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.152(f)(2): leakage or spillage disposed of promptly and safely",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.152",
        "kind": "standard"
      },
      {
        "label": "OSHA 1926.152(g)(6), (g)(8)-(g)(11): service and refueling areas (shutoff switch, no smoking, signs, motors shut off, extinguisher)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.152",
        "kind": "standard"
      },
      {
        "label": "NIOSH Publication No. 98-111 (guidance): Fire Hazard from Filling Portable Gas Cans in Pickup Trucks and Cars",
        "url": "https://stacks.cdc.gov/view/cdc/11557/cdc_11557_DS1.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Fueling Safely",
        "hook": "Fuel vapor can be lit by an open flame, a cigarette, or a spark, even a static spark. Every rule at the pump is about keeping those away from the vapor.",
        "sections": [
          {
            "heading": "At the pump",
            "items": [
              "Shut the engine off. OSHA's rules for service stations and construction fueling areas say the motors of all equipment being fueled are shut off during fueling.",
              "No smoking and no open flames where fuel is dispensed or fuel systems are worked on. Signs banning smoking have to be posted.",
              "If the nozzle is the manual kind, hold it open by hand the whole time.",
              "Know where the emergency shutoff is. The rules call for a clearly marked switch, away from the pumps, that cuts power to all of them."
            ]
          },
          {
            "heading": "Filling a gas can",
            "items": [
              "NIOSH, the federal safety research agency, gives this advice for gas cans: take the can out of the truck bed or car and set it on the ground before you fill it. Don't fill it in the vehicle.",
              "NIOSH also says to touch the can with the nozzle before you take the lid off, and keep the nozzle touching the can opening the whole time you fill. That gives static a path to ground.",
              "OSHA's service station rule says gas goes only into a metal can with a tight screw or spring cover and a spout, or one built to pour without spilling."
            ]
          },
          {
            "heading": "Spills and fire",
            "items": [
              "At a service station, spilled fuel can't be allowed to run into the building. Driveways are graded or door sills raised to stop it.",
              "Never dump fuel or drained crankcase oil into a sewer. It's stored in tanks or drums outside the building until it's hauled away.",
              "On construction sites, the rule also says leaks and spills get cleaned up promptly and safely.",
              "The rules call for at least one fire extinguisher within 75 feet of each pump. Know where it is before you need it."
            ]
          }
        ],
        "ask": "At the place we fuel most, where's the emergency shutoff and where's the extinguisher?"
      },
      "es": {
        "title": "Cargar combustible con seguridad",
        "hook": "El vapor del combustible se puede encender con una llama, un cigarro o una chispa, hasta una chispa de estática. Cada regla en la bomba es para mantener esas cosas lejos del vapor.",
        "sections": [
          {
            "heading": "En la bomba",
            "items": [
              "Apaga el motor. Las reglas de OSHA para estaciones de servicio y áreas de carga en construcción dicen que los motores de todo equipo que se está cargando se apagan durante la carga.",
              "No se fuma y no hay llamas donde se despacha combustible o se trabaja en sistemas de combustible. Tiene que haber letreros que prohíben fumar.",
              "Si la boquilla es de las manuales, sostenla abierta con la mano todo el tiempo.",
              "Sabe dónde está el corte de emergencia. Las reglas piden un interruptor bien marcado, lejos de las bombas, que les corta la corriente a todas."
            ]
          },
          {
            "heading": "Llenar un galón de gasolina",
            "items": [
              "NIOSH, la agencia federal de investigación en seguridad, da este consejo para los galones de gasolina: saca el galón de la caja de la troca o del carro y ponlo en el suelo antes de llenarlo. No lo llenes dentro del vehículo.",
              "NIOSH también dice que toques el galón con la boquilla antes de quitarle la tapa, y que mantengas la boquilla tocando la boca del galón todo el tiempo que lo llenas. Eso le da a la estática un camino a tierra.",
              "La regla de OSHA para estaciones de servicio dice que la gasolina solo va en un galón de metal con tapa de rosca o de resorte bien cerrada y con pico, o uno hecho para servir sin derramar."
            ]
          },
          {
            "heading": "Derrames y fuego",
            "items": [
              "En una estación de servicio, no se puede dejar que el combustible derramado corra hacia dentro del edificio. Las entradas tienen pendiente o los umbrales están elevados para detenerlo.",
              "Nunca tires combustible ni aceite usado del cárter al drenaje. Se guarda en tanques o tambos afuera del edificio hasta que se lo lleven.",
              "En obras de construcción, la regla también dice que las fugas y derrames se limpian pronto y de forma segura.",
              "Las reglas piden por lo menos un extintor a no más de 75 pies de cada bomba. Sabe dónde está antes de necesitarlo."
            ]
          }
        ],
        "ask": "En el lugar donde más cargamos combustible, ¿dónde está el corte de emergencia y dónde está el extintor?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "tire-rims",
    "industries": [
      "truck",
      "auto"
    ],
    "code": "1910.177",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.177(a)(1)-(a)(2): scope (large-vehicle rim wheels; automobile, pickup and van wheels with automobile or LT tires excluded; employers under parts 1918, 1926, 1928 excluded)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.177(b): definitions of restraining device and trajectory",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.177(c)(1)-(c)(3): employee training and demonstrated ability",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.177(d)(1)-(d)(6): restraining devices, barriers, inspection, air line with clip-on chuck, rim manuals, tools",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.177(e)(1)-(e)(2): component interchange and inspection",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.177(f)(1), (f)(2), (f)(4)-(f)(11): multi-piece rim wheel procedures",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.177(g)(1), (g)(6), (g)(8), (g)(11)-(g)(12): single piece rim wheel procedures",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.177",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Servicing Truck Tires and Rims",
        "hook": "A big rim wheel under pressure can come apart with explosive force. The parts fly out along a path called the trajectory, and you never want to be in it.",
        "sections": [
          {
            "heading": "Who this covers",
            "items": [
              "This OSHA rule covers rim wheels on big vehicles: trucks, tractors, trailers, buses and off-road machines. It does not cover car tires, or pickup and van wheels with car or LT tires.",
              "Your company has to train everyone who services these wheels on the hazards and the safe steps. It has to check that you can do each task safely, and retrain you as needed.",
              "The charts or rim manuals for the wheels you work on have to be in the service area. Use only the tools the manual recommends for that wheel."
            ]
          },
          {
            "heading": "Deflate first, inspect everything",
            "items": [
              "Pull the valve core and let all the air out before you demount a tire.",
              "On a multi-piece wheel, also deflate before you take it off the axle if the tire was run at 80 percent or less of its recommended pressure, or if the tire or wheel is damaged or might be.",
              "Inspect every part before you put it together. Bent, cracked, broken or pitted parts get tagged unserviceable and pulled out. Don't mix rim parts unless the chart or manual allows it.",
              "Never weld, braze, heat or rework a damaged rim part. Never put heat on a rim wheel."
            ]
          },
          {
            "heading": "Cage, chuck, and the trajectory",
            "items": [
              "Multi-piece wheels off the vehicle: inflate outside the cage only enough to seat the bead. The rest happens inside a cage or other restraining device. Don't lean on it or rest anything against it.",
              "Single-piece wheels: inflate only in a cage, behind a barrier, or bolted on the vehicle with the lug nuts fully tight.",
              "Your company has to give you an air line with a clip-on chuck, an in-line valve with a gauge or preset regulator, and enough hose so you can stand out of the trajectory.",
              "The trajectory is any path a rim part could fly. It may not be straight out from the wheel. Stay out of it while the tire fills."
            ]
          },
          {
            "heading": "If something looks wrong",
            "items": [
              "Check that the parts are seated right while the wheel is still in the cage. If they aren't, pull the valve core and deflate before you adjust anything.",
              "Never hammer or force a ring while the tire has air in it.",
              "The cage gets inspected before each day's use and after any blowout. Cracked welds, bent or broken parts, or corrosion pitting take it out of service until it's repaired and rechecked."
            ]
          }
        ],
        "ask": "Where's our cage and clip-on chuck, and where exactly do you stand when a tire is filling?"
      },
      "es": {
        "title": "Servicio de llantas y rines de camión",
        "hook": "Un rin grande con presión se puede separar con fuerza explosiva. Las piezas salen volando por un camino llamado la trayectoria, y nunca quieres estar en él.",
        "sections": [
          {
            "heading": "A quién aplica",
            "items": [
              "Esta regla de OSHA cubre los rines de vehículos grandes: camiones, tractores, remolques, autobuses y máquinas todoterreno. No cubre llantas de carro, ni rines de pickup o van con llantas de carro o LT.",
              "Tu compañía tiene que entrenar a todos los que dan servicio a estos rines sobre los peligros y los pasos seguros. Tiene que comprobar que puedes hacer cada tarea de forma segura, y volver a entrenarte si hace falta.",
              "Las tablas o manuales de rines para los rines que trabajas tienen que estar en el área de servicio. Usa solo las herramientas que el manual recomienda para ese rin."
            ]
          },
          {
            "heading": "Primero desinfla, revisa todo",
            "items": [
              "Saca el núcleo de la válvula y saca todo el aire antes de desmontar una llanta.",
              "En un rin de varias piezas, también desinfla antes de quitarlo del eje si la llanta se usó al 80 por ciento o menos de su presión recomendada, o si la llanta o el rin está dañado o podría estarlo.",
              "Revisa cada pieza antes de armarla. Las piezas dobladas, rajadas, rotas o picadas se etiquetan como no servibles y se retiran. No mezcles piezas de rin a menos que la tabla o el manual lo permita.",
              "Nunca soldes, ni calientes, ni repares una pieza de rin dañada. Nunca le apliques calor a un rin."
            ]
          },
          {
            "heading": "Jaula, boquilla y la trayectoria",
            "items": [
              "Rines de varias piezas fuera del vehículo: infla fuera de la jaula solo lo necesario para asentar la ceja. El resto se hace dentro de una jaula u otro dispositivo de contención. No te recargues en ella ni le pongas nada encima.",
              "Rines de una pieza: infla solo dentro de una jaula, detrás de una barrera, o montado en el vehículo con las tuercas bien apretadas.",
              "Tu compañía tiene que darte una línea de aire con boquilla de clip, una válvula en línea con manómetro o regulador preajustado, y suficiente manguera para que te pares fuera de la trayectoria.",
              "La trayectoria es cualquier camino por donde podría volar una pieza del rin. Puede que no sea derecho hacia afuera del rin. Quédate fuera de ella mientras la llanta se llena."
            ]
          },
          {
            "heading": "Si algo se ve mal",
            "items": [
              "Revisa que las piezas estén bien asentadas mientras el rin sigue en la jaula. Si no lo están, saca el núcleo de la válvula y desinfla antes de ajustar cualquier cosa.",
              "Nunca golpees ni forces un anillo mientras la llanta tiene aire.",
              "La jaula se revisa antes de usarse cada día y después de cualquier reventón. Soldaduras rajadas, piezas dobladas o rotas, o corrosión con picaduras la sacan de servicio hasta que se repare y se vuelva a revisar."
            ]
          }
        ],
        "ask": "¿Dónde están nuestra jaula y la boquilla de clip, y dónde exactamente te paras cuando se está llenando una llanta?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "vehicle-lifts",
    "industries": [
      "auto"
    ],
    "code": "No OSHA lift standard; OSH Act 5(a)(1) (guidance)",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA interpretation, Nov. 19, 2014: OSHA Standards Applicable to Automotive Service Lifts (no specific standard; General Duty Clause; manufacturer recommendations)",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2014-11-19",
        "kind": "guidance"
      },
      {
        "label": "NIOSH FACE (California) 03CA010: mechanic killed when vehicle slipped off a 2-post lift",
        "url": "https://www.cdc.gov/niosh/face/stateface/ca/03CA010.html",
        "kind": "guidance"
      },
      {
        "label": "OSHA accident report: car fell from improperly positioned lift arms (1994)",
        "url": "https://www.osha.gov/ords/imis/accidentsearch.accident_detail?id=553644",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Vehicle Lifts",
        "hook": "When a vehicle comes off a lift, it lands on whoever is under it. Mechanics have died this way when the lift arms were in the wrong spot.",
        "sections": [
          {
            "heading": "What the rules say",
            "items": [
              "OSHA has no specific standard for using automotive lifts. Be clear on that.",
              "Your company still has to keep the shop free of recognized hazards that can kill or seriously hurt you. The lift maker's instructions are part of how those hazards are known."
            ]
          },
          {
            "heading": "What investigators found: the lift arms",
            "items": [
              "In one death, a pickup was too long for the lift. The rear arms couldn't reach the lift points the truck maker recommended. When the mechanic raised it one more time, an arm shifted and the truck fell on him.",
              "Investigators in that case said the arms must go on the spots under the vehicle that the vehicle maker recommends. If the arms can't reach those spots, the vehicle should not be lifted.",
              "They also said to make sure the lift can raise that vehicle safely. That truck was within the weight limit, but it was too long for the lift."
            ]
          },
          {
            "heading": "What investigators found: training and manuals",
            "items": [
              "In two deaths investigators looked at, the worker had no training on the lift.",
              "In one of them, a car tilted forward off badly placed arms. The worker seems to have tried to right it from underneath, and the arms collapsed on him.",
              "In the pickup case, the shop had no manual for the lift. Nobody could check the maker's recommendations for running and maintaining it. Investigators said a properly trained mechanic would have known where to place the arms."
            ]
          }
        ],
        "ask": "On the vehicle you're working on today, where are the lift points, and how did you find them?"
      },
      "es": {
        "title": "Elevadores de vehículos",
        "hook": "Cuando un vehículo se cae de un elevador, cae encima de quien esté debajo. Han muerto mecánicos así cuando los brazos del elevador estaban en el lugar equivocado.",
        "sections": [
          {
            "heading": "Lo que dicen las reglas",
            "items": [
              "OSHA no tiene una norma específica para el uso de elevadores de autos. Que eso quede claro.",
              "Aun así, tu empresa tiene que mantener el taller libre de peligros reconocidos que te puedan matar o lastimar gravemente. Las instrucciones del fabricante del elevador son parte de cómo se conocen esos peligros."
            ]
          },
          {
            "heading": "Lo que encontraron los investigadores: los brazos del elevador",
            "items": [
              "En una muerte, una camioneta era demasiado larga para el elevador. Los brazos de atrás no alcanzaban los puntos de levante que recomendaba el fabricante de la camioneta. Cuando el mecánico la subió una vez más, un brazo se movió y la camioneta le cayó encima.",
              "Los investigadores de ese caso dijeron que los brazos deben ir en los puntos debajo del vehículo que recomienda el fabricante del vehículo. Si los brazos no alcanzan esos puntos, no se debe levantar el vehículo.",
              "También dijeron que hay que asegurarse de que el elevador pueda levantar ese vehículo de forma segura. Esa camioneta no pasaba del límite de peso, pero era demasiado larga para el elevador."
            ]
          },
          {
            "heading": "Lo que encontraron los investigadores: capacitación y manuales",
            "items": [
              "En dos muertes que investigaron, el trabajador no tenía capacitación en el elevador.",
              "En una de ellas, un carro se ladeó hacia adelante porque los brazos estaban mal puestos. Parece que el trabajador trató de enderezarlo desde abajo, y los brazos se le vinieron encima.",
              "En el caso de la camioneta, el taller no tenía manual del elevador. Nadie podía revisar las recomendaciones del fabricante para operarlo y mantenerlo. Los investigadores dijeron que un mecánico bien capacitado habría sabido dónde poner los brazos."
            ]
          }
        ],
        "ask": "En el vehículo en que trabajas hoy, ¿dónde están los puntos de levantamiento, y cómo los encontraste?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "jacks-stands",
    "industries": [
      "auto",
      "truck"
    ],
    "code": "1910.244(a)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.244(a)(1): jack rating and rated-load marking",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.244",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.244(a)(2)(i)-(iii): blocking the base and cap, stop indicator, securing the raised load",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.244",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.244(a)(2)(iv), (vi), (viii): antifreeze, inspection intervals, tagging out-of-order jacks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.244",
        "kind": "standard"
      },
      {
        "label": "NIOSH FACE (Nebraska) 99NE018: mechanic killed when bus slipped off a bottle jack",
        "url": "https://www.cdc.gov/niosh/face/stateface/ne/99ne018.html",
        "kind": "guidance"
      },
      {
        "label": "NIOSH FACE (Iowa) 95IA033: worker crushed under car held up only by a forklift",
        "url": "https://www.cdc.gov/niosh/face/stateface/ia/95ia033.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Jacks and Jack Stands",
        "hook": "A jack is for lifting, not for holding. In one fatality report, a bus slid off a bottle jack and killed the mechanic under it. Jack stands were right there in the shop.",
        "sections": [
          {
            "heading": "Know the rating",
            "items": [
              "Before you use a jack, make sure its rating is enough to lift and hold the load.",
              "Every jack has to have its rated load marked on it, permanently and where you can see it.",
              "Investigators in the bus case said vehicles should be lifted and secured the way the maker's instructions say, and those instructions should be on hand. If they aren't around, ask for them."
            ]
          },
          {
            "heading": "Set it up right",
            "items": [
              "If the ground isn't firm, block under the base of the jack.",
              "If the cap could slip, put a block between the cap and the load.",
              "Watch the stop indicator and don't go past its limit."
            ]
          },
          {
            "heading": "Never work under a load on a jack",
            "items": [
              "Once the load is up, crib it, block it, or secure it right away.",
              "Those investigators said anything that could fall should be blocked before anyone gets under it. Adequate jack stands and wood blocks were both on site, and weren't used.",
              "A forklift is not a stand. In another death, investigators said mechanics should not work under a car held up only by a forklift."
            ]
          },
          {
            "heading": "Keep jacks in shape",
            "items": [
              "Jacks get a thorough inspection at least every 6 months when used in one place. They also get one before and after any abnormal load or shock, and when sent out for special work and when they come back.",
              "A jack that's out of order gets tagged and isn't used until it's repaired.",
              "A hydraulic jack that sees freezing weather needs the right antifreeze fluid."
            ]
          }
        ],
        "ask": "Before anyone goes under a vehicle today, what is holding it up, and who checked it?"
      },
      "es": {
        "title": "Gatos y soportes (burros)",
        "hook": "Un gato es para levantar, no para sostener. En un informe de una muerte, un autobús se resbaló de un gato de botella y mató al mecánico que estaba debajo. Había soportes ahí mismo en el taller.",
        "sections": [
          {
            "heading": "Conoce la capacidad",
            "items": [
              "Antes de usar un gato, asegúrate de que su capacidad alcance para levantar y sostener la carga.",
              "Todo gato tiene que tener marcada su carga nominal, de forma permanente y donde se vea.",
              "Los investigadores del caso del autobús dijeron que los vehículos se deben levantar y asegurar como dicen las instrucciones del fabricante, y que esas instrucciones deben estar a la mano. Si no están, pídelas."
            ]
          },
          {
            "heading": "Colócalo bien",
            "items": [
              "Si el piso no es firme, pon bloques debajo de la base del gato.",
              "Si la cabeza del gato se puede resbalar, pon un bloque entre la cabeza y la carga.",
              "Fíjate en el indicador de tope y no pases de su límite."
            ]
          },
          {
            "heading": "Nunca trabajes debajo de una carga sobre un gato",
            "items": [
              "En cuanto la carga esté arriba, ponle calzas, bloques o asegúrala de otra forma de inmediato.",
              "Esos investigadores dijeron que todo lo que se pueda caer se debe bloquear antes de que alguien se meta debajo. Había soportes adecuados y bloques de madera en el lugar, y no se usaron.",
              "Un montacargas no es un soporte. En otra muerte, los investigadores dijeron que los mecánicos no deben trabajar debajo de un carro sostenido solo por un montacargas."
            ]
          },
          {
            "heading": "Mantén los gatos en buen estado",
            "items": [
              "Los gatos reciben una inspección completa por lo menos cada 6 meses cuando se usan en un solo lugar. También reciben una antes y después de cualquier carga o golpe fuera de lo normal, y cuando se mandan a un trabajo especial y cuando regresan.",
              "Un gato que no funciona bien se etiqueta y no se usa hasta que lo reparen.",
              "Un gato hidráulico que va a estar en temperaturas de congelación necesita el líquido anticongelante correcto."
            ]
          }
        ],
        "ask": "Antes de que alguien se meta debajo de un vehículo hoy, ¿qué lo está sosteniendo, y quién lo revisó?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "spray-booths",
    "industries": [
      "auto"
    ],
    "code": "1910.107 / 1910.94(c) / 1910.134",
    "minutes": 6,
    "sources": [
      {
        "label": "OSHA 1910.107(c)(2), (c)(3): no open flames, spark-producing equipment, or hot surfaces in spraying areas",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.107",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.107(d)(2): mechanical ventilation kept in operation while spraying and for a sufficient time after",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.107",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.107(e)(2), (e)(9), (g)(3), (g)(7): one-day/one-shift supply, bonding and grounding, metal waste cans, No Smoking signs",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.107",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.94(c)(6)(iii)(a)-(b): respirator for operators downstream of the object; downdraft booth doors closed",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.94",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(a)(2), (d)(3)(iii)(B), (e)(1), (f)(2), (g)(1)(i), (g)(1)(iii): respirators, change schedules, medical evaluation, fit testing, facial hair, seal checks",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA Isocyanates",
        "url": "https://www.osha.gov/isocyanates",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3707: Isocyanates: Do You Have Work-Related Asthma?",
        "url": "https://www.osha.gov/Publications/OSHA3707.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA interpretation 2000-07-18: air-purifying respirators for diisocyanates (poor warning properties)",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2000-07-18",
        "kind": "guidance"
      },
      {
        "label": "NIOSH 96-111: Preventing Asthma and Death from Diisocyanate Exposure",
        "url": "https://www.cdc.gov/niosh/docs/96-111/pdfs/96-111.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Spray Painting and Booths",
        "hook": "Spray painting has two big dangers: fire, and what you breathe. Some paints contain isocyanates, and isocyanates can cause asthma.",
        "sections": [
          {
            "heading": "Keep the air moving",
            "items": [
              "The ventilation has to be running the whole time anyone is spraying. Leave it on long enough after to clear the vapors from drying parts.",
              "If it's a downdraft booth with doors, keep the doors closed while you spray.",
              "If you're in the booth downstream of the part you're painting, you must wear a NIOSH-approved respirator that's right for the material."
            ]
          },
          {
            "heading": "No sparks, no flames",
            "items": [
              "No open flames or spark-producing equipment in the spraying area. No space heaters, steam pipes, or hot surfaces there either.",
              "No Smoking signs have to be posted in spray areas. Obey them.",
              "Keep only the paint and solvent you need. That's usually no more than one day's or one shift's supply.",
              "Rags soaked with paint go in an approved metal waste can. When you pour from one container to another, both have to be bonded and grounded so static can't spark."
            ]
          },
          {
            "heading": "Isocyanates and your lungs",
            "items": [
              "Isocyanates get into you two ways: you breathe them in, or they get on your skin.",
              "Once you're sensitized, even a small exposure can set off a severe asthma attack. Deaths have been reported.",
              "Wear coveralls and chemical-resistant gloves so it stays off your skin.",
              "Watch for coughing, wheezing, shortness of breath, or a tight chest. It can start at work or hours after you leave. Report it to your company and see a doctor."
            ]
          },
          {
            "heading": "Your respirator",
            "items": [
              "Your company has to give you a respirator when you need one. Before you wear a tight-fitting one, your company has to get you a medical evaluation and a fit test, and a fit test at least once a year after that.",
              "Facial hair can't come between the mask and your face. Do a seal check every time you put it on.",
              "Isocyanates have poor warning properties. You can't count on smell to tell you a cartridge is used up. Change cartridges on your company's change schedule."
            ]
          }
        ],
        "ask": "Before anyone sprays today: who checks that the booth ventilation is on and that your respirator seals?"
      },
      "es": {
        "title": "Pintura con pistola y cabinas",
        "hook": "Pintar con pistola tiene dos peligros grandes: el fuego y lo que respiras. Algunas pinturas tienen isocianatos, y los isocianatos pueden causar asma.",
        "sections": [
          {
            "heading": "Que el aire siga corriendo",
            "items": [
              "La ventilación tiene que estar funcionando todo el tiempo que alguien esté pintando. Déjala prendida un buen rato después para sacar los vapores de las piezas que se están secando.",
              "Si es una cabina de tiro hacia abajo con puertas, mantén las puertas cerradas mientras pintas.",
              "Si estás dentro de la cabina, del lado hacia donde va el aire después de pasar por la pieza que pintas, tienes que usar un respirador aprobado por NIOSH que sea el adecuado para ese material."
            ]
          },
          {
            "heading": "Nada de chispas ni llamas",
            "items": [
              "Nada de llamas abiertas ni equipo que haga chispas en el área de pintura. Tampoco calentadores, tubos de vapor ni superficies calientes.",
              "Tiene que haber letreros de No Fumar en las áreas de pintura. Respétalos.",
              "Ten solo la pintura y el solvente que necesitas. Por lo general, no más de lo que se usa en un día o en un turno.",
              "Los trapos empapados de pintura van en un bote de basura de metal aprobado. Cuando pases líquido de un recipiente a otro, los dos tienen que estar conectados entre sí y a tierra para que la estática no haga chispa."
            ]
          },
          {
            "heading": "Los isocianatos y tus pulmones",
            "items": [
              "Los isocianatos te entran de dos maneras: los respiras o te caen en la piel.",
              "Una vez que te sensibilizas, hasta una exposición pequeña te puede provocar un ataque de asma fuerte. Se han reportado muertes.",
              "Usa overol y guantes resistentes a químicos para que no te toque la piel.",
              "Pon atención si tienes tos, silbido al respirar, falta de aire o el pecho apretado. Puede empezar en el trabajo o varias horas después de salir. Repórtalo a tu compañía y ve al médico."
            ]
          },
          {
            "heading": "Tu respirador",
            "items": [
              "Tu compañía te tiene que dar un respirador cuando lo necesites. Antes de que uses uno de ajuste apretado, tu compañía te tiene que dar una evaluación médica y una prueba de ajuste, y después una prueba de ajuste por lo menos una vez al año.",
              "El vello de la cara no puede quedar entre la mascarilla y tu cara. Revisa el sello cada vez que te la pongas.",
              "Los isocianatos casi no dan señales de aviso. No puedes confiar en el olor para saber si un cartucho ya no sirve. Cambia los cartuchos según el horario de cambio de tu compañía."
            ]
          }
        ],
        "ask": "Antes de que alguien pinte hoy: ¿quién revisa que la ventilación de la cabina esté prendida y que tu respirador selle bien?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "co-exhaust",
    "industries": [
      "auto",
      "wh",
      "facil"
    ],
    "code": "1910.1000 Table Z-1",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.1000(a)(2) and Table Z-1: carbon monoxide 50 ppm, 8-hour TWA",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1000TABLEZ1",
        "kind": "standard"
      },
      {
        "label": "OSHA Fact Sheet: Carbon Monoxide Poisoning (FS-3522)",
        "url": "https://www.osha.gov/sites/default/files/publications/CARBONMONOXIDE-FACTSHEET.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA QuickCard 3282: Carbon Monoxide Poisoning",
        "url": "https://www.osha.gov/sites/default/files/publications/CARBON_MONOXIDE.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Alert 4105: Preventing CO Poisoning While Working with Portable Generators",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA4105.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Carbon Monoxide",
        "hook": "Carbon monoxide has no color, no smell, and no taste. It can knock you down without warning.",
        "sections": [
          {
            "heading": "Where it comes from",
            "items": [
              "CO comes from burning fuel: gasoline, propane, natural gas, kerosene, oil, coal, or wood.",
              "One of the most common sources at work is a running engine. Forklifts, heaters, generators, pressure washers, concrete saws, and compressors make it too.",
              "OSHA's limit is 50 parts per million, averaged over an 8-hour shift."
            ]
          },
          {
            "heading": "Keep it out of the air",
            "items": [
              "Don't run gas-powered engines or tools in enclosed spaces or places with poor ventilation.",
              "Never run a portable generator indoors, or in a garage, basement, or crawl space. Keep it away from doors, windows, and vents.",
              "OSHA says your company should have ventilation that removes CO, keep fuel-burning equipment in good working order, and look at electric, battery, or air-powered tools instead. Where CO exposure is possible, OSHA recommends personal CO monitors with alarms.",
              "Watch for ventilation problems, especially in enclosed areas. Report anything that could let CO build up."
            ]
          },
          {
            "heading": "Know the signs",
            "items": [
              "Early signs are headache, tiredness, dizziness, drowsiness, nausea, and a tight chest.",
              "More exposure brings vomiting, confusion, collapse, and passing out. Severe CO poisoning can cause nerve damage, coma, and death.",
              "Feel dizzy, drowsy, or sick to your stomach? Report it right away. If you get sick later, tell your doctor you may have been exposed to CO."
            ]
          },
          {
            "heading": "If someone goes down",
            "items": [
              "Get them to fresh air in an open area right away, and call 911.",
              "If they've stopped breathing, start CPR.",
              "Rescuers can be poisoned too. If you think you're breathing CO, leave the area and don't overexert yourself."
            ]
          }
        ],
        "ask": "What engines, heaters, or generators will run inside today, and how does their exhaust get out?"
      },
      "es": {
        "title": "Monóxido de carbono",
        "hook": "El monóxido de carbono no tiene color, ni olor, ni sabor. Te puede tumbar sin aviso.",
        "sections": [
          {
            "heading": "De dónde sale",
            "items": [
              "El CO sale cuando se quema combustible: gasolina, propano, gas natural, queroseno, aceite, carbón o leña.",
              "Una de las fuentes más comunes en el trabajo es un motor prendido. Los montacargas, calentadores, generadores, lavadoras a presión, sierras de concreto y compresores también lo producen.",
              "El límite de OSHA es de 50 partes por millón, en promedio durante un turno de 8 horas."
            ]
          },
          {
            "heading": "Que no se acumule en el aire",
            "items": [
              "No uses motores ni herramientas de gasolina en espacios cerrados ni en lugares con mala ventilación.",
              "Nunca prendas un generador portátil adentro, ni en un garaje, sótano o espacio debajo de la casa. Mantenlo lejos de puertas, ventanas y ventilas.",
              "OSHA dice que tu compañía debe tener ventilación que saque el CO, mantener en buen estado el equipo que quema combustible y considerar herramientas eléctricas, de batería o de aire. Donde puede haber exposición al CO, OSHA recomienda monitores personales de CO con alarma.",
              "Fíjate en problemas de ventilación, sobre todo en áreas cerradas. Reporta cualquier cosa que pueda hacer que se acumule el CO."
            ]
          },
          {
            "heading": "Conoce las señales",
            "items": [
              "Las primeras señales son dolor de cabeza, cansancio, mareo, sueño, náuseas y el pecho apretado.",
              "Con más exposición vienen vómito, confusión, desmayo y pérdida del conocimiento. Una intoxicación grave por CO puede causar daño neurológico, coma y la muerte.",
              "¿Te sientes mareado, con sueño o con el estómago revuelto? Repórtalo de inmediato. Si te enfermas después, dile a tu médico que pudiste haber estado expuesto al CO."
            ]
          },
          {
            "heading": "Si alguien cae",
            "items": [
              "Llévalo de inmediato al aire fresco, a un área abierta, y llama al 911.",
              "Si dejó de respirar, empieza RCP.",
              "Los rescatistas también se pueden intoxicar. Si crees que estás respirando CO, sal del área y no hagas mucho esfuerzo."
            ]
          }
        ],
        "ask": "¿Qué motores, calentadores o generadores van a estar prendidos adentro hoy, y por dónde sale su escape?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "auto-batteries",
    "industries": [
      "auto",
      "truck"
    ],
    "code": "1910.151(c) / 1910.133(a)(1)",
    "minutes": 4,
    "sources": [
      {
        "label": "OSHA 1910.151(c): quick drenching or flushing facilities where corrosive materials are present",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.133(a)(1): eye or face protection for acids or caustic liquids",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.133",
        "kind": "standard"
      },
      {
        "label": "OSHA Powered Industrial Trucks eTool, Power Sources: Electric (battery hazards and handling)",
        "url": "https://www.osha.gov/etools/powered-industrial-trucks/types-fundamentals/power-sources/electrical",
        "kind": "guidance"
      },
      {
        "label": "OSHA interpretation 2013-03-04: 1910.151(c) and battery acid exposure",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/2013-03-04",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Pocket Guide: Sulfuric acid",
        "url": "https://www.cdc.gov/niosh/npg/npgd0577.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Vehicle Batteries",
        "hook": "A battery holds acid that burns, and it can give off a gas that explodes. Respect it every time.",
        "sections": [
          {
            "heading": "What's in there",
            "items": [
              "Battery acid is sulfuric acid. It's highly corrosive.",
              "Toward the end of charging, a battery can give off hydrogen. Hydrogen is highly explosive."
            ]
          },
          {
            "heading": "No sparks near a battery",
            "items": [
              "OSHA's battery guidance says: no smoking, open flames, or sparks where batteries are charging.",
              "Take off rings and other metal jewelry before you charge a battery.",
              "Keep tools and other metal off the top of the battery. Touching the cells can cause a short that burns your skin.",
              "Turn off and unplug the charger before you connect or disconnect the clamps."
            ]
          },
          {
            "heading": "Protect your eyes and skin",
            "items": [
              "Your company has to make sure you wear eye or face protection when you're exposed to acids.",
              "For battery work, OSHA's guidance lists a face shield, safety goggles, and rubber or neoprene gloves and apron.",
              "Wear contacts? The same guidance says to wear chemical splash goggles. Contact lenses can hold acid against your eye."
            ]
          },
          {
            "heading": "If acid gets on you",
            "items": [
              "Where corrosives like battery acid could get in your eyes or on your body, your company has to provide a place to flush or drench them, right in the work area.",
              "Acid in your eyes? Get to the eyewash and flush with clean water for 15 minutes. Then get medical attention right away.",
              "Acid on your skin? Take off the soaked clothes and flush the skin with clean water for 15 minutes. Get medical attention right away if you see redness or burns."
            ]
          }
        ],
        "ask": "Where is the nearest eyewash to the spot where we work on batteries? Point to it."
      },
      "es": {
        "title": "Baterías de vehículos",
        "hook": "Una batería tiene ácido que quema, y puede soltar un gas que explota. Respétala cada vez.",
        "sections": [
          {
            "heading": "Qué tiene adentro",
            "items": [
              "El ácido de batería es ácido sulfúrico. Es muy corrosivo.",
              "Al final de la carga, una batería puede soltar hidrógeno. El hidrógeno es muy explosivo."
            ]
          },
          {
            "heading": "Nada de chispas cerca de una batería",
            "items": [
              "La guía de OSHA sobre baterías dice: nada de fumar, llamas abiertas ni chispas donde se están cargando baterías.",
              "Quítate anillos y otras joyas de metal antes de cargar una batería.",
              "No dejes herramientas ni otras cosas de metal encima de la batería. Si tocas las celdas puedes hacer un corto que te quema la piel.",
              "Apaga y desconecta el cargador antes de poner o quitar las pinzas."
            ]
          },
          {
            "heading": "Protege tus ojos y tu piel",
            "items": [
              "Tu compañía tiene que asegurarse de que uses protección para los ojos o la cara cuando estés expuesto a ácidos.",
              "Para trabajar con baterías, la guía de OSHA indica careta, gafas de seguridad, y guantes y delantal de hule o neopreno.",
              "¿Usas lentes de contacto? La misma guía dice que uses gafas contra salpicaduras de químicos. Los lentes de contacto pueden detener el ácido contra tu ojo."
            ]
          },
          {
            "heading": "Si te cae ácido",
            "items": [
              "Donde el ácido de batería u otros corrosivos te puedan caer en los ojos o en el cuerpo, tu compañía tiene que tener un lugar para enjuagarlos o empaparlos, ahí mismo en el área de trabajo.",
              "¿Ácido en los ojos? Ve al lavaojos y enjuágalos con agua limpia por 15 minutos. Luego busca atención médica de inmediato.",
              "¿Ácido en la piel? Quítate la ropa empapada y enjuágate la piel con agua limpia por 15 minutos. Busca atención médica de inmediato si ves la piel roja o quemada."
            ]
          }
        ],
        "ask": "¿Dónde está el lavaojos más cercano al lugar donde trabajamos con baterías? Señálenlo."
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "brakes-asbestos",
    "industries": [
      "auto"
    ],
    "code": "1910.1001(f)(3) / 1910.1001 App F",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.1001(f)(3)(i)-(ii): brake and clutch controls (enclosure/HEPA or low-pressure wet method, or equivalent); Appendix F",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1001",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1001(f)(1)(ix), (k)(3): compressed air",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1001",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1001 Appendix F [A]-[D]: brake and clutch work practices; dry brushing prohibited",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1001AppF",
        "kind": "standard"
      },
      {
        "label": "OSHA SHIB 07-26-06: Asbestos-Automotive Brake and Clutch Repair Work",
        "url": "https://www.osha.gov/sites/default/files/publications/shib072606.pdf",
        "kind": "guidance"
      },
      {
        "label": "EPA guidance (not OSHA): Current Best Practices for Preventing Asbestos Exposure Among Brake and Clutch Repair Workers (2007)",
        "url": "https://www.epa.gov/sites/production/files/documents/brakebrochure-paginated.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Brake and Clutch Dust",
        "hook": "Brake and clutch dust can carry asbestos. You can't tell by looking, and the damage can take decades to show up.",
        "sections": [
          {
            "heading": "Assume it's asbestos",
            "items": [
              "Asbestos has not been totally eliminated from brakes and clutches.",
              "EPA guidance says you can't tell if a part has asbestos just by looking at it. OSHA's guidance says mechanics should assume all brakes have asbestos-type shoes.",
              "Asbestos can cause asbestosis, lung cancer, and mesothelioma. Symptoms may not show up for years, even decades."
            ]
          },
          {
            "heading": "Methods OSHA requires",
            "items": [
              "Your shop has to use an approved method. One option is a negative-pressure enclosure. It's a see-through box you work in through sleeves, with a HEPA vacuum keeping it under suction the whole job.",
              "Another is low-pressure wet cleaning. A catch basin goes under the brake, and water with a wetting agent gently floods the assembly to keep the dust down.",
              "Shops that do no more than 5 pairs of brakes or 5 clutches a week can use the wet method. Mist the parts with a spray bottle or low-pressure water until they're thoroughly wet, then wipe them clean with a cloth."
            ]
          },
          {
            "heading": "Never",
            "items": [
              "Never dry brush. It's prohibited.",
              "Never blow brake dust off with compressed air. OSHA only allows compressed air on asbestos with a system that captures it, like inside the enclosure.",
              "Used cloths go in a leak-proof, labeled container, or get laundered so fibers aren't released. Clean up spills right away."
            ]
          },
          {
            "heading": "Don't take it home",
            "items": [
              "OSHA's guidance says no eating, drinking, or smoking in the brake work area, and to wash your hands often.",
              "Change out of dirty work clothes before you leave, so you don't bring the dust home to your family.",
              "Use pre-ground, ready-to-install parts when you can."
            ]
          }
        ],
        "ask": "Which method does our shop use for brake jobs, and where is that equipment right now?"
      },
      "es": {
        "title": "Polvo de frenos y clutch",
        "hook": "El polvo de frenos y de clutch puede traer asbesto. No se nota a simple vista, y el daño puede tardar décadas en aparecer.",
        "sections": [
          {
            "heading": "Supón que es asbesto",
            "items": [
              "El asbesto no se ha eliminado por completo de los frenos y los clutches.",
              "La guía de la EPA dice que no puedes saber si una pieza tiene asbesto solo con verla. La guía de OSHA dice que los mecánicos deben suponer que todos los frenos tienen balatas con asbesto.",
              "El asbesto puede causar asbestosis, cáncer de pulmón y mesotelioma. Los síntomas pueden tardar años, hasta décadas, en aparecer."
            ]
          },
          {
            "heading": "Métodos que exige OSHA",
            "items": [
              "Tu taller tiene que usar un método aprobado. Una opción es una cabina de presión negativa. Es una caja transparente en la que trabajas con las manos metidas en mangas, con una aspiradora HEPA que la mantiene en succión todo el trabajo.",
              "Otra es la limpieza húmeda a baja presión. Se pone una charola debajo del freno, y agua con un agente humectante moja suavemente todo el conjunto para que no se levante el polvo.",
              "Los talleres que no hacen más de 5 pares de frenos o 5 clutches por semana pueden usar el método húmedo. Rocía las piezas con un atomizador o con agua a baja presión hasta que estén bien mojadas, y luego límpialas con un trapo."
            ]
          },
          {
            "heading": "Nunca",
            "items": [
              "Nunca uses cepillo en seco. Está prohibido.",
              "Nunca soples el polvo de frenos con aire comprimido. OSHA solo permite aire comprimido sobre asbesto con un sistema que lo capture, como dentro de la cabina.",
              "Los trapos usados van en un recipiente que no gotee y con etiqueta, o se lavan de forma que no suelten fibras. Limpia los derrames de inmediato."
            ]
          },
          {
            "heading": "No te lo lleves a casa",
            "items": [
              "La guía de OSHA dice que no se coma, beba ni fume en el área de frenos, y que te laves las manos seguido.",
              "Cámbiate la ropa de trabajo sucia antes de irte, para no llevarle el polvo a tu familia.",
              "Usa piezas ya rectificadas, listas para instalar, cuando puedas."
            ]
          }
        ],
        "ask": "¿Qué método usa nuestro taller para los trabajos de frenos, y dónde está ese equipo ahorita?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "sharps",
    "industries": [
      "health"
    ],
    "code": "1910.1030(d)(2)(vii) / (d)(4)(iii) / (c)(1)(iv)-(v) / (f)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.1030(d)(2)(vii): no bending, recapping, removing, shearing or breaking contaminated needles",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1030(d)(4)(iii)(A)(1)-(4): sharps containers",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1030(b) definitions, (c)(1)(iv)(A)-(B) and (c)(1)(v): safer devices in the exposure control plan, employee input",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1030(f)(1)(ii), (f)(3): post-exposure evaluation and follow-up; (h)(5) sharps injury log",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
        "kind": "standard"
      },
      {
        "label": "OSHA Bloodborne Pathogens and Needlestick Prevention",
        "url": "https://www.osha.gov/bloodborne-pathogens",
        "kind": "guidance"
      },
      {
        "label": "OSHA Bloodborne Pathogens: Evaluating and Controlling Exposure",
        "url": "https://www.osha.gov/bloodborne-pathogens/evaluating-controlling-exposure",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Needles and Sharps",
        "hook": "A needlestick takes one second. A used needle can expose you to germs carried in blood, like hepatitis B, hepatitis C and HIV.",
        "sections": [
          {
            "heading": "Never recap",
            "items": [
              "Don't bend, recap, or remove a used needle. Shearing or breaking a used needle is never allowed.",
              "The only exceptions are when there's no workable alternative or a specific procedure requires it. Then it's done with a mechanical device or a one-handed technique, never two hands."
            ]
          },
          {
            "heading": "Sharps containers",
            "items": [
              "Put used sharps in a sharps container right away, or as soon as you can. That means needles, scalpels, broken glass, anything that can cut or stick.",
              "The container has to close, resist punctures, not leak on the sides or bottom, and be labeled or color-coded.",
              "Keep it close to where sharps are used, and keep it upright. It gets replaced routinely and is never overfilled. Close it right before you move it.",
              "Never open, empty, or clean a reusable sharps container by hand."
            ]
          },
          {
            "heading": "Safer devices",
            "items": [
              "Engineering controls come first. That includes needles with built-in safety features and needleless systems.",
              "Your company has to review its exposure control plan at least once a year and write down which safer devices it considered and used.",
              "It also has to ask frontline staff who give direct patient care for input on those devices. Speak up about what works."
            ]
          },
          {
            "heading": "If you get stuck",
            "items": [
              "Flood the area with water and clean the wound with soap and water, or a skin disinfectant if there is one.",
              "Report it to your supervisor right away and get medical attention right away.",
              "Your company has to make a confidential medical evaluation and follow-up available to you right away, at no cost to you."
            ]
          }
        ],
        "ask": "Where is the nearest sharps container to where you work, and is it overfilled right now?"
      },
      "es": {
        "title": "Agujas y objetos punzocortantes",
        "hook": "Un piquete de aguja pasa en un segundo. Una aguja usada te puede exponer a gérmenes que viven en la sangre, como la hepatitis B, la hepatitis C y el VIH.",
        "sections": [
          {
            "heading": "Nunca le vuelvas a poner la tapa",
            "items": [
              "No dobles, no le vuelvas a poner la tapa ni le quites la aguja a una aguja usada. Nunca se permite cortar ni romper una aguja usada.",
              "Las únicas excepciones son cuando no hay otra alternativa posible o un procedimiento específico lo requiere. En ese caso se hace con un aparato mecánico o con una técnica de una sola mano, nunca con las dos manos."
            ]
          },
          {
            "heading": "Contenedores para objetos punzocortantes",
            "items": [
              "Pon los objetos punzocortantes usados en un contenedor para objetos punzocortantes de inmediato, o lo antes posible. Eso incluye agujas, bisturís, vidrio roto, cualquier cosa que pueda cortar o picar.",
              "El contenedor tiene que cerrarse, resistir perforaciones, no gotear por los lados ni por el fondo, y estar etiquetado o marcado con color.",
              "Tenlo cerca de donde se usan los objetos punzocortantes, y mantenlo derecho. Se cambia con regularidad y nunca se llena de más. Ciérralo justo antes de moverlo.",
              "Nunca abras, vacíes ni limpies a mano un contenedor reutilizable."
            ]
          },
          {
            "heading": "Dispositivos más seguros",
            "items": [
              "Primero van los controles de ingeniería. Eso incluye agujas con funciones de seguridad integradas y sistemas sin aguja.",
              "Tu compañía tiene que revisar su plan de control de exposición por lo menos una vez al año y anotar qué dispositivos más seguros consideró y usó.",
              "También tiene que pedirle su opinión sobre esos dispositivos al personal de primera línea que da atención directa a pacientes. Di lo que te funciona."
            ]
          },
          {
            "heading": "Si te picas",
            "items": [
              "Echa bastante agua en el área y lava la herida con agua y jabón, o con un desinfectante para la piel si hay.",
              "Repórtalo a tu supervisor de inmediato y busca atención médica de inmediato.",
              "Tu compañía tiene que darte de inmediato una evaluación médica confidencial y seguimiento, sin costo para ti."
            ]
          }
        ],
        "ask": "¿Dónde está el contenedor para objetos punzocortantes más cercano a donde trabajas, y está demasiado lleno ahorita?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "patient-handling",
    "industries": [
      "health"
    ],
    "code": "No OSHA patient-handling standard (guidance) / OSH Act 5(a)(1)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Safe Patient Handling (healthcare topic page)",
        "url": "https://www.osha.gov/healthcare/safe-patient-handling",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3708, Safe Patient Handling: Preventing Musculoskeletal Disorders in Nursing Homes",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3708.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Guidelines for Nursing Homes: Ergonomics for the Prevention of Musculoskeletal Disorders (not a standard)",
        "url": "https://www.osha.gov/sites/default/files/publications/final_nh_guidelines.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hospitals: Safe Patient Handling Equipment",
        "url": "https://www.osha.gov/hospitals/patient-handling-equipment",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hospital eTool: Physical Therapy (patient lifting and transfers)",
        "url": "https://www.osha.gov/etools/hospitals/clinical-services/physical-therapy",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hospital eTool: Work-related Musculoskeletal Disorders",
        "url": "https://www.osha.gov/etools/hospitals/hospital-wide-hazards/work-related-musculoskeletal-disorders",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Safe Patient Handling",
        "hook": "Moving patients by hand wears out shoulders and low backs. Sprains and strains are the most common of these injuries.",
        "sections": [
          {
            "heading": "There's no safe manual lift",
            "items": [
              "OSHA's guidance puts it plainly: there is no such thing as safe manual lifting of a patient.",
              "Manual lifting should be cut down in every case, and cut out when you can. Experts recommend keeping lifts to 35 pounds or less.",
              "Being strong doesn't protect you. Strong workers get asked to help with lifts more often, so they take on more risk."
            ]
          },
          {
            "heading": "Use the equipment",
            "items": [
              "Lift and transfer equipment is the heart of a safe patient handling program. Use it.",
              "You should be trained before you lift or reposition patients, including how to pick and use the right lift.",
              "A lift that's broken or not charged can't be used. Slings and transfer sheets should be clean and stocked. Speak up when they're not."
            ]
          },
          {
            "heading": "Plan the move",
            "items": [
              "Check the patient first: how well they can move, how well they understand, their size, weight and medical condition. Follow the care plan for moving them.",
              "Some transfers take more than one person. Get the help you need before you start.",
              "Use the bed's height controls to line it up with the wheelchair. Explain the move to the patient before you lift."
            ]
          },
          {
            "heading": "Report early",
            "items": [
              "Report pain or strain early. Early reporting and early treatment can keep an injury from getting worse.",
              "You have the right to report hazards, symptoms and injuries without being punished for it."
            ]
          }
        ],
        "ask": "Where is the lift for our unit, is it charged, and who here has been trained to use it?"
      },
      "es": {
        "title": "Manejo seguro de pacientes",
        "hook": "Mover pacientes a mano desgasta los hombros y la parte baja de la espalda. Los esguinces y las torceduras son las lesiones más comunes.",
        "sections": [
          {
            "heading": "No existe un levantamiento manual seguro",
            "items": [
              "La guía de OSHA lo dice claro: no existe tal cosa como levantar a un paciente a mano de forma segura.",
              "El levantamiento manual se debe reducir en todos los casos, y eliminar cuando se pueda. Los expertos recomiendan limitar los levantamientos a 35 libras o menos.",
              "Ser fuerte no te protege. A los trabajadores fuertes les piden ayuda con los levantamientos más seguido, así que corren más riesgo."
            ]
          },
          {
            "heading": "Usa el equipo",
            "items": [
              "El equipo para levantar y trasladar es el corazón de un programa de manejo seguro de pacientes. Úsalo.",
              "Te deben capacitar antes de que levantes o cambies de posición a pacientes, incluyendo cómo escoger y usar la grúa correcta.",
              "Una grúa que está rota o sin carga no se puede usar. Las eslingas y las sábanas de traslado deben estar limpias y surtidas. Avisa cuando no lo estén."
            ]
          },
          {
            "heading": "Planea el movimiento",
            "items": [
              "Primero revisa al paciente: qué tanto se puede mover, qué tanto entiende, su tamaño, su peso y su condición médica. Sigue el plan de cuidado para moverlo.",
              "Algunos traslados necesitan más de una persona. Consigue la ayuda que necesitas antes de empezar.",
              "Usa los controles de altura de la cama para emparejarla con la silla de ruedas. Explícale el movimiento al paciente antes de levantarlo."
            ]
          },
          {
            "heading": "Reporta a tiempo",
            "items": [
              "Reporta el dolor o la tensión a tiempo. Reportar y tratar a tiempo puede evitar que una lesión empeore.",
              "Tienes derecho a reportar peligros, síntomas y lesiones sin que te castiguen por hacerlo."
            ]
          }
        ],
        "ask": "¿Dónde está la grúa de nuestra unidad, tiene carga, y quién aquí está capacitado para usarla?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "airborne-infection",
    "industries": [
      "health"
    ],
    "code": "1910.134 / 1904.11",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.134(e)(1): medical evaluation before fit testing or use",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(f)(1)-(2): fit testing of tight-fitting respirators",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.134(g)(1)(i)(A), (g)(1)(iii), (g)(2)(ii)(B): facial hair, user seal check, leaving the use area",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
        "kind": "standard"
      },
      {
        "label": "OSHA 1904.11(a): recording work-related tuberculosis cases",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.11",
        "kind": "standard"
      },
      {
        "label": "OSHA Tuberculosis: overview (how TB spreads)",
        "url": "https://www.osha.gov/tuberculosis",
        "kind": "guidance"
      },
      {
        "label": "OSHA Tuberculosis: Control and Prevention (AIIR, N95, tracking, 10-week monitoring)",
        "url": "https://www.osha.gov/tuberculosis/control-prevention",
        "kind": "guidance"
      },
      {
        "label": "OSHA Tuberculosis: Standards (1910.134, 1904.11, 1904.35(b) no retaliation)",
        "url": "https://www.osha.gov/tuberculosis/standards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Healthcare: Infectious Diseases (airborne transmission)",
        "url": "https://www.osha.gov/healthcare/infectious-diseases",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "TB and Airborne Infections",
        "hook": "Some germs don't need touch to reach you. A person sick with TB spreads it through the air when they cough, speak, sneeze or sing.",
        "sections": [
          {
            "heading": "How it spreads",
            "items": [
              "TB and measles are two diseases that spread through the air. The tiny particles can stay in the air and travel a long way.",
              "Some procedures, like suctioning or putting in a breathing tube, can also put germs into the air.",
              "When you first meet a patient or visitor, watch for signs they could be sick with TB, and follow your facility's steps if you see them."
            ]
          },
          {
            "heading": "Isolation rooms",
            "items": [
              "A patient who may have active TB goes in an airborne infection isolation room. Those rooms have to be kept at negative pressure.",
              "No isolation room open? The patient wears a facemask if they can, waits in an exam room with the door closed, and gets moved to an isolation room as soon as possible.",
              "Your facility should track everyone who cares for or enters the room of a patient with confirmed or suspected active TB. Make sure you're on that list."
            ]
          },
          {
            "heading": "Your respirator",
            "items": [
              "Wear a NIOSH-certified N95 respirator or better, as part of your facility's respirator program.",
              "Your company has to give you a medical evaluation before your fit test. Then you get fit tested before you first use a tight-fitting respirator, when you switch size, style, model or make, and at least once a year.",
              "Do a seal check every time you put it on. If a beard or anything else keeps it from sealing, tell your supervisor. There are respirators that don't need a face seal.",
              "Leave the room if the mask leaks or it gets harder to breathe."
            ]
          },
          {
            "heading": "After an exposure",
            "items": [
              "After a known exposure, watch your health for TB symptoms for 10 weeks.",
              "If symptoms show up, tell your supervisor, get checked right away, and contact your state or local health department. Stay home and limit contact with others until your test results are known.",
              "If you get TB infection after a work exposure to a known active case, and your company keeps an OSHA injury and illness log, it has to record it there. Your company can't retaliate against you for reporting a work illness."
            ]
          }
        ],
        "ask": "Where is the closest isolation room on our unit, and where do you get a fit-tested N95 before you go in?"
      },
      "es": {
        "title": "TB e infecciones por el aire",
        "hook": "Algunos gérmenes no necesitan contacto para llegar a ti. Una persona enferma de TB la contagia por el aire cuando tose, habla, estornuda o canta.",
        "sections": [
          {
            "heading": "Cómo se contagia",
            "items": [
              "La TB y el sarampión son dos enfermedades que se contagian por el aire. Las partículas pequeñitas se pueden quedar en el aire y viajar lejos.",
              "Algunos procedimientos, como la succión o poner un tubo para respirar, también pueden echar gérmenes al aire.",
              "Cuando conoces a un paciente o visitante por primera vez, fíjate si tiene señales de que podría estar enfermo de TB, y sigue los pasos de tu centro si las ves."
            ]
          },
          {
            "heading": "Cuartos de aislamiento",
            "items": [
              "Un paciente que podría tener TB activa va a un cuarto de aislamiento para infecciones por el aire. Esos cuartos se tienen que mantener con presión negativa.",
              "¿No hay cuarto de aislamiento libre? El paciente usa una mascarilla si puede, espera en un cuarto de examen con la puerta cerrada, y se pasa a un cuarto de aislamiento lo antes posible.",
              "Tu centro debe llevar la cuenta de todos los que atienden o entran al cuarto de un paciente con TB activa confirmada o sospechada. Asegúrate de estar en esa lista."
            ]
          },
          {
            "heading": "Tu respirador",
            "items": [
              "Usa un respirador N95 certificado por NIOSH o uno mejor, como parte del programa de respiradores de tu centro.",
              "Tu compañía tiene que darte una evaluación médica antes de tu prueba de ajuste. Luego te hacen la prueba de ajuste antes de usar por primera vez un respirador ajustado, cuando cambias de tamaño, estilo, modelo o marca, y por lo menos una vez al año.",
              "Haz una revisión de sello cada vez que te lo pones. Si la barba o cualquier otra cosa no deja que selle, avísale a tu supervisor. Hay respiradores que no necesitan sellar contra la cara.",
              "Sal del cuarto si la mascarilla tiene fugas o si se te hace más difícil respirar."
            ]
          },
          {
            "heading": "Después de una exposición",
            "items": [
              "Después de una exposición conocida, vigila tu salud por síntomas de TB durante 10 semanas.",
              "Si te salen síntomas, avísale a tu supervisor, hazte revisar de inmediato y comunícate con el departamento de salud de tu estado o localidad. Quédate en casa y limita el contacto con otros hasta que sepas los resultados de tus pruebas.",
              "Si te da una infección de TB después de una exposición en el trabajo a un caso activo conocido, y tu compañía lleva un registro de lesiones y enfermedades de OSHA, tiene que anotarla ahí. Tu compañía no puede tomar represalias contra ti por reportar una enfermedad del trabajo."
            ]
          }
        ],
        "ask": "¿Dónde está el cuarto de aislamiento más cercano en nuestra unidad, y dónde consigues un N95 con prueba de ajuste antes de entrar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hazardous-drugs",
    "industries": [
      "health"
    ],
    "code": "1910.1200",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.1200(b)(6)(vii): drugs in solid, final form for direct administration to the patient",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(g)(8): safety data sheets readily accessible each shift",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(h)(1): training at initial assignment and when a new hazard is introduced",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA Hazardous Drugs: overview (examples, health effects)",
        "url": "https://www.osha.gov/hazardous-drugs",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hazardous Drugs: Standards (Hazard Communication covers drugs)",
        "url": "https://www.osha.gov/hazardous-drugs/standards",
        "kind": "guidance"
      },
      {
        "label": "OSHA Controlling Occupational Exposure to Hazardous Drugs (exposure routes, gloves, gowns, eye/face, respirators, spills, waste)",
        "url": "https://www.osha.gov/hazardous-drugs/controlling-occex",
        "kind": "guidance"
      },
      {
        "label": "NIOSH Hazardous Drug Exposures in Healthcare",
        "url": "https://www.cdc.gov/niosh/healthcare/hazardous-drugs/index.html",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Handling Hazardous Drugs",
        "hook": "Some medicines that help patients can hurt the people who handle them. Chemo drugs and some others can cause cancer, organ damage and fertility problems.",
        "sections": [
          {
            "heading": "How it gets to you",
            "items": [
              "The main way in is through your skin, from drug residue on surfaces. The outside of drug vials has been found to carry residue too.",
              "You can also breathe it in, swallow it if you eat or drink where drugs are given, or get it from a needlestick.",
              "Patients' urine, stool, vomit and sweat can carry the drug or its byproducts."
            ]
          },
          {
            "heading": "Gloves, gowns and hands",
            "items": [
              "NIOSH recommends two pairs of gloves when you prepare, give or dispose of these drugs. Inner glove under the gown cuff, outer glove over it.",
              "If a glove gets damaged, or you know or think drug got on it, take it off carefully and throw it away properly.",
              "Wear a gown that doesn't shed, closes in the back, fits snug at the wrists and closes at the neck.",
              "Wash your hands with soap and water before you put gloves on and after you take them off."
            ]
          },
          {
            "heading": "Splashes, spills and waste",
            "items": [
              "Wear eye and face protection any time a drug could splash into your eyes, nose or mouth. A face shield alone isn't full protection.",
              "Know where the spill kit is. It should be kept in the area where these drugs are handled. An N95 does not stop gases or vapors, so a large spill can call for a full-face chemical cartridge respirator.",
              "Put contaminated items in labeled, covered and sealed waste containers. Everything from a spill cleanup goes out as hazardous waste.",
              "No eating, drinking or putting on makeup where these drugs are handled."
            ]
          },
          {
            "heading": "Your right to know",
            "items": [
              "The hazard communication rule covers drugs. It does not cover pills and tablets that are in final form, ready to give to a patient.",
              "Your company has to train you on the chemical hazards in your work area when you start, and again when a new hazard comes in.",
              "Safety data sheets have to be easy for you to get on every shift."
            ]
          }
        ],
        "ask": "Where is our spill kit, and who can show us right now how the two pairs of gloves go with the gown cuff?"
      },
      "es": {
        "title": "Manejo de medicamentos peligrosos",
        "hook": "Algunos medicamentos que ayudan a los pacientes pueden hacerle daño a la gente que los maneja. Los medicamentos de quimioterapia y algunos otros pueden causar cáncer, daño a los órganos y problemas de fertilidad.",
        "sections": [
          {
            "heading": "Cómo te llega",
            "items": [
              "La forma principal de entrar es por la piel, por residuos del medicamento en las superficies. También se han encontrado residuos por fuera de los frascos.",
              "También lo puedes respirar, tragarlo si comes o bebes donde se dan los medicamentos, o recibirlo por un piquete de aguja.",
              "La orina, el excremento, el vómito y el sudor de los pacientes pueden llevar el medicamento o lo que queda de él."
            ]
          },
          {
            "heading": "Guantes, batas y manos",
            "items": [
              "NIOSH recomienda dos pares de guantes cuando preparas, das o desechas estos medicamentos. El guante de adentro va debajo del puño de la bata y el de afuera, encima.",
              "Si un guante se daña, o sabes o crees que le cayó medicamento, quítatelo con cuidado y tíralo de la forma correcta.",
              "Usa una bata que no suelte pelusa, que cierre por detrás, que quede ajustada en las muñecas y que cierre en el cuello.",
              "Lávate las manos con agua y jabón antes de ponerte los guantes y después de quitártelos."
            ]
          },
          {
            "heading": "Salpicaduras, derrames y desechos",
            "items": [
              "Usa protección para los ojos y la cara cada vez que un medicamento te pueda salpicar en los ojos, la nariz o la boca. Una careta sola no es protección completa.",
              "Sabe dónde está el kit para derrames. Debe estar en el área donde se manejan estos medicamentos. Un N95 no detiene gases ni vapores, así que un derrame grande puede requerir un respirador de cara completa con cartuchos químicos.",
              "Pon lo contaminado en recipientes de desechos con etiqueta, tapados y sellados. Todo lo que se usó para limpiar un derrame se desecha como desecho peligroso.",
              "No comas, no bebas ni te maquilles donde se manejan estos medicamentos."
            ]
          },
          {
            "heading": "Tu derecho a saber",
            "items": [
              "La regla de comunicación de riesgos cubre los medicamentos. No cubre las pastillas y tabletas que ya están en su forma final, listas para darle al paciente.",
              "Tu compañía tiene que capacitarte sobre los peligros químicos de tu área de trabajo cuando empiezas, y otra vez cuando llega un peligro nuevo.",
              "Las hojas de datos de seguridad tienen que estar fáciles de conseguir en cada turno."
            ]
          }
        ],
        "ask": "¿Dónde está nuestro kit para derrames, y quién nos puede enseñar ahorita cómo van los dos pares de guantes con el puño de la bata?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "crowds",
    "industries": [
      "retail"
    ],
    "code": "OSHA Crowd Management Safety Guidelines for Retailers (guidance)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Crowd Management Safety Guidelines for Retailers (fact sheet DTSEM 11/2012): planning, pre-event setup, during the event, emergencies",
        "url": "https://www.osha.gov/sites/default/files/publications/Crowd_Control.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Crowd Safety at Big Sales and Events",
        "hook": "A big sale can bring a crowd that pushes hard at the doors. OSHA names the dangers to staff: overcrowding, crowd crushing, getting hit by the crowd, violence, and fire.",
        "sections": [
          {
            "heading": "Before the day",
            "items": [
              "There should be a staffing plan that puts each worker in a set spot, like an entrance or a sale area. Know your spot before the event.",
              "One manager makes the key calls during the event, and one worker is named to call emergency responders. Find out who they are.",
              "You should be trained on the crowd plan and the emergency plan, and get a chance to practice it. If you haven't been, speak up."
            ]
          },
          {
            "heading": "Lines and barricades",
            "items": [
              "Barricades or rope lines go up well before customers arrive. The line should not start right at the door.",
              "The line needs breaks and turns along the way. That keeps people in the back from pushing and crushing the people in front, including you.",
              "Shopping carts and anything that could trip people or get thrown stay inside, away from the entrance, not out in the parking lot.",
              "Staff working outside need a radio or another way to reach the people inside and emergency responders."
            ]
          },
          {
            "heading": "When the doors open",
            "items": [
              "There should be a separate entrance for staff. Everyone working the event should know when the doors are about to open.",
              "If you're managing the crowd coming in, stand to the side of their path, not in the middle of it.",
              "When the store reaches maximum occupancy, nobody else comes in until the number drops."
            ]
          },
          {
            "heading": "If something goes wrong",
            "items": [
              "Never block or lock an exit door, and never block the way out.",
              "Know where the first-aid kit and the AED are, and who on site is trained in CPR and the AED.",
              "In an emergency, follow what police, fire, or medical responders tell you, even if it's different from company rules."
            ]
          }
        ],
        "ask": "Where is your spot for this event, and who is the person who calls emergency responders if we need them?"
      },
      "es": {
        "title": "Seguridad con multitudes en grandes ventas y eventos",
        "hook": "Una gran venta puede traer una multitud que empuja fuerte en las puertas. OSHA nombra los peligros para el personal: exceso de gente, aplastamiento, que la multitud te golpee, violencia e incendio.",
        "sections": [
          {
            "heading": "Antes del día",
            "items": [
              "Debe haber un plan de personal que pone a cada trabajador en un lugar fijo, como una entrada o un área de ofertas. Conoce tu lugar antes del evento.",
              "Un gerente toma las decisiones clave durante el evento, y un trabajador está asignado para llamar a los servicios de emergencia. Averigua quiénes son.",
              "Te deben capacitar en el plan para la multitud y en el plan de emergencia, y darte la oportunidad de practicarlo. Si no te han capacitado, dilo."
            ]
          },
          {
            "heading": "Filas y barricadas",
            "items": [
              "Las barricadas o cuerdas se ponen mucho antes de que lleguen los clientes. La fila no debe empezar justo en la puerta.",
              "La fila necesita cortes y vueltas a lo largo del camino. Así la gente de atrás no empuja ni aplasta a la gente de adelante, incluyéndote a ti.",
              "Los carritos y cualquier cosa con la que la gente se pueda tropezar o que se pueda lanzar se quedan adentro, lejos de la entrada, no en el estacionamiento.",
              "El personal que trabaja afuera necesita un radio u otra forma de comunicarse con la gente de adentro y con los servicios de emergencia."
            ]
          },
          {
            "heading": "Cuando se abren las puertas",
            "items": [
              "Debe haber una entrada aparte para el personal. Todos los que trabajan en el evento deben saber cuándo se van a abrir las puertas.",
              "Si estás manejando a la gente que entra, párate a un lado de su camino, no en el medio.",
              "Cuando la tienda llega a su capacidad máxima, nadie más entra hasta que baje el número de personas."
            ]
          },
          {
            "heading": "Si algo sale mal",
            "items": [
              "Nunca bloquees ni cierres con llave una puerta de salida, y nunca bloquees el camino para salir.",
              "Sabe dónde están el botiquín de primeros auxilios y el DEA (desfibrilador), y quién en el lugar está capacitado en RCP y en el DEA.",
              "En una emergencia, sigue lo que te digan la policía, los bomberos o el personal médico, aunque sea diferente a las reglas de la compañía."
            ]
          }
        ],
        "ask": "¿Cuál es tu lugar en este evento, y quién es la persona que llama a los servicios de emergencia si los necesitamos?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "late-night-retail",
    "industries": [
      "retail",
      "food"
    ],
    "code": "OSHA 3153 (guidance)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 3153: Recommendations for Workplace Violence Prevention Programs in Late-Night Retail Establishments (risk factors, engineering and work practice controls, training, post-incident response)",
        "url": "https://www.osha.gov/sites/default/files/publications/osha3153.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Workplace Violence: definition and risk factors",
        "url": "https://www.osha.gov/workplace-violence",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Robbery and Late-Night Safety",
        "hook": "Handling cash, working alone, and working late at night all raise the risk of violence. If you open, close or work the night shift, this one is for you.",
        "sections": [
          {
            "heading": "If you're robbed",
            "items": [
              "Hand over the money or valuables. Don't resist.",
              "Stay out of fights and arguments whenever you can.",
              "Know your store's emergency steps for a robbery, and know where the alarm or panic button is and how it works."
            ]
          },
          {
            "heading": "Cash and doors",
            "items": [
              "Use the drop safe. Keep as little cash in the register as you can.",
              "Some stores don't take large bills. Follow your store's rule.",
              "Keep the doors locked before and after business hours."
            ]
          },
          {
            "heading": "Be seen, don't be alone",
            "items": [
              "The register and counter should be easy to see from outside. Keep window signs low or high so they don't block the view.",
              "Good lighting inside and out matters. Tell your manager when a light is out.",
              "Use the buddy system. If your store offers an escort to the parking lot late at night, take it.",
              "Follow your store's rules for taking the trash out at night."
            ]
          },
          {
            "heading": "After any incident",
            "items": [
              "Get first aid or medical help for anyone who's hurt, and make sure the police are called.",
              "Report every assault or threat to your supervisor or manager. No one should face payback for reporting.",
              "Talking it through with someone afterward, like a counselor, can help. Ask what your company offers."
            ]
          }
        ],
        "ask": "Where is our alarm or panic button, and what's the first thing you do if someone says, \"This is a robbery\"?"
      },
      "es": {
        "title": "Robos y seguridad de noche",
        "hook": "Manejar dinero, trabajar solo y trabajar tarde en la noche aumentan el riesgo de violencia. Si abres, cierras o trabajas el turno de noche, esta charla es para ti.",
        "sections": [
          {
            "heading": "Si te roban",
            "items": [
              "Entrega el dinero o los objetos de valor. No te resistas.",
              "Mantente fuera de peleas y discusiones siempre que puedas.",
              "Conoce los pasos de emergencia de tu tienda para un robo, y sabe dónde está la alarma o el botón de pánico y cómo funciona."
            ]
          },
          {
            "heading": "Dinero y puertas",
            "items": [
              "Usa la caja fuerte de depósito. Ten el menor dinero posible en la caja registradora.",
              "Algunas tiendas no aceptan billetes grandes. Sigue la regla de tu tienda.",
              "Mantén las puertas cerradas con llave antes y después del horario de atención."
            ]
          },
          {
            "heading": "Que te vean, no estés solo",
            "items": [
              "La caja y el mostrador se deben poder ver fácilmente desde afuera. Pon los letreros de las ventanas bajos o altos para que no tapen la vista.",
              "La buena iluminación por dentro y por fuera importa. Avísale a tu gerente cuando una luz no sirva.",
              "Trabaja en pareja. Si tu tienda ofrece alguien que te acompañe al estacionamiento tarde en la noche, acéptalo.",
              "Sigue las reglas de tu tienda para sacar la basura de noche."
            ]
          },
          {
            "heading": "Después de cualquier incidente",
            "items": [
              "Consigue primeros auxilios o ayuda médica para cualquiera que esté herido, y asegúrate de que se llame a la policía.",
              "Reporta toda agresión o amenaza a tu supervisor o gerente. Nadie debe sufrir represalias por reportar.",
              "Hablar de lo que pasó con alguien después, como un consejero, puede ayudar. Pregunta qué ofrece tu compañía."
            ]
          }
        ],
        "ask": "¿Dónde está nuestra alarma o botón de pánico, y qué es lo primero que haces si alguien dice: \"Esto es un asalto\"?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "ladders-gi",
    "industries": [
      "retail",
      "facil",
      "auto",
      "wh",
      "mfg",
      "health",
      "food"
    ],
    "code": "1910.23",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.21(b): definitions of ladder, portable ladder, stepstool",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.21",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.23(a): scope, all ladders",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.23",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.23(b)(8)-(b)(13): intended use, inspection, defective ladders, facing the ladder, one hand, carrying loads",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.23",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.23(c)(2)-(c)(4), (c)(6)-(c)(9), (c)(13): spreaders, load, stable surfaces, moving, traffic areas, top step and cap, slippery surfaces, unstable bases",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.23",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Ladders and Step Stools",
        "hook": "A step stool in the stockroom or a stepladder in the shop looks harmless. Treat every one like it matters.",
        "sections": [
          {
            "heading": "Check it first",
            "items": [
              "Step stools and stepladders are ladders. The ladder rules cover them too.",
              "Your company has to make sure ladders are inspected before first use each shift, and more often if needed. Look for anything broken, bent, loose or missing.",
              "A damaged ladder gets tagged \"Do Not Use\" right away and stays out of service until it's fixed or replaced."
            ]
          },
          {
            "heading": "Right ladder, right job",
            "items": [
              "Use a ladder only for what it was designed to do.",
              "Don't go over its weight limit. That counts you, plus your tools and whatever you're carrying.",
              "Open a stepladder all the way so the spreaders lock it open."
            ]
          },
          {
            "heading": "Set it up right",
            "items": [
              "Set it on a stable, level floor, unless it's secured so it can't move. On a slippery floor, it has to be secured and stabilized.",
              "Never set a ladder on boxes, barrels or anything else that isn't stable.",
              "In a doorway, a walkway, or anywhere people or carts could knock it, secure it or block the area off with a barricade."
            ]
          },
          {
            "heading": "Climbing",
            "items": [
              "Face the ladder going up and coming down. Keep at least one hand on it while you climb.",
              "Don't carry anything that could throw off your balance.",
              "Don't stand on the top step or the top cap of a stepladder. A step stool is different: it's built so you can stand on every step and the top.",
              "Never move, shift or extend a ladder while someone is on it."
            ]
          }
        ],
        "ask": "Where are our ladders and step stools kept, and who checks them before the shift?"
      },
      "es": {
        "title": "Escaleras y banquitos",
        "hook": "Un banquito en el almacén o una escalera de tijera en el taller parecen inofensivos. Trata a cada uno como si importara.",
        "sections": [
          {
            "heading": "Revísala primero",
            "items": [
              "Los banquitos y las escaleras de tijera son escaleras. Las reglas de escaleras también los cubren.",
              "Tu compañía tiene que asegurarse de que las escaleras se revisen antes del primer uso de cada turno, y más seguido si hace falta. Busca cualquier cosa rota, doblada, floja o que falte.",
              "Una escalera dañada se marca con \"No usar\" de inmediato y se queda fuera de servicio hasta que se arregle o se reemplace."
            ]
          },
          {
            "heading": "La escalera correcta para el trabajo",
            "items": [
              "Usa una escalera solo para lo que fue diseñada.",
              "No pases su límite de peso. Eso cuenta tu peso, más tus herramientas y lo que lleves cargando.",
              "Abre la escalera de tijera completamente para que los separadores la dejen trabada abierta."
            ]
          },
          {
            "heading": "Colócala bien",
            "items": [
              "Ponla en un piso estable y nivelado, a menos que esté asegurada para que no se mueva. En un piso resbaloso, tiene que estar asegurada y estabilizada.",
              "Nunca pongas una escalera sobre cajas, barriles ni nada que no sea estable.",
              "En una puerta, un pasillo o cualquier lugar donde la gente o los carritos la puedan golpear, asegúrala o bloquea el área con una barricada."
            ]
          },
          {
            "heading": "Al subir",
            "items": [
              "Mira hacia la escalera al subir y al bajar. Mantén por lo menos una mano en ella mientras subes o bajas.",
              "No cargues nada que te pueda hacer perder el equilibrio.",
              "No te pares en el último escalón ni en la tapa de arriba de una escalera de tijera. Un banquito es diferente: está hecho para que te pares en todos los escalones y arriba.",
              "Nunca muevas, cambies de lugar ni extiendas una escalera mientras alguien está en ella."
            ]
          }
        ],
        "ask": "¿Dónde guardamos las escaleras y los banquitos, y quién los revisa antes del turno?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "kitchen-burns",
    "industries": [
      "food"
    ],
    "code": "1910.138(a) / 1910.22(a)(2)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Restaurant Safety eTool: Cooking (burns, deep fat fryers, fire, slips)",
        "url": "https://www.osha.gov/etools/young-workers-restaurant-safety/cooking",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.138(a): hand protection, including thermal burns",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.138",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.22(a)(2): floors kept clean and, to the extent feasible, dry",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Kitchen Burns",
        "hook": "Stoves, grills, steamers, and fryers can all burn you. So can the hot oil, grease, steam, and hot food that come off them.",
        "sections": [
          {
            "heading": "Fryers and hot oil",
            "items": [
              "Never let water or ice get into hot oil. Don't pour the extra ice from a fry bag into the fryer.",
              "Don't overfill the fryer or dump in too many frozen fries at once. That makes hot oil splash and bubble over.",
              "Don't move or strain hot oil. Wait until it's cool.",
              "Keep your drinks away from the fryer. One bump can knock a drink into the oil and cause a flare-up."
            ]
          },
          {
            "heading": "Steam and hot pots",
            "items": [
              "Open ovens and steamers from the side, with the door between you and the steam. When steamers are stacked, open the top one first.",
              "Lift lids away from your face. Don't use a wet cloth to lift a lid off a hot pot.",
              "Treat every pot, pot handle, and utensil in a pot as hot, and use mitts. Don't let handles stick out past the counter or stove front.",
              "Get help to move a heavy pot of hot liquid off the burner."
            ]
          },
          {
            "heading": "Grills and grease fires",
            "items": [
              "Keep the grill free of grease buildup that could catch fire. Don't clean the vents over a grill while it's hot.",
              "Never throw water on a grease fire. It makes the fire worse. A hot oil or grease fire takes a Class K extinguisher.",
              "If your clothes catch fire: stop, drop, and roll."
            ]
          },
          {
            "heading": "Dress and floors",
            "items": [
              "Wear long sleeves and long pants when you cook, and a clean, dry apron. Wear slip-resistant shoes, not canvas or open-toed.",
              "Clean up spills right away. A slip near the line can put you into hot oil or onto a hot surface.",
              "Where your hands are exposed to burns, your company has to choose the right hand protection and require you to use it. Use the mitts and gloves you're given."
            ]
          }
        ],
        "ask": "Where is the Class K extinguisher in this kitchen, and what are the two things that never go into hot oil?"
      },
      "es": {
        "title": "Quemaduras en la cocina",
        "hook": "Las estufas, las parrillas, las vaporeras y las freidoras te pueden quemar. También el aceite caliente, la grasa, el vapor y la comida caliente que salen de ellas.",
        "sections": [
          {
            "heading": "Freidoras y aceite caliente",
            "items": [
              "Nunca dejes que caiga agua o hielo en el aceite caliente. No eches a la freidora el hielo que sobra en la bolsa de papas.",
              "No llenes de más la freidora ni eches demasiadas papas congeladas a la vez. Eso hace que el aceite caliente salpique y se derrame.",
              "No muevas ni coles el aceite caliente. Espera a que se enfríe.",
              "Mantén tus bebidas lejos de la freidora. Un golpe puede tirar la bebida al aceite y provocar una llamarada."
            ]
          },
          {
            "heading": "Vapor y ollas calientes",
            "items": [
              "Abre los hornos y las vaporeras desde un lado, con la puerta entre tú y el vapor. Cuando las vaporeras están una sobre otra, abre primero la de arriba.",
              "Levanta las tapas hacia el lado contrario de tu cara. No uses un trapo mojado para quitar la tapa de una olla caliente.",
              "Trata toda olla, mango y utensilio dentro de una olla como si estuviera caliente, y usa guantes de cocina. No dejes que los mangos sobresalgan del mostrador ni del frente de la estufa.",
              "Pide ayuda para bajar del quemador una olla pesada con líquido caliente."
            ]
          },
          {
            "heading": "Parrillas e incendios de grasa",
            "items": [
              "Mantén la parrilla libre de grasa acumulada que se pueda prender. No limpies las campanas sobre la parrilla mientras esté caliente.",
              "Nunca le eches agua a un fuego de grasa. Lo empeora. Un fuego de aceite o grasa se apaga con un extintor Clase K.",
              "Si se te prende la ropa: detente, tírate al suelo y rueda."
            ]
          },
          {
            "heading": "Ropa y pisos",
            "items": [
              "Usa mangas largas y pantalón largo cuando cocines, y un delantal limpio y seco. Usa zapatos antideslizantes, no de lona ni abiertos.",
              "Limpia los derrames de inmediato. Un resbalón cerca de la línea te puede tirar al aceite caliente o sobre una superficie caliente.",
              "Donde tus manos estén expuestas a quemaduras, tu compañía tiene que escoger la protección adecuada para las manos y exigir que la uses. Usa los guantes que te dan."
            ]
          }
        ],
        "ask": "¿Dónde está el extintor Clase K en esta cocina, y cuáles son las dos cosas que nunca van en el aceite caliente?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "knives",
    "industries": [
      "food"
    ],
    "code": "1910.212(a) / 1910.147 / 1910.138(a)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Restaurant Safety eTool: Food Preparation (knives, slicers, processors, mixers)",
        "url": "https://www.osha.gov/etools/young-workers-restaurant-safety/food-prep",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.212(a)(1) and (a)(3)(ii): machine guarding and point of operation",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.147(a)(2)(iii)(A): cord-and-plug exclusion (plug under exclusive control of the employee servicing); (a)(2)(ii) note: minor servicing exclusion; (c)(1) energy control program; (c)(7)(i) training",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.138(a): hand protection for severe cuts or lacerations",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.138",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Knives, Slicers and Cutters",
        "hook": "Knives, cleavers, and slicers are made to cut, and they'll cut you as easily as the food. A few habits keep your hands out of the way.",
        "sections": [
          {
            "heading": "Knife habits",
            "items": [
              "Keep your fingers and thumbs out of the cutting line. Don't touch the blade, and don't chat with coworkers while you cut.",
              "Keep knives sharp and in good shape. A dull knife slips. Only trained, experienced workers should sharpen knives.",
              "If a knife falls, let it fall. Don't try to catch it.",
              "Put knives back in their storage spot when you're done, never with the edge exposed."
            ]
          },
          {
            "heading": "Slicers, choppers, and processors",
            "items": [
              "Your company has to guard machines to protect you from the blade and other moving parts. Use every guard, and never bypass one.",
              "Use a push stick or tamp to feed food in or pull it out. Don't push small pieces of meat through a slicer with your hands.",
              "Never open a running machine or reach into it to stir or guide food.",
              "No loose clothing or jewelry around machines. They can get caught."
            ]
          },
          {
            "heading": "Cleaning and clearing jams",
            "items": [
              "Turn the machine off and unplug it before you take it apart, clean it, or clear a blockage.",
              "On a plug-in machine, unplugging is enough protection only if the plug stays under your control alone the whole time you work, so nobody else can plug it back in.",
              "If you can't keep the plug under your control, or the machine is wired in, servicing it generally falls under your company's lockout procedures. Your company has to train you on them. If you haven't been trained, ask before you start."
            ]
          },
          {
            "heading": "Gloves",
            "items": [
              "Where your hands could get severe cuts, your company has to choose the right hand protection and require you to wear it.",
              "When you're given steel mesh or cut-resistant gloves for cutting, wear them."
            ]
          }
        ],
        "ask": "Show me the guard and the push stick on our slicer. Where does the plug stay while you clean it?"
      },
      "es": {
        "title": "Cuchillos, rebanadoras y cortadoras",
        "hook": "Los cuchillos, los machetes de cocina y las rebanadoras están hechos para cortar, y te cortan a ti igual de fácil que a la comida. Unos cuantos hábitos mantienen tus manos fuera del camino.",
        "sections": [
          {
            "heading": "Hábitos con el cuchillo",
            "items": [
              "Mantén los dedos y el pulgar fuera de la línea de corte. No toques la hoja, y no platiques con tus compañeros mientras cortas.",
              "Mantén los cuchillos afilados y en buen estado. Un cuchillo sin filo se resbala. Solo trabajadores capacitados y con experiencia deben afilar los cuchillos.",
              "Si se cae un cuchillo, déjalo caer. No trates de agarrarlo.",
              "Regresa los cuchillos a su lugar cuando termines, nunca con el filo expuesto."
            ]
          },
          {
            "heading": "Rebanadoras, picadoras y procesadoras",
            "items": [
              "Tu compañía tiene que poner guardas en las máquinas para protegerte de la cuchilla y de otras partes en movimiento. Usa todas las guardas y nunca le des la vuelta a una.",
              "Usa un empujador o pisón para meter o sacar la comida. No empujes pedazos chicos de carne por la rebanadora con las manos.",
              "Nunca abras una máquina encendida ni metas la mano para revolver o guiar la comida.",
              "Nada de ropa suelta ni joyas cerca de las máquinas. Se pueden atorar."
            ]
          },
          {
            "heading": "Limpieza y atascos",
            "items": [
              "Apaga y desconecta la máquina antes de desarmarla, limpiarla o quitar un atasco.",
              "En una máquina que se enchufa, desconectarla solo es protección suficiente si el enchufe se queda bajo tu control, y de nadie más, todo el tiempo que trabajas, para que nadie la vuelva a conectar.",
              "Si no puedes mantener el enchufe bajo tu control, o la máquina está conectada directo a la corriente, darle servicio por lo general cae bajo los procedimientos de bloqueo (lockout) de tu compañía. Tu compañía tiene que capacitarte en ellos. Si no te han capacitado, pregunta antes de empezar."
            ]
          },
          {
            "heading": "Guantes",
            "items": [
              "Donde tus manos puedan sufrir cortes graves, tu compañía tiene que escoger la protección adecuada para las manos y exigir que la uses.",
              "Cuando te den guantes de malla de acero o guantes resistentes a cortes para cortar, úsalos."
            ]
          }
        ],
        "ask": "Enséñame la guarda y el empujador de nuestra rebanadora. ¿Dónde se queda el enchufe mientras la limpias?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "walk-in-cooler",
    "industries": [
      "food"
    ],
    "code": "1910.22(a) / 1910.138(a)",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Restaurant Safety eTool: Delivery/Storage (freezers and walk-ins, cold, slips, lifting, shelving)",
        "url": "https://www.osha.gov/etools/young-workers-restaurant-safety/delivery",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.22(a)(2) and (a)(3): floors clean and dry where feasible; surfaces free of spills and ice",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.138(a): hand protection for harmful temperature extremes",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.138",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Walk-In Coolers and Freezers",
        "hook": "A walk-in is cold, slick underfoot, and has a heavy door. People get trapped inside when that door closes behind them.",
        "sections": [
          {
            "heading": "Don't get trapped",
            "items": [
              "OSHA guidance says walk-ins should have a way out from the inside, like a panic bar on walk-in freezers. Know where it is and how it works before you need it.",
              "Someone should check the cold rooms during the day and at closing to make sure no one is inside."
            ]
          },
          {
            "heading": "Cold",
            "items": [
              "Wear warm clothes when you go in or spend time in there. Wear a hat and gloves when you unpack and sort food in the freezer.",
              "Where cold could hurt your hands, your company has to choose the right hand protection and require you to use it.",
              "Frostbite freezes the skin and makes it hard and numb. It usually hits fingers, hands, toes, feet, ears, and nose.",
              "Hypothermia is when your body temperature falls below 95°F. Watch for uncontrolled shivering, drowsiness, clumsy moves, and confusion, in yourself and in coworkers."
            ]
          },
          {
            "heading": "Wet floors",
            "items": [
              "Condensation makes walk-in floors wet and slippery. Wear rubber-soled, non-slip shoes.",
              "Your company has to keep floors clean and, as far as it can, dry, and keep walking surfaces free of spills and ice.",
              "Keep the floor clear of boxes and clutter. Non-slip mats help where the floor stays slick."
            ]
          },
          {
            "heading": "Lifting and shelves",
            "items": [
              "Don't lift a heavy load alone. Get help, or use a hand cart.",
              "Bring the load close, keep it right in front of you, and lift with your legs, not your back. Only carry what you can see over.",
              "Heavy items go on the lower shelves, lighter ones up top. To reach high, use a stool or ladder, not a chair or a box."
            ]
          }
        ],
        "ask": "Where is the inside release on our walk-in, and who checks the cold rooms at closing?"
      },
      "es": {
        "title": "Cuartos fríos y congeladores",
        "hook": "Un cuarto frío es frío, resbaloso y tiene una puerta pesada. Hay gente que se queda atrapada adentro cuando esa puerta se cierra detrás de ellos.",
        "sections": [
          {
            "heading": "No te quedes atrapado",
            "items": [
              "La guía de OSHA dice que los cuartos fríos deben tener una forma de salir por dentro, como una barra de pánico en los congeladores. Sabe dónde está y cómo funciona antes de necesitarla.",
              "Alguien debe revisar los cuartos fríos durante el día y a la hora de cerrar para asegurarse de que no haya nadie adentro."
            ]
          },
          {
            "heading": "El frío",
            "items": [
              "Usa ropa abrigada cuando entres o pases tiempo adentro. Usa gorro y guantes cuando desempaques y acomodes comida en el congelador.",
              "Donde el frío te pueda lastimar las manos, tu compañía tiene que escoger la protección adecuada para las manos y exigir que la uses.",
              "La congelación congela la piel y la deja dura y entumida. Por lo general afecta los dedos de las manos y de los pies, las manos, los pies, las orejas y la nariz.",
              "La hipotermia es cuando la temperatura de tu cuerpo baja de 95 °F. Fíjate si hay temblor que no se puede controlar, sueño, movimientos torpes y confusión, en ti y en tus compañeros."
            ]
          },
          {
            "heading": "Pisos mojados",
            "items": [
              "La condensación deja el piso del cuarto frío mojado y resbaloso. Usa zapatos antideslizantes con suela de hule.",
              "Tu compañía tiene que mantener los pisos limpios y, en lo posible, secos, y mantener las superficies donde caminas libres de derrames y hielo.",
              "Mantén el piso libre de cajas y desorden. Los tapetes antideslizantes ayudan donde el piso sigue resbaloso."
            ]
          },
          {
            "heading": "Levantar cargas y repisas",
            "items": [
              "No levantes una carga pesada tú solo. Pide ayuda o usa un carrito de mano.",
              "Acerca la carga, mantenla justo enfrente de ti y levanta con las piernas, no con la espalda. Solo carga lo que te deje ver por encima.",
              "Lo pesado va en las repisas de abajo, lo liviano arriba. Para alcanzar algo alto, usa un banquito o una escalera, no una silla ni una caja."
            ]
          }
        ],
        "ask": "¿Dónde está la salida por dentro de nuestro cuarto frío, y quién revisa los cuartos fríos a la hora de cerrar?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "cleaning-chemicals",
    "industries": [
      "facil",
      "health",
      "food",
      "retail"
    ],
    "code": "1910.1200",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA 1910.1200(f)(6) and (f)(8): workplace labeling of containers; portable-container exemption",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(b)(6)(ix): consumer products used as a consumer would",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(g)(8): SDSs readily accessible during each work shift",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA 1910.1200(h)(1): training at initial assignment and when a new hazard is introduced",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
        "kind": "standard"
      },
      {
        "label": "OSHA/NIOSH InfoSheet: Protecting Workers Who Use Cleaning Chemicals",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3512.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA 3569: Protect Yourself: Cleaning Chemicals and Your Health",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA_3569.pdf",
        "kind": "guidance"
      }
    ],
    "content": {
      "en": {
        "title": "Cleaning Chemicals",
        "hook": "Cleaning products don't look dangerous. But some can burn your skin and eyes, and the wrong mix can release a gas that hurts your lungs.",
        "sections": [
          {
            "heading": "Never mix",
            "items": [
              "Never mix different cleaning chemicals together. Dangerous gases can be released.",
              "Bleach plus ammonia is the one to remember. Together they can cause severe lung damage or death.",
              "Even used alone, mists and vapors from cleaners can irritate your eyes, nose, throat and lungs. Some cleaners can trigger asthma."
            ]
          },
          {
            "heading": "Labels and safety data sheets",
            "items": [
              "Your company has to make sure containers of hazardous chemicals are labeled. One exception: a spray bottle or other portable container you fill from a labeled one, only for your own use right away. The label tells you what's inside and what it can do to you.",
              "Read the label before you use a product, and follow what it says about protection.",
              "Your company has to keep a safety data sheet for each hazardous product. You can see it during any shift. Ask where they're kept.",
              "These rules may not cover a household-type cleaner used just the way a consumer would use it, for no longer and no more often."
            ]
          },
          {
            "heading": "Air and gear",
            "items": [
              "Run the ventilation while you clean so vapors don't build up.",
              "Wear the gloves and goggles your company provides when the product calls for them.",
              "Wash your hands with water, not cleaning chemicals, before you eat, drink or smoke.",
              "The word green on a bottle does not mean a product is safe."
            ]
          },
          {
            "heading": "Training",
            "items": [
              "Your company has to train you before you start working with a hazardous cleaner, and again when a new hazard comes in.",
              "Training covers the hazards, how to dilute and store the product, what to do about a spill, and which gear to wear.",
              "It has to be in a language and words you understand. If you didn't understand it, say so."
            ]
          }
        ],
        "ask": "Pick one product we use every day. Who can tell me what its label warns about and where its safety data sheet is?"
      },
      "es": {
        "title": "Químicos de limpieza",
        "hook": "Los productos de limpieza no parecen peligrosos. Pero algunos te pueden quemar la piel y los ojos, y la mezcla equivocada puede soltar un gas que te daña los pulmones.",
        "sections": [
          {
            "heading": "Nunca mezcles",
            "items": [
              "Nunca mezcles diferentes químicos de limpieza. Se pueden soltar gases peligrosos.",
              "Cloro más amoníaco es la que tienes que recordar. Juntos pueden causar daño grave a los pulmones o la muerte.",
              "Aun usados solos, el rocío y los vapores de los limpiadores pueden irritarte los ojos, la nariz, la garganta y los pulmones. Algunos limpiadores pueden provocar asma."
            ]
          },
          {
            "heading": "Etiquetas y hojas de datos de seguridad",
            "items": [
              "Tu empresa tiene que asegurarse de que los recipientes de químicos peligrosos estén etiquetados. Una excepción: una botella de rociar u otro recipiente portátil que llenas de uno etiquetado, solo para que tú lo uses en ese momento. La etiqueta te dice qué hay adentro y qué te puede hacer.",
              "Lee la etiqueta antes de usar un producto, y sigue lo que dice sobre protección.",
              "Tu empresa tiene que tener una hoja de datos de seguridad para cada producto peligroso. Puedes verla en cualquier turno. Pregunta dónde las guardan.",
              "Estas reglas pueden no aplicar a un limpiador de uso doméstico usado igual que lo usaría un consumidor, por no más tiempo y no más seguido."
            ]
          },
          {
            "heading": "Aire y equipo",
            "items": [
              "Prende la ventilación mientras limpias para que no se acumulen los vapores.",
              "Usa los guantes y las gafas que te da tu empresa cuando el producto lo pida.",
              "Lávate las manos con agua, no con químicos de limpieza, antes de comer, beber o fumar.",
              "La palabra \"green\" (verde o ecológico) en una botella no quiere decir que el producto sea seguro."
            ]
          },
          {
            "heading": "Capacitación",
            "items": [
              "Tu empresa tiene que capacitarte antes de que empieces a trabajar con un limpiador peligroso, y otra vez cuando llegue un peligro nuevo.",
              "La capacitación cubre los peligros, cómo diluir y guardar el producto, qué hacer si se derrama y qué equipo usar.",
              "Tiene que ser en un idioma y con palabras que entiendas. Si no la entendiste, dilo."
            ]
          }
        ],
        "ask": "Escojan un producto que usamos todos los días. ¿Quién me puede decir de qué advierte su etiqueta y dónde está su hoja de datos de seguridad?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  },
  {
    "id": "hotel-housekeeping",
    "industries": [
      "facil"
    ],
    "code": "No OSHA ergonomics standard (guidance) / 1910.1030 where exposure applies",
    "minutes": 5,
    "sources": [
      {
        "label": "OSHA Hospitals eTool, Housekeeping: work-related musculoskeletal disorders (hospital guidance; used for the same room-cleaning tasks)",
        "url": "https://www.osha.gov/etools/hospitals/housekeeping/work-related-musculoskeletal-disorders",
        "kind": "guidance"
      },
      {
        "label": "OSHA Ergonomics: risk factors and early reporting of symptoms",
        "url": "https://www.osha.gov/ergonomics",
        "kind": "guidance"
      },
      {
        "label": "OSHA/NIOSH InfoSheet: Protecting Workers Who Use Cleaning Chemicals",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3512.pdf",
        "kind": "guidance"
      },
      {
        "label": "OSHA Hospitals eTool, Laundry: biological hazards (hospital guidance: sharps in laundry bags)",
        "url": "https://www.osha.gov/etools/hospitals/laundry/biological-hazards",
        "kind": "guidance"
      },
      {
        "label": "OSHA interpretation, Dec. 4, 1992: housekeeping staff and contaminated sharps under 1910.1030",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1992-12-04",
        "kind": "guidance"
      },
      {
        "label": "OSHA interpretation, Aug. 7, 1992: hotel housekeeping, employer designates exposed tasks under 1910.1030",
        "url": "https://www.osha.gov/laws-regs/standardinterpretations/1992-08-07-1",
        "kind": "guidance"
      },
      {
        "label": "OSHA 1910.1030: bloodborne pathogens (applies where occupational exposure is reasonably anticipated)",
        "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
        "kind": "standard"
      }
    ],
    "content": {
      "en": {
        "title": "Room Cleaning: Your Back, Chemicals and Sharps",
        "hook": "Every room means bending, reaching, lifting and pushing. Do it the hard way all day and it can turn into a back or shoulder injury.",
        "sections": [
          {
            "heading": "Beds and mattresses",
            "items": [
              "Lifting and holding a mattress to tuck in sheets is a known strain on your back.",
              "Where fitted sheets are used, you don't have to lift the mattress to change the bed.",
              "If something is heavy, lighten the load or get help. Don't muscle it alone.",
              "Speak up early about aches and pains. Reporting early can keep them from becoming a serious injury."
            ]
          },
          {
            "heading": "Reaching, kneeling and carts",
            "items": [
              "Use long-handled tools or a step stool instead of reaching overhead or kneeling to clean the bathroom.",
              "When you do kneel, wear knee pads.",
              "Avoid awkward bending and twisting. Change up how you mop so the same muscles don't do all the work.",
              "Push your cart instead of pulling it, and hold the handles. Grabbing the sides can smash your fingers."
            ]
          },
          {
            "heading": "Chemicals",
            "items": [
              "Never mix cleaning products. Bleach and ammonia together can cause severe lung damage or death.",
              "Wear the gloves and goggles you're given when the job calls for them.",
              "Wash your hands with water, not cleaning chemicals, before you eat or drink."
            ]
          },
          {
            "heading": "Needles and blood",
            "items": [
              "Needles can hide in dirty linens. Don't squeeze laundry bags or hold them against your body.",
              "If you find a needle or linens with visible blood, don't handle them unless that's your assigned job. Follow your company's procedure.",
              "OSHA doesn't generally treat housekeeping outside health care as exposure to blood. But your company has to look at the real risks and decide which jobs or tasks are exposed. If contact with blood or contaminated needles is expected in your job, the bloodborne pathogens rule's protections apply to you."
            ]
          }
        ],
        "ask": "Which task in a room is hardest on your body, and what tool or trick makes it easier?"
      },
      "es": {
        "title": "Limpieza de habitaciones: tu espalda, químicos y objetos punzantes",
        "hook": "Cada habitación significa agacharte, estirarte, levantar y empujar. Si lo haces de la manera difícil todo el día, puede terminar en una lesión de espalda o de hombro.",
        "sections": [
          {
            "heading": "Camas y colchones",
            "items": [
              "Levantar y sostener un colchón para meter las sábanas es un esfuerzo conocido para tu espalda.",
              "Donde se usan sábanas ajustables, no tienes que levantar el colchón para cambiar la cama.",
              "Si algo pesa, aligera la carga o pide ayuda. No lo fuerces tú solo.",
              "Avisa temprano de dolores y molestias. Reportarlos a tiempo puede evitar que se conviertan en una lesión seria."
            ]
          },
          {
            "heading": "Estirarte, arrodillarte y los carritos",
            "items": [
              "Usa herramientas de mango largo o un banquito en vez de estirarte por encima de la cabeza o arrodillarte para limpiar el baño.",
              "Cuando sí te arrodilles, usa rodilleras.",
              "Evita agacharte y torcerte en posturas forzadas. Cambia tu forma de trapear para que no trabajen siempre los mismos músculos.",
              "Empuja tu carrito en vez de jalarlo, y agárralo de las manijas. Si lo agarras por los lados te puedes machucar los dedos."
            ]
          },
          {
            "heading": "Químicos",
            "items": [
              "Nunca mezcles productos de limpieza. El cloro y el amoníaco juntos pueden causar daño grave a los pulmones o la muerte.",
              "Usa los guantes y las gafas que te dan cuando el trabajo los requiera.",
              "Lávate las manos con agua, no con químicos de limpieza, antes de comer o beber."
            ]
          },
          {
            "heading": "Agujas y sangre",
            "items": [
              "Puede haber agujas escondidas en la ropa de cama sucia. No aprietes las bolsas de ropa ni las cargues pegadas al cuerpo.",
              "Si encuentras una aguja o ropa de cama con sangre visible, no la manejes a menos que ese sea tu trabajo asignado. Sigue el procedimiento de tu empresa.",
              "OSHA por lo general no considera que la limpieza fuera de los servicios de salud tenga exposición a la sangre. Pero tu empresa tiene que ver los riesgos reales y decidir qué trabajos o tareas tienen exposición. Si en tu trabajo se espera contacto con sangre o con agujas contaminadas, las protecciones de la regla de patógenos de la sangre te aplican."
            ]
          }
        ],
        "ask": "¿Qué tarea en una habitación es la más dura para tu cuerpo, y qué herramienta o truco la hace más fácil?"
      }
    },
    "translationStatus": {
      "en": "source",
      "es": "draft"
    }
  }
];
