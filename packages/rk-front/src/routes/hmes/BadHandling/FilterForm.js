import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Icon, Spin} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import Lov from 'components/Lov';
import { connect } from 'dva';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@connect(({ badHandling }) => ({
  badHandling,
}))
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: true,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, handleResetFields } = this.props;
    form.resetFields();
    handleResetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

  /**
   * 表单展开收起
   */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  @Bind()
  setWorkcellIdByCode(value, processId = "") {
    const { dispatch, badHandling: {routerParam} } = this.props;
    routerParam.workcellName = value;
    dispatch({
      type: 'badHandling/queryWorkcellId',
      payload: {
        workcellCode: value,
        processId,
      },
    });
  }

  @Bind()
  setWorkcellId(item={}) {
    const { dispatch } = this.props;
    // 调用查询方法
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        workcellId: item.workcellId,
      },
    });
  }

  @Bind()
  scanningMaterialLotCode(e, value) {
    const { scanningMaterialLotCode } = this.props;
    if (e.keyCode === 13) {
      scanningMaterialLotCode(value);
    }
  }


  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, tenantId, prodMaterialInfo = {}, routerParam = {}, shiftCode, scanningMaterialLotCodeLoading } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME} style={{ backgroundColor: '#fff', marginBottom: '0px' }}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="生产线">
              {getFieldDecorator('prodLineId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '生产线',
                    }),
                  },
                ],
                initialValue: routerParam.prodLineId ? routerParam.prodLineId : null,
                // initialValue: '40215.1',
              })(
                <Lov
                  code="MT.PRODLINE"
                  allowClear
                  textValue={routerParam.prodLineName}
                  queryParams={{
                    tenantId,
                  }}
                  onChange={() => {
                    resetFields(['processId', 'workcellId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工序'>
              {getFieldDecorator('processId', {
                rules: [
                  {
                    required: getFieldValue('prodLineId'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工序',
                    }),
                  },
                ],
                initialValue: routerParam.processId ? routerParam.processId : null,
                // initialValue: '40179.1',
              })(
                <Lov
                  code="HME.NC_PROCESS"
                  allowClear
                  textValue={routerParam.processName}
                  disabled={!getFieldValue('prodLineId')}
                  queryParams={{
                    tenantId,
                    prodLineId: getFieldValue('prodLineId'),
                  }}
                  onChange={() => {
                    resetFields(['workcellId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工位'>
              {getFieldDecorator('workcellId', {
                rules: [
                  {
                    required: getFieldValue('processId'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工位',
                    }),
                  },
                ],
                initialValue: routerParam.workcellName ? routerParam.workcellName : null,
                // initialValue: '40185.1',
              })(
                <Lov
                  code="HME.NC_WORKCERLL"
                  allowClear
                  isInput
                  textField="workcellName"
                  textValue={routerParam.workcellName}
                  disabled={!getFieldValue('processId')}
                  queryParams={{
                    tenantId,
                    processId: getFieldValue('processId'),
                  }}
                  onPressEnter={(e)=>this.setWorkcellIdByCode(e.target.value, getFieldValue('processId'))}
                  onChange={(value, item) => {
                    this.setWorkcellId( item);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              {/* <Button onClick={this.toggleForm}>
                {intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button> */}
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={scanningMaterialLotCodeLoading || false}>
                  <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='序列号'>
                    {getFieldDecorator('materialLotCode', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '序列号',
                          }),
                        },
                      ],
                      initialValue: routerParam.snNum ? routerParam.snNum : null,
                      // initialValue: 'A1NDSB21300043',
                    })(
                      <Input onKeyUp={e => this.scanningMaterialLotCode(e, getFieldValue('materialLotCode'))} />
                    )}
                  </Form.Item>
                </Spin>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产品料号'>
                  {getFieldDecorator('materialcode', {
                    initialValue: prodMaterialInfo.materialCode,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产品'>
                  {getFieldDecorator('tagGroupId', {
                    initialValue: prodMaterialInfo.materialName ? prodMaterialInfo.materialName : null,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='班次'>
                  {getFieldDecorator('shiftCode', {
                    initialValue: shiftCode || null,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
      </Form>
    );
  }
}

export default FilterForm;
