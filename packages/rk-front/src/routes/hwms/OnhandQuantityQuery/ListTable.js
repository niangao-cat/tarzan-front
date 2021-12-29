/**
 * 现有量查询
 *@date：2020/4/19
 *@author：zzc <zhicen.zhang@hand-china.com>>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import React, { Component } from 'react';
import { Dropdown, Menu, Table } from 'hzero-ui';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';

import EditableTable from '@/components/FilterTable';

const modelPrompt = 'hwms.onhandQuery.model.onhandQuery';

@formatterCollections({ code: ['hwms.onhandQuery', 'hwms.barcodeQuery'] })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customColumns: [
        {
          fieldName: intl.get(`${modelPrompt}.siteCode`).d('工厂编码'),
          fieldKey: 'siteCode',
          hidden: 0,
          fixedLeft: 0,
          fixedRight: 0,
          orderSeq: 0,
        },
        {
          fieldName: intl.get(`${modelPrompt}.siteName`).d('工厂描述'),
          fieldKey: 'siteName',
          hidden: 0,
          orderSeq: 1,
        },
        {
          fieldName: intl.get(`${modelPrompt}.warehouseCode`).d('仓库编码'),
          fieldKey: 'warehouseCode',
          hidden: 0,
          orderSeq: 2,
        },
        {
          fieldName: intl.get(`${modelPrompt}.warehouseName`).d('仓库描述'),
          fieldKey: 'warehouseName',
          hidden: 0,
          orderSeq: 3,
        },
        {
          fieldName: intl.get(`${modelPrompt}.locatorCode`).d('库位编码'),
          fieldKey: 'locatorCode',
          hidden: 0,
          orderSeq: 4,
        },
        {
          fieldName: intl.get(`${modelPrompt}.locatorName`).d('库位描述'),
          fieldKey: 'locatorName',
          hidden: 0,
          orderSeq: 5,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
          fieldKey: 'materialCode',
          hidden: 0,
          orderSeq: 6,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
          fieldKey: 'materialName',
          hidden: 0,
          orderSeq: 7,
        },
        {
          fieldName: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
          fieldKey: 'primaryUomCode',
          hidden: 0,
          orderSeq: 8,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lotCode`).d('批次'),
          fieldKey: 'lotCode',
          hidden: 0,
          orderSeq: 9,
        },
        {
          fieldName: intl.get(`${modelPrompt}.onhandQuantity`).d('库存'),
          fieldKey: 'onhandQuantity',
          hidden: 0,
          orderSeq: 10,
        },
      ],
      filterVisible: false,
    };
  }

  // 排序
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
   * 打开筛选框
   */
  filterOpen = () => {
    this.setState({ filterVisible: true });
  };

  /**
   *  关闭筛选框
   */
  filterClose = () => {
    this.setState({
      filterVisible: false,
    });
  };

  /**
   *  table实时显示动态列
   * @param filterColumns
   */
  @Bind()
  getfilterData(filterColumns) {
    this.setState({
      customColumns: [...filterColumns],
    });
  }

  /**
   * 列筛选框点击事件
   * @param customColumns
   */
  @Bind()
  handleCustomColumnFilter(customColumns) {
    this.setState({
      customColumns,
    });
  }

  /**
   * tableScrollWidth - 计算滚动表格的宽度
   * 如果 fixWidth 不传或者为0, 会将没有设置宽度的列 宽度假设为 200
   * @param {array} columns - 表格列
   * @param {number} fixWidth - 不固定宽度列需要补充的宽度
   * @return {number} - 返回计算过的 x 值
   */
  tableScrollWidth(columns = [], fixWidth = 0) {
    let fillFixWidthCount = 0;
    let columnsObject = [];
    columnsObject = columns;
    this.state.customColumns.forEach(e => {
      if (e.hidden === 1) {
        columns.forEach((x, index) => {
          if (e.fieldKey === x.dataIndex) {
            columnsObject[index] = { ...x, ...{ width: 0 } };
          }
        });
      }
    });
    const total = columnsObject.reduce((prev, current) => {
      if (current.width) {
        return prev + current.width;
      }
      fillFixWidthCount += 1;
      return prev;
    }, 0);
    if (fixWidth) {
      return total + fixWidth + 1;
    }
    return total + fillFixWidthCount * 200 + 1;
  }

  /**
   * 渲染列筛选框
   * @returns {*}
   */
  renderFilterTable() {
    const { customColumns, filterVisible } = this.state;
    const filterTableProps = {
      modelPrompt,
      record: customColumns,
      filterClose: this.filterClose.bind(this),
      getfilterData: this.getfilterData,
    };
    const menu1 = (
      <Menu style={{ width: 280, height: 360 }}>
        <Menu.Item>
          <EditableTable {...filterTableProps} />
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu1} placement="bottomLeft" trigger={['click']} visible={filterVisible}>
        <a
          onClick={() => this.filterOpen()}
          href="#"
          style={{ marginLeft: '98%', marginBottom: 5 }}
        >
          <svg
            t="1565754298719"
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3212"
            width="16"
            height="16"
          >
            <path
              d="M877.714286 665.6V36.571429c0-21.942857-14.628571-36.571429-36.571429-36.571429s-36.571429 14.628571-36.571428 36.571429v629.028571c-43.885714 14.628571-73.142857 58.514286-73.142858 102.4 0 43.885714 29.257143 87.771429 73.142858 102.4v117.028571c0 21.942857 14.628571 36.571429 36.571428 36.571429s36.571429-14.628571 36.571429-36.571429v-117.028571c43.885714-14.628571 73.142857-58.514286 73.142857-102.4 0-51.2-29.257143-87.771429-73.142857-102.4z m-36.571429 138.971429c-21.942857 0-36.571429-14.628571-36.571428-36.571429s14.628571-36.571429 36.571428-36.571429 36.571429 14.628571 36.571429 36.571429-14.628571 36.571429-36.571429 36.571429zM146.285714 665.6V36.571429c0-21.942857-14.628571-36.571429-36.571428-36.571429S73.142857 14.628571 73.142857 36.571429v629.028571c-43.885714 14.628571-73.142857 51.2-73.142857 102.4 0 43.885714 29.257143 87.771429 73.142857 102.4v117.028571c0 21.942857 14.628571 36.571429 36.571429 36.571429s36.571429-14.628571 36.571428-36.571429v-117.028571c43.885714-14.628571 73.142857-58.514286 73.142857-102.4 0-51.2-29.257143-87.771429-73.142857-102.4zM109.714286 804.571429c-21.942857 0-36.571429-14.628571-36.571429-36.571429s14.628571-36.571429 36.571429-36.571429 36.571429 14.628571 36.571428 36.571429-14.628571 36.571429-36.571428 36.571429zM512 153.6V36.571429c0-21.942857-14.628571-36.571429-36.571429-36.571429S438.857143 14.628571 438.857143 36.571429v117.028571c-43.885714 14.628571-73.142857 58.514286-73.142857 102.4s29.257143 87.771429 73.142857 102.4v629.028571c0 21.942857 14.628571 36.571429 36.571428 36.571429s36.571429-14.628571 36.571429-36.571429V358.4c43.885714-14.628571 73.142857-58.514286 73.142857-102.4s-29.257143-87.771429-73.142857-102.4zM475.428571 292.571429c-21.942857 0-36.571429-14.628571-36.571428-36.571429s14.628571-36.571429 36.571428-36.571429 36.571429 14.628571 36.571429 36.571429-14.628571 36.571429-36.571429 36.571429z"
              p-id="3213"
              fill="#8a8a8a"
            />
          </svg>
        </a>
      </Dropdown>
    );
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { customColumns } = this.state;
    const { loading, dataSource, pagination } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('工厂编码'),
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('工厂描述'),
        dataIndex: 'siteName',
      },
      {
        title: intl.get(`${modelPrompt}.warehouseCode`).d('仓库编码'),
        dataIndex: 'warehouseCode',
      },
      {
        title: intl.get(`${modelPrompt}.warehouseName`).d('仓库描述'),
        dataIndex: 'warehouseName',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位编码'),
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${modelPrompt}.locatorName`).d('货位描述'),
        dataIndex: 'locatorName',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
        dataIndex: 'primaryUomCode',
      },
      {
        title: intl.get(`${modelPrompt}.lotCode`).d('批次'),
        dataIndex: 'lotCode',
      },
      {
        title: intl.get(`${modelPrompt}.onhandQuantity`).d('库存'),
        dataIndex: 'onhandQuantity',
      },
      {
        title: intl.get(`${modelPrompt}.itemGroupCode`).d('物料组'),
        dataIndex: 'itemGroupCode',
      },
      {
        title: intl.get(`${modelPrompt}.itemGroupDescription`).d('物料组描述'),
        dataIndex: 'itemGroupDescription',
      },
    ];
    return (
      <div>
        {this.renderFilterTable()}
        <Table
          bordered
          rowKey="onhandQuantityId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: this.tableScrollWidth(columns, 100) }}
          onChange={this.onChange.bind(this)}
          customCode="customTable"
          customColumns={customColumns}
          onCustomColumnFilter={this.handleCustomColumnFilter}
        />
      </div>
    );
  }
}
export default ListTable;
