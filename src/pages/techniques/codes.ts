export interface CodeMapping {
  letter: string;
  replacement: string;
}

export interface ScoutCode {
  key: string;
  name: string;
  description: string;
  letterDeDepart: string;
  caractereDeSubstitution: string;
  mapping: CodeMapping[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = Array.from({ length: 26 }, (_, i) => String(i + 1));

// Génère le mapping complet d'un alphabet de substitution à partir d'un point de départ.
// - Si la valeur de substitution est une lettre, la séquence de substitution est A-Z circulaire.
// - Si la valeur de substitution est un chiffre, la séquence de substitution est 1-26 circulaire.
export function generateSubstitutionMapping(
  letterDeDepart: string,
  caractereDeSubstitution: string
): CodeMapping[] {
  const mapping: CodeMapping[] = [];
  const startLetterIndex = ALPHABET.indexOf(letterDeDepart.toUpperCase());

  const isDigit = /^\d$/.test(caractereDeSubstitution);
  const substitutionSequence = isDigit ? NUMBERS : ALPHABET;
  const startSubIndex = substitutionSequence.indexOf(
    caractereDeSubstitution.toUpperCase()
  );

  for (let i = 0; i < 26; i++) {
    const letterIndex = (startLetterIndex + i) % 26;
    const letter = ALPHABET[letterIndex];
    const subIndex = (startSubIndex + i) % substitutionSequence.length;
    const replacement = substitutionSequence[subIndex];
    mapping.push({ letter, replacement });
  }

  return mapping;
}

const codeConfigs: Omit<ScoutCode, "mapping">[] = [
  {
    key: "avocat",
    name: "Code Avocat",
    description: "Le A se remplace par un K.",
    letterDeDepart: "A",
    caractereDeSubstitution: "K",
  },
  {
    key: "escalier",
    name: "Code Escalier",
    description: "Le S se remplace par un K.",
    letterDeDepart: "S",
    caractereDeSubstitution: "K",
  },
  {
    key: "idee",
    name: "Code Idee",
    description: "Le I se remplace par un D.",
    letterDeDepart: "I",
    caractereDeSubstitution: "D",
  },
  {
    key: "pays",
    name: "Code Pays",
    description: "Le P se remplace par un I.",
    letterDeDepart: "P",
    caractereDeSubstitution: "I",
  },
  {
    key: "herve",
    name: "Code Herve",
    description: "Le R se remplace par un V.",
    letterDeDepart: "R",
    caractereDeSubstitution: "V",
  },
  {
    key: "cassis",
    name: "Code Cassis",
    description: "Le K se remplace par un 6.",
    letterDeDepart: "K",
    caractereDeSubstitution: "6",
  },
  {
    key: "cassette",
    name: "Code Cassette / K7",
    description: "Le K se remplace par un 7.",
    letterDeDepart: "K",
    caractereDeSubstitution: "7",
  },
];

export const scoutCodes: ScoutCode[] = codeConfigs.map((config) => ({
  ...config,
  mapping: generateSubstitutionMapping(
    config.letterDeDepart,
    config.caractereDeSubstitution
  ),
}));