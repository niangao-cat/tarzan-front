/*
 * @Description: 明细查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 17:32:17
 * @LastEditTime: 2020-12-23 15:26:13
 */

import React, { PureComponent } from 'react';
import { Modal, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { tableScrollWidth, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import DetailFilterForm from './DetailFilterForm';

import '../index.less';

@connect(({ soDeliveryPlatform, loading }) => ({
  soDeliveryPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchDetailLoading: loading.effects['soDeliveryPlatform/fetchDeleteDetail'],
}))
export default class DetailDrawer extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  // 查询明细
  @Bind
  fetchDetail(fields = {}) {
    const { dispatch, selectedHead, tenantId, lineInfo } = this.props;
    const fieldsValue = (this.detailFormDom && filterNullValueObject(this.detailFormDom.getFieldsValue())) || {};
    dispatch({
      type: 'soDeliveryPlatform/fetchDetail',
      payload: {
        ...fieldsValue,
        instructionIdList: lineInfo.map(row => row.instructionId).toString() || '',
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

  // 删除
  handleDelete = () => {
    const { lineInfo, dispatch, selectedHead } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'soDeliveryPlatform/fetchDeleteDetail',
      payload: {
        voList: selectedRows,
        lineActualQty: lineInfo.actualQty,
        lineDemandQty: lineInfo.demandQty,
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
      },
    }).then(res => {
      if(res) {
        this.setState({
          selectedRows: [],
          selectedRowKeys: [],
        }, () => {
          this.fetchDetail();
        });

      }
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
      fetchDetailLoading,
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
    const { selectedRowKeys } = this.state;
    const { current, pageSize} = pagination;
    const columns = [
      {
        title: '序号',
        align: 'center',
        render: (text, record, index) => (current - 1) * pageSize + index + 1,
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
        title: '有效性',
        dataIndex: 'enableFlagMeaning',
        align: 'center',
        width: 90,
      },
    ];
    const rowSelection={
      selectedRowKeys,
      getCheckboxProps: (record) => ({ disabled: (record.containerCode && record.materialLotStatus === 'SCANNED' )|| record.materialLotStatus !== 'SCANNED'}),
      onChange: (rowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: rowKeys,
        });
      },
      columnWidth: 50,
    };
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
        <div className='line-button'>
          <Button loading={fetchDetailLoading} icon='delete' disabled={selectedRowKeys.length === 0} type="primary" onClick={this.handleDelete}>删除</Button>
        </div>
        <EditTable
          bordered
          rowKey="inspectionSchemeId"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns) }}
          onChange={page => this.fetchDetail(page)}
        />
      </Modal>
    );
  }
}
