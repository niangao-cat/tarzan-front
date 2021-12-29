/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Input, Button, Checkbox, Table, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNull } from 'lodash';
import classNames from 'classnames';

import notification from 'utils/notification';
// import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';

import styles from './index.less';

export default class DataRecordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRecord: {},
    };
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal } = this.props;
    if (onCloseModal) {
      onCloseModal();
    }
  }

  @Bind()
  handleGetData(data) {
    const { onGetData } = this.props;
    if (onGetData) {
      onGetData(data);
    }
  }

  @Bind()
  handleEnterClick(value, record, index) {
    const { onEnterClick, dataSource } = this.props;
    if (onEnterClick) {
      // onEnterClick(value, record, 'addDataRecordList').then(res => {
      onEnterClick(value, record, 'dataRecordList', true).then(res => {
        if (res) {
          const nextInputLine = index + 1 === dataSource.length ? undefined : dataSource.slice(index + 1).find(e => ['VALUE', 'TEXT'].includes(e.resultType));
          if (nextInputLine) {
            const nextInputIndex = dataSource.map(e => e.jobRecordId).indexOf(nextInputLine.jobRecordId);
            const newInputDom = document.getElementsByClassName(`data-collection-modal-result-${nextInputIndex}`);
            if (newInputDom.length > 0) {
              if (newInputDom[0].localName === 'div') {
                newInputDom[0].childNodes[1].childNodes[0].focus();
              } else if (newInputDom[0].localName === 'input') {
                newInputDom[0].focus();
              }
            }
          }
        }
      });
    }
  }


  @Bind()
  handleClickJustice(value) {
    const { selectedRecord } = this.state;
    const { onEnterClick } = this.props;
    if (selectedRecord.resultType !== 'DECISION_VALUE') {
      notification.warning({
        description: '当前数据采集项不是判定型，请重新选择',
      });
    } else if (onEnterClick && value) {
      // onEnterClick(value, selectedRecord, 'addDataRecordList');
      onEnterClick(value, selectedRecord, 'dataRecordList');
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        if (record._status !== 'create') {
          this.setState({ selectedRecord: record });
        }
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRecord } = this.state;
    if (selectedRecord.jobRecordId === record.jobRecordId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleClickInputNumber(e, record, index) {
    if (e.keyCode === 13) {
      const inputNumberDom = document.getElementsByClassName(`data-collection-modal-input-number-${index}`);
      if (inputNumberDom.length > 0) {
        const { value } = inputNumberDom[0].childNodes[1].childNodes[0];
        const newValue = Number(value);
        if (!isNaN(newValue)) {
          this.handleEnterClick(newValue, record, index);
        }
      }
    }
  }

  @Bind()
  renderForm(record, index) {
    const { modelName, baseInfo } = this.props;
    const val = record.result;
    const className =
      record.result ? (!isNull(record.minimumValue) && isNull(record.maximalValue) && record.result >= record.minimumValue)
        || (!isNull(record.maximalValue) && record.result <= record.maximalValue && isNull(record.minimumValue))
        || record.result === 'OK'
        || (isNull(record.maximalValue) && isNull(record.minimumValue) && record.resultType !== 'DECISION_VALUE')
        || (!isNull(record.maximalValue) && !isNull(record.minimumValue) && record.result >= record.minimumValue && record.result <= record.maximalValue)
        ? 'data-between'
        : 'data-out'
        : 'data-null';
    return (['DECISION_VALUE'].includes(record.resultType)) ? (
      <div className={styles[className]}>
        <Input disabled className={`data-collection-modal-result-${index}`} value={val} />
      </div>
    ) : (['TEXT'].includes(record.resultType)) ? (
      <div className={styles[className]}>
        <Input disabled={['singleOperationPlatform', 'firstProcessPlatform'].includes(modelName) && baseInfo.siteOutDate} defaultValue={record.result} className={`data-collection-modal-result-${index}`} onPressEnter={e => this.handleEnterClick(e.target.value, record, index)} />
      </div>
    ) : (['VALUE'].includes(record.resultType)) ? (
      <div className={styles[className]}>
        <InputNumber disabled={['singleOperationPlatform', 'firstProcessPlatform'].includes(modelName) && baseInfo.siteOutDate} defaultValue={record.result} className={classNames(`data-collection-modal-result-${index}`, `data-collection-modal-input-number-${index}`)} onKeyDown={e => this.handleClickInputNumber(e, record, index)} />
      </div>
    ) : val;
  }

  render() {
    const { dataSource = [], visible, loading, updateRemark, modelName, baseInfo } = this.props;
    const columns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      // {
      //   title: '位置',
      //   width: 30,
      //   dataIndex: 'position',
      // },
      {
        title: '数据项',
        width: 80,
        dataIndex: 'tagCode',
        onCell: this.cellRender,
      },
      {
        title: '数据采集项描述',
        dataIndex: 'tagDescription',
        width: 120,
      },
      {
        title: '下限',
        width: 30,
        dataIndex: 'minimumValue',
      },
      {
        title: '标准值',
        width: 40,
        dataIndex: 'standardValue',
      },
      {
        title: '上限',
        width: 30,
        dataIndex: 'maximalValue',
      },
      {
        title: '结果',
        width: 50,
        dataIndex: 'result',
        render: (val, record, index) => {
          return this.renderForm(record, index);
        },
      },
      {
        title: '单位',
        width: 60,
        dataIndex: 'uomCode',
        align: 'center',
      },
      {
        title: '允许缺失值',
        width: 60,
        dataIndex: 'valueAllowMissing',
        align: 'center',
        render: (val) => <Checkbox disabled checked={val === 'Y'} />,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 60,
        render: (value, record) =>
          (<Input defaultValue={value} onPressEnter={e => updateRemark(e.target.value, record, 'dataRecordList')} />),
      },
      {
        title: '获取',
        width: 30,
        dataIndex: 'result',
        align: 'center',
        render: (val, record) => ['EC-0003', 'EC-0027', 'EC-0032'].includes(record.equipmentCategory) ? (
          <a onClick={() => this.handleGetData(record)}>
            获取
          </a>
        ) : (''),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1100}
        title='数据采集详情'
        visible={visible}
        onCancel={this.handleCloseModal}
        footer={(
          <Fragment>
            {!(['firstProcessPlatform', 'singleOperationPlatform'].includes(modelName) && baseInfo.siteOutDate) && (
              <Fragment>
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
              </Fragment>
            )}
          </Fragment>
        )}
      >
        <div className={styles['head-table']}>
          <Table
            scroll={{
              x: tableScrollWidth(columns),
              y: 500,
            }}
            bordered
            loading={loading}
            columns={columns}
            rowKey='jobRecordId'
            dataSource={dataSource}
            pagination={false}
            onRow={this.handleClickSelectedRows}
            rowClassName={this.handleClickRow}
          />
        </div>
      </Modal>
    );
  }
}
