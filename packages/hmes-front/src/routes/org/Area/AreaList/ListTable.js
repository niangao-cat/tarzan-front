/**
 * ListTable - 表格
 * @date: 2019-8-8
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.org.area.model.area';

@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} areaList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ area, loading }) => ({
  area,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['area/fetchAreaList'],
}))
export default class ListTable extends React.Component {
  // 点击编码编辑的时候
  @Bind
  showAreaDist(record) {
    const { onEdit } = this.props;
    onEdit(record);
  }

  /**
   * 查询数据
   * @param {object} pagination 分页信息
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { dispatch } = this.props;

    this.props.filterForm.validateFields((err, values) => {
      dispatch({
        type: 'area/fetchAreaList',
        payload: {
          ...values,
          page: pagination,
        },
      });
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      area: { areaList = [], areaPagination = {} },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.areaCode`).d('区域编码'),
        width: 100,
        dataIndex: 'areaCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showAreaDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.areaName`).d('区域短描述'),
        dataIndex: 'areaName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('区域长描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];

    return (
      <Table
        loading={loading}
        rowKey="areaId"
        dataSource={areaList}
        columns={columns}
        pagination={areaPagination || {}}
        onChange={this.fetchQueryList}
        bordered
      />
    );
  }
}
