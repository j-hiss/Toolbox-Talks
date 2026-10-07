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
      "wh"
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
      "mfg"
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
      "wh"
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
      "mfg"
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
      "ag"
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
  }
];
