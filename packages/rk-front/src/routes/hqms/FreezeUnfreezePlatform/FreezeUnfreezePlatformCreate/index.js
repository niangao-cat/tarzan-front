/*
 * @Description: 冻结解冻平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:28:10
 * @LastEditTime: 2021-03-04 11:07:47
 */
import React, { useRef, useCallback, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import FilterForm from './FilterForm';
// import TableList from './TableList';

const FreezeUnfreezePlatformCreate = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'freezeUnfreezePlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
    return ()=>{
      dispatch({
        type: 'freezeUnfreezePlatform/updateState',
        payload: {
          createInfo: {},
        },
      });
    };
  }, []);

  const handleFetchSn = useCallback(() => {
    const {
      dispatch,
    } = props;
    const value = handleGetFieldValue();
    if(typeof value === 'object') {
      dispatch({
        type: 'freezeUnfreezePlatform/handleFetchSn',
        payload: value,
      });
    } else {
      notification.warning({ description: value });
    }
  }, []);

  const handleCreate = useCallback(() => {
    const {
      dispatch,
    } = props;
    const value = handleGetFieldValue();
    if(typeof value === 'object') {
      dispatch({
        type: 'freezeUnfreezePlatform/handleCreate',
        payload: {
          ...value,
          // lineList,
        },
      }).then(res => {
        if(res) {
          notification.success();
        }
      });
    } else {
      notification.warning({ description: value });
    }
  }, []);

  // // 查询条码明细
  // const handleFetchBarCodeList = (val) => {
  //   const {
  //     dispatch,
  //   } = props;
  //   dispatch({
  //     type: 'freezeUnfreezePlatform/handleFetchBarCodeList',
  //     payload: {
  //       materialLotId: val,
  //     },
  //   });
  // };

  // 重置
  const handleTableReset = useCallback(() => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'freezeUnfreezePlatform/updateState',
      payload: {
        snList: [],
      },
    });
  }, []);

  const handleGetFieldValue = () => {
    const fieldsValue = countRef.current.formFields;
    const {
      freezeType,
      supplierLot,
      inventoryLot,
      materialVersion,
      purchasedSn,
      testCode,
      workOrderId,
      productionDateFrom,
      productionDateTo,
      wafer,
      hotSinkNum,
      virtualNum,
    } = fieldsValue;
    switch(freezeType) {
      case 'P_INVENTORY':
        if(!supplierLot && !inventoryLot && !materialVersion && isEmpty(purchasedSn)) {
          return '物料必输，同时供应商批次、库存批次、物料版本、采购件序列号必输其中一个!';
        }
        break;
      case 'M_INVENTORY':
        if(!testCode && !workOrderId && isEmpty(productionDateFrom) && isEmpty(productionDateTo)) {
          return '物料必输，同时实验代码、工单、生产时间段必输其中一个!';
        }
      break;
      case 'COS_P_INVENTORY':
        if(!supplierLot && !inventoryLot && !materialVersion) {
          return '物料必输，同时供应商批次、库存批次、物料版本必输其中一个!';
        }
        break;
      case 'COS_CHIP_INVENTORY':
        if(!testCode && !workOrderId && isEmpty(productionDateFrom) && isEmpty(productionDateTo) && isEmpty(wafer)) {
          return '物料必输，同时实验代码、工单、WAFER、生产时间段必输其中一个!';
        }
        break;
      case 'COS_M_INVENTORY':
        if(!testCode && !workOrderId && isEmpty(productionDateFrom) && isEmpty(productionDateTo) && isEmpty(wafer) && isEmpty(hotSinkNum) && isEmpty(virtualNum)) {
          return '物料必输，同时实验代码、工单、WAFER、热沉编码、虚拟号、生产时间段必输其中一个!';
        }
        break;
      default:
    }
    return filterNullValueObject({
      ...fieldsValue,
      virtualNum: isEmpty(virtualNum) ? null : virtualNum.toString(),
      hotSinkNum: isEmpty(hotSinkNum) ? null : hotSinkNum.toString(),
      wafer: isEmpty(wafer) ? null : wafer.toString(),
      productionDateFrom: isEmpty(productionDateFrom) ? null : moment(productionDateFrom).format(DEFAULT_DATETIME_FORMAT),
      productionDateTo: isEmpty(productionDateTo) ? null : moment(productionDateTo).format(DEFAULT_DATETIME_FORMAT),
      purchasedSn: isEmpty(purchasedSn) ? null : purchasedSn.toString(),
    });
  };

  const {
    freezeUnfreezePlatform: {
      freezeType = [],
      cosType = [],
      snList = [],
      createInfo = {},
      defaultSite = {},
      // barCodeList = [],
    },
    tenantId,
    // handleFetchSnLoading,
    handleCreateLoading,
    // handleFetchBarCodeListLoading,
  } = props;
  const filterFormProps = {
    cosType,
    freezeType,
    tenantId,
    snList,
    createInfo,
    defaultSite,
    handleCreateLoading,
    handleFetchSn,
    handleCreate,
    handleTableReset,
  };
  // const tableProps = {
  //   dataSource: snList,
  //   loading: handleFetchSnLoading || handleFetchBarCodeListLoading,
  //   dataSourceBarCode: barCodeList,
  //   onClickBarCode: handleFetchBarCodeList,
  // };
  return (
    <Fragment>
      <Header title="冻结解冻平台" backPath="/hqms/freeze-unfreeze-platform" />
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        {/* <TableList {...tableProps} /> */}
      </Content>
      <ModalContainer ref={registerContainer} />
    </Fragment>
  );
};

export default connect(({ freezeUnfreezePlatform, loading }) => ({
  freezeUnfreezePlatform,
  tenantId: getCurrentOrganizationId(),
  handleFetchSnLoading: loading.effects['freezeUnfreezePlatform/handleFetchSn'],
  handleCreateLoading: loading.effects['freezeUnfreezePlatform/handleCreate'],
  handleFetchBarCodeListLoading: loading.effects['freezeUnfreezePlatform/handleFetchBarCodeList'],
}))(FreezeUnfreezePlatformCreate);
