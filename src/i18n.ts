export const message = {
    wrong_value_format: '格式错误',
    minute_value_overflow: '分钟可选值超出范围（需要0-59）',
    hour_value_overflow: '小时可选值超出范围（需要0-23）',
    day_value_overflow: '日期可选值超出范围（需要1-31）',
    month_value_overflow: '月份可选值超出范围（需要1-12）',
    week_value_overflow: '星期可选值超出范围（需要0-6）',

    minute: '分',
    hour: '时',
    day: '日',
    month: '月',
    week: '周',
    step: '每隔',

    minute_every: (n: number) => `每隔${n}分钟`,
    hour_every: (n: number) => `每隔${n}小时`,
    day_every: (n: number) => `每隔${n}天`,
    month_every: (n: number) => `每隔${n}月`,
    week_every: (n: number) => `每隔${n}周`,

    minute_pre: '每小时',
    hour_pre: '每天',
    day_pre: '每月',

    minute_each: '每分钟',
    hour_each: '每小时',
    day_each: '每天',
    month_each: '每月',
    week_each: '每周',

    month_show: (n: number) => `${n}月`,
    week_show: (n: number) => `周${'日一二三四五六'[n]}`,

    submit: '提交'
}
export const setMessage = function (msg: Partial<typeof message>) {
    Object.assign(message, msg)
}
