import getQuarter from "./utils/getQuarter";
import dataset from './dataset/dataset.json'
import * as d3 from "d3";
import './main.css'

const CHART_WIDTH = 900
const CHART_HEIGHT = 460
const CHART_PADDING = 60
const BAR_GAP = 0.5
const data = dataset.data
const dates: Date[] = dataset.data.map((d) => new Date(d[0]))

const xScale = d3
  .scaleTime()
  .domain(d3.extent(dates))
  .range([CHART_PADDING, CHART_WIDTH - CHART_PADDING])

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d[1] as number)])
  .range([CHART_HEIGHT - CHART_PADDING, CHART_PADDING])

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)

const svg = d3
  .select('#root')
  .append('svg')
  .attr('width', CHART_WIDTH)
  .attr('height', CHART_HEIGHT)

const tooltip = d3
  .select('body')
  .append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('padding', '10px')
  .style('background', 'rgba(0,0,0,0.6)')
  .style('border-radius', '4px')
  .style('color', '#fff');

svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('width', (_) => CHART_WIDTH / data.length - BAR_GAP)
  .attr('height', (d) => yScale(0) - yScale(Number(d[1]))
  )
  .attr('data-date', (d) => d[0])
  .attr('data-gdp', (d) => d[1])
  .attr('y', (d) => yScale(Number(d[1])))
  .attr('x', (d) => xScale(new Date(d[0])))
  .on('mouseover', function (this: SVGRectElement, _, d: (string | number)[]) {
    const date = new Date(d[0])
    const quarter = getQuarter(date)
    const year = date.getFullYear()
    tooltip
      .html(`<div>${year} Q${quarter} - $${d[1]} Billion</div>`)
      .attr('id', 'tooltip')
      .attr('data-date', d[0])
      .style('visibility', 'visible');
  })
  .on('mouseout', function (){
    tooltip.html(``).style('visibility', 'hidden');
  })
  .on('mousemove', function (e) {
    tooltip
      .style('top', e.pageY + 10 + 'px')
      .style('left', e.pageX + 10 + 'px');
  })

svg
  .append('g')
  .attr("transform", `translate(0, ${CHART_HEIGHT - CHART_PADDING})`)
  .attr('id', 'x-axis')
  .call(xAxis)

svg
  .append('g')
  .attr("transform", "translate(60, 0)")
  .attr('id', 'y-axis')
  .call(yAxis)


console.log('here')
