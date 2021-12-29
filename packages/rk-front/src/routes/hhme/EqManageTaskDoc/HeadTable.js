import React from 'react';
import { isNull } from 'lodash';
import { Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { getDateFormat, tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
const dateFormat = getDateFormat();
export default class HeadTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRows: [],
    };
  }


  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectRows) {
    const { onFetchLineList } = this.props;
    this.setState({ selectRows });
    const record = selectRows[0];
    if (onFetchLineList) {
      onFetchLineList({}, record);
    }
  }

  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('headList', 'taskDocId', record, flag);
    }
  }

  @Bind()
  handleSave(record, index) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record, index);
    }
  }


  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const { selectRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectRows.map(e => e.taskDocId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
    };
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('序号'),
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.siteName`).d('组织'),
        width: 100,
        dataIndex: 'siteName',
      },
      {
        title: intl.get(`${commonModelPrompt}.docNum`).d('任务单号'),
        width: 120,
        dataIndex: 'docNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.docTypeMeaning`).d('任务类型'),
        width: 100,
        dataIndex: 'docTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.taskCycleMeaning`).d('检验周期'),
        width: 100,
        dataIndex: 'taskCycleMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('任务创建时间'),
        dataIndex: 'creationDate',
        width: 140,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('单据状态'),
        dataIndex: 'docStatusMeaning',
        width: 80,
      },
      {
        title: intl.get(`${commonModelPrompt}.equipmentCode`).d('设备编码'),
        width: 80,
        dataIndex: 'equipmentCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.equipmentName`).d('设备描述'),
        width: 120,
        dataIndex: 'equipmentName',
      },
      {
        title: '型号',
        width: 120,
        dataIndex: 'model',
      },
      {
        title: '序列号',
        width: 120,
        dataIndex: 'equipmentBodyNum',
      },
      {
        title: '保管部门',
        width: 120,
        dataIndex: 'description',
      },
      {
        title: '检验部门',
        width: 120,
        dataIndex: 'areaName',
      },
      {
        title: '车间',
        width: 100,
        dataIndex: 'workshopName',
      },
      {
        title: '产线',
        width: 100,
        dataIndex: 'prodLineName',
      },
      {
        title: '工序',
        width: 100,
        dataIndex: 'processName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('工位'),
        dataIndex: 'wkcName',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('检验人'),
        dataIndex: 'checkByName',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('检验时间'),
        dataIndex: 'checkDate',
        width: 140,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('检验结果'),
        dataIndex: 'checkResultMeaning',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('班次日期'),
        dataIndex: 'shiftDate',
        width: 100,
        render: (val) => isNull(val) ? null : moment(val).format(dateFormat),
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('班次'),
        dataIndex: 'shiftCode',
        width: 80,
      },
      // {
      //   title: '保管人',
      //   width: 120,
      //   dataIndex: 'preserver',
      // },
      // {
      //   title: '车间位置',
      //   width: 120,
      //   dataIndex: 'location',
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('确认人'),
      //   dataIndex: 'confirmByName',
      //   width: 100,
      // },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 140,
        render: (val, record) => record._status === 'update' ? (
          <Form.Item>
            {record.$form.getFieldDecorator('remark', {
              initialValue: val,
            })(<Input />)}
          </Form.Item>
        ) : val,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 100,
        render: (value, record, index) =>
          record._status === 'update' ? (
            <div className="action-link">
              <a onClick={() => this.handleEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
              <a onClick={() => this.handleSave(record, index)}>
                {intl.get('hzero.common.button.save').d('保存')}
              </a>
            </div>
          ) : record.editFlag === 1 ? (
            <a onClick={() => this.handleEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ) : '',
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="taskDocId"
        scroll={{ x: tableScrollWidth(columns) }}
      />
    );
  }
}
