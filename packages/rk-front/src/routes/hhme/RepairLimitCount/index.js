import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Tabs } from 'hzero-ui';
import uuid from 'uuid/v4';
import notification from 'utils/notification';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  addItemToPagination,
  getEditTableData,
  delItemToPagination,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray, isUndefined } from 'lodash';
import { connect } from 'dva';
import queryString from 'querystring';
import { openTab } from 'utils/menuTab';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import LineTable from './LineTable';

@connect(({ repairLimitCount, loading }) => ({
  repairLimitCount,
  tenantId: getCurrentOrganizationId(),
  loading: loading.effects['repairLimitCount/fetchList'],
  delLoading: loading.effects['repairLimitCount/deleteLimitCount'],
  hisLoading: loading.effects['repairLimitCount/fetchHisRecord'],
}))
export default class RepairLimitCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [], // 选中数据
      selectedRows: [],
    };
  }

  filterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询有效性
    dispatch({
      type: 'repairLimitCount/fetchEnum',
    });
    // 查询事业部
    dispatch({
      type: 'repairLimitCount/fetchDepartment',
      payload: {
        tenantId,
      },
    }).then(res => {
      if(this.filterForm) {
        this.filterForm.setFieldsValue({
          departmentId: (res.find(e => e.defaultOrganizationFlag === 'Y') || {}).areaId,
        });
      }
    });
  }

  @Bind
  importRepairLimit() {
    openTab({
      key: `/hhme/repair-limit-count/import/HME.REPAIR_LIMIT_COUNT`,
      title: '返修进站次数限制导入',
      search: queryString.stringify({
        action: '返修进站次数限制导入',
      }),
    });
  }

  // 获取查询数据
  @Bind
  handleFetchList(page={}){
    const {dispatch} = this.props;
    const value = this.filterForm ? this.filterForm.getFieldsValue() : {};
    const filterValue = isUndefined(this.filterForm) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'repairLimitCount/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  // 新增
  @Bind
  handleAddLimit() {
    const {
      dispatch,
      repairLimitCount: { list = [], pagination = {} },
    } = this.props;
    dispatch({
      type: 'repairLimitCount/updateState',
      payload: {
        list: [
          {
            repairLimitCountId: uuid(),
            _status: 'create', // 新建标记位
          },
          ...list,
        ],
        pagination: addItemToPagination(list.length, pagination),
      },
    });
  }

  // 删除
  @Bind
  handleDeleteLimit() {
    const { dispatch } = this.props;
    const {selectedRows} = this.state;
    const arr = [];
    selectedRows.forEach(item => {
      arr.push(
        item.repairLimitCountId,
      );
    });
    dispatch({
      type: 'repairLimitCount/deleteLimitCount',
      payload: {
        arr,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ selectedKeys: [], selectedRows: [] });
        this.handleFetchList();
      }
    });
 }

  // 编辑行
  @Bind()
  handleEditLine(record = {}, flag) {
    const { dispatch } = this.props;
    const { repairLimitCount: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.repairLimitCountId === record.repairLimitCountId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'repairLimitCount/updateState',
      payload: {
        list: newList,
      },
    });
  }

  // 取消编辑
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      repairLimitCount: { list = [], pagination = {} },
    } = this.props;
    const newList = list.filter(
      item => item.repairLimitCountId !== record.repairLimitCountId
    );
    dispatch({
      type: 'repairLimitCount/updateState',
      payload: {
        list: newList,
        pagination: delItemToPagination(list.length, pagination),
      },
    });
  }

  // 保存
  @Bind
  handleSave(){
    const {
      dispatch,
      repairLimitCount: { list = [] },
    } = this.props;
    const arr = getEditTableData(list, ['repairLimitCountId']);

    if (Array.isArray(arr) && arr.length > 0) {
      dispatch({
        type: 'repairLimitCount/saveLimitCount',
        payload: {
          arr,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleFetchList();
        }
      });
    }
  }

  // 获取历史记录
  @Bind
  handleSelect(selectedKeys, selectedRows) {
    this.setState({ selectedKeys, selectedRows });
    this.handleFetchHisRecord(selectedKeys, {});
  }

  @Bind
  handleFetchHisRecord(selectedKeys, page = {}){
    const {dispatch} = this.props;
    let id = null;
    if(isArray(selectedKeys) && selectedKeys.length>0) {
      [id] = selectedKeys;
    }
    dispatch({
      type: 'repairLimitCount/fetchHisRecord',
      payload: {
        repairLimitCountId: id,
        page,
      },
    });
  }

  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }



  render(){

    const {
      tenantId,
      repairLimitCount: {
        list = [],
        pagination = {},
        departmentList = [],
        enableFlag = [],
        hisList = [],
        hisPagination = {},
      },
      loading,
      hisLoading,
    } = this.props;

    const { selectedKeys } = this.state;

    const filterProps = {
      tenantId,
      departmentList,
      enableFlag,
      onSearch: this.handleFetchList,
    };

    const listProps = {
      tenantId,
      pagination,
      dataSource: list,
      enableFlag,
      selectedKeys,
      loading,
      delLoading: this.delLoading,
      handleAddLimit: this.handleAddLimit,
      handleDeleteLimit: this.handleDeleteLimit,
      handleEditLine: this.handleEditLine,
      handleCleanLine: this.handleCleanLine,
      onChange: this.handleSelect,
      onSearch: this.handleFetchList,
    };

    const lineProps = {
      selectedKeys,
      pagination: hisPagination,
      dataSource: hisList,
      loading: hisLoading,
      onChange: this.handleFetchHisRecord,
    };


    return (
      <Fragment>
        <Header
          title="返修进站次数维护"
        >
          <Button
            icon="save"
            type="primary"
            onClick={() => this.handleSave()}
            // loading={saveLoading}
          >
            保存
          </Button>
          <Button type="primary" onClick={() => this.importRepairLimit()}>
            导入
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} onRef={this.handleBindRef} />
          <Tabs defaultActiveKey="1" animated={false}>
            <Tabs.TabPane
              tab='返修次数限制'
              key="1"
            >
              <ListTable {...listProps} />
            </Tabs.TabPane>
          </Tabs>

          <Tabs defaultActiveKey="1" animated={false}>
            <Tabs.TabPane
              tab='历史记录'
              key="1"
            >
              <LineTable {...lineProps} />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );

  }

}
