/*
 * @Description: 样本量字码维护
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:00:22
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, getEditTableData, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import { Button } from 'hzero-ui';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ sampleCode, loading }) => ({
  sampleCode,
  fetchLoading: loading.effects['sampleCode/handleSearch'],
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
    const { dispatch } = this.props;
    dispatch({
      type: 'sampleCode/getTypeLov',
      payload: {
        codeLevel: 'QMS.IQC_SAMPLE_SIZE_CODE_LEVEL', // 检验水平
        standardType: 'QMS.IQC_SAMPLE_STANDARD_TYPE', // 抽样标准类型
      },
    });
    this.handleSearch();
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
      type: 'sampleCode/handleSearch',
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
      sampleCode: { sampleCodeList = [], pagination = {} },
    } = this.props;
    dispatch({
      type: 'sampleCode/updateState',
      payload: {
        sampleCodeList: [
          {
            id: new Date().getTime(),
            sampleStandardType: '0',
            _status: 'create', // 新建标记位
            enableFlag: 'Y',
          },
          ...sampleCodeList,
        ],
        pagination: addItemToPagination(sampleCodeList.length, pagination),
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData() {
    const {
      sampleCode: { sampleCodeList = [] },
      dispatch,
    } = this.props;
    let params = [];
    params = getEditTableData(sampleCodeList);
    let flag;
    params.forEach(item => {
      if (item.lotSizeFrom > item.lotSizeTo) {
        flag = true;
      }
    });
    if (flag) {
      notification.error({ message: '上限值不可大于下限值！' });
    } else if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'sampleCode/saveSampleCode',
        payload: params,
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
      sampleCode: { sampleCodeList = [] },
    } = this.props;
    const newList = sampleCodeList.map(item =>
      item.letterId === record.letterId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'sampleCode/updateState',
      payload: {
        sampleCodeList: [...newList],
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
      sampleCode: { sampleCodeList = [], lovData = {}, pagination = {} },
      tenantId,
      fetchLoading,
      saveLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    return (
      <React.Fragment>
        <Header title="样本量字码维护">
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
            lovData={lovData}
            sampleCodeList={sampleCodeList}
            fetchLoading={fetchLoading}
            pagination={pagination}
            onSearch={this.handleSearch}
            handleEditLine={this.handleEditLine}
          />
        </Content>
      </React.Fragment>
    );
  }
}
