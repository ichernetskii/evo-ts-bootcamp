import React from "react";
import s from "./photo-set.module.scss";
import {createApi} from "unsplash-js";
import {ApiResponse} from "unsplash-js/dist/helpers/response";
import {Photos} from "unsplash-js/dist/methods/search/types/response";

interface IPhotoSetProps {
    query: string
}

interface IPhotoSetState {
    photos: Photo[]
}

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

export class PhotoSet extends React.Component<IPhotoSetProps, IPhotoSetState> {
    state: IPhotoSetState = {
        photos: []
    }

    private loadPhotos(query: string): void {
        api.search
            .getPhotos({ query, perPage: 29 })
            .then((result: ApiResponse<Photos>) => {
                if (result.type === "success")
                    this.setState({ ...this.state, photos: result?.response?.results as unknown as Photo[] })
            })
            .catch(() => {
                console.error("something went wrong!");
            });
    }

    componentDidMount(): void {
        this.loadPhotos(this.props.query);
    }

    componentDidUpdate(prevProps: Readonly<IPhotoSetProps>, prevState:Readonly<IPhotoSetState>): void {
        if (prevProps.query !== this.props.query) this.loadPhotos(this.props.query);
    }

    render() {
        return (
            <>
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
                                    <div className={s.image__descriptionText}>
                                        { photo.description || `Photo by ${photo.user.name}` }
                                    </div>
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
            </>
        )
    }
}

export default PhotoSet;
