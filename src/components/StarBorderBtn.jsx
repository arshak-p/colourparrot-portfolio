import { Link } from 'react-router-dom';
import './StarBorderBtn.css';

const StarBorderBtn = ({
  as: Component = 'button',
  className = '',
  color = 'var(--green)',
  speed = '5s',
  thickness = 1,
  children,
  href = null,
  onClick = () => {},
  ...rest
}) => {
  // Use Link if it's an internal link, otherwise 'a' or 'button'
  let FinalComponent = Component;
  if (href) {
    FinalComponent = href.startsWith('http') || href.startsWith('mailto') ? 'a' : Link;
  }

  const props = {
    className: `star-border-container ${className}`,
    style: {
      padding: `${thickness}px 0`,
      ...rest.style
    },
    ...(href ? { [FinalComponent === Link ? 'to' : 'href']: href } : { onClick, type: 'button' }),
    ...rest
  };

  return (
    <FinalComponent {...props}>
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </FinalComponent>
  );
};

export default StarBorderBtn;
