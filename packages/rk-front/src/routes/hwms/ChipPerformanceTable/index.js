/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（进入）
 */

// 引入必要的依赖包
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Button } from 'hzero-ui';
import queryString from 'querystring';

import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';

import Filter from './FilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';

// 链接model层
@connect(({ chipPerformanceTable, loading }) => ({
  chipPerformanceTable,
  fetchHeadDataLoading: loading.effects['chipPerformanceTable/queryHeadData'],
  fetchLineDataLoading: loading.effects['chipPerformanceTable/queryLineData'],
}))
// 默认导出 视图
export default class chipPerformanceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
    };
  }

  // 加载时调用的方法
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPerformanceTable/init',
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: `chipPerformanceTable/queryHeadData`,
        payload: {
          ...value,
          page,
        },
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let value = false;
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    const { hotSinkCode, wafer, materialLotCode } = filterValue;
    if (hotSinkCode || wafer || materialLotCode) {
      value = filterNullValueObject(filterValue);
    } else {
      notification.warning({ description: '热沉号，wafer，条码号必输其一，请重新输入查询条件！' });
    }
    return value;
  }

  // 分页查询
  @Bind()
  queryLineByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { selectedHeadKeys } = this.state;
    dispatch({
      type: 'chipPerformanceTable/queryLineData',
      payload: {
        loadSequence: selectedHeadKeys[0],
        page: pagination,
      },
    });
  }

  // 查询行数据
  @Bind()
  onClickHeadRadio(selectedHeadKeys) {
    const { dispatch } = this.props;
    this.setState({ selectedHeadKeys });
    dispatch({
      type: 'chipPerformanceTable/queryLineData',
      payload: {
        loadSequence: selectedHeadKeys[0],
      },
    });
  }



  @Bind()
  exImportExcel() {
    openTab({
      key: `/hwms/chip-performance-table/data-import/HME_LOAD_UNTIE`,
      title: intl.get('hwms.machineBasic.view.message.unshall').d('装载信息卸载'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.unshall').d('装载信息卸载'),
      }),
    });
  }


  // 渲染
  render() {

    const {
      chipPerformanceTable: {
        headList = [], headPagination = {}, lineList = [], linePagination = {}, lineMap = [], typeMap = [] },
      fetchHeadDataLoading,
      fetchLineDataLoading,
    } = this.props;
    const { selectedHeadKeys } = this.state;
    // 设置查询参数
    const searchProps = {
      typeMap,
      onRef: node => {
        this.filterForm = node.props.form;
      },
      onSearch: this.handleSearch,
    };

    // 设置头表参数
    const headProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchHeadDataLoading,
      selectedHeadKeys,
      onSearch: this.handleSearch,
      onClickHeadRadio: this.onClickHeadRadio,
    };

    const lineProps = {
      dataSource: lineList,
      pagination: linePagination,
      lineMap,
      loading: fetchLineDataLoading,
      onSearch: this.queryLineByPagination,
    };

    return (
      <div>
        <Header title={intl.get(`title`).d('芯片性能表')}>
          <Button onClick={this.exImportExcel}>
            {intl.get('tarzan.acquisition.transformation.button.create').d('导入')}
          </Button>
        </Header>
        <Content>
          <Filter {...searchProps} />
          <HeadTable {...headProps} />
          <LineTable {...lineProps} />
        </Content>
      </div>
    );
  }
}
