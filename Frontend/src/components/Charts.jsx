import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import Loader from "./Loader";

export const ChartSectionCard = ({
  title = "",
  margin = "0px 0px 20px 0px",
  style = {},
  chartType: Chart,
  ChartData = [],
  contentStyle = {},
  loading = false,
}) => {
  return (
    <div style={{ margin, ...style }} className="dashboard-chart-card">
      <div className="dashboard-chart-card-header">
        {title && <h3 className="doctor-details-section-title">{title}</h3>}
      </div>
      <div style={contentStyle} className="chart-content-cotainer">
        {loading ? (
          <Loader style={{ height: "300px" }} />
        ) : (
          <Chart Data={ChartData} />
        )}
      </div>
    </div>
  );
};

export const DoubleAreaChart = ({ Data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={Data}>
        <defs>
          <linearGradient id="patientsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0da2e7" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#0da2e78f" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="doctorsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c29b" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#00c29b24" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fill: "#6B7280" }} tickMargin={10} />
        <YAxis tick={{ fill: "#6B7280" }} />

        <Tooltip
          formatter={(value, name) => {
            const displayValue = value || 0;
            if (name === "Doctors") return [displayValue, "Doctors Arrival"];
            if (name === "Patients") return [displayValue, "Patients Arrival"];
            return [displayValue, name];
          }}
          contentStyle={{
            fontWeight: 600,
            borderRadius: 8,
            border: "1px solid #00000011",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />

        <Legend wrapperStyle={{ paddingTop: 20 }} />

        <Area
          type="monotone"
          dataKey="Patients"
          name="Patients"
          stroke="#0da2e7"
          strokeWidth={3}
          fill="url(#patientsGradient)"
          dot={false}
          activeDot={{ r: 6 }}
        />

        <Area
          type="monotone"
          dataKey="Doctors"
          name="Doctors"
          stroke="#00c29b"
          strokeWidth={3}
          fill="url(#doctorsGradient)"
          dot={false}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const SingleAreaChart = ({ Data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={Data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a286" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#16a286d0" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" tick={{ fill: "#6B7280" }} tickMargin={10} />

        <YAxis tick={{ fill: "#6B7280" }} />

        <Tooltip
          formatter={(value) => [`Rs ${value.toLocaleString()}`, "Revenue"]}
          contentStyle={{
            fontWeight: 600,
            borderRadius: 12,
            border: "1px solid #00000011",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#16a286"
          strokeWidth={3}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const DoubleBarChart = ({ Data }) => {
  return (
    <ResponsiveContainer width="100%" height={295}>
      <BarChart data={Data} barGap={6} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" tick={{ fill: "#6B7280" }} tickMargin={10} />

        <YAxis tick={{ fill: "#6B7280" }} />

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            fontWeight: 600,
          }}
          formatter={(value, name) => {
            if (name === "appointments") {
              return [value, "appointments"];
            }
            if (name === "completed") {
              return [value, "completed"];
            }
            return [value, name];
          }}
        />

        <Legend
          wrapperStyle={{
            paddingTop: 20,
          }}
        />

        <Bar
          dataKey="appointments"
          name="appointments"
          fill="#1F9D84"
          radius={[6, 6, 0, 0]}
          barSize={25}
        />

        <Bar
          dataKey="completed"
          name="completed"
          fill="#43C59E"
          radius={[6, 6, 0, 0]}
          barSize={25}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
