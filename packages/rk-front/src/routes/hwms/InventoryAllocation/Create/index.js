/**
 * @Description: 库存调拨创建
 * @author: ywj
 * @date 2020/3/25 12:03
 * @version 1.0
 */

// 引入依赖
import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Button as ButtonPermission } from 'components/Permission';
import { Card, Form, Select, InputNumber, Input, Modal } from 'hzero-ui';
import Lov from 'components/Lov';
import queryString from 'querystring';
import { addItemToPagination, getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Filter from './FilterForm';
import { getSiteId } from '@/utils/utils';

const tenantId = getCurrentOrganizationId();

// 暂定模板
const modelPormt = 'hawk.tarzan.inventory-allocation';

// 连接model
@connect(({ inventoryAllocation, loading }) => ({
  inventoryAllocation,
  fetchLineLoading: loading.effects['inventoryAllocation/fetchLineList'],
  deleteLoading: loading.effects['inventoryAllocation/deleteSelectedList'],
  saveLoading: loading.effects['inventoryAllocation/saveData'],
}))
@formatterCollections({
  code: 'hawk.tarzan.inventory-allocation',
})
export default class InventoryAllocation extends React.Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      search: {},
      createHead: {},
    };
  }

  // 加载时调用的方法
  // 加载时调用的方法
  componentDidMount() {
    // 加载下拉框
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryAllocation/init',
    });
    dispatch({
      type: 'inventoryAllocation/querySiteList',
      payload: {},
    });
    dispatch({
      type: 'inventoryAllocation/queryCreateWarehouseList',
      payload: {
        siteId: getSiteId(),
        toWarehouseGlag: 'Y',
      },
    });
    dispatch({
      type: 'inventoryAllocation/queryCreateWarehouseList',
      payload: {
        siteId: getSiteId(),
        fromWarehouseGlag: 'Y',
      },
    });
    dispatch({
      type: 'inventoryAllocation/queryCreateTableLocatorList',
      payload: {},
    });
  }

  // 重置
  resetSearch = () => {
    this.setState({
      search: {},
      pagination: {},
    });
  };

  // 改变值
  @Bind()
  changeExesetting(value, index) {
    const {
      inventoryAllocation: { lineCreateList = [] },
      dispatch,
    } = this.props;
    lineCreateList[index].excessSetting = value;

    if(value === "N"){
      lineCreateList[index].excessValue = 0;
    }
    if(value === "M"){
      lineCreateList[index].excessValue = 1;
    }
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList: [...lineCreateList],
      },
    });
  }

  // 更新物料
  @Bind()
  updateMaterial(records, index){
   const {
     inventoryAllocation: { lineCreateList = [] },
     dispatch,
   } = this.props;
   const tableList = lineCreateList;
   tableList[index].materialId = records.materialId;
   // 判断物料和仓库是否有数据 有则查询 无则报错
   if(records.materialId!==''&&records.materialId!==null&&records.materialId!==undefined&&tableList[index].fromWarehouseId!==''&&tableList[index].fromWarehouseId!==null&&tableList[index].fromWarehouseId!==undefined){
     dispatch({
       type: 'inventoryAllocation/showQuantity',
       payload: [{
         index,
         materialId: tableList[index].materialId,
         toStorageId: tableList[index].fromWarehouseId,
         toLocatorId: tableList[index].fromLocatorId,
       }],
     }).then(res=>{
       if(res){
         res.forEach((item=>{
           tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
         }));
         dispatch({
           type: 'inventoryAllocation/updateState',
           payload: {
            lineCreateList: [...tableList],
           },
         });
       }
     });
   }else{
     dispatch({
       type: 'inventoryAllocation/updateState',
       payload: {
        lineCreateList: [...tableList],
       },
     });
   }
  }


  // 更新物料
  @Bind()
  updateFromLocator(records, index){
   const {
     inventoryAllocation: { lineCreateList = [] },
     dispatch,
   } = this.props;
   const tableList = lineCreateList;
   tableList[index].fromLocatorId = records.locatorId;
   // 判断物料和仓库是否有数据 有则查询 无则报错
   if(records.locatorId!==''&&records.locatorId!==null&&records.locatorId!==undefined&&tableList[index].materialId!==''&&tableList[index].materialId!==null&&tableList[index].materialId!==undefined){
     dispatch({
       type: 'inventoryAllocation/showQuantity',
       payload: [{
         index,
         materialId: tableList[index].materialId,
         toStorageId: tableList[index].fromWarehouseId,
         toLocatorId: tableList[index].fromLocatorId,
       }],
     }).then(res=>{
       if(res){
         res.forEach((item=>{
           tableList[`${item.index}`].onhandQuantity = item.onhandQuantity;
         }));
         dispatch({
           type: 'inventoryAllocation/updateState',
           payload: {
            lineCreateList: [...tableList],
           },
         });
       }
     });
   }else{
     dispatch({
       type: 'inventoryAllocation/updateState',
       payload: {
        lineCreateList: [...tableList],
       },
     });
   }
  }


  // 新建
  @Bind()
  handleCreate() {
    // 获取表格数据
    const formDatas = this.form.getFieldsValue();

    // 校验 必输项
    if (formDatas.fromSiteId === ""||formDatas.fromSiteId === null||formDatas.fromSiteId === undefined) {
      return notification.error({ message: "工厂必输" });
    }

    if (formDatas.fromWarehouseId === ""||formDatas.fromWarehouseId === null||formDatas.fromWarehouseId === undefined) {
      return notification.error({ message: "来源仓库必输" });
    }

    if (formDatas.instructionType === ""||formDatas.instructionType === null||formDatas.instructionType === undefined) {
      return notification.error({ message: "单据类型必输" });
    }

    if (formDatas.toWarehouseId === ""||formDatas.toWarehouseId === null||formDatas.toWarehouseId === undefined) {
      return notification.error({ message: "目标仓库必输" });
    }

    // 判断创建的来源与目标的仓库是否相同 相同则报错
    if (formDatas.fromWarehouseId === formDatas.toWarehouseId) {
      return notification.error({ message: "单据的来源仓库与目标仓库相同，请选择不同仓库" });
    }


    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [], lineCreatePaginationList = {} },
    } = this.props;
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList: [
          ...lineCreateList,
          {
            id: lineCreateList.length + 1,
            instructionLineNum: lineCreateList.length > 0 ? Number(lineCreateList[lineCreateList.length - 1].instructionLineNum) + 10 : 10,
            fromSiteId: formDatas.fromSiteId,
            fromWarehouseId: formDatas.fromWarehouseId,
            fromWarehouseCode: formDatas.fromWarehouseCode,
            fromLocatorId: formDatas.fromLocatorId,
            fromLocatorCode: formDatas.fromLocatorCode,
            toSiteId: formDatas.fromSiteId,
            excessSetting: 'N',
            toWarehouseId: formDatas.toWarehouseId,
            toWarehouseCode: formDatas.toWarehouseCode,
            toLocatorId: formDatas.toLocatorId,
            toLocatorCode: formDatas.toLocatorCode,
            _status: 'create',
          },
        ],
        lineCreatePaginationList: addItemToPagination(
          lineCreateList.length,
          lineCreatePaginationList
        ),
      },
    });
  }

  // 删除
  @Bind
  deleteSelected(index) {
    const {
      inventoryAllocation: { lineCreateList = [] },
      dispatch,
    } = this.props;
    lineCreateList.splice(index, 1);
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList: [...lineCreateList],
      },
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 编辑消息
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList },
    } = this.props;
    const newList = lineCreateList.map(item => {
      if (record.id === item.id) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: { lineCreateList: newList },
    });
  }

  // 保 存消息
  @Bind
  handleSave() {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    const { createHead } = this.state;
    const params = getEditTableData(lineCreateList, ['children', 'id']);
    if (params.length <= 0) {
      return notification.error({ message: "单据必须要有行信息！！" });
    }
    // 判断是否有行信息  没有则报错
    if (lineCreateList.length <= 0) {
      return notification.error({ message: "单据必须要有行信息！！" });
    }

    const formDatas = this.form.getFieldsValue();
    if (params[0].quantity > params[0].onhandQuantity) {
      Modal.confirm({
        title: '调拨数量大于库存现有量，是否确定保存？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          // 调用保存方法
          dispatch({
            type: 'inventoryAllocation/saveData',
            payload: {
              instructionDocStatus: '',
              instructionDocType: formDatas.instructionType,
              instructionDocId: createHead.instructionDocId,
              remark: formDatas.remark,
              siteId: formDatas.fromSiteId,
              ...formDatas,
              lineDTOList: params.filter(item => item._status === 'create'),
            },
          }).then(res => {
            if (res) {
              this.setState({ createHead: res });
              // 重新查询行数据
              dispatch({
                type: 'inventoryAllocation/fetchLineCreateList',
                payload: {
                  sourceInstructionId: res.instructionDocId,
                },
              });
              notification.success();
            } else if (res) {
              notification.error({
                message: res.message,
              });
            }
          });
        },
      });
    } else {
      // 调用保存方法
      dispatch({
        type: 'inventoryAllocation/saveData',
        payload: {
          instructionDocStatus: '',
          instructionDocType: formDatas.instructionType,
          instructionDocId: createHead.instructionDocId,
          remark: formDatas.remark,
          siteId: formDatas.fromSiteId,
          ...formDatas,
          lineDTOList: params.filter(item => item._status === 'create'),
        },
      }).then(res => {
        if (res) {
          this.setState({ createHead: res });
          // 重新查询行数据
          dispatch({
            type: 'inventoryAllocation/fetchLineCreateList',
            payload: {
              sourceInstructionId: res.instructionDocId,
            },
          });
          notification.success();
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  }

  // 取消行
  @Bind()
  handleCancel(record) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    const newList = lineCreateList.filter(item => item.functionId !== record.functionId);
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList: newList,
      },
    });
  }

  // 刷新行信息
  @Bind
  refreshLine(pagination) {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'inventoryAllocation/fetchLineList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // 设置站点数据数据
  @Bind
  setFromSiteId(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    lineCreateList[index].fromSiteId = vals;
    lineCreateList[index].toSiteId = vals;
    lineCreateList[index].siteId = vals;
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList,
      },
    });
  }

  // 设置站点数据数据
  @Bind
  setToSiteId(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    lineCreateList[index].toSiteId = vals;
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList,
      },
    });
  }

  // 设置货位下拉数据
  @Bind
  setFromWarehouseMap(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    dispatch({
      type: 'inventoryAllocation/queryCreateTableWarehouseList',
      payload: {
        siteId: lineCreateList[index].fromSiteId,
        fromWarehouseGlag: 'Y',
      },
    });
  }

  // 设置货位下拉数据
  @Bind
  setToWarehouseMap(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    dispatch({
      type: 'inventoryAllocation/queryCreateTableWarehouseList',
      payload: {
        siteId: lineCreateList[index].toSiteId,
        toWarehouseGlag: 'Y',
      },
    });
  }

  // 设置货位数据数据
  @Bind
  setFromWarehouseId(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    lineCreateList[index].fromWarehouseId = vals;
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList,
      },
    });
  }

  // 设置货位数据数据
  @Bind
  setToWarehouseId(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    lineCreateList[index].toWarehouseId = vals;
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList,
      },
    });
  }

  // 设置货位下拉数据
  @Bind
  setFromLocatorMap(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    dispatch({
      type: 'inventoryAllocation/queryCreateTableLocatorList',
      payload: {
        locatorId: lineCreateList[index].fromWarehouseId,
        fromLocatorGlag: 'Y',
      },
    });
  }

  // 设置货位下拉数据
  @Bind
  setToLocatorMap(vals, records, index) {
    const {
      dispatch,
      inventoryAllocation: { lineCreateList = [] },
    } = this.props;
    dispatch({
      type: 'inventoryAllocation/queryCreateTableLocatorList',
      payload: {
        locatorId: lineCreateList[index].toWarehouseId,
        toLocatorGlag: 'Y',
      },
    });
  }

  render() {
    // 获取加载的状态
    const {
      inventoryAllocation: {
        lineCreateList = [], // 行信息
        siteMap = [], // 站点
        statusMap = [], // 单据状态
        typeMap = [], // 单据类型
        warehouseMap = [], // 仓库
        locatorMap = [], // 貨位
        fromCreateWarehouseMap = [],
        executeMap= [],
        toCreateWarehouseMap = [],
        fromCreateLocatorMap = [],
        toCreateLocatorMap = [],
      },
      saveLoading,
      match,
      location: { search },
    } = this.props;
    // 设置查询条件所需的
    const searchFromProps =
    {
      lineCreateList,
      siteMap: siteMap || [],
      statusMap: statusMap || [],
      typeMap: typeMap || [],
      warehouseMap: warehouseMap || [],
      locatorMap: locatorMap || [],
      fromCreateWarehouseMap,
      toCreateWarehouseMap,
      fromCreateLocatorMap,
      toCreateLocatorMap,
      createHead: this.state.createHead,
      resetSearch: this.resetSearch,
    };
    const { access_token: accessToken } = queryString.parse(search.substring(1));
    const columns = [
      {
        title: intl.get(`${modelPormt}.instructionNum`).d('行号'),
        width: 70,
        dataIndex: 'instructionLineNum',
        render: (val) => val,
      },
      {
        title: intl.get(`${modelPormt}.materialCode`).d('物料'),
        width: 150,
        dataIndex: 'materialCode',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPormt}.materialCode`).d('物料编码'),
                    }),
                  },
                ],
                initialValue: record.materialId,
              })(
                <Lov
                  code="QMS.MATERIAL"
                  textValue={val}
                  queryParams={{ tenantId }}
                  onChange={(value, records) => {
                    this.updateMaterial(records, index);
                    record.$form.setFieldsValue({
                      materialName: records.materialName,
                      uomCode: records.uomCode,
                      uomId: records.uomId,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPormt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialName`, {})(<Input disabled />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPormt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: val,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              record.materialVersion
            ),
      },
      {
        title: intl.get(`${modelPormt}.uomName`).d('单位'),
        width: 70,
        dataIndex: 'uomCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`uomCode`, {})(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`uomId`, {})(<Input disabled />)}
              </Form.Item>
            </span>
          ) : (
              record.uomCode
            ),
      },
      {
        title: intl.get(`${modelPormt}.quantity`).d('调拨数量'),
        width: 80,
        align: 'center',
        dataIndex: 'quantity',
        render: (value, record) => ['create', 'update'].includes(record._status) ?(
          <Form.Item>
            {record.$form.getFieldDecorator(`quantity`, {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPormt}.quantity`).d('调拨数量'),
                  }),
                },
              ],
              initialValue: value,
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </Form.Item>
        ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPormt}.excessSetting`).d('超发设置'),
        dataIndex: 'excessSetting',
        width: 120,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('excessSetting', {
                initialValue: record.excessSetting,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPormt}.excessSetting`).d('超发设置'),
                    }),
                  },
                ],
              })(
                <Select onChange={vals=>this.changeExesetting(vals, index)} allowClear style={{ width: '100%' }}>
                  {executeMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (executeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`${modelPormt}.excessValue`).d('超发值'),
        dataIndex: 'excessValue',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('excessValue', {
                initialValue: val,
              })(<InputNumber disabled={record.excessSetting==="N"||record.excessSetting==="M"} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPormt}.fromWarehouseId`).d('来源仓库'),
        width: 120,
        dataIndex: 'fromWarehouseCode',
      },
      {
        title: intl.get(`${modelPormt}.fromLocatorId`).d('来源货位'),
        width: 150,
        dataIndex: 'fromLocatorId',
        render: (val, record, index) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`fromLocatorId`, {
              initialValue: record.fromLocatorId,
            })(
              <Lov
                textValue={record.fromLocatorCode}
                code="WMS.ADJUST_LOCATOR_REL"
                queryParams={{ tenantId, parentLocatorId: record.fromWarehouseId}}
                onChange={(_, records) => this.updateFromLocator(records, index)}
              />
            )}
          </Form.Item>
        ) : (
          record.fromLocatorCode
        ),
      },
      {
        title: intl.get(`${modelPormt}.toLocatorId`).d('库存量'),
        dataIndex: 'onhandQuantity',
        width: 150,
      },
      {
        title: intl.get(`${modelPormt}.toWarehouseId`).d('目标仓库'),
        width: 120,
        dataIndex: 'toWarehouseCode',
      },
      {
        title: intl.get(`${modelPormt}.toLocatorId`).d('目标货位'),
        width: 150,
        dataIndex: 'toLocatorId',
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`toLocatorId`, {
              initialValue: record.toLocatorId,
            })(
              <Lov
                textValue={record.toLocatorCode}
                code="WMS.ADJUST_LOCATOR_REL"
                queryParams={{ tenantId, parentLocatorId: record.toWarehouseId}}
              />
            )}
          </Form.Item>
        ) : (
          record.toLocatorCode
        ),
      },
      {
        title: intl.get(`${modelPormt}.fromSiteId`).d('工厂'),
        width: 100,
        dataIndex: 'fromSiteId',
        render: (val) =>
          (
            (siteMap.filter(ele => ele.siteId === val)[0] || {}).siteCode
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (_, record, index) => (
          <span className="action-link">
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.deleteSelected(index)}>
                  {intl.get('hzero.common.button.delete').d('删除')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <div>
        <Header
          backPath={
            match.path.indexOf('/private') === 0
              ? `/private/hwms/inventory-allocation/list?access_token=${accessToken}`
              : '/hwms/inventory-allocation/list'
          }
          title={intl.get(`${modelPormt}.view.title`).d('库存调拨创建界面')}
        >
          <ButtonPermission
            type="search"
            style={{ backcolor: 'green' }}
            icon="save"
            onClick={this.handleSave}
            loading={saveLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </ButtonPermission>
          <ButtonPermission icon="plus" type="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </ButtonPermission>
        </Header>
        <Content>
          <Filter onRef={this.onRef} {...searchFromProps} />
          <Card
            key="code-rule-header"
            title={intl.get(`${modelPormt}.view.line`).d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <EditTable
              bordered
              rowKey="id"
              dataSource={lineCreateList}
              pagination={false}
              columns={columns}
            />
          </Card>
        </Content>
      </div>
    );
  }
}
