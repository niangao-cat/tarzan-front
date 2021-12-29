// 批次详情
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { isFunction } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';

@connect(({ chipPreSelection, loading }) => ({
  chipPreSelection,
  fetchLoading: loading.effects['chipPreSelection/queryNoHavingData'],
}))
@Form.create({ fieldNameProp: null })
export default class NoPreSelection extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

   // 查询方法
   @Bind
   onSearch = () => {
     const { dispatch, form } = this.props;
     form.validateFields((errs, values) => {
       if (!errs) {
        dispatch({
          type: 'chipPreSelection/queryNoHavingData',
          payload: {
            containerCode: values.containerCode,
          },
        });
       }
     });
   };

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      dataSource,
      expandUpColseData,
      form,
      fetchLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    // 获取表单的字段属性
    const columns = [
      {
        title: '序号',
        width: 60,
        render: (value, record, index) => index + 1,
      },
      {
        title: '盒子号',
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 150,
      },
      {
        title: '该盒未挑选数',
        dataIndex: 'primaryUomQty',
        width: 150,
      },
    ];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1000}
        onCancel={expandUpColseData}
        visible={expandDrawer}
        footer={null}
        title="未挑选盒子"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={16}>
              <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 10 }} label='容器'>
                {getFieldDecorator('containerCode', {
                  rules: [
                    {
                      required: true,
                      message: "容器必输",
                    },
                  ],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button htmlType="submit" type='primary' onClick={this.onSearch}>
                 查询
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          rowKey="materialLotId"
          columns={columns}
          dataSource={dataSource}
          loading={fetchLoading}
          pagination={{ pageSize: 999999999 }}
          bordered
        />
      </Modal>
    );
  }
}
