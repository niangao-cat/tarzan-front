/*
 * @Description: 入炉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-07 10:00:07
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-12-24 20:50:33
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table, Input, Button, Divider, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import notification from 'utils/notification';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class InFurnace extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  // 扫描条码
  @Bind()
  scanningInFurnaceCode() {
    const { scanningInFurnaceCode, form } = this.props;
    if (scanningInFurnaceCode) {
      form.validateFields((err, values) => {
        if (!err && values.snNum) {
          // 如果验证成功,则执行onSearch
          scanningInFurnaceCode(values);
        } else {
          notification.error({
            message: '请扫描条码！',
          });
        }
      });
    }
  }

  // 入炉
  @Bind()
  addInFurnace() {
    const { addInFurnace, form } = this.props;
    if (addInFurnace) {
      form.validateFields((err, values) => {
        if (!err && values.snNum) {
          // 如果验证成功,则执行onSearch
          addInFurnace(values);
        } else {
          notification.error({
            message: '请扫描条码！',
          });
        }
      });
    }
  }

  render() {
    const { form, waitInFurnace = {}, addInFurnaceLoading } = this.props;
    const { lineList = [] } = waitInFurnace;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        align: 'center',
        width: 50,
        render: (value, record, index) => index + 1,
      },
      {
        title: '序列号',
        dataIndex: 'materialLotCode',
        width: 130,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 120,
      },
    ];
    return (
      <React.Fragment>
        <Form>
          <Row>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('snNum', {})(
                  <Input placeholder="请扫描条码" style={{ height: '45px' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'end' }}>
              <Form.Item>
                <Button
                  style={{
                    display: 'none',
                  }}
                  htmlType="submit"
                  onClick={() => this.scanningInFurnaceCode()}
                />
                <Button
                  style={{
                    backgroundColor: '#536BD7',
                    color: '#fff',
                    fontSize: '16px',
                    height: '45px',
                  }}
                  htmlType="submit"
                  disabled={lineList.length === 0}
                  onClick={() => this.addInFurnace()}
                  loading={addInFurnaceLoading}
                >
                  入炉
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span={18}>
            <Form style={{ marginTop: '15px' }} className={styles.intFurnace}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="数量">
                <span>{waitInFurnace.sumEoCount}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="前工序">
                <span>{ }</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="前序完工">
                <span>{ }</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="货位">
                <span>{ }</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="标准时长">
                <span>{lineList[0] && lineList[0].standardReqdTimeInProcess}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="进炉操作">
                <span>{waitInFurnace.siteInByName}</span>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Divider dashed style={{ backgroundColor: '#8BACFF' }} />
        <Table
          columns={columns}
          bordered
          dataSource={waitInFurnace.lineList}
          pagination={false}
          scroll={{ x: tableScrollWidth(columns), y: 258 }}
        />
      </React.Fragment>
    );
  }
}
