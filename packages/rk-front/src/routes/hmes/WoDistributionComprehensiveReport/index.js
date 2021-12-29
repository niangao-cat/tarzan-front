/*
 * @Description: 工单配送综合查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-24 16:24:26
 * @LastEditTime: 2020-12-28 19:42:18
 */
import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { Table, Button } from 'hzero-ui';
import { filterNullValueObject, tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
// import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';


@connect(({ woDistributionComprehensiveReport, loading }) => ({
  woDistributionComprehensiveReport,
  tenantId: getCurrentOrganizationId(),
  handleSearchLoading: loading.effects['woDistributionComprehensiveReport/handleSearch'],
  exportLoading: loading.effects['woDistributionComprehensiveReport/exportExcel'],
}))
export default class WoDistributionComprehensiveReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'woDistributionComprehensiveReport/batchLovData',
      tenantId,
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
    const { dispatch } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'woDistributionComprehensiveReport/handleSearch',
      payload: {
        ...fieldsValue,
        prodLineIdList: fieldsValue.prodLineIdList && fieldsValue.prodLineIdList ? fieldsValue.prodLineIdList.split(',') : [],
        workcellIdList: fieldsValue.workcellIdList && fieldsValue.workcellIdList ? fieldsValue.workcellIdList.split(',') : [],
        toWarehouseIdList: fieldsValue.toWarehouseIdList && fieldsValue.toWarehouseIdList ? fieldsValue.toWarehouseIdList.split(',') : [],
        materialCodeList: fieldsValue.materialCodeList && fieldsValue.materialCodeList ? fieldsValue.materialCodeList.split(',') : [],
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(fieldsValue.creationDateTo)
          ? null
          : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        updateDateFrom: isUndefined(fieldsValue.updateDateFrom)
          ? null
          : moment(fieldsValue.updateDateFrom).format(DEFAULT_DATETIME_FORMAT),
        updateDateTo: isUndefined(fieldsValue.updateDateTo)
          ? null
          : moment(fieldsValue.updateDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // @Bind()
  // handleGetFormValue() {
  //   const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
  //   return filterNullValueObject({
  //     ...fieldsValue,
  //     creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
  //       ? null
  //       : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
  //     creationDateTo: isUndefined(fieldsValue.creationDateTo)
  //       ? null
  //       : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
  //     updateDateFrom: isUndefined(fieldsValue.updateDateFrom)
  //       ? null
  //       : moment(fieldsValue.updateDateFrom).format(DEFAULT_DATETIME_FORMAT),
  //     updateDateTo: isUndefined(fieldsValue.updateDateTo)
  //       ? null
  //       : moment(fieldsValue.updateDateTo).format(DEFAULT_DATETIME_FORMAT),
  //   });
  // }

  // 导出
  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'woDistributionComprehensiveReport/exportExcel',
      payload: {
        ...fieldsValue,
        prodLineIdList: fieldsValue.prodLineIdList && fieldsValue.prodLineIdList ? fieldsValue.prodLineIdList.split(',') : [],
        workcellIdList: fieldsValue.workcellIdList && fieldsValue.workcellIdList ? fieldsValue.workcellIdList.split(',') : [],
        toWarehouseIdList: fieldsValue.toWarehouseIdList && fieldsValue.toWarehouseIdList ? fieldsValue.toWarehouseIdList.split(',') : [],
        materialCodeList: fieldsValue.materialCodeList && fieldsValue.materialCodeList ? fieldsValue.materialCodeList.split(',') : [],
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(fieldsValue.creationDateTo)
          ? null
          : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        updateDateFrom: isUndefined(fieldsValue.updateDateFrom)
          ? null
          : moment(fieldsValue.updateDateFrom).format(DEFAULT_DATETIME_FORMAT),
        updateDateTo: isUndefined(fieldsValue.updateDateTo)
          ? null
          : moment(fieldsValue.updateDateTo).format(DEFAULT_DATETIME_FORMAT),
      },
    }).then(res => {
      if(res){
        const file = new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
        );
        const fileURL = URL.createObjectURL(file);
        const fileName = '配送综合查询报表.xlsx';
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
      woDistributionComprehensiveReport: {
        list = [],
        pagination = {},
        instructionDocTypeLisy = [],
        docStatus = [],
        rowStatus = [],
      },
      handleSearchLoading,
      // tenantId,
      exportLoading,
    } = this.props;
    // 查询
    const filterFormProps = {
      docStatus,
      rowStatus,
      instructionDocTypeLisy,
      onSearch: this.handleSearch,
      resetForm: this.onResetSearch,
      onSelectedSite: this.onSelectedSite,
      onSelectedDivision: this.onSelectedDivision,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'sequence',
        width: 60,
        render: (value, record, index) => index + 1,
      },
      {
        title: '配送单',
        dataIndex: 'instructionDocNum',
        width: 130,
      },
      {
        title: '配送单状态',
        dataIndex: 'instructionDocStatusMeaning',
        width: 110,
      },
      {
        title: '是否备齐',
        dataIndex: 'suiteFlagMeaning',
        width: 90,
      },
      {
        title: '工厂',
        dataIndex: 'siteCode',
        width: 100,
      },
      {
        title: '工段',
        dataIndex: 'workcellCode',
        width: 100,
      },
      {
        title: '产线',
        dataIndex: 'productionLineCode',
        width: 100,
      },
      {
        title: '目标仓库',
        dataIndex: 'toWarehouseCode',
        width: 100,
      },
      {
        title: '创建人',
        dataIndex: 'createdByName',
        width: 80,
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        width: 120,
      },
      {
        title: '更新人',
        dataIndex: 'lastUpdatedByName',
        width: 80,
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
      },
      {
        title: '行号',
        dataIndex: 'instructionLineNum',
        width: 100,
      },
      {
        title: '物料',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 100,
      },
      {
        title: '行状态',
        dataIndex: 'instructionStatusMeaning',
        width: 90,
      },
      {
        title: '销售订单-行号',
        dataIndex: 'soLine',
        width: 140,
      },
      {
        title: '需求数量',
        dataIndex: 'quantity',
        width: 90,
      },
      {
        title: '备料数量',
        dataIndex: 'actualQty',
        width: 90,
      },
      {
        title: '签收数量',
        dataIndex: 'signedQty',
        width: 90,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 80,
      },
    ];
    return (
      <Fragment>
        <Header title="配送综合查询报表">
          {/* {list.length > 0 && ( */}
          {/*   // <ExcelExport */}
          {/*   //   exportAsync */}
          {/*   //   requestUrl={`/mes-report/v1/${tenantId}/distribution-general/export`} // 路径 */}
          {/*   //   otherButtonProps={{ type: 'primary' }} */}
          {/*   //   queryParams={this.handleGetFormValue()} */}
          {/*   // /> */}
          {/* )} */}
          <Button type="primary" icon="download" htmlType="submit" onClick={() => this.handleGetFormValue()} loading={exportLoading}>
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
        </Content>
      </Fragment>
    );
  }
}
