# EclipSky

## Introduction
The North American eclipse of August 21, 2017 offered people in a large part of the USA the chance to view a total eclipse of the Sun.

Storms often pop up quickly in August, so an ideal spot for viewing the eclipse may turn out to be overcast or even rainy, as was the case in Charleston, SC for the recent eclipse.

EclipSky integrates Google's Map API with Aeris Weather to show current viewing conditions and the path of the eclipse, so that a user may identify the nearest weather stations reporting good viewing conditions, i.e., sunny or partly sunny conditions.

## Installation
EclipSky is a single web page that can be loaded in any current browser. It has been tested in Mozilla Firefox, Google Chrome and Apple Safari (desktop and iOS versions)

## Usage
### Station Markers
The default map shows the entire USA and the path from which the total eclipse could have been viewed. Initially, icons showing current conditions reported by the ten weather stations in the most populated areas are shown.

Clicking on the map will show the conditions at the five weather stations nearest the click.

Clicking on the weather station marker will reveal the station's ID and the time since the condition report was generated.

The reports can be filtered using the selector to limit the reports to sunny, mostly sunny or better, etc.

## Credits
Google Map API
Aeris Weather API
NASA eclipse polylines (NASA in turn attributes these and other calculation scripts on their eclipse page to [Xavier Jubier](http://xjubier.free.fr)