import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { User, Post } from '../types';

export interface VerifiedBadgeProps {
  is_verified?: boolean;
  is_owner?: boolean;
  isVerified?: boolean;
  isOwner?: boolean;
  verified?: boolean;
  owner?: boolean;
  user?: User | Post | { is_verified?: boolean; is_owner?: boolean; isVerified?: boolean; isOwner?: boolean; verified?: boolean; owner?: boolean; id?: string } | null;
  className?: string;
  showOwnerBadge?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  is_verified,
  is_owner,
  isVerified,
  isOwner,
  verified: explicitVerified,
  owner: explicitOwner,
  user = null,
  className = '',
  showOwnerBadge = true,
}) => {
  const isUserOwner = Boolean(
    explicitOwner ??
    is_owner ??
    isOwner ??
    user?.is_owner ??
    user?.isOwner ??
    (user as any)?.owner
  );

  const isUserVerified = Boolean(
    explicitVerified ??
    is_verified ??
    isVerified ??
    user?.is_verified ??
    user?.isVerified ??
    (user as any)?.verified ??
    isUserOwner
  );

  if (!isUserVerified && !isUserOwner) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center align-middle shrink-0 gap-1 select-none ${className}`}
    >
      {isUserVerified && (
        <BadgeCheck
          className="w-4 h-4 fill-[#1D9BF0] text-white inline shrink-0 drop-shadow-[0_1px_2px_rgba(29,155,240,0.4)]"
          aria-label={isUserOwner ? "Verified Owner" : "Verified Creator"}
          title={isUserOwner ? "Verified Owner" : "Verified Creator"}
        />
      )}
      {isUserOwner && showOwnerBadge && (
        <span
          className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 shadow-sm border border-amber-300/60 inline-flex items-center gap-0.5"
          title="DoodleBoard Founder & Owner"
        >
          👑 OWNER
        </span>
      )}
    </span>
  );
};

export default VerifiedBadge;
