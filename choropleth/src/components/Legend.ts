import * as d3 from 'd3'
import getCountyColor from "../utlis/getCountyColor";

const LEGEND_SECTOR_HEIGHT = 10

class Legend {
    public static draw = (root: d3.Selection<SVGElement, unknown, HTMLElement, any>, config: {
        id: string,
        translate: {
            x: number
            y: number
        },
        height: number,
        width: number
        values: string[]
        points: string[]
    }) => {
        const legendSectorWidth = config.width / (config.points.length + 1)

        const legendScale = d3.scaleBand()
            .domain(config.points)
            .range([0, config.width])
            .paddingInner(0)
            .paddingOuter(0.5)
            .align(0.5)

        const legendAxis = d3
            .axisBottom(legendScale)
            .tickSize(18)
            .tickFormat((d) => `${d}%`)

        const legend = root.append('g')
            .attr('id', 'legend')
            .attr('transform', `translate(${config.translate.x}, ${config.translate.y})`)

        legend
            .selectAll('rect')
            .data(config.values)
            .enter()
            .append('rect')
            .attr('width', legendSectorWidth)
            .attr('height', LEGEND_SECTOR_HEIGHT)
            .attr('transform', (_, i) => {
                return `translate(${legendSectorWidth * (i + 1)}, 0)`
            })
            .attr('fill', (d) => getCountyColor(Number(d)))

        legend
            .call(legendAxis)
            .call(g => g.select(".domain").remove())
    }

}

export default Legend