// src/visualizations/criticalPathChart.ts
import * as d3 from "d3";
import { HarEntry, HarLog } from "./types/har-types";

interface EventMarker {
  name: string;
  time: number;
  color: string;
}

/** Classify resource type from MIME type */
function getResourceType(entry: HarEntry): string {
  const mime = entry.response.content.mimeType || "";
  if (mime.includes("text/html")) return "HTML";
  if (mime.includes("text/css")) return "CSS";
  if (mime.includes("javascript")) return "JS";
  if (mime.includes("font")) return "Font";
  if (mime.includes("image")) return "Image";
  return "Other";
}

/** Assign colors for each resource type */
function getColorForType(type: string): string {
  const colors: Record<string, string> = {
    HTML: "#ff7f0e",
    CSS: "#1f77b4",
    JS: "#9467bd",
    Font: "#8c564b",
    Image: "#2ca02c",
    Other: "#7f7f7f",
  };
  return colors[type] || "#7f7f7f";
}

/**
 * Draw a waterfall chart for critical path entries
 * with page event markers and a resource-type legend.
 */
export function drawCriticalPathChart(entries: HarEntry[], log: HarLog) {
  const svg = d3.select("#critical-path");
  svg.selectAll("*").remove(); // clear previous chart

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 60, right: 40, bottom: 40, left: 300 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Compute start & end times
  const start0 = new Date(entries[0].startedDateTime).getTime();
  const bars = entries.map((e) => {
    const start = new Date(e.startedDateTime).getTime() - start0;
    const end = start + e.time;
    const type = getResourceType(e);
    return { ...e, start, end, type };
  });

  // Y scale (each request)
  const y = d3
    .scaleBand()
    .domain(bars.map((d) => d.request.url))
    .range([0, chartHeight])
    .padding(0.1);

  // X scale (time)
  const maxEnd = d3.max(bars, (d) => d.end)!;
  const x = d3.scaleLinear().domain([0, maxEnd * 1.1]).range([0, chartWidth]);

  // Bars
  g.selectAll(".bar")
    .data(bars)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => y(d.request.url)!)
    .attr("x", (d) => x(d.start))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d.end - d.start))
    .attr("fill", (d) => getColorForType(d.type));

  // Labels
  g.selectAll(".label")
    .data(bars)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("y", (d) => y(d.request.url)! + y.bandwidth() / 1.5)
    .attr("x", (d) => x(d.start) - 10)
    .attr("text-anchor", "end")
    .attr("font-size", "12px")
    .text((d) => d.request.url.split("/").pop() || d.request.url);

  // --- 📍 Add Page Event Markers ---
  const page = log.pages?.[0];
  const events: EventMarker[] = [];

  if (page?.pageTimings) {
    const { onContentLoad, onLoad } = page.pageTimings;
    if (onContentLoad >= 0)
      events.push({ name: "DOMContentLoaded", time: onContentLoad, color: "#2ca02c" });
    if (onLoad >= 0)
      events.push({ name: "onLoad", time: onLoad, color: "#d62728" });
  }

  const perf = (page as any)?._performance || (page as any)?._chromePerformance || {};
  if (perf.firstPaint)
    events.push({ name: "First Paint", time: perf.firstPaint, color: "#9467bd" });
  if (perf.largestContentfulPaint)
    events.push({ name: "LCP", time: perf.largestContentfulPaint, color: "#8c564b" });

  // Draw event lines
  g.selectAll(".event-line")
    .data(events)
    .enter()
    .append("line")
    .attr("class", "event-line")
    .attr("x1", (d) => x(d.time))
    .attr("x2", (d) => x(d.time))
    .attr("y1", 0)
    .attr("y2", chartHeight)
    .attr("stroke", (d) => d.color)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4 2");

  // Event labels
  g.selectAll(".event-label")
    .data(events)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", (d) => x(d.time) + 5)
    .attr("y", -10)
    .attr("fill", (d) => d.color)
    .style("font-size", "12px")
    .text((d) => d.name);

  // X-axis
  const xAxis = d3.axisBottom(x).ticks(10).tickFormat((d) => `${d} ms`);
  g.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis);

  // Title
  svg
    .append("text")
    .attr("x", margin.left + chartWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "16px")
    .text("Critical Path Waterfall by Resource Type");

  // --- 🗂️ Legend ---
  const legendItems = ["HTML", "CSS", "JS", "Font", "Image", "Other"];
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${margin.left}, ${margin.top - 25})`);

  legendItems.forEach((type, i) => {
    const xPos = i * 100;
    legend
      .append("rect")
      .attr("x", xPos)
      .attr("y", -20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", getColorForType(type));
    legend
      .append("text")
      .attr("x", xPos + 20)
      .attr("y", -8)
      .attr("font-size", "12px")
      .text(type);
  });
}
