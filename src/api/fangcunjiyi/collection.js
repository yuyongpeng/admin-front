import request from '@/utils/request';

// 查询 collection 列表
export function listCollection(query) {
  return request({
    url: '/fangcunjiyi/collection/list',
    method: 'get',
    params: query,
  });
}

// 查询 collection 详细
export function getCollection(collectionId) {
  return request({
    url: '/fangcunjiyi/collection/' + collectionId,
    method: 'get',
  });
}

// 新增 collection
export function addCollection(data) {
  return request({
    url: '/fangcunjiyi/collection',
    method: 'post',
    data: data,
  });
}

// 修改 collection
export function updateCollection(data) {
  return request({
    url: '/fangcunjiyi/collection',
    method: 'put',
    data: data,
  });
}

// 删除 collection
export function delCollection(collectionId) {
  return request({
    url: '/fangcunjiyi/collection/' + collectionId,
    method: 'delete',
  });
}

// 查询藏品按照 天 统计的数量
export function queryCollectionDayCount() {
  return request({
    url: '/fangcunjiyi/collection/daycount/1',
    method: 'get',
  });
}

// 查询藏品按照 天 统计的数量
export function queryCollectionTicketDayCount(ticketId) {
  return request({
    url: '/fangcunjiyi/collection/daycountticket/' + String(ticketId),
    method: 'get',
  });
}