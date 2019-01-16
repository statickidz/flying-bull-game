import React, { Component } from 'react'
import './app.scss'
import ReactPlayer from 'react-player'
import Carousel from 'nuka-carousel'

export default class App extends Component {
  state = {
    feed: [],
    playing0: true,
    playing1: false,
    playing2: false,
    playing3: false,
    playing4: false,
  }

  componentDidMount() {
    this.loadFeed()
  }

  loadFeed() {
    fetch('/api/feed')
      .then(res => res.json())
      .then(feed => {
        console.log(feed)
        this.setState({ feed: feed.feed })
      })
  }

  onVideoEnded = (index) => {
    if (index === (this.state.feed.length-1)) {
      this.loadFeed()
    } else {
      this.refs.slider.nextSlide()
    }
  }

  renderSlides = () => {
    return this.state.feed.map((item, index) => {
      return (
        <div className="slide" key={`video-${item.aweme_id}`}>
          <div className="author animated wobble">
            <img className="avatar" src={item.author.avatar_thumb.url_list[0]} />
            <div>
              <div className="name">@{item.author.unique_id}</div>
              <div className="song">🎵 {item.music.title}</div>
              <div className="desc">{item.desc}</div>
            </div>
          </div>
          <ReactPlayer
            className="video"
            ref={`video${index}`}
            playing={this.state[`playing${index}`]}
            url={item.video.play_addr.url_list[0]}
            onEnded={() => this.onVideoEnded(index)}
          />
        </div>
      )
    })
  }

  render() {
    const settings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      vertical: true,
      dragging: false,
      withoutControls: true,
      heightMode: 'first',
      initialSlideHeight: window.innerHeight,
      beforeSlide: (currentSlide, nextSlide) => {
        this.setState({ [`playing${currentSlide}`]: false })
      },
      afterSlide: (currentSlide) => {
        this.setState({ [`playing${currentSlide}`]: true })
      }
    }

    return (
      <div>
        <Carousel ref="slider" {...settings}>
          {this.renderSlides()}
        </Carousel>
      </div>
    )
  }
}