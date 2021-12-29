/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（进入）
 */

// 引入必要的依赖包
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Button, Modal } from 'hzero-ui';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import Filter from './FilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';
import EXpandCreateForm from './CreateForm/index';
import LineDetail from './LineDetail';
import CreateOutSourceForm from './CreateOutSourceForm/OutsourcingOrderDrawer';

// 链接model层
@connect(({ outsourceManagePlatform, loading }) => ({
  outsourceManagePlatform,
  fetchHeadDataLoading: loading.effects['outsourceManagePlatform/queryHeadData'],
  fetchLineDataLoading: loading.effects['outsourceManagePlatform/queryLineData'],
  fetchLineDetailLoading: loading.effects['outsourceManagePlatform/fetchLineDetail'],
  printDataLoading: loading.effects['outsourceManagePlatform/printData'],
  queryCreateReturnLoading: loading.effects['outsourceManagePlatform/queryCreateReturn'],
  createReturnLoading: loading.effects['outsourceManagePlatform/createOutReturnSourceData'],
  closeLoading: loading.effects['outsourceManagePlatform/closeOutData'],
}))
// 默认导出 视图
export default class OutsourceManagePlatform extends React.Component {
  filterForm;

  // 构造函数  获取上文数据
  constructor(props) {
    super(props);
    // 设置当前静态变量
    this.state = {
      search: {}, // 查询条件
      expandFlag: false, // 是否弹出创建框
      selectedHeadKeys: [], // 选中的数据主键
      selectedHeadData: [],
      detailVisible: false,
      detailLoading: false,
      lineRecord: {},
      createReturnFlag: false, // 外协退料单创建
    };
  }

  @Bind()
  handleGetFormValue() {
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    return filterNullValueObject({ ...filterValue,
      creationDateStart:
      filterValue.creationDateStart == null
          ? ''
          : moment(filterValue.creationDateStart).format(DEFAULT_DATETIME_FORMAT),
      creationDateEnd:
      filterValue.creationDateEnd == null
          ? ''
          : moment(filterValue.creationDateEnd).format(DEFAULT_DATETIME_FORMAT) });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.filterForm = (ref.props || {}).form;
  }

  // 查询绑定
  @Bind
  onSearch(fieldValues) {
    const { dispatch } = this.props;
    // 置空 选中数据
    this.setState({ selectedHeadKeys: [] });
    this.setState(
      {
        search: {
          ...fieldValues,
          creationDateStart:
            fieldValues.creationDateStart == null
              ? ''
              : moment(fieldValues.creationDateStart).format(DEFAULT_DATETIME_FORMAT),
          creationDateEnd:
            fieldValues.creationDateEnd == null
              ? ''
              : moment(fieldValues.creationDateEnd).format(DEFAULT_DATETIME_FORMAT),
        },
        selectedHeadKeys: [],
      },
      () => {
        // 查询头信息
        dispatch({
          type: 'outsourceManagePlatform/queryHeadData',
          payload: {
            ...fieldValues,
            creationDateStart:
              fieldValues.creationDateStart == null
                ? ''
                : moment(fieldValues.creationDateStart).format(DEFAULT_DATETIME_FORMAT),
            creationDateEnd:
              fieldValues.creationDateEnd == null
                ? ''
                : moment(fieldValues.creationDateEnd).format(DEFAULT_DATETIME_FORMAT),
          },
        });
      }
    );
  }

  // 分页查询
  @Bind()
  queryHeadByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { search } = this.state;
    // 置空 选中数据
    this.setState({ selectedHeadKeys: [] });

    dispatch({
      type: 'outsourceManagePlatform/queryHeadData',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // 分页查询
  @Bind()
  queryLineByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { selectedHeadKeys } = this.state;
    dispatch({
      type: 'outsourceManagePlatform/queryLineData',
      payload: {
        sourceDocId: selectedHeadKeys[0],
        page: pagination,
      },
    });
  }

  // 重置
  @Bind()
  resetSearch = () => {
    this.setState({
      search: {},
    });
  };

  // 查询行数据
  @Bind()
  onClickHeadRadio(selectedHeadKeys, selectedHeadData) {
    const { dispatch } = this.props;
    this.setState({ selectedHeadKeys, selectedHeadData });
    dispatch({
      type: 'outsourceManagePlatform/queryLineData',
      payload: {
        sourceDocId: selectedHeadKeys[0],
      },
    });
  }

  // 打开创建信息
  @Bind()
  createData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outsourceManagePlatform/queryReturnLineData',
    });
    this.setState({ expandFlag: true });
  }

  // 关闭创建界面
  @Bind()
  expandColseData() {
    this.setState({ expandFlag: false, selectedHeadKeys: [], selectedHeadData: [] });
    // 重新查询
    this.queryHeadByPagination();
  }

  // 加载时调用的方法
  componentDidMount() {
    const { dispatch } = this.props;
    // 加载下拉框
    dispatch({
      type: 'outsourceManagePlatform/init',
    });
    // 加载工厂
    dispatch({
      type: 'outsourceManagePlatform/querySiteList',
    });
    // 默认查询头信息
    dispatch({
      type: 'outsourceManagePlatform/queryHeadData',
      payload: {},
    });
  }

  @Bind()
  openDetail(record, flag) {
    if (flag) {
      this.fetchLineDetail(record);
    }
    this.setState({ detailVisible: flag, lineRecord: record }, () => {
      this.fetchLineDetail();
    });
  }

  // 关闭 创建退料信息
  @Bind()
  closeReturnFlag() {
    // 判断是否选中了行信息
    this.setState({ createReturnFlag: false });
  }

  // 关闭 创建退料信息
  @Bind()
  closeAndReturnFlag() {
    // 判断是否选中了行信息
    this.setState({ createReturnFlag: false, selectedHeadKeys: [], selectedHeadData: [] });
    // 重新查询数据
    this.queryHeadByPagination();
  }

  // 创建退料信息
  @Bind()
  createReturnFlag() {
    // 判断是否选中了行信息
    this.setState({ createReturnFlag: true });

    // 查询对应的数据
    const { dispatch } = this.props;

    // 默认查询头信息
    dispatch({
      type: 'outsourceManagePlatform/updateState',
      payload: {
        createReturnList: [],
        createReturnHead: {},
      },
    });

    // 默认查询头信息
    dispatch({
      type: 'outsourceManagePlatform/queryCreateReturn',
      payload: {
        sourceDocId: this.state.selectedHeadKeys[0],
      },
    });
  }

  // 创建退料信息
  @Bind()
  closeOutData() {
    Modal.confirm({
      title: intl.get('hzero.common.message.confirm').d('是否确认关闭单据？'),
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 查询对应的数据
        const { dispatch } = this.props;
        // 默认查询头信息
        dispatch({
          type: 'outsourceManagePlatform/closeOutData',
          payload: {
            sourceDocId: this.state.selectedHeadKeys[0],
          },
        }).then(res => {
          if (res) {
            notification.success({ message: '关闭成功！' });
            // 重新查询数据
            this.queryHeadByPagination();
          } else {
            notification.error({ message: res.message });
          }
        });
      },
    });
  }

  @Bind()
  fetchLineDetail(fields = {}) {
    const { lineRecord } = this.state;
    const { dispatch, tenantId } = this.props;
    this.setState({ detailLoading: true });
    dispatch({
      type: 'outsourceManagePlatform/fetchLineDetail',
      payload: {
        tenantId,
        lineId: lineRecord.instructionId,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(() => {
      this.setState({ detailLoading: false });
    });
  }

  // 打印
  @Bind()
  printData() {
    const { dispatch } = this.props;
    const { selectedHeadData } = this.state;
    dispatch({
      type: 'outsourceManagePlatform/printData',
      payload: selectedHeadData.map(e => e.instructionDocId),
    }).then(res => {
      if (res) {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
        }
      }
    });
  }

  // 启用关闭按钮
  @Bind()
  showClose() {
    const {
      outsourceManagePlatform: {
        lineList = [],
      },
    } = this.props;
    const {
      selectedHeadKeys,
      selectedHeadData,
    } = this.state;
    if (selectedHeadKeys && selectedHeadKeys.length === 0) {
      return true;
    } else if (selectedHeadData[0].instructionDocType === 'OUTSOURCING_INVOICE' &&
      selectedHeadData[0].instructionDocStatus === 'RELEASED' &&
      selectedHeadData[0].supplyFlag !== 'Y') {
      return false;
    } else {return !(selectedHeadData[0].instructionDocType === 'OUTSOURCING_RETURN' &&
      selectedHeadData[0].instructionDocStatus === 'RELEASED' &&
      lineList.every((e) => [0, null].includes(e.actualQty)));}
  }

  // 渲染
  render() {
    const {
      outsourceManagePlatform: {
        docTypeMap = [],
        docStatusMap = [],
        siteMap = [],
        materialVersionMap = [],
        reasonMap = [],
        headList = [],
        headPagination = [],
        lineList = [],
        linePagination = [],
        lineDetailList = [],
        lineDetailPagination = {},
        createReturnList = [],
        createReturnHead = {},
      },
      fetchHeadDataLoading,
      fetchLineDataLoading,
      fetchLineDetailLoading,
      printDataLoading,
      queryCreateReturnLoading,
      createReturnLoading,
      closeLoading,
    } = this.props;
    const {
      selectedHeadKeys,
      selectedHeadData,
      detailVisible,
      detailLoading,
      createReturnFlag,
    } = this.state;
    // 设置查询参数
    const searchProps = {
      resetSearch: this.resetSearch,
      onSearch: this.onSearch,
      docTypeMap,
      docStatusMap,
      siteMap,
      reasonMap,
      materialVersionMap,
    };

    // 设置头表参数
    const headProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchHeadDataLoading,
      selectedHeadKeys,
      onSearch: this.queryHeadByPagination,
      onClickHeadRadio: this.onClickHeadRadio,
    };

    // 设置行表参数
    const lineProps = {
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineDataLoading,
      onSearch: this.queryLineByPagination,
      openDetail: this.openDetail,
    };

    // 设置传入创建界面的数据
    // 设置行表参数
    const createFormProps = {
      docStatusMap,
      siteMap,
      materialVersionMap,
      reasonMap,
      expandDrawer: this.state.expandFlag,
      expandColseData: this.expandColseData,
    };

    const detailProps = {
      dataSource: lineDetailList,
      pagination: lineDetailPagination,
      visible: detailVisible,
      fetchLineDetailLoading,
      detailLoading,
      openDetail: this.openDetail,
      onSearch: this.fetchLineDetail,
    };

    // 创建退料信息
    const createReturnProps = {
      createReturnHead,
      createReturnList,
      dataSource: lineDetailList,
      visible: createReturnFlag,
      closeReturnFlag: this.closeReturnFlag,
      closeAndReturnFlag: this.closeAndReturnFlag,
      queryCreateReturnLoading,
      createReturnLoading,
    };

    // 返回视图解析
    return (
      <div>
        {/* 标题 */}
        <Header title={intl.get(`title`).d('外协管理平台')}>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            disabled={selectedHeadKeys.length === 0}
            loading={printDataLoading}
            onClick={() => this.printData()}
            icon="printer"
          >
            打印
          </Button>
          <Button type="primary" style={{ marginRight: '10px' }} onClick={this.createData}>
            外协退料单创建
          </Button>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            disabled={
              selectedHeadKeys.length === 0 ||
              selectedHeadData[0].instructionDocType !== 'OUTSOURCING_RETURN' ||
              (selectedHeadData[0].replenishmentListNum !== '' &&
                selectedHeadData[0].replenishmentListNum !== null &&
                selectedHeadData[0].replenishmentListNum !== undefined)
            }
            onClick={this.createReturnFlag}
          >
            补料单创建
          </Button>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            // disabled={
            //   selectedHeadKeys.length === 0 ||
            //   selectedHeadData[0].supplyFlag === 'Y' ||
            //   selectedHeadData[0].instructionDocType !== 'OUTSOURCING_INVOICE' ||
            //   selectedHeadData[0].instructionDocStatus !== 'RELEASED'
            // }
            disabled={this.showClose()}
            onClick={this.closeOutData}
            loading={closeLoading}
          >
            关闭
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-outsource-manage-platform/inventory-excel-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()} // 查询条件
          />
        </Header>
        <Content>
          <Filter {...searchProps} onRef={this.handleBindRef} />
          <HeadTable {...headProps} />
          <LineTable {...lineProps} />
          {this.state.expandFlag && <EXpandCreateForm {...createFormProps} />}
          {detailVisible && <LineDetail {...detailProps} />}
          {createReturnFlag && <CreateOutSourceForm {...createReturnProps} />}
        </Content>
      </div>
    );
  }
}
