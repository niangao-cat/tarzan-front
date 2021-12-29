/*
 * @Description: 工位变更历史
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-09 11:22:20
 */

import React, { PureComponent } from 'react';
import { Button, Form, DatePicker, Modal, Table, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
export default class StationChangeHistoryModal extends PureComponent {
  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    const fieldValues = form.getFieldsValue();
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch({ ...fieldValues });
        }
      });
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    onCancel(false);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form: { getFieldDecorator },
      visible,
      updateUserLoading = false,
      dataSource,
      pagination,
      loading,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: '设备  ',
        dataIndex: 'assetEncoding',
        width: 100,
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 120,
      },
      {
        title: '工位描述',
        dataIndex: 'workcellName',
        width: 120,
      },
      {
        title: '事件类型',
        dataIndex: 'eventTypeDesc',
        width: 120,
      },
      {
        title: '事件时间',
        dataIndex: 'eventTime',
        width: 120,
      },
      {
        title: '操作者',
        dataIndex: 'eventByName',
        width: 100,
      },
    ];
    return (
      <Modal
        destroyOnClose
        title='设备工位变更历史'
        visible={visible}
        onCancel={this.onCancel}
        footer={null}
        width={1000}
        confirmLoading={updateUserLoading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label="开始时间"
              >
                {getFieldDecorator('startTime', {})(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='结束时间'
              >
                {getFieldDecorator('endTime', { })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
              <Form.Item>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  {intl.get(`tarzan.acquisition.number.button.reset`).d('重置')}
                </Button>
                <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                  {intl.get('tarzan.acquisition.number.button.search').d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          bordered
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          // rowSelection={{
          //   selectedRowKeys,
          //   type: 'radio',
          //   onChange: onSelectRow,
          // }}
          // onChange={page => this.handleSearch(page)}
          onChange={page => onSearch(page)}
        />
      </Modal>
    );
  }
}
