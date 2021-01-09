import { message } from "./i18n"
export class Range {
    min: number
    max: number
    constructor (str: string) {
        const [min, max] = str.split('-').map(Number)
        this.min = min
        this.max = max
    }
    toString () {
        return `${this.min}-${this.max}`
    }
}
export type CronDateItemType = keyof CronDate
export const CronDateValueRangeMap = new Map<CronDateItemType, Range>([
    ['minute', new Range('0-59')],
    ['hour', new Range('0-23')],
    ['day', new Range('1-31')],
    ['month', new Range('1-12')],
    ['week', new Range('0-6')],
])
export interface CronDateItem {
    type?: CronDateItemType
    values?: (number|Range)[]
    step?: number
}
export class CronDateItem {
    constructor(item: CronDateItem) {
        this.type = item.type
        this.values = item.values
        this.step = item.step
    }
    toString () {
        const result = []
        if (this.values) {
            result.push(this.values.map(v => v.toString()).join(','))
        } else {
            result.push('*')
        }

        if (this.step) {
            result.push(this.step)
        }

        return result.join('/')
    }
}

export class CronDate {
    minute: CronDateItem
    hour: CronDateItem
    day: CronDateItem
    month: CronDateItem
    week: CronDateItem
    constructor({ minute, hour, day, month, week }: CronDate) {
        this.minute = minute
        this.hour = hour
        this.day = day
        this.month = month
        this.week = week
    }
}
CronDate.prototype.toString = function (this: CronDate) {
    return [
        this.minute,
        this.hour,
        this.day,
        this.month,
        this.week,
    ].map(t => t.toString()).join(' ')
}
CronDate.prototype.toLocaleString = function (this: CronDate) {
    const { month, week } = this
    const words: string[] = []
    if (month.toString() != '*') {
        if (month.values) {
            words.push(month.values.map(v => {
                if (typeof v === 'number') {
                    return message.month_show(v)
                } else {
                    return `${message.month_show(v.min)}-${message.month_show(v.max)}`
                }
            }).join(','))
        }
        if (month.step) {
            words.push(month.step === 1 ? message.month_each : message.month_every(month.step))
        }
    }

    if (week.toString() != '*') {
        if (week.step) {
            words.push(week.step === 1 ? message.week_each : message.week_every(week.step))
        }
        if (week.values) {
            words.push(week.values.map(v => {
                if (typeof v === 'number') {
                    return message.week_show(v)
                } else {
                    return `${message.week_show(v.min)}-${message.week_show(v.max)}`
                }
            }).join(','))
        }
    }

    const other = ['day', 'hour', 'minute'] as const
    other.map(key => {
        const item = this[key]
        if (item.toString() != '*') {
            if (item.values) {
                if (words.length === 0) {
                    words.push(message[`${key}_pre`])
                }
                words.push(item.values.map(v => {
                    if (typeof v === 'number') {
                        return v
                    } else {
                        return `${v.min}-${v.max}`
                    }
                }).join(',') + message[key])
            }
            if (item.step) {
                words.push(item.step === 1 ? message[`${key}_each`] : message[`${key}_every`](item.step))
            }
        }
    })
    if (words.length === 0) return message.minute_each
    return words.join(' ')
}

const validCronDateItem = function (item: CronDateItem, error: string) {
    const { min, max } = CronDateValueRangeMap.get(item.type)
    if (
        item.values && item.values.find(v => {
            if (typeof v === 'number') {
                return v < min || v > max
            } else {
                return v.min > v.max || v.min < min || v.max > max
            }
        })
    ) {
        throw new Error(error);
    }
}
export const parseCronDateItem = function (str = '*', type: CronDateItemType) {
    const [body, step] = str.split('/')
    let values: (number | Range)[] = null

    if ('*' === body) {
        return new CronDateItem({ type, step: Number(step) })
    } else if (/^(\d+|\d+\-\d+)(,(\d+|\d+\-\d+))*$/.test(body)) {
        values = body.split(',').map(v => {
            if (/^\d+$/.test(v)) {
                return Number(v)
            } else {
                return new Range(v)
            }
        })
    } else {
        throw new Error(message.wrong_value_format);
    }
    const item = new CronDateItem({ type, values, step: Number(step) })
    switch (type) {
        case 'minute': validCronDateItem(item, message.minute_value_overflow); break;
        case 'hour': validCronDateItem(item, message.hour_value_overflow); break;
        case 'day': validCronDateItem(item, message.day_value_overflow); break;
        case 'month': validCronDateItem(item, message.month_value_overflow); break;
        case 'week': validCronDateItem(item, message.week_value_overflow); break;
        default:
            break;
    }
    return item
}
export const parseCronDate = (crondStr: string) => {
    const [minute, hour, day, month, week] = crondStr.split(/\s+/)
    return new CronDate({
        minute: parseCronDateItem(minute, 'minute'),
        hour: parseCronDateItem(hour, 'hour'),
        day: parseCronDateItem(day, 'day'),
        month: parseCronDateItem(month, 'month'),
        week: parseCronDateItem(week, 'week'),
    })
}