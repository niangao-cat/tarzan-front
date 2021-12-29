/*
 * @Description: COS条码加工异常汇总查询
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-26 09:01:34
 */

import React, { Component } from 'react';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isArray, isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import ExcelExport from '@/components/ExcelExport';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ cosBarCodeException, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  cosBarCodeException,
  loading: {
    fetchListLoading: loading.effects['cosBarCodeException/queryList'],
  },
}))
@formatterCollections({ code: 'hhme.cosBarCodeException' })
class cosBarCodeException extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      // selectedLineRowKeys: [],
      // eslint-disable-next-line react/no-unused-state
      // selectedLineRows: [], // 选中的行数据
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'cosBarCodeException/init',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosBarCodeException/updateState',
      payload: {
        headAndLine: {},
      },
    });
  }

  /**
   *  查询头列表
   * @param {object} 查询参数
   */
  @Bind()
  handleHeadSearch(fields = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'cosBarCodeException/queryList',
        payload: {
          ...value,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }


  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if(this.form) {
      this.form.validateFields((err, value) => {
        if(!err) {
          const { waferNum, hotSinkCodeList, workOrderNum, heatSinkSupplierLotList, heatSinkMaterialLotList, goldWireSupplierLot, goldWireMaterialLot, materialLotCode, beginTime, endTime, labCode } = value;
          queryParams = filterNullValueObject({
            ...value,
            waferNum: isArray(waferNum) ? waferNum.join(',') : null,
            hotSinkCodeList: isArray(hotSinkCodeList) ? hotSinkCodeList.join(',') : null,
            workOrderNum: isArray(workOrderNum) ? workOrderNum.join(',') : null,
            heatSinkSupplierLotList: isArray(heatSinkSupplierLotList) ? heatSinkSupplierLotList.join(',') : null,
            heatSinkMaterialLotList: isArray(heatSinkMaterialLotList) ? heatSinkMaterialLotList.join(',') : null,
            goldWireSupplierLot: isArray(goldWireSupplierLot) ? goldWireSupplierLot.join(',') : null,
            goldWireMaterialLot: isArray(goldWireMaterialLot) ? goldWireMaterialLot.join(',') : null,
            materialLotCode: isArray(materialLotCode) ? materialLotCode.join(',') : null,
            labCode: isArray(labCode) ? labCode.join(',') : null,
            beginTime: isUndefined(beginTime)
              ? null
              : moment(beginTime).format(DEFAULT_DATETIME_FORMAT),
            endTime: isUndefined(endTime)
              ? null
              : moment(endTime).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }



  render() {
    const {
      selectedRowKeys,
    } = this.state;
    const {
      cosBarCodeException: {
        List = [],
        Pagination = {},
        docTypeMap = [],
        version = [],
      },
      loading: { fetchListLoading, fetchHeadPrintLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      docTypeMap,
      version,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      selectedRowKeys,
      pagination: Pagination,
      loading: fetchListLoading,
      fetchHeadPrintLoading,
      dataSource: List,
      onSearch: this.handleHeadSearch,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hhme.cosBarCodeException.view.message.title').d('COS条码异常汇总信息')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-cos-barcode-exception/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS条码异常汇总信息.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable
            {...listProps}
            history={this.props.history}
          />
        </Content>
      </React.Fragment>
    );
  }
}

export default cosBarCodeException;
