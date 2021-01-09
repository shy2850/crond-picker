import { parseCronDate, CronDate, CronDateItemType, CronDateItem } from '../CronDate'
import * as React from 'react'
import { Dropdown, Input, message } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { InputProps } from 'antd/lib/input'
import CronDateItemPicker from './CronDateItemPicker'

export interface CrondPickerProps extends Omit<InputProps, 'onChange'> {
    with_info?: boolean
    value?: string
    onCrondChange?: (crondate: CronDate) => void
    onChange?: (value?: string) => void
}

export const CrondPicker = (props: CrondPickerProps) => {
    const { value, with_info = true, onCrondChange, onChange, onBlur, ...rest } = props
    const [crondate, setCrondate] = React.useState<CronDate>(null)
    const refInput = React.useRef<Input>()
    const [active, setActive] = React.useState(false)

    React.useEffect(function () {
        if (value) {
            try {
                let crondate = parseCronDate(value)
                setCrondate(crondate)
                refInput.current && refInput.current.setValue(crondate.toString())
            } catch (e) {
                with_info && message.error(e.toString())
            }
        }
    }, [value])

    const _onChange = (value: string) => {
        onChange(value)
        try {
            let crondate = parseCronDate(value)
            setCrondate(crondate)
            onCrondChange && onCrondChange(crondate)
        } catch (e) {
            with_info && message.error(e.toString())
        }
    }
    const onChangeItem = (type: CronDateItemType) => (item: CronDateItem) => {
        crondate[type] = new CronDateItem(item)
        const value = crondate.toString()
        if (refInput.current) {
            refInput.current.setValue(value)
        }
        _onChange(value)
    }

    const dropdown = crondate && <Dropdown
        visible={active}
        overlayStyle={{
            padding: '12px 4px 12px 12px',
            width: 500,
            boxShadow: '0 0 10px #d2d2d2',
            background: '#fff',
        }}
        placement="bottomRight"
        overlay={<>
            <div style={{ padding: 4, textAlign: 'center' }}>{crondate.toLocaleString()}</div>
            <CronDateItemPicker item={crondate.minute} onChange={onChangeItem('minute')}/>
            <CronDateItemPicker item={crondate.hour} onChange={onChangeItem('hour')}/>
            <CronDateItemPicker item={crondate.day} onChange={onChangeItem('day')}/>
            <CronDateItemPicker item={crondate.month} onChange={onChangeItem('month')}/>
            <CronDateItemPicker item={crondate.week} onChange={onChangeItem('week')}/>
        </>}>
        {active
            ? <UpOutlined style={{ padding: 8 }} onClick={() => setActive(false)} />
            : <DownOutlined style={{ padding: 8 }} onClick={() => setActive(true)} />}
        
    </Dropdown>
    return <Input addonAfter={dropdown}
        {...rest}
        ref={refInput}
        onChange={(e) => {
            // onChange(e.target['value'])
        }}
        onBlur={(e) => {
            _onChange(e.target['value'])
            onBlur && onBlur(e)
        }}
    />
}
