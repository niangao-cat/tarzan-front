/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（头表）
 */
// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

// 默认输出
export default class HeadListTable extends React.Component {
    // 直接渲染
    render() {
        // 护球上文参数
        const {
            loading,
            dataSource,
            pagination,
            selectedHeadKeys,
            onSearch,
            onClickHeadRadio,
        } = this.props;

        // 列展示

        const columns = [
            {
                title: intl.get(`siteCode`).d('工厂'),
                width: 80,
                dataIndex: 'siteCode',
            },
            {
                title: intl.get(`instructionDocNum`).d('单号'),
                dataIndex: 'instructionDocNum',
                width: 140,
            },
            {
                title: intl.get(`supplierCode`).d('供应商编码'),
                dataIndex: 'supplierCode',
                width: 110,
            },
            {
                title: intl.get(`supplierName`).d('供应商'),
                width: 120,
                dataIndex: 'supplierName',
            },
            {
                title: intl.get(`instructionDocTypeMeaning`).d('单据类型'),
                dataIndex: 'instructionDocTypeMeaning',
                width: 100,
            },
            {
                title: intl.get(`instructionDocStatusMeaning`).d('单据状态'),
                dataIndex: 'instructionDocStatusMeaning',
                width: 90,
            },
            {
                title: intl.get(`poLineNum`).d('采购订单'),
                dataIndex: 'poLineNum',
                width: 90,
            },
            {
                title: intl.get(`replenishmentListNum`).d('补料单号'),
                dataIndex: 'replenishmentListNum',
                width: 150,
            },
            {
                title: intl.get(`supplyFlagMeaning`).d('补料标识'),
                dataIndex: 'supplyFlagMeaning',
                width: 90,
            },
            {
                title: intl.get(`demandTime`).d('发货时间'),
                dataIndex: 'demandTime',
                width: 160,
            },
            {
                title: intl.get(`expectedArrivalTime`).d('预计到货时间'),
                dataIndex: 'expectedArrivalTime',
                width: 160,
            },
            {
                title: intl.get(`supplierSiteName`).d('收货地址'),
                dataIndex: 'supplierSiteName',
                width: 120,
            },
            {
                title: intl.get(`reasonMeaning`).d('退料原因'),
                dataIndex: 'reasonMeaning',
                width: 90,
            },
            {
                title: intl.get(`realName`).d('创建人'),
                dataIndex: 'realName',
                width: 90,
            },
            {
                title: intl.get(`creationDate`).d('创建时间'),
                dataIndex: 'creationDate',
                width: 160,
            },
            {
                title: intl.get(`remark`).d('备注'),
                dataIndex: 'remark',
                width: 130,
            },
        ];

        return (
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="instructionDocId"
            pagination={pagination}
            scroll={{ x: tableScrollWidth(columns) }}
            rowSelection={{
                    selectedRowKeys: selectedHeadKeys,
                    type: 'radio', // 单选
                    onChange: onClickHeadRadio,
                }}
            onChange={page => onSearch(page)}
            loading={loading}
          />
        );
    }
}
