/**
 * 锡膏/红胶管理
 *@date：2019/10/31
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import intl from 'utils/intl';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ solderGlueManage, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  solderGlueManage,
  loading: {
    fetchLoading:
      loading.effects['solderGlueManage/queryDataByCode'] ||
      loading.effects['solderGlueManage/operateReceive'] ||
      loading.effects['solderGlueManage/operate'],
  },
}))
@formatterCollections({ code: ['hwms.barcodeQuery', 'hwms.solderGlueManage'] })
class ManageTab extends Component {
  form;

  /**
   *  根据条码查询条码行信息
   */
  @Bind()
  handleSearchByCode(materialLotCode) {
    const {
      dispatch,
      solderGlueManage: { mgrList },
    } = this.props;
    const operate = this.form.getFieldValue('operate');
    dispatch({
      type: 'solderGlueManage/queryDataByCode',
      payload: {
        materialLotCode,
        operate,
      },
    }).then(res => {
      if (res.success) {
        if (operate === 'requisition') {
          this.checkTableStatus(res.rows.content);
        } else {
          dispatch({
            type: 'solderGlueManage/updateState',
            payload: {
              mgrList: [...mgrList, ...res.rows.content],
              mgrPagination: false,
            },
          });
        }
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  // 校验领用操作时，表格行的状态
  @Bind()
  checkTableStatus(data) {
    const {
      dispatch,
      solderGlueManage: { mgrList },
    } = this.props;
    if (mgrList.length === 0) {
      dispatch({
        type: 'solderGlueManage/updateState',
        payload: {
          mgrList: [...mgrList, ...data],
          mgrPagination: false,
        },
      });
    } else if (
      (mgrList[0].solderGlueStatusMeaning === '待领用' &&
        data[0].solderGlueStatusMeaning === '使用中') ||
      (mgrList[0].solderGlueStatusMeaning === '使用中' &&
        data[0].solderGlueStatusMeaning === '待领用')
    ) {
      dispatch({
        type: 'solderGlueManage/updateState',
        payload: {
          mgrList: [...mgrList, ...data],
          mgrPagination: false,
        },
      });
    } else {
      notification.error({
        message: intl
          .get(`hwms.solderGlueManage.view.message.error`)
          .d('同一产线单次只能归还一个空瓶，并领用一个新瓶'),
      });
    }
  }

  /**
   *  点击接收
   * @param fields
   */
  @Bind()
  handleReceive(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'solderGlueManage/operateReceive',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? 0 : fields.current - 1,
        size: isEmpty(fields) ? 20 : fields.pageSize,
      },
    }).then(res => {
      if (!res.success) {
        notification.error({ message: res.message });
      } else {
        notification.success();
      }
    });
  }

  /**
   *  点击确认、回温、待领用、领用、归还
   */
  @Bind()
  handleOperate() {
    const {
      dispatch,
      solderGlueManage: { mgrList = [] },
    } = this.props;
    const materialLotIds = mgrList.map(item => item.materialLotId);
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'solderGlueManage/operate',
      payload: {
        ...filterValues,
        materialLotIds,
      },
    }).then(res => {
      if (!res.success) {
        notification.error({ message: res.message });
      } else {
        notification.success();
      }
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      solderGlueManage: { mgrList = [], mgrPagination, objectMap = [] },
      loading: { fetchLoading },
      tenantId,
      dispatch,
    } = this.props;
    const filterProps = {
      tenantId,
      objectMap,
      mgrList,
      dispatch,
      onRef: this.handleBindRef,
      onSearchCode: this.handleSearchByCode,
      onReceive: this.handleReceive,
      onOperate: this.handleOperate,
    };
    const listHeadProps = {
      pagination: mgrPagination,
      loading: fetchLoading,
      dataSource: mgrList,
      onSearch: this.handleReceive,
    };
    return (
      <React.Fragment>
        <FilterForm {...filterProps} />
        <ListTable {...listHeadProps} />
      </React.Fragment>
    );
  }
}

export default ManageTab;
