/*
 * @Description: 样本量字码维护
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:19:24
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  addItemToPagination,
  getEditTableData,
  filterNullValueObject,
  delItemToPagination,
  getCurrentOrganizationId,
} from 'utils/utils';
import notification from 'utils/notification';
import { Button } from 'hzero-ui';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ qualificationBaseInfo, loading }) => ({
  qualificationBaseInfo,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['qualificationBaseInfo/fetchQualificationList'],
  saveLoading: loading.effects['sampleCode/saveSampleCode'],
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class IQCInspectionFree extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'qualificationBaseInfo/batchLovData',
      payload: {
        tenantId,
      },
    });
    this.fetchQualificationList();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  fetchQualificationList(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'qualificationBaseInfo/fetchQualificationList',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 新增数据
  @Bind()
  handleAddData() {
    const {
      dispatch,
      qualificationBaseInfo: { qualificationList = [], pagination = {} },
    } = this.props;
    dispatch({
      type: 'qualificationBaseInfo/updateState',
      payload: {
        qualificationList: [
          {
            qualityId: new Date().getTime(),
            enableFlag: 'Y',
            _status: 'create', // 新建标记位
          },
          ...qualificationList,
        ],
        pagination: addItemToPagination(qualificationList.length, pagination),
      },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      qualificationBaseInfo: { qualificationList = [], pagination = {} },
    } = this.props;
    const newList = qualificationList.filter(
      item => item.qualityId !== record.qualityId
    );
    dispatch({
      type: 'qualificationBaseInfo/updateState',
      payload: {
        qualificationList: [...newList],
        pagination: delItemToPagination(qualificationList.length, pagination),
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData() {
    const {
      qualificationBaseInfo: { qualificationList = [] },
      dispatch,
    } = this.props;
    const arr = [];
    const params = getEditTableData(qualificationList, ['qualityId']);
    params.forEach(item => {
      arr.push({
        ...item,
        enableFlag: item.enableFlag ? 'Y' : 'N',
      }
      );
    });
    if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'qualificationBaseInfo/saveData',
        payload: {
          arr,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchQualificationList();
        }
      });
    }
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      qualificationBaseInfo: { qualificationList = [] },
    } = this.props;
    const newList = qualificationList.map(item =>
      item.qualityId === record.qualityId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'qualificationBaseInfo/updateState',
      payload: {
        qualificationList: [...newList],
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      qualificationBaseInfo: {
        qualificationList = [],
        pagination = {},
        qualityType = [],
      },
      tenantId,
      fetchLoading,
      saveLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      qualityType,
      onRef: this.handleBindRef,
      onSearch: this.fetchQualificationList,
    };
    return (
      <React.Fragment>
        <Header title="资质基础信息维护">
          <Button type="primary" icon="plus" onClick={() => this.handleAddData()}>
            新建
          </Button>
          <Button type="primary" icon="save" onClick={() => this.saveData()} loading={saveLoading}>
            保存
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable
            qualityType={qualityType}
            qualificationList={qualificationList}
            fetchLoading={fetchLoading}
            pagination={pagination}
            onSearch={this.fetchQualificationList}
            handleEditLine={this.handleEditLine}
            handleCleanLine={this.handleCleanLine}
          />
        </Content>
      </React.Fragment>
    );
  }
}
