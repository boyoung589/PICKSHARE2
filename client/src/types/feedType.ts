export interface Userlist {
  id?: number;
  nickname?: string;
  userImage?: string;
  statusMessage?: string;
}

export interface UserInfoData {
  data: {
    data: {
      id: number;
      nickname: string;
      userImage: string;
      statusMessage: string;
    };
  };
}

export interface Feedlist {
  commentNum: number;
  contentImg: string;
  createdAt: string;
  date: string;
  heartNum: number;
  id: number;
  locked: boolean;
  nickname: string;
  title: string;
}

export type MainFeedListProps = {
  id?: number;
  contentImg?: string;
  userImage?: string;
  nickname?: string;
  date?: string;
  heartNum?: number;
  commentNum?: number;
  title?: string;
  isRender: boolean;
  personalFeed?: boolean;
};

export type modalProps = {
  follower: FollowerListType[];
  following: FollowingListType[];
  follow: boolean;
  setFollow: (follow: boolean) => boolean | void;
};

export interface FollowingListType {
  id?: number;
  //유저아이디
  userId?: string;
  //유저를 팔로우한 닉네임
  followingNickname?: string;
}

export type followingListProps = {
  id?: number;
  followingNickname?: string;
  follow?: boolean;
  setFollow: (follow: boolean) => boolean | void;
};

export interface FollowerListType {
  id?: number;
  user_id?: string;
  followerNickname?: string;
}

export type followerListProps = {
  id?: number;
  followerNickname?: string;
  follow: boolean;
  setFollow: (follow: boolean) => boolean | void;
};

export interface IOptions {
  root: null;
  rootMargin: string;
  threshold: number;
}
