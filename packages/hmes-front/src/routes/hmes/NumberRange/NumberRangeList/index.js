/**
 * numberRangeList - 号码段维护
 * @date: 2019-8-21
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import HistoryDrawer from './HistoryDrawer';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.mes.numR.model.numR';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 号码段维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} numberRangeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ numberRange, loading }) => ({
  numberRange,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['numberRange/fetchNumberRangeList'],
}))
@formatterCollections({ code: 'tarzan.mes.numR' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/mes/numberRange/list' })
export default class NumberRangeList extends React.Component {
  queryForm;

  state = {
    historyDrawerVisible: false,
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'numberRange/fetchNumberRangeList',
    });
    dispatch({
      type: 'numberRange/fetchNumResetTypeList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_RESET_TYPE',
      },
    });
    dispatch({
      type: 'numberRange/fetchNumRadixList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_RADIX_TYPE',
      },
    });
    dispatch({
      type: 'numberRange/fetchNumAlertTypeList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_ALERT_TYPE',
      },
    });
  }

  /**
   * 页面跳转到号码段明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showNumberRangeDist(record = {}) {
    const { history } = this.props;
    history.push(`/hmes/mes/number-range/dist/${record.numrangeId}`);
  }

  /**
   *新建号码段页面
   * @param {object} record 行数据
   */
  @Bind()
  createNumberRange() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'numberRange/updateState',
      payload: {
        displayList: {},
      },
    });
    history.push(`/hmes/mes/number-range/dist/create`);
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.fetchQueryList(pagination);
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  // 修改历史
  @Bind()
  showHistory() {
    this.setState({
      historyDrawerVisible: true,
    });
  }

  // 关闭历史抽屉
  @Bind
  handleHistoryDrawerCancel() {
    this.setState({
      historyDrawerVisible: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'numberRange/updateState',
      payload: {
        historyList: [],
        historyItemList: [],
      },
    });
  }

  // 确定并关闭历史抽屉
  @Bind
  handleHistoryDrawerOk() {
    this.setState({
      historyDrawerVisible: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'numberRange/updateState',
      payload: {
        historyList: [],
        historyItemList: [],
      },
    });
  }

  // 选中行事件
  @Bind
  onSelectRow(record) {
    this.setState({
      selectedRows: record,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      numberRange: { numberRangeList = [], numberRangePagination = {} },
      loading,
    } = this.props;
    const { selectedRows, historyDrawerVisible } = this.state;
    const rowSelection = {
      type: 'radio',
      onSelect: this.onSelectRow,
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('编码对象编码'),
        width: 180,
        dataIndex: 'objectCode',
      },
      {
        title: intl.get(`${modelPrompt}.objectName`).d('编码对象描述'),
        dataIndex: 'objectName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.numrangeGroup`).d('号段组号'),
        dataIndex: 'numrangeGroup',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showNumberRangeDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.numDescription`).d('号段描述'),
        dataIndex: 'numDescription',
        width: 250,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.numExample`).d('号段示例'),
        dataIndex: 'numExample',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.outsideNumFlag`).d('外部输入编码'),
        dataIndex: 'outsideNumFlag',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.outsideNumFlag === 'Y' ? 'success' : 'error'}
            text={
              record.outsideNumFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];
    // 历史抽屉参数
    const historyDrawerProps = {
      visible: historyDrawerVisible,
      onCancel: this.handleHistoryDrawerCancel,
      onOk: this.handleHistoryDrawerOk,
      initData: selectedRows,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.mes.numR.view.title.numR').d('号码段维护')}>
          <Button
            type="primary"
            icon="plus"
            onClick={() => {
              this.createNumberRange();
            }}
          >
            {intl.get('tarzan.mes.numR.button.create').d('新建')}
          </Button>
          <Button
            icon="edit"
            disabled={selectedRows.length === 0}
            onClick={() => {
              this.showHistory();
            }}
          >
            {intl.get('tarzan.mes.numR.button.history').d('修改历史')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="numrangeId"
            dataSource={numberRangeList}
            columns={columns}
            rowSelection={rowSelection}
            pagination={numberRangePagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
          {historyDrawerVisible && <HistoryDrawer {...historyDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
