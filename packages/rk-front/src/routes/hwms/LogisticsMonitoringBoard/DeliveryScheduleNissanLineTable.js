import React from 'react';

const DeliveryScheduleNissanLineTable = React.memo(props => {
  return (
    <React.Fragment>
      <table border='1' style={{ borderColor: '#fff', width: '100%' }}>
        <thead>
          <tr style={{ height: '8pt', fontSize: 12 }}>
            <th style={{ width: '60pt' }}>产线</th>
            <th style={{ width: '45pt' }}>新建</th>
            <th style={{ width: '45pt' }}>下达</th>
            <th style={{ width: '45pt' }}>备料中</th>
            <th style={{ width: '45pt' }}>备料完成</th>
            <th style={{ width: '45pt' }}>签收中</th>
            <th style={{ width: '45pt' }}>签收完成</th>
            <th style={{ width: '45pt' }}>关闭</th>
            <th style={{ width: '45pt' }}>今日总计</th>
          </tr>
        </thead>
        <tbody>
          {props.dataSource.map(item => (
            <tr style={{ height: '8pt', fontSize: 12 }}>
              <td style={{ width: '60pt' }}>{item.proLineName}</td>
              <td style={{ width: '45pt' }}>{item.newQty}</td>
              <td style={{ width: '45pt' }}>{item.releasedQty}</td>
              <td style={{ width: '45pt' }}>{item.prepareExecuteQty}</td>
              <td style={{ width: '45pt' }}>{item.prepareCompleteQty}</td>
              <td style={{ width: '45pt' }}>{item.signExecuteQty}</td>
              <td style={{ width: '45pt' }}>{item.signCompleteQty}</td>
              <td style={{ width: '45pt' }}>{item.closeQty}</td>
              <td style={{ width: '45pt' }}>{item.proLineSum}</td>
            </tr>
          ))}
          {/* <tr style={{ height: '8pt', fontSize: 12 }}> */}
          {/*  <td style={{ width: '60pt' }}>大街上的的骄傲是</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '40pt' }}>2000</td> */}
          {/*  <td style={{ width: '45pt' }}>2000</td> */}
          {/* </tr> */}
        </tbody>
      </table>
    </React.Fragment>
  );
});

export default DeliveryScheduleNissanLineTable;
