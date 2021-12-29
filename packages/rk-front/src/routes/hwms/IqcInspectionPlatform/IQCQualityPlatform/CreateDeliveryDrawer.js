/*
 * @Description: 送货单抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-03-22 12:36:03
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form, notification, Button, Input, Col, Row, Select, InputNumber, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import {
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';

import EditTable from 'components/EditTable';

const {Option} = Select;

@connect(({iqcInspectionPlatform, loading}) => ({
  iqcInspectionPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryInspectLineTwoData'],
}))
@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [], // 选中的数据
      loading: false,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "iqcInspectionPlatform/updateState",
      payload: {
        inspectShowLineData: [],
        inspectShowLinePagination: {},
      },

    });
  }

  // 查询数据
  @Bind()
  queryData(value, records){
    // 获取基本信息
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectHeadData = {},
      },
    } = this.props;
    dispatch({
      type: "iqcInspectionPlatform/queryInspectLineTwoData",
      payload: {
        tagGroupId: records.tagGroupId,
        iqcHeaderId: inspectHeadData.iqcHeaderId,
      },
    });
  }

  // 数据选中
  @Bind()
  handleChangeSelectRows(selectedRowsKey, selectedRows) {
    this.setState({selectedRows});
  }

  // 将选中的新增数据进行保存
  @Bind()
  saveData(){
    // 获取基本信息
    const { dispatch, iqcInspectionPlatform: {
      inspectHeadData = {},
    } } = this.props;
    const { selectedRows } = this.state;
    // 验证是否选中了数据
    if(selectedRows.length===0){
      return notification.error({message: "请先选中要保存的数据"});
    }else {
      this.setState({loading: true});
      // 赋值头Id
      for(let i=0;i<selectedRows.length;i++){
        selectedRows[i].iqcHeaderId =inspectHeadData.iqcHeaderId;

        // 判断必输项
        if(selectedRows[i].defectLevels===""||selectedRows[i].defectLevels===null||selectedRows[i].defectLevels===undefined||
        selectedRows[i].sampleTypeCode===""||selectedRows[i].sampleTypeCode===null||selectedRows[i].sampleTypeCode===undefined)
        {return notification.error({message: "请输入必输项"});}
      }
      // 调用保存接口
      dispatch({
        type: "iqcInspectionPlatform/saveInspectLineData",
        payload: {
          saveData: selectedRows,
        },
      }).then(res => {
        if (!res) {
          notification.error({message: res.message});
          // 重置选中数据
          this.setState({selectedRows: []});
        }else{
          notification.success({message: "新增成功"});
        }
        this.setState({loading: false});
      });
    }
  }

  // lov 修改时，回填主键
  @Bind()
  changeSampleTypeCode= (value, record, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowLineData = [],
        inspectHeadData = {},
      },
    } = this.props;
    inspectShowLineData[index].sampleTypeId = record.sampleTypeId;
    inspectShowLineData[index].sampleTypeCode = record.sampleTypeCode;
    dispatch({
      type: "iqcInspectionPlatform/queryInspectLineByLovForData",
      payload: {
        sampleTypeId: record.sampleTypeId,
        iqcHeaderId: inspectHeadData.iqcHeaderId,
      },
    }).then(res=>{
      if(!res){
        inspectShowLineData[index].acceptanceQuantityLimit = "";
        inspectShowLineData[index].sampleSize = "";
        inspectShowLineData[index].ac = "";
        inspectShowLineData[index].re = "";
        inspectShowLineData[index].inspectionLevels = "";
        notification.error({message: res.message});
        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectShowLineData,
          },
        });
      }else{
        inspectShowLineData[index].acceptanceQuantityLimit = res.aql;
        inspectShowLineData[index].sampleSize = res.sampleSize;
        inspectShowLineData[index].ac = res.ac;
        inspectShowLineData[index].re = res.re;
        inspectShowLineData[index].inspectionLevels = res.inspectionLevels;
        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectShowLineData,
          },
        });
      }
    });
  };

  @Bind()
  changeDefectLevels= (value, record, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowLineData = [],
      },
    } = this.props;
    inspectShowLineData[index].defectLevels = value;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectShowLineData,
      },
    });
  };

  // 变幻时调用更新
  @Bind()
  changeStandFrom= (value, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowLineData = [],
      },
    } = this.props;
    inspectShowLineData[index].standardFrom = value;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectShowLineData,
      },
    });
  };

  // 变幻时调用更新
  @Bind()
changeStandTo= (value, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowLineData = [],
      },
    } = this.props;
    inspectShowLineData[index].standardTo = value;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectShowLineData,
      },
    });
  };

  // 变幻时调用更新
  @Bind()
  changeStandardText= (value, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowLineData = [],
      },
    } = this.props;
    inspectShowLineData[index].standardText = value.target.value;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectShowLineData,
      },
    });
  };

  // 设置编辑的数据
  @Bind()
  rowClick(record, index){
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowLineData = [],
      },
    } = this.props;
    inspectShowLineData[index]._status = "update";
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectShowLineData,
      },
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      selectedRows,
    } = this.state;
    const {
      expandDrawer,
      expandColseData,
      form,
      iqcInspectionPlatform: {
        typeOptionsMap = [],
        inspectLevelMap = [], // 检验水平
        inspectToolMap = [], // 检验工具
        defectLevelMap= [], // 缺陷等级
        inspectShowLineData= [],
      },
      fetchDataLoading,
    } = this.props;

    // 选中的数据
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e=>e.tagGroupAssignId),
      onChange: this.handleChangeSelectRows,
    };

   // 获取表单的字段属性
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        width: 50,
        render: (val, record, index) => index+1,
      },
      {
        title: '排序码',
        dataIndex: 'orderKey',
        width: 120,
      },
      {
        title: '检验项目',
        dataIndex: 'inspection',
        width: 120,
      },
      {
        title: '检验项类别',
        dataIndex: 'inspectionType',
        width: 120,
        render: (val) => (
            (typeOptionsMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '检验项描述',
        dataIndex: `inspectionDesc`,
        width: 120,
      },
      {
        title: '检验方法',
        dataIndex: `collectionMethodMeaning`,
        width: 120,
      },
      {
        title: '缺陷等级',
        dataIndex: `defectLevels`,
        width: 120,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`defectLevels`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`defectLevels`).d('缺陷等级'),
                    }),
                  },
                ],
                initialValue: val,
              })(
                <Select
                  onChange={(values, records) => this.changeDefectLevels(values, records, index)}
                  style={{width: '100%'}}
                >
                  {defectLevelMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (defectLevelMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '规格值从',
        width: 120,
        dataIndex: 'standardFrom',
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardFrom`, {
                initialValue: record.standardFrom,
              })(
                <InputNumber
                  min={0}
                  onChange={values=> this.changeStandFrom(values, index)}
                  style={{width: '100%'}}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '规格值至',
        width: 120,
        dataIndex: 'standardTo',
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardTo`, {
                initialValue: record.standardTo,
              })(
                <InputNumber
                  onChange={values => this.changeStandTo(values, index)}
                  min={0}
                  style={{width: '100%'}}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '精度',
        width: 120,
        dataIndex: 'accuracy',
        align: 'center',
      },
      {
        title: '规格单位',
        width: 120,
        dataIndex: 'uomCode',
        align: 'center',
      },
      {
        title: '文本规格值',
        width: 120,
        dataIndex: 'standardText',
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardText`, {
                initialValue: record.standardText,
              })(
                <Input
                  // onChange={()=>this.changeStandardText}
                  onChange={vals => this.changeStandardText(vals, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '检验水平',
        width: 120,
        dataIndex: 'inspectionLevels',
        align: 'center',
        render: (val) =>
          (
            (inspectLevelMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },

      {
        title: '检验工具',
        width: 120,
        dataIndex: 'inspectionTool',
        align: 'center',
        render: (val) =>
          (
            (inspectToolMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '规格类型',
        width: 120,
        dataIndex: 'standardTypeMeaning',
        align: 'center',
      },
      {
        title: '抽样方案类型',
        width: 120,
        dataIndex: 'sampleTypeCode',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sampleTypeCode`, {
                initialValue: record.sampleTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`sampleTypeCode`).d('抽样类型'),
                    }),
                  },
                ],
              })(
                <Lov
                  textValue={record.sampleTypeCode}
                  code="QMS_SAMPLE_TYPE"
                  onChange={(values, records) => this.changeSampleTypeCode(values, records, index)}
                  queryParams={{ tenantId: getCurrentOrganizationId() }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '抽样数量',
        width: 80,
        dataIndex: 'sampleSize',
        align: 'center',
      },
      {
        title: 'AQL值',
        width: 50,
        dataIndex: 'acceptanceQuantityLimit',
        align: 'center',
      },
      {
        title: 'AC',
        width: 50,
        dataIndex: 'ac',
        align: 'center',
      },
      {
        title: 'RE',
        width: 50,
        dataIndex: 're',
        align: 'center',
      },
      {
        title: '备注',
        width: 200,
        dataIndex: 'remark',
        align: 'center',
      },
    ];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1600}
        onCancel={expandColseData}
        visible={expandDrawer}
        footer={null}
        title="检验组维护"
      >
        <br />
        <Spin spinning={this.state.loading}>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`tagGroupId`).d('检验组编码')}
                >
                  {getFieldDecorator('tagGroupId', {
                })(
                  <Lov
                    code="QMS.TAG_GROUP"
                    queryParams={{tenantId: getCurrentOrganizationId()}}
                    onChange={(value, records) => this.queryData(value, records)}
                  />
                )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item>
                  <Button type="primary" onClick={this.saveData} style={{ marginLeft: '15px' }}>
                    {intl.get('hzero.purchase.button.newInspect').d('新增')}
                  </Button>
                  <Button type="primary" onClick={expandColseData} style={{ marginLeft: '15px' }}>
                    {intl.get('hzero.purchase.button.newInspect').d('返回')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <br />
          <EditTable
            rowKey="tagGroupAssignId"
            loading={fetchDataLoading}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={inspectShowLineData}
            pagination={false}
            onRow={(record, index) => {
            return {
              onClick: () => {
                this.rowClick(record, index);
              },
            };
          }}
            bordered
          />
          <br />
          <br />
        </Spin>
      </Modal>
    );
  }
}
