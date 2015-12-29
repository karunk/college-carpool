<p align="center">
  <a href="https://angularclass.com" target="_blank">
    <img src="https://cloud.githubusercontent.com/assets/1016365/10356922/151a0a3c-6d31-11e5-8bf0-64360320d908.png" alt="ng-fx" width="500" height="320"/>
  </a>
</p>
# ng-fx
> animation library for angular


# Overview [![Build Status](https://travis-ci.org/AngularClass/ngFx.svg?branch=master)](https://travis-ci.org/angularclass/ngFx)
ng-fx is an angular implementation of the popular [Animate.css](https://daneden.github.io/animate.css/) using the new `$animateCss` service in angular. This is the core and foundation, but there is room for so much more. You can use these css animations dynamically with zero setup. So you get the best of both worlds (css vs js animations). Take a look and enjoy.

# Getting started

## Installing
**ng-fx requires `ngAnimate >=1.4`.** Previous versions of ng-fx `<2.0` support earlier versions of `ngAnimate`, but dev support is lacking there. If you would love to help maintain, let me know!

using `npm`
  * `npm i --save ng-fx`
``` javascript
  angular.module('app', [
    require('ng-fx'),
    require('ngAnimate')
  ])
```

## Using animations
ng-fx makes it so simple to use animations by tying into `ngAnimate` and [all the hooks]('https://code.angularjs.org/1.4.7/docs/guide/animations') it provides.

### First animation
After installing ng-fx, using the animations are as easy as declaring css classes on elements.
```html
<div ng-if="show" class="fx-fade-normal"></div>
```
Few things happening here. First, we must tie into animations from `ngAnimate`, in this case we're attaching an animation to the `enter` and `leave` hooks of `ng-if`. Next we declare the animation type by using the `fx` namespace followed by the animation name (`fx-fade-normal`). Place this in the class of the element. That's it. ng-fx has an api to adjust the animations' speed, ease, and to stagger or not. Here's a list of all the [animations ng-fx supports](https://github.com/angularclass/ngFx/blob/master/animationList.txt)

### Adjusting speed
ng-fx looks like innocent css animations. They are ran like css animations (performance!!!) but they are indeed dynamic like js animations as well. Here's how we can adjust the speed of an animation.
```html
<div ng-show="error" class="fx-fade-up fx-speed-342"></div>
```

Using the `fx-[speed | dur | duration]-{any num in ms}` we can control the speed of said animation. So the following are all equivalent.
* `fx-speed-230`
* `fx-dur-230`
* `fx-duration-230`

### Adjusting the ease
```html
<div
  ng-repeat="card in cards"
  class="fx-fade-up fx-ease-sine">
</div>
```
Using `fx-ease-{curve name}` will apply the given curve to the animation. Here is a list of all the [curves ng-fx supports](https://github.com/angularclass/ngFx/blob/master/easingList.txt)

### Staggering
With `ngAnimate` 1.4, we now have support for staggering outside of css animations.

```html
<div
  ng-repeat="card in cards"
  class="fx-rotate-up-left fx-stagger-245">
</div>
```

Using `fx-stagger-{delay in ms}` on an animation in `ng-repeat` will stagger those elements with the given delay in between.

### Contributing
All help is welcome! ng-fx is an ongoing and live project. If you'd like to add more animations or support new feature, open an issue and even submit it yourself. If you're new to open source, I'll help you get your first commit in, ping me. To get started make sure you have...

* `node >=0.12`
* `gulp`
* `webpack`

If you're good there, then...

* `fork`
* `clone` your fork
* cut a new branch
* `npm install`
* `npm start`

This will compile and build the project. ng-fx uses `ES2015`, `webpack`, and `gulp`, nothing else too fancy here.

There is a demo app to try out the animations.

Most the commands you'll need are baked into `npm`
* `npm run build`
  * builds and outputs regular and min src code
* `npm test`
  * run test
* `npm start`
  * run build and watch for changes to rebuild, launches the demo app and refreshes that on change.

Some helpful commands in gulp

* `gulp animation --name animation-name`
  * call this command with a new animation name and it will create all the boilerplate in the `src/animation/element/` that you need to get started with a new animation.
  
We use ,*cough*, try to use the [angular contributing guidelines]('https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit')
