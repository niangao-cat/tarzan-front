import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, InputNumber, DatePicker, Select } from 'hzero-ui';
import {
  FORM_COL_4_LAYOUT,
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT_MAX,
} from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
// import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
// import TLEditor from '@/components/TLEditor';
import moment from 'moment';
// import FormItem from 'hzero-ui/lib/form/FormItem';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.process.technology.model.technology';
const { Option } = Select;
const { TextArea } = Input;
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ technology, loading }) => ({
  technology,
  fetchListLoading: loading.effects['technology/fetchDataSourceList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.process.technology',
})
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      technology: { technologyItem = {}, statusList = [], typeList, workCellList = [] },
      canEdit,
      operationId,
    } = this.props;
    const {
      operationName,
      revision,
      siteId,
      operationStatus,
      currentFlag,
      completeInconformityFlag = 'Y',
      operationType,
      dateTo,
      dateFrom,
      description,
      specialRouterId,
      standardReqdTimeInProcess,
      workcellId,
      standardSpecialIntroduction,
      standardMaxLoop,
      workcellType,
      // specialRouterId,
      specialRouterName,
      workcellCode,
    } = technologyItem;
    const { getFieldDecorator, getFieldValue } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationName`).d('工艺编码')}
              >
                {getFieldDecorator('operationName', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteId`).d('工艺编码'),
                      }),
                    },
                  ],
                  initialValue: operationName,
                })(<Input trim disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteId`).d('所属站点')}
              >
                {getFieldDecorator('siteId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteId`).d('所属站点'),
                      }),
                    },
                  ],
                  initialValue: siteId,
                })(
                  <Lov
                    code="MT.SITE"
                    disabled={!canEdit}
                    textValue={siteId}
                    queryParams={{ tenantId, siteType: 'MANUFACTURING' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
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
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.currentFlag`).d('当前版本标识')}
              >
                {getFieldDecorator('currentFlag', {
                  initialValue: currentFlag !== 'N',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationStatus`).d('状态')}
              >
                {getFieldDecorator('operationStatus', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteId`).d('状态'),
                      }),
                    },
                  ],
                  initialValue: operationStatus || 'NEW',
                })(
                  <Select disabled={!canEdit}>
                    {statusList.map(ele => (
                      <Option value={ele.statusCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationType`).d('工艺类型')}
              >
                {getFieldDecorator('operationType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.operationType`).d('工艺类型'),
                      }),
                    },
                  ],
                  initialValue: operationType,
                })(
                  <Select disabled={!canEdit}>
                    {typeList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateFrom`).d('生效时间从')}
              >
                {getFieldDecorator('dateFrom', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dateFrom`).d('生效时间从'),
                      }),
                    },
                  ],
                  initialValue: dateFrom ? moment(dateFrom) : null,
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateTo`).d('生效时间至')}
              >
                {getFieldDecorator('dateTo', {
                  initialValue: dateTo ? moment(dateTo) : null,
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                label={intl.get(`${modelPrompt}.description`).d('工艺描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: description,
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.description`).d('工艺描述')}
                    field="description"
                    dto="tarzan.method.domain.entity.MtOperation"
                    pkValue={{ operationId: operationId === 'create' ? null : operationId }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.completeInconformityFlag`).d('完工不一致标识')}
              >
                {getFieldDecorator('completeInconformityFlag', {
                  initialValue: completeInconformityFlag,
                })(<Switch disabled={!canEdit} checkedValue="Y" unCheckedValue="N" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                label={intl.get(`${modelPrompt}.specialRouter`).d('特殊工艺路线')}
              >
                {getFieldDecorator('specialRouterId', {
                  initialValue: specialRouterId,
                })(
                  <Lov
                    code="MT.ROUTER"
                    disabled={!canEdit || getFieldValue('operationType') !== 'SPECIAL'}
                    textValue={specialRouterName}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellType`).d('工作单元类型')}
              >
                {getFieldDecorator('workcellType', {
                  initialValue: workcellType,
                })(
                  <Select disabled={!canEdit}>
                    {workCellList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellId`).d('默认工作单元')}
              >
                {getFieldDecorator('workcellId', {
                  initialValue: workcellId,
                })(
                  <Lov
                    code="MT.WORKCELL"
                    textValue={workcellCode}
                    disabled={!canEdit}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.standardReqdTimeInProcess`).d('工艺过程时间')}
              >
                {getFieldDecorator('standardReqdTimeInProcess', {
                  initialValue: standardReqdTimeInProcess,
                })(
                  <InputNumber
                    disabled={!canEdit}
                    style={{ width: '100%' }}
                    formatter={value => `${value}(分钟)`}
                    parser={value => value.replace('(分钟)', '')}
                    min={0}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.standardMaxLoop`).d('最大循环次数')}
              >
                {getFieldDecorator('standardMaxLoop', {
                  initialValue: standardMaxLoop,
                })(
                  <InputNumber
                    disabled={!canEdit}
                    min={0}
                    precision={0}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                label={intl.get(`${modelPrompt}.standardSpecialIntroduction`).d('特殊指令')}
              >
                {getFieldDecorator('standardSpecialIntroduction', {
                  initialValue: standardSpecialIntroduction,
                })(<TextArea rows={4} disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
