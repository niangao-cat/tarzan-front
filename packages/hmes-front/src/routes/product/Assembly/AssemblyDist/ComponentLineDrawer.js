/**
 * UserGroupManagement 组件行编辑抽屉
 * @date: 2019-7-25
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, DatePicker, InputNumber, Row, Col, Switch, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';

import Lov from 'components/Lov';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.product.bom.model.bom';
@connect(({ assemblyList }) => ({
  assemblyList,
}))
@Form.create({ fieldNameProp: null })
export default class ComponentLineDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    visible: false,
    bomComponentId: '',
    lineNumber: '',
    materialId: '',
    materialName: '',
    bomComponentType: '',
    qty: '',
    issuedLocatorId: '',
    // issuedLocatorDesc: '',
    dateFrom: '',
    dateTo: '',
    keyMaterialFlag: '',
    assembleMethod: '',
    assembleAsReqFlag: '',
    attritionPolicy: '',
    attritionChance: '',
    attritionQty: '',
    uomName: '',
    materialIdCode: '',
    componentLineTypes: [],
    assembleMethodOptions: [],
    attritionPolicyOptions: [],
    locatorName: '',
    attritionQtyBoolean: false,
    attritionChanceBoolean: false,
    bomId: '',
    issuedLocatorCode: '', // 发料库位编码
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 需要去查询下组件类型
    dispatch({
      type: 'assemblyList/fetchAssemblyComponentLineTypes',
      payload: {
        module: 'BOM',
        typeGroup: 'BOM_COMPONENT_TYPE',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          componentLineTypes: res.rows,
        });
      } else {
        notification.error(res.message);
      }
    });
    // 装配方式
    dispatch({
      type: 'assemblyList/fetchAssemblyComponentLineTypes',
      payload: {
        module: 'MATERIAL',
        typeGroup: 'ASSY_METHOD',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          assembleMethodOptions: res.rows,
        });
      } else {
        notification.error(res.message);
      }
    });
    // 损耗策略
    dispatch({
      type: 'assemblyList/fetchAssemblyComponentLineTypes',
      payload: {
        module: 'BOM',
        typeGroup: 'ATTRITION_POLICY',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attritionPolicyOptions: res.rows,
        });
      } else {
        notification.error(res.message);
      }
    });
  }

  @Bind()
  searchDetail(record) {
    const { dispatch, currentBomId } = this.props;
    // 获取详情
    dispatch({
      type: 'assemblyList/fetchComponentLineRowList',
      payload: {
        bomComponentId: record.bomComponentId,
      },
    }).then(res => {
      if (res && res.success) {
        const initData = res.rows;
        this.setState({
          bomComponentId: initData.bomComponentId,
          lineNumber: initData.lineNumber,
          materialId: initData.materialId,
          materialName: initData.materialName,
          bomComponentType: initData.bomComponentType,
          qty: initData.qty,
          issuedLocatorId: initData.issuedLocatorId,
          // issuedLocatorDesc: initData.issuedLocatorDesc,
          dateFrom: initData.dateFrom,
          dateTo: initData.dateTo,
          keyMaterialFlag: initData.keyMaterialFlag,
          assembleMethod: initData.assembleMethod,
          assembleAsReqFlag: initData.assembleAsReqFlag,
          attritionPolicy: initData.attritionPolicy,
          attritionChance: initData.attritionChance,
          attritionQty: initData.attritionQty,
          uomName: initData.uomName,
          materialIdCode: initData.materialCode,
          locatorName: initData.issuedLocatorName,
          bomId: currentBomId,
          issuedLocatorCode: initData.issuedLocatorCode,
        });
      }
    });
  }

  @Bind()
  showDrawer(record) {
    if (record.bomComponentId) {
      // 编辑
      this.setState({ visible: true });
      this.searchDetail(record);
    } else {
      // 新增
      this.setState({
        visible: true,
        bomComponentId: '',
        lineNumber: '',
        materialId: '',
        materialName: '',
        bomComponentType: '',
        qty: '',
        issuedLocatorId: '',
        // issuedLocatorDesc: '',
        dateFrom: null,
        dateTo: null,
        keyMaterialFlag: '',
        assembleMethod: '',
        assembleAsReqFlag: '',
        attritionPolicy: '',
        attritionChance: '',
        attritionQty: '',
        uomName: '',
        materialIdCode: '',
        locatorName: '',
        bomId: this.props.currentBomId,
        issuedLocatorCode: '',
      });
    }
  }

  @Bind()
  closeDrawer() {
    this.setState({ visible: false });
  }

  @Bind()
  handleOK() {
    const { form, onOk = e => e } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const value = fieldsValue;
        if (value.attritionPolicy) {
          if (value.attritionPolicy === '1') {
            // 固定值必输
            if (!value.attritionQty) {
              notification.info({
                message: intl
                  .get(`${modelPrompt}.attritionPolicyIsOne`)
                  .d('损耗策略为固定值时，固定损耗值不可为空'),
              });
              return false;
            }
          }
          if (value.attritionPolicy === '2') {
            // 百分比必输
            if (!value.attritionChance) {
              notification.info({
                message: intl
                  .get(`${modelPrompt}.attritionPolicyIsTwo`)
                  .d('损耗策略为百分比时，损耗百分比不可为空'),
              });
              return false;
            }
          }
          if (value.attritionPolicy === '3') {
            // 都必输
            if (!value.attritionChance || !value.attritionQty) {
              notification.info({
                message: intl
                  .get(`${modelPrompt}.attritionPolicyIsThree`)
                  .d('损耗策略固定值+百分比时，固定损耗值和损耗百分比不可为空'),
              });
              return false;
            }
          }
        }
        value.dateFrom = value.dateFrom ? moment(value.dateFrom).format('YYYY-MM-DD HH:mm:ss') : '';
        value.dateTo = value.dateTo ? moment(value.dateTo).format('YYYY-MM-DD HH:mm:ss') : '';
        value.keyMaterialFlag = value.keyMaterialFlag ? 'Y' : 'N';
        value.assembleAsReqFlag = value.assembleAsReqFlag ? 'Y' : 'N';
        value.attritionChance = value.attritionChance ? value.attritionChance : '';
        value.attritionPolicy = value.attritionPolicy ? value.attritionPolicy : '';
        value.attritionQty = value.attritionQty ? value.attritionQty : '';
        value.issuedLocatorDesc = value.issuedLocatorDesc ? value.issuedLocatorDesc : '';
        // 新增时为空
        if (this.state.bomComponentId) {
          value.bomComponentId = this.state.bomComponentId;
        }
        value.materialId = this.state.materialId;
        value.bomId = this.state.bomId;
        value.issuedLocatorId = this.state.issuedLocatorId;
        onOk(value);
      }
    });
  }

  @Bind()
  mterialCodeChange(_, record) {
    this.setState({
      materialId: record.materialId,
      materialName: record.materialName,
      uomName: record.uomName,
      materialIdCode: record.materialCode,
    });
  }

  @Bind()
  changeLocator(_, record) {
    this.setState({
      issuedLocatorId: record.locatorId,
      locatorName: record.locatorName,
    });
  }

  @Bind()
  attritionPolicyChange(value) {
    const { form } = this.props;
    // 损耗策略change 对应改变相应的逻辑
    if (value === '1') {
      // 固定值（百分比清空并禁用）
      this.setState({
        attritionChanceBoolean: true,
        attritionQtyBoolean: false,
      });
      form.resetFields(['attritionChance']);
    } else if (value === '2') {
      // 百分比（固定值清空并禁用）
      this.setState({
        attritionChanceBoolean: false,
        attritionQtyBoolean: true,
      });
      form.resetFields(['attritionQty']);
    } else if (value === '3') {
      // 固定值+百分比（都不做限制）
      this.setState({
        attritionChanceBoolean: false,
        attritionQtyBoolean: false,
      });
    } else {
      this.setState({
        attritionChanceBoolean: false,
        attritionQtyBoolean: false,
      });
    }
  }

  render() {
    const { form } = this.props;
    const {
      visible,
      bomComponentId,
      lineNumber,
      materialId,
      materialName,
      bomComponentType,
      qty,
      issuedLocatorId,
      // issuedLocatorDesc,
      dateFrom,
      dateTo,
      keyMaterialFlag,
      assembleMethod,
      assembleAsReqFlag,
      attritionPolicy,
      attritionChance,
      attritionQty,
      uomName,
      materialIdCode,
      componentLineTypes,
      assembleMethodOptions,
      attritionPolicyOptions,
      locatorName,
      attritionQtyBoolean,
      attritionChanceBoolean,
      issuedLocatorCode,
      bomId,
    } = this.state;
    const { canEdit } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={720}
        title={
          bomComponentId
            ? intl.get(`${modelPrompt}.componentLineEdit`).d('组件行编辑')
            : intl.get(`${modelPrompt}.componentLineCreate`).d('组件行新增')
        }
        visible={visible}
        onCancel={this.closeDrawer}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.lineNumber`).d('排序号')}
              >
                {getFieldDecorator('lineNumber', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.lineNumber`).d('排序号'),
                      }),
                    },
                  ],
                  initialValue: lineNumber,
                })(<InputNumber min={0} style={{ width: '100%' }} disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('组件编码')}
              >
                {getFieldDecorator('materialId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('组件编码'),
                      }),
                    },
                  ],
                  initialValue: materialId,
                })(
                  <Lov
                    disabled={bomComponentId}
                    code="MT.BOM_MATERIAL"
                    textValue={materialIdCode}
                    queryParams={{ tenantId, bomId }}
                    onChange={this.mterialCodeChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialName`).d('组件描述')}
              >
                {getFieldDecorator('materialName', {
                  initialValue: materialName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.uomName`).d('组件单位')}
              >
                {getFieldDecorator('uomName', {
                  initialValue: uomName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.primaryQty`).d('数量')}
              >
                {getFieldDecorator('qty', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.primaryQty`).d('数量'),
                      }),
                    },
                  ],
                  initialValue: qty,
                })(<InputNumber style={{ width: '100%' }} disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomComponentTypeDesc`).d('组件类型')}
              >
                {getFieldDecorator('bomComponentType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.bomComponentTypeDesc`).d('组件类型'),
                      }),
                    },
                  ],
                  initialValue: bomComponentType,
                })(
                  <Select allowClear style={{ width: '100%' }} disabled={!canEdit}>
                    {componentLineTypes.map(item => (
                      <Select.Option key={item.typeCode} value={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assembleMethod`).d('装配方式')}
              >
                {getFieldDecorator('assembleMethod', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.assembleMethod`).d('装配方式'),
                      }),
                    },
                  ],
                  initialValue: assembleMethod,
                })(
                  <Select allowClear style={{ width: '100%' }} disabled={!canEdit}>
                    {assembleMethodOptions.map(item => (
                      <Select.Option key={item.typeCode} value={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.attritionPolicy`).d('损耗策略')}
              >
                {getFieldDecorator('attritionPolicy', {
                  initialValue: attritionPolicy,
                })(
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    onChange={this.attritionPolicyChange}
                    disabled={!canEdit}
                  >
                    {attritionPolicyOptions.map(item => (
                      <Select.Option key={item.typeCode} value={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.attritionChance`).d('损耗百分比(%)')}
              >
                {getFieldDecorator('attritionChance', {
                  rules: [
                    {
                      required: attritionPolicy === '百分比' || attritionPolicy === '固定值+百分比',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.attritionChance`).d('损耗百分比(%)'),
                      }),
                    },
                  ],
                  initialValue: attritionChance,
                })(
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    disabled={attritionChanceBoolean || !canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.attritionQty`).d('固定损耗值')}
              >
                {getFieldDecorator('attritionQty', {
                  rules: [
                    {
                      required: attritionPolicy === '固定值' || attritionPolicy === '固定值+百分比',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.attritionQty`).d('固定损耗值'),
                      }),
                    },
                  ],
                  initialValue: attritionQty,
                })(
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    disabled={attritionQtyBoolean || !canEdit}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateFrom`).d('生效时间')}
              >
                {getFieldDecorator('dateFrom', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dateFrom`).d('生效时间'),
                      }),
                    },
                  ],
                  initialValue: dateFrom ? moment(dateFrom) : '',
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateTo`).d('失效时间')}
              >
                {getFieldDecorator('dateTo', {
                  initialValue: dateTo ? moment(dateTo) : '',
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.issuedLocatorId`).d('发料库位编码')}
              >
                {getFieldDecorator('issuedLocatorId', {
                  initialValue: issuedLocatorId,
                })(
                  <Lov
                    code="MT.LOCATOR"
                    textValue={issuedLocatorCode}
                    queryParams={{ tenantId }}
                    onChange={this.changeLocator}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.issuedLocatorDesc`).d('发料库位描述')}
              >
                {getFieldDecorator('issuedLocatorDesc', {
                  initialValue: locatorName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.keyMaterialFlag`).d('关键件标识')}
              >
                {getFieldDecorator('keyMaterialFlag', {
                  initialValue: keyMaterialFlag === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assembleAsReqFlag`).d('按需求数量装配')}
              >
                {getFieldDecorator('assembleAsReqFlag', {
                  initialValue: assembleAsReqFlag === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
