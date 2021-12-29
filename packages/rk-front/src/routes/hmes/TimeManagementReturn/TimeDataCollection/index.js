/*
 * @Description: 时效管理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-22 14:24:05
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Button, Form, Input, InputNumber, Select } from 'hzero-ui';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import qs from 'querystring';
import { getEditTableData, filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';

@connect(({ timeManagementReturn, loading }) => ({
  timeManagementReturn,
  tenantId: getCurrentOrganizationId(),
  fetchDataCollectionLoading: loading.effects['timeManagementReturn/fetchDataCollection'],
  saveDataCollectionLoading: loading.effects['timeManagementReturn/saveDataCollection'],
}))
export default class TimeManagement extends Component {
  constructor(props) {
    super(props);
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    this.state = {
      routerParamState: routerParam,
      editStatus: false,
    };
  }

  componentDidMount() {
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    const { dispatch } = this.props;
    // this.formDom.resetFields();
    this.setState({ routerParamState: routerParam });
    if (routerParam.code) {
      this.setState(
        {
          routerParamState: routerParam,
        },
        () => this.fetchDefaultData(routerParam.operationId)
      );
    } else {
      dispatch({
        type: 'timeManagementReturn/fetchDefaultData',
        payload: {
          operationId: routerParam.operationId,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const routerParam = qs.parse(nextProps.history.location.search.substr(1));
    const { routerParamState } = this.state;
    this.setState({ routerParamState: routerParam });
    if (routerParam.code) {
      if (routerParam.code !== routerParamState.code) {
        this.formDom.resetFields();
        this.setState(
          {
            routerParamState: routerParam,
            editStatus: false,
          },
          () => this.fetchDefaultData(routerParam.operationId)
        );
      }
    }
  }

  @Bind()
  fetchDefaultData(val) {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeManagementReturn/fetchDefaultData',
      payload: {
        operationId: val,
      },
    }).then(res => {
      if (res) {
        this.fetchDataCollection();
      }
    });
  }



  // 查询数据采集
  @Bind
  fetchDataCollection(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    const tagIdList = fieldsValue.tagId ? fieldsValue.tagId.split(",") : [];
    dispatch({
      type: 'timeManagementReturn/updateState',
      payload: {
        dataCollection: [],
        dataCollectionPagination: {},
      },
    });
    const { routerParamState } = this.state;
    dispatch({
      type: 'timeManagementReturn/fetchDataCollection',
      payload: {
        ...fieldsValue,
        tagIdList,
        workcellId: routerParamState.workcellId,
        operationId: routerParamState.operationId,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState({ editStatus: false });
      }
    });
  }

  // 保存数据采集项
  @Bind
  saveDataCollection() {
    const {
      dispatch,
      timeManagementReturn: { dataCollection = [], dataCollectionPagination = {} },
    } = this.props;
    const params = getEditTableData(dataCollection);
    if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'timeManagementReturn/saveDataCollection',
        payload: params,
      }).then(res => {
        if (res) {
          this.setState({ editStatus: false });
          notification.success();
          this.fetchDataCollection(dataCollectionPagination);
        }
      });
    }
  }

  // 编辑
  @Bind
  handleEdit() {
    const {
      dispatch,
      timeManagementReturn: { dataCollection = [] },
    } = this.props;
    const arr = [];
    let indexs = 0;
    dataCollection.forEach((ele) => {
      if (ele.valueType !== 'DECISION_VALUE') {
        indexs += 1;
        arr.push({
          index: indexs,
          ...ele,
          _status: 'update',
        });
      } else {
        arr.push({
          ...ele,
          _status: 'update',
        });
      }
    });
    this.setState({ editStatus: true });
    dispatch({
      type: 'timeManagementReturn/updateState',
      payload: {
        dataCollection: arr,
      },
    });
  }

  @Bind()
  onEnterDown(e, record, index) {
    if (e.keyCode === 13) {
      const barcode = document.getElementById(`${index + 1}`);
      if (barcode) {
        barcode.focus();
      } else {
        const barcodeNow = document.getElementById(`${index}`);
        barcodeNow.focus();
      }
    }
  }

  @Bind
  renderResult(record, index) {
    // 数值型
    if (record.valueType === 'VALUE') {
      return <InputNumber style={{ width: '100%' }} onKeyDown={e => this.onEnterDown(e, record, index)} id={`${index}`} />;
    }
    // 判定型
    if (record.valueType === 'DECISION_VALUE') {
      return (
        <Select style={{ width: '100%' }}>
          <Select.Option value='OK' key='OK'>
            OK
          </Select.Option>
          <Select.Option value='NG' key='NG'>
            NG
          </Select.Option>
        </Select>
      );
    }
    // 文本型
    if (record.valueType === 'TEXT') {
      return <Input onKeyDown={e => this.onEnterDown(e, record, index)} id={`${index}`} />;
    }
  }

  // 清空缓存
  @Bind()
  resetFieldsProps() {
    const { routerParamState } = this.state;
    this.setState({
      routerParamState: ({ ...routerParamState, code: '' }),
    });
  }


  render() {
    const {
      timeManagementReturn: {
        dataCollectionPagination = {},
        dataCollection = [],
        deviceInfo = {},
        defaultTagCode = '',
        defaultTagId = [],
      },
      fetchDataCollectionLoading,
      saveDataCollectionLoading,
      tenantId,
    } = this.props;
    const { editStatus, routerParamState } = this.state;
    const filterFormProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      routerParamState,
      deviceInfo,
      defaultTagCode,
      defaultTagId,
      onSearch: this.fetchDataCollection,
      resetFieldsProps: this.resetFieldsProps,
    };
    const columns = [
      {
        title: '器件编码',
        dataIndex: 'materialLotCode',
        width: 120,
        render: (val, record, index) => {
          const productionList = dataCollection.map(e => e.materialLotId);
          const first = productionList.indexOf(record.materialLotId);
          const all = dataCollection.filter(e => e.materialLotId === record.materialLotId).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '容器编码',
        dataIndex: 'containerCode',
        width: 120,
        render: (val, record, index) => {
          const productionList = dataCollection.map(e => e.materialLotId);
          const first = productionList.indexOf(record.materialLotId);
          const all = dataCollection.filter(e => e.materialLotId === record.materialLotId).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '是否时效达标',
        dataIndex: 'timeStandardFlag',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataCollection.map(e => e.materialLotId);
          const first = productionList.indexOf(record.materialLotId);
          const all = dataCollection.filter(e => e.materialLotId === record.materialLotId).length;
          const obj = {
            children: val === 'Y' ? '是' : '否',
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '是否完成采集',
        dataIndex: 'hasResult',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataCollection.map(e => e.materialLotId);
          const first = productionList.indexOf(record.materialLotId);
          const all = dataCollection.filter(e => e.materialLotId === record.materialLotId).length;
          const obj = {
            children: val === 'Y' ? '是' : '否',
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '序号',
        dataIndex: 'orderNumber',
        width: 70,
        align: 'center',
      },
      {
        title: '检验项目',
        dataIndex: 'tagDescription',
        width: 90,
      },
      {
        title: '下限',
        dataIndex: 'minimumValue',
        width: 70,
        align: 'center',
      },
      {
        title: '标准',
        dataIndex: 'standardValue',
        width: 70,
        align: 'center',
      },
      {
        title: '上限',
        dataIndex: 'maximalValue',
        width: 70,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 70,
        align: 'center',
      },
      {
        title: '允许空值',
        dataIndex: 'valueAllowMissing',
        width: 90,
        align: 'center',
        render: (val) => {
          if (val === 'Y') {
            return '是';
          } else {
            return '否';
          }
        },
      },
      {
        title: '检验结果',
        dataIndex: 'result',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`result`, {
                initialValue: record.result,
              })(
                this.renderResult(record, record.index)
              )}
            </Form.Item>
          ) : (
              val
            ),
        onCell: record => {
          if (!editStatus) {
            if (record.valueType === 'TEXT' && record.result) {
              return {
                style: {
                  backgroundColor: '#019f99',
                },
              };
            }
            if (record.valueType === 'DECISION_VALUE' && record.result) {
              if (record.result === 'OK') {
                return {
                  style: {
                    backgroundColor: '#019f99',
                  },
                };
              } else {
                return {
                  style: {
                    backgroundColor: '#d84949',
                  },
                };
              }
            }
            if (record.valueType === 'VALUE' && record.result) {
              if (parseFloat(record.result, 6) <= parseFloat(record.maximalValue ? record.maximalValue : 0, 6) && parseFloat(record.result, 6) >= parseFloat(record.minimumValue ? record.minimumValue : 0, 6)) {
                return {
                  style: {
                    backgroundColor: '#019f99',
                  },
                };
              } else if (!record.maximalValue && !record.minimumValue && record.result) {
                return {
                  style: {
                    backgroundColor: '#019f99',
                  },
                };
              } else {
                return {
                  style: {
                    backgroundColor: '#d84949',
                  },
                };
              }
            }
          }
        },
      },
    ];
    return (
      <Fragment>
        <Header title="返修时效工序作业平台-数据采集">
          {!editStatus ? (
            <Button
              type="primary"
              icon="edit"
              onClick={() => this.handleEdit()}
            >
              编辑
            </Button>
          ) : (
            <Button
              type="primary"
              icon="save"
              loading={saveDataCollectionLoading}
              onClick={() => this.saveDataCollection()}
            >
              保存
            </Button>
            )
          }
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <EditTable
            rowKey="materialLotId"
            loading={fetchDataCollectionLoading}
            columns={columns}
            dataSource={dataCollection}
            pagination={dataCollectionPagination}
            onChange={page => this.fetchDataCollection(page)}
            bordered
          />
        </Content>
      </Fragment>
    );
  }
}
