import { request } from '@/utils'

export default {
  create: (data) => request.post('/busi/mine', data),
  read: (params = {}) => request.get('/busi/mine/list', { params }),
  update: (data) => request.patch(`/user/${data.id}`, data),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),
}
