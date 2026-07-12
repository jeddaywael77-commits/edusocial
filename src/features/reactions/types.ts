import type { ReactionType } from "@/shared/types/enums";

export type ToggleReactionTarget = "POST" | "COMMENT";

export interface ToggleReactionParams {
  targetType: ToggleReactionTarget;
  targetId: string;
  type?: ReactionType;
}

export interface ReactionState {
  hasReacted: boolean;
  reactionType: ReactionType | null;
  count: number;
}
