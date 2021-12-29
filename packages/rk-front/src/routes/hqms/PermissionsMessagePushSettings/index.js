/*
 * @Description: 权限以及消息推送设置
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:48:45
 * @LastEditTime: 2021-03-19 11:12:47
 */

import React, { useRef, Fragment, useEffect, useCallback, useState } from 'react';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId } from 'utils/utils';
import { Button, Tabs, Table } from 'hzero-ui';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ProdLineTable from './ProdLineTable';
import WarehouseTable from './WarehouseTable';
import styles from './index.less';

const PermissionsMessagePushSettings = (props) => {
  const countRef = useRef();
  const [selectedHeadRows, setSelectedHeadRows] = useState({});

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'permissionsMessagePushSettings/batchLovData',
      payload: {
        tenantId,
      },
    });
    handleFetchHeadList();
    return () => {
      dispatch({
        type: 'permissionsMessagePushSettings/updateState',
        payload: {
          warehouseList: [],
          warehouseListPagination: {},
          prodLineList: [],
          prodLineListPagination: {},
        },
      });
    };
  }, []);

  // 头数据查询
  const handleFetchHeadList = (fields = {}) => {
    const {
      dispatch,
    } = props;
    const fieldsValue = countRef.current.formFields;
    dispatch({
      type: 'permissionsMessagePushSettings/handleFetchHeadList',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        setSelectedHeadRows({});
        dispatch({
          type: 'permissionsMessagePushSettings/updateState',
          payload: {
            warehouseList: [],
            warehouseListPagination: {},
            prodLineList: [],
            prodLineListPagination: {},
          },
        });
      }
    });
  };

  // 跳转界面
  const handleOtherPage = (val) => {
    const { history } = props;
    history.push(`/hqms/permissions-message-push-settings/${val}`);
  };

  const handleClickSelectedRows = (record) => {
    const {
      permissionsMessagePushSettings: {
        warehouseListPagination = {},
        prodLineListPagination = {},
      },
    } = props;
    return {
      onClick: () => {
        setSelectedHeadRows(record);
        handleFetchWarehouseList(record, warehouseListPagination);
        handleFetchProdLineList(record, prodLineListPagination);
      },
    };
  };

  const handleClickRow = (record) => {
    if (selectedHeadRows.privilegeId === record.privilegeId) {
      return styles['permissionsmessagepushsettings-data-click'];
    } else {
      return '';
    }
  };

  // 仓库查询
  const handleFetchWarehouseList = useCallback((record, fields = {}) => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'permissionsMessagePushSettings/handleFetchWarehouseList',
      payload: {
        privilegeId: record.privilegeId,
        detailObjectType: 'WAREHOUSE',
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 产线查询
  const handleFetchProdLineList = useCallback((record, fields = {}) => {
    const {
      dispatch,
    } = props;
    dispatch({
      type: 'permissionsMessagePushSettings/handleFetchProdLineList',
      payload: {
        privilegeId: record.privilegeId,
        detailObjectType: 'PROD_LINE',
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  const {
    permissionsMessagePushSettings: {
      freezePower = [],
      flagYn = [],
      headList = [],
      headListPagination = {},
      warehouseList = [],
      warehouseListPagination = {},
      prodLineList = [],
      prodLineListPagination = {},
      cosFreezePower = [],
    },
    tenantId,
    handleFetchHeadListLoading,
    handleFetchWarehouseListLoading,
  } = props;
  const filterFormProps = {
    tenantId,
    freezePower,
    flagYn,
    cosFreezePower,
    handleFetchList: handleFetchHeadList,
  };
  const warehouseTableProps = {
    selectedHeadRows,
    dataSource: warehouseList,
    pagination: warehouseListPagination,
    loading: handleFetchWarehouseListLoading,
    handleFetchLineList: handleFetchWarehouseList,
  };
  const prodLineTableProps = {
    selectedHeadRows,
    dataSource: prodLineList,
    pagination: prodLineListPagination,
    handleFetchLineList: handleFetchProdLineList,
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
    },
    {
      title: '用户',
      dataIndex: 'loginName',
      width: 100,
      align: 'center',
      render: (val, record) => {
        return <a onClick={() => handleOtherPage(record.privilegeId)}>{val}</a>;
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      width: 110,
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 140,
      align: 'center',
    },
    {
      title: '权限',
      dataIndex: 'privilegeTypeMeaning',
      width: 90,
      align: 'center',
    },
    {
      title: 'COS权限',
      dataIndex: 'cosPrivilegeTypeMeaning',
      width: 90,
      align: 'center',
    },
    {
      title: '有效性',
      dataIndex: 'enableFlagMeaning',
      width: 90,
      align: 'center',
    },
  ];
  return (
    <Fragment>
      <Header title="权限以及消息推送设置">
        <Button
          type="primary"
          icon='plus'
          onClick={() => handleOtherPage('create')}
        >
          创建
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <Table
          bordered
          columns={columns}
          dataSource={headList}
          pagination={headListPagination}
          loading={handleFetchHeadListLoading}
          onChange={page => handleFetchHeadList(page)}
          rowKey="privilegeId"
          onRow={handleClickSelectedRows}
          rowClassName={handleClickRow}
        />
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
      </Content>
    </Fragment>
  );
};

export default connect(({ permissionsMessagePushSettings, loading }) => ({
  permissionsMessagePushSettings,
  tenantId: getCurrentOrganizationId(),
  handleFetchHeadListLoading: loading.effects['permissionsMessagePushSettings/handleFetchHeadList'],
  handleFetchWarehouseListLoading: loading.effects['permissionsMessagePushSettings/handleFetchWarehouseList'],
}))(PermissionsMessagePushSettings);