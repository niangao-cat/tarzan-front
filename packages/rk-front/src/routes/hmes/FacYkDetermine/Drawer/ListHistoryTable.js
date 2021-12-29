import React, { Component } from 'react';
import { Table, Modal } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      onSearch,
      onCancel,
      visible,
      pagination,
    } = this.props;
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'materialCode',
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
        title: 'FAC物料编码',
        dataIndex: 'facMaterialCode',
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
        title: '标准值',
        dataIndex: 'standardValue',
        width: 'auto',
        align: 'center',
      },
      {
        title: '允差',
        dataIndex: 'allowDiffer',
        width: 'auto',
        align: 'center',
      },
      {
        title: '变更人',
        dataIndex: 'lastUpdateByName',
        width: 100,
        align: 'center',
      },
      {
        title: '变更时间',
        dataIndex: 'lastUpdateDate',
        width: 150,
        align: 'center',
      },
    ];
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
export default ListTable;
