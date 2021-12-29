/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { useState, Fragment, useEffect } from 'react';
import { Modal, Form, Row, Col, Button, Select, Table } from 'hzero-ui';
import { isArray, uniq } from 'lodash';
import uuid from 'uuid/v4';

import { FORM_COL_3_LAYOUT } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

import styles from './index.less';


const SnListModal = (props) => {
  const [snList, setSnList] = useState([]);

  useEffect(() => {
    setSnList([]);
  }, []);

  const handleAddSnList = () => {
    const { onUpdateLineList, form: { getFieldValue }, dataSource } = props;
    const newSnList = getFieldValue('snList');
    if (newSnList && isArray(newSnList)) {
      const list = newSnList.filter(e => !dataSource.map(i => i.materialLotCode).includes(e)).map(e => ({
        materialLotId: uuid(),
        materialLotCode: e,
        _status: 'create',
      })).concat(dataSource);
      onUpdateLineList(list, 'snList', 'snPagination');
    }
  };

  const handleClose = () => {
    const { onSetVisible, onUpdateLineList } = props;
    onUpdateLineList([], 'snList', 'snPagination');
    onSetVisible(false);
    setSnList([]);
  };

  const handleSave = () => {
    const { onSave } = props;
    onSave('snList');
  };

  const handleOnSearch = (value) => {
    const { form: { getFieldValue, setFieldsValue } } = props;
    const flag = value ? value.every(e => snList.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(snList.concat(newList));
      const formList = getFieldValue('snList').filter(e => uniqueList.includes(e));
      setSnList(uniqueList);
      setFieldsValue({ snList: uniq(formList.concat(newList)) });
    }
  };

  const {
    visible = false,
    dataSource,
    loading,
    currentRecord,
    saving,
    pagination,
    onSearch,
    form: { getFieldDecorator },
  } = props;
  const columns = [
    {
      title: '序号',
      width: 120,
      dataIndex: 'interceptWorkcellCode',
      render: (val, record, index) => {
        const { pageSize, current } = pagination;
        if (record._status === 'create') {
          return index + 1;
        }
        return pageSize * (current - 1) + index + 1;
      },
    },
    {
      title: '例外放行SN',
      width: 80,
      dataIndex: 'materialLotCode',
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
      title="例外放行SN"
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
          <Button
            type="primary"
            onClick={() => handleSave()}
            loading={saving}
          >
            保存
          </Button>
        </Fragment>
      )}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
      placement="right"
      maskClosable
    >
      <Form>
        <div className={styles['line-title']}>
          <span />
          <div>例外放行SN</div>
        </div>
        <Row>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label="SN"
            >
              {getFieldDecorator('snList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val)}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setSnList([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {snList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Button type="primary" onClick={() => handleAddSnList()}>新增</Button>
          </Col>
        </Row>
      </Form>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        onChange={page => onSearch(page, currentRecord.interceptId)}
        loading={loading || saving}
        rowKey="materialLotId"
      />
    </Modal>
  );
};


export default Form.create({ fieldNameProp: null })(SnListModal);