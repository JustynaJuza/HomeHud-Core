import { map } from "lodash";

import { addTask } from 'domain-task';

import { AppThunkAction, IAppState } from '../state';
import { Api } from '../api';
import { IListItem } from '../../components/admin/listPanel';

import * as ConfigActionTypes from './configActionTypes';
import * as ConfigActions from './configActions';

import { ConfigTypeAdapter } from './configTypeAdapter';


export const configActionCreators = {

    getList: (configName: string) => (dispatch: any, getState: any) => {
        var currentState: IAppState = getState();

        var currentList = currentState.config[configName];
        var configType = new ConfigTypeAdapter(configName);

        if (currentList.length === 0) {
            var api = new Api();

            var loadingTask = api.getJson<IListItem[]>(currentState.request.baseUrl + configType.getApiUrl())
                .then((list) => {

                    var typedList = map(list, (i: IListItem) => Object.setPrototypeOf(i, configType.getPrototype()));

                    dispatch(<ConfigActions.SetConfigEntriesAction>
                        { type: ConfigActionTypes.SetConfigEntries, configEntry: configName, entries: typedList });
                });

            // ensures server-side prerendering waits for this to complete
            addTask(loadingTask);

        } else if (Object.getPrototypeOf(currentList[0]) !== configType.getPrototype()) {
            var typedList = map(currentList, i => Object.setPrototypeOf(i, configType.getPrototype()));

            dispatch(<ConfigActions.SetConfigEntriesAction>
                { type: ConfigActionTypes.SetConfigEntries, configEntry: configName, entries: typedList });
        }
    }
};