import * as d3 from 'd3'
import dataset from './dataset/dataset.json'

import getHitMapColor from "./utlis/getHitMapColor";
import decimalAdjust from "./utlis/decimalAdjust";

import './main.css'

const temperaturePoints = ['2.8', '3.9', '5', '6.1', '7.2', '8.3', '9.5', '10.6', '11.7', '12.8']
const legendRectanglesValues = ['2.8', '3.9', '5', '6.1', '7.2', '8.3', '9.5', '10.6', '11.7' ]

const SVG_CONTAINER_WIDTH = 1603
const SVG_CONTAINER_HEIGHT = 540
const SVG_CONTAINER_PADDING = 10

const XAXIS_TITLE_WIDTH = 268

const CHART_HEIGHT = 396
const CHART_WIDTH = 1315

const LEGEND_WIDTH = 400
const LEGEND_HEIGHT = 21
const LEGEND_SECTOR_WIDTH = LEGEND_WIDTH / (temperaturePoints.length + 1)
const LEGEND_SECTOR_HEIGHT = 27

const getLongMonthName = (month: number): string => {
    const date = new Date(0, month - 1)
    return date.toLocaleString('default', {month: 'long'})
}

const getYearsAmount = (years: number[]): number => {
    const yearExtent = d3.extent(years)
    return yearExtent[1] - yearExtent[0]
}

const years: Date[] = dataset.monthlyVariance.map(d => new Date(`${d.year}`))
const months: string[] = dataset.monthlyVariance.map(d => getLongMonthName(d.month))
console.log('months', months)

const svg = d3.select('#root')
    .append('svg')
    .attr('width', SVG_CONTAINER_WIDTH)
    .attr('height', SVG_CONTAINER_HEIGHT)

const chartTransformX = SVG_CONTAINER_PADDING + XAXIS_TITLE_WIDTH
const xScale = d3.scaleTime()
    .domain(d3.extent(years))
    .range([chartTransformX, SVG_CONTAINER_WIDTH - SVG_CONTAINER_PADDING])

const yScale = d3.scaleBand()
    .domain(months)
    .range([SVG_CONTAINER_PADDING, CHART_HEIGHT + SVG_CONTAINER_PADDING])

const legendScale = d3.scaleBand()
    .domain(temperaturePoints)
    .range([chartTransformX, chartTransformX + LEGEND_WIDTH])
    .paddingInner(0)
    .paddingOuter(0.5)
    .align(0.5)

const xAxis = d3.axisBottom(xScale).ticks(20)
const yAxis = d3.axisLeft(yScale)
const legendAxis = d3.axisBottom(legendScale)

svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${CHART_HEIGHT + SVG_CONTAINER_PADDING})`)
    .call(xAxis)

svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${chartTransformX}, 0)`)
    .call(yAxis)

const legend = svg.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(0,${SVG_CONTAINER_HEIGHT - LEGEND_HEIGHT})`)
    .call(legendAxis)

svg.append('text')
    .attr('font-size', 12)
    .attr('transform', `translate(${XAXIS_TITLE_WIDTH / 2},${CHART_HEIGHT / 2})rotate(-90)`)
    .text('Months')

const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff');

// Create data rectangles
svg.selectAll('rect')
    .data(dataset.monthlyVariance)
    .enter()
    .append('rect')
    .attr('width', () => CHART_WIDTH / getYearsAmount(dataset.monthlyVariance.map((d) => d.year)))
    .attr('height', () => CHART_HEIGHT / 12)
    .style('fill', (d) => getHitMapColor(decimalAdjust('round',dataset.baseTemperature + d.variance, -1)))
    .attr('x', (d) => xScale(new Date(`${d.year}`)))
    .attr('y', (d) => yScale(getLongMonthName(d.month)))
    .attr('data-temp', (d) => `${dataset.baseTemperature + d.variance}`)
    .attr('data-year', (d) =>`${d.year}`)
    .attr('data-month', (d) => `${d.month - 1}`)
    .attr('class', 'cell')
    .on('mouseover', function (this: SVGRectElement, _, d) {
        tooltip.html(
            `<div class="tooltip-text">
    ${d.year} - ${getLongMonthName(d.month)}
    <br/>
    ${decimalAdjust('round',dataset.baseTemperature + d.variance, -1)} ℃
    <br/>
    ${decimalAdjust('round', d.variance, -1)} ℃
    </div>`
        )
            .style('visibility', 'visible')
            .attr('id', 'tooltip')
            .attr('data-year', `${d.year}`)
    })
    .on('mouseout', () => {
        tooltip.style('visibility', 'hidden')
            .html('')
    })
    .on('mousemove', (e) => {
        tooltip
            .style('top', `${e.pageY + 10}px`)
            .style('left', `${e.pageX + 10}px`)
    })

legend
    .selectAll('rect')
    .data(legendRectanglesValues)
    .enter()
    .append('rect')
    .attr('width', LEGEND_SECTOR_WIDTH)
    .attr('height', LEGEND_SECTOR_HEIGHT)
    .attr('x', (_, i) => chartTransformX + LEGEND_SECTOR_WIDTH * (i + 1))
    .attr('transform', `translate(0, -${LEGEND_SECTOR_HEIGHT})`)
    .attr('fill', (d) => getHitMapColor(Number(d)))
    .attr('stroke','black')
