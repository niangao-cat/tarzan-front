/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button, Input, Form, Checkbox, InputNumber, Popconfirm, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNull, isNaN } from 'lodash';
import classNames from 'classnames';

import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import Title from './Title';
import styles from './index.less';

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
    const { onEnterClick, dataSource } = this.props;
    if (onEnterClick) {
      onEnterClick(value, record, 'dataRecordList').then(res => {
        if (res) {
          const nextInputLine = index + 1 === dataSource.length ? undefined : dataSource.slice(index + 1).find(e => ['VALUE', 'TEXT'].includes(e.resultType));
          if (nextInputLine) {
            const nextInputIndex = dataSource.map(e => e.jobRecordId).indexOf(nextInputLine.jobRecordId);
            const newInputDom = document.getElementsByClassName(`data-collection-result-${nextInputIndex}`);
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
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        this.setState({ selectedRows: record });
      },
    };
  }

  /**
   * 编辑列表选中框
   * @param {*} flag
   */
  @Bind
  handleChecked(flag) {
    const { onHandleChecked } = this.props;
    onHandleChecked(flag);
  }

  /**
   * 删除对应的数据
   */
  @Bind
  handleDeleteData() {
    const { onHandleDeleteData } = this.props;
    onHandleDeleteData();
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
      onEnterClick(value, selectedRows, 'dataRecordList');
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
  handleOpenDataRecordModal() {
    const { onOpenDataRecordModal } = this.props;
    if (onOpenDataRecordModal) {
      onOpenDataRecordModal();
    }
  }

  @Bind()
  handleCalculate() {
    const { onCalculate, modelName, dataSource = [] } = this.props;
    const { selectedRows } = this.state;
    if (onCalculate) {
      // 单件工序作业 改成 批量全找
      if (['singleOperationPlatform', 'firstProcessPlatform', 'lotOperationPlatform'].includes(modelName)) {
        onCalculate(dataSource.filter(item => item.resultType === 'FORMULA'));
      } else {
        onCalculate(selectedRows);
      }
    }
  }

  @Bind()
  handleClickInputNumber(e, record, index) {
    if (e.keyCode === 13) {
      const inputNumberDom = document.getElementsByClassName(`data-collection-input-number-${index}`);
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
  handleChangeSwitch(checked) {
    const { onChangeSwitch } = this.props;
    if (onChangeSwitch) {
      onChangeSwitch(checked);
    }
  }

  @Bind()
  renderResultInput(val, record, index) {
    const { modelName, baseInfo } = this.props;
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
        {record._status === 'update' && record.$form.getFieldDecorator('value', {
          initialValue: val,
        })(
          <Input style={{ textAlign: 'center' }} disabled className={`data-collection-result-${index}`} />
        )}
      </div>
    ) : (['TEXT'].includes(record.resultType)) ? (
      <div className={styles[className]}>
        {record._status === 'update' && record.$form.getFieldDecorator('value', {
          initialValue: record.result,
        })(
          <Input
            disabled={['singleOperationPlatform', 'firstProcessPlatform'].includes(modelName) && baseInfo.siteOutDate}
            className={`data-collection-result-${index}`}
            onPressEnter={e => this.handleEnterClick(e.target.value, record, index)}
          />
        )}
      </div>
    ) : (['VALUE'].includes(record.resultType)) ? (
      <div className={styles[className]}>
        {record._status === 'update' && record.$form.getFieldDecorator('value', {
          initialValue: record.result,
        })(
          <InputNumber
            disabled={['singleOperationPlatform', 'firstProcessPlatform'].includes(modelName) && baseInfo.siteOutDate}
            className={classNames(`data-collection-result-${index}`, `data-collection-input-number-${index}`)}
            onKeyDown={e => this.handleClickInputNumber(e, record, index)}
          />
        )}
      </div>
    ) : (
      <div className={styles[className]}>
        {record._status === 'update' && record.$form.getFieldDecorator('value', {
          initialValue: val,
        })(
          <Input style={{ textAlign: 'center' }} disabled className="data-collection-result" />
        )}
      </div>
    );
  }

  render() {
    const { dataSource = [], onSetChecked, deleteDataLoading, modelName, baseInfo } = this.props;
    const { selectedRows } = this.state;
    // const newDataSource = dataSource.map(e => ({
    //   ...e,
    //   _status: 'update',
    // }));
    const calculateDisabled = ['singleOperationPlatform', 'firstProcessPlatform', 'lotOperationPlatform'].includes(modelName)
      ? dataSource.filter(item => item.resultType === 'FORMULA').length === 0
      : selectedRows.resultType !== 'FORMULA';
    const titleProps = {
      titleValue: '数据采集',
    };
    const columns = [
      {
        title: '序号',
        width: 20,
        dataIndex: 'orderSeq',
        align: 'center',
        render: (val, record, index) => {
          if (record.isEdit) {
            return (
              <Checkbox
                disabled={!record.isEdit}
                value={record.selected}
                onChange={(e) => onSetChecked(e, index)}
              />
            );
          } else {
            return index + 1;
          }
        },
      },
      // {
      //   title: '位置',
      //   width: 30,
      //   dataIndex: 'position',
      //   align: 'center',
      // },
      {
        title: '数据项',
        width: 60,
        dataIndex: 'tagDescription',
        align: 'center',
        onCell: this.cellRender,
        render: (val, record) => {
          if (baseInfo.reworkFlag === "N" && record.valueAllowMissing === "N" && (record.result === "" || record.result === null || record.result === undefined) && modelName === "singleOperationPlatform") {
            return (<span style={{ color: 'red' }}>{val}</span>);
          } else {
            return val;
          }
        },
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
        render: this.renderResultInput,
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
        <Title {...titleProps} />
        <div className={styles['data-table']}>
          <EditTable
            bordered
            loading={false}
            rowKey="jobRecordId"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            onRow={this.handleClickSelectedRows}
            rowClassName={this.handleClickRow}
            scroll={{ y: 180 }}
          />
        </div>
        <div className={styles['data-button']}>
          {!(['firstProcessPlatform', 'singleOperationPlatform'].includes(modelName) && baseInfo.siteOutDate) && (
            <Fragment>
              {['singleOperationPlatform'].includes(modelName) && (
                <span className={styles['operationPlatform_data-info-switch']}>
                  <Switch checkedChildren="抽检" unCheckedChildren="全检" disabled={baseInfo.isClickInspectionBtn === 'N'} defaultChecked={false} onChange={this.handleChangeSwitch} />
                </span>
              )}
              <Button
                style={{ marginLeft: '3px', marginRight: '3px' }}
                disabled={calculateDisabled}
                className={styles['data-button-detail']}
                onClick={() => this.handleCalculate()}
                size="small"
              >
                计算
              </Button>
              <Button
                style={{ marginLeft: '3px', marginRight: '3px' }}
                className={styles['operationPlatform_data-button-ok']}
                onClick={() => this.handleClickJustice('OK')}
                size="small"
              >
                OK
              </Button>
              <Button
                style={{ marginLeft: '3px', marginRight: '3px' }}
                className={styles['operationPlatform_data-button-ng']}
                onClick={() => this.handleClickJustice('NG')}
                size="small"
              >
                NG
              </Button>
              {['operationPlatform', 'singleOperationPlatform'].includes(modelName) && (
                <Popconfirm
                  title={`总计${dataSource.filter(item => item.selected).length}条数据，是否确认删除?`}
                  onConfirm={this.handleDeleteData}
                >
                  <Button
                    style={{ marginLeft: '3px', marginRight: '3px' }}
                    icon="delete"
                    loading={deleteDataLoading}
                    className={styles['operationPlatform_data-button-ng']}
                    disabled={!(dataSource.length > 0 && dataSource[0].isEdit && dataSource.filter(item => item.selected).length > 0)}
                    size="small"
                  >
                    删除
                  </Button>
                </Popconfirm>
              )}
              {['operationPlatform', 'singleOperationPlatform'].includes(modelName) && (
                (dataSource.length === 0 || !dataSource[0].isEdit)
                  ? (<Button style={{ marginLeft: '3px', marginRight: '3px' }} disabled={dataSource.length === 0} className={styles['data-button-detail']} onClick={() => this.handleChecked(true)} size="small">编辑</Button>)
                  : (<Button style={{ marginLeft: '3px', marginRight: '3px' }} className={styles['operationPlatform_data-button-ng']} onClick={() => this.handleChecked(false)} size="small">取消</Button>)
              )}
            </Fragment>
          )}
          <Button style={{ marginLeft: '3px', marginRight: '3px' }} className={styles['data-button-detail']} onClick={this.handleOpenDataRecordModal} size="small">详情</Button>
        </div>
      </div>
    );
  }
}
