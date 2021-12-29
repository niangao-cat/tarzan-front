import React, { Fragment } from 'react';
import EditTable from 'components/EditTable';
import { Form, InputNumber, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { Button } from 'components/Permission';
// import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class AbnormalResponse extends React.Component {

  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  }

  @Bind()
  renderCkValue(record) {
    if (record.valueType === 'DECISION_VALUE') {
      return (
        <Select allowClear style={{ width: '100%' }}>
          <Select.Option key='OK' value='OK'>
            OK
          </Select.Option>
          <Select.Option key='NG' value='NG'>
            NG
          </Select.Option>
        </Select>
      );
    }
    if (record.valueType === 'VALUE') {
      return (
        <InputNumber
          formatter={value => `${value}`}
          style={{ width: '100%' }}
          parser={value => this.limitDecimals(value, record.accuracy)}
        />
      );
    }
    if (record.valueType === 'TEXT') {
      return (
        <Input />
      );
    }
  }

  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('lineList', 'taskDocLineId', record, flag);
    }
  }

  @Bind()
  handleSave(record, index) {
    const { onSaveLine } = this.props;
    if (onSaveLine) {
      onSaveLine(record, index);
    }
  }


  render() {
    const { loading, dataSource, pagination, onSearch, rowSelection, recordData } = this.props;
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
        title: intl.get(`${commonModelPrompt}.tagCode`).d('项目编号'),
        width: 100,
        dataIndex: 'tagCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.tagDesc`).d('项目描述'),
        width: 100,
        dataIndex: 'tagDesc',
      },
      {
        title: intl.get(`${commonModelPrompt}.valueType`).d('数据类型'),
        width: 80,
        dataIndex: 'valueTypeDesc',
      },
      {
        title: intl.get(`${commonModelPrompt}.accuracy`).d('精度'),
        width: 40,
        dataIndex: 'accuracy',
      },
      {
        title: intl.get(`${commonModelPrompt}.minimumValue`).d('最小值'),
        width: 40,
        dataIndex: 'minimumValue',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardValue`).d('标准值'),
        width: 40,
        dataIndex: 'standardValue',
      },
      {
        title: intl.get(`${commonModelPrompt}.maximalValue`).d('最大值'),
        dataIndex: 'maximalValue',
        width: 40,
      },
      {
        title: intl.get(`${commonModelPrompt}.uomName`).d('单位'),
        dataIndex: 'uomName ',
        width: 40,
      },
      {
        title: intl.get(`${commonModelPrompt}.checkValue`).d('检验值'),
        dataIndex: 'checkValue',
        width: 120,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`checkValue`, {
                initialValue: record.checkValue,
              })(
                this.renderCkValue(record)
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('结果'),
        dataIndex: 'result',
        width: 40,
      },
      // {
      //   title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('工具'),
      //   dataIndex: 'tool',
      //   width: 80,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('责任人'),
      //   dataIndex: 'responsibleName',
      //   width: 80,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.checkByName`).d('检验人'),
      //   dataIndex: 'checkByName',
      //   width: 100,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.checkDate`).d('检验时间'),
      //   dataIndex: 'checkDate',
      //   width: 140,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.wkcName`).d('检验工位'),
      //   dataIndex: 'wkcName',
      //   width: 100,
      // },
      {
        title: intl.get(`${commonModelPrompt}.wkcName`).d('备注'),
        dataIndex: 'remark',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 80,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.event.objectType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!['create', 'update'].includes(record._status) && (
              <Button
                type="text"
                permissionList={[
                  {
                    code: 'hzero.hzero.hme.tarzan.equipment.manage.task.document.ps.button.line.edit',
                    type: 'button',
                  },
                ]}
                onClick={() => this.handleEditLine(record, true)}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </Button>
            )}
          </span>
        ),
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ y: 180 }}
        onChange={page => onSearch(page, recordData)}
        loading={loading}
        rowKey="taskDocLineId"
        rowSelection={rowSelection}
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
