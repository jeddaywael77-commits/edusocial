export interface UserProfileParams {
  userId: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  school?: string;
  department?: string;
  avatar?: string;
  coverPhoto?: string;
}
