import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { Table, Card, Button } from 'hzero-ui';
import moment from 'moment';

import { filterNullValueObject, tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';
import {
  DEFAULT_DATETIME_FORMAT,
  DETAIL_CARD_TABLE_CLASSNAME,
} from 'utils/constants';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ChartsData from './ChartsData';


@connect(({ supplierIncomingQualityReport, loading }) => ({
  supplierIncomingQualityReport,
  tenantId: getCurrentOrganizationId(),
  handleSearchLoading: loading.effects['supplierIncomingQualityReport/handleSearch'],
  exportLoading: loading.effects['supplierIncomingQualityReport/exportExcel'],
}))
export default class SupplierIncomingQualityReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
    };
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierIncomingQualityReport/fetchDefaultSite',
    });
  }


  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }


  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    this.setState({flag: false});
    const { dispatch } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const materialIdList = fieldsValue.materialIdList && fieldsValue.materialIdList.split(",").map(String);
    const supplierIdList = fieldsValue.supplierIdList && fieldsValue.supplierIdList.split(",").map(String);
    const inspectorIdList = fieldsValue.inspectorIdList && fieldsValue.inspectorIdList.split(",").map(String);
    dispatch({
      type: 'supplierIncomingQualityReport/updateState',
      payload: {
        legendDataList: [],
        seriesData: [],
        xaxisList: [],
      },
    });
    dispatch({
      type: 'supplierIncomingQualityReport/handleSearch',
      payload: {
        ...fieldsValue,
        materialIdList,
        supplierIdList,
        inspectorIdList,
        inspectionDateFrom: isEmpty(fieldsValue.inspectionDateFrom)
          ? null
          : moment(fieldsValue.inspectionDateFrom).format(DEFAULT_DATETIME_FORMAT),
        inspectionDateTo: isEmpty(fieldsValue.inspectionDateTo)
          ? null
          : moment(fieldsValue.inspectionDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
    dispatch({
      type: 'supplierIncomingQualityReport/handleSearchChartsData',
      payload: {
        ...fieldsValue,
        materialIdList,
        supplierIdList,
        inspectorIdList,
        inspectionDateFrom: isEmpty(fieldsValue.inspectionDateFrom)
          ? null
          : moment(fieldsValue.inspectionDateFrom).format(DEFAULT_DATETIME_FORMAT),
        inspectionDateTo: isEmpty(fieldsValue.inspectionDateTo)
          ? null
          : moment(fieldsValue.inspectionDateTo).format(DEFAULT_DATETIME_FORMAT),
      },
    }).then(()=>{
      this.setState({flag: true});
    });
  }

  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const {dispatch} = this.props;
    const { materialIdList, supplierIdList, inspectorIdList, inspectionDateFrom, inspectionDateTo } = fieldsValue;
    const newMaterialIdList = materialIdList && materialIdList.split(",").map(String);
    const newSupplierIdList = supplierIdList && supplierIdList.split(",").map(String);
    const newInspectorIdList = inspectorIdList && inspectorIdList.split(",").map(String);
    dispatch({
      type: 'supplierIncomingQualityReport/exportExcel',
      payload: filterNullValueObject({
        ...fieldsValue,
        materialIdList: newMaterialIdList,
        supplierIdList: newSupplierIdList,
        inspectorIdList: newInspectorIdList,
        inspectionDateFrom: isEmpty(inspectionDateFrom)
          ? null
          : moment(inspectionDateFrom).format(DEFAULT_DATETIME_FORMAT),
        inspectionDateTo: isEmpty(inspectionDateTo)
          ? null
          : moment(inspectionDateTo).format(DEFAULT_DATETIME_FORMAT),
      }),
    }).then(res => {
      if(res){
        const file = new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
        );
        const fileURL = URL.createObjectURL(file);
        const fileName = '供应商来料在线质量报表.xlsx';
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  }

  render() {
    const {
      supplierIncomingQualityReport: {
        list = [],
        pagination = {},
        seriesData = [],
        xaxisList = [],
        legendDataList = [],
        defaultSite = {},
      },
      handleSearchLoading,
      exportLoading,
    } = this.props;
    // 查询
    const filterFormProps = {
      onSearch: this.handleSearch,
      siteId: defaultSite.siteId,
    };
    const columns = [
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: '物料',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '检验批次',
        dataIndex: 'totalNum',
        width: 120,
      },
      {
        title: '合格批次',
        dataIndex: 'okNum',
        width: 120,
      },
      {
        title: '不合格批次',
        dataIndex: 'ngNum',
        width: 120,
      },
      {
        title: '合格率',
        dataIndex: 'okRate',
        width: 120,
        render: val => {
          return <span>{val}%</span>;
        },
      },
      {
        title: '不良率',
        dataIndex: 'ngRate',
        width: 120,
        render: val => {
          return <span>{val}%</span>;
        },
      },
    ];
    return (
      <Fragment>
        <Header title="供应商来料在线质量报表">
          <Button type="primary" htmlType="submit" onClick={() => this.handleGetFormValue()} loading={exportLoading}>
            导出
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <Table
            dataSource={list}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            bordered
            pagination={pagination}
            onChange={page => this.handleSearch(page)}
            loading={handleSearchLoading}
          />
          <Card
            key="code-rule-header"
            title='图表'
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            size="small"
          >
            <ChartsData
              legendDataList={legendDataList}
              xaxisList={xaxisList}
              seriesData={seriesData}
              flag={this.state.flag}
            />
          </Card>
        </Content>
        <ModalContainer ref={registerContainer} />
      </Fragment>
    );
  }
}
