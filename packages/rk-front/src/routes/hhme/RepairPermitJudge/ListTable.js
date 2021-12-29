import React, { Component } from 'react';
import { InputNumber, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import {tableScrollWidth} from 'utils/utils';
import EditTable from 'components/EditTable';

@Form.create({ fieldNameProp: null })
export default class ListTable extends Component {


  // 终止返修
  @Bind
  handleStop(record, index) {
    const { onStop } = this.props;
    if (onStop) {
      onStop(record, index);
    }
  }

  // 继续返修
  @Bind
  handleContinue(record, index) {
    const { onContinue } = this.props;
    if (onContinue) {
      onContinue(record, index);
    }
  }

  // 回车保存
  // @Bind
  // onEnterDown( e, record, index ) {
  //   const {onEnterDown} = this.props;
  //   if(onEnterDown) {
  //     onEnterDown(e, record, index);
  //   }
  // }

  render(){

    const {loading, dataSource, pagination, onSearch, renderPermitCount} = this.props;

    const columns = [
      {
        title: '事业部',
        dataIndex: "departmentCode",
        width: 80,
      },
      {
        title: 'SN',
        dataIndex: 'materialLotCode',
        width: 130,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '工序编码',
        dataIndex: 'workcellCode',
        width: 130,
      },
      {
        title: '工序名称',
        dataIndex: 'workcellName',
        width: 150,
      },
      {
        title: '限制次数',
        dataIndex: 'limitCount',
        width: 90,
      },
      {
        title: '放行次数',
        dataIndex: 'passCount',
        width: 90,
      },
      {
        title: '返修次数',
        dataIndex: 'repairCount',
        width: 90,
      },
      {
        title: '准许次数',
        dataIndex: 'permitCount',
        width: 90,
        render: (val, record, index) => ['update', 'create'].includes(record._status)?(
          <Form.Item>
            {record.$form.getFieldDecorator("permitCount", {
              initialValue: record.permitCount,
            })(
              <InputNumber
                style={{ width: '100%' }}
                id={`${index}`}
                // className="standardPartsInspection-result"
                // onKeyDown={e => this.onEnterDown(e, record, index)}
                min={0}
                precision={0}
                disabled={record.status==='UNDEFINED'}
                onBlur={() => renderPermitCount(record, index)}
                // onBlur={(e) => this.renderPermitCount(record, index)}
              />
            )}
          </Form.Item>
          ) : (val),
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 100,
      },
      {
        title: '操作人',
        dataIndex: 'realName',
        width: 120,
      },
      {
        title: '操作时间',
        dataIndex: 'lastUpdateDate',
        width: 140,
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record, index) => (
          <div>
            <span>
              {/* //handleContinue */}
              <a onClick={() => this.handleContinue(record, index)} disabled={record.status==='UNDEFINED'}>放行</a>&nbsp;&nbsp;
            </span>
            <span>
              <a onClick={() => this.handleStop(record, index)} disabled={record.status==='STOP' || record.status==='UNDEFINED'}>停止</a>&nbsp;&nbsp;
            </span>
          </div>
)},


    ];

    return(
      <EditTable
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey="repairRecordId"
        bordered
        pagination={pagination}
        onChange={page => onSearch(page)}
        scroll={{
            x: tableScrollWidth(columns),
        }}
      />
    );
  }
}
