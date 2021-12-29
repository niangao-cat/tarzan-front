/*
 * @Description: IQC检验顶部form信息
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-20 10:45:01
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-20 15:40:56
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col, Input, InputNumber, Select, Tooltip } from 'hzero-ui';
import { SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT, FORM_COL_4_LAYOUT } from 'utils/constants';
import styles from './index.less';
import add from '@/assets/add.png';

const FORM_COL_2_LAYOUT = {
  span: 12,
};

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@Form.create({ fieldNameProp: null })
export default class TopFormInfo extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, inspectHead=[], resultMap, scanningBarCodeVisible } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles['top-form-info-pad']}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="接收批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receiptLot', {})(<span>{inspectHead.receiptLot}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={<span>接&ensp;收&ensp;人</span>} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receiptByName', {})(<span>{inspectHead.receiptByName}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验来源" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('docTypeMeaning', {})(<span>{inspectHead.docTypeMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="库位" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('locatorCode', {})(<span>{inspectHead.locatorCode}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialCode', {})(<span>{inspectHead.materialCode}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={<span>供&ensp;应&ensp;商</span>} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('supplierName', {})(<span>{inspectHead.supplierName}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label="来源单号" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('fromDocNum', {})(<span>{inspectHead.fromDocNum}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料描述" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialName', {})(
                <Tooltip title={inspectHead.materialName}>
                  <div className={styles['top-form-info-span']}>{inspectHead.materialName}</div>
                </Tooltip>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="建单日期" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('createdDate', {})(<span>{inspectHead.createdDate}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label="物料数量" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('quantity', {})(<span>{inspectHead.quantity}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={<span>单&emsp; &ensp;&ensp;位</span>} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('uomName', {})(<span>{inspectHead.uomName}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料版本" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialVersion', {})(<span>{inspectHead.materialVersion}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label="检验开始" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>{inspectHead.inspectionStartDate}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="剩余时长" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionTime', {})(<span>{`${inspectHead.inspectionTime ? inspectHead.inspectionTime : ''}h`}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验方式" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionMethodMeaning', {})(<span>{inspectHead.inspectionMethodMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label="完成时间" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionFinishDate', {})(<span>{inspectHead.inspectionFinishDate}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionTypeMeaning', {})(<span>{inspectHead.inspectionTypeMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionStatusMeaning', {})(<span>{inspectHead.inspectionStatusMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label="IQC版本" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('iqcVersion', {})(<span>{inspectHead.iqcVersion}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验结果" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionResult', {
                initialValue: inspectHead.inspectionResultMeaning || undefined,
              })
                (
                  <Select>
                    {resultMap.map(item => (
                      <Select.Option style={{ backgroundColor: item.meaning === "OK" ? '#1AC0A6' : item.meaning === "NG" ? "#FE6767" : "white", color: 'white' }} key={item.value} value={item.value}>
                        <span style={{ backgroundColor: item.meaning === "OK" ? '#1AC0A6' : item.meaning === "NG" ? "#FE6767" : "white", color: 'white' }}>{item.meaning}</span>
                      </Select.Option>
                    ))}
                  </Select>
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="合格项数" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('okQty', {
                initialValue: inspectHead.okQty,
              })(
                <InputNumber
                  defaultValue={inspectHead.okQty}
                  style={{ width: '100%' }}
                  min={0}
                />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label="不良项数" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('ngQty', {
                initialValue: inspectHead.ncQty,
              })(
                <InputNumber
                  disabled
                  defaultValue={inspectHead.ncQty}
                  style={{ width: '88%' }}
                  min={0}
                />
              )}
              <img
                src={add}
                alt=""
                onClick={() => scanningBarCodeVisible()}
                style={{ width: '20px', height: '20px', cursor: 'pointer', margin: '-3px 0px 0px 4px' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label={<span>备&emsp;&ensp;&ensp;注</span>} {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', {
                initialValue: inspectHead.remark,
              })(<Input style={{ width: '95%' }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
