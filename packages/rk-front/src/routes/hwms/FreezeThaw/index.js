import React from 'react';
import { connect } from 'dva';
import { Form, Button, Popconfirm, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
// import TLEditor from '@/components/TLEditor';
// import EditTable from 'components/EditTable';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import { getCurrentOrganizationId, delItemToPagination } from 'utils/utils';
import moment from 'moment';
import FilterForm from './FilterForm';
import FreezeModal from './FreezeModal';

const modelPrompt = 'tarzan.acquisition.transformation.model.transformation';

@connect(({ freezeThaw, loading }) => ({
  freezeThaw,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['freezeThaw/queryList'],
  deleteLoading: loading.effects['freezeThaw/deleteAPI'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.acquisition.transformation',
})
export default class ErrorMessage extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    pagination: {},
    search: {},
    flag: false, // 是否展示
    freezeReason: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'freezeThaw/init',
    });

    // 工厂下拉框
    dispatch({
      type: 'freezeThaw/querySiteList',
    });
    // 仓库
    dispatch({
      type: 'freezeThaw/queryWarehouseList',

      payload: {},
    });
    // 站点
    dispatch({
      type: 'freezeThaw/queryLocatorList',
      payload: {},
    });

    this.refresh();
  }

  @Bind()
  refresh = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    dispatch({
      type: 'freezeThaw/queryList',
      payload: {
        ...search,
        warehouseId: search.warehouseId && search.warehouseId.split(','),
        locatorId: search.locatorId && search.locatorId.split(','),
        freezeDateFrom: isEmpty(search.freezeDateFrom)
          ? null
          : moment(search.freezeDateFrom).format(DEFAULT_DATE_FORMAT),
        freezeDateTo: isEmpty(search.freezeDateTo)
          ? null
          : moment(search.freezeDateTo).format(DEFAULT_DATE_FORMAT),
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
        pagination: {},
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  onResetSearch = () => {
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {},
      search: {},
    });
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    this.setState(
      {
        pagination,
      },
      () => {
        this.refresh();
      }
    );
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      freezeThaw: { messageList, messagePagination = {} },
    } = this.props;
    const newList = messageList.filter(item => item.apiId !== record.apiId);
    dispatch({
      type: 'freezeThaw/updateState',
      payload: {
        messageList: newList,
        messagePagination: delItemToPagination(10, messagePagination),
      },
    });
  }

  /**
   * 取消行
   */
  // @Bind()
  // handleCancel(record) {
  //   const {
  //     dispatch,
  //     freezeThaw: { messageList },
  //   } = this.props;
  //   const newList = messageList.filter(item => item.apiId !== record.apiId);
  //   dispatch({
  //     type: 'freezeThaw/updateState',
  //     payload: {
  //       messageList: newList,
  //     },
  //   });
  // }

  @Bind
  freeApiShow() {
    const { selectedRows } = this.state;
    const arr = selectedRows.filter(ele => ele.freezeFlag === 'Y');
    if (arr.length !== 0) {
      notification.error({
        message: '条码已冻结，不可重复冻结！',
      });
    } else {
      // 展示
      this.setState({
        flag: true,
        freezeReason: '',
      });
    }
  }

  // 冻结
  @Bind
  freeApi() {
    const { dispatch } = this.props;
    const { selectedRows, freezeReason } = this.state;
    const dto = {
      freezeFlag: 'Y',
      freezeReason,
      wmsMaterialLotVo2List: selectedRows,
    };

    dispatch({
      type: 'freezeThaw/freezeOrThaw',
      payload: { ...dto },
      // payload: messageList
      //   .filter(ele => selectedRows.some(eles => eles === ele.apiId))
      //   .map(ele => ele.apiId),
    }).then(res => {
      if (res) {
        this.setState({
          flag: false,
          freezeReason: '',
          selectedRowKeys: [],
          selectedRows: [],
        });
        this.onSearch();
        notification.success();
      }
    });
  }

  // 解冻
  @Bind
  ThawApi() {
    const { dispatch } = this.props;

    const { selectedRows } = this.state;

    const arr = selectedRows.filter(ele => ele.freezeFlag === 'N');
    if (arr.length !== 0) {
      notification.error({
        message: '条码不为冻结状态，不可执行解冻！',
      });
      return;
    }
    const dto = {
      freezeFlag: 'N',
      freezeReason: '',
      wmsMaterialLotVo2List: selectedRows,
    };

    dispatch({
      type: 'freezeThaw/freezeOrThaw',
      payload: { ...dto },
      // payload: messageList
      //   .filter(ele => selectedRows.some(eles => eles === ele.apiId))
      //   .map(ele => ele.apiId),
    }).then(res => {
      if (res) {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });
        notification.success();
        this.onSearch();
      }
    });
  }

  @Bind()
  handleCancel() {
    this.setState({
      flag: false,
      freezeReason: '',
    });
  }

  // 改变原因
  onChangeFreezeReason = e => {
    this.setState({ freezeReason: e.target.value });
  };

  // 选中行事件
  @Bind
  onChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  @Bind
  updateState = (value, record, index) => {
    const {
      dispatch,
      freezeThaw: { messageList = [] },
    } = this.props;
    messageList[index].changeModuleDesc = record.description;
    dispatch({
      type: 'freezeThaw/updateState',
      payload: {
        messageList,
      },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      freezeThaw: {
        messageList = [],
        messagePagination = {},
        siteMap = [],
        materialVersionMap = [],
        warehouseMap = [],
        locatorMap = [],
        lotStatusMap = [],
        qualityStatusMap = [],
      },
      fetchMessageLoading,
      deleteLoading,
      tenantId,
    } = this.props;

    const filterProps = {
      materialVersionMap: materialVersionMap || [],
      tenantId,
      siteMap,
      lotStatusMap: lotStatusMap || [],
      qualityStatusMap: qualityStatusMap || [],
      warehouseMap: warehouseMap || [],
      locatorMap: locatorMap || [],
    };
    const { selectedRowKeys, flag, freezeReason } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('工厂'),
        width: 120,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialLotStatusMeaning`).d('条码状态'),
        dataIndex: 'materialLotStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
        dataIndex: 'qualityStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomName`).d('单位'),
        dataIndex: 'primaryUomName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.warehouseCode`).d('仓库'),
        dataIndex: 'warehouseCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierLot`).d('供应商批次'),
        dataIndex: 'supplierLot',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商'),
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.soNum`).d('销售订单'),
        dataIndex: 'soNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.freezeFlag`).d('冻结标识'),
        dataIndex: 'freezeFlag',
        width: 80,
        render: (val, record) =>
          (record.freezeFlag === 'Y' || record.freezeFlag === 'N') && (
            <Badge
              status={record.freezeFlag === 'Y' ? 'success' : 'error'}
              text={
                record.freezeFlag === 'Y'
                  ? intl.get(`${modelPrompt}.enable`).d('是')
                  : intl.get(`${modelPrompt}.unable`).d('否')
              }
            />
          ),
      },
      {
        title: intl.get(`${modelPrompt}.freezeDate`).d('冻结时间'),
        dataIndex: 'freezeDate',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 120,
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onChange,
      type: 'checkbox',
      fixed: true,
      columnWidth: 50,
      // getCheckboxProps: record => ({
      //   disabled: !record.apiId,
      // }),
    };

    // 展开的数据
    const expandDataProps = {
      flag,
      handleOk: this.freeApi,
      handleCancel: this.handleCancel,
      onChangeFreezeReason: this.onChangeFreezeReason,
      freezeReason,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.acquisition.transformation.title.list').d('冻结解冻')}>
          {selectedRowKeys.length === 0 ? (
            <Button
              // icon="delete"
              loading={deleteLoading}
              disabled={selectedRowKeys.length === 0}
              // onClick={this.deleteType}
            >
              {intl.get('tarzan.acquisition.transformation.button.delete').d('冻结')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRowKeys.length,
                })
                .d(`总计${selectedRowKeys.length}条数据，是否确认冻结?`)}
              onConfirm={this.freeApiShow}
            >
              <Button
                disabled={selectedRowKeys.length === 0}
                loading={deleteLoading}
                // onClick={this.deleteAPI}
              >
                {intl.get('冻结').d('冻结')}
              </Button>
            </Popconfirm>
          )}
          {selectedRowKeys.length === 0 ? (
            <Button
              // icon="delete"
              loading={deleteLoading}
              disabled={selectedRowKeys.length === 0}
              // onClick={this.deleteType}
            >
              {intl.get('tarzan.acquisition.transformation.button.delete').d('解冻')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRowKeys.length,
                })
                .d(`总计${selectedRowKeys.length}条数据，是否确认解冻?`)}
              onConfirm={this.ThawApi}
            >
              <Button
                // icon="delete"
                disabled={selectedRowKeys.length === 0}
                loading={deleteLoading}
                // onClick={this.deleteAPI}
              >
                {intl.get('解冻').d('解冻')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm
            onSearch={this.onSearch}
            onResetSearch={this.onResetSearch}
            {...filterProps}
          />
          <Table
            loading={fetchMessageLoading}
            // rowKey="siteId"
            rowSelection={rowSelection}
            dataSource={messageList}
            columns={columns}
            pagination={messagePagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
          {flag && <FreezeModal {...expandDataProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
