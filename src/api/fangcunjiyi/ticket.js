import request from '@/utils/request';

// 查询 ticket 列表
export function listTicket(query) {
  return request({
    url: '/fangcunjiyi/ticket/list',
    method: 'get',
    params: query,
  });
}

// 查询 ticket 表的所有数据 用于 el-select 使用
export function listAllTickets(query) {
  return request({
    url: 'fangcunjiyi/ticket/list_select',
    method: 'get',
    params: query,
  });
}

// // 查询 ticket 表 ，只输出 id和name
// export function listTicket(query) {
//   return request({
//     url: 'fangcunjiyhi/ticket/listName',
//     params: query,
//   });
// }

// 查询 单条 ticket 详细
export function getTicket(ticketId) {
  return request({
    url: '/fangcunjiyi/ticket/' + ticketId,
    method: 'get',
  });
}

// 查询 多条 ticket 详细
export function getTickets(ticketIds) {
  return request({
    url: '/fangcunjiyi/ticket/getMulti/' + ticketIds,
    method: 'get',
  });
}

// // 新增 ticket
// export function addTicket(data) {
//   return request({
//     url: '/fangcunjiyi/ticket',
//     method: 'post',
//     data: data,
//   });
// }

// 新增 ticket
export function addTicket(data) {
  return request({
    url: '/fangcunjiyi/ticket/add4Golang',
    method: 'post',
    data: data,
  });
}

// 修改ticket的发售状态为 发售中
export function saleStatus(data) {
  return request({
    url: '/fangcunjiyi/ticket/saleStatus4Golang',
    method: 'post',
    data: data,
  });
}

// 修改 ticket
export function updateTicket(data) {
  return request({
    url: '/fangcunjiyi/ticket',
    method: 'put',
    data: data,
  });
}

// 删除 ticket
export function delTicket(ticketId) {
  return request({
    url: '/fangcunjiyi/ticket/' + ticketId,
    method: 'delete',
  });
}

