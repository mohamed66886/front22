// Minimal placeholder for usersApi and User type
export type User = {
  id: string;
  name: string;
};

export const usersApi = {
  getAll: async (): Promise<User[]> => [],
  create: async (user: User): Promise<User> => user,
  update: async (user: User): Promise<User> => user,
  delete: async (id: string): Promise<void> => {},
};
