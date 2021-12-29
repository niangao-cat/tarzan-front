/* eslint-disable no-unused-vars */
/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Row, Form, Col } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import notification from 'utils/notification';
// import { Fields } from 'components/Permission';
import { Host } from '@/utils/config';
import ExcelExport from 'components/ExcelExport';

import FilterForm from './FilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';
import HistoryModal from './HistoryModal';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.eqManageTaskDoc';
const dateTimeFormat = getDateTimeFormat();

@connect(({ eqManageTaskDoc, loading }) => ({
  eqManageTaskDoc,
  fetchHeadListLoading: loading.effects['eqManageTaskDoc/fetchHeadList'],
  fetchLineListLoading: loading.effects['eqManageTaskDoc/fetchLineList'],
  updateLineLoading: loading.effects['eqManageTaskDoc/updateLine'],
  fetchHistoryListLoading: loading.effects['eqManageTaskDoc/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class EqManageTaskDoc extends Component {
  constructor(props) {
    super(props);
    this.initData();
    this.state = {
      selectedLineRows: [],
      record: {},
    };
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eqManageTaskDoc/updateState',
      payload: {
        selectedRecord: {},
        lineList: [],
        linePagination: {},
        headList: [],
        pagination: {},
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eqManageTaskDoc/init',
    });
    // this.handleFetchHeadList();
  }

  // 查询
  @Bind()
  handleFetchHeadList(page = {}) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { creationDateFrom, creationDateTo, checkDateFrom, checkDateTo } = value;
    value = {
      ...value,
      creationDateFrom: isEmpty(creationDateFrom)
        ? null
        : creationDateFrom.startOf('day').format(dateTimeFormat),
      creationDateTo: isEmpty(creationDateTo) ? null : creationDateTo.endOf('day').format(dateTimeFormat),
      checkDateFrom: isEmpty(checkDateFrom)
        ? null
        : checkDateFrom.startOf('day').format(dateTimeFormat),
      checkDateTo: isEmpty(checkDateTo) ? null : checkDateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    if(JSON.stringify(filterNullValueObject(value))==="{}"){
      return notification.error({message: '查询条件至少输入1个'});
    }
    dispatch({
      type: 'eqManageTaskDoc/fetchHeadList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleFetchLineList(page = {}, record = {}) {
    this.setState({record });
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'eqManageTaskDoc/fetchLineList',
      payload: {
        taskDocId: record.taskDocId,
        page,
      },
    });
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSource 数据源在model里的名称
   * @param {string} id 数据源的id名称
   * @param {object} current 当前行
   * @param {boolean} flag
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleEditLine(dataSource, id, current, flag) {
    const { dispatch, eqManageTaskDoc } = this.props;
    const list = eqManageTaskDoc[dataSource];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'eqManageTaskDoc/updateState',
      payload: {
        [dataSource]: newList,
      },
    });
  }

  // 保存行
  @Bind
  handleSaveLine(record, index) {
    const { dispatch, eqManageTaskDoc: { lineList = [] } } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'eqManageTaskDoc/updateLine',
          payload: {
            ...record,
            ...fieldsValue,
            index,
            lineList,
          },
        }).then(res => {
          if (res) {
            notification.success();
          }
        });
      }
    });
  }

  // 保存头
  @Bind
  handleSaveHeadLine(record, index) {
    const { dispatch, eqManageTaskDoc: { headList = [] } } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'eqManageTaskDoc/updateHeadLine',
          payload: {
            ...record,
            ...fieldsValue,
            index,
            headList,
          },
        }).then(res => {
          if (res) {
            notification.success();
          }
        });
      }
    });
  }


  @Bind()
  handleFetchHistoryList(page) {
    const { dispatch } = this.props;
    const { selectedLineRows } = this.state;
    if(selectedLineRows.length > 0) {
      dispatch({
        type: 'eqManageTaskDoc/fetchHistoryList',
        payload: {
          taskDocLineId: selectedLineRows[0].taskDocLineId,
          page,
        },
      });
    } else {
      notification.warning({ description: '请勾选单据行进行历史查询'});
    }
  }

  @Bind()
  handleChangeLineSelectRows(selectedRowKeys, selectedLineRows) {
    this.setState({ selectedLineRows });
  }

  // 导出单据
  @Bind()
  handleGetFormFields() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { creationDateFrom, creationDateTo, checkDateFrom, checkDateTo } = value;
    value = {
      ...value,
      creationDateFrom: isEmpty(creationDateFrom)
        ? null
        : creationDateFrom.startOf('day').format(dateTimeFormat),
      creationDateTo: isEmpty(creationDateTo) ? null : creationDateTo.endOf('day').format(dateTimeFormat),
      checkDateFrom: isEmpty(checkDateFrom)
        ? null
        : checkDateFrom.startOf('day').format(dateTimeFormat),
      checkDateTo: isEmpty(checkDateTo) ? null : checkDateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return filterValue;
  }

  // 导出单据和明细
  @Bind()
  handleGetFormFieldsAndValues() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { creationDateFrom, creationDateTo, checkDateFrom, checkDateTo } = value;
    value = {
      ...value,
      creationDateFrom: isEmpty(creationDateFrom)
        ? null
        : creationDateFrom.startOf('day').format(dateTimeFormat),
      creationDateTo: isEmpty(creationDateTo) ? null : creationDateTo.endOf('day').format(dateTimeFormat),
      checkDateFrom: isEmpty(checkDateFrom)
        ? null
        : checkDateFrom.startOf('day').format(dateTimeFormat),
      checkDateTo: isEmpty(checkDateTo) ? null : checkDateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return filterValue;
  }

  // 导出明细
  @Bind()
  handleGetFormValue() {
    const { record } = this.state;
    // console.log('record', record);
    return filterNullValueObject({ taskDocId: record.taskDocId });
  }

  // 校验是否选中行
  @Bind()
  checkSelectRows() {
    const { record } = this.state;
    return !isEmpty(record);
  }


  // 渲染 界面布局
  render() {
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      updateLineLoading,
      tenantId,
      fetchHistoryListLoading,
      eqManageTaskDoc: {
        headList = [],
        pagination = {},
        lineList = [],
        linePagination = {},
        taskTypeList = [],
        docStatusList = [],
        resultList = [],
        historyList = [],
        historyPagination = {},
      },
    } = this.props;
    const { selectedLineRows } = this.state;
    const lineRowSelection = {
      selectedRowKeys: selectedLineRows.map(e => e.taskDocLineId),
      type: 'radio', // 单选
      onChange: this.handleChangeLineSelectRows,
    };
    const filterProps = {
      tenantId,
      taskTypeList,
      docStatusList,
      resultList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchHeadList,
    };
    const headListProps = {
      loading: fetchHeadListLoading,
      pagination,
      dataSource: headList,
      onSearch: this.handleFetchHeadList,
      onFetchLineList: this.handleFetchLineList,
      onEditLine: this.handleEditLine,
      onSave: this.handleSaveHeadLine,
    };
    const lineTableProps = {
      lineRowSelection,
      dataSource: lineList,
      pagination: linePagination,
      recordData: this.state.record,
      loading: fetchLineListLoading||updateLineLoading,
      onSearch: this.handleFetchLineList,
      onEditLine: this.handleEditLine,
      onSaveLine: this.handleSaveLine,
      rowSelection: lineRowSelection,
    };
    const historyModalProps = {
      dataSource: historyList,
      pagination: historyPagination,
      loading: fetchHistoryListLoading,
      onSearch: this.handleFetchHistoryList,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('设备点检&保养任务查询')}>
          <Row style={{ width: '100%' }} type="flex" justify="end">
            <Col span={4}>
              <div className={styles['eq-task-doc-sum-rate']}>
                <Form.Item label="完成率" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {isEmpty(headList) ? 0 : headList[0].completedRate}
                </Form.Item>
              </div>
            </Col>
            <Col>
              <HistoryModal {...historyModalProps} />
              {/* <Fields */}
              {/*   permissionList={[ */}
              {/*     { */}
              {/*       code: `hzero.hzero.hme.tarzan.equipment.manage.task.document.ps.fileds.export`, */}
              {/*       type: 'fields', */}
              {/*     }, */}
              {/*   ]} */}
              {/* > */}
              {/*   <ExcelExport */}
              {/*     requestUrl={`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/list/export`} */}
              {/*     queryParams={this.handleGetFormFields()} */}
              {/*   /> */}
              {/* </Fields> */}
              <ExcelExport
                otherButtonProps={{ style: { marginRight: '12px' } }}
                requestUrl={`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/list/export`}
                queryParams={this.handleGetFormFields()}
                buttonText='导出单据'
              />
              {this.checkSelectRows() && (
                <ExcelExport
                  requestUrl={`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/list-line-export`} // 路径
                  otherButtonProps={{ style: { marginRight: '12px' } }}
                  queryParams={this.handleGetFormValue()}
                  buttonText='导出明细'
                />
              )}
              <ExcelExport
                requestUrl={`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/list-head-and-line-export`} // 路径
                queryParams={this.handleGetFormFieldsAndValues()}
                otherButtonProps={{ type: 'primary' }}
                buttonText='导出单据和明细'
              />
            </Col>
          </Row>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <HeadTable {...headListProps} />
          </div>
          <div className="ued-detail-wrapper">
            <div className={styles['head-table']}>
              <LineTable {...lineTableProps} />
            </div>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
