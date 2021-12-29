import { Form, Input, Button, Switch, DatePicker, Select } from 'hzero-ui';
import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.product.uom.model.uom';
const FormItem = Form.Item;

/* eslint-disable */
@connect(({ flow }) => ({
  flow,
}))
@Form.create()
@formatterCollections({ code: 'tarzan.workshop.uom' })
export default class ProcessRouteDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  confirm = () => {
    const {
      form,
      flow: {
        tableList: [],
        tablePaginationFlow: {},
      },
    } = this.props;
    form.validateFields((err, values) => {
      //todo:
      if (!err) {
        console.log(values);
      }
    });
  };

  cancel = () => {};

  operationChange = () => {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const stepDecisionList = [];
    const uomCode = 'Y';
    const statusList = this.props.flow.statusList;
    return (
      <>
        <div className={styles.routeTitle}>工艺路线详细信息</div>
        <div className={styles.routeBody}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('站点分配')}
            >
              {getFieldDecorator('uomCode1', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('站点分配'),
                    }),
                  },
                ],
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {stepDecisionList.map(item => (
                    <Select.Option value={item.typeCode}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('类型')}
            >
              {getFieldDecorator('uomCode2', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('类型'),
                    }),
                  },
                ],
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {stepDecisionList.map(item => (
                    <Select.Option value={item.typeCode}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('编码')}
            >
              {getFieldDecorator('uomCode3', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('编码'),
                    }),
                  },
                ],
                initialValue: '',
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('版本')}
            >
              {getFieldDecorator('uomCode4', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('版本'),
                    }),
                  },
                ],
                initialValue: '',
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('当前版本')}
            >
              {getFieldDecorator('uomCode5', {
                initialValue: uomCode === 'Y',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('工艺路线描述')}
            >
              {getFieldDecorator('uomCode6', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('工艺路线描述'),
                    }),
                  },
                ],
                initialValue: '',
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('工艺路线状态')}
            >
              {getFieldDecorator('uomCode7', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('工艺路线状态'),
                    }),
                  },
                ],
                initialValue: '',
              })(
                <Select>
                  {statusList.map(ele => (
                    <Select.Option value={ele.statusCode}>{ele.description}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('生效时间')}
            >
              {getFieldDecorator('uomCode8', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('生效时间'),
                    }),
                  },
                ],
                initialValue: '',
              })(
                <DatePicker
                  disabled={false}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('失效时间')}
            >
              {getFieldDecorator('uomCode9', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('失效时间'),
                    }),
                  },
                ],
                initialValue: '',
              })(
                <DatePicker
                  disabled={false}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('EO下达标识')}
            >
              {getFieldDecorator('uomCode55', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('EO下达标识'),
                    }),
                  },
                ],
                initialValue: '',
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('装配清单')}
            >
              {getFieldDecorator('operationId')(
                <Lov code="MT.OPERATION" queryParams={'dd'} onChange={this.operationChange} />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomType`).d('来源工艺路线')}
            >
              {getFieldDecorator('uomCode77', {
                rules: [
                  {
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.uomCode`).d('来源工艺路线'),
                    }),
                  },
                ],
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Form>
        </div>
        <div className={styles.routeFooter}>
          <Button onClick={this.cancel}>取消</Button>
          <Button type="primary" className={styles.confirm} onClick={this.confirm}>
            确定
          </Button>
        </div>
      </>
    );
  }
}
/* eslint-disable */
