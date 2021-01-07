import { message } from "./i18n"

export class Range {
    min: number
    max: number
    constructor (str: string) {
        const [min, max] = str.split('-').map(Number)
        this.min = min
        this.max = max
    }
}
export interface CronDateItem {
    range?: Range
    values?: number[]
    step: number
}
export class CronDateItem {
    constructor(item: CronDateItem) {
        this.range = item.range
        this.values = item.values
        this.step = item.step
    }
    toString () {
        const result = []
        if (this.range) {
            result.push(`${this.range.min}-${this.range.max}`)
        } else if (this.values) {
            result.push(this.values.join(','))
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
    constructor (
        minute: CronDateItem,
        hour: CronDateItem,
        day: CronDateItem,
        month: CronDateItem,
        week: CronDateItem,
    ) {
        this.minute = minute
        this.hour = hour
        this.day = day
        this.month = month
        this.week = week
    }
}
CronDate.prototype.toString = function () {
    return [
        this.minute,
        this.hour,
        this.day,
        this.month,
        this.week,
    ].map(t => t.toString()).join(' ')
}


const validCronDateItem = function (item: CronDateItem, min: number, max: number, error: string) {
    if (
        item.step > max || 
        item.range && (item.range.min < min || item.range.max > max) ||
        item.values && item.values.find(v => v < min || v > max)
    ) {
        throw new Error(error);
    }
}
export const parseCronDateItem = function (str: string, type: keyof CronDate) {
    if (!str) {
        throw new Error(message.wrong_value_format);
    }
    
    const [body, step] = str.split('/')
    let range: Range = null
    let values: number[] = null
    if ('*' === body) {
        return new CronDateItem({ step: Number(step) })
    } else if (/^\d+\-\d+$/.test(str)) {
        range = new Range(str)
    } else if (/^\d+(,\d+)*$/.test(str)) {
        values = str.split(',').map(Number)
    } else {
        throw new Error(message.wrong_value_format);
    }
    const item = new CronDateItem({ range, values, step: Number(step) })
    switch (type) {
        case 'minute': validCronDateItem(item, 0, 59, message.minute_value_overflow); break;
        case 'hour': validCronDateItem(item, 0, 23, message.hour_value_overflow); break;
        case 'day': validCronDateItem(item, 1, 31, message.day_value_overflow); break;
        case 'month': validCronDateItem(item, 1, 12, message.month_value_overflow); break;
        case 'week': validCronDateItem(item, 0, 6, message.week_value_overflow); break;
        default:
            break;
    }
    return item
}
export const parse = (crondStr: string) => {
    const [minute, hour, day, month, week] = crondStr.split(/\s+/)
    return new CronDate(
        parseCronDateItem(minute, 'minute'),
        parseCronDateItem(hour, 'hour'),
        parseCronDateItem(day, 'day'),
        parseCronDateItem(month, 'month'),
        parseCronDateItem(week, 'week'),
    )
}