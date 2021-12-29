/*
 * @Description: 权限以及消息推送设置
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:48:45
 * @LastEditTime: 2021-03-19 10:18:17
 */

import React, { useRef, Fragment, useEffect, useCallback, useState } from 'react';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, addItemToPagination, getEditTableData, delItemToPagination } from 'utils/utils';
import { Tabs, Spin } from 'hzero-ui';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import uuid from 'uuid/v4';
import FilterForm from './FilterForm';
import ProdLineTable from './ProdLineTable';
import WarehouseTable from './WarehouseTable';

const Create = (props) => {
  const countRef = useRef();
  const [editFlag, setEditFlag] = useState(false);

  useEffect(() => {
    const { dispatch, tenantId, match } = props;
    const { operation } = match.params;
    dispatch({
      type: 'permissionsMessagePushSettings/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'permissionsMessagePushSettings/getSiteList',
      payload: {
        tenantId,
      },
    });
    if (operation !== 'create') {
      handleFetchWarehouseList({}, operation);
      handleFetchProdLineList({}, operation);
      handleHeadDetail(operation);
      setEditFlag(true);
    }
    return () => {
      dispatch({
        type: 'permissionsMessagePushSettings/updateState',
        payload: {
          warehouseList: [],
          warehouseListPagination: {},
          prodLineList: [],
          prodLineListPagination: {},
          headDetail: {},
        },
      });
    };
  }, []);

  // 新建
  const handleCreate = (type) => {
    const {
      dispatch,
      permissionsMessagePushSettings: {
        warehouseList = [],
        warehouseListPagination = {},
        prodLineList = [],
        prodLineListPagination = {},
      },
    } = props;
    let payload;
    switch (type) {
      case 'warehouseList':
        payload = {
          warehouseList: [
            {
              privilegeId: uuid(),
              detailObjectType: 'WAREHOUSE',
              _status: 'create',
            },
            ...warehouseList,
          ],
          warehouseListPagination: addItemToPagination(warehouseList.length, warehouseListPagination),
        };
        break;
      case 'prodLineList':
        payload = {
          prodLineList: [
            {
              privilegeId: uuid(),
              detailObjectType: 'PROD_LINE',
              _status: 'create',
            },
            ...prodLineList,
          ],
          prodLineListPagination: addItemToPagination(prodLineList.length, prodLineListPagination),
        };
        break;
      default:
        break;
    }
    dispatch({
      type: 'permissionsMessagePushSettings/updateState',
      payload,
    });
  };

  // 删除
  const deleteData = (record, index, type) => {
    const {
      dispatch,
      permissionsMessagePushSettings: {
        warehouseList = [],
        warehouseListPagination = {},
        prodLineList = [],
        prodLineListPagination = {},
      },
      match,
    } = props;
    const { operation } = match.params;
    let payload;
    let typepath;
    if (record._status) {
      switch (type) {
        case 'warehouseList':
          typepath = 'permissionsMessagePushSettings/updateState';
          warehouseList.splice(index, 1);
          payload = {
            warehouseList,
            warehouseListPagination: delItemToPagination(1, warehouseListPagination),
          };
          break;
        case 'prodLineList':
          typepath = 'permissionsMessagePushSettings/updateState';
          prodLineList.splice(index, 1);
          payload = {
            prodLineList,
            prodLineListPagination: delItemToPagination(1, prodLineListPagination),
          };
          break;
        default:
          break;
      }
      dispatch({
        type: typepath,
        payload,
      });
    } else {
      dispatch({
        type: 'permissionsMessagePushSettings/handleDelete',
        payload: {
          ...record,
        },
      }).then(res => {
        if (res) {
          if (type === 'warehouseList') {
            handleFetchWarehouseList(warehouseListPagination, operation);
          } else {
            handleFetchProdLineList(prodLineListPagination, operation);
          }
        }
      });
    }
  };

  // 保存数据
  const handleSave = (values) => {
    const {
      dispatch,
      permissionsMessagePushSettings: {
        warehouseList = [],
        headDetail = {},
        prodLineList = [],
      },
      match,
      history,
    } = props;
    const { operation } = match.params;
    if (checkTableForm(warehouseList) && checkTableForm(prodLineList)) {
      const warehouseData = getEditTableData(warehouseList, ['privilegeId']);
      const prodLineData = getEditTableData(prodLineList, ['privilegeId']);
      const arr = [];
      warehouseData.concat(prodLineData).forEach(ele => {
        arr.push({
          ...ele,
          privilegeId: operation === 'create' ? null : operation,
        });
      });
      dispatch({
        type: 'permissionsMessagePushSettings/handleSave',
        payload: {
          ...headDetail,
          lineList: arr,
          ...values,
        },
      }).then(res => {
        if (res) {
          setEditFlag(true);
          notification.success();
          history.push(`/hqms/permissions-message-push-settings/${res.privilegeId}`);
          handleFetchWarehouseList({}, res.privilegeId);
          handleFetchProdLineList({}, res.privilegeId);
          handleHeadDetail(res.privilegeId);
        }
      });
    } else {
      notification.warning({
        description: '当前数据存在未输入值，请检查 !',
      });
    }
  };

  // 校验可编辑table的必输性
  const checkTableForm = (list) => {
    let editFlags = true;
    const arr = list.filter(
      ele => ele._status === 'update' || ele._status === 'create'
    );
    arr.forEach(ele => {
      ele.$form.validateFields(err => {
        if (err) {
          editFlags = false;
        }
      });
    });
    return editFlags;
  };

  // 仓库查询
  const handleFetchWarehouseList = useCallback((fields = {}, operation) => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'permissionsMessagePushSettings/handleFetchWarehouseList',
      payload: {
        privilegeId: operation,
        detailObjectType: 'WAREHOUSE',
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 产线查询
  const handleFetchProdLineList = useCallback((fields = {}, operation) => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'permissionsMessagePushSettings/handleFetchProdLineList',
      payload: {
        privilegeId: operation,
        detailObjectType: 'PROD_LINE',
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 头明细查询
  const handleHeadDetail = (val) => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'permissionsMessagePushSettings/handleHeadDetail',
      payload: {
        tenantId,
        privilegeId: val,
      },
    });
  };

  // 点击编辑
  const handleEdit = () => {
    setEditFlag(false);
  };

  const {
    permissionsMessagePushSettings: {
      freezePower = [],
      flagYn = [],
      warehouseList = [],
      warehouseListPagination = {},
      prodLineList = [],
      prodLineListPagination = {},
      defaultSite = {},
      headDetail = {},
      cosFreezePower = [],
    },
    handleSaveLoading,
    handleFetchWarehouseListLoading,
    handleFetchProdLineListLoading,
    handleHeadDetailLoading,
    handleDeleteLoading,
    tenantId,
  } = props;
  const { operation } = props.match.params;
  const filterFormProps = {
    operation,
    tenantId,
    freezePower,
    flagYn,
    handleSaveLoading,
    headDetail,
    editFlag,
    cosFreezePower,
    handleSave,
    handleEdit,
  };
  const warehouseTableProps = {
    dataSource: warehouseList,
    pagination: warehouseListPagination,
    operation,
    tenantId,
    handleCreate,
    deleteData,
    handleFetchLineList: handleFetchWarehouseList,
  };
  const prodLineTableProps = {
    dataSource: prodLineList,
    pagination: prodLineListPagination,
    tenantId,
    defaultSite,
    operation,
    handleCreate,
    deleteData,
    handleFetchLineList: handleFetchProdLineList,
  };
  return (
    <Fragment>
      <Header title="权限以及消息推送设置" backPath='/hqms/permissions-message-push-settings' />
      <Content>
        <Spin spinning={handleFetchWarehouseListLoading || handleFetchProdLineListLoading || handleHeadDetailLoading || handleDeleteLoading || false}>
          <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
          <Tabs>
            <Tabs.TabPane tab="仓库" key="1">
              <div style={{ width: '50%' }}>
                <WarehouseTable {...warehouseTableProps} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="生产线" key="2">
              <div style={{ width: '50%' }}>
                <ProdLineTable {...prodLineTableProps} />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Content>
    </Fragment>
  );
};

export default connect(({ permissionsMessagePushSettings, loading }) => ({
  permissionsMessagePushSettings,
  tenantId: getCurrentOrganizationId(),
  handleSaveLoading: loading.effects['permissionsMessagePushSettings/handleSave'],
  handleFetchWarehouseListLoading: loading.effects['permissionsMessagePushSettings/handleFetchWarehouseList'],
  handleFetchProdLineListLoading: loading.effects['permissionsMessagePushSettings/handleFetchProdLineList'],
  handleHeadDetailLoading: loading.effects['permissionsMessagePushSettings/handleHeadDetail'],
  handleDeleteLoading: loading.effects['permissionsMessagePushSettings/handleDelete'],
}))(Create);