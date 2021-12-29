/*
 * @Description: inspectionPlan
 * @version: 0.1.0
 * @Author: wenjie.yang@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-02-08 15:54:02
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Button, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableRow from './ListTableRow';
import InspectionGroupSynchDrawer from './Component/InspectionGroupSynchDrawer';
import CreateDrawer from './Component/CreateDrawer';
import CopyDrawer from './Component/CopyDrawer';

@connect(({ inspectionPlan, loading }) => ({
  inspectionPlan,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['inspectionPlan/fetchHeadList'],
  fetchLineLoading: loading.effects['inspectionPlan/fetchLineList'],
  copyLoading: loading.effects['inspectionPlan/copy'],
}))
export default class inspectionPlan extends Component {
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
    const { dispatch, tenantId, inspectionPlan: { selectedHeadCache = [] } } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'inspectionPlan/batchLovData',
      payload: {
        tenantId,
      },
    });
    // 查询组织
    dispatch({
      type: 'inspectionPlan/fetchSite',
      payload: {
        tenantId,
      },
    });
    // 加载信息
    if (selectedHeadCache.length > 0) {
      this.setState({ selectedHead: selectedHeadCache, selectedHeadKeys: [selectedHeadCache[0].inspectionSchemeId] }, () => {
        this.handleSearchLine();
      });
      dispatch({
        type: 'inspectionPlan/updateState',
        payload: {
          headList: selectedHeadCache,
          headListPagination: {},
        },
      });
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
      type: 'inspectionPlan/fetchHeadList',
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
      type: 'inspectionPlan/fetchLineList',
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
      type: 'inspectionPlan/handleSaveMaterPlan',
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
          type: 'inspectionPlan/updateState',
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
    if (selectedHead.length === 0) {
      return notification.error({ message: "请选择要发布的信息！" });
    }
    dispatch({
      type: 'inspectionPlan/pushMaterPlan',
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
          type: 'inspectionPlan/updateState',
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
        type: 'inspectionPlan/updateState',
        payload: {
          selectedHeadCache: selectedHead,
        },
      });
      this.props.history.push(
        `/hqms/inspection-plan/qualityInspection/${selectedHead[0].inspectionSchemeId}`
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
        type: 'inspectionPlan/deleteHead',
        payload: {
          selectedHead,
        },
      }).then(res => {
        if (res) {
          this.setState({ selectedHeadKeys: [], selectedHead: [] });
          notification.success({ message: '操作成功！' });
          this.fetchHeadList();
          dispatch({
            type: 'inspectionPlan/updateState',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'inspectionPlan/updateState',
      payload: {
        lineList: [],
      },
    });
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
  handleSelectRow(selectedRowKeys) {
    this.setState({ selectedRowKeys });
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
      type: 'inspectionPlan/copy',
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
      inspectionPlan: {
        testTypeLov = [],
        headList = [],
        headListPagination = {},
        lineList = [],
        lineListPagination = {},
        materialVersionLov = [],
        siteList = [],
        statusLov = [],
        siteInfo = {},
      },
      tenantId,
      fetchHeadLoading,
      fetchLineLoading,
      copyLoading,
    } = this.props;
    const { selectedHead } = this.state;
    // 查询
    const filterFormProps = {
      onSearch: this.handleSearch,
      testTypeLov,
      siteList,
      selectedHead,
      tenantId,
      copyLoading,
      createHeadDataDrawer: this.createHeadDataDrawer,
      pushMaterPlan: this.pushMaterPlan,
      deleteHead: this.deleteHead,
      onOpenModal: this.handleOpenCopyModal,
    };
    const copyDrawerProps = {
      visible: this.state.copyvisible,
      tenantId,
      testTypeLov,
      siteList,
      selectedHead,
      loading: copyLoading,
      onCancel: this.handleCloseCopyModal,
      onConfirm: this.handleCopy,
    };
    return (
      <Fragment>
        <Header title="巡检检验计划" />
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
            />
          )}
          {this.state.createVisible && (
            <CreateDrawer
              onOk={this.handleSaveMaterPlan}
              testTypeLov={testTypeLov}
              materialVersionLov={materialVersionLov}
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
