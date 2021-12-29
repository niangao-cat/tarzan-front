import React from 'react';
import { Table } from 'hzero-ui';
import { isEmpty, isArray } from 'lodash';

import intl from 'utils/intl';

import { tableScrollWidth } from 'utils/utils';



const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const HeadList = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const { loading, dataSource, pagination } = props;
  const { processList: newProcessList } = isEmpty(dataSource) ? {} : dataSource[0];
  let processColumns = [];
  if (isArray(newProcessList) && !isEmpty(newProcessList)) {
    processColumns = newProcessList.map(e => {
      return {
        title: e.processName,
        children: e.tagList.map(i => {
          return {
            title: i.tagDescription,
            dataIndex: `${e.processCode}${i.tagCode}`,
            render: (val, record) => {
              return record[e.processCode][i.tagCode];
            },
          };
        }),
      };
    });
  }
  const newDataSource = dataSource.map(e => {
    const { processList, ...otherParams } = e;
    const obj = {};
    processList.forEach(i => {
      const { tagList } = i;
      const tagObj = {};
      tagList.forEach(a => {
        tagObj[a.tagCode] = a.result;
      });
      obj[i.processCode] = tagObj;
    });
    return {
      ...otherParams,
      ...obj,
    };
  });
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.materialLotCode`).d('序列号'),
      width: 120,
      dataIndex: 'materialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialCode`).d('序列号物料'),
      width: 120,
      dataIndex: 'materialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialName`).d('序列号物料描述'),
      width: 120,
      dataIndex: 'materialName',
    },
    {
      title: intl.get(`${commonModelPrompt}.componentMaterialLotCode`).d('组件sn'),
      width: 120,
      dataIndex: 'componentMaterialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.componentMaterialCode`).d('组件物料'),
      width: 120,
      dataIndex: 'componentMaterialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.componentMaterialName`).d('组件物料描述'),
      width: 120,
      dataIndex: 'componentMaterialName',
    },
  ].concat(processColumns);

  return (
    <Table
      bordered
      dataSource={newDataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      onChange={handleSearch}
      loading={loading}
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default HeadList;
