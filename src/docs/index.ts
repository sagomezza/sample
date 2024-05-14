import { basicInfo } from './basicInfo';
import { servers } from './servers';
import { tags } from './tags';
import { components } from './components';
import { paths } from './paths';

const docs = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...paths
}

export default docs;
