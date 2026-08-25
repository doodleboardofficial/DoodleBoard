import { Post } from '../types';

// Helper to create clean vector doodle SVG data URLs
const createSvgDoodle = (svgContent: string, width = 600, height = 800, bg = '#F9F9F8'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bg}"/>
    ${svgContent}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Morning Espresso & Moleskine',
    src: createSvgDoodle(`
      <circle cx="300" cy="350" r="140" fill="#EAE5DE" stroke="#222222" stroke-width="4"/>
      <ellipse cx="300" cy="350" rx="100" ry="90" fill="#4A3525"/>
      <ellipse cx="295" cy="340" rx="70" ry="60" fill="#6F4E37"/>
      <path d="M 330 330 Q 350 310 320 290 Q 300 270 330 250" fill="none" stroke="#FAF8F5" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
      <path d="M 280 340 Q 260 320 290 300 Q 310 280 280 260" fill="none" stroke="#FAF8F5" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
      <path d="M 435 320 C 490 320 490 390 435 390" fill="none" stroke="#222222" stroke-width="12" stroke-linecap="round"/>
      <ellipse cx="300" cy="560" rx="200" ry="40" fill="none" stroke="#222222" stroke-width="5"/>
      <path d="M 120 620 L 480 620" stroke="#111111" stroke-width="4" stroke-linecap="round"/>
      <path d="M 160 670 L 440 670" stroke="#777777" stroke-width="2" stroke-dasharray="6,6"/>
      <text x="300" y="730" font-family="sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="#888888" letter-spacing="4">CAFÉ VIBES • 08:30 AM</text>
    `, 600, 800, '#F5F2EB'),
    aspectRatio: 1.33,
    tags: ['Daily Life', 'Minimalist'],
    userId: 'user-elena',
    userName: 'Elena Rostova',
    userAvatarBg: '#4F46E5',
    userAvatarLetter: 'E',
    isVerified: true,
    likes: 42,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 2,
    description: 'Quick morning line sketch while waiting for the pour-over to bloom.'
  },
  {
    id: 'post-2',
    title: 'Monstera Deliciosa Study',
    src: createSvgDoodle(`
      <path d="M 300 700 Q 290 450 300 200" stroke="#2C4C38" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Main Leaf Left -->
      <path d="M 300 350 C 150 250 120 420 300 520" fill="#E8F1EC" stroke="#2C4C38" stroke-width="6"/>
      <circle cx="210" cy="380" r="14" fill="#F8FBF9"/>
      <ellipse cx="235" cy="440" rx="24" ry="12" transform="rotate(-20 235 440)" fill="#F8FBF9"/>
      <!-- Main Leaf Right -->
      <path d="M 300 280 C 480 180 490 380 300 440" fill="#D3E4DB" stroke="#2C4C38" stroke-width="6"/>
      <circle cx="390" cy="310" r="16" fill="#F8FBF9"/>
      <ellipse cx="380" cy="370" rx="26" ry="12" transform="rotate(25 380 370)" fill="#F8FBF9"/>
      <!-- Top Sprout -->
      <path d="M 300 220 C 240 120 360 80 300 180" fill="#A8CBB8" stroke="#2C4C38" stroke-width="5"/>
      <!-- Pot -->
      <path d="M 230 650 L 370 650 L 350 780 L 250 780 Z" fill="#D77A61" stroke="#222222" stroke-width="5"/>
      <ellipse cx="300" cy="650" rx="70" ry="12" fill="#BA654E"/>
    `, 600, 900, '#F8FBF9'),
    aspectRatio: 1.5,
    tags: ['Botanical', 'Minimalist'],
    userId: 'user-tetsu',
    userName: 'Tetsu Tanaka',
    userAvatarBg: '#059669',
    userAvatarLetter: 'T',
    isVerified: true,
    likes: 89,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 5,
    description: 'Botanical foliage ink study on textured watercolor grain paper.'
  },
  {
    id: 'post-3',
    title: 'Sleepy Calico Cat Nap',
    src: createSvgDoodle(`
      <ellipse cx="300" cy="400" rx="160" ry="120" fill="#FFFFFF" stroke="#222222" stroke-width="5"/>
      <!-- Patches -->
      <path d="M 200 320 Q 250 300 280 360 Q 210 400 200 320 Z" fill="#E67E22"/>
      <path d="M 360 340 Q 420 320 440 400 Q 380 430 360 340 Z" fill="#2C3E50"/>
      <!-- Head -->
      <circle cx="190" cy="330" r="60" fill="#FFFFFF" stroke="#222222" stroke-width="5"/>
      <!-- Ears -->
      <polygon points="140,290 160,230 190,280" fill="#E67E22" stroke="#222222" stroke-width="4"/>
      <polygon points="190,280 230,235 240,290" fill="#FFFFFF" stroke="#222222" stroke-width="4"/>
      <!-- Sleeping Eyes -->
      <path d="M 155 330 Q 170 345 185 330" fill="none" stroke="#222222" stroke-width="4" stroke-linecap="round"/>
      <path d="M 195 330 Q 210 345 225 330" fill="none" stroke="#222222" stroke-width="4" stroke-linecap="round"/>
      <polygon points="188,342 196,342 192,348" fill="#F1948A"/>
      <!-- Whiskers -->
      <line x1="130" y1="340" x2="165" y2="345" stroke="#222222" stroke-width="3" stroke-linecap="round"/>
      <line x1="130" y1="355" x2="165" y2="352" stroke="#222222" stroke-width="3" stroke-linecap="round"/>
      <!-- Curled Tail -->
      <path d="M 450 430 C 520 430 520 310 440 330" fill="none" stroke="#222222" stroke-width="14" stroke-linecap="round"/>
      <text x="320" y="240" font-family="sans-serif" font-size="28" font-weight="bold" fill="#7F8C8D">z z Z</text>
    `, 600, 600, '#FFFDF9'),
    aspectRatio: 1.0,
    tags: ['Animals', 'Cute'],
    userId: 'user-maya',
    userName: 'Maya Lin',
    userAvatarBg: '#D97706',
    userAvatarLetter: 'M',
    isVerified: true,
    likes: 154,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 8,
    description: 'Inspired by my roommate’s cat basking in the 3 PM sun patch.'
  },
  {
    id: 'post-4',
    title: 'Floating Astronaut in Void',
    src: createSvgDoodle(`
      <!-- Stars & sparkles -->
      <circle cx="100" cy="150" r="3" fill="#222222"/>
      <circle cx="500" cy="180" r="4" fill="#222222"/>
      <circle cx="480" cy="620" r="3" fill="#222222"/>
      <circle cx="140" cy="700" r="4" fill="#222222"/>
      <!-- Floating Balloon Planet -->
      <circle cx="420" cy="240" r="50" fill="#FFEAA7" stroke="#222222" stroke-width="4"/>
      <ellipse cx="420" cy="240" rx="75" ry="16" transform="rotate(-15 420 240)" fill="none" stroke="#222222" stroke-width="3"/>
      <path d="M 420 290 Q 360 360 340 450" fill="none" stroke="#555555" stroke-width="2" stroke-dasharray="4,4"/>
      <!-- Astronaut Body -->
      <ellipse cx="280" cy="500" rx="60" ry="80" fill="#FFFFFF" stroke="#222222" stroke-width="6"/>
      <!-- Helmet -->
      <circle cx="280" cy="380" r="65" fill="#FFFFFF" stroke="#222222" stroke-width="6"/>
      <ellipse cx="280" cy="380" rx="45" ry="35" fill="#2C3E50"/>
      <ellipse cx="270" cy="370" rx="15" ry="10" fill="#74B9FF" opacity="0.6"/>
      <!-- Limbs -->
      <path d="M 230 460 Q 170 470 160 410" fill="none" stroke="#222222" stroke-width="16" stroke-linecap="round"/>
      <path d="M 330 460 Q 360 420 340 450" fill="none" stroke="#222222" stroke-width="16" stroke-linecap="round"/>
      <path d="M 250 570 Q 230 680 200 700" fill="none" stroke="#222222" stroke-width="16" stroke-linecap="round"/>
      <path d="M 310 570 Q 330 650 360 690" fill="none" stroke="#222222" stroke-width="16" stroke-linecap="round"/>
    `, 600, 850, '#F4F5F7'),
    aspectRatio: 1.41,
    tags: ['Characters', 'Abstract'],
    userId: 'user-sam',
    userName: 'Sam K.',
    userAvatarBg: '#2563EB',
    userAvatarLetter: 'S',
    likes: 67,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 12,
    description: 'Drifting freely through thoughts. Digital ink on minimal canvas.'
  },
  {
    id: 'post-5',
    title: 'Brutalist Arch & Shadow',
    src: createSvgDoodle(`
      <!-- Geometric composition -->
      <rect x="120" y="200" width="360" height="480" rx="180" fill="#E8ECEF" stroke="#1A1A1A" stroke-width="6"/>
      <rect x="180" y="320" width="240" height="360" rx="120" fill="#D2D7DF" stroke="#1A1A1A" stroke-width="5"/>
      <rect x="230" y="440" width="140" height="240" rx="70" fill="#1A1A1A"/>
      <!-- Sun circle -->
      <circle cx="440" cy="180" r="50" fill="#FF7675" stroke="#1A1A1A" stroke-width="5"/>
      <!-- Hatching shadows -->
      <line x1="120" y1="680" x2="480" y2="680" stroke="#1A1A1A" stroke-width="6"/>
      <line x1="150" y1="710" x2="450" y2="710" stroke="#1A1A1A" stroke-width="3"/>
      <line x1="180" y1="730" x2="420" y2="730" stroke="#1A1A1A" stroke-width="2"/>
    `, 600, 800, '#FAFAFA'),
    aspectRatio: 1.33,
    tags: ['Architecture', 'Minimalist'],
    userId: 'user-elena',
    userName: 'Elena Rostova',
    userAvatarBg: '#4F46E5',
    userAvatarLetter: 'E',
    likes: 112,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 18,
    description: 'Shadowplay and geometry inspired by Ricardo Bofill’s La Muralla Roja.'
  },
  {
    id: 'post-6',
    title: 'Vintage Twin-Lens Camera',
    src: createSvgDoodle(`
      <!-- Camera body -->
      <rect x="180" y="240" width="240" height="340" rx="24" fill="#2D3436" stroke="#111111" stroke-width="6"/>
      <rect x="200" y="260" width="200" height="300" rx="16" fill="#636E72" stroke="#111111" stroke-width="4"/>
      <!-- Top Lens -->
      <circle cx="300" cy="330" r="48" fill="#DFE6E9" stroke="#111111" stroke-width="6"/>
      <circle cx="300" cy="330" r="32" fill="#0984E3"/>
      <circle cx="290" cy="320" r="10" fill="#74B9FF"/>
      <!-- Bottom Lens -->
      <circle cx="300" cy="460" r="54" fill="#DFE6E9" stroke="#111111" stroke-width="6"/>
      <circle cx="300" cy="460" r="38" fill="#2D3436"/>
      <circle cx="300" cy="460" r="22" fill="#D63031"/>
      <!-- Knobs -->
      <rect x="150" y="320" width="30" height="50" rx="6" fill="#B2BEC3" stroke="#111111" stroke-width="4"/>
      <rect x="420" y="420" width="30" height="60" rx="6" fill="#B2BEC3" stroke="#111111" stroke-width="4"/>
      <!-- Strap -->
      <path d="M 180 380 C 80 440 80 640 180 660" fill="none" stroke="#D63031" stroke-width="8"/>
      <path d="M 420 380 C 520 440 520 640 420 660" fill="none" stroke="#D63031" stroke-width="8"/>
    `, 600, 750, '#F5F6FA'),
    aspectRatio: 1.25,
    tags: ['Daily Life', 'Minimalist'],
    userId: 'user-chloe',
    userName: 'Chloe Bennett',
    userAvatarBg: '#EC4899',
    userAvatarLetter: 'C',
    likes: 95,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 24,
    description: 'Analog love. Practicing mechanical product silhouettes.'
  },
  {
    id: 'post-7',
    title: 'Steaming Tonkotsu Ramen',
    src: createSvgDoodle(`
      <!-- Bowl -->
      <path d="M 150 400 Q 300 620 450 400 Z" fill="#E17055" stroke="#222222" stroke-width="6"/>
      <ellipse cx="300" cy="400" rx="150" ry="40" fill="#FAB1A0" stroke="#222222" stroke-width="6"/>
      <!-- Soup & Noodles -->
      <ellipse cx="300" cy="405" rx="135" ry="30" fill="#FFEAA7"/>
      <!-- Egg Half -->
      <ellipse cx="240" cy="395" rx="30" ry="20" fill="#FFFFFF" stroke="#222222" stroke-width="3"/>
      <circle cx="240" cy="395" r="14" fill="#E17055"/>
      <!-- Nori Seaweed -->
      <rect x="360" y="340" width="35" height="60" transform="rotate(15 360 340)" fill="#2D3436" stroke="#222222" stroke-width="3"/>
      <!-- Narutomaki Swirl -->
      <circle cx="310" cy="410" r="18" fill="#FFFFFF" stroke="#222222" stroke-width="3"/>
      <path d="M 305 410 Q 310 403 315 410 Q 320 417 312 419" fill="none" stroke="#FD79A8" stroke-width="3"/>
      <!-- Chopsticks -->
      <line x1="120" y1="300" x2="420" y2="380" stroke="#6C5CE7" stroke-width="8" stroke-linecap="round"/>
      <line x1="130" y1="280" x2="430" y2="370" stroke="#6C5CE7" stroke-width="8" stroke-linecap="round"/>
      <!-- Steam -->
      <path d="M 260 320 Q 240 280 270 240 Q 290 200 270 160" fill="none" stroke="#B2BEC3" stroke-width="4" stroke-linecap="round"/>
      <path d="M 330 330 Q 350 290 320 250 Q 300 210 330 170" fill="none" stroke="#B2BEC3" stroke-width="4" stroke-linecap="round"/>
    `, 600, 700, '#FFF9F4'),
    aspectRatio: 1.16,
    tags: ['Daily Life', 'Cute'],
    userId: 'user-tetsu',
    userName: 'Tetsu Tanaka',
    userAvatarBg: '#059669',
    userAvatarLetter: 'T',
    likes: 210,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 30,
    description: 'Late night comfort food doodle. Best broth in Shibuya!'
  },
  {
    id: 'post-8',
    title: 'Geometric Bauhaus Wave',
    src: createSvgDoodle(`
      <!-- Abstract Bauhaus Grid -->
      <circle cx="200" cy="300" r="100" fill="#E74C3C"/>
      <path d="M 300 200 L 500 200 L 400 400 Z" fill="#3498DB"/>
      <rect x="150" y="450" width="300" height="180" rx="30" fill="#F1C40F" stroke="#111111" stroke-width="6"/>
      <!-- Striped overlay -->
      <line x1="150" y1="510" x2="450" y2="510" stroke="#111111" stroke-width="5"/>
      <line x1="150" y1="570" x2="450" y2="570" stroke="#111111" stroke-width="5"/>
      <!-- Thick arcs -->
      <path d="M 100 650 Q 300 500 500 650" fill="none" stroke="#2C3E50" stroke-width="14" stroke-linecap="round"/>
      <circle cx="300" cy="575" r="25" fill="#111111"/>
    `, 600, 850, '#F5F5F0'),
    aspectRatio: 1.41,
    tags: ['Abstract', 'Minimalist'],
    userId: 'user-sam',
    userName: 'Sam K.',
    userAvatarBg: '#2563EB',
    userAvatarLetter: 'S',
    likes: 78,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 40,
    description: 'Exploring primary palette tensions in geometric balance.'
  }
];
