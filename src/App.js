import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

    constructor () {
        super();
        this.state = {
            song:{
                title: '',
                artist:''
            },
            lyric: ''
        };
        this.music = null;
    }

    componentDidMount () {
        this.randomMusic();
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

                    if(!this.music){
                        this.music = document.getElementById('music');
                        document.addEventListener("click",  ()=> {
                            this.music.play();
                        }, false);
                    }
                    this.music.src = song.url;

                    let promise = this.music.play();

                    promise.catch(
                        function(err){
                            
                        }
                    ).then(
                        function(){

                        }
                    );
                    this.music.onended = ()=>{
                        this.randomMusic();
                    };

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
                <audio id="music"></audio>
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
