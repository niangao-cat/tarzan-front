import React, { Fragment, useState, useRef } from 'react';
import { Modal } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import moment from 'moment';

import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import { Button } from 'components/Permission';
import { getPresentMenu } from '@/utils/utils';

import styles from '../index.less';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

const RecallButton = (props) => {

  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const filterRef = useRef();

  const handleCancel = () => {
    const { dispatch } = props;
    setVisible(false);
    dispatch({
      type: 'pumpFilter/updateState',
      payload: {
        recallBarcodeList: [],
        recallBarcodePagination: {},
      },
    });
  };

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = isUndefined(filterRef.current) ? {} : filterRef.current.formFields;
    const value = filterNullValueObject({
      ...filterValue,
      creationDateFrom: filterValue.creationDateFrom ? moment(filterValue.creationDateFrom).format(getDateTimeFormat()) : null,
      creationDateTo: filterValue.creationDateTo ? moment(filterValue.creationDateTo).format(getDateTimeFormat()) : null,
    });
    if (isEmpty(value)) {
      return notification.warning({ description: '请任意输入一个查询条件！' });
    }
    dispatch({
      type: 'pumpFilter/fetchRecallBarcode',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...value,
      },
    });
  };

  const handleSelectRecallBarcode = (record, selected) => {
    let newBarcodeList = [];
    const { pumpFilter: { recallBarcodeList } } = props;
    if (selected) {
      const sameGroupNumList = recallBarcodeList.filter(e => e.groupNum === record.groupNum);
      if (!isEmpty(sameGroupNumList) && sameGroupNumList.length === sameGroupNumList[0].pumpQty) {
        newBarcodeList = selectedRows.concat(sameGroupNumList);
      } else {
        notification.warning({ description: '当前勾选泵浦源SN所属组合的泵浦源数量，与勾选数量不符，请重新选择' });
      }
    } else {
      newBarcodeList = selectedRows.filter(e => e.groupNum !== record.groupNum);
    }
    setSelectedRows(newBarcodeList);
  };

  const handleRecall = () => {
    const { dispatch, pumpFilter: { recallBarcodePagination } } = props;
    dispatch({
      type: 'pumpFilter/recall',
      payload: selectedRows,
    }).then(res => {
      if (res) {
        notification.success();
        handleSearch(recallBarcodePagination);
        setSelectedRows([]);
      }
    });
  };

  const handleSelectAll = (selected) => {
    const { pumpFilter: { recallBarcodeList } } = props;
    if (selected) {
      const groupNumList = recallBarcodeList.filter(e => e.groupNum);
      const groupNum = [];
      let selectedList = [];
      groupNumList.forEach(e => {
        if (!groupNum.includes(e.groupNum)) {
          const thisGroupNumList = groupNumList.filter(i => i.groupNum === e.groupNum);
          if (!isEmpty(thisGroupNumList) && thisGroupNumList.length === thisGroupNumList[0].pumpQty) {
            selectedList = selectedList.concat(thisGroupNumList);
          }
          groupNum.push(e.groupNum);
        }
      });
      setSelectedRows(selectedList);
    } else {
      setSelectedRows([]);
    }
  };

  const {
    fetchRecallBarcodeLoading,
    tenantId,
    pumpFilter: {
      recallBarcodeList = [],
      recallBarcodePagination = {},
    },
    presentMenu,
  } = props;

  const filterProps = {
    tenantId,
    onSearch: handleSearch,
    wrappedComponentRef: filterRef,
  };

  const rowSelection = {
    selectedRowKeys: (selectedRows || []).map(e => e.materialLotId),
    onSelect: handleSelectRecallBarcode,
    onSelectAll: handleSelectAll,
  };

  const listTableProps = {
    rowSelection,
    loading: fetchRecallBarcodeLoading,
    dataSource: recallBarcodeList,
    pagination: recallBarcodePagination,
    onSearch: handleSearch,
  };

  return (
    <Fragment>
      <Button
        permissionList={[
          {
            code: `${presentMenu.name}.ps.button.recall`,
            type: 'button',
          },
        ]}
        onClick={handleOpenModal}
      >
        撤回
      </Button>
      <Modal
        destroyOnClose
        width={1300}
        title='筛选撤回'
        visible={visible}
        onCancel={handleCancel}
        footer={(
          <Fragment>
            <Button type="default" onClick={handleCancel}>取消</Button>
            <Button type="primary" disabled={isEmpty(selectedRows)} onClick={handleRecall}>撤回</Button>
          </Fragment>
        )}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <FilterForm {...filterProps} />
        <div className={styles['head-table']}>
          <ListTable {...listTableProps} />
        </div>
      </Modal>
    </Fragment>

  );
};

export default connect(({ pumpFilter, loading, global }) => ({
  pumpFilter,
  fetchRecallBarcodeLoading: loading.effects['pumpFilter/fetchRecallBarcode'],
  presentMenu: getPresentMenu(global),
  tenantId: getCurrentOrganizationId(),
}))(RecallButton);
