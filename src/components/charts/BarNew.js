import React, {useState, useEffect, useRef} from "react";
import ChartComponent, { Chart } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { barChartOptions } from "./config";
Chart.plugins.register(ChartDataLabels);

const BarNew = ({shadow, data}) => {

    const chart_instance = useRef();

    if (shadow) {
        Chart.defaults.barWithShadow = Chart.defaults.bar;
        Chart.controllers.barWithShadow = Chart.controllers.bar.extend({
          draw: function(ease) {
            Chart.controllers.bar.prototype.draw.call(this, ease);
            var ctx = this.chart.ctx;
            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.2)";
            ctx.shadowBlur = 7;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 7;
            ctx.responsive = true;
            Chart.controllers.bar.prototype.draw.apply(this, arguments);
            ctx.restore();
          }
        });
    }

    return (
      <ChartComponent
        ref={chart_instance}
        type={shadow ? "barWithShadow" : "bar"}
        options={{
          ...barChartOptions
        }}
        data={data}
      />
    );
}

export default BarNew;
