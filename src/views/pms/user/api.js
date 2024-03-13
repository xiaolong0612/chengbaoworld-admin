/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/system/user', data),
  read: (params = {}) => request.get('/system/user/list', { params }),
  update: (data) => request.put(`/system/user`, data),
  updateStatus: (data) => request.put(`/system/user/changeStatus`, data),
  delete: (id) => request.delete(`/system/user/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),

  getAllRoles: () => request.get('/system/user/'),
}
