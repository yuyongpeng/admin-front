import request from '@/utils/request';

// 查询 transfer 列表
export function listTransfer(query) {
  return request({
    url: '/fangcunjiyi/transfer/list',
    method: 'get',
    params: query,
  });
}

// 查询 transfer 详细
export function getTransfer(transferId) {
  return request({
    url: '/fangcunjiyi/transfer/' + transferId,
    method: 'get',
  });
}

// 新增 transfer
export function addTransfer(data) {
  return request({
    url: '/fangcunjiyi/transfer',
    method: 'post',
    data: data,
  });
}

// 修改 transfer
export function updateTransfer(data) {
  return request({
    url: '/fangcunjiyi/transfer',
    method: 'put',
    data: data,
  });
}

// 删除 transfer
export function delTransfer(transferId) {
  return request({
    url: '/fangcunjiyi/transfer/' + transferId,
    method: 'delete',
  });
}

// 查询藏品按照 天 统计的数量
export function queryTransferDayCount() {
  return request({
    url: '/fangcunjiyi/transfer/daycount/1',
    method: 'get',
  });
}

// 查询藏品按照 天 统计的数量
export function queryTransferTicketDayCount(ticketId) {
  return request({
    url: '/fangcunjiyi/transfer/daycountticket/' + String(ticketId),
    method: 'get',
  });
}