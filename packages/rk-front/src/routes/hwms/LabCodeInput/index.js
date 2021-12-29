/**
 * LabCodeInput - 实验代码录入
 * *
 * @date: 2021/10/27 14:48:15
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import queryString from 'querystring';

import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject, getEditTableData } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ labCodeInput, loading }) => ({
  labCodeInput,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['labCodeInput/queryBarcodeList'],
    saveLoading: loading.effects['labCodeInput/updateBarcodeData'],
  },
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
class LabCodeInput extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { tenantId, dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'barcodeQuery/batchLovData',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'requisitionAndReturn/querySiteList',
    });
    // 查询条码列表
    // this.handleSearchBarcodeList();
  }

  /**
   *  查询列表
   * @param {object}
   */
  @Bind()
  handleSearchBarcodeList(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'labCodeInput/queryBarcodeList',
      payload: {
        tenantId,
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  更新条码
   */
  @Bind()
  updateBarcodeData() {
    const {
      dispatch,
      labCodeInput: { dataList },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    let params = getEditTableData(dataList, 'materialLotId');
    if (Array.isArray(params) && params.length > 0) {
      params = params.map(item => {
        return {
          ...item,
          woIssueDate: isEmpty(item.woIssueDate)
            ? ''
            : moment(item.woIssueDate).format(DEFAULT_DATETIME_FORMAT),
          productDate: isEmpty(item.productDate)
            ? ''
            : moment(item.productDate).format(DEFAULT_DATETIME_FORMAT),
          overdueInspectionDate: isEmpty(item.overdueInspectionDate)
            ? ''
            : moment(item.overdueInspectionDate).format(DEFAULT_DATETIME_FORMAT),
          // lot: isEmpty(item.lot) ? '' : moment(item.lot).format('YYYYMMDD'),
          supplierId: isEmpty(item.supplierId) ? '' : item.supplierId,
          gradeCode: isEmpty(item.gradeCode) ? '' : item.gradeCode,
          enableDate: isEmpty(item.enableDate)
            ? ''
            : moment(item.enableDate).format(DEFAULT_DATETIME_FORMAT),
          deadlineDate: isEmpty(item.deadlineDate)
            ? ''
            : moment(item.deadlineDate).format(DEFAULT_DATETIME_FORMAT),
        };
      });
      dispatch({
        type: 'labCodeInput/updateBarcodeData',
        payload: {
          dtoList: params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearchBarcodeList();
        }
      });
    }
  }

  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      labCodeInput: { dataList = [] },
    } = this.props;
    const newList = dataList.map(item =>
      item.materialLotId === current.materialLotId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'labCodeInput/updateState',
      payload: {
        dataList: newList,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  handleImport() {
    openTab({
      key: `/hwms/lab-code-input/import/HME.MATERIAL_LOT_LABCODE`,
      title: intl.get('hhme.view.message.import').d('导入'),
      search: queryString.stringify({
        action: intl.get('hhme.view.message.import').d('导入'),
      }),
    });
  };

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      loading: { fetchLoading, saveLoading },
      labCodeInput,
      tenantId,
    } = this.props;
    const { pagination = false, dataList = [] } = labCodeInput;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearchBarcodeList,
    };
    const listProps = {
      pagination,
      loading: fetchLoading,
      dataSource: dataList,
      onSearch: this.handleSearchBarcodeList,
      onEditLine: this.handleEditLine,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.labCodeInput.view.message.barcodeTitle`).d('实验代码录入')}>
          <Button type="primary" icon="save" loading={saveLoading} onClick={this.updateBarcodeData}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button type="primary" onClick={this.handleImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default LabCodeInput;
