/*
 * @Description: 明细查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 17:32:17
 * @LastEditTime: 2020-12-23 15:26:13
 */

import React, { PureComponent } from 'react';
import { Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { tableScrollWidth, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import DetailFilterForm from './DetailFilterForm';

@connect(({ soDeliveryPlatform, loading }) => ({
  soDeliveryPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['freezeThaw/queryList'],
  deleteLoading: loading.effects['freezeThaw/deleteAPI'],
}))
export default class DetailDrawer extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 查询明细
  @Bind
  fetchDetail(fields = {}) {
    const { dispatch, selectedLine, selectedHead, tenantId } = this.props;
    const fieldsValue = (this.detailFormDom && filterNullValueObject(this.detailFormDom.getFieldsValue())) || {};
    dispatch({
      type: 'soDeliveryPlatform/fetchDetail',
      payload: {
        ...fieldsValue,
        instructionIdList: selectedLine.length > 0 ? selectedLine.map(ele => ele.instructionId).toString() : '',
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
        tenantId,
        deliveryDateFrom: isUndefined(fieldsValue.deliveryDateFrom)
          ? null
          : moment(fieldsValue.deliveryDateFrom).format('YYYY-MM-DD HH:mm:ss'),
        deliveryDateTo: isUndefined(fieldsValue.deliveryDateTo)
          ? null
          : moment(fieldsValue.deliveryDateTo).format('YYYY-MM-DD HH:mm:ss'),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      visible,
      onCancel,
      loading,
      dataSource,
      pagination,
      lotStatus,
      qualityStatus,
      tenantId,
    } = this.props;
    const detailFilterFormProps = {
      lotStatus,
      tenantId,
      qualityStatus,
      onSearch: this.fetchDetail,
      onRef: node => {
        this.detailFormDom = node.props.form;
      },
    };
    const columns = [
      {
        title: '行号',
        dataIndex: 'instructionLineNum',
        width: 60,
        align: 'center',
      },
      {
        title: '实物条码',
        dataIndex: 'materialLotCode',
        align: 'center',
        width: 140,
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        align: 'center',
        width: 100,
      },
      {
        title: '条码状态',
        dataIndex: 'materialLotStatusMeaning',
        align: 'center',
        width: 100,
      },
      {
        title: '容器条码',
        dataIndex: 'containerCode',
        align: 'center',
        width: 140,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        align: 'center',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        align: 'center',
        width: 100,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        align: 'center',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'actualQty',
        align: 'center',
        width: 80,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        align: 'center',
        width: 80,
      },
      {
        title: '销售订单号',
        dataIndex: 'soNum',
        align: 'center',
        width: 100,
      },
      {
        title: '销售订单行号',
        dataIndex: 'soLineNum',
        align: 'center',
        width: 120,
      },
      {
        title: '批次',
        dataIndex: 'lot',
        align: 'center',
        width: 100,
      },
      {
        title: '生产订单号',
        dataIndex: 'workOrderNum',
        align: 'center',
        width: 110,
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        align: 'center',
        width: 80,
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        align: 'center',
        width: 80,
      },
      {
        title: '备货时间',
        dataIndex: 'deliveryDate',
        align: 'center',
        width: 130,
      },
      {
        title: '执行人',
        dataIndex: 'lastUpdatedByName',
        align: 'center',
        width: 90,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1400}
        title="出货单行明细"
        visible={visible}
        onCancel={() => onCancel(false)}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        onOk={this.handleOK}
        footer={null}
      >
        <DetailFilterForm {...detailFilterFormProps} />
        <EditTable
          bordered
          rowKey="inspectionSchemeId"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns) }}
          onChange={page => this.fetchDetail(page)}
        />
      </Modal>
    );
  }
}
