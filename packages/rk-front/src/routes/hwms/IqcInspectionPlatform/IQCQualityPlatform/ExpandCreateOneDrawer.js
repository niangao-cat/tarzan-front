/*
 * @Description: 送货单抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-05 15:00:25
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, {Component} from 'react';
import {Modal, Form, notification, Button, Select, InputNumber, Input, Popconfirm, Spin} from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import {connect} from 'dva';
import {Bind} from 'lodash-decorators';
import {getCurrentOrganizationId, getEditTableData} from 'utils/utils';
import EditTable from 'components/EditTable';
import ExpandCreateDrawer from './CreateDeliveryDrawer';

const {Option} = Select;

@connect(({iqcInspectionPlatform, loading}) => ({
  iqcInspectionPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryInspectShowData'],
}))
@Form.create({fieldNameProp: null})
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      expandCreateDrawer: false, // 弹出创建层
      selectedRows: [], // 选中的数据
      loading: false,
    };
  }

  componentDidMount() {
    const {dispatch, iqcInspectionPlatform: {inspectHeadData = {}}} = this.props;
    // 查询加载数据
    dispatch({
      type: 'iqcInspectionPlatform/queryInspectShowData',
      payload: {...inspectHeadData},
    });
  }

  // 关闭窗口调用方法
  @Bind
  expandColseData() {
    // 更改展示状态
    this.setState({
      expandCreateDrawer: false,
    });

    // 数据重新查询
    const {dispatch, iqcInspectionPlatform: {inspectHeadData = {}}} = this.props;
    // 查询加载数据
    dispatch({
      type: 'iqcInspectionPlatform/queryInspectShowData',
      payload: {...inspectHeadData},
    });
  }

  // 打开窗口调用方法
  @Bind
  expandOpenData() {
    // 更改展示状态
    this.setState({
      expandCreateDrawer: true,
    });
  }

  // 数据选中
  @Bind()
  handleChangeSelectRows(selectedRowsKey, selectedRows) {
    this.setState({selectedRows});
  }

  // 新增行
  @Bind()
  addLineData() {
    // 获取行信息
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowData = [],
        inspectHeadData = {},
      },
    } = this.props;
    // 新增一行
    dispatch({
      type: "iqcInspectionPlatform/updateState",
      payload: {
        inspectShowData: [...inspectShowData,
          {
            _status: "create",
            iqcHeaderId: inspectHeadData.iqcHeaderId,
            number: inspectShowData.length>0? inspectShowData[inspectShowData.length-1].number+1:1,
          },
        ],
      },
    });
  }

  // 删除选中数据
  @Bind
  deteleData() {
    const {selectedRows} = this.state;
    // 获取有主键的数据
    const updateData = selectedRows.filter(item => item._status !== "create").map(item => item.iqcLineId);
    // 调用删除接口
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectHeadData = {},
      },
    } = this.props;
    dispatch({
      type: "iqcInspectionPlatform/deleteInspectLineData",
      payload: {
        iqcLineIdList: updateData,
      },
    }).then(res => {
      if (res) {
        notification.success({message: "删除成功"});
        // 删除对应的数据 情况1：删除新增的和更新的
        // 查询加载数据
        dispatch({
          type: 'iqcInspectionPlatform/queryInspectShowData',
          payload: {...inspectHeadData},
        });
      }
    });
  }

  // 保存行信息
  @Bind
  saveData() {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowData = [],
        inspectHeadData= {},
      },
    } = this.props;
    const params = getEditTableData(inspectShowData, ['iqcLineId']);
    if(params.length===0){
      return;
    }

    this.setState({loading: true});
    // 调用保存接口
    dispatch({
      type: "iqcInspectionPlatform/saveInspectLineData",
      payload: {
        saveData: params,
      },
    }).then(res => {
      if (res) {
        notification.success({message: "保存成功"});
        // 查询加载数据
        dispatch({
          type: 'iqcInspectionPlatform/queryInspectShowData',
          payload: {...inspectHeadData},
        });
      }else {
        notification.error({message: res.message});
      }
      this.setState({loading: false});
    });
  }

  // 单位修改
  @Bind
  changeUom = (value, record, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowData = [],
      },
    } = this.props;
    inspectShowData[index].uomId = record.uomId;
    inspectShowData[index].uomCode = record.uomCode;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectShowData,
      },
    });
  };

  // lov 修改时，回填主键
  @Bind()
  changeSampleTypeCode= (value, record, index) => {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectShowData = [],
        inspectHeadData = {},
      },
    } = this.props;
    inspectShowData[index].sampleTypeId = record.sampleTypeId;
    inspectShowData[index].sampleTypeCode = record.sampleTypeCode;
    dispatch({
      type: "iqcInspectionPlatform/queryInspectLineByLovForData",
      payload: {
        sampleTypeId: record.sampleTypeId,
        iqcHeaderId: inspectHeadData.iqcHeaderId,
      },
    }).then(res=>{
      if(!res){
        inspectShowData[index].acceptanceQuantityLimit = "";
        inspectShowData[index].sampleSize = "";
        inspectShowData[index].ac = "";
        inspectShowData[index].inspectionLevels = "";
        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectShowData,
          },
        });
        notification.error({message: res.message});
      }else{
        inspectShowData[index].acceptanceQuantityLimit = res.aql;
        inspectShowData[index].sampleSize = res.sampleSize;
        inspectShowData[index].ac = res.ac;
        inspectShowData[index].re = res.re;
        inspectShowData[index].inspectionLevels = res.inspectionLevels;
        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectShowData,
          },
        });
      }
    });
  };

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      expandColseData,
      fetchDataLoading,
      iqcInspectionPlatform: {
        inspectShowData = [],
        inspectShowPagination = {},
        typeOptionsMap = [],
        defectLevelMap = [],
        specificalTypeMap = [], // 规格类型
        inspectLevelMap = [], // 检验水平
        inspectToolMap = [], // 抽样类型
      },
    } = this.props;
    const {
      expandCreateDrawer,
      selectedRows,
    } = this.state;
    // 选中的数据
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e=>e.number),
      onChange: this.handleChangeSelectRows,
    };

    // 扩展界面参数
    const expandProps = {
      expandDrawer: expandCreateDrawer,
      expandColseData: this.expandColseData,
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        width: 50,
        render: (val) => Number(val),
      },
      {
        title: '检验项目',
        dataIndex: 'inspection',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspection`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`inspection`).d('检验项目'),
                    }),
                  },
                ],
                initialValue: record.inspection,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '检验项类别',
        dataIndex: 'inspectionType',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspectionType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`inspectionType`).d('检验项类别'),
                    }),
                  },
                ],
                initialValue: val,
              })(
                <Select style={{width: '100%'}}>
                  {typeOptionsMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (typeOptionsMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '检验项描述',
        dataIndex: `inspectionDesc`,
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspectionDesc`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`inspectionDesc`).d('检验项目'),
                    }),
                  },
                ],
                initialValue: record.inspectionDesc,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '缺陷等级',
        dataIndex: `defectLevels`,
        width: 120,
        render: (val, record) =>
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
                <Select style={{width: '100%'}}>
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
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardFrom`, {
                initialValue: record.standardFrom,
              })(
                <InputNumber
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
        title: '规格值至',
        width: 120,
        dataIndex: 'standardTo',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardTo`, {
                initialValue: record.standardTo,
              })(
                <InputNumber
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
        title: '规格单位',
        width: 120,
        dataIndex: 'uomCode',
        align: 'center',
        render: (val, record, index ) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`uomCode`, {
                initialValue: record.uomCode,
              })(
                <Lov
                  textValue={record.uomCode}
                  queryParams={{tenantId: getCurrentOrganizationId()}}
                  onChange={(value, records) => this.changeUom(value, records, index)}
                  code="MT.UOM"
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '规格类型',
        width: 120,
        dataIndex: 'standardType',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`standardType`).d('规格类型'),
                    }),
                  },
                ],
                initialValue: val,
              })(
                <Select style={{width: '100%'}}>
                  {specificalTypeMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (specificalTypeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '文本规格值',
        width: 120,
        dataIndex: 'standardText',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardText`, {
                initialValue: record.standardText,
              })(
                <Input />
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
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspectionLevels`, {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`inspectionLevels`).d('检验水平'),
                //     }),
                //   },
                // ],
                initialValue: val,
              })(
                <Select style={{width: '100%'}}>
                  {inspectLevelMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (inspectLevelMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },

      {
        title: '检验工具',
        width: 120,
        dataIndex: 'inspectionTool',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspectionTool`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`inspectionTool`).d('检验工具'),
                    }),
                  },
                ],
                initialValue: val,
              })(
                <Select style={{width: '100%'}}>
                  {inspectToolMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (inspectToolMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '抽样类型',
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
        width: 120,
        dataIndex: 'sampleSize',
        // align: 'center',
        // render: (val, record) =>
        //   ['create', 'update'].includes(record._status) ? (
        //     <Form.Item>
        //       {record.$form.getFieldDecorator(`sampleSize`, {
        //         rules: [
        //           {
        //             required: true,
        //             message: intl.get('hzero.common.validation.notNull', {
        //               name: intl.get(`sampleSize`).d('抽样数量'),
        //             }),
        //           },
        //         ],
        //         initialValue: record.sampleSize,
        //       })(
        //         <InputNumber
        //           min={0}
        //           style={{width: '100%'}}
        //         />
        //       )}
        //     </Form.Item>
        //   ) : (
        //     val
        //   ),
      },
      {
        title: 'AQL值',
        width: 120,
        dataIndex: 'acceptanceQuantityLimit',
        align: 'center',
        // render: (val, record) =>
        //   ['create', 'update'].includes(record._status) ? (
        //     <Form.Item>
        //       {record.$form.getFieldDecorator(`acceptanceQuantityLimit`, {
        //         rules: [
        //           {
        //             required: true,
        //             message: intl.get('hzero.common.validation.notNull', {
        //               name: intl.get(`acceptanceQuantityLimit`).d('AQL值'),
        //             }),
        //           },
        //         ],
        //         initialValue: val,
        //       })(
        //         <Select style={{width: '100%'}}>
        //           {aqlMap.map(ele => (
        //             <Option value={ele.value}>{ele.meaning}</Option>
        //           ))}
        //         </Select>
        //       )}
        //     </Form.Item>
        //   ) : (
        //     val
        //   ),
      },
      {
        title: 'AC',
        width: 80,
        dataIndex: 'ac',
        align: 'center',
        // render: (val, record) =>
        //   ['create', 'update'].includes(record._status) ? (
        //     <Form.Item>
        //       {record.$form.getFieldDecorator(`ac`, {
        //         rules: [
        //           {
        //             required: true,
        //             message: intl.get('hzero.common.validation.notNull', {
        //               name: intl.get(`ac`).d('AC'),
        //             }),
        //           },
        //         ],
        //         initialValue: record.ac,
        //       })(
        //         <InputNumber
        //           min={0}
        //           style={{width: '100%'}}
        //         />
        //       )}
        //     </Form.Item>
        //   ) : (
        //     val
        //   ),
      },
      {
        title: 'RE',
        width: 80,
        dataIndex: 're',
        align: 'center',
        // render: (val, record) =>
        //   ['create', 'update'].includes(record._status) ? (
        //     <Form.Item>
        //       {record.$form.getFieldDecorator(`re`, {
        //         rules: [
        //           {
        //             required: true,
        //             message: intl.get('hzero.common.validation.notNull', {
        //               name: intl.get(`re`).d('RE'),
        //             }),
        //           },
        //         ],
        //         initialValue: record.re,
        //       })(
        //         <InputNumber
        //           min={0}
        //           style={{width: '100%'}}
        //         />
        //       )}
        //     </Form.Item>
        //   ) : (
        //     val
        //   ),
      },
    ];
    return (
      <Modal
        confirmLoading={false}
        width={1600}
        onCancel={expandColseData}
        visible={expandDrawer}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        title="质检项新增"
        footer={null}
      >
        <Spin spinning={this.state.loading}>
          <Button type="primary" onClick={this.expandOpenData} style={{marginLeft: '15px'}}>
            {intl.get('hzero.purchase.button.newInspect').d('新增质检项')}
          </Button>
          <Button type="primary" onClick={this.addLineData} style={{marginLeft: '15px'}}>
            {intl.get('hzero.purchase.button.addByHand').d('手工新增')}
          </Button>
          <Button type="primary" onClick={this.saveData} style={{marginLeft: '15px'}}>
            {intl.get('hzero.purchase.button.save').d('保存')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button
              icon="delete"
              disabled={selectedRows.length === 0}
              style={{marginLeft: '15px'}}
            >
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
        ) : (
          <Popconfirm
            title={intl
              .get(`confirm.delete`, {
                count: selectedRows.length,
              })
              .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
            onConfirm={this.deteleData}
          >
            <Button
              icon="delete"
              disabled={selectedRows.length === 0}
              style={{marginLeft: '15px'}}
            >
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          </Popconfirm>
        )}
          <Button type="primary" onClick={expandColseData} style={{marginLeft: '15px'}}>
            {intl.get('hzero.purchase.button.back').d('返回')}
          </Button>
          <br />
          <br />
          <EditTable
            rowKey="number"
            loading={fetchDataLoading}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={inspectShowData}
            pagination={inspectShowPagination}
            footer={null}
            bordered
          />
          {expandCreateDrawer && <ExpandCreateDrawer {...expandProps} />}
        </Spin>
      </Modal>
    );
  }
}
