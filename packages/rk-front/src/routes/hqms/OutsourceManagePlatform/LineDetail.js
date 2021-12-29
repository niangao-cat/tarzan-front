
// 引入必要的依赖包
import React from 'react';
import { Modal, Spin } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';

// 默认导出 视图
export default class LineDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 加载时调用的方法
  componentDidMount() {
  }

  // 渲染
  render() {
    const {
      visible,
      openDetail,
      dataSource,
      pagination,
      onSearch,
      fetchLineDetailLoading,
      detailLoading,
    } = this.props;
    const columns = [
      {
        title: '行号',
        width: 80,
        render: (val, record, index) => index + 1,
      },
      {
        title: '实物条码',
        dataIndex: 'materialLotCode',
        width: 100,
      },
      {
        title: '条码状态',
        dataIndex: 'barCodeStatusName',
        width: 90,
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        width: 90,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 90,
      },
      {
        title: '数量',
        dataIndex: 'actualQty',
        width: 70,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 70,
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 100,
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        width: 100,
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        width: 100,
      },
      {
        title: '执行时间',
        dataIndex: 'lastUpdateDate',
        width: 130,
      },
      {
        title: '执行人',
        dataIndex: 'lastUpdateByName',
        width: 90,
      },
    ];
    // 返回视图解析
    return (
      <Modal
        destroyOnClose
        width={1600}
        onCancel={() => openDetail({}, false)}
        visible={visible}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        title="明细"
        footer={null}
        confirmLoading={false}
      >
        <Spin spinning={detailLoading}>
          <EditTable
            bordered
            rowKey="materialLotId"
            columns={columns}
            loading={fetchLineDetailLoading}
            dataSource={dataSource}
            pagination={pagination}
            onChange={page => onSearch(page)}
            scroll={{ x: tableScrollWidth(columns) }}
          />
        </Spin>
      </Modal>
    );
  }
}
