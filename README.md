# dw-swipeable
A Material UI component to perform some action on swipe-left or swipe-right

## Usage
1. Import
```js
import '@dreamworld/dw-swipeable';
```

2. Use
```html
<dw-swipeable 
  @action=${this._onAction}
  .leftAction="${{left: {name: 'DELETE', caption: 'Delete', icon: 'delete'}}", 
  .rightAction="${{name: 'DELETE', caption: 'Delete'} }" >
     <div>Content Here</div>
</dw-swipeable>
```




## CSS Properties

| Name  | Description |
| ----  | ----------- |
| `--swipe-left-placeholder-color` | Text color of left action placeholder. |
| `--swipe-left-placeholder-bg-color` | Background color of left action placeholder |
| `--swipe-right-placeholder-color` | Text color of right action placeholder. |
| `--swipe-right-placeholder-bg-color` |  Background color of right action placeholder |
| `--swipe-content-bg-color` |  Background color of content |

 