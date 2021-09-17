# scroll-Snap - WebComponent
the layout chang event will be emited when you use the scroll snap

## Background

When I discovered that CSS scroll-snap was used, there were no event callbacks when layout were changed. This specification started as a result of that.


## Install

This project uses [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install @bfchain/virtual-scroll --save
```

## Usage

<scroll-snap onlayoutchange="layoutChange(event,this)">
    <div name="scroll-container">
        <div class="slide slide1"></div>
        <div class="slide slide2"></div>
    </div>
</scroll-snap>

```sh
# Remember add attribute`name="scroll-container"` to the element when you use it.
```

## Example Readmes

<scroll-snap onlayoutchange="layoutChange(event,this)">
    <style>
        .slides {
            width: 200px;
            height: 300px;
            overflow: scroll hidden;
            scroll-snap-type: x mandatory;
            display: flex;
        }
        .slide {
            height: 100%;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            flex: none;
        }
        .slide1 {
            width: 100%;
            background-color: blanchedalmond;
        }
        .slide2 {
            width: 50px;
            background-color: aqua;
        }
    </style>
    <div class="slides" name="scroll-container">
        <div class="slide slide1"></div>
        <div class="slide slide2"></div>
    </div>
</scroll-snap>

## Maintainers

[@Huiyong-Chen](https://github.com/Huiyong-Chen)。

## License

[MIT](LICENSE) © Huiyong Chen
