export interface UserType {
  userTypeId: number;
  userTypeName: string;
}

export interface University {
  university_id: number;
  university_name: string;
  university_logo?: string;
}

export interface Faculty {
  faculty_id: number;
  faculty_name: string;
  university_id: number;
}

export interface Program {
  program_id: number;
  program_name: string;
  faculty_id: number;
  program_type?: number;
}
