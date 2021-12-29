/**
 * generalStatus - 状态维护
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Badge, Popconfirm } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import StatusDrawer from './StatusDrawer';
// import TableDrawer from './TableDrawer';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.hmes.status.model.status';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 状态维护
 * @extends {Component} - React.Component
 * @reactProps {Object} generalStatus - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ generalStatus, loading }) => ({
  generalStatus,
  fetchLoading: loading.effects['generalStatus/fetchStatusList'],
  deleteLoading: loading.effects['generalStatus/deleteStatus'],
}))
@formatterCollections({ code: 'tarzan.hmes.status' })
export default class GeneralStatus extends React.Component {
  state = {
    selectedRows: [],
    initStatusData: {},
    pagination: {},
    statusDrawerVisible: false,
    // initTableData: {},
    // tableDrawerVisible: false,
    search: {},
  };

  componentDidMount() {
    this.refresh();
  }

  @Bind()
  refresh = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    dispatch({
      type: 'generalStatus/fetchStatusList',
      payload: {
        ...search,
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
      search: {},
      pagination: {},
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
        this.refresh(pagination);
      }
    );
    // const {
    //   generalStatus: { statusPagination = {} },
    // } = this.props;
    // this.fetchQueryList(statusPagination);
  }

  // 打开编辑抽屉
  @Bind
  handleStatusDrawerShow(record = {}) {
    this.setState({ statusDrawerVisible: true, initStatusData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleStatusDrawerCancel() {
    this.setState({ statusDrawerVisible: false, initStatusData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleStatusDrawerOk(fieldsValue) {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalStatus/saveStatus',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          statusDrawerVisible: false,
        });
        this.refresh();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 删除
  @Bind
  deleteStatus() {
    const {
      generalStatus: { statusList = [] },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'generalStatus/deleteStatus',
      payload: statusList
        .filter(ele => selectedRows.some(eles => eles === ele.genStatusId))
        .map(ele => ({
          ...ele,
          tenantId: getCurrentOrganizationId(),
        })),
    }).then(res => {
      if (res && res.success) {
        this.setState(
          {
            selectedRows: [],
            pagination: {},
          },
          () => {
            this.refresh();
          }
        );
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 选中行事件
  @Bind
  onChange(selectedRows) {
    this.setState({
      selectedRows,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      generalStatus: { statusList = [], statusPagination = {} },
      fetchLoading,
      deleteLoading,
    } = this.props;
    const { selectedRows, statusDrawerVisible, initStatusData } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.statusGroup`).d('状态组'),
        width: 200,
        dataIndex: 'statusGroup',
      },
      {
        title: intl.get(`${modelPrompt}.statusCode`).d('状态编码'),
        dataIndex: 'statusCode',
        width: 200,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                  this.handleStatusDrawerShow(record);
                }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.moduleDesc`).d('所属服务包'),
        dataIndex: 'moduleDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'defaultFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultFlag !== 'N' ? 'success' : 'error'}
            text={
              record.defaultFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.initialFlag`).d('系统初始标识'),
        dataIndex: 'initialFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.initialFlag !== 'N' ? 'success' : 'error'}
            text={
              record.initialFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('展示顺序'),
        dataIndex: 'sequence',
        width: 100,
      },
      // {
      //   title: intl.get(`${modelPrompt}.operator`).d('关联表'),
      //   dataIndex: 'operator',
      //   width: 100,
      //   align: 'center',
      //   render: (val, record) => (
      //     <span className="action-link">
      //       <a
      //         onClick={() => {
      //           this.handleTableDrawerShow(record);
      //         }}
      //       >
      //         {intl.get(`${modelPrompt}.operator`).d('关联表')}
      //       </a>
      //     </span>
      //   ),
      // },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
    };
    // 抽屉参数
    const statusDrawerProps = {
      visible: statusDrawerVisible,
      onCancel: this.handleStatusDrawerCancel,
      onOk: this.handleStatusDrawerOk,
      initData: initStatusData,
    };
    // 抽屉参数
    // const tableDrawerProps = {
    //   visible: tableDrawerVisible,
    //   onCancel: this.handleTableDrawerCancel,
    //   onOk: this.handleTableDrawerCancel,
    //   initData: initTableData,
    // };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.status.title.list').d('状态维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleStatusDrawerShow();
            }}
          >
            {intl.get('tarzan.hmes.status.button.create').d('新建')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button
              icon="delete"
              loading={deleteLoading}
              disabled={selectedRows.length === 0}
            // onClick={this.deleteType}
            >
              {intl.get('tarzan.hmes.status.button.delete').d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                  .get(`${modelPrompt}.confrim.delete`, {
                    count: selectedRows.length,
                  })
                  .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteStatus}
            >
              <Button
                icon="delete"
                loading={deleteLoading}
                disabled={selectedRows.length === 0}
              >
                {intl.get('tarzan.hmes.status.button.delete').d('删除')}
              </Button>
            </Popconfirm>
            )}
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <Table
            loading={fetchLoading}
            rowKey="genStatusId"
            rowSelection={rowSelection}
            dataSource={statusList}
            columns={columns}
            pagination={statusPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
          {
            statusDrawerVisible && <StatusDrawer {...statusDrawerProps} />
          }
          {/* <TableDrawer {...tableDrawerProps} /> */}
        </Content>
      </React.Fragment>
    );
  }
}
