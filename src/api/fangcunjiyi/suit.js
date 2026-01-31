import request from '@/utils/request';

// 查询 suit 列表
export function listSuit(query) {
  return request({
    url: '/fangcunjiyi/suit/list',
    method: 'get',
    params: query,
  });
}

// 查询 suit 详细
export function getSuit(id) {
  return request({
    url: '/fangcunjiyi/suit/' + id,
    method: 'get',
  });
}

// 新增 suit
export function addSuit(data) {
  return request({
    url: '/fangcunjiyi/suit',
    method: 'post',
    data: data,
  });
}

// 修改 suit
export function updateSuit(data) {
  return request({
    url: '/fangcunjiyi/suit',
    method: 'put',
    data: data,
  });
}

// 删除 suit
export function delSuit(id) {
  return request({
    url: '/fangcunjiyi/suit/' + id,
    method: 'delete',
  });
}
