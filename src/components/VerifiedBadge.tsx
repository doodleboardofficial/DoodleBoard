import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { User, Post } from '../types';

export interface VerifiedBadgeProps {
  is_verified?: boolean;
  is_owner?: boolean;
  isVerified?: boolean;
  isOwner?: boolean;
  user?: User | Post | { is_verified?: boolean; is_owner?: boolean; isVerified?: boolean; isOwner?: boolean; id?: string } | null;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  is_verified = false,
  is_owner = false,
  isVerified = false,
  isOwner = false,
  user = null,
  className = '',
}) => {
  const verified = Boolean(
    is_verified ||
    isVerified ||
    is_owner ||
    isOwner ||
    user?.is_verified ||
    user?.isVerified ||
    user?.is_owner ||
    user?.isOwner ||
    (user?.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff')
  );

  const owner = Boolean(
    is_owner ||
    isOwner ||
    user?.is_owner ||
    user?.isOwner
  );

  if (!verified && !owner) {
    return null;
  }

  const tooltip = owner ? 'Verified Owner' : 'Verified';

  return (
    <span
      className={`inline-flex items-center align-middle shrink-0 select-none ${className}`}
      title={tooltip}
    >
      {verified && (
        <BadgeCheck
          className="w-4 h-4 ml-1.5 fill-[#1D9BF0] text-white inline shrink-0"
          aria-label={tooltip}
        />
      )}
      {owner && (
        <span className="ml-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 tracking-wider">
          👑 OWNER
        </span>
      )}
    </span>
  );
};

export default VerifiedBadge;
