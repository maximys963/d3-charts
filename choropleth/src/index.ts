import * as d3 from 'd3'
import * as topojson from 'topojson';

import Legend from "./components/Legend";

import eductionDS from './dataset/educationDS.json'
import countiesDS from './dataset/countiesDS.json'

import './main.css'
import getCountyColor from "./utlis/getCountyColor";

const SVG_CANVAS_HEIGHT = 600
const SVG_CANVAS_WIDTH = 960

const legendRectanglesValues = ['3', '12', '21', '30', '39', '48', '57']
const legendRectanglesPoints = ['3', '12', '21', '30', '39', '48', '57', '66']

const LEGEND_WIDTH = 350
const LEGEND_HEIGHT = 21
const LEGEND_LEFT_PADDING = 50

// @ts-ignore
const countyData = topojson.feature(countiesDS, countiesDS.objects.counties).features

const mergedCountyData = countyData.map((county: { id: number }) => {
    const additionalDetails = eductionDS.find((educationItem) => educationItem.fips === county.id)

    return {
        ...county,
        area_name: additionalDetails.area_name,
        bachelorsOrHigher: additionalDetails.bachelorsOrHigher,
        state: additionalDetails.state
    }
})

console.log('mergedCountyData', mergedCountyData)

const svg = d3.select('#root')
    .append('svg')
    .attr('width', SVG_CANVAS_WIDTH)
    .attr('height', SVG_CANVAS_HEIGHT)

const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')


// @ts-ignore
svg.selectAll('path')
    .data(mergedCountyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (d) => {
        // @ts-ignore
        return getCountyColor(d.bachelorsOrHigher)
    })
    // @ts-ignore
    .attr('data-fips', (d) => d.id)
    // @ts-ignore
    .attr('data-education', (d) => d.bachelorsOrHigher)
    .on('mouseover', function (this: SVGRectElement, _, d) {
        // @ts-ignore
        tooltip.html(`<div class="tooltip-text"><div>${d.area_name}: ${d.state} - ${d.bachelorsOrHigher}%</div></div>`
        )
            .style('visibility', 'visible')
            .attr('id', 'tooltip')
            // @ts-ignore
            .attr('data-education', `${d.bachelorsOrHigher}`)
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

Legend.draw(svg, {
    id: 'legend',
    translate: {
        x: SVG_CANVAS_WIDTH - LEGEND_WIDTH - LEGEND_LEFT_PADDING,
        y: LEGEND_HEIGHT
    },
    height: LEGEND_HEIGHT,
    width: LEGEND_WIDTH,
    values: legendRectanglesValues,
    points: legendRectanglesPoints
})



