/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { useState, Fragment } from 'react';
import { Modal, Form, Row, Col, Button, Table } from 'hzero-ui';
import uuid from 'uuid/v4';

import { FORM_COL_3_LAYOUT } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import MultipleLov from '@/components/MultipleLov';

import styles from './index.less';


const ProcessListModal = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);


  const handleChangeSelectRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  const handleAddProcessList = () => {
    const { onUpdateLineList, form: { getFieldValue }, dataSource } = props;
    const newWorkCellList = getFieldValue('workcellCode');
    if (newWorkCellList) {
      const list = newWorkCellList.split(',').filter(e => !dataSource.map(i => i.workcellCode).includes(e)).map(e => ({
        interceptWorkcellId: uuid(),
        workcellCode: e,
        status: 'INTERCEPT',
        statusMeaning: '已拦截',
        _status: 'create',
      })).concat(dataSource);
      onUpdateLineList(list, 'processList', 'processPagination');
    }
  };

  const handlePass = () => {
    const { onPass } = props;
    onPass(selectedRows);
  };

  const handleClose = () => {
    const { onSetVisible, onUpdateLineList } = props;
    onUpdateLineList([], 'processList', 'processPagination');
    onSetVisible(false);
  };

  const handleSave = () => {
    const { onSave } = props;
    onSave('processList');
  };

  const {
    visible = false,
    dataSource,
    loading,
    currentRecord,
    saving,
    passing,
    onSearch,
    pagination,
    tenantId,
    form: { getFieldDecorator },
  } = props;
  const rowSelection = {
    selectedRowKeys: selectedRows.map(e => e.interceptWorkcellId),
    onChange: handleChangeSelectRows,
    getCheckboxProps: ((record) => ({
      disabled: record._status || currentRecord.status === 'NEW',
    })),
  };
  const columns = [
    {
      title: '拦截工序',
      width: 120,
      dataIndex: 'workcellCode',
    },
    {
      title: '工序描述',
      width: 80,
      dataIndex: 'workcellName',
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'statusMeaning',
    },
    {
      title: '放行人',
      width: 80,
      dataIndex: 'releaseByName',
    },
  ];

  return (
    <Modal
      destroyOnClose
      width={1100}
      title="拦截工序"
      visible={visible}
      onCancel={handleClose}
      footer={(
        <Fragment>
          <Button
            style={{ marginRight: '12px' }}
            onClick={() => handleClose()}
          >
            取消
          </Button>
          {currentRecord.status === 'NEW' && (
            <Button
              type="primary"
              onClick={() => handleSave()}
              loading={saving}
            >
              保存
            </Button>
          )}
          {['INTERCEPT', 'PART_INTERCEPT'].includes(currentRecord.status) && (
            <Button
              type="danger"
              onClick={() => handlePass()}
              loading={passing}
            >
              放行
            </Button>
          )}
        </Fragment>
      )}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
      placement="right"
      maskClosable
    >
      {currentRecord.status === 'NEW' && (
        <Form>
          <div className={styles['line-title']}>
            <span />
            <div>批量新增拦截工序</div>
          </div>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label="工序"
              >
                {getFieldDecorator('workcellCode')(
                  <MultipleLov
                    code="HME.FINAL_PROCESS"
                    queryParams={{ tenantId }}
                    lovOptions={{ valueField: 'workcellCode' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Button type="primary" onClick={() => handleAddProcessList()}>新增</Button>
            </Col>
          </Row>
        </Form>
      )}
      <Table
        bordered
        dataSource={dataSource}
        rowSelection={rowSelection}
        columns={columns}
        pagination={pagination}
        onChange={page => onSearch(page, currentRecord.interceptId)}
        loading={loading || saving}
        rowKey="interceptWorkcellId"
      />
    </Modal>
  );
};


export default Form.create({ fieldNameProp: null })(ProcessListModal);
