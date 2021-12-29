/*
 * @Description: 头数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:05:45
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
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
      pagination,
      selectedHeadKeys,
      onSelectHead,
      handleAddHeadData,
    } = this.props;
    const columns = [
      {
        title: '组织',
        dataIndex: 'siteName',
        width: 100,
        align: 'center',
        // render: (text, record) => <a onClick={() => handleUpdateData(record)}>{text}</a>,
      },
      {
        title: '设备类别',
        dataIndex: 'equipmentCategoryMeaning',
        width: 100,
        align: 'center',
        render: (text, record) => <a onClick={() => handleAddHeadData(record, true)}>{text}</a>,
      },
      {
        title: '部门',
        dataIndex: 'businessName',
        width: 100,
        align: 'center',
      },
      {
        title: '工艺编码',
        dataIndex: 'operationName',
        width: 100,
        align: 'center',
      },
      {
        title: '工艺描述',
        dataIndex: 'operationDescription',
        width: 100,
        align: 'center',
      },
      // {
      //   title: '设备使用年限',
      //   dataIndex: 'serviceLifeMeaning',
      //   width: 110,
      //   align: 'center',
      // },
      {
        title: '项目组编码',
        dataIndex: 'tagGroupCode',
        width: 100,
        align: 'center',
      },
      {
        title: '项目组描述',
        dataIndex: 'tagGroupDescription',
        width: 100,
        align: 'center',
      },
      {
        title: '设备管理类型',
        dataIndex: 'manageTypeMeaning',
        width: 110,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: '是否有效',
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (text, record) => {
          if (record.enableFlag === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="cid"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedHeadKeys,
          onChange: onSelectHead,
        }}
      />
    );
  }
}
export default ListTable;
