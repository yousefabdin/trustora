import { User } from '@prisma/client';

export interface UserResponse {
  id: string;
  email: string;
  roles: string[];
}

export function toUserResponse(user: Pick<User, 'id' | 'email' | 'roles' | 'isAdmin'>): UserResponse {
  return {
    id: user.id,
    email: user.email,
    roles: user.isAdmin ? [...user.roles, 'admin'] : [...user.roles],
  };
}
