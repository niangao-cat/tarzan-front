import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, InputNumber, DatePicker } from 'hzero-ui';
import moment from 'moment';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import ExpandCard from '@/components/ExpandCard';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ execute }) => ({
  execute,
}))
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  state = {
    endOpen: false,
  };

  disabledStartDate = planStartTime => {
    const { execute = {} } = this.props;
    const { displayList = {} } = execute;
    const { planEndTime } = displayList;
    if (!planStartTime || !planEndTime) {
      return false;
    }
    return planStartTime.valueOf() > planEndTime.valueOf();
  };

  disabledEndDate = planEndTime => {
    const { execute = {} } = this.props;
    const { displayList = {} } = execute;
    const { planStartTime } = displayList;
    if (!planEndTime || !planStartTime) {
      return false;
    }
    return planEndTime.valueOf() <= planStartTime.valueOf();
  };

  onChange = (field, value) => {
    const {
      dispatch,
      execute: { displayList = {} },
    } = this.props;
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {
          ...displayList,
          [field]: moment(value._d).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    });
  };

  onStartChange = value => {
    this.onChange('planStartTime', value);
  };

  onEndChange = value => {
    this.onChange('planEndTime', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  // 更新数量的值
  refreshQty = (field, val) => {
    const {
      dispatch,
      execute: { displayList = {} },
    } = this.props;
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {
          ...displayList,
          [field]: val,
        },
      },
    });
  };

  // 更新时间的值
  refreshTime = (field, _, date) => {
    const {
      dispatch,
      execute: { displayList = {} },
    } = this.props;
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {
          ...displayList,
          [field]: date,
        },
      },
    });
  };

  // 更新生产线的值
  refreshProdLine = (_, record) => {
    const {
      dispatch,
      execute: { displayList = {} },
      form,
    } = this.props;
    form.setFieldsValue({
      productionLineName: record.prodLineName,
    });
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {
          ...displayList,
          productionLineId: record.prodLineId,
          productionLineCode: record.prodLineCode,
          productionLineName: record.prodLineName,
        },
      },
    });
  };

  // 更新装配清单的值
  refreshBom = (_, record) => {
    const {
      dispatch,
      execute: { displayList = {} },
      form,
    } = this.props;
    form.setFieldsValue({
      eoBomName: record.bomName,
    });
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {
          ...displayList,
          eoBomId: record.bomId,
          eoBomName: record.eoBomName,
        },
      },
    });
  };

  // 更新工艺路线的值
  refreshRouter = (_, record) => {
    const {
      dispatch,
      execute: { displayList = {} },
      form,
    } = this.props;
    form.setFieldsValue({
      eoRouterName: record.eoRouterName,
    });
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {
          ...displayList,
          eoRouterId: record.routerId,
          eoRouterName: record.routerName,
        },
      },
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, execute = {}, editFlag } = this.props;
    const { displayList = {} } = execute;
    const {
      eoNum,
      eoTypeDesc,
      statusDesc,
      eoRouterName,
      eoBomName,
      materialCode,
      materialName,
      productionLineId,
      productionLineCode,
      productionLineName,
      planStartTime,
      planEndTime,
      qty,
      completedQty,
      scrappedQty,
      workOrderNum,
      actualStartTime,
      actualEndTime,
      eoIdentification,
    } = displayList;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    const { endOpen } = this.state;
    return (
      <>
        <ExpandCard title={intl.get('tarzan.workshop.execute.title.basic').d('基本属性')}>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.eoNum`).d('执行作业编码')}
                >
                  {getFieldDecorator('eoNum', {
                    initialValue: eoNum,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.eoIdentification`).d('EO标识')}
                >
                  {getFieldDecorator('eoIdentification', {
                    initialValue: eoIdentification,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.eoType`).d('执行作业类型')}
                >
                  {getFieldDecorator('eoTypeDesc', {
                    initialValue: eoTypeDesc,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.qty`).d('数量')}
                >
                  {getFieldDecorator('qty', {
                    initialValue: qty,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.qty`).d('数量'),
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      disabled={editFlag}
                      onChange={this.refreshQty.bind(this, 'qty')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.enableFlag`).d('生产指令编码')}
                >
                  {getFieldDecorator('workOrderNum', {
                    initialValue: workOrderNum,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.status`).d('执行作业状态')}
                >
                  {getFieldDecorator('statusDesc', {
                    initialValue: statusDesc,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
                >
                  {getFieldDecorator('materialCode', {
                    initialValue: materialCode,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
                >
                  {getFieldDecorator('materialName', {
                    initialValue: materialName,
                  })(<Input disabled style={{ width: 'calc(271% + 12px)' }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ExpandCard>
        <ExpandCard title={intl.get('tarzan.workshop.execute.title.produce').d('生产属性')}>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间')}
                >
                  {getFieldDecorator('planStartTime', {
                    initialValue: planStartTime ? moment(planStartTime) : null,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      disabled={editFlag}
                      style={{ width: '100%' }}
                      disabledDate={this.disabledStartDate}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onChange={this.onStartChange}
                      onOpenChange={this.handleStartOpenChange}
                      placeholder={intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间')}
                >
                  {getFieldDecorator('planEndTime', {
                    initialValue: planEndTime ? moment(planEndTime) : null,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      disabled={editFlag}
                      style={{ width: '100%' }}
                      disabledDate={this.disabledEndDate}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.productionLineId`).d('生产线编码')}
                >
                  {getFieldDecorator('productionLineId', {
                    initialValue: productionLineId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.productionLineId`).d('生产线编码'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="MT.PRODLINE"
                      onChange={this.refreshProdLine}
                      textValue={productionLineCode}
                      queryParams={{ tenantId }}
                      disabled={editFlag}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.productionLineName`).d('生产线名称')}
                >
                  {getFieldDecorator('productionLineName', {
                    initialValue: productionLineName,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.eoBomName`).d('装配清单编码')}
                >
                  {getFieldDecorator('eoBomName', {
                    initialValue: eoBomName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.eoBomName`).d('装配清单编码'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="MT.BOM_BASIC"
                      onChange={this.refreshBom}
                      textValue={eoBomName}
                      queryParams={{ tenantId }}
                      disabled={editFlag}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.eoRouterName`).d('工艺路线编码')}
                >
                  {getFieldDecorator('eoRouterName', {
                    initialValue: eoRouterName,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.eoRouterName`).d('工艺路线编码'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="MT.ROUTER"
                      onChange={this.refreshRouter}
                      textValue={eoRouterName}
                      queryParams={{ tenantId }}
                      disabled={editFlag}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ExpandCard>
        <ExpandCard title={intl.get('tarzan.workshop.execute.title.actual').d('实绩属性')}>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualStartTime`).d('实绩开始时间')}
                >
                  {getFieldDecorator('actualStartTime', {
                    initialValue: actualStartTime,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualEndTime`).d('实绩结束时间')}
                >
                  {getFieldDecorator('actualEndTime', {
                    initialValue: actualEndTime,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.completedQty`).d('累计完成数量')}
                >
                  {getFieldDecorator('completedQty', {
                    initialValue: completedQty,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.scrappedQty`).d('累计报废数量')}
                >
                  {getFieldDecorator('scrappedQty', {
                    initialValue: scrappedQty,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ExpandCard>
      </>
    );
  }
}
