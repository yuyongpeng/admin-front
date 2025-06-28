import request from '@/utils/request';

// 查询 user 列表
export function listUser(query) {
  return request({
    url: '/fangcunjiyi/user/list',
    method: 'get',
    params: query,
  });
}

// 查询 user 详细
export function getUser(userId) {
  return request({
    url: '/fangcunjiyi/user/' + userId,
    method: 'get',
  });
}

// 新增 user
export function addUser(data) {
  return request({
    url: '/fangcunjiyi/user',
    method: 'post',
    data: data,
  });
}

// 修改 user
export function updateUser(data) {
  return request({
    url: '/fangcunjiyi/user',
    method: 'put',
    data: data,
  });
}

// 删除 user
export function delUser(userId) {
  return request({
    url: '/fangcunjiyi/user/' + userId,
    method: 'delete',
  });
}
