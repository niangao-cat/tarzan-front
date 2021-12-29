/*
 * @Description: 冻结解冻平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:28:10
 * @LastEditTime: 2021-03-04 09:38:48
 */
import React, { useRef, Fragment, useEffect, useCallback, useState } from 'react';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Button } from 'hzero-ui';
import { isEmpty, isUndefined, isArray } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import BatchFilterForm from './BatchFilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';
import styles from './index.less';

const FreezeUnfreezePlatform = (props) => {
  const countRef = useRef();
  const batchFormRef = useRef();
  const [selectedHeadRowKeys, setSelectedHeadRowKeys] = useState([]);
  const [selectHeadRows, setSelectedHeadRows] = useState([]);
  const [selectedLineRows, setSelectedLineRows] = useState([]);
  const [selectedKeys, setSelectedLineKeys] = useState([]);

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/batchLovData',
      payload: {
        tenantId,
      },
    });
    handleFetchHeadList();
  }, []);

  const handleFetchHeadList = useCallback((fields = {}) => {
    const {
      dispatch,
    } = props;
    const fieldsValue = countRef.current.formFields;
    dispatch({
      type: 'freezeUnfreezePlatform/handleFetchHeadList',
      payload: filterNullValueObject({
        ...fieldsValue,
        productionDateFrom: isUndefined(fieldsValue.productionDateFrom)
          ? null
          : moment(fieldsValue.productionDateFrom).format(DEFAULT_DATETIME_FORMAT),
        productionDateTo: isUndefined(fieldsValue.productionDateTo)
          ? null
          : moment(fieldsValue.productionDateTo).format(DEFAULT_DATETIME_FORMAT),
        freezeDocStatus: isArray(fieldsValue.freezeDocStatus) ? fieldsValue.freezeDocStatus.join(',') : null,
        page: isEmpty(fields) ? {} : fields,
        hotSinkNum: isArray(fieldsValue.hotSinkNum) ? fieldsValue.hotSinkNum.toString() : null,
        virtualNum: isArray(fieldsValue.virtualNum) ? fieldsValue.virtualNum.toString() : null,
      }),
    }).then(res => {
      if (res) {
        dispatch({
          type: 'freezeUnfreezePlatform/updateState',
          payload: {
            lineList: [],
          },
        });
        setSelectedHeadRowKeys([]);
        setSelectedLineRows([]);
        setSelectedLineKeys([]);
      }
    });
  }, []);

  // 跳转创建界面
  const createDate = () => {
    const { history, dispatch } = props;
    history.push(`/hqms/freeze-unfreeze-platform/create`);
    dispatch({
      type: 'freezeUnfreezePlatform/updateState',
      payload: {
        snList: [],
      },
    });
  };

  const onFetchLine = useCallback((val, page = {}) => {
    const {
      dispatch,
    } = props;
    const fieldsValue = batchFormRef.current.formFields;
    dispatch({
      type: 'freezeUnfreezePlatform/handleFetchLineList',
      payload: {
        freezeDocId: val[0],
        materialLotCode: fieldsValue.barcodeInputList.length > 0 ? fieldsValue.barcodeInputList.toString() : null,
        page,
      },
    });
    setSelectedLineRows([]);
    setSelectedLineKeys([]);
  }, []);

  const handleChangeSelectedHeadRows = (selectedRowKeys, selectedRows) => {
    setSelectedHeadRowKeys(selectedRowKeys);
    setSelectedHeadRows(selectedRows);
    onFetchLine(selectedRowKeys);
  };

  // 查询条码明细
  const handleFetchBarCodeList = (val) => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/handleFetchBarCodeList',
      payload: {
        materialLotId: val,
      },
    });
  };

  const handleExport = () => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/handleExport',
      payload: {
        freezeDocId: selectedHeadRowKeys[0],
      },
    }).then(res => {
      if (res) {
        const file = new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
        );
        const fileURL = URL.createObjectURL(file);
        const fileName = '冻结解冻数据.xls';
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  };

  // 整单解冻
  const handleUnfreeze = () => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/handleUnfreeze',
      payload: {
        freezeDocId: selectedHeadRowKeys[0],
      },
    }).then(res => {
      if (res) {
        notification.success();
        handleFetchHeadList();
      }
    });
  };

  // 选择行上的数据解冻
  const handleLineUnfreeze = useCallback((head, line) => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/handleLineUnfreeze',
      payload: {
        freezeDocId: head[0],
        lineList: line,
      },
    }).then(res => {
      if (res) {
        notification.success();
        onFetchLine();
      }
    });
  }, []);

  const onSelectLine = (selectedRowKeys, selectedRows) => {
    setSelectedLineKeys(selectedRowKeys);
    setSelectedLineRows(selectedRows);
  };

  // 审核
  const handleApproval = () => {
    const {
      dispatch,
    } = props;
    if (selectHeadRows[0].freezeDocStatus === 'FREEZED') {
      dispatch({
        type: 'freezeUnfreezePlatform/handleApproval',
        payload: {
          freezeDocId: selectedHeadRowKeys[0],
        },
      }).then(res => {
        if (res) {
          notification.success();
          handleFetchHeadList();
        }
      });
    } else {
      notification.warning({ description: '单据未冻结，不允许提交审批!' });
    }
  };

  const handleFreeze = () => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/freeze',
      payload: {
        freezeDocId: selectedHeadRowKeys[0],
      },
    }).then(res => {
      if (res) {
        notification.success();
        handleFetchHeadList();
        setSelectedHeadRowKeys([]);
      }
    });
  };

  const {
    freezeUnfreezePlatform: {
      freezeType = [],
      headList = [],
      headListPagination = {},
      lineList = [],
      barCodeList = [],
      cosType = [],
      freezeStatus = [],
      linePagination,
    },
    tenantId,
    handleFetchHeadListLoading,
    handleFetchLineListLoading,
    handleFetchLineListSnLoading,
    handleFetchBarCodeListLoading,
    handleExportLoading,
    handleUnfreezeLoading,
    handleLineUnfreezeLoading,
    handleApprovalLoading,
    freezeLoading,
  } = props;
  const filterFormProps = {
    cosType,
    freezeType,
    tenantId,
    freezeStatus,
    handleFetchList: handleFetchHeadList,
  };
  const batchFilterFormProps = {
    loading: handleLineUnfreezeLoading,
    selectedHeadRowKeys,
    selectedLineRows,
    handleLineUnfreeze,
    onFetchLine,
  };
  const headTableProps = {
    dataSource: headList,
    pagination: headListPagination,
    loading: handleFetchHeadListLoading || freezeLoading,
    selectedHeadRowKeys,
    selectHeadRows,
    handleFetchHeadList,
    onSelectHead: handleChangeSelectedHeadRows,
  };
  const lineTableProps = {
    selectedHeadRowKeys,
    dataSource: lineList,
    pagination: linePagination,
    selectedLineRows: selectedKeys,
    loading: handleFetchLineListLoading || handleFetchLineListSnLoading || handleFetchBarCodeListLoading || freezeLoading,
    onSelectLine,
    dataSourceBarCode: barCodeList,
    onFetchLine,
    onClickBarCode: handleFetchBarCodeList,
  };
  return (
    <Fragment>
      <Header title="冻结解冻平台">
        <Button
          type="primary"
          icon='plus'
          onClick={() => createDate()}
        >
          创建
        </Button>
        <Button
          type="primary"
          icon='export'
          disabled={selectedHeadRowKeys.length === 0}
          onClick={handleExport}
          loading={handleExportLoading}
        >
          导出
        </Button>
        <Button
          type="primary"
          disabled={selectedHeadRowKeys.length === 0}
          onClick={() => handleApproval()}
          loading={handleApprovalLoading}
        >
          提交审批
        </Button>
        <Button
          type="primary"
          loading={handleUnfreezeLoading}
          onClick={handleUnfreeze}
          disabled={selectedHeadRowKeys.length === 0}
        >
          整单解冻
        </Button>
        <Button
          type="primary"
          loading={freezeLoading}
          disabled={selectedHeadRowKeys.length === 0}
          onClick={() => handleFreeze()}
        >
          冻结
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <HeadTable {...headTableProps} />
        <div className={styles['freeze-unfreeze-line']}>
          <BatchFilterForm {...batchFilterFormProps} wrappedComponentRef={batchFormRef} />
          <LineTable {...lineTableProps} />
        </div>
      </Content>
    </Fragment>
  );
};

export default connect(({ freezeUnfreezePlatform, loading }) => ({
  freezeUnfreezePlatform,
  tenantId: getCurrentOrganizationId(),
  handleFetchHeadListLoading: loading.effects['freezeUnfreezePlatform/handleFetchHeadList'],
  handleFetchLineListLoading: loading.effects['freezeUnfreezePlatform/handleFetchLineList'],
  handleFetchLineListSnLoading: loading.effects['freezeUnfreezePlatform/handleFetchLineListSn'],
  handleFetchBarCodeListLoading: loading.effects['freezeUnfreezePlatform/handleFetchBarCodeList'],
  handleExportLoading: loading.effects['freezeUnfreezePlatform/handleExport'],
  handleUnfreezeLoading: loading.effects['freezeUnfreezePlatform/handleUnfreeze'],
  handleLineUnfreezeLoading: loading.effects['freezeUnfreezePlatform/handleLineUnfreeze'],
  handleApprovalLoading: loading.effects['freezeUnfreezePlatform/handleApproval'],
  freezeLoading: loading.effects['freezeUnfreezePlatform/freeze'],
}))(FreezeUnfreezePlatform);
