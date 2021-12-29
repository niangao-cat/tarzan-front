/**
 * ProductTraceability - 产品溯源查询
 * @date: 2020/03/16 15:32:45
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Row, Col, Form, Input } from 'hzero-ui';
import { isUndefined, isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { filterNullValueObject } from 'utils/utils';
import styles from '../index.less';

// const modelPrompt = 'tarzan.hmes.message.model.message';
@Form.create({ fieldNameProp: null })
export default class ProductionLines extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandedRowKeys: [],
    };
  }

  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'productTraceability/fetchList',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleSave() {}

  @Bind()
  handleChangeExpandedRowKeys(isExpand, record) {
    const { expandedRowKeys } = this.state;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.id]
      : expandedRowKeys.filter(item => item !== record.id);
    this.setState({
      expandedRowKeys: rowKeys,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { pqcInfo = {}, form: { getFieldDecorator } } = this.props;
    const formLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div className={styles['info-content-pad']}>
        <Form>
          <Row>
            <Col span={6}>
              <Form.Item label="生产线" {...formLayout}>
                {pqcInfo.prodLineName}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="班次" {...formLayout}>
                {pqcInfo.shiftCode}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="产品类型" {...formLayout}>
                {pqcInfo.materialType}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="产品料号" {...formLayout}>
                {pqcInfo.materialCode}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="产品描述" {...formLayout}>
                {pqcInfo.materialName}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="序列号" {...formLayout}>
                {pqcInfo.materialLotCode}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="工单" {...formLayout}>
                {pqcInfo.workOrderNum}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="巡检单号" {...formLayout}>
                {pqcInfo.pqcNumber}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="备注" {...formLayout}>
                {getFieldDecorator('remark', {
                  // rules: [{}],
                  initialValue: pqcInfo.remark? pqcInfo.remark: "",
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="巡检时间" {...formLayout}>
                {pqcInfo.inspectionFinishDate}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="检验人" {...formLayout}>
                {pqcInfo.qcByName}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="结果" {...formLayout}>
                {pqcInfo.inspectionResult}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
