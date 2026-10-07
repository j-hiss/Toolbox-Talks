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
      "con"
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
      "con"
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
      "mfg"
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
      "mfg"
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
      "wh"
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
      "wh"
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
      "mfg"
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
      "mfg"
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
      "mfg"
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
      "wh"
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
      "mfg"
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
      "mfg"
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
      "mfg"
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
      "wh"
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
      "mfg"
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
      "wh"
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
      "mfg"
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
      "wh"
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
  }
];
