/**
 * LotOperationPlatform - 批量工序作业平台
 * @date: 2020/06/29 19:08:28
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Button, Form, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { Header } from 'components/Page';

import { isEmpty } from 'lodash';
import LocationInfoModal from '../../Component/LocationInfoModal';
import BackMaterialInfoModal from '../../Component/BackMaterialInfoModal';
import ESopModal from '../../Component/ESopModal';

import styles from '../../Component/index.less';

@Form.create({ fieldNameProp: null })
export default class Lot extends PureComponent {

  @Bind()
  handleFetchBaseInfo(e) {
    const { onFetchBaseInfo, modelName } = this.props;
    if (onFetchBaseInfo && modelName === 'lotOperationPlatform') {
      onFetchBaseInfo({
        snNum: e.target.value,
        batchProcessSnScanFlag: 'Y',
      });
    } else if(onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: e.target.value,
      });
    }
  }

  @Bind()
  handleInitData() {
    const { onInitData, form } = this.props;
    if(onInitData) {
      onInitData(false);
    }
    form.resetFields(['snNum']);
  }

  @Bind()
  handleOutSite(info = {}) {
    const { onOutSite } = this.props;
    if (onOutSite) {
      onOutSite(info);
    }
  }

  @Bind()
  handleOpenModal() {
    const { onOpenModal } = this.props;
    if(onOpenModal) {
      onOpenModal();
    }
  }

  @Bind()
  openBadHandTab() {
    const { openBadHandTab } = this.props;
    if(openBadHandTab) {
      openBadHandTab();
    }
  }

  @Bind()
  openProductTraceability() {
    const { openProductTraceability } = this.props;
    if(openProductTraceability) {
      openProductTraceability();
    }
  }



  render() {
    const {
      title,
      baseInfo,
      tenantId,
      disabled,
      esopList,
      esopPagination,
      onFetchLocationInfo,
      locatorTypeList,
      workCellInfo,
      locationList,
      locationPagination,
      fetchLocationInfoLoading,
      backMaterialList,
      backMaterialPagination,
      fetchBackMaterialInfoLoading,
      fetchESopListLoading,
      onFetchBackMaterialInfo,
      onFetchESopList,
      form: { getFieldDecorator },
      openToolingManagement,
    } = this.props;
    const locationInfoModalProps = {
      onFetchLocationInfo,
      locatorTypeList,
      workCellInfo,
      dataSource: locationList,
      pagination: locationPagination,
      loading: fetchLocationInfoLoading,
    };
    const backMaterialInfoModalProps = {
      dataSource: backMaterialList,
      pagination: backMaterialPagination,
      loading: fetchBackMaterialInfoLoading,
      onSearch: onFetchBackMaterialInfo,
    };

    const esopModalProps = {
      tenantId,
      onFetchESopList,
      dataSource: esopList,
      pagination: esopPagination,
      workCellInfo,
      loading: fetchESopListLoading,
      style: { marginRight: '8px' },
    };
    return (
      <Header title={title}>
        <Row style={{ width: '100%' }}>
          <Col span={10}>
            <div className={styles['operationPlatform_header-title']}>
              <div className={styles['operationPlatform_header-title-input']}>
                <Form.Item label="SN号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('snNum')(
                    <Input
                      className="operation-platform-sn-num"
                      onPressEnter={this.handleFetchBaseInfo}
                      disabled={!baseInfo.siteOutDate && baseInfo.siteInDate && ['singleOperationPlatform'].includes(this.modelName) || disabled}
                    />
              )}
                </Form.Item>
              </div>
              <Button onClick={() => this.handleInitData()} type="default" style={{ marginRight: '8px'}}>
              清空
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleOutSite({ outSiteAction: 'COMPLETE'})}
                disabled={baseInfo.siteOutDate}
                className={styles['base-button-completed']}
              >
                完成
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleOpenModal()}
                style={{ marginLeft: '8px'}}
              >
                条码列表
              </Button>
            </div>
          </Col>
          <Col span={14}>
            <Button
              type="default"
              onClick={() => this.openBadHandTab()}
              style={{ marginRight: '12px' }}
            >
              不良统计
            </Button>
            <Button
              type="default"
              style={{ marginRight: '12px' }}
            >
              异常反馈
            </Button>
            <Button
              type="default"
              onClick={() => this.openProductTraceability()}
              style={{ marginRight: '12px' }}
            >
              制造履历
            </Button>
            <Button
              type="default"
              style={{ marginRight: '12px' }}
              onClick={() => openToolingManagement()}
            >
              工装管理
            </Button>
            <ESopModal {...esopModalProps} />
            {!isEmpty(workCellInfo) && (
              <LocationInfoModal {...locationInfoModalProps} style={{ marginRight: '12px' }} />
            )}
            {!isEmpty(baseInfo) && (
              <BackMaterialInfoModal {...backMaterialInfoModalProps} />
            )}
          </Col>
        </Row>
      </Header>
    );
  }
}

