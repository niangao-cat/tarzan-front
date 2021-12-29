
// OQC检验平台界面绘制
import React, { Component, Fragment } from 'react';
import { Content, Header } from 'components/Page';
import { connect } from 'dva';
import { Button, Col, Input, Row, Form, notification, Spin, Popconfirm, Modal } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import FilterForm from './FilterForm';
import TopFormInfo from './TopFormInfo';
import ListTableRow from './ListTableRow';
// eslint-disable-next-line no-unused-vars
import styles from './index.less';

@connect(({ oqcInspectPlat, loading }) => ({
  oqcInspectPlat,
  tenantId: getCurrentOrganizationId(),
  fetchListLoading: loading.effects['oqcInspectPlat/fetchList'],
  createDataLoading: loading.effects['oqcInspectPlat/createData'],
  saveDataLoading: loading.effects['oqcInspectPlat/saveData'],
  submitDataLoading: loading.effects['oqcInspectPlat/submitData'],
}))
@Form.create({ fieldNameProp: null })
export default class TicketManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      selectLine: {},
      search: {},
    };
  }

  filterForm;

  topForm;

  componentDidMount() {
    // 获取状态和数据
    const { dispatch } = this.props;

    // 查询头行信息
    dispatch({
      type: "oqcInspectPlat/init",
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'oqcInspectPlat/cleanModel',
    });
  }

  // 查询方法
  @Bind()
  onSearch(fields = {}) {
    // 设置接口调用参数
    const { dispatch, oqcInspectPlat: {headList= [], headListOld = []} } = this.props;
    const formData = this.topForm.getFieldsValue();
     // 查询之前判断是否录入了数据
     if((headList.inspectionResult||"")!==(formData.inspectionResult||"")||(headList.remark||"")!==(formData.remark||"")){
      Modal.confirm({
        title: '你有头信息修改未保存，是否确认查询？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.topForm.setFieldsValue({
            inspectionResult: "",
            remark: "",
          });
          // 查询数据
          dispatch({
            type: "oqcInspectPlat/fetchList",
            payload: {
              ...fields,
            },
          }).then(res=>{
            if(res){
              this.topForm.setFieldsValue({
                inspectionResult: res.inspectionResult,
                remark: res.remark,
              });
            }
            // this.setState({loading: false});
          });
        },
      });
     }else if(JSON.stringify(headList.lineList)===JSON.stringify(headListOld.lineList)){
        this.setState({/* loading: true, */ search: fields, selectLine: {}});
        this.topForm.setFieldsValue({
          inspectionResult: "",
          remark: "",
        });
        // 查询数据
        dispatch({
          type: "oqcInspectPlat/fetchList",
          payload: {
            ...fields,
          },
        }).then(res=>{
          if(res){
            this.topForm.setFieldsValue({
              inspectionResult: res.inspectionResult,
              remark: res.remark,
            });
            // this.setState({loading: false});
          }
        });
       }else{
        Modal.confirm({
          title: '你有行/明细修改未保存，是否确认查询？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.topForm.setFieldsValue({
              inspectionResult: "",
              remark: "",
            });
            // 查询数据
            dispatch({
              type: "oqcInspectPlat/fetchList",
              payload: {
                ...fields,
              },
            }).then(res=>{
              if(res){
                this.topForm.setFieldsValue({
                  inspectionResult: res.inspectionResult,
                  remark: res.remark,
                });
              }
              // this.setState({loading: false});
            });
          },
        });
       }
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

   // 行点击触发事件
   @Bind()
   onClickRow(record = {}) {
     this.setState({ selectLine: record});
   }

  // 保存数据
  @Bind
  handSaveData() {
    const {dispatch,
      oqcInspectPlat: { headList = []}} = this.props;
    // this.setState({loading: true});
    const formData = this.topForm.getFieldsValue();
    // 查询数据
    dispatch({
      type: "oqcInspectPlat/saveData",
      payload: {
        ...headList,
        ...formData,
      },
    }).then(()=>{
      // 重新查询
      dispatch({
        type: "oqcInspectPlat/fetchList",
        payload: {
          ...this.state.search,
        },
      }).then(()=>{
        // this.setState({loading: false});
      });
    });
  }

  // 提交
  @Bind
  handSubmitData() {
    const {dispatch,
      oqcInspectPlat: { headList = []}} = this.props;
      const formData = this.topForm.getFieldsValue();
    // this.setState({loading: true});
    // 查询数据
    dispatch({
      type: "oqcInspectPlat/submitData",
      payload: {
        ...headList,
        ...formData,
      },
    }).then(()=>{
      // 重新查询
      dispatch({
        type: "oqcInspectPlat/fetchList",
        payload: {
          ...this.state.search,
        },
      }).then(()=>{
        // this.setState({loading: false});
      });
    });
  }

  @Bind
  crateData(){
    const {dispatch,
    } = this.props;
    // this.setState({loading: true});
    // 查询数据
    dispatch({
      type: "oqcInspectPlat/createData",
      payload: {
        ...this.state.search,
      },
    }).then(()=>{
      // 重新查询
      dispatch({
        type: "oqcInspectPlat/fetchList",
        payload: {
          ...this.state.search,
        },
      }).then(res=>{
        // this.setState({loading: false});
        if(res){
          this.topForm.setFieldsValue({
            inspectionResult: res.inspectionResult,
            remark: res.remark,
          });
        }
      });
    });
  }

  // 创建明细数据
  @Bind
  handleCreate(){
    if(this.state.selectLine.oqcLineId===""||this.state.selectLine.oqcLineId===null||this.state.selectLine.oqcLineId===undefined){
      return notification.error({message: "请先选中要新增明细对应的行数据"});
    }else{
      const {
        dispatch,
        oqcInspectPlat: { headList = []},
      } = this.props;
      // 匹配对应的行
      for (let i = 0; i < headList.lineList.length; i++) {
        if(headList.lineList[i].oqcLineId ===this.state.selectLine.oqcLineId){
          // 判断是否有明细数据,有则连加
          if(headList.lineList[i].detailList.length>0){
            headList.lineList[i].detailList = [...headList.lineList[i].detailList, { detailId: `${headList.lineList[i].oqcLineId}-${Number(headList.lineList[i].detailList[headList.lineList[i].detailList.length-1].number)+10}`, number: (Number(headList.lineList[i].detailList[headList.lineList[i].detailList.length-1].number)+10), _status: 'create'}];
          }else{
            headList.lineList[i].detailList = [{ detailId: `${headList.lineList[i].oqcLineId}-10`, number: 10, _status: 'create'}];
          }
        }
      }
      dispatch({
        type: 'oqcInspectPlat/updateState',
        payload: {
          headList,
        },
      });
    }
  }

  @Bind
  handleBindTopRef(ref) {
    this.topForm = (ref.props || {}).form;
  }

  // 删除明细信息
  @Bind
  handleCleanLine(record){
    const {
      dispatch,
      oqcInspectPlat: { headList = []},
    } = this.props;
    // 匹配对应的行
    for (let i = 0; i < headList.lineList.length; i++) {
      if(headList.lineList[i].oqcLineId ===this.state.selectLine.oqcLineId){
         // 根据对应的临时主键显示对应的值
         for(let j=0; j<headList.lineList[i].detailList.length;j++){
          if(headList.lineList[i].detailList[j].detailId === record.detailId){
            headList.lineList[i].detailList.splice(j, 1);
          }
        }
      }
    }
    dispatch({
      type: 'oqcInspectPlat/updateState',
      payload: {
        headList,
      },
    });
  }

  // 变幻时调用更新
  @Bind()
  changeValueOne = (value, index, record) => {
    const {
      dispatch,
      oqcInspectPlat: {
        headList = {},
      },
    } = this.props;

    // 获取选中的数据并且改掉对应的明细信息

    for (let i = 0; i < headList.lineList.length; i++) {
      if (headList.lineList[i].oqcLineId === this.state.selectLine.oqcLineId) {
        // 根据对应的临时主键显示对应的值
        for(let j=0; j<headList.lineList[i].detailList.length;j++){
          if(headList.lineList[i].detailList[j].detailId === record.detailId){
            headList.lineList[i].detailList[j].result = value.target.value;
          }
        }
        // 设置合格范围
        const okRange = headList.lineList[i].standardFrom;
        // 设置 不合格上线
        const ngOver = headList.lineList[i].standardTo;

        // 判断明细的数据变化
        let changeStatusFlag = true;
        for(let j=0; j<headList.lineList[i].detailList.length;j++){
          if(headList.lineList[i].detailList[j].result===null||headList.lineList[i].detailList[j].result===undefined||headList.lineList[i].detailList[j].result===""||Number(headList.lineList[i].detailList[j].result)<Number(okRange)||Number(headList.lineList[i].detailList[j].result)>Number(ngOver)){
            changeStatusFlag = false;
          }
        }

        if(changeStatusFlag){
          headList.lineList[i].inspectionResult = "OK";
        }else{
          headList.lineList[i].inspectionResult = "NG";
        }
        dispatch({
          type: 'oqcInspectPlat/updateState',
          payload: {
            headList,
          },
        });
        break;
      }
    }

    // 判断行的值是否都为OK 是则 更改头信息
        // 最终更具变化的行信息  填写头信息
        let setHeadOkStatusFlag = true;
        let setHeadNgStatusFlag = true;
        for (let x = 0; x < headList.lineList.length; x++) {
          if (headList.lineList[x].inspectionResult !== 'OK') {
            setHeadOkStatusFlag = false;
          }
          if (
            headList.lineList[x].inspectionResult === '' ||
            headList.lineList[x].inspectionResult === null ||
            headList.lineList[x].inspectionResult === undefined
          ) {
            setHeadNgStatusFlag = false;
          }
        }

        if (setHeadOkStatusFlag) {
          headList.inspectionResultMeaning = 'OK';
          headList.inspectionResult = 'OK';
        } else if (setHeadNgStatusFlag) {
          headList.inspectionResultMeaning = 'NG';
          headList.inspectionResult = 'NG';
        }

        dispatch({
          type: 'oqcInspectPlat/updateState',
          payload: {
            headList,
          },
        });
  };

  @Bind
  changeValueTwo = (value, index, record) => {
    const {
      dispatch,
      oqcInspectPlat: {
        headList = {},
      },
    } = this.props;


    // 获取选中的数据并且改掉对应的明细信息
    for (let i = 0; i < headList.lineList.length; i++) {
      if (headList.lineList[i].oqcLineId === this.state.selectLine.oqcLineId) {
        // 根据对应的临时主键显示对应的值
        for(let j=0; j<headList.lineList[i].detailList.length;j++){
          if(headList.lineList[i].detailList[j].detailId === record.detailId){
            headList.lineList[i].detailList[j].remark = value.target.value;
          }
        }
        dispatch({
          type: 'oqcInspectPlat/updateState',
          payload: {
            headList,
          },
        });
        break;
      }
    }
  };

  // 回车跳掉下一栏
  @Bind()
  handleTurnToNextInput(e, index) {
    const className = document.getElementsByClassName("code-input");
    if (index + 1 < className.length) {
      className[index + 1].focus();
    }
  }


  render() {

    // 获取头行参数
    // const { oqcInspectPlat: { headList= {}, resultMap= [] }, fetchDataLoading } = this.props;
    const { oqcInspectPlat: { headList= {}, resultMap= [] }, fetchDataLoading, fetchListLoading, createDataLoading, saveDataLoading, submitDataLoading } = this.props;
    const { selectLine } = this.state;

    // 查询
    const filterFormProps = {
      onSearch: this.onSearch,
    };
    // 头信息展示
    const topFormInfoProps = {
      inspectHead: headList,
      resultMap,
    };

    // 行信息展示
    const listTableRowProps = {
      selectLine,
      // changeBackColor: this.changeBackColor,
      inspectLine: headList.lineList||[],
      resultMap,
      loading: fetchDataLoading,
      rowClick: this.onClickRow,
    };

    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={headList.inspectionStatus!=="NEW"}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title="'是否确认删除?'"
            onConfirm={() => this.handleCleanLine(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: '序号',
        width: 70,
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '结果值',
        width: 70,
        dataIndex: 'result',
        align: 'center',
        render: (val, record, index) => {
          return ['create', 'update'].includes(record._status) ?(
            <Input
              defaultValue={val}
              onChange={vals => this.changeValueOne(vals, index, record)}
              style={{ width: '100%' }}
              className='code-input'
              onPressEnter={e => {
                this.handleTurnToNextInput(e, index);
              }}
            />
          ):val;
        },
      },
      {
        title: '备注',
        width: 70,
        dataIndex: 'remark',
        align: 'center',
        render: (val, record, index) => {
          return ['create', 'update'].includes(record._status) ?(
            <Input
              defaultValue={val}
              onChange={vals => this.changeValueTwo(vals, index, record)}
              style={{ width: '100%' }}
            />
          ):val;
        },
      },
    ];

    return (
      <Fragment>
        {/* <Spin spinning={this.state.loading} size="large"> */}
        <Spin spinning={fetchListLoading || createDataLoading || saveDataLoading || submitDataLoading || false} size="large">
          <Header
            title={<span>OQC检验平台</span>}
          >
            <Button type="primary" onClick={this.handSubmitData} disabled={headList.inspectionStatusMeaning!=="新建"} style={{backgroundColor: (headList.inspectionStatusMeaning!=="新建")?"#D3D3D3":'' }}>提交</Button>
            <Button style={{ marginRight: '10px', backgroundColor: (headList.inspectionStatusMeaning!=="新建")?"#D3D3D3":'' }} onClick={this.handSaveData} disabled={headList.inspectionStatusMeaning!=="新建"}>保存</Button>
            <Button type="primary" style={{ marginRight: '10px' }} onClick={this.crateData}>
              创建
            </Button>
          </Header>
          <Content>
            <Row>
              <Col span={18} style={{ marginRight: '20px' }}>
                <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
                <TopFormInfo {...topFormInfoProps} onRef={this.handleBindTopRef} />
              </Col>
              <Col span={5}>
                <EditTable
                  bordered
                  rowKey="detailId"
                  columns={columns}
                  scroll={{ y: 225 }}
                  pagination={{pageSize: 5}}
                  dataSource={this.state.selectLine.detailList}
                  style={{ height: '225px' }}
                />
              </Col>
            </Row>
            <br />
            <br />
            <ListTableRow {...listTableRowProps} />
          </Content>
        </Spin>
      </Fragment>
    );
  }
}
