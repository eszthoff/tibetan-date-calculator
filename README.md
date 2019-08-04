A Javascript library to calculate Tibetan calendrical dates according
to the Phugpa tradition. 

The calculations are basically implementation the formulas in Svante Janson,
["Tibetan Calendar Mathematics"](http://www2.math.uu.se/~svante/papers/calendars/tibet.pdf). We are using year 806 as the epoch for all calculations. See the paper for details.

# Installation
npm install tibetan-date-calculator

# Usage
```javascript
import { TibetanDate, TibetanMonth, TibetanYear }  from 'tibetan-date-calculator';
```

# API
The API exposes 3 classes: `TibetanDate`, `TibetanMonth`, `TibetanMonth`

## TibetanDate

```javascript
tibDate = new TibetanDate(arg)
```

__arg__: __`undefined`__

This will return tibeatan date object for today.

__arg__: __`String`__

This will return tibetan date object for the _wester date_ `new Date(arg)`.

__arg__: __`Object`__

This will return tibetan day according to object definition:

| keys           | type      | default | description                                          |
| -------------- | --------- | ------- | ---------------------------------------------------- |
| `year`         | `number`  |         | Tibetan year number (ex. 2135)                       |
| `month`        | `number`  |         | Tibetan month number (1 to 12)                       |
| `isLeapMonth`  | `boolean` | false   | is this month a leap month (first of repeated months)|
| `day`          | `number`  |         | Tibetan day number (1 to 30)                         |
| `isLeapDay`    | `boolean` | false   | is this day a leap day (first of repeated day)       |

#### Properties

These can be accessed directly `tibDate.property`

| property            | type           | description                                          |
| ------------------- | -------------- | ---------------------------------------------------- |
| `westernDate`       | `Date`         | a JS Date object cooresponding to this date          |
| `year`              | `number`       |  |
| `month`             | `number`       |  | 
| `date`              | `number`       |  |
| `day`               | `number`       | same as calling `westernDate.getDay()` |
| `yearObj`           | `TibetanYear`  |  |
| `monthObj`          | `TibetanMonth` |  |
| `isDoubledDay`      | `boolean`      |  |
| `isLeapDay`         | `boolean`      |  |
| `isSkippedDay`      | `boolean`      | is this date skipped in the Tibetan calendar         |
| `isPreviousSkipped` | `boolean`      |  |
| `westernDateStr`    | `string`       |  |

#### Methods

`TibetanDate` exposes a set of methods to mimic the native `Date` behaviour.

| method              | returns        | description                         |
| ------------------- | -------------- | ----------------------------------- |
| `getWesternDate()`  | `Date`         | same as the property `westernDate`  |
| `getYear()`         | `number`       | same as the property `year`         |
| `getMonth()`        | `number`       | same as the property `month`        |
| `getDate()`         | `number`       | same as the property `date`         |
| `getDay()`          | `number`       | same as the property `day`          |
| `getMonthObj()`     | `TibetanMonth` | same as the property `monthObj`     | 
| `getYearObj()`      | `TibeatnYear`  | same as the property `yearObj`      | 

## TibetanMonth

```javascript
tibMonth = new TibetanMonth(arg)
```

__arg__: __`undefined`__

This will return tibeatan month object that includes today.

__arg__: __`String`__

This will return tibetan month object that includes the _wester date_ `new Date(arg)`.

__arg__: __`Object`__

This will return tibetan month according to object definition:

| keys           | type      | default | description                                          |
| -------------- | --------- | ------- | ---------------------------------------------------- |
| `year`         | `number`  |         | Tibetan year number (ex. 2135)                       |
| `month`        | `number`  |         | Tibetan month number (1 to 12)                       |
| `isLeapMonth`  | `boolean` | false   | is this month a leap month (first of repeated months)|

#### Properties

These can be accessed directly `tibDate.property`

| property            | type           | description                                          |
| ------------------- | -------------- | ---------------------------------------------------- |
| `year`              | `number`       |  |
| `month`             | `number`       |  | 
| `isLeapMonth`       | `boolean`      |  |
| `isDoubledMonth`    | `boolean`      |  |
| `startDateStr`      | `string`       |  |
| `endDateStr`        | `string`       |  |
| `yearObj`           | `TibetanYear`  |  |
| `days`              | `Array`        | need to call `getDays()` on the instance at least once to calculate it |

#### Methods

| method              | returns        | description                                          |
| ------------------- | -------------- | ---------------------------------------------------- |
| `getDays()`         | `Array`        | generates an array of `TibetanDays` within this month. Once called, the `days` property will be populated too.  |

## TibetanYear

```javascript
tibYear = new TibetanYear(arg, isWestern = false)
```

__arg__: __`undefined`__

This will return tibeatan year object that includes today.

__arg__: __`Number`__

This will return tibetan year passed, unless `isWestern` is set to `true`. In that case the `arg` will be interpreted as a western year number.

__arg__: __`Object`__

This will return tibetan year according to rabjung year definition:

| keys           | type      | description                                |
| -------------- | --------- | ------------------------------------------ |
| `rabjungCycle` | `number`  | The rabjung cycle number                   |
| `rabjungYear`  | `number`  | The year within the cycle (1 - 60)         |

#### Properties

These can be accessed directly `tibDate.property`

| property        | type      | description                                          |
| --------------- | --------- | ---------------------------------------------------- |
| `rabjungCycle`  | `number`  |  |
| `rabjungYear`   | `number`  |  | 
| `tibYearNum`    | `number`  |  |
| `westernYear`   | `number`  |  |
| `animal`        | `string`  |  |
| `element`       | `string`  |  |
| `gender`        | `string`  |  |
| `months`         | `Array`   | need to call `getMonth()` on the instance at least once to calculate it |

#### Methods

| method              | returns        | description                                          |
| ------------------- | -------------- | ---------------------------------------------------- |
| `getMonths()`       | `Array`        | generates an array of `TibetanMonth` within this year. Once called, the `months` property will be populated too.  |

## Examples ##
