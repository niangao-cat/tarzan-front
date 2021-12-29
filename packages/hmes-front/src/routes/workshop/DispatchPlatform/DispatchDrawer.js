/**
 * DispatchDrawer 调度抽屉
 * @date: 2019-12-19
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select, InputNumber, DatePicker } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';
const FormItem = Form.Item;
const tenantId = getCurrentOrganizationId();

/**
 * 调度抽屉
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@connect(({ dispatchPlatform }) => ({
  dispatchPlatform,
}))
export default class DispatchDrawer extends React.PureComponent {
  state = {
    selectedWorkcellId: '',
    selectedShiftDate: '',
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        shiftCodeList: [],
      },
    });
  }

  //  选择WKC
  changeWKC = key => {
    const { selectedShiftDate } = this.state;
    const { dispatch, form } = this.props;
    this.setState({
      selectedWorkcellId: key,
    });
    if (selectedShiftDate) {
      dispatch({
        type: 'dispatchPlatform/fetchShiftCodeList',
        payload: {
          shiftDate: selectedShiftDate,
          workcellId: key,
        },
      });
    }
    form.registerField('shiftCode');
  };

  //  选择日期
  changeDate = (date, dateString) => {
    const { selectedWorkcellId } = this.state;
    const { dispatch, form } = this.props;
    this.setState({
      selectedShiftDate: dateString,
    });
    if (selectedWorkcellId) {
      dispatch({
        type: 'dispatchPlatform/fetchShiftCodeList',
        payload: {
          shiftDate: dateString,
          workcellId: selectedWorkcellId,
        },
      });
    }
    form.registerField('shiftCode');
  };

  //  确定发起调度
  onOk = () => {
    const { dispatch, form, onCancel } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'dispatchPlatform/dispatchConfirm',
          payload: {
            ...fieldsValue,
            shiftDate: moment(fieldsValue.shiftDate).format('YYYY-MM-DD'),
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            this.renderListTable(fieldsValue);
            this.renderChartTable(fieldsValue);
            this.renderScheduledSubTable(fieldsValue);
            onCancel();
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  };

  //  调度完成后，渲染可调度表格
  renderListTable = formValue => {
    const {
      dispatch,
      dispatchPlatform: { tableList, WKCRangeList, expandedRowKeysArray, selectedRowRecord },
    } = this.props;
    //  先将表格头行数据修改
    const newTableList = tableList.map(item => {
      if (item.routerOperationId === selectedRowRecord.routerOperationId) {
        return {
          ...selectedRowRecord,
          dispatchableQty: selectedRowRecord.dispatchableQty - formValue.assignQty,
          assignQty: selectedRowRecord.assignQty + formValue.assignQty,
        };
      }
      return item;
    });
    dispatch({
      type: 'dispatchPlatform/fetchSubTableInfo',
      payload: {
        routerStepId: selectedRowRecord.routerStepId,
        eoId: selectedRowRecord.eoId,
        operationId: selectedRowRecord.operationId,
        materialId: selectedRowRecord.materialId,
        materialCode: selectedRowRecord.materialCode,
        materialName: selectedRowRecord.materialName,
        workcellIdList: WKCRangeList.map(item => item.workcellId),
      },
    }).then(res => {
      //  如果查询子表格数据成功，则重新渲染子表格，如果失败，则将改头行收起
      if (res && res.success) {
        const newChangeTableList = newTableList.map(item => {
          if (item.routerOperationId === selectedRowRecord.routerOperationId) {
            return { ...item, subTableList: res.rows };
          } else {
            return item;
          }
        });
        dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            tableList: newChangeTableList,
          },
        });
      } else {
        dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            expandedRowKeysArray: expandedRowKeysArray.filter(
              item => item !== selectedRowRecord.routerOperationId
            ),
          },
        });
      }
    });
  };

  //  调度完成后，渲染图表表格
  renderChartTable = formValue => {
    const {
      dispatch,
      dispatchPlatform: { defaultSiteId, selectedProLineId, selectedOperationId, chartTableList },
    } = this.props;
    let capacityQty = 0;
    //  判断调度的数据是否在图表表格显示的flag
    let existenceFlag = false;
    const shiftDate = moment(formValue.shiftDate).format('YYYY-MM-DD');
    chartTableList.forEach(item => {
      if (item.workcellId === formValue.workcellId) {
        existenceFlag = true;
        if (existenceFlag) {
          // 存在则取WKC产能
          item.todayChartsArray.forEach(ele => {
            if (ele.shiftDate === shiftDate && ele.shiftCode === formValue.shiftCode) {
              capacityQty = Number(ele.capacityQty);
            }
          });
          item.tomorrowChartsArray.forEach(ele => {
            if (ele.shiftDate === shiftDate && ele.shiftCode === formValue.shiftCode) {
              capacityQty = Number(ele.capacityQty);
            }
          });
        }
      }
    });
    if (existenceFlag) {
      //  存在则重新刷新该图表
      dispatch({
        type: 'dispatchPlatform/fetchOneChartInfo',
        payload: {
          defaultSiteId,
          operationId: selectedOperationId,
          prodLineId: selectedProLineId,
          shiftCode: formValue.shiftCode,
          shiftDate,
          workcellId: formValue.workcellId,
          capacityQty,
        },
      });
    }
  };

  //  如果调度到选中的图表上，重查已调度执行作业
  renderScheduledSubTable = formValue => {
    const {
      dispatch,
      dispatchPlatform: { selectedChartId },
    } = this.props;
    const shiftDate = moment(formValue.shiftDate).format('YYYY-MM-DD');
    if (selectedChartId === `${formValue.workcellId}_${shiftDate}_${formValue.shiftCode}`) {
      //  如果拖拽到选中的图表上，重查已调度执行作业
      dispatch({
        type: 'dispatchPlatform/fetchScheduledSubTableList',
        payload: {
          shiftCode: formValue.shiftCode,
          shiftDate,
          workcellId: formValue.workcellId,
        },
      });
      dispatch({
        type: 'dispatchPlatform/updateState',
        payload: {
          revokeRow: {},
          selectedRowKeys: [],
        },
      });
    }
  };

  render() {
    const {
      visible,
      onCancel,
      form,
      dispatchPlatform: {
        selectedRowRecord = {},
        shiftCodeList,
        defaultSiteId,
        selectedProLineId,
        selectedOperationId,
      },
    } = this.props;
    const { eoNum, eoId, stepName, routerStepId } = selectedRowRecord;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.workshop.dispatchPlatform.title.dispatch').d('调度')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.onOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.eoNum`).d('执行作业')}
          >
            {getFieldDecorator('eoNum', {
              initialValue: eoNum,
            })(<Input disabled />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('eoId', {
              initialValue: eoId,
            })(<Input />)}
          </FormItem>
          <FormItem {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.step`).d('步骤')}>
            {getFieldDecorator('stepName', {
              initialValue: stepName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('routerStepId', {
              initialValue: routerStepId,
            })(<Input />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.assignQty`).d('调度数量')}
          >
            {getFieldDecorator('assignQty', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.assignQty`).d('调度数量'),
                  }),
                },
              ],
            })(<InputNumber style={{ width: '100%' }} precision={0} min={0} />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.workcell`).d('工作单元')}
          >
            {getFieldDecorator('workcellId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.workcell`).d('工作单元'),
                  }),
                },
              ],
            })(
              <Lov
                code="MT.DISPATCH_WKC"
                queryParams={{
                  tenantId,
                  defaultSiteId,
                  prodLineId: selectedProLineId,
                  operationId: selectedOperationId,
                }}
                onChange={this.changeWKC}
              />
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.shiftDate`).d('日期')}
          >
            {getFieldDecorator('shiftDate', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.shiftDate`).d('日期'),
                  }),
                },
              ],
            })(
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={current => current && current < moment().add('day', -1)}
                style={{ width: '100%' }}
                onChange={this.changeDate}
              />
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.shiftCode`).d('班次')}
          >
            {getFieldDecorator('shiftCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.shiftCode`).d('班次'),
                  }),
                },
              ],
            })(
              <Select style={{ width: '100%' }} disabled={!(shiftCodeList.length > 0)} allowClear>
                {shiftCodeList instanceof Array &&
                  shiftCodeList.length !== 0 &&
                  shiftCodeList.map(item => {
                    return (
                      <Select.Option value={item} key={item}>
                        {item}
                      </Select.Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
