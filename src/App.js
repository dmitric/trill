import React, { Component } from 'react';
import './App.css';
import Hammer from 'hammerjs'

import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'
import tinycolor from 'tinycolor2'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      backgroundColor: '#f5f5f5',
      displayColorPickers: true,
      forwardColor: 'black',
      reverseColor: '#7E7B8A',
      chance: 50,
      dimension: 9,
      padding: 120,
      width: 500,
      height: 500,
      paper: 0,
      running: false
    }
  }

  generatePaper (opacity) {
    const rects = []
    
    if (opacity === 0) {
      return rects
    }

    const actualHeight = this.actualHeight()
    const actualWidth = this.actualWidth()

    for (let w=0; w < actualWidth -1 ; w += 2) {
      for (let h=0; h < actualHeight -1; h += 2) {
        let g = this.between(75, 95)
        rects.push(<rect key={`${w}-${h}`} x={w} y={h} height={2} width={2}
          fill={tinycolor({r: 255 * g/100, g: 255 * g/100, b: 255 * g/100 }).toHexString() }
          fillOpacity={opacity} />)
      }
    }

    for (let i = 0; i < 30; i++) {
      let g2 = this.between(40, 60)
      rects.push(<rect key={`${i}-dot`} width={this.between(1,2)} height={this.between(1,2)}
        x={this.between(0, actualWidth-2)}
        y={this.between(0, actualHeight-2)}
        fill={ tinycolor({r: 255 * g2/100, g: 255 * g2/100, b: 255 * g2/100 }).toHexString()}
        fillOpacity={this.between(opacity*250, opacity*300)/100} />)
    }

    return rects
  }

  generateColor () {
    const palette =  ["#292628", "#2966a4", "#edd035", "#e8502f", "#9a4e55", "#3b9764", "#68a5b9", "#bb98c4", "#86d052", "#aa9f52"]
    const chance = Math.random() * 100;

    if (chance >= 0 && chance < 49.5) {
      return palette[0];
    } else if (chance >= 49.5 && chance < 61.3) {
      return palette[1];
    } else if (chance >= 61.3 && chance < 69.2) {
      return palette[2];
    } else if (chance >= 69.2 && chance < 77.1) {
      return palette[3];
    } else if (chance >= 77.1 && chance < 83.9) {
      return palette[4];
    } else if (chance >= 83.9 && chance < 90.2) {
      return palette[5];
    } else if(chance >= 90.2 && chance < 94.4) {
      return palette[6];
    } else if(chance >= 94.4 && chance < 97.6) {
      return palette[7];
    } else if(chance >= 97.6 && chance < 99.2) {
      return palette[8];
    } else if (chance >= 99.2) {
      return palette[9];
    }
  }

  generateTriangles() {
    const triangles = []

    const actualHeight = this.actualHeight()
    const actualWidth = this.actualWidth()

    const a = actualHeight/this.state.dimension
    const r = (a) * (Math.sqrt(3))/3.
    const h = (a) * (Math.sqrt(3))/2.

    const colDim = Math.floor(actualWidth/h)

    for (let row=0; row < this.state.dimension-1; row ++) {
      for (let col=0; col < colDim; col++) {
        const y = (row+0.5)*a
        const x = (col+0.5)*h
        const points = this.polygon(x, y, r, 3)
        const pointString = this.generatePointString(points)
        const isBackwards = 100*Math.random() < this.state.chance
        
        if (isBackwards) {
          triangles.push(
            <polygon key={`${x}-${y}`}
              stroke='none'
              transform={`${ col % 2 !== 0 ? '': `translate(0 ${a/2})`}rotate(270 ${x} ${y})`}
              points={pointString} fill={this.state.reverseColor} />
          )
        } else {
          triangles.push(
            <polygon key={`${x}-${y}`}
              stroke='none'
              transform={`${ col % 2 !==0 ? '': `translate(0 ${a/2})`}rotate(90 ${x} ${y})`} 
              points={pointString} fill={this.state.forwardColor} />
          )
        }
      }
    }

    return triangles
  }

  toggleRun() {
    this.setState({running: !this.state.running})
  }

  tick () {
    if (this.state.running) {
      this.forceUpdate()
    }
  }

  generatePointString(points) {
    let pointStr = ""
    
    for (let point = 0; point < points.length; point ++) {
      let p = points[point]
      pointStr += `${p[0]},${p[1]} `
    }

    return pointStr.trim()
  }

  polygon(x, y, radius, sides) {
    const coordinates = []

    /* 1 SIDE CASE */
    if (sides === 1) {
      return [[x, y]]
    }

    /* > 1 SIDE CASEs */
    for (let i = 0; i < sides; i++) {
      coordinates.push([(x + (Math.sin(2 * Math.PI * i / sides) * radius)), (y - (Math.cos(2 * Math.PI * i / sides) * radius))])
    }

    return coordinates
  }

  between (min, max) {
    return Math.random()*(max-min+1.) + min;
  }

  bound (value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  actualHeight () {
    return this.state.height-2*this.state.padding
  }

  actualWidth () {
    return this.state.width-2*this.state.padding
  }

  decrementDimension () {
    this.setState({dimension: Math.max(2, this.state.dimension - 1) })
  }

  incrementDimension () {
    this.setState({dimension: Math.min(30, this.state.dimension + 1) })
  }

  increaseChance () {
    this.setState({chance: Math.min(90, this.state.chance + 5) })
  }

  decreaseChance () {
    this.setState({chance: Math.max(10, this.state.chance - 5) })
  }

  render() {
    const actualHeight = this.actualHeight()
    const actualWidth = this.actualWidth()

    const a = actualWidth/this.state.dimension
    // eslint-disable-next-line
    const r = (a) * (Math.sqrt(3))/3.
    const h = (a) * (Math.sqrt(3))/2.

    return (
      <div className="App">
        { this.state.displayColorPickers ? <div className="color-pickers">
          <ColorPicker color={tinycolor(this.state.backgroundColor).toRgb()} disableAlpha={true}
            handleChange={ (color) => this.setState({backgroundColor: color.hex}) } />
          <ColorPicker color={tinycolor(this.state.forwardColor).toRgb()} disableAlpha={true}
            handleChange={ (color) => this.setState({forwardColor: color.hex}) } />
          <ColorPicker color={tinycolor(this.state.reverseColor).toRgb()} disableAlpha={true}
            handleChange={ (color) => this.setState({reverseColor: color.hex}) } />
            </div> : null
        }
        <div style={{ padding: this.state.padding }}> 
          <svg width={actualWidth} height={actualHeight} style={{ overflow: 'none' }}>
            <rect width={"100%"} height={"100%"}  fill={this.state.backgroundColor} />
            <g transform={`translate(${a-h} ${a/4})`}>
              {this.generateTriangles()}
            </g>
            <g>
              {this.generatePaper(this.state.paper)}
            </g>
          </svg>
        </div> 
      </div>
    );
  }

  componentWillMount () {
    this.updateDimensions()
  }

  updateDimensions () {
    const w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0]
    
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight

    const dim = Math.min(width, height)
    const settings = { width: dim , height: dim }

    if (settings.width >= 500) {
      settings.padding = 120
    } else {
      settings.padding = 0
    }

    this.setState(settings)
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions.bind(this), true)
    window.removeEventListener('keydown', this.handleKeydown.bind(this), true)
    window.clearInterval(this.interval)
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions.bind(this), true)
    window.addEventListener('keydown', this.handleKeydown.bind(this), true)
    this.interval = window.setInterval(this.tick.bind(this), 400)

    const mc = new Hammer(document, { preventDefault: true })

    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    mc.get('pinch').set({ enable: true })

    mc.on("swipedown", ev => this.decrementDimension())
      .on("swipeup", ev => this.incrementDimension())
      .on("swipeleft", ev => this.increaseChance())
      .on("swiperight", ev => this.decreaseChance())
      .on("pinchin", ev => this.incrementDimension())
      .on("pinchout", ev => this.decrementDimension())
  }

  handleKeydown (ev) {
    if (ev.which === 67 && !(ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.setState({displayColorPickers: !this.state.displayColorPickers})
    } else if (ev.which === 83 && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.handleSave()
    } else if (ev.which === 82 && !(ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.forceUpdate()
    } else if (ev.which === 80 && !(ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.togglePaper()
    } else if (ev.which === 84) {
      ev.preventDefault()
      this.toggleRun()
    } else if (ev.which === 40) {
      ev.preventDefault()
      this.decrementDimension()
    } else if (ev.which === 38) {
      ev.preventDefault()
      this.incrementDimension()
    } else if (ev.which === 37) {
      ev.preventDefault()
      this.decreaseChance()
    } else if (ev.which === 39) {
      ev.preventDefault()
      this.increaseChance()
    }
  }

  togglePaper() {
    this.setState({paper: this.state.paper ? 0 : 0.1})
  }

  handleSave () {
    const svgData = document.getElementsByTagName('svg')[0].outerHTML   
    const link = document.createElement('a')
    
    var svgBlob = new Blob([svgData], { type:"image/svg+xml;charset=utf-8" })
    var svgURL = URL.createObjectURL(svgBlob)
    link.href = svgURL 

    link.setAttribute('download', `trill.svg`)
    link.click()
  }

}

class ColorPicker extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      color: props.color,
      displayColorPicker: props.displayColorPicker,
      disableAlpha: props.disableAlpha,
      useHue: props.useHue
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    if (this.props.handleClose) {
      this.props.handleClose()
    }
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.props.handleChange(color)
  };

  render () {

    const styles = reactCSS({
      'default': {
        color: {
          background: this.state.disableAlpha ?
                `rgb(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b })` :
                `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b },  ${ this.state.color.a })`,
        },
        popover: {
          position: 'absolute',
          zIndex: '10',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    })

    return (
      <div className='color-picker'>
        <div className='swatch' onClick={ this.handleClick }>
          <div className='color' style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose } />
            <SketchPicker color={ this.state.color } onChange={ this.handleChange } disableAlpha={this.state.disableAlpha} />
          </div> : null }
      </div>
    )
  }
}

export default App;
