/*
 * @Description: form
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-14 16:55:39
 * @LastEditTime: 2020-11-02 15:02:14
 */
import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, InputNumber, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import { isFunction } from 'lodash';
import { connect } from 'dva';
import scannerImageMat from '@/assets/scannerImageMat.png';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@connect(({ productionDataCollection }) => ({
  productionDataCollection,
}))
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    const {
      dispatch,
      productionDataCollection: {
        headInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'productionDataCollection/updateState',
      payload: {
        headInfo: {
          ...headInfo,
          materialId: '',
          materialCode: '',
          qty: '',
          siteInDate: '',
          siteOutDate: '',
          remark: '',
          collectHeaderId: '',
        }, // 头信息
        tableData: [],
        pagination: {}, // 分页数据
      },
    });
    form.resetFields();
  }

  // 扫描序列号
  @Bind()
  scanningMaterialLotCode(e, value, operationId) {
    const { scanningMaterialLotCode } = this.props;
    if (e.keyCode === 13) {
      scanningMaterialLotCode(value, operationId);
    }
  }

  // 更新头数据
  @Bind()
  updateHeadInfo(e) {
    const { updateHeadInfo } = this.props;
    if (e.keyCode === 13) {
      updateHeadInfo();
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, tenantId, headInfo, workcellInfo, querySnMaterialQty, handleFinish } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };
    const { operationList = [] } = workcellInfo;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工艺">
              {getFieldDecorator('operationId', {
                rules: [
                  {
                    required: true,
                    message: '工艺不能为空',
                  },
                ],
                initialValue: operationList.length === 1 && operationList[0].operationId,
              })(
                <Select style={{ width: '100%' }} allowClear disabled={headInfo.siteOutDate}>
                  {operationList.map(item => {
                    return (
                      <Select.Option value={item.operationId} key={item.operationId}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="序列号">
              {getFieldDecorator('dataRecordCode', {
                rules: [
                  {
                    required: true,
                    message: '序列号不能为空',
                  },
                ],
              })(
                <Input
                  placeholder="请扫描待采集SN条码"
                  disabled={headInfo.siteOutDate}
                  onKeyUp={e => this.scanningMaterialLotCode(e, getFieldValue('dataRecordCode'), getFieldValue('operationId'))}
                  prefix={<img style={{ width: '20px' }} src={scannerImageMat} alt="" />}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料编码">
              {getFieldDecorator('materialId', {
                rules: [
                  {
                    required: true,
                    message: '物料编码不能为空',
                  },
                ],
                initialValue: headInfo.materialId ? headInfo.materialId : null,
              })(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  disabled={headInfo.collectHeaderId||headInfo.siteOutDate}
                  textValue={headInfo.materialCode}
                  onChange={(value) => {
                    form.resetFields('qty');
                    querySnMaterialQty(value);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="数量">
              {getFieldDecorator('qty', {
                rules: [
                  {
                    required: true,
                    message: '数量不能为空',
                  },
                ],
                initialValue: headInfo.qty,
              })(
                <InputNumber
                  onKeyUp={e => this.updateHeadInfo(e)}
                  disabled={headInfo.collectHeaderId||headInfo.siteOutDate}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => handleFinish()}
                disabled={headInfo.siteOutDate}
              >
                完成
              </Button>
              {/* <Button onClick={this.handleFormReset}>
                打印
              </Button> */}
              <Button onClick={this.handleFormReset}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工位">
              {getFieldDecorator('workcellName', {})(<span>{workcellInfo.workcellName}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="开始时间">
              {getFieldDecorator('siteInDate', {})(<span>{headInfo.siteInDate}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="完成时间">
              {getFieldDecorator('siteOutDate', {})(<span>{headInfo.siteOutDate}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={15}>
            <Form.Item {...formItemLayout} label="特殊备注">
              {getFieldDecorator('remark', {
                initialValue: headInfo.remark,
              })(<Input disabled={headInfo.siteOutDate} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
