

import { request } from '@/utils'

export default {
  create: (data) => request.post('/busi/CastleAgent/add', data),
  read: (params = {}) => request.get('/busi/CastleAgent/list', { params }),
  getUserList:(params = {}) => request.post(`/busi/CastleUser/queryPage?pageNum=${params.pageNum}&pageSize=${params.pageSize}`, params),
  update: (data) => request.put(`/busi/CastleAgent`, data),
  updateStatus: (data) => request.put(`/system/user/changeStatus`, data),
  delete: (id) => request.delete(`/busi/CastleAgent/${id}`),

}
