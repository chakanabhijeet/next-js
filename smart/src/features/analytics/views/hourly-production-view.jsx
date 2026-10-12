"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Factory } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useHourlyProductionViewModel } from "@/features/analytics/view-models/use-hourly-production-view-model";

const COLOR_ON_TARGET = "#10b981"; // emerald-500 (green)
const COLOR_BELOW_TARGET = "#ef4444"; // red-500

const chartConfig = {
  production: {
    label: "Production",
    color: COLOR_ON_TARGET,
  },
};

function MiniStat({ label, value, hint, valueClass = "text-slate-900" }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className={`mt-0.5 text-xl font-bold ${valueClass}`}>{value}</p>
      {hint && <p className="truncate text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function MachineHourlyCard({ data, summary }) {
  const targetMet = summary.total >= summary.targetTotal;
  const statusClass = targetMet ? "text-emerald-600" : "text-red-600";

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
            <Factory className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-lg font-bold text-slate-900">
              {data.machine}
            </CardTitle>
            <CardDescription>
              Shift {data.shift} · {data.shiftHours}
            </CardDescription>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            targetMet
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              targetMet ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {targetMet ? "TARGET MET" : "BELOW TARGET"}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat
            label="Production"
            value={summary.total}
            hint={`Target ${summary.targetTotal}`}
            valueClass={statusClass}
          />
          <MiniStat
            label="Achieved"
            value={`${summary.achievement.toFixed(1)}%`}
            hint={`Avg ${summary.average.toFixed(1)} / hr`}
            valueClass={statusClass}
          />
          <MiniStat
            label="Best Hour"
            value={summary.best.production}
            hint={summary.best.hour}
          />
          <MiniStat
            label="Lowest Hour"
            value={summary.lowest.production}
            hint={summary.lowest.hour}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR_ON_TARGET }}
            />
            Target met
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR_BELOW_TARGET }}
            />
            Below target
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-slate-400" />
            Target ({data.targetPerHour}/hr)
          </span>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={data.hours}
            margin={{ top: 24, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, (max) => Math.ceil((max + 5) / 5) * 5]}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(100, 116, 139, 0.08)" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `${label} hrs`}
                />
              }
            />
            <ReferenceLine
              y={data.targetPerHour}
              stroke="#94a3b8"
              strokeDasharray="6 4"
            />
            <Bar dataKey="production" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.hours.map((item) => (
                <Cell
                  key={item.hour}
                  fill={
                    item.production >= data.targetPerHour
                      ? COLOR_ON_TARGET
                      : COLOR_BELOW_TARGET
                  }
                />
              ))}
              <LabelList
                dataKey="production"
                position="top"
                offset={8}
                className="fill-slate-700 text-xs font-semibold"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function HourlyProductionView() {
  const { machines } = useHourlyProductionViewModel();

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
      {machines.map(({ data, summary }) => (
        <MachineHourlyCard key={data.id} data={data} summary={summary} />
      ))}
    </div>
  );
}