import React, { Component } from 'react';
import { Form, Row, Col, Input, Tooltip } from 'hzero-ui';
import { SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import styles from './index.less';

const formLayout = {
  labelCol: {
    span: 5,
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
    this.state = {};
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, iqcHeader = {} } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles['top-form-info']}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('iqcNumber', {})(<span>{iqcHeader.iqcNumber}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="接收批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receiptLot', {})(
                <Tooltip title={iqcHeader.receiptLot}>
                  <div className={styles['top-form-info-span']}>{iqcHeader.receiptLot}</div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="接收人" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receiptBy', {})(<span>{iqcHeader.receiptRealName}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验来源" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('docType', {})(<span>{iqcHeader.docTypeMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="来源单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('sourceOrderNum', {})(
                <Tooltip title={iqcHeader.sourceOrderNum}>
                  <div className={styles['top-form-info-span']}>{iqcHeader.sourceOrderNum}</div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="供应商" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('supplierName', {})(
                <Tooltip title={iqcHeader.supplierName}>
                  <div className={styles['top-form-info-span']}>{iqcHeader.supplierName}</div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialCode', {})(<span>{iqcHeader.materialCode}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="物料描述" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialName', {})(
                <Tooltip title={iqcHeader.materialName}>
                  <div className={styles['top-form-info-span']}>{iqcHeader.materialName}</div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="物料数量" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('quantity', {})(<span>{iqcHeader.quantity}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验方式" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionMethodMeaning', {})(<span>{iqcHeader.inspectionMethodMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="建单日期" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('createdDate', {})(<span>{iqcHeader.createdDate}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="单位" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('uomCode', {})(<span>{iqcHeader.uomCode}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验开始时间" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionStartDate', {})(
                <span>{iqcHeader.inspectionStartDate}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验完成时间" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionFinishDate', {})(
                <span>{iqcHeader.inspectionFinishDate}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验时长" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionTime', {})(<span>{iqcHeader.inspectionTime}（小时）</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="加急标示" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('identification', {})(
                <span>{iqcHeader.identificationMeaning}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionType', {})(<span>{iqcHeader.inspectionTypeMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionStatus', {})(
                <span>{iqcHeader.inspectionStatusMeaning}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="备注" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', {})(
                <Tooltip title={iqcHeader.remark}>
                  <div className={styles['top-form-info-span']}>{iqcHeader.remark}</div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="检验结果" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionResultMeaning', {})(<span>{iqcHeader.inspectionResultMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="合格项数" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('okQty', {})(<span>{iqcHeader.okQty}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item label="不良项数" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('ngQty', {})(<span>{iqcHeader.ngQty}</span>)}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="审批意见" {...formLayout}>
              {getFieldDecorator('auditOpinion', {
                initialValue: iqcHeader.auditOpinion,
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
