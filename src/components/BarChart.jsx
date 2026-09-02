import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register({
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
});

const BarChart = ({ labels, label1, data1 }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: label1,
        data: data1,
        backgroundColor: "#3b82f6",
      },
    ],
  };
  return (
    <>
      <Bar options={options} data={data}></Bar>
    </>
  );
};
export default BarChart;
