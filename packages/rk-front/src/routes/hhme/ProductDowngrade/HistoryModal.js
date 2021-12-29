/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React from 'react';
import { Modal, Form, Button, DatePicker, Table, Row, Col } from 'hzero-ui';
import moment from 'moment';
import { tableScrollWidth, getDateTimeFormat } from 'utils/utils';
import intl from 'utils/intl';

import styles from './index.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};

const HistoryModal = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch, form: { getFieldsValue } } = props;
    if(onSearch) {
      const fields = getFieldsValue();
      onSearch(page, fields);
    }
  };

  const resetForm = () => {
    const { form: { resetFields } } = props;
    resetFields();
  };

  const columns = [
    {
      title: '产品编码',
      width: 120,
      dataIndex: 'materialCode',
    },
    {
      title: '产品描述',
      width: 150,
      dataIndex: 'materialName',
    },
    {
      title: '降级代码',
      dataIndex: 'ncCode',
      width: 100,
    },
    {
      title: '降级代码描述',
      width: 120,
      dataIndex: 'description',
    },
    {
      title: '降级物料编码',
      width: 120,
      dataIndex: 'transitionMaterialCode',
    },
    {
      title: '降级物料描述',
      width: 120,
      dataIndex: 'transitionMaterialName',
    },
    {
      title: '有效性',
      width: 80,
      dataIndex: 'enableFlagMeaning',
    },
    {
      title: '变更时间',
      width: 150,
      dataIndex: 'creationDate',
      align: 'center',
    },
    {
      title: '变更人',
      width: 60,
      dataIndex: 'createdByName',
    },
  ];

  const { visible, loading, pagination, dataSource, onCancel, form: { getFieldDecorator, getFieldValue } } = props;

  return (
    <Modal
      destroyOnClose
      width={1100}
      title='修改历史'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
    >
      <Form>
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }} className={styles['operationPlatform_search-form']}>
          <Row style={{ flex: 'auto' }}>
            <Col span={12}>
              <Form.Item
                label='开始时间'
                {...formItemLayout}
              >
                {getFieldDecorator('creationDateFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                      moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='结束时间'
                {...formItemLayout}
              >
                {getFieldDecorator('creationDateTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                      moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <div className="lov-modal-btn-container">
            <Button onClick={resetForm} style={{ marginRight: 8 }}>
              {intl.get('hzero.common.button.reset').d('重置')}
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
      </Form>
      <div className={styles['head-table']}>
        <Table
          scroll={{
              x: tableScrollWidth(columns),
            }}
          bordered
          loading={loading}
          columns={columns}
          rowKey='jobRecordId'
          dataSource={dataSource}
          pagination={pagination}
          onChange={handleSearch}
        />
      </div>
    </Modal>
  );
};

export default Form.create({ fieldNameProp: null })(HistoryModal);
