// 头信息
import React, { Component } from 'react';
import { Form, Row, Col, Select, Tooltip, Input, Radio } from 'hzero-ui';
import { SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT, FORM_COL_4_LAYOUT, EDIT_FORM_ITEM_LAYOUT_COL_2 } from 'utils/constants';
import styles from './index.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
    const { form, inspectHead=[], resultMap } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles['top-form-info']}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialCode', {})(<span>{inspectHead.materialCode}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料描述" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialName', {})(
                <Tooltip title={inspectHead.materialName}>
                  <div className={styles['top-form-info-span']}>{inspectHead.materialName}</div>
                </Tooltip>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料版本" {...EDIT_FORM_ITEM_LAYOUT_COL_2}>
              {getFieldDecorator('materialVersion', {})(<span>{inspectHead.materialVersion}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="条码数量" {...EDIT_FORM_ITEM_LAYOUT_COL_2}>
              {getFieldDecorator('quantity', {})(<span>{inspectHead.quantity}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工&ensp;单&ensp;号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<span>{inspectHead.workOrderNum}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={<span>执行作业</span>} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('eoNum', {})(<span>{inspectHead.eoNum}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="销售订单" {...EDIT_FORM_ITEM_LAYOUT_COL_2}>
              {getFieldDecorator('soNumber', {})(<span>{`${inspectHead.soNumber||'_'}&${inspectHead.soLineNumber||'_'}`}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="质检单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('oqcNumber', {})(
                <Tooltip title={inspectHead.materialName}>
                  <div className={styles['top-form-info-span']}>{inspectHead.oqcNumber}</div>
                </Tooltip>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="单据状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionStatusMeaning', {})(<span>{inspectHead.inspectionStatusMeaning}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验结果" style={{'marginLeft': '-28%'}} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionResult', {
                initialValue: inspectHead.inspectionResultMeaning|| "",
              })
              (
                // <Select>
                //   {resultMap.map(item => (
                //     <Select.Option style={{ backgroundColor: item.meaning==="OK"? '#1AC0A6': item.meaning==="NG"?"#FE6767":"white", color: 'white'}} key={item.value} value={item.value}>
                //       <span style={{ backgroundColor: item.meaning==="OK"? '#1AC0A6': item.meaning==="NG"?"#FE6767":"white", color: 'white'}}>{item.meaning}</span>
                //     </Select.Option>
                //   ))}
                // </Select>
                <RadioGroup>
                  {resultMap.map(item => (
                    <Radio style={{ backgroundColor: item.meaning==="OK"? '#1AC0A6': item.meaning==="NG"?"#FE6767":"white", color: 'white'}} key={item.value} value={item.value}>
                      <span style={{ backgroundColor: item.meaning==="OK"? '#1AC0A6': item.meaning==="NG"?"#FE6767":"white", color: 'white'}}>{item.meaning}</span>
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={<span>质检时间</span>} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionTime', {})(<span>{inspectHead.inspectionTime}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="备&ensp;&ensp;&ensp;&ensp;注" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', { initialValue: inspectHead.remark|| ""})(<Input style={{width: '500px'}} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
