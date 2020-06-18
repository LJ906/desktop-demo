import service from '@/utils/request'
// import qs from 'qs'

/**
 * 中日合作报告
 */
// 进口报告列表 （核设备进口报告，反应堆非核材料进口报告）
export function importRList(params) {
  return service({
    url: '/a/report/reportImp/asyInitial',
    method: 'get',
    params
  })
}
// 进口报告-保存多条（核设备进口报告，反应堆非核材料进口报告）
export function importRSaveList(data) {
  return service({
    url: '/a/report/reportImp/asySaveList',
    method: 'post',
    data
  })
}

// 进口报告-保存单条（核设备进口报告，反应堆非核材料进口报告）
export function importRSave(data) {
  return service({
    url: '/a/report/reportImp/asySave',
    method: 'post',
    data
  })
}
// 进口报告-删除（核设备进口报告，反应堆非核材料进口报告
export function importRDelete(data) {
  return service({
    url: '/a/report/reportImp/asyDelete',
    method: 'post',
    data
  })
}

// 进口报告-导出（核设备进口报告，反应堆非核材料进口报告
export function importRImport(data, headers) {
  return service({
    url: '/a/report/reportImp/import',
    method: 'post',
    data,
    headers
  })
}

// 进口报告-导出（核设备进口报告，反应堆非核材料进口报告
export function importRExport(data) {
  return service({
    url: '/a/report/reportImp/export',
    method: 'post',
    data
  })
}

// 使用报告列表 (核设备使用情况报告 反应堆用非核材料使用情)
export function useRList(params) {
  return service({
    url: '/a/report/reportUsa/asyInitial',
    method: 'get',
    params
  })
}
// 使用报告列表-保存多条 (核设备使用情况报告 反应堆用非核材料使用情)
export function useRSaveList(data) {
  return service({
    url: '/a/report/reportUsa/asySaveList',
    method: 'post',
    data
  })
}
// 使用报告-保存单条 (核设备使用情况报告 反应堆用非核材料使用情)
export function useRSave(data) {
  return service({
    url: '/a/report/reportUsa/asySave',
    method: 'post',
    data
  })
}
// 使用报告-删除 (核设备使用情况报告 反应堆用非核材料使用情)
export function useRDelete(data) {
  return service({
    url: '/a/report/reportUsa/asyDelete',
    method: 'post',
    data
  })
}

// 使用报告-导入
export function usaRImport(data) {
  return service({
    url: '/a/report/reportUsa/import',
    method: 'post',
    data
  })
}
// 使用报告-导出
export function usaRExport(data) {
  return service({
    url: '/a/report/reportUsa/export',
    method: 'post',
    data
  })
}
/**
 * 中日报告 - 核材料流转及使用情况报告
 */
export function transRList(params) {
  return service({
    url: '/a/report/reNuMaterialCirculation/asyInitial',
    method: 'get',
    params
  })
}

export function transRSaveList(data) {
  return service({
    url: '/a/report/reNuMaterialCirculation/asySaveList',
    method: 'post',
    data
  })
}
export function transRSave(data) {
  return service({
    url: '/a/report/reNuMaterialCirculation/asySave',
    method: 'post',
    data
  })
}

export function transRDel(data) {
  return service({
    url: '/a/report/reNuMaterialCirculation/asyDelete',
    method: 'post',
    data
  })
}

export function transRImport(data) {
  return service({
    url: '/a/report/reNuMaterialCirculation/import',
    method: 'post',
    data
  })
}
export function transRExport(data) {
  return service({
    url: '/a/report/reNuMaterialCirculation/export',
    method: 'post',
    data
  })
}

// report/reNuMaterialCirculation/import
