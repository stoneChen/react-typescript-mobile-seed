import * as React from 'react';
import { Link } from 'react-router-dom';

// const backgroundSrc = require('client/assets/images/common/nonentity.png');

class Nonentity extends React.PureComponent<any, any> {
  render() {
    return (
      <div className="nonentity">
        <p>您所查看的页面已失效~</p>
        <Link className="back" to="/home">返回首页</Link>
        <style jsx>{`
          @import 'client/assets/stylus/utils.styl';

          div.nonentity {
            width: 430px;
            padding-top: 196px;
            margin: 200px auto;
            background-size: 100%;
            text-align: center;
          }
          p {
            padding: 40px 0;
            text-align: center;
            abs-font-size(36);
          }
          :global(.back) {
            display: inline-block;
            padding: 16px 24px;
            margin-top: 80px;
            background-image: linear-gradient(-225deg, #9D3EC5 0%, #FF6346 100%);
            box-shadow: 1px 3px 7px 0 rgba(216,84,122,0.34);
            border-radius: 100px;
            color: #fff;
            abs-font-size(28);
          }
        `}</style>
      </div>
    );
  }
}

export default Nonentity;
