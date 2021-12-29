/*
 * @Description: cos目检条码表
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-05 10:25:46
 * @LastEditTime: 2020-01-06 13:47:10
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Table} from 'hzero-ui';
import moment from 'moment';
import { isArray, isEmpty, isUndefined } from 'lodash';

import { Header, Content } from 'components/Page';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import {DEFAULT_DATETIME_FORMAT} from 'utils/constants';
import { ReportHost } from '@/utils/config';
import ExcelExport from '@/components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import FilterForm from './FilterForm';

@connect(({ cosCheckBarcode, loading }) => ({
  cosCheckBarcode,
  tenantId: getCurrentOrganizationId(),
  fetchCosCheckBarcodesLoading: loading.effects['cosCheckBarcode/fetchCosCheckBarcodes'],
}))
export default class CosCheckBarcode extends Component {

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
   // 查询独立值集
  dispatch({
    type: 'cosCheckBarcode/init',
    payload: {
      tenantId,
    },
  });
  }

  @Bind
  fetchCosCheckBarcodes(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = this.handleGetFormValue();
    if(filterValues) {
      dispatch({
        type: 'cosCheckBarcode/fetchCosCheckBarcodes',
        payload: {
          ...filterValues,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }

  // 数据导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const { siteInDateTo, siteInDateFrom, siteOutDateFrom, siteOutDateTo, materialId, cosType, hotSinkCode, hotSinkSupplierLot, ...otherValue } = value;
          queryParams = filterNullValueObject({
            ...otherValue,
            materialId: isArray(materialId) ? materialId.join(',') : null,
            cosType: isArray(cosType) ? cosType.join(',') : null,
            hotSinkCode: isArray(hotSinkCode) ? hotSinkCode.join(',') : null,
            hotSinkSupplierLot: isArray(hotSinkSupplierLot) ? hotSinkSupplierLot.join(',') : null,
            siteInDateTo: isUndefined(siteInDateTo)
              ? null
              : moment(siteInDateTo).format(DEFAULT_DATETIME_FORMAT),
            siteInDateFrom: isUndefined(siteInDateFrom)
              ? null
              : moment(siteInDateFrom).format(DEFAULT_DATETIME_FORMAT),
            siteOutDateFrom: isUndefined(siteOutDateFrom)
              ? null
              : moment(siteOutDateFrom).format(DEFAULT_DATETIME_FORMAT),
            siteOutDateTo: isUndefined(siteOutDateTo)
              ? null
              : moment(siteOutDateTo).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }

  // 渲染 界面布局
  render() {
    const {
      fetchCosCheckBarcodesLoading,
      tenantId,
      cosCheckBarcode: { reportData = [], reportDataPagination = {}, cosTypeMap = [], defaultDate = [], orderTypeList = []},
    } = this.props;
    const filterFormProps = {
      defaultDate,
      cosTypeMap,
      orderTypeList,
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.fetchCosCheckBarcodes,
    };
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 110,
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        width: 110,
      },
      {
        title: '版本描述',
        dataIndex: 'productionVersionDesc',
        width: 110,
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '工单芯片数',
        dataIndex: 'qty',
        width: 110,
      },
      {
        title: 'WAFER',
        dataIndex: 'wafer',
        width: 80,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 100,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 180,
      },
      {
        title: 'COS数量',
        dataIndex: 'snQty',
        width: 100,
      },
      {
        title: '合格数量',
        dataIndex: 'passQty',
        width: 100,
      },
      {
        title: '位置',
        dataIndex: 'rowCloumn',
        width: 80,
      },
      {
        title: '热沉编号',
        dataIndex: 'hotSinkCode',
        width: 100,
      },
      {
        title: '不良编码',
        dataIndex: 'ncCode',
        width: 120,
      },
      {
        title: '不良描述',
        dataIndex: 'description',
        width: 120,
      },
      {
        title: '备注',
        dataIndex: 'note',
        width: 150,
      },
      {
        title: '工序状态',
        dataIndex: 'orderType',
        width: 100,
      },
      {
        title: '操作者',
        dataIndex: 'operatorName',
        width: 100,
      },
      {
        title: '进站时间',
        dataIndex: 'siteInDate',
        width: 150,
      },
      {
        title: '出站时间',
        dataIndex: 'siteOutDate',
        width: 150,
      },
      {
        title: '加工时长/m',
        dataIndex: 'processTime',
        width: 150,
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 100,
      },
      {
        title: '工位描述',
        dataIndex: 'workcellName',
        width: 100,
      },
      {
        title: '设备编码',
        dataIndex: 'equipment',
        width: 100,
      },
      {
        title: '测试机台',
        dataIndex: 'bench',
        width: 150,
      },
      {
        title: '贴片设备',
        dataIndex: 'patch',
        width: 150,
      },
      {
        title: '热沉类型',
        dataIndex: 'hotType',
        width: 100,
      },
      {
        title: '热沉投料条码',
        dataIndex: 'barcode',
        width: 150,
      },
      {
        title: '热沉供应商批次',
        dataIndex: 'hotSinkSupplierLot',
        width: 150,
      },
      {
        title: '金锡比',
        dataIndex: 'ausnRatio',
        width: 80,
      },
      {
        title: '实验代码',
        dataIndex: 'experimentCode',
        width: 100,
      },
      {
        title: '工序描述',
        dataIndex: 'processName',
        width: 100,
      },
      {
        title: '工段描述',
        dataIndex: 'lineWorkcellName',
        width: 100,
      },
      {
        title: '生产线描述',
        dataIndex: 'prodLineName',
        width: 100,
      },
    ];
    return (
      <React.Fragment>
        <Header title='cos目检条码表'>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-cos-checkBarcodes/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS目检条码表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <Table
            bordered
            dataSource={reportData}
            columns={columns}
            loading={fetchCosCheckBarcodesLoading}
            pagination={reportDataPagination}
            onChange={page => this.fetchCosCheckBarcodes(page)}
          />
          <ModalContainer ref={registerContainer} />
        </Content>
      </React.Fragment>
    );
  }
}
