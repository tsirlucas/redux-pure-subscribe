const shallowEqual = (a, b) => {
  for (let key in a) if (a[key] !== b[key]) return false;
  for (let key in b) if (!(key in a)) return false;
  return true;
};

const equalTrees = (currState, nextState, trees) => {
  trees.forEach((element) => {
    if (currState[element] !== nextState[element]) return false;
  });
  return true;
};

const changedOnTrees = (currState, nextState, trees) => {
  if (!trees) {
    return !shallowEqual(currState, nextState);
  }
  return equalTrees(currState, nextState, trees);
};

export const pureSubscribe = (store, onChange, trees) => {
  let currentState;

  function handleChange() {
    let nextState = store.getState();
    if (changedOnTrees(currentState, nextState, trees)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};
