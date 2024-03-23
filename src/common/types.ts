import { PathLike, ReadStream } from 'fs';

export type PathLikeOrReadStream = PathLike | ReadStream;

export type Metadata = {
    [key: string]: boolean | number | string | string[];
};
