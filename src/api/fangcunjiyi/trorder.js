import request from '@/utils/request';

// 查询 tr_order 列表
export function listTransfer(query) {
  return request({
    url: '/fangcunjiyi/trorder/list',
    method: 'get',
    params: query,
  });
}

// 查询 trorder 详细
export function getTransfer(trorderId) {
  return request({
    url: '/fangcunjiyi/trorder/' + trorderId,
    method: 'get',
  });
}