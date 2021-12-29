/**
 * PumpFilterRule - 泵浦源组合挑选规则维护
 *
 * @date: 2021/08/23 10:15:52
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */


import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'hzero-ui';
import { isEmpty } from 'lodash';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import {
  getCurrentOrganizationId,
} from 'utils/utils';

import EnterModal from './EnterModal';
import RuleFilterForm from './RuleFilterForm';
import RuleTableList from './RuleTableList';
import BarcodeFilterForm from './BarcodeFilterForm';
import BarcodeTableList from './BarcodeTableList';
import ContainerConfirmForm from './ContainerConfirmForm';
import styles from './index.less';

const PumpFilter = (props) => {
  const [visible, setVisible] = useState(true); // 工位弹窗
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [scanType, setIsScanBarcode] = useState(null); // 条码项数据源类型 ‘barcode’ - 扫描条码，‘lot’ - 筛选批次
  const [selectedRows, setSelectedRows] = useState([]); // 条码勾选项
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpFilter/fetchDefaultSite',
    }).then(res => {
      if (res) {
        const workcellCodeInput = document.getElementsByClassName('work-cell-code-input');
        if (workcellCodeInput) {
          workcellCodeInput[0].focus();
        }
      }
    });
  }, []);

  const handleWorkCellInfo = (workcellCode) => {
    const {
      dispatch,
      pumpFilter: { siteInfo: { siteId } },
    } = props;
    dispatch({
      type: `pumpFilter/fetchWorkCellInfo`,
      payload: {
        workcellCode,
        siteId,
      },
    }).then(res => {
      if (res) {
        setVisible(false);
      }
    });
  };

  const handleFetchRuleList = (params) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpFilter/fetchRuleList',
      payload: {
        ...params,
      },
    });
  };

  const handleResetRuleList = () => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpFilter/updateState',
      payload: {
        ruleList: [],
      },
    });
  };

  const handleFilter = () => {
    const { dispatch, pumpFilter: { siteInfo: { siteId }, workCellInfo: { workcellId }, barcodeList } } = props;
    filterRef.current.ruleFormDom.validateFields((err, value) => {
      if (!err) {
        dispatch({
          type: 'pumpFilter/filterPump',
          payload: {
            ...value,
            siteId,
            workcellId,
            pumpMaterialLotInfoList: barcodeList,
          },
        });
      }
    });
  };

  const handleScanBarcode = (scanCode) => {
    const { dispatch, pumpFilter: { workCellInfo: { workcellId }, barcodeInfo } } = props;
    setIsScanBarcode('barcode');
    dispatch({
      type: 'pumpFilter/scanBarcode',
      payload: {
        scanCode,
        workcellId,
        ...barcodeInfo,
      },
    }).then(res => {
      if (res) {
        const barcodeInput = document.getElementById('pumpFilter_scan-code');
        barcodeInput.focus();
        barcodeInput.select();
      }
    });
  };

  const handleFetchBarcodeByLot = (pumpPreSelectionId, selectionLot) => {
    const { dispatch, pumpFilter: { workCellInfo: { workcellId } } } = props;
    setIsScanBarcode('lot');
    dispatch({
      type: 'pumpFilter/fetchBarcodeByLot',
      payload: {
        pumpPreSelectionId,
        workcellId,
        selectionLot,
      },
    });
    dispatch({
      type: 'pumpFilter/fetchSetNumInfoByLot',
      payload: { selectionLot },
    });
  };

  const handleConfirm = (newContainerCode, barcodeList) => {
    const { dispatch, pumpFilter: { workCellInfo: { workcellId }, barcodeInfo } } = props;
    return dispatch({
      type: 'pumpFilter/filterConfirm',
      payload: {
        defaultStorageLocatorId: barcodeInfo.defaultStorageLocatorId,
        materialLotCodeList: barcodeList,
        newContainerCode,
        workcellId,
      },
    }).then(res => {
      notification.success();
      dispatch({
        type: 'pumpFilter/fetchSetNumInfoByLot',
        payload: { selectionLot: barcodeInfo.selectionLot },
      });
      return res;
    });
  };

  const handleChangeSelectedRows = (record, selected) => {
    let newBarcodeList = [];
    if (selected) {
      newBarcodeList = barcodeList.filter(e => e.groupNum === record.groupNum);
    } else {
      newBarcodeList = selectedRows.filter(e => !(e.groupNum === record.groupNum));
    }
    setSelectedRows(newBarcodeList);
    setConfirmVisible(selected);
  };

  const resetBarcode = () => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpFilter/updateState',
      payload: {
        barcodeInfo: {
          containerQty: 0,
          pumpQty: 0,
        },
        barcodeList: [],
      },
    });
    setIsScanBarcode(undefined);
    setSelectedRows([]);
  };

  const {
    fetchRuleListLoading,
    scanBarcodeLoading,
    tenantId,
    fetchBarcodeInfoLoading,
    fetchDefaultSiteLoading,
    filterPumpLoading,
    filterConfirmLoading,
    pumpFilter: {
      ruleList = [],
      barcodeList = [],
      workCellInfo = {},
      barcodeInfo = {},
      siteInfo = {},
    },
  } = props;


  const ruleFilterProps = {
    tenantId,
    siteInfo,
    qty: !isEmpty(ruleList) ? ruleList[0].qty : 0,
    wrappedComponentRef: filterRef,
    onResetRuleList: handleResetRuleList,
    onSearch: handleFetchRuleList,
  };

  const ruleListTableProps = {
    tenantId,
    dataSource: ruleList,
    loading: fetchRuleListLoading,
  };

  const barcodeFilterProps = {
    barcodeInfo,
    scanType,
    tenantId,
    resetBarcode,
    loading: filterConfirmLoading,
    onFilter: handleFilter,
    onScanBarcode: handleScanBarcode,
    onFetchBarcodeByLot: handleFetchBarcodeByLot,
  };

  const rowSelection = {
    selectedRowKeys: (selectedRows || []).map(e => e.materialLotId),
    onSelect: handleChangeSelectedRows,
    getCheckboxProps: ((record) => ({
      disabled: !record.groupNum,
    })),
  };

  const barcodeListTableProps = {
    rowSelection,
    dataSource: barcodeList,
    loading: fetchBarcodeInfoLoading || scanBarcodeLoading || filterPumpLoading,
  };

  const containerConfirmFormProps = {
    selectedRows,
    visible: confirmVisible,
    onConfirm: handleConfirm,
    onSetVisible: setConfirmVisible,
  };

  const enterModalProps = {
    visible,
    loading: fetchDefaultSiteLoading,
    onChangeVisible: setVisible,
    onFetchWorkCellInfo: handleWorkCellInfo,
  };

  return (
    <React.Fragment>
      <Header title="泵浦源组合筛选">
        <span> 工位：{workCellInfo.workcellCode}</span>
      </Header>
      <Content>
        <Row>
          <Col span={12} className={styles['PumpFilter_rule-box']}>
            <div>
              <div className={styles['line-title']}>
                <span />
                <h2>筛选规则</h2>
              </div>
              <RuleFilterForm {...ruleFilterProps} />
              <div className={styles['head-table']}>
                <RuleTableList {...ruleListTableProps} />
              </div>
            </div>
          </Col>
          {!isEmpty(ruleList) && (
            <Col span={12} className={styles['PumpFilter_barcode-box']}>
              <div>
                <div className={styles['pumpFilter_line-title']}>
                  <span className={styles['pumpFilter_line-title-span']} />
                  <h2>筛选条码</h2>
                  <Button disabled={isEmpty(barcodeList)} onClick={handleFilter} className={styles['pumpFilter_line-title-button']}>筛选</Button>
                </div>
                <BarcodeFilterForm {...barcodeFilterProps} />
                <div className={styles['head-table']}>
                  <BarcodeTableList {...barcodeListTableProps} />
                </div>
                <ContainerConfirmForm {...containerConfirmFormProps} />
              </div>
            </Col>
          )}
        </Row>
      </Content>
      <EnterModal {...enterModalProps} />
    </React.Fragment>
  );
};

export default connect(({ pumpFilter, loading }) => ({
  pumpFilter,
  fetchDefaultSiteLoading: loading.effects['pumpFilter/fetchDefaultSite'],
  fetchRuleListLoading: loading.effects['pumpFilter/fetchRuleList'],
  scanBarcodeLoading: loading.effects['pumpFilter/scanBarcode'],
  filterPumpLoading: loading.effects['pumpFilter/filterPump'],
  filterConfirmLoading: loading.effects['pumpFilter/filterConfirm'],
  fetchRecallBarcodeLoading: loading.effects['pumpFilter/fetchRecallBarcode'],
  saveLineListLoading: loading.effects['pumpFilter/saveLineList'],
  fetchHistoryListLoading: loading.effects['pumpFilter/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(PumpFilter);
