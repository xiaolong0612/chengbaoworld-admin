import { request } from '@/utils'

export default {
  fetchData: (params = {}) => request.get('/busi/CastleUser/list', { params }),
  read: (params = {}) => request.get('/user', { params }),
  update: (data) => request.patch(`/user/${data.id}`, data),
  delete: (id) => request.delete(`/user/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),
}
