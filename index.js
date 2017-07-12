const HUE_SHIFT_INTENSITY = 4;
const BRIGHT_GREEN = '#00FF00';
const DARK_GREEN = '#05120b';
const TEXT_GREEN = '51, 255, 0';
const intensities = generateIntensities();
const TEXT_SHADOW = generateTextShadow(intensities);
const BOX_SHADOW = generateBoxShadow(intensities);

exports.decorateConfig = (config) => {
  return Object.assign({}, config, {
    foregroundColor: BRIGHT_GREEN,
    backgroundColor: DARK_GREEN,
    borderColor: BRIGHT_GREEN,
    cursorColor: '#40FFFF',
  });
}

exports.decorateHyper = (HyperTerm, { React, notify }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
    }

    render() {
      const overridenProps = {
        backgroundColor: 'black',
        customCSS: `
          ${this.props.customCSS || ''}

          ${TEXT_SHADOW}
          body::after {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(18, 16, 16, 0.1);
            opacity: 0;
            z-index: 2;
            pointer-events: none;
          	animation: flicker 0.15s infinite;
          }
          body::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
          }
          .tabs_nav .tabs_title {
            color: rgb(${TEXT_GREEN}) !important;
            font-weight: bold !important;
            animation: textShadow 1.6s infinite;
          }
          .tabs_list {
            background-color: ${DARK_GREEN} !important;
            background-image: none !important;
          }
          .tab_tab {
            border: 3px dashed rgb(${TEXT_GREEN});
            height: 40px;
          }
          .tab_tab:not(.tab_active) {
            color: rgba(${TEXT_GREEN}, 0.7);
          }
          .tab_tab.tab_active {
            animation: textShadow 1.6s infinite;
            font-weight: bold;
            color: rgb(${TEXT_GREEN});
            border: 3px double rgb(${TEXT_GREEN});
          }
          .terms_termsShifted {
            margin-top: 74px;
          }
          .tab_icon {
            color: rgb(${TEXT_GREEN});
            font-style: normal;
            line-height: 14px;
          }
          .tab_icon:before {
            content: "\u2716"
          }
          .tab_icon:hover {
            background-color: transparent;
          }
          .tab_shape {
            display: none;
          }
        `,
      };
      return React.createElement(HyperTerm, Object.assign({}, this.props, overridenProps));
    }
  }
}

exports.decorateTerm = (Term, { React, notify }) => {
  return class extends React.Component {
    constructor (props, context) {
      super(props, context);
    }

    render () {
      const overridenProps = {
        customCSS: `
        ${this.props.customCSS || ''}
        ${BOX_SHADOW}
        x-screen {
          animation: textShadow 1.6s infinite;
        }
        .cursor-node {
          animation: boxShadow 1.6s infinite;
        }
      `};
      return React.createElement(Term, Object.assign({}, this.props, overridenProps));
    }
  }
};

function generateIntensities() {
  var result = [];
  for (let i = 0; i < 101; i+=5) {
    let x = -1 + 2 * Math.random();
    x = x * x;
    result.push(HUE_SHIFT_INTENSITY * x);
  }
  return result;
}

function generateTextShadow(intensities) {
  var result = '@keyframes textShadow {\n';
  for (let i = 0; i < intensities.length; i++) {
    const intensity = intensities[i];
    result += `${i*5}% {
      text-shadow: ${intensity}px 0 1px rgba(0,30,255,0.5), ${-intensity}px 0 1px rgba(255,0,80,0.3), 0 0 3px;
    }
    `;
  }
  result += '}\n';
  return result;
}

function generateBoxShadow(intensities) {
  var result = '@keyframes boxShadow {\n';
  for (let i = 0; i < intensities.length; i++) {
    const intensity = intensities[i];
    result += `${i*5}% {
      box-shadow: ${intensity}px 0 1px rgba(0,30,255,0.5), ${-intensity}px 0 1px rgba(255,0,80,0.3), 0 0 3px;
    }
    `;
  }
  result += '}\n';
  return result;
}
