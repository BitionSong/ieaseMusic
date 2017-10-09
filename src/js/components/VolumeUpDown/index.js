
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ipcRenderer } from 'electron';
import injectSheet from 'react-jss';

import classes from './classes';

@inject(stores => ({
    volume: stores.preferences.volume,
    isMuted: () => stores.preferences.volume === 0,
}))
@observer
class VolumeUpDown extends Component {
    state = {
        // true: up, false: down
        direction: true,
    };

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate() {
        this.refs.container.classList.add(this.props.classes.animated);
    }

    animationDone() {
        this.refs.container.classList.remove(this.props.classes.animated);
    }

    componentDidMount() {
        ipcRenderer.on('player-volume-up', () => {
            this.setState({
                direction: true,
            });
        });

        ipcRenderer.on('player-volume-down', () => {
            this.setState({
                direction: false,
            });
        });
    }

    render() {
        var { classes, isMuted, direction } = this.props;

        return (
            <div
                className={classes.container}
                onAnimationEnd={() => this.animationDone()}
                ref="container">
                {
                    isMuted()
                        ? <i
                            className="ion-ios-volume-low"
                            style={{
                                fontSize: 32,
                            }} />
                        : (
                            direction
                                ? <i className="ion-volume-low" />
                                : <i className="ion-volume-medium" />
                        )
                }
            </div>
        );
    }
}

export default injectSheet(classes)(VolumeUpDown);
