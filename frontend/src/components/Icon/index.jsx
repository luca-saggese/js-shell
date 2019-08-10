import React from 'react';
import Image from '../Image';
import textEllipsis from 'text-ellipsis';
import { Tooltip } from 'antd';
import './style.css';
import LinesEllipsis from 'react-lines-ellipsis'


const Icon = (props = {}) => {
  let {title, children, width, height, style, titleLines, description, src, className, ...propsRest} = props;

  titleLines = titleLines || 2;

  style = Object.assign(
    style || {},
    {
      width,
      height
    }
  );

  // TODO: Set default width / height, if not already set

  return (
    <button
      {...propsRest}
      className={`zd-icon ${className ? className : ''}`}
      title={description}
      style={style}
    >
      <div className="zd-icon-image">
        {
          // TODO: Consider encapuslating in Cover
          children &&
          children
        }
        {
          // TODO: Consider encapuslating in Cover
          src &&
          <Image
            
            alt={description}
            title={description}
            src={src}
            width="100%"
            height="100%"
          />
          
        }
      </div>
      {
        // // TODO: Consider encapuslating in Cover
      }
      <Tooltip title={title} placement="bottom">
        <div className="zd-icon-name" style={{marginLeft:50}}>
          {
            title && (
              <LinesEllipsis 
                text={title}
                maxLine={titleLines}
                ellipsis=".."
                trimRight="false"
                basedOn='letters'
              />
            )
          }
        </div>
      </Tooltip>
      
    </button>
  )
};

export default Icon;