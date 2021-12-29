/*
 * @Description: 配置文件
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-20 15:12:51
 * @LastEditTime: 2020-10-20 15:51:57
 */
import styled from 'styled-components';

export const TopBox = styled.div`
  .top_box {
    display: flex;
    justify-content: center;

    .top_decoration10 {
      position: relative;
      width: 33.3%;
      height: 0.0625rem;
    }

    .top_decoration10_reverse {
      transform: rotateY(180deg);
    }

    .title-box {
      display: flex;
      justify-content: center;

      .top_decoration8 {
        width: 2.5rem;
        height: 0.625rem;
      }

      .title {
        position: relative;
        width: 6.25rem;
        text-align: center;
        background-size: cover;
        background-repeat: no-repeat;

        .title-text {
          font-size: 0.3rem;
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 100%;
          color: #fff;
          transform: translate(-50%);
        }

        .top_decoration6 {
          width: 3.125rem;
          height: 0.1rem;
        }

        .title-bototm {
          position: absolute;
          bottom: -0.375rem;
          left: 50%;
          transform: translate(-50%);
        }
      } // end title
    } // end title-box
  } // end top_box
`;

export const TimeBox = styled.div`
  position: absolute;
  right: 0.375rem;
  top: 0.5rem;
  text-align: right;
  color: #fff;
  h3{
    font-size: 0.30rem;
    color: #bcdcff;
  }
`;

export const LogoBox = styled.div`
  position: absolute;
  left: 0.275rem;
  top: 0.4rem;
  text-align: left;
  color: #fff;
  h3{
    font-size: 0.225rem;
    color: #bcdcff;
  }
`;
