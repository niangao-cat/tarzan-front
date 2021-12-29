/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Modal, Input, Table, Checkbox, Button, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isArray } from 'lodash';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

import styles from './index.less';

export default class DataRecordModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: {},
      sortedInfo: {},
    };
  }

  @Bind()
  getColumnSearchProps(type) {
    const { filteredInfo = {} } = this.state;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} className={styles.dropDown}>
          <Input
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filteredValue: filteredInfo[type] || null,
    };
  };

  @Bind()
  handlePagination(pagination, filtersArg, sortArg) {
    const { eoId, onSearch } = this.props;
    const searchParams = {};

    this.setState({
      filteredInfo: filtersArg,
      sortedInfo: sortArg,
    });

    [('bomComponentCode', 'bomComponentName', 'step', 'stepDesc')].forEach(text => {
      if (filtersArg[text]) {
        searchParams[text] = isArray(filtersArg[text]) ? filtersArg[text][0] : filtersArg[text];
      }
    });
    searchParams.sortDirection = sortArg.order === 'descend' ? 'DESC' : 'ASC';

    const param = Object.assign(filtersArg, searchParams);

    const params = {
      eoId,
      ...param,
      page: pagination,
    };

    onSearch(params);
  };


  render() {
    const { dataSource = [], visible, loading, pagination, onSearch, onClose } = this.props;
    const expandedRowRender = record => {
      const columns = [
        {
          title: '替代组',
          dataIndex: 'substituteGroup',
          width: 100,
        },
        {
          title: '替代策略',
          dataIndex: 'substitutePolicyDesc',
          width: 100,
          align: 'left',
        },
        {
          title: '替代物料编码',
          dataIndex: 'materialCode',
          width: 100,
        },
        {
          title: '替代物料描述',
          dataIndex: 'materialName',
          width: 100,
          align: 'left',
        },
        {
          title: '替代值',
          dataIndex: 'substituteValue',
          width: 100,
          align: 'left',
        },
        {
          title: '替代用量',
          dataIndex: 'substituteUsage',
          width: 100,
          align: 'left',
        },
        {
          title: '装配数量',
          dataIndex: 'assembleQty',
          width: 100,
          align: 'left',
        },
      ];
      return (
        <Table
          columns={columns}
          rowKey="materialId"
          dataSource={record.substituteList}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'lineNumber',
        width: 100,
      },
      {
        title: '组件编码',
        width: 150,
        align: 'left',
        dataIndex: 'bomComponentCode',
        ...this.getColumnSearchProps('bomComponentCode'),
      },
      {
        title: '组件名称',
        width: 150,
        align: 'left',
        dataIndex: 'bomComponentName',
        ...this.getColumnSearchProps('bomComponentName'),
      },
      {
        title: '组件类型',
        width: 150,
        dataIndex: 'bomComponentTypeDesc',
      },
      {
        title: '装配方式',
        dataIndex: 'assembleMethodDesc',
        width: 150,
      },
      {
        title: '需求数量',
        dataIndex: 'componentQty',
        width: 100,
      },
      {
        title: '装配数量',
        dataIndex: 'assembleQty',
        width: 100,
      },
      {
        title: '替代数量',
        dataIndex: 'substituteQty',
        width: 100,
        align: 'left',
      },
      {
        title: '来源库位编码',
        dataIndex: 'issuedLocatorCode',
        width: 200,
        align: 'left',
      },
      {
        title: '关键物料',
        dataIndex: 'keyMaterialFlag',
        width: 150,
        align: 'center',
        render: (val, record) =>
          record.keyMaterialFlag ? <Checkbox checked={val === 'Y'} disabled /> : '',
      },
      {
        title: '步骤顺序',
        dataIndex: 'sequence',
        width: 120,
        align: 'left',
        sorter: true,
        // sortOrder: sortedInfo.columnKey === 'sequence' && sortedInfo.order,
      },
      {
        title: '步骤识别码',
        dataIndex: 'stepName',
        width: 130,
        align: 'left',
        ...this.getColumnSearchProps('step'),
      },
      {
        title: '步骤描述',
        dataIndex: 'stepDesc',
        width: 130,
        align: 'left',
        ...this.getColumnSearchProps('stepDesc'),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1100}
        title='装配清单'
        visible={visible}
        footer={null}
        onCancel={onClose}
      >
        <div className={styles['head-table']}>
          <Table
            columns={columns}
            expandedRowRender={expandedRowRender}
            dataSource={dataSource}
            pagination={pagination}
            onChange={onSearch}
            loading={loading}
            rowKey="bomComponentId"
            bordered
            rowClassName={this.rowExpand}
            scroll={{ x: tableScrollWidth(columns) }}
          />
        </div>
      </Modal>
    );
  }
}
