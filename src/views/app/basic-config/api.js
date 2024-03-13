import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/system/config/list'),
  update: (data) => request.post(`/user/${data.id}`, data),
}
