import { request } from '@/utils'

export default {
  create: (data) => request.post('/busi/mine', data),
  read: (params = {}) => request.get('/busi/mine/list', { params }),
  update: (data) => request.put(`/busi/mine`, data),
  updateStatus: (data) => request.put(`/busi/mine/updateStatus`, data),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),
}
