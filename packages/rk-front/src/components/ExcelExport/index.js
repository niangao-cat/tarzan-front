import React from 'react';
import { Bind } from 'lodash-decorators';
import { isEmpty, isFunction } from 'lodash';
import { Modal, Tree, Form, Dropdown, Menu, Icon } from 'hzero-ui';

import notification from 'utils/notification';
import intl from "utils/intl";
import { Button } from "components/Permission";
import { getResponse, isTenantRoleLevel, listenDownloadError } from "utils/utils";
import { downloadFile, initiateAsyncExport, queryColumn, queryIdpValue, createAsyncExportTask } from "@/services/api";
import ExportPage from "./ExportPage";
import HistoryData from "./HistoryData"; // 监听导出错误时 postMessage 事件

// requestUrl 原生导出接口
// exportUrl 自定义导出会有动态列
// createTaskUrl 创建异步导出任务
// exportAsyncUrl 导出任务结束后导出

const { TreeNode } = Tree;
listenDownloadError('downloadError', intl.get('hzero.common.notification.export.error').d('导出异常')); // 监听导出错误时 postMessage 事件

listenDownloadError('asyncRequestSuccess', intl.get('hzero.common.notification.export.async').d('异步导出任务已提交'), 'success');

@Form.create({ fieldNameProp: null })
export default class ExcelExport extends React.Component {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
    this.state = {
      modalVisible: false,
      exportList: [],
      exportPending: false,
      fetchColumnLoading: false,
      enableAsync: false,
      // 允许异步
      // 树
      expandedKeys: [],
      // 展开的节点
      checkedKeys: [],
      // 选择的节点
      exportTypeList: [],
      // 导出类型值集
      // 异步数据
      historyModalVisible: false, // 异步数据模态框显示
    };
  }

  // 查询方法
  @Bind
  queryColumnData(config) {
    const { requestUrl, method = "GET", defaultSelectAll, form } = this.props;
    this.setState({
      fetchColumnLoading: true,
    });
    queryColumn({
      requestUrl,
      method,
    }).then((res) => {
      const response = getResponse(res);
      const nextState = {};

      if (response && response.children) {
        const defaultList = [];

        if (defaultSelectAll) {
          const exTreeKey = function exTreeKey(data) {
            if (data) {
              defaultList.push(data.id);

              if (Array.isArray(data.children)) {
                for (let i = 0; i < data.children.length; i++) {
                  exTreeKey(data.children[i]);
                }
              }
            }
          };

          exTreeKey(res);
        } else {
          const travelTree = function travelTree(data) {
            if (data) {
              // 后端返回的是 boolean 值
              if (data.checked) {
                defaultList.push(data.id);
              }

              if (Array.isArray(data.children)) {
                for (let i = 0; i < data.children.length; i++) {
                  travelTree(data.children[i]);
                }
              }
            }
          };

          travelTree(res);
        }

        nextState.exportList = [res];
        nextState.expandedKeys = ["".concat(res.id)];
        nextState.checkedKeys = defaultList;
      }

      if (response) {
        nextState.enableAsync = !!response.enableAsync; // 不为真 就为假
      }

      this.setState(nextState);

      if (!nextState.enableAsync) {
        if (form.getFieldValue('async') === 'true') {
          form.setFieldsValue({
            async: 'false',
          });
        }
      }
    }).finally(() => {
      this.setState({ fetchColumnLoading: false });

      const { exportList } = this.state;

      if (!isEmpty(config)) {
        this.traversalTreeNodes(exportList);

        this.handleExport(config);
      }
    });
  };

  // 重置查询
  @Bind()
  showModal(flag) {
    const { defaultConfig, requestUrl, exportUrl, fillerTypeInitialValue } = this.props;
    if (!isEmpty(defaultConfig)) {
      const { data, ...others } = defaultConfig;
      if (!isEmpty(data)) {
        this.traversalTreeNodes(defaultConfig.data);
        this.handleExport({ fillerType: fillerTypeInitialValue, ...others, async: 'false' });
      } else {
        this.queryColumnData({ fillerType: fillerTypeInitialValue, ...others, async: 'false' });
      }
    } else if (requestUrl) {
      this.setState({
        modalVisible: flag,
        checkedKeys: [],
      });
      if (flag) {
        queryIdpValue('HPFM.EXCEL_EXPORT_TYPE').then((res) => {
          const response = getResponse(res);

          if (response) {
            this.setState({ exportTypeList: res });
          }
        });
        this.queryColumnData();
      } else {
        this.setState({ checkedKeys: [] });
      }
    } else if (exportUrl) {
      this.setState({ modalVisible: flag });
    }
  };


  @Bind()
  handleExpand(expandedKeys) {
    this.setState({
      expandedKeys,
    });
  }

  @Bind()
  handleSelect(checkedKeys) {
    this.setState({ checkedKeys });
  }

  @Bind()
  handleExport(config = {}) {
    const { requestUrl, form } = this.props;
    const { checkedKeys } = this.state;
    let params = {};
    const newQueryParams = { ...{}, ...form.getFieldsValue(), ...config };
    if (!checkedKeys || Array.isArray(checkedKeys) && checkedKeys.length === 0 && requestUrl) {
      return Modal.warning({
        title: intl.get('hzero.common.message.validation.atLeast').d('请至少选择一条数据'),
      });
    } else {
      params = checkedKeys.map(item => {
        return {
          name: 'ids',
          value: item,
        };
      }); // 添加表单查询参数
      for (let i = 0, keys = Object.keys(newQueryParams); i < keys.length; i++) {
        const key = keys[i];
        if (newQueryParams[key] !== undefined) {
          params.push({
            name: key,
            value: newQueryParams[key],
          });
        }
      } // 添加导出Excel参数
      params.push({
        name: 'exportType',
        value: 'DATA',
      });
    }
    this.setState({
      exportPending: true,
    });
    if (newQueryParams.async === 'true') {
      this.handleAsyncDownloadFile(params);
    } else {
      this.handleDownloadFile(config, params);
    }
  }

  @Bind()
  traversalTreeNodes(data = [], arr = []) {
    const { checkedKeys } = this.state;
    const idList = arr;
    data.map(item => {
      const temp = item;
      checkedKeys.push(temp.id);

      this.setState({ checkedKeys });

      if (temp.children) {
        this.traversalTreeNodes(temp.children, idList);
      }
      return temp;
    });
  }

  @Bind()
  renderTreeNodes(data) {
    return data.map(item => {
      if (item.children) {
        return React.createElement(TreeNode, {
          title: item.title,
          key: item.id,
          dataRef: item,
        }, this.renderTreeNodes(item.children));
      }

      return React.createElement(TreeNode, Object.assign({}, item, {
        key: item.id,
      }));
    });
  }

  @Bind()
  renderQueryForm() {
    const { queryFormItem } = this.props;
    return React.createElement(Form, {
      layout: "inline",
    }, queryFormItem);
  }

  @Bind()
  handleMenuClick(_ref) {
    const { key } = _ref;
    if (key === 'async-data') {
      this.showHistoryModal();
    } else if (key === 'export') {
      this.showModal(true);
    }
  }

  @Bind()
  showSyncExportModal() {
    this.showModal(true);
  }

  @Bind()
  showHistoryModal() {
    this.setState({ historyModalVisible: true });
  }

  @Bind()
  hideHistoryModal() {
    this.setState({
      historyModalVisible: false,
    });
  }

  @Bind()
  handleDownloadFile(config = {}, params = {}) {
    const { requestUrl, exportUrl, queryParams, form, method = "GET" } = this.props;
    let queryData = queryParams;

    if (isFunction(queryParams)) {
      queryData = queryParams();
    }
    if (queryData === false) {
      this.setState({
        exportPending: false,
      });
      return notification.warning({ description: '当前有必输项未输入，请先输入必输项再进行导出！' });
    }
    downloadFile({
      requestUrl: requestUrl || exportUrl,
      queryParams: params,
      queryData,
      method,
    }).then(res => {
      if (res) {
        this.setState({
          exportPending: false,
        });

        if (!isEmpty(config)) {
          this.setState({
            checkedKeys: [],
          });
        }
        const file = new Blob([res], { type: 'application/vnd.ms-excel' });
        const fileURL = URL.createObjectURL(file);
        const elink = document.createElement('a');
        const lastName = this.props.fileName.split('.')[1];
        elink.download = form.getFieldValue('fileName') ? `${form.getFieldValue('fileName')}.${lastName}` : this.props.fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  }

  @Bind()
  handleAsyncDownloadFile(params = {}) {
    const { exportAsyncUrl, queryParams, method = 'GET', createTaskUrl } = this.props;
    let queryData = queryParams;

    if (isFunction(queryParams)) {
      queryData = queryParams();
    }
    if (queryData === false) {
      this.setState({
        exportPending: false,
      });
      return notification.warning({ description: '当前有必输项未输入，请先输入必输项再进行导出！' });
    }
    if (exportAsyncUrl) {
      createAsyncExportTask({
        createTaskUrl,
        method: 'POST',
        queryParams: params,
        queryData,
      }).then(result => {
        if (result) {
          this.setState({
            exportPending: false,
          });
          notification.success({
            message: intl.get('hzero.common.notification.export.asyncWithUid', {
              uuid: result.taskCode,
            }).d("\u5F02\u6B65\u5BFC\u51FA\u4EFB\u52A1\u5DF2\u63D0\u4EA4".concat(result.taskCode)),
          });
          initiateAsyncExport({
            exportAsyncUrl,
            queryParams: params,
            queryData: {
              ...queryData,
              exportTaskVO: result,
            },
            method: 'POST',
          });
        }
      });
    } else {
      initiateAsyncExport({
        exportAsyncUrl,
        queryParams: params,
        queryData,
        method,
      }).then(res => {
        if (res) {
          this.setState({
            exportPending: false,
          });
          notification.success({
            message: intl.get('hzero.common.notification.export.asyncWithUid', {
              uuid: res.taskCode,
            }).d("\u5F02\u6B65\u5BFC\u51FA\u4EFB\u52A1\u5DF2\u63D0\u4EA4".concat(res.taskCode)),
          });
        }
      });
    }
  }


  render() {
    const {
      code,
      queryFormItem,
      otherButtonProps,
      buttonText = intl.get('hzero.common.button.export').d('导出'),
      title = intl.get("hzero.common.components.export").d('导出Excel'),
      form,
      exportAsync = false,
      defaultConfig,
      exportUrl,
      fileName,
      fillerTypeInitialValue = 'single-sheet',
    } = this.props;
    const {
      exportTypeList,
      exportList,
      fetchColumnLoading,
      checkedKeys,
      expandedKeys,
      enableAsync,
      exportPending,
      modalVisible,
      historyModalVisible,
      queryHistoryLoading,
    } = this.state;
    const modalProps = {
      title,
      destroyOnClose: true,
      bodyStyle: {
        height: '460px',
        overflowY: 'scroll',
      },
      visible: modalVisible,
      onCancel: this.showModal.bind(this, false),
      onOk: () => {
        this.handleExport();
      },
      confirmLoading: exportPending,
    };
    const buttonProps = {
      code,
      icon: 'export',
      type: 'default',
      ...otherButtonProps,
    };
    const formItemLayout = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
    };
    const historyModalProps = {
      title: intl.get('hzero.common.excelExport.view.title.asyncData').d('异步数据'),
      visible: historyModalVisible,
      destroyOnClose: true,
      width: '1000px',
      onCancel: this.hideHistoryModal,
      onOk: this.hideHistoryModal,
      confirmLoading: queryHistoryLoading,
      wrapClassName: 'ant-modal-sidebar-right',
      transitionName: 'move-right',
    }; // 导出组件入口: 如果设置了 异步且为租户级, 那么显示异步数据(Dropdown),否则显示导出按钮

    const exportEntryElement =
      exportAsync && isTenantRoleLevel() && isEmpty(defaultConfig) ? (
        <Dropdown
          overlay={
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key="export">{intl.get('hzero.common.button.export').d('导出')}</Menu.Item>
              {isTenantRoleLevel() && (
                <Menu.Item key="async-data">
                  {intl.get('hzero.common.excelExport.asyncDataView').d('异步数据查看')}
                </Menu.Item>
              )}
            </Menu>
          }
        >
          <Button {...buttonProps}>
            {buttonText}
            <Icon type="down" />
          </Button>
        </Dropdown>
      ) : (
        <Button {...buttonProps} onClick={this.showSyncExportModal} loading={exportPending}>
          {buttonText}
        </Button>
      );
    return (
      <>
        {exportEntryElement}
        <Modal {...modalProps}>
          <ExportPage
            exportTypeList={exportTypeList}
            exportList={exportList}
            fetchColumnLoading={fetchColumnLoading}
            formItemLayout={formItemLayout}
            queryFormItem={queryFormItem}
            form={form}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            renderQueryForm={this.renderQueryForm}
            renderTreeNodes={this.renderTreeNodes}
            onExpand={this.handleExpand}
            onSelect={this.handleSelect}
            enableAsync={enableAsync}
            exportAsync={exportAsync}
            exportUrl={exportUrl}
            fillerTypeInitialValue={fillerTypeInitialValue}
          />
        </Modal>
        <Modal {...historyModalProps}>
          <HistoryData fileName={fileName} />
        </Modal>
      </>
    );
  }
}
