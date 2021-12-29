import React, { Component } from 'react';
import { Table, Modal } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class NcFlagTable extends Component {
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
      ncFlagParams,
      pagination,
    } = this.props;
    const columns = [
      {
        title: '位置',
        dataIndex: 'position',
        width: 120,
        align: 'center',
      },
      {
        title: '不良代码',
        dataIndex: 'ncCode',
        width: 120,
        align: 'center',
      },
      {
        title: '不良代码描述',
        dataIndex: 'ncCodeName',
        width: 150,
        align: 'center',
      },
    ];
    return (
      <Modal
        destroyOnClose
        maskClosable
        width={500}
        title='不良信息'
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
          pagination={{ ...pagination }}
          scroll={{ x: tableScrollWidth(columns, 50)}}
          onChange={page => onSearch(ncFlagParams, page)}
        />
      </Modal>
    );
  }
}
export default NcFlagTable;
