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
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('??????'),
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.tagCode`).d('????????????'),
        width: 100,
        dataIndex: 'tagCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.tagDesc`).d('????????????'),
        width: 100,
        dataIndex: 'tagDesc',
      },
      {
        title: intl.get(`${commonModelPrompt}.valueType`).d('????????????'),
        width: 80,
        dataIndex: 'valueTypeDesc',
      },
      {
        title: intl.get(`${commonModelPrompt}.accuracy`).d('??????'),
        width: 40,
        dataIndex: 'accuracy',
      },
      {
        title: intl.get(`${commonModelPrompt}.minimumValue`).d('?????????'),
        width: 40,
        dataIndex: 'minimumValue',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardValue`).d('?????????'),
        width: 40,
        dataIndex: 'standardValue',
      },
      {
        title: intl.get(`${commonModelPrompt}.maximalValue`).d('?????????'),
        dataIndex: 'maximalValue',
        width: 40,
      },
      {
        title: intl.get(`${commonModelPrompt}.uomName`).d('??????'),
        dataIndex: 'uomName ',
        width: 40,
      },
      {
        title: intl.get(`${commonModelPrompt}.checkValue`).d('?????????'),
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
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('??????'),
        dataIndex: 'result',
        width: 40,
      },
      // {
      //   title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('??????'),
      //   dataIndex: 'tool',
      //   width: 80,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('?????????'),
      //   dataIndex: 'responsibleName',
      //   width: 80,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.checkByName`).d('?????????'),
      //   dataIndex: 'checkByName',
      //   width: 100,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.checkDate`).d('????????????'),
      //   dataIndex: 'checkDate',
      //   width: 140,
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.wkcName`).d('????????????'),
      //   dataIndex: 'wkcName',
      //   width: 100,
      // },
      {
        title: intl.get(`${commonModelPrompt}.wkcName`).d('??????'),
        dataIndex: 'remark',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('??????'),
        dataIndex: 'operator',
        width: 80,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('??????')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.event.objectType.button.save').d('??????')}
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
                {intl.get('hzero.common.button.edit').d('??????')}
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
