import { ReactNode, useMemo } from 'react';
import { useUser } from '../../state/user/authStore';
import { RelationId, UserBase } from '../../state/user/types';
import { Button } from '../ui';
import { useFollowMutation, useUnFollowMutation, useUserQuery } from './hooks';

type RenderButtonProps = {
  followUnfollowAction: () => void;
  isLoading: boolean;
  text: string;
};

export interface FollowButtonProps {
  user: Pick<UserBase, 'id'> & {
    whoms: {
      id: RelationId;
      who: { id: RelationId };
    }[];
  };
  renderButton?: (props: RenderButtonProps) => ReactNode;
}

export const FollowButton = ({ user, renderButton }: FollowButtonProps) => {
  const me = useUser();

  const { data } = useUserQuery(user.id);
  const follow = useFollowMutation();
  const unfollow = useUnFollowMutation();

  const myFollow = useMemo(
    () => (data?.whoms ?? user?.whoms ?? []).find(({ who }) => who.id === me.id),
    [me.id, data?.whoms, user?.whoms],
  );

  const followUserCallback = () => {
    if (myFollow) {
      unfollow.mutate({ userId: user.id, followId: myFollow.id });
    } else {
      follow.mutate({ userId: user.id });
    }
  };

  const followButtonText = myFollow ? 'Unfollow' : 'Follow';
  const isLoading = follow.status === 'pending';

  if (renderButton) {
    return renderButton({
      followUnfollowAction: followUserCallback,
      isLoading,
      text: followButtonText,
    });
  }

  return (
    <Button
      loading={isLoading}
      onPress={followUserCallback}
      className="mt-[10px] min-w-[120px]"
      size="md"
    >
      {followButtonText}
    </Button>
  );
};
