import React from 'react';
import { connect } from 'dva';
import { Table, Checkbox, Input, Icon, Button } from 'hzero-ui';
import { isArray } from 'lodash';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

import styles from './index.less';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
/**
 * 计划属性
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ execute }) => ({
  execute,
}))
export default class BomTab extends React.Component {
  state = {
    filteredInfo: {},
    sortedInfo: {},
  };

  componentDidMount() {
    const { eoId } = this.props;
    this.onSearch({ eoId });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, eoId } = this.props;
    if (nextProps.eoId !== eoId) {
      dispatch({
        type: 'execute/fetchBomList',
        payload: {
          eoId: nextProps.eoId,
        },
      });
      this.clearFilterSort();
    }
  }

  onSearch = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'execute/fetchBomList',
      payload: {
        ...params,
      },
    });
  };

  handlePagination = (pagination, filtersArg, sortArg) => {
    const { eoId } = this.props;
    const searchParams = {};

    this.setState({
      filteredInfo: filtersArg,
      sortedInfo: sortArg,
    });

    [('bomComponentCode', 'bomComponentName', 'step', 'stepDesc')].forEach(text => {
      if (filtersArg[text]) {
        searchParams[text] = isArray(filtersArg[text]) ? filtersArg[text][0] : filtersArg[text];
      }
    });
    searchParams.sortDirection = sortArg.order === 'descend' ? 'DESC' : 'ASC';

    const param = Object.assign(filtersArg, searchParams);

    const params = {
      eoId,
      ...param,
      page: pagination,
    };

    this.onSearch(params);
  };

  rowExpand = record => {
    if (record.substituteList && record.substituteList.length > 0) {
      return styles.expandVisible;
    } else {
      return styles.expandHidden;
    }
  };

  clearFilterSort = () => {
    this.setState({
      filteredInfo: {},
      sortedInfo: {},
    });
  };

  //  设置filters数据
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

  getColumnSearchProps = type => {
    const { filteredInfo = {} } = this.state;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} className={styles.dropDown}>
          <Input
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
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
      execute: { bomList = [], bomListPagination = {} },
    } = this.props;
    const { sortedInfo = {} } = this.state;

    const expandedRowRender = record => {
      const columns = [
        {
          title: intl.get(`${modelPrompt}.substituteGroup`).d('替代组'),
          dataIndex: 'substituteGroup',
          width: 100,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('替代策略'),
          dataIndex: 'substitutePolicyDesc',
          width: 100,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.materialCode`).d('替代物料编码'),
          dataIndex: 'materialCode',
          width: 100,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.materialName`).d('替代物料描述'),
          dataIndex: 'materialName',
          width: 100,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substituteValue`).d('替代值'),
          dataIndex: 'substituteValue',
          width: 100,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substituteUsage`).d('替代用量'),
          dataIndex: 'substituteUsage',
          width: 100,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.assembleQty`).d('装配数量'),
          dataIndex: 'assembleQty',
          width: 100,
          align: 'left',
        },
      ];
      return (
        <Table
          columns={columns}
          rowKey="materialId"
          dataSource={record.substituteList}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('序号'),
        dataIndex: 'lineNumber',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentCode`).d('组件编码'),
        width: 150,
        align: 'left',
        dataIndex: 'bomComponentCode',
        ...this.getColumnSearchProps('bomComponentCode'),
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentName`).d('组件名称'),
        width: 150,
        align: 'left',
        dataIndex: 'bomComponentName',
        ...this.getColumnSearchProps('bomComponentName'),
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentType`).d('组件类型'),
        width: 150,
        align: 'left',
        dataIndex: 'bomComponentTypeDesc',
      },
      {
        title: intl.get(`${modelPrompt}.assembleMethod`).d('装配方式'),
        dataIndex: 'assembleMethodDesc',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.componentQty`).d('需求数量'),
        dataIndex: 'componentQty',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.assembleQty`).d('装配数量'),
        dataIndex: 'assembleQty',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.substituteQty`).d('替代数量'),
        dataIndex: 'substituteQty',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.issuedLocatorCode`).d('来源库位编码'),
        dataIndex: 'issuedLocatorCode',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.keyMaterialFlag`).d('关键物料'),
        dataIndex: 'keyMaterialFlag',
        width: 150,
        align: 'center',
        render: (val, record) =>
          record.keyMaterialFlag ? <Checkbox checked={val === 'Y'} disabled /> : '',
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
        dataIndex: 'sequence',
        width: 120,
        align: 'left',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'sequence' && sortedInfo.order,
      },
      {
        title: intl.get(`${modelPrompt}.stepName`).d('步骤识别码'),
        dataIndex: 'stepName',
        width: 130,
        align: 'left',
        ...this.getColumnSearchProps('step'),
      },
      {
        title: intl.get(`${modelPrompt}.stepDesc`).d('步骤描述'),
        dataIndex: 'stepDesc',
        width: 130,
        align: 'left',
        ...this.getColumnSearchProps('stepDesc'),
      },
    ];
    return (
      <Table
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={bomList}
        pagination={bomListPagination}
        onChange={this.handlePagination}
        rowKey="bomComponentId"
        bordered
        rowClassName={this.rowExpand}
        scroll={{ x: tableScrollWidth(columns) }}
      />
    );
  }
}
