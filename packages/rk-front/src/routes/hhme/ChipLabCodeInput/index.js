/*
 * @Description: 芯片不良记录
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:06:44
 * @LastEditTime: 2021-03-09 16:55:28
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Spin, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';
import { isEmpty } from 'lodash';

import { Header, Content } from 'components/Page';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';

import BottomForm from './Component/BottomForm';
import ChipContainerMap from '@/components/ChipContainerMap';
import ChipList from '@/components/ChipList';
import { upperCaseChars } from '@/utils/utils';
import styles from './index.less';


@connect(({ chipLabCodeInput, loading }) => ({
  chipLabCodeInput,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosChipMove/getSiteList'],
  siteOutLoading: loading.effects['chipLabCodeInput/siteOut'],
}))
export default class ChipLabCodeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'chipLabCodeInput/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'chipLabCodeInput/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipLabCodeInput/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        defaultSite: {},
        equipmentList: [], // 设备列表
        ncList: [], // 不良列表
        containerInfo: {}, // 容器信息
        selectInfo: [], // 选中单元格的信息
        selectChipInfo: {}, // 选中芯片的信息
        ncRecordList: [], // 选中芯片的不良记录
      },
    });
  }

  /**
   * @description: 扫描条码
   * @param {type} params
   */
  @Bind()
  scanMaterialCode(vals) {
    const {
      dispatch,
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'chipLabCodeInput/scanMaterialCode',
      payload: vals.materialLotCode,
    }).then(res => {
      if (res) {
        // this.fetchContainerInfo(res.transCosType);
      }
      this.setState({ spinning: false });
    });
  }

  // 点击单元格，初始化芯片列表
  @Bind()
  // eslint-disable-next-line no-unused-vars
  clickPosition(dataSource, _position, _index, selectFlag) {
    const { dispatch, chipLabCodeInput: { containerInfo } } = this.props;
    this.chipListChild.clearData();
    dispatch({
      type: 'chipLabCodeInput/updateState',
      payload: {
        selectInfo: dataSource,
        selectChipInfo: {},
        ncRecordList: [],
        containerInfo: {
          ...containerInfo,
          chipLabCode: dataSource[dataSource.length - 1].chipLabCode,
          chipLabRemark: dataSource[dataSource.length - 1].chipLabRemark,
        },
      },
    });
  }

  /**
   * @description: 多选列
   * @param {object} ncList 格子数据
   */
  @Bind()
  onClickBarCol(col, ncList) {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipLabCodeInput/updateState',
      payload: {
        selectChipInfo: {
          ...ncList.length === 1 ? ncList[0] : {},
          loadNum: col,
        },
      },
    });
  }

  // 出站
  @Bind()
  handleConfirm(info) {
    const { dispatch, chipLabCodeInput: { selectInfo } } = this.props;
    dispatch({
      type: 'chipLabCodeInput/confirm',
      payload: {
        ...info,
        materialLotLoadIdList: selectInfo.map(e => e.materialLotLoadId).filter(e => !isEmpty(e)),
      },
    }).then(res => {
      if (res && res.failed) {
        notification.warning({ description: res.message });
      } else {
        this.bottomForm.resetFields();
        this.chipListChild.clearData();
        notification.success();
      }
    });
  }


  // 重置功能
  @Bind
  resetChipContainerMap() {
    this.chipContainerMapChild.clearCustomizelocation();
    this.chipListChild.clearData();
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'chipLabCodeInput/updateState',
      payload: {
        selectInfo: [],
        selectChipInfo: {
          loadNum: [],
        },
      },
    });
  }

  @Bind
  selectAll() {
    const {
      chipLabCodeInput: {
        containerInfo = {},
      },
      dispatch,
    } = this.props;
    const { materialLotLoadList = [] } = containerInfo;
    const arr = [];
    const selectInfo = [];
    materialLotLoadList.forEach(item => {
      if (item.materialLotLoadId) {
        arr.push(`${upperCaseChars()[item.loadRow - 1]}${item.loadColumn}`);
        selectInfo.push({ ...item });
      }
    });
    this.chipContainerMapChild.selectAll(arr, selectInfo);
    dispatch({
      type: 'chipLabCodeInput/updateState',
      payload: {
        selectInfo,
        selectChipInfo: {
          loadNum: [],
        },
      },
    });
  }

  @Bind()
  exImportExcel() {
    openTab({
      key: `/hhme/chip-nc-record-platform/data-import/HME_LOAD_UNTIE`,
      title: '装载信息卸载',
      search: queryString.stringify({
        action: '装载信息卸载',
      }),
    });
  }


  render() {
    const {
      chipLabCodeInput: {
        containerInfo = {},
        selectInfo = [],
      },
      siteOutLoading,
    } = this.props;
    const { materialLotLoadList = [], locationRow, locationColumn, chipNum } = containerInfo;
    const { spinning } = this.state;
    const bottomFormProps = {
      containerInfo,
      siteOutLoading,
      selectInfo,
      onConfirm: this.handleConfirm,
      onRef: node => {
        this.bottomForm = node.props.form;
      },
      scanMaterialCode: this.scanMaterialCode,
    };
    const chipListProps = {
      onRef: node => {
        this.chipListChild = node;
      },
    };
    const chipContainerMapProps = {
      onRef: node => {
        this.chipContainerMapChild = node;
      },
    };
    return (
      <Fragment>
        <Header title="芯片实验代码录入" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={spinning}>
            <Row className={styles.chipLabCodeInput_content}>
              <Col span={9}>
                <BottomForm {...bottomFormProps} />
              </Col>
              {!isEmpty(containerInfo) && (
                <Fragment>
                  <Col span={9} style={{ padding: '0px 5px' }}>
                    <ChipContainerMap
                      formFlag={false}
                      clickPosition={this.clickPosition}
                      popconfirm={false}
                      dataSource={materialLotLoadList}
                      locationRow={locationRow}
                      locationColumn={locationColumn}
                      scrollbarsHeight="330px"
                      multiple
                      {...chipContainerMapProps}
                    />
                  </Col>
                  <Col span={6}>
                    <ChipList
                      capacity={selectInfo.length > 0 ? selectInfo[selectInfo.length - 1].cosNum : 0}
                      totalCapacity={chipNum}
                      docList={selectInfo.length > 0 ? selectInfo[selectInfo.length - 1].docList : []}
                      onClickBarCol={this.onClickBarCol}
                      clicklocation={this.chipContainerMapChild && this.chipContainerMapChild.state.customizelocation}
                      barPositionOrPosition={false}
                      multiple
                      {...chipListProps}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Button
                        type="primary"
                        onClick={() => this.selectAll()}
                      >
                        全选
                      </Button>
                      <Button
                        onClick={() => this.resetChipContainerMap()}
                        style={{ marginLeft: '8px' }}
                      >
                        重置
                      </Button>
                    </div>
                  </Col>
                </Fragment>
              )}

            </Row>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
