import request from '@/utils/request';

// 查询 recommendImg 列表
export function listRecommendImg(query) {
  return request({
    url: '/fangcunjiyi/recommendimg/list',
    method: 'get',
    params: query,
  });
}

// 查询 recommendImg 详细
export function getRecommendImg(id) {
  return request({
    url: '/fangcunjiyi/recommendimg/' + id,
    method: 'get',
  });
}

// 新增 recommendImg
export function addRecommendImg(data) {
  return request({
    url: '/fangcunjiyi/recommendimg',
    method: 'post',
    data: data,
  });
}

// 修改 recommendImg
export function updateRecommendImg(data) {
  return request({
    url: '/fangcunjiyi/recommendimg',
    method: 'put',
    data: data,
  });
}

// 删除 recommendImg
export function delRecommendImg(id) {
  return request({
    url: '/fangcunjiyi/recommendimg/' + id,
    method: 'delete',
  });
}
