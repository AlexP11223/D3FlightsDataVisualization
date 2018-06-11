class SvgChart {
    constructor(data, svg) {
        this.data = data;
        this.svg = svg;
    }
}

class BarChart extends SvgChart{
    constructor(data, svg) {
        super(data, svg)
    }

    draw() {
        const svg = this.svg;
        const data = this.data;

        const width = Number(svg.attr('width'));
        const height = Number(svg.attr('height'));
        const margin = ({top: 20, right: 0, bottom: 30, left: 40});

        const x = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickSizeOuter(0));

        const yAxis = g => g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(-width, 0, 0))
            .call(g => g.select(".domain").remove());

        svg.append('g')
            .attr('fill', 'steelblue')
            .selectAll('rect')
            .data(data).enter().append('rect')
            .attr('x', d => x(d.name))
            .attr('y', d => y(d.value))
            .attr('height', d => y(0) - y(d.value))
            .attr('width', x.bandwidth());

        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);
    }
}

class DatesLineChart extends SvgChart{
    constructor(data, svg) {
        super(data, svg)
    }

    draw() {
        const svg = this.svg;
        const data = this.data;

        const width = Number(svg.attr('width'));
        const height = Number(svg.attr('height'));
        const margin = ({top: 20, right: 0, bottom: 30, left: 40});

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([10000, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = g => g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(-width, 0, 0))
            .call(g => g.select(".domain").remove());

        const line = d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d.date))
            .y(d => y(d.value));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        const tooltip = svg.append("g")
            .attr("class", "plot-tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("rx", 10)
            .attr("width", 210)
            .attr("height", 70)
            .attr("ry", 10);
        tooltip.append("text")
            .attr("data-line", 1)
            .attr("x", 10)
            .attr("y", 20)
            .attr("dy", ".31em");
        tooltip.append("text")
            .attr("data-line", 2)
            .attr("x", 10)
            .attr("y", 40)
            .attr("dy", ".31em");

        const focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 7.5);

        function mouseMove() {
            const bisectDate = d3.bisector(d => d.date).right;
            const mousePos = d3.mouse(svg.node());
            const x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", `translate(${x(d.date)}, ${y(d.value)})`);
            tooltip.attr("transform", `translate(${mousePos[0] + (mousePos[0] > 230 ? -230 : 10)}, ${mousePos[1]})`);
            tooltip.select('text[data-line="1"]').text(`${dateWithWeekday(d.date)}`);
            tooltip.select('text[data-line="2"]').text(`${d.value} flights`);
            focus.select(".x-hover-line").attr("y2", height - y(d.value));
            focus.select(".y-hover-line").attr("x2", width + width);
        }

        svg
            .on("mouseover", () => {
                focus.style("display", null);
                tooltip.style("display", null);
            })
            .on("mouseout", () => {
                focus.style("display", "none");
                tooltip.style("display", "none");
            })
            .on("mousemove", mouseMove);
    }
}