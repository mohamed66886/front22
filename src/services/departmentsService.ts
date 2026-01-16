// Minimal placeholder for departmentsApi and Department type
export type Department = {
  id: string;
  name: string;
};

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => [],
  create: async (department: Department): Promise<Department> => department,
  update: async (department: Department): Promise<Department> => department,
  delete: async (id: string): Promise<void> => {},
};
