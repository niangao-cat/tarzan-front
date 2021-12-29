/*
 * @Description: 产品应用检机报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-16 09:52:45
 * @LastEditTime: 2021-02-08 15:26:37
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Row, Col, Button, Table, Form, Input, Checkbox, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, tableScrollWidth, filterNullValueObject } from 'utils/utils';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import DetailDrawer from './DetailDrawer';

@connect(({ prodApplicationInspectionMachine, loading }) => ({
  prodApplicationInspectionMachine,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['prodApplicationInspectionMachine/handleSearch'],
  handleExportLoading: loading.effects['prodApplicationInspectionMachine/handleExport'],
  handleFetchDetailLoading: loading.effects['prodApplicationInspectionMachine/handleFetchDetail'],
}))
@Form.create({ fieldNameProp: null })
export default class ProdApplicationInspectionMachine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      visible: false,
      recordDetail: {},
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'prodApplicationInspectionMachine/batchLovData',
      payload: {
        tenantId,
      },
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'prodApplicationInspectionMachine/handleSearch',
          payload: {
            ...values,
            page: isEmpty(fields) ? {} : fields,
          },
        });
      }
    });
  }

  @Bind
  handleExport() {
    const { dispatch, tenantId, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'prodApplicationInspectionMachine/handleExport',
          payload: {
            ...fieldsValue,
            tenantId,
          },
        }).then(res => {
          if (res) {
            const file = new Blob(
              [res],
              { type: 'application/vnd.ms-excel' }
            );
            const fileURL = URL.createObjectURL(file);
            const fileName = '产品应用检机报表.xls';
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = fileURL;
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          }
        });
      }
    });
  }

  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  // 查询明细
  @Bind()
  handleFetchDetail(val, flag) {
    const { dispatch } = this.props;
    if (flag) {
      this.setState({ visible: flag, recordDetail: val }, () => {
        this.handleDetail();
      });
    } else {
      this.setState({ visible: flag, recordDetail: {} });
      dispatch({
        type: 'prodApplicationInspectionMachine/updateState',
        payload: {
          detailList: [],
        },
      });
    }
  }

  @Bind()
  handleDetail(fields={}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'prodApplicationInspectionMachine/handleFetchDetail',
      payload: {
        ...this.state.recordDetail,
        tenantId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  render() {
    const {
      prodApplicationInspectionMachine: {
        badApplicationList = [],
        pagination = {},
        dynamicColumns = [],
        operationList = [],
        detailList = [],
        detailListPagination = [],
      },
      fetchLoading,
      handleExportLoading,
      handleFetchDetailLoading,
      form,
      tenantId,
    } = this.props;
    const { expandForm, visible } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    const detailDrawerProps = {
      visible,
      dataSource: detailList,
      pagination: detailListPagination,
      loading: handleFetchDetailLoading,
      onCancel: this.handleFetchDetail,
      handleSearch: this.handleDetail,
    };
    const columns = [
      {
        title: '工艺编码',
        width: 100,
        dataIndex: 'operationName',
        render: (val, record) => (
          <a disabled={getFieldValue('flag') === 'Y'} onClick={() => this.handleFetchDetail(record, true)}>
            {val}
          </a>
        ),
      },
      {
        title: '机型',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '机型描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '检验数',
        width: 70,
        dataIndex: 'inspectionNum',
      },
      {
        title: '不良数',
        width: 70,
        dataIndex: 'ncNum',
      },
      {
        title: '不良率',
        width: 70,
        dataIndex: 'ncRate',
      },
    ];
    return (
      <Fragment>
        <Header title="产品应用检机报表">
          <Button
            type="primary"
            icon='export'
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button>
        </Header>
        <Content>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="机型">
                  {getFieldDecorator('materialId', {})(
                    <Lov
                      queryParams={{ tenantId }}
                      code="MT.MATERIAL"
                      onChange={(value, record) => {
                        form.setFieldsValue({
                          materialName: record.materialName,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="机型描述">
                  {getFieldDecorator('materialName', {})(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="检验员">
                  {getFieldDecorator('flag', {})(
                    <Checkbox checkedValue='Y' unCheckedValue='N' />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.toggleForm}>
                    {expandForm
                      ? intl.get('hzero.common.button.collected').d('收起查询')
                      : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
                  </Button>
                  <Button data-code="reset" onClick={this.handleFormReset}>
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                  <Button
                    data-code="search"
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.handleSearch()}
                  >
                    {intl.get('hzero.common.button.search').d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            {expandForm && (
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_4_LAYOUT}>
                  <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工艺编码">
                    {getFieldDecorator('operationCode', {})(
                      <Select style={{ width: '100%' }} allowClear>
                        {operationList.map(e => (
                          <Select.Option key={e.value} value={e.value}>
                            {e.meaning}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form>
          <Table
            dataSource={badApplicationList}
            columns={columns.concat(dynamicColumns)}
            scroll={{ x: tableScrollWidth(columns.concat(dynamicColumns)) }}
            bordered
            pagination={pagination}
            onChange={page => this.handleSearch(page)}
            loading={fetchLoading}
          />
          {visible && <DetailDrawer {...detailDrawerProps} />}
        </Content>
      </Fragment>
    );
  }
}
