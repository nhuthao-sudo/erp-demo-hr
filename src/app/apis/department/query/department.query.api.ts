import { DepartmentType } from '~/app/types/department/response/department.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const departmentQueryApi = {
    getAllDepartment: async () => {
        const url = '/v1/hrm/Department'
        const response = (await http.get(url)) as ResponseMessageType<DepartmentType[]>
        return response.data
    },
    getDepartmentById: async (id: number) => {
        const url = `/v1/hrm/Department/${id}`
        const response = (await http.get(url)) as ResponseMessageType<DepartmentType>
        return response.data
    }
}