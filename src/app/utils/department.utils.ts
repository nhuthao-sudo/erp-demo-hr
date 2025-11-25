// src/utils/department.utils.ts
export const departmentStorage = {
  getDepartments: (): DepartmentResponse[] => {
    const data = localStorage.getItem('departments');
    return data ? JSON.parse(data) : [];
  },

  saveDepartments: (departments: DepartmentResponse[]): void => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }
};