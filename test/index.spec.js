import {createStore, combineReducers} from 'redux';

import {pureSubscribe} from '../src/index';

const tree1Reducer = (state = {person: {name: 'foo'}}, action) => {
  switch (action.type) {
    case 'CHANGE_TREE_1':
      return {person: {name: 'fooBar'}};
    case 'CHANGE_NOTHING':
      return state;
    default:
      return state;
  }
};

const tree2Reducer = (state = {person: {name: 'bar'}}, action) => {
  switch (action.type) {
    case 'CHANGE_TREE_2':
      return {person: {name: 'barFoo'}};
    case 'CHANGE_NOTHING':
      return state;
    default:
      return state;
  }
};

const asyncReducer = (state = {person: {name: 'async'}}, action) => {
  switch (action.type) {
    case 'CHANGE_ASYNC_TREE':
      return {person: {name: 'asyncChanged'}};
    case 'CHANGE_NOTHING':
      return state;
    default:
      return state;
  }
};

const createReducers = (asyncReducers) => {
  return combineReducers({
    tree1: tree1Reducer,
    tree2: tree2Reducer,
    ...asyncReducers
  });
};

const configureStoreToAsyncReducers = () => {
  const store = createStore(createReducers());
  store.asyncReducers = {};
  return store;
};

const injectAsyncReducer = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducers(store.asyncReducers));
};

describe('pureSubscribe function', () => {
  it('should trigger function when someting changes', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback);

    store.dispatch({type: 'CHANGE_TREE_1'});

    expect(spied.callback).toHaveBeenCalled();

  });

  it('should not trigger function when nothing changes', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback);

    store.dispatch({type: 'CHANGE_NOTHING'});

    expect(spied.callback).not.toHaveBeenCalled();

  });

  it('should accept path that you want to observe and trigger when it changes', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback, 'tree1');

    store.dispatch({type: 'CHANGE_TREE_1'});

    expect(spied.callback).toHaveBeenCalled();
  });

  it('should accept path that you want to observe and dont trigger when others change', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback, 'tree1');

    store.dispatch({type: 'CHANGE_TREE_2'});

    expect(spied.callback).not.toHaveBeenCalled();
  });

  it('should accept array of paths that you want to observe and trigger when they change', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback, ['tree1']);

    store.dispatch({type: 'CHANGE_TREE_1'});

    expect(spied.callback).toHaveBeenCalled();
  });

  it('should accept array of paths that you want to observe and dont trigger when others change', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback, ['tree1']);

    store.dispatch({type: 'CHANGE_TREE_2'});

    expect(spied.callback).not.toHaveBeenCalled();
  });

  it('should return unsubscribe method and dont trigger after unsubscribe', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = createStore(createReducers());

    spyOn(spied, 'callback');

    const unsubscribe = pureSubscribe(store, spied.callback);

    unsubscribe();

    store.dispatch({type: 'CHANGE_TREE_2'});

    expect(spied.callback).not.toHaveBeenCalled();
  });

  it('should detect injected async reducers', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = configureStoreToAsyncReducers();

    spyOn(spied, 'callback');

    pureSubscribe(store, spied.callback);

    injectAsyncReducer(store, 'async', asyncReducer);

    expect(spied.callback).toHaveBeenCalled();
  });

  it('should detect changes on injected async reducers', () => {
    const spied = {callback: () => 'testing subscribe trigger'};

    const store = configureStoreToAsyncReducers();

    pureSubscribe(store, spied.callback);

    injectAsyncReducer(store, 'async', asyncReducer);


    spyOn(spied, 'callback');

    // Necessary for now once spyOn only gets calls after some time and I cant call it before inject
    setTimeout(() => {
      store.dispatch({type: 'CHANGE_ASYNC_TREE'});
      expect(spied.callback).toHaveBeenCalled();
    }, 50);
  });
});
