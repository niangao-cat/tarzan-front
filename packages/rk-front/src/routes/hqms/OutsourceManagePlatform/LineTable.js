/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（行表）
 */
// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

// 默认输出
export default class LineListTable extends React.Component {
    // 直接渲染
    render() {
        // 护球上文参数
        const {
            loading,
            dataSource,
            pagination,
            onSearch,
            openDetail,
        } = this.props;

        // 列展示

        const columns = [
            {
                title: intl.get(`instructionLineNum`).d('行号'),
                dataIndex: 'instructionLineNum',
            },
            {
                title: intl.get(`materialCode`).d('物料编码'),
                dataIndex: 'materialCode',
            },
            {
                title: intl.get(`materialName`).d('物料描述'),
                width: 120,
                dataIndex: 'materialName',
            },
            {
                title: intl.get(`materialVersion`).d('物料版本'),
                dataIndex: 'materialVersion',
            },
            {
                title: intl.get(`quantity`).d('制单数量'),
                dataIndex: 'quantity',
            },
            {
                title: intl.get(`actualOrderedQty`).d('实际制单数量'),
                dataIndex: 'actualOrderedQty',
            },
            {
                title: intl.get(`actualQty`).d('执行数量'),
                dataIndex: 'actualQty',
            },
            {
                title: intl.get(`inventoryQty`).d('库存现有量'),
                dataIndex: 'inventoryQty',
            },
            {
                title: intl.get(`uomCode`).d('单位'),
                dataIndex: 'uomCode',
            },
            {
                title: intl.get(`instructionStatusMeaning`).d('行状态'),
                dataIndex: 'instructionStatusMeaning',
            },
            {
                title: intl.get(`fromLocatorCode`).d('发出仓库'),
                dataIndex: 'fromLocatorCode',
            },
            {
                title: intl.get(`toLocatorCode`).d('接收仓库'),
                dataIndex: 'toLocatorCode',
            },
            {
                title: intl.get('hzero.common.button.action').d('操作'),
                dataIndex: 'operator',
                align: 'center',
                fixed: 'right',
                width: 130,
                render: (val, record) => (
                  <a className="action-link" onClick={()=>openDetail(record, true)}>
                    明细
                  </a>
                  ),
            },
        ];

        return (
          <Table
            rowKey="instructionId"
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={page => onSearch(page)}
            loading={loading}
          />
        );
    }
}
