import React, { Component } from 'react';
import { Table, Modal } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListHistoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  handleGetColumn() {
    const { objectType } = this.props;
    let columns = [];
    switch(objectType) {
      case 'HEADER':
        columns = [
          {
            title: '标准件编码',
            dataIndex: 'standardSnCode',
            width: 100,
            align: 'center',
          },
          {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 100,
            align: 'center',
          },
          {
            title: '物料描述',
            dataIndex: 'materialName',
            width: 100,
            align: 'center',
          },
          {
            title: '芯片类型',
            dataIndex: 'cosType',
            width: 100,
            align: 'center',
          },
          {
            title: '工作方式',
            dataIndex: 'workWayMeaning',
            width: 100,
            align: 'center',
          },
          {
            title: '工位编码',
            dataIndex: 'workcellCode',
            width: 100,
            align: 'center',
          },
          {
            title: '工位描述',
            dataIndex: 'workcellName',
            width: 100,
            align: 'center',
          },
          {
            title: '有效性',
            dataIndex: 'enableFlagMeaning',
            width: 100,
            align: 'center',
          },
          {
            title: '更新人',
            dataIndex: 'lastUpdateByName',
            width: 100,
            align: 'center',
          },
          {
            title: '更新时间',
            dataIndex: 'lastUpdateDate',
            width: 150,
            align: 'center',
          },
        ];
        break;
      case 'LINE':
        columns = [
          {
            title: '序号',
            dataIndex: 'sequence',
            width: 100,
            align: 'center',
          },
          {
            title: '检验项编码',
            dataIndex: 'tagCode',
            width: 100,
            align: 'center',
          },
          {
            title: '检验项描述',
            dataIndex: 'tagDescription',
            width: 100,
            align: 'center',
          },
          {
            title: '最小值',
            dataIndex: 'minimumValue',
            width: 100,
            align: 'center',
          },
          {
            title: '最大值',
            dataIndex: 'maximalValue',
            width: 100,
            align: 'center',
          },
          {
            title: '耦合允差',
            dataIndex: 'allowDiffer',
            width: 100,
            align: 'center',
          },
          {
            title: '检验允差',
            dataIndex: 'checkAllowDiffer',
            width: 100,
            align: 'center',
          },
          {
            title: '是否影响耦合',
            dataIndex: 'coupleFlagMeaning',
            width: 100,
            align: 'center',
          },
          {
            title: '是否标准件检验判定项',
            dataIndex: 'judgeFlagMeaning',
            width: 100,
            align: 'center',
          },
          {
            title: '是否单路影响耦合',
            dataIndex: 'cosCoupleFlagMeaning',
            width: 100,
            align: 'center',
          },
          {
            title: 'COS位置',
            dataIndex: 'cosPos',
            width: 100,
            align: 'center',
          },
          {
            title: '更新人',
            dataIndex: 'lastUpdateByName',
            width: 100,
            align: 'center',
          },
          {
            title: '更新时间',
            dataIndex: 'lastUpdateDate',
            width: 150,
            align: 'center',
          },
        ];
        break;
      default:
        break;
    }
    return columns;
  }

  @Bind()
  handleGetDataSource() {
    const { objectType, dataSources } = this.props;
    let dataSource = [];
    switch(objectType) {
      case 'HEADER':
        dataSource = dataSources.headerHistoryData;
        break;
      case 'LINE':
        dataSource = dataSources.lineHistoryData;
        break;
      default:
        break;
    }
    return dataSource;
  }

  @Bind()
  handleGetPagination() {
    const { objectType, paginations } = this.props;
    let pagination = {};
    switch(objectType) {
      case 'HEADER':
        pagination = paginations.headerHistoryDataPagination;
        break;
      case 'LINE':
        pagination = paginations.lineHistoryDataPagination;
        break;
      default:
        break;
    }
    return pagination;
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      onSearch,
      onCancel,
      visible,
    } = this.props;
    const columns = this.handleGetColumn();
    const dataSource = this.handleGetDataSource();
    const pagination = this.handleGetPagination();
    return (
      <Modal
        destroyOnClose
        maskClosable
        width={1000}
        title='历史记录'
        visible={visible}
        onCancel={onCancel}
        footer={null}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          bordered
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={{ ...pagination, pageSizeOptions: ['10', '50', '100', '200', '500'] }}
          scroll={{ x: tableScrollWidth(columns, 50)}}
          onChange={page => onSearch(page)}
        />
      </Modal>
    );
  }
}
export default ListHistoryTable;
