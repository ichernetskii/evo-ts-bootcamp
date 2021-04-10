import React from "react";
import s from "./photo-set.module.scss";
import { createApi } from "unsplash-js";

type Photo = {
    alt_description: string,
    description: string,
    likes: number,
    id: number;
    width: number;
    height: number;
    urls: { large: string; regular: string; raw: string; small: string };
    color: string | null;
    user: {
        username: string;
        name: string;
    };
};

const api = createApi({
    accessKey: "aUZkPDAweOjJUDp-oJfQXoMpcFZ_HRigipkAbxt3ZQ8"
});

interface IPhotoSetState {
    photos: Photo[]
}

class PhotoSet extends React.Component<{}, unknown> {
    state: IPhotoSetState = {
        photos: []
    }

    query: string = "cat";

    private loadPhotos(query: string):void {
        api.search
            .getPhotos({ query, perPage: 29 })
            .then(result => {
                if (result.type === "success")
                    this.setState({ ...this.state, photos: result?.response?.results })
            })
            .catch(() => {
                console.error("something went wrong!");
            });
    }

    componentDidMount(): void {
        this.loadPhotos(this.query);
    }

    private onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.query = event.target.value;
    }

    private onQueryEnter = (event: any) => {
        if (event.code === "Enter")
            if (event.target.value) this.loadPhotos(event.target.value);
    }

    private onFindClick = () => {
        if (this.query) this.loadPhotos(this.query);
    }

    render() {
        return (
            <div className={s.root}>
                <div className={s.query__wrapper}>
                    <div className={s.query}>
                        <input
                            className={s.query__input}
                            type="edit"
                            defaultValue={this.query}
                            onChange={this.onQueryChange}
                            onKeyDown={this.onQueryEnter}
                        />
                        <button className={s.query__button} onClick={this.onFindClick}>Find 🔍</button>
                    </div>
                </div>
                {
                    this.state.photos.map(photo => (
                        <a className={s.image} key={photo.id} href={photo.urls.regular} target="_blank" rel="noreferrer">
                            <img
                                className={s.image__content}
                                src={photo.urls.regular}
                                alt={photo.alt_description}
                            />
                            <div className={s.image__size}>
                                {photo.width}×{photo.height}
                            </div>
                            <div className={s.image__about}>
                                <div className={s.image__description}>
                                    { photo.description || `Photo by ${photo.user.name}` }
                                </div>
                                <div className={s.image__likes}>
                                    <svg className={s.image__heart} viewBox="0 0 100 92">
                                        <path d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71z" />
                                    </svg>
                                    <div className={s.image__likesCount}>{ photo.likes }</div>
                                </div>
                            </div>
                        </a>
                    ))
                }
                { (!this.state.photos.length) && (<div className={s.notFound}>Not found</div>) }
            </div>
        )
    }
}

export default PhotoSet;
