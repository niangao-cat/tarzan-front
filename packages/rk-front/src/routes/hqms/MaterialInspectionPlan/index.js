/*
 * @Description: 物料检验计划
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-02-08 17:30:44
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Button, notification, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableRow from './ListTableRow';
import InspectionGroupSynchDrawer from './Component/InspectionGroupSynchDrawer';
import CreateDrawer from './Component/CreateDrawer';
import CopyDrawer from './Component/CopyDrawer';

@connect(({ materialInspectionPlan, loading }) => ({
  materialInspectionPlan,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['materialInspectionPlan/fetchHeadList'],
  fetchLineLoading: loading.effects['materialInspectionPlan/fetchLineList'],
  pushMaterPlanLoading: loading.effects['materialInspectionPlan/pushMaterPlan'],
  deleteHeadLoading: loading.effects['materialInspectionPlan/deleteHead'],
  copyLoading: loading.effects['materialInspectionPlan/copy'],
}))
export default class MaterialInspectionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      createVisible: false,
      selectedHeadKeys: [],
      selectedHead: [],
      selectedRowKeys: [],
      // eslint-disable-next-line react/no-unused-state
      selectedRow: [],
      headRecord: {}, // 头行数据
      saveHeadLoading: false,
      copyvisible: false,
    };
  }

  filterForm;

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  componentDidMount() {
    const { dispatch, tenantId, materialInspectionPlan: { selectedHeadCache = [], headListPagination } } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'materialInspectionPlan/init',
      payload: {
        tenantId,
      },
    });
    // 查询组织
    dispatch({
      type: 'materialInspectionPlan/fetchSite',
      payload: {
        tenantId,
      },
    });
    if (selectedHeadCache.length > 0) {
      this.setState({ selectedHead: selectedHeadCache, selectedHeadKeys: [selectedHeadCache[0].inspectionSchemeId] }, () => {
        this.handleSearchLine();
      });
      this.fetchHeadList(headListPagination);
    } else {
      this.fetchHeadList();
    }
  }

  // 获取物料检验计划
  @Bind()
  fetchHeadList(params = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    dispatch({
      type: 'materialInspectionPlan/fetchHeadList',
      payload: {
        ...filterValue,
        tenantId,
        page: isEmpty(params) ? {} : params,
      },
    }).then(res => {
      if (res) {
        const { selectedHead } = this.state;
        if (selectedHead.length !== 0) {
          this.handleSearchLine();
        }
      }
    });
  }

  // 选中头数据
  @Bind()
  handleSelectHead(selectedHeadKeys, selectedHead) {
    this.setState({ selectedHeadKeys, selectedHead }, () => {
      this.handleSearchLine();
    });
  }

  // 查询行数据
  @Bind()
  handleSearchLine(params = {}) {
    const { dispatch, tenantId } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'materialInspectionPlan/fetchLineList',
      payload: {
        tenantId,
        inspectionSchemeId: selectedHead[0].inspectionSchemeId,
        page: isEmpty(params) ? {} : params,
      },
    });
  }

  // 物料计划头创建
  @Bind()
  handleSaveMaterPlan(fieldsValue) {
    const { dispatch } = this.props;
    const { headRecord } = this.state;
    this.setState({ saveHeadLoading: true });
    dispatch({
      type: 'materialInspectionPlan/handleSaveMaterPlan',
      payload: {
        ...headRecord,
        ...fieldsValue,
      },
    }).then(res => {
      this.setState({ saveHeadLoading: false });
      if (res) {
        this.setState({ createVisible: false });
        this.setState({ selectedHeadKeys: [res.inspectionSchemeId], selectedHead: [{ ...res }], selectedRowKeys: [] });
        notification.success({ message: '操作成功' });
        this.fetchHeadList();
        dispatch({
          type: 'materialInspectionPlan/updateState',
          payload: {
            lineList: [],
          },
        });
      }
    });
  }

  // 发布物料检验计划
  @Bind()
  pushMaterPlan() {
    const { dispatch, tenantId } = this.props;
    const { selectedHead } = this.state;
    if (isEmpty(selectedHead)) {
      notification.error({ message: "请先选择要发布的物料！" });
      return;
    }
    dispatch({
      type: 'materialInspectionPlan/pushMaterPlan',
      payload: {
        tenantId,
        inspectionSchemeIds: [selectedHead[0].inspectionSchemeId],
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedHeadKeys: [], selectedHead: [] });
        this.fetchHeadList();
        notification.success({ message: '操作成功！' });
        dispatch({
          type: 'materialInspectionPlan/updateState',
          payload: {
            lineList: [],
          },
        });
      }
    });
  }

  // 编辑行数据
  @Bind()
  editorLine() {
    const { selectedHead = [] } = this.state;
    const { dispatch } = this.props;
    if (selectedHead.length === 0) {
      notification.error({ message: '请勾选物料头！' });
    } else {
      dispatch({
        type: 'materialInspectionPlan/updateState',
        payload: {
          selectedHeadCache: selectedHead,
        },
      });
      this.props.history.push(
        `/hqms/material-inspection-plan/quality-inspection/${selectedHead[0].inspectionSchemeId}`
      );
    }
  }

  // 删除物料计划头数据
  @Bind()
  deleteHead() {
    const { selectedHead } = this.state;
    const { dispatch } = this.props;
    if (selectedHead.length === 0) {
      notification.error({ message: '请勾选数据' });
    } else {
      dispatch({
        type: 'materialInspectionPlan/deleteHead',
        payload: {
          selectedHead,
        },
      }).then(res => {
        if (res) {
          this.setState({ selectedHeadKeys: [], selectedHead: [] });
          notification.success({ message: '操作成功！' });
          this.fetchHeadList();
          dispatch({
            type: 'materialInspectionPlan/updateState',
            payload: {
              lineList: [],
            },
          });
        }
      });
    }
  }

  // 查询
  @Bind()
  handleSearch() {
    this.setState({ selectedHeadKeys: [], selectedHead: [] });
    this.fetchHeadList({ page: {} });
  }

  // 更多查询
  @Bind()
  handleMoreSearchModal() {
    this.handleGetTicketList({ page: {} });
    this.handleMoreSearch(false);
  }

  // 校验组同步抽屉展开或关闭
  @Bind()
  inspectionGroupSynch(falg) {
    if (this.state.selectedHead.length === 0) {
      notification.error({ message: '请勾物料！' });
    } else {
      this.setState({ visible: falg });
    }
  }

  // 头数据创建抽屉展开或关闭
  @Bind()
  createHeadDataDrawer(record = {}, falg) {
    this.setState({ createVisible: falg, headRecord: record });
  }

  // 选中行数据
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedRowKeys, selectedRow });
  }

  @Bind()
  handleOpenCopyModal() {
    this.setState({ copyvisible: true });
  }

  @Bind()
  handleCloseCopyModal() {
    this.setState({ copyvisible: false });
  }

  @Bind()
  handleCopy(val) {
    const { dispatch } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'materialInspectionPlan/copy',
      payload: {
        ...val,
        selectedHead,
      },
    }).then(res => {
      if (res) {
        this.handleCloseCopyModal();
        notification.success();
      }
    });
  }

  render() {
    const {
      materialInspectionPlan: {
        testTypeLov = [],
        headList = [],
        headListPagination = {},
        lineList = [],
        lineListPagination = {},
        siteList = [],
        statusLov = [],
        siteInfo = {},
      },
      tenantId,
      fetchHeadLoading,
      fetchLineLoading,
      pushMaterPlanLoading,
      deleteHeadLoading,
      copyLoading,
    } = this.props;
    // 查询
    const filterFormProps = {
      onSearch: this.handleSearch,
      testTypeLov,
      siteList,
      createHeadDataDrawer: this.createHeadDataDrawer,
      pushMaterPlan: this.pushMaterPlan,
      deleteHead: this.deleteHead,
    };
    const copyDrawerProps = {
      visible: this.state.copyvisible,
      tenantId,
      testTypeLov,
      siteList,
      selectedHead: this.state.selectedHead,
      loading: copyLoading,
      onCancel: this.handleCloseCopyModal,
      onConfirm: this.handleCopy,
    };
    return (
      <Fragment>
        <Header title="物料检验计划">
          <Button
            type="default"
            onClick={()=>this.handleOpenCopyModal()}
            disabled={this.state.selectedHead.length === 0}
            loading={copyLoading}
          >
            复制检验计划
          </Button>
          <Button type="primary">模板导出</Button>
          <Button type="primary">数据导入</Button>
          <Button type="primary" icon="rocket" onClick={() => this.pushMaterPlan()} loading={pushMaterPlanLoading}>
            发布
          </Button>
          <Popconfirm title="确认删除？" okText="确定" cancelText="取消" onConfirm={() => this.deleteHead()}>
            <Button type="primary" icon='delete' loading={deleteHeadLoading}>删除</Button>
          </Popconfirm>
          <Button type="primary" onClick={() => this.createHeadDataDrawer({}, true)} icon='plus'>
            新建
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <ListTableHead
            onSearch={this.fetchHeadList}
            selectedHeadKeys={this.state.selectedHeadKeys}
            onSelectHead={this.handleSelectHead}
            headList={headList}
            pagination={headListPagination}
            loading={fetchHeadLoading}
            createHeadDataDrawer={this.createHeadDataDrawer}
          />
          <Row>
            <Col>
              <Button
                type="primary"
                style={{ margin: '0px 10px 10px 0px' }}
                onClick={() => this.editorLine()}
              >
                编辑
              </Button>
              <Button
                type="primary"
                style={{ margin: '0px 10px 10px 0px' }}
                onClick={() => this.inspectionGroupSynch(true)}
              >
                检验组同步
              </Button>
              <Button type="primary" style={{ margin: '0px 10px 10px 0px' }}>
                上移
              </Button>
              <Button type="primary" style={{ margin: '0px 10px 10px 0px' }}>
                下移
              </Button>
            </Col>
          </Row>
          <ListTableRow
            loading={fetchLineLoading}
            lineList={lineList}
            pagination={lineListPagination}
            onSelectRow={this.handleSelectRow}
            onSearch={this.handleSearchLine}
            selectedRowKeys={this.state.selectedRowKeys}
            createHeadDataDrawer={this.createHeadDataDrawer}
          />
          {this.state.visible && (
            <InspectionGroupSynchDrawer
              visible={this.state.visible}
              inspectionSchemeId={this.state.selectedHead[0].inspectionSchemeId || null}
              inspectionGroupSynch={this.inspectionGroupSynch}
              handleSearchLine={this.handleSearchLine}
              fetchHeadList={this.fetchHeadList}
              tenantId={tenantId}
            />
          )}
          {this.state.createVisible && (
            <CreateDrawer
              onOk={this.handleSaveMaterPlan}
              testTypeLov={testTypeLov}
              visible={this.state.createVisible}
              onCancel={this.createHeadDataDrawer}
              tenantId={tenantId}
              record={this.state.headRecord}
              saveHeadLoading={this.state.saveHeadLoading}
              siteList={siteList}
              statusLov={statusLov}
              siteInfo={siteInfo}
            />
          )}
          {this.state.copyvisible && <CopyDrawer {...copyDrawerProps} />}
        </Content>
      </Fragment>
    );
  }
}
