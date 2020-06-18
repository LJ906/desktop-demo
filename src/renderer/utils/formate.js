// 格式化时间 yyyy-mm-dd hh:mm:ss
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let year = date.getFullYear()
  let mon = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
  let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
  let hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
  let min = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
  let s = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()

  // return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  return year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + s
}
