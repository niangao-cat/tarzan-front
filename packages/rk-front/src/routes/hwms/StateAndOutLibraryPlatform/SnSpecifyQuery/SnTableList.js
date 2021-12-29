/**
 * @Description: 立库出库平台
 * @author: lly
 * @date 2021/07/06 11:11
 * @version 1.0
 */

import React from 'react';
import EditTable from 'components/EditTable';
import { Form, Input, Button, Popconfirm } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';


const commonModelPrompt = 'hwms.tarzan.state-and-out-library-platform';
@connect(({ stateAndOutLibraryPlatform, loading }) => ({
  stateAndOutLibraryPlatform,
  saveSnSpecifyLoading: loading.effects['stateAndOutLibraryPlatform/saveSnSpecifyQueryList'],
}))
export default class SnTableList extends React.Component {
  // 直接渲染
  render() {
    const {
      inputEdit,
      deleteFlag,
      dataSource,
      loading,
      snSingleEntry,
      onCreate,
      deleteLine,
    } = this.props;

    // 列展示
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => onCreate()}
            disabled={inputEdit || deleteFlag}
          />
        ),
        align: 'center',
        fixed: 'left',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => deleteLine(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" disabled={inputEdit || deleteFlag} />
          </Popconfirm>
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('序号'),
        width: 80,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          return index + 1;
        },
      },
      {
        title: 'SN',
        dataIndex: 'materialLotCode',
        align: 'center',
        width: 150,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialLotCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'SN',
                    }),
                  },
                ],
              })(<Input onPressEnter={() => snSingleEntry(record)} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.statusMeaning`).d('状态'),
        width: 80,
        dataIndex: 'statusMeaing',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('版本'),
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotSoNumSoLineNum`).d('销售订单'),
        width: 100,
        dataIndex: 'materialLotSoNumSoLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('仓库'),
        width: 120,
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.topLlocatorCode`).d('货位'),
        width: 100,
        dataIndex: 'topLlocatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('数量'),
        width: 70,
        dataIndex: 'primaryUomQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.containerCode`).d('当前容器'),
        width: 100,
        dataIndex: 'containerCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlagMeaning`).d('有效性'),
        dataIndex: 'enableFlagMeaing',
      },
    ];

    return (
      <div>
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          loading={loading}
          rowClassName={record => {
            if (record._status === 'create') return 'create-row-data';
          }}
        />
      </div>
    );
  }
}
