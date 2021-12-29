/*
 * @Description: 复测导入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-25 18:07:32
 * @LastEditTime: 2021-02-05 15:29:27
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';
import queryString from 'querystring';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import { openTab } from 'utils/menuTab';
import FilterForm from './FilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';

@connect(({ cosIntroductionRetest, loading }) => ({
  cosIntroductionRetest,
  fetchHeadListLoading: loading.effects['cosIntroductionRetest/fetchHeadList'],
  fetchLineListLoading: loading.effects['cosIntroductionRetest/fetchLineList'],
  printLoading: loading.effects['cosIntroductionRetest/printingBarcode'],
  tenantId: getCurrentOrganizationId(),
}))
export default class CosIntroductionRetest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headRecord: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
  }


  componentDidMount() {
    this.handleFetchHeadList();
  }

  @Bind()
  handleFetchHeadList(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    dispatch({
      type: 'cosIntroductionRetest/fetchHeadList',
      payload: {
        page: isEmpty(fields) ? {} : fields,
        ...fieldsValue,
        startTime: isUndefined(fieldsValue.startTime)
          ? null
          : moment(fieldsValue.startTime).format(DEFAULT_DATETIME_FORMAT),
        endTime: isUndefined(fieldsValue.endTime)
          ? null
          : moment(fieldsValue.endTime).format(DEFAULT_DATETIME_FORMAT),
      },
    }).then(res => {
      if (res) {
        this.setState({
          selectedRowKeys: [],
          headRecord: {},
        });
        dispatch({
          type: 'cosIntroductionRetest/updateState',
          payload: {
            lineData: [],
            lineDataPagination: {},
          },
        });
      }
    });;
  }

  @Bind()
  handleFetchLine(val) {
    this.setState({ headRecord: val }, () => { this.handleFetchLineList(); });
  }

  @Bind()
  handleFetchLineList(fields = {}) {
    const {
      dispatch,
    } = this.props;
    const { headRecord } = this.state;
    dispatch({
      type: 'cosIntroductionRetest/fetchLineList',
      payload: {
        retestImportDataId: headRecord.retestImportDataId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys });
    this.setState({ selectedRows});
  }

  @Bind
  handlePrinting() {
    const {
      dispatch,
      cosIntroductionRetest: {
        headDataPagination = {},
      },
    } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'cosIntroductionRetest/printingBarcode',
      payload: {
        materialLotIdList: selectedRows.map(e => e.targetBarcodeId),
      },
      // payload: selectedRowKeys,
    }).then(res => {
      if (res) {
        const file = new Blob(
          [res],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
          this.handleFetchHeadList(headDataPagination);
        }
      }
    });
  }

  @Bind()
  handleBatchImport() {
    openTab({
      key: '/hhme/cos-introduction-retest-import/HME.COS_RETEST_IMPORT',
      search: queryString.stringify({
        key: '/hhme/cos-introduction-retest-import/HME.COS_RETEST_IMPORT',
        title: 'COS复测导入',
        action: 'COS复测导入',
        auto: true,
      }),
    });
  }


  // 渲染 界面布局
  render() {
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      printLoading,
      tenantId,
      cosIntroductionRetest: {
        headData = [],
        headDataPagination = {},
        lineData = [],
        lineDataPagination = {},
        taskTypeList = [],
        docStatusList = [],
        resultList = [],
      },
    } = this.props;
    const { selectedRowKeys, headRecord } = this.state;
    const filterProps = {
      tenantId,
      taskTypeList,
      docStatusList,
      resultList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchHeadList,
    };
    const headListProps = {
      loading: fetchHeadListLoading,
      pagination: headDataPagination,
      dataSource: headData,
      selectedRowKeys,
      headRecord,
      onSearch: this.handleFetchHeadList,
      handleFetchLine: this.handleFetchLine,
      onSelectRow: this.handleSelectRow,
    };
    const lineTableProps = {
      dataSource: lineData,
      pagination: lineDataPagination,
      loading: fetchLineListLoading,
      onSearch: this.handleFetchLineList,
    };
    return (
      <React.Fragment>
        <Header title='COS复测导入'>
          <Button
            icon="printer"
            loading={printLoading}
            disabled={isEmpty(selectedRowKeys)}
            onClick={() => this.handlePrinting()}
          >
            打印
          </Button>
          {/* <Button
            icon="to-top"
            type="primary"
            onClick={this.handleBatchImport}
          >
            批量导入
          </Button> */}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <HeadTable {...headListProps} />
          <LineTable {...lineTableProps} />
        </Content>
      </React.Fragment>
    );
  }
}
