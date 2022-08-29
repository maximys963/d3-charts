import * as d3 from 'd3'

import getCategoryColor from "./utlis/getCategoryColor";

import './main.css'

import kickstarterDS from './dataset/kickstarter-funding-data.json'
import movieDS from './dataset/movie-data.json'
import videoGamesDS from './dataset/video-game-sales-data.json'

console.log('kickstarterDS', kickstarterDS)
console.log('movieDS', movieDS)
console.log('videoGamesDS', videoGamesDS)

interface DataSource {
    name: string
    children: {
        name: string
        children: {
            name: string
            category: string
            value: string
        }[]
    }[]
}

const SVG_CANVAS_WIDTH = 1200
const SVG_CANVAS_HEIGHT = 570

const LEGEND_BOX_SIZE = 20
const LEGEND_SPACING = 10

const CHART_PADDING = 10

const svg = d3.select('#root').append('svg')
    .attr('width', SVG_CANVAS_WIDTH)
    .attr('height', SVG_CANVAS_HEIGHT)

// @ts-ignore
const hierarchy = d3.hierarchy(movieDS, (node) => node.children)
    // @ts-ignore
    .sum((node) => node.value)
    // @ts-ignore
    .sort((node1, node2) => {
        return node2.value - node1.value
})

const createTreemap = d3.treemap().size([960, 570])

const movieTitles = hierarchy.leaves()

// @ts-ignore
const filmTypes = hierarchy.data.children.map((film) => film.name)

createTreemap(hierarchy)

const block = svg.selectAll('g')
    .data(movieTitles)
    .enter()
    .append('g')
    .attr('transform', (movie) => {
        // @ts-ignore
        return `translate(${movie['x0']},${movie['y0']})`
    })

const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')

block.append('rect')
    .attr('class', 'tile')
    // @ts-ignore
    .attr('fill', (movie) => getCategoryColor(movie.data.category))
    .attr('data-name', (movie) => movie.data.name)
    // @ts-ignore
    .attr('data-category', (movie) => movie.data.category)
    // @ts-ignore
    .attr('data-value', (movie) => movie.data.value)
    // @ts-ignore
    .attr('width', (movie) => movie['x1'] - movie['x0'])
    // @ts-ignore
    .attr('height', (movie) => movie['y1'] - movie['y0'])
    .attr('stroke', 'white')
    .on('mouseover', function (this: SVGRectElement, _, d) {
        // @ts-ignore
        tooltip.html(`<div class="tooltip-text"><div>Name: ${d.data.name}</div></div>`
        )
            .style('visibility', 'visible')
            .attr('id', 'tooltip')
            // @ts-ignore
            .attr('data-value', `${d.value}`)
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

block.append('text')
    .text((movie) => movie.data.name)
    .attr('x', 5)
    .attr('y', 20)
    .attr('font-size', 10)


const legendGroup = svg.append('svg')
    .attr('id', 'legend')
    .selectAll('.legend-item')
    .data(filmTypes)
    .enter()

legendGroup.append('rect')
    .attr('class', 'legend-item')
    .style('fill', d => getCategoryColor(d))
    .attr('y', (_, i) => {
        const legendGroupHeight = LEGEND_BOX_SIZE + LEGEND_SPACING
        const verticalChartCenter = (CHART_PADDING * 2 + SVG_CANVAS_HEIGHT) / 2

        return verticalChartCenter + legendGroupHeight * i
    })
    .attr('x', (_, i) => SVG_CANVAS_WIDTH - LEGEND_BOX_SIZE)
    .attr('width', LEGEND_BOX_SIZE)
    .attr('height', LEGEND_BOX_SIZE)

legendGroup.append('text')
    .attr('class', 'legend_text')
    .attr('y', (_, i) => {
        const legendGroupHeight = LEGEND_BOX_SIZE + LEGEND_SPACING
        const verticalChartCenter = (CHART_PADDING * 2 + SVG_CANVAS_HEIGHT) / 2

        return verticalChartCenter + legendGroupHeight * i + (LEGEND_BOX_SIZE + LEGEND_SPACING) / 2
    })
    .text((d) => d)
    .attr('x', function () {
        const textLength = this.getComputedTextLength()
        return SVG_CANVAS_WIDTH - LEGEND_BOX_SIZE - LEGEND_SPACING - textLength
    })

console.log('hierarchy', hierarchy)

