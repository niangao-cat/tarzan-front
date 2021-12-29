import React, { Component } from 'react';
import { Row, Col } from 'hzero-ui';
import borad from '@/assets/board-big.png';

const boardStyle = {
    width: "5.5vw",
    height: "5.5vw",
    background: `url(${borad}) no-repeat`,
    margin: "0.7vw",
  };

 const demo = [70, 60, 50, 99, 69, 100, 49, 85, 27, 66, 99, 88, 16, 9, 11, 33, 77, 88, 99, 32];

export default class EquipmentStatus extends Component {

    changeBackColor(item, index){
        for(let i=0; i<=demo.length-1;i++){
            document.getElementById(i).className = 'boardClass';
        }
        document.getElementById(index).className = 'boardBackColorClass';
    }
;
  // 直接渲染
  render() {
    return (
      <React.Fragment>
        <Row style={{marginTop: '-2vw'}}>
          {
                demo.map((item, index)=> {
                    if(item>80){
                        return (
                          <Col span={4}>
                            <div id={index} className="boardClass" onClick={this.changeBackColor.bind(this, item, index)}>
                              <div style={boardStyle}>
                                <div className="oval-blue">
                                  <span style={{paddingTop: '0.1vw', display: 'block'}}>{item}%</span>
                                </div>
                              </div>
                              <span style={{fontSize: '0.7vw', fontWeight: 'bold'}}>激光焊接机62221</span>
                            </div>
                          </Col>
                        );
                    }else if(item>60){
                        return(
                          <Col span={4}>
                            <div id={index} className="boardClass" onClick={this.changeBackColor.bind(this, item, index)}>
                              <div style={boardStyle}>
                                <div className="oval-orange">
                                  <span style={{paddingTop: '0.1vw', display: 'block'}}>{item}%</span>
                                </div>
                              </div>
                              <span style={{fontSize: '0.7vw', fontWeight: 'bold'}}>激光焊接机62221</span>
                            </div>
                          </Col>
                        );
                    }else{
                        return(
                          <Col span={4}>
                            <div id={index} className="boardClass" onClick={this.changeBackColor.bind(this, item, index)}>
                              <div style={boardStyle}>
                                <div className="oval-red">
                                  <span style={{paddingTop: '0.1vw', display: 'block'}}>{item}%</span>
                                </div>
                              </div>
                              <span style={{fontSize: '0.7vw', fontWeight: 'bold'}}>激光焊接机62221</span>
                            </div>
                          </Col>
                          );
                    }

                })
            }
        </Row>
      </React.Fragment>
    );
  }
}
