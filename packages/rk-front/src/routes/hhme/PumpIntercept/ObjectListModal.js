/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { useState, Fragment } from 'react';
import { Modal, Form, Row, Col, Button, Select } from 'hzero-ui';
import { isArray, uniq } from 'lodash';
import uuid from 'uuid/v4';

import { FORM_COL_3_LAYOUT } from 'utils/constants';
import intl from 'utils/intl';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

import styles from './index.less';


const ObjectListModal = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [objectList, setObjectList] = useState([]);


  const handleChangeSelectRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  const handleAddObjectList = () => {
    const { onUpdateLineList, form: { getFieldValue }, dataSource } = props;
    const newObjectList = getFieldValue('objectList');
    if (newObjectList && isArray(newObjectList)) {
      const list = newObjectList.filter(e => !dataSource.map(i => i.interceptObject).includes(e)).map(e => ({
        interceptObject: e,
        interceptObjectId: uuid(),
        status: 'INTERCEPT',
        statusMeaning: '已拦截',
        _status: 'create',
      })).concat(dataSource);
      onUpdateLineList(list, 'objectList', 'objectPagination');
    }
  };

  const handlePass = () => {
    const { onPass } = props;
    onPass(selectedRows);
  };

  const handleClose = () => {
    const { onSetVisible, onUpdateLineList } = props;
    onUpdateLineList([], 'objectList', 'objectPagination');
    onSetVisible(false);
    setObjectList([])
  };

  const handleSave = () => {
    const { onSave } = props;
    onSave('objectList');
  };

  const handleOnSearch = (value) => {
    const { form: { getFieldValue, setFieldsValue } } = props;
    const flag = value ? value.every(e => objectList.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(objectList.concat(newList));
      const formList = getFieldValue('objectList').filter(e => uniqueList.includes(e));
      setObjectList(uniqueList);
      setFieldsValue({ objectList: uniq(formList.concat(newList)) });
    }
  };

  const {
    visible = false,
    dataSource,
    loading,
    currentRecord,
    onSearch,
    pagination,
    passing,
    saving,
    tenantId,
    form: { getFieldDecorator },
  } = props;
  const rowSelection = {
    selectedRowKeys: selectedRows.map(e => e.interceptObjectId),
    onChange: handleChangeSelectRows,
    getCheckboxProps: ((record) => ({
      disabled: record._status || currentRecord.status === 'NEW',
    })),
  };
  const columns = [
    {
      title: '拦截对象',
      width: 120,
      dataIndex: 'interceptObject',
    },
    {
      title: '物料',
      width: 80,
      dataIndex: 'materialCode',
      render: (value, record) =>
        ['create'].includes(record._status) && ['LOT', 'SUPPLIER_LOT'].includes(currentRecord.dimension) ? (
          <Fragment>
            <Form.Item>
              {record.$form.getFieldDecorator('materialCode', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId }}
                  lovOptions={{ valueField: 'materialCode' }}
                  onChange={(val, data) => {
                    record.$form.setFieldsValue({ materialId: data.materialId });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {record.$form.getFieldDecorator('materialId', {
                initialValue: value,
              })(<span />)}
            </Form.Item>
          </Fragment>

        ) : (
          value
        ),
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
      title="拦截对象"
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
            <div>批量新增拦截对象</div>
          </div>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label="拦截对象"
              >
                {getFieldDecorator('objectList')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val)}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setObjectList([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {objectList.map(e => (
                      <Select.Option key={e} value={e}>
                        {e}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Button type="primary" onClick={() => handleAddObjectList()}>新增</Button>
            </Col>
          </Row>
        </Form>
      )}
      <EditTable
        bordered
        dataSource={dataSource}
        rowSelection={rowSelection}
        columns={columns}
        pagination={pagination}
        onChange={page => onSearch(page, currentRecord.interceptId)}
        loading={loading || saving}
        rowKey="interceptObjectId"
      />
    </Modal>
  );
};

export default Form.create({ fieldNameProp: null })(ObjectListModal);
