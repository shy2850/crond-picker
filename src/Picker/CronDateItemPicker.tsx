import { CronDateItem, Range, CronDateValueRangeMap } from '../CronDate'
import * as React from 'react'
import * as i18n from '../i18n'
import { Button, Col, Dropdown, Input, Row, Tag, Tooltip } from 'antd'
import { RedoOutlined } from '@ant-design/icons'

export interface CronDateItemPickerProps {
    item: CronDateItem
    onChange?: (item: CronDateItem) => void
}

let beginValue = -1

export default (props: CronDateItemPickerProps) => {
    const { item, onChange } = props
    const selected = new Set<number>()
    item.values && item.values.forEach(v => {
        if (typeof v === 'number') {
            selected.add(v)
        } else {
            for (let i = v.min; i <= v.max; i++) {
                selected.add(i)
            }
        }
    })

    const value_range = CronDateValueRangeMap.get(item.type)
    const values: { title: string, value: number }[] = []
    for (let i = value_range.min; i <= value_range.max; i++) {
        switch (item.type) {
            case 'month':
                values.push({ value: i, title: i18n.message.month_show(i) })
                break;
            case 'week':
                values.push({ value: i, title: i18n.message.week_show(i) })
                break;
            default:
                values.push({ value: i, title: i + '' })
        }
    }

    const onChecked = (value: number) => {
        return (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            const has = selected.has(value)
            selected[has ? 'delete' : 'add'](value)

            if (e.shiftKey) {
                if (beginValue != -1) {
                    let [min, max] = beginValue > value ? [value, beginValue] : [beginValue, value]
                    for (let i = min; i <= max; i++) {
                        selected[has ? 'delete' : 'add'](i)
                    }
                    beginValue = -1
                } else {
                    beginValue = value
                }
            } else {
                beginValue = -1
            }

            const arr = [...selected].sort((a, b) => a - b)
            let values = []
            let temp: CronDateItem['values'] = []
            for (let i = 0; i < arr.length; i++) {
                if (temp[temp.length - 1] === arr[i] - 1) {
                    temp.push(arr[i])
                } else {
                    if (temp.length === 1) {
                        values.push(temp[0])
                    } else if (temp.length > 1) {
                        values.push(new Range(`${temp[0]}-${temp[temp.length - 1]}`))
                    }
                    temp = [arr[i]]
                }
            }
            if (temp.length === 1) {
                values.push(temp[0])
            } else if (temp.length > 1) {
                values.push(new Range(`${temp[0]}-${temp[temp.length - 1]}`))
            }

            if (values.length === 0) {
                values = null
            }
            onChange && onChange({ ...item, values })
        }
    }
    return <Row gutter={[6, 6]} style={{ textAlign: 'center', userSelect: 'none' }}>
        <Col span={2}>
            <Button type="text" style={{ fontWeight: 'bold' }}>{i18n.message[item.type]}</Button>
        </Col>
        <Col span={11}>
            <Dropdown
                overlayStyle={{
                    padding: '12px 4px 12px 12px',
                    width: 280,
                    boxShadow: '0 0 10px #d2d2d2',
                    background: '#fff',
                }}
                overlay={<>
                    {values.map(({ title, value }) => <Tag.CheckableTag key={value}
                        checked={selected.has(value)} onClick={onChecked(value)}>{title}</Tag.CheckableTag>)}
                </>}
            >
                <Button style={{ width: '100%' }}>{item.values && item.values.map(v => v.toString()).join(',') || '*'}</Button>
            </Dropdown>
        </Col>
        <Col span={8}>
            <Input type="number" addonBefore={i18n.message.step} addonAfter={i18n.message[item.type]} onChange={e => onChange && onChange({ ...item, step: Number(e.target.value) })} />
        </Col>
        <Col span={3}>
            <Tooltip title="重置">
                <Button type="text" disabled={item.toString() === '*'} onClick={e => onChange && onChange({ type: item.type })}>
                    <RedoOutlined />
                </Button>
            </Tooltip>
        </Col>
    </Row>
}