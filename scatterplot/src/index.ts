import dataset from './dataset/dataset.json'
import * as d3 from "d3";

import getDotColor from "./utlis/getDotColor";

import './main.css'

const CHART_WIDTH = 920
const CHART_HEIGHT = 630
const CHART_PADDING = 60
const RADIUS = 6

const LEGEND_BOX_SIZE = 18
const LEGEND_SPACING = 5

const legendData = [
  {
    label: 'No doping',
    color: '#0be881'
  },
  {
    label: 'Riders with doping allegations',
    color: '#575fcf'
  }
]

const minutesFormat = d3.timeFormat('%M:%S')

const years: Date[] = dataset.map(d => new Date(`${d.Year}`))
const seconds: Date[] = dataset.map(d => new Date(1969, 12, 31, 21, 0, d.Seconds))

const datasetWithDates = dataset.map((d) => {
  return {
    year: new Date(`${d.Year}`),
    time: new Date(1969, 12, 31, 21, 0, d.Seconds),
    name: d.Name,
    nationality: d.Nationality,
    place: d.Place,
    doping: d.Doping,
    label: {
      time: d.Time,
      year: d.Year
    }
  }
})

const xScale = d3.scaleTime()
  .domain(d3.extent(years))
  .range([CHART_PADDING, CHART_WIDTH - CHART_PADDING])

const yScale = d3.scaleTime()
  .domain(d3.extent(seconds))
  .range([CHART_PADDING, CHART_HEIGHT - CHART_PADDING])

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)

const svg = d3.select('#root')
  .append('svg')
  .attr('height', CHART_HEIGHT)
  .attr('width', CHART_WIDTH)

svg.append('g')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${CHART_HEIGHT - CHART_PADDING})`)
  .call(xAxis)

svg.append('g')
  .attr('id', 'y-axis')
  .attr('transform', `translate(${CHART_PADDING}, 0)`)
  .call(yAxis.tickFormat(minutesFormat))

const tooltip = d3.select('body')
  .append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('padding', '10px')
  .style('background', 'rgba(0,0,0,0.6)')
  .style('border-radius', '4px')
  .style('color', '#fff');

svg.selectAll('circle')
  .data(datasetWithDates)
  .enter()
  .append('circle')
  .attr('cx', (d) => xScale(d.year))
  .attr('data-xvalue', (d) => d.label.year)
  .attr('class', 'dot')
  .attr('cy', (d) => yScale(d.time))
  .attr('data-yvalue', (d) => d.time as unknown as string)
  .attr('r', RADIUS)
  .style('fill', d => getDotColor(d.doping))
  .on('mouseover', function (this: SVGCircleElement, _, d) {
    tooltip.html(
      `<div class="tooltip-text">
    ${d.name}: ${d.nationality}
    <br/>
    Year: ${d.label.year}, Time: ${d.label.time}
    <br/>
    ${d.doping && `<br/>`}
    ${d.doping}
    </div>`
    )
      .style('visibility', 'visible')
      .attr('id', 'tooltip')
      .attr('data-year', d.label.year)
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

const legendGroup = svg.append('g')
  .attr('id', 'legend')
  .selectAll('.legend_item')
  .data(legendData)
  .enter()
  .append('g')

legendGroup.append('text')
  .attr('class', 'legend_text')
  .attr('y', (_, i) => {
    const legendGroupHeight = LEGEND_BOX_SIZE + LEGEND_SPACING
    const verticalChartCenter = (CHART_PADDING * 2 + CHART_HEIGHT) / 2

    return verticalChartCenter + legendGroupHeight * i + (LEGEND_BOX_SIZE + LEGEND_SPACING) / 2
  })
  .text((d) => d.label)
  .attr('x', function () {
    const textLength = this.getComputedTextLength()
    return CHART_WIDTH - CHART_PADDING - LEGEND_SPACING - textLength
  })

legendGroup.append('rect')
  .style('fill', d => d.color)
  .style('opacity', 0.8)
  .attr('y', (_, i) => {
    const legendGroupHeight = LEGEND_BOX_SIZE + LEGEND_SPACING
    const verticalChartCenter = (CHART_PADDING * 2 + CHART_HEIGHT) / 2

    return verticalChartCenter + legendGroupHeight * i
  })
  .attr('x', (_, i) => CHART_WIDTH - CHART_PADDING)
  .attr('width', LEGEND_BOX_SIZE)
  .attr('height', LEGEND_BOX_SIZE)
