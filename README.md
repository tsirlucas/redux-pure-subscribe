# Redux pure subscribe

A store subscribe function that checks if state has changed before trigger.

[![Greenkeeper badge](https://badges.greenkeeper.io/tsirlucas/redux-pure-subscribe.svg)](https://greenkeeper.io/) [![build status](https://img.shields.io/travis/tsirlucas/redux-pure-subscribe/master.svg)](https://travis-ci.org/tsirlucas/redux-pure-subscribe) [![code climate](https://codeclimate.com/github/tsirlucas/redux-pure-subscribe/badges/gpa.svg)](https://codeclimate.com/github/tsirlucas/redux-pure-subscribe) [![coveralls](https://img.shields.io/coveralls/tsirlucas/redux-pure-subscribe/master.svg)](https://coveralls.io/github/tsirlucas/redux-pure-subscribe)

Supports modern browsers and IE9+:

[![Browsers](https://saucelabs.com/browser-matrix/tsirlucas-rps.svg)](https://saucelabs.com/u/tsirlucas-rps)

## Installing

```sh
npm install immutable-merge-operators --save
```

> :exclamation: **Pro Tip:** Use [Yarn](https://yarnpkg.com/) to install dependencies 3x faster than NPM!

```sh
yarn add immutable-merge-operators
```

## Why?

As you can check [here](https://github.com/reactjs/redux/issues/303#issuecomment-125184409), in Redux, store's subscribe method should not be used directly because it's a low level API. The store API is meant to be extensible, so Dan did it simple as possible. The thing is that your subscribe method will trigger everytime the dispatch method is called, not everytime the store changes. redux-pure-subscribe is a post-execution pull that checks if some part of your state has changed before triggers and then calls the cb function. OBS: We use a shallow comparison algorithm with object/array reference equality check (its fast!), so you may need some immutable lib like [immutable-merge-operators](https://github.com/tsirlucas/immutable-merge-operators)

## How?

I'ts actually very simple, you just need to import and use passing the store as first argument and a cb function as second.

```js
import pureSubscribe from 'redux-pure-subscribe';

pureSubscribe(store, callback);
```

## Current state as callback argument

redux-pure-subscribe passes the store current state as an argument to the cb function, so its easier for you to use it.

```js
const callback = function(state) {
  const cats = state.myCats;
};

pureSubscribe(store, callback);
```

You can also use object destruction and make it funnier

```js
const callback = function({myCats, myDogs, myBirds}) {
  const pets = {myCats, myDogs, myBirds}
};

pureSubscribe(store, callback);
```

## Specific observer as third parameter

You can also pass an array of trees you want to observe for changes, so if your component should only trigger when specifics parts of your state changes, you can pass it as a third parameter

```js
 pureSubscribe(store, callback, 'myCats'); // We also accept a strig in case you just want to observe one path
```

## Auto first trigger to get initial state

redux-pure-subscribe will trigger the cb function at least once to get the initial state from store, so you wont need to do this anymore:

```js
callback();
pureSubscribe(store, callback);
```
