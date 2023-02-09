/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isEmpty } from 'lodash/fp';

import type { EuiDataGridCellValueElementProps } from '@elastic/eui';
import type { EuiTheme } from '@kbn/kibana-react-plugin/common';
import type { EcsSecurityExtension as Ecs } from '@kbn/securitysolution-ecs';
import type { SortColumnTable } from '../types';
import type { ColumnHeaderOptions, SortDirection } from '../types';

export const isEventBuildingBlockType = (event: Ecs): boolean =>
  !isEmpty(event.kibana?.alert?.building_block_type);

/** Maps (Redux) `SortDirection` to the `direction` values used by `EuiDataGrid` */
export const mapSortDirectionToDirection = (sortDirection: SortDirection): 'asc' | 'desc' => {
  switch (sortDirection) {
    case 'asc': // fall through
    case 'desc':
      return sortDirection;
    default:
      return 'desc';
  }
};

/**
 * Maps `EuiDataGrid` columns to their Redux representation by combining the
 * `columns` with metadata from `columnHeaders`
 */
export const mapSortingColumns = ({
  columns,
  columnHeaders,
}: {
  columnHeaders: ColumnHeaderOptions[];
  columns: Array<{
    id: string;
    direction: 'asc' | 'desc';
  }>;
}): SortColumnTable[] =>
  columns.map(({ id, direction }) => {
    const columnHeader = columnHeaders.find((ch) => ch.id === id);
    const columnType = columnHeader?.type ?? '';
    const esTypes = columnHeader?.esTypes ?? [];

    return {
      columnId: id,
      columnType,
      esTypes,
      sortDirection: direction,
    };
  });

export const addBuildingBlockStyle = (
  ecs: Ecs,
  theme: EuiTheme,
  setCellProps: EuiDataGridCellValueElementProps['setCellProps'],
  defaultStyles?: React.CSSProperties
) => {
  const currentStyles = defaultStyles ?? {};
  if (isEventBuildingBlockType(ecs)) {
    setCellProps({
      style: {
        ...currentStyles,
        backgroundColor: `${theme.eui.euiColorHighlight}`,
      },
    });
  } else {
    // reset cell style
    setCellProps({
      style: {
        ...currentStyles,
        backgroundColor: 'inherit',
      },
    });
  }
};

/** Returns true when the specified column has cell actions */
export const hasCellActions = ({
  columnId,
  disabledCellActions,
}: {
  columnId: string;
  disabledCellActions: string[];
}) => !disabledCellActions.includes(columnId);
