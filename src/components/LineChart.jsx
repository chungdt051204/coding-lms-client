import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register({
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
});
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thống kê doanh thu trong 7 ngày gần nhất",
    },
  },
};
const LineChart = ({ array }) => {
  const labels = array?.map((value) => {
    return value?._id;
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu",
        data: array?.map((value) => {
          return value.revenue;
        }),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.2, // <-- độ cong
      },
    ],
  };
  return (
    <>
      <Line options={options} data={data}></Line>
    </>
  );
};
export default LineChart;
