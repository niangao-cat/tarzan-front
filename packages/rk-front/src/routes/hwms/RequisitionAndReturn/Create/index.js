/*
 * @Description: 新建领退料单
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-09 10:38:58
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Button, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import uuid from 'uuid/v4';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import { getSiteId } from '@/utils/utils';
import DisplayForm from './DisplayForm';
import ListTable from './ListTable';

@connect(({ requisitionAndReturn, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  requisitionAndReturn,
  loading: {
    fetchLineLoading: loading.effects['requisitionAndReturn/queryCreateLineList'],
  },
}))
class Create extends Component {
  form;

  constructor(props) {
    super(props);
    const { instructionDocId } = this.props.match.params;
    this.state = {
      isNew: true,
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
      toStorageCode: '',
      toStorageId: '',
      toLocatorCode: '',
      toLocatorId: '',
      butEnable: false,
      allSiteId: '', // 兄弟组件siteId
      instructionDocId,
      spinLoading: false,
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'requisitionAndReturn/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'requisitionAndReturn/querySiteList',
    });
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        returnList: {},
      },
    });
    this.queryStorageList();
    // 获取明细数据
    if (this.state.instructionDocId) {
      this.fetchHeadAndLineDetail(this.state.instructionDocId);
    }
  }

  // 头行数据查询
  @Bind()
  fetchHeadAndLineDetail(value) {
    const {
      dispatch,
    } = this.props;
    this.setState({ spinLoading: true });
    dispatch({
      type: 'requisitionAndReturn/fetchHeadAndLineDetail',
      payload: {
        instructionDocId: value,
      },
    }).then(() => {
      this.setState({ spinLoading: false });
    });
  }

  /**
   * 保存领退料单
   */
  @Bind()
  handleSaveData() {
    const {
      requisitionAndReturn: { list = [], headAndLine = {} },
      dispatch,
      tenantId,
    } = this.props;
    this.setState({ spinLoading: true });
    const arr = list.filter(item => {
      return item.create === 'CT';
    });
    // 判断是否有行数据
    if (arr.length > 0) {
      const params = getEditTableData(list, ['instructionId']);
      // 判断行数据是否有必输项未输入
      if (Array.isArray(params) && params.length > 0) {
        this.form.validateFields((err, fieldsValue) => {
          if (!err) {
            // const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
            dispatch({
              type: 'requisitionAndReturn/saveData',
              payload: {
                tenantId,
                ...headAndLine.headVO,
                ...fieldsValue,
                lineAddDtoS: params,
              },
            }).then(res => {
              this.setState({ spinLoading: false });
              if (res) {
                notification.success();
                this.setState({
                  isNew: false,
                  butEnable: true,
                  instructionDocId: res.mtInstructionDoc.instructionDocId,
                }, () => this.fetchHeadAndLineDetail(res.mtInstructionDoc.instructionDocId));
              }
            });
          }else{
            this.setState({ spinLoading: false });
          }
        });
      } else {
        this.setState({ spinLoading: false });
      }
    } else {
      this.setState({ spinLoading: false });
      notification.error({ message: '未新增单据行，不可保存！' });
    }
  }

  /**
   * 删除行：仅删除未保存的行
   */
  @Bind()
  handleDelete(current = {}) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const newList = list.filter(item => item.instructionId !== current.instructionId);
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 批量删除行：仅删除未保存的行
   */
  @Bind()
  handleBatchDelete() {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const newList = list.filter(item => item._status !== 'create');
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      requisitionAndReturn: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.instructionLineNum === current.instructionLineNum
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: newList,
      },
    });
  }

  /**
   * 新增行
   */
  @Bind()
  handleAdd() {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    // const params = getEditTableData(list);
    const newItem = {
      instructionId: uuid(),
      instructionLineNum: list.length > 0 ? Number(list[list.length - 1].instructionLineNum) + 10 : 10,
      materialId: null,
      materialName: '',
      demandQuantity: '',
      uomId: '',
      uomCode: '',
      remark: '',
      quantity: null,
      toStorageCode: this.state.toStorageCode,
      toStorageId: this.state.toStorageId,
      toLocatorCode: this.state.toLocatorCode,
      toLocatorId: this.state.toLocatorId,
      create: 'CT', // 标示该数据为新增
      instructionStatus: 'NEW',
      excessSetting: 'N',
      _status: 'create',
    };
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: [...list, newItem],
      },
    });
  }

  // 改变值
  @Bind()
  changeExesetting(value, index) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;

    list[index].excessSetting = value;

    if (value === "N") {
      list[index].excessValue = 0;
    }
    if (value === "M") {
      list[index].excessValue = 1;
    }
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: [...list],
      },
    });
  }

  /**
   *  查询行列表
   * @param {object} 查询参数
   */
  @Bind()
  handleLineSearch(fields = {}) {
    const {
      dispatch,
      requisitionAndReturn: { headDetail },
    } = this.props;
    const { instructionDocId } = headDetail;
    dispatch({
      type: 'requisitionAndReturn/queryCreateLineList',
      payload: {
        instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 头数据选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows, selectedLineRows: [], selectedLineRowKeys: [] });
  }

  // 获取仓库下拉
  @Bind()
  queryStorageList(param) {
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/queryStorageList',
      payload: {
        siteId: param || getSiteId(),
      },
    });
  }

  // 货位下拉表
  @Bind()
  queryLocatorList(param) {
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/queryLocatorList',
      payload: {
        locatorId: param,
      },
    });
  }

  onRef = ref => {
    this.child = ref;
  };

  // 选中的仓库
  @Bind()
  saveStorageId(value) {
    this.setState(
      {
        toStorageCode: value.locatorCode,
        toStorageId: value.locatorId,
      },
      () => this.updateStorageId(value)
    );
  }

  // 更新仓库ID
  @Bind()
  async updateStorageId(value) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const tableList = [];

    let showQuantityFlag = false;
    list.forEach((item, index) => {
      // 判断是否为新增，且 物料和仓库有数据时， 显示库存
      if (item.materialId !== '' && item.materialId !== null && item.materialId !== undefined && item._status === 'create' && value.locatorId !== '' && value.locatorId !== null && value.locatorId !== undefined) {
        showQuantityFlag = true;
      }
      tableList.push({
        ...item,
        index,
        toStorageCode: item._status === 'create' ? value.locatorCode : item.toStorageCode,
        toStorageId: item._status === 'create' ? value.locatorId : item.toStorageId,
        toLocatorCode: item._status === 'create' ? '' : item.toStorageCode,
        toLocatorId: item._status === 'create' ? '' : item.toStorageId,
      });
    });

    // 判断 是否有需要调用接口获取对应的现有量  有则 调用
    if (showQuantityFlag) {
      dispatch({
        type: 'requisitionAndReturn/showQuantity',
        payload: tableList,
      }).then(res => {
        if (res) {
          res.forEach((item => {
            tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
          }));
          dispatch({
            type: 'requisitionAndReturn/updateState',
            payload: {
              list: [...tableList],
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'requisitionAndReturn/updateState',
        payload: {
          list: [...tableList],
        },
      });
    }
  }

  // 更新仓库ID
  @Bind()
  clearLocatorVAlue(records, index) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const tableList = list;
    tableList[index].toStorageId = records.locatorId;
    tableList[index].toStorageCode = records.locatorCode;
    tableList[index].toLocatorId = '';
    tableList[index].toLocatorCode = '';

    // 判断物料和仓库是否有数据 有则查询 无则报错
    if (tableList[index].materialId !== '' && tableList[index].materialId !== null && tableList[index].materialId !== undefined && records.locatorId !== '' && records.locatorId !== null && records.locatorId !== undefined) {
      dispatch({
        type: 'requisitionAndReturn/showQuantity',
        payload: [{
          index,
          materialId: tableList[index].materialId,
          toStorageId: records.locatorId,
          toLocatorId: tableList[index].toLocatorId,
        }],
      }).then(res => {
        if (res) {
          res.forEach((item => {
            tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
          }));
          dispatch({
            type: 'requisitionAndReturn/updateState',
            payload: {
              list: [...tableList],
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'requisitionAndReturn/updateState',
        payload: {
          list: [...tableList],
        },
      });
    }

    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: [...tableList],
      },
    });
  }

  // 更新物料
  @Bind()
  updateMaterial(records, index) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const tableList = list;
    tableList[index].materialId = records.materialId;
    // 判断物料和仓库是否有数据 有则查询 无则报错
    if (records.materialId !== '' && records.materialId !== null && records.materialId !== undefined && tableList[index].toStorageId !== '' && tableList[index].toStorageId !== null && tableList[index].toStorageId !== undefined) {
      dispatch({
        type: 'requisitionAndReturn/showQuantity',
        payload: [{
          index,
          materialId: records.materialId,
          toStorageId: tableList[index].toStorageId,
          toLocatorId: tableList[index].toLocatorId,
        }],
      }).then(res => {
        if (res) {
          res.forEach((item => {
            tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
          }));
          dispatch({
            type: 'requisitionAndReturn/updateState',
            payload: {
              list: [...tableList],
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'requisitionAndReturn/updateState',
        payload: {
          list: [...tableList],
        },
      });
    }
  }

  // 更新货位
  @Bind()
  updateLocator(records, index) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const tableList = list;
    tableList[index].toLocatorId = records.toLocatorId;

    // 判断物料和仓库是否有数据 有则查询 无则报错
    if (tableList[index].toStorageId !== '' && tableList[index].toStorageId !== null && tableList[index].toStorageId !== undefined && tableList[index].materialId !== '' && tableList[index].materialId !== null && tableList[index].materialId !== undefined) {
      dispatch({
        type: 'requisitionAndReturn/showQuantity',
        payload: [{
          index,
          materialId: tableList[index].materialId,
          toStorageId: tableList[index].toStorageId,
          toLocatorId: records.locatorId,
        }],
      }).then(res => {
        if (res) {
          res.forEach((item => {
            tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
          }));
          dispatch({
            type: 'requisitionAndReturn/updateState',
            payload: {
              list: [...tableList],
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'requisitionAndReturn/updateState',
        payload: {
          list: [...tableList],
        },
      });
    }
  }

  // 选中的货位
  @Bind()
  saveLocatorId(value) {
    this.setState(
      {
        toLocatorCode: value.locatorCode,
        toLocatorId: value.locatorId,
      },
      () => this.updateLocatorId(value)
    );
  }

  // 更新货位ID
  @Bind()
  updateLocatorId(value) {
    const {
      requisitionAndReturn: { list = [] },
      dispatch,
    } = this.props;
    const tableList = [];
    let showQuantityFlag = false;
    list.forEach((item, index) => {
      // 判断是否为新增，且 物料和仓库有数据时， 显示库存
      if (item.materialId !== '' && item.materialId !== null && item.materialId !== undefined && item._status === 'create' && value.locatorId !== '' && value.locatorId !== null && value.locatorId !== undefined) {
        showQuantityFlag = true;
      }
      tableList.push({
        ...item,
        index,
        toLocatorCode: item._status === 'create' && item.toStorageId === this.form.getFieldValue('toStorageId') ? (value.locatorCode ? value.locatorCode : '') : item.toLocatorCode,
        toLocatorId: item._status === 'create' && item.toStorageId === this.form.getFieldValue('toStorageId') ? (value.locatorId ? value.locatorId : '') : item.toLocatorId,
      });
    });

    // 判断 是否有需要调用接口获取对应的现有量  有则 调用
    if (showQuantityFlag) {
      dispatch({
        type: 'requisitionAndReturn/showQuantity',
        payload: tableList,
      }).then(res => {
        if (res) {
          res.forEach((item => {
            tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
          }));
          dispatch({
            type: 'requisitionAndReturn/updateState',
            payload: {
              list: [...tableList],
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'requisitionAndReturn/updateState',
        payload: {
          list: [...tableList],
        },
      });
    }
  }

  @Bind()
  handleSiteIdChange(value) {
    this.setState({ allSiteId: value });
  }

  // 删除行数据
  @Bind()
  onDeleteLine(record) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'requisitionAndReturn/onDeleteLine',
      payload: {
        instructionId: record.instructionId,
      },
    }).then(res => {
      if (res) {
        notification.success({ message: '操作成功！' });
        this.fetchHeadAndLineDetail(this.state.instructionDocId);
      }
    });
  }

  // 条码打印
  @Bind()
  printBarCode(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/printBarCode',
      payload: {
        ...record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleHeadSearch();
      }
    });
  }

  render() {
    const {
      requisitionAndReturn: {
        list = [],
        pagination = {},
        returnQcFlagMap = [],
        docTypeMap = [],
        accountsType = [],
        siteMap = [],
        headDetail = {},
        version = [],
        storageList = [],
        locatorList = [],
        status = [],
        executeMap = [],
        returnList = {},
        headAndLine = {},
        orderTypes = [],
        freeTypeOne = [],
        freeTypeTwo = [],
        costcenterType = [],
      },
      loading,
      tenantId,
    } = this.props;
    const { fetchLineLoading } = loading;
    const { isNew, selectedRowKeys } = this.state;
    const formProps = {
      tenantId,
      isNew,
      docTypeMap,
      returnQcFlagMap,
      siteMap,
      accountsType,
      headDetail,
      orderTypes,
      onRef: this.handleBindRef,
      storageList,
      locatorList,
      headAndLine,
      freeTypeOne,
      freeTypeTwo,
      costcenterType,
      instructionDocId: this.state.instructionDocId,
      queryStorageList: this.queryStorageList,
      queryLocatorList: this.queryLocatorList,
      saveStorageId: this.saveStorageId,
      saveLocatorId: this.saveLocatorId,
      handleSiteIdChange: this.handleSiteIdChange,
      returnList,
    };
    const listProps = {
      pagination,
      headDetail,
      tenantId,
      loading: fetchLineLoading,
      version,
      dataSource: list,
      onSearch: this.handleHeadSearch,
      headAndLine,
      status,
      executeMap,
      allSiteId: this.state.allSiteId,
      selectedRowKeys,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleDelete,
      onSelectRow: this.handleSelectRow,
      queryStorageList: this.queryStorageList,
      queryLocatorList: this.queryLocatorList,
      onDeleteLine: this.onDeleteLine,
      printBarCode: this.printBarCode,
      changeExesetting: this.changeExesetting,
      clearLocatorVAlue: this.clearLocatorVAlue,
      updateMaterial: this.updateMaterial,
      updateLocator: this.updateLocator,
    };
    return (
      <React.Fragment>
        <Header
          title={intl
            .get('hwms.requisitionAndReturn.view.message.createTitle')
            .d('成本中心/内部订单领退料创建')}
          backPath="/hwms/requisition-return/query"
        >
          <Button
            type="primary"
            onClick={this.handleSaveData}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={this.handleAdd}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={this.state.spinLoading}>
            <DisplayForm {...formProps} />
            <ListTable {...listProps} onRef={this.onRef} />
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}

export default Create;
