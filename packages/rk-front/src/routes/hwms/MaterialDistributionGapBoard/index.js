import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Divider, Spin, Button } from 'hzero-ui';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  FullScreenContainer,
} from '@jiaminghi/data-view-react';
import { IndexPageStyle, IndexPageContent } from './style';
import './index.less';
import TableList from './TableList';
import ProdLineModal from './ProdLineModal';
import { exitFullscreen, fullScreenEnabled, launchFullscreen } from './util';
import './flexible';


const MaterialDistributionGapBoard = props => {
  const [isFullFlag, setIsFullFlag] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prodLineId, setProdLineId] = useState(null);
  const [tablePage, setTablePage] = useState(0); // 表格分页存储
  const [time, setTime] = useState(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  const [endTime, setEndTime] = useState(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));

  // 设定时间和刷新的数据的时间
  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setIsFullFlag(document.fullscreenElement);
    });
    setInterval(() => {
      setTime(() => {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      });
    }, 1000);
    setInterval(() => {
      setTablePage(n => {
        return n + 1;
      });
      setEndTime(() => {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      });
    }, 600000);
    setInterval(() => {
      setTablePage(() => {
        return 0;
      });
    }, 900000);
    // 查询列表数据
    queryTableList({ page: 0, prodLineId });
    handleFetchProdLineList();
    handleFetchSiteCode();
  }, []);

  useEffect(() => {
    queryTableList({ tablePage, prodLineId });
  }, [tablePage]);

  // 查询日产线配送任务进度
  const queryTableList = (fields = {}) => {
    const { dispatch, materialDistributionGapBoard } = props;
    const { totalPages } = materialDistributionGapBoard;
    if (totalPages > 0) {
      if (fields.page === totalPages) {
        setTablePage(0);
        return;
      }
    }
    dispatch({
      type: 'materialDistributionGapBoard/fetchList',
      payload: {
        ...fields,
        size: 15,
      },
    });
  };

  // 查询默认工厂
  const handleFetchSiteCode = () => {
    const { dispatch } = props;
    dispatch({
      type: 'materialDistributionGapBoard/siteInfo',
    });
  };

  const handleFetchProdLineInfo = (prodLineIds) => {
    setProdLineId(prodLineIds);
    queryTableList({ page: 0, prodLineId: prodLineIds });
    setVisible(false);
  };

  const handleFetchProdLineList = (page = {}, fields = {}) => {
    const { dispatch } = props;
    dispatch({
      type: 'materialDistributionGapBoard/fetchProdLineList',
      payload: {
        ...fields,
        page,
      },
    });
  };

  /**
   * 全屏
   */
  const screenFull = () => {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: '暂不支持全屏',
      });
      return;
    }
    setIsFullFlag(!isFullFlag);
    if (!isFullFlag) {
      const chartDom = document.getElementById('material-distribution-gap-board');
      launchFullscreen(chartDom);
    } else {
      exitFullscreen();
    }
  };
  const { materialDistributionGapBoard, fetchListLoading, tenantId, fetchProdLineListLoading } = props;
  const {
    number,
    totalPages,
    numberOfElements,
    totalElements,
    tableList,
    siteInfo,
    prodLineList,
    prodLinePagination,
  } = materialDistributionGapBoard;
  const prodLineModalProps = {
    visible,
    tenantId,
    loading: fetchProdLineListLoading,
    dataSource: prodLineList,
    pagination: prodLinePagination,
    onSearch: handleFetchProdLineList,
    onCloseModal: setVisible,
    onFetchProdLineInfo: handleFetchProdLineInfo,
  };
  return (
    <div id='acceptedPuted'>
      <FullScreenContainer>
        <IndexPageStyle>
          <IndexPageContent>
            <div className="material-distribution-gap-board" id="material-distribution-gap-board">
              <div className="title-box">
                <div className="title-time">{time}</div>
                <div className="title-board">物料配送缺口看板</div>
                <div style={{ fontSize: 16 }}>
                  <div style={{ textAlign: 'center' }}>工厂</div>
                  <div>{siteInfo.siteCode}</div>
                </div>
                <div style={{ marginLeft: '5%', fontSize: 16 }}>
                  <div style={{ textAlign: 'center' }}>最后更新时间</div>
                  <div>{endTime}</div>
                </div>
                <div style={{ marginLeft: '3%' }}>
                  <Button onClick={() => setVisible(true)}>
                    切换产线
                  </Button>
                </div>
                <div style={{ marginLeft: '3%' }}>
                  <Button onClick={screenFull} icon={isFullFlag ? 'shrink' : 'arrows-alt'}>
                    {isFullFlag ? '取消全屏' : '全屏'}
                  </Button>
                </div>
              </div>
              <div className="content-box">
                <Spin spinning={fetchListLoading}>
                  <TableList dataSource={tableList} />
                </Spin>
                <div className="contentBoxB">
                  <Divider>
                    <span
                      style={{
                        color: 'white',
                        fontSize: 16,
                      }}
                    >
                      {' '}
                      {number + 1}/{totalPages} {numberOfElements}/{totalElements}
                    </span>
                  </Divider>
                </div>
              </div>
            </div>
          </IndexPageContent>
        </IndexPageStyle>
      </FullScreenContainer>
      <ProdLineModal {...prodLineModalProps} />
    </div>
  );
};

export default connect(({ materialDistributionGapBoard, loading }) => ({
  materialDistributionGapBoard,
  tenantId: getCurrentOrganizationId(),
  fetchListLoading: loading.effects['materialDistributionGapBoard/fetchList'],
}))(MaterialDistributionGapBoard);
