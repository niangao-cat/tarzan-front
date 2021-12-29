/*
 * @Description: 退库检测
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-19 09:18:15
 * @LastEditTime: 2021-01-19 15:18:00
 */

import React, { Component } from 'react';
import { Form, Row, Col, Input, Tooltip } from 'hzero-ui';
import { SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT, FORM_COL_4_LAYOUT } from 'utils/constants';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import scannerImageMat from '@/assets/scannerImageMat.png';
import styles from './index.less';

const SCAN_FORM = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
@Form.create({ fieldNameProp: null })
export default class TopFormInfo extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
  }

  @Bind()
  scanningMaterialLotCode(e, value) {
    const { scaneMaterialCode } = this.props;
    if (e.keyCode === 13) {
      scaneMaterialCode(value);
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, info = {} } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={styles['after-return-top-form-info']}>
        <Row>
          <Col span={7}>
            <Form.Item label="返修序列号" {...SCAN_FORM}>
              {getFieldDecorator('snNum', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '返修序列号',
                    }),
                  },
                ],
              })(
                <Input
                  placeholder="请扫描返修SN"
                  onKeyUp={e => this.scanningMaterialLotCode(e, getFieldValue('snNum'))}
                  prefix={<img style={{ width: '20px' }} src={scannerImageMat} alt="" />}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="产品编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialCode', {})(<span>{info.materialCode}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="产品描述" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialName', {})(
                <Tooltip title={info.materialName}>
                  <div style={{width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{info.materialName}</div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="接收时间" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receiveDate', {})(<span>{info.receiveDate}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="拆箱人" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receiveByName', {})(<span>{info.receiveByName}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物流公司" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('logisticsCompanyMeaning', {})(<span>{info.logisticsCompanyMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物流单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('logisticsNumber', {})(<span>{info.logisticsNumber}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="返回时间" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('creationDate', {})(<span>{info.creationDate}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="签收人" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('createdByName', {})(<span>{info.createdByName}</span>)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
