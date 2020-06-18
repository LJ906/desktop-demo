import service from '@/utils/request.js'
// import qs from 'qs'

/** 系统管理菜单  */
// 机构用户
// 用户管理 - 获取用户列表
export const getUserList = (data) => {
  return service({
    url: '/a/sys/user/griddata',
    method: 'POST',
    data
  })
}
// 用户管理 - 保存
export const saveUser = (data) => {
  return service({
    url: '/a/sys/user/asySave',
    method: 'POST',
    data
  })
}

// 用户管理 - 删除
export const deleteUser = (data) => {
  return service({
    url: '/a/sys/user/asyDelete',
    method: 'POST',
    data
  })
}

// 用户管理 - 机构管理数据
export const getOfficeTreeData = (data) => {
  return service({
    url: '/a/sys/office/officeTreeData',
    method: 'POST',
    data
  })
}
// 用户管理 - 平衡区
export const getTreeGridMbaData = (data) => {
  return service({
    url: '/a/sys/user/treeGridMbaData',
    method: 'POST',
    data
  })
}

// 用户管理 - 导入
export const importUser = (data) => {
  return service({
    url: '/a/storage/importExcel/import',
    method: 'POST',
    data
  })
}

// 字典数据
export const getDictData = (data) => {
  return service({
    url: '/a/sys/dict',
    method: 'POST',
    data
  })
}

/** 人员管理 */
// 人员管理 - 人员列表
export const getPersonGridData = (data) => {
  return service({
    url: '/a/sys/sysPerson/griddata',
    method: 'POST',
    data
  })
}

// 人员管理 - 人员保存
export const savePerson = (data) => {
  return service({
    url: '/a/sys/sysPerson/asySave',
    method: 'POST',
    data
  })
}

// 人员管理 - 人员删除
export const deletePerson = (data) => {
  return service({
    url: '/a/sys/sysPerson/asyDelete',
    method: 'POST',
    data
  })
}

// 人员管理
export const checkedUserList = (data) => {
  return service({
    url: '/a/sys/sysPerson/checkedUserList',
    method: 'POST',
    data
  })
}

// 人员管理 - 用户角色
export const getOfficeUser = (data) => {
  return service({
    url: '/a/sys/role/initialUserRole',
    method: 'POST',
    data
  })
}

// 人员管理 - 关联人员保存
export const saveRelatePerson = (data) => {
  return service({
    url: '/a/sys/sysPerson/asySaveUserRole',
    method: 'POST',
    data
  })
}

/** 机构管理 */
// 机构管理 - 查询
export const officeTreeGridData = (data) => {
  return service({
    url: '/a/sys/office/treeGridData',
    method: 'POST',
    data
  })
}
// 机构管理 - 保存
export const saveOffice = (data) => {
  return service({
    url: '/a/sys/office/asySave',
    method: 'POST',
    data
  })
}
// 机构管理 - 删除
export const deleteOffice = (data) => {
  return service({
    url: '/a/sys/office/asyDelete',
    method: 'POST',
    data
  })
}

/** 人员密级管理 */
// 人员密级管理 - 查询
export const getUserSecretList = (data) => {
  return service({
    url: '/a/sys/sysUserSecret/griddata',
    method: 'POST',
    data
  })
}
// 人员密级管理 - 保存
export const saveUserSecret = (data) => {
  return service({
    url: '/a/sys/sysUserSecret/asySave',
    method: 'POST',
    data
  })
}

/** 角色管理 */
// 角色管理 - 查询
export const getRoleList = (data) => {
  return service({
    url: '/a/sys/role/initial',
    method: 'POST',
    data
  })
}
// 角色管理 - 删除
export const deleteRole = (data) => {
  return service({
    url: '/a/sys/role/asyDetele',
    method: 'POST',
    data
  })
}

// 角色管理 - 保存
export const saveRole = (data) => {
  return service({
    url: '/a/sys/role/asySaveUser',
    method: 'POST',
    data
  })
}

// 角色管理 - 查询
export const roleAsyQuery = (data) => {
  return service({
    url: '/a/sys/role/asyQuery',
    method: 'POST',
    data
  })
}

// 角色管理 - 编辑
export const editRole = (data) => {
  return service({
    url: '/a/sys/role/editRole',
    method: 'POST',
    data
  })
}

/** 角色授权 */
// 角色授权
export const roleAuth = (data) => {
  return service({
    url: '/a/sys/role/authData',
    method: 'POST',
    data
  })
}

// 角色授权 - 保存
export const roleAuthSave = (data) => {
  return service({
    url: '/a/sys/role/auth/save',
    method: 'POST',
    data
  })
}

/** 角色分配 */
// 角色分配 - 为角色分配用户
export const getUserListByRole = (data) => {
  return service({
    url: '/a/sys/role/checkedUserList',
    method: 'POST',
    data
  })
}
// 为角色分配用户
export const saveDistrUserRole = (data) => {
  return service({
    url: '/a/sys/role/asySaveUserRole',
    method: 'POST',
    data
  })
}

/** 功能管理 */

// 功能管理 - 获取menu树形结构
export const menuTreeGridData = (data) => {
  return service({
    url: '/a/sys/menu/treeGridData',
    method: 'POST',
    data
  })
}

// 功能管理 - 保存
export const saveMenu = (data) => {
  return service({
    url: '/a/sys/menu/asySave',
    method: 'POST',
    data
  })
}

// 功能管理 - 删除
export const deleteMenu = (data) => {
  return service({
    url: '/a/sys/menu/asyDelete',
    method: 'POST',
    data
  })
}

// 初始化
export const initialMenu = (data) => {
  return service({
    url: '/a/sys/menu/asyInitial',
    method: 'POST',
    data
  })
}

/** 管理员登陆日志 */
export const queryLoginLog = (data) => {
  return service({
    url: '/a/sys/sysLogLogin/managergriddata',
    method: 'POST',
    data
  })
}

/** 管理员操作日志 */
export const getUserOperationLog = (data) => {
  return service({
    url: '/a/sys/sysLogActionManager/griddata',
    method: 'POST',
    data
  })
}

/** 普通用户登陆日志 */
export const getManLoginLog = (data) => {
  return service({
    url: '/a/sys/sysLogLogin/griddata',
    method: 'POST',
    data
  })
}

/** 普通用户操作日志 */
export const getManOperationLog = (data) => {
  return service({
    url: '/a/sys/sysLogAction/griddata',
    method: 'POST',
    data
  })
}

/** 普通用户错误日志 */
export const getManOperErrorLog = (data) => {
  return service({
    url: '/a/sys/sysLogAction/errorGriddata',
    method: 'POST',
    data
  })
}

/** 报表XML导出 */
export const reportXmlExp = (data) => {
  return service({
    url: '/a/xmlData/xmlExp',
    method: 'POST',
    data
  })
}

/** 数据备份还原 */
// 数据备份还原
export const backupRestore = (data) => {
  return service({
    url: '/a/sys/dataBackup/restore',
    method: 'POST',
    data
  })
}

// 数据备份还原 - 删除tip
export const deleteBackupTips = (data) => {
  return service({
    url: '/a/sys/dataBackup/deleteDataBackupTips',
    method: 'POST',
    data
  })
}

// 数据备份还原 - 删除
export const deleteBackup = (data) => {
  return service({
    url: '/a/sys/dataBackup/deleteDataBackup',
    method: 'POST',
    data
  })
}
