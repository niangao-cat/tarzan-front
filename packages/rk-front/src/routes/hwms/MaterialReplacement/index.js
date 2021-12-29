/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import { filterNullValueObject, getCurrentOrganizationId, getDateTimeFormat, delItemToPagination} from 'utils/utils';

import FilterForm from './FilterForm';
import HeadTable from './HeadList';
import AbnormalResponse from './LineList';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.materialReplacement';
const dateTimeFormat = getDateTimeFormat();

@connect(({ materialReplacement, loading }) => ({
  materialReplacement,
  fetchHeadListLoading: loading.effects['materialReplacement/fetchHeadList'],
  fetchLineListLoading: loading.effects['materialReplacement/fetchLineList'],
  tenantId: getCurrentOrganizationId(),
  saveLineLoading: loading.effects['materialReplacement/saveLine'],
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class MaterialReplacement extends Component {
  constructor(props) {
    super(props);
    this.initData();
    this.state = {
      selectHeadRow: {},
    };
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialReplacement/updateState',
      payload: {
        selectedRecord: {},
        lineList: [],
        linePagination: {},
      },
    });
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'materialReplacement/init',
    });
    await dispatch({
      type: 'materialReplacement/getSiteList',
      payload: {},
    });
    await this.handleFetchHeadList();
  }

  @Bind()
  handleFetchHeadList(page = {}) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { createDateFrom, createDateTo } = value;
    value = {
      ...value,
      createDateFrom: isEmpty(createDateFrom)
        ? null
        : createDateFrom.startOf('day').format(dateTimeFormat),
      createDateTo: isEmpty(createDateTo) ? null : createDateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'materialReplacement/fetchHeadList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleFetchLineList(page = {}, record = {}) {
    this.setState({ selectHeadRow: record});
    const {
      dispatch,
      materialReplacement: { selectedRecord = {} },
    } = this.props;
    const newRecord = isEmpty(record) ? selectedRecord : record;
    dispatch({
      type: 'materialReplacement/fetchLineList',
      payload: {
        selectedRecord: newRecord,
        page,
      },
    });
  }

  // 编辑行
  @Bind()
  handleEditLine(record, flag) {
    const {
      dispatch,
      materialReplacement: { lineList },
    } = this.props;
    const newList = lineList.map(item => {
      if (record.instructionId === item.instructionId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'materialReplacement/updateState',
      payload: { lineList: newList },
    });
  }

  // 取消行编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      materialReplacement: { lineList, linePagination = {} },
    } = this.props;
    const newList = lineList.filter(item => item.instructionId !== record.instructionId);
    dispatch({
      type: 'materialReplacement/updateState',
      payload: {
        lineList: newList,
        linePagination: delItemToPagination(10, linePagination),
      },
    });
  }

  // 保存行
  @Bind
  handleSaveLine(record, index) {
    const { dispatch, materialReplacement: { lineList }} = this.props;
    const{ selectHeadRow } = this.state;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'materialReplacement/saveLine',
          payload: {
            ...fieldsValue,
            instructionId: record.instructionId,
            locatorId: record.locatorId,
            materialId: record.materialId,
            siteId: selectHeadRow.siteId,
            executeQty: record.executeQty,
          },
        }).then(res => {
          if (res) {
            lineList[index]._status = '';
            lineList[index].executeQty = res.executeQty;
            lineList[index].addQty = "";
            dispatch({
              type: 'materialReplacement/updateState',
              payload: {
                lineList,
              },
            });
            notification.success();
          }
        });
      }
    });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      tenantId,
      materialReplacement: {
        headList = [],
        pagination = {},
        lineList = [],
        linePagination = {},
        versionList = [],
        statusList = [],
        siteInfo = {},
      },
      saveLineLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      versionList,
      statusList,
      siteInfo,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchHeadList,
    };
    const headListProps = {
      tenantId,
      loading: fetchHeadListLoading,
      pagination,
      dataSource: headList,
      onSearch: this.handleFetchHeadList,
      onFetchLineList: this.handleFetchLineList,
    };
    const abnormalResponseProps = {
      tenantId,
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineListLoading,
      saveLineLoading,
      onSearch: this.handleFetchLineList,
      handleEditLine: this.handleEditLine,
      handleCleanLine: this.handleCleanLine,
      handleSaveLine: this.handleSaveLine,
    };
    return (
      <div>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('料废调换查询')} />
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <HeadTable {...headListProps} />
          </div>
          <div className={styles['head-table']}>
            <AbnormalResponse {...abnormalResponseProps} />
          </div>
        </Content>
      </div>
    );
  }
}
