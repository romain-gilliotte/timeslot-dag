<p align="center">
  <img width="898" height="196" src="https://raw.githubusercontent.com/romain-gilliotte/timeslot.js/master/assets/logo.png">
</p>

[![npm](https://img.shields.io/npm/dt/timeslot-dag.svg)](https://www.npmjs.com/package/timeslot-dag)
[![NpmLicense](https://img.shields.io/npm/l/timeslot-dag.svg)](https://www.npmjs.com/package/timeslot-dag)

TimeslotDAG is a helper library to work with calendar periods in a graph pattern. It has no support for periods under a day, nor deals with timezones in any way.

It was written as a companion library for the [`olap-in-memory`](https://github.com/romain-gilliotte/olap-in-memory) library, which itself is a companion library for [`monitool`](https://github.com/medecins-du-monde/monitool), a full-featured monitoring platform targeted at humanitarian organizations.


# Objectives

TimeslotDAG does not aim in any way to replace full-featured date libraries.

The main goals were:

- Have an easier API than prevalent date libraries *for the task at hand* (business intelligence / OLAP).
- Immutable, easy to localize, easy to serialize objects.
- Lightweight enough to be called thousand of times when aggregating report data.
- Meet specific needs
    - Proper epidemiological weeks numbering.
    - Splitted weeks.
    - Weeks starting on Saturday (Middle east).
    - (soon) Other calendars

# Installation

TimeslotDAG runs in both NodeJS and the browser, and has no production dependencies. [Typescript](https://www.typescriptlang.org/) typings are provided for auto-completion and type-checking.

With no minification an no compression, it's footprint is around 16KiB. With gzip compression it is around 3kiB.

```console
sh$ npm install timeslot-dag
```

# Usage

```javascript
const slot = new TimeSlot('2010-01')
slot.periodicity             // == 'month'
slot.firstDate               // == Date('2010-01-01')
slot.lastDate                // == Date('2010-01-31')

slot.previous()              // == TimeSlot('2009-12')
slot.next()                  // == TimeSlot('2010-02')
slot.toUpperSlot('quarter')  // == TimeSlot('2010-Q1')
```

### Creation

TimeSlots can be built in two ways.


```javascript
// With the constructor by passing a *slot identifier*, which is a unique string representing any given slot.
const slot1 = new TimeSlot('2010') // '2010' is a slot identifier

// With any date which is inside of the desired range, and the periodicity name
const slot2 = TimeSlot.fromDate(new Date('2010-05-25T03:00:00Z'), 'year')

// Both slots that were created in this sections are equal.
slot1 == slot2
```
### Supported periodicities

```
                                                      +  month_week_sat  <--+
                                                      |                     |
                                                      +  month_week_sun  <--+
                                                      |                     |
                                                      +  month_week_mon  <--+
    year <--+ semester <--+ quarter <--+  month <-----+                     +--+ day
                                                      +  week_sat        <--+
                                                      |                     |
                                                      +  week_sun        <--+
                                                      |                     |
                                                      +  week_mon        <--+
```

The `year`, `semester`, `quarter`, `month` and `day` periodicities, represent what is expected in the Gregorian calendar.

The `week_sat`, `week_sun` and `week_mon` periodicities represent 7 days weeks, repectively starting on saturday, sunday or monday.

```javascript
// The week starts on Monday 23rd, and finishes on Sunday 29th.
const date = new Date('2020-03-23T00:00:00Z')
const slot = TimeSlot.fromDate(date, 'month_week_mon')

// Weeks are numbered in the year
slot.value             // === '2020-W13-mon'
slot.next().value      // === '2020-W14-mon'

// Slot duration is always 7 days.
slot.firstDate         // === Date(2020-03-23)
slot.lastDate          // === Date(2020-03-29)
slot.next().firstDate  // === Date(2020-03-30)
slot.next().lastDate   // === Date(2020-03-05)
```

The `month_week_sat`, `month_week_sun`, `month_week_mon` represent weeks which are splitted at month boundaries, repectively starting on saturday, sunday or monday.

This is commonly used when data is collected weekly in order to power reports which are delivered both weekly and monthly, to avoid introducing errors.

```javascript
// The week starts on 23rd, and finishes on 29th of march
const date = new Date('2020-03-23T00:00:00Z')
const slot = TimeSlot.fromDate(date, 'month_week_mon')

// Slot duration is 7 days
slot.value             // === '2020-03-W5-mon'
slot.firstDate         // === Date(2020-03-23)
slot.lastDate          // === Date(2020-03-29)

// Next slot duration is 2 days (until end of the month) 
slot.next().value      // === '2020-03-W6-mon'
slot.next().firstDate  // === Date(2020-03-30)
slot.next().lastDate   // === Date(2020-03-31)

// Next slot duration is 5 days (so that next slot is aligned with monday)
slot.next().value      // === '2020-04-W1-mon'
slot.next().firstDate  // === Date(2020-04-01)
slot.next().lastDate   // === Date(2020-03-05)

// Next slot will be 7 days again
```

### Slot identifiers

Slots identifiers are constructed to be alphabetically sortable inside each periodicity, and represent a unique period across all periodicities.

Those characteristics make them well-behaved with OLAP tools (PowerBI, Tableau, ...).

They are formatted in the following way:
- year: `[yyyy]`
- month: `[yyyy]-[mm]`
- week_sat: `[yyyy]-W[ww]-sat`
- week_sun: `[yyyy]-W[ww]-sun`
- week_mon: `[yyyy]-W[ww]-mon`
- month_week_sat: `[yyyy]-[mm]-W[w]-sat`
- month_week_sun: `[yyyy]-[mm]-W[w]-sun`
- month_week_mon: `[yyyy]-[mm]-W[w]-mon`
- day: `[yyyy]-[mm]-[dd]`

### Slot aggregation

The `slot.toUpperSlot(periodicity)` method allows knowing in which *parent slot* the current slot is included.

Aggregating between `year`, `semester`, `quarter`, `month`, `day` and splitted weeks (`month_week_*`) is trivial and behaves like expected in the Gregorian calendar.

To aggregate TimeSlots with periodicity `week_*` (normal 7 days weeks) into months or larger periods, the week will go in the month which contains the most days.

```javascript
// Tuesday
const date = new Date('2019-12-31T00:00:00Z')

// Both the day and week are 2019
const slot = TimeSlot.fromDate(date, 'day')
slot.toUpperSlot('year')                          // === TimeSlot('2019')
slot.toUpperSlot('week_sat').toUpperSlot('year')  // === TimeSlot('2019')

// With a different intermediate periodicity, the day is in 2019,
// but the containing week is 2020.
const slot2 = TimeSlot.fromDate(date, 'day')
slot2.toUpperSlot('year')                          // === TimeSlot(2019)
slot2.toUpperSlot('week_mon').toUpperSlot('year')  // === TimeSlot(2020)
```

# If you consider using this project

Did you consider using any of the other alternatives? The most well-known are:

- [Going native](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) - JavaScript Date objects represent a single moment in time in a platform-independent format.
- [Luxon](https://moment.github.io/luxon/) - A powerful, modern, and friendly wrapper for Javascript dates and times.
- [date-fns](https://date-fns.org/) - Modern JavaScript date utility library
- [Moment.js](https://momentjs.com/) - Parse, validate, manipulate, and display dates and times in JavaScript.
- [js-joda](https://js-joda.github.io/js-joda/) - Immutable date and time library for javascript
- [day.js](https://github.com/iamkun/dayjs) - Fast 2kB alternative to Moment.js with the same modern API


# Coming next

- [ ] Flow typing
- [ ] Localization
- [ ] Support Nepali calendar