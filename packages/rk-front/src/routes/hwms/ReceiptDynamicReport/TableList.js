/*
 * @Description: table-list
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 17:44:36
 * @LastEditTime: 2021-02-03 10:02:47
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const TableList = (props) => {

    const {
        dataSource,
        pagination,
        loading,
        handleFetchList,
    } = props;
    const columns = [
        {
            title: '序号',
            dataIndex: 'seq',
            width: 110,
            align: 'center',
            render: (text, data, index) => {
                return index + 1;
            },
        },
        {
            title: '工厂',
            dataIndex: 'siteCode',
            width: 110,
            align: 'center',
        },
        {
            title: '物料组',
            dataIndex: 'itemGroupCode',
            width: 110,
            align: 'center',
        },
        {
            title: '物料组描述',
            dataIndex: 'itemGroupDescription',
            width: 110,
            align: 'center',
        },
        {
            title: '出入库类型',
            dataIndex: 'stockTypeMeaning',
            width: 110,
            align: 'center',
        },
        {
            title: '出入库时间',
            dataIndex: 'stockDate',
            width: 110,
            align: 'center',
        },
        {
            title: '数量',
            dataIndex: 'qty',
            width: 110,
            align: 'center',
        },
        {
            title: '仓库',
            dataIndex: 'locatorCode',
            width: 110,
            align: 'center',
        },
    ];
    return (
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey="materialLotId"
        loading={loading}
        onChange={page => handleFetchList(page)}
        scroll={{ x: tableScrollWidth(columns, 50) }}
      />
    );
};

export default TableList;
