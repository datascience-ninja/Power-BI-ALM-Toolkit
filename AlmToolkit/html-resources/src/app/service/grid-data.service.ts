import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AppLogService } from '../app-log/app-log.service';
import { WindowReferenceService } from './window-reference.service';

import { DatabaseSourceData } from '../shared/mocks/data-list';
import { ComparisonNode } from '../shared/model/comparison-node';

@Injectable()
export class GridDataService {

  private _window: Window;
  private databaseObjects: ComparisonNode[];

  constructor(private logService: AppLogService, private windowRef: WindowReferenceService) {
    this._window = this.windowRef.nativeWindow;
  }

  /**
   * Get the data from the C# application
   */
  getGridDataToDisplay(): Observable<ComparisonNode[]> {
    this.logService.add('Grid data service: Getting data from C#', 'info');
    return fromPromise(this._window['comparisonJSInteraction']
      .getComparisonList())
      .pipe(map((data: string) => JSON.parse(data)));
  }

  /**
   * Send the change done to the C# application
   * @param id - Id of the node for which action was changed
   * @param newAction - The updated action
   * @param oldAction - The old action that was selected
   */
  sendChange(id: number, newAction: string, oldAction: string): void {
    this.logService.add('Grid data service: Updating C# object on change in element', 'info');
    this._window['comparisonJSInteraction'].changeOccurred(id, newAction, oldAction);
  }

  /**
   * Send the selected action and status to C# application
   * @param action - Action to be performed
   * @param status - Status of nodes for which the action is to be performed
   * @param selectedNodes - List of node Ids which are selected
   */
  sendSelectedNodesAndAction ( action: string, status: string, selectedNodes: number[] ) {
    this.logService.add('Grid data service: Sending the selected nodes and the action to be performed to C#', 'info');
    this._window['comparisonJSInteraction'].performActionsOnSelectedActions(action, status, selectedNodes);
  }
}
