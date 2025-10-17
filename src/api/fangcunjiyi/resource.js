import request from '@/utils/request';

// 查询 resource 列表
export function listResource(query) {
  return request({
    url: '/fangcunjiyi/resource/list',
    method: 'get',
    params: query,
  });
}

// 查询部门详细
export function getResource(resourceId) {
  return request({
    url: '/fangcunjiyi/resource/' + resourceId,
    method: 'get',
  });
}

// 新增部门
export function addResource(data) {
  return request({
    url: '/fangcunjiyi/resource',
    method: 'post',
    data: data,
  });
}

// 修改部门
export function updateResource(data) {
  return request({
    url: '/fangcunjiyi/resource',
    method: 'put',
    data: data,
  });
}

// 删除部门
export function delResource(resourceId) {
  return request({
    url: '/fangcunjiyi/resource/' + resourceId,
    method: 'delete',
  });
}

// 删除 苏结通证书
export function sjtHide(regCode) {
  return request({
    url: 'fangcunjiyi/resource/sjtHide/' + regCode,
    method: 'delete',
  });
}