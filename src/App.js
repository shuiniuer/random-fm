import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

    constructor () {
        super();
        this.state = {
            song:{
                url: '',
                title: '',
                artist:''
            },
            lyric: ''
        }
    }

    componentDidMount () {
        this.randomMusic();
        let music = document.getElementById("music");
        // music.onplay=()=>{
        //     console.log(music.currentTime);
        //     console.log(music.duration);
        // };
        music.onended = ()=>{
            this.randomMusic();
        };
    }

    randomMusic () {
        axios.get('https://douban.fm/j/v2/playlist',{
            params:{
                channel: -10,
                kbps: 192,
                client: "s:mainsite|y:3.0",
                app_name: "radio_website",
                version: 100,
                type: 'n'
            }
        })
            .then(res=>{
                if(res.data.song.length>0){

                    let song = res.data.song[0];
                    this.setState({
                        song:song
                    });
                    axios.get('https://douban.fm/j/v2/lyric',{params:{
                            sid: song.sid,
                            ssid: song.ssid
                        }
                    })
                        .then(res=>{
                            //console.log(res);
                            this.setState({
                                lyric: res.data.lyric.replace(/\n/g,"<br />")
                        });
                        }).catch(err=>{
                            console.log(err);
                        });
                }else{
                    this.randomMusic();
                }
            })
            .catch(err=>{
                console.log(err);
            });

    }

    render() {
        return (
            <div className="App">
                <video id="music" src="http://shuiniuer.cn:8080/blog/Uploads/video/2017-07-14/5968d26e8805d.mp4" autoplay="autoplay">
                </video>
                <div className="title">
                    和喜欢的音乐不期而遇
                </div>
                <div className="player-box">
                    <div className="img circle">
                        <img src="http://p8eb5r4jr.bkt.clouddn.com/test/upload/1beeee8344e14265ff460eebe167de96.png"/>
                    </div>
                </div>
                <div className="info-box">
                    <span>{this.state.song.title}</span><br/>
                    <span>{this.state.song.artist}</span>
                </div>
                <div className="lyric-box">
                    <div dangerouslySetInnerHTML={{__html: this.state.lyric}} />
                </div>
                <div className="random-button" onClick={this.randomMusic.bind(this)}>下一首</div>
            </div>
        );
    }
}

export default App;
