/*
 * @Description: inspectionPlan
 * @version: 0.1.0
 * @Author: wenjie.yang@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-02-08 09:55:48
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Form, Input, Row, Col, notification, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import { isEmpty } from 'lodash';
import QualityInspectionFilterForm from './QualityInspectionFilterForm';
import QualityInspectionTableRow from './QualityInspectionTableRow';

@Form.create({ fieldNameProp: null })
@connect(({ inspectionPlan, loading }) => ({
  inspectionPlan,
  tenantId: getCurrentOrganizationId(),
  fetchLineLoading: loading.effects['inspectionPlan/fetchLineListGroup'],
  fetchInspectionGroupLoading: loading.effects['inspectionPlan/fetchInspectionGroup'],
  saveLoading: loading.effects['inspectionPlan/handleSaveInspectionTeam'],
  deleteLoading: loading.effects['inspectionPlan/deleteTagGroup'],
  saveHeadLoading: loading.effects['inspectionPlan/handleSaveInspectionTeam'],
  saveLineLoading: loading.effects['inspectionPlan/handleSaveInspectionTeamLine'],
  copyLoading: loading.effects['inspectionPlan/copyLoading'],
}))
export default class QualityInspection extends Component {
  constructor(props) {
    super(props);
    const { inspectionSchemeId } = this.props.match.params;
    this.state = {
      selectedRowKeys: [],
      selectedRow: [],
      inspectionSchemeId,
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'inspectionPlan/batchLovData',
      payload: {
        tenantId,
      },
    });
    // 初始化数据
    dispatch({
      type: 'inspectionPlan/updateState',
      payload: {
        lineListGroup: [],
      },
    });
    dispatch({
      type: 'inspectionPlan/fetchSite',
      payload: { tenantId },
    });
    this.fetchInspectionGroup();
  }

  // 获取检验组数据
  @Bind()
  fetchInspectionGroup(params = {}) {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [], selectedRow: [] });
    const filterValue = this.filterForm.getFieldsValue();
    // 查询检验组
    dispatch({
      type: 'inspectionPlan/fetchInspectionGroup',
      payload: {
        ...filterValue,
        inspectionSchemeId: this.state.inspectionSchemeId,
        page: isEmpty(params) ? {} : params,
      },
    });
  }

  // 保存检验组
  @Bind()
  handleSaveInspectionTeam() {
    const {
      dispatch,
      inspectionPlan: { inspectionGroup = [], lineListGroup = [] },
    } = this.props;
    const { inspectionSchemeId } = this.state;
    let params = [];
    params = getEditTableData(inspectionGroup, ['tagGroupCode']);
    params.forEach(val => {
      // eslint-disable-next-line no-param-reassign
      val.inspectionSchemeId = inspectionSchemeId;
    });
    let paramsLine = [];
    paramsLine = getEditTableData(lineListGroup);
    paramsLine.forEach(val => {
      // eslint-disable-next-line no-param-reassign
      val.schemeId = inspectionSchemeId;
      if(val.processId === undefined){
        // eslint-disable-next-line no-param-reassign
        val.processId = "";
      }
    });
    if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'inspectionPlan/handleSaveInspectionTeam',
        payload: params,
      }).then(res => {
        if (res) {
          this.handleSaveInspectionTeamLine(paramsLine);
          notification.success({ message: '质检组保存成功！' });
          this.setState({ selectedRowKeys: [], selectedRow: [] });
          const filterValue = this.filterForm.getFieldsValue();
          // 查询检验组
          dispatch({
            type: 'inspectionPlan/fetchInspectionGroup',
            payload: {
              ...filterValue,
              inspectionSchemeId: this.state.inspectionSchemeId,
            },
          }).then(resData=>{
            if(resData){
              this.setState({ selectedRowKeys: [resData.content[0].tagGroupRelId], selectedRow: [ {...resData.content[0]}] });
              this.fetchLineList();
            }
          });
        }
      });
    } else {
      this.handleSaveInspectionTeamLine(paramsLine);
    }
  }

  // 行保存
  @Bind()
  handleSaveInspectionTeamLine(paramsLine) {
    let flag;
    paramsLine.forEach(item => {
      if (item.standardFrom > item.standardTo) {
        flag = true;
      }
    });
    const { dispatch } = this.props;
    if (Array.isArray(paramsLine) && paramsLine.length !== 0 && !flag) {
      dispatch({
        type: 'inspectionPlan/handleSaveInspectionTeamLine',
        payload: paramsLine,
      }).then(res => {
        if (res) {
          notification.success({ message: '质检项保存成功！' });
          this.fetchInspectionGroup();
        }
      });
    } else if (Array.isArray(paramsLine) && paramsLine.length !== 0 && flag) {
      notification.error({ message: '规格值从不可大于规格至' });
    }
  }

  // 新增检验组
  @Bind()
  handleAddInspectionTeam() {
    const {
      dispatch,
      inspectionPlan: { inspectionGroup = [] },
    } = this.props;
    dispatch({
      type: 'inspectionPlan/updateState',
      payload: {
        inspectionGroup: [
          {
            tagGroupRelId: new Date().getTime(),
            tagGroupDescription: '',
            remark: '',
            _status: 'create', // 新建标记位
          },
          ...inspectionGroup,
        ],
      },
    });
  }

  // 选中行数据
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow }, () => {
      this.fetchLineList();
    });
  }

  // 选中lov的时候更新未保存的行数据
  @Bind()
  updateUnSaveLine(index, item) {
    const {
      dispatch,
      inspectionPlan: { inspectionGroup = [] },
    } = this.props;
    inspectionGroup[index].tagGroupId = item.tagGroupId;
    inspectionGroup[index].tagGroupCode = item.tagGroupCode;
    inspectionGroup[index].tagGroupDescription = item.tagGroupDescription;
    dispatch({
      type: 'inspectionPlan/updateState',
      payload: {
        inspectionGroup,
      },
    });
  }

  // 获取行数据
  @Bind()
  fetchLineList(params = {}) {
    const { dispatch, tenantId } = this.props;
    const { selectedRow, inspectionSchemeId } = this.state;
    dispatch({
      type: 'inspectionPlan/fetchLineListGroup',
      payload: {
        tenantId,
        inspectionSchemeId,
        tagGroupId: selectedRow.length === 0 ? '' : selectedRow[0].tagGroupId,
        page: isEmpty(params) ? {} : params,
      },
    });
  }

  // 删除质检组
  @Bind()
  deleteTagGroup(record, index) {
    const { dispatch,
      inspectionPlan: { inspectionGroup = [] },
    } = this.props;
    if (record._status === 'create') {
      const newList = inspectionGroup.filter(item => item.tagGroupRelId !== record.tagGroupRelId);
      dispatch({
        type: 'inspectionPlan/updateState',
        payload: {
          inspectionGroup: newList,
        },
      });
      this.setState({
        selectedRowKeys: [],
        selectedRow: [],
      });
    } else {
      dispatch({
        type: 'inspectionPlan/deleteTagGroup',
        payload: {
          tagGroupId: [record.tagGroupRelId],
        },
      }).then(res => {
        if (res) {
          this.setState({
            selectedRowKeys: [],
            selectedRow: [],
          });
          notification.success({ message: '操作成功！' });
          inspectionGroup.splice(index, 1);
          dispatch({
            type: 'inspectionPlan/updateState',
            payload: {
              lineListGroup: [],
              lineListGroupPagination: {},
              inspectionGroup,
            },
          });
        }
      });
    }
  }

  render() {
    const {
      inspectionPlan: {
        testTypeLov = [],
        inspectionGroup = [],
        inspectionGroupPagination = {},
        lineListGroup = [],
        lineListGroupPagination = {},
        defectLevel = [],
        selectedHeadCache = [],
      },
      tenantId,
      fetchLineLoading,
      fetchInspectionGroupLoading,
      deleteLoading,
      saveHeadLoading,
      saveLineLoading,
    } = this.props;
    const { selectedRowKeys } = this.state;
    // 查询
    const filterFormProps = {
      onSearch: this.fetchInspectionGroup,
      testTypeLov,
      deleteLoading,
      addInspectionTeam: this.handleAddInspectionTeam,
      handleSaveInspectionTeam: this.handleSaveInspectionTeam,
      deleteTagGroup: this.deleteTagGroup,
      onRef: node => {
        this.filterForm = node.props.form;
      },
      saveHeadLoading,
      saveLineLoading,
    };
    const columns = [
      {
        title: '检验组编码',
        width: 100,
        dataIndex: 'tagGroupCode',
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagGroupId`, {
                rules: [
                  {
                    required: true,
                    message: '检验组编码不能为空',
                  },
                ],
              })(
                <Lov
                  queryParams={{ tenantId }}
                  code="QMS.TAG_GROUP"
                  textField="tagGroupCode"
                  onChange={(value, item) => {
                    this.setState({
                      selectedRow: [{ tagGroupId: item.tagGroupId }],
                      selectedRowKeys: [record.tagGroupRelId],
                    },
                      () => {
                        this.fetchLineList();
                        this.updateUnSaveLine(index, item);
                      }
                    );
                    record.$form.setFieldsValue({
                      tagGroupDescription: item.tagGroupDescription,
                      // tagGroupCode: item.tagGroupCode,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '检验组描述',
        width: 100,
        dataIndex: 'tagGroupDescription',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagGroupDescription`, {
                initialValue: record.tagGroupDescription,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '备注',
        width: 240,
        dataIndex: 'remark',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: record.remark,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '操作',
        width: 100,
        align: 'center',
        render: (val, record, index) => {
          return (
            <span className="action-link">
              <Popconfirm
                title="确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.deleteTagGroup(record, index)}
              >
                <a>
                  删除
                </a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    return (
      <Fragment>
        <Header title="检验组维护" backPath="/hqms/inspection-plan" />
        <Content>
          <QualityInspectionFilterForm {...filterFormProps} />
          <Row>
            <Col span={16}>
              <EditTable
                bordered
                columns={columns}
                loading={fetchInspectionGroupLoading}
                dataSource={inspectionGroup}
                pagination={inspectionGroupPagination}
                rowKey="tagGroupRelId"
                onChange={page => this.fetchInspectionGroup(page)}
                rowSelection={{
                  selectedRowKeys,
                  type: 'radio', // 单选
                  onChange: this.handleSelectRow,
                }}
              />
            </Col>
          </Row>
          <QualityInspectionTableRow
            dataSource={lineListGroup}
            loading={fetchLineLoading}
            defectLevel={defectLevel}
            onSearch={this.fetchLineList}
            pagination={lineListGroupPagination}
            selectedHeadCache={selectedHeadCache}
          />
        </Content>
      </Fragment>
    );
  }
}
