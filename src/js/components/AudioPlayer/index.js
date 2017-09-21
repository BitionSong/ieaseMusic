
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import helper from 'utils/helper';

@inject(stores => ({
    song: stores.controller.song,
    next: stores.controller.next,
    playing: stores.controller.playing,
}))
@observer
export default class AudioPlayer extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.playing !== this.props.playing) {
            try {
                this.refs.player[nextProps.playing ? 'play' : 'pause']();
            } catch (ex) {
                // Anti warnning
            }
        }

        if (!nextProps.song.data
            && nextProps.song.id === this.props.song.id) {
            return false;
        }

        return true;
    }

    progress(currentTime) {
        clearTimeout(this.timer);

        // Reduce CPU usage
        this.timer = setTimeout(() => {
            var ele = document.querySelector('#progress').firstElementChild;
            var percent = (currentTime * 1000) / this.props.song.duration;

            ele.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
            ele.setAttribute('data-time', `${helper.getTime(currentTime * 1000)} / ${helper.getTime(this.props.song.duration)}`);
        }, 450);
    }

    buffering(e) {
        var ele = document.querySelector('#progress').lastElementChild;
        var buffered = e.target.buffered.end(e.target.buffered.length - 1);

        if (buffered >= 100) {
            buffered = 100;
        }

        ele.style.transform = `translate3d(${-100 + buffered}%, 0, 0)`;
    }

    render() {
        var song = this.props.song.data || {};

        return (
            <audio
                autoPlay={true}
                onAbort={e => this.progress(0)}
                onEnded={e => this.props.next()}
                onError={e => console.log(e)}
                onTimeUpdate={e => this.progress(e.target.currentTime)}
                onProgress={e => this.buffering(e)}
                ref="player"
                src={song.src}
                style={{
                    display: 'none'
                }} />
        );
    }
}
