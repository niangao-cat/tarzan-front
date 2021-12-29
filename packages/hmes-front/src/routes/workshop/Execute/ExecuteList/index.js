/**
 * execute - 执行作业管理
 * @date: 2019-12-19
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Menu, Dropdown } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';
import moment from 'moment';

import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import Cookies from 'universal-cookie';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getEditTableData } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from '@/components/ExcelExport';
import { Host } from '@/utils/config';
import FilterForm from './FilterForm';
import PrintModel from './PrintModel';
import PrintSnModel from './PrintSnModel';
import NameplatePrintModal from './NameplatePrintModal';

const cookies = new Cookies();

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.workshop.execute.model.execute';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 执行作业管理
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} executeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ execute, loading }) => ({
  execute,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['execute/fetchExecuteList'],
  fetchNameplateListLoading: loading.effects['execute/fetchNameplateList'],
}))
@formatterCollections({ code: 'tarzan.workshop.execute' })
@Form.create({ fieldNameProp: null })
export default class ExecuteList extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    selectRows: [], // Check here to configure the default column
    isDisabled: false, // 是否可点击批量操作按钮
    printVisible: false, // 是否显示打印
    printSnVisible: false, // 是否显示打印
    selectRowsData: [], // 选中信息
    nameplatePrintModalVisible: false,
  };

  componentDidMount() {
    // 获取对应的工单数据
    const {
      dispatch,
      // execute: { executePagination = {} },
    } = this.props;

    // if (cookies.get('workOrderId') !== undefined && cookies.get('workOrderId') !== null && cookies.get('workOrderId') !== ""){
    //   dispatch({
    //     type: 'execute/fetchExecuteList',
    //     payload: {
    //       ...this.queryForm.props.form.getFieldsValue(),
    //       workOrderId: cookies.get('workOrderId'),
    //       page: executePagination,
    //     },
    //   });
    //
    //   // 设置Lov 数据
    //   this.queryForm.props.form.setFieldsValue({
    //     workOrderId: cookies.get('workOrderId'),
    //     workOrderNum: cookies.get('workOrderNum'),
    //   });
    // }else{
    //   dispatch({
    //     type: 'execute/fetchExecuteList',
    //     payload: {
    //       ...this.queryForm.props.form.getFieldsValue(),
    //       page: executePagination,
    //     },
    //   });
    // }
    dispatch({
      type: 'execute/init',
    });
  }

  onSearch = (pagination = {}) => {
    this.queryForm.fetchQueryList(pagination);
  };

  @Bind
  clearSelectedRow() {
    this.setState({ selectedRowKeys: [], selectRowsData: [] });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {},
      },
    });
    // 清空Cooke数据
    cookies.set('workOrderId', "");
    // 清空Cooke数据
    cookies.set('workOrderNum', "");
  }

  attrOnly = array => {
    let first;
    if (array.length > 0) {
      first = array[0].status;
      /* eslint-disable */
      return array.every(function (item) {
        return item.status === first;
      });
      /* eslint-disable */
    }
    return false;
  };

  onSelectChange = (selectedRowKeys, selectRows) => {
    if (selectRows.length > 0) {
      this.setState({
        isDisabled: this.attrOnly(selectRows),
      });
    }
    this.setState({ selectedRowKeys, selectRows: selectRows[0] || {}, selectRowsData: selectRows });
  };

  /**
   * 页面跳转到日历班次维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showExecuteDetail(record = {}) {
    const { history } = this.props;
    history.push(`/hmes/workshop/execute-operation-management/detail/${record.eoId}`);
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  onCancel = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  // 执行作业状态变更
  updateExecuteStatus = operationType => {
    const {
      execute: { executePagination = {} },
      dispatch,
    } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'execute/updateExecuteStatus',
      payload: {
        operationType,
        eoIds: selectedRowKeys,
      },
    }).then(res => {
      if (res && res.success) {
        this.onSearch(executePagination);
        notification.success();
        this.setState({
          selectedRowKeys: [],
          selectRows: {},
        });
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  // 打印操作
  @Bind
  doPrint() {
    this.setState({ printVisible: true });
  }

  // 打印条码操作
  @Bind
  doSnPrint() {
    this.setState({ printSnVisible: true });
  }

  // 关闭打印
  @Bind
  closePrint() {
    this.setState({ printVisible: false });
  }

  // 关闭条码打印
  @Bind
  closeSnPrint() {
    this.setState({ printSnVisible: false });
  }

  // 打印
  @Bind
  print(info = {}) {
    const { selectRowsData } = this.state;

    // 重新筛选数据
    let hmeEoVO3List = [];
    for (let i = 0; i < selectRowsData.length; i++) {
      hmeEoVO3List = [...hmeEoVO3List, { eoNum: selectRowsData[i].eoIdentification, materialCode: selectRowsData[i].materialCode, materialName: selectRowsData[i].materialName, workOrder: selectRowsData[i].workOrderNum, version: selectRowsData[i].productionVersion, soNum: selectRowsData[i].soNum, printOptionValue: info.printOptionValue }]
    }
    // 设置传输 参数
    const param = {
      type: info.printType,
      hmeEoVO3List,
    };
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'execute/print',
      payload: param,
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          const file = new Blob(
            [res],
            { type: 'application/pdf' }
          );
          const fileURL = URL.createObjectURL(file);
          const newwindow = window.open(fileURL, 'newwindow');
          if (newwindow) {
            newwindow.print();
            this.setState({ printVisible: false });
          } else {
            notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          }
        }
      }
    });
  }

  // 打印条码
  @Bind
  printSn(info = {}) {
    // const {selectRowsData} = this.state;

    // 重新筛选数据
    let hmeEoVO3List = [];
    for (let i = 0; i < 1; i++) {
      hmeEoVO3List = [...hmeEoVO3List, { eoNum: info.eoNum }]
    }

    // 设置传输 参数
    const param = {
      type: info.printType,
      hmeEoVO3List,
    };
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: 'execute/validate',
      payload: param,
    }).then(res => {
      if (res) {
        dispatch({
          type: 'execute/printSn',
          payload: param,
        }).then(res => {
          if (res) {
            if (res.failed) {
              notification.error({ message: res.exception });
            } else {
              const file = new Blob(
                [res],
                { type: 'application/pdf' }
              );
              const fileURL = URL.createObjectURL(file);
              const newwindow = window.open(fileURL, 'newwindow');
              if (newwindow) {
                newwindow.print();
                // this.setState({ printSnVisible: false});
              } else {
                notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
              }
            }
          }
        });
      }
    });
  }

  @Bind()
  handleGetFormValue() {
    let value = this.queryForm.props.form ? this.queryForm.props.form.getFieldsValue() : {};
    const { repairSn, workOrderNum, startTimeFrom, startTimeTo, endTimeFrom, endTimeTo } = value;
    value = {
      ...value,
      repairSn: repairSn ? repairSn.toString() : '',
      workOrderNum: workOrderNum ? workOrderNum.toString().trim() : '',
      startTimeFrom: startTimeFrom ? moment(startTimeFrom).format('YYYY-MM-DD HH:mm:ss') : null,
      startTimeTo: startTimeTo ? moment(startTimeTo).format('YYYY-MM-DD HH:mm:ss') : null,
      endTimeFrom: endTimeFrom ? moment(endTimeFrom).format('YYYY-MM-DD HH:mm:ss') : null,
      endTimeTo: endTimeTo ? moment(endTimeTo).format('YYYY-MM-DD HH:mm:ss') : null,
    };
    return filterNullValueObject(value);
  }

  @Bind()
  handleImport() {
    openTab({
      key: `/hmes/workshop/execute-operation-management/data-import/HME.REPAIR_SN_BIND`,
      title: intl.get('hwms.machineBasic.view.message.import').d('返修SN导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('返修SN导入'),
      }),
    });
  }

  @Bind()
  handlePrintPump() {
    const { dispatch, execute: { baseInfo, workCellInfo } } = this.props;
    const { selectedRowKeys, selectRows } = this.state;
    if (selectedRowKeys.length === 1) {
      dispatch({
        type: `execute/printMaterialCode`,
        payload: {
          workOrderId: selectRows.workOrderId,
          snNum: selectRows.eoIdentification,
          printType: '0',
        },
      }).then(result => {
        if (result) {
          const file = new Blob(
            [result],
            { type: 'application/pdf' }
          );
          const fileURL = URL.createObjectURL(file);
          const newwindow = window.open(fileURL, 'newwindow');
          if (newwindow) {
            newwindow.print();
            this.setState({ printVisible: false });
          } else {
            notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          }
        }
      });
    } else {
      notification.warning({ description: '组合打印仅能勾选一条执行作业，请重新勾选！' });
    }
  }

  @Bind()
  handleOpenNameplatePrintModal() {
    this.setState({ nameplatePrintModalVisible: true });
    this.handleFetchNameplateList();
  }

  @Bind()
  handleCloseNameplatePrintModal() {
    const { dispatch } = this.props;
    this.setState({ nameplatePrintModalVisible: false });
    dispatch({
      type: 'execute/updateState',
      payload: {
        nameplateList: [],
      },
    });
  }

  @Bind()
  handleFetchNameplateList() {
    const { selectRowsData } = this.state;
    const { dispatch } = this.props;
    const payload = selectRowsData.filter(e => e.status === 'COMPLETED');
    if (payload.length > 0) {
      dispatch({
        type: 'execute/fetchNameplateList',
        payload,
      });
    } else {
      notification.warning({ description: '只能打印完成状态的EO' });
    }
  }

  @Bind()
  validateEditTable(dataSource = [], excludeKeys = [], property = {}) {
    const editTableData = dataSource.filter(e => e._status);
    if (editTableData.length === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const validateDataSource = getEditTableData(dataSource, excludeKeys, property);
      if (validateDataSource.length === 0) {
        reject(
          notification.error({
            description: intl
              .get('ssrm.leaseContractCreate.view.message.error')
              .d('请完整页面上的必填信息'),
          })
        );
      } else {
        resolve(validateDataSource);
      }
    });
  }

  @Bind()
  handlePrintNameplateList() {
    const { execute: { nameplateList, pdfDataList }, dispatch } = this.props
    Promise.all([
      this.validateEditTable(nameplateList),
    ]).then(list => {
      const [eoInternalCodeList] = list;
      dispatch({
        type: 'execute/printNameplateList',
        payload: {
          eoInternalCodeList,
          pdfDataList,
        },
      }).then(res => {
        if (res) {
          const file = new Blob(
            [res],
            { type: 'application/pdf' }
          );
          const fileURL = URL.createObjectURL(file);
          const newwindow = window.open(fileURL, 'newwindow');
          if (newwindow) {
            newwindow.print();
            this.setState({ printVisible: false });
          } else {
            notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          }
        }
      });
    })
  }



  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      execute: { executeList = [], executePagination = {}, printComponentList = [], nameplateList = [] },
      loading,
      currentTenantId,
      fetchNameplateListLoading,
    } = this.props;

    const { selectedRowKeys, selectRows, isDisabled, printVisible, printSnVisible, nameplatePrintModalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const nameplatePrintModalProps = {
      dataSource: nameplateList,
      loading: fetchNameplateListLoading,
      visible: nameplatePrintModalVisible,
      closeModal: this.handleCloseNameplatePrintModal,
      onPrintNameplateList: this.handlePrintNameplateList,
    };

    const { status } = selectRows;

    const menu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.updateExecuteStatus('RELEASE')}
          >
            {intl.get('tarzan.workshop.execute.button.issued').d('下达')}
          </a>
        </Menu.Item>
        <Menu.Item>
          {status === 'WORKING' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('EO_WORKING_CANCEL')}
            // disabled={!(status === 'HOLD'||status==='RELEASE')}
            >
              {intl.get('tarzan.workshop.execute.button.workingCancel').d('取消运行')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('WORKING')}
            // disabled={!(status === 'HOLD'||status==='RELEASE')}
            >
              {intl.get('tarzan.workshop.execute.button.working').d('运行')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {status === 'HOLD' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('HOLD_CANCEL')}
            >
              {intl.get('tarzan.workshop.execute.button.holdCancel').d('取消保留')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('HOLD')}
            >
              {intl.get('tarzan.workshop.execute.button.hold').d('保留')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {status === 'COMPLETED' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('COMPLETED_CANCEL')}
            >
              {intl.get('tarzan.workshop.execute.button.completeCancel').d('取消完成')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('COMPLETED')}
            >
              {intl.get('tarzan.workshop.execute.button.complete').d('完成')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {status === 'CLOSED' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('CLOSE_CANCEL')}
            >
              {intl.get('tarzan.workshop.execute.button.closeCancel').d('取消关闭')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('CLOSE')}
            >
              {intl.get('tarzan.workshop.execute.button.close').d('关闭')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.updateExecuteStatus('ABANDON')}
          >
            {intl.get('tarzan.workshop.execute.button.abandoned').d('废弃')}
          </a>
        </Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: intl.get(`${modelPrompt}.eoNum`).d('执行作业编码'),
        width: 220,
        dataIndex: 'eoNum',
        render: (val, record) => <a onClick={() => this.showExecuteDetail(record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.eoIdentification`).d('EO标识'),
        // width: 100,
        dataIndex: 'eoIdentification',
      },
      {
        title: intl.get(`${modelPrompt}.repairSn`).d('返修SN'),
        width: 100,
        dataIndex: 'repairSn',
      },
      {
        title: intl.get(`${modelPrompt}.eoWorkcellIdDesc`).d('当前工序'),
        width: 100,
        dataIndex: 'eoWorkcellIdDesc',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料名称'),
        width: 200,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.eoType`).d('执行作业类型'),
        dataIndex: 'eoTypeDesc',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('执行作业状态'),
        dataIndex: 'statusDesc',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.productionLineCode`).d('生产线编码'),
        dataIndex: 'productionLineCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.productionLineName`).d('生产线短描述'),
        dataIndex: 'productionLineName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间'),
        dataIndex: 'planStartTime',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间'),
        dataIndex: 'planEndTime',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('执行作业数量'),
        dataIndex: 'qty',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.completedQty`).d('完成数量'),
        dataIndex: 'completedQty',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.scrappedQty`).d('报废数量'),
        dataIndex: 'scrappedQty',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('工单'),
        dataIndex: 'workOrderNum',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('生产版本'),
        dataIndex: 'productionVersion',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.woBomNameRevision`).d('生产指令装配清单版本'),
        dataIndex: 'woBomNameRevision',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.eoBomNameRevision`).d('执行作业装配清单版本'),
        dataIndex: 'eoBomNameRevision',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.woRouterNameRevision`).d('生产指令工艺路线版本'),
        dataIndex: 'woRouterNameRevision',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.eoRouterNameRevision`).d('执行作业工艺路线版本'),
        dataIndex: 'eoRouterNameRevision',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.soNum`).d('销售订单'),
        dataIndex: 'soNum',
        width: 200,
      },
    ];

    const printProps = {
      printComponentList,
      visible: printVisible,
      closeModal: this.closePrint,
      print: this.print,
      selectedBarcodeList: selectRows,
    }

    const printSnProps = {
      visible: printSnVisible,
      closeModal: this.closeSnPrint,
      printSn: this.printSn,
    }

    return (
      <>
        <Header title={intl.get('tarzan.workshop.execute.title.list').d('执行作业管理')}>
          <Dropdown
            overlay={menu}
            trigger={['click']}
            disabled={selectedRowKeys.length === 0 || !isDisabled}
          >
            <Button icon="retweet" disabled={selectedRowKeys.length === 0 || !isDisabled}>
              {intl.get('tarzan.workshop.execute.button.changeStatus').d('状态变更')}
            </Button>
          </Dropdown>
          <Button onClick={() => this.doPrint()} disabled={selectedRowKeys.length === 0}>
            {intl.get('tarzan.workshop.execute.button.print').d('打印')}
          </Button>
          <Button onClick={() => this.doSnPrint()} >
            {intl.get('tarzan.workshop.execute.button.print').d('打印条码')}
          </Button>
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.handlePrintPump()}
          >
            组合打印
          </Button>
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.handleOpenNameplatePrintModal()}
          >
            铭牌打印
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`${Host}/v1/${currentTenantId}/hme-repair-sn-binds/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="返修SN.xlsx"
          />
          <Button type="primary" onClick={this.handleImport}>
            {intl.get('tarzan.workshop.execute.button.import').d('返修SN导入')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} clearSelectedRow={this.clearSelectedRow} />
          <Table
            loading={loading}
            rowKey="eoId"
            dataSource={executeList}
            rowSelection={rowSelection}
            columns={columns}
            pagination={executePagination || {}}
            onChange={this.onSearch}
            bordered
          />
          {printVisible && <PrintModel {...printProps} />}
          {printSnVisible && <PrintSnModel {...printSnProps} />}
          <NameplatePrintModal {...nameplatePrintModalProps} />
        </Content>
      </>
    );
  }
}
