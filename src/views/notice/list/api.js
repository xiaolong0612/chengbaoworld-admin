import { request } from '@/utils'

export default {
  fetchData: (params = {}) => request.get('/busi/CastleUser/list', { params }),
  create: (data) => request.post('/busi/CastleUser', data),
  update: (data) => request.put(`/busi/CastleUser`, data),
  updateGem: ({ type, id, gemCount }) =>
    request.post(`/busi/CastleUser/GemBalance`, {
      type,
      gemCount,
      uid: id,
    }),
  updateFrozenGem: ({ type, id, gemCount }) =>
    request.post(`/busi/CastleUser/frozenGemBalance`, {
      type,
      gemCount,
      uid: id,
    }),
  delete: (id) => request.delete(`/user/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),
}
