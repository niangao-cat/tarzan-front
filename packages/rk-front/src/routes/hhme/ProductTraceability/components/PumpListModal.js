/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { useState, Fragment } from 'react';
import { Modal, Button, Table, Row, Col, Form } from 'hzero-ui';
import { isEmpty, isArray } from 'lodash';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};

const PumpListModal = (props) => {
  const [visible, setVisible] = useState(false);

  const handleOpenModal = () => {
    const { onFetchPumpList } = props;
    if (onFetchPumpList) {
      onFetchPumpList();
    }
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const { dataSource = [], loading, pumpInfo } = props;
  const tagColumns = isEmpty(pumpInfo) ? [] : pumpInfo.humePingVOList.map(e => {
    return {
      title: e.tagDescription,
      dataIndex: e.tagCode,
      width: 100,
      render: (val, record) => {
        const { humePingVOList } = record;
        const tagObj = isArray(humePingVOList) ? humePingVOList.find(i => i.tagCode === e.tagCode) : {};
        return isEmpty(tagObj) ? null : tagObj.result;
      },
    };
  });
  const columns = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'orderSeq',
      render: (val, record, index) => index + 1,
    },
    {
      title: '泵浦源组合SN',
      width: 150,
      dataIndex: 'hmePumpingSourceCombineSn',
    },
    {
      title: '泵浦源SN',
      width: 150,
      dataIndex: 'hmePumpingSourceSn',
    },
    {
      title: '位置',
      width: 80,
      dataIndex: 'position',
    },
  ].concat(tagColumns);
  return (
    <Fragment>
      <Button onClick={() => handleOpenModal()}>泵浦源性能</Button>
      <Modal
        width={1100}
        title='泵浦源性能数据展示'
        visible={visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label='功率之和'
              {...formItemLayout}
            >
              {pumpInfo.powerSum}
            </Form.Item>
          </Col>
        </Row>
        <Table
          bordered
          loading={loading}
          rowKey="eoId"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Modal>
    </Fragment>
  );
};

export default PumpListModal;