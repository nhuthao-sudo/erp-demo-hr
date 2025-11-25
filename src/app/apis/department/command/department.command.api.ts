import http from '~/app/utils/http.util'
import { CreateDepartmentRequestType, UpdateDepartmentRequestType } from '~/app/types/department/request/department.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const departmentCommandApi = {
    createDepartment: async (body: CreateDepartmentRequestType) => {
        const url = '/v1/hrm/Department'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateDepartment: async (id: number, body: UpdateDepartmentRequestType) => {
        const url = `/v1/hrm/Department/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteDepartment: async (id: number) => {
        const url = `/v1/hrm/Department/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}