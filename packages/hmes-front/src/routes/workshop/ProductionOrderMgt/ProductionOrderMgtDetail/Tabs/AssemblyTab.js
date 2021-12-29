/**
 * Eo List - Eo 清单
 * @date 2019-12-19
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { Form, Button, Table, Input, Icon, Checkbox } from 'hzero-ui';
import { isArray } from 'lodash';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading: loading.effects['productionOrderMgt/fetchAssemblyList'],
  loadingChild: loading.effects['productionOrderMgt/fetchChildrenAssemblyList'],
}))
@Form.create()
export default class AssemblyTab extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    filteredInfo: {},
    sortedInfo: {},
    selectedRowId: '',
  };

  clearFilterSort = () => {
    this.setState({
      filteredInfo: {},
      sortedInfo: {},
    });
  };

  componentDidMount = () => {
    const { workOrderId, dispatch } = this.props;
    this.searchAssemblyList({ workOrderId });

    // 类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'BOM',
        typeGroup: 'SUBSTITUTE_POLICY',
        type: 'substitutePolicy',
      },
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

  searchAssemblyList = (params = {}) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'productionOrderMgt/fetchAssemblyList',
      payload: {
        ...params,
      },
    });
  };

  fetchExpandRow = (expanded, record) => {
    // expandRow
    const {
      dispatch,
      workOrderId,
      productionOrderMgt: { assemblyList = [], expandedRowKeysArray = [] },
    } = this.props;

    const params = {
      bomComponentId: record.bomComponentId,
      workOrderId,
    };

    if (expanded) {
      dispatch({
        type: 'productionOrderMgt/fetchChildrenAssemblyList',
        payload: {
          ...params,
        },
      }).then(res => {
        // 放到子表
        if (res && res.success) {
          const newAssemblyList = assemblyList.map(item => {
            if (item.bomComponentId === record.bomComponentId) {
              return { ...item, assemblyListChildren: res.rows };
            } else {
              return item;
            }
          });

          expandedRowKeysArray.push(record.bomComponentId);
          dispatch({
            type: 'productionOrderMgt/updateState',
            payload: {
              // 更新子表格
              assemblyList: newAssemblyList,
              expandedRowKeysArray,
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'productionOrderMgt/updateState',
        payload: {
          expandedRowKeysArray: expandedRowKeysArray.filter(item => item !== record.bomComponentId),
        },
      });
    }
  };

  expandedRowRender = record => {
    const {
      productionOrderMgt: { substitutePolicy = [] },
    } = this.props;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.substituteGroup`).d('替代组'),
        dataIndex: 'substituteGroup',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.substitutePolicy`).d('替代策略'),
        dataIndex: 'substitutePolicy',
        width: 100,
        align: 'left',
        render: val => (substitutePolicy.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.substituteMaterialCode`).d('替代物料编码'),
        dataIndex: 'materialCode',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.substituteMaterialName`).d('替代物料描述'),
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
        bordered
        rowKey="bomSubstituteId"
        columns={columns}
        dataSource={record.bomSubstituteList}
        pagination={false}
      />
    );
  };

  handlePagination = (pagination, filtersArg, sortArg) => {
    const { workOrderId } = this.props;
    const searchParams = {};

    this.setState({
      filteredInfo: filtersArg,
      sortedInfo: sortArg,
    });

    [('materialCode', 'materialName', 'step', 'stepDesc')].forEach(text => {
      if (filtersArg[text]) {
        searchParams[text] = isArray(filtersArg[text]) ? filtersArg[text][0] : filtersArg[text];
      }
    });
    searchParams.sortDirection = sortArg.order === 'descend' ? 'DESC' : 'ASC';

    const param = Object.assign(filtersArg, searchParams);

    const params = {
      workOrderId,
      ...param,
      page: pagination,
    };

    this.searchAssemblyList(params);
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

  // 选中行
  selectRow = record => {
    this.setState({
      selectedRowId: record.bomComponentId,
    });
  };

  render() {
    const {
      loading = false,
      loadingChild = false,
      productionOrderMgt: { assemblyList = [], assemblyPagination = {} },
    } = this.props;

    const { sortedInfo = {}, selectedRowId } = this.state;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.lineAttribute10`).d('预留项目号'),
        dataIndex: 'lineAttribute10',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('序号'),
        dataIndex: 'lineNumber',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.comCode`).d('组件编码'),
        dataIndex: 'materialCode',
        width: 180,
        align: 'left',
        ...this.getColumnSearchProps('materialCode'),
      },
      {
        title: intl.get(`${modelPrompt}.comName`).d('组件名称'),
        dataIndex: 'materialName',
        width: 180,
        align: 'left',
        ...this.getColumnSearchProps('materialName'),
      },
      {
        title: intl.get(`${modelPrompt}.bomVersion`).d('组件版本'),
        dataIndex: 'bomVersion',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentTypeDesc`).d('组件类型'),
        dataIndex: 'bomComponentTypeDesc',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.assembleMethodDesc`).d('装配方式'),
        dataIndex: 'assembleMethodDesc',
        width: 100,
        align: 'left',
      },
      {
        title: '单位用量',
        dataIndex: 'uom',
        width: 100,
        align: 'left',
      },
      {
        title: '可损耗数量',
        dataIndex: 'lossQty',
        width: 100,
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
        title: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
        dataIndex: 'primaryUomCode',
        width: 80,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.assembleExcessFlag`).d('是否强制装配'),
        dataIndex: 'assembleExcessFlag',
        width: 130,
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.scrappedQty`).d('报废数量'),
        dataIndex: 'scrappedQty',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.keyMaterialFlag`).d('关键物料'),
        dataIndex: 'keyMaterialFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.issuedLocatorCode`).d('来源库位编码'),
        dataIndex: 'issuedLocatorCode',
        width: 130,
        align: 'left',
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
        title: intl.get(`${modelPrompt}.step`).d('步骤识别码'),
        dataIndex: 'step',
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
      <Fragment>
        <Table
          rowKey={(record) => {
            return record.bomComponentId + record.step;
          }}
          className={styles.listTable}
          loading={loading || loadingChild}
          columns={columns}
          expandedRowRender={this.expandedRowRender}
          dataSource={assemblyList}
          pagination={assemblyPagination}
          // expandedRowKeys={expandedRowKeysArray}
          // onExpand={this.fetchExpandRow}
          onChange={this.handlePagination}
          bordered
          onRow={record => {
            return {
              onClick: () => {
                this.selectRow(record);
              },
            };
          }}
          rowClassName={record => {
            let className = '';
            if (isArray(record.bomSubstituteList) && record.bomSubstituteList.length === 0) {
              className = 'expandHidden';
            }
            if (record.bomComponentId === selectedRowId) {
              className = `${className} listTableSelectedRow`;
            }
            return className;
          }}
        />
      </Fragment>
    );
  }
}
