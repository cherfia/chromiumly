import { PathLike, ReadStream } from 'fs';

export type PathLikeOrReadStream = PathLike | ReadStream;

export type Metadata = {
    [key: string]: boolean | number | string | string[];
};

export type DownloadFrom = {
    url: string;
    extraHttpHeaders?: Record<string, string>;
};

export type Split = {
    mode: 'pages' | 'intervals';
    span: string;
    unify?: boolean;
    flatten?: boolean;
};
