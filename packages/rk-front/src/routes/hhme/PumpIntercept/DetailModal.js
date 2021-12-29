/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React from 'react';
import { Modal, Form, Row, Col, Table } from 'hzero-ui';

import { FORM_COL_3_LAYOUT } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import ExcelExport from '@/components/ExcelExport';

const ProcessListModal = (props) => {

  const handleClose = () => {
    const { onCancel } = props;
    if (onCancel) {
      onCancel();
    }
  };

  const handleGetFormValue = () => {
    const { interceptId } = props;
    return { interceptId };
  };

  const {
    visible = false,
    dataSource,
    pagination,
    loading,
    tenantId,
    detailInfo,
    onSearch,
    currentRecord,
  } = props;
  const columns = [
    {
      title: '拦截对象',
      width: 120,
      dataIndex: 'interceptObject',
    },
    {
      title: 'SN号',
      width: 80,
      dataIndex: 'snNumber',
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'statusMeaning',
    },
    {
      title: '当前工位',
      width: 80,
      dataIndex: 'workcellName',
    },
    {
      title: '当前工序',
      width: 80,
      dataIndex: 'workcellCode',
    },
    {
      title: '工序描述',
      width: 80,
      dataIndex: 'workcellNameDescription',
    },
  ];

  return (
    <Modal
      destroyOnClose
      width={1100}
      title="拦截详情"
      visible={visible}
      onCancel={handleClose}
      footer={null}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
      placement="right"
      maskClosable
    >
      <Form>
        <Row>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label="拦截数"
            >
              {detailInfo.interceptNumber}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label="放行数"
            >
              {detailInfo.releaseNumber}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <ExcelExport
              exportAsync
              requestUrl={`/mes/v1/${tenantId}/hme-intercept-informations/export`} // 路径
              queryParams={handleGetFormValue}
              fileName="拦截详情.xlsx"
            />
          </Col>
        </Row>
      </Form>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onChange={page => onSearch(page, currentRecord.interceptId)}
        rowKey="interceptWorkcellId"
      />
    </Modal>
  );
};


export default ProcessListModal;