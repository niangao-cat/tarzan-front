import React, { Component } from 'react';
import { Table, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  onChange(pagination, filters, sorter) {
    const { onSearch } = this.props;
    const tableParams = {
      page: pagination,
      sortField: isEmpty(sorter) ? '' : sorter.field,
      sortOrder: isEmpty(sorter) ? '' : sorter.order,
    };
    onSearch(tableParams);
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.materialQuery.model.materialQuery';
    const { loading, dataSource, pagination, onBINQuery } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.site`).d('所属工厂'),
        dataIndex: 'siteName',
        width: 120,
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('物料组'),
        dataIndex: 'materialGroup',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.itemTypeDescription`).d('物料类型'),
        dataIndex: 'materialType',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUnit`).d('基本计量单位'),
        dataIndex: 'primaryUom',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.qualityGuarantee`).d('保质期'),
        dataIndex: 'shelfLife',
        width: 120,
        sorter: (a, b) => a.shelfLife - b.shelfLife,
      },
      {
        title: intl.get(`${modelPrompt}.miniNum`).d('最小包装量'),
        dataIndex: 'minPackageQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.QCFlag`).d('是否免检'),
        dataIndex: 'qcFlag',
        width: 90,
        render: (val, record) => (
          <Badge
            status={record.qcFlag === 'Y' ? 'success' : 'error'}
            text={
              record.qcFlag === 'Y'
                ? intl.get(`hzero.common.view.yes`).d('是')
                : intl.get(`hzero.common.view.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.defaultStore`).d('默认存储库位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.maxStore`).d('最大存储库存'),
        dataIndex: 'maxStockQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.minStore`).d('最小存储库存'),
        dataIndex: 'minStockQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.model`).d('材质/型号'),
        dataIndex: 'model',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.netWeight`).d('净重'),
        dataIndex: 'netWeight',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.grossWeight`).d('毛重'),
        dataIndex: 'grossWeight',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.volume`).d('体积'),
        dataIndex: 'volume',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.packageLength`).d('存储包装长度'),
        dataIndex: 'packageLength',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.packageWidth`).d('存储包装宽度'),
        dataIndex: 'packageWidth',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.packageHeight`).d('存储包装高度'),
        dataIndex: 'packageHeight',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        // width: 120,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`hzero.common.view.enable`).d('启用')
                : intl.get(`hzero.common.view.disable`).d('禁用')
            }
          />
        ),
      },
      {
        align: 'center',
        fixed: 'right',
        width: 100,
        render: (value, record) => {
          return (
            <span className="action-link">
              <a onClick={() => onBINQuery(record)}>
                {intl.get(`${modelPrompt}.BinQuery`).d('BIN查询')}
              </a>
            </span>
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialSiteId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={this.onChange.bind(this)}
      />
    );
  }
}
export default ListTable;
