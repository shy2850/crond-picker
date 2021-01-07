export const message = {
    wrong_value_format: '格式错误',
    minute_value_overflow: '分钟可选值超出范围（需要0-59）',
    hour_value_overflow: '小时可选值超出范围（需要0-23）',
    day_value_overflow: '日期可选值超出范围（需要1-31）',
    month_value_overflow: '月份可选值超出范围（需要1-12）',
    week_value_overflow: '星期可选值超出范围（需要0-6）',
}
export const setMessage = function (msg: Partial<typeof message>) {
    Object.assign(message, msg)
}
