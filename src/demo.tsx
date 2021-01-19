import { message, Form, Input, Button } from 'antd'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CrondPicker, CrondPickerRef, parseCronDate } from '.'
import * as i18n from './i18n'

const Demo = () => {
    const [form] = Form.useForm<{ crondate: string }>()
    let refCrondPicker: CrondPickerRef
    const closeDropdown = () => refCrondPicker && refCrondPicker.dropdown.close()

    return <div style={{ width: 400, margin: '50px auto', padding: 50 }}>
        <p>
            <Button onClick={closeDropdown}>关闭弹框</Button>
        </p>
        <Form form={form} onFinish={() => form.validateFields().then(values => {
            message.info(<div style={{textAlign: 'left'}}>
                <pre>{JSON.stringify(values, null, 2)}</pre>
            </div>, 2)
        })}>
            <Form.Item name="crondate" initialValue="* * * * *" rules={[
                {
                    validator: async (rule, value) => {
                        return parseCronDate(value)
                    }
                }
            ]}>
                <CrondPicker with_info={false} onInit={(current) => refCrondPicker = current}/>
            </Form.Item>
            <Form.Item>
                <Input style={{ width: 'auto' }} type="submit" value={i18n.message.submit} />
            </Form.Item>
        </Form>
    </div>
}

ReactDOM.render(<Demo />, document.getElementById('app'))