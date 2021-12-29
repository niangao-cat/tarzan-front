import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select, Modal, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import {
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { isFunction } from 'lodash';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const { Option } = Select;
const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
@connect(({ equipmentLedgerManagement }) => ({
  equipmentLedgerManagement,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
class MoreSearchModal extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
  }

  // componentWillMount() {
  //   const { dispatch, tenantId, form } = this.props;
  //   // 查询默认部门
  //   dispatch({
  //     type: 'equipmentLedgerManagement/fetchDepartment',
  //     payload: {
  //       tenantId,
  //     },
  //   }).then(res => {
  //     if (res) {
  //       console.log('res==', res && res.map(e => e.areaId));
  //       if(form) {
  //         form.setFieldsValue({
  //           businessId: (res && res.map(e => e.areaId)).toString(),
  //         });
  //       }
  //     }
  //   });
  // }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, clearMoreSearchCache } = this.props;
    form.resetFields();
    clearMoreSearchCache();
  }

  // 查询
  @Bind()
  handleSearch() {
    const { onMoreSearch, form } = this.props;
    if (onMoreSearch) {
      form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          onMoreSearch({}, values);
        }
      });
    }
  }

  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    onCancel(false);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      visible,
      assetClass = [],
      tenantId,
      useFrequency = [],
      moreSearchCache = {},
      equipmentLedgerManagement: {
        departmentList = [],
      },
    } = this.props;
    // console.log('departmentList', departmentList);
    // eslint-disable-next-line no-empty-pattern
    const { } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="更多查询"
        onCancel={() => this.onCancel()}
        closable
        width={1200}
        footer={[
          <Button key="reset" onClick={this.handleFormReset}>
            清空
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSearch}>
            查询
          </Button>,
        ]}
      >
        <Form>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            {/* <Col {...FORM_COL_4_LAYOUT}> */}
            {/*   <Form.Item */}
            {/*     {...EDIT_FORM_ITEM_LAYOUT} */}
            {/*     label={intl.get(`${modelPrompt}.equipmentBodyNum`).d('机身序列号')} */}
            {/*   > */}
            {/*     {getFieldDecorator('equipmentBodyNum', { */}
            {/*       initialValue: moreSearchCache.equipmentBodyNum, */}
            {/*     })(<Input />)} */}
            {/*   </Form.Item> */}
            {/* </Col> */}
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentConfig`).d('配置')}
              >
                {getFieldDecorator('equipmentConfig', {
                  initialValue: moreSearchCache.equipmentConfig,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentCategory`).d('详细设备类别')}
              >
                {getFieldDecorator('equipmentCategory', {
                  initialValue: moreSearchCache.equipmentCategory,
                })(
                  <MultipleLov
                    queryParams={{
                      tenantId,
                    }}
                    allowClear
                    code="HME.EQUIPMENT_CATEGORY"
                    textValue={moreSearchCache.equipmentCategory}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assetClassList`).d('资产类别')}
              >
                {getFieldDecorator('assetClassList', {
                  initialValue: moreSearchCache.assetClassList,
                })(
                  <Select mode="multiple" allowClear>
                    {assetClass.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sapNum`).d('SAP流水号')}
              >
                {getFieldDecorator('sapNum', {
                  initialValue: moreSearchCache.sapNum,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='工位'
              >
                {getFieldDecorator('workcellCodeId', {
                  initialValue: moreSearchCache.workcellCodeId,
                })(
                  <MultipleLov
                    code="MT.WORK_STATION"
                    queryParams={{ tenantId }}
                    textValue={moreSearchCache.workcellCode}
                    onChange={(value, item) => {
                      form.setFieldsValue({
                        workcellCode: item?item.map(i=>i.workcellCode).join(','):'',
                      });
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item
                style={{ display: 'none' }}
              >
                {getFieldDecorator('workcellCode', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dealNum`).d('处置单号')}
              >
                {getFieldDecorator('dealNum', {
                  initialValue: moreSearchCache.dealNum,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dealReason`).d('处置原因')}
              >
                {getFieldDecorator('dealReason', {
                  initialValue: moreSearchCache.dealReason,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.belongTo`).d('归属权')}
              >
                {getFieldDecorator('belongTo', {
                  initialValue: moreSearchCache.belongTo,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.contractNum`).d('合同编号')}
              >
                {getFieldDecorator('contractNum', {
                  initialValue: moreSearchCache.contractNum,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.businessId`).d('保管部门')}
              >
                {getFieldDecorator('businessId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '保管部门',
                      }),
                    },
                  ],
                  initialValue: moreSearchCache.businessId,
                })(
                  <MultipleLov
                    queryParams={{
                      tenantId,
                    }}
                    allowClear
                    code="HME.EQUIPMENT_BUSINESS"
                    textValue={departmentList.map(e => e.areaName).toString() || moreSearchCache.businessName}
                    onChange={(value, item) => {
                      form.setFieldsValue({
                        businessName: item?item.map(i=>i.description).join(','):'',
                      });
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item
                style={{ display: 'none' }}
              >
                {getFieldDecorator('businessName', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.user`).d('使用人')}
              >
                {getFieldDecorator('user', {
                  initialValue: moreSearchCache.user,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.preserver`).d('保管人')}
              >
                {getFieldDecorator('preserver', {
                  initialValue: moreSearchCache.preserver,
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.location`).d('存放地点')}
              >
                {getFieldDecorator('location', {
                  initialValue: moreSearchCache.location,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.measureFlag`).d('是否计量')}
              >
                {getFieldDecorator('measureFlag', {
                  initialValue: moreSearchCache.measureFlag,
                })(
                  <Select allowClear>
                    <Option value='Y'>是</Option>
                    <Option value='N'>否</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.frequencyList`).d('使用频次')}
              >
                {getFieldDecorator('frequencyList', {
                  initialValue: moreSearchCache.frequencyList,
                })(
                  <Select mode="multiple" allowClear>
                    {useFrequency.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.supplier`).d('销售商')}
              >
                {getFieldDecorator('supplier', {
                  initialValue: moreSearchCache.supplier,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.brand`).d('品牌')}
              >
                {getFieldDecorator('brand', {
                  initialValue: moreSearchCache.brand,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.model`).d('型号')}
              >
                {getFieldDecorator('model', {
                  initialValue: moreSearchCache.model,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.recruitement`).d('募投')}
              >
                {getFieldDecorator('recruitement', {
                  initialValue: moreSearchCache.recruitement,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.recruitementNum`).d('募投编号')}
              >
                {getFieldDecorator('recruitementNum', {
                  initialValue: moreSearchCache.recruitementNum,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.oaCheckNum`).d('OA验收单号')}
              >
                {getFieldDecorator('oaCheckNum', {
                  initialValue: moreSearchCache.oaCheckNum,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.postingDateStart`).d('入账日期从')}
              >
                {getFieldDecorator('postingDateStart', {
                  initialValue: moreSearchCache.postingDateStart ? moment(moreSearchCache.postingDateStart, 'YYYY-MM-DD HH:mm:ss') : '',
                })(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.postingDateEnd`).d('至')}
              >
                {getFieldDecorator('postingDateEnd', {
                  initialValue: moreSearchCache.postingDateEnd ? moment(moreSearchCache.postingDateEnd, 'YYYY-MM-DD HH:mm:ss') : '',
                })(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...EDIT_FORM_ITEM_LAYOUT} label="机身序列号">
                {getFieldDecorator('equipmentBodyNum', {})(<Input />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ModalContainer ref={registerContainer} />
      </Modal>
    );
  }
}

export default MoreSearchModal;
