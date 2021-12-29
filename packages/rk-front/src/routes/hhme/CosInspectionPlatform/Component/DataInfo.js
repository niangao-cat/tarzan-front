/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Button, Input, Form, Checkbox } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNull } from 'lodash';

import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class DataInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {},
    };
  }

  @Bind()
  handleEnterClick(value, record, index) {
    const { onEnterClick } = this.props;
    if (onEnterClick && value) {
      const { _status, ...info } = record;
      // 如果是数值型走此处逻辑
      if (record.$form && record.resultType === 'VALUE') {
        record.$form.validateFields((err, val) => {
          if(!err) {
            onEnterClick(val.result, info, 'dataRecordList').then(res => {
              if(res) {
                const dom = document.getElementsByClassName('data-collection-result');
                if (index + 1 < dom.length) {
                  dom[index + 1].focus();
                }
              }
            });
          }
        });
      } else {
        onEnterClick(value, info, 'dataRecordList').then(res => {
          if(res) {
            const dom = document.getElementsByClassName('data-collection-result');
            if (index + 1 < dom.length) {
              dom[index + 1].focus();
            }
          }
        });
      }
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        this.setState({ selectedRows: record });
      },
    };
  }

  @Bind()
  handleClickJustice(value) {
    const { selectedRows } = this.state;
    const { onEnterClick } = this.props;
    if (selectedRows.resultType !== 'DECISION_VALUE') {
      notification.warning({
        description: '当前数据采集项不是判定型，请重新选择',
      });
    } else if (onEnterClick && value) {
      const { _status, ...info } = selectedRows;
      onEnterClick(value, info, 'dataRecordList');
    }
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (selectedRows.jobRecordId === record.jobRecordId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  // @Bind()
  // handleChangeResult(value, record) {
  //   const { onChangeResult } = this.props;
  //   if(onChangeResult) {
  //     onChangeResult(value, record);
  //   }
  // }

  @Bind()
  cellRender() {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: 60,
        minWidth: 50,
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
      },
    };
  }

  @Bind()
  handleOpenAddDataRecordModal() {
    const { onOpenAddDataRecordModal } = this.props;
    if (onOpenAddDataRecordModal) {
      onOpenAddDataRecordModal();
    }
  }

  @Bind()
  handleOpenDataRecordModal() {
    const { onOpenDataRecordModal } = this.props;
    if (onOpenDataRecordModal) {
      onOpenDataRecordModal();
    }
  }

  render() {
    const { dataSource = [], inspectionCompleted, loading } = this.props;
    const newDataSource = dataSource.map(e => ({
      ...e,
      _status: 'update',
    }));
    const columns = [
      {
        title: '序号',
        width: 20,
        dataIndex: 'orderSeq',
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      // {
      //   title: '位置',
      //   width: 30,
      //   dataIndex: 'position',
      //   align: 'center',
      // },
      {
        title: '数据项',
        width: 50,
        dataIndex: 'tagDescription',
        align: 'center',
        onCell: this.cellRender,
      },
      {
        title: '下限',
        width: 30,
        dataIndex: 'minimumValue',
        align: 'center',
      },
      {
        title: '标准值',
        width: 30,
        dataIndex: 'standardValue',
        align: 'center',
      },
      {
        title: '上限',
        width: 30,
        dataIndex: 'maximalValue',
        align: 'center',
      },
      {
        title: '结果',
        width: 50,
        dataIndex: 'result',
        align: 'center',
        render: (val, record, index) => {
          const className =
            val ? (!isNull(record.minimumValue) && isNull(record.maximalValue) && val >= record.minimumValue)
              || (!isNull(record.maximalValue) && val <= record.maximalValue && isNull(record.minimumValue))
              || val === 'OK'
              || (isNull(record.maximalValue) && isNull(record.minimumValue) && record.resultType !== 'DECISION_VALUE')
              || (!isNull(record.maximalValue) && !isNull(record.minimumValue) && val >= record.minimumValue && val <= record.maximalValue)
              ? 'data-between'
              : 'data-out'
              : 'data-null';
          return (['DECISION_VALUE'].includes(record.resultType)) ? (
            <div className={styles[className]}>
              <Input disabled className="data-collection-result" value={val} />
            </div>
          ) : (['TEXT'].includes(record.resultType)) ? (
            <Form.Item className={styles[className]}>
              {record.$form.getFieldDecorator('result', {
                initialValue: val,
              })(
                <Input className="data-collection-result" onPressEnter={e => this.handleEnterClick(e.target.value, record, index)} />
              )}
            </Form.Item>
          ) : (['VALUE'].includes(record.resultType)) ? (
            <Form.Item className={styles[className]}>
              {record.$form.getFieldDecorator('result', {
                initialValue: record.result,
                rules: [
                  {
                    // eslint-disable-next-line no-useless-escape
                    pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
                    message: '请输入数字',
                  },
                ],
              })(
                <Input className="data-collection-result" onPressEnter={e => this.handleEnterClick(e.target.value, record, index)} />
              )}
            </Form.Item>
          ) : val;
        },
      },
      {
        title: '单位',
        width: 30,
        dataIndex: 'uomName',
        align: 'center',
      },
      {
        title: '允许缺失值',
        width: 30,
        dataIndex: 'valueAllowMissing',
        align: 'center',
        render: (val) => <Checkbox checked={val === 'Y'} />,
      },
    ];
    return (
      <div className={styles['data-content']}>
        <div className={styles['data-table']}>
          <EditTable
            bordered
            loading={loading}
            rowKey="jobRecordId"
            dataSource={newDataSource}
            columns={columns}
            pagination={false}
            onRow={this.handleClickSelectedRows}
            rowClassName={this.handleClickRow}
            scroll={{ y: 180 }}
          />
        </div>
        <div className={styles['data-button']}>
          <Button
            type="primary"
            onClick={() => inspectionCompleted()}
            style={{width: '75px', marginRight: '8px'}}
          >
            检验完成
          </Button>
          <Button className={styles['data-button-detail']} onClick={this.handleOpenDataRecordModal}>详情</Button>
          <Button
            className={styles['operationPlatform_data-button-ok']}
            onClick={() => this.handleClickJustice('OK')}
          >
            OK
          </Button>
          <Button
            style={{ marginRight: '12px' }}
            className={styles['operationPlatform_data-button-ng']}
            onClick={() => this.handleClickJustice('NG')}
          >
            NG
          </Button>
        </div>
      </div>
    );
  }
}
