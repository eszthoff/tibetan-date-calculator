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

__Note__: using date string without time stamp (e.g. '2019-06-21') can create bugs when run in different timezones due to the way native Date object handles it. See [Date documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date)

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
| `westernDate`       | `Date`         | a JS Date object corresponding to this date          |
| `year`              | `number`       | Tibetan year number (ex. 2135)                       |
| `month`             | `number`       | Tibetan month number (1 to 12)                       | 
| `date`              | `number`       | Tibetan date number (1 to 30)                        |
| `day`               | `number`       | day of the week, same as calling `westernDate.getDay()` |
| `yearObj`           | `TibetanYear`  |  |
| `monthObj`          | `TibetanMonth` |  |
| `isDoubledDay`      | `boolean`      |  |
| `isLeapDay`         | `boolean`      |  |
| `isSkippedDay`      | `boolean`      | is this date skipped in the Tibetan calendar         |
| `isPreviousSkipped` | `boolean`      | is the previous date skipped (e.g. date=3 is 2 skipped) |
| `westernDateStr`    | `string`       | YYYY-MM-DD |

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
| `toString()`        | `string`       | returns 'year-month(-leap/-main)-date(-leap/-main)' |

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
| `year`              | `number`       | Tibetan year number (ex. 2135)                       |
| `month`             | `number`       | Tibetan month number (1 to 12)                       | 
| `isLeapMonth`       | `boolean`      | is this month a leap month (first of repeated months)|
| `isDoubledMonth`    | `boolean`      | is this month doubled (either leap or main)          |
| `startDateStr`      | `string`       | western date string for the first date of the month  |
| `endDateStr`        | `string`       | western date string for the last date of the month   |
| `yearObj`           | `TibetanYear`  | TibetanYear object                                   |
| `days`              | `TibetanDate[]`| list of days in the month, skipped days are not included. Need to call `getDays()` on the instance at least once to calculate it |
| `toString()`        | `string`        | returns 'year-month(-leap/-main)'                     |

#### Methods

| method              | returns        | description                                          |
| ------------------- | -------------- | ---------------------------------------------------- |
| `getDays()`         | `TibetanDate[]`| generates an array of `TibetanDays` within this month, excluding skipped days. Once called, the `days` property will be populated too.  |

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
| `months`        | `TibetanMonth[]`| need to call `getMonth()` on the instance at least once to calculate it |

#### Methods

| method              | returns         | description                                          |
| ------------------- | --------------- | ---------------------------------------------------- |
| `getMonths()`       | `TibetanMonth[]`| generates an array of `TibetanMonth` within this year. Once called, the `months` property will be populated too.  |
| `toRabjungString()` | `string`        | returns 'The X. year of the Y. rabjung cycle'        |
| `toString()`        | `string`        | returns the Tibetan year number as string            |

## Examples ##
