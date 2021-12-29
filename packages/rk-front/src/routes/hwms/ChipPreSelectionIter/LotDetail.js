// 批次详情
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, Table } from 'hzero-ui';
import { SEARCH_FORM_CLASSNAME, SEARCH_FORM_ROW_LAYOUT } from 'utils/constants';
import Lov from 'components/Lov';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { isFunction } from 'lodash';
import styles from './index.less';


@connect(({ chipPreSelection, loading }) => ({
  chipPreSelection,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['chipPreSelection/queryDataByLot'],
  saveLoading: loading.effects['chipPreSelection/doInBoxNew'],
}))
@Form.create({ fieldNameProp: null })
export default class LotDetail extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  @Bind()
  doInBox() {
    // 传入对应的数据
    const { doInBox } = this.props;
    doInBox(this.props.form.getFieldValue('toMaterialLotCode'), this.props.form.getFieldValue('materialLotCode'));
  }

  // 库位转移
  @Bind
  handleLocationMove() {
    const { form, handleLocationMove } = this.props;
    form.validateFields((err, val) => {
      if (val.locatorId && val.toMaterialLotCode && handleLocationMove) {
        handleLocationMove(val.locatorId, val.toMaterialLotCode);
      } else {
        notification.error({ message: '目标盒子号、筛选后库位不能为空！' });
      }
    });
  }

  // 查询对应的信息
  @Bind()
  queryLotData(value) {
    const { dispatch, paginationMap, doSetPage, doSetSelectedRowKey } = this.props;
    // 暂存查询条件
    doSetPage({pageSize: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10});

    // 查询数据
    dispatch({
      type: 'chipPreSelection/queryDataByLot',
      payload: {
        selectLot: value,
        size: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
      },
    }).then(res=>{
      if(res){
        const data = res.content;
        if(data&&data.length>0){
          // 获取第一条数据, 通过第一条获取对应虚拟号的数据
          const firstData = data[0];
          const restData = data.filter(item=>item.virtualNum === firstData.virtualNum);
          const count = Math.ceil(restData.length/8);
          // 再和7行进行向下取整
          const lineCount = Math.floor(7/count);
          let selectedRowKeys = [];
          let selectedData = [];
          for(let i=0; i<(lineCount*(restData.length)<data.length?lineCount*(restData.length):data.length); i++){
            if(data[i].status!=="LOADED"){
              selectedRowKeys = [...selectedRowKeys, data[i].selectionDetailsId];
              selectedData = [...selectedData, data[i]];
            }
          }
          doSetSelectedRowKey(selectedRowKeys, selectedData);
        }
      }
    });
  }

  // 查询对应的信息
  @Bind()
  queryLotDataByPagination(page) {
    const { dispatch, doSetPage } = this.props;

    // 暂存查询条件
    doSetPage(page);

    // 查询数据
    dispatch({
      type: 'chipPreSelection/queryDataByLot',
      payload: {
        selectLot: this.props.form.getFieldValue('materialLotCode'),
        page,
      },
    });
  }


  // 改变中部底色
  @Bind
  changeBackColor(record) {
    if (!record.changeBackColor) {
      return styles['data-click-chip-lter'];
    } else {
      return '';
    }
  }

  /**
   * 导出查询条件
   */
  @Bind()
  handleGetFormValue() {
    return filterNullValueObject({ selectLot: this.props.form.getFieldValue('materialLotCode') });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      dataSource,
      updateMaterialLotCode,
      expandUpColseData,
      form,
      rowsSelection,
      fetchLoading,
      saveLoading,
      materialLotCode,
      paginationMap,
      pagination,
      workcellInfo,
    } = this.props;
    const { getFieldDecorator } = form;
    // 获取表单的字段属性
    let columns = [
      {
        title: '序号',
        width: 60,
        render: (value, record, index) => index + 1,
      },
      {
        title: '原盒子号',
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: '原盒位置',
        dataIndex: 'oldLoad',
        width: 90,
      },
      {
        title: '目标条码',
        dataIndex: 'targetMaterialLotCode',
        width: 150,
      },
      {
        title: '新盒位置',
        dataIndex: 'newLoad',
        width: 90,
      },
      {
        title: '热沉编号',
        dataIndex: 'hotSinkCode',
        width: 120,
      },
      {
        title: '虚拟号',
        dataIndex: 'virtualNum',
        width: 80,
      },
      {
        title: '路数',
        dataIndex: 'ways',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 80,
      },
    ];
    const dynamicColumns = dataSource.length>0?dataSource[0].functionList.map((item, index)=>{ return {
      title: `${item.title}`,
      dataIndex: `a${index}`,
      width: 80,
    };}):[];

    columns = [ ...columns, ...dynamicColumns];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1500}
        onCancel={expandUpColseData}
        onOk={() => updateMaterialLotCode()}
        visible={expandDrawer}
        footer={null}
        title="批次详情"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="挑选批次">
                {getFieldDecorator(
                  'materialLotCode',
                  {
                    initialValue: materialLotCode,
                  }
                )(
                  <Lov
                    isInput
                    onChange={this.queryLotData}
                    code="HME.SELECT_LOT"
                    queryParams={{ tenantId: getCurrentOrganizationId() }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="目标盒子号">
                {getFieldDecorator('toMaterialLotCode', {})(<Input />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="筛选后库位">
                {getFieldDecorator('locatorId', {})(
                  <Lov
                    code="HME.LOCATOR_COS"
                    queryParams={{
                      tenantId: getCurrentOrganizationId(),
                      prodLineId: workcellInfo.prodLineId,
                     }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Button loading={saveLoading} type="primary" onClick={this.doInBox}>
                  确认装入
                </Button>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Button loading={saveLoading} type="primary" onClick={() => this.handleLocationMove()}>
                  库位转移
                </Button>
              </Form.Item>
            </Col>
            <Col span={2}>
              <div style={{ marginTop: '6px' }}>
                <ExcelExport
                  exportAsync
                  requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-pre-selections/select-lot-information`} // 路径
                  otherButtonProps={{ type: 'primary' }}
                  queryParams={this.handleGetFormValue()}
                />
              </div>
            </Col>
          </Row>
        </Form>
        <div className="stopTableChipLterLot">
          <Table
            columns={columns}
            bordered
            loading={fetchLoading}
            pagination={{ ...pagination, defaultPageSize: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10, pageSizeOptions: paginationMap.length > 0 ? paginationMap.map(item => Number(item.value)) : [] }}
            dataSource={dataSource}
            rowKey="selectionDetailsId"
            rowClassName={this.changeBackColor}
            rowSelection={rowsSelection}
            onChange={page => this.queryLotDataByPagination(page)}
          />
        </div>
      </Modal>
    );
  }
}
