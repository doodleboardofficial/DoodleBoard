import React, { useState } from 'react';
import { Heart, UserPlus, MessageCircle, Sparkles, Check } from 'lucide-react';
import { User } from '../types';

interface ActivityItem {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention';
  user: {
    id: string;
    username: string;
    avatar?: string;
    avatarBg?: string;
    avatarLetter?: string;
  };
  content?: string;
  timeAgo: string;
  postImage?: string;
  isFollowing?: boolean;
}

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'like',
    user: {
      id: 'artist-sarah',
      username: 'sarah_lines',
      avatarBg: '#e11d48',
      avatarLetter: 'S',
    },
    timeAgo: '15m',
    postImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'act-2',
    type: 'follow',
    user: {
      id: 'artist-leo',
      username: 'leo_draws',
      avatarBg: '#2563eb',
      avatarLetter: 'L',
    },
    timeAgo: '1h',
    isFollowing: false,
  },
  {
    id: 'act-3',
    type: 'comment',
    user: {
      id: 'artist-maya',
      username: 'maya_doodles',
      avatarBg: '#7c3aed',
      avatarLetter: 'M',
    },
    content: 'Love the ink hatching technique here! 🔥',
    timeAgo: '3h',
    postImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'act-4',
    type: 'like',
    user: {
      id: 'artist-kai',
      username: 'kai_sketches',
      avatarBg: '#059669',
      avatarLetter: 'K',
    },
    timeAgo: '5h',
    postImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'act-5',
    type: 'follow',
    user: {
      id: 'artist-elena',
      username: 'elena_art',
      avatarBg: '#d97706',
      avatarLetter: 'E',
    },
    timeAgo: '1d',
    isFollowing: true,
  },
  {
    id: 'act-6',
    type: 'like',
    user: {
      id: 'artist-sam',
      username: 'sam_ink',
      avatarBg: '#0891b2',
      avatarLetter: 'S',
    },
    timeAgo: '2d',
    postImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&auto=format&fit=crop&q=80',
  },
];

interface ActivityTabProps {
  currentUser: User | null;
  onViewUserProfile?: (username: string) => void;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({
  currentUser,
  onViewUserProfile,
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>(SAMPLE_ACTIVITIES);

  const toggleFollow = (id: string) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFollowing: !item.isFollowing } : item
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pb-20">
      <div className="max-w-[500px] mx-auto px-4 py-4 space-y-6">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <h2 className="text-lg font-bold text-white">Activity</h2>
          <span className="text-xs text-zinc-500 font-medium">All Notifications</span>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between gap-3 py-1.5"
            >
              {/* Avatar + Text */}
              <div
                onClick={() => onViewUserProfile && onViewUserProfile(act.user.username)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group select-none"
              >
                {/* User Avatar */}
                <div
                  className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0 border border-neutral-800"
                  style={{ backgroundColor: act.user.avatarBg || '#262626' }}
                >
                  {act.user.avatar ? (
                    <img src={act.user.avatar} alt={act.user.username} className="w-full h-full object-cover" />
                  ) : (
                    act.user.avatarLetter || act.user.username.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Text description */}
                <div className="text-xs leading-snug">
                  <span className="font-bold text-white group-hover:underline mr-1">
                    {act.user.username}
                  </span>
                  {act.type === 'like' && (
                    <span className="text-zinc-300">liked your doodle.</span>
                  )}
                  {act.type === 'follow' && (
                    <span className="text-zinc-300">started following you.</span>
                  )}
                  {act.type === 'comment' && (
                    <span className="text-zinc-300">
                      commented: <span className="text-zinc-400 font-normal">"{act.content}"</span>
                    </span>
                  )}
                  <span className="text-zinc-500 ml-1.5 text-[11px]">{act.timeAgo}</span>
                </div>
              </div>

              {/* Right side: Post thumbnail or Follow button */}
              {act.postImage && (
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-neutral-800 bg-neutral-900">
                  <img
                    src={act.postImage}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {act.type === 'follow' && (
                <button
                  type="button"
                  onClick={() => toggleFollow(act.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    act.isFollowing
                      ? 'bg-neutral-800 text-zinc-300 hover:bg-neutral-700'
                      : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                  }`}
                >
                  {act.isFollowing ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Following
                    </span>
                  ) : (
                    'Follow Back'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
