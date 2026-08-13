export interface TitleTraitsResult {
  builderTitle: string;
  traits: string[];
}

const TITLE_MAPPINGS: Record<string, string[]> = {
  frontend: [
    "PIXEL WHISPERER",
    "DOM MASTER",
    "CSS ALCHEMIST",
    "INTERFACE VIRTUOSO",
    "CANVAS CRAFTSMAN"
  ],
  backend: [
    "SERVER SORCERER",
    "QUERY OPTIMIZER",
    "API ARCHITECT",
    "DISTRIBUTED NOMAD",
    "CACHE COMMANDER"
  ],
  fullstack: [
    "FULL-STACK NOMAD",
    "END-TO-END SHIPPER",
    "REASONING ENGINE",
    "SYSTEM BUILDER",
    "MONOLITH SLAYER"
  ],
  ai: [
    "MODEL TAMER",
    "NEURAL ALCHEMIST",
    "PROMPT WHISPERER",
    "LATENT EXPLORER",
    "WEIGHT REGULATOR"
  ],
  design: [
    "DESIGN ARCHITECT",
    "LAYOUT MAESTRO",
    "AZULEJO ARTIST",
    "PALETTE CRAFTSMAN",
    "VECTOR CHIEF"
  ],
  mobile: [
    "NATIVE VOYAGER",
    "APP ARCHITECT",
    "TOUCH REASONER",
    "GESTURE MAESTRO"
  ],
  crypto: [
    "CHAIN ARCHITECT",
    "ZERO-KNOWLEDGE BUILDER",
    "SMART CONTRACTOR",
    "CONSENSUS LEADER"
  ],
  devrel: [
    "COMMUNITY CATALYST",
    "ECOSYSTEM SHIPPER",
    "HACKATHON VETERAN",
    "CODE EVANGELIST"
  ]
};

const TRAIT_POOL = [
  "Terminal Resident",
  "UI Perfectionist",
  "Late-Night Shipper",
  "Beach Coder",
  "Coconut Fueled",
  "Git Rebase Master",
  "Azulejo Admirer",
  "Zero-Bug Dreamer",
  "FastAPI Speedster",
  "React Champion",
  "Prompt Craftsman",
  "Goan Sunset Enthusiast",
  "Async Specialist",
  "Clean Code Fanatic",
  "Coffee to Code Converter",
  "Hackathon Champion"
];

const DEFAULT_TITLES = [
  "GOAN ADVENTURER",
  "HACKER HOUSE SHIPPER",
  "GOAN BUILDER",
  "GOAN INNOVATOR"
];

export function getTitleAndTraits(stackRole: string, _userName: string = ""): TitleTraitsResult {
  const roleLower = stackRole.toLowerCase();
  
  let selectedTitle = "";
  for (const [key, titles] of Object.entries(TITLE_MAPPINGS)) {
    if (roleLower.includes(key) || (key === "ai" && (roleLower.includes("ml") || roleLower.includes("data")))) {
      selectedTitle = titles[Math.floor(Math.random() * titles.length)];
      break;
    }
  }
  
  if (!selectedTitle) {
    selectedTitle = DEFAULT_TITLES[Math.floor(Math.random() * DEFAULT_TITLES.length)];
  }

  // Shuffle and pick 4 unique traits
  const shuffled = [...TRAIT_POOL].sort(() => 0.5 - Math.random());
  const traits = shuffled.slice(0, 4);

  return {
    builderTitle: selectedTitle,
    traits
  };
}
