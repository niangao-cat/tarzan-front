/*
 * @Description: 明细
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-11 16:45:45
 * @LastEditTime: 2020-09-14 20:03:20
 */

import React, { Component } from 'react';
import { Form, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { filterNullValueObject } from 'utils/utils';
import { isUndefined } from 'lodash';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {

  @Bind()
  handleFetchDetailList(page = {}) {
    const { handleFetchDetailList } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    const val = {
      ...fieldsValue,
      receiptDateFrom: isUndefined(fieldsValue.receiptDateFrom)
        ? null
        : moment(fieldsValue.receiptDateFrom).format(DEFAULT_DATETIME_FORMAT),
      receiptDateTo: isUndefined(fieldsValue.receiptDateTo)
        ? null
        : moment(fieldsValue.receiptDateTo).format(DEFAULT_DATETIME_FORMAT),
    };
    handleFetchDetailList(val, page);
  }


  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      tenantId,
      saveLoading,
      onCancel,
      visible,
      barcodeStatusList,
      qualityStatusList,
      detailList,
      detailListPagination,
      fetchLineDetailLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      barcodeStatusList,
      qualityStatusList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchDetailList,
    };
    const lineTableProps = {
      loading: fetchLineDetailLoading,
      dataSource: detailList,
      pagination: detailListPagination,
      onSearch: this.handleFetchDetailList,
    };
    return (
      <Modal
        destroyOnClose
        width="100%"
        title='入库单查询明细'
        visible={visible}
        confirmLoading={saveLoading}
        onCancel={() => onCancel(false)}
        footer={false}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <FilterForm {...filterProps} />
        {/* <div className={styles['head-table']}> */}
        <ListTable {...lineTableProps} />
      </Modal>
    );
  }
}
