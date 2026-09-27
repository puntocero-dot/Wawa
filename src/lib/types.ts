export type CapsuleKind = "instant" | "moment" | "wisdom" | "secret";

export type UnlockCondition =
  | { type: "immediate" }
  | { type: "date"; unlockAt: string }
  | { type: "age"; age: number }
  | { type: "milestone"; label: string };

export type Capsule = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  kind: CapsuleKind;
  title: string;
  body: string;
  mediaUrl?: string | null;
  audioUrl?: string | null;
  tags: string[];
  unlock: UnlockCondition;
  createdAt: string;
  isUnlocked: boolean;
};

export type Profile = {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  childName?: string | null;
  childBirthday?: string | null;
};
