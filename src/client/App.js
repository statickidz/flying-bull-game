import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import Carousel from 'nuka-carousel'
import numeral from 'numeral'
import './app.scss'

export default class App extends Component {

  interval = null
  maxVideos = 10
  minLikes = 10
  tag = ''

  state = {
    loading: true,
    feed: [],
  }

  componentDidMount() {
    this.loadFeed()
  }

  loadFeed() {
    this.interval = setInterval(() => {
      if (this.state.feed.length < this.maxVideos) {
        fetch('/api/feed')
          .then(res => res.json())
          .then(json => {
            console.log('New JSON', json)
            let feed = json.feed
              .filter(video => video.statistics.digg_count > this.minLikes)
              .filter(video => video.music.source_platform === 72)
              .filter(video => {
                if (this.tag && this.tag !== '') {
                  if (video.music.title.toLowerCase().includes(this.tag)) {
                    return true
                  }
                } else {
                  return true
                }
                return false
              })
            console.log('Filtered Feed', feed)
            feed.map((video, i) => (this.state.feed.length === 0 && i === 0) ?
              video.playing = true : video.playing = false
            )
            //this.setState({ feed: this.state.feed.concat(feed) })
            this.setState({ feed: [...this.state.feed, ...feed] })
          })
      } else {
        clearInterval(this.interval)
        this.setState({ loading: false })
      }
    }, 2000)
  }

  onVideoEnded = (index) => {
    this.refs.slider.nextSlide()
  }

  renderSlides = () => {
    return this.state.feed.map((item, index) => {
      return (
        <div className="slide" key={`video-${item.aweme_id}`}>
          <div className="author animated wobble">
            <img
              className="avatar"
              src={item.author.avatar_thumb.url_list[0]}
              onClick={() => this.refs.slider.nextSlide()}
            />
            <div>
              <div className="name">@{item.author.unique_id}</div>
              <div className="song">🎵 {item.music.title}</div>
              <div className="desc">{item.desc}</div>
            </div>
          </div>
          <div
            className="heart-container"
            onClick={() => this.setState({
              feed: this.state.feed.map((video, i) => 
                index === i ? { ...video, playing: !item.playing } : video
              )
            })}
          >
            <div className="heart pulse"></div>
            <div className="likes">{numeral(item.statistics.digg_count).format('0a')}</div>
          </div>
          <div
            className="progress-bar"
            style={{width: `${item.playedSeconds*100/(item.video.duration/100)*10}%`}}
          />
          <ReactPlayer
            className="video"
            ref={`video${index}`}
            volume={0.1}
            playing={this.state.feed[index].playing}
            url={item.video.play_addr.url_list[0]}
            onEnded={() => this.onVideoEnded(index)}
            onError={(error) => this.refs.slider.nextSlide()}
            onProgress={(state) => this.setState({
              feed: this.state.feed.map((video, i) => 
                index === i ? { ...video, playedSeconds: state.playedSeconds } : video
              )
            })}
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
        this.setState({
          feed: this.state.feed.map((video, i) => 
            currentSlide === i ? { ...video, playing: false } : video
          )
        })
      },
      afterSlide: (currentSlide) => {
        this.setState({
          feed: this.state.feed.map((video, i) => 
            currentSlide === i ? { ...video, playing: true } : video
          )
        })
      }
    }

    return (
      <div>
        {this.state.loading ?
          <div className="loading">
            <div>Cargando</div>
            <div>{this.state.feed.length}/{this.maxVideos}</div>
            <div className="spinner"></div>
          </div>
        :
          <Carousel ref="slider" {...settings}>
            {this.renderSlides()}
          </Carousel>
        }
      </div>
    )
  }
}