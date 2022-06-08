import request from '@/utils/request'

/**
 * 获取常用地址列表
 * @param params 查询参数
 */
export function commonAddressListAll(params) {
  return request({
    url: '/gcjcCommonAddress/listAll',
    method: 'GET',
    params
  })
}


/**
 * 分页 获取常用地址列表
 * @param params 查询参数
 */
export function commonAddressListPage(params) {
  return request({
    url: '/gcjcCommonAddress/listPage',
    method: 'GET',
    params
  })
}

/**
 * 添加/修改常用地址
 * @param data 添加信息
 */
export function addCommonAddress(data) {
  return request({
    url: '/gcjcCommonAddress/saveorupdate',
    method: 'post',
    data
  })
}


/**
 * 删除常用地址
 * @param data 删除参数
 */
export function deleteCommonAddress(data) {
  return request({
    url: '/gcjcCommonAddress/delAdress',
    method: 'post',
    data
  })
}


