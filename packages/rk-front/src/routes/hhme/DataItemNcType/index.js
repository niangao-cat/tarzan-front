/*
 * @Description: 数据项计算公式维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-21 09:40:49
 * @LastEditTime: 2020-09-25 15:40:40
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  delItemToPagination,
  getCurrentOrganizationId,
  addItemToPagination,
  filterNullValueObject,
  getEditTableData,
} from 'utils/utils';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ dataItemNcType, loading }) => ({
  dataItemNcType,
  tenantId: getCurrentOrganizationId(),
  saveDataLoading: loading.effects['dataItemNcType/saveData'],
  fetchDataLoading: loading.effects['dataItemNcType/fetchData'],
  deleteDataLoading: loading.effects['dataItemNcType/deleteData'],
}))
export default class DataItemNcType extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
    } = this.props;
    dispatch({
      type: 'dataItemNcType/batchLovData',
      payload: {
        tenantId,
      },
    });
    this.fetchData();
  }

  // 保存数据
  @Bind()
  saveData() {
    const {
      dispatch,
      tenantId,
      dataItemNcType: { list = [], pagination = {} },
    } = this.props;
    const params = getEditTableData(list, ['tagNcId']);
    const arrNew = []; // 新增数组
    const arrUpd = []; // 修改数组
    params.forEach(item => {
      if (item._status === 'create') {
        arrNew.push({
          ...item,
          tenantId,
        });
      }
      if (item._status === 'update') {
        arrUpd.push({
          ...item,
          tenantId,
        });
      }
    });
    if (Array.isArray(params) && params.length > 0) {
      if (arrUpd.length > 0) {
        dispatch({
          type: 'dataItemNcType/updateData',
          payload: {
            params: arrUpd,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.fetchData(pagination);
          }
        });
      }
      dispatch({
        type: 'dataItemNcType/saveData',
        payload: {
          params: arrNew,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchData(pagination);
        }
      });
    }
  }

  // 获取数据
  @Bind()
  fetchData(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'dataItemNcType/fetchData',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 新增数据
  @Bind()
  handleCreate() {
    const {
      dispatch,
      dataItemNcType: { list = [], pagination = {} },
    } = this.props;
    dispatch({
      type: 'dataItemNcType/updateState',
      payload: {
        list: [
          {
            tagNcId: new Date().getTime(),
            _status: 'create',
          },
          ...list,
        ],
        pagination: addItemToPagination(list.length, pagination),
      },
    });
  }

  // 数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      dataItemNcType: { list = [], pagination = {} },
    } = this.props;
    if (!record.flag) {
      dispatch({
        type: 'dataItemNcType/deleteData',
        payload: {
          tagNcId: record.tagNcId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchData();
        }
      });
    } else {
      list.splice(index, 1);
      dispatch({
        type: 'dataItemNcType/updateState',
        payload: {
          list,
          pagination: delItemToPagination(1, pagination),
        },
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
      dataItemNcType: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.tagNcId === record.tagNcId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'dataItemNcType/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { selectedHeadKeys } = this.state;
    const {
      dataItemNcType: {
        list = [],
        pagination = {},
        valueType = [],
      },
      tenantId,
      saveDataLoading,
      fetchDataLoading,
      deleteDataLoading,
    } = this.props;
    const filterProps = {
      status,
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.fetchData,
      handleMoreSearch: this.hideOrOpenModal,
    };
    const listProps = {
      dataSource: list,
      pagination,
      onSearch: this.fetchData,
      canEdit: true,
      tenantId,
      loading: fetchDataLoading,
      deleteDataLoading,
      selectedHeadKeys,
      valueType,
      handleCreate: this.handleCreate, // 新增数据
      deleteData: this.deleteData, // 删除数据
      handleCleanLine: this.deleteData, // 清除
      handleEditLine: this.handleEditLine, // 取消&编辑
    };
    return (
      <React.Fragment>
        <Header title="数据项不良类型维护">
          <Button type="primary" loading={saveDataLoading} icon="save" onClick={() => this.saveData()}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
