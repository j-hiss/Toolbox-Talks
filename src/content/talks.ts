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
  }
];
