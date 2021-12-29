import React from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Icon } from 'hzero-ui';
import { isArray, get as chainGet } from 'lodash';
import intl from 'utils/intl';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
/**
 * 执行作业关系
 * @extends {PureComponent} - React.Component
 * @return React.element
 */

@connect(({ execute, loading }) => ({
  execute,
  loading: loading.effects['execute/fetchExecuteJobList'],
}))
export default class ExecuteJobTab extends React.Component {
  state = {
    prodRelOptionsFilter: [],
    filteredInfo: {},
  };

  componentDidMount() {
    this.onSearch();
    // eo关系
    this.props
      .dispatch({
        type: 'execute/fetchEoRelOptions',
        payload: {
          module: 'ORDER',
          typeGroup: 'EO_REL',
        },
      })
      .then(res => {
        let prodRelOptionsFilter = [];
        const prodRelOptions = chainGet(res, 'rows', []);
        prodRelOptionsFilter = this.filterTransForm(prodRelOptions, 'typeCode');

        this.setState({
          prodRelOptionsFilter,
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, eoId } = this.props;
    if (nextProps.eoId !== eoId) {
      dispatch({
        type: 'execute/fetchExecuteJobList',
        payload: {
          eoId: nextProps.eoId,
        },
      });
      this.clearFilterSort();
    }
  }

  onSearch = (pagination = {}) => {
    const { dispatch, eoId } = this.props;
    dispatch({
      type: 'execute/fetchExecuteJobList',
      payload: {
        eoId,
        page: {
          ...pagination,
        },
      },
    });
  };

  tablePagination = (pagination, filtersArg) => {
    const { dispatch, eoId } = this.props;

    this.setState({
      filteredInfo: filtersArg,
    });

    const searchParams = {};
    // EO编码、物料编码、物料名称
    ['eoNum'].forEach(text => {
      if (filtersArg[text]) {
        searchParams[text] = isArray(filtersArg[text]) ? filtersArg[text][0] : filtersArg[text];
      }
    });

    // EO状态、EO类型
    const params = filtersArg;
    const param = Object.assign(params, searchParams);

    dispatch({
      type: 'execute/fetchExecuteJobList',
      payload: {
        eoId,
        ...param,
        page: pagination,
      },
    });
  };

  filterTransForm = (filters = [], type) => {
    const transFilter = [];
    filters.forEach(filter => {
      transFilter.push({
        text: filter.description,
        value: filter[type],
      });
    });

    return transFilter;
  };

  handleFilterSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleFilterReset = clearFilters => {
    clearFilters();
  };

  clearFilterSort = () => {
    this.setState({
      filteredInfo: {},
    });
  };

  getColumnSearchProps = type => {
    const { filteredInfo = {} } = this.state;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} className={styles.dropDown}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleFilterSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleFilterSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button
            onClick={() => this.handleFilterReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filteredValue: filteredInfo[type] || null,
    };
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      execute: { loading, executeJobList = [], executeJobPagination = {} },
    } = this.props;
    const { prodRelOptionsFilter, filteredInfo = {} } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.eoNum`).d('执行作业编码'),
        width: 130,
        dataIndex: 'eoNum',
        ...this.getColumnSearchProps('eoNum'),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料名称'),
        width: 130,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('数量'),
        width: 100,
        dataIndex: 'qty',
      },
      {
        title: intl.get(`${modelPrompt}.eoRelationStatus`).d('执行作业关系'),
        width: 100,
        dataIndex: 'eoRelationStatus',
        render: val => {
          const prodRelFilter = prodRelOptionsFilter.filter(eo => eo.value === val);
          if (isArray(prodRelFilter) && prodRelFilter.length > 0) {
            const desc = (prodRelFilter[0] || {}).text || '';
            return <span>{desc}</span>;
          }
          return val;
        },
        filterIcon: filtered => (
          <Icon type="down" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filters: prodRelOptionsFilter,
        filteredValue: filteredInfo.eoRelationStatus || null,
      },
      {
        title: intl.get(`${modelPrompt}.reasonDesc`).d('操作类型'),
        width: 200,
        dataIndex: 'reasonDesc',
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={executeJobList}
        pagination={executeJobPagination}
        onChange={this.tablePagination}
        rowKey="eventId"
        loading={loading}
        bordered
      />
    );
  }
}
