import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, DatePicker, Select } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  FORM_COL_2_3_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT_MAX,
  // DRAWER_FORM_ITEM_LAYOUT_MAX,
} from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import TLEditor from '@/components/TLEditor';
import moment from 'moment';
// import FormItem from 'hzero-ui/lib/form/FormItem';

const modelPrompt = 'tarzan.process.routes.model.routes';
const { Option } = Select;
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ routes, loading }) => ({
  routes,
  fetchListLoading: loading.effects['routes/fetchDataSourceList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.process.routes',
})
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  @Bind()
  changeRouterType = value => {
    this.props.dispatch({
      type: 'routes/updateState',
      payload: {
        selectedRouterType: value,
      },
    });
  };

  @Bind()
  changeBomId = (val, record) => {
    const {
      routes: { routesItem = {} },
      dispatch,
    } = this.props;
    const newRoutesItem = {
      ...routesItem,
      bomId: val,
      bomType: record.bomType,
      bomTypeDesc: record.typeDesc,
      bomRevision: record.revision,
    };
    dispatch({
      type: 'routes/updateState',
      payload: {
        routesItem: newRoutesItem,
      },
    });
  };

  @Bind()
  changeMaterialName = () => {
    // const {
    //   dispatch,
    //   materialManager: { materialManagerItem = {} },
    // } = this.props;
    // materialManagerItem.materialName = e.target.value;
    // dispatch({
    //   type: 'materialManager/updateState',
    //   payload: {
    //     materialManagerItem,
    //   },
    // });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      routes: { routesItem = {}, statusList = [], typeList = [] },
      canEdit,
      routerId,
    } = this.props;
    const {
      routerName,
      routerType,
      routerStatus,
      description,
      revision,
      currentFlag,
      autoRevisionFlag,
      dateFrom,
      dateTo,
      relaxedFlowFlag,
      bomId,
      bomName,
      // copiedFromRouterId,
      copiedFromRouterName,
      hasBeenReleasedFlag,
      bomRevision,
      bomTypeDesc,
    } = routesItem;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerName`).d('工艺路线编码')}
              >
                {getFieldDecorator('routerName', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.routerName`).d('工艺路线编码'),
                      }),
                    },
                  ],
                  initialValue: routerName,
                })(<Input trim disabled={!canEdit} inputChinese={false} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerType`).d('工艺路线类型')}
              >
                {getFieldDecorator('routerType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.routerType`).d('工艺路线类型'),
                      }),
                    },
                  ],
                  initialValue: routerType,
                })(
                  <Select disabled={!canEdit} onChange={this.changeRouterType}>
                    {typeList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerStatus`).d('工艺路线状态')}
              >
                {getFieldDecorator('routerStatus', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.routerStatus`).d('工艺路线状态'),
                      }),
                    },
                  ],
                  initialValue: routerStatus || 'NEW',
                })(
                  <Select disabled={!canEdit}>
                    {statusList.map(ele => (
                      <Option value={ele.statusCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            {/* <Col {...FORM_COL_2_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                label={intl.get(`${modelPrompt}.description`).d('工艺路线描述')}
              >
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.description`).d('工艺路线描述'),
                      }),
                    },
                  ],
                  initialValue: description,
                })(<Input />)}
              </Form.Item>
            </Col> */}
            <Col {...FORM_COL_2_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                label={intl.get(`${modelPrompt}.description`).d('工艺路线描述')}
              >
                {getFieldDecorator('description', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: intl.get('hzero.common.validation.notNull', {
                  //       name: intl.get(`${modelPrompt}.description`).d('工艺路线描述'),
                  //     }),
                  //   },
                  // ],
                  initialValue: description,
                })(
                  <TLEditor
                    disabled={!canEdit}
                    label={intl.get(`${modelPrompt}.description`).d('工艺路线描述')}
                    field="description"
                    dto="tarzan.method.domain.entity.MtRouter"
                    pkValue={{ routerId: routerId === 'create' ? null : routerId }}
                    onChange={this.changeMaterialName}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.hasBeenReleasedFlag`).d('已下达EO')}
              >
                {getFieldDecorator('hasBeenReleasedFlag', {
                  initialValue: hasBeenReleasedFlag === 'Y',
                })(<Switch disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
                  initialValue: currentFlag !== 'N',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.autoRevisionFlag`).d('自动升级版本标识')}
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
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateTo`).d('失效时间')}
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
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.relaxedFlowFlag`).d('松散标识')}
              >
                {getFieldDecorator('relaxedFlowFlag', {
                  initialValue: relaxedFlowFlag === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomName`).d('装配清单')}
              >
                {getFieldDecorator('bomId', {
                  initialValue: bomId,
                })(
                  <Lov
                    code="MT.BOM_BASIC"
                    // disabled={!canEdit || getFieldValue('revision') !== 'SPECIAL'}
                    disabled={!canEdit}
                    textValue={bomName}
                    queryParams={{ tenantId }}
                    onChange={this.changeBomId}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomTypeDesc`).d('装配清单类型')}
              >
                {getFieldDecorator('bomTypeDesc', {
                  initialValue: bomTypeDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomRevision`).d('装配清单版本')}
              >
                {getFieldDecorator('bomRevision', {
                  initialValue: bomRevision,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.copiedFromRouterName`).d('来源工艺路线')}
              >
                {getFieldDecorator('copiedFromRouterName', {
                  initialValue: copiedFromRouterName,
                })(
                  // <Lov
                  //   code="MT.ROUTER"
                  //   // disabled={!canEdit || getFieldValue('revision') !== 'SPECIAL'}
                  //   disabled={!canEdit}
                  //   textValue={copiedFromRouterName}
                  //   queryParams={{ tenantId }}
                  // />
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
