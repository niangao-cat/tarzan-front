import React, { Component } from 'react';
import { Divider, Form, Row, Col, Button, Input, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../index.less';
import imgPath from '@/assets/newRectangle.png';
import ExceptionList from './ExceptionList';
import WocellOn from './WocellOn';

@Form.create({ fieldNameProp: null })
export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exceptionLabelListState: [],
      visible: false,
      typeTem: '',
      exceptionLabelListDetailTem: {},
    };
  }

  componentDidMount() {
    const {
      exceptionLabelList = [],
    } = this.props;
    this.setState({ exceptionLabelListState: exceptionLabelList });
  }

  @Bind
  closeModal() {
    this.setState({ visible: false });
  }

  @Bind
  enterWork(value) {
    const { submitExceptionTem } = this.props;
    submitExceptionTem(this.state.typeTem, this.state.exceptionLabelListDetailTem, value);
    this.setState({ visible: false });
  }

  @Bind
  checkWocell(code) {
    const { checkWocell } = this.props;
    return checkWocell(code);
  }

  @Bind()
  changeShowButtom(e) {
    const {
      exceptionLabelList = [],
    } = this.props;
    if (e && e.target.value && exceptionLabelList.length > 0) {
      this.setState({ exceptionLabelListState: exceptionLabelList.filter(item => item.exceptionName.includes(e.target.value)) });
    } else {
      this.setState({ exceptionLabelListState: exceptionLabelList });
    }
  }

  // 异常提交
  @Bind()
  submitException(type, exceptionLabelListDetail) {
    const { submitException, workcellId } = this.props;
    if (workcellId) {
      submitException(type, exceptionLabelListDetail);
    } else {
      this.setState({ typeTem: type, exceptionLabelListDetailTem: exceptionLabelListDetail, visible: true });
    }
  }

  /**
   * @description: 循环展示按钮-新增异常
   * @param {Array} button 异常类型
   * @param {type} type 类型（人员、设备、物料、工艺质量、环境）
   * @return: Array
   */
  @Bind()
  renderButton(button, type) {
    const cols = [];
    for (let i = 0; i <= button.length - 1;) {
      const element = [];
      for (let j = 0; j < 3 && i <= button.length - 1; j++, i++) {
        const exceptionLabelListDetail = button[i];
        element.push(
          <Col span={8}>
            <Tooltip title={button[i].exceptionName}>
              <Button
                onClick={() => this.submitException(type, exceptionLabelListDetail)}
                style={{ width: '95%' }}
                size="small"
                type="primary"
              >
                {button[i].exceptionName}
              </Button>
            </Tooltip>
          </Col>
        );
      }
      cols.push(<Row style={{ marginTop: '10px' }}>{element}</Row>);
    }
    return cols;
  }

  /**
   * @description: 打开抽屉-调用index.js中的shouwModal
   * @param {Boolean} exceptionModal 新增异常模态框
   * @param {Boolean} exceptioListVisible 异常清单
   * @param {Boolean} data 异常记录
   * @param {String} type 点击的类型
   */
  @Bind()
  showModal(exceptionModal, exceptioListVisible, type) {
    const { showModal } = this.props;
    showModal(exceptionModal, exceptioListVisible, type);
  }

  render() {
    const {
      exceptionType,
      exceptionRecordList = [],
      exceptionTypeMeaning,
      unresolvedExcQty,
      shiftExcQty,
      totalExcQty,
      areaMap,
      workshopMap,
      prodLineMap,
      checkWorkcellLoading,
    } = this.props;
    const exceptionListProps = {
      exceptionType,
      showModal: this.showModal,
    };
    const wocellProps = {
      visible: this.state.visible,
      closeModal: this.closeModal,
      enterWork: this.enterWork,
      checkWocell: this.checkWocell,
      checkWorkcellLoading,
      areaMap,
      workshopMap,
      prodLineMap,
    };
    return (
      <Col className={styles['exception-handling-platform-col']} span={4}>
        <div className={styles['exception-header']}>
          <div className={styles['exception-header-info']}>
            <span>{exceptionTypeMeaning}</span>
          </div>
          <Divider style={{ margin: '0px' }} />
          <Row style={{ padding: '10px' }} className={styles['exception-header-top-div']}>
            <Col className={styles['exception-header-left']} span={12}>
              <div className={styles['exception-des']}>未解决异常</div>
              <div className={styles['exception-num']}>{unresolvedExcQty}</div>
            </Col>
            <Col className={styles['exception-header-right']} span={12}>
              <div className={styles['exception-des']}>本班次异常</div>
              <div className={styles['exception-num']}>
                <span>{shiftExcQty}</span>
                <span style={{ color: '#333', fontSize: '17px' }}>/{totalExcQty}</span>
              </div>
            </Col>
          </Row>
          <Divider style={{ margin: '0px' }} dashed />
          <div className={styles['exception-header-bot-div']}>
            <div style={{ marginBottom: '10px' }}>
              <img src={imgPath} alt="" style={{ marginTop: '-3px', marginRight: '5px' }} />
              <span style={{ fontSize: '14px', color: '#333', lineHeight: '19px' }}>新增异常</span>
              <Input onChange={this.changeShowButtom} style={{ marginLeft: '5px', width: '180px' }} />
            </div>
            {this.renderButton(this.state.exceptionLabelListState, exceptionType)}
          </div>
        </div>
        <Divider style={{ margin: '10px 0px' }} dashed />
        <div style={{ marginBottom: '10px' }}>
          <img src={imgPath} alt="" style={{ marginTop: '-3px', marginRight: '5px' }} />
          <span style={{ fontSize: '14px', color: '#333', lineHeight: '19px' }}>异常清单</span>
        </div>
        <div className={styles['exception-bottom']}>
          <Scrollbars>
            {exceptionRecordList.map(item => {
              return <ExceptionList {...exceptionListProps} data={item} />;
            })}
          </Scrollbars>
        </div>
        <WocellOn {...wocellProps} />
      </Col>
    );
  }
}
