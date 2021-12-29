/**
 * @Description: 立库出库平台
 * @author: lly
 * @date 2021/07/06 11:11
 * @version 1.0
 */

// 引入依赖
import React from 'react';
import { Header, Content } from 'components/Page';
import { Button, Col, Form, Input, Row, Select, Table } from 'hzero-ui';
import { connect } from 'dva';
import { compact, isEmpty, uniq } from 'lodash';
import { Bind } from 'lodash-decorators';

import formatterCollections from 'utils/intl/formatterCollections';
import { filterNullValueObject, getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';

import SnSpecifyQuery from './SnSpecifyQuery';
import OutLibrarySpecifyQuery from './OutLibrarySpecifyQuery';
import styles from './index.less';

// 暂定模板
const modelPormt = 'hwms.tarzan.state-and-out-library-platform';

const tenantId = getCurrentOrganizationId();

// 连接model
@connect(({ stateAndOutLibraryPlatform, loading }) => ({
  stateAndOutLibraryPlatform,
  fetchDocLineLoading: loading.effects['stateAndOutLibraryPlatform/fetchDocLineList'],
  fetchSnSpecifyLoading: loading.effects['stateAndOutLibraryPlatform/fetchSnSpecifyList'],
  fetchOutLibrarySpecifyLoading: loading.effects['stateAndOutLibraryPlatform/fetchOutLibrarySpecifyList'],
  fetchOutLibraryTableLoading: loading.effects['stateAndOutLibraryPlatform/fetchOutLibrarySpecifyTable'],
}))
@formatterCollections({
  code: 'hwms.tarzan.production-pick-return',
})
@Form.create({ fieldNameProp: null })
export default class StateAndOutLibraryPlatform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnSpecify: false, // 是否显示
      selectedRowData: {},
      inputEdit: false,
      enterEdit: false,
      selectedRowKeys: [], // 选中的头
      selectedRows: [], // 选中的头数据
      batchSnDataAll: [], // 验证通过的sn行;
      entrySn: [], // SN录入的materialLotCode;
      deleteFlag: false,
      snDocNum: [], // SN批量录入
    };
  }

  // 加载时调用的方法
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stateAndOutLibraryPlatform/updateState',
      payload: {
        docHeadList: {},
        docNumList: [],
      },
    });
    // 查询饼图和任务表；
    dispatch({
      type: 'stateAndOutLibraryPlatform/fetchOutLibrarySpecifyList',
      payload: {
        tenantId,
      },
    });
    // 查询表格；
    dispatch({
      type: 'stateAndOutLibraryPlatform/fetchOutLibrarySpecifyTable',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'stateAndOutLibraryPlatform/init',
    });
  }

  @Bind()
  handleOnSearch(value, dataListName) {
    const { [dataListName]: dataSource } = this.state;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && (!flag || dataSource.length === 0)) {
      // const newList = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const newList = value[value.length === 0 ? 0 : value.length - 1]
        .substring(0, value[value.length === 0 ? 0 : value.length - 1].length - 2)
        .split('\t, ');
      const uniqueList = uniq(dataSource.concat(compact(newList)));
      this.setState({ [dataListName]: uniqueList });
      this.formDom.setFieldsValue({ [dataListName]: uniqueList });
      this.handleSnBatchEntry();
    } else if (value && value.length > 0 && value.length === dataSource.length) {
      this.formDom.setFieldsValue({ [dataListName]: value });
      this.handleSnBatchEntry();
    }
  }

  @Bind()
  handleOnChange(val) {
    if (val.length === 0) {
      this.setState({ snDocNum: [] });
    }
  }

  // 查询
  @Bind()
  handleQueryData() {
    const { dispatch, form } = this.props;
    const filterValues = (form && filterNullValueObject(form.getFieldsValue())) || {};
    this.setState({ showSnSpecify: false });
    // 先查询头数据
    form.validateFields((err) => {
      if (!err) {
        // 如果验证成功,则执行;
        dispatch({
          type: 'stateAndOutLibraryPlatform/fetchDocHead',
          payload: {
            ...filterValues,
          },
        }).then(res => {
          if (res && res.instructionDocId) {
            this.setState({
              inputEdit: false,
              enterEdit: false,
              deleteFlag: false,
            });
            this.handleDocLineList();
          }
        });
      }
    });
  }

  // 查询单据数据
  @Bind()
  handleDocLineList(fields = {}) {
    this.setState({selectedRowKeys: []});
    const {
      dispatch,
      stateAndOutLibraryPlatform: {
        docHeadList = {}, // 单据号信息
      },
    } = this.props;
    dispatch({
      type: 'stateAndOutLibraryPlatform/fetchDocLineList',
      payload: {
        instructionDocId: docHeadList.instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  查询sn行列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSnSpecifyList(flag) {
    const { selectedRowData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'stateAndOutLibraryPlatform/fetchSnSpecifyList',
      payload: {
        ...selectedRowData,
        tenantId,
      },
    }).then((res) => {
      if (flag) {
        this.handleCheckEdit();
      } else if ( selectedRowData.sn ) {
          this.handleCheckEdit();
        } else if ( res.length > 0 ) {
          notification.warning({ message: `单据行${selectedRowData.instructionLineNum}已指定SN,删除后可重新指定!` });
          this.handleCheckEdit();
        } else {
          this.handleCheckEdit();
        }
    });
  }

  @Bind()
  handleGetRowData(record) {
    this.setState({
      selectedRowData: record,
      showSnSpecify: true,
      inputEdit: false,
      enterEdit: false,
      deleteFlag: false,
    }, () => {
      if (record.sn) {
        notification.warning({ message: `单据行${record.instructionLineNum}已指定SN,不可编辑!` });
        this.handleSnSpecifyList();
        this.setState({entrySn: []});
        this.setState({batchSnDataAll: []});
      } else {
        this.handleSnSpecifyList();
        this.setState({entrySn: []});
        this.setState({batchSnDataAll: []});
      }
    });
  }

  // 查询SN批量输入可编辑校验
  @Bind()
  handleCheckEdit() {
    const { selectedRowData } = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'stateAndOutLibraryPlatform/fetchSnEdit',
      payload: {
        instructionId: selectedRowData.instructionId,
        sn: selectedRowData.sn ? selectedRowData.sn : '',
      },
    }).then(res => {
      if ( selectedRowData.sn && res.success === true && res.rows === 'N' ) {
        this.setState({inputEdit: true});
        this.setState({enterEdit: true});
      } else if (res.success === true) {
        if (res.rows === 'N') {
          this.setState({inputEdit: true});
        } else {
          this.setState({inputEdit: false});
        }
      } else {
        this.setState({inputEdit: true});
        this.setState({enterEdit: true});
        notification.error({ message: `${res.message}` });
      }
    });
  }

  // 出库；
  @Bind()
  handleOutLibrary() {
    const { dispatch } = this.props;
    const {
      selectedRows,
    } = this.state;
    if (selectedRows.length > 0) {
      dispatch({
        type: 'stateAndOutLibraryPlatform/fetchSnOutLibrary',
        payload: [
          ...selectedRows,
        ],
      }).then((res) => {
        if (res && !isEmpty(res[0])) {
          if (res[0].success === true) {
            notification.success({ message: '出库成功' });
            this.handleTablePage();
          } else {
            notification.error({ message: '出库失败' });
          }
        }
      });
    } else {
      return notification.error({ message: '请先选择物料行!' });
    }
  }

  // 表格分页查询；
  @Bind()
  handleTablePage(fields = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'stateAndOutLibraryPlatform/fetchOutLibrarySpecifyTable',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 取消；
  @Bind()
  handleOnCancel(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'stateAndOutLibraryPlatform/cancelSnOutLibrary',
      payload: { ...record },
    }).then((res) => {
      if (!isEmpty(res) && res.rows[0].success === true ) {
        notification.success({ message: '取消成功' });
        this.handleTablePage();
      } else {
        return notification.error({ message: '取消失败' });
      }
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.formDom = (ref.props || {}).form;
  }

  // 新建行
  @Bind()
  handleCreate() {
    const {
      dispatch,
      stateAndOutLibraryPlatform: { batchSnData= [] },
    } = this.props;
    if (
      batchSnData.filter(item => item._status === 'create').length > 0
    ) {
      if (getEditTableData(batchSnData).length === 0) {
        return notification.error({ message: '请先填写必输项' });
      }
    }
    dispatch({
      type: 'stateAndOutLibraryPlatform/updateState',
      payload: {
        batchSnData: [
          {
            _status: 'create',
          },
          ...batchSnData,
        ],
      },
    });
  }

  // SN单个录入
  @Bind()
  handleSnSingleEntry(record) {
    const { batchSnDataAll, entrySn, selectedRowData } = this.state;
    const { dispatch } = this.props;
    const {
      materialLotCodesList,
      ...newFields
    } = selectedRowData;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (entrySn.includes(fieldsValue.materialLotCode)) {
          return notification.error({ message: '录入SN重复，请检查!' });
        } else {
          dispatch({
            type: 'stateAndOutLibraryPlatform/fetchSnBatchEntry',
            payload: {
              materialLotCodesList: [fieldsValue.materialLotCode],
              ...newFields,
            },
          }).then(res => {
            if (res instanceof Array) {
              const newSnData = res.concat(batchSnDataAll);
              const newList = newSnData.filter(item => item._status !== 'create');
              dispatch({
                type: 'stateAndOutLibraryPlatform/updateState',
                payload: { batchSnData: newList },
              });
              this.setState({ batchSnDataAll: newList });
              entrySn.push(fieldsValue.materialLotCode);
            } else {
              dispatch({
                type: 'stateAndOutLibraryPlatform/updateState',
                payload: { batchSnData: batchSnDataAll },
              });
            }
          });
        }
      }
    });
  }

  // SN批量录入
  @Bind()
  handleSnBatchEntry() {
    const { entrySn, batchSnDataAll, selectedRowData } = this.state;
    const { dispatch } = this.props;
    const {
      materialLotCodesList,
      ...newFields
    } = selectedRowData;
    const filterValues = (this.formDom && this.formDom.getFieldsValue()) || {};
    const addFilterValues = filterValues.snDocNum.filter((item) => !entrySn.includes(item));
    if (addFilterValues.length > 0) {
      dispatch({
        type: 'stateAndOutLibraryPlatform/fetchSnBatchEntry',
        payload: {
          materialLotCodesList: addFilterValues,
          ...newFields,
        },
      }).then(res => {
        if (res instanceof Array) {
          const newSnData = res.concat(batchSnDataAll);
          dispatch({
            type: 'stateAndOutLibraryPlatform/updateState',
            payload: { batchSnData: newSnData },
          });
          this.setState({ batchSnDataAll: newSnData });
          this.setState({ entrySn: uniq(entrySn.concat(filterValues.snDocNum)) });
        } else {
          dispatch({
            type: 'stateAndOutLibraryPlatform/updateState',
            payload: { batchSnData: batchSnDataAll },
          });
        }
      });
    } else {
      return notification.error({ message: '录入SN重复，请检查!' });
    }
  }

  // 删除行
  @Bind
  deleteLine(record) {
    const { entrySn } = this.state;
    const {
      dispatch,
      stateAndOutLibraryPlatform: {
        batchSnData = [],
      },
    } = this.props;
    if (record.materialLotCode === undefined || record.materialLotCode === null || record.materialLotCode === "") {
      const newList = batchSnData.filter(item => item.materialLotCode !== record.materialLotCode);
      dispatch({
        type: 'stateAndOutLibraryPlatform/updateState',
        payload: { batchSnData: newList },
      });
    } else if (entrySn.includes(record.materialLotCode)) {
      const newList = batchSnData.filter(item => item.materialLotCode !== record.materialLotCode);
      // batchSnData.splice(index, 1);
      this.setState({batchSnDataAll: newList});
      dispatch({
        type: 'stateAndOutLibraryPlatform/updateState',
        payload: { batchSnData: newList },
      });
      const newBatchSn = entrySn.filter(item => item !== record.materialLotCode);
      this.setState({entrySn: newBatchSn});
    }
  }

  // 保存消息
  @Bind
  handleSaveSnSpecifyData() {
    const {
      entrySn,
      selectedRowData,
    } = this.state;
    const {
      dispatch,
      stateAndOutLibraryPlatform: {
        docHeadList= {}, // 单据头信息
      },
    } = this.props;
    const {
      materialLotCodesList,
      ...newFields
    } = selectedRowData;
    const snDataList = uniq(entrySn);
    if (snDataList.length === 0) {
      notification.error({ message: '未输入SN或SN未通过校验，请检查!' });
    } else {
      dispatch({
        type: 'stateAndOutLibraryPlatform/fetchSnSave',
        payload: {
          instructionDocId: docHeadList.instructionDocId,
          materialLotCodesList: snDataList,
          ...newFields,
        },
      }).then(res => {
        if (res && res.success) {
          this.handleSnSpecifyList(true);
          this.formDom.resetFields(['snDocNum']);
          this.setState({entrySn: []});
          this.setState({deleteFlag: true});
          this.setState({batchSnDataAll: []});
        } else if (res !== undefined) {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  }

  // 批量删除
  @Bind()
  handleDeleteSnSpecifyAll() {
    const { batchSnDataAll, selectedRowData } = this.state;
    const {
      dispatch,
      stateAndOutLibraryPlatform: { SnSpecifyQueryList = [] },
    } = this.props;
    // console.log('SnSpecifyQueryList==', SnSpecifyQueryList);
    const materialLotCodeList = SnSpecifyQueryList.map((item) => item.materialLotCode);
    // console.log('materialLotCodeList==', materialLotCodeList);
    const {
      materialLotCodesList,
      ...newFields
    } = selectedRowData;
    if (batchSnDataAll.length > 0) {
      dispatch({
        type: 'stateAndOutLibraryPlatform/updateState',
        payload: { batchSnData: [] },
      });
      this.formDom.resetFields(['snDocNum']);
      this.setState({ snDocNum: [] });
      this.setState({entrySn: []});
      this.setState({batchSnDataAll: []});
    } else {
      dispatch({
        type: 'stateAndOutLibraryPlatform/fetchSnDelEte',
        payload: {
          materialLotCodesList: materialLotCodeList,
          ...newFields,
          tenantId,
        },
      }).then(res => {
        if (res && res.success) {
          this.formDom.resetFields(['snDocNum']);
          this.setState({ snDocNum: [] });
          this.handleSnSpecifyList(true);
          this.setState({deleteFlag: false});
          this.setState({
            inputEdit: false,
            enterEdit: false,
          });
        } else if (res !== undefined) {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  }

  @Bind()
  handleExitNumSelect(value, index) {
    const {
      dispatch,
      stateAndOutLibraryPlatform: { docNumList = [] },
    } = this.props;
    const newIndexData = {
      ...docNumList[index],
      exitNum: value,
    };
    docNumList[index] = newIndexData;
    dispatch({
      type: 'stateAndOutLibraryPlatform/updateState',
      payload: {
        docNumList,
      },
    });
  }

  /**
   * 头数据选择操作
   */
  @Bind()
  handleSelectHeadRow(selectedRowKeys, selectedRows) {
    this.setState(
      {
        selectedRowKeys,
        selectedRows,
      }
    );
  }

  render() {
    const {
      selectedRowKeys,
      inputEdit,
      enterEdit,
      showSnSpecify,
      deleteFlag,
      snDocNum,
    } = this.state;

    // 获取加载的状态
    const {
      stateAndOutLibraryPlatform: {
        docHeadList= {}, // 单据头信息
        docNumList = [], // 单据号信息
        docNumListPagination = {}, // 单据号分页
        SnSpecifyQueryList = [], // SN信息
        batchSnData = [],
        // SnSpecifyQueryPagination = {}, // SN分页
        taskList = {}, // 当前任务
        pieChartData = [], // 出库任务信息饼图
        OutTableList = [], // 出库任务表
        OutTableListPagination = {}, // 出库任务表分页
        typeMap = [], // 出口
      },
      fetchDocLineLoading,
      fetchSnSpecifyLoading,
      fetchOutLibrarySpecifyLoading,
      fetchOutLibraryTableLoading,
    } = this.props;

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    const docNumColumns = [
      {
        title: '行号',
        width: 80,
        dataIndex: 'instructionLineNum',
        // render: (text, data, index) => {
        //   return index + 1;
        // },
      },
      {
        title: intl.get(`${modelPormt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPormt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${modelPormt}.materialVersion`).d('版本'),
        dataIndex: 'materialVersion',
        width: 100,
      },
      {
        title: intl.get(`${modelPormt}.quantity`).d('制单数量'),
        dataIndex: 'quantity',
        width: 100,
      },
      {
        title: intl.get(`${modelPormt}.actualQty`).d('执行数量'),
        dataIndex: 'actualQty',
        width: 100,
      },
      {
        title: intl.get(`${modelPormt}.instructionStatusMeaning`).d('状态'),
        dataIndex: 'instructionStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${modelPormt}.locatorName`).d('仓库'),
        dataIndex: 'locatorName',
      },
      {
        title: intl.get(`${modelPormt}.soNumSoLineNum`).d('销售订单'),
        dataIndex: 'soNumSoLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPormt}.stangingQuantity`).d('立库现有量'),
        dataIndex: 'stangingQuantity',
        width: 120,
        render: (val) => (
          <span className={styles['class-hand-change']}>
            {val}
          </span>
        ),
      },
      {
        title: intl.get(`${modelPormt}.exitNum`).d('出口'),
        dataIndex: 'exitNum',
        width: 120,
        render: (val, record, index) =>(
          <Select
            allowClear
            style={{ width: '100%' }}
            defaultValue={val}
            onSelect={(value => this.handleExitNumSelect(value, index))}
          >
            {typeMap.map(item => (
              <Select.Option key={item.value}>{item.meaning}</Select.Option>
            ))}
          </Select>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        fixed: 'right',
        align: 'center',
        render: (val, record, index) => (
          <a onClick={() => this.handleGetRowData(record)}>
            {intl.get(`${modelPormt}.view.titleSnSpecify`).d('SN指定')}
          </a>
        ),
      },
    ];

    const rowSelection = {
      // type: 'radio',
      selectedRowKeys,
      onChange: this.handleSelectHeadRow,
    };

    const SnSpecifyQueryProps = {
      snDocNum,
      deleteFlag,
      inputEdit,
      enterEdit,
      batchSnData,
      SnSpecifyQueryList,
      fetchSnSpecifyLoading,
      onCreate: this.handleCreate,
      snSingleEntry: this.handleSnSingleEntry,
      snBatchEntry: this.handleSnBatchEntry,
      deleteLine: this.deleteLine,
      saveData: this.handleSaveSnSpecifyData,
      deleteBatch: this.handleDeleteSnSpecifyAll,
      onChange: this.handleOnChange,
      onBatchInput: this.handleOnSearch,
      onRef: this.handleBindRef,
    };

    const OutLibrarySpecifyQueryProps = {
      taskList,
      pieChartData,
      OutTableList,
      OutTableListPagination,
      fetchOutLibrarySpecifyLoading,
      fetchOutLibraryTableLoading,
      onCancel: this.handleOnCancel,
      onSearch: this.handleTablePage,
    };

    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPormt}.view.title`).d('立库出库平台')} />
        <Content>
          <div className={styles['class-model-left']}>
            <div className={styles['class-model-left-top']}>
              <Form className={SEARCH_FORM_CLASSNAME}>
                <Row {...SEARCH_FORM_ROW_LAYOUT}>
                  <Col span={8}>
                    <Form.Item
                      {...SEARCH_FORM_ITEM_LAYOUT}
                      label={intl.get(`${modelPormt}.instructionDocNum`).d('单据号')}
                    >
                      {getFieldDecorator('instructionDocNum', {
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: '单据号',
                            }),
                          },
                        ],
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={16} style={{textAlign: 'end', paddingRight: '18%'}}>
                    <Form.Item>
                      <Button
                        style={{marginRight: '7%', background: '#04B404', color: '#ffffff'}}
                        // htmlType='submit'
                        onClick={() => this.handleQueryData()}
                      >
                        {intl.get(`hzero.common.button.search`).d('查询')}
                      </Button>
                      <Button
                        style={{ background: '#FE642E', color: '#ffffff' }}
                        onClick={() => this.handleOutLibrary()}
                      >
                        {intl.get(`${modelPormt}.outLibrary`).d('出库')}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Row style={{ marginBottom: '1%' }}>
                <Col span={8}>
                  <span className={styles['class-span-label']}>
                    {intl.get(`${modelPormt}.instructionDocNum`).d('单据号：')}
                  </span>
                  <span>
                    {docHeadList.instructionDocNum}
                  </span>
                </Col>
                <Col span={8}>
                  <span>
                    {intl.get(`${modelPormt}.instructionDocTypeMeaning`).d('单据类型：')}
                  </span>
                  <span>
                    {docHeadList.instructionDocTypeMeaning}
                  </span>
                </Col>
                <Col span={8}>
                  <span>
                    {intl.get(`${modelPormt}.instructionDocStatusMeaning`).d('单据状态：')}
                  </span>
                  <span>
                    {docHeadList.instructionDocStatusMeaning}
                  </span>
                </Col>
              </Row>
              <Table
                bordered
                dataSource={docNumList}
                columns={docNumColumns}
                pagination={docNumListPagination}
                rowSelection={rowSelection}
                onChange={page => this.handleDocLineList(page)}
                loading={fetchDocLineLoading}
                rowKey='instructionId'
              />
            </div>
            <div className={styles['class-model-left-bottom']}>
              {showSnSpecify && <SnSpecifyQuery {...SnSpecifyQueryProps} />}
            </div>
          </div>
          <div className={styles['class-model-right']}>
            <OutLibrarySpecifyQuery {...OutLibrarySpecifyQueryProps} />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
