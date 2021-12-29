/*
 * @Description: 物料信息
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-12 10:33:30
 * @LastEditTime: 2020-10-10 16:53:51
 */

import React, { Component } from 'react';
import { Form, Input, Tooltip } from 'hzero-ui';
import scannerImageMat from '@/assets/scannerImageMat.png';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class MaterialsInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  onEnterDown(e) {
    const { form, scanSourceCode } = this.props;
    if (e.keyCode === 13) {
      const materialLotCodeInput = document.querySelectorAll('#materialLotCode')[0];
      materialLotCodeInput.focus();
      materialLotCodeInput.select();
      scanSourceCode(form.getFieldsValue());
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
                  prefix={<img style={{ width: '20px' }} src={scannerImageMat} alt="" />}
                  placeholder="请扫描条码"
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
          <div className={styles['materials-content-label']}>数量：</div>
          <span className={styles['materials-content-value']}>{materialsInfo.primaryUomQty} {materialsInfo.primaryUomCode}</span>
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
          <div className={styles['materials-content-label']}>有效期从：</div>
          <span className={styles['materials-content-value']}>{materialsInfo.dateTimeFrom}</span>
        </div>
        <div className={styles['materials-content-div']}>
          <div className={styles['materials-content-label']}>有效期至：</div>
          <span className={styles['materials-content-value']}>{materialsInfo.dateTimeTo}</span>
        </div>
        <div className={styles['materials-content-div']}>
          <div
            style={{
              color: isEmpty(materialsInfo) ? "none" : materialsInfo.openEffectiveTime ? "none" : "red",
            }}
            className={styles['materials-content-label']}
          >
            开封有效期：
          </div>
          <span className={styles['materials-content-value']}>{materialsInfo.openEffectiveTime}</span>
        </div>
        <div className={styles['materials-content-div']}>
          <div
            style={{
              color: isEmpty(materialsInfo) ? "none" : materialsInfo.openEffectiveUom ? "none" : "red",
            }}
            className={styles['materials-content-label']}
          >
            开封有效期单位：
          </div>
          <span className={styles['materials-content-value']}>{materialsInfo.openEffectiveUom}</span>
        </div>
      </div>
    );
  }
}
