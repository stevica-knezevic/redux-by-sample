import configureStore from 'redux-mock-store';
import ReduxThunk from 'redux-thunk';
const middlewares = [ReduxThunk];
const mockStore = configureStore(middlewares);
import {hashHistory} from 'react-router';

import {loginRequestStartedAction} from '../loginRequestStarted';
import {loginRequestCompletedAction} from '../loginRequestCompleted';
import {loginApi} from '../../../../rest-api/loginApi';
import {actionsEnums} from '../../../../common/actionsEnums';
import {LoginEntity} from '../../../../model/login';
import {LoginResponse} from '../../../../model/loginResponse';

describe('loginRequestStartedAction', () => {
  it('When passing loginEntity.login equals "test login" and expected LoginResponse.succeeded equals true ' +
  'Should calls loginApi.login(loginEntity), hashHistory.push and dispatch loginRequestCompletedAction action', () => {
    // Arrange
    const loginEntity = new LoginEntity();
    loginEntity.login = "test login";

    const expectedData = new LoginResponse();
    expectedData.succeeded = true;

    loginApi.login = jest.fn(() => {
      return  {
        then: callback => {
          callback(expectedData);
        }
      };
    });

    hashHistory.push = jest.fn();

    // Act
    const store = mockStore([]);

    store.dispatch(loginRequestStartedAction(loginEntity))
      .then((data) => {
        // Assert
        expect(loginApi.login).toHaveBeenCalledWith(loginEntity);
        expect(data).toBe(expectedData);
        expect(store.getActions()[0].type).toBe(actionsEnums.USERPROFILE_PERFORM_LOGIN);
        expect(store.getActions()[0].payload).toBe(expectedData);
        expect(hashHistory.push).toHaveBeenCalledWith('/student-list');
      });
  });
});
