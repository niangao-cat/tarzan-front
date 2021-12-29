/*
 * @Description: 物料信息
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-16 14:20:40
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-05 14:17:19
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Divider, Form, Input, Tooltip } from 'hzero-ui';
import scannerImageMat from '@/assets/scannerImageMat.png';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class MaterialsInfo extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  @Bind()
  onEnterDown(e) {
    const { form, sacnSourceCode } = this.props;
    if (e.keyCode === 13) {
      const materialLotCodeInput = document.querySelectorAll('#materialLotCode')[0];
      materialLotCodeInput.focus();
      materialLotCodeInput.select();
      sacnSourceCode(form.getFieldsValue());
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { materialsInfo = {} } = this.props;
    return (
      <div className={styles['materials-content']}>
        <div className={styles['materials-content-search']}>
          <Form onKeyDown={this.onEnterDown}>
            <Form.Item>
              {getFieldDecorator('materialLotCode')(
                <Input
                  size="large"
                  id="materialLotCode"
                  trimAll
                  prefix={<img style={{ width: '20px' }} src={scannerImageMat} alt="" />}
                />
              )}
            </Form.Item>
          </Form>
        </div>
        <div style={{ paddingTop: '10px' }} className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>物料名称：</div>
          <span className={styles['materials-content-value']}>
            <Tooltip title={materialsInfo.materialName}>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {materialsInfo.materialName}
              </div>
            </Tooltip>
          </span>
        </div>
        <div className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>SAP料号：</div>
          <span className={styles['materials-content-value']}>{materialsInfo.materialCode}</span>
        </div>
        <div className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>LOT：</div>
          <div className={styles['materials-content-value']}>
            <Tooltip title={materialsInfo.lot}>{materialsInfo.lot}</Tooltip>
          </div>
        </div>
        <div className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>&nbsp;供应商：</div>
          <span className={styles['materials-content-value']}>
            <Tooltip title={materialsInfo.supplierName}>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {materialsInfo.supplierName}
              </div>
            </Tooltip>
          </span>
        </div>
        <div className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>&nbsp;供应商批次：</div>
          <span className={styles['materials-content-value']}>
            <Tooltip title={materialsInfo.supplierLot}>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {materialsInfo.supplierLot}
              </div>
            </Tooltip>
          </span>
        </div>
        <div className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>单位：</div>
          <span className={styles['materials-content-value']}>{materialsInfo.uomCode}</span>
        </div>
        <Divider style={{ color: '#347DA7', margin: '0px'}} dashed />
        <div
          className={styles['materials-content-div']}
          style={{ float: 'left', width: '50%', padding: '0px' }}
        >
          <div
            className={styles['materials-content-label']}
            style={{ width: '105px', float: 'none' }}
          >
            待转移数量：
          </div>
          <div
            className={styles['materials-content-value']}
            style={{
              fontSize: '26px',
              marginTop: '9px',
              height: '100%',
              paddingLeft: '19px',
            }}
          >
            <Tooltip title={materialsInfo.totalTransferQty}>
              {materialsInfo.totalTransferQty}
            </Tooltip>
          </div>
        </div>
        <div
          className={styles['materials-content-div']}
          style={{ float: 'left', width: '50%', padding: '0px' }}
        >
          <div
            className={styles['materials-content-label']}
            style={{ float: 'none', width: '70px' }}
          >
            条码总数：
          </div>
          <div
            className={styles['materials-content-value']}
            style={{ fontSize: '26px', marginTop: '9px', height: '100%' }}
          >
            <Tooltip title={materialsInfo.totalQty}>
              {materialsInfo.totalQty}
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}
