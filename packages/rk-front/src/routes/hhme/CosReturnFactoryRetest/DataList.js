/*
 * @Description: 批次物料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-21 16:47:34
 * @LastEditTime: 2021-02-05 09:19:27
 */
import React, { Component } from 'react';
import { Tooltip, Spin } from 'hzero-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';


export default class DataList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      itemList = [],
      loading,
    } = this.props;
    return (
      <div className={styles['cos-return-factory-data-list-style']}>
        <div className={styles['station-item']}>
          <Spin spinning={loading || false}>
            <div className={styles['station-item-content']}>
              <Scrollbars style={{ height: '600px' }}>
                {itemList.map((e, index) => {
                  return (
                    <div
                      className={styles['martial-content']}
                      style={{
                        cursor: e.equipmentId ? 'pointer' : 'auto',
                      }}
                    >
                      <span
                        className={styles['martial-orderSeq']}
                      >
                        {index + 1}
                      </span>
                      <div
                        className={styles['martial-center']}
                        style={{ borderRight: 0 }}
                      >
                        <Tooltip title={e.materialCode}>
                          <div
                            className={styles['martial-name']}
                          >
                            {e.materialCode}
                          </div>
                        </Tooltip>
                        <Tooltip title={e.materialLotCode}>
                          <div
                            className={styles['martial-code']}
                          >
                            {e.materialLotCode}
                          </div>
                        </Tooltip>
                      </div>
                      <div
                        className={styles['martial-right']}
                      >
                        {e.primaryUomQty}
                      </div>
                    </div>
                  );
                })}
              </Scrollbars>
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}
