/**
 * CosTestYield - COS测试良率维护
 * *
 * @date: 2021/09/06 14:44:42
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */


import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty, isArray } from 'lodash';
import { Button, Collapse } from 'hzero-ui';
import moment from 'moment';

import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import HistoryModal from './HistoryModal';
import LineTable from './LineTable';

const { Panel } = Collapse;

const CosTestYieldPlatform = (props) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [lineSelectedRows, setLineSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'cosTestYieldPlatform/init',
    });
    handleSearch();
  }, []);

  const handleOpenHistoryModal = () => {
    setHistoryVisible(true);
    handleFetchHistoryList();
  };

  const handleCloseHistoryModal = () => {
    setHistoryVisible(false);
  };

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = isUndefined(filterRef.current) ? {} : filterRef.current.formFields;
    dispatch({
      type: 'cosTestYieldPlatform/fetchList',
      payload: filterNullValueObject({
        page: isEmpty(page) ? {} : page,
        ...filterValue,
        creationDateFrom: isEmpty(filterValue.creationDateFrom) ? null : moment(filterValue.creationDateFrom).format(getDateTimeFormat()),
        creationDateTo: isEmpty(filterValue.creationDateTo) ? null : moment(filterValue.creationDateTo).format(getDateTimeFormat()),
        monitorDocNum: isArray(filterValue.monitorDocNum) ? filterValue.monitorDocNum.join(',') : null,
        wafer: isArray(filterValue.wafer) ? filterValue.wafer.join(',') : null,
      }),
    });
  };

  const handleFetchLineList = (page = {}) => {
    const { dispatch } = props;
    if (!isEmpty(selectedRows)) {
      dispatch({
        type: 'cosTestYieldPlatform/fetchLineList',
        payload: {
          page: isEmpty(page) ? {} : page,
          cosMonitorHeaderId: selectedRows[0].cosMonitorHeaderId,
        },
      });
    }
  };

  const handleWaferPass = () => {
    const { dispatch } = props;
    if (selectedRows.length > 0) {
      dispatch({
        type: 'cosTestYieldPlatform/waferPass',
        payload: selectedRows,
      }).then(res => {
        if (res && res.success === "true") {
          notification.success();
          handleSearch();
          setSelectedRows([]);
        } else if (res && res.success === "false") {
          notification.error({ description: res.message });
        }
      });
    }

  };

  const handleFetchHistoryList = (page = {}) => {
    const { dispatch } = props;
    dispatch({
      type: 'cosTestYieldPlatform/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        cosMonitorHeaderId: selectedRows[0].cosMonitorHeaderId,
      },
    });
  };

  const handleAddLine = (materialLotCode) => {
    const { dispatch } = props;
    if (selectedRows.length > 0) {
      dispatch({
        type: 'cosTestYieldPlatform/addLineList',
        payload: {
          list: materialLotCode.map(e => ({
            ...selectedRows[0],
            materialLotCode: e,
          })),
          cosMonitorHeaderId: selectedRows[0].cosMonitorHeaderId,
        },
      }).then(res => {
        if (res && res.failed) {
          notification.warning({ description: res.message });
        } else {
          notification.success();
          handleFetchLineList();
        }

      });
    }
  };

  const handlePassLine = () => {
    const { dispatch } = props;
    if (lineSelectedRows.length > 0) {
      dispatch({
        type: 'cosTestYieldPlatform/passLine',
        payload: {
          cosMonitorHeaderId: selectedRows[0].cosMonitorHeaderId,
          list: lineSelectedRows,
        },
      }).then(res => {
        if (res && res.success === "true") {
          notification.success();
          handleFetchLineList();
          setLineSelectedRows([]);
        } else if (res && res.success === "false") {
          notification.error({ description: res.message });
        }
      });
    }
  };

  const handleChangeSelectedRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  const handleChangeLineSelectedRows = (selectedRowKeys, selectRows) => {
    setLineSelectedRows(selectRows);
  };

  useEffect(() => {
    if (!isEmpty(selectedRows)) {
      handleFetchLineList();
    }
  }, [selectedRows]);

  const {
    fetchListLoading,
    tenantId,
    fetchHistoryListLoading,
    saveHeaderListLoading,
    fetchLineListLoading,
    addLineListLoading,
    cosTestYieldPlatform: {
      headList = [],
      headPagination = {},
      historyPagination = {},
      historyList = [],
      typeList = [],
      lineList = [],
      linePagination = {},
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.cosMonitorHeaderId),
    onChange: handleChangeSelectedRows,
  };
  const filterProps = {
    tenantId,
    typeList,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    tenantId,
    dataSource: headList,
    pagination: headPagination,
    rowSelection,
    loading: fetchListLoading || saveHeaderListLoading,
    onSearch: handleSearch,
  };

  const historyModalProps = {
    visible: historyVisible,
    dataSource: historyList,
    pagination: historyPagination,
    loading: fetchHistoryListLoading,
    onCancel: handleCloseHistoryModal,
    onSearch: handleFetchHistoryList,
  };

  const lineRowSelection = {
    selectedRowKeys: (lineSelectedRows || []).map(e => e.cosMonitorLineId),
    onChange: handleChangeLineSelectedRows,
    getCheckboxProps: record => ({
      disabled: !['NG', 'UNKNOWN'].includes(record.materialLotStatus),
    }),
  };

  const lineTableProps = {
    isEdit: !isEmpty(selectedRows) && selectedRows[0].docStatus === 'NG',
    rowSelection: lineRowSelection,
    dataSource: lineList,
    pagination: linePagination,
    loading: fetchLineListLoading || addLineListLoading,
    onAddLine: handleAddLine,
    onPass: handlePassLine,
  };

  return (
    <React.Fragment>
      <Header title="COS测试良率管理平台">
        <Button
          type="primary"
          disabled={isEmpty(selectedRows) || (!isEmpty(selectedRows) && !['NG', 'UNKNOWN'].includes(selectedRows[0].docStatus))}
          onClick={handleWaferPass}
        >
          WAFER放行
        </Button>
        <Button
          type="default"
          disabled={isEmpty(selectedRows)}
          onClick={handleOpenHistoryModal}
        >
          良率历史
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterProps} />
        <ListTable {...listTableProps} />
        {!isEmpty(selectedRows) && (
          <Collapse bordered={false} defaultActiveKey={['boxPass']}>
            <Panel header="盒子放行" key="boxPass">
              <LineTable {...lineTableProps} />
            </Panel>
          </Collapse>
        )}
      </Content>
      <HistoryModal {...historyModalProps} />
    </React.Fragment>
  );
};

export default connect(({ cosTestYieldPlatform, loading }) => ({
  cosTestYieldPlatform,
  fetchListLoading: loading.effects['cosTestYieldPlatform/fetchList'],
  fetchHistoryListLoading: loading.effects['cosTestYieldPlatform/fetchHistoryList'],
  fetchLineListLoading: loading.effects['cosTestYieldPlatform/fetchLineList'],
  addLineListLoading: loading.effects['cosTestYieldPlatform/addLineList'],
  tenantId: getCurrentOrganizationId(),
}))(CosTestYieldPlatform);
