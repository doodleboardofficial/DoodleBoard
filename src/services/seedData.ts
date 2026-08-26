import { Post } from '../types';
import {
  PRANJALI_GHIBLI_AVATAR,
  ELENA_GHIBLI_AVATAR,
  TETSU_GHIBLI_AVATAR,
  MAYA_GHIBLI_AVATAR,
  SAM_GHIBLI_AVATAR,
  CHLOE_GHIBLI_AVATAR
} from './mockUsers';

// Helper to create clean vector doodle SVG data URLs
const createSvgDoodle = (svgContent: string, width = 600, height = 800, bg = '#F9F9F8'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bg}"/>
    ${svgContent}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_POSTS: Post[] = [
  // 1. Pranjali Prasad (OWNER) - Signature Ghibli Post 1
  {
    id: 'post-pranjali-1',
    title: 'Spirited Forest Spirit & Soot Sprites',
    src: createSvgDoodle(`
      <!-- Ghibli Twilight Sky & Moon -->
      <circle cx="480" cy="180" r="70" fill="#FEF3C7" opacity="0.85"/>
      <circle cx="460" cy="160" r="10" fill="#FDE68A" opacity="0.5"/>
      
      <!-- Lush Forest Canopy Background -->
      <path d="M 0 500 Q 150 350 300 420 Q 450 320 600 450 L 600 800 L 0 800 Z" fill="#064E3B"/>
      <path d="M 0 560 Q 200 440 380 500 Q 500 420 600 520 L 600 800 L 0 800 Z" fill="#047857"/>
      
      <!-- Giant Cozy Forest Spirit (Totoro Shape) -->
      <ellipse cx="280" cy="540" rx="140" ry="170" fill="#64748B" stroke="#1E293B" stroke-width="6"/>
      <!-- Soft White Belly with Crescent Marks -->
      <ellipse cx="280" cy="570" rx="95" ry="120" fill="#F8FAFC"/>
      <path d="M 230 520 Q 245 505 260 520" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 270 510 Q 285 495 300 510" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 310 520 Q 325 505 340 520" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 245 560 Q 260 545 275 560" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 290 560 Q 305 545 320 560" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>
      
      <!-- Ears with leaf -->
      <ellipse cx="200" cy="380" rx="20" ry="50" transform="rotate(-15 200 380)" fill="#64748B" stroke="#1E293B" stroke-width="5"/>
      <ellipse cx="360" cy="380" rx="20" ry="50" transform="rotate(15 360 380)" fill="#64748B" stroke="#1E293B" stroke-width="5"/>
      <!-- Leaf Hat -->
      <path d="M 240 370 Q 280 320 330 360 Q 300 390 240 370 Z" fill="#10B981" stroke="#065F46" stroke-width="4"/>
      <path d="M 280 345 L 295 315" stroke="#065F46" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Round Ghibli Eyes & Whisker details -->
      <circle cx="230" cy="440" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="3"/>
      <circle cx="232" cy="440" r="6" fill="#0F172A"/>
      <circle cx="330" cy="440" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="3"/>
      <circle cx="328" cy="440" r="6" fill="#0F172A"/>
      <ellipse cx="280" cy="452" rx="8" ry="4" fill="#1E293B"/>
      <!-- Whiskers -->
      <line x1="160" y1="445" x2="205" y2="448" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="160" y1="460" x2="205" y2="458" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="355" y1="448" x2="400" y2="445" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="355" y1="458" x2="400" y2="460" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
      
      <!-- Tiny Soot Sprites (Susuwatari) -->
      <!-- Sprite 1 -->
      <circle cx="120" cy="690" r="24" fill="#0F172A"/>
      <circle cx="114" cy="686" r="6" fill="#FFFFFF"/>
      <circle cx="115" cy="686" r="2.5" fill="#0F172A"/>
      <circle cx="126" cy="686" r="6" fill="#FFFFFF"/>
      <circle cx="125" cy="686" r="2.5" fill="#0F172A"/>
      <!-- Star Candy held by sprite -->
      <polygon points="145,670 148,677 155,678 150,683 151,690 145,686 139,690 140,683 135,678 142,677" fill="#F43F5E"/>
      
      <!-- Sprite 2 -->
      <circle cx="460" cy="660" r="20" fill="#0F172A"/>
      <circle cx="455" cy="656" r="5" fill="#FFFFFF"/>
      <circle cx="455" cy="656" r="2" fill="#0F172A"/>
      <circle cx="465" cy="656" r="5" fill="#FFFFFF"/>
      <circle cx="465" cy="656" r="2" fill="#0F172A"/>
      <!-- Gold star candy -->
      <polygon points="435,640 437,645 443,646 439,650 440,656 435,653 430,656 431,650 427,646 433,645" fill="#FBBF24"/>
      
      <!-- Glowing Spores / Fireflies -->
      <circle cx="160" cy="520" r="4" fill="#34D399"/>
      <circle cx="420" cy="480" r="5" fill="#FDE047"/>
      <circle cx="370" cy="300" r="3" fill="#67E8F9"/>
      
      <!-- Grass Floor with cute mushrooms -->
      <path d="M 0 740 Q 300 710 600 740 L 600 800 L 0 800 Z" fill="#064E3B"/>
      <ellipse cx="90" cy="750" rx="16" ry="10" fill="#EF4444"/>
      <circle cx="85" cy="748" r="2" fill="#FFFFFF"/>
      <circle cx="94" cy="749" r="2.5" fill="#FFFFFF"/>
    `, 600, 800, '#0F172A'),
    aspectRatio: 1.33,
    tags: ['Characters', 'Botanical'],
    userId: 'user-pranjali',
    userName: 'Pranjali Prasad',
    userUsername: 'pranjaliprasad',
    userAvatarBg: '#1D9BF0',
    userAvatarLetter: 'P',
    userAvatarImage: PRANJALI_GHIBLI_AVATAR,
    isVerified: true,
    isOwner: true,
    is_verified: true,
    is_owner: true,
    likes: 384,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 1,
    description: 'A quiet twilight meeting under the ancient camphor tree. Studio Ghibli magic will always be my greatest inspiration ✨🌿'
  },
  // 2. Pranjali Prasad (OWNER) - Signature Ghibli Post 2
  {
    id: 'post-pranjali-2',
    title: "Howl's Moving Castle in the Clouds",
    src: createSvgDoodle(`
      <!-- Pastel Sunset Sky -->
      <path d="M 0 0 L 600 0 L 600 500 L 0 500 Z" fill="#FCE7F3"/>
      <!-- Soft Pink / Apricot Clouds -->
      <ellipse cx="140" cy="200" rx="120" ry="60" fill="#FED7AA" opacity="0.6"/>
      <ellipse cx="460" cy="160" rx="140" ry="70" fill="#FBCFE8" opacity="0.6"/>
      <ellipse cx="300" cy="240" rx="180" ry="80" fill="#FFFFFF" opacity="0.7"/>
      
      <!-- Distant Alpine Mountain Peaks -->
      <polygon points="60,480 200,280 340,480" fill="#93C5FD"/>
      <polygon points="180,310 200,280 220,310" fill="#FFFFFF"/>
      <polygon points="260,480 420,240 580,480" fill="#60A5FA"/>
      <polygon points="390,285 420,240 450,285" fill="#FFFFFF"/>
      
      <!-- Steampunk Magical Castle Silhouettes & Turrets -->
      <rect x="230" y="380" width="160" height="140" rx="18" fill="#334155" stroke="#0F172A" stroke-width="5"/>
      <polygon points="210,380 260,280 300,380" fill="#475569" stroke="#0F172A" stroke-width="4"/>
      <polygon points="310,380 360,250 400,380" fill="#64748B" stroke="#0F172A" stroke-width="4"/>
      
      <!-- Castle eyes / glowing portals -->
      <circle cx="270" cy="430" r="14" fill="#F59E0B" stroke="#0F172A" stroke-width="3"/>
      <circle cx="340" cy="420" r="12" fill="#F59E0B" stroke="#0F172A" stroke-width="3"/>
      <!-- Smoking Pipe Chimneys -->
      <rect x="370" y="310" width="18" height="70" fill="#1E293B"/>
      <path d="M 379 300 Q 360 250 390 200 Q 370 160 410 120" stroke="#94A3B8" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
      
      <!-- Mechanical Bird Legs -->
      <path d="M 250 520 L 220 640 L 190 680" stroke="#0F172A" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 360 520 L 390 640 L 420 680" stroke="#0F172A" stroke-width="10" stroke-linecap="round" fill="none"/>
      
      <!-- Wildflower Meadow Foreground -->
      <path d="M 0 660 Q 300 620 600 660 L 600 800 L 0 800 Z" fill="#15803D"/>
      <!-- Tiny colorful meadow flowers -->
      <circle cx="80" cy="720" r="4" fill="#F43F5E"/>
      <circle cx="160" cy="750" r="5" fill="#FBBF24"/>
      <circle cx="280" cy="710" r="4" fill="#60A5FA"/>
      <circle cx="460" cy="730" r="5" fill="#E879F9"/>
      <circle cx="520" cy="760" r="4" fill="#FBBF24"/>
    `, 600, 800, '#FFF1F2'),
    aspectRatio: 1.33,
    tags: ['Architecture', 'Characters'],
    userId: 'user-pranjali',
    userName: 'Pranjali Prasad',
    userUsername: 'pranjaliprasad',
    userAvatarBg: '#1D9BF0',
    userAvatarLetter: 'P',
    userAvatarImage: PRANJALI_GHIBLI_AVATAR,
    isVerified: true,
    isOwner: true,
    is_verified: true,
    is_owner: true,
    likes: 295,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 6,
    description: 'Whimsical mechanical gears wandering across the blooming alpine meadows. Dedicated to Diana Wynne Jones & Hayao Miyazaki 🏰✨'
  },
  // 3. Elena Rostova
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
    userUsername: 'elena_sketches',
    userAvatarBg: '#4F46E5',
    userAvatarLetter: 'E',
    userAvatarImage: ELENA_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 142,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 8,
    description: 'Quick morning line sketch while waiting for the pour-over to bloom.'
  },
  // 4. Tetsu Tanaka
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
    userUsername: 'tetsu_art',
    userAvatarBg: '#059669',
    userAvatarLetter: 'T',
    userAvatarImage: TETSU_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 189,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 12,
    description: 'Botanical foliage ink study on textured watercolor grain paper.'
  },
  // 5. Maya Lin
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
    userUsername: 'maya_doodles',
    userAvatarBg: '#D97706',
    userAvatarLetter: 'M',
    userAvatarImage: MAYA_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 254,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 14,
    description: 'Inspired by my roommate’s cat basking in the 3 PM sun patch.'
  },
  // 6. Sam K.
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
    userUsername: 'sam_cosmic',
    userAvatarBg: '#2563EB',
    userAvatarLetter: 'S',
    userAvatarImage: SAM_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 167,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 18,
    description: 'Drifting freely through thoughts. Digital ink on minimal canvas.'
  },
  // 7. Elena Rostova - Post 2
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
    userUsername: 'elena_sketches',
    userAvatarBg: '#4F46E5',
    userAvatarLetter: 'E',
    userAvatarImage: ELENA_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 182,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 22,
    description: 'Shadowplay and geometry inspired by Ricardo Bofill’s La Muralla Roja.'
  },
  // 8. Chloe Bennett
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
    userUsername: 'chloe_analog',
    userAvatarBg: '#EC4899',
    userAvatarLetter: 'C',
    userAvatarImage: CHLOE_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 195,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 28,
    description: 'Analog love. Practicing mechanical product silhouettes and warm leather tones.'
  },
  // 9. Tetsu Tanaka - Post 2
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
    userUsername: 'tetsu_art',
    userAvatarBg: '#059669',
    userAvatarLetter: 'T',
    userAvatarImage: TETSU_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 310,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 32,
    description: 'Late night comfort food doodle. Best broth in Shibuya!'
  },
  // 10. Sam K. - Post 2
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
    userUsername: 'sam_cosmic',
    userAvatarBg: '#2563EB',
    userAvatarLetter: 'S',
    userAvatarImage: SAM_GHIBLI_AVATAR,
    isVerified: true,
    is_verified: true,
    likes: 118,
    likedBy: [],
    timestamp: Date.now() - 3600000 * 40,
    description: 'Exploring primary palette tensions in geometric balance.'
  }
];
