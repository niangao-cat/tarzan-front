/**
 * 盘装料退料
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Card, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';

@connect(({ chargingReturning, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  chargingReturning,
  loading: {
    fetchLoading: loading.effects['chargingReturning/queryHeadList'],
    submitLoading: loading.effects['chargingReturning/submitData'],
    calLoading: loading.effects['chargingReturning/calculateData'],
  },
}))
@formatterCollections({ code: ['hwms.chargingReturning', 'hwms.requisitionAndReturn'] })
class ChargingReturning extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      // disableSubmit: true, // 是否禁用提交按钮
      selectedRowKeys: [],
      selectedRows: [], // 选中的数据
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'chargingReturning/init',
      payload: {
        tenantId,
      },
    });
  }

  /**
   *  条码查询
   */
  @Bind()
  handleSearch() {
    const {
      dispatch,
      chargingReturning: { parentInfo },
    } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const temp = parentInfo;
    temp.materialLotCode = filterValues.materialLotCode;
    temp.workOrderNum = filterValues.workOrderNum || '';
    dispatch({
      type: 'chargingReturning/queryList',
      payload: {
        materialLotHeadVO: { ...temp },
      },
    }).then(res => {
      if (!res.success) {
        notification.error({ message: res.message });
      } else {
        this.handleCount();
      }
    });
  }

  /**
   * 从页面移除数据
   */
  @Bind()
  handleDelete() {
    const { selectedRowKeys } = this.state;
    const {
      chargingReturning: { parentInfo },
    } = this.props;
    const temp = parentInfo;
    const { materialLotDetailLineVOList: list } = temp;
    const tempList = list.filter(item => {
      return !selectedRowKeys.includes(item.materialLotCode);
    });
    temp.materialLotDetailLineVOList = tempList;
    this.setState({ selectedRowKeys: [], selectedRows: [] });
    this.handleCount(temp);
  }

  /**
   * 数据汇总
   */
  @Bind()
  handleCount(data) {
    const {
      dispatch,
      chargingReturning: { parentInfo },
    } = this.props;
    dispatch({
      type: 'chargingReturning/calculateData',
      payload: {
        materialLotHeadVO: isEmpty(data) ? parentInfo : data,
      },
    });
  }

  /**
   *  提交审批
   */
  @Bind()
  handleSubmit() {
    const {
      dispatch,
      chargingReturning: { parentInfo },
    } = this.props;
    const returnType = this.form.getFieldValue('returnType');
    this.form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'chargingReturning/submitData',
          payload: {
            materialLotHeadVO: { ...parentInfo, returnType },
          },
        }).then(res => {
          if (res.success) {
            notification.success();
            this.form.resetFields();
            this.setState({ selectedRowKeys: [], selectedRows: [] });
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 数据选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const {
      chargingReturning: { typeMap = [], parentInfo = {} },
      loading: { fetchLoading, submitLoading, calLoading },
      tenantId,
      dispatch,
    } = this.props;
    const { materialDetailLineVOList = [], materialLotDetailLineVOList = [] } = parentInfo;
    const filterProps = {
      tenantId,
      typeMap,
      parentInfo,
      dispatch,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      pagination: false,
      loading: fetchLoading,
      dataSource: materialDetailLineVOList,
    };
    const listRowProps = {
      selectedRowKeys,
      pagination: false,
      loading: fetchLoading,
      dataSource: materialLotDetailLineVOList,
      onSelectRow: this.handleSelectRow,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.chargingReturning.view.message.title').d('盘装料退料')}>
          <Button
            type="primary"
            disabled={isEmpty(materialLotDetailLineVOList)}
            loading={submitLoading}
            onClick={this.handleSubmit}
          >
            {intl.get('hzero.common.view.button.submit').d('提交')}
          </Button>
          <Button
            icon="delete"
            loading={calLoading}
            disabled={isEmpty(selectedRows)}
            onClick={this.handleDelete}
          >
            {intl.get('hzero.common.view.button.delete').d('移除')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...listHeadProps} />
          <Card
            key="code-rule-liner"
            title={intl.get('hwms.chargingReturning.view.message.line').d('明细')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <ListTableLine {...listRowProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default ChargingReturning;
