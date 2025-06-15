// Content moderation utility for detecting inappropriate content
// This includes SARA (Suku, Agama, Ras, Antar-golongan), pornography, and other harmful content

export interface ModerationResult {
  isClean: boolean;
  violations: string[];
  severity: 'low' | 'medium' | 'high';
  blockedWords: string[];
}

// Keyword lists for different categories
const SARA_KEYWORDS = [
  // Religious intolerance
  'kafir', 'murtad', 'sesat', 'bid\'ah', 'syirik',
  // Ethnic/racial slurs
  'cina babi', 'pribumi', 'aseng', 'inlander', 'totok',
  // Regional discrimination
  'kampungan', 'ndeso', 'udik',
  // Political extremism
  'khilafah', 'radikal islam', 'teroris muslim',
];

const PORNOGRAPHY_KEYWORDS = [
  'bokep', 'porn', 'sex', 'bugil', 'telanjang', 'porno',
  'masturbasi', 'onani', 'orgasme', 'penetrasi',
  'oral sex', 'anal sex', 'threesome', 'gangbang',
  'escort', 'prostitusi', 'pelacur', 'gigolo',
  'pijat plus', 'happy ending', 'body to body',
];

const VIOLENCE_KEYWORDS = [
  'bunuh', 'pembunuhan', 'membunuh', 'teroris', 'terorisme',
  'bom', 'meledakkan', 'menyiksa', 'penyiksaan',
  'pemerkosaan', 'memperkosa', 'kekerasan', 'sadis',
  'mutilasi', 'pembantaian', 'genosida',
];

const HATE_SPEECH_KEYWORDS = [
  'bangsat', 'anjing', 'babi', 'monyet', 'kera',
  'bodoh', 'tolol', 'idiot', 'goblok', 'dungu',
  'tai', 'kontol', 'memek', 'ngentot', 'jancok',
  'bangke', 'sialan', 'brengsek', 'keparat',
];

const DRUGS_KEYWORDS = [
  'narkoba', 'ganja', 'marijuana', 'kokain', 'heroin',
  'ekstasi', 'shabu', 'putaw', 'pil koplo',
  'tramadol', 'xanax', 'rohypnol', 'dealer',
  'bandar narkoba', 'jualan narkoba',
];

const GAMBLING_KEYWORDS = [
  'judi', 'slot online', 'poker online', 'togel',
  'bandar bola', 'taruhan', 'casino online',
  'jackpot', 'maxwin', 'rtp slot', 'gacor',
  'deposit pulsa', 'withdraw mudah',
];

// Function to normalize text for better detection
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to check for obfuscated words (like b0k3p instead of bokep)
function generateVariations(word: string): string[] {
  const variations = [word];
  
  // Common character substitutions
  const substitutions: { [key: string]: string[] } = {
    'a': ['4', '@'],
    'e': ['3'],
    'i': ['1', '!'],
    'o': ['0'],
    's': ['5', '$'],
    't': ['7'],
    'g': ['9'],
  };
  
  // Generate variations with character substitutions
  let currentVariations = [word];
  
  for (const [char, subs] of Object.entries(substitutions)) {
    const newVariations: string[] = [];
    
    for (const variation of currentVariations) {
      newVariations.push(variation);
      for (const sub of subs) {
        newVariations.push(variation.replace(new RegExp(char, 'g'), sub));
      }
    }
    
    currentVariations = newVariations;
  }
  
  // Add spaced versions (like "b o k e p")
  variations.push(word.split('').join(' '));
  variations.push(word.split('').join('.'));
  variations.push(word.split('').join('-'));
  
  return [...new Set([...variations, ...currentVariations])];
}

// Main content moderation function
export function moderateContent(title: string, description: string): ModerationResult {
  const fullText = `${title} ${description}`;
  const normalizedText = normalizeText(fullText);
  
  const violations: string[] = [];
  const blockedWords: string[] = [];
  let maxSeverity: 'low' | 'medium' | 'high' = 'low';
  
  // Check all keyword categories
  const allKeywords = [
    ...SARA_KEYWORDS,
    ...PORNOGRAPHY_KEYWORDS,
    ...VIOLENCE_KEYWORDS,
    ...HATE_SPEECH_KEYWORDS,
    ...DRUGS_KEYWORDS,
    ...GAMBLING_KEYWORDS,
  ];
  
  for (const keyword of allKeywords) {
    const variations = generateVariations(keyword);
    
    for (const variation of variations) {
      if (normalizedText.includes(variation)) {
        blockedWords.push(keyword);
        
        // Determine violation category and severity
        if (SARA_KEYWORDS.includes(keyword)) {
          violations.push('SARA (Suku, Agama, Ras, Antar-golongan)');
          maxSeverity = maxSeverity === 'low' ? 'medium' : maxSeverity;
        }
        if (PORNOGRAPHY_KEYWORDS.includes(keyword)) {
          violations.push('Konten Pornografi');
          maxSeverity = 'high';
        }
        if (VIOLENCE_KEYWORDS.includes(keyword)) {
          violations.push('Konten Kekerasan');
          maxSeverity = 'high';
        }
        if (HATE_SPEECH_KEYWORDS.includes(keyword)) {
          violations.push('Ujaran Kebencian');
        }
        if (DRUGS_KEYWORDS.includes(keyword)) {
          violations.push('Konten Narkoba');
          maxSeverity = 'high';
        }
        if (GAMBLING_KEYWORDS.includes(keyword)) {
          violations.push('Konten Judi');
          maxSeverity = maxSeverity === 'low' ? 'medium' : maxSeverity;
        }
        
        break; // Found one variation, no need to check others for this keyword
      }
    }
  }
  
  // Remove duplicates
  const uniqueViolations = [...new Set(violations)];
  const uniqueBlockedWords = [...new Set(blockedWords)];
  
  return {
    isClean: uniqueViolations.length === 0,
    violations: uniqueViolations,
    severity: maxSeverity,
    blockedWords: uniqueBlockedWords,
  };
}

// Function to get user-friendly violation message
export function getViolationMessage(result: ModerationResult): string {
  if (result.isClean) {
    return '';
  }
  
  const violationTypes = result.violations.join(', ');
  
  switch (result.severity) {
    case 'high':
      return `Konten Anda mengandung ${violationTypes} yang sangat tidak pantas dan melanggar kebijakan platform. Silakan revisi konten Anda.`;
    case 'medium':
      return `Konten Anda mengandung ${violationTypes} yang tidak sesuai dengan kebijakan platform. Mohon gunakan bahasa yang lebih sopan dan inklusif.`;
    case 'low':
      return `Konten Anda mengandung ${violationTypes}. Mohon gunakan bahasa yang lebih sopan dan profesional.`;
    default:
      return 'Konten Anda mengandung kata-kata yang tidak pantas. Silakan revisi konten Anda.';
  }
}

// Function for image content moderation (basic implementation)
export function moderateImageFilename(filename: string): boolean {
  const normalizedFilename = normalizeText(filename);
  
  const inappropriateTerms = [
    ...PORNOGRAPHY_KEYWORDS,
    ...VIOLENCE_KEYWORDS,
    'nude', 'naked', 'xxx', 'adult',
  ];
  
  return !inappropriateTerms.some(term => 
    generateVariations(term).some(variation => 
      normalizedFilename.includes(variation)
    )
  );
}
