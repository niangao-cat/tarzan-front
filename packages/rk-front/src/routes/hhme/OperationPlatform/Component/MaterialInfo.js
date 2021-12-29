import React, { Component, Fragment } from 'react';
import { Table, Checkbox, Input, Icon, Button, Row, Col, Form, Tooltip, InputNumber, Modal, Dropdown } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';

import ReturnMaterialModal from './ReturnMaterialModal';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.execute.model.execute';

export default class MaterialInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: {},
      virtualVisible: false,
      useSourceFlag: 'N',
      virtualNumSelectedRows: [],
    };
  }

  @Bind()
  handleScanBarcode(e) {
    const itemCode = e.target.value;
    const { onScanBarcode } = this.props;
    // if(modelName === 'firstProcessPlatform') {
    //   // TODO
    //   onFetchIsContainer(itemCode).then(res => {
    //     if(res && !isNull(res.containerId)) {
    //       onFetchMaterialLotList({}, { tenantId, itemCode }).then(materialLotList => {
    //         if(materialLotList) {
    //           this.setState({ visible: true });
    //         }
    //       });
    //     } else {
    //       firstProcessSerialItem(itemCode );
    //     }
    //   });
    // } else {
    onScanBarcode(itemCode);
    // }
  }

  @Bind()
  handleCheckMaterialBox(checked, materialTypes) {
    const { onCheckMaterialBox } = this.props;
    if (onCheckMaterialBox) {
      onCheckMaterialBox(checked, materialTypes);
    }
  }

  @Bind()
  handleFeedMaterialItem() {
    const { onFeedMaterialList, modelName, materialSelectedRows, onFetchVirtualList, barCodeSelectedRows } = this.props;
    const virtualNumList = materialSelectedRows.filter(e => e.cosMaterialLotFlag === 'Y');
    if (modelName === 'firstProcessPlatform' && virtualNumList.length > 0) {
      let materialLotCodeList = [];
      virtualNumList.forEach(e => {
        const selectedBarCodeList = barCodeSelectedRows.filter(i => ['repairPlatform'].includes(modelName) ? e.materialId === i.materialId : e.lineNumber === i.lineNumber && e.materialId === i.materialId);
        if (selectedBarCodeList.length > 0) {
          materialLotCodeList = materialLotCodeList.concat(selectedBarCodeList.map(i => i.materialLotCode));
        }
      });
      onFetchVirtualList(materialLotCodeList).then(res => {
        if (res) {
          this.setState({ virtualVisible: true });
        }
      });
    } else {
      onFeedMaterialList();
    }
  }

  @Bind()
  handleRefreshMaterialItemList() {
    const { onRefreshMaterialItemList } = this.props;
    if (onRefreshMaterialItemList) {
      onRefreshMaterialItemList();
    }
  }

  @Bind()
  renderColor(record) {
    const { dataSource } = this.props;
    let materialCodeClassName = '';
    let selectedCountClassName = '';
    let timingClassName = '';
    const componentMaterial = dataSource.find(e => record.componentMaterialId === e.materialId) || {};
    const componentMaterialList = dataSource.filter(e => record.componentMaterialId === e.componentMaterialId);
    if (record.isSubstitute === 'Y') {
      materialCodeClassName = styles['material-list-line-yellow'];
    }
    // 替代组中， 若存在一个物料的勾选总量大于主料的将投量 替代组所有物料显示白色， 若所有的物料的勾选总量大于主料的将投量，替代组主料显示共色
    if ((componentMaterialList.every(e => !isUndefined(componentMaterial.willReleaseQty) && (e.selectedSnQty || 0) < componentMaterial.willReleaseQty) && record.materialId === componentMaterial.materialId && record.lineNumber === componentMaterial.lineNumber)) {
      selectedCountClassName = styles['material-list-line-red'];
    }
    if (record.timing === '00:00:00') {
      timingClassName = styles['material-list-line-timing'];
    }
    return classNames(materialCodeClassName, selectedCountClassName, timingClassName);
  };

  @Bind()
  handleExpand(expand, record) {
    const { onUpdateExpandedRowKeys } = this.props;
    if (onUpdateExpandedRowKeys) {
      onUpdateExpandedRowKeys(expand, record);
    }
  }

  //  设置filters数据
  @Bind()
  filterTransForm(filters = [], type) {
    const transFilter = [];
    filters.forEach(filter => {
      transFilter.push({
        text: filter.description,
        value: filter[type],
      });
    });

    return transFilter;
  };

  @Bind()
  getColumnSearchProps(type) {
    const { filteredInfo = {} } = this.state;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} className={styles.dropDown}>
          <Input
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filteredValue: filteredInfo[type] || null,
    };
  };


  @Bind()
  handleFetchFeedingRecord(type) {
    const { onFetchFeedingRecord } = this.props;
    if (onFetchFeedingRecord) {
      onFetchFeedingRecord(type);
    }
  }

  @Bind()
  handleCloseVirtualModal() {
    this.setState({ virtualVisible: false });
  }

  @Bind()
  handleConfirmVirtualFeedMaterial() {
    const { onFeedMaterialList, materialSelectedRows, barCodeSelectedRows } = this.props;
    const { virtualNumSelectedRows, useSourceFlag } = this.state;
    const virtualNumList = materialSelectedRows.filter(e => e.cosMaterialLotFlag === 'Y');
    const virtualIdList = virtualNumSelectedRows.map(e => e.virtualId);
    if (barCodeSelectedRows.some(e => moment(e.deadLineDate).diff(moment(), 'seconds') < 0 && e.materialType === 'TIME')) {
      onFeedMaterialList({ ...virtualNumList[0], materialType: 'LOT', virtualIdList, useSourceFlag });
    } else if (onFeedMaterialList && virtualIdList.length !== 0) {
      // 选择虚拟号以后进行投料，蛟哥说cosMaterialLotFlag === 'Y‘ 只会有一条物料
      onFeedMaterialList({ ...virtualNumList[0], materialType: 'LOT', virtualIdList, useSourceFlag }).then(res => {
        if (res) {
          this.setState({
            virtualNumSelectedRows: [],
          });
          this.handleCloseVirtualModal();
        }
      });
    }
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ virtualNumSelectedRows: selectedRows });
  }

  @Bind()
  renderVirtualModal() {
    const {
      virtualNumList,
      fetchVirtualNumListLoading,
    } = this.props;
    const { virtualNumSelectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: virtualNumSelectedRows.map(e => e.virtualId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
      getCheckboxProps: record => ({
        disabled: record.enableFlag !== 'Y',
      }),
    };
    const columns = [
      {
        title: '虚拟号',
        width: 150,
        dataIndex: 'virtualNum',
      },
      {
        title: '芯片位置',
        width: 100,
        dataIndex: 'chipLocation',
      },
      {
        title: '热沉号',
        width: 100,
        dataIndex: 'hotSinkCode',
        render: (val, record) => (
          <Dropdown overlay={(
            <div className={styles['operationPlatform_drop-down']}>
              {record.detailList.map(e => (
                <div>{e.hotSinkCode}</div>
              ))}
            </div>
          )}
          >
            <a href="#">
              {val}<Icon type="down" />
            </a>
          </Dropdown>
        ),
      },
      {
        title: '数量',
        width: 100,
        dataIndex: 'quantity',
      },
      {
        title: '产品类型',
        width: 100,
        dataIndex: 'productCodeMeaning',
      },
      {
        title: '绑定工单',
        width: 100,
        dataIndex: 'workOrderNum',
      },
      {
        title: '已投料SN',
        width: 100,
        dataIndex: 'eoIdentification',
      },
      {
        title: '有效性',
        width: 100,
        dataIndex: 'enableFlagMeaning',
      },
    ];
    return (
      <Table
        bordered
        loading={fetchVirtualNumListLoading}
        rowKey="virtualId"
        dataSource={virtualNumList}
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
      />
    );
  }

  @Bind()
  handleChangeRowKey(data) {
    const { modelName } = this.props;
    const rowKey = modelName === 'repairPlatform' ? `${data.materialLotId}` : `${data.jobMaterialId}#${data.productionType}`;
    return rowKey;
  }

  @Bind()
  handleChangeUseSourceFlag(e) {
    this.setState({ useSourceFlag: e.target.checked });
  }


  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      dataSource,
      baseInfo = {},
      rowSelection = {},
      barCodeRowSelection = {},
      materialSelectedRows,
      loading,
      expandedRowKeys = [],
      selectedRows = [],
      onReturnMaterial,
      returnLoading,
      returnMaterialLoading,
      onClearFeedingRecordList,
      feedingRecordList,
      modelName,
      workCellInfo = {},
    } = this.props;
    const { virtualVisible, useSourceFlag } = this.state;
    const returnMaterialModalProps = {
      baseInfo,
      selectedRows,
      modelName,
      returnLoading,
      returnMaterialLoading,
      onClearFeedingRecordList,
      operationId: isEmpty(workCellInfo) ? null : workCellInfo.operationIdList[0],
      onReturnMaterial,
      dataSource: feedingRecordList,
      disabled: (['lotOperationPlatform'].includes(modelName) && !selectedRows.length > 0) || (!['repairPlatform'].includes(modelName) && baseInfo.siteOutDate) || isEmpty(baseInfo),
      onSearch: this.handleFetchFeedingRecord,
    };
    const newDataSource = dataSource.filter(e => e.virtualComponentFlag !== 'X');
    const expandedRowRender = record => {
      const columns = [
        {
          title: intl.get(`${modelPrompt}.lineNumber`).d('序号'),
          dataIndex: 'lineNumber',
          width: 30,
          render: (val, data, index) => index + 1,
        },
        {
          title: intl.get(`${modelPrompt}.substituteGroup`).d('条码'),
          dataIndex: 'materialLotCode',
          width: 80,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('数量'),
          dataIndex: 'primaryUomQty',
          width: 30,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('供应商批次'),
          dataIndex: 'supplierLot',
          width: 70,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('批次'),
          dataIndex: 'lot',
          width: 70,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.materialCode`).d('倒计时'),
          dataIndex: 'timing',
          width: 70,
          align: 'left',
        },
      ];

      return (
        <Table
          columns={columns}
          rowKey={data => this.handleChangeRowKey(data)}
          dataSource={record.materialLotList}
          rowSelection={barCodeRowSelection}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('行'),
        dataIndex: 'lineNumber',
        width: 30,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentCode`).d('类型'),
        width: 40,
        align: 'left',
        dataIndex: 'productionType',
        render: (val, record) => modelName === 'repairPlatform' ? record.materialType : record.productionType,
        // ...this.getColumnSearchProps('bomComponentCode'),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料'),
        width: 70,
        dataIndex: 'materialCode',
        className: styles['material-list-line-material-code'],
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料描述'),
        width: 90,
        dataIndex: 'materialName',
        render: (val) => (
          <Tooltip title={val}>
            {val}
          </Tooltip>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.uomCode`).d('单位'),
        width: 40,
        align: 'left',
        dataIndex: 'uomCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('版本'),
        dataIndex: 'materialVersion',
        width: 60,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.substituteGroup`).d('替代组'),
        dataIndex: 'substituteGroup',
        width: 50,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('单位量'),
        dataIndex: 'qty',
        width: 50,
      },
      {
        title: intl.get(`${modelPrompt}.requirementQty`).d('需求量'),
        dataIndex: 'requirementQty',
        width: 50,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.willReleaseQty`).d('将投量'),
        dataIndex: 'willReleaseQty',
        width: 80,
        render: (value, record) =>
          ['update'].includes(record._status) && ((!['lotOperationPlatform'].includes(modelName) && baseInfo.reworkFlag === 'Y') || (['singleOperationPlatform'].includes(modelName) && record.qtyAlterFlag === 'Y') || ['repairPlatform'].includes(modelName)) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('willReleaseQty', {
                initialValue: value,
                rules: [
                  {
                    validator: (rule, val, callback) => {
                      if (val > record.qtyAlterLimit && record.qtyAlterFlag === 'Y') {
                        callback(`当前将投数量大于${record.qtyAlterLimit}`);
                      }
                      callback();
                    },
                  },
                ],
              })(
                <InputNumber style={{ width: '100%' }} min={0} />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.releasedQty`).d('已投量'),
        dataIndex: 'releasedQty',
        width: 50,
      },
      {
        title: intl.get(`${modelPrompt}.selectedSnCount`).d('勾选总量/条数'),
        dataIndex: 'selectedSnCount',
        width: 80,
        render: (val, record) => `${record.selectedSnQty || 0}/${record.selectedSnCount || 0}`,
        className: styles['material-list-line-selected-count'],
      },
      {
        title: intl.get(`${modelPrompt}.stepDesc`).d('倒计时'),
        dataIndex: 'timing',
        width: 100,
        className: styles['material-list-line-timing-red'],
      },
    ];
    return (
      <Fragment>
        <Row style={{ width: '100%' }} className={styles['operationPlatform_material-info-content']}>
          <Col span={7}>
            <div className={styles['operationPlatform_material-info-input']}>
              <Form.Item label="条码扫描" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                <Input
                  className="operation-platform-material-barcode"
                  onPressEnter={this.handleScanBarcode}
                  disabled={baseInfo.siteOutDate && !baseInfo.siteInDate && ['singleOperationPlatform'].includes(modelName)}
                />
              </Form.Item>
            </div>
          </Col>
          {['lotOperationPlatform'].includes(modelName) && (
            <Fragment>
              <Col span={4}>
                <div className={styles['operationPlatform_material-info-checkbox']}>
                  <Checkbox
                    style={{ marginLeft: '12px' }}
                    disabled={dataSource.filter(e => ['SN'].includes(e.productionType) && !isEmpty(e.materialLotList)).length === 0 || (['lotOperationPlatform'].includes(modelName) && selectedRows.length > 1)}
                    indeterminate={materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['SN'].includes(e.productionType)).length !== materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length}
                    onChange={(e) => this.handleCheckMaterialBox(e.target.checked, ['SN'])}
                    checked={materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['SN'].includes(e.productionType)).length === materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length}
                  >
                    序列号全选
                  </Checkbox>
                </div>
              </Col>
              <Col span={5}>
                <div className={styles['operationPlatform_material-info-checkbox']}>
                  <Checkbox
                    indeterminate={materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length !== materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length}
                    onChange={(e) => this.handleCheckMaterialBox(e.target.checked, ['TIME', 'LOT'])}
                    checked={materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length === materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length}
                  >
                    批次/时效物料全选
                  </Checkbox>
                </div>
              </Col>
            </Fragment>
          )}
          <Col span={7}>
            <Button
              disabled={(['lotOperationPlatform'].includes(modelName) && !selectedRows.length > 0) || (!['repairPlatform'].includes(modelName) && baseInfo.siteOutDate) || isEmpty(baseInfo)}
              type="primary"
              loading={loading}
              style={{ margin: '8px 10px 0 8px' }}
              onClick={this.handleFeedMaterialItem}
            >
              投料
            </Button>
            <ReturnMaterialModal {...returnMaterialModalProps} />
            {!['repairPlatform'].includes(modelName) && (
              <Button
                type="default"
                onClick={this.handleRefreshMaterialItemList}
                disabled={!baseInfo.siteInDate}
                style={{ marginLeft: '8px', marginTop: '8px' }}
              >
                刷新投料
              </Button>
            )}
          </Col>
          <Col span={24}>
            <div className={classNames(styles['head-table'], styles['material-list-line'])}>
              <EditTable
                columns={columns}
                expandedRowRender={expandedRowRender}
                dataSource={newDataSource}
                pagination={false}
                rowKey={record => ['repairPlatform'].includes(modelName) ? `${record.materialId}` : `${record.materialId}#${record.lineNumber}`}
                bordered
                rowClassName={this.renderColor}
                rowSelection={rowSelection}
                loading={loading}
                scroll={{ x: tableScrollWidth(columns), y: 300 }}
                expandedRowKeys={expandedRowKeys}
                onExpand={this.handleExpand}
              />
            </div>
            {modelName === 'firstProcessPlatform' && (
              <Modal
                destroyOnClose
                width={600}
                title='确认COS芯片虚拟号'
                visible={virtualVisible}
                footer={(
                  <Fragment>
                    <Checkbox onChange={this.handleChangeUseSourceFlag} defaultChecked={useSourceFlag === 'Y'} checkedValue='Y' unCheckedValue='N'>使用源数据</Checkbox>
                    <Button
                      type="primary"
                      loading={loading}
                      style={{ marginLeft: '10px', marginRight: '8px' }}
                      onClick={() => this.handleConfirmVirtualFeedMaterial()}
                    >
                      确认
                    </Button>
                    <Button
                      type="danger"
                      loading={loading}
                      onClick={() => this.handleCloseVirtualModal()}
                    >
                      取消
                    </Button>
                  </Fragment>
                )}
              >
                {this.renderVirtualModal()}
              </Modal>
            )}
          </Col>
        </Row>
      </Fragment>

    );
  }
}
