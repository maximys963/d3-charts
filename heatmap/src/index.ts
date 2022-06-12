import * as d3 from 'd3'
import dataset from './dataset/dataset.json'

import validateMonthNumber from "./utlis/validateMonthNumber";

import './main.css'

const SVG_CONTAINER_WIDTH = 1603
const SVG_CONTAINER_HEIGHT = 540
const SVG_CONTAINER_PADDING = 10

const XAXIS_TITLE_WIDTH = 268

const CHART_HEIGHT = 396
const CHART_WIDTH = 1315

const years: Date[] = dataset.monthlyVariance.map(d => new Date(`${d.year}`))
// console.log('monthlyVariance', dataset.monthlyVariance)
const months: Date[] = dataset.monthlyVariance.map(d => new Date(0, validateMonthNumber(d.month)))
const monthFormat = d3.timeFormat('%B')

console.log('dataset.monthlyVariance', dataset)

const svg = d3.select('#root')
  .append('svg')
  .attr('width', SVG_CONTAINER_WIDTH)
  .attr('height', SVG_CONTAINER_HEIGHT)

console.log('years', (d3.extent(years)))

const chartTransformX = SVG_CONTAINER_PADDING + XAXIS_TITLE_WIDTH
const xScale = d3.scaleTime()
  .domain(d3.extent(years))
  .range([chartTransformX, SVG_CONTAINER_WIDTH - SVG_CONTAINER_PADDING])

const yScale = d3.scaleTime()
  .domain(d3.extent(months))
  .range([SVG_CONTAINER_PADDING, CHART_HEIGHT + SVG_CONTAINER_PADDING])

const xAxis = d3.axisBottom(xScale).ticks(20)
const yAxis = d3.axisLeft(yScale).tickFormat(monthFormat)

svg.append('g')
  .attr('id','x-axis')
  .attr('transform', `translate(0,${CHART_HEIGHT + SVG_CONTAINER_PADDING})`)
  .call(xAxis)

svg.append('g')
  .attr('id', 'y-axis')
  .attr('transform', `translate(${chartTransformX}, 0)`)
  .call(yAxis)
