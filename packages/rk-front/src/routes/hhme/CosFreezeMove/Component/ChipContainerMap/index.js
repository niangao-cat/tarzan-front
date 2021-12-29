/* eslint-disable no-unused-vars */
/*
 * @Description: 位置图
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 14:00:12
 * @LastEditTime: 2020-11-17 17:39:36
 */

import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Scrollbars } from 'react-custom-scrollbars';
import ChipInfo from './ChipInfo';
import { isFunction } from 'lodash';
import styles from './index.less';
import { upperCaseChars } from '@/utils/utils';

@Form.create({ fieldNameProp: null })
export default class ChipContainerMap extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      customizelocation: [],
      dataSource: [],
    };
  }

  /**
   * @description: 点击单元格
   * @param {type} dataSource 格子数据
   * @param {type} position 字母+数字位置
   * @param {type} loadRow 数字行
   * @param {type} loadColumn 数字列
   */
  @Bind()
  clickPosition(dataSource, position, index, loadRow, loadColumn) {
    const { clickPosition, formData, multiple } = this.props;
    // 如果是多选模式
    if (multiple) {
      this.setState(({ customizelocation }) => ({
        customizelocation: customizelocation.includes(position) ? customizelocation.filter(item => item !== position) : [...customizelocation, position],
        dataSource: customizelocation.includes(position) ? this.state.dataSource.filter(item => item.loadSequence !== dataSource.loadSequence) : [...this.state.dataSource, dataSource],
      }), () => {
        if (clickPosition) {
          clickPosition(this.state.dataSource, position, index, this.state.customizelocation.includes(position), loadRow, loadColumn, formData);
        }
      });
    } else if (clickPosition) {
      this.setState({ customizelocation: [position] }, () => { clickPosition(dataSource, position, index, loadRow, loadColumn, formData); });
    }
  }

  // 清除选中的数据
  @Bind()
  clearCustomizelocation() {
    this.setState({ customizelocation: [], dataSource: [] });
  }

  @Bind()
  selectAll(propsData, dataSource) {
    this.setState({ customizelocation: propsData, dataSource});
  }

  @Bind()
  renderRow(line, col, popconfirm, dataSource) {
    const { customizelocation } = this.state;
    let index = 0;
    const cols = [];
    for (let i = 0; i < line; i++) {
      const element = [];
      for (let j = 0; j < col; j++) {
        element.push(
          <td style={{ width: '20px', marginRight: '6px' }}>
            <ChipInfo
              clickPosition={this.clickPosition}
              popconfirm={popconfirm}
              dataSource={dataSource[index]}
              position={`${upperCaseChars()[i]}${j + 1}`}
              loadRow={i + 1}
              loadColumn={j + 1}
              index={index}
              customizelocation={customizelocation}
            />
          </td>
        );
        index += 1;
      }
      cols.push(<tr style={{ marginTop: '3px' }}><td style={{ color: '#666' }}>{upperCaseChars()[i]}</td>{element}</tr>);
    }
    return cols;
  }

  @Bind()
  renderColumn(line) {
    const cols = [];
    for (let i = 0; i <= line; i++) {
      if (i === 0) {
        cols.push(
          <td style={{ width: '20px', marginRight: '6px', color: '#666' }} />
        );
      } else {
        cols.push(
          <td style={{ width: '20px', marginRight: '6px', color: '#666' }}>
            {i}
          </td>
        );
      }
    }
    return <tr style={{ marginTop: '3px' }}>{cols}</tr>;
  }

  @Bind()
  onEnterDown() {
    const { form, targetScaneMaterialCode } = this.props;
    if (form.getFieldValue('code')) {
      targetScaneMaterialCode(form.getFieldValue('code'));
    } else {
      notification.error({
        message: '请先录入目标条码',
        placement: 'bottomRight',
      });
    }
  }

  @Bind()
  onFound() {
    const { form, targetScaneMaterialCode, formData = {} } = this.props;
    if ( !formData.materialLotCode ) {
      targetScaneMaterialCode(form.getFieldValue('code'));
    } else {
      notification.error({
        message: '已存在目标条码',
        placement: 'bottomRight',
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      style,
      formFlag,
      popconfirm,
      dataSource = [],
      locationRow,
      locationColumn,
      formData = {},
      moveOver,
      index,
      deleteTargetCard,
      scrollbarsHeight = '285px',
      scrollbarsWidth = '',
    } = this.props;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <React.Fragment>
        <div style={style}>
          {scrollbarsHeight ? (
            <Scrollbars style={{ height: scrollbarsHeight, width: scrollbarsWidth, margin: 'auto' }}>
              <div>
                <table className='chip-table' id='chip-table-id'>
                  {this.renderColumn(locationColumn)}
                  {this.renderRow(locationRow, locationColumn, popconfirm, dataSource)}
                </table>
              </div>
            </Scrollbars>
          ) : (
            <div>
              <table className='chip-table' id='chip-table-id'>
                {this.renderColumn(locationColumn)}
                {this.renderRow(locationRow, locationColumn, popconfirm, dataSource)}
              </table>
            </div>
            )}
          <div>
            {formFlag && (
              <Form>
                <Row>
                  <Col span={12}>
                    <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="条码">
                      {getFieldDecorator('code', {
                        initialValue: formData.materialLotCode,
                      })(
                        <Input onPressEnter={this.onEnterDown} placeholder="请扫描条码" autoFocus disabled={formData.materialLotCode} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item>
                      <Button
                        onClick={() => this.onFound()}
                        type="primary"
                        style={{ marginLeft: '8px' }}
                      >
                        创建
                      </Button>
                      <Button
                        onClick={() => moveOver(formData, 'TARGET')}
                        type="primary"
                        style={{ marginLeft: '8px' }}
                      >
                        完成
                      </Button>
                      <Button
                        type="danger"
                        ghost
                        icon="delete"
                        disabled={formData.materialLotCode}
                        style={{ marginLeft: '8px' }}
                        onClick={() => deleteTargetCard(index)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
