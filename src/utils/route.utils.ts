import { ViewType } from '@/types/views.types';

interface Route {
    path: string;
    params: any;
}

export const determineViewTypeAndId = (route: Route) => {
    let viewType = ViewType.RUNS;
    let id = null;

    if (route.path.startsWith('/dashboard')) {
        viewType = ViewType.RUNS;
    } else if (route.path.startsWith('/runs')) {
        viewType = ViewType.SINGLE_RUN;
        id = route.params.runId;
    } else if (route.path.startsWith('/scenarios')) {
        viewType = ViewType.SCENARIO;
        id = route.params.scenarioId;
    }

    return { viewType, id };
};