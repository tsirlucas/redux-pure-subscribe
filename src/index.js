const shallowEqual = (a, b) => {
  for (let key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
};

const equalTrees = (currState, nextState, trees) => {
  if (trees.constructor === Array) {
    for (let i = 0, l = trees.length; i < l; i++) {
      let element = trees[i];
      if (currState[element] !== nextState[element]) {
        return false;
      }
    }
    return true;
  }

  return currState[trees] === nextState[trees];
};

const changedOnTrees = (currState, nextState, trees) => {
  if (!trees) {
    return !shallowEqual(nextState, currState);
  }
  return !equalTrees(currState, nextState, trees);
};

export const pureSubscribe = (store, onChange, trees) => {
  let currentState;

  function handleChange() {
    let nextState = store.getState();
    if (currentState && changedOnTrees(currentState, nextState, trees)) {
      onChange(currentState);
    }
    currentState = nextState;
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};
