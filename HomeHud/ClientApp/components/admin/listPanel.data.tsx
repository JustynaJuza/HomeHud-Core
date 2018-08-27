import * as React from 'react'
import * as ReactDataGrid from 'react-data-grid';
import { ConfigTypeAdapter } from '../../store/config/configTypeAdapter';

export function renderData(configName: string, rows: any) {
    var configService = new ConfigTypeAdapter(configName);

    return (
        <ReactDataGrid
            columns={configService.getListColumns()}
            rowGetter={(i: number) => rows[i]}
            rowsCount={rows.length}
            minHeight={500} />
    );
}