/* eslint-disable prefer-rest-params */
import React, { useRef } from 'react';
import ChartComponent, { Chart } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { polarAreaChartOptions } from './config';
Chart.plugins.register(ChartDataLabels);

const PolarArea = ({ data, shadow = false, addOptions }) => {
    const chart_instance = useRef();

    if (shadow) {
        Chart.defaults.polarWithShadow = Chart.defaults.polarArea;
        Chart.controllers.polarWithShadow = Chart.controllers.polarArea.extend({
        draw(ease) {
            Chart.controllers.radar.prototype.draw.call(this, ease);
            const {
            chart: { ctx },
            } = this;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 7;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 7;
            ctx.responsive = true;
            Chart.controllers.radar.prototype.draw.apply(this, arguments);
            ctx.restore();
        },
        });
    }

    return (
        <ChartComponent
            ref={chart_instance}
            type={"polarArea"}
            options={{
                ...polarAreaChartOptions,
                ...addOptions
            }}
            data={data}
        />
    );
};

export default PolarArea;
