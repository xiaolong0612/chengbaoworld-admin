import { request } from '@/utils'

export default {
  fetchData: (params = {}) => request.post(`/busi/CastleUser/queryPage?pageNum=${params.pageNum}&pageSize=${params.pageSize}`, params),
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
  editPsd: ({id, type,password}) => request.post(`/busi/CastleUser/editOrPayPassword`, type==='0'?{
    uid:id,
    type,
    password:password,
  }:{
    uid:id,
    type,
    payPassword:password,
  }),
}
