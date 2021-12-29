import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Select, Input, Modal, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import uuidv4 from 'uuid/v4';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import { addItemToPagination, getCurrentOrganizationId, delItemToPagination, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { isEmpty } from 'lodash';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

import FilterForm from './FilterForm';

const { Option } = Select;
const modelPrompt = 'tarzan.iqc.basicDataMaintenDistri.model.transformation';
const tenantId = getCurrentOrganizationId();

@connect(({ basicDataMaintenDistri, loading }) => ({
  basicDataMaintenDistri,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['basicDataMaintenDistri/fetchHeadList'],
  addMessageLoading: loading.effects['basicDataMaintenDistri/addHeadList'],
  updateMessageLoading: loading.effects['basicDataMaintenDistri/updateHeadList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.iqc.basicDataMaintenDistri',
})
export default class BasicDataMaintenDistri extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      search: {},
      modal1Visible: false,
      modal2Visible: false,
      proList: {},
    	// produceList: [],
      // siteIds: "",
      // allList: [],
      // prodLine: '',
      // proIds: '',
      // backflushFlag: "",
      flags: '',
      // everyQty: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.refresh();

    dispatch({
      type: 'basicDataMaintenDistri/batchData',
    });

    dispatch({
      type: 'basicDataMaintenDistri/fetchHeadList',
    });
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

  @Bind()
  refresh = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    dispatch({
      type: 'basicDataMaintenDistri/fetchHeadList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
        pagination: {},
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  onResetSearch = () => {
    this.setState({
      pagination: {},
      search: {},
    });
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    this.setState(
      {
        pagination,
      },
      () => {
        this.refresh();
      }
    );
  }

  @Bind()
  exImportExcel() {
    openTab({
      key: `/hhme/basic-data-maintenance-of-distribution/data-import/WMS.DISTRIBUTION_BASIC`,
      title: intl.get('hwms.machineBasic.view.message.import').d('配送基础数据导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('配送基础数据导入'),
      }),
    });
  }

  /**
   * 新建数据
   */
  @Bind()
  handleCreateData() {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList = [], pagination = {}, defaultSite = {} },
    } = this.props;
    setTimeout(() => {
      this.state.proList = [];
    }, 800);
    if (dataList.length === 0 || (dataList.length > 0 && dataList[0]._status !== 'create')) {
      dispatch({
        type: 'basicDataMaintenDistri/updateState',
        payload: {
          dataList: [
            {
              siteId: defaultSite.siteId,
              siteCode: defaultSite.siteCode,
              siteName: defaultSite.siteName,
              materialCode: '',
              materialName: '',
              materialId: '',
              tightenedBatches: '',
              relaxationBatches: '',
              ngBatches: '',
              enableFlag: 'Y',
              _status: 'create',
              wmsDistributionBasicDataProductionLines: [
                {id: uuidv4(), everyQty: ''},
              ],
              flags: true,
            },
            ...dataList,
          ],
          pagination: addItemToPagination(dataList.length, pagination),
        },
      });
    }
    // this.state.proList.wmsDistributionBasicDataProductionLines = null ;
    // console.log(this.state.proList.wmsDistributionBasicDataProductionLines);
  }

  /**
   * 编辑数据
   */
  @Bind()
  handleEditData(record, flag) {
    this.state.flags=flag;
    const {
      dispatch,
      basicDataMaintenDistri: { dataList },
    } = this.props;
    const newList = dataList.map(item => {
      if (record.headerId === item.headerId) {
        return { ...item, _status: flag ? 'update' : '', flags: flag };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: { dataList: newList },
    });
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList, pagination = {} },
    } = this.props;
    const newList = dataList.filter(item => item.headerId !== record.headerId);
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: {
        dataList: newList,
        pagination: delItemToPagination(10, pagination),
      },
    });
  }

  /**
   * 取消行
   */
  @Bind()
  handleCancel(record) {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList },
    } = this.props;
    const newList = dataList.filter(item => item.transitionRuleId !== record.transitionRuleId);
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: {
        dataList: newList,
      },
    });
  }

  // 保存消息
  @Bind
  handleSaveData(record) {
    const { dispatch } = this.props;
    for(let i = 0; i < record.wmsDistributionBasicDataProductionLines.length; i++){
      // eslint-disable-next-line no-param-reassign
      record.wmsDistributionBasicDataProductionLines[i].prodLineId =record.wmsDistributionBasicDataProductionLines[i].productionLineId;
    }

    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'basicDataMaintenDistri/addHeadList',
          payload: {
            ...fieldsValue,
            headerId: record.headerId,
            materialId: record.materialId,
            materialName: record.materialName,
            materialGroupId: record.materialGroupId,
            lineList: record.wmsDistributionBasicDataProductionLines,
          },
        }).then(res => {
          if (res && res) {
            notification.success({ message: '操作成功！' });
            this.refresh();
          }
        });
      }
    });
  }

  // 保存消息
  @Bind
  handleSaveUpdateData(record) {
    const { dispatch } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'basicDataMaintenDistri/updateHeadList',
          payload: {
            ...fieldsValue,
            headerId: record.headerId,
            siteId: record.siteId,
            materialId: record.materialId,
            materialName: record.materialName,
            materialGroupId: record.materialGroupId,
            wmsDistributionBasicDataProductionLines: record.wmsDistributionBasicDataProductionLines,
          },
        }).then(res => {
          if (res && res) {
            notification.success({ message: '操作成功！' });
            this.refresh();
          }
        });
      }
    });
  }

  // lov 表格内联动传递值
  @Bind
  updateState = (value, record, index) => {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList = [] },
    } = this.props;
    dataList[index].materialName = record.materialName;
    dataList[index].materialCode = record.materialCode;
    dataList[index].materialId = record.materialId;
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: {
        dataList,
      },
    });
  };

  // lov 表格内联动传递值
  @Bind
  updateGroupState = (value, record, index) => {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList = [] },
    } = this.props;
    dataList[index].materialGroupId = record.itemGroupId;
    dataList[index].materialGroupCode = record.itemGroupCode;
    dataList[index].materialGroupDesc = record.itemGroupDescription;
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: {
        dataList,
      },
    });
  };

  // 设置必输项目
  @Bind
  changeDistributionType(value, index) {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList = [] },
    } = this.props;
    dataList[index].distributionType = value;
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: {
        dataList,
      },
    });
  }



  /**
   * 线性弹窗控制
   */
  setModal1Visible(modal1Visible, record) {
    if(!isEmpty(record)){
      this.state.proList = [];
      for(let i = 0; i< record.wmsDistributionBasicDataProductionLines.length; i++){
        // eslint-disable-next-line no-param-reassign
        record.wmsDistributionBasicDataProductionLines[i]._status = "update";
      }
      this.setState({
        proList: record,
      },
      () => {
        this.setState({
          modal1Visible,
        });
      });
    }else{
      this.setState({ modal1Visible });
    }
  }

  setModal1VisibleSave(modal1Visible) {
    const {
      dispatch,
      basicDataMaintenDistri: { dataList = [] },
    } = this.props;
    const newList = dataList.map(item => {
      if (this.state.proList.headerId === item.headerId) {
        // eslint-disable-next-line no-param-reassign
        item.wmsDistributionBasicDataProductionLines = this.state.proList.wmsDistributionBasicDataProductionLines;
        return { ...item };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'basicDataMaintenDistri/updateState',
      payload: { dataList: newList },
    });
    this.setState({ modal1Visible });
  }

  @Bind()
  handelBackflushFlagInputChange(e, record, index){
    this.state.proList.wmsDistributionBasicDataProductionLines[index].backflushFlag = (e === undefined || e===null || e==="") ?"": e;
  }

/** *********************** */
/**
 * 安全库弹窗
 */
setModal2Visible(modal2Visible, record) {
  if(!isEmpty(record)){
    this.state.proList = [];
    for(let i = 0; i< record.wmsDistributionBasicDataProductionLines.length; i++){
      // eslint-disable-next-line no-param-reassign
      record.wmsDistributionBasicDataProductionLines[i]._status = "create";
      // eslint-disable-next-line no-param-reassign
      // record.wmsDistributionBasicDataProductionLines[i].everyQty = 0;
    }
    // this.state.proList = record;
    // setTimeout(() => {
    // this.setState({ modal2Visible, proList: record });
    //   console.log("this.state.proList111");
    //   console.log(this.state.proList);
    // }, 10);
    this.setState({
      proList: record,
    },
    () => {
      this.setState({
        modal2Visible,
      });
    });
  }else{
    this.setState({ modal2Visible });
  }
  // setTimeout(() => {
  //   this.setState({ modal2Visible });
  // }, 10);
}

setModal2VisibleSave(modal2Visible) {
  const {
    dispatch,
    basicDataMaintenDistri: { dataList = [] },
  } = this.props;
  const newList = dataList.map(item => {
    if (this.state.proList.headerId === item.headerId) {
      // eslint-disable-next-line no-param-reassign
      item.wmsDistributionBasicDataProductionLines = this.state.proList.wmsDistributionBasicDataProductionLines;
      return { ...item };
    } else {
      return item;
    }
  });
  dispatch({
    type: 'basicDataMaintenDistri/updateState',
    payload: { dataList: newList },
  });
  this.setState({ modal2Visible });
}

/** ********************* */
  @Bind()
  handleGetFormValue() {
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  @Bind()
  handelEveryQtyInputChange(e, record, index){
    this.state.proList.wmsDistributionBasicDataProductionLines[index].everyQty = (e === undefined || e===null || e==="") ?"": e;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const enableFlagArr = [
      {
        value: 'Y',
        meaning: '是',
      },
      {
        value: 'N',
        meaning: '否',
      },
    ];

    const {
      dispatch,
      form,
      basicDataMaintenDistri: { dataList = [], pagination = {}, typeGroup = [] },
      fetchMessageLoading,
      addMessageLoading,
      updateMessageLoading,
    } = this.props;

    const { getFieldValue } = form;

    const filterProps = {
      typeGroup,
      enableFlagArr,
    };
    const{modal1Visible, modal2Visible, proList}= this.state;


    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        width: 80,
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点'),
        dataIndex: 'siteCode',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator('siteId', {
                  initialValue: record.siteId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteId`).d('站点'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.SITE"
                    textValue={record.siteCode}
                    queryParams={{ tenantId: getCurrentOrganizationId() }}
                    onChange={(value)=>{
                      form.setFieldsValue({
                        siteId: value,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.materialGroupCode`).d('物料组'),
        dataIndex: 'materialCategoryId',
        width: 120,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialGroupId`, {
                initialValue: record.materialGroupId,
              })(
                <Lov
                  textValue={record.materialGroupCode}
                  code="WMS.ITEM_GROUP"
                  onChange={(_, records) => this.updateGroupState(_, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            record.materialGroupCode
          ),
      },
      {
        title: intl.get(`${modelPrompt}.materialGroupDesc`).d('物料组描述'),
        dataIndex: 'materialGroupDesc',
        width: 180,
      },

      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: val,
              })(
                <Lov
                  textValue={record.materialCode}
                  code="QMS.MATERIAL"
                  onChange={(_, records) => this.updateState(_, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },

      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 180,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: record.materialVersion,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },

      {
        title: intl.get(`${modelPrompt}.prodLineId`).d('产线'),
        dataIndex: 'prodLineCodeList',
        width: 200,
        align: 'center',
        render: (val, record) =>{
          return(
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`prodLineCodeList`, {
                initialValue: record.prodLineIdStr,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.prodLineIdStr`).d('产线'),
                    }),
                  },
                ],
              })(<MultipleLov
                code="MT.PRODLINE"
                textValue={record.prodLineCodeList}
                queryParams={{ tenantId }}
                onChange={(value, item)=>{
                  form.setFieldsValue({
                    workcellId: "",
                    prodLineIdStr: value,
                  });
                  // eslint-disable-next-line no-param-reassign
                  record.workcellCode = "";
                  // this.state.proList = [];
                  // eslint-disable-next-line no-shadow
                  const proList = [];
                  for(let i = 0; i<item.length;i++){
                    const prodLineData = {
                      productionLineId: item[i].prodLineId,
                      productionLineCode: item[i].prodLineCode,
                      flags: record.flags,
                    };
                    proList.push(prodLineData);
                  }
                  // eslint-disable-next-line no-param-reassign
                  record.wmsDistributionBasicDataProductionLines = proList;
                  if(record._status === "update"){
                    // eslint-disable-next-line no-shadow
                    const newList = dataList.map(item => {
                      if (record.headerId === item.headerId) {
                        // eslint-disable-next-line no-param-reassign
                        item.wmsDistributionBasicDataProductionLines = proList;
                        return { ...item };
                      } else {
                        return item;
                      }
                    });
                    dispatch({
                      type: 'basicDataMaintenDistri/updateState',
                      payload: { dataList: newList },
                    });
                  }

                  if(record._status === "create"){
                    dataList[0].wmsDistributionBasicDataProductionLines = proList;
                    dispatch({
                      type: 'basicDataMaintenDistri/updateState',
                      payload: { dataList },
                    });
                  }
                  // this.state.proIds = value;
              }}
              />
            )}
            </Form.Item>
          ) : (
            val
          )
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.workcellId`).d('工段'),
        dataIndex: 'workcellCodes',
        width: 120,
        align: 'center',
        render: (val, record) =>{
        return(
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`workcellId`, {
              initialValue: record.workcellCode,
              rules: [
                {
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.workcellId`).d('工段'),
                  }),
                },
              ],
            })(<MultipleLov
              code="WMS.WORKCELL"
              textValue={record.workcellCode}
              queryParams={{ tenantId, siteId: isEmpty(getFieldValue('siteId'))?record.siteId: getFieldValue('siteId'), prodLineIds: isEmpty(getFieldValue('prodLineIdStr'))?record.prodLineIdStr: getFieldValue('prodLineIdStr') }}
              onChange={(value, item) => {
                for(let j =0; j<record.wmsDistributionBasicDataProductionLines.length; j++){
                  let flag = false;
                  for(let i = 0; i<item.length; i++){
                    if(record.wmsDistributionBasicDataProductionLines[j].productionLineId === item[i].prodLineId){
                      flag = true;
                      break;
                    }
                  }
                  if(!flag){
                    const prodLineData = {
                      productionLineCode: record.wmsDistributionBasicDataProductionLines[j].productionLineCode,
                      prodLineId: record.wmsDistributionBasicDataProductionLines[j].productionLineId,
                      siteId: null,
                      workcellCode: "",
                      workcellId: null,
                      workcellName: "",
                      everyQty: "",
                      backflushFlag: "",
                    };
                    item.push(prodLineData);
                  }
                }
               for(let i = 0; i<item.length; i++){

                if(record._status === "create"){
                  // eslint-disable-next-line no-param-reassign
                  item[i].everyQty = '';
                }
                // eslint-disable-next-line no-param-reassign
                item[i]._status = "update";
                // eslint-disable-next-line no-param-reassign
                item[i].flags = record.flags;
                // eslint-disable-next-line no-param-reassign
                item[i].productionLineId = item[i].prodLineId;

                // eslint-disable-next-line no-param-reassign
                item[i].productionLineCode = item[i].prodLineCode;
               }

               // eslint-disable-next-line no-param-reassign
               record.wmsDistributionBasicDataProductionLines = item;
               const newList = dataList.map(items => {
                 if (record.headerId === items.headerId) {
                  // eslint-disable-next-line no-param-reassign
                  items.wmsDistributionBasicDataProductionLines = item;
                   return { ...items };
                 } else {
                   return items;
                 }
               });
               dispatch({
                 type: 'basicDataMaintenDistri/updateState',
                 payload: { dataList: newList },
               });


               // this.state.proList = item
            }}
            />)
            }
          </Form.Item>
        ): (
          val
        )
        );
        },
      },
      {
        title: intl.get(`${modelPrompt}.distributionType`).d('配送策略'),
        dataIndex: 'distributionType',
        width: 120,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`distributionType`, {
                initialValue: val,
              })(
                <Select
                  onChange={vals => this.changeDistributionType(vals, index)}
                  style={{ width: '100%' }}
                >
                  {typeGroup.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (typeGroup.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '比例',
        dataIndex: 'proportion',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            record.distributionType === 'PROPORTION_DISTRIBUTION' ? (
              <Form.Item>
                {record.$form.getFieldDecorator(`proportion`, {
                  initialValue: record.proportion,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.proportion`).d('业务比例类型'),
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator(`proportion`, {
                  initialValue: record.proportion,
                })(<Input />)}
              </Form.Item>
            )
          ) : (
            val
          ),
      },
      {
        title: '库存水位',
        dataIndex: 'inventoryLevel',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            record.distributionType === 'MIN_MAX' ? (
              <Form.Item>
                {record.$form.getFieldDecorator(`inventoryLevel`, {
                  initialValue: record.inventoryLevel,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.inventoryLevel`).d('库存水位'),
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator(`inventoryLevel`, {
                  initialValue: record.inventoryLevel,
                })(<Input />)}
              </Form.Item>
            )
          ) : (
            val
          ),
      },
      // {
      //   title: '安全库存配送量',
      //   dataIndex: 'everyQty',
      //   width: 120,
      //   align: 'everyQty',
      //   render: (val, record) =>
      //     ['update', 'create'].includes(record._status) ? (
      //       record.distributionType === 'MIN_MAX' ? (
      //         <Form.Item>
      //           {record.$form.getFieldDecorator(`everyQty`, {
      //             initialValue: record.everyQty,
      //             rules: [
      //               {
      //                 required: true,
      //                 message: intl.get('hzero.common.validation.notNull', {
      //                   name: intl.get(`${modelPrompt}.everyQty`).d('安全库存配送量'),
      //                 }),
      //               },
      //             ],
      //           })(<Input />)}
      //         </Form.Item>
      //       ) : (
      //         <Form.Item>
      //           {record.$form.getFieldDecorator(`everyQty`, {
      //             initialValue: record.everyQty,
      //           })(<InputNumber />)}
      //         </Form.Item>
      //       )
      //     ) : (
      //       val
      //     ),
      // },
      {
        title: '安全库存配送量',
        dataIndex: 'everyQty',
        width: 200,
        align: 'center',
        render: (val, record) =>
        // ['update', 'create'].includes(record._status)? (
          <Button type="primary" onClick={() => this.setModal2Visible(true, record)}>库存维护</Button>,
        // ): (
        //   null
        // ),
      },
      {
        title: '线边库存计算逻辑维护',
        dataIndex: 'backflushFlag',
        width: 200,
        align: 'center',
        render: (val, record) =>{
          if(record.backItemFlag==='Y'){
            return(
              // ['update', 'create'].includes(record._status)? (
              <Tooltip title="反冲物料不参与线边库存计算"><Button type="primary" onClick={() => this.setModal1Visible(true)} disabled>线边库存计算逻辑维护</Button></Tooltip>
              // ): (
              //   val
              // )
            );
          }else{
          return(
        // ['update', 'create'].includes(record._status)? (
            <Button type="primary" onClick={() => this.setModal1Visible(true)}>线边库存计算逻辑维护</Button>
        // ): (
        //   val
        // )
          );
        }
        },
      },
      {
        title: '最小包装量',
        dataIndex: 'minimumPackageQty',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            record.distributionType === 'PACKAGE_ DELIVERY' ? (
              <Form.Item>
                {record.$form.getFieldDecorator(`minimumPackageQty`, {
                  initialValue: record.minimumPackageQty,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.minimumPackageQty`).d('最小包装量'),
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator(`minimumPackageQty`, {
                  initialValue: record.minimumPackageQty,
                })(<InputNumber />)}
              </Form.Item>
            )
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: val,
              })(
                <Select style={{ width: '100%' }}>
                  {enableFlagArr.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (enableFlagArr.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdatedByCode`).d('最后更新人'),
        dataIndex: 'lastUpdatedByCode',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateDate`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditData(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveUpdateData(record)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditData(record, true)}>
                {intl.get('tarzan.acquisition.transformation.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveData(record)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    /* 线边库计算 */
    const columns2 = [
      {
        title: intl.get(`${modelPrompt}.productionLineCode`).d('产线'),
        dataIndex: 'productionLineCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.workcellId`).d('工段'),
        dataIndex: 'workcellCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.backflushFlag`).d('是否启用线边库存计算'),
        dataIndex: 'backflushFlag',
        width: 90,
        align: 'center',
        render: (val, record, index) =>
        {
          return(
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`backflushFlag`, {
                initialValue: record.backflushFlag,
              })(
                <Select
                  style={{ width: '100%' }}
                  disabled={!this.state.proList.flags}
                  onChange={e => this.handelBackflushFlagInputChange(e, record, index)}
                >
                  {enableFlagArr.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (enableFlagArr.filter(ele => ele.value === val)[0] || {}).meaning
          )
          );
        },
      },
    ];
     /* 安全库存 */
     const columns3 = [
      {
        title: intl.get(`${modelPrompt}.productionLineCode`).d('产线'),
        dataIndex: 'productionLineCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.workcellCodes`).d('工段'),
        dataIndex: 'workcellCode',
        width: 120,
        align: 'center',
      },

      {
        title: '安全库存配送量',
        dataIndex: 'everyQty',
        width: 120,
        align: 'everyQty',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            (
              <Form.Item>
                {record.$form.getFieldDecorator(`everyQty`, {
                  initialValue: record.everyQty,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.everyQty`).d('安全库存配送量'),
                      }),
                    },
                  ],
                })(<InputNumber disabled={!this.state.proList.flags} onChange={e => this.handelEveryQtyInputChange(e, record, index)} />)}
              </Form.Item>
            )
          ) : (
            val
          ),
      },

      // {
      //   title: '安全库存配送量',
      //   dataIndex: 'everyQty',
      //   width: 120,
      //   align: 'center',
      //   render: (val, record) =>
      //   {
      //     console.log(record)
      //     return(
      //     ['update', 'create'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`everyQty`, {
      //             initialValue: record.everyQty,
      //           })(<InputNumber />)}
      //       </Form.Item>
      //     ) : (
      //       val
      //     )
      //     )
      //   }
      // },
     ];
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.acquisition.transformation.title.list').d('配送基础数据维护')}
        >
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-distribution-basic-datas/data-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
          <Button onClick={this.exImportExcel}>
            {intl.get('tarzan.acquisition.transformation.button.create').d('导入')}
          </Button>
          <Button icon="plus" type="primary" onClick={this.handleCreateData}>
            {intl.get('tarzan.acquisition.transformation.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm
            {...filterProps}
            onSearch={this.onSearch}
            onResetSearch={this.onResetSearch}
            onRef={this.handleBindRef}
          />
          <EditTable
            loading={fetchMessageLoading || addMessageLoading || updateMessageLoading}
            rowKey="id"
            dataSource={dataList}
            columns={columns}
            pagination={pagination || {}}
            onChange={this.handleTableChange}
            style={{ height: '200px' }}
            bordered
          />
          <ModalContainer ref={registerContainer} />
        </Content>
        {/* 线性边库弹窗 */}

        {modal1Visible && (
        <Modal
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1VisibleSave(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          <EditTable
            columns={columns2}
            dataSource={proList.wmsDistributionBasicDataProductionLines}
            rowKey="id"
            pagination={false}
            onChange={this.handleTableChange}
            bordered
          />
        </Modal>
)}
        {/* {安全库存配送量弹窗} */}
        {modal2Visible && (
        <Modal
          visible={this.state.modal2Visible}
          onOk={() => this.setModal2VisibleSave(false)}
          onCancel={() => this.setModal2Visible(false)}
        >
          <EditTable
            columns={columns3}
            dataSource={proList.wmsDistributionBasicDataProductionLines}
            rowKey="id"
            pagination={false}
            onChange={this.handleTableChange}
            bordered
          />
        </Modal>
)}
      </React.Fragment>
    );
  }
}
