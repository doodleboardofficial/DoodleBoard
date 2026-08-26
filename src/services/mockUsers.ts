import { User, Post } from '../types';

// Helper to create clean vector Ghibli-aesthetic avatar SVG data URLs
const createGhibliAvatarSvg = (svgContent: string, bg = '#E0F2FE'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#FFFFFF"/>
      </linearGradient>
      <clipPath id="avatarClip">
        <circle cx="100" cy="100" r="96"/>
      </clipPath>
    </defs>
    <circle cx="100" cy="100" r="98" fill="url(#skyGrad)"/>
    <g clip-path="url(#avatarClip)">
      ${svgContent}
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// 1. Pranjali Prasad - Ghibli Studio Heroine Avatar (Brown hair, emerald leaf ribbon, spirited anime eyes)
export const PRANJALI_GHIBLI_AVATAR = createGhibliAvatarSvg(`
  <!-- Cloud in background -->
  <path d="M 30 70 Q 50 45 80 60 Q 110 40 140 65 Q 170 50 180 80 Q 185 100 160 105 L 40 105 Z" fill="#FFFFFF" opacity="0.6"/>
  <!-- Sparkles -->
  <circle cx="160" cy="40" r="3" fill="#F59E0B"/>
  <circle cx="40" cy="45" r="2.5" fill="#3B82F6"/>
  
  <!-- Shoulders / Cozy Cardigan -->
  <path d="M 40 200 Q 100 150 160 200 Z" fill="#10B981"/>
  <path d="M 65 160 L 100 190 L 135 160" stroke="#047857" stroke-width="4" fill="none"/>
  
  <!-- Neck -->
  <rect x="88" y="125" width="24" height="30" rx="8" fill="#FCE7D6"/>
  
  <!-- Back Hair (Long flow) -->
  <path d="M 45 80 C 35 150 50 190 70 200 L 130 200 C 150 190 165 150 155 80 Z" fill="#4A2810"/>
  
  <!-- Face Shape -->
  <path d="M 65 80 Q 60 135 100 142 Q 140 135 135 80 Q 100 65 65 80 Z" fill="#FDEDE2"/>
  
  <!-- Blushes (Ghibli soft rose) -->
  <ellipse cx="76" cy="112" rx="10" ry="5" fill="#FCA5A5" opacity="0.7"/>
  <ellipse cx="124" cy="112" rx="10" ry="5" fill="#FCA5A5" opacity="0.7"/>
  
  <!-- Ghibli Anime Eyes -->
  <!-- Left Eye -->
  <ellipse cx="80" cy="98" rx="8" ry="10" fill="#2E180B"/>
  <circle cx="78" cy="95" r="3.5" fill="#FFFFFF"/>
  <circle cx="82" cy="101" r="1.5" fill="#FFFFFF"/>
  <path d="M 70 87 Q 80 84 90 88" stroke="#2E180B" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- Right Eye -->
  <ellipse cx="120" cy="98" rx="8" ry="10" fill="#2E180B"/>
  <circle cx="118" cy="95" r="3.5" fill="#FFFFFF"/>
  <circle cx="122" cy="101" r="1.5" fill="#FFFFFF"/>
  <path d="M 110 88 Q 120 84 130 87" stroke="#2E180B" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- Nose & Smile -->
  <circle cx="100" cy="110" r="1.5" fill="#C27A58"/>
  <path d="M 94 122 Q 100 128 106 122" stroke="#B91C1C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  
  <!-- Front Bangs & Leaf Ribbon -->
  <path d="M 50 65 Q 100 40 150 65 Q 145 95 130 85 Q 100 70 70 85 Q 55 95 50 65 Z" fill="#5D3315"/>
  <path d="M 85 60 Q 100 90 102 70" stroke="#5D3315" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Emerald Leaf Hairpin -->
  <path d="M 132 58 Q 150 48 145 68 Q 132 68 132 58 Z" fill="#059669"/>
  <path d="M 142 52 Q 158 58 148 72 Z" fill="#34D399"/>
`, '#E0F2FE');

// 2. Elena Rostova - Parisian/Ghibli Art Student (Beret, bob hair, warm sunset)
export const ELENA_GHIBLI_AVATAR = createGhibliAvatarSvg(`
  <path d="M 30 190 Q 100 155 170 190 Z" fill="#BE185D"/>
  <rect x="88" y="125" width="24" height="28" fill="#FDEDE2"/>
  <!-- Bob Hair Cut -->
  <path d="M 55 80 Q 45 130 65 150 L 135 150 Q 155 130 145 80 Z" fill="#1F2937"/>
  <!-- Face -->
  <path d="M 68 85 Q 65 135 100 140 Q 135 135 132 85 Z" fill="#FEF2F2"/>
  <!-- Beret -->
  <ellipse cx="100" cy="62" rx="48" ry="22" transform="rotate(-10 100 62)" fill="#991B1B"/>
  <circle cx="92" cy="40" r="4" fill="#991B1B"/>
  <!-- Eyes -->
  <ellipse cx="82" cy="100" rx="7" ry="8" fill="#1E293B"/>
  <circle cx="80" cy="98" r="3" fill="#FFFFFF"/>
  <ellipse cx="118" cy="100" rx="7" ry="8" fill="#1E293B"/>
  <circle cx="116" cy="98" r="3" fill="#FFFFFF"/>
  <ellipse cx="78" cy="114" rx="8" ry="4" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="122" cy="114" rx="8" ry="4" fill="#FDA4AF" opacity="0.6"/>
  <path d="M 95 124 Q 100 128 105 124" stroke="#BE123C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
`, '#FDF2F8');

// 3. Tetsu Tanaka - Ghibli Botanical Gardener & Foodie (Dark mop hair, apron, mint green)
export const TETSU_GHIBLI_AVATAR = createGhibliAvatarSvg(`
  <path d="M 35 195 Q 100 150 165 195 Z" fill="#047857"/>
  <rect x="88" y="126" width="24" height="28" fill="#FCE7D6"/>
  <!-- Boyish messy hair -->
  <path d="M 50 90 Q 40 50 100 45 Q 160 50 150 90 Q 140 130 135 140 Q 100 155 65 140 Z" fill="#18181B"/>
  <path d="M 68 85 Q 65 135 100 140 Q 135 135 132 85 Z" fill="#FCE7D6"/>
  <!-- Cheerful anime eyes -->
  <path d="M 75 98 Q 83 90 91 98" stroke="#18181B" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M 109 98 Q 117 90 125 98" stroke="#18181B" stroke-width="4" stroke-linecap="round" fill="none"/>
  <ellipse cx="77" cy="108" rx="8" ry="4" fill="#FCA5A5" opacity="0.6"/>
  <ellipse cx="123" cy="108" rx="8" ry="4" fill="#FCA5A5" opacity="0.6"/>
  <path d="M 94 118 Q 100 126 106 118" stroke="#991B1B" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Sprout on head -->
  <path d="M 100 48 Q 115 35 125 45 Q 115 52 100 48 Z" fill="#22C55E"/>
`, '#ECFDF5');

// 4. Maya Lin - Cozy Storybook Creator & Cat Friend (Oversized sweater, twin braids)
export const MAYA_GHIBLI_AVATAR = createGhibliAvatarSvg(`
  <path d="M 30 190 Q 100 145 170 190 Z" fill="#D97706"/>
  <rect x="88" y="125" width="24" height="28" fill="#FEF3C7"/>
  <!-- Braids -->
  <path d="M 40 100 Q 30 160 45 200" stroke="#78350F" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M 160 100 Q 170 160 155 200" stroke="#78350F" stroke-width="12" stroke-linecap="round" fill="none"/>
  <!-- Face & Bangs -->
  <path d="M 68 85 Q 65 135 100 140 Q 135 135 132 85 Z" fill="#FFFBEB"/>
  <path d="M 52 75 Q 100 45 148 75 Q 140 95 120 85 Q 100 95 80 85 Q 60 95 52 75 Z" fill="#78350F"/>
  <!-- Big Warm Ghibli Eyes -->
  <ellipse cx="80" cy="100" rx="8" ry="9" fill="#451A03"/>
  <circle cx="78" cy="97" r="3.5" fill="#FFFFFF"/>
  <ellipse cx="120" cy="100" rx="8" ry="9" fill="#451A03"/>
  <circle cx="118" cy="97" r="3.5" fill="#FFFFFF"/>
  <ellipse cx="76" cy="112" rx="9" ry="5" fill="#FCA5A5" opacity="0.7"/>
  <ellipse cx="124" cy="112" rx="9" ry="5" fill="#FCA5A5" opacity="0.7"/>
  <path d="M 94 122 Q 100 128 106 122" stroke="#B45309" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Tiny Cat Ear Pin -->
  <polygon points="135,55 148,42 148,60" fill="#F59E0B"/>
`, '#FFFBEB');

// 5. Sam K. - Cosmic Dreamer (Starry hair, twilight navy)
export const SAM_GHIBLI_AVATAR = createGhibliAvatarSvg(`
  <path d="M 35 195 Q 100 150 165 195 Z" fill="#1E3A8A"/>
  <rect x="88" y="125" width="24" height="28" fill="#F1F5F9"/>
  <!-- Cosmic Navy Hair -->
  <path d="M 48 85 Q 40 45 100 40 Q 160 45 152 85 Q 155 140 135 142 Q 100 150 65 142 Z" fill="#0F172A"/>
  <path d="M 68 85 Q 65 135 100 140 Q 135 135 132 85 Z" fill="#F8FAFC"/>
  <!-- Star clip -->
  <polygon points="65,60 68,68 76,68 70,73 72,81 65,76 58,81 60,73 54,68 62,68" fill="#FACC15"/>
  <!-- Dreamy anime eyes -->
  <ellipse cx="80" cy="100" rx="7.5" ry="9" fill="#1E293B"/>
  <circle cx="78" cy="97" r="3" fill="#38BDF8"/>
  <circle cx="82" cy="102" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="120" cy="100" rx="7.5" ry="9" fill="#1E293B"/>
  <circle cx="118" cy="97" r="3" fill="#38BDF8"/>
  <circle cx="122" cy="102" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="76" cy="112" rx="8" ry="4" fill="#93C5FD" opacity="0.6"/>
  <ellipse cx="124" cy="112" rx="8" ry="4" fill="#93C5FD" opacity="0.6"/>
  <path d="M 95 122 Q 100 126 105 122" stroke="#475569" stroke-width="2.5" stroke-linecap="round" fill="none"/>
`, '#EFF6FF');

// 6. Chloe Bennett - Vintage Analog Dreamer (Golden sunset light, camera strap)
export const CHLOE_GHIBLI_AVATAR = createGhibliAvatarSvg(`
  <path d="M 35 195 Q 100 150 165 195 Z" fill="#9F1239"/>
  <!-- Camera strap across chest -->
  <path d="M 45 160 L 155 200" stroke="#1C1917" stroke-width="7"/>
  <rect x="88" y="125" width="24" height="28" fill="#FFF1F2"/>
  <!-- Wavy Auburn Hair -->
  <path d="M 45 80 Q 40 145 60 170 Q 100 180 140 170 Q 160 145 155 80 Z" fill="#9A3412"/>
  <path d="M 68 85 Q 65 135 100 140 Q 135 135 132 85 Z" fill="#FFF1F2"/>
  <path d="M 50 70 Q 100 45 150 70 Q 140 95 125 80 Q 100 90 75 80 Q 60 95 50 70 Z" fill="#C2410C"/>
  <!-- Sparkling Hazel Eyes -->
  <ellipse cx="80" cy="100" rx="8" ry="9" fill="#451A03"/>
  <circle cx="78" cy="97" r="3.5" fill="#FDE047"/>
  <circle cx="82" cy="102" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="120" cy="100" rx="8" ry="9" fill="#451A03"/>
  <circle cx="118" cy="97" r="3.5" fill="#FDE047"/>
  <circle cx="122" cy="102" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="76" cy="112" rx="9" ry="5" fill="#FDA4AF" opacity="0.7"/>
  <ellipse cx="124" cy="112" rx="9" ry="5" fill="#FDA4AF" opacity="0.7"/>
  <path d="M 94 122 Q 100 128 106 122" stroke="#9F1239" stroke-width="2.5" stroke-linecap="round" fill="none"/>
`, '#FFF1F2');

export interface MockUserStoryHighlight {
  id: string;
  title: string;
  coverEmoji: string;
  bgColor: string;
}

export interface MockUserProfile extends User {
  highlights?: MockUserStoryHighlight[];
  joinedDate?: string;
  followersList?: string[];
  followingList?: string[];
}

export const MOCK_USERS: MockUserProfile[] = [
  {
    id: 'user-pranjali',
    name: 'Pranjali Prasad',
    username: 'pranjaliprasad',
    email: 'pranjaliprasad1@gmail.com',
    bio: `👑 Founder & Lead Creator @ DoodleBoard\n🌿 Studio Ghibli dreamer & visual storyteller\n✨ Building whimsical worlds one brushstroke at a time\n📍 Tokyo • San Francisco`,
    website: 'doodleboard.art/pranjaliprasad',
    location: 'Tokyo & San Francisco',
    category: 'Founder & Artist',
    avatarLetter: 'P',
    avatarColor: '#1D9BF0',
    avatarImage: PRANJALI_GHIBLI_AVATAR,
    followersCount: 14820,
    followingCount: 184,
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    isOwner: true,
    is_owner: true,
    isVerified: true,
    is_verified: true,
    joinedDate: 'Joined March 2024',
    highlights: [
      { id: 'h1', title: '🌿 Ghibli', coverEmoji: '✨', bgColor: 'bg-emerald-100 text-emerald-800' },
      { id: 'h2', title: '🎨 Sketches', coverEmoji: '🖌️', bgColor: 'bg-blue-100 text-blue-800' },
      { id: 'h3', title: '🏰 Castles', coverEmoji: '🏰', bgColor: 'bg-amber-100 text-amber-800' },
      { id: 'h4', title: '☕ Studio', coverEmoji: '☕', bgColor: 'bg-rose-100 text-rose-800' },
    ]
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    username: 'elena_sketches',
    bio: `🏛️ Architectural illustrator & espresso addict\n☕ Capturing quiet European street corners, arches & brutalist shadows\n✒️ Nib & sepia ink on textured cotton paper`,
    website: 'elenarostova.art',
    location: 'Prague, Czech Republic',
    category: 'Architectural Illustrator',
    avatarLetter: 'E',
    avatarColor: '#4F46E5',
    avatarImage: ELENA_GHIBLI_AVATAR,
    followersCount: 8940,
    followingCount: 312,
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    isVerified: true,
    is_verified: true,
    joinedDate: 'Joined June 2024',
    highlights: [
      { id: 'h1', title: '🏛️ Facades', coverEmoji: '🏛️', bgColor: 'bg-purple-100 text-purple-800' },
      { id: 'h2', title: '☕ Cafes', coverEmoji: '☕', bgColor: 'bg-amber-100 text-amber-800' },
      { id: 'h3', title: '📐 Geometry', coverEmoji: '📐', bgColor: 'bg-indigo-100 text-indigo-800' },
    ]
  },
  {
    id: 'user-tetsu',
    name: 'Tetsu Tanaka',
    username: 'tetsu_art',
    bio: `🌿 Tokyo-based botanical illustrator & foliage lover\n🍜 Late-night tonkotsu broth & quiet bamboo gardens\n🍵 Gouache, sumi ink & Japanese moss studies`,
    website: 'tetsutanaka.jp',
    location: 'Shibuya, Tokyo',
    category: 'Botanical Artist',
    avatarLetter: 'T',
    avatarColor: '#059669',
    avatarImage: TETSU_GHIBLI_AVATAR,
    followersCount: 12400,
    followingCount: 245,
    createdAt: Date.now() - 280 * 24 * 60 * 60 * 1000,
    isVerified: true,
    is_verified: true,
    joinedDate: 'Joined April 2024',
    highlights: [
      { id: 'h1', title: '🌿 Foliage', coverEmoji: '🌱', bgColor: 'bg-emerald-100 text-emerald-800' },
      { id: 'h2', title: '🍜 Food', coverEmoji: '🍜', bgColor: 'bg-orange-100 text-orange-800' },
      { id: 'h3', title: '🎋 Tokyo', coverEmoji: '⛩️', bgColor: 'bg-teal-100 text-teal-800' },
    ]
  },
  {
    id: 'user-maya',
    name: 'Maya Lin',
    username: 'maya_doodles',
    bio: `🐱 Children's storybook author & cozy comic maker\n🥞 Calico cat mom, watercolor washes & warm maple syrup\n✨ Making everyday moments feel like picture books`,
    website: 'mayalinbooks.com',
    location: 'Seattle, WA',
    category: 'Storybook Artist',
    avatarLetter: 'M',
    avatarColor: '#D97706',
    avatarImage: MAYA_GHIBLI_AVATAR,
    followersCount: 9760,
    followingCount: 420,
    createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
    isVerified: true,
    is_verified: true,
    joinedDate: 'Joined August 2024',
    highlights: [
      { id: 'h1', title: '🐱 Cats', coverEmoji: '🐾', bgColor: 'bg-amber-100 text-amber-800' },
      { id: 'h2', title: '🥞 Cozy', coverEmoji: '🥞', bgColor: 'bg-yellow-100 text-yellow-800' },
      { id: 'h3', title: '📚 Books', coverEmoji: '📖', bgColor: 'bg-rose-100 text-rose-800' },
    ]
  },
  {
    id: 'user-sam',
    name: 'Sam K.',
    username: 'sam_cosmic',
    bio: `🚀 Cosmic dreamer & minimalist character artist\n🪐 Stargazing, retro sci-fi aesthetics & floating void linework\n🌌 Exploring outer space from a desk in Berlin`,
    website: 'samkcosmic.design',
    location: 'Berlin, Germany',
    category: 'Visual & Sci-Fi Artist',
    avatarLetter: 'S',
    avatarColor: '#2563EB',
    avatarImage: SAM_GHIBLI_AVATAR,
    followersCount: 6850,
    followingCount: 190,
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    isVerified: true,
    is_verified: true,
    joinedDate: 'Joined September 2024',
    highlights: [
      { id: 'h1', title: '🚀 Space', coverEmoji: '🌌', bgColor: 'bg-blue-100 text-blue-800' },
      { id: 'h2', title: '🪐 Sci-Fi', coverEmoji: '🛸', bgColor: 'bg-slate-100 text-slate-800' },
      { id: 'h3', title: '🔶 Shapes', coverEmoji: '📐', bgColor: 'bg-cyan-100 text-cyan-800' },
    ]
  },
  {
    id: 'user-chloe',
    name: 'Chloe Bennett',
    username: 'chloe_analog',
    bio: `📷 Vintage camera collector & analog film illustrator\n🎞️ Loose strokes, warm grain & documenting fleeting street moments\n🌾 Coffee, 35mm rolls & retro mechanical souls`,
    website: 'chloeanalog.co',
    location: 'Melbourne, Australia',
    category: 'Analog Illustrator',
    avatarLetter: 'C',
    avatarColor: '#EC4899',
    avatarImage: CHLOE_GHIBLI_AVATAR,
    followersCount: 7320,
    followingCount: 215,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    isVerified: true,
    is_verified: true,
    joinedDate: 'Joined October 2024',
    highlights: [
      { id: 'h1', title: '📷 Film', coverEmoji: '🎞️', bgColor: 'bg-pink-100 text-pink-800' },
      { id: 'h2', title: '☕ Life', coverEmoji: '🛵', bgColor: 'bg-red-100 text-red-800' },
      { id: 'h3', title: '🌾 Grain', coverEmoji: '🌾', bgColor: 'bg-amber-100 text-amber-800' },
    ]
  }
];

// Look up user by username (case-insensitive)
export function getMockUserByUsername(rawUsername: string): MockUserProfile | null {
  if (!rawUsername) return null;
  const clean = rawUsername.replace(/^@/, '').toLowerCase().trim();
  
  // Direct match or alias match for pranjali
  const found = MOCK_USERS.find(
    (u) =>
      u.username.toLowerCase() === clean ||
      u.id.toLowerCase() === clean ||
      (clean.includes('pranjali') && u.username === 'pranjaliprasad')
  );
  return found || null;
}

// Look up user by userId
export function getMockUserById(userId: string): MockUserProfile | null {
  if (!userId) return null;
  const found = MOCK_USERS.find((u) => u.id === userId || u.username.toLowerCase() === userId.toLowerCase());
  return found || null;
}

// Universal lookup: finds in mock users, or checks current user, or matches by post creator
export function resolveUserProfile(
  usernameOrId: string,
  currentUser: User | null,
  posts: Post[]
): MockUserProfile | User {
  if (!usernameOrId) {
    return MOCK_USERS[0]; // fallback to Owner
  }

  const clean = usernameOrId.replace(/^@/, '').toLowerCase().trim();

  // 1. Search mock profiles
  const mock = getMockUserByUsername(clean) || getMockUserById(clean);
  if (mock) return mock;

  // 2. Check current logged in user
  if (
    currentUser &&
    (currentUser.id === clean ||
      currentUser.username?.toLowerCase() === clean ||
      currentUser.name.toLowerCase() === clean)
  ) {
    return {
      ...currentUser,
      avatarImage: currentUser.avatarImage || PRANJALI_GHIBLI_AVATAR,
      bio: currentUser.bio || '✨ DoodleBoard creator & visual artist',
      followersCount: currentUser.followersCount || 1240,
      followingCount: currentUser.followingCount || 86,
    };
  }

  // 3. Check posts to construct profile
  const matchingPost = posts.find(
    (p) =>
      p.userId.toLowerCase() === clean ||
      (p.userUsername && p.userUsername.toLowerCase() === clean) ||
      p.userName.toLowerCase() === clean
  );

  if (matchingPost) {
    return {
      id: matchingPost.userId,
      name: matchingPost.userName,
      username: matchingPost.userUsername || matchingPost.userName.toLowerCase().replace(/\s+/g, '_'),
      avatarColor: matchingPost.userAvatarBg || '#1D9BF0',
      avatarLetter: matchingPost.userAvatarLetter || matchingPost.userName.charAt(0),
      avatarImage: matchingPost.userAvatarImage || PRANJALI_GHIBLI_AVATAR,
      bio: `🎨 Artist & visual creator on DoodleBoard\n🌿 Sharing original sketches & creative experiments`,
      followersCount: 1500,
      followingCount: 120,
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      isVerified: Boolean(matchingPost.isVerified || matchingPost.is_verified),
      isOwner: Boolean(matchingPost.isOwner || matchingPost.is_owner),
    };
  }

  // Fallback to Owner Pranjali Prasad
  return MOCK_USERS[0];
}

// Helper to format follower numbers (e.g. 14820 -> "14.8k")
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 10000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toLocaleString();
}
