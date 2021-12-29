// 条码选择
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Icon, Button } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import EditTable from 'components/EditTable';
@Form.create({ fieldNameProp: null })
export default class UpdateCodeDrawer extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  // 条码回车
  @Bind()
  onEnterDownCode(e) {
    const { form, onEnterDownCode } = this.props;
    if (e.keyCode === 13) {
      onEnterDownCode(form.getFieldValue('materialLotCode'));
      form.resetFields(['materialLotCode']);
    }
  }

  // 清空数据
  @Bind()
  handleClearData(){
    const {
      handleClearData,
    } = this.props;
    handleClearData();
  }


  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      dataSource,
      updateMaterialLotCode,
      expandUpColseData,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    // 获取表单的字段属性
    const columns = [
      {
        title: '盒子号',
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: '芯片类型',
        dataIndex: 'cosType',
        width: 120,
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        width: 90,
      },
      {
        title: '库位',
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: 120,
      },
    ];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1000}
        onCancel={expandUpColseData}
        onOk={() => updateMaterialLotCode()}
        visible={expandDrawer}
        footer={null}
        title="盒子号录入"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label='条码'>
                {getFieldDecorator('materialLotCode', {
                })(
                  <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDownCode} />
                )}
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Form.Item>
                <Button onClick={this.handleClearData}>
                 清空
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          rowKey="materialLotId"
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 999999999 }}
          bordered
        />
      </Modal>
    );
  }
}
