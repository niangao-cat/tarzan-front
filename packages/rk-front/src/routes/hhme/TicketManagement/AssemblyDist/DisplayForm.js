import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, InputNumber, Row, Col, Switch, Select } from 'hzero-ui';
// import { Bind } from 'lodash-decorators';

import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import moment from 'moment';

const modelPrompt = 'tarzan.product.bom.model.bom';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} dataSourceDetail - 数据来源
 * @return React.element
 */

@connect(({ assemblyList }) => ({
  assemblyList,
}))
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // 获取类型和状态
    dispatch({
      type: 'assemblyList/fetchAssemblyTypes',
      payload: {
        module: 'BOM',
        typeGroup: 'BOM_TYPE',
      },
    });
    dispatch({
      type: 'assemblyList/fetchAssemblyStatus',
      payload: {
        module: 'BOM',
        statusGroup: 'BOM_STATUS',
      },
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      bomId,
      canEdit,
      assemblyList: { bomStatusList = [], bomTypesList = [], displayListDetail = {} },
    } = this.props;
    const {
      bomName,
      assembleAsMaterialFlag,
      autoRevisionFlag,
      bomStatus,
      bomType,
      currentFlag,
      dateFrom,
      dateTo,
      description,
      copiedFromBomName,
      copiedFromBomType,
      copiedFromBomRevision,
      primaryQty,
      releasedFlag,
      revision,
    } = displayListDetail;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomName`).d('编码')}
              >
                {getFieldDecorator('bomName', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.bomName`).d('编码'),
                      }),
                    },
                  ],
                  initialValue: bomName,
                })(<Input trim inputChinese={false} disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.revision`).d('版本')}
              >
                {getFieldDecorator('revision', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.revision`).d('版本'),
                      }),
                    },
                  ],
                  initialValue: revision,
                })(<Input disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.currentFlag`).d('当前版本')}
              >
                {getFieldDecorator('currentFlag', {
                  initialValue: currentFlag === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.description`).d('描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: description,
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.description`).d('描述')}
                    field="description"
                    inputSize={{ zh: 64, en: 64 }}
                    dto="tarzan.method.domain.entity.MtBom"
                    pkValue={{ bomId: bomId || null }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomStatus`).d('状态')}
              >
                {getFieldDecorator('bomStatus', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.bomStatus`).d('状态'),
                      }),
                    },
                  ],
                  initialValue: bomStatus || 'NEW',
                })(
                  <Select disabled={!canEdit} allowClear style={{ width: '100%' }}>
                    {bomStatusList.map(item => (
                      <Select.Option key={item.statusCode} value={item.statusCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.releasedFlag`).d('EO下达标识')}
              >
                {getFieldDecorator('releasedFlag', {
                  initialValue: releasedFlag === 'Y',
                })(<Switch disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomType`).d('类型')}
              >
                {getFieldDecorator('bomType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.bomType`).d('类型'),
                      }),
                    },
                  ],
                  initialValue: bomType,
                })(
                  <Select allowClear disabled={!canEdit} style={{ width: '100%' }}>
                    {bomTypesList.map(item => (
                      <Select.Option key={item.typeCode} value={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.qty`).d('基本数量')}
              >
                {getFieldDecorator('primaryQty', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.qty`).d('基本数量'),
                      }),
                    },
                  ],
                  initialValue: primaryQty || 1,
                })(
                  <InputNumber
                    disabled={!canEdit}
                    defaultValue={1}
                    style={{ width: '100%' }}
                    min={1}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assembleAsMaterialFlag`).d('按物料装配标识')}
              >
                {getFieldDecorator('assembleAsMaterialFlag', {
                  initialValue: assembleAsMaterialFlag === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.startTime`).d('生效时间')}
              >
                {getFieldDecorator('dateFrom', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.startTime`).d('生效时间'),
                      }),
                    },
                  ],
                  initialValue: dateFrom ? moment(dateFrom) : '',
                })(
                  <DatePicker
                    disabled={!canEdit}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.endTime`).d('失效时间')}
                // label="失效时间"
              >
                {getFieldDecorator('dateTo', {
                  initialValue: dateTo ? moment(dateTo) : '',
                })(
                  <DatePicker
                    disabled={!canEdit}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.autoRevisionFlag`).d('自动升版本标识')}
              >
                {getFieldDecorator('autoRevisionFlag', {
                  initialValue: autoRevisionFlag === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.copiedFromBomId`).d('来源BOM编码')}
              >
                {getFieldDecorator('copiedFromBomId', {
                  initialValue: copiedFromBomName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.copiedFromBomType`).d('来源BOM类型')}
              >
                {getFieldDecorator('copiedFromBomType', {
                  initialValue: copiedFromBomType,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.copiedFromBomRevision`).d('来源BOM版本')}
              >
                {getFieldDecorator('value:model.copiedFromBomRevision', {
                  initialValue: copiedFromBomRevision,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
