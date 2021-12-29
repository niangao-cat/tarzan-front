/*
 * @Description: 设备工位关系维护
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-08 09:27:20
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, filterNullValueObject, delItemToPagination, getEditTableData } from 'utils/utils';
import { Button } from 'hzero-ui';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ equipmentStationRelation, loading }) => ({
  equipmentStationRelation,
  fetchLoading: loading.effects['equipmentStationRelation/handleSearch'],
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class EquipmentStationRelation extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    this.handleSearch();
    dispatch({
      type: 'equipmentStationRelation/getSiteList',
      payload: {
        detail: {},
      },
    });
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'equipmentStationRelation/handleSearch',
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
      equipmentStationRelation: { dataList = [], pagination = {}, defaultSite={} },
    } = this.props;
    dispatch({
      type: 'equipmentStationRelation/updateState',
      payload: {
        dataList: [
          {
            siteName: defaultSite.siteName,
            siteId: defaultSite.siteId,
            id: new Date().getTime(),
            enableFlag: 'Y',
            _status: 'create', // 新建标记位
          },
          ...dataList,
        ],
        pagination: addItemToPagination(dataList.length, pagination),
      },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      equipmentStationRelation: { dataList = [], pagination = {} },
    } = this.props;
    const newList = dataList.filter(
      item => item.id !== record.id
    );
    dispatch({
      type: 'equipmentStationRelation/updateState',
      payload: {
        dataList: [...newList],
        pagination: delItemToPagination(dataList.length, pagination),
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(record = {}) {
    const {
      equipmentStationRelation: { dataList = [] },
      dispatch,
    } = this.props;
    let params = [];
    params = getEditTableData(dataList, ['id']);
    if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'equipmentStationRelation/saveData',
        payload: {
          ...record,
          params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
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
      equipmentStationRelation: { dataList = [] },
    } = this.props;
    const newList = dataList.map(item =>
      item.equipmentWkcRelId === record.equipmentWkcRelId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'equipmentStationRelation/updateState',
      payload: {
        dataList: [...newList],
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
      equipmentStationRelation: { dataList = [], pagination = {} },
      tenantId,
      fetchLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    return (
      <React.Fragment>
        <Header title="设备工位关系维护">
          <Button type="primary" icon="plus" onClick={() => this.handleAddData()}>
            新建
          </Button>
          <Button icon="save" onClick={() => this.saveData()}>
            保存
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable
            dataList={dataList}
            fetchLoading={fetchLoading}
            pagination={pagination}
            onSearch={this.handleSearch}
            handleEditLine={this.handleEditLine}
            handleCleanLine={this.handleCleanLine}
            saveData={this.saveData}
          />
        </Content>
      </React.Fragment>
    );
  }
}
