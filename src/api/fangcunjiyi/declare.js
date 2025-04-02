import request from '@/utils/request';

// 查询 declare 列表
export function listDeclare(query) {
  return request({
    url: '/fangcunjiyi/declare/list',
    method: 'get',
    params: query,
  });
}

// 查询部门详细
export function getDeclare(declareId) {
  return request({
    url: '/fangcunjiyi/declare/' + declareId,
    method: 'get',
  });
}

// 新增部门
export function addDeclare(data) {
  return request({
    url: '/fangcunjiyi/declare',
    method: 'post',
    data: data,
  });
}

// 修改部门
export function updateDeclare(data) {
  return request({
    url: '/fangcunjiyi/declare',
    method: 'put',
    data: data,
  });
}

// 删除部门
export function delDeclare(declareId) {
  return request({
    url: '/fangcunjiyi/declare/' + declareId,
    method: 'delete',
  });
}
