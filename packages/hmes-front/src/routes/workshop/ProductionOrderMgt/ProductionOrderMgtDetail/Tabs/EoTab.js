/**
 * Eo List - Eo 清单
 * @date 2019-12-19
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { Form, Button, Table, Input, Icon } from 'hzero-ui';
import { get as chainGet, isArray } from 'lodash';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading: loading.effects['productionOrderMgt/fetchEoList'],
}))
@Form.create()
export default class EoTab extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      eoStatusOptionsFilter: [],
      eoTypeOptionsFilter: [],
      filteredInfo: {},
    };
  }

  clearFilterSort = () => {
    this.setState({
      filteredInfo: {},
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

  componentDidMount = () => {
    const { dispatch, workOrderId } = this.props;

    // eo列表名称
    dispatch({
      type: 'productionOrderMgt/fetchEoList',
      payload: {
        workOrderId,
      },
    });

    // EO状态
    dispatch({
      type: 'productionOrderMgt/fetchStatusSelectList',
      payload: {
        module: 'ORDER',
        statusGroup: 'EO_STATUS',
        type: 'eoStatusOptions',
      },
    }).then(res => {
      if (res && res.success) {
        let eoStatusOptionsFilter = [];
        const eoStatusOptions = chainGet(res, 'rows', []);
        eoStatusOptionsFilter = this.filterTransForm(eoStatusOptions, 'statusCode');

        this.setState({
          eoStatusOptionsFilter,
        });
      }
    });

    // EO类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ORDER',
        typeGroup: 'EO_TYPE',
        type: 'eoTypeOptions',
      },
    }).then(res => {
      if (res && res.success) {
        let eoTypeOptionsFilter = [];
        const eoTypeOptions = chainGet(res, 'rows', []);
        eoTypeOptionsFilter = this.filterTransForm(eoTypeOptions, 'typeCode');

        this.setState({
          eoTypeOptionsFilter,
        });
      }
    });
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

  tablePagination = (pagination, filtersArg) => {
    const { dispatch, workOrderId } = this.props;
    const searchParams = {};

    this.setState({
      filteredInfo: filtersArg,
    });

    // EO编码、物料编码、物料名称
    ['eoNum', 'materialCode', 'materialName'].forEach(text => {
      if (filtersArg[text]) {
        searchParams[text] = isArray(filtersArg[text]) ? filtersArg[text][0] : filtersArg[text];
      }
    });

    // EO状态、EO类型
    const param = Object.assign(filtersArg, searchParams);

    dispatch({
      type: 'productionOrderMgt/fetchEoList',
      payload: {
        workOrderId,
        ...param,
        page: pagination,
      },
    });
  };

  render() {
    const {
      loading,
      productionOrderMgt: {
        eoList = [],
        eoPagination = {},
        eoStatusOptions = [],
        eoTypeOptions = [],
      },
      jumpPage,
    } = this.props;
    const { eoStatusOptionsFilter, eoTypeOptionsFilter, filteredInfo = {} } = this.state;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.eoNum`).d('EO编码'),
        width: 130,
        dataIndex: 'eoNum',
        fixed: true,
        render: (val, record) => (
          <a className={record.ncFlag === 'Y' ?'action-link eoList_isNc':'action-link'} onClick={() => jumpPage(record)}>
            {val}
          </a>
        ),
        ...this.getColumnSearchProps('eoNum'),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('EO标识'),
        width: 130,
        dataIndex: 'eoIdentification',
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('EO状态'),
        width: 100,
        dataIndex: 'status',
        render: val =>
          (eoStatusOptions.filter(ele => ele.statusCode === val)[0] || {}).description || val,
        filterIcon: filtered => (
          <Icon type="down" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filters: eoStatusOptionsFilter,
        filteredValue: filteredInfo.status || null,
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('EO创建时间'),
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${modelPrompt}.eoWorkcellIdDesc`).d('当前工序'),
        width: 100,
        dataIndex: 'eoWorkcellIdDesc',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 130,
        dataIndex: 'materialCode',
        ...this.getColumnSearchProps('materialCode'),
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料名称'),
        width: 200,
        dataIndex: 'materialName',
        ...this.getColumnSearchProps('materialName'),
      },
      {
        title: intl.get(`${modelPrompt}.eoQty`).d('EO数量'),
        // width: 100,
        dataIndex: 'qty',
      },
      {
        title: intl.get(`${modelPrompt}.uom`).d('单位'),
        width: 100,
        dataIndex: 'uomName',
      },
      {
        title: intl.get(`${modelPrompt}.eoType`).d('EO类型'),
        width: 130,
        dataIndex: 'eoType',
        render: val =>
          (eoTypeOptions.filter(ele => ele.typeCode === val)[0] || {}).description || val,
        filterIcon: filtered => (
          <Icon type="down" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filters: eoTypeOptionsFilter,
        filteredValue: filteredInfo.eoType || null,
      },
      {
        title: intl.get(`${modelPrompt}.productionLineCode`).d('生产线编码'),
        width: 100,
        dataIndex: 'productionLineCode',
      },
      {
        title: intl.get(`${modelPrompt}.productionLineName`).d('生产线名称'),
        width: 200,
        dataIndex: 'productionLineName',
      },
      {
        title: intl.get(`${modelPrompt}.eoBomName`).d('装配清单编码'),
        width: 200,
        dataIndex: 'eoBomName',
      },
      {
        title: intl.get(`${modelPrompt}.eoRouterName`).d('工艺路线编码'),
        width: 200,
        dataIndex: 'eoRouterName',
      },
      {
        title: intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间'),
        width: 170,
        dataIndex: 'planStartTime',
      },
      {
        title: intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间'),
        width: 170,
        dataIndex: 'planEndTime',
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        width: 100,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点名称'),
        width: 200,
        dataIndex: 'siteName',
      },
    ];

    return (
      <Table
        bordered
        pagination={eoPagination}
        rowKey="eoId"
        loading={loading}
        columns={columns}
        dataSource={eoList}
        onChange={this.tablePagination}
      />
    );
  }
}
