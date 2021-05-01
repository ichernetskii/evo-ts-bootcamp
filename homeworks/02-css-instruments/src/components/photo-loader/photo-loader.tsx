import React from "react";
import s from "./photo-loader.module.scss";
import {PhotoSet} from "../photo-set/photo-set";

interface IPhotoLoaderState {
    text: string,
    query: string
}

class PhotoLoader extends React.Component<{}, IPhotoLoaderState> {
    state: IPhotoLoaderState = {
        text: "cat",
        query: "cat"
    }

    private onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, text: event.target.value });
    }

    private onQueryEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") this.setState({ ...this.state, query: this.state.text });
    }

    private onFindClick = () => {
        this.setState({ ...this.state, query: this.state.text });
    }

    render() {
        return (
            <div className={s.root}>
                <div className={s.query__wrapper}>
                    <div className={s.query}>
                        <input
                            className={s.query__input}
                            type="edit"
                            value={this.state.text}
                            onChange={this.onQueryChange}
                            onKeyDown={this.onQueryEnter}
                        />
                        <button className={s.query__button} onClick={this.onFindClick}>Find 🔍</button>
                    </div>
                </div>
                <PhotoSet query={this.state.query} />
            </div>
        )
    }
}

export default PhotoLoader;
